package keynest_backend.Unit;

import keynest_backend.Model.Unit;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/unit")
@RequiredArgsConstructor
@CrossOrigin(origins = "")
public class UnitController {

    private final UnitService unitService;

    @PostMapping()
    public ResponseEntity<UnitResponse> createUnit(@RequestBody UnitCreateRequest request) {

        return ResponseEntity.ok(unitService.createUnit(request));

    }

    @GetMapping(value = "{id}")
    public ResponseEntity<Unit> getUnit(@PathVariable Integer id) {

        Unit unit = unitService.getUnit(id);

        if (unit == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(unit);

    }
}
