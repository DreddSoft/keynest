package keynest_backend.Repositories;

import keynest_backend.Availability.AvailabilityDTO;
import keynest_backend.Model.Availability;
import keynest_backend.Model.Unit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AvailabilityRepository extends JpaRepository<Availability, Integer> {

    @Override
    Optional<Availability> findById(Integer integer);

    @Query("""
                SELECT new keynest_backend.Availability.AvailabilityDTO(
                a.dateAvailable, 
                a.pricePerNight, 
                a.minStay, 
                a.isAvailable
                ) FROM Availability a
                WHERE a.unit = :unit
                AND a.dateAvailable BETWEEN :startDate AND :endDate
            """)
    List<AvailabilityDTO> findAvailabilityByUnitAndDateRange(
            @Param("unit") Unit unit,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("""
            DELETE FROM Availability a
            WHERE a.unit = :unit
            AND a.dateAvailable BETWEEN :startDate AND :endDate
            """)
    void brutDeleteAvailabilityPerUnit(
            @Param("unit") Unit unit,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT MAX(a.dateAvailable) FROM Availability a WHERE a.unit.id = :unitId")
    LocalDate findLastAvailableDateByUnitId(@Param("unitId") Integer unitId);


    @Query("""
                SELECT a FROM Availability a 
                WHERE a.unit.id = :unitId 
                  AND a.dateAvailable = :date
            """)
    Optional<Availability> findByUnitIdAndDate(
            @Param("unitId") Integer unitId,
            @Param("date") LocalDate date
    );

    @Modifying
    @Query("""
    UPDATE Availability a
    SET a.isAvailable = :available
    WHERE a.unit.id = :unitId
      AND a.dateAvailable BETWEEN :startDate AND :endDate
""")
    int updateAvailabilityStatus(@Param("unitId") Integer unitId,
                                 @Param("startDate") LocalDate startDate,
                                 @Param("endDate") LocalDate endDate,
                                 @Param("available") boolean available);

    @Modifying
    @Query("""
    UPDATE Availability a
    SET a.pricePerNight = :newPrice
    WHERE a.unit.id = :unitId
      AND a.dateAvailable BETWEEN :startDate AND :endDate
""")
    int updatePricePerNight(@Param("unitId") Integer unitId,
                            @Param("startDate") LocalDate startDate,
                            @Param("endDate") LocalDate endDate,
                            @Param("newPrice") double newPrice);

    @Modifying
    @Query("""
    UPDATE Availability a
    SET a.minStay = :minStay
    WHERE a.unit.id = :unitId
      AND a.dateAvailable BETWEEN :startDate AND :endDate
""")
    int updateMinStay(@Param("unitId") Integer unitId,
                      @Param("startDate") LocalDate startDate,
                      @Param("endDate") LocalDate endDate,
                      @Param("minStay") int minStay);




}
