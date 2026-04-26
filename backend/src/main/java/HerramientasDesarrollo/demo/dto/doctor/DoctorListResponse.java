package HerramientasDesarrollo.demo.dto.doctor;

import java.time.LocalDate;
import java.time.LocalTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
/**
 * Proyección ligera para listado de doctores con próxima disponibilidad.
 */
public class DoctorListResponse {
    private Long id;
    private String nombre;
    private String especialidad;
    private Integer experiencia;
    private String consultorio;
    private String foto;
    private LocalDate proximaFechaDisponible;
    private LocalTime proximaHoraDisponible;
    private String estado;
}
