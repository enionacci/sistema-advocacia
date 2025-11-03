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
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const ProcessoEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(true);

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
    fetchProcesso();
  }, [id]);

  const fetchProcesso = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/processos/processos/${id}/`);
      const processo = response.data;
      
      // Preenche o formulário com os dados do processo
      setFormData({
        numero_processo: processo.numero_processo || '',
        numero_antigo: processo.numero_antigo || '',
        cliente_principal: processo.cliente_principal_detalhes || null,
        tipo: processo.tipo || '',
        classe: processo.classe || '',
        assunto: processo.assunto || '',
        assuntos_secundarios: processo.assuntos_secundarios || '',
        posicao_cliente: processo.posicao_cliente || '',
        tribunal: processo.tribunal || '',
        comarca: processo.comarca || '',
        vara: processo.vara || '',
        uf: processo.uf || '',
        data_distribuicao: processo.data_distribuicao || '',
        data_citacao: processo.data_citacao || '',
        status: processo.status || 'andamento',
        tipo_distribuicao: processo.tipo_distribuicao || '',
        valor_causa: processo.valor_causa || '',
        valor_condenacao: processo.valor_condenacao || '',
        valor_acordo: processo.valor_acordo || '',
        link_consulta: processo.link_consulta || '',
        resumo: processo.resumo || '',
        estrategia_juridica: processo.estrategia_juridica || '',
        observacoes: processo.observacoes || '',
        sigilo: processo.sigilo || false,
        ativo: processo.ativo !== undefined ? processo.ativo : true
      });
      
      setError('');
    } catch (err) {
      console.error('Erro ao buscar processo:', err);
      setError('Erro ao carregar dados do processo.');
    } finally {
      setLoading(false);
    }
  };

  const fetchClientes = async () => {
    try {
      setLoadingClientes(true);
      const response = await axiosInstance.get('/api/clientes/');
      setClientes(response.data.results || response.data);
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
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
    const numbers = value.replace(/\D/g, '');
    let masked = '';
    
    if (numbers.length > 0) {
      masked = numbers.substring(0, 7);
      
      if (numbers.length >= 8) {
        masked += '-' + numbers.substring(7, 9);
      }
      
      if (numbers.length >= 10) {
        masked += '.' + numbers.substring(9, 13);
      }
      
      if (numbers.length >= 14) {
        masked += '.' + numbers.substring(13, 14);
      }
      
      if (numbers.length >= 15) {
        masked += '.' + numbers.substring(14, 16);
      }
      
      if (numbers.length >= 17) {
        masked += '.' + numbers.substring(16, 20);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Prepara os dados
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

      await axiosInstance.put(`/api/processos/processos/${id}/`, dataToSend);
      setSuccess('Processo atualizado com sucesso!');
      
      // Redireciona após 2 segundos
      setTimeout(() => {
        navigate(`/processos/${id}`);
      }, 2000);
    } catch (err) {
      console.error('Erro ao atualizar processo:', err);
      if (err.response?.data) {
        const errors = Object.entries(err.response.data)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
        setError(`Erro ao atualizar processo: ${errors}`);
      } else {
        setError('Erro ao atualizar processo. Verifique os dados e tente novamente.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/processos/${id}`)}
          sx={{ mb: 2 }}
        >
          Voltar para Detalhes
        </Button>
        <Typography variant="h4" component="h1">
          Editar Processo {formData.numero_processo}
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
              <TextField
                required
                fullWidth
                label="Número do Processo (CNJ)"
                name="numero_processo"
                value={formData.numero_processo}
                onChange={handleChange}
                placeholder="0000000-00.0000.0.00.0000"
                helperText="Digite apenas os números. A máscara será aplicada automaticamente."
                inputProps={{ 
                  maxLength: 25
                }}
              />
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
                  const nome = option.nome_completo || option.razao_social || option.nome_fantasia || 'Cliente sem nome';
                  
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
            Controle
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
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Tipo de Distribuição"
                name="tipo_distribuicao"
                value={formData.tipo_distribuicao}
                onChange={handleChange}
                placeholder="Ex: Livre, Prevento"
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
                inputProps={{ step: "0.01", min: "0" }}
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
                inputProps={{ step: "0.01", min: "0" }}
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
                inputProps={{ step: "0.01", min: "0" }}
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
                label="Link para Consulta"
                name="link_consulta"
                value={formData.link_consulta}
                onChange={handleChange}
                placeholder="https://esaj.tjsp.jus.br/..."
              />
            </Grid>
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
                rows={3}
                label="Observações"
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Configurações */}
          <Typography variant="h6" gutterBottom>
            Configurações
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.sigilo}
                    onChange={handleChange}
                    name="sigilo"
                    color="error"
                  />
                }
                label="Processo sob Sigilo"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.ativo}
                    onChange={handleChange}
                    name="ativo"
                    color="primary"
                  />
                }
                label="Processo Ativo"
              />
            </Grid>
          </Grid>

          {/* Botões */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate(`/processos/${id}`)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default ProcessoEditPage;
