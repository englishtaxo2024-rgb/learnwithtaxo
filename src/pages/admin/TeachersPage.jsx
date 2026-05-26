import { DataTable } from '../../components/dashboards/DataTable';
import { mockTeachers } from '../../data/mockTeachers';

export function TeachersPage() {
  return <div className="space-y-5"><h1 className="text-3xl font-black">Teachers</h1><DataTable rows={mockTeachers} columns={[{ key: 'name', label: 'Teacher' }, { key: 'email', label: 'Email' }, { key: 'approvalStatus', label: 'Approval' }, { key: 'visible', label: 'Visible', render: (row) => row.visible ? 'Yes' : 'No' }, { key: 'rating', label: 'Rating' }]} /></div>;
}
