import { useState } from 'react';
import { Link } from 'react-router-dom';
import { brand } from '../../config/brand';
import { ROLES } from '../../config/roles';

export function BrandLogo({ role, compact = false }) {
  const [logoOk, setLogoOk] = useState(true);
  const target = role === ROLES.TEACHER ? '/teacher' : role === ROLES.ADMIN || role === ROLES.OWNER ? '/admin' : '/';
  const logoSrc = brand.logoSymbolPath || brand.logoPath || '/assets/logo.png';
  return (
    <Link to={target} className="brand-logo">
      {logoOk ? (
        <span className="brand-logo-mark">
          <img
            src={logoSrc}
            onError={() => setLogoOk(false)}
            alt="Learn with Taxo logo"
          />
        </span>
      ) : import.meta.env.DEV ? (
        <div className="brand-logo-warning">
          Official logo missing. Add public/assets/logo.png
        </div>
      ) : null}
      {!compact && (
        <div className="brand-logo-text">
          <div>{brand.headerName}</div>
          <span>{brand.tagline}</span>
          <small>{brand.arabicTagline}</small>
        </div>
      )}
    </Link>
  );
}
