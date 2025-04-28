package keynest_backend.Auth;

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
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
        UserDetails user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        // Generamos el token con la clase de servicio y pasando el usuario como argument
        String token = jwtService.getToken(user); // Generamos el token

        // REtornamos la respuesta (el token)
        return AuthResponse.builder()
                .token(token)
                .build();

    }

    /**
     * Método para registrar un nuevo usuario.
     * @param request - Objeto RegisterRequest que contiene los datos para crear un nuevo usuario
     * @return - AuthResponse con el token JWT (de momento)
     */
    public AuthResponse register(RegisterRequest request) {

        // Tenemos que sacar los paises, provincias y localidades
        Country country = countryRepository.findById(request.getCountryId()).orElse(null);
        Province province = provinceRepository.findById(request.getProvinceId()).orElse(null);
        Locality locality = localityRepository.findById(request.getLocalityId()).orElse(null);


        // Creamos usuario
        User user = User.builder()  // Usamos el patron de diseño Builder
                .username(request.getEmail())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) // Encriptamos la contraseña
                .role(Role.USER) // Por defecto el rol es USER
                .isActive(true) // Por defecto el usuario esta activo
                .lastLogin(LocalDateTime.now()) // Por defecto la fecha de login es ahora
                .failedAttempts(0)  // Por defecto el usuario no tiene intentos fallidos
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .birthDate(request.getBirthDate())
                .phone1(request.getPhone1())
                .phone2(request.getPhone2())
                .profilePictureUrl(null)    // Por defecto no tiene foto de perfil
                .country(country)
                .province(province)
                .locality(locality)
                .address(request.getAddress())
                .postalCode(request.getPostalCode())
                .companyId(null)
                .createdAt(LocalDateTime.now()) // Por defecto la fecha de creacion es ahora
                .updatedAt(LocalDateTime.now()) // Por defecto la fecha de actualizacion es ahora
                .language(request.getLanguage())
                .build();

        // Guardamos el usuario en la base de datos usando Hibernate y la interfaz UserRepository
        userRepository.save(user);

        // Devolvemos el token del nuevo usuario
        // TODO: cambiar el tipo de respuesta al registrar, pues no va a ser público
        return AuthResponse.builder()
                .token(jwtService.getToken(user))
                .build();
    }
}
