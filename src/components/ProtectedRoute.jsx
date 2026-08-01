import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ user, redirectPath = '/login' }) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = user || Boolean(token);

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
