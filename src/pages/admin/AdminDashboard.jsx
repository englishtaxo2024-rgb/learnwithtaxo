import { Banknote, ShieldCheck, UploadCloud, UserRound } from 'lucide-react';
import { StatCard } from '../../components/dashboards/StatCard';
import { ReviewQueue } from '../../components/dashboards/ReviewQueue';

export function AdminDashboard() {
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-black">Owner/Admin Command Center</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={UserRound} title="Students" value="128" />
        <StatCard icon={Banknote} title="Pending payments" value="7" />
        <StatCard icon={UploadCloud} title="Import review" value="5" />
        <StatCard icon={ShieldCheck} title="Audit events" value="42" />
      </div>
      <ReviewQueue items={[{ id: 1, reason: 'Missing teacher name', title: 'Schedule row needs blue section header confirmation.' }, { id: 2, reason: 'Permission required', title: 'New Applications sheet returned 403 until shared with backend identity.' }]} />
    </div>
  );
}
