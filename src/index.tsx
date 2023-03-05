import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

//https://www.codingdeft.com/posts/react-18-typescript-error/
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
