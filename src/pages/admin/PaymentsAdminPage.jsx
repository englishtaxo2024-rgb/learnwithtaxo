import { CreditCard } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export function PaymentsAdminPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-black">Payment Approvals</h1>
      <Card>
        <CreditCard className="mb-3 text-taxo-gold" />
        <div className="grid gap-3 md:grid-cols-3">
          {['Student Name: Ahmed Ali', 'Student ID: ET-2026-123456', 'Course: Kids English', 'Plan: Monthly', 'Amount: 1800 EGP', 'Selected Slot: Sat 5 PM', 'Method: EasyKash', 'Status: Pending Review', 'Duplicate risk: Low'].map((item) => <p key={item} className="rounded-md bg-white/5 p-3 text-taxo-light">{item}</p>)}
        </div>
        <div className="mt-4 flex gap-3"><Button>Approve Payment</Button><Button variant="danger">Reject / Request clearer proof</Button></div>
      </Card>
    </div>
  );
}
