import Button2 from "@/components/Button2";
import React, { useEffect } from "react";
import { House, HousePlus, UserX, Loader2, UserCheck, UserMinus, UserRoundPen, Search } from "lucide-react";
import { useState } from "react";
import PersonalizedButton from "@/components/PersonalizedButton";
import EditUnit from "./EditUnit";


function UnitPanel({ adminId }) {

    const [step, setStep] = useState(1);
    const [error, setError] = useState(null);
    const [messageCreated, setMessageCreated] = useState(null);
    const [modify, setModify] = useState(false);
    const [loading, setLoading] = useState(false);




    

    const [id, setId] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [name, setName] = useState(null);
    const [lastname, setLastname] = useState(null);
    const [bday, setBday] = useState(null);
    const [phone, setPhone] = useState(null);
    const [profilePictureUrl, setProfilePictureUrl] = useState();
    const [address, setAddress] = useState(null);
    const [postalCode, setPostalCode] = useState(null);







    // const createUser = async (e) => {

    //     // Reiniciar mensajes
    //     setError(null);
    //     setMessageCreated(null);

    //     e.preventDefault();
    //     setLoading(true);
    //     try {
    //         const localityId = parseInt(document.getElementById("iptLocality").value);
    //         const response = await fetch(URL_REGISTER, {
    //             method: "POST",
    //             credentials: "include",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({
    //                 email,
    //                 password,
    //                 firstname: name,
    //                 lastname,
    //                 birthDate: bday,
    //                 phone,
    //                 localityId,
    //                 address,
    //                 postalCode
    //             })
    //         });
    //         if (response.ok) {
    //             setMessageCreated("Usuario creado con éxito.");
    //             setError(null);
    //         } else {
    //             throw new Error("Error al crear el usuario.");
    //         }
    //     } catch (err) {
    //         setError(err.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // const updateUser = async (e) => {

    //     // Reiniciar mensajes
    //     setError(null);
    //     setMessageCreated(null);

    //     e.preventDefault();
    //     setLoading(true);
    //     try {
    //         const response = await fetch(URL_UPDATE_USER, {
    //             method: "PUT",
    //             credentials: "include",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({
    //                 id,
    //                 email,
    //                 firstname: name,
    //                 lastname,
    //                 birthDate: bday,
    //                 phone,
    //                 profilePictureUrl,
    //                 localityId,
    //                 address,
    //                 postalCode
    //             })
    //         });

    //         if (response.ok) {
    //             setMessageCreated("Usuario modificado correctamente.");
    //             setModify(false);
    //             setError(null);
    //         } else {
    //             throw new Error("Error al modificar el usuario.");
    //         }
    //     } catch (err) {
    //         setMessageCreated(null);
    //         setError(err.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    // const deleteUser = async () => {

    //     let ok = confirm("¿Desea continuar?");

    //     if (!ok) {
    //         return;
    //     }

    //     setLoading(true);

    //     try {
    //         const response = await fetch(URL_UPDATE_USER, {
    //             method: "DELETE",
    //             credentials: "include",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({ id })
    //         });

    //         if (response.ok) {
    //             setError(null);
    //             setMessageCreated("Usuario eliminado con exito.");
    //         } else {
    //             throw new Error("Error al eliminar al usuario.");
    //         }
    //     } catch (err) {
    //         setMessageCreated(null);
    //         setError(err.message);
    //     } finally {
    //         setLoading(false);
    //     }

    //     // Recargar la pagina
    //     window.location.reload();
    // }

    // hago una funcion para cambiar los pasos y eliminar los mensajes
    function changeStep(step) {

        setLoading(true);

        // Reiniciamos mensaje
        setError(null);
        setMessageCreated(null);

        setStep(step);
        setLoading(false);
        
    }


    return (
        <div>
            {loading && (
                <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-gray-800" />
                </div>
            )}
            <header>
                <nav className="flex flex-col w-full justify-center items-center md:flex-row bg-gray-700 px-4">
                    <Button2
                        icon={<House size={16} />}
                        buttonName={"Buscar"}
                        buttonFunction={() => changeStep(1)}
                    />
                    <Button2
                        icon={<HousePlus size={16} />}
                        buttonName={"Crear"}
                        buttonFunction={() => changeStep(2)}
                    />
                    <Button2
                        icon={<Search size={16} />}
                        buttonName={"Unidades Por Usuario"}
                        buttonFunction={() => changeStep(3)}
                    />
                </nav>

            </header>

            <main>
                {step === 1 && (
                    <EditUnit adminId={adminId} />
                )}

                {step === 2 && (

                    <article className="bg-white shadow p-6 rounded-lg w-full max-w-2xl mx-auto space-y-4 mt-6">
                        <h4 className="text-gray-800 font-bold text-xl">Crear Nuevo Usuario</h4>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="flex flex-col text-sm text-gray-700">
                                Email:
                                <input
                                    type="email"
                                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800"
                                    id="iptEmail"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </label>

                            <label className="flex flex-col text-sm text-gray-700">
                                Contraseña:
                                <input
                                    type="password"
                                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800"
                                    id="iptPass"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </label>

                            <label className="flex flex-col text-sm text-gray-700">
                                Nombre:
                                <input
                                    type="text"
                                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800"
                                    id="iptName"
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </label>

                            <label className="flex flex-col text-sm text-gray-700">
                                Apellidos:
                                <input
                                    type="text"
                                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800"
                                    id="iptLastname"
                                    onChange={(e) => setLastname(e.target.value)}
                                />
                            </label>

                            <label className="flex flex-col text-sm text-gray-700">
                                F. Nacimiento:
                                <input
                                    type="date"
                                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800"
                                    id="iptBday"
                                    onChange={(e) => setBday(e.target.value)}
                                />
                            </label>

                            <label className="flex flex-col text-sm text-gray-700">
                                Telf.:
                                <input
                                    type="text"
                                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800"
                                    id="iptPhone"
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <label className="flex flex-col text-sm text-gray-700">
                                País:
                                <select
                                    value={selectedCountry}
                                    onChange={(e) => handleCountryChange(e.target.value)}
                                    className="mt-1 p-2 border border-gray-300 rounded-md bg-white text-gray-800"
                                    id="iptCountry"
                                >
                                    <option value="" disabled>Selecciona un país...</option>
                                    {countries.map((country) => (
                                        <option key={country.id} value={country.id}>
                                            {country.initials} - {country.name}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="flex flex-col text-sm text-gray-700">
                                Provincia:
                                <select
                                    value={selectedProvince}
                                    onChange={(e) => handleProvinceChange(e.target.value)}
                                    disabled={!provinceEnabled}
                                    className={`mt-1 p-2 border rounded-md bg-white text-gray-800 ${provinceEnabled ? "border-gray-300" : "border-gray-200 text-gray-400"
                                        }`}
                                    id="iptProvince"
                                >
                                    <option value="" disabled>Selecciona una provincia...</option>
                                    {provinces.map((province) => (
                                        <option key={province.id} value={province.id}>
                                            {province.name}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="flex flex-col text-sm text-gray-700">
                                Localidad:
                                <select
                                    disabled={!localityEnabled}
                                    className={`mt-1 p-2 border rounded-md bg-white text-gray-800 ${localityEnabled ? "border-gray-300" : "border-gray-200 text-gray-400"
                                        }`}
                                    id="iptLocality"
                                >
                                    <option value="" disabled>Selecciona una localidad...</option>
                                    {localities.map((locality) => (
                                        <option key={locality.id} value={locality.id}>
                                            {locality.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="flex flex-col text-sm text-gray-700">
                                Dirección:
                                <input
                                    type="text"
                                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800"
                                    id="iptPhone"
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </label>
                            <label className="flex flex-col text-sm text-gray-700">
                                Codigo Postal:
                                <input
                                    type="text"
                                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800"
                                    id="iptPhone"
                                    onChange={(e) => setPostalCode(e.target.value)}
                                />
                            </label>
                        </div>
                        <div className="flex flex-row justify-center items-center">
                            <div className="w-36">
                                <PersonalizedButton
                                    buttonName={"Crear"}
                                    buttonFunction={createUser}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex justify-baseline items-center gap-2 border border-red-500 bg-red-50 text-red-700 rounded-md p-3 mt-2">
                                <UserX className="mt-0.5" />
                                <p className="text-sm text-center">{error}</p>
                            </div>
                        )}

                        {messageCreated && (
                            <div className="flex justify-baseline items-center gap-2 border border-green-500 bg-green-50 text-green-700 rounded-md p-3 mt-2">
                                <UserCheck className="mt-0.5" />
                                <p className="text-sm text-center">{messageCreated}</p>
                            </div>

                        )}

                    </article>
                )}

                {step === 3 && (
                    <article className="bg-white shadow p-6 rounded-lg w-full max-w-2xl mx-auto space-y-4 mt-6">
                        <h4 className="text-gray-800 font-bold text-xl">Cambiar contraseña de usuario</h4>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="flex flex-col text-sm text-gray-700">
                                ID usuario:
                                <input
                                    type="number"
                                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800"
                                    onChange={(e) => setId(e.target.value)}
                                />
                            </label>

                            <label className="flex flex-col text-sm text-gray-700">
                                Contraseña:
                                <input
                                    type="password"
                                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </label>

                        </div>
                        <div className="flex flex-row justify-center items-center">
                            <div className="w-36">
                                <PersonalizedButton
                                    buttonName={"Cambiar"}
                                    buttonFunction={changePassword}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex justify-baseline items-center gap-2 border border-red-500 bg-red-50 text-red-700 rounded-md p-3 mt-2">
                                <UserX className="mt-0.5" />
                                <p className="text-sm text-center">{error}</p>
                            </div>
                        )}

                        {messageCreated && (
                            <div className="flex justify-baseline items-center gap-2 border border-green-500 bg-green-50 text-green-700 rounded-md p-3 mt-2">
                                <UserCheck className="mt-0.5" />
                                <p className="text-sm text-center">{messageCreated}</p>
                            </div>

                        )}
                    </article>

                )}
            </main >
        </div >
    )

}

export default UnitPanel;