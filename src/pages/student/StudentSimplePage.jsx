import { Card } from '../../components/ui/Card';
import { FeedbackForm } from '../../components/forms/FeedbackForm';

export function StudentSimplePage({ title, type }) {
  if (type === 'feedback') return <div className="space-y-5"><h1 className="text-3xl font-black">Student Session Feedback</h1><Card><FeedbackForm /></Card></div>;
  return <div className="space-y-5"><h1 className="text-3xl font-black">{title}</h1><Card><p className="text-taxo-light">This student-only area loads authorized account data from the secure Learn with Taxo backend.</p></Card></div>;
}
