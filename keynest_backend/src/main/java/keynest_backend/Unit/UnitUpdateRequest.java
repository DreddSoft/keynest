package keynest_backend.Unit;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UnitUpdateRequest {

    //* Id
    Integer unitId;

    //* Data
    String name;
    Integer rooms;
    Integer bathrooms;
    Boolean hasKitchen;
    Integer minOccupancy;
    Integer maxOccupancy;
    String description;
    Double areaM2;
    Integer unitTypeOption;

    //* Geo Data
    Integer localityId;
    String address;
    String postalCode;

    //* Auditoria
    Integer updaterId;

}
