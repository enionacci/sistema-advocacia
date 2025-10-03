// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { tokens } = useAuth(); // Usa nosso hook para pegar os tokens

  if (!tokens) {
    // Se não houver token, redireciona para a página de login
    return <Navigate to="/login" />;
  }

  // Se houver token, renderiza o componente filho (a página protegida)
  return children;
};

export default PrivateRoute;