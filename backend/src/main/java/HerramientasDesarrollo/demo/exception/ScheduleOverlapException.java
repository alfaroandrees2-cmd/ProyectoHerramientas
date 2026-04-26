package HerramientasDesarrollo.demo.exception;

/**
 * Error de negocio para bloques horarios que se superponen en un mismo doctor/día.
 */
public class ScheduleOverlapException extends RuntimeException {
    public ScheduleOverlapException(String message) {
        super(message);
    }
}
