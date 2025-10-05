// src/App.js
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, CssBaseline, Button, Box } from '@mui/material';
import { useAuth } from './context/AuthContext';
import NewConsultationPage from './pages/NewConsultationPage';

// Importando as páginas com os nomes corretos
import LoginPage from './pages/LoginPage';
import ClientListPage from './pages/ClientListPage'; // Nossa nova lista
import ClientCreatePage from './pages/ClientCreatePage'; // A página de criação renomeada
import ClientEditPage from './pages/ClientEditPage';
import PrivateRoute from './components/PrivateRoute';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import ClientDetailPage from './pages/ClientDetailPage';
import EscritorioPage from './pages/EscritorioPage';
import RegisterPage from './pages/RegisterPage'; // Importa a nova página
import CreateOfficePage from './pages/CreateOfficePage';
import AcceptInvitationPage from './pages/AcceptInvitationPage';
import AuditLogListPage from './pages/AuditLogListPage';
import AuditLogDetailPage from './pages/AuditLogDetailPage';
import AuditLogStatsPage from './pages/AuditLogStatsPage';
import DocumentosPage from './pages/DocumentosPage';

function App() {
  const { user, logoutAction, escritorio } = useAuth();

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          {escritorio && escritorio.logo && (
            <Box sx={{ mr: 2 }}>
              <img src={escritorio.logo} alt="Logotipo do Escritório" style={{ height: 40 }} />
            </Box>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema para Advocacia
          </Typography>

          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography component="span" sx={{ mr: 2 }}>
                Olá, {user.username}
              </Typography>
              <Button color="inherit" component={Link} to="/meu-escritorio" sx={{ mr: 2 }}>
                Meu Escritório
              </Button>
              <Button color="inherit" onClick={logoutAction}>
                Sair
              </Button>
            </Box>
          ) : null}
        </Toolbar>
      </AppBar>
      <main>
        <Routes>
          <Route path="/convite/:token" element={<AcceptInvitationPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Rota principal agora é a lista de clientes */}
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <ClientListPage />
              </PrivateRoute>
            } 
          />

          {/* Nova rota para criar um cliente */}
          <Route 
            path="/clientes/novo" 
            element={
              <PrivateRoute>
                <ClientCreatePage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/clientes/:clientId/edit" 
            element={
              <PrivateRoute>
                <ClientEditPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/clientes/:clientId/nova-consulta" 
            element={
              <PrivateRoute>
                <NewConsultationPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/clientes/:clientId" 
            element={
              <PrivateRoute>
                <ClientDetailPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/meu-escritorio" 
            element={
              <PrivateRoute>
                <EscritorioPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/criar-escritorio" 
            element={
              <AuthenticatedRoute>
                <CreateOfficePage />
              </AuthenticatedRoute>
            } 
          />

          {/* Rotas de Auditoria */}
          <Route 
            path="/audit-logs" 
            element={
              <PrivateRoute>
                <AuditLogListPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/audit-logs/stats" 
            element={
              <PrivateRoute>
                <AuditLogStatsPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/audit-logs/:id" 
            element={
              <PrivateRoute>
                <AuditLogDetailPage />
              </PrivateRoute>
            } 
          />

          {/* Rotas de Documentos */}
          <Route 
            path="/documentos" 
            element={
              <PrivateRoute>
                <DocumentosPage />
              </PrivateRoute>
            } 
          />

        </Routes>
      </main>
    </>
  );
}

export default App;