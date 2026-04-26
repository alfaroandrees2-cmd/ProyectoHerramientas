package HerramientasDesarrollo.demo.service;

import HerramientasDesarrollo.demo.dto.doctor.DoctorListResponse;
import HerramientasDesarrollo.demo.dto.slot.DoctorSlotResponse;
import HerramientasDesarrollo.demo.entity.Doctor;
import HerramientasDesarrollo.demo.entity.Especialidad;
import HerramientasDesarrollo.demo.entity.Slot;
import HerramientasDesarrollo.demo.entity.SlotEstado;
import HerramientasDesarrollo.demo.repository.DoctorRepository;
import HerramientasDesarrollo.demo.repository.SlotRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
/**
 * Expone proyecciones de doctores orientadas a consulta pública y agenda diaria.
 */
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final SlotRepository slotRepository;

    @Transactional(readOnly = true)
    public List<DoctorListResponse> listDoctors(String search, String especialidad) {
        List<Doctor> doctors = doctorRepository.findForListing(search, especialidad);

        return doctors.stream()
                .map(this::toDoctorListResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DoctorSlotResponse> getDoctorSlotsByDate(Long doctorId, LocalDate date) {
        List<Slot> slots = slotRepository.findByDoctorIdAndFechaOrderByHoraInicioAsc(doctorId, date);
        return slots.stream()
                .map(slot -> DoctorSlotResponse.builder()
                        .id(slot.getId())
                        .horaInicio(slot.getHoraInicio())
                        .horaFin(slot.getHoraFin())
                        .estado(slot.getEstado())
                        .build())
                .toList();
    }

    private DoctorListResponse toDoctorListResponse(Doctor doctor) {
        Slot nextSlot = findNextAvailableSlot(doctor.getId());
                // Se concatena en una cadena única para simplificar renderizado en tarjetas de listado.
        String especialidadTexto = doctor.getEspecialidades().stream()
                .map(Especialidad::getNombre)
                .sorted()
                .collect(Collectors.joining(", "));

        return DoctorListResponse.builder()
                .id(doctor.getId())
                .nombre(doctor.getNombre() + " " + doctor.getApellido())
                .especialidad(especialidadTexto)
                .experiencia(doctor.getExperienciaAnios())
                .consultorio(doctor.getConsultorio())
                .foto(doctor.getFotoUrl())
                .proximaFechaDisponible(nextSlot != null ? nextSlot.getFecha() : null)
                .proximaHoraDisponible(nextSlot != null ? nextSlot.getHoraInicio() : null)
                .estado(nextSlot != null ? "DISPONIBLE" : "SIN_DISPONIBILIDAD")
                .build();
    }

    private Slot findNextAvailableSlot(Long doctorId) {
        List<Slot> available = slotRepository.findByDoctorIdAndEstadoAndFechaGreaterThanEqualOrderByFechaAscHoraInicioAsc(
                doctorId,
                SlotEstado.DISPONIBLE,
                LocalDate.now()
        );

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        // Si no hay slots futuros estrictos, se devuelve el primero disponible como fallback funcional.
        return available.stream()
                .filter(s -> s.getFecha().isAfter(today) || !s.getHoraInicio().isBefore(now))
                .findFirst()
                .orElse(available.isEmpty() ? null : available.getFirst());
    }
}
