import { UploadCloud } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export function AssetsPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-black">Asset Manager</h1>
      <Card>
        <div className="grid gap-3 md:grid-cols-2">
          <input type="file" accept="image/png,image/*,video/*" className="rounded-md bg-taxo-dark p-3" />
          <select className="rounded-md bg-taxo-dark p-3"><option>logo</option><option>teacher_photo</option><option>teacher_video</option><option>material_slide</option><option>homework</option><option>report</option><option>certificate</option><option>icon</option><option>other</option></select>
          <input placeholder="Related teacher" className="rounded-md bg-taxo-dark p-3" />
          <input placeholder="Course / Level / Session" className="rounded-md bg-taxo-dark p-3" />
        </div>
        <Button className="mt-4"><UploadCloud className="mr-2 inline" size={18} /> Upload asset</Button>
      </Card>
      <Card><p className="text-taxo-light">Metadata stored: file name, uploaded by, upload date, type, related course, level, session, teacher, group, visibility, and approval status.</p></Card>
    </div>
  );
}
