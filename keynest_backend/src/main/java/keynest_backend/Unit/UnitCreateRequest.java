package keynest_backend.Unit;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UnitCreateRequest {

    // Datos principales
    private Integer userId;
    private String name;

    // Localizacion
    private Integer countryId;
    private Integer provinceId;
    private Integer localityId;
    private String address;
    private String buildingBlock;
    private String streetNumber;
    private String floor;
    private String doorLetter;
    private String postalCode;
    private double latitude;
    private double longitude;

    // Descripcion
    private Integer rooms;
    private Integer bathrooms;
    private boolean hasKitchen;
    private Integer minOccupancy;
    private Integer maxOccupancy;
    private double areaM2;
    private String description;

    // Seguridad
    // Los datos de seguridad no se piden en el request para crear, se automatizan en servicio
    private Integer worker;

}
