import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { Button } from '../ui/Button';
import { submitPaymentProof } from '../../services/paymentsService';
import { playUiSound } from '../../utils/sound';

export function PaymentProofForm() {
  const [status, setStatus] = useState('');
  async function submit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const result = await submitPaymentProof(data);
    setStatus(result.status);
    playUiSound('success');
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <select name="method" className="w-full rounded-md border border-white/10 bg-taxo-dark p-3">
        <option>EasyKash</option><option>Vodafone Cash</option><option>Bank transfer</option><option>InstaPay</option><option>Exchange office transfer</option><option>STC transfer</option>
      </select>
      <input name="senderNumber" placeholder="Sender number for Vodafone Cash" className="w-full rounded-md border border-white/10 bg-taxo-dark p-3" />
      <input name="reference" placeholder="Transaction reference" className="w-full rounded-md border border-white/10 bg-taxo-dark p-3" />
      <input name="proof" type="file" accept="image/*" className="w-full rounded-md border border-white/10 bg-taxo-dark p-3 text-sm" />
      <Button type="submit"><UploadCloud className="mr-2 inline" size={18} /> Upload proof</Button>
      {status && <p className="rounded-md bg-taxo-gold/15 p-3 font-bold text-taxo-gold">{status}</p>}
    </form>
  );
}
