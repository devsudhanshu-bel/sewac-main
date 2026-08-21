import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import Sidebar from "./components/layouts/Sidebar";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import AuthCallback from "./pages/AuthCallback";
import Overview from "./pages/Overview";
import WasteGenerators from "./pages/WasteGenerators";
import Vehicles from "./pages/Vehicles";
import Plants from "./pages/Plants";
import AI from "./pages/AI";
import Users from "./pages/Users";
import Users2 from "./pages/Users2";
import Complaints from "./pages/Complaints";

/*
|--------------------------------------------------------------------------
| DASHBOARD LAYOUT
|--------------------------------------------------------------------------
*/

function DashboardLayout() {
  return (
    <div className="flex h-screen bg-[#FAFAFC] overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| APP
|--------------------------------------------------------------------------
*/

export default function App() {
  return (
    <Routes>
      {/* =========================================================
          AUTH CALLBACK
      ========================================================= */}

      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* =========================================================
          PROTECTED DASHBOARD
      ========================================================= */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* =======================================================
            DEFAULT DASHBOARD
        ======================================================= */}

        <Route index element={<Navigate to="admin/overview" replace />} />

        {/* =======================================================
            OVERVIEW
            All roles
        ======================================================= */}

        <Route path="admin/overview" element={<Overview />} />

        {/* =======================================================
            WASTE GENERATORS
            Layer 1 + Layer 2
            Worker blocked by ProtectedRoute
        ======================================================= */}

        <Route path="admin/waste-generators" element={<WasteGenerators />} />

        {/* =======================================================
            VEHICLES
            All roles
        ======================================================= */}

        <Route path="admin/vehicles" element={<Vehicles />} />

        {/* =======================================================
            PLANTS
            All roles
        ======================================================= */}

        <Route path="admin/plants" element={<Plants />} />

        {/* =======================================================
            AI
            Existing route preserved
        ======================================================= */}

        <Route path="admin/ai" element={<AI />} />

        {/* =======================================================
            USERS — ADMIN LAYER 1
            ProtectedRoute checks "users"
        ======================================================= */}

        <Route path="admin/users" element={<Users />} />

        {/* =======================================================
            USERS — ADMIN LAYER 2
            ProtectedRoute checks "users"
        ======================================================= */}

        <Route path="admin/users2" element={<Users2 />} />

        {/* =======================================================
            COMPLAINTS
            Layer 1 + Layer 2
            Worker blocked by ProtectedRoute
        ======================================================= */}

        <Route path="admin/complaints" element={<Complaints />} />

        {/* =======================================================
            UNKNOWN DASHBOARD ROUTE
        ======================================================= */}

        <Route path="*" element={<Navigate to="admin/overview" replace />} />
      </Route>

      {/* =========================================================
          ROOT
      ========================================================= */}

      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* =========================================================
          GLOBAL CATCH-ALL
      ========================================================= */}

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
