import React from 'react'
import { LogOut } from "lucide-react";

function Footer() {

  const userId = parseInt(localStorage.getItem("userId"));

  // Funcion para cerrar sesion
  const handleLogout = async () => {

    try {

      const response = await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId:userId})

      });

      if (response.ok) {
        // Borramos todo el localStorage
        localStorage.clear();

        // Redirigimos al Login
        window.location.href = "/login";
      } else {
        console.log("Error al cerrar sesion.");
      }

    } catch (err) {

      console.error("Error al cerrar sesion: ", err);

    }

  }
  return (
    <footer className="bg-gray-200 text-center text-sm text-gray-700 py-4 mt-auto flex flex-col justify-center items-center">

      © {new Date().getFullYear()} KeyNest. Todos los derechos reservados.
      <a href='https://github.com/DreddSoft' className='border-b-2 border-transparent hover:text-pink-900 hover:border-pink-900 transition-colors duration-200'>@DreddSoft</a>

      <button
        onClick={handleLogout}
        className="flex flex-row justify-center items-center border-b-1 border-transparent hover:border-red-600 p-2 text-sm text-red-600 cursor-pointer transition duration-300 gap-1"
      >
       <LogOut/> Salir
      </button>
    </footer>
  )
}

export default Footer