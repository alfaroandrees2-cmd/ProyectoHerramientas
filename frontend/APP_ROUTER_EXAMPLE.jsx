/**
 * EJEMPLO DE INTEGRACIÓN CON REACT ROUTER
 * 
 * Este archivo muestra cómo integrar el componente Registro
 * con React Router en tu aplicación.
 * 
 * INSTALACIÓN REQUERIDA:
 * npm install react-router-dom
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Registro from './componentes/Registro';
import { ProtectedRoute, AdminRoute } from './componentes/ProtectedRoute';

// Importa tus páginas aquí
// import Dashboard from './pages/Dashboard';
// import Admin from './pages/Admin';
// import Home from './pages/Home';

// Componente placeholder para las páginas
const Dashboard = () => <div className="page"><h1>Dashboard</h1><p>Bienvenido al dashboard</p></div>;
const Admin = () => <div className="page"><h1>Panel de Administración</h1></div>;
const Home = () => <div className="page"><h1>Inicio</h1></div>;

function AppWithRouter() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública - Registro/Login */}
        <Route path="/registro" element={<Registro />} />

        {/* Ruta pública - Inicio */}
        <Route path="/" element={<Home />} />

        {/* Ruta protegida - Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Ruta protegida solo para admin */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } 
        />

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default AppWithRouter;

/**
 * PASOS PARA USAR ESTE EJEMPLO:
 * 
 * 1. Instala React Router:
 *    npm install react-router-dom
 * 
 * 2. Reemplaza tu App.jsx con este contenido
 * 
 * 3. Actualiza main.jsx para usar AppWithRouter:
 *    import App from './App'
 *    import './index.css'
 *    import ReactDOM from 'react-dom/client'
 *    
 *    ReactDOM.createRoot(document.getElementById('root')).render(
 *      <App />
 *    )
 * 
 * 4. Crea tus páginas en src/pages/:
 *    - Dashboard.jsx
 *    - Admin.jsx
 *    - Home.jsx
 * 
 * 5. Importa tus páginas y reemplaza los componentes placeholder
 * 
 * FLUJO DE LA APLICACIÓN:
 * 
 * Usuario no autenticado:
 *   - Accede a / (Home)
 *   - Click en "Ir a registro" → va a /registro
 *   - Se registra o inicia sesión
 *   - Token guardado en localStorage
 *   - Redirige a /dashboard
 * 
 * Usuario autenticado:
 *   - Puede acceder a /dashboard
 *   - Puede ver su perfil y datos
 * 
 * Usuario admin autenticado:
 *   - Acceso adicional a /admin
 *   - Puede ver panel de administración
 * 
 * Si intenta acceder a ruta protegida sin token:
 *   - Redirige automáticamente a /registro
 */
