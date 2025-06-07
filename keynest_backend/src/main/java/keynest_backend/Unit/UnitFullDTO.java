package keynest_backend.Unit;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UnitFullDTO {

    Integer id;

    Integer userId;

    //* Data
    String name;
    Integer rooms;
    Integer bathrooms;
    boolean hasKitchen;
    Integer minOccupancy;
    Integer maxOccupancy;
    double areaM2;
    String description;
    String unitType;

    String country;
    String province;
    String locality;
    String address;
    String postalCode;

    boolean isActive;
}
