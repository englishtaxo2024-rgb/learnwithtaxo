import { Card } from '../../components/ui/Card';

export function TeacherSimplePage({ title }) {
  return <div className="space-y-5"><h1 className="text-3xl font-black">{title}</h1><Card><p className="text-taxo-light">This teacher-only screen is scoped to the logged-in teacher. Booked slots cannot be deleted; vacation is blocked when active obligations exist unless owner override is audited.</p></Card></div>;
}
