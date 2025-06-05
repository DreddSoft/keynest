package keynest_backend.User;

import lombok.RequiredArgsConstructor;
import lombok.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173"})
public class UserController {

    private final UserService userService;

    @GetMapping(value = "{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Integer id) {

        UserDTO userDTO = userService.getUser(id);

        if (userDTO == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(userDTO);

    }

    @PutMapping()
    public ResponseEntity<UserResponse> updateUser(@RequestBody UserRequest request) {

        return ResponseEntity.ok(userService.updateUser(request));

    }

    @PostMapping(value = "search")
    public ResponseEntity<UserAdminDTO> searchUser (@RequestBody UserSearchRequest request) {

        return ResponseEntity.ok(userService.searchUser(request));
    }

    /**
     * Endpoint para eliminar usuarios
     * Verbo HTTP delete
     *
     */
    @DeleteMapping()
    public ResponseEntity<UserResponse> deleteuser (@RequestBody UserDeleteRequest request) {

        return ResponseEntity.ok(userService.deleteUser(request.getId()));

    }

    /**
     * Endpoint para cambiar la contraseña de un usuario
     * @param request - Clase UserChangePassRequest que es una clase request especifica para cambiar la contraseña, contiene 2 atributos id de usuario y password
     * @return userResponse - una clase respuesta con mensaje
     */
    @PatchMapping("pass")
    public ResponseEntity<UserResponse> changePassword (@RequestBody UserChangePassRequest request) {

        return ResponseEntity.ok(userService.changePassword(request));

    }


}
