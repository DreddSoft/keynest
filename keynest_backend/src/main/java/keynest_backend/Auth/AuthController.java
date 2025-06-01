package keynest_backend.Auth;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import keynest_backend.Exceptions.ErrorGeoDataException;
import keynest_backend.User.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173"})
public class AuthController {

    // Objeto de la clase de servicio encargada de gestionar la autenticación
    // Al usar Lombok con la notación @RequiredArgsConstructor, no es necesario crear un constructor

    @Autowired
    private final AuthService authService;


    /**
     * Endpoint para iniciar sesión, público.
     * @param request - Objeto LoginRequest con las credenciales del usuario
     * @return - ResponseEntity con la respuesta de autenticación (token, datos del usuario, etc)
     */
    @PostMapping(value = "login")
    @CrossOrigin(origins = {"http://localhost:5173"})
    public ResponseEntity<AuthDTO> login(@RequestBody LoginRequest request, HttpServletResponse Httpresponse) {

        // Enviamos el request al authService
        AuthResponse response = authService.login(request);

        // Seteamos la cookie de con la info
        String token = response.getToken();

        ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(false) // True cuando https
                .path("/")
                .maxAge(60 * 60) // 1 hora
                .sameSite("Strict") // valores Lax o Strict
                .build();

        Httpresponse.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        // Creamos el authDTO
        AuthDTO authDTO = AuthDTO.builder()
                .userId(response.getUserId())
                .email(response.getEmail())
                .firstname(response.getFirstname())
                .lastname(response.getLastname())
                .build();


        // Devolvemos la respuesta HTTP 200
        return ResponseEntity.ok(authDTO);

    }

    /**
     * Endpoint para el registro de un nuevo usuario, es público de momento, en produción sera privado
     * @param request - Objeto RegisterRequest con los datos del nuevo usuario
     * @return ResponseEntity con el token de autenticación.
     */
    // TODO: Esto en un futuro no será público y no devolverá un token, solo la respuesta de confirmación
    @PostMapping(value = "register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) throws ErrorGeoDataException {

        User userBase = authService.register(request);
        String response = "";

        if (userBase == null) {
            response = "Error al crear el usuario.";
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

        // Devuelve token y respuesta HTTP 200
        // TODO: Bloquear el acceso publico
        response = "Usuario creador correctamente.";
        return ResponseEntity.ok(response);
    }


    @PostMapping(value = "logout")
    public ResponseEntity<String> logout(HttpServletResponse response, @RequestBody LogoutRequest request) {

        // Sanitizamos
        Integer userId = request.getUserId();

        // Nos cargamos la cookie
        authService.logout(response, userId);

        // Respuesta
        return ResponseEntity.ok("Sesión cerrada correctamente.");
    }

    /**
     * Endpoint para comprobar si esta autenticado
     * Al tratar de acceder al backend va a pasar por el security filter chain, donde configure las reglas para que haga la verificación del token jwt.
     * Si no es correcto devolvera un 403 o 401 porque no esta autorizado, esto lo controlamos en el frontend
     * Si es correcto, devuelve 200 y continuamos autenticados
     */
    @GetMapping("check")
    public ResponseEntity<?> checkAuthentication() {
        return ResponseEntity.ok().build();
    }


}
