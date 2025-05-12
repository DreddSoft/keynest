package keynest_backend.Auth;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {

        // Devolvemos la respuesta HTTP 200
        return ResponseEntity.ok(authService.login(request));

    }

    /**
     * Endpoint para el registro de un nuevo usuario, es público de momento, en produción sera privado
     * @param request - Objeto RegisterRequest con los datos del nuevo usuario
     * @return ResponseEntity con el token de autenticación.
     */
    // TODO: Esto en un futuro no será público y no devolverá un token, solo la respuesta de confirmación
    @PostMapping(value = "register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {

        // Devuelve token y respuesta HTTP 200
        // En el futuro, esto no será público y no devolverá un token, solo la respuesta de confirmación
        return ResponseEntity.ok(authService.register(request));
    }


}
