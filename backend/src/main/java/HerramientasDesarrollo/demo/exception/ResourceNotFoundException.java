package HerramientasDesarrollo.demo.exception;

/**
 * Señala que una entidad requerida para la operación no existe.
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
