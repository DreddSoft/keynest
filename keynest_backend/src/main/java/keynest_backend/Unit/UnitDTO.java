package keynest_backend.Unit;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UnitDTO {

    // Datos principales
    public String name;

    // Localizacion
    public String countryName;
    public String provinceName;
    public String localityName;
    public String address;
    public String buildingBlock;
    public String streetNumber;
    public String floor;
    public String doorLetter;
    public String postalCode;
    public double latitude;
    public double longitude;

    // Descripcion
    public Integer rooms;
    public Integer bathrooms;
    public boolean hasKitchen;
    public Integer minOccupancy;
    public Integer maxOccupancy;
    public double areaM2;
    public String description;

    // Seguridad


}
