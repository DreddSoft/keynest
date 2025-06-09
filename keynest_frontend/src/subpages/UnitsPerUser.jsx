import React, { useState } from "react";
import { Loader2, TriangleAlert, Check, Search } from "lucide-react";
import PersonalizedButton from "@/components/PersonalizedButton";
import { Navigate, useNavigate } from "react-router";

function UnitsPerUser() {
    const [userId, setUserId] = useState("");
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [touched, setTouched] = useState(false);

    const isValidUserId = /^\d+$/.test(userId);
    const navigate = useNavigate();

    const fetchUnits = async () => {

        setTouched(true);
        if (!isValidUserId) return;

        // Reinicar 
        setLoading(true);
        setError(null);

        try {

            const response = await fetch(`http://localhost:8080/api/unit/${userId}/units`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });

            console.log(response);

            if (!response.ok) throw new Error("No se pudo obtener la información.");

            const data = await response.json();

            setUnits(data);

        } catch (err) {

            setError(err.message);
            setUnits([]);

        } finally {

            setLoading(false);
        }
    };

    function openUnit(selectedUnitId) {

        const id = parseInt(selectedUnitId);

        navigate(`/editUnit/${id}`);

        
    }

    return (
        <div className="bg-white shadow p-6 rounded-lg w-full max-w-2xl mx-auto space-y-4 my-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Buscar unidades por ID de usuario</h2>

            <div className="flex flex-col items-center justify-center sm:flex-row sm:items-center gap-4 mb-6">
                <input
                    type="text"
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-800"
                    placeholder="Introduce ID de usuario"
                    value={userId}
                    onChange={(e) => setUserId(parseInt(e.target.value))}
                    onBlur={() => setTouched(true)}
                />
                <div className="w-full sm:w-32">
                    <PersonalizedButton onClick={fetchUnits}
                        buttonName={"Buscar"}
                        buttonIcon={<Search />}
                        buttonFunction={fetchUnits}

                    />
                </div>
            </div>

            {touched && !isValidUserId && (
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

            {!loading && units.length > 0 && (
                <div className="overflow-x-auto mt-4">
                    <table className="min-w-full border border-gray-200">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="py-2 px-4 border-b">ID</th>
                                <th className="py-2 px-4 border-b">Nombre</th>
                                <th className="py-2 px-4 border-b">Tipo</th>
                                <th className="py-2 px-4 border-b">Dirección</th>
                                <th className="py-2 px-4 border-b">Localidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {units.map((unit) => (
                                <tr key={unit.id} className="hover:bg-gray-50 cursor-pointer"
                                onDoubleClick={() => openUnit(unit.id)}
                                >
                                    <td className="py-2 px-4 border-b">{unit.id}</td>
                                    <td className="py-2 px-4 border-b">{unit.name}</td>
                                    <td className="py-2 px-4 border-b">{unit.type}</td>
                                    <td className="py-2 px-4 border-b">{unit.address}</td>
                                    <td className="py-2 px-4 border-b">{unit.localityName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default UnitsPerUser;
