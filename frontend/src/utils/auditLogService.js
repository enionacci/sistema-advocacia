/**
 * Serviço de API para Logs de Auditoria
 * 
 * Fornece métodos para:
 * - Listar logs com filtros e paginação
 * - Obter detalhes de um log específico
 * - Obter estatísticas agregadas
 * - Configurar retenção de logs
 */

import axiosInstance from './axiosInstance';

const API_BASE_URL = '/api/audit-logs';

/**
 * Lista logs de auditoria com filtros opcionais
 * @param {Object} params - Parâmetros de filtro
 * @param {string} params.usuario - ID do usuário
 * @param {string} params.acao - Tipo de ação (CREATE, UPDATE, DELETE, VIEW)
 * @param {string} params.modelo_nome - Nome do modelo (Cliente, Consulta, etc)
 * @param {string} params.data_inicio - Data inicial (YYYY-MM-DD)
 * @param {string} params.data_fim - Data final (YYYY-MM-DD)
 * @param {string} params.search - Busca por texto
 * @param {number} params.page - Número da página
 * @param {number} params.page_size - Itens por página
 * @returns {Promise<Object>} Lista paginada de logs
 */
export const listAuditLogs = async (params = {}) => {
  try {
    const response = await axiosInstance.get(API_BASE_URL + '/', { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao listar logs de auditoria:', error);
    throw error;
  }
};

/**
 * Obtém detalhes de um log específico
 * @param {number|string} id - ID do log
 * @returns {Promise<Object>} Detalhes completos do log
 */
export const getAuditLogDetail = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter detalhes do log:', error);
    throw error;
  }
};

/**
 * Obtém estatísticas agregadas dos logs
 * @param {Object} params - Parâmetros de filtro
 * @param {string} params.data_inicio - Data inicial (YYYY-MM-DD)
 * @param {string} params.data_fim - Data final (YYYY-MM-DD)
 * @returns {Promise<Object>} Estatísticas agregadas
 */
export const getAuditLogStats = async (params = {}) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/stats/`, { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    throw error;
  }
};

/**
 * Obtém configuração de retenção de logs
 * @returns {Promise<Object>} Configuração de retenção
 */
export const getRetentionConfig = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/retencao/`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter configuração de retenção:', error);
    throw error;
  }
};

/**
 * Atualiza configuração de retenção de logs
 * @param {Object} data - Nova configuração
 * @param {number} data.dias_retencao - Dias de retenção
 * @param {boolean} data.auto_remover - Auto-remover logs expirados
 * @param {boolean} data.log_views - Registrar requisições GET
 * @returns {Promise<Object>} Configuração atualizada
 */
export const updateRetentionConfig = async (data) => {
  try {
    const response = await axiosInstance.put(`${API_BASE_URL}/retencao/`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar configuração:', error);
    throw error;
  }
};

/**
 * Formata uma ação para exibição
 * @param {string} acao - Código da ação
 * @returns {Object} Objeto com label e cor
 */
export const formatAction = (acao) => {
  const actions = {
    CREATE: { label: 'Criação', color: 'success' },
    UPDATE: { label: 'Atualização', color: 'info' },
    DELETE: { label: 'Exclusão', color: 'error' },
    VIEW: { label: 'Visualização', color: 'default' },
  };
  return actions[acao] || { label: acao, color: 'default' };
};

/**
 * Formata timestamp para exibição
 * @param {string} timestamp - Timestamp ISO
 * @returns {string} Data/hora formatada
 */
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

/**
 * Compara dois objetos e retorna as diferenças
 * @param {Object} oldData - Dados antigos
 * @param {Object} newData - Dados novos
 * @returns {Array} Lista de diferenças
 */
export const compareData = (oldData, newData) => {
  if (!oldData || !newData) return [];
  
  const differences = [];
  const allKeys = new Set([...Object.keys(oldData), ...Object.keys(newData)]);
  
  allKeys.forEach(key => {
    const oldValue = oldData[key];
    const newValue = newData[key];
    
    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      differences.push({
        field: key,
        oldValue: oldValue ?? '-',
        newValue: newValue ?? '-',
      });
    }
  });
  
  return differences;
};

export default {
  listAuditLogs,
  getAuditLogDetail,
  getAuditLogStats,
  getRetentionConfig,
  updateRetentionConfig,
  formatAction,
  formatTimestamp,
  compareData,
};
