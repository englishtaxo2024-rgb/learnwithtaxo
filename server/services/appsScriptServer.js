const baseUrl = process.env.ENGLISH_TAXO_API_URL;
const token = process.env.ENGLISH_TAXO_API_TOKEN;

function ensureConfigured() {
  if (!baseUrl || !token) throw new Error('Apps Script API env values are missing.');
}

export async function getAction(action, params = {}) {
  ensureConfigured();
  const url = new URL(baseUrl);
  url.searchParams.set('token', token);
  url.searchParams.set('action', action);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Apps Script ${action} failed: ${response.status}`);
  return response.json();
}

export async function postAction(action, body = {}) {
  ensureConfigured();
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, action, ...body })
  });
  if (!response.ok) throw new Error(`Apps Script ${action} failed: ${response.status}`);
  return response.json();
}
