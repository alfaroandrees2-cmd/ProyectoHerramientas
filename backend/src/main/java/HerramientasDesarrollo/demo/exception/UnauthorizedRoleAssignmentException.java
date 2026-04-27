package HerramientasDesarrollo.demo.exception;

/**
 * Indica intento de asignar roles privilegiados sin permisos administrativos.
 */
public class UnauthorizedRoleAssignmentException extends RuntimeException {
    public UnauthorizedRoleAssignmentException(String message) {
        super(message);
    }
}
