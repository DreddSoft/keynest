package keynest_backend.Address;

import keynest_backend.Model.Country;
import keynest_backend.Model.Province;
import keynest_backend.Repositories.CountryRepository;
import keynest_backend.Repositories.LocalityRepository;
import keynest_backend.Repositories.ProvinceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final CountryRepository countryRepository;
    private final ProvinceRepository provinceRepository;
    private final LocalityRepository localityRepository;

    /**
     * Método para obtener todos los paises
     */
    public List<CountryDTO> getCountries () {

        return countryRepository.getAllAsDTO();

    }

    /**
     * Método para obtener todas las provincias de un pais
     * @param countryId | el id del apis
     */
    public List<ProvinceDTO> getProvinces(Integer countryId) {

        // Sacamos el pais del id
        Country country = countryRepository.findById(countryId).orElseThrow(() -> new IllegalArgumentException("AddressService | getAllProvinces | Error al sacar el pais."));

        return provinceRepository.getAllAsDTO(country);

    }

    /**
     * Método para obtener todas las localidades de una provincia
     * @para. provinceId | el id de la provinca
     */
    public List<LocalityDTO> getLocalities(Integer provinceId) {

        // Sacamos la provincia
        Province province = provinceRepository.findById(provinceId).orElseThrow(() -> new IllegalArgumentException("AddressService | getLocalities | Error al recuperar la provincia"));

        return localityRepository.getAllAsDTO(province);

    }
}
