/**
 * Serviço de API para Gerenciamento de Documentos
 * 
 * Fornece métodos para:
 * - Upload de documentos
 * - Listagem com filtros
 * - Download de arquivos
 * - CRUD de categorias e tags
 * - Estatísticas
 */

import axiosInstance from './axiosInstance';

const API_BASE_URL = '/api/documentos';

// ==================== CATEGORIAS ====================

/**
 * Lista todas as categorias do escritório
 */
export const listCategorias = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/categorias/`);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    throw error;
  }
};

/**
 * Cria uma nova categoria
 */
export const createCategoria = async (data) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}/categorias/`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    throw error;
  }
};

/**
 * Atualiza uma categoria
 */
export const updateCategoria = async (id, data) => {
  try {
    const response = await axiosInstance.patch(`${API_BASE_URL}/categorias/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    throw error;
  }
};

/**
 * Remove uma categoria
 */
export const deleteCategoria = async (id) => {
  try {
    await axiosInstance.delete(`${API_BASE_URL}/categorias/${id}/`);
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    throw error;
  }
};

// ==================== TAGS ====================

/**
 * Lista todas as tags do escritório
 */
export const listTags = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/tags/`);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar tags:', error);
    throw error;
  }
};

/**
 * Cria uma nova tag
 */
export const createTag = async (data) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}/tags/`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar tag:', error);
    throw error;
  }
};

// ==================== DOCUMENTOS ====================

/**
 * Lista documentos com filtros opcionais
 */
export const listDocumentos = async (params = {}) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/`, { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao listar documentos:', error);
    throw error;
  }
};

/**
 * Obtém detalhes de um documento
 */
export const getDocumento = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter documento:', error);
    throw error;
  }
};

/**
 * Faz upload de um novo documento
 */
export const uploadDocumento = async (formData, onUploadProgress) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    throw error;
  }
};

/**
 * Atualiza metadados de um documento
 */
export const updateDocumento = async (id, data) => {
  try {
    const response = await axiosInstance.patch(`${API_BASE_URL}/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar documento:', error);
    throw error;
  }
};

/**
 * Remove um documento (soft delete)
 */
export const deleteDocumento = async (id) => {
  try {
    await axiosInstance.delete(`${API_BASE_URL}/${id}/`);
  } catch (error) {
    console.error('Erro ao deletar documento:', error);
    throw error;
  }
};

/**
 * Faz download de um documento
 */
export const downloadDocumento = async (id, nomeOriginal) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/${id}/download/`, {
      responseType: 'blob',
    });
    
    // Cria um link temporário para download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', nomeOriginal);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao fazer download:', error);
    throw error;
  }
};

/**
 * Incrementa o contador de visualizações
 */
export const incrementarVisualizacao = async (id) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}/${id}/incrementar_visualizacao/`);
    return response.data;
  } catch (error) {
    console.error('Erro ao incrementar visualização:', error);
    throw error;
  }
};

/**
 * Obtém estatísticas dos documentos
 */
export const getEstatisticas = async (params = {}) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/estatisticas/`, { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    throw error;
  }
};

// ==================== HELPERS ====================

/**
 * Formata o tamanho do arquivo
 */
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

/**
 * Retorna o ícone apropriado para o tipo de arquivo
 */
export const getFileIcon = (tipoArquivo) => {
  const icons = {
    pdf: 'PictureAsPdf',
    doc: 'Description',
    docx: 'Description',
    txt: 'TextSnippet',
    xlsx: 'TableChart',
    xls: 'TableChart',
    jpg: 'Image',
    jpeg: 'Image',
    png: 'Image',
  };
  return icons[tipoArquivo?.toLowerCase()] || 'InsertDriveFile';
};

/**
 * Retorna a cor para o tipo de arquivo
 */
export const getFileColor = (tipoArquivo) => {
  const colors = {
    pdf: 'error',
    doc: 'primary',
    docx: 'primary',
    txt: 'default',
    xlsx: 'success',
    xls: 'success',
    jpg: 'secondary',
    jpeg: 'secondary',
    png: 'secondary',
  };
  return colors[tipoArquivo?.toLowerCase()] || 'default';
};

/**
 * Valida o tipo de arquivo
 */
export const validateFileType = (file) => {
  const allowedTypes = ['pdf', 'doc', 'docx', 'txt', 'xlsx', 'xls', 'jpg', 'jpeg', 'png'];
  const extension = file.name.split('.').pop().toLowerCase();
  return allowedTypes.includes(extension);
};

/**
 * Valida o tamanho do arquivo (máximo 10MB)
 */
export const validateFileSize = (file, maxSizeMB = 10) => {
  const maxSize = maxSizeMB * 1024 * 1024;
  return file.size <= maxSize;
};

export default {
  // Categorias
  listCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
  
  // Tags
  listTags,
  createTag,
  
  // Documentos
  listDocumentos,
  getDocumento,
  uploadDocumento,
  updateDocumento,
  deleteDocumento,
  downloadDocumento,
  incrementarVisualizacao,
  getEstatisticas,
  
  // Helpers
  formatFileSize,
  getFileIcon,
  getFileColor,
  validateFileType,
  validateFileSize,
};
