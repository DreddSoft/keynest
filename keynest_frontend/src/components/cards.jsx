import { navigate } from "astro/virtual-modules/transitions-router.js";
import React from "react";
import { FaHouseChimney } from "react-icons/fa6";
import { FaHotel } from "react-icons/fa6";
import { MdOutlineLocationOn } from "react-icons/md";
import { FiCalendar } from "react-icons/fi";
import PersonalizedButton from "../components/PersonalizedButton.jsx"

function Card({ name, address, locality, id }) {

    let fullAddress = `${address}, ${locality}.`;

    const type = "CASA";

    const accessUnit = () => {

        navigate(`/unit/${id}`);

    }

    return (
        <div className="bg-white border border-gray-800 rounded-2xl shadow-lg overflow-hidden max-w-48 w-fit p-2">
            <div>
                <div className="w-fit m-4 ml-6 p-3 bg-gray-200 rounded flex flex-col">
                    {type == "CASA"
                        ? <FaHouseChimney size={30} />
                        : <FaHotel size={30} />
                    }

                </div>
                <h2 className="text-2xl font-semibold tracking-tighter flex justify-baseline px-3">{name}</h2>
            </div>
            <div className="py-2 flex flex-col gap-2">
                <div className="flex flex-row justify-baseline gap-1 w-full">
                    <FiCalendar size={15} className="w-1/4 flex justify-around items-center"/>
                    <span className="text-gray-700 text-xs wrap-normal w-3/4">May 5 - May 12 / 2025</span>
                </div>
                <div className="flex flex-row justify-baseline gap-1 w-full">
                    <MdOutlineLocationOn size={15} className="w-1/4 flex justify-around items-center"/>
                    <span className="text-gray-700 text-xs wrap-normal w-3/4">{fullAddress}</span>
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <PersonalizedButton 
                    buttonName={"Acceder"}
                    buttonId={"access"}
                    buttonFunction={ accessUnit }
                />
            </div>

        </div>


    )

}

export default Card