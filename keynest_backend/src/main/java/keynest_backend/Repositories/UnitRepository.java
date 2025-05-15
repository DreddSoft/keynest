package keynest_backend.Repositories;

import keynest_backend.Model.Unit;
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
                SELECT new keynest_backend.Unit.UnitDTO(
                    u.id,
                    u.name,
                    c.name,
                    p.name,
                    l.name,
                    u.address,
                    u.buildingBlock,
                    u.streetNumber,
                    u.floor,
                    u.doorLetter,
                    u.postalCode,
                    u.latitude,
                    u.longitude,
                    u.rooms,
                    u.bathrooms,
                    u.hasKitchen,
                    u.minOccupancy,
                    u.maxOccupancy,
                    u.areaM2,
                    u.description
                )
                FROM Unit u
                JOIN u.country c
                JOIN u.province p
                JOIN u.locality l
                WHERE u.user.id = :userId
            """)
    List<UnitDTO> findAllByUser(@Param("userId") Integer userId);

}
