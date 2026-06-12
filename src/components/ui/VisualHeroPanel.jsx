import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from './Button';

export function VisualHeroPanel({
  image,
  title,
  subtitle,
  description,
  arabicTitle,
  arabicDescription,
  ctaLabel,
  ctaTo,
  reverse = false,
  overlay = true
}) {
  return (
    <section className={`visual-hero-panel ${reverse ? 'visual-hero-panel-reverse' : ''}`}>
      <div className="visual-hero-copy">
        {subtitle && <p className="eyebrow">{subtitle}</p>}
        <h2>{title}</h2>
        {arabicTitle && <h3 dir="rtl">{arabicTitle}</h3>}
        <p>{description}</p>
        {arabicDescription && <p dir="rtl">{arabicDescription}</p>}
        {ctaLabel && ctaTo && (
          <Link to={ctaTo}>
            <Button className="mt-5">{ctaLabel} <ArrowRight className="ml-2 inline" size={18} /></Button>
          </Link>
        )}
      </div>
      <div className={`visual-hero-image ${overlay ? 'has-overlay' : ''}`}>
        <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
      </div>
    </section>
  );
}
