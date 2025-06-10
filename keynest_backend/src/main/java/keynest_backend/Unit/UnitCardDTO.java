package keynest_backend.Unit;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UnitCardDTO {

    // Id
    Integer id;

    // Data
    String name;
    String type;
    String address;
    String localityName;

    // Valores que pueden ser nulos
    LocalDate checkIn;
    LocalDate checkOut;
    int nights;
    Integer bookingId;
    int bookingStatus;

}
