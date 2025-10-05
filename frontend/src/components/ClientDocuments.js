import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  FormControlLabel,
  Checkbox,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  PictureAsPdf,
  Description,
  Image,
  TableChart,
  TextSnippet,
  InsertDriveFile,
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
  validateFileType,
  validateFileSize,
} from '../utils/documentService';
import DocumentViewer from './DocumentViewer';

const ClientDocuments = ({ clienteId }) => {
  const [documentos, setDocumentos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  
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

  useEffect(() => {
    if (clienteId) {
      loadDocumentos();
      loadCategorias();
      loadTags();
    }
  }, [clienteId]);

  const loadDocumentos = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listDocumentos({ cliente: clienteId });
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
      formData.append('cliente', clienteId);
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

  const handleDownload = async (doc) => {
    try {
      await downloadDocumento(doc.id, doc.nome_original);
      setSuccess('Download iniciado!');
    } catch (err) {
      setError('Erro ao fazer download');
      console.error(err);
    }
  };

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
    return <Icon fontSize="small" />;
  };

  return (
    <Box>
      {/* Cabeçalho */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Documentos do Cliente</Typography>
        <Button
          variant="contained"
          size="small"
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

      {/* Tabela */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tipo</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Tamanho</TableCell>
              <TableCell>Data Upload</TableCell>
              <TableCell align="center">Visualizações</TableCell>
              <TableCell align="center">Downloads</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : documentos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography color="text.secondary">Nenhum documento encontrado</Typography>
                </TableCell>
              </TableRow>
            ) : (
              documentos.map((doc) => (
                <TableRow key={doc.id} hover>
                  <TableCell>
                    <FileIconComponent tipo={doc.tipo_arquivo} />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{doc.titulo}</Typography>
                      {doc.confidencial && (
                        <Chip label="Confidencial" size="small" color="error" sx={{ mt: 0.5 }} />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {doc.categoria_nome && (
                      <Chip label={doc.categoria_nome} size="small" />
                    )}
                  </TableCell>
                  <TableCell>{doc.tamanho_formatado}</TableCell>
                  <TableCell>
                    {new Date(doc.data_upload).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Visualizações">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        <VisibilityIcon fontSize="small" color="action" />
                        <Typography variant="body2">{doc.visualizacoes || 0}</Typography>
                      </Box>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Downloads">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        <DownloadIcon fontSize="small" color="action" />
                        <Typography variant="body2">{doc.downloads || 0}</Typography>
                      </Box>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Visualizar">
                      <IconButton size="small" onClick={() => handleView(doc)} color="info">
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download">
                      <IconButton size="small" onClick={() => handleDownload(doc)} color="primary">
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => handleEdit(doc)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Deletar">
                      <IconButton size="small" onClick={() => handleDelete(doc)} color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
              id="upload-file-client"
              accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.jpg,.jpeg,.png"
            />
            <label htmlFor="upload-file-client">
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
                <CircularProgress variant="determinate" value={uploadProgress} sx={{ ml: 2 }} size={20} />
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

      {/* Visualizador de Documentos */}
      <DocumentViewer
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        documento={selectedDoc}
        onIncrementView={handleIncrementView}
        onDownload={handleDownload}
      />
    </Box>
  );
};

export default ClientDocuments;
