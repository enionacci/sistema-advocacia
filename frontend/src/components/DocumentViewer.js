import React, { useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
} from '@mui/icons-material';

/**
 * Componente para visualização inline de documentos
 * 
 * Suporta:
 * - PDFs (via iframe/embed)
 * - Imagens (JPG, PNG, JPEG)
 * - Mensagem para outros tipos
 * 
 * Incrementa automaticamente o contador de visualizações
 */
const DocumentViewer = ({ 
  open, 
  onClose, 
  documento, 
  onIncrementView,
  onDownload 
}) => {
  const [zoom, setZoom] = React.useState(100);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const hasIncremented = useRef(false);

  // Incrementa visualizações quando abre
  useEffect(() => {
    if (open && documento && !hasIncremented.current) {
      setLoading(true);
      setError('');
      setZoom(100);
      
      // Debug: Log da URL do arquivo
      console.log('DocumentViewer - Documento:', documento);
      console.log('DocumentViewer - arquivo_url:', documento.arquivo_url);
      
      // Incrementa contador após um pequeno delay (garante que abriu)
      const timer = setTimeout(() => {
        if (onIncrementView) {
          onIncrementView(documento.id);
          hasIncremented.current = true;
        }
      }, 500);

      return () => clearTimeout(timer);
    }
    
    // Reset quando fecha
    if (!open) {
      hasIncremented.current = false;
    }
  }, [open, documento, onIncrementView]);

  if (!documento) return null;

  const isViewable = ['pdf', 'jpg', 'jpeg', 'png'].includes(
    documento.tipo_arquivo?.toLowerCase()
  );

  const isPDF = documento.tipo_arquivo?.toLowerCase() === 'pdf';
  const isImage = ['jpg', 'jpeg', 'png'].includes(
    documento.tipo_arquivo?.toLowerCase()
  );

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(documento);
    }
  };

  const handleLoadSuccess = () => {
    setLoading(false);
  };

  const handleLoadError = () => {
    setLoading(false);
    setError('Erro ao carregar o documento. Tente fazer o download.');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { height: '90vh' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" component="span">
              {documento.titulo}
            </Typography>
            {documento.confidencial && (
              <Typography
                component="span"
                sx={{
                  ml: 2,
                  px: 1,
                  py: 0.5,
                  bgcolor: 'error.main',
                  color: 'white',
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}
              >
                CONFIDENCIAL
              </Typography>
            )}
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="caption" color="text.secondary">
          {documento.nome_original} • {documento.tamanho_formatado} • {documento.tipo_arquivo?.toUpperCase()}
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0, position: 'relative' }}>
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Box sx={{ p: 3 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {!isViewable && !error && (
          <Box sx={{ p: 3 }}>
            <Alert severity="info">
              <Typography variant="h6" gutterBottom>
                Pré-visualização não disponível
              </Typography>
              <Typography variant="body2">
                Este tipo de arquivo ({documento.tipo_arquivo?.toUpperCase()}) não pode ser visualizado diretamente no navegador.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Por favor, faça o download do arquivo para visualizá-lo.
              </Typography>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
                sx={{ mt: 2 }}
              >
                Fazer Download
              </Button>
            </Alert>
          </Box>
        )}

        {isViewable && !error && (
          <Box sx={{ 
            height: '100%', 
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: '#f5f5f5',
            overflow: 'auto',
          }}>
            {isPDF && (
              <object
                data={documento.arquivo_url}
                type="application/pdf"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                title={documento.titulo}
                onLoad={handleLoadSuccess}
                onError={handleLoadError}
              >
                <embed
                  src={documento.arquivo_url}
                  type="application/pdf"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                />
              </object>
            )}

            {isImage && (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 2,
                }}
              >
                <img
                  src={documento.arquivo_url}
                  alt={documento.titulo}
                  style={{
                    maxWidth: `${zoom}%`,
                    maxHeight: `${zoom}%`,
                    objectFit: 'contain',
                    transition: 'all 0.3s ease',
                  }}
                  onLoad={handleLoadSuccess}
                  onError={handleLoadError}
                />
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {isImage && (
            <>
              <Button
                startIcon={<ZoomOutIcon />}
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                size="small"
              >
                Reduzir
              </Button>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
                {zoom}%
              </Typography>
              <Button
                startIcon={<ZoomInIcon />}
                onClick={handleZoomIn}
                disabled={zoom >= 200}
                size="small"
              >
                Ampliar
              </Button>
            </>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            variant="outlined"
          >
            Download
          </Button>
          <Button onClick={onClose} variant="contained">
            Fechar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentViewer;
