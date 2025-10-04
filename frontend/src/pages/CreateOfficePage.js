// src/pages/CreateOfficePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { Container, Typography, Box, Paper, TextField, Button, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';

function CreateOfficePage() {
    const [nome, setNome] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { refreshAuthData } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axiosInstance.post('/api/escritorios/', { nome });
            alert('Escritório criado com sucesso! Bem-vindo(a)!');
            await refreshAuthData(); // Força a atualização do contexto
            navigate('/'); // Redireciona para o dashboard principal
        } catch (err) {
            console.error("Erro ao criar escritório:", err.response.data);
            setError(err.response.data.detail || 'Ocorreu um erro ao criar seu escritório.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            <Paper elevation={6} sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4 }}>
                <Typography component="h1" variant="h5">
                    Crie seu Escritório
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, mb: 2, textAlign: 'center' }}>
                    Este é o último passo. Dê um nome ao seu escritório para começar a usar o sistema.
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="nome"
                        label="Nome do Escritório"
                        name="nome"
                        autoFocus
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                    {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Criar e Acessar'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default CreateOfficePage;
