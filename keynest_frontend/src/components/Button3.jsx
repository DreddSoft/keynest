import React from "react";

function Button3({ onClick, disabled, children }) {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className="mt-2 px-4 py-2 bg-blue-600  hover:bg-blue-500 text-white rounded disabled:opacity-50 cursor-pointer transition duration-200"
        >
            {children || "Comprobar Disponibilidad"}
        </button>
    );
}

export default Button3;