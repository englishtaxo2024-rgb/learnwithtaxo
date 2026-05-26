import { mockTeachers } from '../data/mockTeachers';

export async function getTeachers() {
  return mockTeachers;
}

export function filterEligibleTeachers({ course, level, age }) {
  return mockTeachers.filter((teacher) =>
    teacher.visible &&
    !teacher.blocked &&
    teacher.courses.some((teacherCourse) => course?.includes(teacherCourse) || teacherCourse.includes(course || '')) &&
    teacher.levels.some((teacherLevel) => level?.includes(teacherLevel) || teacherLevel.includes(level || '')) &&
    age !== undefined
  );
}
