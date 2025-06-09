package keynest_backend.Booking;

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

        return ResponseEntity.ok(bookingService.getNextBooking(unitId));

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
}
