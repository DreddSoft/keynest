package keynest_backend.Repositories;

import keynest_backend.Model.Country;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CountryRepository extends JpaRepository<Country, Integer> {
    @Override
    Optional<Country> findById(Integer integer);
}
