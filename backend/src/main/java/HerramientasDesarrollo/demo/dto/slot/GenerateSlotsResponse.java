package HerramientasDesarrollo.demo.dto.slot;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
/**
 * Resultado agregado de la operación batch de generación de slots.
 */
public class GenerateSlotsResponse {
    private Long doctorId;
    private int slotsGenerados;
}
