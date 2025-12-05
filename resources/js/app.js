require('./bootstrap');

/**
 * Product Inventory Manager Application
 * React-based frontend with JavaScript and SCSS
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';

// Mount React application
const rootElement = document.getElementById('root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
}


