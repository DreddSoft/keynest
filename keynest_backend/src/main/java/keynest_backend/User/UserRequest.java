package keynest_backend.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {

    //* Identificación y autenticación
    Integer id;

    //* Data principal
    String email;

    //* Informacion personal
    String firstname;
    String lastname;
    Date birthDate;
    String phone;
    String profilePictureUrl;

    //* GEO Data
    Integer localityId;
    String address;
    String postalCode;


}
