import { Banknote, CalendarDays, ClipboardCheck, MessageCircle } from 'lucide-react';
import { StatCard } from '../../components/dashboards/StatCard';
import { Card } from '../../components/ui/Card';

export function TeacherDashboard() {
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-black">Teacher Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={CalendarDays} title="Groups" value="2" />
        <StatCard icon={ClipboardCheck} title="Attendance due" value="1" />
        <StatCard icon={MessageCircle} title="Feedback avg." value="4.8" />
        <StatCard icon={Banknote} title="Salary" value="Pending" />
      </div>
      <Card><h2 className="text-xl font-bold">Scope</h2><p className="mt-2 text-taxo-light">Teachers can only access their own profile, groups, assigned material, students, feedback summary, salary status, and chat.</p></Card>
    </div>
  );
}
