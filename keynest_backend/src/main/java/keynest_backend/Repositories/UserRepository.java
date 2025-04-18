package keynest_backend.Repositories;

import keynest_backend.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    // Esto es un queryMethod
    Optional<User> findByEmail(String email);


}
