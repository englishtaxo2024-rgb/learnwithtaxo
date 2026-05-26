import { Award, ClipboardList, CreditCard, FileText } from 'lucide-react';
import { StatCard } from '../../components/dashboards/StatCard';
import { Card } from '../../components/ui/Card';
import { mockStudents } from '../../data/mockStudents';

export function StudentDashboard() {
  const student = mockStudents[0];
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-black">Welcome, {student.name}</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={CreditCard} title="Payment" value={student.paymentStatus} />
        <StatCard icon={ClipboardList} title="Session" value={`S${student.currentSession}`} />
        <StatCard icon={FileText} title="Homework" value="3/4" />
        <StatCard icon={Award} title="Final Test" value="Locked" />
      </div>
      <Card><h2 className="text-xl font-bold">Next session</h2><p className="mt-2 text-taxo-light">{student.nextSession} with {student.teacher}</p><p className="mt-1 text-sm text-taxo-light/70">{student.sessionLink}</p></Card>
    </div>
  );
}
