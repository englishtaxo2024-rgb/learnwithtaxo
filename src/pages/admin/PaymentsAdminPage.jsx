import { Banknote } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export function PaymentsAdminPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-black">Payment Confirmation</h1>
      <Card>
        <Banknote className="mb-3 text-taxo-gold" />
        <div className="grid gap-3 md:grid-cols-3">
          {['Student Name', 'Student ID', 'Group Name', 'Teacher Name', 'Course', 'Amount', 'Uploaded Screenshot/PDF', 'Status: Pending', 'Admin Notes'].map((item) => <p key={item} className="rounded-md bg-white/5 p-3 text-taxo-light">{item}</p>)}
        </div>
        <div className="mt-4 flex gap-3"><Button>Approve Payment</Button><Button variant="secondary">Mark Pending</Button><Button variant="danger">Reject Payment</Button></div>
      </Card>
    </div>
  );
}
