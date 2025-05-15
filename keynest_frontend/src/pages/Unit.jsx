import { useEffect, useState } from "react";
import { useParams } from "react-router";

function Unit() {

    // Capturamos el id de la URL
    const { unitId } = useParams();

    // Unidad
    const [unit, setUnit] = useState();
    const [error, setError] = useState();

    // Url del backend
    const URL = `http://localhost:8080/api/unit/${unitId}`;
    const token = localStorage.getItem("token");

    useEffect(() => {

        const fetchUnit = async () => {

            try {

                const response = await fetch(URL, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                // Si la respuesta no es ok, lanzamos error
                if (!response.ok) {
                    throw new Error("Error al capturar la unidad.");
                }

                // Sacamos datos a JSON
                const data = await response.json();

                // Damos valor
                setUnit(data);

            } catch (err) {
                setError("Error: " + err.message);
            }

        }

        fetchUnit();

    }, [unitId]);

    return (
        <div>
            {error && <p className="font-bold text-red-600">{error}</p>}

            {!unit && !error ? (
                <div className="text-center mt-10">
                    <div className="text-gray-700 text-lg font-semibold animate-pulse">Cargando unidad...</div>
                </div>
            ) : unit && (
                <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-blue-900 mb-2">{`${unit.id} - ${unit.name}`}</h2>
                    <p className="text-gray-700 mb-1">{unit.address}</p>
                    <p className="text-gray-600 text-sm">Unidad cargada correctamente.</p>
                </div>
            )}
        </div>
    )

}

export default Unit;