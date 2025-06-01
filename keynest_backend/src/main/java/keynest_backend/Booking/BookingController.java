package keynest_backend.Booking;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
