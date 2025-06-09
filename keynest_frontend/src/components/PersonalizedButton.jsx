import React from "react";

function PersonalizedButton({buttonName, buttonIcon, buttonId, buttonFunction}) {

    return (
        <button type="button" className="bg-gray-200 border rounded-xl max-w-full flex flex-row justify-center items-center gap-1 py-2 px-2 cursor-pointer hover:bg-gray-800 hover:text-white duration-300 w-full" id={ buttonId } onClick={ buttonFunction }>{buttonIcon} { buttonName }</button>

    )
}

export default PersonalizedButton