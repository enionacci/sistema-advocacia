/**
 * Página de Listagem de Logs de Auditoria
 * 
 * Funcionalidades:
 * - Exibe tabela de logs com paginação
 * - Filtros avançados (usuário, ação, modelo, data)
 * - Busca por texto
 * - Exportação de dados
 * - Navegação para detalhes
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Box,
  TextField,
  Grid,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { listAuditLogs, formatAction, formatTimestamp } from '../utils/auditLogService';

const AuditLogListPage = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  
  // Paginação
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  
  // Filtros
  const [filters, setFilters] = useState({
    acao: '',
    modelo_nome: '',
    data_inicio: '',
    data_fim: '',
    search: '',
  });
  
  // Carregar logs
  const loadLogs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page: page + 1,
        page_size: pageSize,
        ...filters,
      };
      
      // Remover filtros vazios
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      
      const response = await listAuditLogs(params);
      setLogs(response.results || []);
      setTotalCount(response.count || 0);
    } catch (err) {
      console.error('Erro ao carregar logs:', err);
      setError('Erro ao carregar logs de auditoria. Verifique suas permissões.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadLogs();
  }, [page, pageSize]);
  
  // Handlers
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  
  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleApplyFilters = () => {
    setPage(0);
    loadLogs();
  };
  
  const handleClearFilters = () => {
    setFilters({
      acao: '',
      modelo_nome: '',
      data_inicio: '',
      data_fim: '',
      search: '',
    });
    setPage(0);
    setTimeout(loadLogs, 0);
  };
  
  const handleViewDetail = (id) => {
    navigate(`/audit-logs/${id}`);
  };
  
  const handleViewStats = () => {
    navigate('/audit-logs/stats');
  };
  
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Cabeçalho */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Logs de Auditoria
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AssessmentIcon />}
          onClick={handleViewStats}
        >
          Estatísticas
        </Button>
      </Box>
      
      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Filtros</Typography>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Ação"
              value={filters.acao}
              onChange={(e) => handleFilterChange('acao', e.target.value)}
              size="small"
            >
              <MenuItem value="">Todas</MenuItem>
              <MenuItem value="CREATE">Criação</MenuItem>
              <MenuItem value="UPDATE">Atualização</MenuItem>
              <MenuItem value="DELETE">Exclusão</MenuItem>
              <MenuItem value="VIEW">Visualização</MenuItem>
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Modelo"
              value={filters.modelo_nome}
              onChange={(e) => handleFilterChange('modelo_nome', e.target.value)}
              placeholder="Cliente, Consulta..."
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              type="date"
              label="Data Início"
              value={filters.data_inicio}
              onChange={(e) => handleFilterChange('data_inicio', e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              type="date"
              label="Data Fim"
              value={filters.data_fim}
              onChange={(e) => handleFilterChange('data_fim', e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleApplyFilters}
              >
                Aplicar
              </Button>
              <IconButton onClick={handleClearFilters} size="small">
                <ClearIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Buscar"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
            placeholder="Buscar em descrição, usuário, endpoint..."
            size="small"
          />
        </Box>
      </Paper>
      
      {/* Mensagem de erro */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Tabela de logs */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data/Hora</TableCell>
                <TableCell>Usuário</TableCell>
                <TableCell>Ação</TableCell>
                <TableCell>Modelo</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>IP</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Nenhum log encontrado
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => {
                  const action = formatAction(log.acao);
                  return (
                    <TableRow key={log.id} hover>
                      <TableCell>
                        <Typography variant="body2" noWrap>
                          {formatTimestamp(log.timestamp)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap>
                          {log.usuario_nome || '-'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {log.escritorio_nome || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={action.label}
                          color={action.color}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {log.modelo_nome || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={log.descricao || '-'}>
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{ maxWidth: 300 }}
                          >
                            {log.descricao || '-'}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap>
                          {log.ip_address || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleViewDetail(log.id)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handlePageSizeChange}
          rowsPerPageOptions={[10, 25, 50, 100]}
          labelRowsPerPage="Logs por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
          }
        />
      </Paper>
    </Container>
  );
};

export default AuditLogListPage;
