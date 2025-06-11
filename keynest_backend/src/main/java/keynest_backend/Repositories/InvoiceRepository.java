package keynest_backend.Repositories;

import keynest_backend.Model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {

    @Query("""
                SELECT i FROM Invoice i
                WHERE i.booking.id = :bookingId
            """)
    Optional<Invoice> findByBookingId(@Param("bookingId") Integer bookingId);

    @Query("""
                SELECT MAX(i.seriesNumber)
                FROM Invoice i
                WHERE i.series = keynest_backend.Invoice.Series.F
            """)
    Integer findMaxSeriesNumberF();

    @Query("""
                SELECT MAX(i.seriesNumber)
                FROM Invoice i
                WHERE i.series = keynest_backend.Invoice.Series.A
            """)
    Integer findMaxSeriesNumberA();

    @Query("""
                SELECT MAX(i.seriesNumber)
                FROM Invoice i
                WHERE i.series = keynest_backend.Invoice.Series.R
            """)
    Integer findMaxSeriesNumberR();

    @Query("""
                SELECT i FROM Invoice i
                WHERE i.booking.unit.id = :unitId
                ORDER BY i.issueDate
            """)
    List<Invoice> findByUnitId(@Param("unitId") Integer unitId);


}
