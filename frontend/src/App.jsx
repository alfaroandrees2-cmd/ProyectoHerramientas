import { useState, useEffect } from 'react'
import Registro from './componentes/Registro'
import Dashboard from './componentes/Dashboard'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    // Verificar si hay token guardado al cargar
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setIsLogin(true);
  };

  if (isAuthenticated) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return (
    <div className="app-container">
      <div className="auth-toggle-container">
        <button
          className={`toggle-btn ${!isLogin ? 'active' : ''}`}
          onClick={() => setIsLogin(false)}
        >
          Registro
        </button>
        <button
          className={`toggle-btn ${isLogin ? 'active' : ''}`}
          onClick={() => setIsLogin(true)}
        >
          Iniciar Sesión
        </button>
      </div>
      
      {!isLogin ? (
        <Registro onAuthSuccess={handleAuthSuccess} />
      ) : (
        <Login onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  )
}

import Login from './componentes/Login'
export default App
