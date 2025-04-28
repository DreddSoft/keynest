package keynest_backend.User;

import jakarta.transaction.Transactional;
import keynest_backend.Model.Country;
import keynest_backend.Model.Locality;
import keynest_backend.Model.Province;
import keynest_backend.Repositories.CountryRepository;
import keynest_backend.Repositories.LocalityRepository;
import keynest_backend.Repositories.ProvinceRepository;
import keynest_backend.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // Inyeccion de dependencias, Spring se encarga de crear la instancia
    private final CountryRepository countryRepository;
    private final ProvinceRepository provinceRepository;
    private final LocalityRepository localityRepository;

    @Transactional
    public UserResponse updateUser(UserRequest userRequest) {


        // Obtenemos las entiudades
        Country country = countryRepository.findById(userRequest.getCountryId()).orElse(null);
        Province province = provinceRepository.findById(userRequest.getProvinceId()).orElse(null);
        Locality locality = localityRepository.findById(userRequest.getLocalityId()).orElse(null);

        // TODO: Temporal, porque nunca van a ser nulos por que seran un select required
        if (country == null || province == null || locality == null) {
            return new UserResponse("Error: pais, provincia o localidad no encontrados.");
        }


        User user = User.builder()
                .id(userRequest.getId())
                .username(userRequest.getEmail())
                .email(userRequest.getEmail())
                .password(passwordEncoder.encode(userRequest.password))
                .firstname(userRequest.getFirstname())
                .lastname(userRequest.getLastname())
                .phone1(userRequest.getPhone1())
                .phone2(userRequest.getPhone2())
                .profilePictureUrl(userRequest.getProfilePictureUrl())
                .country(country)
                .province(province)
                .locality(locality)
                .address(userRequest.getAddress())
                .postalCode(userRequest.getPostalCode())
                .companyId(userRequest.getCompanyId())
                .updatedAt(LocalDateTime.now())
                .language(userRequest.getLanguage())
                .build();


        userRepository.updateUser(user.getId(), user.getUsername(), user.getEmail(), user.getPassword(), user.getFirstname(), user.getLastname(), user.getBirthDate(), user.getPhone1(), user.getPhone2(), user.getProfilePictureUrl(), user.getCountry(), user.getProvince(), user.getLocality(), user.getAddress(), user.getPostalCode(), user.getCompanyId(), user.getUpdatedAt(), user.getLanguage());

        return new UserResponse("El usuario ha sido actualizado correctamente.");

    }

    public UserDTO getUser(Integer id) {

        User user = userRepository.findById(id).orElse(null);

        if (user != null) {

            UserDTO userDTO = UserDTO.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .firstname(user.getFirstname())
                    .lastname(user.getLastname())
                    .phone1(user.getPhone1())
                    .phone2(user.getPhone2())
                    .profilePictureUrl(user.getProfilePictureUrl())
                    .countryName(user.getCountry().getName())
                    .provinceName(user.getProvince().getName())
                    .localityName(user.getLocality().getName())
                    .address(user.getAddress())
                    .postalCode(user.getPostalCode())
                    .companyId(user.getCompanyId())
                    .language(user.getLanguage())
                    .build();

            return userDTO;
        }

        return null;
    }

    /*
    public UserDTO getUserInfo(Integer userId) {
        return userRepository.getAllInfoFromUser(userId);
    }
    */




}
