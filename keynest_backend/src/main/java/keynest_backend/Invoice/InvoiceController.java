package keynest_backend.Invoice;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173"})
public class InvoiceController {

    @Autowired
    private final InvoiceService invoiceService;

    @PostMapping()
    public ResponseEntity<InvoicePDFUrlResponse> createInvoice (@RequestBody InvoiceCreateRequest request) throws Exception {

        return ResponseEntity.ok(invoiceService.createInvoice(request));
    }




}
