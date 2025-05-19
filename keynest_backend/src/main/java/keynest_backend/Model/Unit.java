package keynest_backend.Model;

import jakarta.persistence.*;
import keynest_backend.Unit.UnitType;
import keynest_backend.User.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "units", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"id"})
})
public class Unit {

    //* Identificación y autenticación
    @Id
    @GeneratedValue
    private Integer id;

    //* Data principal
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    //* Informacion personal
    @Column(name = "name", nullable = false)
    private String name;
    @Column(name = "rooms", nullable = false)
    private Integer rooms = 1;  // Por defecto 1
    @Column(name = "bathrooms", nullable = false)
    private Integer bathrooms = 1;  // Por defecto 1
    @Column(name = "has_kitchen", nullable = false)
    private boolean hasKitchen = false; // Por defecto no tiene cocina
    @Column(name = "min_occupancy", nullable = false)
    private Integer minOccupancy = 1;   // Por defecto 1
    @Column(name = "max_occupancy", nullable = false)
    private Integer maxOccupancy = 1;   // Por defecto 1
    @Column(name = "area_m2")
    private double areaM2;
    @Column(name = "description")
    private String description;
    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private UnitType type;


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
    @Column(name = "address", nullable = false)
    private String address;
    @Column(name = "postal_code")
    private String postalCode;
    @Column(name = "latitude")
    private double latitude;
    @Column(name = "longitude")
    private double longitude;

    //* Auditoria
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", referencedColumnName = "id", nullable = false)
    private User createdBy;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by", referencedColumnName = "id", nullable = false)
    private User updatedBy;
    @Column(name = "is_active")
    private boolean isActive = true;

}
