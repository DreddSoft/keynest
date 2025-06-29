import Button2 from "@/components/Button2";
import { House, HousePlus, Loader2, Search, CalendarCog } from "lucide-react";
import { useState } from "react";
import EditUnit from "./EditUnit";
import CreateUnit from "./CreateUnit";
import UnitsPerUser from "./UnitsPerUser";
import GenerateAvailability from "./GenerateAvailability"; 


function UnitPanel({ adminId }) {

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // hago una funcion para cambiar los pasos y eliminar los mensajes
    function changeStep(step) {

        setLoading(true);

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
                        step={step}
                        valueStep={1}
                    />
                    <Button2
                        icon={<HousePlus size={16} />}
                        buttonName={"Crear"}
                        buttonFunction={() => changeStep(2)}
                        step={step}
                        valueStep={2}
                    />
                    <Button2
                        icon={<Search size={16} />}
                        buttonName={"Unidades Por Usuario"}
                        buttonFunction={() => changeStep(3)}
                        step={step}
                        valueStep={3}
                    />
                    <Button2
                        icon={<CalendarCog size={16} />}
                        buttonName={"Generar Disponiblidad"}
                        buttonFunction={() => changeStep(4)}
                        step={step}
                        valueStep={4}
                    />
                </nav>

            </header>

            <main>
                {step === 1 && (
                    <EditUnit adminId={adminId} />
                )}

                {step === 2 && (

                    <CreateUnit adminId={adminId} />
                )}

                {step === 3 && (
                    <UnitsPerUser />

                )}

                {step === 4 && (
                    <GenerateAvailability />
                )}

            </main >
        </div >
    )

}

export default UnitPanel;