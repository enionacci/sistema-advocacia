// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Box, TextField, Button, Typography, Container, Paper } from '@mui/material';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { loginAction } = useAuth(); // 2. Pegar a função de login do contexto

  const handleSubmit = async (event) => {
    event.preventDefault();
    await loginAction(username, password); // 3. Chamar a função de login do contexto
  };

  // O resto do return continua igual...
  return (
    <Container component="main" maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', height: '80vh' }}>
      <Paper elevation={6} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField margin="normal" required fullWidth id="username" label="Nome de Usuário" name="username" autoComplete="username" autoFocus value={username} onChange={(e) => setUsername(e.target.value)} />
          <TextField margin="normal" required fullWidth name="password" label="Senha" type="password" id="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Entrar
          </Button>
          <Box textAlign="center">
              <Link to="/register" variant="body2">
                  Não tem uma conta? Crie uma
              </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
export default LoginPage;