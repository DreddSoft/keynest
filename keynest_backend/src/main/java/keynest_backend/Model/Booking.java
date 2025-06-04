package keynest_backend.Model;

import jakarta.persistence.*;
import keynest_backend.User.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.context.annotation.EnableMBeanExport;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bookings")
public class Booking {

    //* Identificacion
    @Id
    @GeneratedValue
    private Integer id;

    //* Relacion
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id", referencedColumnName = "id", nullable = false)
    private Unit unit;

    //* Datos
    @Column(name = "check_in", nullable = false)
    private LocalDate checkIn;
    @Column(name = "check_out", nullable = false)
    private LocalDate checkOut;
    @Column(name = "total_price", nullable = false)
    private double totalPrice;
    @Column(name = "paid")
    private boolean isPaid;
    @Column(name = "num_guests")
    private int numGuests;
    @Column(name = "notes")
    private String notes;

    //* Auditoria
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    //* Status
    @Column(name = "is_active")
    private boolean isActive;
    @Column(name = "status")
    private int status;

    // 0 - cancelada
    // 1 - confirmada
    // 2 - precheckin (que ya esta hecho el precheckin
    // 3 - checkin (que ya esta hecho el checkin)
    // 4 - facturada (que ya ha facturado)
    // 5 - checkout (fuera)

    //* Aniadido despues
    @Column(name = "nights")
    private int nights;

}
