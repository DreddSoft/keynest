import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Loader2, TriangleAlert, Check } from "lucide-react";
import PersonalizedButton from "@/components/PersonalizedButton";

function CreateUnit({ adminId }) {

    // Utilidades
    const [error, setError] = useState(null);
    const [messageCreated, setMessageCreated] = useState(null);
    const [loading, setLoading] = useState(false);

    // Para El tema direcciones, localidades, paises, provincias
    const [countries, setCountries] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [localities, setLocalities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("");
    const [provinceEnabled, setProvinceEnabled] = useState(false);
    const [localityEnabled, setLocalityEnabled] = useState(false);


    // Estados para crear unidad
    const [userId, setUserId] = useState();
    const [name, setName] = useState();
    const [rooms, setRooms] = useState();
    const [bathrooms, setBathrooms] = useState();
    const [kitchen, setKitchen] = useState();
    const [minOccupancy, setMinOccupancy] = useState();
    const [maxOccupancy, setMaxOccupancy] = useState();
    const [areaM2, setAreaM2] = useState();
    const [description, setDescription] = useState();
    const [type, setType] = useState();
    const [localityId, setLocalityId] = useState();
    const [address, setAddress] = useState();
    const [postalCode, setPostalCode] = useState();




    // CONSTANTES INMUTABLES
    const URL_COUNTRIES = `http://localhost:8080/api/address/countries`;
    const URL_UNIT = `http://localhost:8080/api/unit`;


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

    // Funcion para crear Unidad
    const createUnit = async () => {

        // Comprobamos que minOccupancy no sea mayor que MaxOcc
        if (minOccupancy > maxOccupancy) {
            alert("La ocupación mínima no puede ser mayor que la ocupación máxima.");
            return;
        }

        // Reset de mensajes
        setMessageCreated(null);
        setError(null);

        // Cargando
        setLoading(true);

        try {

            const response = await fetch(URL_UNIT, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    name,
                    rooms,
                    bathrooms,
                    kitchen,
                    minOccupancy,
                    maxOccupancy,
                    areaM2,
                    description,
                    type,
                    localityId,
                    address,
                    postalCode,
                    creatorId: adminId
                })
            });

            if (!response.ok) {
                throw new Error("No se pudo crear la unidad. Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.");
            }

            const data = await response.json();

            setMessageCreated(data.message)

        } catch (err) {
            setError(err.message);

        } finally {
            setLoading(false);
        }

    }

    // function checkValidity() {

    //     // Reiniciar Errores 
    //     setError(null);

    //     let errorMsj = "";

    //     // Comprobar si el usuario tiene algo que no sean numer
    //     const REGEX = /^\d+$/;
    //     if (!REGEX.test(userId)) {
    //         errorMsj += "El ID de usuario ha de ser dígitos, no puede contener letras.";
    //     }

    //     // Room
    //     if (rooms < 0) {
    //         errorMsj += "\nLas Habitaciones no permiten un valor por debajo de 0.";
    //     }

    //     // Bathrooms
    //     if (bathrooms < 0) {
    //         errorMsj += "\nLas Baños no permiten un valor por debajo de 0.";
    //     }

    //     // minOc
    //     if (minOccupancy < 1) { 
    //         errorMsj += "\nLa ocupación mínima no puede ser inferior a 0.";
    //     }

    //     if (errorMsj != "") {
    //         return false;
    //     } else {
    //         return true;
    //     }

    // }

    return (
        <div className="bg-white shadow p-6 rounded-lg w-full max-w-2xl mx-auto space-y-4 my-6">
            {loading && (
                <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-gray-800" />
                </div>
            )}
            <h2 className="text-lg font-semibold text-gray-800">Crear Unidad</h2>

            {error && (
                <div className="flex justify-baseline items-center gap-2 border border-red-500 bg-red-50 text-red-700 rounded-md p-3 mt-2">
                    <TriangleAlert className="mt-0.5" />
                    <p className="text-sm text-center">{error}</p>
                </div>
            )}

            {messageCreated && (
                <div className="flex justify-baseline items-center gap-2 border border-green-500 bg-green-50 text-green-700 rounded-md p-3 mt-2">
                    <Check className="mt-0.5" />
                    <p className="text-sm text-center">{messageCreated}</p>
                </div>

            )}


            <div className="space-y-8 p-6 bg-white text-black rounded-xl shadow-md max-w-4xl mx-auto">
                <div>
                    <h4 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4 text-gray-800">Información de la Unidad</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col text-sm text-gray-700">
                            UserID:
                            <input
                                type="text"
                                className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                onChange={(e) => setUserId(parseInt(e.target.value))}
                                pattern="[0-9]*"
                                inputMode="numeric"

                            />
                        </label>
                        <label className="flex flex-col text-sm text-gray-700">
                            Nombre:
                            <input
                                type="text"
                                pattern="[0-9]*"
                                inputMode="numeric"
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                            />
                        </label>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4 text-gray-800">Datos de la Unidad</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <label className="flex flex-col text-sm text-gray-700">
                                Habitaciones:
                                <input
                                    type="number"
                                    required
                                    onChange={(e) => setRooms(parseInt(e.target.value))}
                                    className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                    min="0"
                                    id="iptRooms"
                                />
                            </label>
                            <label className="flex flex-col text-sm text-gray-700">
                                Baños:
                                <input
                                    type="number"
                                    required
                                    onChange={(e) => setBathrooms(parseInt(e.target.value))}
                                    className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                    min="0"
                                />
                            </label>

                            <label className="flex flex-col text-sm text-gray-700">
                                Tiene Cocina:
                                <select
                                    onChange={(e) => setKitchen(parseInt(e.target.value))}
                                    className="mt-1 p-2 border border-gray-300 rounded-md bg-white text-gray-800"
                                    required
                                >
                                    <option value="" selected disabled>Tiene Cocina...</option>
                                    <option value="1">SI</option>
                                    <option value="0">NO</option>
                                </select>
                            </label>
                            <label className="flex flex-col text-sm text-gray-700">
                                Ocupación mínima:
                                <input
                                    type="number"
                                    onChange={(e) => setMinOccupancy(parseInt(e.target.value))}
                                    required
                                    className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                    min="1"
                                />
                            </label>
                            <label className="flex flex-col text-sm text-gray-700">
                                Ocupación máxima:
                                <input
                                    type="number"
                                    onChange={(e) => setMaxOccupancy(parseInt(e.target.value))}
                                    required
                                    className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                />
                            </label>


                            <label className="flex flex-col text-sm text-gray-700">
                                Área:
                                <input
                                    type="number"
                                    onChange={(e) => setAreaM2(parseFloat(e.target.value))}
                                    required
                                    className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                />
                            </label>
                            <label className="flex flex-col text-sm text-gray-700">
                                Tipo de Unidad:
                                <select
                                    onChange={(e) => setType(parseInt(e.target.value))}
                                    required
                                    className="mt-1 p-2 border border-gray-300 rounded-md bg-white text-gray-800"
                                >
                                    <option value="" disabled>Selecciona el tipo de unidad...</option>
                                    <option value="0">APARTMENT</option>
                                    <option value="1">HOUSE</option>
                                    <option value="2">STUDIO</option>
                                    <option value="3">COUNTRY_HOUSE</option>
                                </select>
                            </label>
                            <label className="flex flex-col text-sm text-gray-700 md:col-span-2">
                                Descripción:
                                <textarea
                                    type="text"
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center row-span-4"
                                />
                            </label>

                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4 text-gray-800">Dirección</h4>
                        <div className="">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        required
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
                                        onChange={(e) => setLocalityId(parseInt(e.target.value))}
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
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                        required
                                    />
                                </label>
                                <label className="flex flex-col text-sm text-gray-700">
                                    Código Postal:
                                    <input
                                        type="text"
                                        onChange={(e) => setPostalCode(e.target.value)}
                                        className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                        required
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div
                        className="flex flex-row justify-center items-center gap-4 mt-4">
                        <div
                            className="w-38"
                        >
                            <PersonalizedButton
                                buttonName={"Crear"}
                                buttonFunction={createUnit}
                            />
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );

}

export default CreateUnit;