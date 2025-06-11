import React from "react";

function Button3Gray({ onClick, disabled, children }) {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className="mt-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 hover:border-gray-900 rounded disabled:opacity-50 cursor-pointer transition duration-200"
        >
            {children || "Comprobar Disponibilidad"}
        </button>
    );
}

export default Button3Gray;