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
  AlertTitle,
  CircularProgress,
  MenuItem,
  TextField,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';import {
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Restore as RestoreIcon,
  Description as DocumentIcon,
  ExpandMore as ExpandMoreIcon,
  Settings as SettingsIcon,
  AutoAwesome as AIIcon,
  Code as RegexIcon,
  Delete as DeleteIcon,
  ContentCopy as ContentCopyIcon,
  Edit as EditIcon,
  Undo as UndoIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  TouchApp as TouchAppIcon
} from '@mui/icons-material';
import axios from '../utils/axiosInstance';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AnonymizePage = () => {
  // Estados existentes
  const [documentos, setDocumentos] = useState([]);
  const [anonimizacoes, setAnonimizacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estados dos dialogs existentes
  const [copied, setCopied] = useState('');
  const [previewDialog, setPreviewDialog] = useState(false);
  const [anonymizeDialog, setAnonymizeDialog] = useState(false);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [compareDialog, setCompareDialog] = useState(false);
  const [deanonymizeDialog, setDeanonymizeDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedAnonymization, setSelectedAnonymization] = useState(null);
  
  // Estados para desanonimização existentes
  const [textoParaDesanonimizar, setTextoParaDesanonimizar] = useState('');
  const [textoDesanonimizado, setTextoDesanonimizado] = useState('');
  const [anonimizacaoSelecionadaDeanon, setAnonimizacaoSelecionadaDeanon] = useState(null);
  
  // Estados da configuração de anonimização existentes
  const [tipoAnonimizacao, setTipoAnonimizacao] = useState('ia');
  const [incluirNomes, setIncluirNomes] = useState(true);
  const [incluirEnderecos, setIncluirEnderecos] = useState(true);
  const [incluirEmails, setIncluirEmails] = useState(true);
  const [incluirTelefones, setIncluirTelefones] = useState(true);
  const [incluirCpfRg, setIncluirCpfRg] = useState(true);

  // ===================================
  // ESTADOS ANONIMIZAÇÃO MANUAL - CORRIGIDOS
  // ===================================
  const [manualModeActive, setManualModeActive] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [manualAnonymizeDialog, setManualAnonymizeDialog] = useState(false);
  const [suggestedType, setSuggestedType] = useState('');
  const [manualAnonymizations, setManualAnonymizations] = useState([]);

  // Carregar dados (função existente)
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

  // ===================================
  // FUNÇÕES ANONIMIZAÇÃO MANUAL - CORRIGIDAS
  // ===================================

  const handleTextSelection = (event) => {
    console.log('🎯 handleTextSelection chamada, modo manual:', manualModeActive);
    
    if (!manualModeActive) {
      console.log('❌ Modo manual inativo, ignorando seleção');
      return;
    }

    // ✅ CAPTURAR IMEDIATAMENTE SEM TIMEOUT
    const selection = window.getSelection();
    const text = selection.toString().trim();

    console.log('🔍 Seleção IMEDIATA:', {
      texto: text,
      comprimento: text.length,
      modoManual: manualModeActive,
      selectionRangeCount: selection.rangeCount
    });

    if (text.length > 1) {
      console.log('💾 Salvando texto IMEDIATAMENTE:', text);
      
      // ✅ SALVAR TEXTO E ABRIR DIALOG IMEDIATAMENTE
      setSelectedText(text);
      
      // ✅ ABRIR DIALOG DIRETO SEM TOOLTIP
      handleOpenManualAnonymizeDialogDirect(text);
      
      // ✅ LIMPAR SELEÇÃO VISUAL
      selection.removeAllRanges();
    } else {
      console.log('❌ Texto muito curto:', text);
    }
  };

  const handleOpenManualAnonymizeDialogDirect = async (textoSelecionado) => {
    console.log('🎨 Abrindo dialog DIRETO para:', textoSelecionado);
    
    if (!textoSelecionado || textoSelecionado.length < 2) {
      console.log('❌ Texto inválido');
      setError('Por favor, selecione um texto válido para anonimizar.');
      return;
    }

    if (!selectedAnonymization) {
      console.log('❌ Nenhuma anonimização selecionada');
      setError('Erro: nenhuma anonimização selecionada.');
      return;
    }

    try {
      console.log('🤖 Sugerindo tipo para:', textoSelecionado);
      
      // ✅ GARANTIR QUE O TEXTO ESTEJA SETADO ANTES DA SUGESTÃO
      setSelectedText(textoSelecionado);
      
      // Sugerir tipo automaticamente
      const response = await axios.post('/api/documentos/suggest-type/', {
        texto_selecionado: textoSelecionado
      });

      if (response.data.success && response.data.sugestoes.tipos_possiveis.length > 0) {
        const tiposComConfianca = response.data.sugestoes.confianca;
        const melhorTipo = Object.keys(tiposComConfianca).reduce((a, b) => 
          tiposComConfianca[a] > tiposComConfianca[b] ? a : b
        );
        console.log('💡 Tipo sugerido:', melhorTipo);
        setSuggestedType(melhorTipo);
      } else {
        console.log('⚠️ Usando tipo padrão');
        setSuggestedType('nome');
      }

      // ✅ ABRIR DIALOG IMEDIATAMENTE
      setManualAnonymizeDialog(true);
      
    } catch (err) {
      console.error('❌ Erro ao sugerir tipo:', err);
      setSuggestedType('nome');
      setManualAnonymizeDialog(true);
    }
  };

  const handleManualAnonymize = async () => {
    if (!selectedText || !selectedAnonymization || !suggestedType) {
      console.log('❌ Dados incompletos para anonimização manual');
      return;
    }

    try {
      setProcessing(true);
      setError('');
      
      console.log('🚀 Enviando anonimização manual:', {
        texto: selectedText,
        tipo: suggestedType,
        anonimizacao_id: selectedAnonymization.id
      });

      const response = await axios.post('/api/documentos/manual-anonymize/', {
        anonimizacao_id: selectedAnonymization.id,
        texto_selecionado: selectedText,
        tipo: suggestedType
      });

      if (response.data.success) {
        console.log('✅ Anonimização manual bem-sucedida:', response.data);
        
        setSuccess(`✅ Texto "${selectedText}" anonimizado como ${response.data.placeholder} (${response.data.ocorrencias} ocorrências)`);
        
        // Atualizar o texto na interface
        setSelectedAnonymization(prev => ({
          ...prev,
          texto_preview: {
            ...prev.texto_preview,
            anonimizado: response.data.texto_atualizado
          }
        }));

        // Recarregar anonimizações manuais
        await loadManualAnonymizations();
        
        setManualAnonymizeDialog(false);
        setSelectedText('');
        setTimeout(() => setSuccess(''), 5000);
      } else {
        console.log('❌ Erro na anonimização manual:', response.data.error);
        setError(response.data.error || 'Erro ao anonimizar texto');
      }
    } catch (err) {
      console.error('❌ Erro na anonimização manual:', err);
      setError(err.response?.data?.error || 'Erro ao anonimizar texto selecionado');
    } finally {
      setProcessing(false);
    }
  };

  const handleUndoManualAnonymization = async (itemId) => {
    try {
      setProcessing(true);
      setError('');

      const response = await axios.post('/api/documentos/undo-manual-anonymize/', {
        anonimizacao_id: selectedAnonymization.id,
        item_id: itemId
      });

      if (response.data.success) {
        setSuccess(`↩️ Anonimização desfeita: ${response.data.placeholder_removido} → "${response.data.valor_restaurado}"`);
        
        // Atualizar o texto na interface
        setSelectedAnonymization(prev => ({
          ...prev,
          texto_preview: {
            ...prev.texto_preview,
            anonimizado: response.data.texto_atualizado
          }
        }));

        // Recarregar anonimizações manuais
        await loadManualAnonymizations();
        
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(response.data.error || 'Erro ao desfazer anonimização');
      }
    } catch (err) {
      console.error('Erro ao desfazer anonimização:', err);
      setError(err.response?.data?.error || 'Erro ao desfazer anonimização');
    } finally {
      setProcessing(false);
    }
  };

  const loadManualAnonymizations = async () => {
    if (!selectedAnonymization) return;

    try {
      const response = await axios.get(`/api/documentos/anonymizations/${selectedAnonymization.id}/manual/`);
      if (response.data.success) {
        setManualAnonymizations(response.data.itens_manuais || []);
      }
    } catch (err) {
      console.error('Erro ao carregar anonimizações manuais:', err);
    }
  };

  // Carregar anonimizações manuais quando abrir o dialog de comparação
  useEffect(() => {
    if (compareDialog && selectedAnonymization) {
      loadManualAnonymizations();
    }
  }, [compareDialog, selectedAnonymization]);

  // ===================================
  // FUNÇÕES EXISTENTES (mantidas iguais)
  // ===================================

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

  const handleCompareTexts = async (anonimizacao) => {
    try {
      const response = await axios.get(`/api/documentos/anonymizations/${anonimizacao.id}/`);
      setSelectedAnonymization(response.data.data);
      setCompareDialog(true);
    } catch (err) {
      console.error('Erro ao carregar textos:', err);
      setError('Erro ao carregar textos para comparação');
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

      const response = await axios.post(`/api/documentos/${selectedDocument.id}/anonymize/`, payload);
      
      setSuccess(`✅ Documento anonimizado com sucesso! ${response.data.total_substituicoes} substituições realizadas.`);
      setAnonymizeDialog(false);
      
      await loadData();
      
      if (response.data.anonimizacao_id) {
        const verResultado = window.confirm(
          `Anonimização concluída com ${response.data.total_substituicoes} substituições!\n\n` +
          'Deseja visualizar o resultado agora?'
        );
        
        if (verResultado) {
          const anonResponse = await axios.get(`/api/documentos/anonymizations/${response.data.anonimizacao_id}/`);
          setSelectedAnonymization(anonResponse.data.data);
          setCompareDialog(true);
        }
      }
      
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
      
      await loadData();
      
      setTimeout(() => setSuccess(''), 5000);
      
    } catch (err) {
      console.error('❌ Erro na restauração:', err);
      setError(err.response?.data?.error || 'Erro ao restaurar documento');
    } finally {
      setProcessing(false);
    }
  };

  const deleteAnonymization = async (anonimizacaoId) => {
    if (!window.confirm('Tem certeza que deseja deletar este registro de anonimização? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      setProcessing(true);
      setError('');

      await axios.delete(`/api/documentos/anonymizations/${anonimizacaoId}/delete/`);
      
      setSuccess('Registro de anonimização deletado com sucesso!');
      setDetailsDialog(false);
      
      await loadData();
      
      setTimeout(() => setSuccess(''), 5000);
      
    } catch (err) {
      console.error('❌ Erro ao deletar:', err);
      setError(err.response?.data?.error || 'Erro ao deletar registro de anonimização');
    } finally {
      setProcessing(false);
    }
  };

  const handleOpenDeanonymizeDialog = (anonimizacao) => {
    setAnonimizacaoSelecionadaDeanon(anonimizacao);
    setTextoParaDesanonimizar('');
    setTextoDesanonimizado('');
    setDeanonymizeDialog(true);
  };

  const handleDeanonymizeText = async () => {
    if (!textoParaDesanonimizar.trim()) {
      setError('Por favor, insira um texto para desanonimizar');
      return;
    }

    try {
      setProcessing(true);
      setError('');

      const response = await axios.post(
        `/api/documentos/anonymizations/${anonimizacaoSelecionadaDeanon.id}/deanonymize/`,
        { texto_anonimizado: textoParaDesanonimizar }
      );

      if (response.data.success) {
        setTextoDesanonimizado(response.data.texto_desanonimizado);
        setSuccess(`✅ Texto desanonimizado com sucesso! ${response.data.total_substituicoes} substituições realizadas.`);
        setTimeout(() => setSuccess(''), 5000);
      }

    } catch (err) {
      console.error('❌ Erro ao desanonimizar:', err);
      setError(err.response?.data?.error || 'Erro ao desanonimizar texto');
    } finally {
      setProcessing(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setSuccess('Texto copiado para a área de transferência!');
      setTimeout(() => setSuccess(''), 3000);
    }).catch(() => {
      setError('Erro ao copiar texto');
    });
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
                          <ListItem alignItems="flex-start" sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
                            <Box sx={{ display: 'flex', width: '100%', mb: 1 }}>
                              <DocumentIcon sx={{ mr: 2, mt: 0.5, color: 'primary.main' }} />
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                  {documento.titulo || `Documento ${documento.id}`}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Cliente: {documento.cliente_nome || 'N/A'}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', width: '100%', pl: 5 }}>
                              <Button
                                variant="outlined"
                                onClick={() => handlePreviewDocument(documento)}
                                startIcon={<VisibilityIcon />}
                                size="small"
                              >
                                Visualizar
                              </Button>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleAnonymizeDocument(documento)}
                                startIcon={<SecurityIcon />}
                                size="small"
                                disabled={processing}
                              >
                                Anonimizar
                              </Button>
                            </Box>
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
                          <ListItem alignItems="flex-start" sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
                            <Box sx={{ display: 'flex', width: '100%', mb: 1 }}>
                              <SecurityIcon sx={{ mr: 2, mt: 0.5, color: 'primary.main' }} />
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                  {anon.documento_titulo}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {anon.cliente_nome} • {anon.total_substituicoes} substituições
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {format(new Date(anon.data_solicitacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', width: '100%', pl: 5 }}>
                              <Button
                                variant="outlined"
                                onClick={() => handleCompareTexts(anon)}
                                startIcon={<VisibilityIcon />}
                                size="small"
                              >
                                Visualizar
                              </Button>
                              <Button
                                variant="outlined"
                                onClick={() => handleOpenDeanonymizeDialog(anon)}
                                startIcon={<RestoreIcon />}
                                size="small"
                                color="secondary"
                              >
                                Reverter
                              </Button>
                              <Button
                                variant="outlined"
                                onClick={() => handleViewDetails(anon)}
                                startIcon={<SettingsIcon />}
                                size="small"
                              >
                                Detalhes
                              </Button>
                              <Button
                                variant="outlined"
                                onClick={() => deleteAnonymization(anon.id)}
                                startIcon={<DeleteIcon />}
                                size="small"
                                color="error"
                              >
                                Deletar
                              </Button>
                            </Box>
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

      {/* Dialog de Preview (mantido igual) */}
      <Dialog 
        open={previewDialog} 
        onClose={() => setPreviewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Prévia do Documento
        </DialogTitle>
        <DialogContent sx={{ minWidth: '1200px', maxWidth: '1400px', minHeight: '900px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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

      {/* Dialog de Anonimização (mantido igual) */}
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
              <Typography variant="subtitle2" gutterBottom>
                Método de Anonimização
              </Typography>
              <ToggleButtonGroup
                color="primary"
                value={tipoAnonimizacao}
                exclusive
                onChange={(event, newTipo) => {
                  if (newTipo !== null) {
                    setTipoAnonimizacao(newTipo);
                  }
                }}
                aria-label="Método de Anonimização"
              >
                <ToggleButton value="regex" startIcon={<RegexIcon />}>
                  Regex (Local)
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>

            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 2 }}>
                <AlertTitle>
                  {'Anonimização com Regex'}
                </AlertTitle>
                {'Usa expressões regulares locais para detectar e anonimizar dados. Rápido e funciona offline.'}
              </Alert>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Selecione os tipos de dados para anonimizar:
              </Typography>
              <Box>
                <FormControlLabel
                  control={<Switch checked={incluirNomes} onChange={(e) => setIncluirNomes(e.target.checked)} />}
                  label="Nomes, Pessoas e Organizações"
                />
                <FormControlLabel
                  control={<Switch checked={incluirCpfRg} onChange={(e) => setIncluirCpfRg(e.target.checked)} />}
                  label="CPF e RG"
                />
                <FormControlLabel
                  control={<Switch checked={incluirEnderecos} onChange={(e) => setIncluirEnderecos(e.target.checked)} />}
                  label="Endereços e Locais"
                />
                <FormControlLabel
                  control={<Switch checked={incluirEmails} onChange={(e) => setIncluirEmails(e.target.checked)} />}
                  label="E-mails"
                />
                <FormControlLabel
                  control={<Switch checked={incluirTelefones} onChange={(e) => setIncluirTelefones(e.target.checked)} />}
                  label="Telefones"
                />
              </Box>
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

      {/* ===================================
          DIALOG ATUALIZADO - COMPARAÇÃO COM ANONIMIZAÇÃO MANUAL
          =================================== */}

      <Dialog 
        open={compareDialog} 
        onClose={() => {
          setCompareDialog(false);
          setManualModeActive(false);
          console.log('🔒 Dialog fechado, modo manual desativado');
        }}
        maxWidth="xl"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
              Comparação: Original vs Anonimizado
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {selectedAnonymization && (
                <Chip 
                  label={`${selectedAnonymization.total_substituicoes || 0} substituições`}
                  color="primary"
                  size="small"
                />
              )}
              <Tooltip title="Ativar modo de anonimização manual">
                <Button
                  variant={manualModeActive ? "contained" : "outlined"}
                  size="small"
                  onClick={() => {
                    const newMode = !manualModeActive;
                    setManualModeActive(newMode);
                    console.log('🎯 Modo manual alterado para:', newMode);
                    if (!newMode) {
                      setSelectedText('');
                    }
                  }}
                  startIcon={<EditIcon />}
                  color={manualModeActive ? "secondary" : "primary"}
                >
                  {manualModeActive ? "MODO MANUAL ON" : "Anonimização Manual"}
                </Button>
              </Tooltip>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedAnonymization && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                <strong>Documento:</strong> {selectedAnonymization.documento_titulo}
                <br />
                <strong>Status:</strong> {getStatusLabel(selectedAnonymization.status)}
                {selectedAnonymization.data_conclusao && (
                  <>
                    <br />
                    <strong>Processado em:</strong> {format(new Date(selectedAnonymization.data_conclusao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </>
                )}
                {manualModeActive && (
                  <>
                    <br />
                    <strong>🎯 Modo Manual ATIVO:</strong> Selecione texto no painel da DIREITA (anonimizado) para adicionar anonimizações manuais
                  </>
                )}
              </Alert>

              {/* Anonimizações Manuais */}
              {manualAnonymizations.length > 0 && (
                <Accordion sx={{ mb: 3 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">
                      ✏️ Anonimizações Manuais ({manualAnonymizations.length} itens)
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      {manualAnonymizations.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                          <Paper variant="outlined" sx={{ p: 1.5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                                {item.tipo.replace('_manual', '')}
                              </Typography>
                              <Tooltip title="Desfazer anonimização manual">
                                <IconButton
                                  size="small"
                                  onClick={() => handleUndoManualAnonymization(item.id)}
                                  disabled={processing}
                                >
                                  <UndoIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <Chip 
                                label={item.placeholder} 
                                size="small" 
                                color="secondary"
                                sx={{ mr: 1 }}
                              />
                              <Typography variant="body2">
                                ← {item.valor_original}
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              )}

              {/* Legenda de Substituições Automáticas */}
              {selectedAnonymization.itens && selectedAnonymization.itens.length > 0 && (
                <Accordion sx={{ mb: 3 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">
                      🤖 Substituições Automáticas ({selectedAnonymization.itens.length} itens)
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      {selectedAnonymization.itens.slice(0, 20).map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                          <Paper variant="outlined" sx={{ p: 1.5 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                              {item.tipo_dado}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <Chip 
                                label={item.valor_anonimizado} 
                                size="small" 
                                color="primary"
                                sx={{ mr: 1 }}
                              />
                              <Typography variant="body2">
                                ← {item.valor_original}
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                      {selectedAnonymization.itens.length > 20 && (
                        <Grid item xs={12}>
                          <Alert severity="info">
                            Mostrando 20 de {selectedAnonymization.itens.length} substituições. 
                            Veja todos os detalhes clicando em "Detalhes Técnicos".
                          </Alert>
                        </Grid>
                      )}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              )}

              <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                {/* Texto Original */}
                <Box sx={{ width: '50%' }}>
                  <Paper variant="outlined" sx={{ p: 2, height: '600px', minWidth: '0', width: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 0 }}>
                        <VisibilityOffIcon sx={{ mr: 1, color: 'error.main' }} />
                        Texto Original (Confidencial)
                      </Typography>
                      <IconButton
                        aria-label="Copiar texto original"
                        size="small"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedAnonymization.texto_preview?.original || '');
                          setCopied('Texto original copiado!');
                        }}
                        sx={{ ml: 1 }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <TextField
                      multiline
                      value={selectedAnonymization.texto_preview?.original || ''}
                      InputProps={{
                        readOnly: true,
                        style: { 
                          fontFamily: 'monospace',
                          fontSize: '0.85rem',
                          lineHeight: '1.4'
                        }
                      }}
                      variant="outlined"
                      sx={{ 
                        flex: 1,
                        '& .MuiInputBase-root': {
                          height: '100%',
                          alignItems: 'flex-start'
                        }
                      }}
                    />
                  </Paper>
                </Box>

                {/* Texto Anonimizado - COM SELEÇÃO MANUAL */}
                <Box sx={{ width: '50%' }}>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      height: '600px', 
                      minWidth: '0', 
                      width: '100%', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      bgcolor: manualModeActive ? 'secondary.lighter' : 'success.lighter',
                      border: manualModeActive ? 2 : 1,
                      borderColor: manualModeActive ? 'secondary.main' : 'divider'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 0 }}>
                        <SecurityIcon sx={{ mr: 1, color: 'success.main' }} />
                        Texto Anonimizado 
                        {manualModeActive && <TouchAppIcon sx={{ ml: 1, color: 'secondary.main' }} />}
                      </Typography>
                      <IconButton
                        aria-label="Copiar texto anonimizado"
                        size="small"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedAnonymization.texto_preview?.anonimizado || '');
                          setCopied('Texto anonimizado copiado!');
                        }}
                        sx={{ ml: 1 }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    
                    {manualModeActive && (
                      <Alert severity="info" size="small" sx={{ mb: 2, py: 0.5 }}>
                        <Typography variant="caption">
                          🎯 <strong>MODO MANUAL ATIVO</strong> - Selecione texto abaixo para anonimizar
                        </Typography>
                      </Alert>
                    )}
                    
                    <TextField
                      multiline
                      value={selectedAnonymization.texto_preview?.anonimizado || ''}
                      InputProps={{
                        readOnly: true,
                        style: { 
                          fontFamily: 'monospace',
                          fontSize: '0.85rem',
                          lineHeight: '1.4',
                          backgroundColor: manualModeActive ? '#fff3e0' : '#f0f9ff',
                          cursor: manualModeActive ? 'crosshair' : 'default'
                        },
                        // ✅ EVENTO SIMPLIFICADO
                        onMouseUp: manualModeActive ? handleTextSelection : undefined,
                      }}
                      variant="outlined"
                      sx={{ 
                        flex: 1,
                        '& .MuiInputBase-root': {
                          height: '100%',
                          alignItems: 'flex-start'
                        },
                        // ✅ PERMITIR SELEÇÃO DE TEXTO
                        '& .MuiInputBase-input': {
                          userSelect: manualModeActive ? 'text' : 'none',
                        }
                      }}
                    />
                  </Paper>
                </Box>
              </Box>

            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setCompareDialog(false);
              handleViewDetails(selectedAnonymization);
            }}
            startIcon={<SettingsIcon />}
          >
            Detalhes Técnicos
          </Button>
          <Button onClick={() => {
            setCompareDialog(false);
            setManualModeActive(false);
            console.log('🔒 Dialog fechado, modo manual desativado');
          }}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===================================
          DIALOG ANONIMIZAÇÃO MANUAL - CORRIGIDO
          =================================== */}

      <Dialog 
        open={manualAnonymizeDialog} 
        onClose={() => {
          console.log('🔒 Fechando dialog, texto atual:', selectedText);
          setManualAnonymizeDialog(false);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EditIcon sx={{ mr: 1, color: 'secondary.main' }} />
            Anonimização Manual
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              <AlertTitle>Texto Selecionado</AlertTitle>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: '#f5f5f5', p: 1, borderRadius: 1, mt: 1 }}>
                {selectedText ? `"${selectedText}"` : '❌ VAZIO - Tente selecionar novamente'}
              </Typography>
              {selectedText && (
                <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 1 }}>
                  ✅ {selectedText.length} caracteres capturados
                </Typography>
              )}
            </Alert>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Tipo de Dado</InputLabel>
              <Select
                value={suggestedType}
                onChange={(e) => setSuggestedType(e.target.value)}
                label="Tipo de Dado"
              >
                <MenuItem value="nome">Nome de Pessoa</MenuItem>
                <MenuItem value="empresa">Nome de Empresa</MenuItem>
                <MenuItem value="cpf">CPF</MenuItem>
                <MenuItem value="cnpj">CNPJ</MenuItem>
                <MenuItem value="endereco">Endereço</MenuItem>
                <MenuItem value="telefone">Telefone</MenuItem>
                <MenuItem value="email">E-mail</MenuItem>
                <MenuItem value="processo">Processo Judicial</MenuItem>
                <MenuItem value="oab">Registro OAB</MenuItem>
                <MenuItem value="valor">Valor Monetário</MenuItem>
                <MenuItem value="outros">Outros</MenuItem>
              </Select>
            </FormControl>

            <Alert severity="success">
              <AlertTitle>Resultado da Anonimização</AlertTitle>
              O texto será substituído por um placeholder como <strong>[{suggestedType.toUpperCase()}_MANUAL_X]</strong> em todas as ocorrências no documento.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setManualAnonymizeDialog(false)}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleManualAnonymize}
            disabled={processing || !suggestedType || !selectedText}
            startIcon={processing ? <CircularProgress size={20} /> : <CheckCircleIcon />}
          >
            {processing ? 'Anonimizando...' : 'Confirmar Anonimização'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Detalhes (mantido igual) */}
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
          <Button 
            onClick={() => deleteAnonymization(selectedAnonymization?.id)}
            color="error"
            startIcon={<DeleteIcon />}
            disabled={processing}
          >
            Deletar Registro
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button onClick={() => setDetailsDialog(false)}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Desanonimização (mantido igual) */}
      <Dialog 
        open={deanonymizeDialog} 
        onClose={() => setDeanonymizeDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <RestoreIcon sx={{ mr: 1, color: 'secondary.main' }} />
            Reverter Anonimização (ChatGPT → Dados Reais)
          </Box>
        </DialogTitle>
        <DialogContent>
          {anonimizacaoSelecionadaDeanon && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                <AlertTitle>Como usar</AlertTitle>
                <Typography variant="body2" component="span">
                  <strong>1.</strong> Cole abaixo o texto anonimizado do documento: <strong>{anonimizacaoSelecionadaDeanon.documento_titulo}</strong>
                  <br />
                  <strong>2.</strong> Você pode colar a contestação gerada pelo ChatGPT (que contém NOME1, CPF1, etc)
                  <br />
                  <strong>3.</strong> O sistema irá substituir os placeholders pelos dados reais usando o dicionário desta anonimização
                  <br />
                  <strong>4.</strong> Dicionário disponível: <Chip label={`${anonimizacaoSelecionadaDeanon.total_substituicoes || 0} substituições`} size="small" color="primary" />
                </Typography>
              </Alert>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <SecurityIcon sx={{ mr: 1, color: 'warning.main' }} />
                      Texto Anonimizado (Cole aqui a resposta do ChatGPT)
                    </Typography>
                    <TextField
                      multiline
                      rows={10}
                      fullWidth
                      value={textoParaDesanonimizar}
                      onChange={(e) => setTextoParaDesanonimizar(e.target.value)}
                      placeholder="Cole aqui o texto contendo os placeholders (NOME1, CPF1, ENDERECO1, etc)..."
                      variant="outlined"
                      sx={{ 
                        mt: 1,
                        '& .MuiInputBase-input': {
                          fontFamily: 'monospace',
                          fontSize: '0.9rem'
                        }
                      }}
                    />
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {textoParaDesanonimizar.length} caracteres
                      </Typography>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleDeanonymizeText}
                        disabled={processing || !textoParaDesanonimizar.trim()}
                        startIcon={processing ? <CircularProgress size={20} /> : <RestoreIcon />}
                      >
                        {processing ? 'Revertendo...' : 'Reverter Anonimização'}
                      </Button>
                    </Box>
                  </Paper>
                </Grid>

                {textoDesanonimizado && (
                  <Grid item xs={12}>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'success.lighter' }}>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <VisibilityIcon sx={{ mr: 1, color: 'success.main' }} />
                        Texto Revertido (Com Dados Reais)
                      </Typography>
                      <TextField
                        multiline
                        rows={10}
                        fullWidth
                        value={textoDesanonimizado}
                        InputProps={{
                          readOnly: true,
                          style: { 
                            fontFamily: 'monospace',
                            fontSize: '0.9rem',
                            backgroundColor: '#f0f9ff'
                          }
                        }}
                        variant="outlined"
                        sx={{ mt: 1 }}
                      />
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          {textoDesanonimizado.length} caracteres
                        </Typography>
                        <Button
                          variant="outlined"
                          color="success"
                          onClick={() => copyToClipboard(textoDesanonimizado)}
                          startIcon={<VisibilityIcon />}
                        >
                          Copiar Texto
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                )}
              </Grid>

              {!textoDesanonimizado && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  <AlertTitle>Exemplo de Uso</AlertTitle>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                    <strong>Entrada (ChatGPT):</strong>
                    <br />
                    "Diante do exposto, requer NOME1, portador do CPF1, residente em ENDERECO1..."
                    <br /><br />
                    <strong>Saída (Desanonimizado):</strong>
                    <br />
                    "Diante do exposto, requer João Silva, portador do CPF 123.456.789-00, residente em Rua das Flores, 123..."
                  </Typography>
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setDeanonymizeDialog(false);
              setTextoParaDesanonimizar('');
              setTextoDesanonimizado('');
            }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de feedback de cópia */}
      <Snackbar
        open={!!copied}
        autoHideDuration={2000}
        onClose={() => setCopied('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setCopied('')} severity="success" sx={{ width: '100%' }}>
          {copied}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AnonymizePage;