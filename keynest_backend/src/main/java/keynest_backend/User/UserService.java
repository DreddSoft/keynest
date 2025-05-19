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
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

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

        // Sacar el usuario a modificar
        User user = userRepository.findById(userRequest.getId()).orElse(null);
        if (user == null) return new UserResponse("Usuario no encontrado.");


        // GEO y updater
        Country country = countryRepository.findById(userRequest.getCountryId()).orElse(null);
        Province province = provinceRepository.findById(userRequest.getProvinceId()).orElse(null);
        Locality locality = localityRepository.findById(userRequest.getLocalityId()).orElse(null);
        User updaterUser = userRepository.findById(userRequest.getUpdaterId()).orElse(null);
        if (updaterUser == null)
            return new UserResponse("Usuario actualizador no parametrizado.");

        // Modificamos los campos que llegan del request
        //* Identificacion y autenticacion
        if (isNotEmpty(userRequest.getEmail()))
            user.setEmail(userRequest.getEmail());
        if (isNotEmpty(userRequest.getPassword()))
            user.setPassword(userRequest.getPassword());

        //* Informacion personal
        if (isNotEmpty(userRequest.getFirstname()))
            user.setFirstname(userRequest.getFirstname());
        if (isNotEmpty(userRequest.getLastname()))
            user.setLastname(userRequest.getLastname());
        if (userRequest.getBirthDate() != null && !userRequest.getBirthDate().toString().isEmpty())
            user.setBirthDate(userRequest.getBirthDate());
        if (isNotEmpty(userRequest.getPhone1()))
            user.setPhone1(userRequest.getPhone1());
        if (isNotEmpty(userRequest.getPhone2()))
            user.setPhone2(userRequest.getPhone2());
        if (isNotEmpty(userRequest.getProfilePictureUrl()))
            user.setProfilePictureUrl(userRequest.getProfilePictureUrl());

        //* GEO Data
        if (country != null)
            user.setCountry(country);
        if (province != null)
            user.setProvince(province);
        if (locality != null)
            user.setLocality(locality);
        if (isNotEmpty(userRequest.getAddress()))
            user.setAddress(userRequest.getAddress());
        if (isNotEmpty(userRequest.getPostalCode()))
            user.setPostalCode(userRequest.getPostalCode());

        //* Auditoria
        if (isNotEmpty(userRequest.getLanguage()))
            user.setLanguage(user.getLanguage());
        user.setUpdatedAt(LocalDateTime.now());
        user.setUpdatedBy(updaterUser);

        // guardamos los cambios
        userRepository.save(user);

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



    //* Metodos auxiliares
    private boolean isNotEmpty(String value) {
        return value != null && !value.trim().isEmpty();
    }





}
