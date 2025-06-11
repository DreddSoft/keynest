import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import ContactForm from "@/components/ContactForm.jsx";
import { Loader2, ArrowLeftToLine, BadgeInfo, Settings, BookUser, UserRound, Receipt, Mail, Bed } from "lucide-react";
import BookingList from "@/subpages/BookingList.jsx";
import UnitSettings from "@/subpages/UnitSettings.jsx";
import UnitInfo from "@/subpages/UnitInfo.jsx";

function Unit() {
    const { unitId } = useParams();
    const [unit, setUnit] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [step, setStep] = useState(2);
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
                        <ArrowLeftToLine size={20} /> Volver
                    </button>
                    <button
                        className={step === 1
                            ? "text-white px-4 py-2 sm:w-auto w-full rounded border-b-2 bg-gray-700 transition hover:cursor-pointer border-b-white flex flex-row justify-center items-center gap-1"
                            : "bg-gray-800 text-white px-4 py-2 rounded border-b-2 border-transparent hover:bg-gray-700 transition hover:cursor-pointer hover:border-b-2 hover:border-b-white flex flex-row justify-center items-center gap-1"
                        }
                        onClick={() => setStep(1)}
                    >
                        <BadgeInfo size={20}/> Info
                    </button>
                    <button
                        className={step === 2
                            ? "text-white px-4 py-2 sm:w-auto w-full rounded border-b-2 bg-gray-700 transition hover:cursor-pointer border-b-white flex flex-row justify-center items-center gap-1"
                            : "bg-gray-800 text-white px-4 py-2 rounded border-b-2 border-transparent hover:bg-gray-700 transition hover:cursor-pointer hover:border-b-2 hover:border-b-white flex flex-row justify-center items-center gap-1"
                        }
                        onClick={() => setStep(2)}
                    >
                        <Settings size={20} /> Settings
                    </button>
                    <button
                        className={step === 3
                            ? "text-white px-4 py-2 sm:w-auto w-full rounded border-b-2 bg-gray-700 transition hover:cursor-pointer border-b-white flex flex-row justify-center items-center gap-1"
                            : "bg-gray-800 text-white px-4 py-2 rounded border-b-2 border-transparent hover:bg-gray-700 transition hover:cursor-pointer hover:border-b-2 hover:border-b-white flex flex-row justify-center items-center gap-1"
                        }
                        onClick={() => setStep(3)}
                    >
                        <BookUser size={20}/> Reservas
                    </button>
                    <button
                        className={step === 4
                            ? "text-white px-4 py-2 sm:w-auto w-full rounded border-b-2 bg-gray-700 transition hover:cursor-pointer border-b-white flex flex-row justify-center items-center gap-1"
                            : "bg-gray-800 text-white px-4 py-2 rounded border-b-2 border-transparent hover:bg-gray-700 transition hover:cursor-pointer hover:border-b-2 hover:border-b-white flex flex-row justify-center items-center gap-1"
                        }
                        onClick={() => setStep(4)}
                    >
                        <UserRound size={20} /> Clientes
                    </button>
                    <button
                        className={step === 5
                            ? "text-white px-4 py-2 sm:w-auto w-full rounded border-b-2 bg-gray-700 transition hover:cursor-pointer border-b-white flex flex-row justify-center items-center gap-1"
                            : "bg-gray-800 text-white px-4 py-2 rounded border-b-2 border-transparent hover:bg-gray-700 transition hover:cursor-pointer hover:border-b-2 hover:border-b-white flex flex-row justify-center items-center gap-1"
                        }
                        onClick={() => setStep(5)}
                    >
                        <Receipt size={20} /> Facturación
                    </button>
                    <button
                        className={step === 6
                            ? "text-white px-4 py-2 sm:w-auto w-full rounded border-b-2 bg-gray-700 transition hover:cursor-pointer border-b-white flex flex-row justify-center items-center gap-1"
                            : "bg-gray-800 text-white px-4 py-2 rounded border-b-2 border-transparent hover:bg-gray-700 transition hover:cursor-pointer hover:border-b-2 hover:border-b-white flex flex-row justify-center items-center gap-1"
                        }
                        onClick={() => setStep(6)}
                    >
                        <Mail size={20} /> Contacto
                    </button>
                    <button
                        className="bg-yellow-400 text-black px-4 py-2 sm:w-auto w-full rounded-4xl border-b-2 border-transparent hover:bg-yellow-500 transition hover:cursor-pointer hover:border-b-2 flex flex-row justify-center items-center gap-1"
                        onClick={() => navigate(`/BookingForm/${unitId}`)}
                    >
                        <Bed size={20} /> Reservar
                    </button>
                </div>
            </div>
            {step === 1 && (

                <UnitInfo unit={unit} />
            )}
            {step === 2 && (
                <UnitSettings unit={unit} />
            )}
            {step === 3 && (
                <div className="p-2">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Reservas Futuras</h3>
                    <div>
                        <div>
                            {/* Aqui se muestra una tabla con las proximas reservas */}
                            <BookingList 
                            unitId={unitId}
                             />
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
