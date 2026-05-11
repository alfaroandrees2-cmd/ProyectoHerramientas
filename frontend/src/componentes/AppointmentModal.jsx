import { useState } from 'react';
import '../styles/AppointmentModal.css';

const AppointmentModal = ({ isOpen, onClose, doctor }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Datos MOCK - Doctor información
  const mockDoctor = doctor || {
    id: 1,
    name: 'Dr. Juan Pérez',
    specialty: 'Cardiología',
    office: 'Consultorio 305',
    image: 'https://via.placeholder.com/80',
  };

  // Datos MOCK - Horarios disponibles por día
  const mockTimeSlots = [
    { id: 1, time: '09:00', available: true },
    { id: 2, time: '09:30', available: true },
    { id: 3, time: '10:00', available: false },
    { id: 4, time: '10:30', available: true },
    { id: 5, time: '11:00', available: true },
    { id: 6, time: '11:30', available: false },
    { id: 7, time: '14:00', available: true },
    { id: 8, time: '14:30', available: true },
    { id: 9, time: '15:00', available: true },
    { id: 10, time: '15:30', available: false },
    { id: 11, time: '16:00', available: true },
    { id: 12, time: '16:30', available: true },
  ];

  // Datos MOCK - Días disponibles (próximos 30 días)
  const generateAvailableDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      // Excluir fines de semana
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        days.push(new Date(date));
      }
    }
    return days;
  };

  const availableDays = generateAvailableDays();

  // Funciones auxiliares para el calendario
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

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

  const handleConfirmAppointment = () => {
    if (selectedSlot) {
      const selectedTimeSlot = mockTimeSlots.find(slot => slot.id === selectedSlot);
      console.log('Cita confirmada:', {
        doctor: mockDoctor,
        date: selectedDate.toLocaleDateString('es-ES'),
        time: selectedTimeSlot.time,
      });
      // Aquí irá la lógica para enviar al backend
      onClose();
    }
  };

  const isDateAvailable = (date) => {
    return availableDays.some(
      d => d.getDate() === date.getDate() &&
           d.getMonth() === date.getMonth() &&
           d.getFullYear() === date.getFullYear()
    );
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

  // Renderizar días del calendario
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = getFirstDayOfMonth(selectedDate);
    const days = [];

    // Días vacíos al inicio
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Días del mes
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
        {/* Botón cerrar */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar modal">
          ✕
        </button>

        {/* Header con información del doctor */}
        <div className="modal-header">
          <div className="doctor-info">
            <img
              src={mockDoctor.image}
              alt={mockDoctor.name}
              className="doctor-image"
            />
            <div className="doctor-details">
              <h2 className="doctor-name">{mockDoctor.name}</h2>
              <p className="doctor-specialty">{mockDoctor.specialty}</p>
              <p className="doctor-office">
                <span className="office-icon">📍</span> {mockDoctor.office}
              </p>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="modal-content">
          {/* Calendario a la izquierda */}
          <div className="calendar-section">
            <div className="calendar-header">
              <button
                className="calendar-nav-btn"
                onClick={handlePrevMonth}
                aria-label="Mes anterior"
              >
                ←
              </button>
              <h3 className="calendar-title">
                {selectedDate.toLocaleDateString('es-ES', {
                  month: 'long',
                  year: 'numeric',
                })}
              </h3>
              <button
                className="calendar-nav-btn"
                onClick={handleNextMonth}
                aria-label="Próximo mes"
              >
                →
              </button>
            </div>

            {/* Días de la semana */}
            <div className="calendar-weekdays">
              {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map((day) => (
                <div key={day} className="weekday">
                  {day}
                </div>
              ))}
            </div>

            {/* Días del mes */}
            <div className="calendar-grid">
              {renderCalendarDays()}
            </div>

            {/* Leyenda */}
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

          {/* Horarios a la derecha */}
          <div className="timeslots-section">
            <div className="timeslots-header">
              <h3 className="timeslots-title">
                {selectedDate.toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </h3>
            </div>

            <div className="timeslots-grid">
              {mockTimeSlots.map((slot) => (
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
            </div>

            {mockTimeSlots.every(slot => !slot.available) && (
              <p className="no-slots-message">
                No hay horarios disponibles para esta fecha.
              </p>
            )}
          </div>
        </div>

        {/* Footer con botones de acción */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn btn-primary"
            onClick={handleConfirmAppointment}
            disabled={!selectedSlot}
          >
            Confirmar Cita
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
