import { useState } from "react";
import { Users, Hotel, Calendar, BedSingle, Settings, LogOut, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

function AdminHeader({ setStep, step }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="bg-gray-800 text-white shadow">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Panel de Administración</h1>

                {/* Botones para cuando el menu esta en modo movil */}
                <button
                    className="md:hidden text-white cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Menu de navegacion en pantalla PC */}
                <nav className="hidden md:flex space-x-4 items-center">
                    <Link onClick={() => setStep(1)}
                        className={step === 1
                            ? "p-2 border-b-2 border-b-white text-sm flex items-center gap-1 duration-200 transition cursor-pointer"
                            : "p-2 border-b-2 border-transparent hover:border-b-white text-sm flex items-center gap-1 duration-200 transition cursor-pointer"
                        }>
                        <Users size={16} /> Usuarios
                    </Link>
                    <Link onClick={() => setStep(2)}
                        className={step === 2
                            ? "p-2 border-b-2 border-b-white text-sm flex items-center gap-1 duration-200 transition cursor-pointer"
                            : "p-2 border-b-2 border-transparent hover:border-b-white text-sm flex items-center gap-1 duration-200 transition cursor-pointer"}>
                        <Hotel size={16} /> Unidades
                    </Link>
                    <Link onClick={() => setStep(3)}
                        className={step === 3
                            ? "p-2 border-b-2 border-b-white text-sm flex items-center gap-1 duration-200 transition cursor-pointer"
                            : "p-2 border-b-2 border-transparent hover:border-b-white text-sm flex items-center gap-1 duration-200 transition cursor-pointer"
                        }
                    >
                        <Calendar size={16} /> Reservas
                    </Link>
                </nav>
            </div>

            {/* Menu desplegable en navegacion movil */}
            {isOpen && (
                <div className="md:hidden px-4 pb-4 space-y-2 flex flex-col justify-center items-center">
                    <Link onClick={() => { setStep(1); setIsOpen(false); }} className="block text-sm flex items-center gap-1 w-full rounded-2xl p-2 hover:bg-gray-600 transition duration-200">
                        <Users size={16} /> Usuarios
                    </Link>
                    <Link onClick={() => { setStep(2); setIsOpen(false); }} className="block text-sm flex items-center gap-1 w-full rounded-2xl p-2 hover:bg-gray-600 transition duration-200">
                        <Hotel size={16} /> Unidades
                    </Link>
                    <Link onClick={() => { setStep(3); setIsOpen(false); }} className="block text-sm flex items-center gap-1 w-full rounded-2xl p-2 hover:bg-gray-600 transition duration-200">
                        <Calendar size={16} /> Reservas
                    </Link>
                </div>
            )}
        </header>
    );
}

export default AdminHeader;
