import { MessageCircle, Star } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { IconCard } from '../../components/ui/IconCard';

export function TeacherFeedbackPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-black">My Student Feedback Summary</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <IconCard icon={Star} title="My rating summary" value="4.8" />
        <IconCard icon={MessageCircle} title="Fun score" value="96%" />
        <IconCard icon={Star} title="Teacher of month contribution" value="+18" />
      </div>
      <Card><h2 className="text-xl font-bold">Quality strengths</h2><p className="mt-2 text-taxo-light">Voice clarity, equal participation, and reading checks are trending positively.</p></Card>
      <Card><h2 className="text-xl font-bold">Improvement alerts</h2><p className="mt-2 text-taxo-light">One technical feedback note: camera lighting needs improvement for evening sessions.</p></Card>
    </div>
  );
}
