package keynest_backend.Address;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/address")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173"})
public class AddressController {

    @Autowired
    private final AddressService addressService;

    /**
     * Endpoint para recupera todos los paises registrados en la base de datos
     * @return Lista de DTOs de paises
     */
    @GetMapping("countries")
    public ResponseEntity<List<CountryDTO>> getCountries() {

        return ResponseEntity.ok(addressService.getCountries());

    }

    /**
     * Endpoint para recuperar todas las provincias una vez seleccionado el pais
     * @param countryId
     * @return Lista de DTOs de provincias
     */
    @GetMapping("provinces/{countryId}")
    public ResponseEntity<List<ProvinceDTO>> getProvinces(@PathVariable Integer countryId) {

        return ResponseEntity.ok(addressService.getProvinces(countryId));
    }

    @GetMapping("localities/{provinceId}")
    public ResponseEntity<List<LocalityDTO>> getLocalities(@PathVariable Integer provinceId) {

        return ResponseEntity.ok(addressService.getLocalities(provinceId));

    }
}
