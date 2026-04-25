package HerramientasDesarrollo.demo.dto.auth;

import HerramientasDesarrollo.demo.dto.user.UserResponse;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthResponse {
    private String token;
    private String tokenType;
    private UserResponse user;
}
