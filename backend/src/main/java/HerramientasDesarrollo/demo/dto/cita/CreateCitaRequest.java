package HerramientasDesarrollo.demo.dto.cita;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
/**
 * Entrada para reservar una cita sobre un slot puntual.
 */
public class CreateCitaRequest {

    @NotNull(message = "slotId es obligatorio")
    private Long slotId;

    @NotBlank(message = "El motivo es obligatorio")
    @Size(max = 255, message = "El motivo no puede superar 255 caracteres")
    private String motivo;
}
