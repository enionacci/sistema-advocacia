// src/pages/DashboardPage.js
import React from 'react';
import FormularioCliente from '../components/FormularioCliente';
import { Container, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function ClientCreatePage() {
  const navigate = useNavigate();

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            Voltar
        </Button>
        <Typography variant="h4" component="h1">Novo Cliente</Typography>
      </Box>
      <FormularioCliente />
    </Container>
  );
}

export default ClientCreatePage;