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
  LinearProgress,
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

const ScannerPage = () => {
  // Estados simplificados para apenas escanear e salvar
  const [activeStep, setActiveStep] = useState(0);
  const [arquivo, setArquivo] = useState(null);
  const [textoExtraido, setTextoExtraido] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const steps = ['Upload do Documento', 'Extração de Texto (OCR)', 'Salvar Documento'];

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
    setProgress({ current: 0, total: 0 });
  };

  const handleOCR = async () => {
    if (!arquivo) {
      setError('Por favor, selecione um arquivo');
      return;
    }

    setLoading(true);
    setError('');
    setProgress({ current: 0, total: 0 });

    try {
      const formData = new FormData();
      formData.append('arquivo', arquivo);

      // Inicia processamento assíncrono
      const response = await axios.post('/api/documentos/ocr-async/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        const taskId = response.data.task_id;
        
        // Monitora progresso real - consulta mais rápida no início, depois mais lenta
        let consultaIntervalo = 500; // Inicia com 500ms
        const maxIntervalo = 2000; // Máximo de 2 segundos
        
        const consultarProgresso = async () => {
          try {
            const progressResponse = await axios.get(`/api/documentos/ocr-progress/${taskId}/`);
            const progressData = progressResponse.data;
            
            console.log('📊 Progresso:', progressData);
            
            setProgress({
              current: progressData.current_page,
              total: progressData.total_pages
            });
            
            // Se concluído com sucesso
            if (progressData.status === 'concluido') {
              console.log('✅ Processamento concluído!');
              setLoading(false);
              setProgress({ current: 0, total: 0 });
              
              if (progressData.resultado && progressData.resultado.texto) {
                setTextoExtraido(progressData.resultado.texto);
                setActiveStep(1); // IMPORTANTE: Move para próximo step
                setSuccess('Texto extraído com sucesso!');
                console.log('📄 Texto definido e step atualizado');
              } else {
                setError('Texto não encontrado no resultado');
              }
              return; // Para de consultar
            } else if (progressData.status === 'erro') {
              console.error('❌ Erro no processamento:', progressData.message);
              setLoading(false);
              setProgress({ current: 0, total: 0 });
              setError(progressData.message || 'Erro no processamento');
              return; // Para de consultar
            }
            
            // Aumenta intervalo gradualmente para reduzir carga
            consultaIntervalo = Math.min(consultaIntervalo + 100, maxIntervalo);
            
            // Agenda próxima consulta
            setTimeout(consultarProgresso, consultaIntervalo);
            
          } catch (progressError) {
            console.error('Erro ao consultar progresso:', progressError);
            // Em caso de erro, tenta novamente após intervalo maior
            setTimeout(consultarProgresso, 2000);
          }
        };
        
        // Inicia primeira consulta
        consultarProgresso();
        
        // Timeout de segurança (3 minutos) - tempo mais realista
        setTimeout(() => {
          setLoading(false);
          setProgress({ current: 0, total: 0 });
          setError('Timeout: Processamento demorou mais que o esperado (3 min)');
        }, 180000); // 3 minutos
        
      } else {
        setError(response.data.error || 'Erro ao iniciar processamento');
        setLoading(false);
      }
      
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao processar OCR');
      console.error('Erro no OCR:', err);
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
      
      setSuccess('Documento salvo com sucesso! Use a opção "Análise com IA" no menu para analisar documentos salvos.');
      
      // Limpar tudo após salvar com sucesso
      setTimeout(() => {
        handleRemoveFile();
        setSuccess('');
      }, 3000);

    } catch (err) {
      console.error('❌ Erro ao salvar documento:', err);
      setError(err.response?.data?.error || 'Erro ao salvar documento');
    } finally {
      setLoading(false);
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
              Escaneie documentos e extraia texto usando OCR (Reconhecimento Óptico de Caracteres)
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
              
              {/* Indicador de progresso para PDFs */}
              {loading && progress.total > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Processando página {progress.current} de {progress.total}...
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(progress.current / progress.total) * 100} 
                    sx={{ height: 6, borderRadius: 3 }}
                  />
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
                  Após extrair o texto, você pode <strong>salvar o documento</strong>. Use "Análise com IA" no menu para analisar documentos salvos.
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
                  size="large"
                >
                  {loading ? 'Salvando...' : 'Salvar Documento'}
                </Button>
              </CardContent>
            </Card>
          </>
        )}


      </Paper>
    </Box>
  );
};

export default ScannerPage;
