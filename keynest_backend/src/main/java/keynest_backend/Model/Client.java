package keynest_backend.Model;

import jakarta.persistence.*;
import keynest_backend.Client.DocumentTypes;
import keynest_backend.Client.Gender;
import keynest_backend.User.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "clients", uniqueConstraints = {
        @UniqueConstraint(columnNames = "{id}"),
        @UniqueConstraint(columnNames = "{email}")

})
public class Client {
    //* Identificación
    @Id
    @GeneratedValue
    private Integer id;

    //* Datos
    @Column(name = "name", nullable = false)
    private String name;
    @Column(name = "lastname", nullable = false)
    private String lastname;
    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false)
    private Gender gender;
    @Column(name = "birthday", nullable = false)
    private LocalDate birthday;

    //* Docs info
    @Column(name = "nationality", nullable = false)
    private String nationality;
    @Enumerated(EnumType.STRING)
    @Column(name = "doc_type", nullable = false)
    private DocumentTypes docType;
    @Column(name = "doc_number", nullable = false)
    private String docNumber;
    @Column(name = "doc_support_number")
    private String docSupportNumber;
    @Column(name = "doc_issue_date", nullable = false)
    private LocalDate docIssueDate;
    @Column(name = "doc_expiration_date", nullable = false)
    private LocalDate docExpirationDate;

    //* GEO
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "locality_id", referencedColumnName = "id")
    private Locality locality;
    @Column(name = "address")
    private String address;
    @Column(name = "postal_code")
    private String postalCode;

    //* Contacto
    @Column(name = "email", nullable = false)
    private String email;
    @Column(name = "phone", nullable = false)
    private String phone;
    @Column(name = "notes")
    private String notes;

    //* Auditoria
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
