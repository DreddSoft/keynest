import Button2 from "@/components/Button2";
import { House, HousePlus, Loader2, Search, CalendarCog } from "lucide-react";
import { useState } from "react";
import BookingsPerUnit from "@/components/BookingsPerUnit";

function BookingsPanel({ adminId }) {

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
                        buttonName={"Reservas por Unidad"}
                        buttonFunction={() => changeStep(1)}
                        step={step}
                        valueStep={1}
                    />
                    <Button2
                        icon={<HousePlus size={16} />}
                        buttonName={"Editar Reserva"}
                        buttonFunction={() => changeStep(2)}
                        step={step}
                        valueStep={2}
                    />
                </nav>

            </header>

            <main>
                {step === 1 && (
                    <BookingsPerUnit />
                )}

                {step === 2 && (

                    <p>Aquí iría editar una reserva</p>
                )}
            </main >
        </div >
    )

}

export default BookingsPanel;