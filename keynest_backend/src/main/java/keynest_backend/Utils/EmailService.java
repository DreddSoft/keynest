package keynest_backend.Utils;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import keynest_backend.Model.Booking;
import keynest_backend.Model.BookingClient;
import keynest_backend.Model.Client;
import keynest_backend.Model.Unit;
import keynest_backend.Repositories.BookingClientRepository;
import keynest_backend.Repositories.BookingRepository;
import keynest_backend.Repositories.UnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

/**
 * Servicio responsable del envío de correos electrónicos a los clientes.
 * Utiliza plantillas HTML para una presentación profesional.
 */
@Service
@RequiredArgsConstructor
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;
    private final UnitRepository unitRepository;
    private final BookingRepository bookingRepository;
    private final BookingClientRepository bookingClientRepository;

    /**
     * Envía un correo electrónico al cliente principal de una reserva,
     * invitándole a completar el proceso de Pre-Check-In.
     *
     * @param bookingId Identificador de la reserva.
     * @throws MessagingException si ocurre un error durante el envío del correo.
     */
    public void sendPreCheckInEmail(Integer bookingId) throws MessagingException {

        // Sacar la reserva y la unidad
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException(String.format("No se encuentra la reserva: %d.", bookingId)));

        Unit unit = booking.getUnit();

        // Sacar la relacion
        BookingClient bc = bookingClientRepository.findBookingMainClientByBooking(booking);
        if (bc == null) {
            throw new IllegalArgumentException("No se encuentra el cliente principal");
        }

        Client mainGuest = bc.getClient();

        String subject = "Complete su Pre-Check-In";
        String link = "http://localhost:5173/precheckin/" + bookingId;

        String htmlContent = """
            <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                <h2 style="color: #2a4d9b;">¡Bienvenido a <strong>%s</strong>!</h2>
                <p>Estimado/a <strong>%s</strong>,</p>
                <p>Gracias por confiar en nosotros para su próxima estancia.</p>
                <p>Para agilizar su llegada, le pedimos que complete el proceso de <strong>Pre-Check-In</strong> antes de su llegada.</p>
                <div style="margin: 20px 0;">
                    <a href="%s" style="background-color: #2a4d9b; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">
                        Completar Pre-Check-In
                    </a>
                </div>
                <p>Si tiene alguna duda, no dude en contactarnos.</p>
                <p style="margin-top: 30px;">Saludos cordiales,<br/>Equipo de KeyNest</p>
            </div>
        """.formatted(unit.getName(), mainGuest.getName(), link);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(mainGuest.getEmail());
        helper.setSubject(subject);
        helper.setText(htmlContent, true); // true = HTML

        mailSender.send(message);
    }
}
