package keynest_backend.Repositories;

import keynest_backend.Model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {

    @Query("""
                SELECT i FROM Invoice i
                WHERE i.booking.id = :bookingId
            """)
    Optional<Invoice> findByBookingId(@Param("bookingId") Integer bookingId);
}
