package keynest_backend.Repositories;

import keynest_backend.Model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Integer> {

    @Override
    Optional<Address> findById(Integer integer);
}
