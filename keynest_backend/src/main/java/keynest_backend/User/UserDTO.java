package keynest_backend.User;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * UserDTO (Data Transfer Object) sirve como objeto intermedio para transmitir datos entre capas (frontend y backend) sin exponer directamente la entidad User.
 */

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    // Usando esta clase UserDTO decidimos que datos exponer al frontend

    Integer id;
    String email;
    String firstname;
    String lastname;
    String profilePictureUrl;


}
