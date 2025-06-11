package keynest_backend.Invoice;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceDTO {

    Integer id;
    Integer bookingId;

    String receptorFullName;
    String receptorDocNumber;
    String invoiceNumber;
    LocalDate issueDate;
    String status;
    double taxBase;
    String taxType;
    double taxRate;
    double taxAmount;
    double total;
    String pdfUrl;

}
