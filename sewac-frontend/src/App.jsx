import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/layouts/Sidebar";

import Overview from "./pages/Overview";
import WasteGenerators from "./pages/WasteGenerators";
import Vehicles from "./pages/Vehicles";
import Plants from "./pages/Plants";
import Logs from "./pages/Logs";
import AI from "./pages/AI";
import Users from "./pages/Users";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <div className="flex h-screen bg-[#FAFAFC] overflow-hidden">
      {/* ================= Sidebar ================= */}
      <Sidebar />

      {/* ================= Main Content ================= */}
      <main className="flex-1 overflow-y-auto">
        <Routes>

          {/* Default Route */}
          <Route
            path="/"
            element={<Navigate to="/admin/overview" replace />}
          />

          {/* Overview */}
          <Route
            path="/admin/overview"
            element={<Overview />}
          />

          {/* Waste Generators */}
          <Route
            path="/admin/waste-generators"
            element={<WasteGenerators />}
          />

          {/* Vehicles */}
          <Route
            path="/admin/vehicles"
            element={<Vehicles />}
          />

          {/* Plants */}
          <Route
            path="/admin/plants"
            element={<Plants />}
          />

          {/* Logs */}
          <Route
            path="/admin/logs"
            element={<Logs />}
          />

          {/* AI Agent */}
          <Route
            path="/admin/ai"
            element={<AI />}
          />

          {/* Users */}
          <Route
            path="/admin/users"
            element={<Users />}
          />

          {/* Settings */}
          <Route
            path="/admin/settings"
            element={<Settings />}
          />

          {/* Unknown Routes */}
          <Route
            path="*"
            element={<Navigate to="/admin/overview" replace />}
          />

        </Routes>
      </main>
    </div>
  );
}