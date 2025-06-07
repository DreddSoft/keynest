package keynest_backend.Unit;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UnitActivateRequest {

    // Id de la unidad
    Integer unitId;

    // Id del admin
    Integer updaterId;
}
