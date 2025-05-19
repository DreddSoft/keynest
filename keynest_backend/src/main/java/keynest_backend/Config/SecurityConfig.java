package keynest_backend.Config;

import keynest_backend.Jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

/**
 * Clase de configuración de security.
 */
@Configuration  // Indica que la clase es de configuracion, lleva metodo con anotacion Bean
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    // Variables
    // Filtro personalizado que intercepta las peticiones para validar el JWT
    @Autowired
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    @Autowired
    // Proveedor de autenticación que define cómo validar a los usuarios
    private final AuthenticationProvider authProvider;
    @Autowired
    private final CorsConfigurationSource corsConfigurationSource;


    /**
     * Define una cadena de filtros de securidad que se usa para proteger la APP.
     * Desactiva CSRF (Porque usamos JWT)
     * Especifica las rutas públicas y privadas
     *
     * @param http - Objeto tipo HttpSecurity para personalizar la seguridad.
     * @return SecurityFilterChain - Cadena de filtros de seguridad.
     * @throws Exception Pôr si ocurre error
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        return http
                .csrf(csrf -> csrf.disable()) // No usamos tokens csrf
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .authorizeHttpRequests(authRequest ->
                        authRequest
                                .requestMatchers("/**").permitAll()
                                //.anyRequest().authenticated()
                )
                .sessionManagement(sessionManager ->
                        sessionManager
                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();

    }

}
