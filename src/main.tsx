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
