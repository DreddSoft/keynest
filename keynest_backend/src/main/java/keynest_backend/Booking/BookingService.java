package keynest_backend.Booking;

import jakarta.mail.MessagingException;
import keynest_backend.Client.DocumentTypes;
import keynest_backend.Client.Gender;
import keynest_backend.Utils.EmailService;
import keynest_backend.Utils.Log;
import keynest_backend.Model.*;
import keynest_backend.Repositories.*;
import lombok.RequiredArgsConstructor;
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
    private final AvailabilityRepository availabilityRepository;
    private final EmailService emailService;



    /**
     * Método de servicio para crear una reserva
     * Este método será accesible desde el motor de reservas del cliente
     * @param request - Clase BookingCreateRequest que contiene todos los datos necesarios para crear una reserva.
     * @return
     */
    public BookingResponse createBooking(BookingCreateRequest request) {

        // Validación de unidad
        Unit unit = unitRepository.findById(request.getUnitId())
                .orElseThrow(() -> new IllegalArgumentException(String.format("Unidad con ID %d no encontrada.", request.getUnitId())));

        // Validación de fechas
        if (!request.getCheckOut().isAfter(request.getCheckIn())) {
            throw new IllegalArgumentException("La fecha de salida debe ser posterior a la de entrada.");
        }

        int nights = (int) ChronoUnit.DAYS.between(request.getCheckIn(), request.getCheckOut());

        Log.write(unit.getUser().getId(), "BookingService", "Iniciando proceso de creación de reserva.");

        // Verificación y actualización de disponibilidad
        for (LocalDate date = request.getCheckIn(); date.isBefore(request.getCheckOut()); date = date.plusDays(1)) {

            String finalDate = date.toString();

            Availability availability = availabilityRepository.findByUnitIdAndDate(unit.getId(), date)
                    .orElseThrow(() -> new IllegalArgumentException(
                            String.format("No existe disponibilidad para el dia %s en la unidad %d.", finalDate, unit.getId())));

            availability.setAvailable(false);
            availabilityRepository.save(availability);
        }

        // Búsqueda del cliente por número de documento y luego por email
        Client client = clientRepository.findByDocNumber(request.getDocNumber());
        if (client == null) {
            client = clientRepository.findByEmail(request.getEmail());
        }

        // Si no existe el cliente, se crea
        if (client == null) {
            Log.write(unit.getUser().getId(), "BookingService", "Cliente no encontrado. Procediendo a su creación.");

            // Localidad
            Locality locality = localityRepository.findById(request.getLocalityId())
                    .orElseThrow(() -> new IllegalArgumentException("No se ha encontrado la localidad con ID: " + request.getLocalityId()));

            // Asignación de enumerados
            Gender gender = switch (request.getGenderPick()) {
                case 0 -> Gender.MALE;
                case 1 -> Gender.FEMALE;
                case 2 -> Gender.OTHER;
                default -> Gender.UNSPECIFIED;
            };

            DocumentTypes docType = switch (request.getDocTypePick()) {
                case 0 -> DocumentTypes.DNI;
                case 1 -> DocumentTypes.NIE;
                default -> DocumentTypes.PASSPORT;
            };

            // Construcción del cliente
            client = Client.builder()
                    .name(request.getName())
                    .lastname(request.getLastname())
                    .gender(gender)
                    .birthday(request.getBirthday())
                    .nationality(locality.getProvince().getCountry().getName())
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
                    .createdAt(LocalDateTime.now())
                    .createdBy(unit.getUser())
                    .updatedAt(LocalDateTime.now())
                    .updatedBy(unit.getUser())
                    .isActive(true)
                    .build();

            clientRepository.save(client);
        }

        // Creación de la reserva
        Booking booking = Booking.builder()
                .unit(unit)
                .checkIn(request.getCheckIn())
                .checkOut(request.getCheckOut())
                .totalPrice(request.getTotalPrice())
                .isPaid(false)
                .numGuests(request.getNumGuests())
                .notes(request.getNotes())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .isActive(true)
                .status(1)
                .nights(nights)
                .build();

        bookingRepository.save(booking);

        // Relación cliente principal y reserva
        BookingClient bookingClient = BookingClient.builder()
                .booking(booking)
                .client(client)
                .isMainGuest(true)
                .registeredInPolice(false)
                .notes(client.getNotes())
                .build();

        bookingClientRepository.save(bookingClient);

        Log.write(unit.getUser().getId(), "BookingService", "Reserva creada y relacionada con cliente principal. ID reserva: " + booking.getId());

        return BookingResponse.builder()
                .message("Reserva creada correctamente con ID: " + booking.getId())
                .build();
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

    /**
     * Método de servicio para obtener la próxima o actual reserva de una unidad
     * @param unitId
     * @return
     */
    public BookingLiteDTO getNextBooking (Integer unitId) {

        // Sacamos reserva si hay hoy
        Booking booking = bookingRepository.findNextBooking(unitId).stream().findFirst().orElse(null);

        if (booking == null) {
            return null;
        }

        // Construimos el LiteDTO
        return BookingLiteDTO
                .builder()
                .bookingId(booking.getId())
                .checkIn(booking.getCheckIn())
                .checkOut(booking.getCheckOut())
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
                .id(booking.getId())
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
                .isActive(booking.isActive())
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

    /**
     * Envía un correo de pre-check-in al cliente principal de la reserva.
     * Este proceso cambia el estado de la reserva a "PRE-CHECK-IN" (status = 2)
     * y dispara el envío de un email con el enlace al formulario correspondiente.
     *
     * @param bookingId ID de la reserva a gestionar
     * @return BookingResponse con un mensaje de confirmación
     * @throws MessagingException si ocurre un error al enviar el email
     * @throws IllegalArgumentException si no se encuentra la reserva con el ID indicado
     */
    public BookingResponse sendPreCheckInEmail(Integer bookingId) throws MessagingException {

        // Buscar la reserva por ID; lanzar excepción si no existe
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException(
                        String.format("No se ha encontrado ninguna reserva con ID %d. Verifique el identificador proporcionado.", bookingId)
                ));

        // Escribir en el log el inicio del proceso
        Log.write(
                booking.getUnit().getUser().getId(),
                "BookingService | sendPreCheckInEmail",
                String.format("Inicio del proceso de pre-check-in para la reserva ID %d. Estado actualizado a PRE-CHECK-IN y envío de correo en curso.", bookingId)
        );

        // Actualizar el estado de la reserva
        booking.setStatus(2); // 2 = PRE-CHECK-IN
        bookingRepository.save(booking);

        // Enviar el correo de pre-check-in
        emailService.sendPreCheckInEmail(bookingId);

        // Retornar respuesta informativa
        return BookingResponse.builder()
                .message(String.format("El correo de pre-check-in de la reserva %d ha sido enviado correctamente al cliente principal de la reserva.", bookingId))
                .build();
    }

    //
    public BookingResponse sendEmail (SendEmailRequest request) throws MessagingException {

        emailService.sendEmail(request.getEmail(), request.getSubject(), request.getBody());

        return BookingResponse.builder().message("Email enviado correctamente.").build();

    }

    public BookingResponse deleteBooking (BookingDeleteRequest request) {

        // Sacar la reserva
        Booking booking = bookingRepository.findById(request.getId()).orElse(null);

        if (booking == null) {
            return BookingResponse.builder().message(
                    String.format("No se ha encontrado la unidad con ID %d. Por tanto, no se ha podido eliminar.", request.getId())
            ).build();
        }

        bookingRepository.delete(booking);

        Log.write(booking.getUnit().getUser().getId(), "BookingService | deleteBoking", "Se ha eliminado la reserva correctamente.");

        return BookingResponse.builder().message(
                String.format("Eliminada correctamente la reserva con ID %d.", request.getId())
        ).build();

    }


}
