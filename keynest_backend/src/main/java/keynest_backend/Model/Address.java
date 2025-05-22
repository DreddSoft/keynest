package keynest_backend.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "addresses")
public class Address {

    // Identificacion
    @Id
    @GeneratedValue
    private Integer id;

    // GEO
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "locality_id", referencedColumnName = "id", nullable = false)
    private Locality locality;

    // Data
    @Column(name = "address")
    private String address;
    @Column(name = "postal_code")
    private String postalCode;
}
