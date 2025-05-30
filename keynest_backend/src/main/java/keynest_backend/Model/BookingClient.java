package keynest_backend.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bookings_clients")
public class BookingClient {

    //* Id
    @Id
    @GeneratedValue
    private Integer id;


    //* Relaciones
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", referencedColumnName = "id", nullable = false)
    private Booking booking;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", referencedColumnName = "id", nullable = false)
    private Client client;

    //* Data
    @Column(name = "is_main_guest")
    private boolean isMainGuest;
    @Column(name = "registered_in_police")
    private boolean registeredInPolice;
    @Column(name = "notes")
    private String notes;

}
