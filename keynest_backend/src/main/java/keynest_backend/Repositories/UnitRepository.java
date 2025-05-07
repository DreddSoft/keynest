package keynest_backend.Repositories;

import keynest_backend.Model.Unit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UnitRepository extends JpaRepository<Unit, Integer> {

    @Override
    Optional<Unit> findById(Integer integer);

    @Override
    List<Unit> findAll();

}
