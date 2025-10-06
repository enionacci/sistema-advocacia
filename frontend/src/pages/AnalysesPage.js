import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tooltip,
  TextField,
  MenuItem,
  Grid
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Analytics as AnalyticsIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import axios from '../utils/axiosInstance';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const STATUS_COLORS = {
  'pendente': 'default',
  'processando': 'info',
  'concluido': 'success',
  'erro': 'error'
};

const STATUS_LABELS = {
  'pendente': 'Pendente',
  'processando': 'Processando',
  'concluido': 'Concluído',
  'erro': 'Erro'
};

const TIPO_ANALISE_LABELS = {
  'resumo': 'Resumo Executivo',
  'extracao_dados': 'Extração de Dados',
  'juridico': 'Análise Jurídica',
  'contrato': 'Análise de Contrato',
  'risco': 'Análise de Risco',
  'personalizado': 'Personalizado'
};

const AnalysesPage = () => {
  const [analises, setAnalises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAnalise, setSelectedAnalise] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  
  // Filtros
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');

  useEffect(() => {
    fetchAnalises();
  }, []);

  const fetchAnalises = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/documentos/analises/');
      // A API pode retornar um objeto paginado ou um array
      const data = response.data.results || response.data;
      setAnalises(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError('Erro ao carregar análises');
      console.error('Erro:', err);
      setAnalises([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await axios.get(`/api/documentos/analises/${id}/`);
      setSelectedAnalise(response.data);
      setOpenDialog(true);
    } catch (err) {
      setError('Erro ao carregar detalhes da análise');
      console.error('Erro:', err);
    }
  };

  const handleReprocess = async (id) => {
    try {
      await axios.post(`/api/documentos/analises/${id}/reprocessar/`);
      setError('');
      fetchAnalises();
      alert('Análise reprocessada com sucesso!');
    } catch (err) {
      setError('Erro ao reprocessar análise');
      console.error('Erro:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir esta análise?')) {
      return;
    }
    
    try {
      await axios.delete(`/api/documentos/analises/${id}/`);
      setError('');
      fetchAnalises();
    } catch (err) {
      setError('Erro ao excluir análise');
      console.error('Erro:', err);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAnalise(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const formatDuration = (duration) => {
    if (!duration) return '-';
    
    // Se for um número (segundos), converte direto
    if (typeof duration === 'number') {
      return `${duration.toFixed(1)}s`;
    }
    
    // Se for string (ex: "0:00:05.123456" ou ISO duration)
    if (typeof duration === 'string') {
      // Tenta parsear como HH:MM:SS ou H:MM:SS.microseconds
      const parts = duration.split(':');
      if (parts.length === 3) {
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        const seconds = parseFloat(parts[2]);
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        return `${totalSeconds.toFixed(1)}s`;
      }
    }
    
    return String(duration);
  };

  const analisesFiltered = (analises || []).filter(analise => {
    if (filtroStatus && analise.status !== filtroStatus) return false;
    if (filtroTipo && analise.tipo_analise !== filtroTipo) return false;
    return true;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AnalyticsIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
            <Box>
              <Typography variant="h4" gutterBottom>
                Análises Realizadas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Histórico de análises com inteligência artificial
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={fetchAnalises}
            disabled={loading}
          >
            Atualizar
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Filtros */}
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FilterIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Filtros</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Status"
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                size="small"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="pendente">Pendente</MenuItem>
                <MenuItem value="processando">Processando</MenuItem>
                <MenuItem value="concluido">Concluído</MenuItem>
                <MenuItem value="erro">Erro</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Tipo de Análise"
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                size="small"
              >
                <MenuItem value="">Todos</MenuItem>
                {Object.entries(TIPO_ANALISE_LABELS).map(([value, label]) => (
                  <MenuItem key={value} value={value}>{label}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : analisesFiltered.length === 0 ? (
          <Alert severity="info">
            Nenhuma análise encontrada. Comece escaneando um documento!
          </Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Data Solicitação</TableCell>
                  <TableCell>Data Conclusão</TableCell>
                  <TableCell>Tempo</TableCell>
                  <TableCell>Tokens</TableCell>
                  <TableCell>Custo</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analisesFiltered.map((analise) => (
                  <TableRow key={analise.id} hover>
                    <TableCell>
                      <Typography variant="body2">
                        {TIPO_ANALISE_LABELS[analise.tipo_analise] || analise.tipo_analise}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={STATUS_LABELS[analise.status] || analise.status}
                        color={STATUS_COLORS[analise.status] || 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(analise.data_solicitacao)}</TableCell>
                    <TableCell>{formatDate(analise.data_conclusao)}</TableCell>
                    <TableCell>
                      {formatDuration(analise.tempo_processamento)}
                    </TableCell>
                    <TableCell>{analise.tokens_usados || '-'}</TableCell>
                    <TableCell>
                      {analise.custo_estimado 
                        ? `$${parseFloat(analise.custo_estimado).toFixed(4)}` 
                        : '-'}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Ver Detalhes">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(analise.id)}
                          color="primary"
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      {analise.status === 'erro' && (
                        <Tooltip title="Reprocessar">
                          <IconButton
                            size="small"
                            onClick={() => handleReprocess(analise.id)}
                            color="info"
                          >
                            <RefreshIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Excluir">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(analise.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Dialog de Detalhes */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Detalhes da Análise
        </DialogTitle>
        <DialogContent dividers>
          {selectedAnalise && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Tipo de Análise:
                  </Typography>
                  <Typography variant="body1">
                    {TIPO_ANALISE_LABELS[selectedAnalise.tipo_analise]}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status:
                  </Typography>
                  <Chip
                    label={STATUS_LABELS[selectedAnalise.status]}
                    color={STATUS_COLORS[selectedAnalise.status]}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Data Solicitação:
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(selectedAnalise.data_solicitacao)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Data Conclusão:
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(selectedAnalise.data_conclusao)}
                  </Typography>
                </Grid>
                {selectedAnalise.modelo_ia && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Modelo IA:
                    </Typography>
                    <Typography variant="body2">
                      {selectedAnalise.modelo_ia}
                    </Typography>
                  </Grid>
                )}
              </Grid>

              {selectedAnalise.prompt_personalizado && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Prompt Personalizado:
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {selectedAnalise.prompt_personalizado}
                    </Typography>
                  </Paper>
                </Box>
              )}

              {selectedAnalise.resultado && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Resultado da Análise:
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50', maxHeight: 400, overflow: 'auto' }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {selectedAnalise.resultado}
                    </Typography>
                  </Paper>
                </Box>
              )}

              {selectedAnalise.mensagem_erro && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {selectedAnalise.mensagem_erro}
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AnalysesPage;
