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
    private final InvoiceRepository invoiceRepository;



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

        // Sacamos reserva si hay hoy
        Booking booking = bookingRepository.findBookingThatChecksInToday(unitId).orElse(null);

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
                .bookingId(booking.getId())
                .checkIn(checkIn)
                .checkOut(checkOut)
                .status(booking.getStatus())
                .nights(booking.getNights())
                .total(booking.getTotalPrice())
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
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new IllegalArgumentException("La reserva con Id " + bookingId + " no existe o no ha podido ser encontrada."));

        // 2. Obtener el id del cliente principal
        Integer clientId = bookingClientRepository.findMainClientIdByBookingId(bookingId);

        // 3. Obtener el cliente
        Client client = clientRepository.findById(clientId).orElseThrow(() -> new IllegalArgumentException("No se ha encontrado cliente con id " + clientId + "."));

        // 4 Creamos DTO
        return BookingDTO.builder()
                .checkIn(booking.getCheckIn())
                .checkOut(booking.getCheckOut())
                .price(booking.getTotalPrice())
                .isPaid(booking.isPaid())
                .numGuests(booking.getNumGuests())
                .notes(booking.getNotes())
                .status(booking.getStatus())
                .nights(booking.getNights())
                .name(client.getName())
                .lastname(client.getLastname())
                .email(client.getEmail())
                .build();

    }

    /**
     * Método de servicio para establecer el status de una reserva a checkIn, indicando que el cliente ha entrado ya en la unidad y se ha realizado el pre-checkIn.
     *
     * @param bookingId - Integer con el id de la reserva.
     * @return bookingResponse - Objeto de la clase BookingResponse que envía un mensaje informativo.
     */
    public BookingResponse checkIn (Integer bookingId) {

        // Buscar la reserva
        Booking booking = bookingRepository.findById(bookingId).orElse(null);

        if (booking == null) {
            Log.write(booking.getUnit().getUser().getId(), "BookingService | checkOut", "No se puede realizar el check-In, porque no se encuentra la unidad.");
            return BookingResponse.builder().message("No se ha encontrado la unidad.").build();
        }

        // Se cambia el status a 3 - checkin (que ya esta hecho el checkin)
        booking.setStatus(3);
        bookingRepository.save(booking);

        Log.write(booking.getUnit().getUser().getId(), "BookingService | checkOut", "Se realiza el check-In de la reserva " + booking.getId() + ".");
        return BookingResponse.builder().message("Se ha hecho el Check-In de la reserva: " + bookingId + ".").build();

    }

    /**
     * Método de servicio para realizar el checkOut de la reserva.
     * Requiere que la reserva este en status === 4 - Facturada
     * Requiere que exista una factura para esa reserva
     *
     * @param bookingId
     * @return response - Objeto Clase BookingResponse con un mensaje
     */
    public BookingResponse checkOut (Integer bookingId) {

        // Buscar la reserva
        Booking booking = bookingRepository.findById(bookingId).orElse(null);

        Log.write(booking.getUnit().getUser().getId(), "BookingService | checkOut", "Se inicia el checkOut de la reserva " + booking.getId() + ".");

        if (booking == null) {
            Log.write(booking.getUnit().getUser().getId(), "BookingService | checkOut", "No se puede realizar el check-Out, porque no se encuentra la unidad.");
            return BookingResponse.builder().message("No se ha encontrado la unidad.").build();
        }

        // Sacamos la factura
        Invoice invoice = invoiceRepository.findByBookingId(booking.getId()).orElse(null);

        if (invoice == null) {
            Log.write(booking.getUnit().getUser().getId(), "BookingService | checkOut", "No se puede realizar el check-Out, porque la reserva no se ha facturado.");
            return BookingResponse.builder().message("La reserva no ha sido facturada, no se puede hacer el check-Out.").build();
        }

        // Para que se pueda hacer el checkOut la reserva tiene que estar facturada para eso se tiene que dar:
        // status === 4 && facturaExiste
        if (booking.getStatus() == 4) {
            // Establecemos el estado en checkOut
            booking.setStatus(5);
            bookingRepository.save(booking);

            Log.write(booking.getUnit().getUser().getId(), "BookingService | checkOut", "Se realiza el checkOut de la reserva " + booking.getId() + ".");
            return BookingResponse.builder().message("Se ha realizado el check-Out.").build();

        }

        Log.write(booking.getUnit().getUser().getId(), "BookingService | checkOut", "No se ha podido realizar el checkOut de la reserva " + booking.getId() + ". El estado no es 4.");
        return BookingResponse.builder().message("Algo ha ocurrido, no se ha realizado el check-Out.").build();

    }

}
