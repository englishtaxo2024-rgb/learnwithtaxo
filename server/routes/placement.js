import crypto from 'crypto';
import { Router } from 'express';
import multer from 'multer';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { getProtectedFile, uploadBuffer } from '../services/driveServer.js';
import {
  appendPlatformRecord,
  readPlatformSheet,
  rowValue,
  studentMatches,
  teacherMatches,
  updatePlatformRecord
} from '../services/platformSheets.js';

const router = Router();
const audioUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: Number(process.env.MAX_PLACEMENT_AUDIO_MB || 8) * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, String(file.mimetype || '').startsWith('audio/'))
});

function route(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function now() {
  return new Date().toISOString();
}

function hashCode(value, salt = crypto.randomBytes(16).toString('hex')) {
  return `${salt}:${crypto.scryptSync(String(value), salt, 64).toString('hex')}`;
}

function verifyCode(value, stored) {
  if (!stored?.includes(':')) return false;
  const [salt, expectedHex] = stored.split(':');
  const actual = crypto.scryptSync(String(value), salt, 64);
  const expected = Buffer.from(expectedHex, 'hex');
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function tokenHash(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

async function placementAttempt(codeId, attemptToken) {
  const codes = await readPlatformSheet('Placement_Codes');
  return codes.rows.find((row) =>
    rowValue(row, ['code_id']) === codeId
    && ['opened', 'in_progress'].includes(String(rowValue(row, ['status'])).toLowerCase())
    && rowValue(row, ['attempt_token_hash']) === tokenHash(attemptToken));
}

router.post('/admin/codes', requireAuth, requireRole('admin'), route(async (req, res) => {
  const plainCode = crypto.randomBytes(8).toString('base64url').replace(/[-_]/g, '').slice(0, 10).toUpperCase();
  const record = {
    code_id: `PLC-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
    code_hash: hashCode(plainCode),
    attempt_token_hash: '',
    student_id: req.body.student_id || '',
    student_name: req.body.student_name || '',
    status: 'unused',
    expires_at: req.body.expires_at || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    opened_at: '',
    completed_at: '',
    created_by: req.user.email,
    created_at: now()
  };
  await appendPlatformRecord('Placement_Codes', record);
  res.status(201).json({
    code: plainCode,
    codeId: record.code_id,
    expiresAt: record.expires_at,
    message: 'Copy this code now. Only its hash is stored.'
  });
}));

router.post('/verify', route(async (req, res) => {
  const code = String(req.body.code || '').trim();
  if (!code) return res.status(400).json({ error: 'Private access code is required.' });
  const sheet = await readPlatformSheet('Placement_Codes');
  const record = sheet.rows.find((row) => {
    const status = String(rowValue(row, ['status'])).toLowerCase();
    const expiresAt = Date.parse(rowValue(row, ['expires_at']));
    return status === 'unused'
      && (!expiresAt || expiresAt > Date.now())
      && verifyCode(code, rowValue(row, ['code_hash']));
  });
  if (!record) return res.status(401).json({ error: 'Please check your private access code and try again.' });

  const attemptToken = crypto.randomBytes(32).toString('base64url');
  const updated = {
    ...record,
    attempt_token_hash: tokenHash(attemptToken),
    status: 'opened',
    opened_at: now()
  };
  delete updated._rowNumber;
  await updatePlatformRecord('Placement_Codes', record._rowNumber, updated);
  res.json({
    success: true,
    codeId: rowValue(record, ['code_id']),
    attemptToken,
    language: req.body.language === 'ar' ? 'ar' : 'en'
  });
}));

router.post('/submit', route(async (req, res) => {
  const { codeId, attemptToken } = req.body;
  if (!codeId || !attemptToken) return res.status(400).json({ error: 'Placement attempt credentials are required.' });
  const code = await placementAttempt(codeId, attemptToken);
  if (!code) return res.status(401).json({ error: 'This placement attempt is invalid or already completed.' });

  const result = {
    result_id: `PLR-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
    code_id: codeId,
    student_id: req.body.student_id || rowValue(code, ['student_id']),
    student_name: req.body.student_name || rowValue(code, ['student_name']),
    language: req.body.language === 'ar' ? 'ar' : 'en',
    answers_json: JSON.stringify(req.body.answers || []),
    audio_urls: JSON.stringify(req.body.audio_urls || []),
    score: req.body.score ?? '',
    recommended_course: req.body.recommended_course || '',
    recommended_level: req.body.recommended_level || '',
    status: 'submitted',
    submitted_at: now()
  };
  await appendPlatformRecord('Placement_Results', result);
  const updated = { ...code, status: 'completed', completed_at: now() };
  delete updated._rowNumber;
  await updatePlatformRecord('Placement_Codes', code._rowNumber, updated);
  res.status(201).json({ resultId: result.result_id, status: result.status });
}));

router.post('/audio', audioUpload.single('audio'), route(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'An audio recording is required.' });
  const code = await placementAttempt(req.body.codeId, req.body.attemptToken);
  if (!code) return res.status(401).json({ error: 'This placement attempt is invalid or already completed.' });
  const questionId = String(req.body.questionId || 'speaking').replace(/[^a-zA-Z0-9_-]/g, '');
  const uploaded = await uploadBuffer({
    name: `${rowValue(code, ['code_id'])}-${questionId}-${Date.now()}.webm`,
    buffer: req.file.buffer,
    folderId: process.env.PLACEMENT_AUDIO_FOLDER_ID,
    mimeType: req.file.mimetype || 'audio/webm'
  });
  res.status(201).json({
    fileId: uploaded.id,
    url: `/api/placement/audio/${uploaded.id}`
  });
}));

router.get('/audio/:fileId', requireAuth, requireRole('admin', 'teacher'), route(async (req, res) => {
  if (req.user.role === 'teacher') {
    const [results, students] = await Promise.all([
      readPlatformSheet('Placement_Results'),
      readPlatformSheet('Students_Master')
    ]);
    const assignedIds = new Set(students.rows
      .filter((row) => teacherMatches(row, req.user))
      .map((row) => String(rowValue(row, ['student_id'])).trim().toUpperCase())
      .filter(Boolean));
    const allowed = results.rows.some((row) => {
      const audio = JSON.parse(rowValue(row, ['audio_urls']) || '[]');
      return assignedIds.has(String(rowValue(row, ['student_id'])).trim().toUpperCase())
        && audio.some((item) => item.file_id === req.params.fileId);
    });
    if (!allowed) return res.status(403).json({ error: 'Forbidden.' });
  }
  const file = await getProtectedFile(req.params.fileId);
  res.setHeader('Content-Type', file.metadata.mimeType || 'audio/webm');
  res.setHeader('Content-Disposition', `inline; filename="${String(file.metadata.name || 'placement-audio').replace(/"/g, '')}"`);
  file.stream.pipe(res);
}));

router.get('/result/:studentId', requireAuth, route(async (req, res) => {
  const sheet = await readPlatformSheet('Placement_Results');
  const rows = sheet.rows.filter((row) => rowValue(row, ['student_id']) === req.params.studentId);
  if (req.user.role === 'student' && !rows.some((row) => studentMatches(row, req.user))) {
    return res.status(403).json({ error: 'Forbidden.' });
  }
  if (req.user.role === 'teacher') return res.status(403).json({ error: 'Admin review is required before teacher access.' });
  res.json({ rows, fetchedAt: sheet.fetchedAt });
}));

router.get('/admin/results', requireAuth, requireRole('admin'), route(async (_req, res) => {
  res.json(await readPlatformSheet('Placement_Results'));
}));

router.get('/teacher/results', requireAuth, requireRole('teacher'), route(async (req, res) => {
  const [results, students] = await Promise.all([
    readPlatformSheet('Placement_Results'),
    readPlatformSheet('Students_Master')
  ]);
  const ids = new Set(students.rows
    .filter((row) => teacherMatches(row, req.user))
    .map((row) => String(rowValue(row, ['student_id'])).trim().toUpperCase())
    .filter(Boolean));
  res.json({
    ...results,
    rows: results.rows.filter((row) => ids.has(String(rowValue(row, ['student_id'])).trim().toUpperCase()))
  });
}));

export default router;
