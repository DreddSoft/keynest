import React, { useState } from "react";
import Button2 from "@/components/Button2";
import { Pickaxe, } from "lucide-react";

function UnitControl() {

    const [step, setStep] = useState();
    const [formData, setFormData] = useState({
        name: "",
        rooms: 1,
        bathrooms: 1,
        hasKitchen: false,
        minOccupancy: 1,
        maxOccupancy: 2,
        areaM2: 40,
        description: "",
        type: 1,
        address: "",
        postalCode: "",
    });


    // CONSTANTES
    const userid = parseInt(localStorage.getItem("userId"));


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestBody = {
            ...formData,
            userId,
            creatorId,
            localityId,
        };

        try {
            const response = await fetch("http://localhost:8080/api/unit/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) throw new Error("Error creando la unidad");

            alert("Unidad creada correctamente.");
            setFormData({
                name: "",
                rooms: 1,
                bathrooms: 1,
                hasKitchen: false,
                minOccupancy: 1,
                maxOccupancy: 2,
                areaM2: 40,
                description: "",
                type: 1,
                address: "",
                postalCode: "",
            });
        } catch (err) {
            console.error(err);
            alert("Error al crear unidad");
        }
    };




    return (
        <div>
            <header className="w-auto px-2 flex flex-col flex-wrap justify-center items-center md:flex-row">
                <Button2
                    icon={<Pickaxe />}
                    buttonName={"Crear Unidad"}
                    buttonFunction={() => setStep(1)}
                />

            </header>
            <section>

                {step === 1 && (
                    <div>
                        <form
                            onSubmit={handleSubmit}
                            className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-xl space-y-6"
                        >
                            <h2 className="text-2xl font-bold text-gray-800">Crear Nueva Unidad</h2>

                            {/* Datos Generales */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm"
                                        value={formData.name}

                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tipo</label>
                                    <select
                                        name="type"
                                        value={formData.type}

                                        className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm"
                                    >
                                        <option value={1}>Apartamento</option>
                                        <option value={2}>Estudio</option>
                                        <option value={3}>Villa</option>
                                        <option value={4}>Otro</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Habitaciones</label>
                                    <input
                                        type="number"
                                        name="rooms"
                                        value={formData.rooms}

                                        className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm"
                                        min={0}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Baños</label>
                                    <input
                                        type="number"
                                        name="bathrooms"
                                        value={formData.bathrooms}

                                        className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm"
                                        min={0}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Ocupación mínima</label>
                                    <input
                                        type="number"
                                        name="minOccupancy"
                                        value={formData.minOccupancy}

                                        className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm"
                                        min={1}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Ocupación máxima</label>
                                    <input
                                        type="number"
                                        name="maxOccupancy"
                                        value={formData.maxOccupancy}

                                        className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm"
                                        min={1}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Superficie (m²)</label>
                                    <input
                                        type="number"
                                        name="areaM2"
                                        value={formData.areaM2}

                                        className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm"
                                        min={0}
                                    />
                                </div>

                                <div className="flex items-center space-x-2 mt-6">
                                    <input
                                        type="checkbox"
                                        name="hasKitchen"
                                        checked={formData.hasKitchen}

                                    />
                                    <label className="text-sm text-gray-700">¿Tiene cocina?</label>
                                </div>
                            </div>

                            {/* Dirección */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800">Ubicación</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Dirección</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}

                                            className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Código Postal</label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={formData.postalCode}

                                            className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Descripción */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                                <textarea
                                    name="description"
                                    value={formData.description}

                                    rows={4}
                                    className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm"
                                ></textarea>
                            </div>

                            {/* Botón */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    Crear Unidad
                                </button>
                            </div>
                        </form>

                    </div>
                )}

            </section>

        </div>
    )

}

export default UnitControl;