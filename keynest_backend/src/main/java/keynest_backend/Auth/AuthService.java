package keynest_backend.Auth;

import keynest_backend.Exceptions.ErrorGeoDataException;
import keynest_backend.Jwt.JwtService;
import keynest_backend.Model.Country;
import keynest_backend.Model.Locality;
import keynest_backend.Model.Province;
import keynest_backend.Repositories.CountryRepository;
import keynest_backend.Repositories.LocalityRepository;
import keynest_backend.Repositories.ProvinceRepository;
import keynest_backend.User.Role;
import keynest_backend.User.User;
import keynest_backend.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.ErrorResponseException;

import java.time.LocalDateTime;


/**
 * Servicio encargado de gestionar la autenticación de usuarios.
 * Proporciona métodos login y registro.
 */
@Service    // Notacion que indica a Spring que es una clase de servicio
@RequiredArgsConstructor    // Notacion de Lombok que genera un constructor con todos los argumentos requeridos
public class AuthService {

    private final UserRepository userRepository; // Inyeccion de dependencias, Spring se encarga de crear la instancia
    private final JwtService jwtService; // Inyeccion de dependencias, Spring se encarga de crear la instancia
    private final PasswordEncoder passwordEncoder; // Inyeccion de dependencias, Spring se encarga de crear la instancia
    private final AuthenticationManager authenticationManager; // Inyeccion de dependencias, Spring se encarga de crear la instancia
    private final CountryRepository countryRepository;
    private final ProvinceRepository provinceRepository;
    private final LocalityRepository localityRepository;

    /**
     * Méttodo para iniciar sesión,
     * @param request - EL objeto LoginRequest que contiene los datos de inicio de sesión
     * @return - Un objeto AuthResponse que contiene el token de autenticación
     */
    public AuthResponse login(LoginRequest request) {

        // Autenticacmos al usuario con el AuthenticationManager
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        // Buscamos el usuario en la base de datos
        // Usamos UserDetails porque la clase User extiende de UserDetails
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        // Actualizamos el lastLogin
        user.setLastLogin(LocalDateTime.now());

        // Generamos el token con la clase de servicio y pasando el usuario como argument
        String token = jwtService.getToken(user); // Generamos el token

        // REtornamos la respuesta (el token)
        return AuthResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .token(token)
                .build();

    }

    /**
     * Método para registrar un nuevo usuario.
     * @param request - Objeto RegisterRequest que contiene los datos para crear un nuevo usuario
     * @return - AuthResponse con el token JWT (de momento)
     */
    public User register(RegisterRequest request) throws ErrorGeoDataException {

        // Tenemos que sacar los paises, provincias y localidades
        Country country = countryRepository.findById(request.getCountryId()).orElseThrow(() -> new ErrorGeoDataException("Error en el pais al registrar Usuario."));
        Province province = provinceRepository.findById(request.getProvinceId()).orElseThrow(() -> new ErrorGeoDataException("Error en la provincia al registrar Usuario."));
        Locality locality = localityRepository.findById(request.getLocalityId()).orElseThrow(() -> new ErrorGeoDataException("Error en la localidad al registrar Usuario."));
        User creator = userRepository.findById(request.getCreatorId()).orElse(null);

        // Creamos usuario
        User user = User.builder()  // Usamos el patron de diseño Builder
                // Data principal
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) // Encriptamos la contraseña
                .role(Role.USER) // Por defecto el rol es USER
                // Informacion personal
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .birthDate(request.getBirthDate())
                .phone1(request.getPhone1())
                .phone2(request.getPhone2())
                .profilePictureUrl(null)    // Por defecto no tiene foto de perfil
                // GEO Data
                .country(country)
                .province(province)
                .locality(locality)
                .address(request.getAddress())
                .postalCode(request.getPostalCode())
                // Company Data
                .isCompany(false)
                .companyId(null)
                // Auditoria
                .createdAt(LocalDateTime.now()) // Por defecto la fecha de creacion es ahora
                .createdBy(creator)
                .updatedAt(LocalDateTime.now()) // Por defecto la fecha de actualizacion es ahora
                .updatedBy(creator)
                .language(request.getLanguage())
                .lastLogin(null)
                .isActive(true)
                .build();

        // Guardamos el usuario en la base de datos usando Hibernate y la interfaz UserRepository
        userRepository.save(user);

        // Devolvemos el token del nuevo usuario
        // TODO: cambiar el tipo de respuesta al registrar, pues no va a ser público
        if (user == null) {
            return null;
        }

        return user;
    }
}
