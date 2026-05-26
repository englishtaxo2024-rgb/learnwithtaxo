import { Camera, Video } from 'lucide-react';
import { TeacherProfileForm } from '../../components/forms/TeacherProfileForm';
import { Card } from '../../components/ui/Card';
import { mockTeachers } from '../../data/mockTeachers';

export function TeacherProfilePage() {
  const teacher = mockTeachers[0];
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-black">{teacher.name}</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card><Camera className="mb-2 text-taxo-gold" /><h2 className="text-xl font-bold">Profile media</h2><p className="mt-2 text-taxo-light">Photo, intro video, media gallery, approval status: {teacher.approvalStatus}</p></Card>
        <Card><Video className="mb-2 text-taxo-gold" /><h2 className="text-xl font-bold">Teaching profile</h2><p className="mt-2 text-taxo-light">{teacher.bio}</p><p className="mt-1 text-taxo-light">Courses: {teacher.courses.join(', ')}</p></Card>
      </div>
      <Card><TeacherProfileForm /></Card>
    </div>
  );
}
