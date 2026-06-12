import { platformApi } from './platformApi';

export async function getStudents() {
  const data = await platformApi.get('/api/admin/students');
  return data.students || data.rows || [];
}

export async function getStudent(id) {
  const students = await getStudents();
  return students.find((student) => String(student.id || student.student_id) === String(id)) || null;
}
