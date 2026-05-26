import { ROLES } from '../config/roles';

export function canAccess(user, area) {
  if (!area) return true;
  if (!user) return false;
  if (user.role === ROLES.OWNER) return true;
  if (area === 'student') return user.role === ROLES.STUDENT;
  if (area === 'teacher') return user.role === ROLES.TEACHER;
  if (area === 'admin') return user.role === ROLES.ADMIN;
  return false;
}

export function getDefaultPath(role) {
  if (role === ROLES.TEACHER) return '/teacher';
  if (role === ROLES.ADMIN || role === ROLES.OWNER) return '/admin';
  return '/student';
}
