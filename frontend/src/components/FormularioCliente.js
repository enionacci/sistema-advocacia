// src/components/FormularioCliente.js
import React, { useState, useEffect } from 'react'; // Adicionado useEffect
import { useNavigate, useParams } from 'react-router-dom'; // Adicionado useParams
import axiosInstance from '../utils/axiosInstance';
import { Box, TextField, Button, Typography, Container } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

function FormularioCliente() {
  const [formData, setFormData] = useState({
    nome_completo: '',
    cpf: '',
    email: '',
    telefone: '',
    endereco: '',
    observacoes: ''
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
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {isEditMode ? 'Editar Cliente' : 'Cadastro de Novo Cliente'}
        </Typography>

        <TextField label="Nome Completo" name="nome_completo" value={formData.nome_completo} onChange={handleChange} required fullWidth />
        <TextField label="CPF" name="cpf" value={formData.cpf} onChange={handleChange} required fullWidth />
        <TextField label="E-mail" type="email" name="email" value={formData.email} onChange={handleChange} required fullWidth />
        <TextField label="Telefone" name="telefone" value={formData.telefone} onChange={handleChange} fullWidth />
        <TextField label="Endereço" name="endereco" value={formData.endereco} onChange={handleChange} fullWidth />
        <TextField label="Observações" name="observacoes" multiline rows={4} value={formData.observacoes} onChange={handleChange} fullWidth />

        <Button type="submit" variant="contained" endIcon={<SendIcon />} sx={{ mt: 2 }}>
          {isEditMode ? 'Salvar Alterações' : 'Salvar Cliente'}
        </Button>
      </Box>
    </Container>
  );
}

export default FormularioCliente;