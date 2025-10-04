// src/components/AuthenticatedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthenticatedRoute = ({ children }) => {
  const { tokens } = useAuth(); // Usa nosso hook para pegar os tokens

  if (!tokens) {
    // Se não houver token, redireciona para a página de login
    return <Navigate to="/login" />;
  }

  // Se houver token, renderiza o componente filho (a página protegida)
  return children;
};

export default AuthenticatedRoute;
