import { useEffect, useState } from "react";
import api from "../api/axios";
import Header from "../components/layouts/Header";

import KPICards from "../components/vehicles/KPICards";
import VehicleRouteMap from "../components/vehicles/VehicleRouteMap";
import AverageWeightChart from "../components/vehicles/AverageWeightChart";
import TelemetryDirectory from "../components/vehicles/TelemetryDirectory";

const Vehicles = () => {
  /* =========================================================
     VEHICLE SUMMARY
  ========================================================= */

  const [summary, setSummary] = useState({
    totalVehicles: 0,
    activeVehicles: 0,
    inactiveVehicles: 0,
    averageWeightPerVehicle: 0,
  });

  /* =========================================================
     FETCH VEHICLE SUMMARY
  ========================================================= */

  const fetchSummary = async () => {
    try {
      const res = await api.get("/api/vehicles/summary");

      setSummary(res?.data?.data || {
        totalVehicles: 0,
        activeVehicles: 0,
        inactiveVehicles: 0,
        averageWeightPerVehicle: 0,
      });
    } catch (err) {
      console.error("Vehicle Summary Error:", err);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    fetchSummary();
  }, []);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="flex-1 min-h-screen bg-[#F8F9FD] overflow-y-auto overflow-x-hidden">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <Header />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main
        className="
          w-full
          min-w-0
          px-3
          sm:px-4
          md:px-5
          lg:px-6
          xl:px-8
          py-4
          sm:py-5
          lg:py-6
          space-y-4
          sm:space-y-5
          lg:space-y-6
        "
      >
        {/* ===================================================
            KPI CARDS
        =================================================== */}

        <section className="w-full min-w-0">
          <KPICards summary={summary} />
        </section>

        {/* ===================================================
            VEHICLE ROUTE MAP
        =================================================== */}

        <section className="w-full min-w-0">
          <VehicleRouteMap />
        </section>

        {/* ===================================================
            AVERAGE WEIGHT GENERATED
        =================================================== */}

        <section className="w-full min-w-0">
          <AverageWeightChart />
        </section>

        {/* ===================================================
            TELEMETRY DIRECTORY
        =================================================== */}

        <section className="w-full min-w-0 pb-2 sm:pb-4">
          <TelemetryDirectory />
        </section>
      </main>
    </div>
  );
};

export default Vehicles;