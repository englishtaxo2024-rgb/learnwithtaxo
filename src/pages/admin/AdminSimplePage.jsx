import { Card } from '../../components/ui/Card';

export function AdminSimplePage({ title }) {
  return (
    <div className="page-stack">
      <h1>{title}</h1>
      <Card>
        <p>Owner/Admin tools for reviewing records, approvals, permissions, and follow-up actions.</p>
      </Card>
    </div>
  );
}
