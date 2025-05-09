import { useState } from 'react'

function Login() {

    // constantes con estados para los valores
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    // Logica de funcionalidad
    const handleSubmit = async(e) => {
        
        // Prevenimos el evento por defecto de envio de form
        e.preventDefault();
        setError(null);

        try {

            // Capturar respuesta
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({username, password})
            })

            // Tratamiento de la respuesta, si no es correct
            if (!response.ok) {
                // Lanzamos error
                throw new Error("No se puede acceder. Contraseña o email incorrectos.");
                
            }

            // sacamos los datos de la respuesta
            const data = await response.json();
            // Guardamos el token JWT en el localStorage
            localStorage.setItem('token', data.token);

            // Redirigimos tras el login correcto
            window.location.href = '/dashboard';

        } catch(err) {
            setError('Incio de sesion erroneo. ' + err.message);
        }

        return(
            <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        )
    }
    
}

export default Login