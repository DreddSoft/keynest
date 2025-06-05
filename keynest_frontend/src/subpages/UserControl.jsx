import Button2 from "@/components/Button2";
import React from "react";
import { UserSearch, PencilRuler, UserX } from "lucide-react";
import { useState } from "react";
import PersonalizedButton from "@/components/PersonalizedButton";

function UserControl({ adminId }) {

    const [step, setStep] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [id, setId] = useState(null);
    const [email, setEmail] = useState(null);
    const [error, setError] = useState(null);
    const [results, setResults] = useState(null);

    const idAdmin = adminId;
    const URL_SEARCH = `http://localhost:8080/api/users/search`;

    const handleSearch = async () => {

        setSearchTerm(document.getElementById("searchBar").value);

        if (!searchTerm.trim()) return;

        // Como puedo saber si es email o id
        // La idea es que lo compruebe con un regex que si es solo numeros 
        const REGEX = /^\d+$/;

        if (REGEX.test(searchTerm)) {
            // Si pasa true, es un id
            setId(parseInt(searchTerm));
        } else {
            setEmail(searchTerm);
        }

        try {
            const response = await fetch(URL_SEARCH, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id, email: email })
            });

            if (!response.ok) {
                throw new Error("No se pudo obtener el usuario.")
            }

            const data = await response.json();
            setResults(data);

        } catch (err) {
            setError("Error: " + err.message);
            setResults([]);
        }

    };


    return (
        <div>
            <header>
                <nav className="flex flex-col w-full justify-center items-center md:flex-row bg-gray-700 px-4">
                    <Button2
                        icon={<UserSearch size={16} />}
                        buttonName={"Buscar"}
                        buttonFunction={() => setStep(1)}
                    />
                    <Button2
                        icon={<PencilRuler size={16} />}
                        buttonName={"Crear"}
                        buttonFunction={() => setStep(2)}
                    />
                    <Button2
                        icon={<UserX size={16} />}
                        buttonName={"Borrar"}
                        buttonFunction={() => setStep(3)}
                    />
                </nav>

            </header>

            <main>
                {step === 1 && (
                    <div className="bg-white shadow p-6 rounded-lg w-full max-w-2xl mx-auto space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800">Paso 1: Buscar usuario</h2>

                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                placeholder="ID o Email"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded text-sm w-3/4"
                                id="searchBar"
                            />
                            <div className="w-1/4">
                                <PersonalizedButton
                                    buttonName={"Buscar"}
                                    className="w-16"
                                    buttonFunction={handleSearch}
                                />
                            </div>

                        </div>

                        {error && <p className="text-sm text-red-600">{error}</p>}

                        {results && (
                            <div>
                                <div>
                                    <h4>Información de Usuario</h4>
                                    <label>
                                        ID:
                                        <input
                                            type="text"
                                            value={results.id}
                                            disabled

                                        />
                                    </label>
                                    <label>
                                        Email:
                                        <input
                                            type="email"
                                            value={results.email}
                                            disabled
                                        />
                                    </label>
                                    <label>
                                        Rol:
                                        <input
                                            type="text"
                                            value={results.role}
                                            disabled
                                        />
                                    </label>
                                </div>
                                <div>
                                    <h4>Información Personal</h4>
                                    <label>
                                        Nombre:
                                        <input
                                            type="text"
                                            value={results.firstname}
                                            disabled
                                        />
                                    </label>
                                    <label>
                                        Apellidos:
                                        <input
                                            type="text"
                                            value={results.lastname}
                                            disabled
                                        />
                                    </label>
                                    <label>
                                        Fecha de nacimiento:
                                        <input
                                            type="date"
                                            value={results.birthDate}
                                            disabled
                                        />
                                    </label>
                                    <label>
                                        Telf.:
                                        <input
                                            type="text"
                                            value={results.phone}
                                            disabled
                                        />
                                    </label>
                                    <label>
                                        Url imagen de perfil:
                                        <input
                                            type="text"
                                            value={results.profilePictureUrl}
                                            disabled
                                        />
                                    </label>

                                </div>
                                <div>

                                </div>

                            </div>
                        )

                        }
                    </div>
                )}
            </main>
        </div>
    )

}

export default UserControl;