import { React, useEffect, useState } from "react";
import Card from '../components/cards'
import LogoText from '../assets/keynest_logo_text.png'
import { Calendar } from "@/components/ui/calendar"
import PieChartReservas from '../components/PieChartReservas'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"



let firstname = localStorage.getItem('firstname');
let lastname = localStorage.getItem('lastname');
let fullName = firstname + " " + lastname;

function UnitDashboard() {

    // constantes
    const [units, setUnits] = useState([]);
    const [error, setError] = useState(null);

    const USERID = localStorage.getItem('userId');
    const URL = `http://localhost:8080/api/unit/${USERID}/units`;

    const token = localStorage.getItem('token');
    const [date, setDate] = useState(new Date());


    useEffect(() => {

        const fetchUnits = async () => {
            try {
                // Hacemos fetch para capturar la respuesta del backend
                const response = await fetch(URL, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                // Si la respuesta no es ok
                if (!response.ok) {
                    // Lanzamos error
                    throw new Error("Error al capturar las unidades.");
                }

                // Sacamos los datos a formato JSON
                const data = await response.json();

                // Usamos el estado funcion 
                setUnits(data);

            } catch (err) {
                setError("Error: " + err.message);
            }
        }

        fetchUnits();

    }, [USERID]);

    // Retornamos el html
    return (
        <div className="h-screen bg-gray-200 rounded-2xl p-6">
            <header className="flex flex-row justify-between items-center rounded-2xl p-6 my-1 shadow-2xl">
                <div className="ml-4 ">
                    <img
                        className="w-32"
                        src={LogoText} alt="Texto Logo de Keynest" />
                </div>
                <div>
                    <div>

                    </div>
                    <div className="mr-4 ">
                        {/* Aqui iria el componente userCard */}
                        <Avatar>
                            <AvatarImage src="https://i.pravatar.cc/300" alt="avatar usuario" />
                            <AvatarFallback>{firstname}{lastname}</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </header>
            <section className="flex flex-row justify-between items-center h-fit shadow-2xl rounded-2xl bg-gray-100">

                <div className="flex flex-col w-full h-full justify-center items-center">
                    <div className="flex flex-row p-3 justify-center items-center gap-2">
                        {error && <p className="text-red-600 font-bold mb-4">{error}</p>}

                        {units.map((unit, index) => {
                            return (
                                <Card
                                    key={index}
                                    name={unit.name}
                                    address={unit.address}
                                    locality={unit.localityName}
                                    id={unit.id}
                                />
                            )
                        })}

                    </div>
                </div>
                <aside className="h-full w-1/4 flex flex-col">
                    <div className="h-1/2 flex flex-col items-center justify-center gap-4 ">
                        {/* completed circulo */}
                        <PieChartReservas reservedDays={130} />
                    </div>
                    <div className="h-1/2 flex items-center justify-center ">
                        {/* calendario */}
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border"
                        />
                    </div>
                </aside>

            </section>
        </div>
    )


}

export default UnitDashboard;