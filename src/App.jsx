import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import Sidebar from "./components/layouts/Sidebar";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import AuthCallback from "./pages/AuthCallback";
import Overview from "./pages/Overview";
import WasteGenerators from "./pages/WasteGenerators";
import Vehicles from "./pages/Vehicles";
import Plants from "./pages/Plants";
import Logs from "./pages/Logs";
import AI from "./pages/AI";
import Users from "./pages/Users";
import Users2 from "./pages/Users2";
import Settings from "./pages/Settings";
import Complaints from "./pages/Complaints";

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

export default function App() {
  return (
    <Routes>
      {/* Authentication */}
      <Route
        path="/auth/callback"
        element={<AuthCallback />}
      />

      {/* Protected Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={<Navigate to="admin/overview" replace />}
        />

        <Route
          path="admin/overview"
          element={<Overview />}
        />

        <Route
          path="admin/waste-generators"
          element={<WasteGenerators />}
        />

        <Route
          path="admin/vehicles"
          element={<Vehicles />}
        />

        <Route
          path="admin/plants"
          element={<Plants />}
        />

        <Route
          path="admin/logs"
          element={<Logs />}
        />

        <Route
          path="admin/ai"
          element={<AI />}
        />

        <Route
          path="admin/users"
          element={<Users />}
        />

        <Route
          path="admin/users2"
          element={<Users2 />}
        />

        <Route
          path="admin/settings"
          element={<Settings />}
        />

        <Route 
          path="admin/complaints"
          element={<Complaints />}
        />

        <Route
          path="*"
          element={<Navigate to="admin/overview" replace />}
        />
      </Route>

      {/* Root Redirect */}
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      {/* Catch All */}
      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}