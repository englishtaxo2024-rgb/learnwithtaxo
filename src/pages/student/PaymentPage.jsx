import { Wallet } from 'lucide-react';
import { PaymentProofForm } from '../../components/forms/PaymentProofForm';
import { Card } from '../../components/ui/Card';
import { prices } from '../../config/prices';
import { manualPayment } from '../../config/constants';

export function PaymentPage() {
  const allPlans = [...prices.phonics, ...prices.kidsGeneral, ...prices.private];
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-black">EasyKash Payment Flow</h1>
      <Card><p className="text-taxo-light">Choose your plan, then click Pay with EasyKash. After payment, please return to this page and upload the payment receipt image or enter the transaction reference. Your booking will not be confirmed until admin reviews and approves the payment.</p><p className="rtl mt-3 text-taxo-light">اختر خطتك ثم اضغط على زر الدفع من خلال EasyKash. بعد إتمام الدفع، برجاء الرجوع لهذه الصفحة ورفع صورة إيصال الدفع أو كتابة رقم العملية. لن يتم تأكيد الحجز إلا بعد مراجعة الإدارة للدفع.</p></Card>
      <div className="grid gap-4 md:grid-cols-3">{allPlans.map((plan) => <Card key={plan.id}><Wallet className="mb-3 text-taxo-gold" /><h3 className="font-bold">{plan.label}</h3><p className="mt-2 text-2xl font-black">{plan.amount} EGP</p><p className="mt-2 text-xs text-taxo-light/70">Payment link from backend env: {plan.env}</p></Card>)}</div>
      <Card><h2 className="text-xl font-bold">Manual official payment details</h2><p className="mt-2 text-taxo-light">Vodafone Cash: {manualPayment.vodafoneCash}</p><p className="text-taxo-light">Bank: {manualPayment.bankName}</p><p className="text-taxo-light">Account: {manualPayment.accountNumber}</p><p className="text-taxo-light">IBAN: {manualPayment.iban}</p><p className="text-taxo-light">Owner: {manualPayment.owner}</p><p className="mt-2 text-sm text-red-100">Western Union and transfers to personal names are not accepted.</p></Card>
      <Card><PaymentProofForm /></Card>
    </div>
  );
}
