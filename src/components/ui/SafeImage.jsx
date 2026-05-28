import { useState } from 'react';
import { ImageOff } from 'lucide-react';

export function SafeImage({
  src,
  alt = '',
  className = '',
  fallbackLabel = 'Image coming soon',
  fallbackIcon: FallbackIcon = ImageOff,
  hideFallback = false,
  loading = 'lazy',
  decoding = 'async',
  ...props
}) {
  const [failed, setFailed] = useState(!src);

  if (failed && hideFallback) {
    return null;
  }

  if (failed) {
    return (
      <div className={`safe-image-fallback ${className}`} role="img" aria-label={fallbackLabel || alt || 'Image unavailable'}>
        {FallbackIcon ? <FallbackIcon size={28} aria-hidden="true" /> : null}
        <span>{fallbackLabel || alt || 'Image unavailable'}</span>
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
