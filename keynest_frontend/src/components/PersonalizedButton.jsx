import React from "react";

function PersonalizedButton({buttonName, buttonId, buttonFunction}) {

    return (
        <button type="button" className="bg-gray-200 border rounded-xl max-w-full py-2 px-2 cursor-pointer hover:bg-gray-800 hover:text-white duration-300 w-full" id={ buttonId } onClick={ buttonFunction }>{ buttonName }</button>

    )
}

export default PersonalizedButton