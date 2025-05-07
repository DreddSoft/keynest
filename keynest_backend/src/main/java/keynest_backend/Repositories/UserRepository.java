package keynest_backend.Repositories;

import keynest_backend.Model.Country;
import keynest_backend.Model.Locality;
import keynest_backend.Model.Province;
import keynest_backend.User.User;
import keynest_backend.User.UserDTO;
import keynest_backend.User.UserLocationDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    // Esto es un queryMethod
    Optional<User> findByEmail(String email);


    @Modifying()
    @Query("UPDATE User u SET " + // Ojo, en consultas HQL se usa el nombre de la clase, no de la tabla
            "u.username=:username, " +
            "u.email=:email, " +
            "u.password=:password, " +
            "u.firstname=:firstname, " +
            "u.lastname=:lastname, " +
            "u.birthDate=:birthDate, " +
            "u.phone1=:phone1, " +
            "u.phone2=:phone2, " +
            "u.profilePictureUrl=:profilePictureUrl, " +
            "u.country=:country, " +
            "u.province=:province, " +
            "u.locality=:locality, " +
            "u.address=:address, " +
            "u.postalCode=:postalCode, " +
            "u.companyId=:companyId, " +
            "u.updatedAt=:updatedAt, " +
            "u.language=:language " +
            "WHERE u.id = :id")
    void updateUser(@Param(value = "id") Integer id,
                    @Param(value = "username") String username,
                    @Param(value = "email") String email,
                    @Param(value = "password") String password,
                    @Param(value = "firstname") String firsname,
                    @Param(value = "lastname") String lastname,
                    @Param(value = "birthDate") Date birthdate,
                    @Param(value = "phone1") String phone1,
                    @Param(value = "phone2") String phone2,
                    @Param(value = "profilePictureUrl") String profilePictureUrl,
                    @Param(value = "country") Country country,
                    @Param(value = "province") Province province,
                    @Param(value = "locality")Locality locality,
                    @Param(value = "address") String address,
                    @Param(value = "postalCode") String postalCode,
                    @Param(value = "companyId") Integer companyId,
                    @Param(value = "updatedAt") LocalDateTime updatedAt,
                    @Param(value = "language") String language);


    @Query("SELECT new keynest_backend.User.UserLocationDTO(" +
            "u.username, " +
            "u.firstname, " +
            "u.lastname, " +
            "c.name AS countryName, " +
            "p.name AS provinceName, " +
            "l.name AS localityName) " +
            "FROM User u " +
            "JOIN u.country c " +
            "JOIN u.province p " +
            "JOIN u.locality l " +
            "WHERE u.id = :userId")
    UserLocationDTO getUserLocationInfo(@Param("userId") Integer userId);


}
