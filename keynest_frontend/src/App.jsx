import { useState, useEffect } from 'react'
import { BrowserRouter, Navigate, Router, Routes, Route } from 'react-router-dom'

import Login from './pages/Login.jsx'
import UnitDashboard from './pages/UnitDashboard.jsx'
import Unit from './pages/Unit.jsx'
 
function App() {
  // Estados para el usuario autenticado o no
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {

    // TODO: cambiar a cookie
    const token = localStorage.getItem('token');
    
    // establecer la autenticacion
    if (token) {
      setIsAuthenticated(true);
    }

    // setIsAuthenticated(false)


  }, []);

  return (
      <Routes>

        {/* Ruta de Login */}
        <Route 
          path="/login"
          element={
            isAuthenticated 
            ? <Navigate to="/dashboard" />
            : <Login setIsAuthenticated={setIsAuthenticated} />
          }
        />

        {/* Ruta del dashboard */}
        <Route 
          path="/dashboard"
          element={
            isAuthenticated
              ? <UnitDashboard />
              : <Navigate to="/login" />
          }
        />

        {/* Ruta del unit */}
        <Route 
          path="/unit/:unitId"
          element={<Unit />}
        />

        {/* Ruta por fectto */ }
        <Route 
          path="/*"
          element={<Navigate to="/login" />}
        />

      </Routes>


  )


}
 

export default App
