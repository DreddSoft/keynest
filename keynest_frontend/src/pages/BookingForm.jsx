import { useState } from "react";
import { DateRange } from "react-date-range";
import { differenceInCalendarDays, format } from "date-fns";

// 1. Calendario tipo airbnb
// npm install react-date-range date-fns
// 2. importar estilos en el main.jsx
// import 'react-date-range/dist/styles.css';
// import 'react-date-range/dist/theme/default.css';

function BookingForm() {

    // Datos necesarios para una reserva
    const { unitId } = useParams();
    const [checkIn, setCheckIn] = useState();
    const [checkOut, setCheckOut] = useState();
    const [numGuess, setNumGuetst] = useState();
    const [notes, setNotes] = useState();

    // Datos para crear el cliente principal
    const [name, setName] = useState();
    const [lastname, setLastname] = useState();
    const [gender, setGender] = useState();
    const [birthday, setBirthday] = useState();
    const [nationality, setNationality] = useState();
    const [docType, setDocType] = useState();
    const [docNumber, setDocNumber] = useState();
    const [docSupportNumber, setDocSupportNumber] = useState();
    const [docIssueDate, setDocIssueDate] = useState();
    const [docExpirationDate, setDocExpirationDate] = useState();
    const [locality, setLocality] = useState();
    const [address, setAddress] = useState();
    const [postalCode, setPostalCode] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const creatorId = localStorage.getItem("userId");

    // Pasos
    const [step, setStep] = useState(1);

    // Rango para el calendario
    const [range, setRange] = useState([
        {
            startDate: new Date(),
            endDate: null,
            key: 'selection'
        }
    ]);

    const selection = range[0];
    const nights = selection.startDate && selection.endDate
        ? differenceInCalendarDays(selection.endDate, selection.startDate)
        : 0;





    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded shadow">

            {step === 1 && (
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Paso 1: Selecciona las fechas</h2>
                    <DateRange
                        editableDateInputs={true}
                        onChange={item => setRange([item.selection])}
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

                    <div>
                        <p>Noches: <strong>{nights}</strong></p>
                    </div>
                    <button
                        disabled={nights <= 0}
                        onClick={() => setStep(2)}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                    >
                        Continuar
                    </button>
                </div>
            )}

            {step === 2 && (
                <form className="space-y-4">
                    <h2 className="text-lg font-semibold">Paso 2: Datos de la reserva</h2>

                    <label className="block">
                        <input 
                            type="number"

                        />
                        </label>

                    <label className="block">
                        Nombre:
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleFormChange("name", e.target.value)}
                            required
                            className="w-full border px-2 py-1 rounded"
                        />
                    </label>

                    <label className="block">
                        Email:
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleFormChange("email", e.target.value)}
                            required
                            className="w-full border px-2 py-1 rounded"
                        />
                    </label>

                    <label className="block">
                        Número de personas:
                        <input
                            type="number"
                            value={formData.guests}
                            onChange={(e) => handleFormChange("guests", parseInt(e.target.value))}
                            min="1"
                            className="w-full border px-2 py-1 rounded"
                        />
                    </label>

                    <label className="block">
                        Comentarios:
                        <textarea
                            value={formData.comments}
                            onChange={(e) => handleFormChange("comments", e.target.value)}
                            className="w-full border px-2 py-1 rounded"
                        />
                    </label>

                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="px-4 py-2 bg-gray-300 rounded"
                        >
                            Volver
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded"
                        >
                            Reservar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );

}

export default BookingForm;