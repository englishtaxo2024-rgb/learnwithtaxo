import { BookOpen } from 'lucide-react';

export function MaterialSidebar({ material, active, setActive }) {
  return (
    <aside className="space-y-2 rounded-lg border border-white/10 bg-taxo-dark/70 p-3">
      <div className="mb-3 flex items-center gap-2 font-bold text-taxo-gold"><BookOpen size={18} /> Courses</div>
      {material.map((item, index) => (
        <button key={`${item.course}-${item.session}`} onClick={() => setActive(index)} className={`w-full rounded-md p-3 text-left text-sm ${active === index ? 'bg-taxo-gold text-taxo-dark' : 'bg-white/5 text-taxo-light hover:bg-white/10'}`}>
          <strong>{item.course}</strong><br />{item.level} - Session {item.session}
        </button>
      ))}
    </aside>
  );
}
