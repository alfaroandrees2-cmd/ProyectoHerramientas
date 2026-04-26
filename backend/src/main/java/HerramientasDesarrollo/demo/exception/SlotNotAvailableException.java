package HerramientasDesarrollo.demo.exception;

/**
 * Error de conflicto cuando se intenta reservar un slot no disponible.
 */
public class SlotNotAvailableException extends RuntimeException {
    public SlotNotAvailableException(String message) {
        super(message);
    }
}
