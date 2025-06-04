package keynest_backend.Repositories;

import keynest_backend.Model.BookingClient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingClientRepository extends JpaRepository<BookingClient, Integer> {

    @Query("""
    SELECT bc.client.id
    FROM BookingClient bc
    WHERE bc.booking.id = :bookingId
    AND bc.isMainGuest = true
    """)
    Integer findMainClientIdByBookingId(@Param("bookingId") Integer bookingId);


}
