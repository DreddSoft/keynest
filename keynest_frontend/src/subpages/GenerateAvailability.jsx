import React, { useState } from "react";
import { TriangleAlert, Cog, Loader2, Check } from "lucide-react";
import PersonalizedButton from "@/components/PersonalizedButton";

function GenerateAvailability() {
    const [unitId, setUnitId] = useState("");
    const [endDate, setEndDate] = useState("");
    const [price, setPrice] = useState("");
    const [minStay, setMinStay] = useState("");
    const [touched, setTouched] = useState(false);

    // Otros
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [messageCreated, setMessageCreated] = useState(null);


    const isValidUnitId = /^\d+$/.test(unitId);
    const URL_GENERATE = "http://localhost:8080/api/availability/bruteCreate";

    const generate = async () => {

        // Reiniciar campos
        setError(null);
        setMessageCreated(null);

        // cargando
        setLoading(true);

        try {

            const response = await fetch(URL_GENERATE, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    unitId,
                    endDate,
                    price,
                    minStay
                })
            });

            if (!response.ok) {
                throw new Error("Ha ocurrido algún error, no se ha podido generar disponibilidad.");
            }

            const data = await response.json();

            setMessageCreated(data.message);

        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }

    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-xl space-y-4 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Seleccionar Unidad y Fecha</h2>

            {loading && (
                <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-gray-800" />
                </div>
            )}

            {error && (
                <div className="flex justify-baseline items-center gap-2 border border-red-500 bg-red-50 text-red-700 rounded-md p-3 mt-2">
                    <TriangleAlert className="mt-0.5" />
                    <p className="text-sm text-center">{error}</p>
                </div>
            )}

            {messageCreated && (
                <div className="flex justify-baseline items-center gap-2 border border-green-500 bg-green-50 text-green-700 rounded-md p-3 mt-2">
                    <Check className="mt-0.5" />
                    <p className="text-sm text-center">{messageCreated}</p>
                </div>

            )}

            <div className="flex flex-col gap-2">
                <label htmlFor="unitId" className="text-sm font-medium text-gray-700">
                    ID de unidad
                </label>
                <input
                    type="text"
                    id="unitId"
                    name="unitId"
                    value={unitId}
                    onChange={(e) => setUnitId(parseInt(e.target.value))}
                    onBlur={() => setTouched(true)}
                    placeholder="Ej: 2001"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                />
                {touched && !isValidUnitId && (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                        <TriangleAlert className="w-4 h-4" />
                        El ID debe contener solo números.
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="date" className="text-sm font-medium text-gray-700">
                    Fecha
                </label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                />
                <label htmlFor="date" className="text-sm font-medium text-gray-700">
                    Precio por noche
                </label>
                <input
                    type="number"
                    id="price"
                    name="date"
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                />
                <label htmlFor="date" className="text-sm font-medium text-gray-700">
                    Estancia mínima
                </label>
                <input
                    type="number"
                    id="minStay"
                    name="minStay"
                    onChange={(e) => setMinStay(parseInt(e.target.value))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                />
            </div>

            <div className="text-sm text-gray-500 mt-4">
                Unidad seleccionada: <strong>{isValidUnitId ? unitId : "-"}</strong><br />
                Fecha seleccionada: <strong>{endDate || "-"}</strong>
            </div>

            <div
                className="flex flex-row justify-center items-center gap-4 mt-4">
                <div
                    className="w-38"
                >
                    <PersonalizedButton
                        buttonName={"Generar"}
                        buttonIcon={<Cog />}
                        buttonFunction={generate}
                    />
                </div>

            </div>
        </div>
    );
}

export default GenerateAvailability;
