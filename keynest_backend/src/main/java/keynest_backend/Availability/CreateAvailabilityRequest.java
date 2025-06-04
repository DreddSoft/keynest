package keynest_backend.Availability;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateAvailabilityRequest {

    Integer unitId;
    LocalDate startDate;
    LocalDate endDate;
    double price;
    int minStay;


}
