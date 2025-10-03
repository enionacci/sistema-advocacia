// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '@fontsource/material-icons'; // Importa a fonte dos ícones
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // Importar
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);