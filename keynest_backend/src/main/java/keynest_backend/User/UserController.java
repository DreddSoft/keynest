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


}
