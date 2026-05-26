const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

function token() {
  return localStorage.getItem('taxo_token');
}

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';
  if (token()) headers.Authorization = `Bearer ${token()}`;
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed: ${response.status}`);
  return data;
}

export const recordsApi = {
  login: async (email, password) => {
    const data = await request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    localStorage.setItem('taxo_token', data.token);
    return data;
  },
  logout: async () => {
    try { await request('/api/auth/logout', { method: 'POST' }); } finally { localStorage.removeItem('taxo_token'); }
  },
  me: () => request('/api/auth/me'),
  bootstrap: () => request('/api/records/bootstrap'),
  publicPlacementSettings: () => request('/api/records/placement/settings-public'),
  submitPlacement: (payload, audioMap = {}, files = []) => {
    const form = new FormData();
    const audioQuestionIds = [];
    Object.entries(audioMap).forEach(([questionId, blob]) => {
      if (!blob) return;
      audioQuestionIds.push(questionId);
      form.append('audio', blob, `${questionId}.webm`);
    });
    [...files].forEach((file) => form.append('files', file));
    form.append('payload', JSON.stringify({ ...payload, audio_question_ids: audioQuestionIds }));
    return request('/api/records/placement/submissions', { method: 'POST', body: form });
  },
  upsertStudent: (student) => request('/api/records/students', { method: 'POST', body: JSON.stringify(student) }),
  upsertTeacher: (teacher) => request('/api/records/teachers', { method: 'POST', body: JSON.stringify(teacher) }),
  importCsv: (kind, file) => {
    const form = new FormData();
    form.append('file', file);
    return request(`/api/records/import/${kind}`, { method: 'POST', body: form });
  },
  syncGoogleStudents: () => request('/api/records/sync/google-students', { method: 'POST' }),
  uploadMaterial: (payload) => {
    const form = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === 'slides') [...value].forEach((file) => form.append('slides', file));
      else if (value) form.append(key, value);
    });
    return request('/api/records/materials', { method: 'POST', body: form });
  },
  submitPayment: (payload) => {
    const form = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === 'proof' && value) form.append('proof', value);
      else if (value != null) form.append(key, value);
    });
    return request('/api/records/payments', { method: 'POST', body: form });
  },
  reviewPayment: (id, payload) => request(`/api/records/payments/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  reviewPlacement: (id, payload) => request(`/api/records/placement/submissions/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  updatePlacementSettings: (payload) => request('/api/records/placement/settings', { method: 'PATCH', body: JSON.stringify(payload) }),
  submitFeedback: (payload) => request('/api/records/feedback', { method: 'POST', body: JSON.stringify(payload) }),
  submitHomework: (payload) => request('/api/records/homework', { method: 'POST', body: JSON.stringify(payload) })
};
