package keynest_backend.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "availabilities")
public class Availability {

    //* Id
    @Id
    @GeneratedValue
    private Integer id;

    //* Relacion
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id", referencedColumnName = "id", nullable = false)
    private Unit unit;

    //* Data
    @Column(name = "date_available")
    private LocalDate dateAvailable;
    @Column(name = "price_per_night")
    private double pricePerNight;
    @Column(name = "min_stay")
    private int minStay;

}
