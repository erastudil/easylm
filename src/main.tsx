import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/cascadia-code/latin-400.css';
import '@fontsource/cascadia-code/latin-600.css';
import './styles/easylm.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
