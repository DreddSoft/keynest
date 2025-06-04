import { useState, useEffect } from 'react'
import { BrowserRouter, Navigate, Router, Routes, Route } from 'react-router-dom'
import { Loader2 } from "lucide-react";

import Login from './pages/Login.jsx'
import UnitDashboard from './pages/UnitDashboard.jsx'
import Unit from './pages/Unit.jsx'
import InLayout from './layout/InLayout.jsx'
import OutLayout from './layout/OutLayout.jsx'
import BookingForm from './pages/BookingForm.jsx'


function App() {
  // Estados para el usuario autenticado o no
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {

    const checkAuth = async () => {

      try {

        const response = await fetch("http://localhost:8080/auth/check", {
          method: "GET",
          credentials: "include",
          headers: {
            'Content-Type': 'application/json'
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

  // Pantalla de carga
  if (isAuthenticated == null) {
    return (
      <div className="h-screen w-full flex items-center justify-center text-gray-700 text-lg">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (

    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated
            ? <Navigate to="/dashboard" />
            : <OutLayout><Login setIsAuthenticated={setIsAuthenticated} /></OutLayout>
        }
      />
      <Route
        path="/dashboard"
        element={
          isAuthenticated
            ? <InLayout><UnitDashboard /></InLayout>
            : <Navigate to="/login" />
        }
      />
      <Route
        path="/unit/:unitId"
        element={
          isAuthenticated
            ? <InLayout><Unit /></InLayout>
            : <Navigate to="/login" />
        }
      />
      {/* - Ruta para el formulario de reserva */}
      <Route
        path="/bookingForm/:unitId"
        element={
          isAuthenticated
            ? <InLayout><BookingForm /></InLayout>
            : <Navigate to="/login" />
        }
      />
      <Route
        path="/*"
        element={<Navigate to="/login" />}
      />
    </Routes>

  );
}


export default App
