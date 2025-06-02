package keynest_backend.Booking;

import keynest_backend.Model.Booking;
import keynest_backend.Model.Unit;
import keynest_backend.Repositories.BookingRepository;
import keynest_backend.Repositories.UnitRepository;
import keynest_backend.Repositories.UserRepository;
import keynest_backend.User.User;
import lombok.RequiredArgsConstructor;
import org.springframework.cglib.core.Local;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

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
                .updatedAt(LocalDateTime.now())
                .isActive(true)
                .status(0)
                .build();

        if (bk == null) {
            return "Error al crear la reserva.";
        }

        return "Reserva " + bk.getId() + " creada correctamente.";

    }

    // Metodo para conseguir todas las noches reservadas de todas las unidades de un usuario
    public Integer getAllBookedNightsFromUser (Integer userId) {

        // Sacar fechas de inicio y fin de anio de forma dinamica
        LocalDate now = LocalDate.now();
        LocalDate startOfTheYear = now.withDayOfYear(1);
        System.out.println("Fecha de inicio: " + startOfTheYear);

        LocalDate endOfTheYear = now.withDayOfYear(now.lengthOfYear());
        System.out.println("Fecha de fin: " + endOfTheYear);

        return bookingRepository.sumNightsByUserIdAndDateRange(userId, startOfTheYear, endOfTheYear);

    }

    // Metodo para obtener la proxima reserva de la unidad
    public BookingLiteDTO getNextBooking (Integer unitId) {

        // Sacar la proxima reserva o nulo usando stream
        Booking booking = bookingRepository
                .findNextOrCurrentBookings(unitId)
                .stream()
                .findFirst()
                .orElse(null);

        if (booking == null) {
            return null;
        }

        // Formateamos las fechas a tipo ESP
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        LocalDate checkIn = LocalDate.parse(booking.getCheckIn().toString(), formatter);
        LocalDate checkOut = LocalDate.parse(booking.getCheckOut().toString(), formatter);

        // Construimos el LiteDTO
        return BookingLiteDTO
                .builder()
                .checkIn(checkIn)
                .checkOut(checkOut)
                .nights(booking.getNights())
                .build();

    }

}
