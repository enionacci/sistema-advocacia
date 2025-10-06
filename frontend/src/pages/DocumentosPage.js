import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  CircularProgress,
  Alert,
  Tooltip,
  FormControlLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  PictureAsPdf,
  Description,
  Description as DescriptionIcon,
  Image,
  TableChart,
  TextSnippet,
  InsertDriveFile,
  Download as DownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  Scanner as ScannerIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import {
  listDocumentos,
  listCategorias,
  listTags,
  uploadDocumento,
  updateDocumento,
  deleteDocumento,
  downloadDocumento,
  incrementarVisualizacao,
  getFileIcon,
  getFileColor,
  validateFileType,
  validateFileSize,
} from '../utils/documentService';
import DocumentViewer from '../components/DocumentViewer';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DocumentosPage = () => {
  const navigate = useNavigate();
  
  // Estado
  const [documentos, setDocumentos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('');
  const [tagsFilter, setTagsFilter] = useState([]);
  const [confidencialFilter, setConfidencialFilter] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Dialogs
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Carregar dados
  useEffect(() => {
    loadDocumentos();
    loadCategorias();
    loadTags();
  }, []);

  // Carregar documentos com filtros
  const loadDocumentos = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        search: searchTerm || undefined,
        categoria: categoriaFilter || undefined,
        tags: tagsFilter.length > 0 ? tagsFilter.join(',') : undefined,
        confidencial: confidencialFilter || undefined,
      };
      const data = await listDocumentos(params);
      // Filtrar APENAS documentos com texto_extraido (escaneados por OCR)
      const documentosEscaneados = (data.results || data).filter(doc => 
        doc.texto_extraido && doc.texto_extraido.trim().length > 0
      );
      setDocumentos(documentosEscaneados);
    } catch (err) {
      setError('Erro ao carregar documentos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategorias = async () => {
    try {
      const data = await listCategorias();
      setCategorias(data.results || data);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
    }
  };

  const loadTags = async () => {
    try {
      const data = await listTags();
      setTags(data.results || data);
    } catch (err) {
      console.error('Erro ao carregar tags:', err);
    }
  };

  // Aplicar filtros
  const handleApplyFilters = () => {
    loadDocumentos();
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategoriaFilter('');
    setTagsFilter([]);
    setConfidencialFilter(false);
  };

  // Editar
  const handleEdit = (doc) => {
    setSelectedDoc(doc);
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedDoc) return;

    setLoading(true);
    setError('');

    try {
      await updateDocumento(selectedDoc.id, {
        titulo: selectedDoc.titulo,
        descricao: selectedDoc.descricao,
        categoria: selectedDoc.categoria?.id,
        tags_ids: selectedDoc.tags?.map(t => t.id) || [],
        confidencial: selectedDoc.confidencial,
      });

      setSuccess('Documento atualizado com sucesso!');
      setEditDialogOpen(false);
      setSelectedDoc(null);
      loadDocumentos();
    } catch (err) {
      setError('Erro ao atualizar documento');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Deletar
  const handleDelete = async (doc) => {
    if (!window.confirm(`Deseja realmente deletar "${doc.titulo}"?`)) return;

    setLoading(true);
    setError('');

    try {
      await deleteDocumento(doc.id);
      setSuccess('Documento deletado com sucesso!');
      loadDocumentos();
    } catch (err) {
      setError('Erro ao deletar documento');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Download
  const handleDownload = async (doc) => {
    try {
      await downloadDocumento(doc.id, doc.nome_original);
      setSuccess('Download iniciado!');
    } catch (err) {
      setError('Erro ao fazer download');
      console.error(err);
    }
  };

  // Visualizar
  const handleView = (doc) => {
    setSelectedDoc(doc);
    setViewerOpen(true);
  };

  const handleIncrementView = async (docId) => {
    try {
      await incrementarVisualizacao(docId);
      // Atualiza o contador localmente
      setDocumentos(docs => docs.map(d => 
        d.id === docId ? { ...d, visualizacoes: (d.visualizacoes || 0) + 1 } : d
      ));
    } catch (err) {
      console.error('Erro ao incrementar visualização:', err);
    }
  };

  // Ícone do tipo de arquivo
  const FileIconComponent = ({ tipo }) => {
    const icons = {
      pdf: PictureAsPdf,
      doc: Description,
      docx: Description,
      txt: TextSnippet,
      xlsx: TableChart,
      xls: TableChart,
      jpg: Image,
      jpeg: Image,
      png: Image,
    };
    const Icon = icons[tipo?.toLowerCase()] || InsertDriveFile;
    return <Icon />;
  };

  // Navegação
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        {/* Cabeçalho */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DescriptionIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
            <Box>
              <Typography variant="h4" gutterBottom>
                Documentos Escaneados
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Documentos processados com OCR (Reconhecimento Ótico de Caracteres)
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={loadDocumentos}
            disabled={loading}
          >
            Atualizar
          </Button>
        </Box>

        {/* Mensagens */}
      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" onClose={() => setSuccess('')} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filtros
              </Button>
              <Button variant="contained" onClick={handleApplyFilters}>
                Buscar
              </Button>
              <Button onClick={handleClearFilters}>Limpar</Button>
            </Box>
          </Grid>

          {/* Filtros Avançados */}
          {showFilters && (
            <>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Categoria</InputLabel>
                  <Select
                    value={categoriaFilter}
                    onChange={(e) => setCategoriaFilter(e.target.value)}
                    label="Categoria"
                  >
                    <MenuItem value="">Todas</MenuItem>
                    {categorias.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Tags</InputLabel>
                  <Select
                    multiple
                    value={tagsFilter}
                    onChange={(e) => setTagsFilter(e.target.value)}
                    input={<OutlinedInput label="Tags" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((tagId) => {
                          const tag = tags.find(t => t.id === tagId);
                          return tag ? (
                            <Chip key={tagId} label={tag.nome} size="small" />
                          ) : null;
                        })}
                      </Box>
                    )}
                  >
                    {tags.map((tag) => (
                      <MenuItem key={tag.id} value={tag.id}>
                        {tag.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={confidencialFilter}
                      onChange={(e) => setConfidencialFilter(e.target.checked)}
                    />
                  }
                  label="Apenas confidenciais"
                />
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      {/* Lista de Documentos */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : documentos.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ScannerIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Nenhum documento escaneado
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Você ainda não possui documentos processados com OCR.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Para escanear um novo documento, acesse:
          </Typography>
          <Button
            variant="contained"
            startIcon={<ScannerIcon />}
            onClick={() => handleNavigate('/scanner')}
          >
            Escanear Documento
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Título</TableCell>
                <TableCell>Data Upload</TableCell>
                <TableCell>Tamanho</TableCell>
                <TableCell>Preview OCR</TableCell>
                <TableCell>Visualizações</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documentos.map((doc) => (
                <TableRow key={doc.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DescriptionIcon color="primary" />
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {doc.titulo}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                          {doc.confidencial && (
                            <Chip label="Confidencial" size="small" color="error" />
                          )}
                          <Chip label="OCR" size="small" color="info" />
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {doc.data_upload ? format(new Date(doc.data_upload), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {doc.tamanho_formatado || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        display: 'block',
                        maxWidth: 300,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontStyle: 'italic'
                      }}
                    >
                      {doc.texto_extraido ? doc.texto_extraido.substring(0, 100) + '...' : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <VisibilityIcon fontSize="small" color="action" />
                      <Typography variant="body2">{doc.visualizacoes || 0}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Visualizar">
                      <IconButton
                        size="small"
                        onClick={() => handleView(doc)}
                        color="primary"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(doc)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download">
                      <IconButton
                        size="small"
                        onClick={() => handleDownload(doc)}
                        color="primary"
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Deletar">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(doc)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Visualizador de Documentos */}
      <DocumentViewer
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        documento={selectedDoc}
        onIncrementView={handleIncrementView}
        onDownload={handleDownload}
      />

      {/* Dialog Editar */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Documento</DialogTitle>
        <DialogContent>
          {selectedDoc && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Título"
                value={selectedDoc.titulo}
                onChange={(e) => setSelectedDoc({ ...selectedDoc, titulo: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Descrição"
                value={selectedDoc.descricao || ''}
                onChange={(e) => setSelectedDoc({ ...selectedDoc, descricao: e.target.value })}
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
              {selectedDoc.texto_extraido && (
                <TextField
                  fullWidth
                  label="Texto Extraído (OCR)"
                  value={selectedDoc.texto_extraido || ''}
                  onChange={(e) => setSelectedDoc({ ...selectedDoc, texto_extraido: e.target.value })}
                  multiline
                  rows={8}
                  sx={{ mb: 2 }}
                  helperText="Texto extraído por OCR - você pode editar se necessário"
                />
              )}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedDoc.confidencial || false}
                    onChange={(e) => setSelectedDoc({ ...selectedDoc, confidencial: e.target.checked })}
                  />
                }
                label="Documento Confidencial"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleUpdate} variant="contained" disabled={loading}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
      </Paper>
    </Box>
  );
};

export default DocumentosPage;
