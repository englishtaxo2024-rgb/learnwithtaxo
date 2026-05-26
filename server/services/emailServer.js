export async function sendEmail({ to, subject }) {
  if (!process.env.EMAIL_HOST) return { queued: false, message: 'Email env missing. Placeholder logged only.', to, subject };
  return { queued: true, to, subject };
}
