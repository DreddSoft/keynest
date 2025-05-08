package keynest_backend.Model;

import jakarta.persistence.*;
import keynest_backend.Client.DocumentTypes;
import keynest_backend.Client.Gender;
import keynest_backend.User.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "clients", uniqueConstraints = {
        @UniqueConstraint(columnNames = "{id}")
})
public class Client {
    // Identificardor
    @Id
    @GeneratedValue
    private Integer id;

    // Nombre completo
    @Column(name = "name", nullable = false)
    private String name;
    @Column(name = "middle_name")
    private String middleName;
    @Column(name = "lastname1", nullable = false)
    private String lastname1;
    @Column(name = "lastname2")
    private String lastname2;

    // Genero y fecha de nacimiento
    @Column(name = "gender", nullable = false)
    private Gender gender;
    @Column(name = "birthday", nullable = false)
    private Date birthday;

    // Nationality and documents
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nationality_country_id", referencedColumnName = "id", nullable = false)
    private Country nationality;
    @Column(name = "document_type", nullable = false)
    private DocumentTypes documentType;
    @Column(name = "document_number", nullable = false)
    private String documentNumber;
    @Column(name = "document_support_number")
    private String documentSupportNumber;
    @Column(name = "document_issue_date", nullable = false)
    private Date documentIssueDate;
    @Column(name = "document_expiration_date", nullable = false)
    private Date documentExpirationDate;

    // Datos de direcccion para CRM
    @Column(name = "address")
    private String address;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id", referencedColumnName = "id")
    private Country country;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "province_id", referencedColumnName = "id")
    private Province province;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "locality_id", referencedColumnName = "id")
    private Locality locality;
    @Column(name = "postal_code")
    private String postalCode;

    // Contacto
    @Column(name = "email", nullable = false)
    private String email;
    @Column(name = "phone", nullable = false)
    private String phone;
    @Column(name = "is_email_verified")
    private boolean isEmailVerified;
    @Column(name = "is_phone_verified")
    private boolean isPhoneVerified;

    // Auditoria
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", referencedColumnName = "id")
    private User createdBy;
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by", referencedColumnName = "id")
    private User updatedBy;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;
}
