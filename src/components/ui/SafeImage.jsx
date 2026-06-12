import { ImageOff } from 'lucide-react';
import { useState } from 'react';

export function SafeImage({
  src,
  alt,
  className = '',
  fallbackLabel = 'Image coming soon',
  fallbackIcon: FallbackIcon = ImageOff,
  hideFallback = false,
  ...props
}) {
  const [failed, setFailed] = useState(!src);

  if (failed && hideFallback) {
    return null;
  }

  if (failed) {
    return (
      <div className={`safe-image-fallback ${className}`}>
        <FallbackIcon size={28} />
        <span>{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      loading={props.loading || 'lazy'}
      decoding={props.decoding || 'async'}
      {...props}
    />
  );
}
