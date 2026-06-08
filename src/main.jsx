import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, useLocation } from 'react-router-dom';
import App from './App.jsx';
import { PlacementSitePage } from './pages/PlacementSitePage.jsx';
import { CourseDetailPage, HowItWorksPage, PricingPage } from './pages/PublicContentPages.jsx';
import { LanguageProvider } from './i18n/LanguageProvider.jsx';
import { installHomepageEnhancements } from './homepageEnhancements.js';
import './styles/index.css';
import './styles/homepage-enhancements.css';
import './styles/hero-poster.css';

installHomepageEnhancements();

const courseByPath = {
  '/courses/general-english': 'general-english',
  '/courses/kids-english': 'kids-english',
  '/courses/phonics': 'phonics',
  '/courses/private-classes': 'private-classes'
};
const correctedLinks = {
  '/student/booking?course=general': '/courses/general-english',
  '/student/booking?course=kids': '/courses/kids-english',
  '/student/booking?course=phonics': '/courses/phonics',
  '/student/booking?course=private': '/courses/private-classes'
};

function correctHomepageLinks() {
  document.querySelectorAll('a[href]').forEach((anchor) => {
    const corrected = correctedLinks[anchor.getAttribute('href')];
    if (corrected) anchor.setAttribute('href', corrected);
  });
}

function RootExperience() {
  const { pathname } = useLocation();
  useEffect(() => {
    correctHomepageLinks();
    const observer = new MutationObserver(correctHomepageLinks);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname]);

  if (pathname === '/placement-test') return <PlacementSitePage />;
  if (pathname === '/pricing') return <PricingPage />;
  if (pathname === '/how-it-works') return <HowItWorksPage />;
  if (courseByPath[pathname]) return <CourseDetailPage course={courseByPath[pathname]} />;
  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <RootExperience />
      </BrowserRouter>
    </LanguageProvider>
  </React.StrictMode>
);