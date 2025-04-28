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

    Integer id;
    String email;
    String password;
    String firstname;
    String lastname;
    Date birthDate;
    String phone1;
    String phone2;
    String profilePictureUrl;

    int countryId;
    int provinceId;
    int localityId;
    String address;
    String postalCode;

    Integer companyId;

    String language;


}
