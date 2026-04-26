package HerramientasDesarrollo.demo.repository;

import HerramientasDesarrollo.demo.entity.HorarioBase;
import java.time.LocalTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Persistencia de plantillas semanales y validaciones de superposición horaria.
 */
public interface HorarioBaseRepository extends JpaRepository<HorarioBase, Long> {

    List<HorarioBase> findByDoctorId(Long doctorId);

    boolean existsByDoctorIdAndDiaSemanaAndHoraInicioLessThanAndHoraFinGreaterThan(
            Long doctorId,
            Integer diaSemana,
            LocalTime horaFin,
            LocalTime horaInicio
    );
}
