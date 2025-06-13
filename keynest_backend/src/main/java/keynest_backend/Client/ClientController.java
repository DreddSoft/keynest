package keynest_backend.Client;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/clients")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173"})
public class ClientController {

    private final ClientService clientService;

    // Mapping del endpoint para crear cliente
    @PostMapping
    public ResponseEntity<String> createCliente(@RequestBody ClientCreateRequest request) {
        return ResponseEntity.ok(clientService.createNewClient(request));
    }

    @GetMapping(value = "{id}")
    public ResponseEntity<ClientDTO> getClient(@PathVariable Integer id) {

        ClientDTO client = clientService.getClient(id);

        if (client == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(client);

    }

    /**
     * Endpoint para obtener una lista de clientes (DTOs) por unidad de alojamiento.
     * @param unitId
     * @return ResponseEntity ok, con la lista.
     */
    @GetMapping(value = "clientsperunit/{unitId}")
    public ResponseEntity<List<ClientDTO>> getClientsPerUnit (@PathVariable Integer unitId) {


        return ResponseEntity.ok(clientService.getClientsPerUnit(unitId));

    }

}
