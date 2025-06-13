package keynest_backend.Booking;

import jakarta.mail.MessagingException;
import keynest_backend.Model.Booking;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/booking")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173"})
public class BookingController {

    // Clases de servicio
    @Autowired
    private final BookingService bookingService;

    /**
     * Endpoint para obtener todos las noches reservadas en todas las unidades de un usuario
     * @param userId - id de usuario pasado como parametro
     */
    @GetMapping(value = "getNights/{userId}")
    public ResponseEntity<BookingLiteResponse> getAllNights (@PathVariable Integer userId) {

        Integer nights = bookingService.getAllBookedNightsFromUser(userId);

        BookingLiteResponse response = BookingLiteResponse.builder()
                .nights(nights)
                .build();

        return ResponseEntity.ok(response);

    }

    /**
     * Endpoint para obtener la proxima o actual reserva de una unidad
     * @PathVarialbe Integer unitId ==> El id de la unidad por parametro GET
     */
    @GetMapping(value = "getNext/{unitId}")
    public ResponseEntity<BookingLiteDTO> getNextBooking (@PathVariable Integer unitId) {

        BookingLiteDTO booking = bookingService.getNextBooking(unitId);

        if (booking == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(booking);

    }


    /**
     * Endpoint para obtener las proximas reservas por los 3 siguientes meses
     * @PathVariable Integer unitId ==> El id de la unidad
     */
    @GetMapping(value = "futureBooking/{unitId}")
    public ResponseEntity<List<BookingListDTO>> getFutureBookingsFromUnit (@PathVariable Integer unitId) {

        return ResponseEntity.ok(bookingService.getFutureBookingsForUnit(unitId));

    }

    /**
     * Endpoint para obtener una reserva con diferentes datos
     * @PathVariable Integer bookingId ==> El id de la reserva
     * Esta funcion esta pensada para el apartado Reservas del USER
     */
    @GetMapping(value = "{bookingId}")
    public ResponseEntity<BookingDTO> getBooking (@PathVariable Integer bookingId) {

        return ResponseEntity.ok(bookingService.getBooking(bookingId));

    }

    @PostMapping()
    public ResponseEntity<BookingResponse> createBooking(@RequestBody BookingCreateRequest request) {

        return ResponseEntity.ok(bookingService.createBooking(request));

    }

    /**
     * Endpoint para hacer el checkIn de una reserva.
     *
     * @param bookingId -- Integer con el id de la reserva.
     * @return responseBooking -- objeto de la clase BookingResponse que contiene un mensaje informativo, que se envía junto a un código 200.
     */
    @GetMapping(value = "checkIn/{bookingId}")
    public ResponseEntity<BookingResponse> checkIn (@PathVariable Integer bookingId) {

        return ResponseEntity.ok(bookingService.checkIn(bookingId));

    }

    /**
     * Endpoint para realizar el checkout de una reserva
     * @param bookingId
     * @return response - Objeto de la clase BookingResponse que contiene un mensaje informativo, que se envía junto a un código 200.
     */
    @GetMapping(value = "checkOut/{bookingId}")
    public ResponseEntity<BookingResponse> checkOut (@PathVariable Integer bookingId) {

        return ResponseEntity.ok(bookingService.checkOut(bookingId));
    }

    /**
     * Endpoint para enviar el email de precheckin
     * @param bookingId
     * @return ResponseEntity con un objeto de la clase Bookingresponse que contiene la respuesta de la opreación.
     * @throws MessagingException
     */
    @GetMapping(value = "sendPreCheckInEmail/{bookingId}")
    public ResponseEntity<BookingResponse> sendPreCheckInEmail (@PathVariable Integer bookingId) throws MessagingException {

        return ResponseEntity.ok(bookingService.sendPreCheckInEmail(bookingId));

    }

    @PostMapping("sendEmail")
    public ResponseEntity<BookingResponse> sendEmail (@RequestBody SendEmailRequest request) throws MessagingException {

        return ResponseEntity.ok(bookingService.sendEmail(request));

    }

    @DeleteMapping()
    public ResponseEntity<BookingResponse> deleteBooking (@RequestBody BookingDeleteRequest request) {

        return ResponseEntity.ok(bookingService.deleteBooking(request));

    }


}
