package HerramientasDesarrollo.demo.repository;

import HerramientasDesarrollo.demo.entity.Cita;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Persistencia de reservas y validación de unicidad por slot.
 */
public interface CitaRepository extends JpaRepository<Cita, Long> {
    boolean existsBySlotId(Long slotId);
}
