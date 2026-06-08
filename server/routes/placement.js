import crypto from 'crypto';
import { Router } from 'express';
import multer from 'multer';
import { buildInitialQueue, chooseNextQuestion } from '../../src/data/adaptivePlacement.js';
import { audit, createToken, loadDb, mutateDb } from '../services/store.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();
const upload = multer({
  dest: process.env.LOCAL_UPLOAD_DIR || 'server/uploads',
  limits: { fileSize: Number(process.env.MAX_UPLOAD_MB || 10) * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, new Set(['audio/webm', 'audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/ogg']).has(file.mimetype))
});
const attempts = new Map();

function now() { return new Date().toISOString(); }
function tokenHash(token) { return crypto.createHash('sha256').update(token).digest('hex'); }
function normalizeCode(value) { return String(value || '').trim().toUpperCase(); }
function publicError(res, status = 401) { return res.status(status).json({ code: 'CODE_UNAVAILABLE', message: 'This code cannot be used. Please contact English Taxo.' }); }
function ensurePlacement(db) { db.placementCodes ||= []; db.placementSessions ||= []; db.placementAnswers ||= []; db.speakingRecordings ||= []; db.placementResults ||= []; db.adminOverrides ||= []; }
function courseKey(value = '') { const text = value.toLowerCase(); if (text.includes('phonic')) return 'phonics'; if (text.includes('kid')) return 'kids'; return 'general'; }
function throttle(req, res, next) {
  const key = req.ip || req.socket?.remoteAddress || 'unknown';
  const current = attempts.get(key) || { count: 0, resetAt: Date.now() + 10 * 60 * 1000 };
  if (Date.now() > current.resetAt) { current.count = 0; current.resetAt = Date.now() + 10 * 60 * 1000; }
  current.count += 1; attempts.set(key, current);
  if (current.count > 20) return res.status(429).json({ message: 'Please wait before trying again.' });
  next();
}
async function sessionFor(token) {
  if (!token) return null;
  const db = await loadDb(); ensurePlacement(db);
  const session = db.placementSessions.find((item) => item.tokenHash === tokenHash(token));
  if (!session) return null;
  const code = db.placementCodes.find((item) => item.accessCode === session.accessCode);
  return { db, session, code };
}
function sessionPayload(db, session, code) {
  const answers = db.placementAnswers.filter((item) => item.sessionId === session.id);
  return { queue: session.queue, position: session.position || 0, answers, completed: session.status === 'completed', showResult: Boolean(code.showResultToStudent), result: code.finalRecommendation || null };
}

router.post('/verify', throttle, async (req, res) => {
  const accessCode = normalizeCode(req.body?.accessCode);
  if (!/^PT-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(accessCode)) return publicError(res);
  const db = await loadDb(); ensurePlacement(db);
  const code = db.placementCodes.find((item) => item.accessCode === accessCode);
  const expired = code?.expiredAt && new Date(code.expiredAt).getTime() <= Date.now();
  if (!code || expired || ['expired', 'disposed'].includes(code.status)) return publicError(res);
  if (code.status === 'completed' && !code.allowRetake) return publicError(res, 409);
  let session = db.placementSessions.find((item) => item.accessCode === accessCode && item.status !== 'completed');
  let token;
  if (!session) {
    token = createToken();
    session = { id: crypto.randomUUID(), accessCode, tokenHash: tokenHash(token), status: 'opened', course: courseKey(code.courseRequested), queue: [], position: 0, createdAt: now(), updatedAt: now() };
    await mutateDb((stored) => { ensurePlacement(stored); stored.placementSessions.push(session); const storedCode = stored.placementCodes.find((item) => item.accessCode === accessCode); storedCode.status = 'opened'; storedCode.openedAt ||= now(); return session; });
  } else {
    token = createToken();
    session.tokenHash = tokenHash(token); session.updatedAt = now();
    await mutateDb((stored) => { ensurePlacement(stored); const target = stored.placementSessions.find((item) => item.id === session.id); target.tokenHash = session.tokenHash; target.updatedAt = session.updatedAt; return target; });
  }
  res.json({ sessionToken: token, student: { name: code.studentName, age: code.age, parentPhone: code.parentPhone, country: code.country, course: session.course, courseLabel: code.courseRequested }, videoUrl: code.videoUrl || '', ...sessionPayload(db, session, code) });
});

router.post('/start', async (req, res) => {
  const found = await sessionFor(req.body?.sessionToken);
  if (!found?.code || ['expired', 'disposed'].includes(found.code.status)) return publicError(res);
  const { session, code } = found;
  if (session.status === 'completed' && !code.allowRetake) return publicError(res, 409);
  const queue = session.queue?.length ? session.queue : buildInitialQueue(session.course);
  await mutateDb((db) => { ensurePlacement(db); const target = db.placementSessions.find((item) => item.id === session.id); target.queue = queue; target.status = 'in_progress'; target.startedAt ||= now(); target.updatedAt = now(); const storedCode = db.placementCodes.find((item) => item.accessCode === session.accessCode); storedCode.status = 'in_progress'; return target; });
  res.json({ ...sessionPayload(found.db, { ...session, queue, status: 'in_progress' }, code), queue });
});

router.post('/answer', async (req, res) => {
  const found = await sessionFor(req.body?.sessionToken);
  if (!found?.code || found.session.status === 'completed' || ['expired', 'disposed'].includes(found.code.status)) return publicError(res, 409);
  const answerInput = req.body?.answer || {};
  const question = found.session.queue?.find((item) => item.id === answerInput.questionId);
  if (!question) return res.status(400).json({ message: 'Question is not available for this session.' });
  const duplicate = found.db.placementAnswers.find((item) => item.sessionId === found.session.id && item.questionId === question.id);
  if (duplicate) return res.status(409).json({ message: 'This answer was already submitted.' });
  const answer = { id: crypto.randomUUID(), sessionId: found.session.id, accessCode: found.session.accessCode, questionId: question.id, questionText: question.prompt, selectedAnswer: answerInput.selectedAnswer || null, recordingId: answerInput.recordingId || null, skill: question.skill, difficulty: question.difficulty, createdAt: now() };
  const answers = [...found.db.placementAnswers.filter((item) => item.sessionId === found.session.id), answer];
  const gatewayStop = question.id === 'phonics-gateway' && answer.selectedAnswer === 'No';
  const assessment = { confidence: gatewayStop ? 1 : Math.min(.9, .35 + answers.length * .1), manualReviewRequired: false };
  const nextQuestion = gatewayStop ? null : chooseNextQuestion({ course: found.session.course, queue: found.session.queue, answers, latestAssessment: assessment });
  await mutateDb((db) => { ensurePlacement(db); db.placementAnswers.push(answer); const session = db.placementSessions.find((item) => item.id === found.session.id); session.position = Math.min((session.position || 0) + 1, session.queue.length); session.updatedAt = now(); if (nextQuestion && !session.queue.some((item) => item.id === nextQuestion.id)) session.queue.push(nextQuestion); return answer; });
  res.json({ answer, assessment, nextQuestion, stop: gatewayStop || !nextQuestion, result: gatewayStop ? 'Phonics Zero - cannot read letters' : null, showResult: Boolean(found.code.showResultToStudent) });
});

router.post('/recording', upload.single('recording'), async (req, res) => {
  const found = await sessionFor(req.body?.sessionToken);
  if (!found?.code || found.session.status === 'completed' || ['expired', 'disposed'].includes(found.code.status)) return publicError(res, 409);
  if (!req.file) return res.status(400).json({ message: 'A supported audio recording is required.' });
  const question = found.session.queue?.find((item) => item.id === req.body.questionId);
  if (!question) return res.status(400).json({ message: 'Question is not available for this session.' });
  const recording = { id: crypto.randomUUID(), sessionId: found.session.id, accessCode: found.session.accessCode, questionId: question.id, questionText: question.prompt, url: `/uploads/${req.file.filename}`, mimeType: req.file.mimetype, manualReviewRequired: true, createdAt: now() };
  await mutateDb((db) => { ensurePlacement(db); db.speakingRecordings.push(recording); return recording; });
  res.json({ recordingId: recording.id, url: recording.url });
});

router.post('/complete', async (req, res) => {
  const found = await sessionFor(req.body?.sessionToken);
  if (!found?.code || ['expired', 'disposed'].includes(found.code.status)) return publicError(res, 409);
  if (found.session.status === 'completed') return res.status(409).json({ message: 'This test was already submitted.' });
  const result = await mutateDb((db) => {
    ensurePlacement(db);
    const session = db.placementSessions.find((item) => item.id === found.session.id);
    const code = db.placementCodes.find((item) => item.accessCode === found.session.accessCode);
    session.status = 'completed'; session.completedAt = now(); session.updatedAt = now();
    code.status = 'completed'; code.completedAt = now();
    const record = { id: crypto.randomUUID(), accessCode: code.accessCode, studentName: code.studentName, courseRequested: code.courseRequested, recommendedCourse: code.finalRecommendation || 'Manual Review Needed', recommendedLevel: code.finalRecommendation || 'Manual Review Needed', confidenceScore: null, reason: 'Voice recordings require review.', manualReviewRequired: true, finalStatus: 'needs_review', createdAt: now() };
    db.placementResults.push(record); audit(db, { role: 'public', email: code.accessCode }, 'placement.complete', { resultId: record.id }); return record;
  });
  res.json({ ok: true, result: result.recommendedLevel, showResult: Boolean(found.code.showResultToStudent) });
});

router.use('/admin', requireAuth, requireRole('admin'));
router.get('/admin/codes', async (_req, res) => { const db = await loadDb(); ensurePlacement(db); res.json({ codes: db.placementCodes, results: db.placementResults, recordings: db.speakingRecordings }); });
router.post('/admin/codes', async (req, res) => {
  const code = await mutateDb((db) => { ensurePlacement(db); let accessCode; do { const raw = crypto.randomBytes(6).toString('hex').toUpperCase(); accessCode = `PT-${raw.slice(0, 4)}-${raw.slice(4, 8)}`; } while (db.placementCodes.some((item) => item.accessCode === accessCode)); const record = { accessCode, studentName: req.body.studentName, parentPhone: req.body.parentPhone, age: req.body.age, country: req.body.country || '', courseRequested: req.body.courseRequested, status: 'unused', createdAt: now(), expiredAt: req.body.expiredAt || null, videoUrl: req.body.videoUrl || '', allowRetake: false, showResultToStudent: false, finalRecommendation: '' }; db.placementCodes.push(record); audit(db, req.user, 'placement.code.create', { accessCode }); return record; });
  res.json({ code });
});
router.patch('/admin/codes/:code', async (req, res) => {
  const code = await mutateDb((db) => { ensurePlacement(db); const record = db.placementCodes.find((item) => item.accessCode === normalizeCode(req.params.code)); if (!record) throw new Error('Placement code not found'); const allowed = ['status', 'expiredAt', 'disposedAt', 'allowRetake', 'showResultToStudent', 'finalRecommendation', 'registrationStudentId']; allowed.forEach((key) => { if (key in req.body) record[key] = req.body[key]; }); if (record.status === 'disposed') record.disposedAt ||= now(); audit(db, req.user, 'placement.code.update', { accessCode: record.accessCode, status: record.status }); return record; });
  res.json({ code });
});
router.post('/admin/results/:id/override', async (req, res) => {
  const result = await mutateDb((db) => { ensurePlacement(db); const record = db.placementResults.find((item) => item.id === req.params.id); if (!record) throw new Error('Placement result not found'); const original = record.recommendedLevel; record.recommendedCourse = req.body.recommendedCourse || record.recommendedCourse; record.recommendedLevel = req.body.recommendedLevel || record.recommendedLevel; record.finalStatus = 'reviewed'; record.manualReviewRequired = false; db.adminOverrides.push({ id: crypto.randomUUID(), adminName: req.user.name, accessCode: record.accessCode, studentName: record.studentName, originalRecommendation: original, overriddenRecommendation: record.recommendedLevel, reason: req.body.reason || '', finalStatus: 'reviewed', createdAt: now() }); return record; });
  res.json({ result });
});

export default router;
