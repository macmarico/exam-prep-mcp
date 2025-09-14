import React from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';
import { Provider } from 'https://esm.sh/react-redux@8.1.3';
import App from './App.jsx';
import { store } from './store.js';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);