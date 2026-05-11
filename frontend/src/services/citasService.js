const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const obtenerSlotsDisponibles = async (doctorId, fecha) => {
  if (!doctorId || !fecha) {
    throw new Error('doctorId y fecha son requeridos');
  }

  const endpoint = `${BASE_URL}/doctores/${doctorId}/slots`;
  const queryParams = new URLSearchParams({ date: fecha });

  const response = await fetch(`${endpoint}?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: No se pudieron cargar los slots`);
  }

  const slots = await response.json();

  if (!Array.isArray(slots)) {
    throw new Error('Formato de respuesta inválido');
  }

  return slots;
};

export const obtenerDoctores = async (search, especialidad) => {
  const endpoint = `${BASE_URL}/doctores`;
  const queryParams = new URLSearchParams();
  
  if (search) queryParams.append('search', search);
  if (especialidad) queryParams.append('especialidad', especialidad);

  const url = queryParams.toString() ? `${endpoint}?${queryParams.toString()}` : endpoint;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
    }
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudieron cargar los doctores`);
  }

  const doctores = await response.json();
  return Array.isArray(doctores) ? doctores : [];
};

export const crearCita = async (datoCita) => {
  if (!datoCita || !datoCita.slotId || !datoCita.motivo) {
    throw new Error('slotId y motivo son requeridos');
  }

  const endpoint = `${BASE_URL}/citas`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
    },
    body: JSON.stringify({
      slotId: datoCita.slotId,
      motivo: datoCita.motivo
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: No se pudo crear la cita`);
  }

  return await response.json();
};

export default {
  obtenerSlotsDisponibles,
  obtenerDoctores,
  crearCita
};
