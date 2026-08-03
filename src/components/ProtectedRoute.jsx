import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getToken } from '../services/tokenStore';
import { useAuth } from '../context/useAuth';

const ProtectedRoute = ({ children, redirectPath = '/login' }) => {
  const { user, loading } = useAuth();
  const token = getToken();
  const isAuthenticated = user || Boolean(token);
  const location = useLocation();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location.pathname }} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
