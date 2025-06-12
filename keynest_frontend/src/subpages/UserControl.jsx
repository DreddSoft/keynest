import Button2 from "@/components/Button2";
import React, { useEffect } from "react";
import { UserSearch, PencilRuler, UserX, Loader2, UserCheck, UserMinus, UserRoundPen, KeyRound } from "lucide-react";
import { useState } from "react";
import PersonalizedButton from "@/components/PersonalizedButton";

function UserControl() {

    const [step, setStep] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [id, setId] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [document, setDocument] = useState(null);
    const [name, setName] = useState(null);
    const [lastname, setLastname] = useState(null);
    const [bday, setBday] = useState(null);
    const [phone, setPhone] = useState(null);
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);
    const [localityId, setLocalityId] = useState(null);
    const [address, setAddress] = useState(null);
    const [postalCode, setPostalCode] = useState(null);
    const [error, setError] = useState(null);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [countries, setCountries] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [localities, setLocalities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("");
    const [provinceEnabled, setProvinceEnabled] = useState(false);
    const [localityEnabled, setLocalityEnabled] = useState(false);
    const [messageCreated, setMessageCreated] = useState(null);
    const [modify, setModify] = useState(false);

    const URL_SEARCH = `http://localhost:8080/api/users/search`;
    const URL_COUNTRIES = `http://localhost:8080/api/address/countries`;
    const URL_REGISTER = "http://localhost:8080/auth/register";
    const URL_UPDATE_USER = `http://localhost:8080/api/users`;
    const URL_CHANGE_PASS = `http://localhost:8080/api/users/pass`;

    useEffect(() => {
        const fetchCountries = async () => {
            setLoading(true);
            try {
                const response = await fetch(URL_COUNTRIES, {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" }
                });
                if (!response.ok) throw new Error("Error al capturar los países.");
                const data = await response.json();
                setCountries(data);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCountries();
    }, []);

    const handleCountryChange = async (countryId) => {
        setSelectedCountry(countryId);
        setProvinces([]);
        setLocalities([]);
        setProvinceEnabled(false);
        setLocalityEnabled(false);
        if (!countryId) return;
        const URL = `http://localhost:8080/api/address/provinces/${countryId}`;
        setLoading(true);
        try {
            const res = await fetch(URL, { method: "GET", credentials: "include" });
            if (!res.ok) throw new Error("Error al capturar las provincias");
            const data = await res.json();
            setProvinces(data);
            setProvinceEnabled(true);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleProvinceChange = async (provinceId) => {
        setSelectedProvince(provinceId);
        setLocalities([]);
        setLocalityEnabled(false);
        if (!provinceId) return;
        const URL = `http://localhost:8080/api/address/localities/${provinceId}`;
        setLoading(true);
        try {
            const res = await fetch(URL, { method: "GET", credentials: "include" });
            if (!res.ok) throw new Error("Error al capturar las localidades");
            const data = await res.json();
            setLocalities(data);
            setLocalityEnabled(true);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {

        // Reiniciar mensajes
        setError(null);
        setMessageCreated(null);
        // setSearchTerm(null);

        // const value = document.getElementById("searchBar").value;
        // setSearchTerm(value);
        // if (!value.trim()) return;
        setLoading(true);

        const REGEX = /^\d+$/;

        // Separamos en variables diferentes para evitar el primer envío nulo
        let idToSearch = null;
        let emailToSearch = null;

        // Comprobamos que sean dígitos y otra cosa
        if (REGEX.test(searchTerm)) {
            idToSearch = parseInt(searchTerm);
        } else {
            emailToSearch = searchTerm;
        }


        try {
            const response = await fetch(URL_SEARCH, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: idToSearch, email: emailToSearch })
            });

            if (!response.ok) throw new Error("No se pudo obtener el usuario.");

            const data = await response.json();

            setId(data.id);
            setResults(data);
            setError(null);
        } catch (err) {
            setError("Error: " + err.message);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const createUser = async (e) => {

        // Reiniciar mensajes
        setError(null);
        setMessageCreated(null);

        console.log(localityId);

        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(URL_REGISTER, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    password,
                    firstname: name,
                    lastname,
                    birthDate: bday,
                    phone,
                    localityId,
                    address,
                    postalCode,
                    dniNif: document
                })
            });
            if (response.ok) {
                setMessageCreated("Usuario creado con éxito.");
                setError(null);
            } else {
                throw new Error("Error al crear el usuario.");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (e) => {

        // Reiniciar mensajes
        setError(null);
        setMessageCreated(null);

        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(URL_UPDATE_USER, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id,
                    email,
                    firstname: name,
                    lastname,
                    birthDate: bday,
                    phone,
                    profilePictureUrl,
                    localityId,
                    address,
                    postalCode
                })
            });

            if (response.ok) {
                setMessageCreated("Usuario modificado correctamente.");
                setModify(false);
                setError(null);
            } else {
                throw new Error("Error al modificar el usuario.");
            }
        } catch (err) {
            setMessageCreated(null);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const deleteUser = async () => {

        let ok = confirm("¿Desea continuar?");

        if (!ok) {
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(URL_UPDATE_USER, {
                method: "DELETE",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });

            if (response.ok) {
                setError(null);
                setMessageCreated("Usuario eliminado con exito.");
            } else {
                throw new Error("Error al eliminar al usuario.");
            }
        } catch (err) {
            setMessageCreated(null);
            setError(err.message);
        } finally {
            setLoading(false);
        }

        // Recargar la pagina
        window.location.reload();
    }

    const changePassword = async () => {

        let ok = confirm("¿Desea continuar?");

        if (!ok) return;

        setError(null);
        setMessageCreated(null);
        setLoading(true);

        try {

            const response = await fetch(URL_CHANGE_PASS, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: id, password: password })
            });

            if (response.ok) {
                const data = await response.json();
                setMessageCreated(data.message);
            } else {
                throw new Error("No se ha podido cambiar la contraseña.");
            }

        } catch (err) {
            setMessageCreated(null);
            setError(err.message);
        } finally {
            setLoading(false);
        }

    }

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
                        icon={<UserSearch size={16} />}
                        buttonName={"Buscar"}
                        buttonFunction={() => changeStep(1)}
                        step={step}
                        valueStep={1}
                    />
                    <Button2
                        icon={<PencilRuler size={16} />}
                        buttonName={"Crear"}
                        buttonFunction={() => changeStep(2)}
                        step={step}
                        valueStep={2}
                    />
                    <Button2
                        icon={<KeyRound size={16} />}
                        buttonName={"New password"}
                        buttonFunction={() => changeStep(3)}
                        step={step}
                        valueStep={3}
                    />
                </nav>

            </header>

            <main>
                {step === 1 && (
                    <div className="bg-white shadow p-6 rounded-lg w-full max-w-2xl mx-auto space-y-4 mt-6">
                        <h2 className="text-lg font-semibold text-gray-800">Buscar usuario</h2>

                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                placeholder="ID o Email"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded text-sm w-3/4"
                                id="searchBar"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="w-1/4">
                                <PersonalizedButton
                                    buttonName={"Buscar"}
                                    className="w-16"
                                    buttonFunction={handleSearch}
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


                        <div className="space-y-8 p-6 bg-white text-black rounded-xl shadow-md max-w-4xl mx-auto">
                            <div>
                                <h4 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4 text-gray-800">Información de Usuario</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="flex flex-col text-sm text-gray-700">
                                        ID:
                                        <input
                                            type="text"
                                            value={(results)
                                                ? results.id
                                                : ""}
                                            disabled
                                            className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                        />
                                    </label>
                                    <label className="flex flex-col text-sm text-gray-700">
                                        Email:
                                        <input
                                            type="email"
                                            value={modify ? email : (results ? results.email : "")}
                                            disabled={!modify}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                        />
                                    </label>
                                    <label className="flex flex-col text-sm text-gray-700">
                                        Rol:
                                        <input
                                            type="text"
                                            value={(results)
                                                ? results.role
                                                : ""}
                                            disabled
                                            className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                        />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4 text-gray-800">Información Personal</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="flex flex-col text-sm text-gray-700">
                                        Nombre:
                                        <input
                                            type="text"
                                            value={modify ? name : (results ? results.firstname : "")}
                                            disabled={!modify}
                                            onChange={(e) => setName(e.target.value)}
                                            className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                        />
                                    </label>
                                    <label className="flex flex-col text-sm text-gray-700">
                                        Apellidos:
                                        <input
                                            type="text"
                                            value={modify ? lastname : (results ? results.lastname : "")}
                                            disabled={!modify}
                                            onChange={(e) => setLastname(e.target.value)}
                                            className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                        />
                                    </label>
                                    <label className="flex flex-col text-sm text-gray-700">
                                        Fecha de nacimiento:
                                        <input
                                            type="date"
                                            value={
                                                modify
                                                    ? bday
                                                    : results && results.birthDate
                                                        ? results.birthDate.slice(0, 10)
                                                        : ""
                                            }
                                            disabled={!modify}
                                            onChange={(e) => setBday(e.target.value)}
                                            className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                        />
                                    </label>
                                    <label className="flex flex-col text-sm text-gray-700">
                                        Telf.:
                                        <input
                                            type="text"
                                            value={modify ? phone : (results ? results.phone : "")}
                                            disabled={!modify}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                        />
                                    </label>
                                    <label className="flex flex-col text-sm text-gray-700 md:col-span-2">
                                        Url imagen de perfil:
                                        <input
                                            type="text"
                                            value={modify ? profilePictureUrl : (results ? results.profilePictureUrl : "")}
                                            disabled={!modify}
                                            onChange={(e) => setProfilePictureUrl(e.target.value)}
                                            className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                        />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4 text-gray-800">Dirección</h4>
                                <div className="">
                                    <div className={modify
                                        ? "hidden"
                                        : "grid grid-cols-1 md:grid-cols-2 gap-4"
                                    }>
                                        <label className="flex flex-col text-sm text-gray-700">
                                            País:
                                            <input
                                                type="text"
                                                value={(results)
                                                    ? results.country
                                                    : ""}
                                                disabled
                                                className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                            />
                                        </label>
                                        <label className="flex flex-col text-sm text-gray-700">
                                            Provincia:
                                            <input
                                                type="text"
                                                value={(results)
                                                    ? results.province
                                                    : ""}
                                                disabled
                                                className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                            />
                                        </label>
                                        <label className="flex flex-col text-sm text-gray-700">
                                            Localidad:
                                            <input
                                                type="text"
                                                value={(results)
                                                    ? results.locality
                                                    : ""}
                                                disabled
                                                className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                            />
                                        </label>
                                    </div>
                                    <div className={modify
                                        ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                                        : "hidden"
                                    }>
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
                                                onChange={(e) => setLocalityId(e.target.value)}
                                            >
                                                <option value="" disabled>Selecciona una localidad...</option>
                                                {localities.map((locality) => (
                                                    <option key={locality.id} value={locality.id}>
                                                        {locality.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>

                                    </div>
                                    <div
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                    >
                                        <label className="flex flex-col text-sm text-gray-700">
                                            Dirección:
                                            <input
                                                type="text"
                                                value={modify ? address : (results ? results.address : "")}
                                                disabled={!modify}
                                                onChange={(e) => setAddress(e.target.value)}
                                                className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                            />
                                        </label>
                                        <label className="flex flex-col text-sm text-gray-700">
                                            Código Postal:
                                            <input
                                                type="text"
                                                value={modify ? postalCode : (results ? results.postalCode : "")}
                                                disabled={!modify}
                                                onChange={(e) => setPostalCode(e.target.value)}
                                                className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div
                                className={modify
                                    ? "hidden"
                                    : "flex flex-row justify-center items-center gap-4"
                                }>
                                <button
                                    className={results
                                        ? "flex flex-row justify-center items-center gap-1 px-4 py-2 text-sm border-y border-yellow-500 text-yellow-700 hover:bg-yellow-100 transition-colors cursor-pointer"
                                        : "flex flex-row justify-center items-center gap-1 px-4 py-2 text-sm border-y border-yellow-500 text-yellow-700  cursor-not-allowed"
                                    }
                                    disabled={!results}
                                    onClick={() => setModify(true)}
                                >

                                    <UserRoundPen size={16} />
                                    Modificar
                                </button>
                                <button
                                    className={results
                                        ? "flex flex-row justify-center items-center gap-1 px-4 py-2 text-sm border-y border-red-500 text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
                                        : "flex flex-row justify-center items-center gap-1 px-4 py-2 text-sm border-y border-red-500 text-red-700  cursor-not-allowed"
                                    }
                                    disabled={!results}
                                    onClick={deleteUser}
                                >
                                    <UserMinus size={16} />
                                    Eliminar
                                </button>
                            </div>
                            <div
                                className={modify
                                    ? "flex flex-row justify-center items-center gap-4"
                                    : "hidden"
                                }>
                                <button
                                    className="px-4 py-2 text-sm rounded-md border border-green-600 text-green-700 hover:bg-green-100 transition-colors cursor-pointer"
                                    onClick={updateUser}
                                >
                                    Aceptar
                                </button>
                                <button
                                    className="px-4 py-2 text-sm rounded-md border border-gray-600 text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
                                    onClick={() => setModify(false)}
                                >
                                    Cancelar
                                </button>


                            </div>
                        </div>

                    </div>
                )}

                {step === 2 && (

                    <form className="bg-white shadow p-6 rounded-lg w-full max-w-2xl mx-auto space-y-4 mt-6">
                        <h4 className="text-gray-800 font-bold text-xl">Crear Nuevo Usuario</h4>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="flex flex-col text-sm text-gray-700">
                                Email:
                                <input
                                    type="email"
                                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800"
                                    pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </label>

                            <label className="flex flex-col text-sm text-gray-700">
                                Contraseña:
                                <input
                                    type="password"
                                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800"
                                    id="iptPass"
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </label>
                            <label className="flex flex-col text-sm text-gray-700">
                                DNI/NIF:
                                <input
                                    type="text"
                                    pattern="[A-Z0-9]+"
                                    title="Solo letras mayúsculas y números"
                                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800"
                                    required
                                    onChange={(e) => setDocument(e.target.value)}
                                />
                            </label>

                            <label className="flex flex-col text-sm text-gray-700">
                                Nombre:
                                <input
                                    type="text"
                                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800"
                                    id="iptName"
                                    pattern="^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$"
                                    required
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </label>

                            <label className="flex flex-col text-sm text-gray-700">
                                Apellidos:
                                <input
                                    type="text"
                                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800"
                                    pattern="^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$"
                                    required
                                    id="iptLastname"
                                    onChange={(e) => setLastname(e.target.value)}
                                />
                            </label>

                            <label className="flex flex-col text-sm text-gray-700">
                                F. Nacimiento:
                                <input
                                    type="date"
                                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800"
                                    required
                                    id="iptBday"
                                    onChange={(e) => setBday(e.target.value)}
                                />
                            </label>

                            <label className="flex flex-col text-sm text-gray-700">
                                Telf.:
                                <input
                                    type="text"
                                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800"
                                    required
                                    pattern="[0-9]+"
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
                                    onChange={(e) => setLocalityId(parseInt(e.target.value))}
                                    required
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
                                    required
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </label>
                            <label className="flex flex-col text-sm text-gray-700">
                                Codigo Postal:
                                <input
                                    type="text"
                                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800"
                                    required
                                    onChange={(e) => setPostalCode(e.target.value)}
                                    pattern="[0-9]+"
                                />
                            </label>
                        </div>
                        <div className="flex flex-row justify-center items-center">
                            <div className="w-36">
                                <PersonalizedButton
                                    buttonType={"submit"}
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

                    </form>
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

export default UserControl;