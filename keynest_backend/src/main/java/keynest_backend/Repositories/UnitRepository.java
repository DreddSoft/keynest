package keynest_backend.Repositories;

import keynest_backend.Model.Unit;
import keynest_backend.Unit.UnitCardDTO;
import keynest_backend.Unit.UnitDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UnitRepository extends JpaRepository<Unit, Integer> {

    @Override
    Optional<Unit> findById(Integer unitId);

    @Override
    List<Unit> findAll();

    @Query("""
                SELECT u
                FROM Unit u
                JOIN u.locality l
                WHERE u.user.id = :userId
                AND u.isActive = true
                ORDER BY u.id
            """)
    List<Unit> findAllByUser(@Param("userId") Integer userId);

}
