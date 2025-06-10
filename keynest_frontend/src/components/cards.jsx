import { navigate } from "astro/virtual-modules/transitions-router.js";
import React from "react";
import { FaHouseChimney, FaHotel } from "react-icons/fa6";
import { MdOutlineLocationOn } from "react-icons/md";
import { FiCalendar } from "react-icons/fi";
import PersonalizedButton from "../components/PersonalizedButton.jsx";

function Card({ name, address, locality, id, type, checkIn, checkOut, nights, bookingId, bookingStatus }) {
    const fullAddress = `${address}, ${locality}.`;

    const accessUnit = () => {
        navigate(`/unit/${id}`);
    };


    // Función para iniciar el precheckIn de una reserva
    const preCheckIn = async () => {
        console.log("Se inicia precheckin");
    }

    // Función para iniciar el checkIn de una reserva
    const initCheckIn = async () => {

        // Realmente esta función sólo cambia el status de la reserva
        const URL_CHECKIN = `http://localhost:8080/api/booking/checkIn/${bookingId}`;

        // Si ya esta en checkIn, esto es una comprobación redundante.
        if (bookingStatus === 2) return;

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
        }

    }

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
            {bookingStatus === 1 && (
                <div className="mt-auto pt-4">
                    <PersonalizedButton
                        buttonName={"Pre Check-In"}
                        buttonId={"precheckin"}
                        buttonFunction={preCheckIn}
                        className="w-full"
                    />
                </div>
            )}

            {bookingStatus === 2 && (
                <div className="mt-auto pt-4">
                    <PersonalizedButton
                        buttonName={"Check-In"}
                        buttonId={"precheckin"}
                        buttonFunction={initCheckIn}
                        className="w-full"
                    />
                </div>
            )}

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
