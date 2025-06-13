package keynest_backend.Invoice;

import keynest_backend.Model.*;
import keynest_backend.Utils.Log;
import keynest_backend.Repositories.*;
import keynest_backend.User.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    // Repositorios
    private final InvoiceRepository invoiceRepository;
    private final BookingRepository bookingRepository;
    private final InvoicePdfService invoicePdfService;
    private final BookingClientRepository bookingClientRepository;
    private final UnitRepository unitRepository;
    private final UserRepository userRepository;


    /**
     * Método de servicio para crear un facturar y generar us PDF
     *
     * @param request
     * @return InvoicePdfResponse - un objeto de la clase que contiene la url del PDF de la factura
     * @throws Exception
     */
    public InvoicePDFUrlResponse createInvoice(InvoiceCreateRequest request) throws Exception {

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

        // Antes de guardar ponemos el stado de la reserva a 4 (facturada)
        invoice.getBooking().setStatus(4);

        bookingRepository.save(invoice.getBooking());

        // Guardaos
        invoiceRepository.save(invoice);

        return InvoicePDFUrlResponse.builder().url(urlPdfInvoice).build();

    }

    /**
     * Método de servicio que recupera una lista de facturas asociadas a una unidad específica y las transforma en DTOs.
     * Verifica que tanto la unidad como el usuario existen antes de proceder.
     *
     * @param unitId ID del unidad de alojamiento.
     * @return Lista de objetos InvoiceDTO correspondientes a la unidad.
     * @throws IllegalArgumentException si el usuario o la unidad no existen.
     */
    public List<InvoiceDTO> getInvoicesByUnit(Integer unitId) {

        // Sacar unidad
        Unit unit = unitRepository.findById(unitId).orElseThrow(() -> new IllegalArgumentException(
                String.format("No se encuentra la unidad %d", unitId)
        ));

        Integer userId = unit.getUser().getId();

        // Verificamos que la unidad y el usuario existen
        if (!unitRepository.existsById(unitId) || !userRepository.existsById(userId)) {
            Log.write(userId, "InvoiceService | getInvoicesByUnit",
                    "No existen la unidad o el usuario informados.");
            throw new IllegalArgumentException("No existen la unidad o el usuario informados.");
        }

        // Se obtiene la lista de facturas para la unidad
        List<Invoice> invoices = invoiceRepository.findByUnitId(unitId);

        // Si no hay facturas, se registra en el log y se devuelve una lista vacía
        if (invoices.isEmpty()) {
            Log.write(userId, "InvoiceService | getInvoicesByUnit",
                    "No existen facturas para esta unidad: " + unitId);
            return Collections.emptyList();
        }

        // Se transforma cada entidad Invoice a su DTO correspondiente
        List<InvoiceDTO> invoiceDTOS = new ArrayList<>();

        for (Invoice invoice : invoices) {
            // Se obtiene el cliente principal de la reserva asociada a la factura
            Client client = bookingClientRepository
                    .findBookingMainClientByBooking(invoice.getBooking())
                    .getClient();

            // Se construye el DTO con los datos requeridos
            InvoiceDTO dto = InvoiceDTO.builder()
                    .id(invoice.getId())
                    .bookingId(invoice.getBooking().getId())
                    .receptorFullName(client.getName() + " " + client.getLastname())
                    .receptorDocNumber(client.getDocNumber())
                    .invoiceNumber(invoice.getInvoiceNumber())
                    .issueDate(invoice.getIssueDate())
                    .status(invoice.getStatus().name())
                    .taxBase(invoice.getTaxBase())
                    .taxType(invoice.getTaxType())
                    .taxRate(invoice.getTaxRate())
                    .taxAmount(invoice.getTaxAmount())
                    .total(invoice.getTotal())
                    .pdfUrl(invoice.getPdfUrl())
                    .build();

            invoiceDTOS.add(dto);
        }

        // Log final y retorno de la lista
        Log.write(userId, "InvoiceService | getInvoicesByUnit",
                "Se obtiene lista de facturas para la unidad: " + unitId);
        return invoiceDTOS;

    }

}
