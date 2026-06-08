const API_ROOT = '/api/placement';

async function request(path, options = {}) {
  const response = await fetch(`${API_ROOT}${path}`, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const error = new Error('The secure placement service is not active yet. Please contact English Taxo.');
    error.code = 'SERVICE_UNAVAILABLE';
    throw error;
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || 'We could not complete that request.');
    error.code = payload.code;
    throw error;
  }
  return payload;
}

export const placementApi = {
  verifyCode(accessCode) {
    return request('/verify', { method: 'POST', body: JSON.stringify({ accessCode }) });
  },
  start(sessionToken) {
    return request('/start', { method: 'POST', body: JSON.stringify({ sessionToken }) });
  },
  saveAnswer(sessionToken, answer) {
    return request('/answer', { method: 'POST', body: JSON.stringify({ sessionToken, answer }) });
  },
  async uploadRecording(sessionToken, questionId, blob) {
    const form = new FormData();
    form.append('sessionToken', sessionToken);
    form.append('questionId', questionId);
    form.append('recording', blob, `${questionId}.webm`);
    const response = await fetch(`${API_ROOT}/recording`, { method: 'POST', credentials: 'same-origin', body: form });
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) throw new Error('The secure placement service is not active yet.');
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.message || 'Recording upload failed.');
    return payload;
  },
  complete(sessionToken) {
    return request('/complete', { method: 'POST', body: JSON.stringify({ sessionToken }) });
  },
};
