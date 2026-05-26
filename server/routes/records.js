import fs from 'fs/promises';
import { Router } from 'express';
import multer from 'multer';
import { audit, groupFromTaxoRow, loadDb, mutateDb, parseCsv, studentFromTaxoRow } from '../services/store.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { getAction } from '../services/appsScriptServer.js';

const router = Router();
const upload = multer({ dest: 'server/uploads' });

function scoped(db, user) {
  if (user.role === 'admin') return db;
  if (user.role === 'teacher') {
    const teacher = db.teachers.find((item) => item.id === user.id || item.email === user.email);
    const teacherId = teacher?.id || user.id;
    const groups = db.groups.filter((group) => group.teacherId === teacherId);
    const studentIds = new Set(groups.flatMap((group) => group.studentIds || []));
    return { ...db, teachers: teacher ? [teacher] : [], groups, students: db.students.filter((student) => student.teacherId === teacherId || studentIds.has(student.id)), materials: db.materials.filter((material) => groups.some((group) => group.materialKeys?.includes(material.key))), audit: [] };
  }
  const student = db.students.find((item) => item.id === user.studentId || item.parentEmail === user.email);
  const group = db.groups.find((item) => item.id === student?.groupId);
  return { ...db, teachers: db.teachers.filter((teacher) => teacher.id === student?.teacherId), groups: group ? [group] : [], students: student ? [student] : [], materials: db.materials.filter((material) => student?.materialKeys?.includes(material.key) || group?.materialKeys?.includes(material.key)), audit: [] };
}

function normalizeStudent(row) {
  return {
    student_id: row.student_id || row['Student ID'] || row.id || row.ID,
    student_name: row.student_name || row['Student Name'] || row.Name || row.name,
    parent_email: row.parent_email || row['Parent Email'] || row.Email || row.parentEmail,
    phone: row.phone || row.Phone,
    age: row.age || row.Age,
    teacher: row.teacher || row.Teacher,
    group_key: row.group_key || row.GroupID || row.groupId,
    group_name: row.group_name || row['Group Name'] || row.groupName,
    days: row.days || row.Days || row.Day,
    time: row.time || row.Time,
    material: row.material || row.Material || row.Course || row.course,
    source_row: row.source_row
  };
}

function normalizeGroup(row) {
  return {
    group_key: row.group_key || row.GroupID || row.id,
    teacher: row.teacher || row.Teacher,
    group_name: row.group_name || row['Group Name'] || row.groupName,
    start_date: row.start_date || row['Start date'],
    end_date: row.end_date || row['End date'],
    days: row.days || row.Days || row.Day,
    time: row.time || row.Time,
    number_of_sessions: row.number_of_sessions || row['Number of sessions'],
    material: row.material || row.Material || row.Course || row.course,
    student_ids: row.student_ids || row['Student IDs'],
    source_row: row.source_row
  };
}

router.use(requireAuth);

router.get('/bootstrap', async (req, res) => {
  const db = scoped(await loadDb(), req.user);
  res.json({ user: { ...req.user, password: undefined }, students: db.students, teachers: db.teachers, groups: db.groups, materials: db.materials, placementTests: db.placementTests, finalTests: db.finalTests, audit: req.user.role === 'admin' ? db.audit : [] });
});

router.post('/students', requireRole('admin'), async (req, res) => {
  const student = await mutateDb((db) => {
    const payload = { id: req.body.id || `ET-2026-${Date.now()}`, attendance: [], homework: [], feedback: [], finalTests: [], materialKeys: [], ...req.body };
    const index = db.students.findIndex((item) => item.id === payload.id);
    if (index >= 0) db.students[index] = { ...db.students[index], ...payload };
    else db.students.push(payload);
    audit(db, req.user, 'student.upsert', { studentId: payload.id });
    return payload;
  });
  res.json({ student });
});

router.post('/teachers', requireRole('admin'), async (req, res) => {
  const teacher = await mutateDb((db) => {
    const payload = { id: req.body.id || `teacher-${Date.now()}`, media: [], ...req.body };
    const index = db.teachers.findIndex((item) => item.id === payload.id);
    if (index >= 0) db.teachers[index] = { ...db.teachers[index], ...payload };
    else db.teachers.push(payload);
    audit(db, req.user, 'teacher.upsert', { teacherId: payload.id });
    return payload;
  });
  res.json({ teacher });
});

router.post('/import/:kind', requireRole('admin'), upload.single('file'), async (req, res) => {
  const text = req.file ? await fs.readFile(req.file.path, 'utf8') : req.body.csv;
  if (!text) return res.status(400).json({ error: 'CSV file or csv text is required' });
  const rows = parseCsv(text);
  const result = await mutateDb((db) => {
    if (req.params.kind === 'students') {
      rows.forEach((row) => {
        const student = studentFromTaxoRow(normalizeStudent(row));
        const index = db.students.findIndex((item) => item.id === student.id);
        if (index >= 0) db.students[index] = { ...db.students[index], ...student };
        else db.students.push(student);
      });
    } else if (req.params.kind === 'teachers-groups') {
      rows.forEach((row) => {
        const group = groupFromTaxoRow(normalizeGroup(row), []);
        const index = db.groups.findIndex((item) => item.id === group.id);
        if (index >= 0) db.groups[index] = { ...db.groups[index], ...group };
        else db.groups.push(group);
      });
    } else {
      throw new Error('Unknown import kind');
    }
    audit(db, req.user, `import.${req.params.kind}`, { rows: rows.length });
    return { imported: rows.length };
  });
  res.json(result);
});

router.post('/sync/google-students', requireRole('admin'), async (req, res) => {
  const payload = await getAction('students');
  const sourceRows = payload.students || payload.data || payload || [];
  const imported = await mutateDb((db) => {
    sourceRows.forEach((row) => {
      const id = row['Student ID'] || row.id || row.studentId;
      if (!id) return;
      const student = { ...studentFromTaxoRow(normalizeStudent({ ...row, student_id: id })), paymentStatus: row.Payment || row.paymentStatus || 'Imported' };
      const index = db.students.findIndex((item) => item.id === id);
      if (index >= 0) db.students[index] = { ...db.students[index], ...student };
      else db.students.push(student);
    });
    audit(db, req.user, 'google.students.sync', { rows: sourceRows.length });
    return sourceRows.length;
  });
  res.json({ imported });
});

router.post('/materials', requireRole('admin'), upload.array('slides', 80), async (req, res) => {
  const { course, level, session, title, assignToGroupId, assignToStudentId } = req.body;
  if (!course || !level || !session) return res.status(400).json({ error: 'course, level and session are required' });
  const key = `${course}|${level}|S${session}`;
  const material = await mutateDb((db) => {
    const payload = { key, title: title || key, course, level, session, slides: (req.files || []).map((file, index) => ({ index: index + 1, originalName: file.originalname, url: `/uploads/${file.filename}` })), createdAt: new Date().toISOString() };
    const index = db.materials.findIndex((item) => item.key === key);
    if (index >= 0) db.materials[index] = payload;
    else db.materials.push(payload);
    if (assignToGroupId) { const group = db.groups.find((item) => item.id === assignToGroupId); if (group) group.materialKeys = [...new Set([...(group.materialKeys || []), key])]; }
    if (assignToStudentId) { const student = db.students.find((item) => item.id === assignToStudentId); if (student) student.materialKeys = [...new Set([...(student.materialKeys || []), key])]; }
    audit(db, req.user, 'material.upload', { key, slides: payload.slides.length });
    return payload;
  });
  res.json({ material });
});

router.post('/feedback', async (req, res) => {
  await mutateDb((db) => {
    const student = db.students.find((item) => item.id === req.body.studentId);
    if (!student) throw new Error('Student not found');
    if (req.user.role === 'student' && req.user.studentId !== student.id) throw new Error('Forbidden');
    student.feedback = [...(student.feedback || []), { ...req.body, at: new Date().toISOString(), by: req.user.id }];
    audit(db, req.user, 'feedback.submit', { studentId: student.id });
  });
  res.json({ ok: true });
});

router.post('/homework', async (req, res) => {
  await mutateDb((db) => {
    const student = db.students.find((item) => item.id === req.body.studentId);
    if (!student) throw new Error('Student not found');
    if (req.user.role === 'student' && req.user.studentId !== student.id) throw new Error('Forbidden');
    student.homework = [...(student.homework || []), { ...req.body, at: new Date().toISOString(), by: req.user.id }];
    audit(db, req.user, 'homework.submit', { studentId: student.id });
  });
  res.json({ ok: true });
});

export default router;
