package keynest_backend.Repositories;

import keynest_backend.Address.LocalityDTO;
import keynest_backend.Model.Locality;
import keynest_backend.Model.Province;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LocalityRepository extends JpaRepository<Locality, Integer> {

    @Override
    Optional<Locality> findById(Integer integer);

    @Query("""
            SELECT new keynest_backend.Address.LocalityDTO(
            l.id,
            l.name
            ) FROM Locality l
            WHERE l.province = :province
            """)
    List<LocalityDTO> getAllAsDTO(@Param("province") Province province);
}
