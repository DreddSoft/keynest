import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Loader2, Hammer, Trash2, CircleX, CircleCheck, TriangleAlert, Check, ArrowLeftToLine } from "lucide-react";
import PersonalizedButton from "@/components/PersonalizedButton";
import { useParams } from "react-router";
import { useNavigate } from "react-router";

function EditBooking({ adminId }) {

    // Utilidades
    const [error, setError] = useState(null);
    const [messageCreated, setMessageCreated] = useState(null);
    const [loading, setLoading] = useState(false);
    const [unitId, setUnitId] = useState(null);
    const [modify, setModify] = useState(null);
    const { selectedUnitId } = useParams();
    const navigate = useNavigate();

    // Para El tema direcciones, localidades, paises, provincias
    const [results, setResults] = useState(null);
    const [countries, setCountries] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [localities, setLocalities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("");
    const [provinceEnabled, setProvinceEnabled] = useState(false);
    const [localityEnabled, setLocalityEnabled] = useState(false);
    const [localityId, setLocalityId] = useState();

    // Datos de la unidad
    const [name, setName] = useState(null);
    const [rooms, setRooms] = useState(null);
    const [bathrooms, setBathrooms] = useState(null);
    const [hasKitchen, setHasKitchen] = useState(null);
    const [minOccupancy, setMinOccupancy] = useState(null);
    const [maxOccupancy, setMaxOccupancy] = useState(null);
    const [aream2, setAream2] = useState(null);
    const [description, setDescription] = useState(null);
    const [unitType, setUnitType] = useState(null);
    const [address, setAddress] = useState(null);
    const [postalCode, setPostalCode] = useState(null);
    const [isActive, setIsActive] = useState(null);



    // CONSTANTES INMUTABLES
    const URL_COUNTRIES = `http://localhost:8080/api/address/countries`;
    const ULR_ACTIVATE = `http://localhost:8080/api/unit/activate`;
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

        const automaticSearch = async () => {

            // Reiniciar
            setError(null);
            setMessageCreated(null);
            setResults(null);

            if (!selectedUnitId) {
                return;
            }

            let idValue = selectedUnitId;

            const URL_SEARCH_UNITS = `http://localhost:8080/api/unit/full/${idValue}`;

            try {
                const response = await fetch(URL_SEARCH_UNITS, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }

                });

                if (!response.ok) throw new Error("No se pudo obtener la información de la Unidad.");

                const data = await response.json();

                setUnitId(data.id);
                setResults(data);
                setIsActive(data.active)
                setError(null);
            } catch (err) {
                setError("Error: " + err.message);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        automaticSearch();

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

        // Reiniciar
        setError(null);
        setMessageCreated(null);
        setResults(null);
        setUnitId(null);

        const value = document.getElementById("searchBar").value;

        let idValue = null;

        setLoading(true);
        const REGEX = /^\d+$/;
        if (REGEX.test(value)) {
            idValue = parseInt(value);

        } else {
            alert("El parámetro de búsqueda introducido no coincide con un ID de unidad.");
        }

        const URL_SEARCH_UNITS = `http://localhost:8080/api/unit/full/${idValue}`;

        try {
            const response = await fetch(URL_SEARCH_UNITS, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }

            });

            if (!response.ok) throw new Error("No se pudo obtener la información de la Unidad.");

            const data = await response.json();

            setUnitId(data.id);
            setResults(data);
            setIsActive(data.active)
            setError(null);
        } catch (err) {
            setError("Error: " + err.message);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const modifyUnit = async () => {

        // Reinicio
        setError(null);
        setMessageCreated(null);

        setLoading(true)

        //TODO: Aqui deberia llamar a una funcion que compruebe los campos

        try {

            const response = await fetch(URL_UNIT, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    unitId,
                    name,
                    rooms,
                    bathrooms,
                    hasKitchen,
                    minOccupancy,
                    maxOccupancy,
                    description,
                    areaM2: aream2,
                    unitTypeOption: unitType,
                    localityId,
                    address,
                    postalCode,
                    updaterId: adminId
                })
            });

            if (!response.ok) {
                throw new Error("No se pudo actualizar la unidad. Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.");
            }

            const data = await response.json();

            setMessageCreated(data.message)

        } catch (err) {

            setError(err.message);

        } finally {
            setLoading(false);
        }



    };

    const activateUnit = async () => {

        // Reiniciamos
        setError(null);
        setMessageCreated(null);

        setLoading(true);

        try {

            const response = await fetch(ULR_ACTIVATE, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    unitId,
                    updaterId: adminId
                })
            });

            if (!response.ok) {
                throw new Error("No se pudo actualizar la unidad. Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.");

            }

            const data = await response.json();

            // Para que vuelva buscar y cargar los resultados
            handleSearch();


            setMessageCreated(data.message);

        } catch (err) {
            setError(err.message);

        } finally {
            setLoading(false);
        }

    }

    const deleteUnit = async () => {

        // Reiniciamos
        setError(null);
        setMessageCreated(null);

        setLoading(true);


        try {

            const response = await fetch(URL_UNIT, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ unitId, updaterId: adminId })

            });

            if (!response.ok) {
                throw new Error("No se pudo ELIMINAR la unidad. Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.");

            }

            const data = await response.json();

            // Para que vuelva buscar y cargar los resultados
            handleSearch();


            setMessageCreated(data.message);

        } catch (err) {
            setError(err.message);

        } finally {
            setLoading(false);
        }


    }

    function goBack() {

        navigate(`/admin`);

    }

    return (

        <div className="bg-white shadow p-6 rounded-lg w-full max-w-2xl mx-auto space-y-4 my-6">
            {loading && (
                <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-gray-800" />
                </div>
            )}

            {selectedUnitId && (
                <div className="w-full flex flex-row justify-center items-center">
                    <button
                        className={results
                            ? "flex flex-row justify-center items-center gap-1 px-4 py-2 text-sm border-y border-blue-500 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                            : "flex flex-row justify-center items-center gap-1 px-4 py-2 text-sm border-y border-blue-500 text-blue-700  cursor-not-allowed"
                        }
                        onClick={goBack}
                    >
                        <ArrowLeftToLine size={16} />
                        Volver
                    </button>
                </div>

            )}

            <h2 className="text-lg font-semibold text-gray-800">Buscar Unidad</h2>

            <div className="flex items-center space-x-2">
                <input
                    type="text"
                    placeholder="ID de la unidad"
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
                            UserID:
                            <input
                                type="text"
                                value={(results)
                                    ? results.userId
                                    : ""}
                                disabled
                                className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                            />
                        </label>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4 text-gray-800">Datos de la Unidad</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="flex flex-col text-sm text-gray-700">
                                Nombre:
                                <input
                                    type="text"
                                    value={modify ? name : (results ? results.name : "")}
                                    disabled={!modify}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                />
                            </label>
                            <label className="flex flex-col text-sm text-gray-700">
                                Rooms:
                                <input
                                    type="number"
                                    value={modify ? rooms : (results ? results.rooms : "")}
                                    disabled={!modify}
                                    onChange={(e) => setRooms(e.target.value)}
                                    className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                />
                            </label>
                            <label className="flex flex-col text-sm text-gray-700">
                                Baños:
                                <input
                                    type="number"
                                    value={modify ? bathrooms : (results ? results.bathrooms : "")}
                                    disabled={!modify}
                                    onChange={(e) => setBathrooms(e.target.value)}
                                    className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                />
                            </label>
                            <label className={modify
                                ? "hidden"
                                : "flex flex-col text-sm text-gray-700"
                            }>
                                Tiene cocina:
                                <input
                                    type="text"
                                    value={results ? (results.hasKitchen ? "SI" : "NO") : ""}
                                    disabled
                                    className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                />
                            </label>

                            <label className={modify
                                ? "flex flex-col text-sm text-gray-700"
                                : "hidden"
                            }>
                                Tiene Cocina:
                                <select
                                    onChange={(e) => setHasKitchen(e.target.value === "true")}
                                    className="mt-1 p-2 border border-gray-300 rounded-md bg-white text-gray-800"
                                    id="iptKitchen"
                                >
                                    <option value="" disabled>Tiene Cocina...</option>
                                    <option value={true}>SI</option>
                                    <option value={false}>NO</option>
                                </select>
                            </label>
                            <label className="flex flex-col text-sm text-gray-700">
                                Ocupación mínima:
                                <input
                                    type="number"
                                    value={modify ? minOccupancy : (results ? results.minOccupancy : "")}
                                    disabled={!modify}
                                    onChange={(e) => setMinOccupancy(e.target.value)}
                                    className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                />
                            </label>
                            <label className="flex flex-col text-sm text-gray-700">
                                Ocupación máxima:
                                <input
                                    type="number"
                                    value={modify ? maxOccupancy : (results ? results.maxOccupancy : "")}
                                    disabled={!modify}
                                    onChange={(e) => setMaxOccupancy(e.target.value)}
                                    className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                />
                            </label>


                            <label className="flex flex-col text-sm text-gray-700">
                                Área:
                                <input
                                    type="number"
                                    value={modify ? aream2 : (results ? results.areaM2 : "")}
                                    disabled={!modify}
                                    onChange={(e) => setAream2(e.target.value)}
                                    className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                />
                            </label>
                            <label className={modify
                                ? "hidden"
                                : "flex flex-col text-sm text-gray-700"
                            }>
                                Tipo de Unidad:
                                <input
                                    type="text"
                                    value={results ? results.unitType : ""}
                                    disabled
                                    className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-center"
                                />
                            </label>
                            <label className={modify
                                ? "flex flex-col text-sm text-gray-700"
                                : "hidden"
                            }>
                                Tipo de Unidad:
                                <select
                                    onChange={(e) => setUnitType(parseInt(e.target.value))}
                                    className="mt-1 p-2 border border-gray-300 rounded-md bg-white text-gray-800"
                                    id="iptKitchen"
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
                                <input
                                    type="text"
                                    value={modify ? description : (results ? results.description : "")}
                                    disabled={!modify}
                                    onChange={(e) => setDescription(e.target.value)}
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
                            : "flex flex-row justify-center items-center gap-4 mt-4"
                        }>

                        {results && isActive && (
                            <>
                                <button
                                    className={results
                                        ? "flex flex-row justify-center items-center gap-1 px-4 py-2 text-sm border-y border-yellow-500 text-yellow-700 hover:bg-yellow-100 transition-colors cursor-pointer"
                                        : "flex flex-row justify-center items-center gap-1 px-4 py-2 text-sm border-y border-yellow-500 text-yellow-700  cursor-not-allowed"
                                    }
                                    disabled={!results}
                                    onClick={() => setModify(true)}
                                >

                                    <Hammer size={16} />
                                    Modificar
                                </button>

                                <button
                                    className={results
                                        ? "flex flex-row justify-center items-center gap-1 px-4 py-2 text-sm border-y border-gray-500 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                        : "flex flex-row justify-center items-center gap-1 px-4 py-2 text-sm border-y border-gray-500 text-gray-700  cursor-not-allowed"
                                    }
                                    disabled={!results}
                                    onClick={activateUnit}
                                >
                                    <CircleX size={16} />
                                    Desactivar
                                </button>
                            </>
                        )}
                        {results && !isActive && (
                            <>
                                <button
                                    className={results
                                        ? "flex flex-row justify-center items-center gap-1 px-4 py-2 text-sm border-y border-green-500 text-green-700 hover:bg-green-100 transition-colors cursor-pointer"
                                        : "flex flex-row justify-center items-center gap-1 px-4 py-2 text-sm border-y border-green-500 text-green-700  cursor-not-allowed"
                                    }
                                    disabled={!results}
                                    onClick={activateUnit}
                                >
                                    <CircleCheck size={16} />
                                    Reactivar
                                </button>
                                <button
                                    className={results
                                        ? "flex flex-row justify-center items-center gap-1 px-4 py-2 text-sm border-y border-red-500 text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
                                        : "flex flex-row justify-center items-center gap-1 px-4 py-2 text-sm border-y border-red-500 text-red-700  cursor-not-allowed"
                                    }
                                    disabled={!results}
                                    onClick={deleteUnit}
                                >
                                    <Trash2 size={16} />
                                    Eliminar
                                </button>
                            </>
                        )}

                    </div>
                    <div
                        className={modify
                            ? "flex flex-row justify-center items-center gap-4 mt-4"
                            : "hidden"
                        }>
                        <button
                            className="px-4 py-2 text-sm border-y border-green-600 text-green-700 hover:bg-green-100 transition-colors cursor-pointer"
                            onClick={modifyUnit}

                        >
                            Aceptar
                        </button>
                        <button
                            className="px-4 py-2 text-sm border-y border-gray-600 text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
                            onClick={() => setModify(false)}
                        >
                            Cancelar
                        </button>


                    </div>
                </div>

            </div>
        </div>
    )

}


export default EditBooking