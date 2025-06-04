import { useEffect, useState } from "react";
import PersonalizedButton from "../components/PersonalizedButton.jsx";
import { format } from "date-fns";

function BookingList({ unitId }) {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState(null);
    const [booking, setBooking] = useState(null);

    const URL = `http://localhost:8080/api/booking/futureBooking/${unitId}`;

    const fetchBooking = async (bookingId) => {
        const URL_BOOKING = `http://localhost:8080/api/booking/${bookingId}`;
        try {
            const response = await fetch(URL_BOOKING, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("No se ha podido obtener datos de la reserva " + bookingId);
            }

            const data = await response.json();
            setBooking(data);
        } catch (err) {
            setError(err.message);
        }
    };

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
                setError(err.message);
            }
        };

        fetchBookings();
    }, [unitId]);

    const today = new Date().toISOString().split("T")[0];
    const senderEmail = localStorage.getItem("email");

    return (
        <div>
            {error && <p className="text-red-600 text-center mt-4 font-semibold">{error}</p>}

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
                                onDoubleClick={() => fetchBooking(b.id)}
                            >
                                <td className="p-3 border-b">{b.id}</td>
                                <td className="p-3 border-b">{b.name}</td>
                                <td className="p-3 border-b">{b.checkIn}</td>
                                <td className="p-3 border-b">{b.checkOut}</td>
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
                <div className="w-full flex gap-6 mt-8">

                    {/* ASIDE: Botonera */}
                    <aside className="w-1/3 bg-white shadow-lg rounded-lg p-4 border">
                        <h3 className="text-lg font-bold text-gray-700 mb-4">Acciones</h3>
                        <div className="flex flex-col gap-2">
                            {booking.status === 1 && booking.checkIn === today && (
                                <PersonalizedButton
                                    buttonName="PreCheck-In"
                                    buttonId="preCheckIn"
                                    buttonFunction={() => console.log("PreCheckIn")}
                                />
                            )}
                            {booking.status === 2 && (
                                <PersonalizedButton
                                    buttonName="Check-In"
                                    buttonId="checkIn"
                                    buttonFunction={() => console.log("CheckIn")}
                                />
                            )}
                            {booking.status === 3 && (
                                <PersonalizedButton
                                    buttonName="Facturar"
                                    buttonId="facturar"
                                    buttonFunction={() => console.log("Facturar")}
                                />
                            )}
                            {booking.status === 4 && (
                                <PersonalizedButton
                                    buttonName="Check-Out"
                                    buttonId="checkOut"
                                    buttonFunction={() => console.log("CheckOut")}
                                />
                            )}
                        </div>
                    </aside>

                    {/* Esto no me gusta... */}
                    <section className="w-2/3 bg-white shadow-lg rounded-lg p-4 border">
                        <h3 className="text-lg font-bold text-gray-700 mb-4">Enviar mensaje</h3>
                        <p className="text-sm mb-1"><strong>Para:</strong> {booking.email}</p>
                        <p className="text-sm mb-1"><strong>De:</strong> {senderEmail}</p>
                        <p className="text-sm mb-3">
                            <strong>Asunto:</strong> Reserva #{booking.id} | Check-In: {format(new Date(booking.checkIn), "dd/MM/yyyy")} | {booking.name} {booking.lastname}
                        </p>
                        <textarea
                            rows="5"
                            placeholder="Escribe tu mensaje aquí..."
                            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                        <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Enviar
                        </button>
                    </section>

                </div>
            )}
        </div>
    );
}

export default BookingList;
