import { useState } from 'react'
import logo from '../assets/keynest_logo.svg'
import miniLogo from '../assets/keynest_logo_mini.svg'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from "lucide-react";


function Login({ setIsAuthenticated }) {

  // constantes con estados para los valores
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Logica de funcionalidad
  const handleSubmit = async (e) => {

    // Prevenimos el evento por defecto de envio de form
    e.preventDefault();
    setError(null);

    // Loading
    setLoading(true);

    try {

      // Capturar respuesta
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({ email: username, password: password })
      })

      // Tratamiento de la respuesta, si no es correct
      if (!response.ok) {
        // Lanzamos error
        throw new Error("No se puede acceder. Contraseña o email incorrectos.");

      }

      // sacamos los datos de la respuesta
      const data = await response.json();
      // Guardamos el token JWT en el localStorage
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('email', data.email);
      localStorage.setItem('firstname', data.firstname);
      localStorage.setItem('lastname', data.lastname);
      console.log(data.token);
      setIsAuthenticated(true);

      // Redirigimos tras el login correcto
      navigate('/dashboard');

    } catch (err) {
      setError(err.message);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }

  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">

      <img src={logo} alt='Logo de Keynest' className='blur-md w-3xl' />

      <div className="w-full max-w-md bg-white opacity-70 p-8 rounded-xl shadow-2xl flex flex-col items-center absolute">

        <img src={miniLogo} alt='Logo de Keynest' className='w-32 h-auto' />

        <h2 className="text-2xl font-bold text-center mb-6">Iniciar sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition cursor-pointer flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Entrar'
            )}
          </button>

        </form>
        {error && <p className="text-red-600 text-sm mt-4 text-center">{error}</p>}
      </div>
    </div>

  )

}

export default Login