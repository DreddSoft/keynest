import React from "react";

function FloatingFormWrapper({ title, children }) {
    return (
        <form className="bg-gray-50 shadow-lg rounded-lg p-4 border border-gray-200">
            {title && <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>}
            {children}
        </form>
    );
}

export default FloatingFormWrapper;
