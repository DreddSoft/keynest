import React, { useEffect, useState } from "react";
import { Loader2, TriangleAlert, Check } from "lucide-react";
import { format } from "date-fns";

function UnitClients({ unit }) {

    // Constantes de uso
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [ok, setOk] = useState(false);

    // Info de los clientes
    const [clients, setClients] = useState(null);

    useEffect(() => {

        const getClients = async () => {

            resetMessages();

            setLoading(true);

            try {
                const response = await fetch(`http://localhost:8080/api/clients/clientsperunit/${unit.id}`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (response == null) {
                    setOk("No Clientes en el histórica de esta unidad.");
                }

                if (!response.ok) {
                    throw new Error("No se han podido recuperar los clientes.");
                }

                const data = await response.json();

                if (data != null) {
                    setClients(data);
                }


            } catch (err) {
                console.error(err.message);
                setError("Ups! Algo ha ocurrido al recuperar los clientes de su unidad. Inténtelo de nuevo más tarde o póngase en contacto con el administrador.");
            } finally {
                setLoading(false);
            }


        }

        getClients();

    }, [unit]);

    function resetMessages() {
        setError(false);
        setOk(false);
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Clientes de esta unidad</h2>

            {error && (
                <div className="flex justify-baseline items-center gap-2 border border-red-500 bg-red-50 text-red-700 rounded-md p-3">
                    <TriangleAlert className="mt-0.5" />
                    <p className="text-sm text-center">{error}</p>
                </div>
            )}


            {ok && (
                <div className="flex justify-baseline items-center gap-2 border border-green-500 bg-green-50 text-green-700 rounded-md p-3 mt-2">
                    <Check className="mt-0.5" />
                    <p className="text-sm text-center">{ok}</p>
                </div>

            )}

            {loading && (
                <div className="flex justify-center items-center">
                    <Loader2 className="animate-spin w-6 h-6 text-blue-800" />
                </div>
            )}

            <div className="mt-6 overflow-auto rounded-lg shadow">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 text-sm font-semibold">
                            <th className="p-3 text-left border-b">ID</th>
                            <th className="p-3 text-left border-b">Nombre</th>
                            <th className="p-3 text-left border-b">Apellidos</th>
                            <th className="p-3 text-left border-b">Fecha de Nacimiento</th>
                            <th className="p-3 text-left border-b">Nacionalidad</th>
                            <th className="p-3 text-left border-b">Pais</th>
                            <th className="p-3 text-left border-b">Provincia</th>
                            <th className="p-3 text-left border-b">Localidad</th>
                            <th className="p-3 text-left border-b">Dirección</th>
                            <th className="p-3 text-left border-b">Código Postal</th>
                            <th className="p-3 text-left border-b">Email</th>
                            <th className="p-3 text-left border-b">Telf</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700">
                        {!clients && (
                            <tr
                                className="hover:bg-gray-50 cursor-pointer"
                            >
                                <td className="p-3 border-b"></td>
                                <td className="p-3 border-b"></td>
                                <td className="p-3 border-b"></td>
                                <td className="p-3 border-b"></td>
                                <td className="p-3 border-b"></td>
                                <td className="p-3 border-b"></td>
                                <td className="p-3 border-b"></td>
                                <td className="p-3 border-b"></td>
                                <td className="p-3 border-b"></td>
                                <td className="p-3 border-b"></td>
                                <td className="p-3 border-b"></td>
                                <td className="p-3 border-b"></td>
                            </tr>
                        )}
                        {clients && (
                            <>
                                {clients.map((c) => (
                                    <tr
                                        key={c.id}
                                        className="hover:bg-gray-50 cursor-pointer" x
                                    >
                                        <td className="p-3 border-b">{c.id}</td>
                                        <td className="p-3 border-b">{c.name}</td>
                                        <td className="p-3 border-b">{c.lastname}</td>
                                        <td className="p-3 border-b">{format(new Date(c.birthday), "dd/MM/yyyy")}</td>
                                        <td className="p-3 border-b">{c.nationality}</td>
                                        <td className="p-3 border-b">{c.countryName}</td>
                                        <td className="p-3 border-b">{c.provinceName}</td>
                                        <td className="p-3 border-b">{c.localityName}</td>
                                        <td className="p-3 border-b">{c.address}</td>
                                        <td className="p-3 border-b">{c.postalCode}</td>
                                        <td className="p-3 border-b">{c.email}</td>
                                        <td className="p-3 border-b">{c.phone}</td>
                                    </tr>
                                ))}
                            </>
                        )}

                    </tbody>
                </table>
            </div>
        </div>

    )

}

export default UnitClients;