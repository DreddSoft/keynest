package keynest_backend.Repositories;

import keynest_backend.Model.Locality;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LocalityRepository extends JpaRepository<Locality, Integer> {

    @Override
    Optional<Locality> findById(Integer integer);
}
