import React from "react";

function UnitInfo({ unit }) {
    return (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow space-y-6">
            <h2 className="text-3xl font-bold text-blue-900 mb-4 text-center">{unit.name}</h2>

            {/* Datos generales */}
            <fieldset className="p-4 border border-gray-300 rounded-2xl shadow bg-gray-50">
                <legend className="text-xl font-semibold text-gray-800 px-2">Datos generales</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {[
                        { label: "ID", value: unit.id },
                        { label: "Tipo", value: unit.type },
                        { label: "Área (m²)", value: `${unit.areaM2} m²` },
                        { label: "Habitaciones", value: unit.rooms },
                        { label: "Baños", value: unit.bathrooms },
                        { label: "Cocina", value: unit.hasKitchen ? "Sí" : "No" },
                        { label: "Ocupación mínima", value: `${unit.minOccupancy} personas` },
                        { label: "Ocupación máxima", value: `${unit.maxOccupancy} personas` },
                    ].map(({ label, value }, idx) => (
                        <div key={idx} className="flex flex-col">
                            <label className="text-gray-700 font-semibold text-sm mb-1">{label}</label>
                            <input
                                type="text"
                                value={value}
                                disabled
                                className="bg-gray-100 text-gray-800 px-3 py-2 rounded border border-gray-300 text-center"
                            />
                        </div>
                    ))}
                </div>
            </fieldset>

            {/* Secciones adicionales */}
            <div className="flex flex-col md:flex-row gap-6">
                {/* Descripción */}
                <div className="flex-1 bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow duration-300 border border-gray-200 flex flex-col">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Descripción</h3>
                    <textarea
                        className="text-gray-700 text-sm whitespace-pre-wrap border border-gray-300 rounded-md pl-2 pr-2 pt-2 pb-2 resize-none bg-gray-100"
                        style={{ flexGrow: 1, minHeight: "150px" }}
                        value={unit.description || 'Sin descripción disponible.'}
                        readOnly
                    />
                </div>


                {/* Ubicación */}
                <div className="flex-1 bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow duration-300 border border-gray-200">
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
    );
}

export default UnitInfo;
