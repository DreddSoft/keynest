package keynest_backend.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"username"}),
        @UniqueConstraint(columnNames = {"email"})
})
public class User implements UserDetails {

    @Id
    @GeneratedValue
    private Integer id;
    @Column(name = "username", nullable = false, unique = true)
    private String username;
    @Column(name = "email", nullable = false, unique = true)
    private String email;
    @Column(name = "password", nullable = false)
    private String password;
    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER; // Por defecto el rol es USER
    @Column(name = "is_active", nullable = false)
    private boolean isActive = true; // Por defecto el usuario esta activo
    @Column(name = "last_login", nullable = true)
    private LocalDateTime lastLogin;
    @Column(name = "failed_attempts")
    private int failedAttempts;

    // Informacion personal
    @Column(name = "first_name", nullable = false)
    private String firstname;
    @Column(name = "last_name", nullable = false)
    private String lastname;
    @Column(name = "birth_date")
    private Date birthDate;
    @Column(name = "phone1")
    private String phone1;
    @Column(name = "phone2")
    private String phone2;
    @Column(name = "profile_picture_url")
    private String profilePictureUrl;

    // Contacto y localizacion
    @Column(name = "country_id")
    private int countryId;
    @Column(name = "province_id")
    private int provinceId;
    @Column(name = "locality_id")
    private int localityId;
    @Column(name = "address")
    private String address;
    @Column(name = "postal_code")
    private String postalCode;

    // Empresa
    @Column(name = "company_id", nullable = true)
    private Integer companyId = null;

    // Datos del sistema
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    @Column(name = "language")
    private String language;


    // La interfaz nos obliga a implementar estos metodos, pero no los vamos a usar, porque la validacion la hacemos con JWT
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
