package keynest_backend.Auth;

import keynest_backend.User.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * Clase que representa la respuesta enviada al cliente de una operación de autenticación.
 * De momento solo contiene el token de autenticación.
 */
@Data   // Lombok, genera getters y setters
@Builder    // Lombok, genera el patrón Builder
@NoArgsConstructor  // Lombok, genera un constructor sin argumentos
@AllArgsConstructor // Lombok, genera un constructor con todos los argumentos
public class AuthResponse {

    Integer userId;
    String email;
    Role role;
    String firstname;
    String lastname;
    String token;
}
