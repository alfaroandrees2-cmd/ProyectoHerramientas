package HerramientasDesarrollo.demo.dto.cita;

import java.time.LocalDate;
import java.time.LocalTime;

import HerramientasDesarrollo.demo.entity.CitaEstado;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
/**
 * DTO para exponer el historial de citas en la UI con información mínima necesaria.
 */
public class CitaHistoryResponse {
    private Long id;
    private LocalDate fecha;
    private LocalTime horaInicio;
    private String doctorNombre;
    private String especialidad;
    private String consultorio;
    private CitaEstado estado;
    private String motivo;
    private String pacienteNombre;
}
