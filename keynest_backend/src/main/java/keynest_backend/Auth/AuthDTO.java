package keynest_backend.Auth;

import keynest_backend.User.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Clase que respresenta un envio de informacion para la info del user
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthDTO {

    Integer userId;
    String email;
    Role role;
    String firstname;
    String lastname;


}
