package keynest_backend.Availability;

import keynest_backend.Model.Availability;
import keynest_backend.Model.Unit;
import keynest_backend.Repositories.AvailabilityRepository;
import keynest_backend.Repositories.UnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AvailabilityService {


    private final AvailabilityRepository availabilityRepository;
    private final UnitRepository unitRepository;

    // Los servicios aqui son
    // 1. Ver dispo de una unidad
    // 2. Actualizar dispo de una unidad

    // 1. Ver dispo de una unidad en base a unas fechas
    public List<AvailabilityDTO> getAvailabilityForUnit(Integer unitId, LocalDate starDate, LocalDate endDate) {

        if (starDate == null || endDate == null || unitId == null) {
            throw new IllegalArgumentException("Unidad y fecha son requeridas.");

        }

        if (endDate.isBefore(starDate)) {
            throw new IllegalArgumentException("La fecha fin no puede ser anterior a la fecha inicio.");

        }

        return availabilityRepository.findAvailabilityByUnitAndDateRange(unitId, starDate, endDate);
    }

    //2. Crear una dispo
    public String createAvailability (AvailabilityRequest request) {

        System.out.println("Entra por aqui");
        System.out.println("id de unidad: " + request.getUnitId());

        Unit unit = unitRepository.findById(request.getUnitId()).orElse(null);

        System.out.println("Sigue por aqui");

        if (unit == null)
            return "ERROR | Unidad no encontrada.";

        // Conversion de String a fechas
        LocalDate date = LocalDate.parse(request.getDateAvailable());

        if (date.isBefore(LocalDate.now()))
            return "ERROR | No se puede crear la disponibilidad de un dia pasado.";


        Availability availability = Availability.builder()
                .unit(unit)
                .dateAvailable(date)
                .pricePerNight(request.getPrice())
                .minStay(request.getMinStay())
                .build();

        availabilityRepository.save(availability);

        return "OK | Se ha registrado la disponibilidad de la unidad.";

    }

    // 3. Actualizar dispo
    public String updateAvailability(AvailabilityUpdateRequest request) {

        // Sacar la dispo
        Availability entry = availabilityRepository.findById(request.getAvailabilityId()).orElse(null);

        if (entry == null)
            return "ERROR | Disponibilidad no encontrada.";


        entry.setPricePerNight(request.getPrice());
        entry.setMinStay(request.getMinStay());

        availabilityRepository.save(entry);

        return "OK | Disponiblidad actualizada.";

    }

    // Metodo para sacar la dispo entre dos fechas
    public List<AvailabilityDTO> checkAvailability (CheckAvailabilityRequest request) {

        return availabilityRepository.findAvailabilityByUnitAndDateRange(request.getUnitId(), request.getCheckIn(), request.getCheckOut());

    }


    //* Metodos auxiliares
    private boolean isNotEmpty(String value) {
        return value != null && !value.trim().isEmpty();
    }

}
