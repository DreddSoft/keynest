package keynest_backend.Repositories;

import keynest_backend.Client.ClientDTO;
import keynest_backend.Model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Integer> {

    @Override
    Optional<Client> findById(Integer clientId);

    // Query propia para buscar todos los clientes por una unidad
}
