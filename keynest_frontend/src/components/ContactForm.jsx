import React from "react";
import PersonalizedButton from "../components/PersonalizedButton.jsx";
import { useState } from "react";
import { Loader2, TriangleAlert, Check, AlertCircle } from "lucide-react";




function ContactForm({unitId, userId}) {

    const [subject, setSubject] = useState(null);
    // const [category, setCategory] = useState(null);
    const [body, setBody] = useState(null);

    // Otras
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false)
    const [ok, setOk] = useState(null);
    const EMAIL_ADMIN = "abontar033@g.educaand.es";


    const sendEmail = async () => {

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
                    email: EMAIL_ADMIN,
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

    function resetMessages() {

        setError(false);
        setOk(false);

    }

    return (
        <div className="flex flex-col justify-center items-center">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Solicitud al administrador</h4>


            {loading && (
                <div className="flex justify-center items-center">
                    <Loader2 className="animate-spin w-6 h-6 text-blue-800" />
                </div>
            )}

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
                        onChange={(e) => setSubject(`Usuario: ${userId} - Unidad: ${unitId} | Categoria: ` + e.target.value)}
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
                        onChange={(e) => setBody(e.target.value)}
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