import React from 'react'

function Footer() {
  return (
    <footer className="bg-gray-200 text-center text-sm text-gray-700 py-4 mt-auto flex flex-col justify-center items-center">
      © {new Date().getFullYear()} KeyNest. Todos los derechos reservados.
      <a href='https://github.com/DreddSoft' className='border-b-2 border-transparent hover:text-pink-900 hover:border-pink-900 transition-colors duration-200'>@DreddSoft</a>
    </footer>
  )
}

export default Footer