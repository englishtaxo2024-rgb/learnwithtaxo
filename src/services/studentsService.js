import { appsScriptApi } from './appsScriptApi';
import { mockStudents } from '../data/mockStudents';

export async function getStudents() {
  try {
    const data = await appsScriptApi.students();
    return data.students || data || mockStudents;
  } catch {
    return mockStudents;
  }
}

export async function getStudent(id) {
  try {
    const data = await appsScriptApi.student(id);
    return data.student || data;
  } catch {
    return mockStudents.find((student) => student.id === id) || mockStudents[0];
  }
}
