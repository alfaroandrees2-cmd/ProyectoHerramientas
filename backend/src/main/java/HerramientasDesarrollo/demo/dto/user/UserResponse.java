package HerramientasDesarrollo.demo.dto.user;

import HerramientasDesarrollo.demo.entity.Role;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponse {
    private Long id;
    private String nombre;
    private String email;
    private Role rol;
    private LocalDateTime createdAt;
}
