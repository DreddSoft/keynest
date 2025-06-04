import { useState, useEffect } from 'react'
import { BrowserRouter, Navigate, Router, Routes, Route } from 'react-router-dom'
import { Loader2 } from "lucide-react";

import Login from './pages/Login.jsx'
import UnitDashboard from './pages/UnitDashboard.jsx'
import Unit from './pages/Unit.jsx'
import InLayout from './layout/InLayout.jsx'
import OutLayout from './layout/OutLayout.jsx'
import BookingForm from './pages/BookingForm.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx';


function App() {
  // Estados para el usuario autenticado o no
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [admin, setIsAdmin] = useState(false);
  const userId = parseInt(localStorage.getItem("userId"));

  const URL_CHECK_ADMIN =

    useEffect(() => {

      const checkAuth = async () => {

        try {

          const response = await fetch(`http://localhost:8080/auth/check/${userId}`, {
            method: "GET",
            credentials: "include",
            headers: {
              'Content-Type': 'application/json'
            }
          });

          console.log(response);

          if (response.ok) {
            const result = await response.json();
            setIsAuthenticated(true);
            setIsAdmin(result.admin);
            console.log(result.admin);
          } else {
            setIsAuthenticated(false);
          }

        } catch (err) {
          console.error("Error verificando autenticación: ", err);
          setIsAuthenticated(false);

        }
      }

      checkAuth();
    }, [userId]);


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
      {/* Login si no esta autenticado devuelve a login */}
      <Route
        path="/login"
        element={
          isAuthenticated
            ? (admin ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />)
            : <OutLayout><Login setIsAuthenticated={setIsAuthenticated} /></OutLayout>
        }
      />

      {/* Ruta para admin */}
      {isAuthenticated && admin && (
        <Route
          path="/admin"
          element={
            isAuthenticated
              ? <InLayout><AdminDashboard /></InLayout>
              : <Navigate to="/login" />
          }
        />
      )}

      {/* Rutas de usuarios */}
      {isAuthenticated && !admin && (
        <>
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
        </>
      )}

      {/* Ruta path principal */}
      <Route
        path="/*"
        element={<Navigate to={isAuthenticated ? (admin ? "/admin" : "/dashboard") : "/login"} />}
      />

    </Routes>

  );
}


export default App
