package keynest_backend.Booking;

import keynest_backend.Model.Booking;
import keynest_backend.Model.Unit;
import keynest_backend.Repositories.BookingRepository;
import keynest_backend.Repositories.UnitRepository;
import keynest_backend.Repositories.UserRepository;
import keynest_backend.User.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UnitRepository unitRepository;
    private final UserRepository userRepository;


    // Metodo para crear una Reserva
    public String createBooking(BookingCreateRequest request) {

        // Sacamos la unidad
        Unit unit = unitRepository.findById(request.getUnitId()).orElseThrow(() -> new IllegalArgumentException("createBooking - Unidad no encontrada."));

        // Sacamos al creador
        User creator = userRepository.findById(request.getCreatorId()).orElseThrow(() -> new IllegalArgumentException("createBooking - Usuario Creador no encontrado."));

        // Obtener el status



        Booking bk = Booking.builder()
                // Relacion
                .unit(unit)
                // Datos
                .checkIn(request.getCheckIn())
                .checkOut(request.getCheckOut())
                .totalPrice(request.getTotalPrice())
                .isPaid(false)
                .numGuests(request.getNumGuests())
                .notes(request.getNotes())
                // Auditoria
                .createdAt(LocalDateTime.now())
                .createdBy(creator)
                .updatedAt(LocalDateTime.now())
                .updatedBy(creator)
                .isActive(true)
                .status(0)
                .build();

        if (bk == null) {
            return "Error al crear la reserva.";
        }

        return "Reserva " + bk.getId() + " creada correctamente.";

    }

}
