import { useState } from 'react';
import { Link } from 'react-router-dom';
import { brand } from '../../config/brand';
import { ROLES } from '../../config/roles';

export function BrandLogo({ role, compact = false }) {
  const [logoOk, setLogoOk] = useState(true);
  const target = role === ROLES.TEACHER ? '/teacher' : role === ROLES.ADMIN || role === ROLES.OWNER ? '/admin' : '/';
  const sizeClass = compact ? 'h-10 w-10' : 'h-14 w-14';

  return (
    <Link to={target} className="flex items-center gap-3">
      {logoOk ? (
        <span className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-lg shadow-black/15 ring-1 ring-taxo-gold/40`}>
          <img
            src={brand.logoPath || '/assets/logo.png'}
            onError={() => setLogoOk(false)}
            alt="Learn with Taxo logo"
            className="h-full w-full object-contain"
          />
        </span>
      ) : import.meta.env.DEV ? (
        <div className="rounded-md border border-taxo-gold/50 bg-taxo-dark px-3 py-2 text-xs font-semibold text-taxo-gold">
          Official logo missing. Add public/assets/logo.png
        </div>
      ) : null}
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
