package keynest_backend.Config;

import keynest_backend.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * @author Keynest
 * @version 1.0
 * @since 19/04/2025
 *
 * Esta clase es la configuración de seguridad de la aplicación.
 * Se encarga de configurar el AuthenticationManager, AuthenticationProvider y UserDetailsService.
 */
@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    private final UserRepository userRepository;

    /**
     * Bean que expone el AuthenticationManager, encargado de realizar el proceso de autenticación.
     * @param config - Objeto de configuración de autenticación proporcionado por Spring.
     * @return AuthenticationManager - El AuthenticationManager configurado.
     * @throws Exception Si ocurre un error al construir el authentication manager.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {

        return config.getAuthenticationManager();

    }

    /**
     * Bean que configura que proveedores de autenticación usará Security
     * @return AuthenticationProvider - El proveedor de autenticación configurado.
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        // Usamos DaoAuthenticationProvider para autenticar usuarios
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();

        // Indicamos como debe obtener los datos del usuario
        authenticationProvider.setUserDetailsService(userDetailsService());
        // Indicamos como debe codificar la contraseña
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;

    }


    /**
     * Bean que codifica la contraseña del usuario.
     * BCrypt es un algoritmo de hash
     * @return PasswordEncoder que usa BCrypt.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }


    /**
     * Bean que define cómo se obtienen los detalles del usuario.
     * En este caso, los usuarios se buscan por email.
     * !OJO. Debido a un error de configuración que aún no he sabido arreglar, el username y el email son lo mismo.
     * @return - UserDetailsService que carga usuarios desde UserRepository.
     * @throws UsernameNotFoundException Si no se encuentra el usuario.
     */
    @Bean
    public UserDetailsService userDetailsService() {

        return email -> userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("No se ha encontrado el usuario con el email: " + email));

    }

}
