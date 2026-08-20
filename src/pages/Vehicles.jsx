import { useEffect, useState } from "react";
import api from "../api/axios";
import Header from "../components/layouts/Header";

import KPICards from "../components/vehicles/KPICards";
import VehicleRouteMap from "../components/vehicles/VehicleRouteMap";
import AverageWeightChart from "../components/vehicles/AverageWeightChart";
import TelemetryDirectory from "../components/vehicles/TelemetryDirectory";

const Vehicles = () => {
  const [summary, setSummary] = useState({
    totalVehicles: 0,
    activeVehicles: 0,
    inactiveVehicles: 0,
    averageWeightPerVehicle: 0,
  });
  const fetchSummary = async () => {
    try {
      const res = await api.get("/api/vehicles/summary");

      setSummary(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);
  return (
    <div className="flex-1 min-h-screen bg-[#F8F9FD] overflow-auto">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="p-2 space-y-2">
        {/* KPI Cards */}
        <KPICards summary={summary} />

        {/* Vehicle Route Map */}
        <VehicleRouteMap />

        {/* Average Weight Generated */}
        <AverageWeightChart />

        {/* Telemetry Directory */}
        <TelemetryDirectory />
      </main>
    </div>
  );
};

export default Vehicles;
