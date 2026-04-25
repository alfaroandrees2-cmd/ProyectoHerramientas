package HerramientasDesarrollo.demo.dto.slot;

import HerramientasDesarrollo.demo.entity.SlotEstado;
import java.time.LocalTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
/**
 * Proyección de un slot para visualización diaria de agenda.
 */
public class DoctorSlotResponse {
    private Long id;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private SlotEstado estado;
}
