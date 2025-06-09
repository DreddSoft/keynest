import React, { useState } from "react";
import { Loader2, TriangleAlert, Check, Pencil, Ban } from "lucide-react";
import PersonalizedButton from "@/components/PersonalizedButton";

function EditBooking({ adminId }) {
    const [bookingId, setBookingId] = useState("");
    const [bookingData, setBookingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [modify, setModify] = useState(false);
    const REGEX = /^[0-9]+$/;
    const isValidId = REGEX.test(bookingId);
    const [touched, setTouched] = useState(false);

    // Datos de la reserva para modificar
    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);
    const [price, setPrice] = useState(null);
    const [isPaid, setIsPaid] = useState(null);
    const [numGuests, setNumGuests] = useState(null);
    const [notes, setNotes] = useState(null);
    const [status, setStatus] = useState(null);
    const [nights, setNights] = useState(null);
    const [name, setName] = useState(null);
    const [lastname, setLastname] = useState(null);
    const [email, setEmail] = useState(null);


    const handleSearch = async () => {
        setError(null);
        setMessage(null);
        setLoading(true);

        // Si el id no es valid
        if (!isValidId) return;


        try {
            const response = await fetch(`http://localhost:8080/api/booking/${bookingId}`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error("No se pudo obtener la reserva.");

            const data = await response.json();
            setBookingData(data);
        } catch (err) {
            setError(err.message);
            setBookingData(null);
        } finally {
            setLoading(false);
        }
    };

    const modifyBooking = async () => {
        setError(null);
        setMessage(null);
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:8080/api/booking/${bookingId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });

            if (!response.ok) throw new Error("Error al actualizar la reserva.");
            setMessage("Reserva actualizada con éxito.");
            setModify(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const activateBooking = async () => {

        console.log("ACTIVAR/ DESACTIVAR")

    }

    const deleteBooking = async () => {

        console.log("ELIMINAR");
    }

    return (
        <div className="bg-white shadow p-6 rounded-lg w-full max-w-2xl mx-auto space-y-4 my-6">
            {loading && (
                <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-gray-800" />
                </div>
            )}

            <h2 className="text-lg font-semibold text-gray-800">Buscar Unidad</h2>

            <div className="flex items-center space-x-2">
                <input
                    type="text"
                    placeholder="ID de la reserva"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded text-sm w-3/4"
                    onBlur={() => setTouched(true)}
                    id="searchBar"
                />
                <div className="w-1/4">
                    <PersonalizedButton
                        buttonName={"Buscar"}
                        className="w-16"
                        buttonFunction={handleSearch}
                    />
                </div>

            </div>

            {touched && !isValidId && (
                <div className="flex justify-baseline items-center gap-2 border border-red-500 bg-red-50 text-red-700 rounded-md p-3 mt-2">
                    <Ban className="mt-0.5" />
                    <p className="text-sm text-center">El id introducido no es correcto, recuerde que solo admite dígitos.</p>
                </div>

            )}

            {error && (
                <div className="flex justify-baseline items-center gap-2 border border-red-500 bg-red-50 text-red-700 rounded-md p-3 mt-2">
                    <TriangleAlert className="mt-0.5" />
                    <p className="text-sm text-center">{error}</p>
                </div>
            )}

            {message && (
                <div className="flex justify-baseline items-center gap-2 border border-green-500 bg-green-50 text-green-700 rounded-md p-3 mt-2">
                    <Check className="mt-0.5" />
                    <p className="text-sm text-center">{message}</p>
                </div>

            )}


            <div className="space-y-8 p-6 bg-white text-black rounded-xl shadow-md max-w-4xl mx-auto">
                <div>
                    <h4 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4 text-gray-800">Información de la Reserva</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col text-sm text-gray-700">
                            ID:
                            <input
                                type="text"
                                value={(bookingData)
                                    ? bookingData.id
                                    : ""}
                                disabled
                                className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                            />
                        </label>
                        <label className="flex flex-col text-sm text-gray-700">
                            Email:
                            <input
                                type="email"
                                value={modify ? email : (bookingData ? bookingData.email : "")}
                                disabled={!modify}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                            />
                        </label>
                        <label className="flex flex-col text-sm text-gray-700">
                            Nombre cliente:
                            <input
                                type="text"
                                value={(bookingData)
                                    ? bookingData.name
                                    : ""}
                                disabled
                                className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                            />
                        </label>
                        <label className="flex flex-col text-sm text-gray-700">
                            Apellidos cliente:
                            <input
                                type="text"
                                value={(bookingData)
                                    ? bookingData.lastname
                                    : ""}
                                disabled
                                className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                            />
                        </label>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4 text-gray-800">Datos de la Reserva</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="flex flex-col text-sm text-gray-700">
                                Check-In:
                                <input
                                    type="date"
                                    value={modify ? checkIn : (bookingData ? bookingData.checkIn : "")}
                                    disabled={!modify}
                                    onChange={(e) => setCheckIn(e.target.value)}
                                    className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                />
                            </label>
                            <label className="flex flex-col text-sm text-gray-700">
                                Check-Out:
                                <input
                                    type="date"
                                    value={modify ? checkOut : (bookingData ? bookingData.checkOut : "")}
                                    disabled={!modify}
                                    onChange={(e) => setCheckOut(e.target.value)}
                                    className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                />
                            </label>
                            <label className="flex flex-col text-sm text-gray-700">
                                Precio:
                                <input
                                    type="number"
                                    value={modify ? price : (bookingData ? bookingData.price : "")}
                                    disabled={!modify}
                                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                                    className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                />
                            </label>
                            <label className={modify
                                ? "hidden"
                                : "flex flex-col text-sm text-gray-700"
                            }>
                                Pagado:
                                <input
                                    type="text"
                                    value={bookingData ? (bookingData.isPaid ? "SI" : "NO") : ""}
                                    disabled
                                    className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                />
                            </label>

                            <label className={modify
                                ? "flex flex-col text-sm text-gray-700"
                                : "hidden"
                            }>
                                Pagado:
                                <select
                                    onChange={(e) => setIsPaid(e.target.value === "true")}
                                    className="mt-1 p-2 border border-gray-300 rounded-md bg-white text-gray-800"
                                >
                                    <option value="" disabled selected>Esta pagada...</option>
                                    <option value={true}>SI</option>
                                    <option value={false}>NO</option>
                                </select>
                            </label>

                            <label className="flex flex-col text-sm text-gray-700">
                                Status:
                                <select
                                    onChange={(e) => setStatus(parseInt(e.target.value))}
                                    value={modify ? status : (bookingData ? bookingData.status : 6)}
                                    disabled={!modify}
                                    className="mt-1 p-2 border border-gray-300 rounded-md bg-white text-gray-800"
                                >
                                    <option value="0" >CANCELADA</option>
                                    <option value="1">CONFIRMADA</option>
                                    <option value="2">PRE-CHECK-IN</option>
                                    <option value="3">CHECK-IN</option>
                                    <option value="4">FACTURADA</option>
                                    <option value="5">CHECK-OUT</option>
                                    <option value="6"></option>
                                </select>
                            </label>

                            <label className="flex flex-col text-sm text-gray-700">
                                Número de huéspedes:
                                <input
                                    type="number"
                                    value={modify ? numGuests : (bookingData ? bookingData.numGuests : "")}
                                    disabled={!modify}
                                    onChange={(e) => setNumGuests(parseInt(e.target.value))}
                                    className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                />
                            </label>
                            <label className="flex flex-col text-sm text-gray-700">
                                Noches:
                                <input
                                    type="number"
                                    value={modify ? nights : (bookingData ? bookingData.nights : "")}
                                    disabled={!modify}
                                    onChange={(e) => setNights(parseInt(e.target.value))}
                                    className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                />
                            </label>

                            <label className="flex flex-col md:col-span-2 col-span-1 text-sm text-gray-700">
                                Notas:
                                <textarea
                                    value={modify ? notes : (bookingData ? bookingData.notes : "")}
                                    disabled={!modify}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                />
                            </label>
                        </div>
                    </div>

                    <div
                        className={modify
                            ? "hidden"
                            : "flex flex-row justify-center items-center gap-4 mt-4"
                        }>

                        {bookingData && bookingData.status !== 0 && (
                            <>
                                <button
                                    className={bookingData
                                        ? "flex flex-row justify-center items-center gap-1 px-4 py-2 text-sm border-y border-yellow-500 text-yellow-700 hover:bg-yellow-100 transition-colors cursor-pointer"
                                        : "flex flex-row justify-center items-center gap-1 px-4 py-2 text-sm border-y border-yellow-500 text-yellow-700  cursor-not-allowed"
                                    }
                                    disabled={!bookingData}
                                    onClick={() => setModify(true)}
                                >

                                    <Hammer size={16} />
                                    Modificar
                                </button>

                                <button
                                    className={bookingData
                                        ? "flex flex-row justify-center items-center gap-1 px-4 py-2 text-sm border-y border-gray-500 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                        : "flex flex-row justify-center items-center gap-1 px-4 py-2 text-sm border-y border-gray-500 text-gray-700  cursor-not-allowed"
                                    }
                                    disabled={!bookingData}
                                    onClick={activateBooking}
                                >
                                    <CircleX size={16} />
                                    Desactivar
                                </button>
                            </>
                        )}
                        {bookingData && bookingData.status !== 0 && (
                            <>
                                <button
                                    className={bookingData
                                        ? "flex flex-row justify-center items-center gap-1 px-4 py-2 text-sm border-y border-green-500 text-green-700 hover:bg-green-100 transition-colors cursor-pointer"
                                        : "flex flex-row justify-center items-center gap-1 px-4 py-2 text-sm border-y border-green-500 text-green-700  cursor-not-allowed"
                                    }
                                    disabled={!bookingData}
                                    onClick={activateBooking}
                                >
                                    <CircleCheck size={16} />
                                    Reactivar
                                </button>
                                <button
                                    className={bookingData
                                        ? "flex flex-row justify-center items-center gap-1 px-4 py-2 text-sm border-y border-red-500 text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
                                        : "flex flex-row justify-center items-center gap-1 px-4 py-2 text-sm border-y border-red-500 text-red-700  cursor-not-allowed"
                                    }
                                    disabled={!bookingData}
                                    onClick={deleteBooking}
                                >
                                    <Trash2 size={16} />
                                    Eliminar
                                </button>
                            </>
                        )}

                    </div>
                    <div
                        className={modify
                            ? "flex flex-row justify-center items-center gap-4 mt-4"
                            : "hidden"
                        }>
                        <button
                            className="px-4 py-2 text-sm border-y border-green-600 text-green-700 hover:bg-green-100 transition-colors cursor-pointer"
                            onClick={modifyBooking}

                        >
                            Aceptar
                        </button>
                        <button
                            className="px-4 py-2 text-sm border-y border-gray-600 text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
                            onClick={() => setModify(false)}
                        >
                            Cancelar
                        </button>


                    </div>
                </div>

            </div>
        </div>
    );
}

export default EditBooking;
