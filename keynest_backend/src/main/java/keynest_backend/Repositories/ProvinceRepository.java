package keynest_backend.Repositories;

import keynest_backend.Address.ProvinceDTO;
import keynest_backend.Model.Country;
import keynest_backend.Model.Province;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProvinceRepository extends JpaRepository<Province, Integer> {

    @Override
    Optional<Province> findById(Integer integer);

    @Query("""
            SELECT new keynest_backend.Address.ProvinceDTO(
            p.id,
            p.name
            ) FROM Province p
            WHERE p.country = :country
            """)
    List<ProvinceDTO> getAllAsDTO(@Param("country") Country country);
}
