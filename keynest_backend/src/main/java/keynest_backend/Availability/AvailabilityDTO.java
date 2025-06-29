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
public class AvailabilityDTO {


    private LocalDate date;
    private double price;
    private int minStay;
    private boolean isAvailable;


}
