import { apiRequest } from './apiClient';

export const appsScriptApi = {
  health: () => apiRequest('/api/apps-script/health'),
  students: () => apiRequest('/api/apps-script/students'),
  student: (studentId) => apiRequest(`/api/apps-script/student/${studentId}`),
  updateAttendance: (payload) => apiRequest('/api/apps-script/attendance', { method: 'POST', body: JSON.stringify(payload) }),
  updateHomework: (payload) => apiRequest('/api/apps-script/homework', { method: 'POST', body: JSON.stringify(payload) }),
  upsertStudent: (student) => apiRequest('/api/apps-script/students', { method: 'POST', body: JSON.stringify({ student }) })
};
