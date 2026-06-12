import { googleConfigured } from './googleWorkspace.js';
import {
  activeValue,
  readPlatformSheet,
  rowValue,
  systemSpreadsheetId
} from './platformSheets.js';

function list(value) {
  if (Array.isArray(value)) return value;
  return String(value || '').split(/[|,]/).map((item) => item.trim()).filter(Boolean);
}

export function sheetsDirectoryConfigured() {
  if (!googleConfigured()) return false;
  try {
    return Boolean(systemSpreadsheetId());
  } catch {
    return false;
  }
}

function normalizeEmail(value = '') {
  return String(value).trim().toLowerCase();
}

function normalizePhone(value = '') {
  return String(value).replace(/[^0-9+]/g, '').trim();
}

function normalizedIdentifier(value = '') {
  const text = String(value).trim();
  if (text.includes('@')) return normalizeEmail(text);
  return normalizePhone(text) || text.toUpperCase();
}

export async function findDirectoryUser(role, identifier) {
  if (!sheetsDirectoryConfigured()) return null;
  const target = normalizedIdentifier(identifier);
  const tabName = role === 'teacher' ? 'Teachers' : 'Students_Master';
  const sheet = await readPlatformSheet(tabName);
  const row = sheet.rows.find((candidate) => {
    if (!activeValue(rowValue(candidate, ['active', 'status']))) return false;
    const values = role === 'teacher'
      ? [
          rowValue(candidate, ['teacher_id', 'id']),
          rowValue(candidate, ['email', 'teacher_email']),
          rowValue(candidate, ['phone'])
        ]
      : [
          rowValue(candidate, ['student_id', 'id']),
          rowValue(candidate, ['email', 'student_email']),
          rowValue(candidate, ['parent_email']),
          rowValue(candidate, ['phone', 'parent_phone'])
        ];
    return values.some((value) => normalizedIdentifier(value) === target);
  });
  if (!row) return null;

  if (role === 'teacher') {
    return {
      id: rowValue(row, ['teacher_id', 'id']),
      name: rowValue(row, ['name', 'teacher_name', 'teacher']),
      email: normalizeEmail(rowValue(row, ['email', 'teacher_email'])),
      phone: normalizePhone(rowValue(row, ['phone'])),
      currentGroups: list(rowValue(row, ['groups', 'group_name', 'teacher_groups'])),
      levels: list(rowValue(row, ['levels', 'level'])),
      courses: list(rowValue(row, ['courses', 'course'])),
      currentSchedule: list(rowValue(row, ['schedule'])),
      active: true,
      authEligible: true,
      source: 'google-sheets',
      sourceRow: row._rowNumber
    };
  }

  return {
    id: rowValue(row, ['student_id', 'id']),
    name: rowValue(row, ['student_name', 'name']),
    email: normalizeEmail(rowValue(row, ['email', 'student_email'])),
    parentEmail: normalizeEmail(rowValue(row, ['parent_email'])),
    phone: normalizePhone(rowValue(row, ['phone', 'parent_phone'])),
    course: rowValue(row, ['course']),
    level: rowValue(row, ['level']),
    groupId: rowValue(row, ['group_id']),
    groupName: rowValue(row, ['group_name', 'group']),
    teacherId: rowValue(row, ['teacher_id']),
    teacher: rowValue(row, ['teacher', 'teacher_name']),
    schedule: rowValue(row, ['schedule', 'class_time']),
    paymentStatus: rowValue(row, ['payment_status', 'financial_status']),
    active: true,
    authEligible: true,
    source: 'google-sheets',
    sourceRow: row._rowNumber
  };
}
