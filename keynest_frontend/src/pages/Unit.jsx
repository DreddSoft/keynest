import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { FaArrowRightToBracket, FaBed, FaInfo, FaChartLine, FaClipboardUser, FaUserLarge, FaCashRegister } from "react-icons/fa6";

function Unit() {
    const { unitId } = useParams();
    const [unit, setUnit] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const URL = `http://localhost:8080/api/unit/${unitId}`;

    useEffect(() => {
        const fetchUnit = async () => {
            try {
                const response = await fetch(URL, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Error al capturar la unidad.");
                }

                const data = await response.json();
                setUnit(data);
            } catch (err) {
                setError("Error: " + err.message);
            }
        };

        fetchUnit();
    }, [unitId]);

    if (error) {
        return <p className="font-bold text-red-600 text-center mt-10">{error}</p>;
    }

    if (!unit) {
        return (
            <div className="text-center mt-10">
                <div className="text-gray-700 text-lg font-semibold animate-pulse">
                    Cargando unidad...
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto mt-8 pb-6 bg-white shadow-2xl rounded-xl min-h-96">
            {/* Botonera superior */}
            <div className="flex justify-between items-center mb-6 bg-gray-800 w-full p-4">
                <div className="flex justify-center items-center bg-gray-800 w-full">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="bg-gray-800 text-white px-4 py-2 rounded border-b-2 border-transparent hover:bg-gray-700 transition hover:cursor-pointer hover:border-b-2 hover:border-b-white flex flex-row justify-center items-center gap-1"
                    >
                        <FaArrowRightToBracket /> Volver
                    </button>
                    <button
                        className={step === 1
                            ? "text-white px-4 py-2 rounded border-b-2 bg-gray-700 transition hover:cursor-pointer border-b-white flex flex-row justify-center items-center gap-1"
                            : "bg-gray-800 text-white px-4 py-2 rounded border-b-2 border-transparent hover:bg-gray-700 transition hover:cursor-pointer hover:border-b-2 hover:border-b-white flex flex-row justify-center items-center gap-1"
                        }
                        onClick={() => setStep(1)}
                    >
                        <FaInfo /> Info
                    </button>
                    <button
                        className={step === 2
                            ? "text-white px-4 py-2 rounded border-b-2 bg-gray-700 transition hover:cursor-pointer border-b-white flex flex-row justify-center items-center gap-1"
                            : "bg-gray-800 text-white px-4 py-2 rounded border-b-2 border-transparent hover:bg-gray-700 transition hover:cursor-pointer hover:border-b-2 hover:border-b-white flex flex-row justify-center items-center gap-1"
                        }
                        onClick={() => setStep(2)} 
                    >
                        <FaChartLine /> Estadísticas
                    </button>
                    <button
                        className={step === 3
                            ? "text-white px-4 py-2 rounded border-b-2 bg-gray-700 transition hover:cursor-pointer border-b-white flex flex-row justify-center items-center gap-1"
                            : "bg-gray-800 text-white px-4 py-2 rounded border-b-2 border-transparent hover:bg-gray-700 transition hover:cursor-pointer hover:border-b-2 hover:border-b-white flex flex-row justify-center items-center gap-1"
                        }
                        onClick={() => setStep(3)} 
                    >
                        <FaClipboardUser /> Reservas
                    </button>
                    <button
                        className={step === 4
                            ? "text-white px-4 py-2 rounded border-b-2 bg-gray-700 transition hover:cursor-pointer border-b-white flex flex-row justify-center items-center gap-1"
                            : "bg-gray-800 text-white px-4 py-2 rounded border-b-2 border-transparent hover:bg-gray-700 transition hover:cursor-pointer hover:border-b-2 hover:border-b-white flex flex-row justify-center items-center gap-1"
                        }
                        onClick={() => setStep(4)} 
                    >
                        <FaUserLarge /> Clientes
                    </button>
                    <button
                        className={step === 5
                            ? "text-white px-4 py-2 rounded border-b-2 bg-gray-700 transition hover:cursor-pointer border-b-white flex flex-row justify-center items-center gap-1"
                            : "bg-gray-800 text-white px-4 py-2 rounded border-b-2 border-transparent hover:bg-gray-700 transition hover:cursor-pointer hover:border-b-2 hover:border-b-white flex flex-row justify-center items-center gap-1"
                        }
                        onClick={() => setStep(5)} 
                    >
                        <FaCashRegister /> Facturación
                    </button>
                    <button
                        className="bg-gray-800 text-white px-4 py-2 rounded border-b-2 border-transparent hover:bg-gray-700 transition hover:cursor-pointer hover:border-b-2 hover:border-b-white flex flex-row justify-center items-center gap-1"
                        onClick={() => navigate(`/BookingForm/${unitId}`)}
                    >
                        <FaBed /> Reservar
                    </button>
                </div>
            </div>
            {step === 1 && (

                <div>
                    <h2 className="text-3xl font-bold text-blue-900 mb-4">{unit.name}</h2>

                    {/* Datos generales */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Datos generales</h3>
                        <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm">
                            <p><strong>ID:</strong> {unit.id}</p>
                            <p><strong>Tipo:</strong> {unit.type}</p>
                            <p><strong>Área:</strong> {unit.areaM2} m²</p>
                            <p><strong>Ocupación:</strong> {unit.minOccupancy} - {unit.maxOccupancy} personas</p>
                            <p><strong>Baños:</strong> {unit.bathrooms}</p>
                            <p><strong>Habitaciones:</strong> {unit.rooms}</p>
                            <p><strong>Cocina:</strong> {unit.hasKitchen ? 'Sí' : 'No'}</p>
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Descripción</h3>
                        <p className="text-gray-700 text-sm">{unit.description || 'Sin descripción disponible.'}</p>
                    </div>

                    {/* Ubicación */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Ubicación</h3>
                        <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm">
                            <p><strong>Dirección:</strong> {unit.address}</p>
                            <p><strong>Código Postal:</strong> {unit.postalCode}</p>
                            <p><strong>Localidad:</strong> {unit.localityName}</p>
                            <p><strong>Provincia:</strong> {unit.provinceName}</p>
                            <p><strong>País:</strong> {unit.countryName}</p>
                        </div>
                    </div>
                </div>

            )}
            {step === 2 && (
                <div>
                    Esto es Estadísticas
                </div>
            )}
            {step === 3 && (
                <div>
                    Esto es Reservas
                </div>
            )}
            {step === 4 && (
                <div>
                    Esto es Clientes
                </div>
            )}
            {step === 5 && (
                <div>
                    Esto es Facturación
                </div>
            )}

        </div>
    );
}

export default Unit;
