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

    //* Relacion
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
    String type;

    //* GEO Data
    int localityId;
    String address;
    String postalCode;

    //* Auditoria
    // Los datos de seguridad no se piden en el request para crear, se automatizan en servicio
    Integer creatorId;

}
