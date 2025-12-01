import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Events from './pages/Events';
import Paywall from './pages/Paywall';
import { AuthStatusProvider, useAuthStatus } from './context/AuthStatusContext';
import './index.css';


function PrivateRoute({ element }: { element: React.ReactElement }) {
  const { isReady, isAuthenticated, status } = useAuthStatus();

  if (!isReady) {
    return <h1>Carregando...</h1>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (status === 'INACTIVE' && window.location.pathname !== '/app/paywall') {
    return <Navigate to="/app/paywall" replace />;
  }
  
  return element;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      
      {/* Rotas Protegidas (Exigem Login) */}
      <Route path="/app" element={<PrivateRoute element={<Navigate to="/app/events" replace />} />} />
      <Route path="/app/events" element={<PrivateRoute element={<Events />} />} />
      <Route path="/app/paywall" element={<PrivateRoute element={<Paywall />} />} /> 
      
      <Route path="*" element={<h1>404: Página Não Encontrada</h1>} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthStatusProvider>
        <AppRoutes />
      </AuthStatusProvider>
    </BrowserRouter>
  </React.StrictMode>,
);