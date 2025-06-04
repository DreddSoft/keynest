import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { DateRange } from "react-date-range";
import { differenceInCalendarDays, format } from "date-fns";

function BookingForm() {
  const { unitId } = useParams();
  const [step, setStep] = useState(1);
  const [unit, setUnit] = useState();
  const [error, setError] = useState();
  const [checkIn, setCheckIn] = useState();
  const [checkOut, setCheckOut] = useState();
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
  const [numGuests, setNumGuests] = useState(1);
  const [notes, setNotes] = useState("");

  // Datos del cliente
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [nationality, setNationality] = useState("");
  const [docType, setDocType] = useState("");
  const [docNumber, setDocNumber] = useState("");
  const [docSupportNumber, setDocSupportNumber] = useState("");
  const [docIssueDate, setDocIssueDate] = useState("");
  const [docExpirationDate, setDocExpirationDate] = useState("");
  const [locality, setLocality] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Del check availability
  const [availabilityError, setAvailabilityError] = useState(null);
const [totalPrice, setTotalPrice] = useState(0);

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

    fetchUnit();
  }, [unitId]);

  function checkOccupancy(value) {
    // Si no tengo la unidad atras
    if (!unit) return;
    // Sacamos el minOccupancy y maxOccupancy del unit
    const { minOccupancy, maxOccupancy } = unit;
    
    // Comprobamos y alerta
    if (value < minOccupancy || value > maxOccupancy) {
      alert("El número de huéspedes supera los límites del alojamiento.");
      setNumGuests(minOccupancy);
    } else {
      setNumGuests(value);
    }
  }


  // Funcion para comprobar la disponibilidad de las fechas seleccionadas
  async function checkAvailability(startDate, endDate) {

    const URL_CHECK_AVAILABILITY = `http://localhost:8080/api/availability/check`;

    // Esta funcion tiene que capturar la disponibilidad entre varios dias
    try {
      const response = await fetch(URL_CHECK_AVAILABILITY, {
        method: "POST",
        credentials:"include",
        headers: {
          'Content-Type':'application/json'
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

      // 2. Si si hay dispo, calcular el precio sin contar la ultima noche
      const total = data.slice(0, -1).reduce((sum, d) => sum + d.price, 0);
      setAvailabilityError(null);
      setTotalPrice(total);

      // 3. Establecemos el checkIn, checkOut
      setCheckIn(startDate);
      setCheckOut(endDate);

      // 4. Pasamos al paso 2
      setStep(2);

    } catch (err) {
      console.error("Error: " + err.message);
      setAvailabilityError("Error al comprobar la disponibilidad.");
      setTotalPrice(0);
    }
    

    
  }

  if (error) {
    return <p className="font-bold text-red-600 text-center mt-10">{error}</p>;
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
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
              <p className="text-sm text-red-600 font-bold"></p>
            </div>
          )}

          <div className="text-sm text-gray-900">
              <p>Precio total estimado: <strong>{totalPrice.toFixed(2)} &eur;</strong></p>
            </div>

          <button
            disabled={nights <= 0}
            onClick={() => checkAvailability(selection.startDate, selection.endDate)}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Comprobar Disponibilidad
          </button>
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
            <button
              onClick={() => setStep(1)}
              type="button"
              className="px-4 py-2 bg-gray-300 rounded border-2 border-transparent hover:cursor-pointer hover:bg-gray-400 hover:border-gray-900 transition duration-200"
            >
              Volver
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer border-2 border-transparent hover:bg-blue-500 hover:border-blue-900 transition duration-200"
            >
              Continuar
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form className="space-y-4">
          <h2 className="text-lg font-semibold">Paso 3: Datos del cliente</h2>

          <div className="grid grid-cols-1 gap-3">
            <input type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} className="border rounded px-2 py-1" required />
            <input type="text" placeholder="Apellidos" value={lastname} onChange={(e) => setLastname(e.target.value)} className="border rounded px-2 py-1" required />
            <input type="text" placeholder="Género" value={gender} onChange={(e) => setGender(e.target.value)} className="border rounded px-2 py-1" />
            <input type="date" placeholder="Fecha de nacimiento" value={birthday} onChange={(e) => setBirthday(e.target.value)} className="border rounded px-2 py-1" />
            <input type="text" placeholder="Localidad" value={locality} onChange={(e) => setLocality(e.target.value)} className="border rounded px-2 py-1" />
            <input type="text" placeholder="Dirección" value={address} onChange={(e) => setAddress(e.target.value)} className="border rounded px-2 py-1" />
            <input type="text" placeholder="Código postal" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="border rounded px-2 py-1" />
            <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} className="border rounded px-2 py-1" required />
            <input type="tel" placeholder="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} className="border rounded px-2 py-1" required />
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              type="button"
              className="px-4 py-2 bg-gray-300 rounded border-2 border-transparent hover:cursor-pointer hover:bg-gray-400 hover:border-gray-900 transition duration-200"
            >
              Volver
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer border-2 border-transparent hover:bg-blue-500 hover:border-blue-900 transition duration-200"
            >
              Continuar
            </button>
          </div>
        </form>
      )}

      {step === 4 && (

        <form className="space-y-4">
          <h2 className="text-lg font-semibold">Paso 4: Datos del documento del huesped principal</h2>

          <div className="grid grid-cols-1 gap-3">
            <input type="text" placeholder="Nacionalidad" value={nationality} onChange={(e) => setNationality(e.target.value)} className="border rounded px-2 py-1" />
            <input type="text" placeholder="Tipo de documento" value={docType} onChange={(e) => setDocType(e.target.value)} className="border rounded px-2 py-1" />
            <input type="text" placeholder="Número de documento" value={docNumber} onChange={(e) => setDocNumber(e.target.value)} className="border rounded px-2 py-1" />
            <input type="text" placeholder="Número de soporte" value={docSupportNumber} onChange={(e) => setDocSupportNumber(e.target.value)} className="border rounded px-2 py-1" />
            <input type="date" placeholder="Fecha de expedición" value={docIssueDate} onChange={(e) => setDocIssueDate(e.target.value)} className="border rounded px-2 py-1" />
            <input type="date" placeholder="Fecha de expiración" value={docExpirationDate} onChange={(e) => setDocExpirationDate(e.target.value)} className="border rounded px-2 py-1" />
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              type="button"
              className="px-4 py-2 bg-gray-300 rounded border-2 border-transparent hover:cursor-pointer hover:bg-gray-400 hover:border-gray-900 transition duration-200"
            >
              Volver
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded border-2 border-transparent hover:bg-green-500 hover:border-green-900 transition duration-200 hover:cursor-pointer" 
            
            >
              Confirmar reserva
            </button>
          </div>
        </form>
      )

      }
    </div>
  );
}

export default BookingForm;
