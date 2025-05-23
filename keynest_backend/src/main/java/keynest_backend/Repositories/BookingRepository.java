package keynest_backend.Repositories;

import keynest_backend.Model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Integer> {

    @Override
    Optional<Booking> findById(Integer integer);
}
