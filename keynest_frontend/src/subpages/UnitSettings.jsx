import React, { useState, useEffect } from "react";
import PersonalizedButton from "@/components/PersonalizedButton";
import { Lock, DollarSign, CalendarClock, Loader2, TriangleAlert, Mail, DoorOpen, DoorClosed, Receipt } from "lucide-react";
import FloatingFormWrapper from "@/components/FloatingFormWrapper";

function UnitSettings({ unit }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    // Bloqueo
    const [initDate, setInitDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const isValidDate = initDate <= endDate;

    // Precio
    const [priceInitDate, setPriceInitDate] = useState("");
    const [priceEndDate, setPriceEndDate] = useState("");
    const [price, setPrice] = useState("");
    const isValidDatePrice = priceInitDate <= priceEndDate;

    // Estancia mínima
    const [minStayInitDate, setMinStayInitDate] = useState("");
    const [minStayEndDate, setMinStayEndDate] = useState("");
    const [minStay, setMinStay] = useState("");
    const isValidDateMinStay = minStayInitDate <= minStayEndDate;

    // Datos de las reservas
    const [booking, setBooking] = useState(null);

    // URLS
    const URL_NEXT_BOOKING = `http://localhost:8080/api/booking/getNext/${unit.id}`;
    const URL_INVOICE = `http://localhost:8080/api/invoices`;

    useEffect(() => {
        const getNextBooking = async () => {

            if (unit.id === null) return;

            resetMessages();

            setLoading(true);

            try {
                const response = await fetch(URL_NEXT_BOOKING, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                if (!response.ok) {
                    throw new Error("Error al capturar la unidad.");
                }

                const text = await response.text();

                if (text) {
                    const data = JSON.parse(text);
                    setBooking(data);
                } else {
                    setBooking(null);
                }

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getNextBooking();
    }, [unit.id]);

    // Funcion PreCheckIn
    const preCheckIn = async (bId) => {

        resetMessages();

        if (booking.status !== 1) {
            setError("El estado de la reserva no permite hacer el precheckIn.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`http://localhost:8080/api/booking/sendPreCheckInEmail/${bId}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("No se pudo enviar el email de precheckIn.");
            }

            const data = await response.text();
            setMessage(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }

    }

    // Función para iniciar el checkIn de una reserva
    const initCheckIn = async () => {

        resetMessages();

        // Realmente esta función sólo cambia el status de la reserva
        const URL_CHECKIN = `http://localhost:8080/api/booking/checkIn/${booking.bookingId}`;

        // Si ya esta en checkIn, esto es una comprobación redundante.
        if (booking.status === 2) return;

        setLoading(true);

        try {

            const response = await fetch(URL_CHECKIN, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error("No se ha podido hacer check-in en la reserva.");
            }



        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }

    }

    // Funcion para facturar
    //TODO: Implementar metodo facturar
    const generateInvoice = async () => {
        resetMessages();
        setLoading(true);

        try {
            const response = await fetch(URL_INVOICE, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookingId: booking.bookingId,
                    total: booking.total,
                }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(
                    `No se pudo generar la factura. Detalles: ${errorMessage}`
                );
            }

            const data = await response.json();

            if (!data.url) {
                throw new Error("La respuesta no contiene una URL válida para el PDF.");
            }

            window.open(data.url, '_blank');

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    //TODO: Implementar metodo checkOut
    const initCheckOut = async () => {

        resetMessages();

        const URL_CHECKOUT = `http://localhost:8080/api/booking/checkOut/${booking.bookingId}`;

        // Si ya esta en check out o no esta en facturada
        if (booking.status === 5 || booking.status !== 4) return;

        setLoading(true);

        try {

            const response = await fetch(URL_CHECKOUT, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error("No se ha podido hacer check-in en la reserva.");
            }



        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }

    }

    function resetMessages() {

        setError(null);
        setMessage(null);

    }


    return (
        <div className="space-y-8 p-6 bg-white rounded-lg shadow max-w-4xl mx-auto">
            {loading && (
                <div className="flex justify-center items-center">
                    <Loader2 className="animate-spin w-6 h-6 text-blue-800" />
                </div>
            )}

            {error && (
                <div className="flex justify-baseline items-center gap-2 border border-red-500 bg-red-50 text-red-700 rounded-md p-3">
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

            <h4>Reserva para hoy:</h4>
            {/* Aqui la data de si hay que hacer checkIn */}
            {booking && (
                <div className="grid grid-cols-1 gap-6 md:mx-32 ">
                    <div className=" bg-gray-50 shadow-lg rounded-lg p-4 border border-gray-200">

                        {/* Informacion de la reserva */}
                        <div>
                            <label className="flex flex-col text-sm text-gray-700 mt-2">
                                ID:
                                <input
                                    type="text"
                                    value={booking.bookingId}
                                    disabled
                                    className="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800 text-center"
                                />
                            </label>
                            <label className="flex flex-col text-sm text-gray-700 mt-2">
                                Check-In:
                                <input
                                    type="date"
                                    value={booking.checkIn}
                                    disabled
                                    className="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800"
                                />
                            </label>
                            <label className="flex flex-col text-sm text-gray-700 mt-2">
                                Check-Out:
                                <input
                                    type="date"
                                    value={booking.checkOut}
                                    disabled
                                    className="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800"
                                />
                            </label>

                        </div>
                        <div className="mt-6">
                            {/* Controles */}
                            {booking.status === 1 && (
                                <PersonalizedButton
                                    buttonName="Pre Check-In"
                                    buttonIcon={<Mail />}
                                    buttonFunction={() => preCheckIn(parseInt(booking.bookingId))}
                                />
                            )}
                            {booking.status === 2 && (
                                <PersonalizedButton
                                    buttonName="Check-In"
                                    buttonIcon={<DoorOpen />}
                                    buttonFunction={initCheckIn}
                                />
                            )}

                            {booking.status === 3 && (
                                <PersonalizedButton
                                    buttonName="Facturar"
                                    buttonIcon={<Receipt />}
                                    buttonFunction={generateInvoice}
                                />
                            )}

                            {booking.status === 4 && (
                                <PersonalizedButton
                                    buttonName="Check-Out"
                                    buttonIcon={<DoorClosed />}
                                    buttonFunction={initCheckOut}
                                />
                            )}

                        </div>
                    </div>
                </div>

            )}


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Bloqueo */}

                <FloatingFormWrapper title="Bloquear Fechas">
                    <label className="flex flex-col text-sm text-gray-700">
                        Fecha Inicio:
                        <input
                            type="date"
                            value={initDate}
                            onChange={(e) => setInitDate(e.target.value)}
                            className="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800"
                        />
                    </label>
                    <label className="flex flex-col text-sm text-gray-700 mt-2">
                        Fecha Fin:
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800"
                        />
                    </label>
                    {isValidDate ? (
                        <div className="mt-4">
                            <PersonalizedButton buttonName="Bloquear" buttonIcon={<Lock />} />
                        </div>
                    ) : (
                        <p className="text-red-600 text-xs mt-2">La fecha de inicio debe ser anterior o igual a la fecha de fin.</p>
                    )}
                </FloatingFormWrapper>

                {/* Cambiar Precio */}

                <FloatingFormWrapper title="Cambiar Precio">
                    <label className="flex flex-col text-sm text-gray-700">
                        Fecha Inicio:
                        <input
                            type="date"
                            value={priceInitDate}
                            onChange={(e) => setPriceInitDate(e.target.value)}
                            className="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800"
                        />
                    </label>
                    <label className="flex flex-col text-sm text-gray-700 mt-2">
                        Fecha Fin:
                        <input
                            type="date"
                            value={priceEndDate}
                            onChange={(e) => setPriceEndDate(e.target.value)}
                            className="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800"
                        />
                    </label>
                    <label className="flex flex-col text-sm text-gray-700 mt-2">
                        Precio:
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800"
                        />
                    </label>
                    {isValidDatePrice ? (
                        <div className="mt-4">
                            <PersonalizedButton buttonName="Cambiar" buttonIcon={<DollarSign />} />
                        </div>
                    ) : (
                        <p className="text-red-600 text-xs mt-2">La fecha de inicio debe ser anterior o igual a la fecha de fin.</p>
                    )}
                </FloatingFormWrapper>


                {/* Cambiar Estancia Mínima */}
                <FloatingFormWrapper title="Cambiar Estancia Mínima">
                    <label className="flex flex-col text-sm text-gray-700">
                        Fecha Inicio:
                        <input
                            type="date"
                            value={minStayInitDate}
                            onChange={(e) => setMinStayInitDate(e.target.value)}
                            className="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800"
                        />
                    </label>
                    <label className="flex flex-col text-sm text-gray-700 mt-2">
                        Fecha Fin:
                        <input
                            type="date"
                            value={minStayEndDate}
                            onChange={(e) => setMinStayEndDate(e.target.value)}
                            className="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800"
                        />
                    </label>
                    <label className="flex flex-col text-sm text-gray-700 mt-2">
                        Mínimo de noches:
                        <input
                            type="number"
                            value={minStay}
                            onChange={(e) => setMinStay(e.target.value)}
                            className="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800"
                        />
                    </label>
                    {isValidDateMinStay ? (
                        <div className="mt-4">
                            <PersonalizedButton buttonName="Cambiar" buttonIcon={<CalendarClock />} />
                        </div>
                    ) : (
                        <p className="text-red-600 text-xs mt-2">La fecha de inicio debe ser anterior o igual a la fecha de fin.</p>
                    )}
                </FloatingFormWrapper>
            </div>
        </div>
    );
}

export default UnitSettings;