package keynest_backend.Client;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientDTO {

    //* Identificación y autenticación
    private Integer id;

    //* Data principal
    private String name;
    private String middleName;
    private String lastname;
    private String gender;
    private String birthday;

    //* Nacionalidad y documentos
    private String nationality;
    private String docType;
    private String docNumber;
    private String docIssueDate;
    private String docExpirationDate;

    //* Contacto
    private String email;
    private String phone;

}
