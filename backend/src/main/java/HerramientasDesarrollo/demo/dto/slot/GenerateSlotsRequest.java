package HerramientasDesarrollo.demo.dto.slot;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
/**
 * Parámetros de generación masiva de slots para un médico en un intervalo de fechas.
 */
public class GenerateSlotsRequest {

    @NotNull(message = "doctorId es obligatorio")
    private Long doctorId;

    @NotNull(message = "fechaInicio es obligatoria")
    private LocalDate fechaInicio;

    @NotNull(message = "fechaFin es obligatoria")
    private LocalDate fechaFin;
}
