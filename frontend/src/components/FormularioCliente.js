// src/components/FormularioCliente.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { masks } from '../utils/masks';
import { 
  Box, TextField, Button, Typography, Container, 
  Accordion, AccordionSummary, AccordionDetails,
  Grid, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Componente de TextField com máscara
const MaskedTextField = ({ maskType, value = '', onChange, name, ...textFieldProps }) => {
  const handleChange = (e) => {
    const maskedValue = masks[maskType] ? masks[maskType](e.target.value) : e.target.value;
    onChange({ target: { name, value: maskedValue } });
  };

  return (
    <TextField 
      {...textFieldProps} 
      name={name}
      value={value}
      onChange={handleChange}
    />
  );
};

function FormularioCliente() {
  const [formData, setFormData] = useState({
    // Dados Pessoais Básicos
    nome_completo: '',
    cpf: '',
    cnpj: '',
    rg: '',
    data_nascimento: '',
    estado_civil: '',
    profissao: '',
    razao_social: '',
    nome_fantasia: '',
    
    // Informações de Contato
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    telefone_celular: '',
    telefone_fixo: '',
    email: '',
    email_alternativo: '',
    preferencia_contato: '',
    
    // Dados Específicos da Advocacia
    como_chegou: '',
    area_interesse: '',
    advogado_responsavel: '',
    data_primeiro_atendimento: '',
    outros_advogados: '',
    historico_relacionamento: '',
    
    // Dados Familiares Relevantes
    nome_conjuge: '',
    regime_bens: '',
    representante_legal: '',
    contato_emergencia: '',
    
    // Controle Administrativo
    status_cliente: 'Ativo',
    observacoes: '',
    restricoes: '',
    
    // Campos legados (mantidos por compatibilidade)
    telefone: '',
    endereco: ''
  });

  const navigate = useNavigate();
  const { clientId } = useParams(); // Pega o ID da URL, se existir
  const isEditMode = Boolean(clientId); // Verifica se estamos no modo de edição

  useEffect(() => {
    // Se estiver no modo de edição, busca os dados do cliente
    if (isEditMode) {
      axiosInstance.get(`/api/clientes/${clientId}/`)
        .then(response => {
          setFormData(response.data);
        })
        .catch(error => console.error("Erro ao buscar dados do cliente:", error));
    }
  }, [clientId, isEditMode]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (isEditMode) {
        // Se estiver editando, usa o método PUT
        await axiosInstance.put(`/api/clientes/${clientId}/`, formData);
        alert(`Cliente ${formData.nome_completo} atualizado com sucesso!`);
      } else {
        // Se estiver criando, usa o método POST
        await axiosInstance.post('/api/clientes/', formData);
        alert(`Cliente ${formData.nome_completo} salvo com sucesso!`);
      }
      navigate('/'); // Redireciona para a lista após a operação
    } catch (error) {
      console.error('Houve um erro:', error);
      alert('Erro ao salvar os dados. Verifique o console.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
        >
          Voltar
        </Button>
        <Typography variant="h4" component="h1">
          {isEditMode ? 'Editar Cliente' : 'Cadastro de Novo Cliente'}
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Seção 1: Dados Pessoais Básicos */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">📋 Dados Pessoais Básicos</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid size={8} item xs={12}>
                <TextField 
                  label="Nome Completo / Razão Social" 
                  name="nome_completo" 
                  value={formData.nome_completo} 
                  onChange={handleChange} 
                  required 
                  fullWidth 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MaskedTextField
                  maskType="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  name="cpf"
                  label="CPF"
                  fullWidth
                  helperText="Para Pessoa Física"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MaskedTextField
                  maskType="rg"
                  value={formData.rg}
                  onChange={handleChange}
                  name="rg"
                  label="RG"
                  fullWidth
                />
              </Grid>
              <Grid size={2.3}item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Estado Civil</InputLabel>
                  <Select
                    name="estado_civil"
                    value={formData.estado_civil}
                    onChange={handleChange}
                    label="Estado Civil"
                  >
                    <MenuItem value="">Selecione</MenuItem>
                    <MenuItem value="Solteiro(a)">Solteiro(a)</MenuItem>
                    <MenuItem value="Casado(a)">Casado(a)</MenuItem>
                    <MenuItem value="Divorciado(a)">Divorciado(a)</MenuItem>
                    <MenuItem value="Viúvo(a)">Viúvo(a)</MenuItem>
                    <MenuItem value="União Estável">União Estável</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Data de Nascimento" 
                  name="data_nascimento" 
                  type="date"
                  value={formData.data_nascimento} 
                  onChange={handleChange} 
                  fullWidth 
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={3} item xs={12} sm={6}>
                <TextField 
                  label="Profissão/Ocupação" 
                  name="profissao" 
                  value={formData.profissao} 
                  onChange={handleChange} 
                  fullWidth 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MaskedTextField
                  maskType="cnpj"
                  value={formData.cnpj}
                  onChange={handleChange}
                  name="cnpj"
                  label="CNPJ"
                  fullWidth
                  helperText="Para Pessoa Jurídica"
                />
              </Grid>
              <Grid size={5} item xs={12} sm={8}>
                <TextField 
                  label="Razão Social (PJ)" 
                  name="razao_social" 
                  value={formData.razao_social} 
                  onChange={handleChange} 
                  fullWidth 
                />
              </Grid>
              <Grid size={3} item xs={12} sm={4}>
                <TextField 
                  label="Nome Fantasia (PJ)" 
                  name="nome_fantasia" 
                  value={formData.nome_fantasia} 
                  onChange={handleChange} 
                  fullWidth 
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Seção 2: Informações de Contato */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">📞 Informações de Contato</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid size={7}item xs={12} sm={8}>
                <TextField 
                  label="Logradouro" 
                  name="logradouro" 
                  value={formData.logradouro} 
                  onChange={handleChange} 
                  fullWidth 
                />
              </Grid>
              <Grid size={1.3} item xs={12} sm={4}>
                <TextField 
                  label="Número" 
                  name="numero" 
                  value={formData.numero} 
                  onChange={handleChange} 
                  fullWidth 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Complemento" 
                  name="complemento" 
                  value={formData.complemento} 
                  onChange={handleChange} 
                  fullWidth 
                />
              </Grid>
              <Grid size={6} item xs={12} sm={6}>
                <TextField 
                  label="Bairro" 
                  name="bairro" 
                  value={formData.bairro} 
                  onChange={handleChange} 
                  fullWidth 
                />
              </Grid>
              <Grid size={6}item xs={12} sm={5}>
                <TextField 
                  label="Cidade" 
                  name="cidade" 
                  value={formData.cidade} 
                  onChange={handleChange} 
                  fullWidth 
                />
              </Grid>
              <Grid size={1.4} item xs={12} sm={3}>
                <TextField 
                  label="Estado" 
                  name="estado" 
                  value={formData.estado} 
                  onChange={handleChange} 
                  fullWidth 
                  inputProps={{ maxLength: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <MaskedTextField
                  maskType="cep"
                  value={formData.cep}
                  onChange={handleChange}
                  name="cep"
                  label="CEP"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MaskedTextField
                  maskType="phone"
                  value={formData.telefone_celular}
                  onChange={handleChange}
                  name="telefone_celular"
                  label="Telefone Celular"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MaskedTextField
                  maskType="phoneFixed"
                  value={formData.telefone_fixo}
                  onChange={handleChange}
                  name="telefone_fixo"
                  label="Telefone Fixo"
                  fullWidth
                />
              </Grid>
              <Grid size={4} item xs={12} sm={6}>
                <TextField 
                  label="E-mail Principal" 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  fullWidth 
                />
              </Grid>
              <Grid size={4} item xs={12} sm={6}>
                <TextField 
                  label="E-mail Alternativo" 
                  type="email" 
                  name="email_alternativo" 
                  value={formData.email_alternativo} 
                  onChange={handleChange} 
                  fullWidth 
                />
              </Grid>
              <Grid size={2.5} item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Preferência de Contato</InputLabel>
                  <Select
                    name="preferencia_contato"
                    value={formData.preferencia_contato}
                    onChange={handleChange}
                    label="Preferência de Contato"
                  >
                    <MenuItem value="">Selecione</MenuItem>
                    <MenuItem value="E-mail">E-mail</MenuItem>
                    <MenuItem value="Telefone">Telefone</MenuItem>
                    <MenuItem value="WhatsApp">WhatsApp</MenuItem>
                    <MenuItem value="SMS">SMS</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Seção 3: Dados Específicos da Advocacia */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">⚖️ Dados Específicos da Advocacia</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField 
                  label="Como Chegou ao Escritório" 
                  name="como_chegou" 
                  value={formData.como_chegou} 
                  onChange={handleChange} 
                  fullWidth 
                  helperText="Ex: Indicação, Google, Redes Sociais"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Área Jurídica de Interesse" 
                  name="area_interesse" 
                  value={formData.area_interesse} 
                  onChange={handleChange} 
                  fullWidth 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Advogado Responsável" 
                  name="advogado_responsavel" 
                  value={formData.advogado_responsavel} 
                  onChange={handleChange} 
                  fullWidth 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  label="Data do Primeiro Atendimento" 
                  name="data_primeiro_atendimento" 
                  type="date"
                  value={formData.data_primeiro_atendimento} 
                  onChange={handleChange} 
                  fullWidth 
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  label="Outros Advogados que já o Representaram" 
                  name="outros_advogados" 
                  value={formData.outros_advogados} 
                  onChange={handleChange} 
                  fullWidth 
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  label="Histórico de Relacionamento" 
                  name="historico_relacionamento" 
                  value={formData.historico_relacionamento} 
                  onChange={handleChange} 
                  fullWidth 
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Seção 4: Dados Familiares Relevantes */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">👨‍👩‍👧‍👦 Dados Familiares Relevantes</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Nome do Cônjuge" 
                  name="nome_conjuge" 
                  value={formData.nome_conjuge} 
                  onChange={handleChange} 
                  fullWidth 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Regime de Bens</InputLabel>
                  <Select
                    name="regime_bens"
                    value={formData.regime_bens}
                    onChange={handleChange}
                    label="Regime de Bens"
                  >
                    <MenuItem value="">Selecione</MenuItem>
                    <MenuItem value="Comunhão Parcial">Comunhão Parcial</MenuItem>
                    <MenuItem value="Comunhão Universal">Comunhão Universal</MenuItem>
                    <MenuItem value="Separação Total">Separação Total</MenuItem>
                    <MenuItem value="Participação Final">Participação Final</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Representante Legal" 
                  name="representante_legal" 
                  value={formData.representante_legal} 
                  onChange={handleChange} 
                  fullWidth 
                  helperText="Se menor ou incapaz"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Contato de Emergência" 
                  name="contato_emergencia" 
                  value={formData.contato_emergencia} 
                  onChange={handleChange} 
                  fullWidth 
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Seção 5: Controle Administrativo */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">📊 Controle Administrativo</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status do Cliente</InputLabel>
                  <Select
                    name="status_cliente"
                    value={formData.status_cliente}
                    onChange={handleChange}
                    label="Status do Cliente"
                  >
                    <MenuItem value="Ativo">Ativo</MenuItem>
                    <MenuItem value="Inativo">Inativo</MenuItem>
                    <MenuItem value="Prospect">Prospect</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  label="Observações Gerais" 
                  name="observacoes" 
                  multiline 
                  rows={4} 
                  value={formData.observacoes} 
                  onChange={handleChange} 
                  fullWidth 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  label="Restrições Específicas" 
                  name="restricoes" 
                  multiline 
                  rows={3} 
                  value={formData.restricoes} 
                  onChange={handleChange} 
                  fullWidth 
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button 
            type="submit" 
            variant="contained" 
            endIcon={<SendIcon />} 
            size="large"
            fullWidth
          >
            {isEditMode ? 'Salvar Alterações' : 'Salvar Cliente'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default FormularioCliente;