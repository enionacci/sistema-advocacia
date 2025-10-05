/**
 * Página de Detalhes de Log de Auditoria
 * 
 * Exibe informações completas de um log específico:
 * - Dados da ação (quem, quando, onde)
 * - Comparação de dados (antes/depois)
 * - Metadados técnicos (IP, user agent, endpoint)
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  Computer as ComputerIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { getAuditLogDetail, formatAction, formatTimestamp, compareData } from '../utils/auditLogService';

const AuditLogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [differences, setDifferences] = useState([]);

  useEffect(() => {
    loadLogDetail();
  }, [id]);

  const loadLogDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAuditLogDetail(id);
      setLog(data);
      
      // Calcular diferenças se houver dados antigos e novos
      if (data.dados_antigos && data.dados_novos) {
        const diffs = compareData(data.dados_antigos, data.dados_novos);
        setDifferences(diffs);
      }
    } catch (err) {
      console.error('Erro ao carregar detalhes:', err);
      setError('Erro ao carregar detalhes do log. Verifique suas permissões.');
    } finally {
      setLoading(false);
    }
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

  if (error || !log) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Log não encontrado'}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Voltar
        </Button>
      </Container>
    );
  }

  const action = formatAction(log.acao);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Cabeçalho */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Voltar
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" component="h1">
            Detalhes do Log #{log.id}
          </Typography>
          <Chip label={action.label} color={action.color} />
          {log.sucesso ? (
            <Chip label="Sucesso" color="success" size="small" />
          ) : (
            <Chip label="Erro" color="error" size="small" />
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Informações Principais */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informações da Ação
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Usuário
                  </Typography>
                  <Typography variant="body1">
                    {log.usuario_nome || 'Sistema'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Escritório
                  </Typography>
                  <Typography variant="body1">
                    {log.escritorio_nome || '-'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Data/Hora
                  </Typography>
                  <Typography variant="body1">
                    {formatTimestamp(log.timestamp)}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Descrição
                </Typography>
                <Typography variant="body1">
                  {log.descricao || '-'}
                </Typography>
              </Box>

              {log.objeto_repr && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Objeto Afetado
                  </Typography>
                  <Typography variant="body1">
                    {log.modelo_nome}: {log.objeto_repr}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Informações Técnicas */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informações Técnicas
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Endpoint
                  </Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                    {log.metodo_http} {log.endpoint || '-'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ComputerIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Endereço IP
                  </Typography>
                  <Typography variant="body1">
                    {log.ip_address || '-'}
                  </Typography>
                </Box>
              </Box>

              {log.user_agent && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    User Agent
                  </Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                    {log.user_agent}
                  </Typography>
                </Box>
              )}

              {!log.sucesso && log.erro_mensagem && (
                <Box>
                  <Typography variant="caption" color="error">
                    Mensagem de Erro
                  </Typography>
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {log.erro_mensagem}
                  </Alert>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Comparação de Dados (UPDATE) */}
        {differences.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Alterações Realizadas
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Campo</strong></TableCell>
                      <TableCell><strong>Valor Anterior</strong></TableCell>
                      <TableCell><strong>Valor Novo</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {differences.map((diff, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {diff.field}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              bgcolor: 'error.light',
                              color: 'error.contrastText',
                              p: 1,
                              borderRadius: 1,
                              fontFamily: 'monospace',
                            }}
                          >
                            {JSON.stringify(diff.oldValue)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              bgcolor: 'success.light',
                              color: 'success.contrastText',
                              p: 1,
                              borderRadius: 1,
                              fontFamily: 'monospace',
                            }}
                          >
                            {JSON.stringify(diff.newValue)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        )}

        {/* Dados Completos (CREATE/DELETE) */}
        {(log.dados_novos && log.acao === 'CREATE') && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Dados Criados
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box
                component="pre"
                sx={{
                  bgcolor: 'grey.100',
                  p: 2,
                  borderRadius: 1,
                  overflow: 'auto',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                }}
              >
                {JSON.stringify(log.dados_novos, null, 2)}
              </Box>
            </Paper>
          </Grid>
        )}

        {(log.dados_antigos && log.acao === 'DELETE') && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Dados Removidos
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box
                component="pre"
                sx={{
                  bgcolor: 'grey.100',
                  p: 2,
                  borderRadius: 1,
                  overflow: 'auto',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                }}
              >
                {JSON.stringify(log.dados_antigos, null, 2)}
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default AuditLogDetailPage;
