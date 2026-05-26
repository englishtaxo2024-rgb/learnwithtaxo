import { ClipboardCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { mockStudents } from '../../data/mockStudents';

export function AttendanceForm() {
  return (
    <form className="space-y-3">
      {mockStudents.map((student) => (
        <div key={student.id} className="grid gap-3 rounded-lg bg-white/5 p-3 md:grid-cols-[1.5fr_1fr_1fr_1fr_2fr]">
          <strong>{student.name}</strong>
          <select className="rounded-md bg-taxo-dark p-2"><option>P</option><option>A</option><option>L</option></select>
          <input type="number" min="1" max="5" placeholder="HW 1-5" className="rounded-md bg-taxo-dark p-2" />
          <input type="number" min="1" max="5" placeholder="Participation 1-5" className="rounded-md bg-taxo-dark p-2" />
          <input placeholder="Notes" className="rounded-md bg-taxo-dark p-2" />
        </div>
      ))}
      <Button type="button"><ClipboardCheck className="mr-2 inline" size={18} /> Save attendance</Button>
    </form>
  );
}
