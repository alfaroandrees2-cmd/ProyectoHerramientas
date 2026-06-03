import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faClipboardList,
  faHospital,
  faUserDoctor,
  faCircleQuestion,
  faRightFromBracket,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/pro-solid-svg-icons';
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
      icon: faUser
    },
    {
      id: 'historial',
      label: 'Historial de Citas',
      icon: faClipboardList
    },
    {
      id: 'especialidades',
      label: 'Especialidades',
      icon: faHospital
    },
    {
      id: 'medicos',
      label: 'Médicos en General',
      icon: faUserDoctor
    },
    {
      id: 'ayuda',
      label: 'Centro de Ayuda',
      icon: faCircleQuestion
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
          <FontAwesomeIcon icon={isOpen ? faChevronLeft : faChevronRight} />
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
            <span className="menu-icon">
              <FontAwesomeIcon icon={option.icon} />
            </span>
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
          <span className="menu-icon">
            <FontAwesomeIcon icon={faRightFromBracket} />
          </span>
          <span className={`menu-label ${!isOpen && 'hidden'}`}>
            Cerrar Sesión
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
