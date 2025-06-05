package keynest_backend.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSearchRequest {

    // Los 3 parametros de la busqueda en el panel de administracion
    Integer id;
    String email;

}
