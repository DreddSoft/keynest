import React from "react";

function Button2({icon, buttonName, buttonFunction, step, valueStep}) {

    return (
        <button className={step === valueStep
            ? "flex flex-row justify-center items-center gap-1 py-2 px-6 cursor-pointer border-y-1  text-white font-semibold bg-gray-600 border-white transition duration-200" 
            : "flex flex-row justify-center items-center gap-1 py-2 px-6 cursor-pointer bg-gray-700 border-y-1 border-transparent text-white font-semibold hover:bg-gray-600 hover:border-white transition duration-200" 
        }
            onClick={buttonFunction}>
            {icon}
            {buttonName}
        </button>
    )
    
}

export default Button2;