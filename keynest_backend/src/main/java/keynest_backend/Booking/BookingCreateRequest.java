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
public class BookingCreateRequest {

    //* Datos de la reserva
    Integer unitId;
    LocalDate checkIn;
    LocalDate checkOut;
    Double totalPrice;
    Integer numGuests;
    String notes;

    //* Datos del cliente
    String name;
    String lastname;
    Integer genderPick;
    LocalDate birthday;
    String nationality;
    Integer docTypePick;
    String docNumber;
    String docSupportNumber;
    LocalDate docIssueDate;
    LocalDate docExpirationDate;
    Integer localityId;
    String address;
    String postalCode;
    String email;
    String phone;


}
