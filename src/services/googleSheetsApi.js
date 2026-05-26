import { apiRequest } from './apiClient';

export const googleSheetsApi = {
  status: () => apiRequest('/api/data-sources/status'),
  syncCurriculum: () => apiRequest('/api/sync/curriculum', { method: 'POST' }),
  syncSchedule: () => apiRequest('/api/sync/schedule', { method: 'POST' }),
  syncNewApplications: () => apiRequest('/api/sync/new-applications', { method: 'POST' }),
  syncAll: () => apiRequest('/api/sync/all', { method: 'POST' })
};
