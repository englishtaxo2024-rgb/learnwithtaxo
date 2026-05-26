import { NavLink } from 'react-router-dom';
import { routeGroups } from '../../config/routes';

export function Sidebar({ area, open, onClose }) {
  const items = routeGroups[area] || [];
  return (
    <aside className={`${open ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-taxo-dark p-4 transition md:sticky md:top-[81px] md:z-0 md:h-[calc(100vh-81px)] md:translate-x-0 md:bg-white/5`}>
      <div className="mb-4 text-xs font-bold uppercase text-taxo-gold">{area} portal</div>
      <nav className="space-y-1">
        {items.map(({ path, label, icon: Icon }) => (
          <NavLink key={path} to={path} onClick={onClose} className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition ${isActive ? 'bg-taxo-gold text-taxo-dark' : 'text-taxo-light hover:bg-white/10 hover:text-white'}`}>
            <Icon size={18} /> <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
