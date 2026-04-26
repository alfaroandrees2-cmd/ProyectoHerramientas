import React, { useState } from 'react';
import '../styles/Registro.css';

const Registro = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);

  // Estados para registro
  const [registroForm, setRegistroForm] = useState({
    nombre: '',
    email: '',
    password: '',
    passwordConfirm: '',
    rol: 'USER'
  });

  // Estados para login
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  // Validaciones
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarRegistro = () => {
    if (!registroForm.nombre.trim()) {
      setError('El nombre es obligatorio');
      return false;
    }
    if (registroForm.nombre.length > 120) {
      setError('El nombre no puede superar 120 caracteres');
      return false;
    }
    if (!registroForm.email.trim()) {
      setError('El email es obligatorio');
      return false;
    }
    if (!validarEmail(registroForm.email)) {
      setError('El email no tiene formato válido');
      return false;
    }
    if (!registroForm.password) {
      setError('La contraseña es obligatoria');
      return false;
    }
    if (registroForm.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (registroForm.password !== registroForm.passwordConfirm) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const validarLogin = () => {
    if (!loginForm.email.trim()) {
      setError('El email es obligatorio');
      return false;
    }
    if (!validarEmail(loginForm.email)) {
      setError('El email no tiene formato válido');
      return false;
    }
    if (!loginForm.password) {
      setError('La contraseña es obligatoria');
      return false;
    }
    return true;
  };

  // Manejadores de cambio
  const handleRegistroChange = (e) => {
    const { name, value } = e.target;
    setRegistroForm(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  // Enviar formulario de registro
  const handleRegistroSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validarRegistro()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: registroForm.nombre,
          email: registroForm.email,
          password: registroForm.password,
          rol: registroForm.rol
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el registro');
      }

      // Guardar token y usuario
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);

      setSuccess('¡Registro exitoso! Bienvenido.');
      setRegistroForm({
        nombre: '',
        email: '',
        password: '',
        passwordConfirm: '',
        rol: 'USER'
      });

      // Redirigir después de 2 segundos
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);

    } catch (err) {
      setError(err.message || 'Error al registrarse. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Enviar formulario de login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validarLogin()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el login');
      }

      // Guardar token y usuario
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);

      setSuccess('¡Login exitoso! Bienvenido.');
      setLoginForm({
        email: '',
        password: ''
      });

      // Redirigir después de 2 segundos
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);

    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Si el usuario ya está autenticado
  if (token && user) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="success-message">
            <h2>¡Bienvenido, {user.nombre}!</h2>
            <p>Email: {user.email}</p>
            <p>Rol: {user.rol}</p>
            <button 
              className="btn btn-primary"
              onClick={() => {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                setToken(null);
                setUser(null);
                setLoginForm({ email: '', password: '' });
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-toggle">
          <button
            className={`toggle-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(false);
              setError('');
              setSuccess('');
            }}
          >
            Registro
          </button>
          <button
            className={`toggle-btn ${isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(true);
              setError('');
              setSuccess('');
            }}
          >
            Iniciar Sesión
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {!isLogin ? (
          // Formulario de Registro
          <form onSubmit={handleRegistroSubmit} className="auth-form">
            <h2>Crear Cuenta</h2>

            <div className="form-group">
              <label htmlFor="nombre">Nombre Completo</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={registroForm.nombre}
                onChange={handleRegistroChange}
                placeholder="Juan Pérez"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={registroForm.email}
                onChange={handleRegistroChange}
                placeholder="correo@ejemplo.com"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={registroForm.password}
                onChange={handleRegistroChange}
                placeholder="Mínimo 6 caracteres"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="passwordConfirm">Confirmar Contraseña</label>
              <input
                type="password"
                id="passwordConfirm"
                name="passwordConfirm"
                value={registroForm.passwordConfirm}
                onChange={handleRegistroChange}
                placeholder="Repite tu contraseña"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="rol">Rol</label>
              <select
                id="rol"
                name="rol"
                value={registroForm.rol}
                onChange={handleRegistroChange}
                disabled={loading}
              >
                <option value="USER">Usuario</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>
        ) : (
          // Formulario de Login
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <h2>Iniciar Sesión</h2>

            <div className="form-group">
              <label htmlFor="login-email">Email</label>
              <input
                type="email"
                id="login-email"
                name="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                placeholder="correo@ejemplo.com"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Contraseña</label>
              <input
                type="password"
                id="login-password"
                name="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                placeholder="Tu contraseña"
                disabled={loading}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Registro;
