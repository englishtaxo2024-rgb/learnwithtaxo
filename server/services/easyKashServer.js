export function getPaymentLink(envName) {
  return process.env[envName] || null;
}
