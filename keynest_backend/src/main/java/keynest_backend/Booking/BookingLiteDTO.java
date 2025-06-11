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
public class BookingLiteDTO {

    Integer bookingId;
    LocalDate checkIn;
    LocalDate checkOut;
    Integer status;
    Integer nights;
    Double total;

}
