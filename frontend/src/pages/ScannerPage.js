import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  AlertTitle,
  Divider
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Scanner as ScannerIcon,
  Clear as ClearIcon,
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Description as DocumentIcon
} from '@mui/icons-material';
import axios from '../utils/axiosInstance';
import PDFPreviewer from '../components/PDFPreviewer';

const ScannerPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [arquivo, setArquivo] = useState(null);
  const [textoExtraido, setTextoExtraido] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  // ===================================
  // ESTADOS PARA SALVAR DOCUMENTO - CORRIGIDOS
  // ===================================
  const [saveDialog, setSaveDialog] = useState(false);
  const [documentTitle, setDocumentTitle] = useState('');
  const [clienteId, setClienteId] = useState(''); // OPCIONAL agora
  const [clientes, setClientes] = useState([]);
  const [saving, setSaving] = useState(false);

  // Carregar clientes ao montar o componente
  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      const response = await axios.get('/api/clientes/');
      setClientes(response.data.results || []);
    } catch (err) {
      console.error('Erro ao carregar clientes:', err);
      // Não é erro crítico se falhar carregar clientes
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setArquivo(file);
      setError('');
    }
  };

  const handleRemoveFile = () => {
    setArquivo(null);
    setTextoExtraido('');
    setActiveStep(0);
    setProgress({ current: 0, total: 0 });
    setSuccess('');
    setError('');
    // Limpar dados do dialog de salvar
    setDocumentTitle('');
    setClienteId('');
    setSaveDialog(false);
  };

  const startOcrProcess = async (url, formData) => {
    setLoading(true);
    setError('');
    setSuccess('');
    setProgress({ current: 0, total: 0 });
    setActiveStep(1); // Move to progress step

    try {
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        const taskId = response.data.task_id;

        const pollProgress = setInterval(async () => {
          try {
            const progressResponse = await axios.get(`/api/documentos/ocr-progress/${taskId}/`);
            const progressData = progressResponse.data;

            setProgress({
              current: progressData.current_page,
              total: progressData.total_pages
            });

            if (progressData.status === 'concluido') {
              clearInterval(pollProgress);
              setLoading(false);
              setTextoExtraido(progressData.resultado.texto || 'Nenhum texto encontrado.');
              setSuccess('Texto extraído com sucesso!');
              setActiveStep(2); // Move to save step

              // ✅ GERAR TÍTULO AUTOMÁTICO BASEADO NO ARQUIVO
              generateAutoTitle();
            } else if (progressData.status === 'erro') {
              clearInterval(pollProgress);
              setLoading(false);
              setError(progressData.message || 'Erro no processamento do documento.');
              setActiveStep(0); // Return to upload step
            }
          } catch (progressError) {
            clearInterval(pollProgress);
            console.error('Erro ao consultar progresso:', progressError);
            setError('Não foi possível obter o progresso do processamento.');
            setLoading(false);
            setActiveStep(0);
          }
        }, 2000);
      } else {
        setError(response.data.error || 'Erro ao iniciar processamento');
        setLoading(false);
        setActiveStep(0);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao enviar documento para OCR');
      console.error('Erro no OCR:', err);
      setLoading(false);
      setActiveStep(0);
    }
  };

  // Handler para OCR de arquivo inteiro (imagens)
  const handleOcrFull = async () => {
    if (!arquivo) return;
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    startOcrProcess('/api/documentos/ocr-async/', formData);
  };

  // Handler para OCR com margens (PDFs)
  const handleProcessWithMargins = (margins) => {
    if (!arquivo) return;
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    formData.append('margins', JSON.stringify(margins));
    startOcrProcess('/api/documentos/ocr-full-with-margins/', formData);
  };

  // ===================================
  // FUNÇÕES PARA SALVAR DOCUMENTO - CORRIGIDAS
  // ===================================

  const generateAutoTitle = () => {
    if (arquivo) {
      // Remover extensão e usar nome do arquivo
      const baseName = arquivo.name.replace(/\.[^/.]+$/, "");
      const now = new Date();
      const dateTime = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });
      setDocumentTitle(`${baseName} - Digitalizado em ${dateTime}`);
    }
  };

  const handleOpenSaveDialog = () => {
    if (!textoExtraido.trim()) {
      setError('Nenhum texto extraído para salvar. Processe um documento primeiro.');
      return;
    }

    if (!documentTitle) {
      generateAutoTitle();
    }

    setSaveDialog(true);
  };

  const handleSaveDocument = async () => {
    if (!documentTitle.trim()) {
      setError('Por favor, insira um título para o documento.');
      return;
    }

    if (!textoExtraido.trim()) {
      setError('Nenhum texto extraído para salvar.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const documentData = {
        titulo: documentTitle.trim(),
        texto_extraido: textoExtraido.trim(),
        cliente_id: clienteId ? parseInt(clienteId) : null,
        nome_arquivo_original: arquivo?.name || ''
      };

      console.log('💾 Salvando via endpoint específico do scanner:', documentData);

      // ✅ USAR ENDPOINT ESPECÍFICO PARA SCANNER
      const response = await axios.post('/api/documentos/salvar-scanner/', documentData);

      console.log('✅ Resposta da API:', response.data);

      if (response.data.success) {
        setSuccess(`✅ Documento "${documentTitle}" salvo com sucesso! ID: ${response.data.id}`);
        setSaveDialog(false);

        setTimeout(() => {
          if (window.confirm('Documento salvo com sucesso!\n\nDeseja escanear outro documento?')) {
            handleRemoveFile();
          }
        }, 1500);
      }

    } catch (err) {
      console.error('❌ Erro ao salvar:', err);
      console.error('❌ Response:', err.response?.data);

      const errorMsg = err.response?.data?.error || err.response?.data?.details || 'Erro ao salvar documento';
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };
  
  // ✅ MÉTODO ALTERNATIVO USANDO FORMDATA
  const saveDocumentAlternative = async () => {
    try {
      const formData = new FormData();
      formData.append('titulo', documentTitle.trim());
      formData.append('texto_extraido', textoExtraido.trim());

      if (clienteId) {
        formData.append('cliente', clienteId);
      }

      // ✅ ADICIONAR CAMPOS QUE PODEM SER NECESSÁRIOS
      formData.append('tipo_documento', 'digitalizado');
      formData.append('origem', 'scanner_manual');
      formData.append('tem_texto', 'true');
      formData.append('publico', 'false');

      if (arquivo?.name) {
        formData.append('nome_arquivo_original', arquivo.name);
      }

      console.log('🔄 Tentando salvar com FormData...');

      const response = await axios.post('/api/documentos/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.id || response.status === 201) {
        setSuccess(`✅ Documento "${documentTitle}" salvo com sucesso! ID: ${response.data.id}`);
        setSaveDialog(false);

        setTimeout(() => {
          if (window.confirm('Documento salvo!\n\nEscanear outro?')) {
            handleRemoveFile();
          }
        }, 1500);
      }

    } catch (altErr) {
      console.error('❌ Método alternativo também falhou:', altErr);
      setError('Erro ao salvar documento. Verifique se todos os campos obrigatórios estão preenchidos.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <ScannerIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" gutterBottom>
              Scanner de Documentos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Defina as margens para ignorar cabeçalhos e rodapés, e extraia o texto de seus documentos.
            </Typography>
          </Box>
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {['Configurar Documento', 'Processando', 'Resultado'].map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

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

        {activeStep !== 1 && !loading && !textoExtraido && (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                1. Faça Upload do Documento
              </Typography>

              {!arquivo ? (
                <Button variant="contained" component="label" startIcon={<UploadIcon />} size="large">
                  Selecionar Arquivo
                  <input type="file" hidden accept=".pdf,.jpg,.jpeg,.png,.tiff,.bmp" onChange={handleFileChange} />
                </Button>
              ) : (
                <Box>
                  <Chip
                    label={arquivo.name}
                    onDelete={handleRemoveFile}
                    deleteIcon={<ClearIcon />}
                    color="primary"
                    sx={{ maxWidth: 300, mb: 2 }}
                  />
                  {arquivo.type === 'application/pdf' ? (
                    <PDFPreviewer file={arquivo} onExtractWithMargins={handleProcessWithMargins} />
                  ) : (
                    <Button variant="contained" color="primary" onClick={handleOcrFull} disabled={loading} startIcon={loading ? <CircularProgress size={20} /> : <ScannerIcon />}>
                      {loading ? 'Processando...' : 'Extrair Texto (OCR)'}
                    </Button>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {activeStep === 1 && (
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>Processando Documento</Typography>
              <CircularProgress sx={{ my: 2 }} />
              {progress.total > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Processando página {progress.current} de {progress.total}...
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(progress.current / progress.total) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              )}
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Isso pode levar alguns instantes, dependendo do tamanho do documento.
              </Typography>
            </CardContent>
          </Card>
        )}

        {activeStep === 2 && (
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📄 Resultado da Extração
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={15}
                value={textoExtraido}
                onChange={(e) => setTextoExtraido(e.target.value)}
                variant="outlined"
                sx={{ my: 2, backgroundColor: 'grey.50' }}
                placeholder="Texto extraído aparecerá aqui..."
              />

              {/* ESTATÍSTICAS DO TEXTO */}
              <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={`${textoExtraido.length} caracteres`}
                  color="primary"
                  size="small"
                />
                <Chip
                  label={`${textoExtraido.split(/\s+/).filter(word => word.length > 0).length} palavras`}
                  color="secondary"
                  size="small"
                />
                <Chip
                  label={`${textoExtraido.split('\n').length} linhas`}
                  color="info"
                  size="small"
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* BOTÕES DE AÇÃO */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={handleRemoveFile}
                  startIcon={<ClearIcon />}
                >
                  Escanear Outro Documento
                </Button>

                {/* ✅ BOTÃO SALVAR DOCUMENTO */}
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  onClick={handleOpenSaveDialog}
                  startIcon={<SaveIcon />}
                  disabled={!textoExtraido.trim()}
                  sx={{
                    minWidth: 200,
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }}
                >
                  💾 Salvar no Sistema
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Paper>

      {/* ===================================
          DIALOG DE SALVAR - CLIENTE OPCIONAL
          =================================== */}

      <Dialog
        open={saveDialog}
        onClose={() => setSaveDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SaveIcon sx={{ mr: 1, color: 'success.main' }} />
            Salvar Documento no Sistema
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              <AlertTitle>💾 Salvar no Banco de Dados</AlertTitle>
              O documento será salvo apenas no banco de dados do sistema.
              O arquivo físico não será armazenado, apenas o texto extraído.
            </Alert>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Título do Documento *"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  variant="outlined"
                  required
                  placeholder="Ex: Contrato de Locação - João Silva"
                  helperText="Digite um título descritivo para o documento"
                  InputProps={{
                    startAdornment: <DocumentIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Cliente (Opcional)</InputLabel>
                  <Select
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                    label="Cliente (Opcional)"
                  >
                    <MenuItem value="">
                      <em>Nenhum cliente - Documento geral</em>
                    </MenuItem>
                    {clientes.map((cliente) => (
                      <MenuItem key={cliente.id} value={cliente.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          {cliente.tipo_cliente === 'pessoa_fisica' ?
                            <PersonIcon sx={{ mr: 1, fontSize: 18, color: 'primary.main' }} /> :
                            <BusinessIcon sx={{ mr: 1, fontSize: 18, color: 'secondary.main' }} />
                          }
                          <Box>
                            <Typography variant="body1">{cliente.nome}</Typography>
                            {cliente.tipo_cliente === 'pessoa_fisica' && cliente.cpf && (
                              <Typography variant="caption" color="text.secondary">
                                CPF: {cliente.cpf}
                              </Typography>
                            )}
                            {cliente.tipo_cliente === 'pessoa_juridica' && cliente.cnpj && (
                              <Typography variant="caption" color="text.secondary">
                                CNPJ: {cliente.cnpj}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  📋 Preview do Texto Extraído:
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, maxHeight: 200, overflow: 'auto', bgcolor: 'grey.50' }}>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                    {textoExtraido.substring(0, 500)}
                    {textoExtraido.length > 500 && '...'}
                  </Typography>
                </Paper>
                <Box sx={{ mt: 1, display: 'flex', gap: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={`${textoExtraido.length} caracteres`}
                      size="small"
                      color="primary"
                    />
                    <Chip
                      label={`${textoExtraido.split(/\s+/).filter(word => word.length > 0).length} palavras`}
                      size="small"
                      color="secondary"
                    />
                  </Box>
                  {arquivo && (
                    <Chip
                      label={`Arquivo: ${arquivo.name}`}
                      size="small"
                      color="info"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setSaveDialog(false)}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleSaveDocument}
            disabled={saving || !documentTitle.trim()}
            startIcon={saving ? <CircularProgress size={20} /> : <CheckCircleIcon />}
            sx={{ minWidth: 150 }}
          >
            {saving ? 'Salvando...' : '💾 Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScannerPage;