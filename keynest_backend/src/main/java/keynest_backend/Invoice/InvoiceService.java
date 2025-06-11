package keynest_backend.Invoice;

import keynest_backend.Logs.Log;
import keynest_backend.Model.Booking;
import keynest_backend.Model.BookingClient;
import keynest_backend.Model.Client;
import keynest_backend.Model.Invoice;
import keynest_backend.Repositories.BookingClientRepository;
import keynest_backend.Repositories.BookingRepository;
import keynest_backend.Repositories.InvoiceRepository;
import keynest_backend.Repositories.UserRepository;
import keynest_backend.User.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    // Repositorios
    private final InvoiceRepository invoiceRepository;
    private final BookingRepository bookingRepository;
    private final InvoicePdfService invoicePdfService;
    private final BookingClientRepository bookingClientRepository;


    /**
     * Método de servicio para crear un facturar y generar us PDF
     *
     * @param request
     * @return InvoicePdfResponse - un objeto de la clase que contiene la url del PDF de la factura
     * @throws Exception
     */
    public InvoicePDFUrlResponse createInvoice (InvoiceCreateRequest request) throws Exception {

        // Primero comprobar que existe la reserva
        Booking booking = bookingRepository.findById(request.getBookingId()).orElseThrow(() -> new IllegalArgumentException("No se ha encontrado la reserva."));
        // Sacar el usuario
        User user = booking.getUnit().getUser();

        // Sacar el cliente
        BookingClient bc = bookingClientRepository.findBookingMainClientByBooking(booking);

        Log.write(user.getId(), "InvoiceService | createInvoice", "Se inicia la creación de una factura..");


        if (bc == null) {
            Log.write(user.getId(), "InvoiceService | createInvoice", "No se encuentra la relacion entre cliente y reserva.");
            throw new IllegalArgumentException("No se encuentra la relacion entre cliente y reserva.");
        }

        // El cliente principal
        Client mainGuest = bc.getClient();

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



        Log.write(user.getId(), "InvoiceService | createInvoice", "Se crea la factura con número: " + invoice.getInvoiceNumber() + ".");


        // Generamos el PDF y guardamos la url
        String urlPdfInvoice = invoicePdfService.generatePdf(invoice, mainGuest, user);

        // Seteamos en invoice
        invoice.setPdfUrl(urlPdfInvoice);

        // Guardaos
        invoiceRepository.save(invoice);

        return InvoicePDFUrlResponse.builder().url(urlPdfInvoice).build();

    }

}
