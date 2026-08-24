import { useEffect, useState } from "react";

import api from "../api/axios";

import Header from "../components/layouts/Header";

import KPICards from "../components/vehicles/KPICards";
import VehicleRouteMap from "../components/vehicles/VehicleRouteMap";
import AverageWeightChart from "../components/vehicles/AverageWeightChart";
import TelemetryDirectory from "../components/vehicles/TelemetryDirectory";

import { useFilters } from "../contexts/FilterContext";

/* =========================================================
   LOCAL DATE
========================================================= */

const getTodayLocalDate = () => {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(now.getMonth() + 1).padStart(2, "0");

  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/* =========================================================
   VEHICLES PAGE
========================================================= */

const Vehicles = () => {
  /* =========================================================
     HEADER FILTER CONTEXT
  ========================================================= */

  const { selectedCity, selectedZone, selectedDivision, selectedWard } =
    useFilters();

  /* =========================================================
     SELECTED DATE
     
     Header calendar is controlled by this page.
  ========================================================= */

  const [selectedDate, setSelectedDate] = useState(getTodayLocalDate());

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
     
     KEEPING EXISTING VEHICLE KPI API UNCHANGED.
  ========================================================= */

  const fetchSummary = async () => {
    try {
      const res = await api.get("/api/vehicles/summary");

      setSummary(
        res?.data?.data || {
          totalVehicles: 0,
          activeVehicles: 0,
          inactiveVehicles: 0,
          averageWeightPerVehicle: 0,
        },
      );
    } catch (err) {
      console.error("Vehicle Summary Error:", err);

      /*
       * Keep existing zero-data behavior.
       */

      setSummary({
        totalVehicles: 0,
        activeVehicles: 0,
        inactiveVehicles: 0,
        averageWeightPerVehicle: 0,
      });
    }
  };

  /* =========================================================
     INITIAL SUMMARY
  ========================================================= */

  useEffect(() => {
    fetchSummary();
  }, []);

  /* =========================================================
     CURRENT FILTER DEBUG
     
     This does NOT change any logic.
     It only helps verify that Vehicles page receives the
     same cascading filter state as Overview.
  ========================================================= */

  useEffect(() => {
    console.log("=================================================");

    console.log("VEHICLES PAGE FILTER STATE");

    console.log("City:", selectedCity);

    console.log("Zone:", selectedZone);

    console.log("Division:", selectedDivision);

    console.log("Ward:", selectedWard);

    console.log("Date:", selectedDate);

    console.log("=================================================");
  }, [
    selectedCity,
    selectedZone,
    selectedDivision,
    selectedWard,
    selectedDate,
  ]);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      className="
        flex-1
        min-h-screen
        min-w-0
        bg-[#F8F9FD]
        overflow-y-auto
        overflow-x-hidden
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <Header selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

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

        <section
          className="
            w-full
            min-w-0
          "
        >
          <KPICards summary={summary} />
        </section>

        {/* ===================================================
            VEHICLE ROUTE MAP
           
            IMPORTANT:
            VehicleRouteMap now reads the same Header
            filters and selected date and fetches the
            existing route-map API itself.
        =================================================== */}

        <section
          className="
            w-full
            min-w-0
          "
        >
          <VehicleRouteMap selectedDate={selectedDate} />
        </section>

        {/* ===================================================
            AVERAGE WEIGHT GENERATED
        =================================================== */}

        <section
          className="
            w-full
            min-w-0
          "
        >
          <AverageWeightChart />
        </section>

        {/* ===================================================
            TELEMETRY DIRECTORY
        =================================================== */}

        <section
          className="
            w-full
            min-w-0
            pb-2
            sm:pb-4
          "
        >
          <TelemetryDirectory />
        </section>
      </main>
    </div>
  );
};

export default Vehicles;
