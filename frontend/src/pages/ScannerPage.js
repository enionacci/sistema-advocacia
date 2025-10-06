import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  IconButton,
  Chip,
  Divider,
  Grid
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Scanner as ScannerIcon,
  Psychology as AIIcon,
  Clear as ClearIcon,
  Send as SendIcon
} from '@mui/icons-material';
import axios from '../utils/axiosInstance';

const TIPOS_ANALISE = [
  { value: 'resumo', label: 'Resumo Executivo', description: 'Resumo conciso do documento' },
  { value: 'extracao_dados', label: 'Extração de Dados', description: 'Extrai informações estruturadas' },
  { value: 'juridico', label: 'Análise Jurídica', description: 'Análise sob perspectiva jurídica' },
  { value: 'contrato', label: 'Análise de Contrato', description: 'Cláusulas, riscos e obrigações' },
  { value: 'risco', label: 'Análise de Risco', description: 'Identifica riscos e alertas' },
  { value: 'personalizado', label: 'Personalizado', description: 'Análise com prompt customizado' }
];

const ScannerPage = () => {
  // Estados
  const [activeStep, setActiveStep] = useState(0);
  const [arquivo, setArquivo] = useState(null);
  const [textoExtraido, setTextoExtraido] = useState('');
  const [tipoAnalise, setTipoAnalise] = useState('resumo');
  const [promptPersonalizado, setPromptPersonalizado] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const steps = ['Upload do Documento', 'Extração de Texto (OCR)', 'Análise com IA'];

  // Funções
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
  };

  const handleOCR = async () => {
    if (!arquivo) {
      setError('Por favor, selecione um arquivo');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('arquivo', arquivo);

      const response = await axios.post('/api/documentos/ocr/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setTextoExtraido(response.data.texto);
      setActiveStep(1);
      setSuccess('Texto extraído com sucesso!');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao processar OCR');
      console.error('Erro no OCR:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDocument = async () => {
    if (!textoExtraido.trim()) {
      setError('Não há texto para salvar');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        texto: textoExtraido,
        salvar_sem_analise: true  // Flag para indicar que é só para salvar
      };

      await axios.post('/api/documentos/salvar-ocr/', payload);
      
      setSuccess('Documento salvo com sucesso!');
      
      // Limpar após 2 segundos
      setTimeout(() => {
        handleRemoveFile();
        setSuccess('');
      }, 2000);

    } catch (err) {
      console.error('❌ Erro ao salvar documento:', err);
      setError(err.response?.data?.error || 'Erro ao salvar documento');
    } finally {
      setLoading(false);
    }
  };

  const handleAnaliseIA = async () => {
    if (!textoExtraido) {
      setError('É necessário extrair o texto primeiro');
      return;
    }

    if (tipoAnalise === 'personalizado' && !promptPersonalizado.trim()) {
      setError('Por favor, forneça instruções personalizadas');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        texto: textoExtraido,
        tipo_analise: tipoAnalise,
        prompt_personalizado: tipoAnalise === 'personalizado' ? promptPersonalizado : null
      };

      console.log('📤 Enviando payload:', payload);

      const response = await axios.post('/api/documentos/analises/', payload);

      setActiveStep(2);
      setSuccess('Análise solicitada com sucesso! Você pode acompanhar o progresso na página de Análises.');
      
      // Limpar após 3 segundos
      setTimeout(() => {
        handleRemoveFile();
        setSuccess('');
        setPromptPersonalizado('');
        setTipoAnalise('resumo');
      }, 3000);

    } catch (err) {
      console.error('❌ Erro completo:', err);
      console.error('❌ Resposta do servidor:', err.response?.data);
      setError(err.response?.data?.error || 'Erro ao solicitar análise');
      console.error('Erro na análise IA:', err);
    } finally {
      setLoading(false);
    }
  };

  const tipoAnaliseSelecionada = TIPOS_ANALISE.find(t => t.value === tipoAnalise);

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <ScannerIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" gutterBottom>
              Scanner & Análise com IA
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Escaneie documentos, extraia texto e analise com inteligência artificial
            </Typography>
          </Box>
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
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

        {/* STEP 0: Upload */}
        {activeStep === 0 && (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                1. Faça Upload do Documento
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Selecione um arquivo PDF ou imagem para processar
              </Typography>

              {!arquivo ? (
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<UploadIcon />}
                  size="large"
                >
                  Selecionar Arquivo
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.jpg,.jpeg,.png,.tiff,.bmp"
                    onChange={handleFileChange}
                  />
                </Button>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip
                    label={arquivo.name}
                    onDelete={handleRemoveFile}
                    deleteIcon={<ClearIcon />}
                    color="primary"
                    sx={{ maxWidth: 300 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {(arquivo.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOCR}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <ScannerIcon />}
                  >
                    {loading ? 'Processando...' : 'Extrair Texto (OCR)'}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {/* STEP 1: Texto Extraído */}
        {activeStep === 1 && (
          <>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    2. Texto Extraído
                  </Typography>
                  <Chip label={`${textoExtraido.length} caracteres`} color="info" size="small" />
                </Box>
                
                <Alert severity="info" sx={{ mb: 2 }}>
                  Você pode <strong>salvar o documento</strong> com o texto extraído ou <strong>prosseguir para análise com IA</strong>.
                </Alert>
                
                <TextField
                  fullWidth
                  multiline
                  rows={10}
                  value={textoExtraido}
                  onChange={(e) => setTextoExtraido(e.target.value)}
                  variant="outlined"
                  placeholder="O texto extraído aparecerá aqui..."
                  sx={{ mb: 2 }}
                />

                <Button
                  variant="outlined"
                  onClick={handleRemoveFile}
                  startIcon={<ClearIcon />}
                  sx={{ mr: 2 }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSaveDocument}
                  disabled={!textoExtraido.trim() || loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                  sx={{ mr: 2 }}
                >
                  {loading ? 'Salvando...' : 'Salvar Documento'}
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setActiveStep(2)}
                  disabled={!textoExtraido.trim()}
                  endIcon={<AIIcon />}
                >
                  Prosseguir para Análise
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* STEP 2: Análise IA */}
        {activeStep === 2 && (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                3. Configurar Análise com IA
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Tipo de Análise"
                    value={tipoAnalise}
                    onChange={(e) => setTipoAnalise(e.target.value)}
                    helperText={tipoAnaliseSelecionada?.description}
                  >
                    {TIPOS_ANALISE.map((tipo) => (
                      <MenuItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {tipoAnalise === 'personalizado' && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Instruções Personalizadas"
                      value={promptPersonalizado}
                      onChange={(e) => setPromptPersonalizado(e.target.value)}
                      placeholder="Descreva o que você deseja que a IA analise no documento..."
                      helperText="Seja específico sobre o que você quer extrair ou analisar"
                    />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      variant="outlined"
                      onClick={() => setActiveStep(1)}
                      startIcon={<ClearIcon />}
                    >
                      Voltar
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleAnaliseIA}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                      color="success"
                    >
                      {loading ? 'Enviando...' : 'Solicitar Análise IA'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Paper>
    </Box>
  );
};

export default ScannerPage;
