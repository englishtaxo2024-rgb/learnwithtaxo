import { useState } from 'react';
import { Link } from 'react-router-dom';
import { brand } from '../../config/brand';
import { ROLES } from '../../config/roles';

export function BrandLogo({ role, compact = false }) {
  const [logoOk, setLogoOk] = useState(true);
  const target = role === ROLES.TEACHER ? '/teacher' : role === ROLES.ADMIN || role === ROLES.OWNER ? '/admin' : '/';
  const imageSrc = compact ? brand.logoSymbolPath : brand.logoSymbolPath;

  return (
    <Link to={target} className={`brand-logo-link ${compact ? 'brand-logo-compact' : ''}`}>
      {logoOk ? (
        <img
          src={imageSrc || '/assets/logo.png'}
          onError={() => setLogoOk(false)}
          alt="Learn with Taxo logo"
          className="brand-logo-image"
        />
      ) : import.meta.env.DEV ? (
        <div className="brand-logo-warning">Official logo missing. Add public/assets/logo.png</div>
      ) : null}
      {!compact && (
        <div className="brand-logo-copy">
          <div className="brand-logo-title">{brand.headerName}</div>
          <div className="brand-logo-tagline">{brand.tagline}</div>
          <div className="brand-logo-ar">{brand.arabicTagline}</div>
        </div>
      )}
    </Link>
  );
}
