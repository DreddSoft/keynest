import React, { useState } from "react";
import { Loader2, TriangleAlert, Check, Search } from "lucide-react";
import PersonalizedButton from "@/components/PersonalizedButton";
import { Navigate, useNavigate } from "react-router";
import { format } from "date-fns";

function BookingsPerUnit() {
    const [unitId, setUnitId] = useState("");
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [touched, setTouched] = useState(false);

    const isValidUnitId = /^\d+$/.test(unitId);
    const navigate = useNavigate();

    const fetchBookings = async () => {

        setTouched(true);
        if (!isValidUnitId) return;

        // Reinicar 
        setLoading(true);
        setError(null);

        try {

            const response = await fetch(`http://localhost:8080/api/booking/futureBooking/${unitId}`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });

            // console.log(response);

            if (!response.ok) throw new Error("No se pudo obtener la información.");

            const data = await response.json();

            setBookings(data);

        } catch (err) {

            setError(err.message);
            setBookings([]);

        } finally {

            setLoading(false);
        }
    };

    function openBooking(selectedUnitId) {

        const id = parseInt(selectedUnitId);

        navigate(`/editUnit/${id}`);

        
    }

    return (
        <div className="bg-white shadow p-6 rounded-lg w-full max-w-2xl mx-auto space-y-4 my-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Buscar reservas por ID de unidad</h2>

            <div className="flex flex-col items-center justify-center sm:flex-row sm:items-center gap-4 mb-6">
                <input
                    type="text"
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-800"
                    placeholder="Introduce ID de unidad"
                    onChange={(e) => setUnitId(parseInt(e.target.value))}
                    onBlur={() => setTouched(true)}
                />
                <div className="w-full sm:w-32">
                    <PersonalizedButton
                        buttonName={"Buscar"}
                        buttonIcon={<Search />}
                        buttonFunction={fetchBookings}

                    />
                </div>
            </div>

            {touched && !isValidUnitId && (
                <p className="text-red-600 text-sm flex items-center gap-1 mb-4">
                    <TriangleAlert className="w-4 h-4" /> Por favor, introduce un ID numérico válido.
                </p>
            )}

            {loading && (
                <p className="text-blue-800 flex items-center gap-2">
                    <Loader2 className="animate-spin w-4 h-4" />
                </p>
            )}

            {error && (
                <div className="flex justify-baseline items-center gap-2 border border-red-500 bg-red-50 text-red-700 rounded-md p-3 mt-2">
                    <TriangleAlert className="mt-0.5" />
                    <p className="text-sm text-center">{error}</p>
                </div>
            )}

            {!loading && bookings.length > 0 && (
                <div className="overflow-x-auto mt-4">
                    <table className="min-w-full border border-gray-200">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="py-2 px-4 border-b">ID</th>
                                <th className="py-2 px-4 border-b">Check In</th>
                                <th className="py-2 px-4 border-b">Check Out</th>
                                <th className="py-2 px-4 border-b">Noches</th>
                                <th className="py-2 px-4 border-b">Cliente</th>
                                <th className="py-2 px-4 border-b">Total</th>
                                <th className="py-2 px-4 border-b">Num. Huéspedes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50 cursor-pointer"
                                onDoubleClick={() => openBooking(booking.id)}
                                >
                                    <td className="py-2 px-4 border-b">{booking.id}</td>
                                    <td className="py-2 px-4 border-b">{format(new Date(booking.checkIn), "dd/MM/yyyy")}</td>
                                    <td className="py-2 px-4 border-b">{format(new Date(booking.checkOut), "dd/MM/yyyy")}</td>
                                    <td className="py-2 px-4 border-b">{booking.noches}</td>
                                    <td className="py-2 px-4 border-b">{booking.name + " " + booking.lastname}</td>
                                    <td className="py-2 px-4 border-b">{booking.total}</td>
                                    <td className="py-2 px-4 border-b">{booking.guests}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default BookingsPerUnit;
