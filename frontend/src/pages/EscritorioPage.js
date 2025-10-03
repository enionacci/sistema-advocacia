// src/pages/EscritorioPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import {
    Container, Typography, Box, Paper, TextField, Button, CircularProgress,
    List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, ListItemSecondaryAction
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../context/AuthContext';

function EscritorioPage() {
    const [escritorio, setEscritorio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [nomeEdit, setNomeEdit] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [isInviting, setIsInviting] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth(); // Pega o usuário logado

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/api/meu-escritorio/');
            setEscritorio(response.data);
            setNomeEdit(response.data.nome);
            setError('');
        } catch (err) {
            setError('Não foi possível carregar os dados do escritório.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [setLoading, setEscritorio, setNomeEdit, setError]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleUpdateEscritorio = async (e) => {
        e.preventDefault();
        setIsEditing(true);

        const payload = {
            nome: nomeEdit,
        };

        if (apiKey) {
            payload.openai_api_key = apiKey;
        }

        try {
            const response = await axiosInstance.patch('/api/meu-escritorio/', payload);
            setEscritorio(response.data);
            setApiKey('');
            alert('Dados do escritório atualizados com sucesso!');
        } catch (err) {
            alert('Não foi possível atualizar os dados do escritório.');
            console.error(err);
        } finally {
            setIsEditing(false);
        }
    };

    const handleSendInvite = async (e) => {
        e.preventDefault();
        setIsInviting(true);
        try {
            await axiosInstance.post('/api/meu-escritorio/convidar/', { email: inviteEmail });
            alert(`Convite enviado para ${inviteEmail}. O e-mail com as instruções será impresso no console do servidor backend.`);
            setInviteEmail('');
        } catch (err) {
            alert('Não foi possível enviar o convite. Verifique se o e-mail já não é um membro.');
            console.error(err);
        } finally {
            setIsInviting(false);
        }
    };

    const handleDeleteMember = async (perfilId) => {
        if (window.confirm('Tem certeza que deseja remover este membro do escritório?')) {
            try {
                await axiosInstance.delete(`/api/meu-escritorio/membros/${perfilId}/`);
                alert('Membro removido com sucesso.');
                fetchData(); // Re-busca os dados para atualizar a lista
            } catch (err) {
                alert('Não foi possível remover o membro.');
                console.error(err);
            }
        }
    };

    if (loading) {        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Typography color="error" sx={{ mt: 4, textAlign: 'center' }}>{error}</Typography>;
    }

    if (!escritorio) {
        return null; // Ou uma mensagem de 'nenhum escritório encontrado'
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 2 }}>
                Voltar para Clientes
            </Button>
            <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Gerenciar Meu Escritório
                </Typography>
                
                <Box component="form" onSubmit={handleUpdateEscritorio} sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Nome do Escritório"
                        variant="outlined"
                        value={nomeEdit}
                        onChange={(e) => setNomeEdit(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        type="password"
                        label="Chave de API da OpenAI"
                        variant="outlined"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        sx={{ mb: 2 }}
                        placeholder="Deixe em branco para não alterar"
                        helperText="A chave é armazenada de forma criptografada e não será exibida novamente."
                    />
                    <Button type="submit" variant="contained" disabled={isEditing}>
                        {isEditing ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                </Box>
            </Paper>

            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Membros do Escritório
                </Typography>
                <List>
                    {escritorio.membros.map(perfil => (
                        <ListItem key={perfil.id}>
                            <ListItemAvatar>
                                <Avatar>
                                    <AccountCircleIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText 
                                primary={`${perfil.user.first_name} ${perfil.user.last_name}`.trim() || perfil.user.username}
                                secondary={perfil.user.email}
                            />
                            {user && user.id !== perfil.user.id && (
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteMember(perfil.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            )}
                        </ListItem>
                    ))}
                </List>
            </Paper>

            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Convidar Novo Membro
                </Typography>
                <Box component="form" onSubmit={handleSendInvite} sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        type="email"
                        label="E-mail do Convidado"
                        variant="outlined"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        sx={{ mb: 2 }}
                        required
                    />
                    <Button type="submit" variant="contained" disabled={isInviting}>
                        {isInviting ? 'Enviando...' : 'Enviar Convite'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default EscritorioPage;
