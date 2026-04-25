package HerramientasDesarrollo.demo.dto.auth;

import HerramientasDesarrollo.demo.dto.user.UserResponse;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
/**
 * Respuesta estandar de autenticación con token y datos básicos del usuario.
 */
public class AuthResponse {
    private String token;
    private String tokenType;
    private UserResponse user;
}
