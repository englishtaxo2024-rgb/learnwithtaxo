import {
  appendRecord,
  ensureColumns,
  findRows,
  normalizeHeader,
  readSheet,
  updateRow
} from './googleWorkspace.js';

export const TEMPORARY_CURRICULUM_SHEET_ID =
  process.env.TEMPORARY_CURRICULUM_SHEET_ID || '1WjUrfjwJgj214wSTWbmroxlrEJYgxyiYHGZD5bT6QWo';

export const SHEET_SCHEMAS = {
  Admins: ['admin_id', 'name', 'email', 'active', 'updated_at'],
  Teachers: ['teacher_id', 'name', 'email', 'phone', 'groups', 'levels', 'courses', 'schedule', 'active', 'updated_at'],
  Students_Master: ['student_id', 'student_name', 'email', 'parent_email', 'phone', 'course', 'level', 'group_name', 'teacher', 'active', 'updated_at'],
  Auth_Codes: ['role', 'user_id', 'code_hash', 'active', 'updated_at'],
  Teacher_Availability: ['availability_id', 'teacher_id', 'teacher_email', 'teacher_name', 'course', 'level', 'day', 'start_time', 'end_time', 'slot_type', 'capacity', 'status', 'updated_at'],
  Appointments: ['appointment_id', 'student_id', 'teacher_id', 'course', 'level', 'day', 'start_time', 'end_time', 'status', 'created_at', 'updated_at'],
  Attendance: ['attendance_id', 'student_id', 'student_name', 'teacher_id', 'teacher_email', 'group_name', 'session', 'status', 'homework_score', 'participation_score', 'camera_status', 'notes', 'marked_at'],
  Placement_Codes: ['code_id', 'code_hash', 'attempt_token_hash', 'student_id', 'student_name', 'status', 'expires_at', 'opened_at', 'completed_at', 'created_by', 'created_at'],
  Placement_Results: ['result_id', 'code_id', 'student_id', 'student_name', 'language', 'answers_json', 'audio_urls', 'score', 'recommended_course', 'recommended_level', 'status', 'submitted_at'],
  Payment_Requests: ['payment_id', 'student_id', 'student_name', 'course', 'level', 'plan', 'amount', 'currency', 'method', 'transaction_reference', 'status', 'proof_url', 'admin_note', 'created_at', 'approved_at'],
  Materials_Index: ['material_id', 'curriculum_source', 'course', 'level', 'session', 'group_name', 'teacher_email', 'material_type', 'title', 'file_url', 'drive_file_id', 'viewer_type', 'visible_to_teacher', 'visible_to_student', 'active', 'created_at', 'updated_at'],
  Homework_Assignments: ['assignment_id', 'curriculum_source', 'course', 'level', 'session', 'group_name', 'teacher_email', 'skill', 'title_en', 'title_ar', 'instructions_en', 'instructions_ar', 'questions_json', 'due_date', 'active', 'created_at'],
  Homework_Submissions: ['submission_id', 'assignment_id', 'student_id', 'student_name', 'answers_json', 'answer_text', 'audio_url', 'file_url', 'status', 'submitted_at', 'teacher_review_needed'],
  Homework_Scores: ['score_id', 'submission_id', 'student_id', 'assignment_id', 'skill', 'score', 'max_score', 'percentage', 'correction_json', 'weak_points', 'ai_feedback_en', 'ai_feedback_ar', 'teacher_review_needed', 'graded_at'],
  Test_Attempts: ['attempt_id', 'student_id', 'test_id', 'course', 'level', 'status', 'started_at', 'completed_at'],
  Test_Results: ['result_id', 'attempt_id', 'student_id', 'course', 'level', 'score', 'pass', 'skills_json', 'recommended_level', 'created_at'],
  Google_Form_Sync_Log: ['sync_id', 'form_id', 'response_id', 'attempt_id', 'status', 'message', 'synced_at'],
  Certificates: ['certificate_id', 'student_id', 'attempt_id', 'file_id', 'file_url', 'verification_code', 'created_at'],
  Language_Reports: ['report_id', 'student_id', 'attempt_id', 'file_id', 'file_url', 'report_json', 'needs_review', 'created_at'],
  ESL_Games: ['game_id', 'curriculum_source', 'source_sheet_id', 'source_tab', 'source_row_id', 'course', 'level', 'session_number', 'session_title', 'group_name', 'teacher_email', 'game_type', 'skill', 'title_en', 'title_ar', 'instructions_en', 'instructions_ar', 'game_json', 'approved', 'active', 'student_visible', 'teacher_only', 'generated_by', 'generated_at', 'updated_at'],
  ESL_Game_Assignments: ['assignment_id', 'game_id', 'student_id', 'group_name', 'teacher_email', 'active', 'assigned_at'],
  ESL_Game_Results: ['result_id', 'game_id', 'student_id', 'score', 'max_score', 'answers_json', 'weak_points', 'submitted_at'],
  Revision_Quizzes: ['quiz_id', 'curriculum_source', 'course', 'level', 'group_name', 'teacher_email', 'session_number', 'review_session_number', 'quiz_json', 'active', 'created_at', 'updated_at'],
  Revision_Quiz_Live_Sessions: ['live_session_id', 'quiz_id', 'group_name', 'teacher_email', 'join_code', 'status', 'started_at', 'ended_at'],
  Revision_Quiz_Results: ['result_id', 'live_session_id', 'quiz_id', 'student_id', 'score', 'max_score', 'answers_json', 'submitted_at'],
  Student_Weak_Points: ['student_id', 'student_name', 'course', 'level', 'skill', 'weak_point', 'source_type', 'source_id', 'recommended_game_id', 'recommended_homework_id', 'status', 'updated_at'],
  Extra_Practice: ['practice_id', 'student_id', 'source_type', 'source_id', 'title_en', 'title_ar', 'practice_json', 'active', 'created_at'],
  Practice_Submissions: ['submission_id', 'practice_id', 'student_id', 'score', 'answers_json', 'submitted_at'],
  Audit_Log: ['audit_id', 'actor_id', 'actor_role', 'action', 'target_id', 'details_json', 'created_at'],
  Sync_Log: ['sync_id', 'source', 'status', 'rows_read', 'rows_written', 'message', 'created_at'],
  Failed_Jobs: ['job_id', 'job_type', 'payload_json', 'error', 'status', 'created_at', 'updated_at']
};

export function systemSpreadsheetId() {
  const id = process.env.GOOGLE_SYSTEM_SPREADSHEET_ID;
  if (!id) {
    const error = new Error('GOOGLE_SYSTEM_SPREADSHEET_ID is not configured.');
    error.status = 503;
    throw error;
  }
  return id;
}

export function rowValue(row, aliases = []) {
  for (const alias of aliases) {
    const value = row[normalizeHeader(alias)];
    if (value !== undefined && value !== null && String(value).trim() !== '') return value;
  }
  return '';
}

export function truthy(value) {
  return ['true', 'yes', '1', 'active', 'approved', 'paid', 'paid-active'].includes(String(value || '').trim().toLowerCase());
}

export function activeValue(value) {
  const normalized = String(value ?? '').trim().toLowerCase();
  return !['false', 'no', '0', 'inactive', 'blocked', 'disabled'].includes(normalized);
}

export async function readPlatformSheet(tabName, options = {}) {
  const spreadsheetId = options.spreadsheetId || systemSpreadsheetId();
  return readSheet(spreadsheetId, tabName);
}

export async function appendPlatformRecord(tabName, record, options = {}) {
  const columns = options.columns || SHEET_SCHEMAS[tabName];
  if (!columns) throw new Error(`No schema is registered for ${tabName}.`);
  return appendRecord(options.spreadsheetId || systemSpreadsheetId(), tabName, record, columns);
}

export async function updatePlatformRecord(tabName, rowNumber, record, options = {}) {
  const columns = options.columns || SHEET_SCHEMAS[tabName];
  return updateRow(options.spreadsheetId || systemSpreadsheetId(), tabName, rowNumber, record, columns);
}

export async function findPlatformRows(tabName, filters, options = {}) {
  return findRows(options.spreadsheetId || systemSpreadsheetId(), tabName, filters);
}

export async function ensurePlatformSheets() {
  const spreadsheetId = systemSpreadsheetId();
  const results = [];
  for (const [tabName, columns] of Object.entries(SHEET_SCHEMAS)) {
    await ensureColumns(spreadsheetId, tabName, columns);
    results.push({ tabName, columns: columns.length });
  }
  return results;
}

export function teacherMatches(row, user) {
  const email = String(rowValue(row, ['teacher_email', 'email'])).trim().toLowerCase();
  const teacherId = String(rowValue(row, ['teacher_id'])).trim().toUpperCase();
  const teacherName = String(rowValue(row, ['teacher', 'teacher_name', 'teacher_groups'])).toLowerCase();
  const groups = Array.isArray(user.groups) ? user.groups.join(' ') : String(user.groups || '');
  return Boolean(
    (email && email === String(user.email || '').toLowerCase()) ||
    (teacherId && teacherId === String(user.id || '').toUpperCase()) ||
    (teacherName && user.name && teacherName.includes(String(user.name).toLowerCase())) ||
    (groups && teacherName && groups.toLowerCase().split(/[|,]/).some((group) => group.trim() && teacherName.includes(group.trim())))
  );
}

export function studentMatches(row, user) {
  const studentId = String(rowValue(row, ['student_id'])).trim().toUpperCase();
  return studentId && studentId === String(user.studentId || user.id || '').trim().toUpperCase();
}

export function scopeRows(rows, user, options = {}) {
  if (user.role === 'admin') return rows;
  if (user.role === 'teacher') return rows.filter((row) => teacherMatches(row, user));
  if (options.allowStudent === false) return [];
  return rows.filter((row) => studentMatches(row, user));
}
