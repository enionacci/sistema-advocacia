// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { Container, Typography, Box, Paper, TextField, Button, CircularProgress } from '@mui/material';

function RegisterPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        password2: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { loginAction } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.password2) {
            setErrors({ password2: 'As senhas não correspondem.' });
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            // 1. Cria o usuário
            await axiosInstance.post('/api/auth/users/', {
                username: formData.email, // Usa o email como username
                email: formData.email,
                password: formData.password
            });

            // 2. Faz o login para obter os tokens
            await loginAction(formData.email, formData.password); // Usa o email como username para login

            // 3. Redireciona para a página de criação de escritório
            navigate('/criar-escritorio');

        } catch (err) {
            console.error("Erro no registro:", err.response?.data);
            setErrors(err.response?.data || { general: 'Ocorreu um erro ao tentar se registrar.' });
            alert('Falha no registro. Verifique os erros.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={6} sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4 }}>
                <Typography component="h1" variant="h5">
                    Criar Conta
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Endereço de E-mail"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Senha"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password2"
                        label="Confirmar Senha"
                        type="password"
                        id="password2"
                        value={formData.password2}
                        onChange={handleChange}
                        error={!!errors.password2}
                        helperText={errors.password2}
                    />
                    {errors.general && <Typography color="error">{errors.general}</Typography>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Registrar'}
                    </Button>
                    <Box textAlign="center">
                        <Link to="/login" variant="body2">
                            Já tem uma conta? Faça login
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

export default RegisterPage;
