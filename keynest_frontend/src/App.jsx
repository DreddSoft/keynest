import { useState, useEffect } from 'react'
import { BrowserRouter, Navigate, Router, Routes, Route } from 'react-router-dom'

import Login from './pages/Login.jsx'
import UnitDashboard from './pages/UnitDashboard.jsx'
import Unit from './pages/Unit.jsx'
import InLayout from './layout/InLayout.jsx'
import OutLayout from './layout/OutLayout.jsx'

function App() {
  // Estados para el usuario autenticado o no
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {

    const checkAuth = async () => {

      try {

        const response = await fetch("http://localhost:8080/auth/check", {
          method: "GET",
          credentials: "include",
          headers: {
            'Content-Type':'application/json'
          }
        });

        console.log(response);

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }

      } catch (err) {
        console.error("Error verificando autenticación: ", err);
        setIsAuthenticated(false);

      }
    }

    checkAuth();
  }, []);

  return (
    <Routes>

      {/* Ruta de Login */}
      <Route
        path="/login"
        element={
          isAuthenticated
            ? <Navigate to="/dashboard" />
            : <OutLayout><Login setIsAuthenticated={setIsAuthenticated} /></OutLayout>

        }
      />

      {/* Ruta del dashboard */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated
            ? <InLayout>
              <UnitDashboard />
            </InLayout>

            : <Navigate to="/login" />
        }
      />

      {/* Ruta del unit */}
      <Route
        path="/unit/:unitId"
        element={
        isAuthenticated
         ? <InLayout><Unit /></InLayout>
        : <Navigate to="/login" />
        }
      />

      {/* Ruta por fectto */}
      <Route
        path="/*"
        element={<Navigate to="/login" />}
      />

    </Routes>


  )


}


export default App
