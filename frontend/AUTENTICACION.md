# Componente de Registro y Autenticación

Este documento describe la implementación del flujo de registro y autenticación en la aplicación frontend.

## 📋 Descripción

El componente `Registro.jsx` proporciona un flujo completo de autenticación que incluye:
- ✅ Formulario de registro de nuevos usuarios
- ✅ Formulario de login/inicio de sesión
- ✅ Validaciones en tiempo real
- ✅ Manejo de errores
- ✅ Almacenamiento de token JWT
- ✅ Gestión de usuario autenticado
- ✅ Interfaz responsive y moderna

## 🔌 Integración con Backend

El componente utiliza los siguientes endpoints del backend:

### Autenticación
- **POST** `/api/auth/register` - Registrar nuevo usuario
  - Request: `{ nombre, email, password, rol }`
  - Response: `{ token, tokenType, user }`

- **POST** `/api/auth/login` - Iniciar sesión
  - Request: `{ email, password }`
  - Response: `{ token, tokenType, user }`

### Usuarios
- **GET** `/api/users/me` - Obtener usuario actual (requiere token)
- **GET** `/api/users` - Obtener todos los usuarios (solo ADMIN, requiere token)
- **POST** `/api/users/create` - Crear usuario (solo ADMIN, requiere token)

## 📁 Estructura de Archivos

```
frontend/src/
├── componentes/
│   ├── Registro.jsx          # Componente principal de autenticación
│   └── ProtectedRoute.jsx    # Componente para proteger rutas
├── services/
│   └── authService.js        # Servicios y utilidades de API
├── styles/
│   └── Registro.css          # Estilos del componente
└── README.md                 # Este archivo
```

## 🚀 Uso

### 1. Importar el componente en tu aplicación

```jsx
import Registro from './componentes/Registro';

function App() {
  return (
    <div>
      <Registro />
    </div>
  );
}
```

### 2. Usar en React Router

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registro from './componentes/Registro';
import Dashboard from './pages/Dashboard';
import { ProtectedRoute, AdminRoute } from './componentes/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/registro" element={<Registro />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } 
        />
      </Routes>
    </Router>
  );
}
```

### 3. Usar servicios de autenticación

```jsx
import { authService, authUtils } from './services/authService';

// Registro
try {
  const response = await authService.register('Juan', 'juan@example.com', 'password123', 'USER');
  authUtils.setAuth(response.token, response.user);
} catch (error) {
  console.error('Error:', error.message);
}

// Login
try {
  const response = await authService.login('juan@example.com', 'password123');
  authUtils.setAuth(response.token, response.user);
} catch (error) {
  console.error('Error:', error.message);
}

// Verificar autenticación
if (authUtils.isAuthenticated()) {
  const user = authUtils.getUser();
  console.log('Usuario:', user);
}

// Verificar si es admin
if (authUtils.isAdmin()) {
  // Mostrar opciones de admin
}

// Logout
authService.logout();
```

## 🎨 Características de UI

- **Tema Moderno**: Gradiente azul-púrpura
- **Animaciones Suaves**: Transiciones y efectos de entrada
- **Responsive**: Se adapta a cualquier tamaño de pantalla
- **Accesible**: Labels, placeholders y validaciones claras
- **Estados de Carga**: Indicadores visuales durante peticiones
- **Mensajes de Error y Éxito**: Feedback claro al usuario

## ✅ Validaciones

### Registro
- ✓ Nombre: Obligatorio, máximo 120 caracteres
- ✓ Email: Obligatorio, formato válido
- ✓ Contraseña: Obligatoria, mínimo 6 caracteres
- ✓ Confirmación: Debe coincidir con la contraseña

### Login
- ✓ Email: Obligatorio, formato válido
- ✓ Contraseña: Obligatoria

## 💾 Almacenamiento

Los datos se guardan en localStorage:
- `authToken`: Token JWT para autenticación
- `user`: Objeto JSON con datos del usuario

## 🔒 Seguridad

- Validación en cliente antes de enviar
- Validación en servidor (según DTOs)
- Token almacenado en localStorage
- Headers incluyen token en peticiones autenticadas
- Protección de rutas con ProtectedRoute

## 🔄 Flujo de Autenticación

```
┌─────────────────────────────────────────────────┐
│         Usuario llega a /registro                │
└────────────────────┬────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
    ┌───▼────┐           ┌───────▼──┐
    │Registro│           │  Login   │
    └───┬────┘           └───┬──────┘
        │                    │
    ┌───▼────────────────────▼────┐
    │  Validar formulario          │
    └───┬────────────────────────┬─┘
        │                        │
   Válido                    Inválido
        │                        │
        │                    ┌───▼─────┐
        │                    │ Mostrar  │
        │                    │ error    │
        │                    └──────────┘
        │
    ┌───▼──────────────┐
    │Enviar a backend  │
    └───┬──────────────┘
        │
    ┌───┴───────────────────────┐
    │                           │
┌───▼───────┐          ┌────────▼──────┐
│  Éxito    │          │    Error      │
│           │          │               │
│ Guardar   │          │ Mostrar error │
│ Token     │          │               │
│           │          └───────────────┘
│ Guardar   │
│ Usuario   │
│           │
│ Redirigir │
│ a dash    │
└───────────┘
```

## 🛠️ Configuración

### Variables de Entorno (Opcional)

```javascript
// En .env
REACT_APP_API_URL=http://localhost:8080/api
```

Luego actualizar authService.js:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
```

## 📱 Testing

### Cambiar entre Registro y Login
- Click en los botones "Registro" e "Iniciar Sesión"

### Validaciones
```
Prueba 1: Dejar campos vacíos
- Resultado: Mostrar errores de validación

Prueba 2: Email inválido
- Input: "correo_invalido"
- Resultado: Error de formato

Prueba 3: Contraseñas no coinciden
- Input: password="123456", confirm="654321"
- Resultado: Error de coincidencia

Prueba 4: Registro exitoso
- Input: Datos válidos
- Resultado: Token guardado, redirigir a dashboard
```

## 🐛 Troubleshooting

### Error: "No se puede conectar al backend"
- Verificar que el backend está corriendo en `http://localhost:8080`
- Revisar corsOrigin en SecurityConfig

### Error: "Email ya existe"
- Usar un email diferente en el registro
- Este error viene del backend

### Token no se guarda
- Verificar que localStorage está habilitado
- Revisar la consola del navegador para errores

## 📝 Notas

- El componente maneja automáticamente el localStorage
- Los estilos están encapsulados en Registro.css
- El servicio authService puede reutilizarse en otros componentes
- Las rutas protegidas requieren token y user en localStorage

## 🔄 Próximas Mejoras

- [ ] Recuperación de contraseña
- [ ] Verificación de email
- [ ] Autenticación de dos factores
- [ ] Actualización de perfil
- [ ] Cambio de contraseña
- [ ] Integración con Google/GitHub OAuth
