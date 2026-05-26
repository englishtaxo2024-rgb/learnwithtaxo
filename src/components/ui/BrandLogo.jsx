import { useState } from 'react';
import { Link } from 'react-router-dom';
import { brand } from '../../config/brand';
import { ROLES } from '../../config/roles';

export function BrandLogo({ role, compact = false }) {
  const [missing, setMissing] = useState(false);
  const target = role === ROLES.TEACHER ? '/teacher' : role === ROLES.ADMIN || role === ROLES.OWNER ? '/admin' : '/';
  return (
    <Link to={target} className="flex items-center gap-3">
      {missing ? (
        <div className="grid h-12 w-12 place-items-center rounded-md border border-taxo-gold/50 bg-taxo-dark text-xl font-black text-taxo-gold">T</div>
      ) : (
        <img src={brand.logoPath} onError={() => setMissing(true)} alt="Learn with Taxo logo" className={compact ? 'h-10 w-10 object-contain' : 'h-14 w-14 object-contain'} />
      )}
      {!compact && (
        <div className="leading-tight">
          <div className="text-sm font-black tracking-wide text-white">{brand.headerName}</div>
          <div className="text-xs font-semibold text-taxo-gold">{brand.tagline}</div>
          <div className="text-xs text-taxo-light">{brand.arabicTagline}</div>
        </div>
      )}
    </Link>
  );
}
