import React from "react";
import PersonalizedButton from "../components/PersonalizedButton.jsx";


function ContactForm() {

    return (
        <div className="flex flex-col justify-center items-center">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Solicitud al administrador</h4>

            <div className="w-full max-w-xl bg-white border border-gray-300 rounded-lg shadow-md p-4 space-y-4">
                {/* Campo Para */}
                <div className="flex items-center space-x-2">
                    <label className="w-20 text-sm font-medium text-gray-700">Para:</label>
                    <input
                        type="email"
                        value="admin@keynest.com"
                        disabled
                        className="flex-1 bg-gray-100 text-gray-700 border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                </div>

                {/* Campo Asunto */}
                <div className="flex items-center space-x-2">
                    <label className="w-20 text-sm font-medium text-gray-700">Asunto:</label>
                    <select
                        className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                        defaultValue=""
                    >
                        <option value="" disabled>Selecciona una categoría</option>
                        <option value="incidencia">Incidencia</option>
                        <option value="sugerencia">Sugerencia</option>
                        <option value="facturación">Facturación</option>
                        <option value="facturación">Ampliacion de Calendario</option>
                        <option value="otra">Otra</option>
                    </select>
                </div>

                {/* Campo Mensaje */}
                <div>
                    <textarea
                        placeholder="Escribe tu mensaje aquí..."
                        rows="8"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none"
                    ></textarea>
                </div>

                {/* Botón Enviar */}
                <div className="text-right">
                    <PersonalizedButton
                        buttonName={"Enviar"}
                    />
                </div>
            </div>
        </div>
    )

}

export default ContactForm;