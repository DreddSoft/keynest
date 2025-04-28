package keynest_backend.Repositories;

import keynest_backend.Model.Province;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProvinceRepository extends JpaRepository<Province, Integer> {

    @Override
    Optional<Province> findById(Integer integer);
}
