package keynest_backend.Unit;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UnitDTO {
    //* Identificación y autenticación
    private Integer id;

    //* Informacion personal
    private String name;
    private int rooms;
    private int bathrooms;
    private boolean hasKitchen;
    private int minOccupancy;
    private int maxOccupancy;
    private double areaM2;
    private String description;
    private String type;

    //* GEO Data
    private String countryName;
    private String provinceName;
    private String localityName;
    private String address;
    private String postalCode;

    //* Audit
    private boolean isActive;

}
