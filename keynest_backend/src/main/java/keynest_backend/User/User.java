package keynest_backend.User;

import jakarta.persistence.*;
import keynest_backend.Model.Address;
import keynest_backend.Model.Country;
import keynest_backend.Model.Locality;
import keynest_backend.Model.Province;
import lombok.*;
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

    //* Identificación
    @Id
    @GeneratedValue
    private Integer id;

    //* Autenticación
    @Column(name = "email", nullable = false, unique = true)
    private String email;
    @Column(name = "password", nullable = false)
    private String password;
    @Column(name = "role", nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER; // Por defecto el rol es USER

    //* Data
    @Column(name = "first_name", nullable = false)
    private String firstname;
    @Column(name = "last_name", nullable = false)
    private String lastname;
    @Column(name = "birth_date", nullable = false)
    private Date birthDate;
    @Column(name = "phone", nullable = false)
    private String phone;
    @Column(name = "profile_picture_url")
    private String profilePictureUrl;

    //* GEO
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "locality_id", referencedColumnName = "id")
    private Locality locality;
    @Column(name = "address")
    private String address;
    @Column(name = "postal_code")
    private String postalCode;

    // Other info
    @Column(name = "is_company")
    private boolean isCompany;

    //* Auditoria
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    @Column(name = "last_login", nullable = true)
    private LocalDateTime lastLogin;
    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;


    // La interfaz nos obliga a implementar estos metodos, pero no los vamos a usar, porque la validacion la hacemos con JWT
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return getEmail();
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
