// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, escritorio, tokens, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>; // Ou um spinner
  }

  if (!tokens) {
    return <Navigate to="/login" />;
  }

  if (!escritorio) {
    return <Navigate to="/criar-escritorio" />;
  }

  return children;
};

export default PrivateRoute;