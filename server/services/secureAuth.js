import crypto from 'crypto';
import { mutateDb } from './store.js';
import { findDirectoryUser, sheetsDirectoryConfigured } from './directoryService.js';
import {
  appendPlatformRecord,
  readPlatformSheet,
  rowValue,
  updatePlatformRecord
} from './platformSheets.js';

export const ADMIN_EMAIL = 'sagafinearts@gmail.com';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

export function normalizeEmail(value = '') {
  return String(value).trim().toLowerCase();
}

export function normalizePhone(value = '') {
  return String(value).replace(/[^0-9+]/g, '').trim();
}

export function normalizeIdentifier(value = '') {
  const text = String(value).trim();
  if (text.includes('@')) return normalizeEmail(text);
  return normalizePhone(text) || text.toUpperCase();
}

export function ensureAuthData(db) {
  db.admins = [{ id: 'admin-saga', email: ADMIN_EMAIL, name: 'Learn with Taxo Admin', role: 'admin', active: true }];
  db.teachers ||= [];
  db.students ||= [];
  db.authCodes ||= [];
  db.sessions ||= {};
  return db;
}

function hashCode(code, salt = crypto.randomBytes(16).toString('hex')) {
  return `${salt}:${crypto.scryptSync(String(code), salt, 64).toString('hex')}`;
}

function verifyCode(code, storedHash) {
  if (!code || !storedHash || !storedHash.includes(':')) return false;
  const [salt, expectedHex] = storedHash.split(':');
  const actual = crypto.scryptSync(String(code), salt, 64);
  const expected = Buffer.from(expectedHex, 'hex');
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function hashToken(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
}

function comparePlain(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

export function authEligible(record) {
  return record?.active !== false && record?.blocked !== true && record?.authEligible === true;
}

function matchTeacher(db, identifier) {
  const normalized = normalizeIdentifier(identifier);
  return db.teachers.find((teacher) => authEligible(teacher) && [
    normalizeEmail(teacher.email),
    normalizePhone(teacher.phone),
    String(teacher.id || '').toUpperCase()
  ].includes(normalized));
}

function matchStudent(db, identifier) {
  const normalized = normalizeIdentifier(identifier);
  return db.students.find((student) => authEligible(student) && [
    normalizeEmail(student.email),
    normalizeEmail(student.parentEmail),
    normalizePhone(student.phone),
    String(student.id || '').toUpperCase()
  ].includes(normalized));
}

export function safeProfile(record, role) {
  if (!record) return null;
  if (role === 'admin') return { id: record.id, email: record.email, name: record.name, role, active: true };
  if (role === 'teacher') return {
    id: record.id,
    email: record.email || '',
    phone: record.phone || '',
    name: record.name,
    role,
    active: record.active !== false,
    groups: record.currentGroups || record.groups || [],
    levels: record.levels || [],
    courses: record.courses || [],
    schedule: record.currentSchedule || record.schedule || []
  };
  return {
    id: record.id,
    studentId: record.id,
    email: record.email || record.parentEmail || '',
    parentEmail: record.parentEmail || '',
    phone: record.phone || '',
    name: record.name,
    role,
    active: record.active !== false,
    course: record.course || '',
    level: record.level || '',
    groupId: record.groupId || '',
    groupName: record.groupName || '',
    teacherId: record.teacherId || '',
    teacher: record.teacher || '',
    nextSession: record.nextSession || ''
  };
}

function findCode(db, role, userId) {
  return db.authCodes.find((entry) => entry.role === role && entry.userId === userId && entry.active !== false);
}

async function sheetCode(role, userId) {
  if (!sheetsDirectoryConfigured()) return null;
  let sheet;
  try {
    sheet = await readPlatformSheet('Auth_Codes');
  } catch (error) {
    if (error?.response?.status === 400 || error?.code === 400) return null;
    throw error;
  }
  const row = sheet.rows.find((entry) =>
    String(rowValue(entry, ['role'])).toLowerCase() === role
    && String(rowValue(entry, ['user_id'])).toUpperCase() === String(userId).toUpperCase()
    && !['false', '0', 'inactive', 'blocked'].includes(String(rowValue(entry, ['active'])).toLowerCase()));
  return row ? { hash: rowValue(row, ['code_hash']), rowNumber: row._rowNumber } : null;
}

export async function loginWithRole({ identifier, email, accessCode, password, requestedRole, role }) {
  const requested = String(requestedRole || role || '').toLowerCase();
  const loginId = identifier || email;
  const code = accessCode || password;
  if (!['admin', 'teacher', 'student'].includes(requested)) return { status: 400, error: 'Please choose a valid portal.' };
  if (!loginId || !code) return { status: 400, error: 'Identifier and access code are required.' };

  const directoryRecord = requested === 'admin' ? null : await findDirectoryUser(requested, loginId);
  const targetId = requested === 'admin' ? 'admin-saga' : directoryRecord?.id;
  const sheetsCode = targetId ? await sheetCode(requested, targetId) : null;

  return mutateDb((db) => {
    ensureAuthData(db);
    let record;
    if (requested === 'admin') {
      if (normalizeEmail(loginId) !== ADMIN_EMAIL) {
        return { status: 401, error: 'This account was not found. Please check your details or contact support.' };
      }
      record = db.admins[0];
      const stored = sheetsCode || findCode(db, 'admin', record.id);
      const envCode = process.env.ADMIN_ACCESS_CODE;
      const ok = stored ? verifyCode(code, stored.hash) : Boolean(envCode && comparePlain(code, envCode));
      if (!ok) return { status: envCode || stored ? 401 : 503, error: envCode || stored ? 'Invalid code or password.' : 'Admin access is not configured on the server.' };
    } else {
      if (directoryRecord) {
        const collection = requested === 'teacher' ? db.teachers : db.students;
        const index = collection.findIndex((item) => item.id === directoryRecord.id);
        if (index >= 0) collection[index] = { ...collection[index], ...directoryRecord };
        else collection.push(directoryRecord);
        record = directoryRecord;
      } else if (!sheetsDirectoryConfigured()) {
        record = requested === 'teacher' ? matchTeacher(db, loginId) : matchStudent(db, loginId);
      }
      if (!record) return { status: 401, error: 'This account was not found. Please check your details or contact support.' };
      const stored = sheetsCode || findCode(db, requested, record.id);
      if (!stored || !verifyCode(code, stored.hash)) return { status: 401, error: 'Invalid code or password.' };
    }

    const token = crypto.randomBytes(32).toString('base64url');
    db.sessions[hashToken(token)] = {
      role: requested,
      userId: record.id,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString()
    };
    return { status: 200, success: true, token, role: requested, user: safeProfile(record, requested), redirectPath: `/${requested}` };
  });
}

export async function userFromSession(token) {
  if (!token) return null;
  const session = await mutateDb((db) => {
    ensureAuthData(db);
    const key = hashToken(token);
    const stored = db.sessions[key];
    if (!stored) return null;
    if (Date.parse(stored.expiresAt) <= Date.now()) {
      delete db.sessions[key];
      return null;
    }
    return { ...stored };
  });
  if (!session) return null;
  if (session.role === 'admin') {
    return safeProfile({ id: 'admin-saga', email: ADMIN_EMAIL, name: 'Learn with Taxo Admin' }, 'admin');
  }
  if (sheetsDirectoryConfigured()) {
    const record = await findDirectoryUser(session.role, session.userId);
    return record ? safeProfile(record, session.role) : null;
  }
  return mutateDb((db) => {
    ensureAuthData(db);
    const record = session.role === 'teacher'
      ? db.teachers.find((teacher) => teacher.id === session.userId && authEligible(teacher))
      : db.students.find((student) => student.id === session.userId && authEligible(student));
    return safeProfile(record, session.role);
  });
}

export async function logoutSession(token) {
  if (!token) return;
  await mutateDb((db) => {
    ensureAuthData(db);
    delete db.sessions[hashToken(token)];
  });
}

export function generateAccessCode() {
  return crypto.randomBytes(8).toString('base64url').replace(/[-_]/g, '').slice(0, 10).toUpperCase();
}

export async function resetAccessCode({ role, userId, code }) {
  if (!['admin', 'teacher', 'student'].includes(role)) throw new Error('Invalid role');
  const plainCode = code || generateAccessCode();
  const directoryRecord = role === 'admin' ? null : await findDirectoryUser(role, userId);
  if (role !== 'admin' && sheetsDirectoryConfigured() && !directoryRecord) {
    throw new Error('Active Google Sheets user not found');
  }
  const nextHash = hashCode(plainCode);

  if (sheetsDirectoryConfigured()) {
    const current = await sheetCode(role, userId);
    const record = {
      role,
      user_id: userId,
      code_hash: nextHash,
      active: true,
      updated_at: new Date().toISOString()
    };
    if (current) await updatePlatformRecord('Auth_Codes', current.rowNumber, record);
    else await appendPlatformRecord('Auth_Codes', record);
  }

  await mutateDb((db) => {
    ensureAuthData(db);
    if (directoryRecord) {
      const collection = role === 'teacher' ? db.teachers : db.students;
      const index = collection.findIndex((item) => item.id === directoryRecord.id);
      if (index >= 0) collection[index] = { ...collection[index], ...directoryRecord };
      else collection.push(directoryRecord);
    }
    const allowed = role === 'admin'
      ? userId === 'admin-saga'
      : role === 'teacher'
        ? db.teachers.some((teacher) => teacher.id === userId && authEligible(teacher))
        : db.students.some((student) => student.id === userId && authEligible(student));
    if (!allowed) throw new Error('Active imported user not found');
    db.authCodes = db.authCodes.filter((entry) => !(entry.role === role && entry.userId === userId));
    if (!sheetsDirectoryConfigured()) {
      db.authCodes.push({ role, userId, hash: nextHash, active: true, updatedAt: new Date().toISOString() });
    }
  });
  return plainCode;
}
