package keynest_backend.Invoice;

import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import keynest_backend.Model.Client;
import keynest_backend.Model.Company;
import keynest_backend.Model.Invoice;
import keynest_backend.Repositories.CompanyRepository;
import keynest_backend.User.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.FileOutputStream;
import java.nio.file.Paths;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class InvoicePdfService {

    private static final String BASE_PATH = "src/main/resources/static/invoices/";
    private final CompanyRepository companyRepository;

    public String generatePdf(Invoice invoice, Client client, User user) throws Exception {
        // Crea el nombre del archivo
        String fileName = invoice.getInvoiceNumber() + ".pdf";
        String filePath = Paths.get(BASE_PATH, fileName).toString();

        Document document = new Document();
        PdfWriter.getInstance(document, new FileOutputStream(filePath));
        document.open();

        // Formateador de fecha
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        // Título
        Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD, Color.BLACK);
        Paragraph title = new Paragraph("Factura N.º " + invoice.getInvoiceNumber(), titleFont);
        title.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(title);

        // Datos de factura
        if (user.isCompany()) {
            Company company = companyRepository.findCompanyByUserId(user.getId());
            document.add(new Paragraph("Nombre:" + company.getCommercialName() + " (" + company.getFiscalName() + ")."));
            document.add(new Paragraph("CIF: " + company.getNif()));
            document.add(new Paragraph("Dirección: " + company.getAddress() + " " + company.getPostalCode() + " " + company.getLocality().getName() + ", " + company.getLocality().getProvince().getName() + " (" + company.getLocality().getProvince().getCountry().getName() + ")"));
            document.add(new Paragraph("Email: " + company.getEmail()));
            document.add(new Paragraph("Telf.: " + user.getPhone()));
        } else {
            document.add(new Paragraph("Nombre:" + user.getFirstname() + " " + user.getLastname()));
            document.add(new Paragraph("DNI/CIF: " + user.getDniNif()));
            document.add(new Paragraph("Dirección: " + user.getAddress() + " " + user.getPostalCode() + " " + user.getLocality().getName() + ", " + user.getLocality().getProvince().getName() + " (" + user.getLocality().getProvince().getCountry().getName() + ")"));
            document.add(new Paragraph("Email: " + user.getEmail()));
            document.add(new Paragraph("Telf.: " + user.getPhone()));
        }

        // Datos del cliente
        document.add(new Paragraph("Factura para: "));
        document.add(new Paragraph("Nombre:" + client.getName() + " " + client.getLastname()));
        document.add(new Paragraph("NIF/CIF: " + client.getDocNumber()));
        document.add(new Paragraph("Dirección: " + client.getAddress() + " " + client.getPostalCode() + " " + client.getLocality().getName() + ", " + client.getLocality().getProvince().getName() + " (" + client.getLocality().getProvince().getCountry().getName() + ")"));
        document.add(new Paragraph("Email: " + client.getEmail()));
        document.add(new Paragraph("Telf.: " + client.getPhone()));

        document.add(new Paragraph(" "));
        document.add(new Paragraph("Fecha de emisión: " + invoice.getIssueDate().format(formatter)));
        document.add(new Paragraph("Estado: " + invoice.getStatus().name()));
        document.add(new Paragraph("Reserva ID: " + invoice.getBooking().getId()));
        document.add(new Paragraph(" "));

        // Datos económicos
        document.add(new Paragraph("Base imponible: " + invoice.getTaxBase() + " €"));
        document.add(new Paragraph("Tipo de impuesto: " + invoice.getTaxType()));
        document.add(new Paragraph("Porcentaje impuesto: " + invoice.getTaxRate() + "%"));
        document.add(new Paragraph("Importe impuesto: " + invoice.getTaxAmount() + " €"));
        document.add(new Paragraph("Total: " + invoice.getTotal() + " €"));

        document.close();

        // Devuelve la ruta relativa accesible
        return "/invoices/" + fileName;
    }
}
