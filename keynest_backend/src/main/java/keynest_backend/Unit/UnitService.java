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
import java.util.Collection;
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
        User owner = userRepository.findById(request.getUserId()).orElse(null);
        Country country = countryRepository.findById(request.getCountryId()).orElse(null);
        Province province = provinceRepository.findById(request.getProvinceId()).orElse(null);
        Locality locality = localityRepository.findById(request.getLocalityId()).orElse(null);
        User worker = userRepository.findById(request.getWorker()).orElse(null);
        UnitType type = UnitType.valueOf(request.getType());

        // Creamos una unidad
        Unit unit = Unit.builder()
                //* Data principal
                .user(owner)
                //* Informacion personal
                .name(request.getName())
                .rooms(request.getRooms())
                .bathrooms(request.getBathrooms())
                .hasKitchen(request.isHasKitchen())
                .minOccupancy(request.getMinOccupancy())
                .maxOccupancy(request.getMaxOccupancy())
                .areaM2(request.getAreaM2())
                .description(request.getDescription())
                .type(type)
                //* GEO Data
                .country(country)
                .province(province)
                .locality(locality)
                .address(request.getAddress())
                .postalCode(request.getPostalCode())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                //* Auditoria
                .createdAt(LocalDateTime.now())
                .createdBy(worker)
                .updatedAt(LocalDateTime.now())
                .updatedBy(worker)
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
        Unit unit = unitRepository.findById(id).orElse(null);

        if (unit != null) {

            // Creamos el DTO para devolver datos
            return UnitDTO.builder()
                    //* Identificación y autenticación
                    .id(unit.getId())
                    //* Informacion
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
                    .countryName(unit.getCountry().getName())
                    .provinceName(unit.getProvince().getName())
                    .localityName(unit.getLocality().getName())
                    .address(unit.getAddress())
                    .postalCode(unit.getPostalCode())
                    .latitude(unit.getLatitude())
                    .longitude(unit.getLongitude())
                    .build();

        }

        return null;
    }

    public List<UnitDTO> allUnitsPerUser(Integer userId) {

        if (!userRepository.existsById(userId)) {
            return Collections.emptyList();
        }

        return unitRepository.findAllByUser(userId);

    }

}
