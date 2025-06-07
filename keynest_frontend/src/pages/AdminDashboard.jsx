import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, BedSingle, Users, Calendar, Settings, Hotel } from "lucide-react";
import UnitControl from "@/subpages/UnitControl";
import AdminHeader from "@/components/AdminHeader";
import UnitPanel from "@/subpages/UnitPanel";
import UserControl from "@/subpages/UserControl";

function AdminDashboard() {

  const [step, setStep] = useState(1);

  const ADMIN_ID = parseInt(localStorage.getItem("userId"));


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <AdminHeader setStep={setStep} step={step}/>

      {/* Contenido principal */}
      <main className="max-w-7xl">


        {step === 1 && (
          <div className="">
            <UserControl adminId={ADMIN_ID}
            />
          </div>
        )}

        {step === 2 && (
          <div className="">
           <UnitPanel adminId={ADMIN_ID} />

          </div>
        )}
        {step === 3 && (
          <div>
            Paso 3
          </div>
        )}
        {step === 4 && (
          <div>
            Paso 4
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
