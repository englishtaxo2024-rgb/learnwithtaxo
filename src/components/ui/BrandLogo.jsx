import { useState } from 'react';
import { Link } from 'react-router-dom';
import { brand } from '../../config/brand';
import { ROLES } from '../../config/roles';

const badgeStyle = {
  width: '88px',
  height: '88px',
  flex: '0 0 88px',
  display: 'grid',
  placeItems: 'center',
  overflow: 'hidden',
  background: '#FFFFFF',
  border: '2px solid rgba(212,175,55,.72)',
  borderRadius: '999px',
  boxShadow: '0 14px 30px rgba(0,0,0,.24), inset 0 0 0 5px rgba(234,246,252,.95)'
};

const compactBadgeStyle = {
  ...badgeStyle,
  width: '68px',
  height: '68px',
  flex: '0 0 68px'
};

const imageStyle = {
  width: '86%',
  height: '86%',
  objectFit: 'contain',
  borderRadius: '999px',
  background: 'transparent',
  filter: 'none'
};

export function BrandLogo({ role, compact = false }) {
  const [logoOk, setLogoOk] = useState(true);
  const target = role === ROLES.TEACHER ? '/teacher' : role === ROLES.ADMIN || role === ROLES.OWNER ? '/admin' : '/';
  const imageSrc = brand.logoSymbolPath || '/assets/logo.png';

  return (
    <Link to={target} className={`brand-logo-link ${compact ? 'brand-logo-compact' : ''}`}>
      {logoOk ? (
        <span className="brand-logo-mark" style={compact ? compactBadgeStyle : badgeStyle} aria-hidden="true">
          <img
            src={imageSrc}
            onError={() => setLogoOk(false)}
            alt=""
            className="brand-logo-image"
            style={imageStyle}
          />
        </span>
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
