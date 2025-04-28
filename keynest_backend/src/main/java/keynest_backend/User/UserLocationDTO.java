package keynest_backend.User;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserLocationDTO {

    private String username;
    private String firstname;
    private String lastname;
    private String countryName;
    private String provinceName;
    private String localityName;

}
