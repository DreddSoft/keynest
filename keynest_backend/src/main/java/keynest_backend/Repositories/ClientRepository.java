package keynest_backend.Repositories;

import keynest_backend.Client.ClientDTO;
import keynest_backend.Model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Integer> {

    @Override
    Optional<Client> findById(Integer clientId);

    // Buscar cliente por número de documento
    @Query("SELECT c FROM Client c WHERE c.docNumber = :docNumber")
    Client findByDocNumber(@Param("docNumber") String docNumber);

    // Buscar cliente por email
    @Query("SELECT c FROM Client c WHERE c.email = :email")
    Client findByEmail(@Param("email") String email);

    // Buscar clientes por unidad
    @Query("""
        SELECT bc.client
        FROM BookingClient bc
        JOIN bc.booking b
        WHERE b.unit.id = :unitId
    """)
    List<Client> findClientsByUnitId(@Param("unitId") Integer unitId);



}
