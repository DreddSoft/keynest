package keynest_backend.Client;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientCreateRequest {

    // Id del usuario que crea
    private Integer creatorUserId;

    // Aqui tengo que pensar como pasar los datos del cliente en JSON o form
    private String name;
    private String middleName;
    private String lastname1, lastname2;

    // Genero y fecha de nacimiento
    // El genero lo voy a tratar en el request como un control de 0 a 3
    // 0 - Male
    // 1 - Female
    // 2 - Other
    // 3 - Unspecified
    private int gender;
    private String birthday;

    // Nacionalidad y documentos
    private int nationalityId;
    private int documentType;
    private String documentNumber;
    private String documentSupportNumber;
    private String documentIssueDate;
    private String odcumentExpirationDate;

    // Datos de direccion para CRM, estos seran opcionales en el form de checkin
    private String address;
    private int countryId;
    private int provinceId;
    private int localityId;
    private String postalCode;

    // Contact details
    private String email;
    private String phone;

}
