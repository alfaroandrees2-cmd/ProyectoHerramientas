package HerramientasDesarrollo.demo.service;

import HerramientasDesarrollo.demo.dto.slot.GenerateSlotsRequest;
import HerramientasDesarrollo.demo.dto.slot.GenerateSlotsResponse;
import HerramientasDesarrollo.demo.entity.Doctor;
import HerramientasDesarrollo.demo.entity.HorarioBase;
import HerramientasDesarrollo.demo.entity.Slot;
import HerramientasDesarrollo.demo.entity.SlotEstado;
import HerramientasDesarrollo.demo.exception.ResourceNotFoundException;
import HerramientasDesarrollo.demo.repository.DoctorRepository;
import HerramientasDesarrollo.demo.repository.HorarioBaseRepository;
import HerramientasDesarrollo.demo.repository.SlotRepository;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
/**
 * Genera disponibilidad operativa (slots) a partir de la configuración base de horarios.
 */
public class SlotService {

    private static final int SLOT_MINUTES = 30;

    private final DoctorRepository doctorRepository;
    private final HorarioBaseRepository horarioBaseRepository;
    private final SlotRepository slotRepository;

    @Transactional
    public GenerateSlotsResponse generarSlots(GenerateSlotsRequest request) {
        if (request.getFechaInicio().isAfter(request.getFechaFin())) {
            throw new IllegalArgumentException("fechaInicio no puede ser mayor que fechaFin");
        }

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor no encontrado"));

        List<HorarioBase> horarios = horarioBaseRepository.findByDoctorId(request.getDoctorId());
        if (horarios.isEmpty()) {
            throw new IllegalStateException("El doctor no tiene horarios base configurados");
        }

        List<Slot> toSave = new ArrayList<>();

        for (LocalDate date = request.getFechaInicio(); !date.isAfter(request.getFechaFin()); date = date.plusDays(1)) {
            int diaSemana = mapToApiDay(date.getDayOfWeek());
            for (HorarioBase horario : horarios) {
                if (!horario.getDiaSemana().equals(diaSemana)) {
                    continue;
                }
                // Fragmenta cada bloque horario en segmentos atómicos de 30 minutos.
                buildSlotsForDate(doctor, date, horario.getHoraInicio(), horario.getHoraFin(), toSave);
            }
        }

        slotRepository.saveAll(toSave);

        return GenerateSlotsResponse.builder()
                .doctorId(doctor.getId())
                .slotsGenerados(toSave.size())
                .build();
    }

    private void buildSlotsForDate(Doctor doctor, LocalDate date, LocalTime start, LocalTime end, List<Slot> toSave) {
        LocalTime current = start;
        while (!current.plusMinutes(SLOT_MINUTES).isAfter(end)) {
            // Evita duplicados si la generación se ejecuta más de una vez sobre el mismo rango.
            if (!slotRepository.existsByDoctorIdAndFechaAndHoraInicio(doctor.getId(), date, current)) {
                Slot slot = new Slot();
                slot.setDoctor(doctor);
                slot.setFecha(date);
                slot.setHoraInicio(current);
                slot.setHoraFin(current.plusMinutes(SLOT_MINUTES));
                slot.setEstado(SlotEstado.DISPONIBLE);
                toSave.add(slot);
            }
            current = current.plusMinutes(SLOT_MINUTES);
        }
    }

    private int mapToApiDay(DayOfWeek dayOfWeek) {
        return dayOfWeek.getValue();
    }
}
