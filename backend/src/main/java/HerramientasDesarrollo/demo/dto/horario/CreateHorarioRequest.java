package HerramientasDesarrollo.demo.dto.horario;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
/**
 * Entrada para definir disponibilidad semanal de un médico.
 */
public class CreateHorarioRequest {

    @NotNull(message = "doctorId es obligatorio")
    private Long doctorId;

    @NotNull(message = "diaSemana es obligatorio")
    @Min(value = 1, message = "diaSemana debe estar entre 1 y 7")
    @Max(value = 7, message = "diaSemana debe estar entre 1 y 7")
    private Integer diaSemana;

    @NotNull(message = "horaInicio es obligatoria")
    private LocalTime horaInicio;

    @NotNull(message = "horaFin es obligatoria")
    private LocalTime horaFin;
}
