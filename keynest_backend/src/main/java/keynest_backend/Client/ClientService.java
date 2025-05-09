package keynest_backend.Client;

import keynest_backend.Model.Client;
import keynest_backend.Model.Country;
import keynest_backend.Model.Locality;
import keynest_backend.Model.Province;
import keynest_backend.Repositories.*;
import keynest_backend.User.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final CountryRepository countryRepository;
    private final ProvinceRepository provinceRepository;
    private final LocalityRepository localityRepository;

    // Metodo para crear un Cliente (el check-In o pre-checkIn)
    public String createNewClient(ClientCreateRequest request) {

        // Sacar el usuario
        User creator =  userRepository.findById(request.getCreatorUserId()).orElseThrow();

        // Sacar datos de nacionalidad y paises
        Country nationality = countryRepository.findById(request.getNationalityId()).orElseThrow();
        Country country = countryRepository.findById(request.getCountryId()).orElse(null);
        Province province = provinceRepository.findById(request.getProvinceId()).orElse(null);
        Locality locality = localityRepository.findById(request.getLocalityId()).orElse(null);

        Gender gender;

        // Sacar el genero
        switch (request.getGender()) {
            case 0:
                gender = Gender.MALE;
                break;
            case 1:
                gender = Gender.FEMALE;
                break;
            case 2:
                gender = Gender.OTHER;
                break;
            default:
                gender = Gender.UNSPECIFIED;
                break;

        }

        // Sacar la fechad de nacimiento
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate birthday = LocalDate.parse(request.getBirthday(), formatter);

        // Sacar el tipo de documento
        DocumentTypes docType;
        switch (request.getDocumentType()) {
            case 0:
                docType = DocumentTypes.DNI;
                break;
            case 1:
                docType = DocumentTypes.NIE;
                break;
            default:
                docType = DocumentTypes.PASSPORT;
                break;

        }

        // Fecha de issue y expiracion del documento
        LocalDate issueDate = LocalDate.parse(request.getDocumentIssueDate(), formatter);
        LocalDate expireDate = LocalDate.parse(request.getOdcumentExpirationDate(), formatter);

        // Creamos el cliente
        Client newClient = Client.builder()
                // Nombre completo
                .name(request.getName())
                .middleName(request.getMiddleName())
                .lastname1(request.getLastname1())
                .lastname2(request.getLastname2())
                // Genero y fecha de nacimiento
                .gender(gender)
                .birthday(birthday)
                // Nacionalidad y documentos
                .nationality(nationality)
                .documentType(docType)
                .documentNumber(request.getDocumentNumber())
                .documentSupportNumber(request.getDocumentSupportNumber())
                .documentIssueDate(issueDate)
                .documentExpirationDate(expireDate)
                // CRM
                .address(request.getAddress())
                .country(country)
                .province(province)
                .locality(locality)
                .postalCode(request.getPostalCode())
                // Contacto
                .email(request.getEmail())
                .phone(request.getPhone())
                .isEmailVerified(false) // Por defecto en la creacion como falso
                .isPhoneVerified(false)
                // Auditoria
                .createdBy(creator)
                .createdAt(LocalDateTime.now())
                .updatedBy(creator)
                .updatedAt(LocalDateTime.now())
                .isActive(true)
                .build();

        clientRepository.save(newClient);

        return "Usuario creado correctamente.";

    }

}
