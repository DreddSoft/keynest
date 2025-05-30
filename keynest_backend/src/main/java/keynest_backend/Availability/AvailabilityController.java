package keynest_backend.Availability;

import keynest_backend.Model.Availability;
import lombok.RequiredArgsConstructor;
import org.hibernate.query.NativeQuery;
import org.springframework.format.annotation.DateTimeFormat;
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
    public List<Availability> getAvailabilityForUnit(
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

}
