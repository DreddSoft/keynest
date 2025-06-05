package keynest_backend.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAdminDTO {

    Integer id;

    String email;
    String role;

    String firstname;
    String lastname;
    Date birthDate;
    String phone;
    String profilePictureUrl;

    String locality;
    String province;
    String country;
    String address;
    String postalCode;
}
