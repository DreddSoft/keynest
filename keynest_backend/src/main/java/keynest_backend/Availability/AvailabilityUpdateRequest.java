package keynest_backend.Availability;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityUpdateRequest {

    int availabilityId;

    double price;
    int minStay;
}
