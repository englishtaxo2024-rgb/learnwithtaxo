import fs from 'fs/promises';
import { Router } from 'express';
import multer from 'multer';
import { audit, groupFromTaxoRow, loadDb, mutateDb, parseCsv, studentFromTaxoRow } from '../services/store.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { getAction } from '../services/appsScriptServer.js';

const router = Router();
const allowedUploads = new Set(['image/png', 'image/jpeg', 'image/webp', 'application/pdf', 'audio/webm', 'audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/ogg']);
const upload = multer({
  dest: process.env.LOCAL_UPLOAD_DIR || 'server/uploads',
  limits: { fileSize: Number(process.env.MAX_UPLOAD_MB || 10) * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, allowedUploads.has(file.mimetype))
});

function fileUrl(file) { return file ? `/uploads/${file.filename}` : ''; }
function normalizeStudent(row) { return { student_id: row.student_id || row['Student ID'] || row.id || row.ID, student_name: row.student_name || row['Student Name'] || row.Name || row.name, parent_email: row.parent_email || row['Parent Email'] || row.Email || row.parentEmail, phone: row.phone || row.Phone, age: row.age || row.Age, teacher: row.teacher || row.Teacher, group_key: row.group_key || row.GroupID || row.groupId, group_name: row.group_name || row['Group Name'] || row.groupName, days: row.days || row.Days || row.Day, time: row.time || row.Time, material: row.material || row.Material || row.Course || row.course, source_row: row.source_row }; }
function normalizeGroup(row) { return { group_key: row.group_key || row.GroupID || row.id, teacher: row.teacher || row.Teacher, group_name: row.group_name || row['Group Name'] || row.groupName, start_date: row.start_date || row['Start date'], end_date: row.end_date || row['End date'], days: row.days || row.Days || row.Day, time: row.time || row.Time, number_of_sessions: row.number_of_sessions || row['Number of sessions'], material: row.material || row.Material || row.Course || row.course, student_ids: row.student_ids || row['Student IDs'], source_row: row.source_row }; }
function questionList(settings, testType) { return settings.testTypes.find((item) => item.id === testType || item.name === testType)?.questions || []; }
function scoreAnswers(settings, testType, answers = []) { const questions = questionList(settings, testType); const max = questions.reduce((sum, q) => sum + Number(q.points || 0), 0); const earned = answers.reduce((sum, answer) => { const q = questions.find((item) => item.id === answer.question_id); if (!q || q.type !== 'mcq' || !q.answer) return sum; return sum + (String(answer.answer || '').trim() === String(q.answer).trim() ? Number(q.points || 0) : 0); }, 0); const score = max ? Math.round((earned / max) * 100) : null; const estimated_level = score == null ? 'Under Review' : settings.levelRules.find((rule) => score >= rule.min && score <= rule.max)?.level || 'Under Review'; return { score, estimated_level }; }

function scoped(db, user) {
  if (user.role === 'admin') return db;
  if (user.role === 'teacher') {
    const teacher = db.teachers.find((item) => item.id === user.id || item.email === user.email);
    const teacherId = teacher?.id || user.id;
    const groups = db.groups.filter((group) => group.teacherId === teacherId);
    const groupIds = new Set(groups.map((group) => group.id));
    const studentIds = new Set(groups.flatMap((group) => group.studentIds || []));
    const students = db.students.filter((student) => student.teacherId === teacherId || studentIds.has(student.id) || groupIds.has(student.groupId));
    const scopedStudentIds = new Set(students.map((student) => student.id));
    return { ...db, teachers: teacher ? [teacher] : [], groups, students, materials: db.materials.filter((material) => groups.some((group) => group.materialKeys?.includes(material.key))), payments: db.payments.filter((payment) => scopedStudentIds.has(payment.student_id)), placementSubmissions: db.placementSubmissions.filter((submission) => submission.assigned_teacher_id === teacherId || submission.assigned_teacher === teacher?.name), audit: [] };
  }
  const student = db.students.find((item) => item.id === user.studentId || item.parentEmail === user.email);
  const group = db.groups.find((item) => item.id === student?.groupId);
  return { ...db, teachers: db.teachers.filter((teacher) => teacher.id === student?.teacherId), groups: group ? [group] : [], students: student ? [student] : [], materials: db.materials.filter((material) => student?.materialKeys?.includes(material.key) || group?.materialKeys?.includes(material.key)), payments: student ? db.payments.filter((payment) => payment.student_id === student.id) : [], placementSubmissions: student ? db.placementSubmissions.filter((submission) => submission.student_id === student.id || submission.student_phone === student.phone || submission.parent_phone === student.phone) : [], audit: [] };
}

router.get('/placement/settings-public', async (_req, res) => {
  const db = await loadDb();
  const settings = { ...db.placementSettings, testTypes: db.placementSettings.testTypes.map((type) => ({ ...type, questions: type.questions.map(({ answer, ...question }) => question) })) };
  res.json({ settings });
});

router.post('/placement/submissions', upload.fields([{ name: 'audio', maxCount: 40 }, { name: 'files', maxCount: 10 }]), async (req, res) => {
  const payload = JSON.parse(req.body.payload || '{}');
  const submission = await mutateDb((db) => {
    const { score, estimated_level } = scoreAnswers(db.placementSettings, payload.test_type, payload.answers || []);
    const audioFiles = req.files?.audio || [];
    const uploadedFiles = req.files?.files || [];
    const record = { placement_test_id: `PT-${Date.now()}`, student_id: payload.student_id || `LEAD-${Date.now()}`, student_name: payload.student_name, parent_name: payload.parent_name, parent_phone: payload.parent_phone, student_phone: payload.student_phone, age: payload.age, country: payload.country, course_interest: payload.course_interest, preferred_contact_time: payload.preferred_contact_time, test_type: payload.test_type, notes: payload.notes, answers: payload.answers || [], audio_urls: audioFiles.map((file, index) => ({ question_id: payload.audio_question_ids?.[index], url: fileUrl(file), mimetype: file.mimetype })), file_urls: uploadedFiles.map((file) => ({ url: fileUrl(file), mimetype: file.mimetype })), score, estimated_level, assigned_teacher: '', assigned_teacher_id: '', assigned_group: '', assigned_group_id: '', status: 'New', admin_notes: '', teacher_feedback: '', submitted_at: new Date().toISOString(), reviewed_at: '' };
    db.placementSubmissions.unshift(record);
    audit(db, { role: 'public', email: payload.parent_phone || 'public' }, 'placement.submit', { id: record.placement_test_id });
    return record;
  });
  res.json({ submission });
});

router.use(requireAuth);

router.get('/bootstrap', async (req, res) => {
  const db = scoped(await loadDb(), req.user);
  res.json({ user: { ...req.user, password: undefined }, students: db.students, teachers: db.teachers, groups: db.groups, materials: db.materials, payments: db.payments, paymentSettings: db.paymentSettings, placementTests: db.placementTests, placementSettings: req.user.role === 'admin' ? db.placementSettings : undefined, placementSubmissions: db.placementSubmissions, finalTests: db.finalTests, audit: req.user.role === 'admin' ? db.audit : [] });
});

router.post('/students', requireRole('admin'), async (req, res) => {
  const student = await mutateDb((db) => { const payload = { id: req.body.id || `ET-2026-${Date.now()}`, attendance: [], homework: [], feedback: [], finalTests: [], materialKeys: [], ...req.body }; const index = db.students.findIndex((item) => item.id === payload.id); if (index >= 0) db.students[index] = { ...db.students[index], ...payload }; else db.students.push(payload); audit(db, req.user, 'student.upsert', { studentId: payload.id }); return payload; });
  res.json({ student });
});

router.post('/teachers', requireRole('admin'), async (req, res) => {
  const teacher = await mutateDb((db) => { const payload = { id: req.body.id || `teacher-${Date.now()}`, media: [], ...req.body }; const index = db.teachers.findIndex((item) => item.id === payload.id); if (index >= 0) db.teachers[index] = { ...db.teachers[index], ...payload }; else db.teachers.push(payload); audit(db, req.user, 'teacher.upsert', { teacherId: payload.id }); return payload; });
  res.json({ teacher });
});

router.post('/import/:kind', requireRole('admin'), upload.single('file'), async (req, res) => {
  const text = req.file ? await fs.readFile(req.file.path, 'utf8') : req.body.csv;
  if (!text) return res.status(400).json({ error: 'CSV file or csv text is required' });
  const rows = parseCsv(text);
  const result = await mutateDb((db) => { if (req.params.kind === 'students') rows.forEach((row) => { const student = studentFromTaxoRow(normalizeStudent(row)); const index = db.students.findIndex((item) => item.id === student.id); if (index >= 0) db.students[index] = { ...db.students[index], ...student }; else db.students.push(student); }); else if (req.params.kind === 'teachers-groups') rows.forEach((row) => { const group = groupFromTaxoRow(normalizeGroup(row), []); const index = db.groups.findIndex((item) => item.id === group.id); if (index >= 0) db.groups[index] = { ...db.groups[index], ...group }; else db.groups.push(group); }); else throw new Error('Unknown import kind'); audit(db, req.user, `import.${req.params.kind}`, { rows: rows.length }); return { imported: rows.length }; });
  res.json(result);
});

router.post('/sync/google-students', requireRole('admin'), async (_req, res) => {
  const payload = await getAction('students');
  const sourceRows = payload.students || payload.data || payload || [];
  const imported = await mutateDb((db) => { sourceRows.forEach((row) => { const id = row['Student ID'] || row.id || row.studentId; if (!id) return; const student = { ...studentFromTaxoRow(normalizeStudent({ ...row, student_id: id })), paymentStatus: row.Payment || row.paymentStatus || 'Imported' }; const index = db.students.findIndex((item) => item.id === id); if (index >= 0) db.students[index] = { ...db.students[index], ...student }; else db.students.push(student); }); audit(db, _req.user, 'google.students.sync', { rows: sourceRows.length }); return sourceRows.length; });
  res.json({ imported });
});

router.post('/payments', upload.single('proof'), async (req, res) => {
  const payment = await mutateDb((db) => { const student = db.students.find((item) => item.id === req.body.student_id || item.id === req.user.studentId); if (!student) throw new Error('Student not found'); if (req.user.role === 'student' && req.user.studentId !== student.id) throw new Error('Forbidden'); if (req.user.role === 'teacher' && student.teacherId !== req.user.id) throw new Error('Forbidden'); const record = { payment_id: `PAY-${Date.now()}`, student_id: student.id, student_name: student.name, parent_phone: student.phone, group_id: student.groupId, group_name: student.groupName, teacher_name: student.teacher, course_name: student.course, amount: Number(req.body.amount || 0), currency: req.body.currency || 'EGP', payment_method: req.body.payment_method || 'Manual transfer', screenshot_url: fileUrl(req.file), status: 'Pending', student_note: req.body.student_note || '', admin_note: '', submitted_at: new Date().toISOString(), reviewed_at: '', reviewed_by: '' }; db.payments.unshift(record); student.paymentStatus = 'Pending'; audit(db, req.user, 'payment.submit', { paymentId: record.payment_id, studentId: student.id }); return record; });
  res.json({ payment });
});

router.patch('/payments/:id', requireRole('admin'), async (req, res) => {
  const payment = await mutateDb((db) => { const record = db.payments.find((item) => item.payment_id === req.params.id); if (!record) throw new Error('Payment not found'); record.status = req.body.status || record.status; record.admin_note = req.body.admin_note ?? record.admin_note; record.reviewed_at = new Date().toISOString(); record.reviewed_by = req.user.email; const student = db.students.find((item) => item.id === record.student_id); if (student) student.paymentStatus = record.status === 'Paid' ? 'Paid' : record.status; audit(db, req.user, 'payment.review', { paymentId: record.payment_id, status: record.status }); return record; });
  res.json({ payment });
});

router.patch('/placement/submissions/:id', async (req, res) => {
  const submission = await mutateDb((db) => { const record = db.placementSubmissions.find((item) => item.placement_test_id === req.params.id); if (!record) throw new Error('Placement submission not found'); if (req.user.role === 'teacher' && record.assigned_teacher_id !== req.user.id) throw new Error('Forbidden'); if (req.user.role === 'student' && record.student_id !== req.user.studentId) throw new Error('Forbidden'); const allowed = req.user.role === 'admin' ? ['score', 'estimated_level', 'assigned_teacher', 'assigned_teacher_id', 'assigned_group', 'assigned_group_id', 'status', 'admin_notes'] : ['teacher_feedback', 'estimated_level', 'status']; allowed.forEach((key) => { if (key in req.body) record[key] = req.body[key]; }); record.reviewed_at = new Date().toISOString(); audit(db, req.user, 'placement.review', { id: record.placement_test_id, status: record.status }); return record; });
  res.json({ submission });
});

router.patch('/placement/settings', requireRole('admin'), async (req, res) => {
  const settings = await mutateDb((db) => { db.placementSettings = { ...db.placementSettings, ...req.body }; audit(db, req.user, 'placement.settings.update'); return db.placementSettings; });
  res.json({ settings });
});

router.post('/materials', requireRole('admin'), upload.array('slides', 80), async (req, res) => {
  const { course, level, session, title, assignToGroupId, assignToStudentId } = req.body;
  if (!course || !level || !session) return res.status(400).json({ error: 'course, level and session are required' });
  const key = `${course}|${level}|S${session}`;
  const material = await mutateDb((db) => { const payload = { key, title: title || key, course, level, session, slides: (req.files || []).map((file, index) => ({ index: index + 1, originalName: file.originalname, url: `/uploads/${file.filename}` })), createdAt: new Date().toISOString() }; const index = db.materials.findIndex((item) => item.key === key); if (index >= 0) db.materials[index] = payload; else db.materials.push(payload); if (assignToGroupId) { const group = db.groups.find((item) => item.id === assignToGroupId); if (group) group.materialKeys = [...new Set([...(group.materialKeys || []), key])]; } if (assignToStudentId) { const student = db.students.find((item) => item.id === assignToStudentId); if (student) student.materialKeys = [...new Set([...(student.materialKeys || []), key])]; } audit(db, req.user, 'material.upload', { key, slides: payload.slides.length }); return payload; });
  res.json({ material });
});

router.post('/feedback', async (req, res) => { await mutateDb((db) => { const student = db.students.find((item) => item.id === req.body.studentId); if (!student) throw new Error('Student not found'); if (req.user.role === 'student' && req.user.studentId !== student.id) throw new Error('Forbidden'); student.feedback = [...(student.feedback || []), { ...req.body, at: new Date().toISOString(), by: req.user.id }]; audit(db, req.user, 'feedback.submit', { studentId: student.id }); }); res.json({ ok: true }); });
router.post('/homework', async (req, res) => { await mutateDb((db) => { const student = db.students.find((item) => item.id === req.body.studentId); if (!student) throw new Error('Student not found'); if (req.user.role === 'student' && req.user.studentId !== student.id) throw new Error('Forbidden'); student.homework = [...(student.homework || []), { ...req.body, at: new Date().toISOString(), by: req.user.id }]; audit(db, req.user, 'homework.submit', { studentId: student.id }); }); res.json({ ok: true }); });

export default router;
