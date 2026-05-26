import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../../components/dashboards/DataTable';
import { LoadingState } from '../../components/ui/LoadingState';
import { getStudents } from '../../services/studentsService';

export function StudentsPage() {
  const [students, setStudents] = useState(null);
  const navigate = useNavigate();
  useEffect(() => { getStudents().then(setStudents); }, []);
  if (!students) return <LoadingState />;
  return <div className="space-y-5"><h1 className="text-3xl font-black">Students List</h1><DataTable rows={students} onRowClick={(row) => navigate(`/admin/student/${row.id}`)} columns={[{ key: 'id', label: 'Student ID' }, { key: 'name', label: 'Name' }, { key: 'course', label: 'Course' }, { key: 'teacher', label: 'Teacher' }, { key: 'paymentStatus', label: 'Payment' }]} /></div>;
}
