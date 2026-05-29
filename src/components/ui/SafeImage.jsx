import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { brand } from '../../config/brand';

export function SafeImage({
  src,
  alt = '',
  className = '',
  fallbackLabel = '',
  fallbackIcon: FallbackIcon = ImageOff,
  hideFallback = false,
  loading = 'lazy',
  decoding = 'async',
  ...props
}) {
  const [failed, setFailed] = useState(!src);
  const isLogo = typeof src === 'string' && src.includes('/assets/logo.png');
  const label = fallbackLabel || alt;

  if (failed && hideFallback && !isLogo) {
    return null;
  }

  if (failed && isLogo) {
    return (
      <div className={`safe-image-fallback logo-image-fallback ${className}`} role="img" aria-label="Learn with Taxo logo unavailable">
        <strong>{brand.headerName}</strong>
        <span>{brand.tagline}</span>
        <small>{brand.arabicTagline}</small>
      </div>
    );
  }

  if (failed) {
    return (
      <div className={`safe-image-fallback ${className}`} role="img" aria-label={label || 'Image unavailable'}>
        {FallbackIcon ? <FallbackIcon size={28} aria-hidden="true" /> : null}
        {label ? <span>{label}</span> : null}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      loading={loading}
      decoding={decoding}
      {...props}
    />
  );
}
