package keynest_backend.Repositories;

import keynest_backend.Model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CompanyRepository extends JpaRepository<Company, Integer> {

    @Query("""
                SELECT c FROM Company c
                WHERE c.user.id = :userId
            """)
    Company findCompanyByUserId(@Param("userId") Integer userId);

}


