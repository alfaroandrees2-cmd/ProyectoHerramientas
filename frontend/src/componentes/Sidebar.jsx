import React, { useState } from 'react';
import '../styles/Sidebar.css';

const Sidebar = ({ onLogout, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeOption, setActiveOption] = useState('medicos');

  const handleOptionClick = (option) => {
    setActiveOption(option);
    if (onNavigate) {
      onNavigate(option);
    }
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      onLogout();
    }
  };

  const menuOptions = [
    {
      id: 'perfil',
      label: 'Mi Perfil',
      icon: '👤'
    },
    {
      id: 'historial',
      label: 'Historial de Citas',
      icon: '📋'
    },
    {
      id: 'especialidades',
      label: 'Especialidades',
      icon: '🏥'
    },
    {
      id: 'medicos',
      label: 'Médicos en General',
      icon: '👨‍⚕️'
    },
    {
      id: 'ayuda',
      label: 'Centro de Ayuda',
      icon: '❓'
    }
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h2 className={`sidebar-title ${!isOpen && 'hidden'}`}>Menú</h2>
        <button
          className="sidebar-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle sidebar"
        >
          {isOpen ? '◀' : '▶'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuOptions.map((option) => (
          <button
            key={option.id}
            className={`menu-item ${activeOption === option.id ? 'active' : ''}`}
            onClick={() => handleOptionClick(option.id)}
            title={option.label}
          >
            <span className="menu-icon">{option.icon}</span>
            <span className={`menu-label ${!isOpen && 'hidden'}`}>
              {option.label}
            </span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="logout-btn-sidebar"
          onClick={handleLogout}
          title="Cerrar sesión"
        >
          <span className="menu-icon">🚪</span>
          <span className={`menu-label ${!isOpen && 'hidden'}`}>
            Cerrar Sesión
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
