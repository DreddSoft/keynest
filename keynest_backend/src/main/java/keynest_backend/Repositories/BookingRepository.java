package keynest_backend.Repositories;

import keynest_backend.Booking.BookingListDTO;
import keynest_backend.Model.Booking;
import keynest_backend.Model.Unit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Integer> {

    @Override
    Optional<Booking> findById(Integer integer);

    @Query("""
            SELECT COALESCE(SUM(b.nights), 0)
            FROM Booking b
            WHERE b.checkIn >= :startDate
            AND b.checkOut <= :endDate
            AND b.unit.user.id = :userId
            """)
    Integer sumNightsByUserIdAndDateRange(
            @Param("userId") Integer userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate")LocalDate endDate
            );


    @Query("""
            SELECT b FROM Booking b
            WHERE b.unit.id = :unitId
            AND b.checkOut >= CURRENT_DATE
            ORDER BY b.checkIn ASC
            """)
    List<Booking> findNextOrCurrentBookings(
            @Param("unitId") Integer unitId
    );

    @Query("""
            SELECT new keynest_backend.Booking.BookingListDTO(
            b.id,
            b.checkIn,
            b.checkOut,
            b.nights,
            c.name,
            b.totalPrice,
            b.numGuests
            )
            FROM Booking b
            LEFT JOIN BookingClient bc ON bc.booking.id = b.id
            LEFT JOIN Client c ON bc.client.id = c.id
            WHERE b.checkIn >= CURRENT_DATE
            AND b.checkOut <= :limitDate
            AND b.unit = :unit
            ORDER BY b.checkIn
            """)
    List<BookingListDTO> getFutureBookingsForUnit(@Param("unit") Unit unit, @Param("limitDate") LocalDate limitDate);
}
