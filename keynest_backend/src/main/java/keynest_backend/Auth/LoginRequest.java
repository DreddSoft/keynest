package keynest_backend.Auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


// Anotaciones de la libreria Lombok que nos limpian el codigo, permitiendo no hacer constructores y getters y setters
@Data // Permite crear getter y setter automaticos
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {

    String username;
    String email;
    String password;
}
