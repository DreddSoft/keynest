package keynest_backend.Booking;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingListDTO {

    Integer id;
    LocalDate checkIn;
    LocalDate checkOut;
    int noches;
    String name;
    double total;
    int guests;

}
