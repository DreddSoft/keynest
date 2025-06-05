package keynest_backend.Repositories;

import keynest_backend.Address.CountryDTO;
import keynest_backend.Model.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CountryRepository extends JpaRepository<Country, Integer> {
    @Override
    Optional<Country> findById(Integer integer);

    @Query("""
            SELECT new keynest_backend.Address.CountryDTO(
            c.id, 
            c.name, 
            c.initials
            ) FROM Country c
            """)
    List<CountryDTO> getAllAsDTO();
}
