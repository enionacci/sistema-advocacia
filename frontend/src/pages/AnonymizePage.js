import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  MenuItem,
  TextField,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Restore as RestoreIcon,
  Description as DocumentIcon,
  ExpandMore as ExpandMoreIcon,
  Settings as SettingsIcon,
  AutoAwesome as AIIcon,
  Code as RegexIcon
} from '@mui/icons-material';
import axios from '../utils/axiosInstance';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AnonymizePage = () => {
  // Estados
  const [documentos, setDocumentos] = useState([]);
  const [anonimizacoes, setAnonimizacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estados dos dialogs
  const [previewDialog, setPreviewDialog] = useState(false);
  const [anonymizeDialog, setAnonymizeDialog] = useState(false);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedAnonymization, setSelectedAnonymization] = useState(null);
  
  // Estados da configuração de anonimização
  const [tipoAnonimizacao, setTipoAnonimizacao] = useState('regex');
  const [incluirNomes, setIncluirNomes] = useState(false);
  const [incluirEnderecos, setIncluirEnderecos] = useState(false);
  const [incluirEmails, setIncluirEmails] = useState(true);
  const [incluirTelefones, setIncluirTelefones] = useState(true);
  const [incluirCpfRg, setIncluirCpfRg] = useState(true);

  // Carregar dados
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [docsResponse, anonResponse] = await Promise.all([
        axios.get('/api/documentos/'),
        axios.get('/api/documentos/anonymizations/')
      ]);
      
      // Filtrar apenas documentos que têm texto extraído
      const documentsWithText = docsResponse.data.results?.filter(doc => 
        doc.texto_extraido && doc.texto_extraido.trim().length > 0
      ) || [];
      
      setDocumentos(documentsWithText);
      setAnonimizacoes(anonResponse.data.results || []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewDocument = (documento) => {
    setSelectedDocument(documento);
    setPreviewDialog(true);
  };

  const handleAnonymizeDocument = (documento) => {
    setSelectedDocument(documento);
    setAnonymizeDialog(true);
  };

  const handleViewDetails = async (anonimizacao) => {
    try {
      const response = await axios.get(`/api/documentos/anonymizations/${anonimizacao.id}/`);
      setSelectedAnonymization(response.data.data);
      setDetailsDialog(true);
    } catch (err) {
      console.error('Erro ao carregar detalhes:', err);
      setError('Erro ao carregar detalhes da anonimização');
    }
  };

  const processAnonymization = async () => {
    if (!selectedDocument) return;

    try {
      setProcessing(true);
      setError('');

      const payload = {
        tipo: tipoAnonimizacao,
        incluir_nomes: incluirNomes,
        incluir_enderecos: incluirEnderecos,
        incluir_emails: incluirEmails,
        incluir_telefones: incluirTelefones,
        incluir_cpf_rg: incluirCpfRg
      };

      console.log('📤 Enviando anonimização:', payload);

      const response = await axios.post(`/api/documentos/${selectedDocument.id}/anonymize/`, payload);
      
      setSuccess(`Documento anonimizado com sucesso! ${response.data.total_substituicoes} substituições realizadas.`);
      setAnonymizeDialog(false);
      
      // Recarregar dados
      await loadData();
      
      setTimeout(() => setSuccess(''), 5000);
      
    } catch (err) {
      console.error('❌ Erro na anonimização:', err);
      setError(err.response?.data?.error || 'Erro ao anonimizar documento');
    } finally {
      setProcessing(false);
    }
  };

  const restoreDocument = async (documento) => {
    try {
      setProcessing(true);
      setError('');

      const response = await axios.post(`/api/documentos/${documento.id}/restore/`);
      
      setSuccess('Documento restaurado com sucesso!');
      
      // Recarregar dados
      await loadData();
      
      setTimeout(() => setSuccess(''), 5000);
      
    } catch (err) {
      console.error('❌ Erro na restauração:', err);
      setError(err.response?.data?.error || 'Erro ao restaurar documento');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ativo': return 'success';
      case 'restaurado': return 'default';
      case 'processando': return 'info';
      case 'erro': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ativo': return 'Ativo';
      case 'restaurado': return 'Restaurado';
      case 'processando': return 'Processando';
      case 'erro': return 'Erro';
      default: return status;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <SecurityIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" gutterBottom>
              Anonimização de Documentos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Proteja dados pessoais em documentos com anonimização reversível conforme LGPD
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Documentos Disponíveis */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    📄 Documentos Disponíveis
                  </Typography>
                  
                  {documentos.length === 0 ? (
                    <Alert severity="info">
                      Nenhum documento com texto extraído encontrado.
                    </Alert>
                  ) : (
                    <List>
                      {documentos.map((documento, index) => (
                        <React.Fragment key={documento.id}>
                          <ListItem>
                            <DocumentIcon sx={{ mr: 2, color: 'primary.main' }} />
                            <ListItemText
                              primary={documento.titulo || `Documento ${documento.id}`}
                              secondary={
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    Cliente: {documento.cliente_nome || 'N/A'}
                                  </Typography>
                                  <Box sx={{ mt: 0.5 }}>
                                    <Chip 
                                      label="Texto Extraído" 
                                      size="small" 
                                      color="primary" 
                                      sx={{ mr: 1 }}
                                    />
                                    {documento.anonimizado ? (
                                      <Chip 
                                        label="Anonimizado" 
                                        size="small" 
                                        color="warning" 
                                      />
                                    ) : (
                                      <Chip 
                                        label="Original" 
                                        size="small" 
                                        color="default" 
                                      />
                                    )}
                                  </Box>
                                </Box>
                              }
                            />
                            <ListItemSecondaryAction>
                              <IconButton 
                                onClick={() => handlePreviewDocument(documento)}
                                color="primary"
                                title="Visualizar Texto"
                                size="small"
                              >
                                <VisibilityIcon />
                              </IconButton>
                              {documento.anonimizado ? (
                                <Button
                                  variant="outlined"
                                  color="secondary"
                                  onClick={() => restoreDocument(documento)}
                                  startIcon={<RestoreIcon />}
                                  sx={{ ml: 1 }}
                                  size="small"
                                  disabled={processing}
                                >
                                  Restaurar
                                </Button>
                              ) : (
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => handleAnonymizeDocument(documento)}
                                  startIcon={<SecurityIcon />}
                                  sx={{ ml: 1 }}
                                  size="small"
                                  disabled={processing}
                                >
                                  Anonimizar
                                </Button>
                              )}
                            </ListItemSecondaryAction>
                          </ListItem>
                          {index < documentos.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Histórico de Anonimizações */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    🔒 Histórico de Anonimizações
                  </Typography>
                  
                  {anonimizacoes.length === 0 ? (
                    <Alert severity="info">
                      Nenhuma anonimização realizada ainda.
                    </Alert>
                  ) : (
                    <List>
                      {anonimizacoes.map((anon, index) => (
                        <React.Fragment key={anon.id}>
                          <ListItem>
                            <SecurityIcon sx={{ mr: 2, color: 'primary.main' }} />
                            <ListItemText
                              primary={anon.documento_titulo}
                              secondary={
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    {anon.cliente_nome} • {anon.total_substituicoes} substituições
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {format(new Date(anon.data_solicitacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                                  </Typography>
                                  <Box sx={{ mt: 0.5 }}>
                                    <Chip 
                                      label={getStatusLabel(anon.status)}
                                      size="small" 
                                      color={getStatusColor(anon.status)}
                                      sx={{ mr: 1 }}
                                    />
                                    <Chip 
                                      label={anon.tipo_anonimizacao === 'ai' ? 'IA' : 'Regex'}
                                      size="small" 
                                      color="default"
                                      icon={anon.tipo_anonimizacao === 'ai' ? <AIIcon /> : <RegexIcon />}
                                    />
                                  </Box>
                                </Box>
                              }
                            />
                            <ListItemSecondaryAction>
                              <Button
                                variant="outlined"
                                onClick={() => handleViewDetails(anon)}
                                startIcon={<VisibilityIcon />}
                                size="small"
                              >
                                Detalhes
                              </Button>
                            </ListItemSecondaryAction>
                          </ListItem>
                          {index < anonimizacoes.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Paper>

      {/* Dialog de Preview */}
      <Dialog 
        open={previewDialog} 
        onClose={() => setPreviewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Prévia do Documento
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            {selectedDocument?.titulo || `Documento ${selectedDocument?.id}`}
            {selectedDocument?.anonimizado && (
              <Chip 
                label="Anonimizado" 
                size="small" 
                color="warning" 
                sx={{ ml: 2 }}
              />
            )}
          </Typography>
          <TextField
            multiline
            rows={15}
            fullWidth
            value={selectedDocument?.texto_extraido || ''}
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog(false)}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Anonimização */}
      <Dialog 
        open={anonymizeDialog} 
        onClose={() => setAnonymizeDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
            Configurar Anonimização
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Documento: {selectedDocument?.titulo || `Documento ${selectedDocument?.id}`}
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Método de Anonimização"
                value={tipoAnonimizacao}
                onChange={(e) => setTipoAnonimizacao(e.target.value)}
                helperText={tipoAnonimizacao === 'ai' ? 'Usa IA para detectar dados pessoais (mais preciso)' : 'Usa padrões regex (mais rápido)'}
              >
                <MenuItem value="regex">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <RegexIcon sx={{ mr: 1 }} />
                    Regex (Rápido)
                  </Box>
                </MenuItem>
                <MenuItem value="ai">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AIIcon sx={{ mr: 1 }} />
                    Inteligência Artificial (Preciso)
                  </Box>
                </MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Dados para Anonimizar:
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={incluirCpfRg}
                    onChange={(e) => setIncluirCpfRg(e.target.checked)}
                  />
                }
                label="CPF e RG"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={incluirEmails}
                    onChange={(e) => setIncluirEmails(e.target.checked)}
                  />
                }
                label="E-mails"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={incluirTelefones}
                    onChange={(e) => setIncluirTelefones(e.target.checked)}
                  />
                }
                label="Telefones"
              />
              
              {tipoAnonimizacao === 'ai' && (
                <>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={incluirNomes}
                        onChange={(e) => setIncluirNomes(e.target.checked)}
                      />
                    }
                    label="Nomes de Pessoas (apenas IA)"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={incluirEnderecos}
                        onChange={(e) => setIncluirEnderecos(e.target.checked)}
                      />
                    }
                    label="Endereços (apenas IA)"
                  />
                </>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAnonymizeDialog(false)}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={processAnonymization}
            disabled={processing}
            startIcon={processing ? <CircularProgress size={20} /> : <SecurityIcon />}
          >
            {processing ? 'Anonimizando...' : 'Anonimizar Documento'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Detalhes */}
      <Dialog 
        open={detailsDialog} 
        onClose={() => setDetailsDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Detalhes da Anonimização
        </DialogTitle>
        <DialogContent>
          {selectedAnonymization && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Documento:</Typography>
                  <Typography>{selectedAnonymization.documento_titulo}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Status:</Typography>
                  <Chip 
                    label={getStatusLabel(selectedAnonymization.status)}
                    color={getStatusColor(selectedAnonymization.status)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Método:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {selectedAnonymization.tipo_anonimizacao === 'ai' ? <AIIcon sx={{ mr: 1 }} /> : <RegexIcon sx={{ mr: 1 }} />}
                    {selectedAnonymization.tipo_anonimizacao === 'ai' ? 'Inteligência Artificial' : 'Regex'}
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Substituições:</Typography>
                  <Typography>{selectedAnonymization.total_substituicoes}</Typography>
                </Grid>
              </Grid>

              {selectedAnonymization.itens && selectedAnonymization.itens.length > 0 && (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">
                      Itens Substituídos ({selectedAnonymization.itens.length})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {selectedAnonymization.itens.map((item, index) => (
                        <ListItem key={item.id}>
                          <ListItemText
                            primary={`${item.tipo_dado.toUpperCase()}: ${item.valor_original} → ${item.valor_anonimizado}`}
                            secondary={item.contexto && `Contexto: ${item.contexto}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              )}

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Configuração Utilizada:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedAnonymization.configuracao?.incluir_cpf_rg && (
                    <Chip label="CPF/RG" size="small" />
                  )}
                  {selectedAnonymization.configuracao?.incluir_emails && (
                    <Chip label="E-mails" size="small" />
                  )}
                  {selectedAnonymization.configuracao?.incluir_telefones && (
                    <Chip label="Telefones" size="small" />
                  )}
                  {selectedAnonymization.configuracao?.incluir_nomes && (
                    <Chip label="Nomes" size="small" />
                  )}
                  {selectedAnonymization.configuracao?.incluir_enderecos && (
                    <Chip label="Endereços" size="small" />
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialog(false)}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AnonymizePage;