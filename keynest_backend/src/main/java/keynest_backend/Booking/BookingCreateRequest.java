package keynest_backend.Booking;

import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingCreateRequest {

    //* Relacion
    private Integer unitId;

    //* Datos
    private LocalDate checkIn;
    private LocalDate checkOut;
    private double totalPrice;
    private int numGuests;
    private String notes;

    private Integer creatorId;


}
