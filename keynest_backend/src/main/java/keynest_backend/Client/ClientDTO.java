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

    // Los datos que quiero obtener del cliente
    // Identificador
    public Integer id;

    // Nombre completo
    public String name;
    public String middleName;
    public String lastname1;
    public String lastname2;

    // Genero y fecha de nacimiento
    public String gender;
    public String birthday;

    // Nacionalidad y documentos
    public String nationality;
    public String documentType;
    public String documentNumber;
    public String documentExpirationDate;

    // CRM
    public String address;
    public String country;
    public String province;
    public String locality;
    public String postalCode;

    // Contacto
    public String email;
    public String phone;

}
