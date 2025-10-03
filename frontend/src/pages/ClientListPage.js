// src/pages/ClientListPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // 'Link' foi importado aqui
import axiosInstance from '../utils/axiosInstance';
import { 
    Container, Typography, Box, Paper, TableContainer, Table, TableHead, 
    TableBody, TableRow, TableCell, Button, IconButton, Dialog, DialogActions, 
    DialogContent, DialogContentText, DialogTitle, TextField, Pagination 
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MicIcon from '@mui/icons-material/Mic';

function ClientListPage() {
    // Estado para os dados paginados da API
    const [clientData, setClientData] = useState({ results: [], count: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);
    const navigate = useNavigate();

    // Usamos useCallback para evitar recriar a função em cada renderização
    const fetchClients = useCallback(async (currentPage, currentSearch) => {
        try {
            const params = {
                page: currentPage,
                search: currentSearch,
            };
            const response = await axiosInstance.get('/api/clientes/', { params });
            setClientData(response.data);
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
        }
    }, []);

    // Efeito para buscar dados quando a página ou o termo de busca mudam
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchClients(page, searchTerm);
        }, 500); // Debounce de 500ms para evitar chamadas excessivas à API ao digitar

        return () => clearTimeout(delayDebounceFn);
    }, [page, searchTerm, fetchClients]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    // --- Funções de Exclusão ---
    const handleOpenDeleteDialog = (client) => {
        setClientToDelete(client);
        setOpenDeleteDialog(true);
    };
    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setClientToDelete(null);
    };
    const handleDeleteConfirm = async () => {
        try {
            await axiosInstance.delete(`/api/clientes/${clientToDelete.id}/`);
            alert(`Cliente ${clientToDelete.nome_completo} excluído com sucesso!`);
            handleCloseDeleteDialog();
            fetchClients(page, searchTerm); // Re-busca os clientes da página atual
        } catch (error) {
            console.error("Erro ao excluir cliente:", error);
            alert("Não foi possível excluir o cliente.");
            handleCloseDeleteDialog();
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">Meus Clientes</Typography>
                <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => navigate('/clientes/novo')}>
                    Novo Cliente
                </Button>
            </Box>

            {/* Campo de Busca */}
            <Box sx={{ mb: 2 }}>
                <TextField
                    fullWidth
                    label="Buscar Cliente por Nome, CPF ou E-mail"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(1); // Reseta para a primeira página ao buscar
                    }}
                />
            </Box>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell>Nome Completo</TableCell>
                            <TableCell>CPF/CNPJ</TableCell>
                            <TableCell>E-mail</TableCell>
                            <TableCell>Telefone</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="center">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clientData.results.map((client) => (
                            <TableRow key={client.id} hover>
                                <TableCell>
                                    <Link to={`/clientes/${client.id}`} style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
                                        {client.nome_completo}
                                    </Link>
                                </TableCell>
                                <TableCell>{client.cpf || client.cnpj || '-'}</TableCell>
                                <TableCell>{client.email}</TableCell>
                                <TableCell>{client.telefone_celular || client.telefone || '-'}</TableCell>
                                <TableCell>
                                    <Box 
                                        sx={{ 
                                            display: 'inline-block',
                                            px: 1.5, 
                                            py: 0.5, 
                                            borderRadius: 1,
                                            backgroundColor: client.status_cliente === 'Ativo' ? '#e8f5e9' : 
                                                           client.status_cliente === 'Inativo' ? '#ffebee' : 
                                                           '#fff3e0',
                                            color: client.status_cliente === 'Ativo' ? '#2e7d32' : 
                                                   client.status_cliente === 'Inativo' ? '#c62828' : 
                                                   '#e65100',
                                            fontSize: '0.875rem',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {client.status_cliente || 'Ativo'}
                                    </Box>
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton title="Nova Consulta" color="secondary" onClick={() => navigate(`/clientes/${client.id}/nova-consulta`)}><MicIcon /></IconButton>
                                    <IconButton title="Editar Cliente" color="primary" onClick={() => navigate(`/clientes/${client.id}/edit`)}><EditIcon /></IconButton>
                                    <IconButton title="Excluir Cliente" color="error" onClick={() => handleOpenDeleteDialog(client)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Controles de Paginação */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                    count={Math.ceil(clientData.count / 10)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                />
            </Box>

            {/* Diálogo de Confirmação de Exclusão */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogContent><DialogContentText>
                    Você tem certeza que deseja excluir o cliente "{clientToDelete?.nome_completo}"? Esta ação não pode ser desfeita.
                </DialogContentText></DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
                    <Button onClick={handleDeleteConfirm} color="error">Excluir</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default ClientListPage;