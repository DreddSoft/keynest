package keynest_backend.User;

import jakarta.transaction.Transactional;
import keynest_backend.Model.Locality;
import keynest_backend.Model.Province;
import keynest_backend.Repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final LocalityRepository localityRepository;
    private final PasswordEncoder passwordEncoder; // Inyeccion de dependencias, Spring se encarga de crear la instancia
    private final ProvinceRepository provinceRepository;
    private final CountryRepository countryRepository;

    // Este metodo corresponde a la funcion modificar por parte del usuario (USER)
    @Transactional
    public UserResponse updateUser(UserRequest userRequest) {

        // Sacar el usuario a modificar
        User user = userRepository.findById(userRequest.getId()).orElse(null);
        Locality locality = localityRepository.findById(userRequest.getLocalityId()).orElse(null);
        if (user == null) return new UserResponse("Usuario no encontrado.");
        if (!user.isActive()) return new UserResponse("Usuario inactivo. Si quiere editarlo, activelo primero.");

        // Modificamos los campos que llegan del request
        //* Autenticacion
        if (isNotEmpty(userRequest.getEmail()))
            user.setEmail(userRequest.getEmail());
        if (isNotEmpty(userRequest.getPassword()))
            user.setPassword(userRequest.getPassword());

        //* Data
        if (isNotEmpty(userRequest.getFirstname()))
            user.setFirstname(userRequest.getFirstname());
        if (isNotEmpty(userRequest.getLastname()))
            user.setLastname(userRequest.getLastname());
        if (userRequest.getBirthDate() != null && !userRequest.getBirthDate().toString().isEmpty())
            user.setBirthDate(userRequest.getBirthDate());
        if (isNotEmpty(userRequest.getPhone()))
            user.setPhone(userRequest.getPhone());
        if (isNotEmpty(userRequest.getProfilePictureUrl()))
            user.setProfilePictureUrl(userRequest.getProfilePictureUrl());

        //* GEO
        if (locality != null)
            user.setLocality(locality);
        if(isNotEmpty(userRequest.getAddress()))
            user.setAddress(user.getAddress());
        if(isNotEmpty(userRequest.getPostalCode()))
            user.setPostalCode(userRequest.getPostalCode());

        //* Auditoria
        user.setUpdatedAt(LocalDateTime.now());

        // guardamos los cambios
        userRepository.save(user);

        return new UserResponse("El usuario ha sido actualizado correctamente.");

    }

    public UserDTO getUser(Integer id) {

        User user = userRepository.findById(id).orElse(null);

        if (user != null && user.isActive()) {

            UserDTO userDTO = UserDTO.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .firstname(user.getFirstname())
                    .lastname(user.getLastname())
                    .profilePictureUrl(user.getProfilePictureUrl())
                    .build();

            return userDTO;
        }

        return null;
    }

    /**
     * Metodo para buscar un usuario desde el panel de adminstracion en base al id o el nombre y el apellido
     * @return userAdminDTO | Devuelve un DTO con los datos del usuario para imprimirlos por pantalla
     */
    public UserAdminDTO searchUser (UserSearchRequest request) {

        User base = null;

        // Primer checkeamos que este el id o no
        if (request.getId() != null) {
            // Si es diferente de null
            // Hacemos la busqueda por ID
            base = userRepository.findById(request.getId()).orElseThrow(() -> new IllegalArgumentException("UserService | searchUser | No se ha encontrado el usuario."));
        } else { // hacemos la busqueda por email
            base = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new IllegalArgumentException("UserService | searchUser | No se ha encontrado el usuario."));
        }



        // Devolvemos el DTO
        return UserAdminDTO.builder()
                .id(base.getId())
                .email(base.getEmail())
                .role(base.getRole().toString())
                .firstname(base.getFirstname())
                .lastname(base.getLastname())
                .birthDate(base.getBirthDate())
                .phone(base.getPhone())
                .profilePictureUrl(base.getProfilePictureUrl())
                .locality(base.getLocality().getName())
                .province(base.getLocality().getProvince().getName())
                .country(base.getLocality().getProvince().getCountry().getName())
                .address(base.getAddress())
                .postalCode(base.getPostalCode())
                .build();

    }



    //* Metodos auxiliares
    private boolean isNotEmpty(String value) {
        return value != null && !value.trim().isEmpty();
    }





}
