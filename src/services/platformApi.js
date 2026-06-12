import { apiRequest } from './apiClient';

export const platformApi = {
  dashboard: () => apiRequest('/api/dashboard'),
  get: (path) => apiRequest(path),
  post: (path, payload) => apiRequest(path, { method: 'POST', body: JSON.stringify(payload || {}) }),
  upload: (path, formData) => apiRequest(path, { method: 'POST', body: formData }),
  patch: (path, payload) => apiRequest(path, { method: 'PATCH', body: JSON.stringify(payload || {}) }),
  ensureSheets: () => apiRequest('/api/admin/system/ensure-sheets', { method: 'POST', body: '{}' }),
  temporaryCurriculum: (role) => apiRequest(role === 'admin' ? '/api/curriculum/temporary' : '/api/curriculum/temporary/me'),
  availability: () => apiRequest('/api/availability/me'),
  saveAvailability: (payload) => apiRequest('/api/availability', { method: 'POST', body: JSON.stringify(payload) }),
  schedule: () => apiRequest('/api/schedule/me'),
  materials: () => apiRequest('/api/materials/me'),
  homework: () => apiRequest('/api/homework/me'),
  results: (role) => apiRequest(role === 'admin' ? '/api/admin/results' : role === 'teacher' ? '/api/teachers/me/results' : '/api/students/me/results'),
  games: () => apiRequest('/api/games/me'),
  revisionQuizzes: () => apiRequest('/api/revision-quizzes/me'),
  practice: () => apiRequest('/api/practice/me')
};
