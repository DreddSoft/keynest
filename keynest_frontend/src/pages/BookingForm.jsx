import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { DateRange } from "react-date-range";
import { differenceInCalendarDays, format } from "date-fns";
import { Loader2, Check } from "lucide-react";
import Button3 from "@/components/Button3";
import Button3Gray from "@/components/Button3Gray";


function BookingForm() {
  const { unitId } = useParams();
  const [step, setStep] = useState(1);
  const [unit, setUnit] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [cont, setCont] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();


  // Rango de fechas
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);
  const selection = range[0];
  const nights =
    selection.startDate && selection.endDate
      ? differenceInCalendarDays(selection.endDate, selection.startDate)
      : 0;

  // Datos de reserva
  const [totalPrice, setTotalPrice] = useState(0);
  const [numGuests, setNumGuests] = useState(1);
  const [notes, setNotes] = useState(null);

  // Datos del cliente
  const [name, setName] = useState(null);
  const [lastname, setLastname] = useState(null);
  const [gender, setGender] = useState(null);
  const [birthday, setBirthday] = useState(null);
  const [nationality, setNationality] = useState(null);
  const [docType, setDocType] = useState(null);
  const [docNumber, setDocNumber] = useState(null);
  const [docSupportNumber, setDocSupportNumber] = useState(null);
  const [docIssueDate, setDocIssueDate] = useState(null);
  const [docExpirationDate, setDocExpirationDate] = useState(null);
  const [localityId, setLocalityId] = useState(null);
  const [address, setAddress] = useState(null);
  const [postalCode, setPostalCode] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);

  // Para El tema direcciones, localidades, paises, provincias
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [provinceEnabled, setProvinceEnabled] = useState(false);
  const [localityEnabled, setLocalityEnabled] = useState(false);

  // Del check availability
  const [availabilityError, setAvailabilityError] = useState(null);

  // CONSTANTES INMUTABLES
  const URL_COUNTRIES = `http://localhost:8080/api/address/countries`;
  const URL_CREATE_BOOKING = `http://localhost:8080/api/booking`;


  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/unit/${unitId}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error al capturar la unidad.");
        }

        const data = await response.json();
        setUnit(data);
      } catch (err) {
        setError("Error: " + err.message);
      }
    };

    const fetchCountries = async () => {
      setLoading(true);
      try {
        const response = await fetch(URL_COUNTRIES, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) throw new Error("Error al capturar los países.");
        const data = await response.json();
        setCountries(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUnit();
    fetchCountries();
  }, [unitId]);

  const handleCountryChange = async (countryId) => {
    setSelectedCountry(countryId);
    setProvinces([]);
    setLocalities([]);
    setProvinceEnabled(false);
    setLocalityEnabled(false);
    if (!countryId) return;
    const URL = `http://localhost:8080/api/address/provinces/${countryId}`;
    setLoading(true);
    try {
      const res = await fetch(URL, { method: "GET", credentials: "include" });
      if (!res.ok) throw new Error("Error al capturar las provincias");
      const data = await res.json();
      setProvinces(data);
      setProvinceEnabled(true);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProvinceChange = async (provinceId) => {
    setSelectedProvince(provinceId);
    setLocalities([]);
    setLocalityEnabled(false);
    if (!provinceId) return;
    const URL = `http://localhost:8080/api/address/localities/${provinceId}`;
    setLoading(true);
    try {
      const res = await fetch(URL, { method: "GET", credentials: "include" });
      if (!res.ok) throw new Error("Error al capturar las localidades");
      const data = await res.json();
      setLocalities(data);
      setLocalityEnabled(true);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  function checkOccupancy(value) {
    // Si no tengo la unidad atras
    if (!unit) return;

    setLoading(true);

    // Sacamos el minOccupancy y maxOccupancy del unit
    const { minOccupancy, maxOccupancy } = unit;

    // Comprobamos y alerta
    if (value < minOccupancy || value > maxOccupancy) {
      alert("El número de huéspedes supera los límites del alojamiento.");
      setNumGuests(minOccupancy);
    } else {
      setNumGuests(value);
    }

    setLoading(false);
  }


  // Funcion para comprobar la disponibilidad de las fechas seleccionadas
  async function checkAvailability(startDate, endDate) {

    const URL_CHECK_AVAILABILITY = `http://localhost:8080/api/availability/check`;



    // Esta funcion tiene que capturar la disponibilidad entre varios dias
    try {
      const response = await fetch(URL_CHECK_AVAILABILITY, {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ unitId: parseInt(unitId), checkIn: startDate, checkOut: endDate })
      });

      if (!response.ok) {
        throw new Error("Error al comprobar la disponibilidad");
      }

      // Sacamos las fechas
      const data = await response.json();

      // 1. Comprobamos si hay alguna fecha que no este disponible
      const unavailableDates = data.filter(d => d.isAvailable === false);

      if (unavailableDates.length > 0) {
        setAvailabilityError("Lo sentimos, las fechas seleccionadas no están disponibles.");
        setTotalPrice(0);
        return;
      }

      // 2. Si las noches es menos que las estancia minima del primer dia
      if (nights < data[0].minStay) {
        setAvailabilityError("Lo sentimos, la estancia mínima para las fechas seleccionadas es de: " + data[0].minStay);
        setTotalPrice(0);
        return;
      }

      // 3. Si si hay dispo, calcular el precio sin contar la ultima noche
      const total = data.slice(0, -1).reduce((sum, d) => sum + d.price, 0);
      setAvailabilityError(null);
      setTotalPrice(total);

      // 4. Pasamos al paso 2
      setCont(true);

    } catch (err) {
      console.error("Error: " + err.message);
      setAvailabilityError("Error al comprobar la disponibilidad.");
      setTotalPrice(0);
      setCont(false);
    } finally {
      setLoading(false);
    }
  }

  const confirmBooking = async () => {

    resetMessages();

    // Confirm
    let ok = confirm("¿Desea confirmar la reserva?");

    if (!ok) {
      setStep(1);
      return;
    }

    // Cargando
    setLoading(true);

    // Fetch
    try {

      const response = await fetch(URL_CREATE_BOOKING, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitId,
          checkIn: selection.startDate,
          checkOut: selection.endDate,
          totalPrice,
          numGuests,
          notes,
          name,
          lastname,
          genderPick: gender,
          birthday,
          nationality,
          docTypePick: docType,
          docNumber,
          docSupportNumber,
          docIssueDate,
          docExpirationDate,
          localityId,
          address,
          postalCode,
          email,
          phone
        })
      });

      if (!response.ok) {
        throw new Error("Algo ha ocurrido. No se ha podido crear la reserva.");
      }

      const text = await response.text();

      setMessage(text);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }


  }

  function changeStep(step) {

    setLoading(true);
    setStep(step);
    setLoading(false);

  }

  function resetMessages() {

    setError(false);
    setAvailabilityError(false);
    setMessage(false);

  }

  if (error) {
    return <p className="font-bold text-red-600 text-center mt-10">{error}</p>;
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      {loading && (
        <div className="flex justify-center items-center">
          <Loader2 className="animate-spin w-6 h-6 text-blue-800" />
        </div>
      )}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Paso 1: Selecciona las fechas</h2>

          <DateRange
            editableDateInputs={true}
            onChange={(item) => setRange([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={range}
            rangeColors={["#2563eb"]}
          />

          {selection.startDate && selection.endDate && (
            <div className="text-sm text-gray-700">
              <p>Entrada: <strong>{format(selection.startDate, "dd/MM/yyyy")}</strong></p>
              <p>Salida: <strong>{format(selection.endDate, "dd/MM/yyyy")}</strong></p>
              <p>Noches: <strong>{nights}</strong></p>
            </div>
          )}

          {availabilityError && (
            <div className="text-center p-4">
              <p className="text-sm text-red-600 font-bold">{availabilityError}</p>
            </div>
          )}

          <div className="text-sm text-grey-900">
            <p>Precio total estimado: <strong className="text-red-600">{totalPrice.toFixed(2)} €</strong></p>
          </div>

          {message && (
            <div className="flex justify-baseline items-center gap-2 border border-green-500 bg-green-50 text-green-700 rounded-md p-3 mt-2">
              <Check className="mt-0.5" />
              <p className="text-sm text-center">{message}</p>
            </div>

          )}

          {!cont && (
            <div className="flex flex-row justify-center items-center gap-4">
              <Button3Gray
                onClick={() => navigate(`/unit/${unitId}`)}
                children={"Volver"}
              />
              < Button3
                disabled={nights <= 0}
                onClick={() => checkAvailability(selection.startDate, selection.endDate)}
                children={"Comprobar Disponibilidad"}
              />

            </div>
          )}

          {cont && (
            < Button3
              onClick={() => {
                changeStep(2);
                setCont(false);
              }}
              children={"Continuar"}
            />
          )}

        </div>
      )}

      {step === 2 && (
        <form className="space-y-4">
          <h2 className="text-lg font-semibold">Paso 2: Datos de la reserva</h2>

          <label className="block">
            Número de huéspedes:
            <input
              type="number"
              id="numGuests"
              value={numGuests}
              onChange={(e) => checkOccupancy(Number(e.target.value))}
              required
              className="w-full border px-2 py-1 rounded text-center"
            />
          </label>

          <label className="block">
            ¿Quiere usted añadir alguna nota?
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-32 border px-2 py-1 rounded"
            />
          </label>

          <div className="flex justify-between">

            <Button3Gray
              onClick={() => setStep(1)}
              children={"Volver"}
            />

            <Button3
              onClick={() => setStep(3)}
              children={"Continuar"}
            />
          </div>
        </form>
      )}

      {step === 3 && (
        <form className="space-y-4">
          <h2 className="text-lg font-semibold">Paso 3: Datos del cliente</h2>

          <div className="grid grid-cols-1 gap-3">
            <label className="flex flex-col text-sm text-gray-700">
              Nombre:
              <input
                value={name}
                type="text"
                onChange={(e) => setName(e.target.value)}
                className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                required
              />
            </label>

            <label className="flex flex-col text-sm text-gray-700">
              Apellidos:
              <input
                value={lastname}
                type="text"
                onChange={(e) => setLastname(e.target.value)}
                className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                required
              />
            </label>
            <label className="flex flex-col text-sm text-gray-700">
              Género:
              <select
                value={gender}
                onChange={(e) => setGender(parseInt(e.target.value))}
                className="mt-1 p-2 border border-gray-300 rounded-md bg-white text-gray-800"
                required

              >
                <option value="" disabled selected>Selecciona un género...</option>
                <option value="0">MASCULINO</option>
                <option value="1">FEMENINO</option>
                <option value="2">OTROS</option>
                <option value="3">SIN ESPECIFICAR</option>
              </select>
            </label>
            <label className="flex flex-col text-sm text-gray-700">
              Fecha de Nacimiento:
              <input
                value={birthday}
                type="date"
                onChange={(e) => setBirthday(e.target.value)}
                className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                required
              />
            </label>

            <div>
              <h4 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4 text-gray-800">Dirección</h4>
              <div className="">
                <div className="grid grid-cols-1 gap-4">
                  <label className="flex flex-col text-sm text-gray-700">
                    País:
                    <select
                      value={selectedCountry}
                      onChange={(e) => {
                        handleCountryChange(e.target.value);
                        setNationality(selectedCountry.name);
                      }}
                      className="mt-1 p-2 border border-gray-300 rounded-md bg-white text-gray-800"
                      id="iptCountry"
                    >
                      <option value="" disabled>Selecciona un país...</option>
                      {countries.map((country) => (
                        <option key={country.id} value={country.id}>
                          {country.initials} - {country.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col text-sm text-gray-700">
                    Provincia:
                    <select
                      value={selectedProvince}
                      onChange={(e) => handleProvinceChange(e.target.value)}
                      disabled={!provinceEnabled}
                      className={`mt-1 p-2 border rounded-md bg-white text-gray-800 ${provinceEnabled ? "border-gray-300" : "border-gray-200 text-gray-400"
                        }`}
                      id="iptProvince"
                      required
                    >
                      <option value="" disabled>Selecciona una provincia...</option>
                      {provinces.map((province) => (
                        <option key={province.id} value={province.id}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col text-sm text-gray-700">
                    Localidad:
                    <select
                      disabled={!localityEnabled}
                      className={`mt-1 p-2 border rounded-md bg-white text-gray-800 ${localityEnabled ? "border-gray-300" : "border-gray-200 text-gray-400"
                        }`}
                      id="iptLocality"
                      onChange={(e) => setLocalityId(parseInt(e.target.value))}
                    >
                      <option value="" disabled>Selecciona una localidad...</option>
                      {localities.map((locality) => (
                        <option key={locality.id} value={locality.id}>
                          {locality.name}
                        </option>
                      ))}
                    </select>
                  </label>

                </div>
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <label className="flex flex-col text-sm text-gray-700">
                    Dirección:
                    <input
                      type="text"
                      onChange={(e) => setAddress(e.target.value)}
                      className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                      required
                    />
                  </label>
                  <label className="flex flex-col text-sm text-gray-700">
                    Código Postal:
                    <input
                      type="text"
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                      required
                    />
                  </label>
                </div>
              </div>
            </div>

            <div>
              {/* Documento */}
              <h4 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4 text-gray-800">Documento</h4>

              <label className="flex flex-col text-sm text-gray-700">
                Tipo:
                <select
                  value={docType}
                  onChange={(e) => setDocType(parseInt(e.target.value))}
                  className="mt-1 p-2 border border-gray-300 rounded-md bg-white text-gray-800"
                  required

                >
                  <option value="" disabled selected>Selecciona el tipo...</option>
                  <option value="0">DNI</option>
                  <option value="1">NIE</option>
                  <option value="2">PASAPORTE</option>

                </select>
              </label>
              <label className="flex flex-col text-sm text-gray-700">
                Número:
                <input
                  value={docNumber}
                  type="text"
                  onChange={(e) => setDocNumber(e.target.value)}
                  className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                  required
                />
              </label>
              <label className="flex flex-col text-sm text-gray-700">
                Número de Soporte:
                <input
                  value={docSupportNumber}
                  type="text"
                  onChange={(e) => setDocSupportNumber(e.target.value)}
                  className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                  required
                />
              </label>
              <label className="flex flex-col text-sm text-gray-700">
                Fecha de expedición:
                <input
                  value={docIssueDate}
                  type="date"
                  onChange={(e) => setDocIssueDate(e.target.value)}
                  className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                  required
                />
              </label>
              <label className="flex flex-col text-sm text-gray-700">
                Fecha de expiración:
                <input
                  value={docExpirationDate}
                  type="date"
                  onChange={(e) => setDocExpirationDate(e.target.value)}
                  className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                  required
                />
              </label>
            </div>
            <div>
              {/* otros datos */}
              <h4 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4 text-gray-800">Contacto</h4>

              <label className="flex flex-col text-sm text-gray-700">
                Email:
                <input
                  value={email}
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                  required
                />
              </label>
              <label className="flex flex-col text-sm text-gray-700">
                Telf.:
                <input
                  value={phone}
                  type="text"
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                  required
                />
              </label>

            </div>

          </div>
          <div className="flex justify-between">
            <Button3Gray
              onClick={() => setStep(1)}
              children={"Volver"}
            />
            <Button3
              onClick={confirmBooking}
              children={"Confirmar Reserva"}
            />
          </div>
        </form>
      )}
    </div>
  );
}

export default BookingForm;
