export async function markSalaryPaid(payload) {
  return { ok: true, savedTo: ['Teacher Schedule', 'Finance', 'Audit Log'], payload };
}
