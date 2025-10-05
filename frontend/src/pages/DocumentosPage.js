import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Menu,
  MenuItem,
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
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  PictureAsPdf,
  Description,
  Image,
  TableChart,
  TextSnippet,
  InsertDriveFile,
  Download as DownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
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

const DocumentosPage = () => {
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
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  
  // Upload
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadData, setUploadData] = useState({
    titulo: '',
    descricao: '',
    categoria: '',
    tags_ids: [],
    confidencial: false,
    data_documento: '',
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuDoc, setMenuDoc] = useState(null);

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
      setDocumentos(data.results || data);
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

  // Upload
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!validateFileType(file)) {
      setError('Tipo de arquivo não permitido');
      return;
    }

    if (!validateFileSize(file)) {
      setError('Arquivo muito grande (máximo 10MB)');
      return;
    }

    setUploadFile(file);
    setUploadData({
      ...uploadData,
      titulo: file.name.split('.').slice(0, -1).join('.'),
    });
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      setError('Selecione um arquivo');
      return;
    }

    setLoading(true);
    setError('');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('arquivo', uploadFile);
      formData.append('titulo', uploadData.titulo || uploadFile.name);
      if (uploadData.descricao) formData.append('descricao', uploadData.descricao);
      if (uploadData.categoria) formData.append('categoria', uploadData.categoria);
      if (uploadData.data_documento) formData.append('data_documento', uploadData.data_documento);
      formData.append('confidencial', uploadData.confidencial);
      
      uploadData.tags_ids.forEach((tagId) => {
        formData.append('tags_ids', tagId);
      });

      await uploadDocumento(formData, (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(progress);
      });

      setSuccess('Documento enviado com sucesso!');
      setUploadDialogOpen(false);
      resetUploadForm();
      loadDocumentos();
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao fazer upload');
      console.error(err);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const resetUploadForm = () => {
    setUploadFile(null);
    setUploadData({
      titulo: '',
      descricao: '',
      categoria: '',
      tags_ids: [],
      confidencial: false,
      data_documento: '',
    });
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
      handleMenuClose();
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
    handleMenuClose();
  };

  // Visualizar
  const handleView = (doc) => {
    setSelectedDoc(doc);
    setViewerOpen(true);
    handleMenuClose();
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

  // Menu
  const handleMenuOpen = (event, doc) => {
    setAnchorEl(event.currentTarget);
    setMenuDoc(doc);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuDoc(null);
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

  return (
    <Box sx={{ p: 3 }}>
      {/* Cabeçalho */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Documentos</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setUploadDialogOpen(true)}
        >
          Novo Documento
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
      ) : (
        <Grid container spacing={2}>
          {documentos.map((doc) => (
            <Grid item xs={12} sm={6} md={4} key={doc.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                      <FileIconComponent tipo={doc.tipo_arquivo} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" noWrap>
                          {doc.titulo}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {doc.tamanho_formatado} • {doc.tipo_arquivo?.toUpperCase()}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, doc)}>
                      <MoreVertIcon />
                    </IconButton>
                  </Box>

                  {doc.descricao && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }} noWrap>
                      {doc.descricao}
                    </Typography>
                  )}

                  {doc.categoria_nome && (
                    <Chip
                      label={doc.categoria_nome}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  )}

                  {doc.confidencial && (
                    <Chip
                      label="Confidencial"
                      size="small"
                      color="error"
                      sx={{ mt: 1, ml: 1 }}
                    />
                  )}

                  {doc.tags_list && doc.tags_list.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                      {doc.tags_list.map((tag, idx) => (
                        <Chip key={idx} label={tag} size="small" variant="outlined" />
                      ))}
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Tooltip title="Visualizações">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <VisibilityIcon fontSize="small" color="action" />
                        <Typography variant="caption">{doc.visualizacoes || 0}</Typography>
                      </Box>
                    </Tooltip>
                    <Tooltip title="Downloads">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <DownloadIcon fontSize="small" color="action" />
                        <Typography variant="caption">{doc.downloads || 0}</Typography>
                      </Box>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Menu de Ações */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { handleView(menuDoc); }}>
          <VisibilityIcon sx={{ mr: 1 }} /> Visualizar
        </MenuItem>
        <MenuItem onClick={() => { handleDownload(menuDoc); }}>
          <DownloadIcon sx={{ mr: 1 }} /> Download
        </MenuItem>
        <MenuItem onClick={() => { handleEdit(menuDoc); handleMenuClose(); }}>
          <EditIcon sx={{ mr: 1 }} /> Editar
        </MenuItem>
        <MenuItem onClick={() => handleDelete(menuDoc)}>
          <DeleteIcon sx={{ mr: 1 }} /> Deletar
        </MenuItem>
      </Menu>

      {/* Visualizador de Documentos */}
      <DocumentViewer
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        documento={selectedDoc}
        onIncrementView={handleIncrementView}
        onDownload={handleDownload}
      />

      {/* Dialog Upload */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Novo Documento
          <IconButton
            onClick={() => setUploadDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <input
              type="file"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              id="upload-file"
              accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.jpg,.jpeg,.png"
            />
            <label htmlFor="upload-file">
              <Button
                variant="outlined"
                component="span"
                fullWidth
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 2 }}
              >
                {uploadFile ? uploadFile.name : 'Selecionar Arquivo'}
              </Button>
            </label>

            <TextField
              fullWidth
              label="Título"
              value={uploadData.titulo}
              onChange={(e) => setUploadData({ ...uploadData, titulo: e.target.value })}
              sx={{ mb: 2 }}
              required
            />

            <TextField
              fullWidth
              label="Descrição"
              value={uploadData.descricao}
              onChange={(e) => setUploadData({ ...uploadData, descricao: e.target.value })}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={uploadData.categoria}
                onChange={(e) => setUploadData({ ...uploadData, categoria: e.target.value })}
                label="Categoria"
              >
                {categorias.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Tags</InputLabel>
              <Select
                multiple
                value={uploadData.tags_ids}
                onChange={(e) => setUploadData({ ...uploadData, tags_ids: e.target.value })}
                input={<OutlinedInput label="Tags" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((tagId) => {
                      const tag = tags.find(t => t.id === tagId);
                      return tag ? <Chip key={tagId} label={tag.nome} size="small" /> : null;
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

            <TextField
              fullWidth
              label="Data do Documento"
              type="date"
              value={uploadData.data_documento}
              onChange={(e) => setUploadData({ ...uploadData, data_documento: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={uploadData.confidencial}
                  onChange={(e) => setUploadData({ ...uploadData, confidencial: e.target.checked })}
                />
              }
              label="Documento Confidencial"
            />

            {uploadProgress > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption">Enviando: {uploadProgress}%</Typography>
                <CircularProgress variant="determinate" value={uploadProgress} />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleUpload} variant="contained" disabled={!uploadFile || loading}>
            Enviar
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
};

export default DocumentosPage;
