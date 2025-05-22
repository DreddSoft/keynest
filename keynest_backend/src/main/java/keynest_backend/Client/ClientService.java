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
    private final LocalityRepository localityRepository;
    private final ProvinceRepository provinceRepository;
    private final CountryRepository countryRepository;

    // Metodo para crear un Cliente (el check-In o pre-checkIn)
    public String createNewClient(ClientCreateRequest request) {

        // Sacar el usuario
        User creator =  userRepository.findById(request.getCreatorUserId()).orElseThrow(() -> new IllegalArgumentException("createNewClient - Usuario creador no encontrado."));

        // Sacar datos de nacionalidad y paises
        Country nationality = countryRepository.findById(request.getNationalityCountryId()).orElseThrow(() -> new IllegalArgumentException("createNewClient - Pais de nacionalidad no encontrado."));

        Locality locality = localityRepository.findById(request.getLocalityId()).orElseThrow(() -> new IllegalArgumentException("createNewClient - Localidad no encontrada."));

        int genderPick = request.getGender();
        Gender gender;

        // Sacar el genero
        switch (genderPick) {
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
        switch (request.getDocType()) {
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
        LocalDate issueDate = LocalDate.parse(request.getDocIssueDate(), formatter);
        LocalDate expireDate = LocalDate.parse(request.getDocExpirationDate(), formatter);

        // Creamos el cliente
        Client newClient = Client.builder()
                //* Datos
                .name(request.getName())
                .lastname(request.getLastname())
                .gender(gender)
                .birthday(birthday)
                //* Docs info
                .nationality(nationality.getName())
                .docType(docType)
                .docNumber(request.getDocNumber())
                .docSupportNumber(request.getDocSupportNumber())
                .docIssueDate(issueDate)
                .docExpirationDate(expireDate)
                //* GEO
                .locality(locality)
                .address(request.getAddress())
                .postalCode(request.getPostalCode())
                //* Contacto
                .email(request.getEmail())
                .phone(request.getPhone())
                .notes(request.getNotes())
                //* Auditoria
                .createdBy(creator)
                .createdAt(LocalDateTime.now())
                .updatedBy(creator)
                .updatedAt(LocalDateTime.now())
                .isActive(true)
                .build();

        clientRepository.save(newClient);

        return "Usuario creado correctamente.";

    }

    public ClientDTO getClient(Integer id) {

        // Buscamos el cliente
        Client client = clientRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("getClient - Cliente no encontrado."));

        // Sacamos los datos GEO
        Locality locality = localityRepository.findById(client.getLocality().getId()).orElseThrow(() -> new IllegalArgumentException("getClient - Localidad no encontrada."));
        Province province = provinceRepository.findById(locality.getProvince().getId()).orElseThrow(() -> new IllegalArgumentException("getClient - Provincia no encontrada."));
        Country country = countryRepository.findById(province.getCountry().getId()).orElseThrow(() -> new IllegalArgumentException("getClient - Pais no encontrado."));

        // Creamos el clienteDTO
            return ClientDTO.builder()
                    //* Identificación y autenticación
                    .id(client.getId())
                    //* Data principal
                    .name(client.getName())
                    .lastname(client.getLastname())
                    .gender(client.getGender().name())
                    .birthday(client.getBirthday().toString())
                    //* Nacionalidad y documentos
                    .nationality(client.getNationality())
                    .docType(client.getDocType().name())
                    .docNumber(client.getDocNumber())
                    .docIssueDate(client.getDocIssueDate().toString())
                    .docExpirationDate(client.getDocExpirationDate().toString())
                    //* GEO
                    .localityName(locality.getName())
                    .provinceName(province.getName())
                    .countryName(country.getName())
                    .address(client.getAddress())
                    .postalCode(client.getPostalCode())
                    //* Contacto
                    .email(client.getEmail())
                    .phone(client.getPhone())
                    .build();

    }

}
