package keynest_backend.Unit;

import keynest_backend.Model.Unit;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/unit")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173"})
public class UnitController {

    private final UnitService unitService;

    // Método POST para crear un recurso
    @PostMapping()
    public ResponseEntity<UnitResponse> createUnit(@RequestBody UnitCreateRequest request) {

        return ResponseEntity.ok(unitService.createUnit(request));

    }

    // Método GET para obtener un recurso
    @GetMapping(value = "{id}")
    public ResponseEntity<UnitDTO> getUnit(@PathVariable Integer id) {

        UnitDTO unit = unitService.getUnit(id);

        if (unit == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(unit);

    }

    // Método POST para obtener varios recursos de un user
    @GetMapping(value = "{userId}/units")
    public List<UnitDTO> allUnitsPerUser(@PathVariable Integer userId) {

        return unitService.allUnitsPerUser(userId);

    }

}
