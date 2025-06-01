package keynest_backend.Auth;

import jakarta.servlet.http.HttpServletResponse;
import keynest_backend.Exceptions.ErrorGeoDataException;
import keynest_backend.Jwt.JwtService;
import keynest_backend.Logs.Log;
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
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
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

        // Log
        //Log.write(user.getId(), "Auth", "Inicio de sesión.");

        // Generamos el token con la clase de servicio y pasando el usuario como argument
        String token = jwtService.getToken(user); // Generamos el token

        // Log
        //Log.write(user.getId(), "Auth", "Inicio de sesión. Ha generado el token.");

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
        Locality locality = localityRepository.findById(request.getLocalityId()).orElseThrow(() -> new ErrorGeoDataException("Error en la localidad al registrar Usuario."));
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
                .phone(request.getPhone())
                .profilePictureUrl(null)    // Por defecto no tiene foto de perfil
                // GEO Data
                .locality(locality)
                .address(request.getAddress())
                .postalCode(request.getPostalCode())
                // Company Data
                .isCompany(false)
                // Auditoria
                .createdAt(LocalDateTime.now()) // Por defecto la fecha de creacion es ahora
                .updatedAt(LocalDateTime.now()) // Por defecto la fecha de actualizacion es ahora
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

    /**
     * Método para logout
     */
    public void logout(HttpServletResponse response, Integer userId){

        // Sobreescribimos la cookiea tiempo 0
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .secure(true)
                .sameSite("Strict")
                .build();

        // Log
        //Log.write(userId, "Auth", "Cierre de sesión del usuario.");

        // La guardamos
        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());

    }
}
