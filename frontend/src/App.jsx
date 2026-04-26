import { useState } from 'react'
import Registro from './componentes/Registro'
import Login from './componentes/Login'
import './App.css'

function App() {
  const [isLogin, setIsLogin] = useState(false);

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
      
      {!isLogin ? <Registro /> : <Login />}
    </div>
  )
}

export default App
