import { apiRequest } from './apiClient';

export const assetsService = {
  list: () => apiRequest('/api/assets'),
  patch: (id, data) => apiRequest(`/api/assets/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id) => apiRequest(`/api/assets/${id}`, { method: 'DELETE' })
};
