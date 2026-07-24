import Header from "../components/layouts/Header";

import KPICards from "../components/vehicles/KPICards";
import VehicleRouteMap from "../components/vehicles/VehicleRouteMap";
import AverageWeightChart from "../components/vehicles/AverageWeightChart";
import OverspeedingIncidents from "../components/vehicles/OverspeedingIncidents";
import TelemetryDirectory from "../components/vehicles/TelemetryDirectory";

const Vehicles = () => {
  return (
    <div className="flex-1 min-h-screen bg-[#F8F9FD] overflow-auto">

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="p-8 space-y-8">

        {/* KPI Cards */}
        <KPICards />

        {/* Vehicle Route Map */}
        <VehicleRouteMap />

        {/* Average Weight Generated */}
        <AverageWeightChart />

        {/* Overspeeding Incidents */}
        <OverspeedingIncidents />

        {/* Telemetry Directory */}
        <TelemetryDirectory />

      </main>

    </div>
  );
};

export default Vehicles;