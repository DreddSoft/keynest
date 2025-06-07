package keynest_backend.Unit;

import keynest_backend.Logs.Log;
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

    /**
     * Endpoint para crear una nueva unidad de alojamiento.
     *
     * @param request objeto UnitCreateRequest con los datos necesarios para la creación
     * @return ResponseEntity con un objeto UnitResponse, que devuelve una respuesta
     */
    @PostMapping()
    public ResponseEntity<UnitResponse> createUnit(@RequestBody UnitCreateRequest request) {

        return ResponseEntity.ok(unitService.createUnit(request));

    }

    /**
     * Endpoint para obtener los datos básicos de una unidad a partir de su ID, en uso en el dashboard de unidad del usuario
     *
     * @param id - identificador de la unidad.
     * @return ResponseEntity con el DTO de la unidad o un 404 si no lo encuentra.
     */
    @GetMapping(value = "{id}")
    public ResponseEntity<UnitDTO> getUnit(@PathVariable Integer id) {

        UnitDTO unit = unitService.getUnit(id);

        if (unit == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(unit);

    }

    /**
     * Endpoint para obtener toda la informacion de una unidad
     * @param userId Integer
     * @return ResponseEntity con DTO
     */
    @GetMapping(value = "full/{unitId}")
    public ResponseEntity<UnitFullDTO> getFullUnit (@PathVariable Integer unitId) {

        return ResponseEntity.ok(unitService.getFullUnit(unitId));

    }

    /**
     * Obtiene un listado de UnitCardDTO, un objeto con informacion reducida, de las unidades de un usuario (propietario).
     *
     * @param userId - Identificador del usuario propietario
     * @return Lista de objetos UnitCardDTO
     */
    @GetMapping(value = "{userId}/units")
    public List<UnitCardDTO> allUnitsPerUser(@PathVariable Integer userId) {

        return unitService.allUnitsPerUser(userId);

    }

    /**
     * Actualiza una unidad existente, solo accesible desde el panel de administrador.
     *
     * @param request objeto UnitUpdateRequest con la información de los campos a actualizar
     * @return ResponseEntity con la clase UnitResponse para mandar mensaje informativo
     */
    @PutMapping()
    public ResponseEntity<UnitResponse> updateUnit(@RequestBody UnitUpdateRequest request) {

        Log.write(request.getUpdaterId(), "UnitController-updateUnit", "El usuario accede al endpoint updateUnit");

        return ResponseEntity.ok(unitService.updateUnit(request));

    }

    /**
     * Endpoint para eliminar una unidad. Solo accesible desde el panel de administrador.
     *
     * @param request- Objeto de la clase UnitActivateRequest (reutilizada) que contiene la informacion necesaria
     * @return response - ResponseEntity con un objeto UnitResponse con un mensaje personalizado
     */
    @DeleteMapping()
    public ResponseEntity<UnitResponse> deleteUnit(@RequestBody UnitActivateRequest request) {

        Log.write(request.getUpdaterId(), "UnitController", "El usuario ha accedido al endpoint deleteUnit.");
       return ResponseEntity.ok(unitService.deleteUnit(request));

    }

    /**
     *
     * @param request - objeto de la clase UnitActivateRequest que contiene la informacion necesaria
     *
     * @return responseEntity con un objeto de la clase UnitResponse que contiene un mensaje personalizado y el codigo OK de respuesta (200)
     */
    @PostMapping(value = "activate")
    public ResponseEntity<UnitResponse> activateUnit (@RequestBody UnitActivateRequest request) {

        Log.write(request.getUpdaterId(), "UnitController", "Accede al endpoint activateUnit.");
        return ResponseEntity.ok(unitService.activateUnit(request));

    }

}
