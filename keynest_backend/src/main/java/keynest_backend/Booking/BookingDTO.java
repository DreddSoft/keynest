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
public class BookingDTO {

    // DAtos de la reserva
    LocalDate checkIn;
    LocalDate checkOut;
    boolean isPaid;
    String notes;
    int status;

    // Datos del cliente princiapl
    String name;
    String lastname;
    String email;
}
