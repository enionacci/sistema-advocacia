// src/pages/AcceptInvitationPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { Container, Typography, Box, Paper, TextField, Button, CircularProgress } from '@mui/material';

function AcceptInvitationPage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const { loginActionWithTokens } = useAuth();

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        password: '',
        password2: ''
    });
    const [invitationDetails, setInvitationDetails] = useState({ email: '', escritorio_nome: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInvitationDetails = async () => {
            try {
                const response = await axiosInstance.get(`/api/convites/${token}/`);
                setInvitationDetails(response.data);
            } catch (err) {
                setError('Não foi possível carregar os detalhes do convite. Ele pode ser inválido ou ter expirado.');
            }
        };
        fetchInvitationDetails();
    }, [token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.password2) {
            setError('As senhas não correspondem.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axiosInstance.post('/api/convites/aceitar/', {
                token: token,
                password: formData.password,
                first_name: formData.first_name,
                last_name: formData.last_name,
            });

            const { access, refresh } = response.data;
            await loginActionWithTokens(access, refresh);
            
            navigate('/');

        } catch (err) {
            console.error("Erro ao aceitar o convite:", err.response?.data);
            setError(err.response?.data?.detail || 'Ocorreu um erro. O convite pode ser inválido ou já ter sido usado.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={6} sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4 }}>
                <Typography component="h1" variant="h5">
                    Finalize seu Cadastro
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, textAlign: 'center' }}>
                    Você foi convidado para se juntar ao escritório <strong>{invitationDetails.escritorio_nome}</strong>. 
                    Por favor, complete seu cadastro definindo uma senha.
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        value={invitationDetails.email}
                        disabled
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="first_name"
                        label="Primeiro Nome"
                        name="first_name"
                        autoFocus
                        value={formData.first_name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="last_name"
                        label="Sobrenome"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Senha"
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
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
                    />
                    {error && <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>{error}</Typography>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading || !invitationDetails.email}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Criar Conta e Entrar'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default AcceptInvitationPage;
