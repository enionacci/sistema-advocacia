import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Gavel as GavelIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';

const ProcessosListPage = () => {
  const navigate = useNavigate();
  const [processos, setProcessos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  
  // Filtros
  const [statusFilter, setStatusFilter] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');
  
  // Dialog de confirmação de exclusão
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [processoToDelete, setProcessoToDelete] = useState(null);

  useEffect(() => {
    fetchProcessos();
    fetchStats();
  }, [statusFilter, tipoFilter]);

  const fetchProcessos = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (tipoFilter) params.tipo = tipoFilter;

      const response = await axiosInstance.get('/api/processos/processos/', { params });
      console.log('Resposta da API processos:', response.data);
      
      // Verifica se a resposta é paginada (com results) ou um array direto
      const processosData = response.data.results || response.data;
      setProcessos(Array.isArray(processosData) ? processosData : []);
      setError('');
    } catch (err) {
      console.error('Erro ao buscar processos:', err);
      console.error('Detalhes do erro:', err.response?.data);
      setError('Erro ao carregar processos. Tente novamente.');
      setProcessos([]); // Define array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/api/processos/processos/estatisticas/');
      setStats(response.data);
    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'andamento': 'primary',
      'suspenso': 'warning',
      'arquivado': 'default',
      'sentenciado': 'success',
      'transito_julgado': 'success',
      'recurso': 'info',
      'execucao': 'secondary'
    };
    return colors[status] || 'default';
  };

  const getTipoColor = (tipo) => {
    const colors = {
      'civel': 'primary',
      'trabalhista': 'warning',
      'criminal': 'error',
      'familia': 'secondary',
      'tributario': 'info',
      'previdenciario': 'success',
      'consumidor': 'warning',
      'administrativo': 'default'
    };
    return colors[tipo] || 'default';
  };

  const formatCurrency = (value) => {
    if (!value) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleDeleteClick = (processo) => {
    setProcessoToDelete(processo);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!processoToDelete) return;

    try {
      await axiosInstance.delete(`/api/processos/processos/${processoToDelete.id}/`);
      setDeleteDialogOpen(false);
      setProcessoToDelete(null);
      
      // Recarrega a lista
      fetchProcessos();
      fetchStats();
      
      setError('');
    } catch (err) {
      console.error('Erro ao deletar processo:', err);
      setError(err.response?.data?.detail || 'Erro ao deletar processo. Você pode não ter permissão.');
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProcessoToDelete(null);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Cabeçalho */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <GavelIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Processos Judiciais
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/processos/novo')}
        >
          Novo Processo
        </Button>
      </Box>

      {/* Cards de Estatísticas */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <GavelIcon color="primary" />
                  <Typography variant="h6" component="div">
                    {stats.total}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Total de Processos
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <TrendingUpIcon color="success" />
                  <Typography variant="h6" component="div">
                    {stats.por_status?.andamento || 0}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Em Andamento
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <ScheduleIcon color="warning" />
                  <Typography variant="h6" component="div">
                    {stats.prazos_proximos || 0}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Prazos Próximos (7 dias)
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <WarningIcon color="error" />
                  <Typography variant="h6" component="div">
                    {stats.audiencias_proximas || 0}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Audiências Próximas
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="andamento">Em Andamento</MenuItem>
              <MenuItem value="suspenso">Suspenso</MenuItem>
              <MenuItem value="arquivado">Arquivado</MenuItem>
              <MenuItem value="sentenciado">Sentenciado</MenuItem>
              <MenuItem value="transito_julgado">Trânsito em Julgado</MenuItem>
              <MenuItem value="recurso">Em Recurso</MenuItem>
              <MenuItem value="execucao">Em Execução</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Tipo"
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="civel">Cível</MenuItem>
              <MenuItem value="trabalhista">Trabalhista</MenuItem>
              <MenuItem value="criminal">Criminal</MenuItem>
              <MenuItem value="familia">Família</MenuItem>
              <MenuItem value="tributario">Tributário</MenuItem>
              <MenuItem value="previdenciario">Previdenciário</MenuItem>
              <MenuItem value="consumidor">Consumidor</MenuItem>
              <MenuItem value="administrativo">Administrativo</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Mensagem de erro */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        /* Tabela de Processos */
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Número</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Assunto</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Tribunal</TableCell>
                <TableCell>Distribuição</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Prazos</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!processos || processos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    <Typography variant="body1" color="text.secondary" sx={{ py: 4 }}>
                      {loading ? 'Carregando processos...' : 'Nenhum processo encontrado. Clique em "Novo Processo" para começar.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                processos.map((processo) => (
                  <TableRow key={processo.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {processo.numero_processo}
                      </Typography>
                      {processo.sigilo && (
                        <Chip label="SIGILO" size="small" color="error" sx={{ mt: 0.5 }} />
                      )}
                    </TableCell>
                    <TableCell>{processo.cliente_nome}</TableCell>
                    <TableCell>
                      <Chip
                        label={processo.tipo_display}
                        size="small"
                        color={getTipoColor(processo.tipo)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {processo.assunto}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={processo.status_display}
                        size="small"
                        color={getStatusColor(processo.status)}
                      />
                    </TableCell>
                    <TableCell>{processo.tribunal}</TableCell>
                    <TableCell>{formatDate(processo.data_distribuicao)}</TableCell>
                    <TableCell>{formatCurrency(processo.valor_causa)}</TableCell>
                    <TableCell>
                      {processo.prazos_pendentes > 0 && (
                        <Chip
                          label={`${processo.prazos_pendentes} pendente(s)`}
                          size="small"
                          color="warning"
                          icon={<ScheduleIcon />}
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/processos/${processo.id}`)}
                        title="Ver Detalhes"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={() => navigate(`/processos/${processo.id}/editar`)}
                        title="Editar"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(processo)}
                        title="Deletar"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog de confirmação de exclusão */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir o processo <strong>{processoToDelete?.numero_processo}</strong>?
            <br /><br />
            Esta ação não pode ser desfeita. Todos os dados relacionados (partes, movimentações, prazos e audiências) também serão removidos.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProcessosListPage;
