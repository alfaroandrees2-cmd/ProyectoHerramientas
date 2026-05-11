# AppointmentModal - Guía de Uso

## Descripción
El componente `AppointmentModal.jsx` es un modal moderno y reutilizable para que los usuarios seleccionen horarios de citas médicas con los doctores del sistema.

## Ubicación
- Componente: `src/componentes/AppointmentModal.jsx`
- Estilos: `src/styles/AppointmentModal.css`

## Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `isOpen` | boolean | ✅ | Controla si el modal está visible |
| `onClose` | function | ✅ | Callback ejecutado al cerrar el modal |
| `doctor` | object | ❌ | Objeto con datos del doctor (opcional, usa MOCK si no se proporciona) |

## Estructura del objeto `doctor`

```jsx
const doctor = {
  id: 1,                              // ID único del doctor
  name: 'Dr. Juan Pérez',             // Nombre completo
  specialty: 'Cardiología',           // Especialidad médica
  office: 'Consultorio 305',          // Número o descripción del consultorio
  image: 'https://via.placeholder.com/80'  // URL de la imagen del doctor
};
```

## Ejemplo de Uso - Componente Dashboard

```jsx
import { useState } from 'react';
import AppointmentModal from './AppointmentModal';

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctores, setDoctores] = useState([/* doctores del backend */]);

  // Función para abrir el modal con datos del doctor seleccionado
  const handleOpenModal = (doctor) => {
    setSelectedDoctor({
      id: doctor.id,
      name: doctor.nombre,
      specialty: doctor.especialidad,
      office: `Consultorio ${doctor.consultorio || 'N/A'}`,
      image: 'https://via.placeholder.com/80', // Aquí va foto real del backend
    });
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  return (
    <main>
      {/* Lista de doctores */}
      <section>
        {doctores.map((doctor) => (
          <div
            key={doctor.id}
            onClick={() => handleOpenModal(doctor)}
            style={{ cursor: 'pointer' }}
          >
            <h2>{doctor.nombre}</h2>
            <p>{doctor.especialidad}</p>
          </div>
        ))}
      </section>

      {/* Modal de citas */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        doctor={selectedDoctor}
      />
    </main>
  );
}
```

## Características

### ✅ Funcionalidades Implementadas
- **Calendario Interactivo**: Navegación entre meses, selección de días disponibles
- **Horarios Dinámicos**: Vista de tarjetas modernas con estados (disponible/ocupado)
- **Información del Doctor**: Muestra nombre, especialidad y consultorio
- **Datos MOCK**: Horarios hardcodeados (prontos para integración con backend)
- **Responsive**: Funciona en desktop, tablet y mobile
- **Accesibilidad**: Focus visible, aria-labels, navegación por teclado
- **Animaciones Suaves**: Entrada/salida con transiciones CSS

### 🎨 Diseño
- Sigue la paleta de colores médica del proyecto (#2A7DE1, verde success, etc.)
- Usa variables CSS del proyecto para consistencia
- Efectos hover intuitivos en calendario y horarios
- Fondo oscuro transparente (backdrop blur)

### 🔌 Integración Actual
- **Backend**: NO integrado (usa datos MOCK)
- **API**: Pendiente de conexión
- **Confirmación**: Console.log de datos (listo para POST al backend)

## Datos MOCK Actuales

El modal incluye:
- **12 horarios diarios**: 09:00 a 16:30 (algunos ocupados, otros disponibles)
- **30 días disponibles**: Excluye fines de semana
- **Doctor por defecto**: Dr. Juan Pérez, Cardiología, Consultorio 305

## Próximas Mejoras (Backend)

Para completar la integración:

1. **Reemplazar MOCK de horarios** con API:
```jsx
const mockTimeSlots = await fetch(`/api/doctors/${doctor.id}/slots?date=${date}`)
  .then(r => r.json());
```

2. **Reemplazar MOCK de días disponibles**:
```jsx
const availableDays = await fetch(`/api/doctors/${doctor.id}/available-dates`)
  .then(r => r.json());
```

3. **Implementar confirmación de cita**:
```jsx
const handleConfirmAppointment = async () => {
  await fetch('/api/appointments', {
    method: 'POST',
    body: JSON.stringify({
      doctorId: selectedDoctor.id,
      date: selectedDate,
      time: selectedTimeSlot.time
    })
  });
};
```

## Hooks Utilizados

- `useState`: Gestión de estado local (fecha, horario seleccionado)
- `useEffect`: NO utilizado (preparado para futuras integraciones)

## Accesibilidad

- ✅ Navegación por teclado en calendario y horarios
- ✅ Focus visible en botones
- ✅ aria-label en botones de navegación
- ✅ Roles semánticos (button, article)
- ✅ Contraste suficiente de colores

## Estilos Personalizables

Todos los estilos están en `AppointmentModal.css` usando variables CSS:
- `--color-primary`: Color principal (azul médico)
- `--color-surface`: Color de fondo de componentes
- `--color-text`: Color de texto
- `--color-border`: Color de bordes
- Y más...

## Resolución de Problemas

### El modal no abre
```jsx
// Verifica que isOpen sea true
<AppointmentModal isOpen={true} {...} />
```

### Los estilos no aplican
```jsx
// Asegúrate de importar el CSS
import '../styles/AppointmentModal.css';
```

### El doctor no se muestra
```jsx
// Verifica que el objeto doctor tenga todas las propiedades
const doctor = {
  id: 1,
  name: 'Nombre',
  specialty: 'Especialidad',
  office: 'Consultorio X',
  image: 'URL válida'
};
```

## Performance

- Componente ligero (~15KB minificado)
- Renderizado condicional (no renderiza si `isOpen={false}`)
- Animaciones con CSS (no afecta performance)
- Sin dependencias externas (solo React)

## Estado del Proyecto

| Tarea | Estado | Notas |
|-------|--------|-------|
| Componente React | ✅ Completo | Funcional |
| Estilos CSS | ✅ Completo | Responsive |
| Integración Dashboard | ✅ Completo | Listo para usar |
| Backend API | ⏳ Pendiente | Próxima fase |
| Confirmación de cita | ⏳ Pendiente | Espera API |
| Fotos de doctores | ⏳ Pendiente | Usar placeholders por ahora |

---

**Último actualizado**: Mayo 10, 2026  
**Versión**: 1.0 Beta
