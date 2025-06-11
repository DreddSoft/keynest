package keynest_backend.Invoice;

import keynest_backend.Model.Booking;
import keynest_backend.Model.Invoice;
import keynest_backend.Repositories.BookingRepository;
import keynest_backend.Repositories.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    // Repositorios
    private final InvoiceRepository invoiceRepository;
    private final BookingRepository bookingRepository;


    public InvoicePDFUrlResponse createInvoice (InvoiceCreateRequest request) {

        // Primero comprobar que existe la reserva
        Booking booking = bookingRepository.findById(request.getBookingId()).orElseThrow(() -> new IllegalArgumentException("No se ha encontrado la reserva."));

        // Yo recibo el total de la reserva, de ahí tengo que sacar la base imponible
        // TODO: en un futuro implementación por PAISES, para TFG se da por hecho que todos ESPAÑOLES
        final String TAX_TYPE = "IVA";
        final double TAX_RATE = 10.0; // El IVA en alojamiento es del 10%

        // Sanitizamos en variables para el cálculo
        double total = request.getTotal();
        double taxBase = total / 1.10;
        double taxAmount = total - taxBase;

        // Obtenemos el último número de la serie F
        Integer lastNumberFSeries = invoiceRepository.findMaxSeriesNumberF();

        if (lastNumberFSeries == null) {    // Se entiende que es el primero
            lastNumberFSeries = 1;
        }

        // Crear la factura
        Invoice invoice = Invoice.builder()
                .booking(booking)
                .series(Series.F)
                .seriesNumber(lastNumberFSeries)
                .invoiceNumber(Series.F.name() + lastNumberFSeries)
                .issueDate(LocalDate.now())
                .status(InvoiceStatus.ISSUED)
                .taxBase(taxBase)
                .taxType(TAX_TYPE)
                .taxRate(TAX_RATE)
                .taxAmount(taxAmount)
                .total(total)
                .pdfUrl(null)
                .build();

        // Guardaos
        invoiceRepository.save(invoice);




    }

}
