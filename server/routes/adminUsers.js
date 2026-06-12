import fs from 'fs/promises';
import { Router } from 'express';
import multer from 'multer';
import { audit, mutateDb, parseCsv } from '../services/store.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { sheetsDirectoryConfigured } from '../services/directoryService.js';
import { appendPlatformRecord, readPlatformSheet, rowValue, updatePlatformRecord } from '../services/platformSheets.js';
import { ensureAuthData, normalizeEmail, normalizePhone, resetAccessCode } from '../services/secureAuth.js';

const router = Router();
const upload = multer({
  dest: process.env.LOCAL_UPLOAD_DIR || 'server/uploads',
  limits: { fileSize: Number(process.env.MAX_CSV_UPLOAD_MB || 5) * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, /csv|text\/plain|application\/vnd\.ms-excel/.test(file.mimetype || '') || /\.csv$/i.test(file.originalname))
});

function truthy(value) {
  return !['false', '0', 'no', 'inactive', 'blocked'].includes(String(value ?? 'true').trim().toLowerCase());
}

function splitList(value) {
  return String(value || '').split('|').map((item) => item.trim()).filter(Boolean);
}

function teacherFromRow(row) {
  const id = String(row.teacher_id || row.id || row.ID || '').trim();
  const name = String(row.name || row.teacher || row.Teacher || '').trim();
  const email = normalizeEmail(row.email || row.Email);
  const phone = normalizePhone(row.phone || row.Phone);
  if (!id || !name) return { error: 'missing teacher_id or name' };
  return {
    id,
    role: 'teacher',
    name,
    email,
    phone,
    active: truthy(row.active),
    authEligible: Boolean(email || phone || id),
    groups: splitList(row.groups),
    levels: splitList(row.levels),
    schedule: splitList(row.schedule),
    approved: truthy(row.active),
    visible: true,
    blocked: !truthy(row.active),
    source: 'taxo_teachers.csv',
    importedAt: new Date().toISOString()
  };
}

function studentFromRow(row) {
  const id = String(row.student_id || row.id || row.ID || '').trim();
  const name = String(row.student_name || row.name || row.Name || '').trim();
  const email = normalizeEmail(row.email || row.Email);
  const parentEmail = normalizeEmail(row.parent_email || row.parentEmail || row['Parent Email']);
  const phone = normalizePhone(row.phone || row.Phone);
  if (!id || !name) return { error: 'missing student_id or student_name' };
  if (!email && !parentEmail && !phone && !id) return { error: 'missing safe student identifier' };
  return {
    id,
    role: 'student',
    name,
    email,
    parentEmail,
    phone,
    course: String(row.course || '').trim(),
    level: String(row.level || '').trim(),
    groupName: String(row.group_name || row.groupName || '').trim(),
    teacher: String(row.teacher || '').trim(),
    active: truthy(row.active),
    authEligible: true,
    blocked: !truthy(row.active),
    source: 'taxo_students.csv',
    importedAt: new Date().toISOString(),
    attendance: [],
    homework: [],
    feedback: [],
    finalTests: []
  };
}

async function csvText(file, bodyValue) {
  if (file) return fs.readFile(file.path, 'utf8');
  return bodyValue || '';
}

function upsertById(items, next) {
  const index = items.findIndex((item) => item.id === next.id);
  if (index >= 0) items[index] = { ...items[index], ...next };
  else items.push(next);
  return index >= 0 ? 'updated' : 'created';
}

async function syncUsersToSheets(teachers = [], students = []) {
  if (!sheetsDirectoryConfigured()) return { mode: 'server-cache', teachers: 0, students: 0 };
  const [teacherSheet, studentSheet] = await Promise.all([
    readPlatformSheet('Teachers'),
    readPlatformSheet('Students_Master')
  ]);
  let teacherCount = 0;
  let studentCount = 0;

  for (const teacher of teachers) {
    const record = {
      teacher_id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      groups: (teacher.currentGroups || teacher.groups || []).join(' | '),
      levels: (teacher.levels || []).join(' | '),
      courses: (teacher.courses || []).join(' | '),
      schedule: (teacher.currentSchedule || teacher.schedule || []).join(' | '),
      active: teacher.active,
      updated_at: new Date().toISOString()
    };
    const existing = teacherSheet.rows.find((row) => rowValue(row, ['teacher_id']) === teacher.id);
    if (existing) await updatePlatformRecord('Teachers', existing._rowNumber, record);
    else await appendPlatformRecord('Teachers', record);
    teacherCount += 1;
  }

  for (const student of students) {
    const record = {
      student_id: student.id,
      student_name: student.name,
      email: student.email,
      parent_email: student.parentEmail,
      phone: student.phone,
      course: student.course,
      level: student.level,
      group_name: student.groupName,
      teacher: student.teacher,
      active: student.active,
      updated_at: new Date().toISOString()
    };
    const existing = studentSheet.rows.find((row) => rowValue(row, ['student_id']) === student.id);
    if (existing) await updatePlatformRecord('Students_Master', existing._rowNumber, record);
    else await appendPlatformRecord('Students_Master', record);
    studentCount += 1;
  }
  return { mode: 'google-sheets', teachers: teacherCount, students: studentCount };
}

router.use(requireAuth, requireRole('admin'));

router.post('/import-users', upload.fields([{ name: 'teachersCsv', maxCount: 1 }, { name: 'studentsCsv', maxCount: 1 }]), async (req, res) => {
  const teachersText = await csvText(req.files?.teachersCsv?.[0], req.body.teachersCsv);
  const studentsText = await csvText(req.files?.studentsCsv?.[0], req.body.studentsCsv);
  if (!teachersText && !studentsText) return res.status(400).json({ error: 'teachersCsv or studentsCsv is required' });

  const importedTeachers = [];
  const importedStudents = [];
  const summary = await mutateDb((db) => {
    ensureAuthData(db);
    const result = {
      teachers: { imported: 0, updated: 0, skipped: [] },
      students: { imported: 0, updated: 0, skipped: [] }
    };

    if (teachersText) {
      parseCsv(teachersText).forEach((row, index) => {
        const teacher = teacherFromRow(row);
        if (teacher.error) return result.teachers.skipped.push({ row: index + 2, reason: teacher.error });
        importedTeachers.push(teacher);
        const action = upsertById(db.teachers, teacher);
        result.teachers[action === 'created' ? 'imported' : 'updated'] += 1;
      });
    }

    if (studentsText) {
      parseCsv(studentsText).forEach((row, index) => {
        const student = studentFromRow(row);
        if (student.error) return result.students.skipped.push({ row: index + 2, reason: student.error });
        importedStudents.push(student);
        const action = upsertById(db.students, student);
        result.students[action === 'created' ? 'imported' : 'updated'] += 1;
      });
    }

    audit(db, req.user, 'admin.import-users', result);
    return result;
  });

  const sheetSync = await syncUsersToSheets(importedTeachers, importedStudents);
  res.json({ summary, sheetSync });
});

router.post('/access-codes', async (req, res) => {
  const { role, userId, code } = req.body || {};
  if (!role || !userId) return res.status(400).json({ error: 'role and userId are required' });
  if (userId === 'all') {
    if (!['teacher', 'student'].includes(role)) return res.status(400).json({ error: 'Bulk reset is only available for teacher or student users' });
    const ids = sheetsDirectoryConfigured()
      ? (await readPlatformSheet(role === 'teacher' ? 'Teachers' : 'Students_Master')).rows
        .filter((row) => truthy(rowValue(row, ['active', 'status'])))
        .map((row) => rowValue(row, [role === 'teacher' ? 'teacher_id' : 'student_id']))
        .filter(Boolean)
      : await mutateDb((db) => {
        ensureAuthData(db);
        return (role === 'teacher' ? db.teachers : db.students).filter((item) => item.active !== false && item.authEligible === true).map((item) => item.id);
      });
    const codes = [];
    for (const id of ids) codes.push({ role, userId: id, accessCode: await resetAccessCode({ role, userId: id }) });
    await mutateDb((db) => audit(db, req.user, 'admin.bulk-access-code-reset', { role, count: codes.length }));
    return res.json({ codes, message: 'Show these codes once and store them outside the frontend.' });
  }
  const accessCode = await resetAccessCode({ role, userId, code });
  await mutateDb((db) => audit(db, req.user, 'admin.access-code-reset', { role, userId }));
  res.json({ role, userId, accessCode, message: 'Show this code once and store it outside the frontend.' });
});

router.post('/auth-codes/generate', async (req, res) => {
  const { role, userId } = req.body || {};
  if (!role || !userId) return res.status(400).json({ error: 'role and userId are required' });
  const accessCode = await resetAccessCode({ role, userId });
  await mutateDb((db) => audit(db, req.user, 'admin.auth-code-generate', { role, userId }));
  res.status(201).json({
    role,
    userId,
    accessCode,
    message: 'Copy this code now. Only its hash is stored.'
  });
});

router.post('/auth-codes/reset', async (req, res) => {
  const { role, userId } = req.body || {};
  if (!role || !userId) return res.status(400).json({ error: 'role and userId are required' });
  const accessCode = await resetAccessCode({ role, userId });
  await mutateDb((db) => audit(db, req.user, 'admin.auth-code-reset', { role, userId }));
  res.json({
    role,
    userId,
    accessCode,
    message: 'The previous access code is no longer valid.'
  });
});

export default router;
