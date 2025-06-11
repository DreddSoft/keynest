package keynest_backend.Model;

import jakarta.persistence.*;
import keynest_backend.Invoice.InvoiceStatus;
import keynest_backend.Invoice.Series;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "invoices", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"id, invoice_number"})
})
public class Invoice {

    //* id
    @Id
    @GeneratedValue
    private Integer id;

    //* Relaciones
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", referencedColumnName = "id", nullable = false)
    private Booking booking;

    //* Data
    @Enumerated(EnumType.STRING)
    @Column(name = "series", nullable = false)
    private Series series;
    @Column(name = "series_number", nullable = false)
    private Integer seriesNumber;
    @Column(name = "invoice_number", nullable = false)
    private String invoiceNumber;
    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private InvoiceStatus status;
    @Column(name = "tax_base", nullable = false)
    private double taxBase;
    @Column(name = "tax_type", nullable = false)
    private String taxType;
    @Column(name = "tax_rate", nullable = false)
    private double taxRate;
    @Column(name = "tax_amount", nullable = false)
    private double taxAmount;
    @Column(name = "total", nullable = false)
    private double total;
    @Column(name = "pdf_url")
    private String pdfUrl;
}
