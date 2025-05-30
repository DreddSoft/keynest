package keynest_backend.Repositories;

import keynest_backend.Model.Availability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AvailabilityRepository extends JpaRepository<Availability, Integer> {

    @Override
    Optional<Availability> findById(Integer integer);

    @Query("""
                SELECT a FROM Availability a
                WHERE a.unit.id = :unitId
                AND a.dateAvailable BETWEEN :startDate AND :endDate
            """)
    List<Availability> findAvailabilityByUnitAndDateRange(
            @Param("unitId") Integer unitId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );


}
