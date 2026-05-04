/**
 * Switchr — Entry point.
 * Monte l'app sur #root (defini dans index.html).
 */

import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import './styles/global.css';

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('[switchr] #root introuvable dans index.html');
}

createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Hide splash screen once React has mounted (next animation frame)
// — sinon le splash z-index:9999 cache l'app à jamais.
requestAnimationFrame(() => {
  const splash = document.getElementById('splash');
  if (splash) {
    splash.classList.add('hide');
    setTimeout(() => splash.remove(), 600); // après transition opacity
  }
});
