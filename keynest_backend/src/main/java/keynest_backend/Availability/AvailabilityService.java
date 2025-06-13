package keynest_backend.Availability;

import jakarta.transaction.Transactional;
import keynest_backend.Model.Availability;
import keynest_backend.Model.Unit;
import keynest_backend.Repositories.AvailabilityRepository;
import keynest_backend.Repositories.UnitRepository;
import keynest_backend.Utils.Log;
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

        // SAcamos la unidad
        Unit unit = unitRepository.findById(unitId).orElseThrow(() -> new IllegalArgumentException("No se puede encontrar la unidad."));

        if (endDate.isBefore(starDate)) {
            throw new IllegalArgumentException("La fecha fin no puede ser anterior a la fecha inicio.");

        }

        return availabilityRepository.findAvailabilityByUnitAndDateRange(unit, starDate, endDate);
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

        // Sacamos unidad
        Unit unit = unitRepository.findById(request.getUnitId()).orElseThrow(() -> new IllegalArgumentException("Unidad no encontrada."));

        return availabilityRepository.findAvailabilityByUnitAndDateRange(unit, request.getCheckIn(), request.getCheckOut());

    }

    /**
     * Metodo para crear disponibilidad entre varias fechas, y asi actualizar la dispo de una unidad de golpe
     * @param request |
     */
    public AvailabilityResponse createBrutAvailabilityPerUnit(CreateBrutAvailaRequest request) {

        Unit unit = unitRepository.findById(request.getUnitId()).orElseThrow(() -> new IllegalArgumentException("La unidad no existe."));

        // Sacar la última fecha disponible de esa unidad
        LocalDate lastDate = availabilityRepository.findLastAvailableDateByUnitId(unit.getId());

        // Si es nulo, no hay, pues hoy
        if (lastDate == null) {
            lastDate = LocalDate.now();
        }

        // No hace falta eliminar los registros, porque esto sera siempre en fechas que no esten creadas
        // Hay que crear disponibilidad por disponibilidad y guardarlo
        // Crearlas todas hasta la final, sin contarla
        for (LocalDate date = lastDate; date.isBefore(request.getEndDate()); date = date.plusDays(1)) {
            // Obtener la unidad

            Availability intro = Availability.builder()
                    .unit(unit)
                    .dateAvailable(date)
                    .pricePerNight(request.getPrice())
                    .minStay(request.getMinStay())
                    .isAvailable(true)
                    .build();

            availabilityRepository.save(intro);

        }

        return AvailabilityResponse.builder()
                .message("Disponibilidad creada con exito.")
                .build();

    }

    // Método para bloquear fechas (available = false) de una unidad
    @Transactional
    public AvailabilityResponse blockDatesInUnit (CheckAvailabilityRequest request) {

        // Sacar la unidad
        Unit unit = unitRepository.findById(request.getUnitId()).orElseThrow(() -> new IllegalArgumentException("No se ha encontrado la unidad."));

        Log.write(unit.getUser().getId(), "AvailabilityService | blockDatesInUnit", "Procediendo a comprobar las fechas de disponibilidad y bloquearlas.");


        availabilityRepository.updateAvailabilityStatus(request.getUnitId(), request.getCheckIn(), request.getCheckOut(), false);

        Log.write(unit.getUser().getId(),
                "AvailabilityService | blockDatesInUnit",
                String.format("Bloqueos realizados desde %s hasta %s en la unidad %d.", request.getCheckIn(), request.getCheckOut(), request.getUnitId()));

        return AvailabilityResponse.builder()
                .message(String.format("Se han bloqueado las fechas desde %s hasta %s correctamente.", request.getCheckIn().toString(), request.getCheckOut().toString()))
                .build();

    }

    // Método para bloquear fechas (available = false) de una unidad
    @Transactional
    public AvailabilityResponse unblockDatesInUnit (CheckAvailabilityRequest request) {

        // Sacar la unidad
        Unit unit = unitRepository.findById(request.getUnitId()).orElseThrow(() -> new IllegalArgumentException("No se ha encontrado la unidad."));

        Log.write(unit.getUser().getId(), "AvailabilityService | unblockDatesInUnit", "Procediendo a comprobar las fechas de disponibilidad y desbloquearlas.");

        availabilityRepository.updateAvailabilityStatus(request.getUnitId(), request.getCheckIn(), request.getCheckOut(), true);

        Log.write(unit.getUser().getId(),
                "AvailabilityService | unblockDatesInUnit",
                String.format("Desbloqueos realizados desde %s hasta %s en la unidad %d.", request.getCheckIn(), request.getCheckOut(), request.getUnitId()));

        return AvailabilityResponse.builder()
                .message(String.format("Se han desbloqueado las fechas desde %s hasta %s correctamente.", request.getCheckIn().toString(), request.getCheckOut().toString()))
                .build();

    }

    // Método para cambiar la estancia mínima de una unidad
    @Transactional
    public AvailabilityResponse changeMinStayInUnit (ChangeMinStayRequest request) {

        // Sacar la unidad
        Unit unit = unitRepository.findById(request.getUnitId()).orElseThrow(() -> new IllegalArgumentException("No se ha encontrado la unidad."));

        Log.write(unit.getUser().getId(), "AvailabilityService | changeMinStayInUnit", "Procediendo a comprobar las fechas de disponibilidad y cambiar estancia minima.");

        availabilityRepository.updateMinStay(request.getUnitId(), request.getStartDate(), request.getEndDate(), request.getMinStay());

        Log.write(unit.getUser().getId(),
                "AvailabilityService | changeMinStayInUnit",
                String.format("Cambios de estancia mínima desde %s hasta %s en la unidad %d.", request.getStartDate(), request.getEndDate(), request.getUnitId()));

        return AvailabilityResponse.builder()
                .message(String.format("Se ha cambia la estancia mínima para las fechas desde %s hasta %s correctamente.", request.getStartDate().toString(), request.getEndDate().toString()))
                .build();

    }

    // Método para cambiar la el precio por noche de una unidad
    @Transactional
    public AvailabilityResponse changePricerPerNight (ChangePriceRequest request) {

        // Sacar la unidad
        Unit unit = unitRepository.findById(request.getUnitId()).orElseThrow(() -> new IllegalArgumentException("No se ha encontrado la unidad."));

        Log.write(unit.getUser().getId(), "AvailabilityService | changePricerPerNight", "Procediendo a comprobar las fechas de disponibilidad y cambiar el precio.");

        availabilityRepository.updatePricePerNight(request.getUnitId(), request.getStartDate(), request.getEndDate(), request.getPrice());

        Log.write(unit.getUser().getId(),
                "AvailabilityService | changePricerPerNight",
                String.format("Cambios de precios realizados desde %s hasta %s en la unidad %d.", request.getStartDate(), request.getEndDate(), request.getUnitId()));

        return AvailabilityResponse.builder()
                .message(String.format("Se han cambiado los precios para las fechas desde %s hasta %s correctamente.", request.getStartDate().toString(), request.getEndDate().toString()))
                .build();

    }



    //* Metodos auxiliares
    private boolean isNotEmpty(String value) {
        return value != null && !value.trim().isEmpty();
    }



}
