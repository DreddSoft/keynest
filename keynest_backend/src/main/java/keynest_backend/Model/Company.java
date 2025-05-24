package keynest_backend.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "companies", uniqueConstraints = {@UniqueConstraint(columnNames = {"id"})})
public class Company {

    //* Id
    @Id
    @GeneratedValue
    private Integer id;

    //* Relaciones
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private Integer userId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "locality_id", referencedColumnName = "id", nullable = false)
    private Integer localityId;

    //* Data
    @Column(name = "fiscal_name", nullable = false)
    private String fiscalName;
    @Column(name = "commercial_name")
    private String commercialName;
    @Column(name = "nif", nullable = false)
    private String nif;
    @Column(name = "iban", nullable = false)
    private String iban;
    @Column(name = "email", nullable = false)
    private String email;
    @Column(name = "address", nullable = false)
    private String address;
    @Column(name = "postal_code", nullable = false)
    private String postalCode;

}
