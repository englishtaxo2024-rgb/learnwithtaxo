import { Link } from 'react-router-dom';
import { BrandLogo } from '../../components/ui/BrandLogo';
import { Button } from '../../components/ui/Button';

export function HomePage() {
  return (
    <main className="section section-pale">
      <div className="container page-stack">
        <BrandLogo />
        <h1 className="hero-title">Premium English learning from placement to certificate.</h1>
        <p className="section-copy">
          Start with a smart placement test, choose the right course, book your suitable group or private class,
          and follow your progress step by step until your certificate.
        </p>
        <div className="button-row">
          <Link to="/student/placement"><Button variant="gold">Start Placement Test</Button></Link>
          <Link to="/login"><Button variant="secondary">Login</Button></Link>
        </div>
      </div>
    </main>
  );
}
