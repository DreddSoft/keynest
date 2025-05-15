import React from 'react'

function Footer() {
  return (
    <footer className="bg-gray-200 text-center text-sm text-gray-700 py-4 mt-auto">
      © {new Date().getFullYear()} KeyNest. Todos los derechos reservados.
    </footer>
  )
}

export default Footer