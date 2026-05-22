import React from 'react';
import { createRoot } from 'react-dom/client';
import { initAnalytics } from './src/analytics/init';
import App from './src/App.jsx';
import css from './src/style.css';

initAnalytics();

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
