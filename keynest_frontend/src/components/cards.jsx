import { navigate } from "astro/virtual-modules/transitions-router.js";
import React, { useEffect, useState } from "react";
import { FaHouseChimney, FaHotel } from "react-icons/fa6";
import { MdOutlineLocationOn } from "react-icons/md";
import { FiCalendar } from "react-icons/fi";
import PersonalizedButton from "../components/PersonalizedButton.jsx";

function Card({ name, address, locality, id, type }) {
    const fullAddress = `${address}, ${locality}.`;
    const URL_NEXT_BOOKING = `http://localhost:8080/api/booking/getNext/${id}`
    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);
    const [nights, setNights] = useState(null);

    const accessUnit = () => {
        navigate(`/unit/${id}`);
    };

    useEffect(() => {

        // Obtener la proxima reserva de la unidad
        const fetchNextBooking = async () => {
            try {

                const response = await fetch(URL_NEXT_BOOKING, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) {
                    throw new Error("Algo ha ocurrido al capturar la proxima reserva.");
                }

                const data = await response.json();

                // Asignamos estados
                setCheckIn(data.checkIn);
                setCheckOut(data.checkOut);
                setNights(data.nights);
            } catch (err) {
                console.error("Error: " + err.message);
            }
        };

        fetchNextBooking();

    });

    return (
        <div className="bg-white border border-gray-800 rounded-2xl shadow-lg overflow-hidden h-96 w-60 p-4 flex flex-col">

            {/* Sección superior: icono + título */}
            <div className="flex flex-col items-center mb-2 gap-1">
                <div className="bg-gray-200 p-3 rounded mb-2">
                    {(type === "HOUSE" || type === "COUNTRY_HOUSE")
                        ? <FaHouseChimney size={30} />
                        : <FaHotel size={30} />}
                </div>
                <h2 className="text-xl font-bold text-center">{type}</h2>
                <h3 className="text-lg font-semibold text-center">{name}</h3>
            </div>

            {/* Contenido central que se expande */}
            <div className="flex-1 flex flex-col justify-start gap-2 text-sm text-gray-700 px-1">
                <div className="flex items-center gap-2">
                    <FiCalendar size={16} />
                    <span>{(checkIn != null && checkOut != null && nights != null)
                        ? `${checkIn} | ${checkOut}, ${nights}`
                        : "Sin próximas reservas"}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MdOutlineLocationOn size={16} />
                    <span>{fullAddress}</span>
                </div>
            </div>

            {/* Botón inferior fijo */}
            <div className="mt-auto pt-4">
                <PersonalizedButton
                    buttonName={"Acceder"}
                    buttonId={"access"}
                    buttonFunction={accessUnit}
                    className="w-full"
                />
            </div>
        </div>
    );
}

export default Card;
