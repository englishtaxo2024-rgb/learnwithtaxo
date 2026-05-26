import { Card } from '../../components/ui/Card';

export function AdminSimplePage({ title }) {
  return <div className="space-y-5"><h1 className="text-3xl font-black">{title}</h1><Card><p className="text-taxo-light">Owner/Admin management area with permission-ready controls, audit logging placeholders, mock fallback state, and backend route stubs prepared for production integration.</p></Card></div>;
}
