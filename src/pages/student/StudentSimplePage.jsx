import { Card } from '../../components/ui/Card';
import { FeedbackForm } from '../../components/forms/FeedbackForm';

export function StudentSimplePage({ title, type }) {
  if (type === 'feedback') return <div className="space-y-5"><h1 className="text-3xl font-black">Student Session Feedback</h1><Card><FeedbackForm /></Card></div>;
  return <div className="space-y-5"><h1 className="text-3xl font-black">{title}</h1><Card><p className="text-taxo-light">This student-only area is connected to profile status, payment approval, session unlocks, and mock fallback data until live integrations are enabled.</p></Card></div>;
}
