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

    Integer id;

    // DAtos de la reserva
    LocalDate checkIn;
    LocalDate checkOut;
    double price;
    boolean isPaid;
    int numGuests;
    String notes;
    int status;
    int nights;

    // Datos del cliente princiapl
    String name;
    String lastname;
    String email;
    Boolean isActive;
}
