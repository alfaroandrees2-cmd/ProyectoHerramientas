import React, { useEffect, useMemo, useState } from 'react';
import { doctorService } from '../services/doctorService';
import AppointmentModal from './AppointmentModal';
import logoSkipline from '../assets/images/logo.png';
import '../styles/Dashboard.css';

const Dashboard = (props) => {
  const [doctores, setDoctores] = useState([]);
  const [search, setSearch] = useState('');
  const [especialidad, setEspecialidad] = useState('Todas');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    loadDoctores();
  }, [search, especialidad]);

  const loadDoctores = async () => {
    try {
      setLoading(true);
      setError('');
      const payload = await doctorService.listDoctors({
        search: search.trim() || undefined,
        especialidad: especialidad === 'Todas' ? undefined : especialidad
      });
      setDoctores(Array.isArray(payload) ? payload : []);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los doctores.');
      setDoctores([]);
    } finally {
      setLoading(false);
    }
  };

  const especialidades = useMemo(() => {
    const values = doctores
      .flatMap((doctor) => (doctor.especialidad || '').split(','))
      .map((item) => item.trim())
      .filter(Boolean);
    return ['Todas', ...new Set(values)];
  }, [doctores]);

  const doctoresDisponibles = useMemo(
    () => doctores.filter((doctor) => doctor.estado === 'DISPONIBLE').length,
    [doctores]
  );

  const formatProximaCita = (doctor) => {
    if (!doctor.proximaFechaDisponible || !doctor.proximaHoraDisponible) {
      return 'Proxima cita: Sin disponibilidad';
    }

    return `Proxima cita: ${doctor.proximaFechaDisponible} ${doctor.proximaHoraDisponible.slice(0, 5)}`;
  };

  const handleOpenModal = (doctor) => {
    setSelectedDoctor({
      id: doctor.id,
      name: doctor.nombre,
      specialty: doctor.especialidad,
      office: `Consultorio ${doctor.consultorio || 'N/A'}`,
      image: 'https://via.placeholder.com/80',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  return (
    <main className="dashboard-page">
      <header className="topbar">
        <div className="brand">
          <img src={logoSkipline} alt="Skipline Logo" className="brand-logo" />
          <div className="brand-text">
            <p>Sistema de Gestion de Citas Médicas</p>
          </div>
        </div>
        <button className="logout-btn" type="button" onClick={props.onLogout}>
          Cerrar Sesion
        </button>
      </header>

      <section className="stats-grid">
        <article className="stat-card">
          <p className="stat-label">Doctores Disponibles</p>
          <p className="stat-value">{doctoresDisponibles}</p>
        </article>
        <article className="stat-card">
          <p className="stat-label">Especialidades</p>
          <p className="stat-value">{Math.max(especialidades.length - 1, 0)}</p>
        </article>
        <article className="stat-card">
          <p className="stat-label">Total de Doctores</p>
          <p className="stat-value">{doctores.length}</p>
        </article>
      </section>

      <section className="filters-box">
        <div className="filter-group">
          <label htmlFor="doctorSearch">Buscar Doctor</label>
          <input
            id="doctorSearch"
            type="text"
            placeholder="Buscar por nombre o especialidad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="especialidad">Especialidad</label>
          <select
            id="especialidad"
            value={especialidad}
            onChange={(e) => setEspecialidad(e.target.value)}
          >
            {especialidades.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="doctores-grid">
        {loading && <p className="panel-state">Cargando doctores...</p>}
        {!loading && error && <p className="panel-state panel-error">{error}</p>}
        {!loading && !error && doctores.length === 0 && (
          <p className="panel-state">No hay doctores para mostrar.</p>
        )}

        {doctores.map((doctor) => (
          <article
            key={doctor.id}
            className="doctor-card"
            onClick={() => handleOpenModal(doctor)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleOpenModal(doctor);
              }
            }}
          >
            <div className="doctor-card-top">
              <div>
                <h2>{doctor.nombre}</h2>
                <p className="especialidad">{doctor.especialidad}</p>
              </div>
              <span className="rating">#{doctor.id}</span>
            </div>

            <ul className="doctor-meta">
              <li>{doctor.experiencia} años de experiencia</li>
              <li>Consultorio {doctor.consultorio || 'Sin dato'}</li>
              <li>{formatProximaCita(doctor)}</li>
            </ul>

            <p className={`estado ${doctor.estado === 'DISPONIBLE' ? 'ok' : 'off'}`}>
              {doctor.estado === 'DISPONIBLE' ? 'Disponible' : 'Sin cupos por ahora'}
            </p>
          </article>
        ))}
      </section>

      <section className="notice-box">
        <p>
          Solo se muestra informacion de doctores desde base de datos. Citas y horarios todavia no se gestionan desde esta vista.
        </p>
      </section>

      {/* Modal de Citas */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        doctor={selectedDoctor}
      />
    </main>
  );
};

export default Dashboard;
