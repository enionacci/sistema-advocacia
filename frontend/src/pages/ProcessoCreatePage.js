import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  Autocomplete,
  Alert,
  Divider,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Save as SaveIcon, 
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const ProcessoCreatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [buscandoDataJud, setBuscandoDataJud] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [dadosApiPje, setDadosApiPje] = useState(null);  // Armazena dados da API PJe

  const [formData, setFormData] = useState({
    numero_processo: '',
    numero_antigo: '',
    cliente_principal: null,
    tipo: '',
    classe: '',
    assunto: '',
    assuntos_secundarios: '',
    posicao_cliente: '',
    tribunal: '',
    comarca: '',
    vara: '',
    uf: '',
    data_distribuicao: '',
    data_citacao: '',
    status: 'andamento',
    tipo_distribuicao: '',
    valor_causa: '',
    valor_condenacao: '',
    valor_acordo: '',
    link_consulta: '',
    resumo: '',
    estrategia_juridica: '',
    observacoes: '',
    sigilo: false,
    ativo: true
  });

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoadingClientes(true);
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get('/api/clientes/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Clientes carregados:', response.data);
      setClientes(response.data.results || response.data);
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
      console.error('Detalhes do erro:', err.response?.data);
      setError('Erro ao carregar lista de clientes. Verifique sua conexão.');
    } finally {
      setLoadingClientes(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Aplica máscara no número do processo
    if (name === 'numero_processo') {
      const maskedValue = applyProcessoMask(value);
      setFormData(prev => ({
        ...prev,
        [name]: maskedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const applyProcessoMask = (value) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara CNJ: 0000000-00.0000.0.00.0000
    let masked = '';
    
    if (numbers.length > 0) {
      masked = numbers.substring(0, 7); // Primeiros 7 dígitos
      
      if (numbers.length >= 8) {
        masked += '-' + numbers.substring(7, 9); // Dígitos 8-9
      }
      
      if (numbers.length >= 10) {
        masked += '.' + numbers.substring(9, 13); // Dígitos 10-13
      }
      
      if (numbers.length >= 14) {
        masked += '.' + numbers.substring(13, 14); // Dígito 14
      }
      
      if (numbers.length >= 15) {
        masked += '.' + numbers.substring(14, 16); // Dígitos 15-16
      }
      
      if (numbers.length >= 17) {
        masked += '.' + numbers.substring(16, 20); // Dígitos 17-20
      }
    }
    
    return masked;
  };

  const handleClienteChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      cliente_principal: newValue
    }));
  };

  const buscarNoDataJud = async () => {
    if (!formData.numero_processo) {
      setError('Digite o número do processo antes de buscar no DataJud');
      return;
    }

    setBuscandoDataJud(true);
    setError('');
    setSuccess('');

    try {
      // Remove a máscara do número antes de enviar
      const numeroLimpo = formData.numero_processo.replace(/\D/g, '');
      
      const response = await axiosInstance.post('/api/processos/processos/buscar_datajud/', {
        numero_processo: numeroLimpo
      });

      // Preenche o formulário com os dados retornados
      const dados = response.data;
      
      // Armazena TODOS os dados da API PJe (incluindo partes, movimentações, etc)
      setDadosApiPje({
        partes_info: dados._partes_info || {},
        movimentacoes_list: dados._movimentacoes_list || [],
        prazos_list: dados._prazos_list || [],
        audiencias_list: dados._audiencias_list || []
      });
      
      setFormData(prev => ({
        ...prev,
        classe: dados.classe || prev.classe,
        assunto: dados.assunto || prev.assunto,
        assuntos_secundarios: dados.assuntos_secundarios || prev.assuntos_secundarios,
        tribunal: dados.tribunal || prev.tribunal,
        vara: dados.vara || prev.vara,
        data_distribuicao: dados.data_distribuicao || prev.data_distribuicao,
      }));

      // Mostra estatísticas completas
      let successMsg = `✅ Processo encontrado! Dados preenchidos automaticamente.`;
      
      const stats = dados._stats || {};
      if (dados._partes_info) {
        const { autor, reu } = dados._partes_info;
        if (autor || reu) {
          successMsg += `\n\n📋 Dados que serão criados automaticamente:`;
          if (autor) successMsg += `\n👤 Autor: ${autor}`;
          if (reu) successMsg += `\n👤 Réu: ${reu}`;
          if (stats.total_movimentacoes > 0) successMsg += `\n� ${stats.total_movimentacoes} movimentações`;
          if (stats.total_prazos > 0) successMsg += `\n⏰ ${stats.total_prazos} prazos`;
          if (stats.total_audiencias > 0) successMsg += `\n🎤 ${stats.total_audiencias} audiências`;
          successMsg += `\n\n💡 Ao salvar, tudo será criado automaticamente!`;
        }
      }
      
      setSuccess(successMsg);
      
      // Limpa a mensagem de sucesso após 5 segundos
      setTimeout(() => setSuccess(''), 5000);

    } catch (err) {
      console.error('Erro ao buscar no DataJud:', err);
      const errorMsg = err.response?.data?.erro || 'Processo não encontrado. Verifique o número e tente novamente.';
      
      // Se for processo recente, mostra warning ao invés de erro crítico
      if (err.response?.data?.processo_recente) {
        setError(`⚠️ ${errorMsg}`);
      } else {
        setError(errorMsg);
      }
    } finally {
      setBuscandoDataJud(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Prepara os dados, removendo campos vazios opcionais
      const dataToSend = {
        numero_processo: formData.numero_processo,
        cliente_principal: formData.cliente_principal?.id,
        status: formData.status,
        ativo: formData.ativo,
        sigilo: formData.sigilo,
      };

      // Adiciona campos opcionais apenas se preenchidos
      if (formData.numero_antigo) dataToSend.numero_antigo = formData.numero_antigo;
      if (formData.tipo) dataToSend.tipo = formData.tipo;
      if (formData.classe) dataToSend.classe = formData.classe;
      if (formData.assunto) dataToSend.assunto = formData.assunto;
      if (formData.assuntos_secundarios) dataToSend.assuntos_secundarios = formData.assuntos_secundarios;
      if (formData.posicao_cliente) dataToSend.posicao_cliente = formData.posicao_cliente;
      if (formData.tribunal) dataToSend.tribunal = formData.tribunal;
      if (formData.comarca) dataToSend.comarca = formData.comarca;
      if (formData.vara) dataToSend.vara = formData.vara;
      if (formData.uf) dataToSend.uf = formData.uf;
      if (formData.data_distribuicao) dataToSend.data_distribuicao = formData.data_distribuicao;
      if (formData.data_citacao) dataToSend.data_citacao = formData.data_citacao;
      if (formData.tipo_distribuicao) dataToSend.tipo_distribuicao = formData.tipo_distribuicao;
      if (formData.valor_causa) dataToSend.valor_causa = parseFloat(formData.valor_causa);
      if (formData.valor_condenacao) dataToSend.valor_condenacao = parseFloat(formData.valor_condenacao);
      if (formData.valor_acordo) dataToSend.valor_acordo = parseFloat(formData.valor_acordo);
      if (formData.link_consulta) dataToSend.link_consulta = formData.link_consulta;
      if (formData.resumo) dataToSend.resumo = formData.resumo;
      if (formData.estrategia_juridica) dataToSend.estrategia_juridica = formData.estrategia_juridica;
      if (formData.observacoes) dataToSend.observacoes = formData.observacoes;

      // Se buscou na API PJe, adiciona os dados para criação automática
      if (dadosApiPje) {
        dataToSend._dados_api_pje = dadosApiPje;
        console.log('📦 Enviando dados da API PJe para criação automática:', dadosApiPje);
      }

      const response = await axiosInstance.post('/api/processos/processos/', dataToSend);
      console.log('✅ Processo criado:', response.data);
      
      // Verifica se o ID foi retornado
      if (!response.data.id) {
        console.error('❌ ID do processo não foi retornado:', response.data);
        setError('Processo criado, mas houve um erro ao redirecionar. Volte para a lista de processos.');
        return;
      }
      
      setSuccess('Processo cadastrado com sucesso!');
      
      // Redireciona após 2 segundos
      setTimeout(() => {
        navigate(`/processos/${response.data.id}`);
      }, 2000);
    } catch (err) {
      console.error('Erro ao criar processo:', err);
      if (err.response?.data) {
        const errors = Object.entries(err.response.data)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
        setError(`Erro ao criar processo: ${errors}`);
      } else {
        setError('Erro ao criar processo. Verifique os dados e tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/processos')}
          sx={{ mb: 2 }}
        >
          Voltar para Processos
        </Button>
        <Typography variant="h4" component="h1">
          Novo Processo Judicial
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          {/* Identificação */}
          <Typography variant="h6" gutterBottom>
            Identificação do Processo
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  required
                  fullWidth
                  label="Número do Processo (CNJ)"
                  name="numero_processo"
                  value={formData.numero_processo}
                  onChange={handleChange}
                  placeholder="0000000-00.0000.0.00.0000"
                  helperText="Digite o número e clique na lupa para buscar dados do processo"
                  inputProps={{ 
                    maxLength: 25 // 20 dígitos + 5 caracteres especiais
                  }}
                />
                <Tooltip title="Buscar processo na API do PJe">
                  <IconButton
                    color="primary"
                    onClick={buscarNoDataJud}
                    disabled={buscandoDataJud || !formData.numero_processo}
                    sx={{ mt: 1 }}
                  >
                    {buscandoDataJud ? <CircularProgress size={24} /> : <SearchIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Número Antigo"
                name="numero_antigo"
                value={formData.numero_antigo}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={clientes}
                getOptionLabel={(option) => {
                  // Prioriza nome_completo, depois razao_social
                  const nome = option.nome_completo || option.razao_social || option.nome_fantasia || 'Cliente sem nome';
                  
                  // Adiciona CPF ou CNPJ se existir
                  if (option.cpf) {
                    return `${nome} - CPF: ${option.cpf}`;
                  } else if (option.cnpj) {
                    return `${nome} - CNPJ: ${option.cnpj}`;
                  }
                  
                  return nome;
                }}
                value={formData.cliente_principal}
                onChange={handleClienteChange}
                loading={loadingClientes}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                noOptionsText={loadingClientes ? "Carregando..." : "Nenhum cliente encontrado"}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    <Box>
                      <Typography variant="body1">
                        {option.nome_completo || option.razao_social || option.nome_fantasia || 'Cliente sem nome'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.cpf && `CPF: ${option.cpf}`}
                        {option.cnpj && `CNPJ: ${option.cnpj}`}
                        {!option.cpf && !option.cnpj && option.email && `Email: ${option.email}`}
                        {!option.cpf && !option.cnpj && !option.email && `ID: ${option.id}`}
                      </Typography>
                    </Box>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    label="Cliente Principal"
                    placeholder="Digite para buscar um cliente"
                    helperText={`Cliente que você representa neste processo ${clientes.length > 0 ? `(${clientes.length} disponíveis)` : ''}`}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingClientes ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Classificação */}
          <Typography variant="h6" gutterBottom>
            Classificação
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Tipo/Área"
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                helperText="Será preenchido automaticamente pela API"
              >
                <MenuItem value="">Nenhum</MenuItem>
                <MenuItem value="civel">Cível</MenuItem>
                <MenuItem value="trabalhista">Trabalhista</MenuItem>
                <MenuItem value="criminal">Criminal</MenuItem>
                <MenuItem value="familia">Família</MenuItem>
                <MenuItem value="tributario">Tributário</MenuItem>
                <MenuItem value="previdenciario">Previdenciário</MenuItem>
                <MenuItem value="consumidor">Consumidor</MenuItem>
                <MenuItem value="administrativo">Administrativo</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Classe"
                name="classe"
                value={formData.classe}
                onChange={handleChange}
                placeholder="Ex: Procedimento Comum Cível"
                helperText="Será preenchido automaticamente pela API"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Posição do Cliente"
                name="posicao_cliente"
                value={formData.posicao_cliente}
                onChange={handleChange}
                helperText="Seu cliente é autor ou réu?"
              >
                <MenuItem value="">Não informado</MenuItem>
                <MenuItem value="autor">Autor/Requerente</MenuItem>
                <MenuItem value="reu">Réu/Requerido</MenuItem>
                <MenuItem value="ambos">Ambos (Litisconsórcio)</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Assunto Principal"
                name="assunto"
                value={formData.assunto}
                onChange={handleChange}
                placeholder="Ex: Dissolução de Sociedade"
                helperText="Será preenchido automaticamente pela API"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Outros Assuntos"
                name="assuntos_secundarios"
                value={formData.assuntos_secundarios}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Localização */}
          <Typography variant="h6" gutterBottom>
            Tribunal e Localização
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tribunal/Foro"
                name="tribunal"
                value={formData.tribunal}
                onChange={handleChange}
                placeholder="Ex: TJSP, Foro de Salto"
                helperText="Será preenchido automaticamente pela API"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Comarca"
                name="comarca"
                value={formData.comarca}
                onChange={handleChange}
                helperText="Será preenchido pela API"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="UF"
                name="uf"
                value={formData.uf}
                onChange={handleChange}
                helperText="Será preenchido pela API"
              >
                <MenuItem value="">Não informado</MenuItem>
                <MenuItem value="SP">São Paulo</MenuItem>
                <MenuItem value="RJ">Rio de Janeiro</MenuItem>
                <MenuItem value="MG">Minas Gerais</MenuItem>
                <MenuItem value="BA">Bahia</MenuItem>
                <MenuItem value="PR">Paraná</MenuItem>
                <MenuItem value="RS">Rio Grande do Sul</MenuItem>
                <MenuItem value="SC">Santa Catarina</MenuItem>
                <MenuItem value="ES">Espírito Santo</MenuItem>
                <MenuItem value="DF">Distrito Federal</MenuItem>
                {/* Adicione outros estados conforme necessário */}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Vara"
                name="vara"
                value={formData.vara}
                onChange={handleChange}
                placeholder="Ex: 1ª Vara Cível"
                helperText="Será preenchido automaticamente pela API"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Datas */}
          <Typography variant="h6" gutterBottom>
            Datas
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                type="date"
                label="Data de Distribuição"
                name="data_distribuicao"
                value={formData.data_distribuicao}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Data de Citação"
                name="data_citacao"
                value={formData.data_citacao}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Controle */}
          <Typography variant="h6" gutterBottom>
            Controle e Status
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <TextField
                required
                select
                fullWidth
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value="andamento">Em Andamento</MenuItem>
                <MenuItem value="suspenso">Suspenso</MenuItem>
                <MenuItem value="arquivado">Arquivado</MenuItem>
                <MenuItem value="sentenciado">Sentenciado</MenuItem>
                <MenuItem value="transito_julgado">Trânsito em Julgado</MenuItem>
                <MenuItem value="recurso">Em Recurso</MenuItem>
                <MenuItem value="execucao">Em Execução</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Tipo de Distribuição"
                name="tipo_distribuicao"
                value={formData.tipo_distribuicao}
                onChange={handleChange}
                placeholder="Livre, Prevento, etc."
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Valores */}
          <Typography variant="h6" gutterBottom>
            Valores
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Valor da Causa"
                name="valor_causa"
                value={formData.valor_causa}
                onChange={handleChange}
                InputProps={{ startAdornment: 'R$ ' }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Valor da Condenação"
                name="valor_condenacao"
                value={formData.valor_condenacao}
                onChange={handleChange}
                InputProps={{ startAdornment: 'R$ ' }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Valor do Acordo"
                name="valor_acordo"
                value={formData.valor_acordo}
                onChange={handleChange}
                InputProps={{ startAdornment: 'R$ ' }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Observações */}
          <Typography variant="h6" gutterBottom>
            Observações e Estratégia
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Resumo do Caso"
                name="resumo"
                value={formData.resumo}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Estratégia Jurídica"
                name="estrategia_juridica"
                value={formData.estrategia_juridica}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Observações Gerais"
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Link para Consulta (e-SAJ, PJe)"
                name="link_consulta"
                value={formData.link_consulta}
                onChange={handleChange}
                placeholder="https://..."
              />
            </Grid>
          </Grid>

          {/* Botões */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/processos')}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar Processo'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default ProcessoCreatePage;
