import React from 'react';
import { Navigate } from 'react-router-dom';
import { authUtils } from '../services/authService';

/**
 * Componente que protege rutas autenticadas
 * Si el usuario no está autenticado, redirige a /registro
 */
export const ProtectedRoute = ({ children }) => {
  if (!authUtils.isAuthenticated()) {
    return <Navigate to="/registro" replace />;
  }

  return children;
};

/**
 * Componente que protege rutas solo para admin
 * Si el usuario no es admin, redirige a /dashboard
 */
export const AdminRoute = ({ children }) => {
  if (!authUtils.isAuthenticated()) {
    return <Navigate to="/registro" replace />;
  }

  if (!authUtils.isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
