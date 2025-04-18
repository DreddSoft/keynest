package keynest_backend.Auth;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    // Atributos para el register
    private String email;
    private String password;

    // Informacion Personal
    private String firstname;
    private String lastname;
    private Date birthDate;
    private String phone1;
    private String phone2;

    // Contacto y localizacion
    private int countryId;
    private int provinceId;
    private int localityId;
    private String address;
    private String postalCode;

    // Datos del sistema
    private String language;
}
