// src/context/AuthContext.js

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState(() => localStorage.getItem('access_token') ? {
      access: localStorage.getItem('access_token'),
      refresh: localStorage.getItem('refresh_token')
  } : null);
  
  const [user, setUser] = useState(null);
  const [escritorio, setEscritorio] = useState(null);
  const [loading, setLoading] = useState(true);

  const logoutAction = useCallback(() => {
    setTokens(null);
    setUser(null);
    setEscritorio(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  }, [navigate]);

  const fetchAndSetAuthData = useCallback(async (accessToken) => {
    setLoading(true);
    try {
      const userResponse = await axios.get('http://127.0.0.1:8000/api/auth/users/me/', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      setUser(userResponse.data);

      try {
        const escritorioResponse = await axiosInstance.get('/api/meu-escritorio/');
        setEscritorio(escritorioResponse.data);
      } catch (escritorioError) {
        if (escritorioError.response && escritorioError.response.status === 404) {
          setEscritorio(null);
        } else {
          throw escritorioError;
        }
      }
    } catch (e) {
      console.log("Token inválido ou erro ao buscar dados, fazendo logout.");
      logoutAction();
    } finally {
      setLoading(false);
    }
  }, [logoutAction]);

  const loginAction = useCallback(async (username, password) => {
    try {
      const response = await axiosInstance.post('/api/auth/jwt/create/', {
        username, password
      });
      if (response.status === 200) {
        const data = response.data;
        setTokens(data);
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        await fetchAndSetAuthData(data.access); // Fetch data after login
        return true;
      }
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Erro: Usuário ou senha inválidos.');
      return false;
    }
  }, [fetchAndSetAuthData]);

  const loginActionWithTokens = useCallback(async (access, refresh) => {
    const tokenData = { access, refresh };
    setTokens(tokenData);
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    await fetchAndSetAuthData(access); // Fetch data after getting tokens
  }, [fetchAndSetAuthData]);

  // Verifica se o usuário tem uma permissão específica
  const hasPermission = useCallback((permissionCodename) => {
    if (!user || !user.perfil) return false;
    
    // Superusuário tem todas as permissões
    if (user.is_superuser) return true;
    
    // Verifica se a permissão está na lista de permissões do perfil
    if (user.perfil.permissoes && Array.isArray(user.perfil.permissoes)) {
      return user.perfil.permissoes.some(
        perm => perm.codename === permissionCodename
      );
    }
    
    return false;
  }, [user]);

  useEffect(() => {
    if (tokens) {
      fetchAndSetAuthData(tokens.access);
    } else {
      setLoading(false);
    }
  }, []); // Run only once on initial load

  const contextData = {
    tokens,
    user,
    escritorio,
    loading,
    loginAction,
    logoutAction,
    loginActionWithTokens,
    refreshAuthData: () => fetchAndSetAuthData(tokens.access), // Expose a refresh function
    hasPermission, // Nova função para verificar permissões
  };

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};