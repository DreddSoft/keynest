package keynest_backend.Availability;

import keynest_backend.Model.Availability;
import lombok.RequiredArgsConstructor;
import org.hibernate.query.NativeQuery;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("api/availability")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173"})
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    @GetMapping("/{unitId}")
    public List<AvailabilityDTO> getAvailabilityForUnit(
            @PathVariable Integer unitId,
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
            ) {

        return availabilityService.getAvailabilityForUnit(unitId, startDate, endDate);

    }

    @PostMapping()
    public String createAvailability(@RequestBody AvailabilityRequest request) {

        return availabilityService.createAvailability(request);

    }

    @PatchMapping()
    public String updateAvailability(@RequestBody AvailabilityUpdateRequest request) {

        return availabilityService.updateAvailability(request);

    }

    @PostMapping("check")
    public ResponseEntity<List<AvailabilityDTO>> checkAvailability (@RequestBody CheckAvailabilityRequest request) {

        List<AvailabilityDTO> dates = availabilityService.checkAvailability(request);

        if (dates == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(dates);

    }

    /**
     * Endpoint para crear disponibilidad de una unidad.
     *
     * @param request - Objeto CreateBrutAvailaRequest, que contiene los parametros para crear disponibilidad
     * @return
     */
    @PostMapping("bruteCreate")
    public ResponseEntity<AvailabilityResponse> createBrutAvailability (@RequestBody CreateBrutAvailaRequest request) {

        return ResponseEntity.ok(availabilityService.createBrutAvailabilityPerUnit(request));

    }

    /**
     * Endpoint para bloquear fechas de una unidad.
     *
     * @param request checkAvailabilityResponse que contiene el id de la unidad y la fecha de inicio y final
     * @return ResponseEntity con un mensaje AvailabilityResponse y el codigo de estado 200 (OK).
     */
    @PostMapping("blockdates")
    public ResponseEntity<AvailabilityResponse> blockDatesInUnit (@RequestBody CheckAvailabilityRequest request) {

        return ResponseEntity.ok(availabilityService.blockDatesInUnit(request));

    }

    /**
     * Endpoint para desbloquear fechas de una unidad
     *
     * @param request checkAvailabilityResponse que contiene el id de la unidad y la fecha de inicio y final
     * @return ResponseEntity con un mensaje AvailabilityResponse y el codigo de estado 200 (OK).
     */
    @PostMapping("unblockdates")
    public ResponseEntity<AvailabilityResponse> unblockDatesInUnit (@RequestBody CheckAvailabilityRequest request) {

        return ResponseEntity.ok(availabilityService.unblockDatesInUnit(request));
    }

    /**
     * Endpoint para cambiar la estancia mínima de una unidad
     *
     * @param request
     * @return
     */
    @PostMapping("changeminstay")
    public ResponseEntity<AvailabilityResponse> changeMinStayInUnit (@RequestBody ChangeMinStayRequest request) {

        return ResponseEntity.ok(availabilityService.changeMinStayInUnit(request));
    }

    @PostMapping("changeprice")
    public ResponseEntity<AvailabilityResponse> changePricePerNigh (@RequestBody ChangePriceRequest request) {

        return ResponseEntity.ok(availabilityService.changePricerPerNight(request));
    }

}
