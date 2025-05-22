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
    Integer id;

    //* Data principal
    String name;
    String lastname;
    String gender;
    String birthday;

    //* Nacionalidad y documentos
    String nationality;
    String docType;
    String docNumber;
    String docIssueDate;
    String docExpirationDate;

    //* GEO
    String localityName;
    String provinceName;
    String countryName;
    String address;
    String postalCode;

    //* Contacto
    String email;
    String phone;



}
