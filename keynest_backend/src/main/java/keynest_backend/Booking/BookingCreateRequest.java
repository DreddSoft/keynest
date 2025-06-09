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
    double totalPrice;
    int numGuests;
    String notes;
    Integer creatorId;

    //* Datos del cliente
    String name;
    String lastname;
    int genderPick;
    LocalDate birthday;
    String nationality;
    int docTypePick;
    String docNumber;
    String docSupportNumber;
    LocalDate docIssueDate;
    LocalDate docExpirationDate;
    int localityId;
    String address;
    String postalCode;
    String email;
    String phone;


}
