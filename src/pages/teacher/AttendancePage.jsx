import { AttendanceForm } from '../../components/forms/AttendanceForm';
import { Card } from '../../components/ui/Card';

export function AttendancePage() {
  return <div className="space-y-5"><h1 className="text-3xl font-black">Attendance</h1><Card><AttendanceForm /></Card></div>;
}
