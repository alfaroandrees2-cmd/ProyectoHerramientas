import React, { useState, useEffect } from 'react';
import { authUtils, userService } from '../services/authService';
import '../styles/Dashboard.css';

/**
 * EJEMPLO DE COMPONENTE DASHBOARD
 * 
 * Muestra cómo:
 * - Acceder a los datos del usuario autenticado
 * - Obtener información del servidor
 * - Cerrar sesión
 * - Usar los servicios de API
 */

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Obtener usuario actual del localStorage
    const currentUser = authUtils.getUser();
    setUser(currentUser);

    // Si es admin, cargar lista de usuarios
    if (authUtils.isAdmin()) {
      loadUsers();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUsers = async () => {
    try {
      const userData = await userService.getAllUsers();
      setUsers(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authUtils.clearAuth();
    window.location.href = '/registro';
  };

  if (!user) {
    return <div className="dashboard"><p>No autenticado</p></div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>¡Bienvenido, {user.nombre}!</h1>
        <button className="btn-logout" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </header>

      <div className="dashboard-content">
        <section className="user-info">
          <h2>Mi Perfil</h2>
          <div className="info-card">
            <p><strong>Nombre:</strong> {user.nombre}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Rol:</strong> <span className={`rol ${user.rol.toLowerCase()}`}>{user.rol}</span></p>
            <p><strong>ID:</strong> {user.id}</p>
          </div>
        </section>

        {authUtils.isAdmin() && (
          <section className="admin-section">
            <h2>Panel de Administración</h2>
            {error && <div className="error-message">{error}</div>}
            
            {loading ? (
              <p>Cargando usuarios...</p>
            ) : (
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Rol</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.nombre}</td>
                        <td>{u.email}</td>
                        <td><span className={`rol ${u.rol.toLowerCase()}`}>{u.rol}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
