import { Link } from 'react-router-dom';
import { brand } from '../config/brand';
import { PlacementExperience } from './PlacementExperience.jsx';
import '../styles/placement-site-page.css';

function PlacementBrand({ compact = false }) {
  return (
    <Link className={`placement-site-brand${compact ? ' compact' : ''}`} to="/">
      <img src={brand.logoSymbolPath || brand.logoPath} alt="Learn with Taxo" />
      <span><strong>LEARN WITH TAXO</strong><small>Learn to Lead</small></span>
    </Link>
  );
}

export function PlacementSitePage() {
  return (
    <div className="placement-site-page">
      <header className="site-header placement-public-header">
        <div className="container placement-public-header-inner">
          <PlacementBrand />
          <nav className="public-nav" aria-label="Main navigation">
            <Link to="/">Home</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/how-it-works">How it works</Link>
            <Link to="/login">Login</Link>
          </nav>
          <Link className="btn btn-gold placement-home-link" to="/">Back to website</Link>
        </div>
      </header>
      <PlacementExperience />
      <footer className="footer placement-public-footer">
        <div className="container placement-public-footer-inner">
          <PlacementBrand compact />
          <p>LEARN WITH TAXO - Learn to Lead - اتعلم اليوم... واسبق بكره</p>
        </div>
      </footer>
    </div>
  );
}
