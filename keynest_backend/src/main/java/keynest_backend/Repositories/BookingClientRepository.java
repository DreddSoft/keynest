package keynest_backend.Repositories;

import keynest_backend.Model.BookingClient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingClientRepository extends JpaRepository<BookingClient, Integer> {
}
