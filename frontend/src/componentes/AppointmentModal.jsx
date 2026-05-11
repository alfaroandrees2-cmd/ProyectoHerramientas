import { useState, useEffect } from 'react';
import citasService from '../services/citasService';
import '../styles/AppointmentModal.css';

const AppointmentModal = ({ isOpen, onClose, doctor }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [cargandoHorarios, setCargandoHorarios] = useState(false);
  const [errorHorarios, setErrorHorarios] = useState(null);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  useEffect(() => {
    if (!isOpen || !doctor?.id) return;

    const cargarHorarios = async () => {
      try {
        setCargandoHorarios(true);
        setErrorHorarios(null);

        const fechaFormato = selectedDate.toISOString().split('T')[0];
        const slotsDelBackend = await citasService.obtenerSlotsDisponibles(
          doctor.id,
          fechaFormato
        );

        const horariosTransformados = slotsDelBackend.map((slot) => ({
          id: slot.id,
          time: slot.horaInicio,
          available: slot.estado === 'DISPONIBLE',
          horaFin: slot.horaFin
        }));

        setHorarios(horariosTransformados);
      } catch (error) {
        console.error('Error al cargar horarios:', error);
        setErrorHorarios('No se pudieron cargar los horarios.');
      } finally {
        setCargandoHorarios(false);
      }
    };

    cargarHorarios();
  }, [isOpen, selectedDate, doctor?.id]);

  const handlePrevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1));
  };

  const handleDayClick = (day) => {
    const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    setSelectedDate(newDate);
    setSelectedSlot(null);
  };

  const handleTimeSlotClick = (slot) => {
    if (slot.available) {
      setSelectedSlot(slot.id === selectedSlot ? null : slot.id);
    }
  };

  const handleConfirmAppointment = async () => {
    if (!selectedSlot) return;

    try {
      const datoCita = {
        slotId: selectedSlot,
        motivo: 'Consulta médica'
      };

      await citasService.crearCita(datoCita);
      alert('¡Cita agendada exitosamente!');
      onClose();
    } catch (error) {
      console.error('Error al crear cita:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const isDateAvailable = (date) => {
    return date.getDay() !== 0 && date.getDay() !== 6;
  };

  const isDateSelected = (date) => {
    return selectedDate.getDate() === date.getDate() &&
           selectedDate.getMonth() === date.getMonth() &&
           selectedDate.getFullYear() === date.getFullYear();
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = getFirstDayOfMonth(selectedDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
      const available = isDateAvailable(currentDate);
      const selected = isDateSelected(currentDate);
      const today = isToday(currentDate);

      days.push(
        <button
          key={day}
          className={`calendar-day ${available ? 'available' : 'unavailable'} ${selected ? 'selected' : ''} ${today ? 'today' : ''}`}
          onClick={() => handleDayClick(day)}
          disabled={!available}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  if (!isOpen) return null;

  return (
    <div className="appointment-modal-overlay" onClick={onClose}>
      <div className="appointment-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar modal">✕</button>

        <div className="modal-header">
          <div className="doctor-info">
            <img
              src={doctor.image || 'https://via.placeholder.com/80'}
              alt={doctor.name}
              className="doctor-image"
            />
            <div className="doctor-details">
              <h2 className="doctor-name">{doctor.name}</h2>
              <p className="doctor-specialty">{doctor.specialty}</p>
              <p className="doctor-office">
                <span className="office-icon">📍</span> {doctor.office}
              </p>
            </div>
          </div>
        </div>

        <div className="modal-content">
          <div className="calendar-section">
            <div className="calendar-header">
              <button className="calendar-nav-btn" onClick={handlePrevMonth} aria-label="Mes anterior">←</button>
              <h3 className="calendar-title">
                {selectedDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
              </h3>
              <button className="calendar-nav-btn" onClick={handleNextMonth} aria-label="Próximo mes">→</button>
            </div>

            <div className="calendar-weekdays">
              {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map((day) => (
                <div key={day} className="weekday">{day}</div>
              ))}
            </div>

            <div className="calendar-grid">
              {renderCalendarDays()}
            </div>

            <div className="calendar-legend">
              <div className="legend-item">
                <div className="legend-color available"></div>
                <span>Disponible</span>
              </div>
              <div className="legend-item">
                <div className="legend-color unavailable"></div>
                <span>No disponible</span>
              </div>
            </div>
          </div>

          <div className="timeslots-section">
            <h3 className="timeslots-title">
              {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </h3>

            <div className="timeslots-grid">
              {cargandoHorarios && <p className="timeslot-loading">Cargando horarios...</p>}
              {!cargandoHorarios && errorHorarios && <p className="timeslot-error">{errorHorarios}</p>}
              {!cargandoHorarios && horarios.map((slot) => (
                <button
                  key={slot.id}
                  className={`timeslot-card ${!slot.available ? 'unavailable' : ''} ${selectedSlot === slot.id ? 'selected' : ''}`}
                  onClick={() => handleTimeSlotClick(slot)}
                  disabled={!slot.available}
                >
                  <span className="timeslot-time">{slot.time}</span>
                  {!slot.available && <span className="timeslot-status">Ocupado</span>}
                </button>
              ))}
              {!cargandoHorarios && horarios.length === 0 && <p className="no-slots-message">No hay horarios disponibles para esta fecha.</p>}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleConfirmAppointment} disabled={!selectedSlot}>Confirmar Cita</button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
