package keynest_backend.Client;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/clients")
@RequiredArgsConstructor
@CrossOrigin(origins = "")
public class ClientController {

    private final ClientService clientService;

    // Mapping del endpoint para crear cliente
    @PostMapping
    public ResponseEntity<String> createCliente(@RequestBody ClientCreateRequest request) {
        return ResponseEntity.ok(clientService.createNewClient(request));
    }

}
