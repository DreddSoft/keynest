package keynest_backend.User;

import jakarta.transaction.Transactional;
import keynest_backend.Model.Address;
import keynest_backend.Model.Country;
import keynest_backend.Model.Locality;
import keynest_backend.Model.Province;
import keynest_backend.Repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final LocalityRepository localityRepository;
    private final PasswordEncoder passwordEncoder; // Inyeccion de dependencias, Spring se encarga de crear la instancia

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



    //* Metodos auxiliares
    private boolean isNotEmpty(String value) {
        return value != null && !value.trim().isEmpty();
    }





}
