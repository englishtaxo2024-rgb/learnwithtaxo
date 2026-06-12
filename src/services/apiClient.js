export async function apiRequest(path, options = {}) {
  const configuredBase = import.meta.env.VITE_API_BASE_URL || '';
  const base = configuredBase.endsWith('/api') && path.startsWith('/api') ? configuredBase.slice(0, -4) : configuredBase;
  const headers = { ...(options.headers || {}) };
  const token = localStorage.getItem('taxo_token');
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';
  const response = await fetch(`${base}${path}`, {
    ...options,
    headers
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || `Request failed: ${response.status}`);
  }
  return response.status === 204 ? null : response.json();
}
