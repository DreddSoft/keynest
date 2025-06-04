import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { FaArrowRightToBracket, FaBed, FaInfo, FaChartLine, FaClipboardUser, FaUserLarge, FaCashRegister, FaRegEnvelope } from "react-icons/fa6";
import ContactForm from "@/components/ContactForm.jsx";
import { Loader2 } from "lucide-react";
import PersonalizedButton from "../components/PersonalizedButton.jsx";

function Unit() {
    const { unitId } = useParams();
    const [unit, setUnit] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);

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

        setLoading(true)
        fetchUnit();
        setLoading(false);
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
            {/* Loading */}
            {loading && (
                <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-gray-800" />
                </div>
            )}


            {/* Botonera superior */}
            <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-4 mb-6 bg-gray-800 w-full p-4 ">
                <div className="flex flex-col justify-center items-center bg-gray-800 w-full flex-wrap sm:flex-row">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="bg-gray-800 text-white px-4 py-2 sm:w-auto w-full rounded border-b-2 border-transparent hover:bg-gray-700 transition hover:cursor-pointer hover:border-b-2 hover:border-b-white flex flex-row justify-center items-center gap-1"
                    >
                        <FaArrowRightToBracket /> Volver
                    </button>
                    <button
                        className={step === 1
                            ? "text-white px-4 py-2 sm:w-auto w-full rounded border-b-2 bg-gray-700 transition hover:cursor-pointer border-b-white flex flex-row justify-center items-center gap-1"
                            : "bg-gray-800 text-white px-4 py-2 rounded border-b-2 border-transparent hover:bg-gray-700 transition hover:cursor-pointer hover:border-b-2 hover:border-b-white flex flex-row justify-center items-center gap-1"
                        }
                        onClick={() => setStep(1)}
                    >
                        <FaInfo /> Info
                    </button>
                    <button
                        className={step === 2
                            ? "text-white px-4 py-2 sm:w-auto w-full rounded border-b-2 bg-gray-700 transition hover:cursor-pointer border-b-white flex flex-row justify-center items-center gap-1"
                            : "bg-gray-800 text-white px-4 py-2 rounded border-b-2 border-transparent hover:bg-gray-700 transition hover:cursor-pointer hover:border-b-2 hover:border-b-white flex flex-row justify-center items-center gap-1"
                        }
                        onClick={() => setStep(2)}
                    >
                        <FaChartLine /> Estadísticas
                    </button>
                    <button
                        className={step === 3
                            ? "text-white px-4 py-2 sm:w-auto w-full rounded border-b-2 bg-gray-700 transition hover:cursor-pointer border-b-white flex flex-row justify-center items-center gap-1"
                            : "bg-gray-800 text-white px-4 py-2 rounded border-b-2 border-transparent hover:bg-gray-700 transition hover:cursor-pointer hover:border-b-2 hover:border-b-white flex flex-row justify-center items-center gap-1"
                        }
                        onClick={() => setStep(3)}
                    >
                        <FaClipboardUser /> Reservas
                    </button>
                    <button
                        className={step === 4
                            ? "text-white px-4 py-2 sm:w-auto w-full rounded border-b-2 bg-gray-700 transition hover:cursor-pointer border-b-white flex flex-row justify-center items-center gap-1"
                            : "bg-gray-800 text-white px-4 py-2 rounded border-b-2 border-transparent hover:bg-gray-700 transition hover:cursor-pointer hover:border-b-2 hover:border-b-white flex flex-row justify-center items-center gap-1"
                        }
                        onClick={() => setStep(4)}
                    >
                        <FaUserLarge /> Clientes
                    </button>
                    <button
                        className={step === 5
                            ? "text-white px-4 py-2 sm:w-auto w-full rounded border-b-2 bg-gray-700 transition hover:cursor-pointer border-b-white flex flex-row justify-center items-center gap-1"
                            : "bg-gray-800 text-white px-4 py-2 rounded border-b-2 border-transparent hover:bg-gray-700 transition hover:cursor-pointer hover:border-b-2 hover:border-b-white flex flex-row justify-center items-center gap-1"
                        }
                        onClick={() => setStep(5)}
                    >
                        <FaCashRegister /> Facturación
                    </button>
                    <button
                        className={step === 6
                            ? "text-white px-4 py-2 sm:w-auto w-full rounded border-b-2 bg-gray-700 transition hover:cursor-pointer border-b-white flex flex-row justify-center items-center gap-1"
                            : "bg-gray-800 text-white px-4 py-2 rounded border-b-2 border-transparent hover:bg-gray-700 transition hover:cursor-pointer hover:border-b-2 hover:border-b-white flex flex-row justify-center items-center gap-1"
                        }
                        onClick={() => setStep(6)}
                    >
                        <FaRegEnvelope /> Contacto
                    </button>
                    <button
                        className="bg-yellow-400 text-black px-4 py-2 sm:w-auto w-full rounded-4xl border-b-2 border-transparent hover:bg-yellow-500 transition hover:cursor-pointer hover:border-b-2 flex flex-row justify-center items-center gap-1"
                        onClick={() => navigate(`/BookingForm/${unitId}`)}
                    >
                        <FaBed /> Reservar
                    </button>
                </div>
            </div>
            {step === 1 && (

                <div>
                    <h2 className="text-3xl font-bold text-blue-900 mb-4">{unit.name}</h2>
                    <div className="p-4">
                        {/* Datos generales */}
                        <fieldset className="mb-6 p-2 border-1 rounded-2xl border-gray-400 flex flex-col justify-center items-center">
                            <legend className="text-xl font-semibold text-gray-800 mb-2 px-2">Datos generales</legend>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
                                <div className="flex flex-col">
                                    <label className="text-gray-700 font-semibold text-sm mb-1">ID</label>
                                    <input
                                        type="text"
                                        value={unit.id}
                                        disabled
                                        className="bg-gray-100 text-gray-800 px-3 py-2 rounded border border-gray-300 text-center"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-700 font-semibold text-sm mb-1">Tipo</label>
                                    <input
                                        type="text"
                                        value={unit.type}
                                        disabled
                                        className="bg-gray-100 text-gray-800 px-3 py-2 rounded border border-gray-300 text-center"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-700 font-semibold text-sm mb-1">Área (m²)</label>
                                    <input
                                        type="text"
                                        value={`${unit.areaM2} m²`}
                                        disabled
                                        className="bg-gray-100 text-gray-800 px-3 py-2 rounded border border-gray-300 text-center"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-700 font-semibold text-sm mb-1">Habitaciones</label>
                                    <input
                                        type="text"
                                        value={unit.rooms}
                                        disabled
                                        className="bg-gray-100 text-gray-800 px-3 py-2 rounded border border-gray-300 text-center"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-700 font-semibold text-sm mb-1">Baños</label>
                                    <input
                                        type="text"
                                        value={unit.bathrooms}
                                        disabled
                                        className="bg-gray-100 text-gray-800 px-3 py-2 rounded border border-gray-300 text-center"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-700 font-semibold text-sm mb-1">Cocina</label>
                                    <input
                                        type="text"
                                        value={unit.hasKitchen ? 'Sí' : 'No'}
                                        disabled
                                        className="bg-gray-100 text-gray-800 px-3 py-2 rounded border border-gray-300 text-center"
                                    />
                                </div>
                                <div className="flex flex-col col-span-2 md:col-span-1">
                                    <label className="text-gray-700 font-semibold text-sm mb-1">Ocupación mínima</label>
                                    <input
                                        type="text"
                                        value={`${unit.minOccupancy} personas`}
                                        disabled
                                        className="bg-gray-100 text-gray-800 px-3 py-2 rounded border border-gray-300 text-center"
                                    />
                                </div>
                                <div className="flex flex-col col-span-2 md:col-span-1">
                                    <label className="text-gray-700 font-semibold text-sm mb-1">Ocupación máxima</label>
                                    <input
                                        type="text"
                                        value={`${unit.maxOccupancy} personas`}
                                        disabled
                                        className="bg-gray-100 text-gray-800 px-3 py-2 rounded border border-gray-300 text-center"
                                    />
                                </div>

                            </div>


                        </fieldset>

                        

                        <div className="flex flex-col md:flex-row gap-6 mt-6">
                            {/* Descripción */}
                            <div className="flex-1 bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">Descripción</h3>
                                <p className="text-gray-700 text-sm">
                                    {unit.description || 'Sin descripción disponible.'}
                                </p>
                            </div>

                            {/* Ubicación */}
                            <div className="flex-1 bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">Ubicación</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 text-sm">
                                    <p><strong>Dirección:</strong> {unit.address}</p>
                                    <p><strong>Código Postal:</strong> {unit.postalCode}</p>
                                    <p><strong>Localidad:</strong> {unit.localityName}</p>
                                    <p><strong>Provincia:</strong> {unit.provinceName}</p>
                                    <p><strong>País:</strong> {unit.countryName}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            )}
            {step === 2 && (
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Estadísticas</h3>
                </div>
            )}
            {step === 3 && (
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Reservas</h3>
                    <div>
                        {/* FOTOS */}
                        <div>
                            {/* Aqui se muestra una tabla con las proximas reservas */}
                        </div>
                        {/* PARTE BAJA */}
                        <div>
                            {/* Solicitar ampliacion de calendario */}
                            <div></div>
                            {/* Otra cosa */}
                            <div></div>
                        </div>
                    </div>
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

            {step === 6 && (
                <div>
                    <ContactForm />
                </div>
            )}

        </div>
    );
}

export default Unit;
