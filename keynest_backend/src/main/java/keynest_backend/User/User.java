package keynest_backend.User;

import jakarta.persistence.*;
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

    //* Identificación y autenticación
    @Id
    @GeneratedValue
    private Integer id;

    //* Data principal
    @Column(name = "email", nullable = false, unique = true)
    private String email;
    @Column(name = "password", nullable = false)
    private String password;
    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER; // Por defecto el rol es USER

    //* Informacion personal
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

    //* GEO Data
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id", referencedColumnName = "id", nullable = false)
    private Country country;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "province_id", referencedColumnName = "id", nullable = false)
    private Province province;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "locality_id", referencedColumnName = "id", nullable = false)
    private Locality locality;
    @Column(name = "address")
    private String address;
    @Column(name = "postal_code")
    private String postalCode;

    //* Company Data
    @Column(name = "is_company", nullable = true)
    private boolean isCompany;
    @Column(name = "company_id", nullable = true)
    private Integer companyId = null;

    //* Auditoria
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", referencedColumnName = "id", nullable = false)
    private User createdBy;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by", referencedColumnName = "id", nullable = false)
    private User updatedBy;
    @Column(name = "language")
    private String language;
    @Column(name = "last_login", nullable = true)
    private LocalDateTime lastLogin;
    @Column(name = "is_active", nullable = false)
    private boolean isActive = true; // Por defecto el usuario esta activo


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
