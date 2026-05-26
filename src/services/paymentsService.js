export async function submitPaymentProof(payload) {
  return { ok: true, status: 'Payment Under Review / جاري مراجعة الدفع', payload };
}

export async function approvePayment(paymentId, adminNotes) {
  return { ok: true, paymentId, adminNotes, actions: ['Booking confirmed', 'Slot reserved', 'Finance updated', 'Teacher notified', 'Audit log written'] };
}
