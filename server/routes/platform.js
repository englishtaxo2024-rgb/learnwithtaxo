import crypto from 'crypto';
import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { getProtectedFile } from '../services/driveServer.js';
import { generateGame, generateRevisionQuiz, scoreWithAi } from '../services/openAiServer.js';
import {
  appendPlatformRecord,
  ensurePlatformSheets,
  readPlatformSheet,
  rowValue,
  scopeRows,
  studentMatches,
  teacherMatches,
  TEMPORARY_CURRICULUM_SHEET_ID,
  truthy,
  updatePlatformRecord
} from '../services/platformSheets.js';

const router = Router();

function route(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function id(prefix) {
  return `${prefix}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
}

function now() {
  return new Date().toISOString();
}

function json(value) {
  return JSON.stringify(value ?? null);
}

function parseJson(value, fallback = null) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function paymentAmount(course, plan) {
  const normalizedCourse = String(course || '').toLowerCase();
  const normalizedPlan = String(plan || 'monthly').toLowerCase();
  const privateCourse = normalizedCourse.includes('private');
  const phonics = normalizedCourse.includes('phonic');
  const prices = privateCourse
    ? { monthly: 4000, '3-months': 10000 }
    : phonics
      ? { monthly: 2000, '2-months': 3600, '3-months': 5200 }
      : { monthly: 1800, '2-months': 3200, '3-months': 4600 };
  return prices[normalizedPlan] || null;
}

function publicRow(row, hidden = []) {
  return Object.fromEntries(Object.entries(row).filter(([key]) => !hidden.includes(key)));
}

function normalizedList(value) {
  const source = Array.isArray(value) ? value : String(value || '').split(/[|,]/);
  return source.map((item) => String(item).trim().toLowerCase()).filter(Boolean);
}

function rowMatchesAssignments(row, user) {
  const rowGroup = String(rowValue(row, ['group_name', 'group', 'batch'])).trim().toLowerCase();
  const rowCourse = String(rowValue(row, ['course'])).trim().toLowerCase();
  const rowLevel = String(rowValue(row, ['level'])).trim().toLowerCase();
  const groups = normalizedList(user.groups);
  const courses = normalizedList(user.courses);
  const levels = normalizedList(user.levels);
  return Boolean(
    (rowGroup && groups.some((value) => rowGroup === value || rowGroup.includes(value))) ||
    (rowCourse && courses.some((value) => rowCourse === value || rowCourse.includes(value))) ||
    (rowLevel && levels.some((value) => rowLevel === value || rowLevel.includes(value)))
  );
}

function teacherCanAccessRow(row, user) {
  return teacherMatches(row, user) || rowMatchesAssignments(row, user);
}

function materialAllowed(row, user) {
  if (!truthy(rowValue(row, ['active']))) return false;
  if (user.role === 'admin') return true;
  if (user.role === 'teacher') {
    return teacherCanAccessRow(row, user)
      && truthy(rowValue(row, ['visible_to_teacher', 'teacher_visible', 'teacher_only', 'active']));
  }
  const sameCourse = !rowValue(row, ['course'])
    || String(rowValue(row, ['course'])).toLowerCase() === String(user.course || '').toLowerCase();
  const sameLevel = !rowValue(row, ['level'])
    || String(rowValue(row, ['level'])).toLowerCase() === String(user.level || '').toLowerCase();
  const sameGroup = !rowValue(row, ['group_name'])
    || String(rowValue(row, ['group_name'])).toLowerCase() === String(user.groupName || '').toLowerCase();
  return sameCourse && sameLevel && sameGroup
    && truthy(rowValue(row, ['visible_to_student', 'student_visible']));
}

async function assignedStudentIds(user) {
  const students = await readPlatformSheet('Students_Master');
  return new Set(students.rows
    .filter((row) => teacherMatches(row, user))
    .map((row) => String(rowValue(row, ['student_id'])).trim().toUpperCase())
    .filter(Boolean));
}

function rowsForStudentIds(rows, ids) {
  return rows.filter((row) => ids.has(String(rowValue(row, ['student_id'])).trim().toUpperCase()));
}

async function scopedTab(tabName, user, options) {
  const sheet = await readPlatformSheet(tabName, options);
  return { ...sheet, rows: scopeRows(sheet.rows, user, options) };
}

router.use(requireAuth);

router.get('/dashboard', route(async (req, res) => {
  if (req.user.role === 'admin') {
    const [students, teachers, appointments, payments] = await Promise.all([
      readPlatformSheet('Students_Master'),
      readPlatformSheet('Teachers'),
      readPlatformSheet('Appointments'),
      readPlatformSheet('Payment_Requests')
    ]);
    return res.json({
      role: 'admin',
      stats: [
        { label: 'Students', value: students.rows.length },
        { label: 'Teachers', value: teachers.rows.length },
        { label: 'Appointments', value: appointments.rows.length },
        { label: 'Pending payments', value: payments.rows.filter((row) => String(rowValue(row, ['status'])).toLowerCase() === 'pending').length }
      ],
      fetchedAt: now()
    });
  }
  if (req.user.role === 'teacher') {
    const [students, schedule, homework, availability] = await Promise.all([
      readPlatformSheet('Students_Master'),
      readPlatformSheet(process.env.GOOGLE_SCHEDULE_TAB || 'English Taxo Schedule'),
      readPlatformSheet('Homework_Submissions'),
      readPlatformSheet('Teacher_Availability')
    ]);
    const assignedIds = new Set(students.rows
      .filter((row) => teacherMatches(row, req.user))
      .map((row) => String(rowValue(row, ['student_id'])).trim().toUpperCase())
      .filter(Boolean));
    return res.json({
      role: 'teacher',
      stats: [
        { label: 'My students', value: students.rows.filter((row) => teacherMatches(row, req.user)).length },
        { label: 'Schedule entries', value: schedule.rows.filter((row) => teacherMatches(row, req.user)).length },
        { label: 'Homework submissions', value: rowsForStudentIds(homework.rows, assignedIds).length },
        { label: 'Available slots', value: availability.rows.filter((row) => teacherMatches(row, req.user) && String(rowValue(row, ['status'])).toLowerCase() === 'active').length }
      ],
      fetchedAt: now()
    });
  }
  const [schedule, homework, results, practice] = await Promise.all([
    readPlatformSheet(process.env.GOOGLE_SCHEDULE_TAB || 'English Taxo Schedule'),
    readPlatformSheet('Homework_Assignments'),
    readPlatformSheet('Test_Results'),
    readPlatformSheet('Student_Weak_Points')
  ]);
  return res.json({
    role: 'student',
    stats: [
      { label: 'Level', value: req.user.level || 'Not assigned' },
      { label: 'Schedule entries', value: schedule.rows.filter((row) => studentMatches(row, req.user)).length },
      { label: 'Homework', value: homework.rows.filter((row) => {
        const course = String(rowValue(row, ['course'])).toLowerCase();
        const level = String(rowValue(row, ['level'])).toLowerCase();
        return (!course || course === String(req.user.course || '').toLowerCase())
          && (!level || level === String(req.user.level || '').toLowerCase());
      }).length },
      { label: 'Results', value: results.rows.filter((row) => studentMatches(row, req.user)).length },
      { label: 'Practice items', value: practice.rows.filter((row) => studentMatches(row, req.user)).length }
    ],
    fetchedAt: now()
  });
}));

router.get('/profile/me', (req, res) => {
  res.json({ rows: [publicRow(req.user, ['token'])], fetchedAt: now() });
});

router.get('/teachers/eligible', requireRole('student'), route(async (req, res) => {
  const sheet = await readPlatformSheet('Teachers');
  const course = String(req.user.course || '').toLowerCase();
  const level = String(req.user.level || '').toLowerCase();
  const rows = sheet.rows.filter((row) => {
    if (!truthy(rowValue(row, ['active', 'status']))) return false;
    const courses = normalizedList(rowValue(row, ['courses', 'course']));
    const levels = normalizedList(rowValue(row, ['levels', 'level']));
    return (!course || !courses.length || courses.some((value) => value.includes(course) || course.includes(value)))
      && (!level || !levels.length || levels.some((value) => value.includes(level) || level.includes(value)));
  }).map((row) => publicRow(row, ['phone', 'schedule']));
  res.json({ ...sheet, rows });
}));

router.post('/admin/system/ensure-sheets', requireRole('admin'), route(async (_req, res) => {
  res.json({ sheets: await ensurePlatformSheets() });
}));

router.get('/curriculum/temporary', requireRole('admin'), route(async (_req, res) => {
  const sheet = await readPlatformSheet(process.env.TEMPORARY_CURRICULUM_TAB || 'Curriculum', {
    spreadsheetId: TEMPORARY_CURRICULUM_SHEET_ID
  });
  res.json({ ...sheet, rows: sheet.rows.map((row) => publicRow(row)) });
}));

router.get('/curriculum/temporary/me', requireRole('admin', 'teacher'), route(async (req, res) => {
  const sheet = await readPlatformSheet(process.env.TEMPORARY_CURRICULUM_TAB || 'Curriculum', {
    spreadsheetId: TEMPORARY_CURRICULUM_SHEET_ID
  });
  const rows = req.user.role === 'admin' ? sheet.rows : sheet.rows.filter((row) => teacherMatches(row, req.user));
  res.json({ ...sheet, rows });
}));

router.get('/curriculum/temporary/:rowNumber', requireRole('admin', 'teacher'), route(async (req, res) => {
  const sheet = await readPlatformSheet(process.env.TEMPORARY_CURRICULUM_TAB || 'Curriculum', {
    spreadsheetId: TEMPORARY_CURRICULUM_SHEET_ID
  });
  const row = sheet.rows.find((item) => item._rowNumber === Number(req.params.rowNumber));
  if (!row) return res.status(404).json({ error: 'Curriculum row not found.' });
  if (req.user.role === 'teacher' && !teacherMatches(row, req.user)) return res.status(403).json({ error: 'Forbidden.' });
  res.json({ row, fetchedAt: sheet.fetchedAt });
}));

router.post('/curriculum/temporary/refresh', requireRole('admin'), route(async (_req, res) => {
  const sheet = await readPlatformSheet(process.env.TEMPORARY_CURRICULUM_TAB || 'Curriculum', {
    spreadsheetId: TEMPORARY_CURRICULUM_SHEET_ID
  });
  res.json({ refreshed: true, rows: sheet.rows.length, lastSyncedAt: sheet.fetchedAt });
}));

router.get('/curriculum/new', requireRole('admin'), (_req, res) => {
  res.json({ status: 'planned', source: 'original-curriculum', active: false });
});

router.get('/availability/me', requireRole('teacher'), route(async (req, res) => {
  res.json(await scopedTab('Teacher_Availability', req.user, { allowStudent: false }));
}));

router.get('/admin/availability', requireRole('admin'), route(async (_req, res) => {
  res.json(await readPlatformSheet('Teacher_Availability'));
}));

router.post('/availability', requireRole('teacher', 'admin'), route(async (req, res) => {
  const teacher = req.user.role === 'teacher' ? req.user : req.body;
  const record = {
    availability_id: req.body.availability_id || id('AVL'),
    teacher_id: teacher.id || teacher.teacher_id,
    teacher_email: teacher.email || teacher.teacher_email,
    teacher_name: teacher.name || teacher.teacher_name,
    course: req.body.course,
    level: req.body.level,
    day: req.body.day,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    slot_type: req.body.slot_type || 'class',
    capacity: Number(req.body.capacity || 1),
    status: req.body.status || 'active',
    updated_at: now()
  };
  await appendPlatformRecord('Teacher_Availability', record);
  res.status(201).json({ availability: record });
}));

router.get('/schedule/me', route(async (req, res) => {
  const tabName = process.env.GOOGLE_SCHEDULE_TAB || 'English Taxo Schedule';
  const sheet = await readPlatformSheet(tabName);
  const rows = req.user.role === 'admin'
    ? sheet.rows
    : req.user.role === 'teacher'
      ? sheet.rows.filter((row) => teacherMatches(row, req.user))
      : sheet.rows.filter((row) => studentMatches(row, req.user));
  res.json({ ...sheet, rows });
}));

router.get('/attendance/me', requireRole('teacher'), route(async (req, res) => {
  const [sheet, ids] = await Promise.all([
    readPlatformSheet('Attendance'),
    assignedStudentIds(req.user)
  ]);
  res.json({ ...sheet, rows: rowsForStudentIds(sheet.rows, ids) });
}));

router.post('/attendance', requireRole('teacher', 'admin'), route(async (req, res) => {
  if (req.user.role === 'teacher') {
    const ids = await assignedStudentIds(req.user);
    if (!ids.has(String(req.body.student_id || '').trim().toUpperCase())) {
      return res.status(403).json({ error: 'The student is not assigned to this teacher.' });
    }
  }
  const record = {
    attendance_id: req.body.attendance_id || id('ATT'),
    student_id: req.body.student_id,
    student_name: req.body.student_name || '',
    teacher_id: req.user.role === 'teacher' ? req.user.id : req.body.teacher_id || '',
    teacher_email: req.user.role === 'teacher' ? req.user.email : req.body.teacher_email || '',
    group_name: req.body.group_name || '',
    session: req.body.session || '',
    status: req.body.status || 'present',
    homework_score: req.body.homework_score ?? '',
    participation_score: req.body.participation_score ?? '',
    camera_status: req.body.camera_status || '',
    notes: req.body.notes || '',
    marked_at: now()
  };
  await appendPlatformRecord('Attendance', record);
  res.status(201).json({ attendance: record });
}));

router.get('/materials/me', route(async (req, res) => {
  const sheet = await readPlatformSheet('Materials_Index');
  const rows = sheet.rows.filter((row) => materialAllowed(row, req.user));
  res.json({ ...sheet, rows: rows.map((row) => publicRow(row, ['teacher_notes', 'answer_key'])) });
}));

router.get('/materials/:materialId', route(async (req, res) => {
  const sheet = await readPlatformSheet('Materials_Index');
  const row = sheet.rows.find((item) => rowValue(item, ['material_id']) === req.params.materialId);
  if (!row) return res.status(404).json({ error: 'Material not found.' });
  if (!materialAllowed(row, req.user)) return res.status(403).json({ error: 'Forbidden.' });
  res.json({ material: publicRow(row, req.user.role === 'student' ? ['teacher_notes', 'answer_key'] : []) });
}));

router.get('/materials/:materialId/view', route(async (req, res) => {
  const sheet = await readPlatformSheet('Materials_Index');
  const row = sheet.rows.find((item) => rowValue(item, ['material_id']) === req.params.materialId);
  if (!row) return res.status(404).json({ error: 'Material not found.' });
  if (!materialAllowed(row, req.user)) return res.status(403).json({ error: 'Forbidden.' });
  const fileId = rowValue(row, ['drive_file_id']);
  if (!fileId) return res.status(404).json({ error: 'No material attached yet.' });
  const file = await getProtectedFile(fileId);
  res.setHeader('Content-Type', file.metadata.mimeType || 'application/octet-stream');
  res.setHeader('Content-Disposition', `inline; filename="${String(file.metadata.name || 'material').replace(/"/g, '')}"`);
  file.stream.pipe(res);
}));

router.post('/admin/materials/sync', requireRole('admin'), route(async (_req, res) => {
  const sheet = await readPlatformSheet('Materials_Index');
  res.json({ synced: true, rows: sheet.rows.length, fetchedAt: sheet.fetchedAt });
}));

router.post('/admin/materials', requireRole('admin'), route(async (req, res) => {
  const record = {
    material_id: req.body.material_id || id('MAT'),
    curriculum_source: req.body.curriculum_source || 'temporary',
    course: req.body.course || '',
    level: req.body.level || '',
    session: req.body.session || '',
    group_name: req.body.group_name || '',
    teacher_email: req.body.teacher_email || '',
    material_type: req.body.material_type || '',
    title: req.body.title || '',
    file_url: req.body.file_url || '',
    drive_file_id: req.body.drive_file_id || '',
    viewer_type: req.body.viewer_type || 'protected',
    visible_to_teacher: req.body.visible_to_teacher !== false,
    visible_to_student: Boolean(req.body.visible_to_student),
    active: req.body.active !== false,
    created_at: now(),
    updated_at: now()
  };
  await appendPlatformRecord('Materials_Index', record);
  res.status(201).json({ material: record });
}));

router.get('/materials/files/:fileId', route(async (req, res) => {
  const sheet = await readPlatformSheet('Materials_Index');
  const row = sheet.rows.find((item) => rowValue(item, ['drive_file_id']) === req.params.fileId);
  if (!row) return res.status(404).json({ error: 'Material not found.' });
  if (!materialAllowed(row, req.user)) return res.status(403).json({ error: 'Forbidden.' });
  const file = await getProtectedFile(req.params.fileId);
  res.setHeader('Content-Type', file.metadata.mimeType || 'application/octet-stream');
  res.setHeader('Content-Disposition', `inline; filename="${String(file.metadata.name || 'material').replace(/"/g, '')}"`);
  file.stream.pipe(res);
}));

router.get('/homework/me', route(async (req, res) => {
  const assignments = await readPlatformSheet('Homework_Assignments');
  const rows = assignments.rows.filter((row) => {
    if (req.user.role === 'admin') return true;
    if (req.user.role === 'teacher') return teacherMatches(row, req.user);
    const course = String(rowValue(row, ['course'])).toLowerCase();
    const level = String(rowValue(row, ['level'])).toLowerCase();
    const group = String(rowValue(row, ['group_name'])).toLowerCase();
    return (!course || course === String(req.user.course || '').toLowerCase())
      && (!level || level === String(req.user.level || '').toLowerCase())
      && (!group || group === String(req.user.groupName || '').toLowerCase());
  });
  res.json({ ...assignments, rows });
}));

router.post(['/homework/submit', '/homework/:assignmentId/submit'], requireRole('student'), route(async (req, res) => {
  const submission = {
    submission_id: id('HWS'),
    assignment_id: req.params.assignmentId || req.body.assignment_id,
    student_id: req.user.studentId,
    student_name: req.user.name,
    answers_json: json(req.body.answers || []),
    answer_text: req.body.answer_text || '',
    file_url: req.body.file_url || '',
    audio_url: req.body.audio_url || '',
    status: 'submitted',
    submitted_at: now(),
    teacher_review_needed: false
  };
  await appendPlatformRecord('Homework_Submissions', submission);

  if (req.body.auto_correct === false) return res.status(201).json({ submission });
  try {
    const correction = await scoreWithAi({
      assignment: req.body.assignment,
      studentAnswer: submission.answer_text,
      course: req.user.course,
      level: req.user.level
    });
    const score = {
      score_id: id('HSC'),
      submission_id: submission.submission_id,
      student_id: req.user.studentId,
      assignment_id: submission.assignment_id,
      skill: req.body.skill || 'general',
      score: correction.score,
      max_score: 100,
      percentage: correction.score,
      correction_json: json(correction),
      ai_feedback_en: correction.feedbackEN,
      ai_feedback_ar: correction.feedbackAR,
      weak_points: json(correction.weakPoints),
      teacher_review_needed: correction.needsTeacherReview,
      graded_at: now()
    };
    await appendPlatformRecord('Homework_Scores', score);
    for (const weakPoint of correction.weakPoints) {
      await appendPlatformRecord('Student_Weak_Points', {
        student_id: req.user.studentId,
        student_name: req.user.name,
        course: req.user.course,
        level: req.user.level,
        skill: req.body.skill || 'general',
        weak_point: weakPoint,
        source_type: 'homework',
        source_id: submission.submission_id,
        recommended_game_id: '',
        recommended_homework_id: '',
        status: 'active',
        updated_at: now()
      });
    }
    res.status(201).json({ submission, correction });
  } catch (error) {
    submission.teacher_review_needed = true;
    res.status(202).json({ submission, correction: null, needsTeacherReview: true, message: error.message });
  }
}));

router.post('/homework/:submissionId/grade', requireRole('admin', 'teacher'), route(async (req, res) => {
  const submissions = await readPlatformSheet('Homework_Submissions');
  const submission = submissions.rows.find((row) => rowValue(row, ['submission_id']) === req.params.submissionId);
  if (!submission) return res.status(404).json({ error: 'Homework submission not found.' });
  if (req.user.role === 'teacher') {
    const ids = await assignedStudentIds(req.user);
    const studentId = String(rowValue(submission, ['student_id'])).trim().toUpperCase();
    if (!ids.has(studentId)) return res.status(403).json({ error: 'Forbidden.' });
  }
  const score = {
    score_id: req.body.score_id || id('HSC'),
    submission_id: req.params.submissionId,
    student_id: rowValue(submission, ['student_id']),
    assignment_id: rowValue(submission, ['assignment_id']),
    skill: req.body.skill || 'general',
    score: Number(req.body.score || 0),
    max_score: Number(req.body.max_score || 100),
    percentage: Number(req.body.percentage ?? req.body.score ?? 0),
    correction_json: json(req.body.correction || {}),
    weak_points: json(req.body.weak_points || []),
    ai_feedback_en: req.body.feedback_en || '',
    ai_feedback_ar: req.body.feedback_ar || '',
    teacher_review_needed: false,
    graded_at: now()
  };
  await appendPlatformRecord('Homework_Scores', score);
  res.status(201).json({ score });
}));

router.get('/homework/results/me', requireRole('student'), route(async (req, res) => {
  res.json(await scopedTab('Homework_Scores', req.user));
}));

router.get('/teachers/me/homework', requireRole('teacher'), route(async (req, res) => {
  const [sheet, ids] = await Promise.all([
    readPlatformSheet('Homework_Submissions'),
    assignedStudentIds(req.user)
  ]);
  res.json({ ...sheet, rows: rowsForStudentIds(sheet.rows, ids) });
}));

router.get('/admin/homework', requireRole('admin'), route(async (_req, res) => {
  const [assignments, submissions, scores] = await Promise.all([
    readPlatformSheet('Homework_Assignments'),
    readPlatformSheet('Homework_Submissions'),
    readPlatformSheet('Homework_Scores')
  ]);
  res.json({ assignments: assignments.rows, submissions: submissions.rows, scores: scores.rows, fetchedAt: now() });
}));

router.get('/students/me/results', requireRole('student'), route(async (req, res) => {
  const [results, certificates, reports] = await Promise.all([
    scopedTab('Test_Results', req.user),
    scopedTab('Certificates', req.user),
    scopedTab('Language_Reports', req.user)
  ]);
  res.json({ results: results.rows, certificates: certificates.rows, reports: reports.rows, fetchedAt: now() });
}));

router.get('/teachers/me/results', requireRole('teacher'), route(async (req, res) => {
  const [sheet, ids] = await Promise.all([
    readPlatformSheet('Test_Results'),
    assignedStudentIds(req.user)
  ]);
  res.json({ ...sheet, rows: rowsForStudentIds(sheet.rows, ids) });
}));

router.get('/teachers/me/students', requireRole('teacher'), route(async (req, res) => {
  const sheet = await readPlatformSheet('Students_Master');
  res.json({ ...sheet, rows: sheet.rows.filter((row) => teacherMatches(row, req.user)) });
}));

router.get('/admin/students', requireRole('admin'), route(async (_req, res) => {
  res.json(await readPlatformSheet('Students_Master'));
}));

router.get('/admin/teachers', requireRole('admin'), route(async (_req, res) => {
  res.json(await readPlatformSheet('Teachers'));
}));

router.get('/admin/results', requireRole('admin'), route(async (_req, res) => {
  res.json(await readPlatformSheet('Test_Results'));
}));

router.post('/tests/sync-google-forms', requireRole('admin'), route(async (req, res) => {
  const responseId = req.body.response_id;
  if (!responseId) return res.status(400).json({ error: 'response_id is required.' });
  const log = await readPlatformSheet('Google_Form_Sync_Log');
  if (log.rows.some((row) => rowValue(row, ['response_id']) === responseId)) {
    return res.json({ duplicate: true, responseId });
  }
  const record = {
    sync_id: id('GFS'),
    form_id: req.body.form_id || '',
    response_id: responseId,
    attempt_id: req.body.attempt_id || '',
    status: 'received',
    message: 'Queued for result processing',
    synced_at: now()
  };
  await appendPlatformRecord('Google_Form_Sync_Log', record);
  res.status(202).json({ duplicate: false, sync: record });
}));

router.get('/games/me', route(async (req, res) => {
  const games = await readPlatformSheet('ESL_Games');
  let rows = games.rows;
  if (req.user.role === 'teacher') rows = rows.filter((row) => teacherMatches(row, req.user));
  if (req.user.role === 'student') {
    const assignments = await readPlatformSheet('ESL_Game_Assignments');
    const allowed = new Set(assignments.rows
      .filter((row) => studentMatches(row, req.user) || rowValue(row, ['group_name']) === req.user.groupName)
      .map((row) => rowValue(row, ['game_id'])));
    rows = rows.filter((row) => allowed.has(rowValue(row, ['game_id'])) && truthy(rowValue(row, ['student_visible'])));
  }
  res.json({ ...games, rows: rows.map((row) => publicRow(row, req.user.role === 'student' ? ['answer_key', 'teacher_notes'] : [])) });
}));

router.get('/games/:gameId', route(async (req, res) => {
  const games = await readPlatformSheet('ESL_Games');
  const row = games.rows.find((item) => rowValue(item, ['game_id']) === req.params.gameId);
  if (!row) return res.status(404).json({ error: 'Game not found.' });
  if (req.user.role === 'teacher' && !teacherMatches(row, req.user)) return res.status(403).json({ error: 'Forbidden.' });
  if (req.user.role === 'student') {
    const assignments = await readPlatformSheet('ESL_Game_Assignments');
    const assigned = assignments.rows.some((item) =>
      rowValue(item, ['game_id']) === req.params.gameId
      && (studentMatches(item, req.user) || rowValue(item, ['group_name']) === req.user.groupName));
    if (!assigned) return res.status(403).json({ error: 'Forbidden.' });
  }
  res.json({ game: publicRow(row, req.user.role === 'student' ? ['answer_key', 'teacher_notes'] : []) });
}));

router.post('/games/generate', requireRole('admin', 'teacher'), route(async (req, res) => {
  if (req.user.role === 'teacher' && req.body.teacherEmail && req.body.teacherEmail !== req.user.email) {
    return res.status(403).json({ error: 'You can only generate games for your own sessions.' });
  }
  const generated = await generateGame(req.body);
  const gameId = id('GAME');
  const record = {
    game_id: gameId,
    curriculum_source: req.body.curriculumSource || 'temporary',
    source_sheet_id: req.body.sourceSheetId || TEMPORARY_CURRICULUM_SHEET_ID,
    source_tab: req.body.sourceTab || 'Curriculum',
    source_row_id: req.body.sourceRowId || '',
    course: req.body.course || '',
    level: req.body.level || '',
    session_number: req.body.sessionNumber || '',
    session_title: req.body.sessionTitle || generated.titleEN,
    group_name: req.body.groupName || '',
    teacher_email: req.user.role === 'teacher' ? req.user.email : req.body.teacherEmail || '',
    game_type: generated.gameType,
    skill: generated.skill,
    title_en: generated.titleEN,
    title_ar: generated.titleAR,
    instructions_en: generated.instructionsEN,
    instructions_ar: generated.instructionsAR,
    game_json: json({ gameId, ...generated }),
    approved: req.user.role === 'admin',
    active: true,
    student_visible: Boolean(req.body.studentVisible),
    teacher_only: !req.body.studentVisible,
    generated_by: req.user.email || req.user.id,
    generated_at: now(),
    updated_at: now()
  };
  await appendPlatformRecord('ESL_Games', record);
  res.status(201).json({ game: { ...record, game_json: parseJson(record.game_json) } });
}));

router.post('/games/bulk-generate', requireRole('admin'), route(async (req, res) => {
  const sessions = Array.isArray(req.body.sessions) ? req.body.sessions.slice(0, 25) : [];
  if (!sessions.length) return res.status(400).json({ error: 'sessions must contain at least one curriculum session.' });
  const created = [];
  for (const session of sessions) {
    const generated = await generateGame(session);
    const gameId = id('GAME');
    const record = {
      game_id: gameId,
      curriculum_source: session.curriculumSource || 'temporary',
      source_sheet_id: session.sourceSheetId || TEMPORARY_CURRICULUM_SHEET_ID,
      source_tab: session.sourceTab || 'Curriculum',
      source_row_id: session.sourceRowId || '',
      course: session.course || '',
      level: session.level || '',
      session_number: session.sessionNumber || '',
      session_title: session.sessionTitle || generated.titleEN,
      group_name: session.groupName || '',
      teacher_email: session.teacherEmail || '',
      game_type: generated.gameType,
      skill: generated.skill,
      title_en: generated.titleEN,
      title_ar: generated.titleAR,
      instructions_en: generated.instructionsEN,
      instructions_ar: generated.instructionsAR,
      game_json: json({ gameId, ...generated }),
      approved: false,
      active: true,
      student_visible: false,
      teacher_only: true,
      generated_by: req.user.email || req.user.id,
      generated_at: now(),
      updated_at: now()
    };
    await appendPlatformRecord('ESL_Games', record);
    created.push({ gameId, title: record.title_en });
  }
  res.status(201).json({ created });
}));

router.post('/games/:gameId/approve', requireRole('admin'), route(async (req, res) => {
  const games = await readPlatformSheet('ESL_Games');
  const game = games.rows.find((row) => rowValue(row, ['game_id']) === req.params.gameId);
  if (!game) return res.status(404).json({ error: 'Game not found.' });
  const updated = {
    ...game,
    approved: req.body.approved !== false,
    active: req.body.active !== false,
    student_visible: Boolean(req.body.student_visible),
    teacher_only: !req.body.student_visible,
    updated_at: now()
  };
  delete updated._rowNumber;
  await updatePlatformRecord('ESL_Games', game._rowNumber, updated);
  res.json({ game: publicRow(updated, ['answer_key']) });
}));

router.post('/games/:gameId/assign', requireRole('admin', 'teacher'), route(async (req, res) => {
  const games = await readPlatformSheet('ESL_Games');
  const game = games.rows.find((row) => rowValue(row, ['game_id']) === req.params.gameId);
  if (!game) return res.status(404).json({ error: 'Game not found.' });
  if (req.user.role === 'teacher' && !teacherCanAccessRow(game, req.user)) {
    return res.status(403).json({ error: 'You can only assign games for your own groups and sessions.' });
  }
  if (req.user.role === 'teacher' && req.body.student_id) {
    const ids = await assignedStudentIds(req.user);
    if (!ids.has(String(req.body.student_id).trim().toUpperCase())) {
      return res.status(403).json({ error: 'The student is not assigned to this teacher.' });
    }
  }
  const assignment = {
    assignment_id: id('GAS'),
    game_id: req.params.gameId,
    student_id: req.body.student_id || '',
    group_name: req.body.group_name || '',
    teacher_email: req.user.role === 'teacher' ? req.user.email : req.body.teacher_email || '',
    active: true,
    assigned_at: now()
  };
  await appendPlatformRecord('ESL_Game_Assignments', assignment);
  res.status(201).json({ assignment });
}));

router.post('/games/:gameId/submit', requireRole('student'), route(async (req, res) => {
  const [games, assignments] = await Promise.all([
    readPlatformSheet('ESL_Games'),
    readPlatformSheet('ESL_Game_Assignments')
  ]);
  const game = games.rows.find((row) => rowValue(row, ['game_id']) === req.params.gameId);
  if (!game) return res.status(404).json({ error: 'Game not found.' });
  const assigned = assignments.rows.some((row) =>
    rowValue(row, ['game_id']) === req.params.gameId
    && (studentMatches(row, req.user)
      || String(rowValue(row, ['group_name'])).toLowerCase() === String(req.user.groupName || '').toLowerCase())
    && truthy(rowValue(row, ['active'])));
  if (!assigned) return res.status(403).json({ error: 'This game is not assigned to your account.' });
  const gameJson = parseJson(rowValue(game, ['game_json']), {});
  const answers = req.body.answers || [];
  const maxScore = (gameJson.items || []).reduce((sum, item) => sum + Number(item.points || 1), 0);
  const score = (gameJson.items || []).reduce((sum, item, index) => {
    return sum + (String(answers[index] ?? '') === String(item.correctAnswer ?? '') ? Number(item.points || 1) : 0);
  }, 0);
  const result = {
    result_id: id('GR'),
    game_id: req.params.gameId,
    student_id: req.user.studentId,
    score,
    max_score: maxScore,
    answers_json: json(answers),
    weak_points: '',
    submitted_at: now()
  };
  await appendPlatformRecord('ESL_Game_Results', result);
  res.status(201).json({ result });
}));

router.get('/games/results/me', requireRole('student'), route(async (req, res) => {
  res.json(await scopedTab('ESL_Game_Results', req.user));
}));

router.get('/games/results/teacher', requireRole('teacher'), route(async (req, res) => {
  const [sheet, ids] = await Promise.all([
    readPlatformSheet('ESL_Game_Results'),
    assignedStudentIds(req.user)
  ]);
  res.json({ ...sheet, rows: rowsForStudentIds(sheet.rows, ids) });
}));

router.get('/games/results/admin', requireRole('admin'), route(async (_req, res) => {
  res.json(await readPlatformSheet('ESL_Game_Results'));
}));

router.post('/revision-quizzes/generate', requireRole('admin', 'teacher'), route(async (req, res) => {
  const generated = await generateRevisionQuiz({ ...req.body, maxQuestions: Math.min(5, Math.max(3, Number(req.body.maxQuestions || 5))) });
  const quizId = id('QUIZ');
  const record = {
    quiz_id: quizId,
    curriculum_source: req.body.curriculumSource || 'temporary',
    course: req.body.course || '',
    level: req.body.level || '',
    group_name: req.body.groupName || '',
    teacher_email: req.user.role === 'teacher' ? req.user.email : req.body.teacherEmail || '',
    session_number: req.body.sessionNumber || '',
    review_session_number: req.body.reviewOfSessionNumber || '',
    quiz_json: json({ quizId, ...generated }),
    active: true,
    created_at: now(),
    updated_at: now()
  };
  await appendPlatformRecord('Revision_Quizzes', record);
  res.status(201).json({ quiz: { ...record, quiz_json: parseJson(record.quiz_json) } });
}));

router.get('/revision-quizzes/me', requireRole('admin', 'teacher'), route(async (req, res) => {
  const sheet = await readPlatformSheet('Revision_Quizzes');
  res.json({ ...sheet, rows: req.user.role === 'admin' ? sheet.rows : sheet.rows.filter((row) => teacherMatches(row, req.user)) });
}));

router.post('/revision-quizzes/:quizId/live', requireRole('admin', 'teacher'), route(async (req, res) => {
  const live = {
    live_session_id: id('LIVE'),
    quiz_id: req.params.quizId,
    group_name: req.body.group_name || '',
    teacher_email: req.user.email || req.body.teacher_email || '',
    join_code: crypto.randomBytes(3).toString('hex').toUpperCase(),
    status: 'active',
    started_at: now(),
    ended_at: ''
  };
  await appendPlatformRecord('Revision_Quiz_Live_Sessions', live);
  res.status(201).json({ live });
}));

router.get('/revision-quizzes/live/:joinCode', requireRole('student'), route(async (req, res) => {
  const liveSessions = await readPlatformSheet('Revision_Quiz_Live_Sessions');
  const live = liveSessions.rows.find((row) =>
    String(rowValue(row, ['join_code'])).toUpperCase() === String(req.params.joinCode).toUpperCase()
    && String(rowValue(row, ['status'])).toLowerCase() === 'active');
  if (!live) return res.status(404).json({ error: 'Live quiz not found or already ended.' });
  const quizzes = await readPlatformSheet('Revision_Quizzes');
  const quiz = quizzes.rows.find((row) => rowValue(row, ['quiz_id']) === rowValue(live, ['quiz_id']));
  if (!quiz) return res.status(404).json({ error: 'Quiz not found.' });
  const quizJson = parseJson(rowValue(quiz, ['quiz_json']), {});
  const studentQuiz = {
    ...quizJson,
    questions: (quizJson.questions || []).map(({ correctAnswer, teacherOnlyNote, ...question }) => question)
  };
  delete studentQuiz.answerKeyTeacherOnly;
  res.json({
    liveSessionId: rowValue(live, ['live_session_id']),
    quizId: rowValue(quiz, ['quiz_id']),
    quiz: studentQuiz
  });
}));

router.post('/revision-quizzes/live/:joinCode/submit', requireRole('student'), route(async (req, res) => {
  const liveSessions = await readPlatformSheet('Revision_Quiz_Live_Sessions');
  const live = liveSessions.rows.find((row) =>
    String(rowValue(row, ['join_code'])).toUpperCase() === String(req.params.joinCode).toUpperCase()
    && String(rowValue(row, ['status'])).toLowerCase() === 'active');
  if (!live) return res.status(404).json({ error: 'Live quiz not found or already ended.' });
  const quizzes = await readPlatformSheet('Revision_Quizzes');
  const quiz = quizzes.rows.find((row) => rowValue(row, ['quiz_id']) === rowValue(live, ['quiz_id']));
  if (!quiz) return res.status(404).json({ error: 'Quiz not found.' });
  const quizJson = parseJson(rowValue(quiz, ['quiz_json']), {});
  const answers = req.body.answers || [];
  const maxScore = (quizJson.questions || []).reduce((sum, item) => sum + Number(item.points || 1), 0);
  const score = (quizJson.questions || []).reduce((sum, item, index) =>
    sum + (String(answers[index] ?? '') === String(item.correctAnswer ?? '') ? Number(item.points || 1) : 0), 0);
  const result = {
    result_id: id('RQR'),
    live_session_id: rowValue(live, ['live_session_id']),
    quiz_id: rowValue(quiz, ['quiz_id']),
    student_id: req.user.studentId,
    score,
    max_score: maxScore,
    answers_json: json(answers),
    submitted_at: now()
  };
  await appendPlatformRecord('Revision_Quiz_Results', result);
  res.status(201).json({ result });
}));

router.get('/practice/me', requireRole('student'), route(async (req, res) => {
  const [weakPoints, practice] = await Promise.all([
    scopedTab('Student_Weak_Points', req.user),
    scopedTab('Extra_Practice', req.user)
  ]);
  res.json({ weakPoints: weakPoints.rows, practice: practice.rows, fetchedAt: now() });
}));

router.post('/payments', requireRole('student'), route(async (req, res) => {
  const course = req.body.course || req.user.course;
  const plan = req.body.plan || 'monthly';
  const amount = paymentAmount(course, plan);
  if (!amount) return res.status(400).json({ error: 'The selected payment plan is not available for this course.' });
  const payment = {
    payment_id: id('PAY'),
    student_id: req.user.studentId,
    student_name: req.user.name,
    course,
    level: req.body.level || req.user.level,
    plan,
    amount,
    currency: req.body.currency || 'EGP',
    method: req.body.method || 'manual',
    transaction_reference: req.body.transaction_reference || '',
    status: 'pending',
    proof_url: req.body.proof_url || '',
    admin_note: '',
    created_at: now(),
    approved_at: ''
  };
  await appendPlatformRecord('Payment_Requests', payment);
  res.status(201).json({ payment });
}));

router.get('/payments/me', requireRole('student'), route(async (req, res) => {
  res.json(await scopedTab('Payment_Requests', req.user));
}));

router.get('/admin/payments', requireRole('admin'), route(async (_req, res) => {
  res.json(await readPlatformSheet('Payment_Requests'));
}));

router.patch('/admin/payments/:rowNumber', requireRole('admin'), route(async (req, res) => {
  const sheet = await readPlatformSheet('Payment_Requests');
  const current = sheet.rows.find((row) => row._rowNumber === Number(req.params.rowNumber));
  if (!current) return res.status(404).json({ error: 'Payment not found.' });
  const updated = {
    ...current,
    status: req.body.status || current.status,
    admin_note: req.body.admin_note ?? current.admin_note,
    approved_at: req.body.status === 'approved' ? now() : current.approved_at
  };
  delete updated._rowNumber;
  await updatePlatformRecord('Payment_Requests', Number(req.params.rowNumber), updated);
  res.json({ payment: updated });
}));

export default router;
