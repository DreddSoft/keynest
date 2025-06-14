import { useEffect, useState } from "react";
import PersonalizedButton from "../components/PersonalizedButton.jsx";
import { format } from "date-fns";
import { Check, TriangleAlert, Loader2 } from "lucide-react";

function BookingList({ unitId }) {
    const [bookings, setBookings] = useState([]);
    const [ok, setOk] = useState(false);
    const [error, setError] = useState(false);
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(false);

    // Cosas del email
    const [subject, setSubject] = useState(null);
    const [body, setBody] = useState(null);


    const URL = `http://localhost:8080/api/booking/futureBooking/${unitId}`;

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch(URL, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error("No se pudieron obtener las reservas");
                }

                const data = await response.json();
                setBookings(data);
            } catch (err) {
                console.error(err.message);
                setError("Ups! Algo ha ocurrido al intentar capturar las próximas reservas de su unidad. Inténtelo de nuevo más tarde o póngase en contacto con el administrador.");
            }
        };

        fetchBookings();
    }, [unitId]);

    function selectBooking(booking) {

        setSubject("Reserva " + booking.id + " | Check-In: " + format(new Date(booking.checkIn), "dd/MM/yyyy") + " | " + booking.name + " " + booking.lastname);

        setBooking(booking);
    };


    const sendEmail = async (dataBooking) => {

        resetMessages();

        setLoading(true);

        try {
            const response = await fetch(`http://localhost:8080/api/booking/sendEmail`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: dataBooking.email,
                    subject,
                    body
                })
            });

            if (!response.ok) {
                throw new Error("No se pudo enviar el email de contacto.");
            }

            const data = await response.json();
            setOk(data.message);
        } catch (err) {
            console.error(err.message);
            setError("Ups! No se ha podido enviar el email de contacto. Inténtelo de nuevo más tarde o póngase en contacto con el administrador.");
        } finally {
            setLoading(false);
        }

    }

    const deteleBooking = async (bk) => {

        resetMessages();

        setLoading(true);

        try {
            const response = await fetch(`http://localhost:8080/api/booking`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: bk.id
                })
            });

            if (!response.ok) {
                throw new Error("Ups! Algo ha ocurrido. No se ha podido elimar la reserva seleccionada.");
            }

            const data = await response.json();
            setOk(data.message);

            window.location.reload();
        } catch (err) {
            console.error(err.message);
            setError("Ups! Algo ha ocurrido. No se ha podido elimar la reserva seleccionada.");
        } finally {
            setLoading(false);
        }

    }

    function resetMessages() {

        setError(false);
        setOk(false);

    }

    return (
        <div>
            {error && (
                <div className="flex justify-baseline items-center gap-2 border border-red-500 bg-red-50 text-red-700 rounded-md p-3">
                    <TriangleAlert className="mt-0.5" />
                    <p className="text-sm text-center">{error}</p>
                </div>
            )}


            {ok && (
                <div className="flex justify-baseline items-center gap-2 border border-green-500 bg-green-50 text-green-700 rounded-md p-3 mt-2">
                    <Check className="mt-0.5" />
                    <p className="text-sm text-center">{ok}</p>
                </div>

            )}

            {loading && (
                <div className="flex justify-center items-center">
                    <Loader2 className="animate-spin w-6 h-6 text-blue-800" />
                </div>
            )}

            {/* Tabla de reservas */}
            <div className="mt-6 overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 text-sm font-semibold">
                            <th className="p-3 text-left border-b">ID</th>
                            <th className="p-3 text-left border-b">Cliente</th>
                            <th className="p-3 text-left border-b">Entrada</th>
                            <th className="p-3 text-left border-b">Salida</th>
                            <th className="p-3 text-left border-b">Noches</th>
                            <th className="p-3 text-left border-b">Huéspedes</th>
                            <th className="p-3 text-left border-b">Total (€)</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700">
                        {bookings.map((b) => (
                            <tr
                                key={b.id}
                                className="hover:bg-gray-50 cursor-pointer"
                                onDoubleClick={() => selectBooking(b)}
                            >
                                <td className="p-3 border-b">{b.id}</td>
                                <td className="p-3 border-b">{b.name}</td>
                                <td className="p-3 border-b">{format(new Date(b.checkIn), "dd/MM/yyyy")}</td>
                                <td className="p-3 border-b">{format(new Date(b.checkOut), "dd/MM/yyyy")}</td>
                                <td className="p-3 border-b">{b.noches}</td>
                                <td className="p-3 border-b">{b.guests}</td>
                                <td className="p-3 border-b">{b.total.toFixed(2)} €</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Los botones y datos de la reserva */}
            {booking && (
                <div className="grid md:grid-cols-3 grid-cols-1 gap-4 space-y-4">
                    <div className=" col-span-1 w-full gap-6 mt-8">

                        {/* ASIDE: Botonera */}
                        <aside className="bg-white border border-gray-300 shadow-lg rounded-lg p-4">
                            <h3 className="text-lg font-bold text-gray-700 mb-4">Acciones</h3>
                            <div className="flex flex-col gap-2">
                                {booking && (
                                    <PersonalizedButton
                                        buttonName="Cancelar Reserva"
                                        buttonId="delete"
                                        buttonFunction={() => deteleBooking(booking)}
                                    />
                                )}
                            </div>
                        </aside>
                    </div>
                    <section className="grid grid-cols-1 md:col-span-2 mt-8">
                        <div className="w-full max-w-xl bg-white border border-gray-300 rounded-lg shadow-md p-4 space-y-4">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4">Email automático</h4>
                            {/* Campo Para */}
                            <div className="flex items-center space-x-2">
                                <label className="w-20 text-sm font-medium text-gray-700">Para:</label>
                                <input
                                    type="email"
                                    value={booking.email}
                                    disabled
                                    className="flex-1 bg-gray-100 text-gray-700 border border-gray-300 rounded px-3 py-2 text-sm"
                                />
                            </div>

                            {/* Campo Asunto */}
                            <div className="flex items-center space-x-2">
                                <label className="w-20 text-sm font-medium text-gray-700">Asunto:</label>
                                <input
                                    type="text"
                                    value={"Reserva " + booking.id + " | Check-In: " + format(new Date(booking.checkIn), "dd/MM/yyyy") + " | " + booking.name + " " + booking.lastname}
                                    disabled
                                    className="flex-1 bg-gray-100 text-gray-700 border border-gray-300 rounded px-3 py-2 text-sm"
                                />
                            </div>

                            {/* Campo Mensaje */}
                            <div>
                                <textarea
                                    placeholder="Escribe tu mensaje aquí..."
                                    rows="8"
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none"
                                    onChange={(e) => setBody(e.target.value)}
                                ></textarea>
                            </div>

                            {/* Botón Enviar */}
                            <div className="text-right">
                                <PersonalizedButton
                                    buttonName={"Enviar"}
                                    buttonFunction={() => sendEmail(booking)}
                                />
                            </div>
                            <div>
                                {ok && (
                                    <p className="mt-2 text-sm text-green-700 bg-green-100 border border-green-300 rounded px-4 py-2">{ok}</p>
                                )}

                                {error && (
                                    <p className="mt-2 text-sm text-red-700 bg-red-100 border border-red-300 rounded px-4 py-2">{error}</p>
                                )}
                            </div>
                        </div>
                    </section>
                </div>

            )}
        </div>
    );
}

export default BookingList;
