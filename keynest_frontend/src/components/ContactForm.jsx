import React from "react";
import PersonalizedButton from "../components/PersonalizedButton.jsx";
import { useState } from "react";



function ContactForm(unitId, userId, value) {

    const [subject, setSubject] = useState();
    const [ok, setOk] = useState();
    const [message, setMessage] = useState();
    const [error, setError] = useState();
    const EMAIL_ADMIN = "admin@keynest.com";
    const URL_EMAIL = "";

    function subjectGeneric(unitId, userId) {

        let stringSubject = `Usuario: ${userId} - unidad: ${unitId} | ${value}`;

        setSubject(stringSubject);

    }

    const sendEmail = async () => {

        setMessage(document.getElementById("messageTextArea").value);

        try {
            const response = await fetch(URL_EMAIL, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify({ email: EMAIL_ADMIN, subject: subject, message:message })
            })

            if (!response.ok) {
                throw new Error("No se ha podido enviar la notificacion.");   
            } else {
                setOk("Mensaje enviado con exito.");
            }
        } catch (err) {
            setError("Error: " + err.message);
        }
        
    }


    return (
        <div className="flex flex-col justify-center items-center">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Solicitud al administrador</h4>

            <div className="w-full max-w-xl bg-white border border-gray-300 rounded-lg shadow-md p-4 space-y-4">
                {/* Campo Para */}
                <div className="flex items-center space-x-2">
                    <label className="w-20 text-sm font-medium text-gray-700">Para:</label>
                    <input
                        type="email"
                        value={EMAIL_ADMIN}
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
                        onChange={(e) => subjectGeneric(unitId, userId, e.targe.value)}
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
                        id="messageTextArea"
                    ></textarea>
                </div>

                {/* Botón Enviar */}
                <div className="text-right">
                    <PersonalizedButton
                        buttonName={"Enviar"}
                        buttonFunction={() => sendEmail()}
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
        </div>
    )

}

export default ContactForm;