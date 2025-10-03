// src/context/AuthContext.js

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'; // 1. Import useCallback
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState(() => localStorage.getItem('access_token') ? {
      access: localStorage.getItem('access_token'),
      refresh: localStorage.getItem('refresh_token')
  } : null);
  
  const [user, setUser] = useState(null);

  // 2. Wrap loginAction in useCallback
  const loginAction = useCallback(async (username, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/auth/jwt/create/', {
        username, password
      });
      if (response.status === 200) {
        const data = response.data;
        setTokens(data);
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        
        const userResponse = await axios.get('http://127.0.0.1:8000/api/auth/users/me/', {
          headers: {
            'Authorization': `Bearer ${data.access}`
          }
        });
        setUser(userResponse.data);

        navigate('/');
        return true;
      }
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Erro: Usuário ou senha inválidos.');
      return false;
    }
  }, [navigate]); // navigate is a dependency of this function

  // 3. Wrap logoutAction in useCallback
  const logoutAction = useCallback(() => {
    setTokens(null);
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  }, [navigate]);

  const loginActionWithTokens = useCallback((access, refresh, user) => {
    const tokenData = { access, refresh };
    setTokens(tokenData);
    setUser(user);
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }, []);
  
  const contextData = {
    tokens,
    user,
    loginAction,
    logoutAction,
    loginActionWithTokens,
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (tokens) {
        try {
          const userResponse = await axios.get('http://127.0.0.1:8000/api/auth/users/me/', {
            headers: {
              'Authorization': `Bearer ${tokens.access}`
            }
          });
          setUser(userResponse.data);
        } catch (e) {
          console.log("Token inválido, fazendo logout.");
          logoutAction();
        }
      }
    };
    fetchUser();
  }, [tokens, logoutAction]); // 4. Add logoutAction to the dependency array

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};