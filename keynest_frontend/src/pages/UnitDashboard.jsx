import { React, useEffect, useState } from "react";
import Card from '../components/cards';
import LogoText from '../assets/keynest_logo_text.png';
import { Calendar } from "@/components/ui/calendar";
import PieChartReservas from '../components/PieChartReservas';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

let firstname = localStorage.getItem('firstname');
let lastname = localStorage.getItem('lastname');

function UnitDashboard() {
    const [units, setUnits] = useState([]);
    const [error, setError] = useState(null);
    const [date, setDate] = useState(new Date());

    const USERID = localStorage.getItem('userId');
    const URL = `http://localhost:8080/api/unit/${USERID}/units`;

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const response = await fetch(URL, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) {
                    throw new Error("Error al capturar las unidades.");
                }

                const data = await response.json();
                setUnits(data);
            } catch (err) {
                setError("Error: " + err.message);
            }
        };

        fetchUnits();
    }, [USERID]);

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-6 flex flex-col">
            {/* Header */}
            <header className="flex justify-between items-center bg-white p-4 rounded-xl shadow mb-4">
                <img src={LogoText} alt="Texto Logo de Keynest" className="w-32" />
                <Avatar>
                    <AvatarImage src="https://i.pravatar.cc/300" alt="avatar usuario" />
                    <AvatarFallback>{firstname?.[0]}{lastname?.[0]}</AvatarFallback>
                </Avatar>
            </header>

            {/* Main Section */}
            <main className="flex flex-col lg:flex-row gap-4 flex-grow ">
                {/* Cards */}
                <section className="flex-1 bg-white p-4 rounded-xl shadow flex flex-wrap justify-center items-center gap-4">
                    {error && <p className="text-red-600 font-bold w-full text-center">{error}</p>}
                    {units.map((unit, index) => (
                        <Card
                            key={index}
                            name={unit.name}
                            address={unit.address}
                            locality={unit.localityName}
                            id={unit.id}
                            type={unit.type}
                        />
                    ))}
                </section>

                {/* Sidebar */}
                <aside className="w-full lg:w-1/3 flex flex-col gap-4">
                    <div className="bg-white p-4 rounded-xl shadow flex justify-center">
                        <PieChartReservas reservedDays={130} />
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow flex justify-center h-full flex items-center justify-center flex-col gap-2">
                        <h3 className="">Calendario</h3>
                        <div className="">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border"
                            />
                        </div>
                    </div>

                </aside>
            </main>
        </div>
    );
}

export default UnitDashboard;
