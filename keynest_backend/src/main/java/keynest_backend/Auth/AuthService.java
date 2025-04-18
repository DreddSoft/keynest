package keynest_backend.Auth;

import keynest_backend.Jwt.JwtService;
import keynest_backend.Models.Role;
import keynest_backend.Models.User;
import keynest_backend.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service    // Notacion que indica a Spring que es una clase de servicio
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository; // Inyeccion de dependencias, Spring se encarga de crear la instancia
    private final JwtService jwtService; // Inyeccion de dependencias, Spring se encarga de crear la instancia
    private final PasswordEncoder passwordEncoder; // Inyeccion de dependencias, Spring se encarga de crear la instancia
    private final AuthenticationManager authenticationManager; // Inyeccion de dependencias, Spring se encarga de crear la instancia

    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())); // Autenticamos al usuario

        UserDetails user = userRepository.findByEmail(request.getEmail()).orElseThrow(); // Buscamos el usuario en la base de datos

        String token = jwtService.getToken(user); // Generamos el token

        // REtornamos la respuesta
        return AuthResponse.builder()
                .token(token)
                .build();

    }

    public AuthResponse register(RegisterRequest request) {

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
                .countryId(request.getCountryId())
                .provinceId(request.getProvinceId())
                .localityId(request.getLocalityId())
                .address(request.getAddress())
                .postalCode(request.getPostalCode())
                .companyId(null)
                .createdAt(LocalDateTime.now()) // Por defecto la fecha de creacion es ahora
                .updatedAt(LocalDateTime.now()) // Por defecto la fecha de actualizacion es ahora
                .language(request.getLanguage())
                .build();

        userRepository.save(user); // Guardamos el usuario en la base de datos

        // Como debemos devolver un objeto tipo AuthResponse, lo creamos
        return AuthResponse.builder()
                .token(jwtService.getToken(user))
                .build();
    }
}
