import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

/**
 * ARCHITECT'S NOTE: 
 * We are wrapping the app in strict mode to catch potential side effects 
 * during development, ensuring the production build on Vercel is flawless.
 */

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Failed to find the root element. Ensure index.html has <div id='root'></div>");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    {/* PRO-MEASURE: BrowserRouter is placed here to provide 
        routing context to the entire application hierarchy. 
    */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

/**
 * SCALING MEASURE:
 * You can implement 'reportWebVitals' here in the future 
 * to track SEO and performance metrics directly in Vercel Analytics.
 */