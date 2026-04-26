package HerramientasDesarrollo.demo.dto.horario;

import java.time.LocalTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
/**
 * Resultado de creación de horario base.
 */
public class HorarioResponse {
    private Long id;
    private Long doctorId;
    private Integer diaSemana;
    private LocalTime horaInicio;
    private LocalTime horaFin;
}
