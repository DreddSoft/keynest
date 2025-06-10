package keynest_backend.Unit;

import keynest_backend.Logs.Log;
import keynest_backend.Model.*;
import keynest_backend.Repositories.*;
import keynest_backend.User.Role;
import keynest_backend.User.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UnitService {

    private final UnitRepository unitRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final CountryRepository countryRepository;
    private final ProvinceRepository provinceRepository;
    private final LocalityRepository localityRepository;

    /**
     * Método de servicio que permite crear una unidad.
     * Crea una instancia de unidad y la guarda en la base de datos.
     * @param request - Objeto de la clase UnitCreateRequest, clase específica para recibir parámetros para crear
     * @return response - Objeto de la clase UnitResponse.
     */
    public UnitResponse createUnit(UnitCreateRequest request) {

        // Hay que sacar datos de modelos con los repositorios
        User owner = userRepository.findById(request.getUserId()).orElseThrow(() -> new IllegalArgumentException("CreateUnit - usuario propietario no encontrado."));
        Locality locality = localityRepository.findById(request.getLocalityId()).orElseThrow(() -> new IllegalArgumentException("CreateUnit - localidad no encontrada."));
        User creator = userRepository.findById(request.getCreatorId()).orElseThrow(() -> new IllegalArgumentException("CreateUnit - Usuario creador no encontrado."));
        UnitType typeUnit;
        Integer typePick = request.getType();

        switch (typePick) {
            case 1:
                typeUnit = UnitType.HOUSE;
                break;

            case 2:
                typeUnit = UnitType.STUDIO;
                break;

            case 3:
                typeUnit = UnitType.COUNTRY_HOUSE;
                break;

            default:
                typeUnit = UnitType.APARTMENT;
                break;

        }

        // El parametro kitchen se recibe como entero
        boolean hasKitchen = false;
        if (request.getKitchen() == 1) {
            hasKitchen = true;
        }

        // Creamos una unidad
        Unit unit = Unit.builder()
                //* Relacion
                .user(owner)
                //* Data
                .name(request.getName())
                .rooms(request.getRooms())
                .bathrooms(request.getBathrooms())
                .hasKitchen(hasKitchen)
                .minOccupancy(request.getMinOccupancy())
                .maxOccupancy(request.getMaxOccupancy())
                .areaM2(request.getAreaM2())
                .description(request.getDescription())
                .type(typeUnit)
                //* GEO Data
                .locality(locality)
                .address(request.getAddress())
                .postalCode(request.getPostalCode())
                //* Auditoria
                .createdAt(LocalDateTime.now())
                .createdBy(creator)
                .updatedAt(LocalDateTime.now())
                .updatedBy(creator)
                .isActive(true)
                // Construimos
                .build();

        unitRepository.save(unit);

        return UnitResponse.builder()
                .message("Unidad de alojamiento creada con exito")
                .build();

    }

    // Metodo para devolver una unidad por el ID
    public UnitDTO getUnit(Integer id) {

        // Creamos unidad
        Unit unit = unitRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("getUnit - Unidad no encontrada."));
        Locality locality = localityRepository.findById(unit.getLocality().getId()).orElseThrow(() -> new IllegalArgumentException("getUnit - Localidad no encontrada."));
        Province province = provinceRepository.findById(locality.getProvince().getId()).orElseThrow(() -> new IllegalArgumentException("getUnit - Provincia no encontrada."));
        Country country = countryRepository.findById(province.getCountry().getId()).orElseThrow(() -> new IllegalArgumentException("getUnit - Pais no encontrado."));

        if (!unit.isActive())
            throw new IllegalArgumentException("getUnit - Unidad desactivada.");

        // Creamos el DTO para devolver datos
        return UnitDTO.builder()
                //* Identificación y autenticación
                .id(unit.getId())
                //* Data
                .name(unit.getName())
                .rooms(unit.getRooms())
                .bathrooms(unit.getBathrooms())
                .hasKitchen(unit.isHasKitchen())
                .minOccupancy(unit.getMinOccupancy())
                .maxOccupancy(unit.getMaxOccupancy())
                .areaM2(unit.getAreaM2())
                .description(unit.getDescription())
                .type(unit.getType().toString())
                //* GEO Data
                .countryName(country.getName())
                .provinceName(province.getName())
                .localityName(locality.getName())
                .address(unit.getAddress())
                .postalCode(unit.getPostalCode())
                .build();

    }

    /**
     * Método para obtener todos los datos de una unidad, accesible desde el panel de administrador
     * @param unitId
     * @return unitFullDTO | Clase DTO con todos los datos "traducidos"
     */
    public UnitFullDTO getFullUnit (Integer unitId) {

        // Capturamos unidad
        Unit base = unitRepository.findById(unitId).orElseThrow(() -> new IllegalArgumentException("UnitService | getFullUnit | Error al capturar la unidad."));

        // Construimos y retornamos el DTO
        return UnitFullDTO.builder()
                .id(base.getId())
                .userId(base.getUser().getId())
                .name(base.getName())
                .rooms(base.getRooms())
                .bathrooms(base.getBathrooms())
                .hasKitchen(base.isHasKitchen())
                .minOccupancy(base.getMinOccupancy())
                .maxOccupancy(base.getMaxOccupancy())
                .areaM2(base.getAreaM2())
                .description(base.getDescription())
                .unitType(base.getType().name())
                .country(base.getLocality().getProvince().getCountry().getName())
                .province(base.getLocality().getProvince().getName())
                .locality(base.getLocality().getName())
                .address(base.getAddress())
                .postalCode(base.getPostalCode())
                .isActive(base.isActive())
                .build();

    }

    public List<UnitCardDTO> allUnitsPerUser(Integer userId) {

        if (!userRepository.existsById(userId)) {
            return Collections.emptyList();
        }

        // Capturamos todas las unidades del usuario
        List<Unit> units = unitRepository.findAllByUser(userId);

        // Lista vacia de cardDTOs
        List<UnitCardDTO> unitsDTOs = new ArrayList<>();

        // Recorremos todas las unidades
        for (Unit unit: units) {

            // Sacar la proxima reserva de la unidad
            Booking nextBooking = bookingRepository.findBookingThatChecksInToday(unit.getId()).orElse(null);

            // Creamos DTO
            UnitCardDTO card = UnitCardDTO.builder()
                    .id(unit.getId())
                    .name(unit.getName())
                    .type(unit.getType().toString())
                    .address(unit.getAddress())
                    .localityName(unit.getLocality().getName())
                    .checkIn((nextBooking == null) ? null : nextBooking.getCheckIn())
                    .checkOut((nextBooking == null) ? null : nextBooking.getCheckOut())
                    .nights((nextBooking == null) ? null : nextBooking.getNights())
                    .bookingId((nextBooking == null) ? null : nextBooking.getId())
                    .bookingStatus((nextBooking == null) ? null : nextBooking.getStatus())
                    .build();

            // Insertar en lista
            unitsDTOs.add(card);

        }

        return unitsDTOs;
    }

    /**
     * Método de servicio para actualizar una unidad.
     * Comprueba cada campo, y si tiene un valor diferente de nulo, lo actualiza usando Hibernate.
     * @param request - Objeto de la clase UnitUpdateRequest, clase específica para enviar la información de actualización
     * @return response - Objeto de la clase UnitResponse, que representa una clase que envía un mensaje con un código de estado
     */
    public UnitResponse updateUnit(UnitUpdateRequest request) {

        System.out.println("Entra en updateUnit en UnitService");
        System.out.println("El id del updater es: " + request.getUpdaterId());
        Log.write(request.getUpdaterId(), "UnitService-updateUnit", "Obteniendo el usuario actualizador.");

        // Obtener el updater
        User updater = userRepository.findById(request.getUpdaterId())
                .orElseThrow(() -> new IllegalArgumentException("Usuario modificador no encontrado."));

        Log.write(request.getUpdaterId(), "UnitService-updateUnit", "Obteniendo la unidad.");
        // Obtener la unidad
        Unit unit = unitRepository.findById(request.getUnitId())
                .orElseThrow(() -> new IllegalArgumentException("Unidad no encontrada."));


        Log.write(request.getUpdaterId(), "UnitService-updateUnit", "Actualizando unidad.");
        // Comprobacion y modificacion
        if (isNotEmpty(request.getName()))
            unit.setName(request.getName());

        if (request.getRooms() != null)
            unit.setRooms(request.getRooms());

        if (request.getBathrooms() != null)
            unit.setBathrooms(request.getBathrooms());

        if (request.getHasKitchen() != null)
            unit.setHasKitchen(request.getHasKitchen());

        if (request.getMinOccupancy() != null)
            unit.setMinOccupancy(request.getMinOccupancy());

        if (request.getMaxOccupancy() != null)
            unit.setMaxOccupancy(request.getMaxOccupancy());

        if (isNotEmpty(request.getDescription()))
            unit.setDescription(request.getDescription());

        if (request.getAreaM2() != null)
            unit.setAreaM2(request.getAreaM2());

        if (isNotEmpty(request.getAddress()))
            unit.setAddress(request.getAddress());

        if (isNotEmpty(request.getPostalCode()))
            unit.setPostalCode(request.getPostalCode());

        // Si tenemos ID, actualizamos la localidad
        if (request.getLocalityId() != null) {
            Locality locality = localityRepository.findById(request.getLocalityId())
                    .orElseThrow(() -> new IllegalArgumentException("Localidad no encontrada."));
            unit.setLocality(locality);
        }

        // UnitType es un enum, y el parametro se recibe siempre, se cambie o no
        System.out.println("El tipo de unidad: " + request.getUnitTypeOption());
        if (request.getUnitTypeOption() != null) {

            switch (request.getUnitTypeOption()) {

                case 1:
                    unit.setType(UnitType.HOUSE);
                    break;

                case 2:
                    unit.setType(UnitType.STUDIO);
                    break;
                case 3:
                    unit.setType(UnitType.COUNTRY_HOUSE);
                    break;

                // Por defecto siempre apartamentos
                default:
                    unit.setType(UnitType.APARTMENT);
                    break;

            }

        }

        // Auditoría
        unit.setUpdatedAt(LocalDateTime.now());
        unit.setUpdatedBy(updater);

        // Guardar cambios
        unitRepository.save(unit);

        Log.write(request.getUpdaterId(), "UnitService-updateUnit", "Actualizada la unidad " + request.getUnitId() + ".");

        return UnitResponse.builder().message("Actualizada la unidad " + request.getUnitId() + ".").build();

    }

    public UnitResponse deleteUnit(UnitActivateRequest request) {

        Unit unitTarget = unitRepository.findById(request.getUnitId()).orElseThrow(() -> new IllegalArgumentException("No se ha encontrado la unidad."));

        unitRepository.delete(unitTarget);

        // Log
        Log.write(request.getUpdaterId(), "UnitService", "Se ha eliminado la unidad: " + request.getUnitId() + ".");

        return new UnitResponse("Unidad" + request.getUnitId() + " eliminada.");

    }

    /**
     * Método de servicio para reactivar una unidad.
     * Sólo se puede usar desde el panel de administrador.
     * Debe comprobar que el usuario actualizador sea ADMIN.
     * @param request - un objeto de la clase UnitActivateRequest con la informacion necesaria.
     * @return
     */
    public UnitResponse activateUnit (UnitActivateRequest request) {

        // Sacamos el usuario actualizador
        User admin = userRepository.findById(request.getUpdaterId()).orElseThrow(() -> new IllegalArgumentException("Error: El usuario modificador no ha sido encontrado."));

        if (admin.getRole() != Role.ADMIN) {
            Log.write(request.getUpdaterId(), "UnitService", "No se puede activar porque el usuario modificador no tiene permisos.");
            throw  new IllegalArgumentException("El usuario modificador no tiene permisos.");
        }

        // Sacamos la unidad y la activamos
        Unit unit = unitRepository.findById(request.getUnitId()).orElseThrow(() -> new IllegalArgumentException("Error: La unidad no ha sido encontrada por el id."));

        // Si esta activa desactivamos
        if (unit.isActive() == true) {
            Log.write(request.getUpdaterId(), "UnitService", "Activa, se procede a desactivar la unidad: " + request.getUnitId() + ".");
            unit.setActive(false);


        } else { // Si no, activamos

            Log.write(request.getUpdaterId(), "UnitService", "Desactiva, se procede a activar la unidad: " + request.getUnitId() + ".");
            unit.setActive(true);

        }

        unitRepository.save(unit);

        return UnitResponse.builder().message("Unidad: " + request.unitId + " actualizada correctamente.").build();

    }

    //* Metodos auxiliares
    private boolean isNotEmpty(String value) {
        return value != null && !value.trim().isEmpty();
    }

}
