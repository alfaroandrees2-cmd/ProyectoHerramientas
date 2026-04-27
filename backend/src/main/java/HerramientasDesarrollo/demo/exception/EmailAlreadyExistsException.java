package HerramientasDesarrollo.demo.exception;

/**
 * Se lanza cuando una operación de alta intenta reutilizar un email existente.
 */
public class EmailAlreadyExistsException extends RuntimeException {
    public EmailAlreadyExistsException(String message) {
        super(message);
    }
}
