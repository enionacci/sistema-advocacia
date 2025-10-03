// src/pages/ClientDetailPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { 
    Container, Typography, Box, Paper, CircularProgress, Button,
    Accordion, AccordionSummary, AccordionDetails, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import PsychologyIcon from '@mui/icons-material/Psychology';

function ClientDetailPage() {
    const { clientId } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);
    const [currentConsulta, setCurrentConsulta] = useState(null);
    const [analysisContext, setAnalysisContext] = useState('');
    const [analysisLoading, setAnalysisLoading] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const clientResponse = await axiosInstance.get(`/api/clientes/${clientId}/`);
            setClient(clientResponse.data);

            const consultationsResponse = await axiosInstance.get(`/api/clientes/${clientId}/consultas/`);
            setConsultations(consultationsResponse.data.results);

        } catch (error) {
            console.error("Erro ao buscar dados do cliente:", error);
            alert("Não foi possível carregar os dados do cliente.");
        } finally {
            setLoading(false);
        }
    }, [clientId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDelete = async (consultaId) => {
        if (window.confirm('Tem certeza que deseja excluir esta consulta? Esta ação não pode ser desfeita.')) {
            try {
                await axiosInstance.delete(`/api/consultas/${consultaId}/`);
                setConsultations(consultations.filter(c => c.id !== consultaId));
            } catch (error) {
                console.error("Erro ao excluir a consulta:", error);
                alert('Não foi possível excluir a consulta.');
            }
        }
    };

    const handleOpenAnalysisDialog = (consulta) => {
        setCurrentConsulta(consulta);
        setAnalysisContext('');
        setAnalysisDialogOpen(true);
    };

    const handleCloseAnalysisDialog = () => {
        setAnalysisDialogOpen(false);
        setCurrentConsulta(null);
    };

    const handleRunAnalysis = async () => {
        if (!analysisContext.trim()) {
            alert('Por favor, forneça um contexto para a análise.');
            return;
        }
        setAnalysisLoading(true);
        try {
            await axiosInstance.post(`/api/consultas/${currentConsulta.id}/analisar/`, {
                contexto: analysisContext
            }, { timeout: 60000 }); // 60 segundos de timeout
            // Após a análise, recarrega os dados para mostrar a nova análise
            await fetchData();
            handleCloseAnalysisDialog();
        } catch (error) {
            console.error("Erro ao rodar a análise:", error);
            alert('Ocorreu um erro ao processar a análise de IA.');
        } finally {
            setAnalysisLoading(false);
        }
    };

    const handleDeleteAnalysis = async (analysisId) => {
        if (window.confirm('Tem certeza que deseja excluir esta análise de IA?')) {
            try {
                await axiosInstance.delete(`/api/analises/${analysisId}/`);
                fetchData(); // Recarrega os dados para atualizar a lista
            } catch (error) {
                console.error("Erro ao excluir a análise:", error);
                alert('Não foi possível excluir a análise.');
            }
        }
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    if (!client) {
        return <Typography sx={{ mt: 4, textAlign: 'center' }}>Cliente não encontrado.</Typography>;
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
                Voltar para a Lista
            </Button>

            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>{client.nome_completo}</Typography>
                <Typography><strong>CPF:</strong> {client.cpf}</Typography>
                <Typography><strong>E-mail:</strong> {client.email}</Typography>
                <Typography><strong>Telefone:</strong> {client.telefone || 'Não informado'}</Typography>
                <Typography><strong>Endereço:</strong> {client.endereco || 'Não informado'}</Typography>
            </Paper>

            <Typography variant="h5" component="h2" gutterBottom>Histórico de Consultas</Typography>

            {consultations.length > 0 ? (
                consultations.map((consulta) => (
                    <Accordion key={consulta.id}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <Typography sx={{ flexGrow: 1 }}>
                                    Consulta de {new Date(consulta.data_criacao).toLocaleDateString('pt-BR')} às {new Date(consulta.data_criacao).toLocaleTimeString('pt-BR')}
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box>
                                <Typography variant="h6" gutterBottom>Transcrição:</Typography>
                                <Paper variant="outlined" sx={{ p: 2, mb: 2, whiteSpace: 'pre-wrap', maxHeight: '300px', overflowY: 'auto' }}>
                                    {consulta.transcricao || "Transcrição pendente ou não disponível."}
                                </Paper>
                                <Box sx={{ mt: 3 }}>
                                <Typography variant="h6" gutterBottom>Ações</Typography>
                                <Button 
                                    variant="contained" 
                                    startIcon={<PsychologyIcon />}
                                    onClick={() => handleOpenAnalysisDialog(consulta)}
                                    disabled={!consulta.transcricao}
                                    sx={{ mr: 1 }}
                                >
                                    Analisar com IA
                                </Button>
                                <IconButton 
                                    aria-label="delete" 
                                    color="error"
                                    onClick={() => handleDelete(consulta.id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>

                            <Box sx={{ mt: 3 }}>
                                <Typography variant="h6" gutterBottom>Análises de IA</Typography>
                                    {consulta.analises && consulta.analises.length > 0 ? (
                                        consulta.analises.map(analise => (
                                            <Paper key={analise.id} variant="outlined" sx={{ p: 2, mt: 2, position: 'relative' }}>
                                                <IconButton 
                                                    aria-label="delete analysis"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleDeleteAnalysis(analise.id)}
                                                    sx={{ position: 'absolute', top: 8, right: 8 }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Contexto:</Typography>
                                                <Typography variant="body2" sx={{ mb: 2 }}>{analise.contexto}</Typography>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Resultado:</Typography>
                                                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{analise.resultado}</Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                                    Analisado em: {new Date(analise.data_criacao).toLocaleString('pt-BR')}
                                                </Typography>
                                            </Paper>
                                        ))
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">Nenhuma análise foi realizada para esta consulta.</Typography>
                                    )}
                                </Box>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                ))
            ) : (
                <Typography>Nenhuma consulta registrada para este cliente.</Typography>
            )}

            {/* Diálogo para Análise de IA */}
            <Dialog open={analysisDialogOpen} onClose={handleCloseAnalysisDialog} fullWidth maxWidth="sm">
                <DialogTitle>Análise com Inteligência Artificial</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="context"
                        label="Contexto da Análise"
                        type="text"
                        fullWidth
                        variant="standard"
                        multiline
                        rows={4}
                        value={analysisContext}
                        onChange={(e) => setAnalysisContext(e.target.value)}
                        helperText="Ex: 'Analisar sob a ótica do direito do consumidor', 'Resumir os pontos principais', 'Sugerir artigos de lei aplicáveis'."
                    />
                    {analysisLoading && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}><CircularProgress /></Box>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAnalysisDialog} disabled={analysisLoading}>Cancelar</Button>
                    <Button onClick={handleRunAnalysis} disabled={analysisLoading}>Analisar</Button>
                </DialogActions>
            </Dialog>

        </Container>
    );
}

export default ClientDetailPage;