/**
 * Página de Estatísticas de Auditoria
 * 
 * Dashboard com métricas agregadas:
 * - Total de logs por período
 * - Distribuição por tipo de ação
 * - Usuários mais ativos
 * - Modelos mais acessados
 * - Timeline de atividades
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { getAuditLogStats, formatAction } from '../utils/auditLogService';

const AuditLogStatsPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtros de data
  const [dateRange, setDateRange] = useState({
    data_inicio: '',
    data_fim: '',
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {};
      if (dateRange.data_inicio) params.data_inicio = dateRange.data_inicio;
      if (dateRange.data_fim) params.data_fim = dateRange.data_fim;

      const data = await getAuditLogStats(params);
      setStats(data);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
      setError('Erro ao carregar estatísticas. Verifique suas permissões.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyFilter = () => {
    loadStats();
  };

  const handleBack = () => {
    navigate('/audit-logs');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Voltar
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Cabeçalho */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Voltar
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Estatísticas de Auditoria
        </Typography>
      </Box>

      {/* Filtro de período */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Período
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="date"
              label="Data Início"
              value={dateRange.data_inicio}
              onChange={(e) => handleDateChange('data_inicio', e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="date"
              label="Data Fim"
              value={dateRange.data_fim}
              onChange={(e) => handleDateChange('data_fim', e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleApplyFilter}
            >
              Aplicar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Cards de resumo */}
      <Grid container spacing={3}>
        {/* Total de Logs */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total de Logs</Typography>
              </Box>
              <Typography variant="h3" color="primary">
                {stats?.total_logs || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Logs registrados no período
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Usuários Únicos */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PersonIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Usuários</Typography>
              </Box>
              <Typography variant="h3" color="secondary">
                {stats?.usuarios_unicos || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Usuários diferentes ativos
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Modelos Afetados */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CategoryIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Modelos</Typography>
              </Box>
              <Typography variant="h3" color="success.main">
                {stats?.modelos_afetados || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tipos de objetos diferentes
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Período */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EventIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Período</Typography>
              </Box>
              <Typography variant="body1" fontWeight="bold">
                {stats?.data_primeiro_log ? 
                  new Date(stats.data_primeiro_log).toLocaleDateString('pt-BR') : 
                  '-'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                até
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {stats?.data_ultimo_log ? 
                  new Date(stats.data_ultimo_log).toLocaleDateString('pt-BR') : 
                  '-'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Distribuição por Ação */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Distribuição por Tipo de Ação
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {stats?.logs_por_acao && stats.logs_por_acao.length > 0 ? (
                <List>
                  {stats.logs_por_acao.map((item, index) => {
                    const action = formatAction(item.acao);
                    const percentage = stats.total_logs > 0 
                      ? ((item.total / stats.total_logs) * 100).toFixed(1)
                      : 0;
                    
                    return (
                      <ListItem key={index}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                label={action.label}
                                color={action.color}
                                size="small"
                              />
                              <Typography variant="body2">
                                {item.total} logs ({percentage}%)
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Nenhum dado disponível
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Top Usuários */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Usuários Mais Ativos
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {stats?.top_usuarios && stats.top_usuarios.length > 0 ? (
                <List>
                  {stats.top_usuarios.map((usuario, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">
                              {usuario.usuario_nome || 'Sistema'}
                            </Typography>
                            <Chip
                              label={`${usuario.total} ações`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Nenhum dado disponível
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Modelos Mais Acessados */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Modelos Mais Acessados
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {stats?.logs_por_modelo && stats.logs_por_modelo.length > 0 ? (
                <List>
                  {stats.logs_por_modelo.map((modelo, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">
                              {modelo.modelo_nome || 'Desconhecido'}
                            </Typography>
                            <Chip
                              label={`${modelo.total} logs`}
                              size="small"
                              color="secondary"
                              variant="outlined"
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Nenhum dado disponível
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Logs por Dia */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Atividade Diária (Últimos 7 dias)
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {stats?.logs_por_dia && stats.logs_por_dia.length > 0 ? (
                <List>
                  {stats.logs_por_dia.map((dia, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">
                              {new Date(dia.dia).toLocaleDateString('pt-BR', {
                                weekday: 'short',
                                day: '2-digit',
                                month: '2-digit',
                              })}
                            </Typography>
                            <Chip
                              label={`${dia.total} logs`}
                              size="small"
                              color="info"
                              variant="outlined"
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Nenhum dado disponível
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AuditLogStatsPage;
