import { Wallet } from 'lucide-react';
import { PaymentProofForm } from '../../components/forms/PaymentProofForm';
import { Card } from '../../components/ui/Card';
import { prices } from '../../config/prices';
import { manualPayment } from '../../config/constants';

export function PaymentPage() {
  const allPlans = [...prices.phonics, ...prices.kidsGeneral, ...prices.private];
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-black">Payment Confirmation</h1>
      <Card><p className="text-taxo-light">Choose your plan, complete payment using the official manual method shared by admin, then upload the receipt image or PDF. Your booking is confirmed only after admin review.</p><p className="rtl mt-3 text-taxo-light">اختر خطتك، ثم أتم الدفع بالطريقة الرسمية التي تحددها الإدارة، وبعدها ارفع صورة أو ملف إثبات الدفع. لن يتم تأكيد الحجز إلا بعد مراجعة الإدارة.</p></Card>
      <div className="grid gap-4 md:grid-cols-3">{allPlans.map((plan) => <Card key={plan.id}><Wallet className="mb-3 text-taxo-gold" /><h3 className="font-bold">{plan.label}</h3><p className="mt-2 text-2xl font-black">{plan.amount} EGP</p><p className="mt-2 text-xs text-taxo-light/70">Manual confirmation after proof upload.</p></Card>)}</div>
      <Card><h2 className="text-xl font-bold">Manual official payment details</h2><p className="mt-2 text-taxo-light">Vodafone Cash: {manualPayment.vodafoneCash}</p><p className="text-taxo-light">Bank: {manualPayment.bankName}</p><p className="text-taxo-light">Account: {manualPayment.accountNumber}</p><p className="text-taxo-light">IBAN: {manualPayment.iban}</p><p className="text-taxo-light">Owner: {manualPayment.owner}</p><p className="mt-2 text-sm text-red-100">Western Union and transfers to personal names are not accepted.</p></Card>
      <Card><PaymentProofForm /></Card>
    </div>
  );
}
