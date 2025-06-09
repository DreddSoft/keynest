package keynest_backend.Booking;

import keynest_backend.Client.DocumentTypes;
import keynest_backend.Client.Gender;
import keynest_backend.Logs.Log;
import keynest_backend.Model.*;
import keynest_backend.Repositories.*;
import keynest_backend.User.User;
import lombok.RequiredArgsConstructor;
import org.springframework.cglib.core.Local;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UnitRepository unitRepository;
    private final UserRepository userRepository;
    private final BookingClientRepository bookingClientRepository;
    private final ClientRepository clientRepository;
    private final LocalityRepository localityRepository;



    /**
     * Método de servicio para crear una reserva
     * Este método será accesible desde el motor de reservas del cliente
     * @param request - Clase BookingCreateRequest que contiene todos los datos necesarios para crear una reserva.
     * @return
     */
    public BookingResponse createBooking(BookingCreateRequest request) {

        // Al crear una reserva, el sistema tiene que
        // - Crear la reserva
        // - Crear el cliente principal
        // - Relacionar ambos

        // Sacamos la unidad
        Unit unit = unitRepository.findById(request.getUnitId()).orElseThrow(() -> new IllegalArgumentException("createBooking - Unidad no encontrada."));

        // Sacamos al creador
        User creator = userRepository.findById(request.getCreatorId()).orElseThrow(() -> new IllegalArgumentException("createBooking - Usuario Creador no encontrado."));

        // Sacamos las noches
        int nights = (int) ChronoUnit.DAYS.between(request.getCheckIn(), request.getCheckOut());

        // Si el checkOut es antes del checkIn
        if (!request.getCheckOut().isAfter(request.getCheckIn())) {
            throw new IllegalArgumentException("La fecha de salida debe ser posterior a la de entrada.");
        }

        Log.write(request.getCreatorId(), "BookingService", "Se procede a crear la reserva.");

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
                .status(1)
                .nights(nights)
                .build();

        // Guardamos las reserva
        bookingRepository.save(bk);

        // Crear el cliente principal
        // Primero buscar si el cliente existe, por número de documento y luego por email
        Log.write(request.getCreatorId(), "BookingService", "Buscando el cliente por número de documento.");
        Client c = clientRepository.findByDocNumber(request.getDocNumber());

        // Si no lo encuentra por número de documento
        if (c == null) {
            Log.write(request.getCreatorId(), "BookingService", "Cliente no encontrado. Buscando cliente por email.");
            c = clientRepository.findByEmail(request.getEmail());
        }

        // Si aún así es nulo, lo creamos
        if (c == null) {

            Log.write(request.getCreatorId(), "BookingService", "No encontrado. Creando cliente.");

            // Género
            Gender gender;

            // Sacar el genero
            switch (request.getGenderPick()) {
                case 0:
                    gender = Gender.MALE;
                    break;
                case 1:
                    gender = Gender.FEMALE;
                    break;
                case 2:
                    gender = Gender.OTHER;
                    break;
                default:
                    gender = Gender.UNSPECIFIED;
                    break;

            }

            // Sacar el tipo de documento
            DocumentTypes docType;
            switch (request.getDocTypePick()) {
                case 0:
                    docType = DocumentTypes.DNI;
                    break;
                case 1:
                    docType = DocumentTypes.NIE;
                    break;
                default:
                    docType = DocumentTypes.PASSPORT;
                    break;

            }

            // Localidad
            Locality locality = localityRepository.findById(request.getLocalityId()).orElseThrow(() -> new IllegalArgumentException("No se ha encontrado la localidad."));

            c = Client.builder()
                    .name(request.getName())
                    .lastname(request.getLastname())
                    .gender(gender)
                    .birthday(request.getBirthday())
                    .nationality(request.getNationality())
                    .docType(docType)
                    .docNumber(request.getDocNumber())
                    .docSupportNumber(request.getDocSupportNumber())
                    .docIssueDate(request.getDocIssueDate())
                    .docExpirationDate(request.getDocExpirationDate())
                    .locality(locality)
                    .address(request.getAddress())
                    .postalCode(request.getPostalCode())
                    .email(request.getEmail())
                    .phone(request.getPhone())
                    .createdBy(creator)
                    .createdAt(LocalDateTime.now())
                    .updatedBy(creator)
                    .updatedAt(LocalDateTime.now())
                    .isActive(true)
                    .build();

            // Guardamos cliente
            clientRepository.save(c);

        }

        // Relacionar reserva y cliente
        BookingClient bc = BookingClient.builder()
                .booking(bk)
                .client(c)
                .isMainGuest(true)
                .registeredInPolice(false)
                .notes(null)
                .build();

        Log.write(request.getCreatorId(), "BookingService", "Relacionando Reserva con Cliente principal.");
        bookingClientRepository.save(bc);

       String response;

        if (bk == null) {
            response = "Error al crear la reserva.";
        }

        response = "Reserva " + bk.getId() + " creada correctamente.";

        return BookingResponse.builder().message(response).build();

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

    /**
     * Metodo para obtener todas las proximas reservas (a 3 meses vista) de una unidad
     * @param unitId | El id de la unidad para la que obtenemos las reservas
     */
    public List<BookingListDTO> getFutureBookingsForUnit(Integer unitId) {

        // Sacamos la unidad
        Unit unit = unitRepository.findById(unitId).orElseThrow(() -> new IllegalArgumentException("Unidad no encontrada."));

        // Fecha limite (3 meses desde ahora)
        LocalDate now = LocalDate.now();
        LocalDate limitDate = now.plusMonths(3);

        List<BookingListDTO> listOfBookings = bookingRepository.getFutureBookingsForUnit(unit, limitDate);

        return listOfBookings;
    }

    /**
     * Método para obtener el BookingDTO
     * Parte de la información de la reserva y del cliente, para un pequeño display en el front
     * @param bookingId | El id de la reserva
     *
     */
    public BookingDTO getBooking(Integer bookingId) {

        // 1. Sacar la reserva
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new IllegalArgumentException("BookingService | getBooking | Error al capturar al reserva."));

        // 2. Obtener el id del cliente principal
        Integer clientId = bookingClientRepository.findMainClientIdByBookingId(bookingId);

        // 3. Obtener el cliente
        Client client = clientRepository.findById(clientId).orElseThrow(() -> new IllegalArgumentException("BookingService | getBooking | Cliente principal no encontrado."));

        // 4 Creamos DTO
        return BookingDTO.builder()
                .checkIn(booking.getCheckIn())
                .checkOut(booking.getCheckOut())
                .isPaid(booking.isPaid())
                .notes(booking.getNotes())
                .status(booking.getStatus())
                .name(client.getName())
                .lastname(client.getLastname())
                .email(client.getEmail())
                .build();

    }

}
