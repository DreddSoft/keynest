import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, LuBedSingle, Users, Calendar, Settings, LuKeyRound } from "lucide-react";

function AdminDashboard() {

  const [step, setStep] = useState();


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-800 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Panel de Administración</h1>
          <nav className="flex space-x-4">
            <Link className="border-b-1 border-transparent hover:border-white text-sm flex items-center gap-1 transition duration-200" onClick={() => setStep(1)}>
              <Users size={16} /> Usuarios
            </Link>
            <Link className="border-b-1 border-transparent hover:border-white text-sm flex items-center gap-1 transition duration-200" onClick={() => setStep(2)}>
              <LuKeyRound size={16} /> Unidades
            </Link>
            <Link onClick={() => setStep(3)} className="border-b-1 border-transparent hover:border-white text-sm flex items-center gap-1 transition duration-200">
              <Calendar size={16} /> Reservas
            </Link>
            <Link onClick={() => setStep(4)} className="border-b-1 border-transparent hover:border-white text-sm flex items-center gap-1 transition duration-200">
              <LuBedSingle size={16} /> Clientes
            </Link>
            <Link onClick={() => setStep(5)} className="border-b-1 border-transparent hover:border-white text-sm flex items-center gap-1 transition duration-200">
              <Settings size={16} /> Clientes
            </Link>
            <button className="hover:underline text-sm flex items-center gap-1 text-red-400 cursor-pointer">
              <LogOut size={16} /> Salir
            </button>
          </nav>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto mt-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition-all">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">Usuarios Registrados</h2>
            <p className="text-gray-700 text-sm">Gestiona los propietarios y revisa sus unidades asignadas.</p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition-all">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">Reservas</h2>
            <p className="text-gray-700 text-sm">Consulta y gestiona las reservas de todas las propiedades.</p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition-all">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">Estadísticas</h2>
            <p className="text-gray-700 text-sm">Accede a gráficos y reportes de ocupación y facturación.</p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition-all">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">Configuración</h2>
            <p className="text-gray-700 text-sm">Ajusta los parámetros generales de la plataforma.</p>
          </div>
        </div>

        {step === 1 && (
          <div>
            Paso 1
          </div>
        )}

        {step === 2 && (
          <div>
            Paso 2
          </div>
        )}
        {step === 3 && (
          <div>
            Paso 3
          </div>
        )}
        {step === 4 && (
          <div>
            Paso 4
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
