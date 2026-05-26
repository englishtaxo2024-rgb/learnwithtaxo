export function formatDateTime(value) {
  if (!value) return 'Not scheduled';
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export function nowIso() {
  return new Date().toISOString();
}
