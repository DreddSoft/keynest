import { navigate } from "astro/virtual-modules/transitions-router.js";
import React from "react";
import { FaHouseChimney } from "react-icons/fa6";
import { FaHotel } from "react-icons/fa6";
import { MdOutlineLocationOn } from "react-icons/md";
import { FiCalendar } from "react-icons/fi";
import PersonalizedButton from "../components/PersonalizedButton.jsx"

function Card({ name, address, locality, id, type }) {

    let fullAddress = `${address}, ${locality}.`;

    

    const accessUnit = () => {

        navigate(`/unit/${id}`);

    }

    return (
        <div className="bg-white border border-gray-800 rounded-2xl shadow-lg overflow-hidden h-96 w-60 p-2 flex flex-col">
            <div>
                <div className="flex-[1] w-fit m-4 ml-6 p-3 bg-gray-200 rounded flex flex-col">
                    {(type == "HOUSE" || type == "COUNTRY_HOUSE")
                        ? <FaHouseChimney size={30} />
                        : <FaHotel size={30} />
                    }

                </div>
                <h2 className="text-2xl font-semibold tracking-tighter flex justify-baseline px-3">{name}</h2>
            </div>
            <div className="flex-[1] py-2 flex flex-col gap-2">
                <div className="flex flex-row justify-baseline gap-1 w-full">
                    <FiCalendar size={15} className="w-1/4 flex justify-around items-center"/>
                    <span className="text-gray-700 text-xs wrap-normal w-3/4">May 5 - May 12 / 2025</span>
                </div>
                <div className="flex flex-row justify-baseline gap-1 w-full">
                    <MdOutlineLocationOn size={15} className="w-1/4 flex justify-around items-center"/>
                    <span className="text-gray-700 text-xs wrap-normal w-3/4">{fullAddress}</span>
                </div>
            </div>
            <div className="flex-[1] flex-col gap-1">
                <PersonalizedButton 
                    buttonName={"Acceder"}
                    buttonId={"access"}
                    buttonFunction={ accessUnit }
                    className="w-full"
                />
            </div>

        </div>


    )

}

export default Card