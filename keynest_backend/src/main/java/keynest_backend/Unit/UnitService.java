package keynest_backend.Unit;

import keynest_backend.Model.Country;
import keynest_backend.Model.Locality;
import keynest_backend.Model.Province;
import keynest_backend.Model.Unit;
import keynest_backend.Repositories.*;
import keynest_backend.User.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UnitService {

    private final UnitRepository unitRepository;
    private final UserRepository userRepository;
    private final CountryRepository countryRepository;
    private final ProvinceRepository provinceRepository;
    private final LocalityRepository localityRepository;

    // Metodos de servicio para usar el repositorio
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

        // Creamos una unidad
        Unit unit = Unit.builder()
                //* Relacion
                .user(owner)
                //* Data
                .name(request.getName())
                .rooms(request.getRooms())
                .bathrooms(request.getBathrooms())
                .hasKitchen(request.isHasKitchen())
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
                .type(unit.getType())
                //* GEO Data
                .countryName(country.getName())
                .provinceName(province.getName())
                .localityName(locality.getName())
                .address(unit.getAddress())
                .postalCode(unit.getPostalCode())
                .build();

    }

    public List<UnitCardDTO> allUnitsPerUser(Integer userId) {

        if (!userRepository.existsById(userId)) {
            return Collections.emptyList();
        }

        return unitRepository.findAllByUser(userId);

    }

    public Unit updateUnit(UnitUpdateRequest request) {

        // Obtener el updater
        User updater = userRepository.findById(request.getUpdaterId())
                .orElseThrow(() -> new IllegalArgumentException("Usuario modificador no encontrado."));

        // Obtener la unidad
        Unit unit = unitRepository.findById(request.getUnitId())
                .orElse(null);

        if (unit == null)
            return unit;

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


        // Auditoría
        unit.setUpdatedAt(LocalDateTime.now());
        unit.setUpdatedBy(updater);

        // Guardar cambios
        unitRepository.save(unit);

        return unit;

    }

    public UnitResponse deleteUnit(Integer unitId) {

        // Sacar la unidad
        //TODO: Esto no es optimo en memoria, pero tengo que controlar el resultado
        Unit unitTarget = unitRepository.findById(unitId).orElse(null);

        if (unitTarget == null)
            return new UnitResponse("ERROR | No se ha encontrado la unidad a eliminar.");

        unitRepository.delete(unitTarget);

        return new UnitResponse("OK | Unidad eliminada.");

    }

    //* Metodos auxiliares
    private boolean isNotEmpty(String value) {
        return value != null && !value.trim().isEmpty();
    }

}
