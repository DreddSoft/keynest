package keynest_backend.Invoice;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    /**
     * Endpoint para obtener todas las facturas asociadas a una unidad específica
     * Siempre que pertenezcan al usuario autenticado o autorizado
     *
     * @param unitId ID de la unidad de alojamiento.
     * @return ResponseEntity con la lista de InvoiceDTO o 400 si no se encuentran facturas.
     */
    @GetMapping(value = "list/{unitId}")
    public ResponseEntity<List<InvoiceDTO>> getInvoicesByUnit (@PathVariable Integer unitId) {

        List<InvoiceDTO> invoices = invoiceService.getInvoicesByUnit(unitId);

        // Si la lista está vacía, se retorna 404 not found.
        if (invoices.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Si hay resultados, se devuelven con estado 200 OK
        return ResponseEntity.ok(invoices);

    }




}
