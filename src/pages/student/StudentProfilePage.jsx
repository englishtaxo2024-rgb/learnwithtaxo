import { ShieldCheck } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { mockStudents } from '../../data/mockStudents';

export function StudentProfilePage({ admin = false }) {
  const student = mockStudents[0];
  const fields = ['parentEmail', 'phone', 'course', 'level', 'cefr', 'teacher', 'status', 'groupName', 'currentSession', 'nextSession', 'paymentStatus', 'placementResult', 'cameraStatus', 'materialAccess', 'finalTestStatus'];
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-3xl font-black">Student Profile: {student.name}</h1><Badge tone="green">{student.paymentStatus}</Badge></div>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => <Card key={field}><p className="text-xs uppercase text-taxo-gold">{field}</p><p className="mt-1 font-bold text-taxo-light">{String(student[field])}</p></Card>)}
      </div>
      <Card><h2 className="text-xl font-bold">Attendance and Homework</h2><p className="mt-2 text-taxo-light">Attendance: {student.attendance.join(', ')}</p><p className="text-taxo-light">Homework: {student.homework.join(', ')}</p></Card>
      <Card><h2 className="text-xl font-bold">AI Assessment</h2><p className="mt-2 text-taxo-light">{student.aiAssessment.speaking}</p><p className="text-taxo-light">{student.aiAssessment.writing}</p></Card>
      {admin && <Card><ShieldCheck className="mb-2 text-taxo-gold" /><h2 className="text-xl font-bold">Audit History</h2><p className="mt-2 text-taxo-light">Visible to admin only. Payment approved, schedule updated, material unlocked.</p></Card>}
    </div>
  );
}
