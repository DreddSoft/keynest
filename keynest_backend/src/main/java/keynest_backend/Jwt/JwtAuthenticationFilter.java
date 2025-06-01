package keynest_backend.Jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * @author DreddSoft
 * @version 1.0
 * @since 19/04/2025
 * Filtro personalizado de autenticación JWT.
 * Intercepta cada solicitud HTTP y extrae el token del encabezado Authorization, valida el token y establece el contexto de seguridad.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {


    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    /**
     * Método principal que intercepta la solicitud.
     * Extrae el token JWT y lo valida.
     * @param request - Solicitud HTTP entrante.
     * @param response - Respuesta HTTP.
     * @param filterChain - Cadena de filtros.
     * @throws ServletException
     * @throws IOException
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // Extraemos el token del encabezado
        final String token = getTokenFromRequest(request);
        final String email;

        // Si no hay token, continuamos con la cadena de filtros sin autenticar
        if (token ==  null) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extraemos el email(username) del token
        email = jwtService.getEmailFromToken(token);

        // Si obtenemos el email y aún no hay autenticación
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Cargamos los detalles del usuario desde la base de datos
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            // Validar si el token es valido
            if (jwtService.isTokenValid(token, userDetails)) {

                // Creamos un token de autenticación manualmente
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                // Establecemos el contexto de seguridad con el token de autenticación
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        // Continuamos con la cadena de filtros
        filterChain.doFilter(request, response);

    }

    /**
     * Método auxiliar para extraer el token JWT del encabezado.
     * @param request - Solicitud HTTP entrante.
     * @return - Token JWT si existe, de lo contrario null.
     */
    private String getTokenFromRequest(HttpServletRequest request) {

        /* ESTO ES LEYENDO DESDE HEADER BEARER TOKEN
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {

            // Desde el 7 hasta el final es el token
            return authHeader.substring(7);

        }

         */

        //* Leyendo desde la cookie
        if (request.getCookies() != null) {

            // Recorremos todas las cookies
            for (Cookie cookie : request.getCookies()) {
                if ("jwt".equals(cookie.getName()))
                    return cookie.getValue();
            }

        }

        return null;
    }
}
