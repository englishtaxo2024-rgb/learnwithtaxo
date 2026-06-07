import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { LanguageProvider } from './i18n/LanguageProvider.jsx';
import { installHomepageEnhancements } from './homepageEnhancements.js';
import './styles/index.css';
import './styles/homepage-enhancements.css';
import './styles/hero-poster.css';

installHomepageEnhancements();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LanguageProvider>
  </React.StrictMode>
);
