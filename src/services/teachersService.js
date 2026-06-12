import { platformApi } from './platformApi';

export async function getTeachers() {
  const data = await platformApi.get('/api/admin/teachers');
  return data.teachers || data.rows || [];
}

export function filterEligibleTeachers(teachers, { course, level, age }) {
  return teachers.filter((teacher) =>
    teacher.visible &&
    !teacher.blocked &&
    (teacher.courses || []).some((teacherCourse) => course?.includes(teacherCourse) || teacherCourse.includes(course || '')) &&
    (teacher.levels || []).some((teacherLevel) => level?.includes(teacherLevel) || teacherLevel.includes(level || '')) &&
    age !== undefined
  );
}
