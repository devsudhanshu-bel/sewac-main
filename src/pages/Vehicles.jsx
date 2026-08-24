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
     GLOBAL HEADER FILTERS
  ========================================================= */

  const { selectedCity, selectedZone, selectedDivision, selectedWard } =
    useFilters();

  /* =========================================================
     SELECTED DATE
     Header owns the visual control, but the page owns
     the actual date state.
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
     ROUTE MAP DATA
  ========================================================= */

  const [routeMapData, setRouteMapData] = useState(null);

  const [routeMapLoading, setRouteMapLoading] = useState(false);

  const [routeMapError, setRouteMapError] = useState("");

  /* =========================================================
     PLANT LOCATIONS
  ========================================================= */

  const [plants, setPlants] = useState([]);

  const [plantsLoading, setPlantsLoading] = useState(false);

  /* =========================================================
     FETCH VEHICLE SUMMARY
  ========================================================= */

  const fetchSummary = async () => {
    try {
      const response = await api.get("/api/vehicles/summary");

      const data = response?.data?.data;

      setSummary(
        data || {
          totalVehicles: 0,
          activeVehicles: 0,
          inactiveVehicles: 0,
          averageWeightPerVehicle: 0,
        },
      );
    } catch (error) {
      console.error("Vehicle Summary Error:", error);

      /*
       * Keep the page alive even if
       * summary request fails.
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
     FETCH VEHICLE ROUTES
  ========================================================= */

  const fetchRouteMap = async () => {
    /*
     * -------------------------------------------------------
     * HEADER FILTER VALUES
     * -------------------------------------------------------
     */

    const cityId = selectedCity?.city_id ?? selectedCity?.id ?? null;

    const zoneId = selectedZone?.zone_id ?? selectedZone?.id ?? null;

    const divisionId =
      selectedDivision?.division_id ?? selectedDivision?.id ?? null;

    const wardId = selectedWard?.ward_id ?? selectedWard?.id ?? null;

    const wardNo = selectedWard?.ward_no ?? selectedWard?.wardNo ?? null;

    /*
     * -------------------------------------------------------
     * ROUTE REQUEST
     *
     * The existing backend route-map API is driven by:
     *
     * date
     * wardNo
     *
     * We also pass the complete header filter context.
     * The existing route-map backend can continue using
     * wardNo while the other values remain available for
     * future scope expansion.
     * -------------------------------------------------------
     */

    const params = {
      date: selectedDate,
    };

    if (cityId !== null && cityId !== undefined && cityId !== "") {
      params.cityId = cityId;
    }

    if (zoneId !== null && zoneId !== undefined && zoneId !== "") {
      params.zoneId = zoneId;
    }

    if (divisionId !== null && divisionId !== undefined && divisionId !== "") {
      params.divisionId = divisionId;
    }

    if (wardId !== null && wardId !== undefined && wardId !== "") {
      params.wardId = wardId;
    }

    if (wardNo !== null && wardNo !== undefined && wardNo !== "") {
      params.wardNo = wardNo;
    }

    setRouteMapLoading(true);

    setRouteMapError("");

    try {
      const response = await api.get("/api/route-map", {
        params,
      });

      if (response?.data?.success === false) {
        throw new Error(
          response?.data?.message || "Unable to load vehicle routes.",
        );
      }

      /*
       * Existing route-map components use:
       *
       * response.data.data.routes
       *
       * Keep the complete response object
       * so VehicleRouteMap can consume it.
       */

      const data = response?.data?.data ?? response?.data ?? null;

      setRouteMapData(data);

      console.log("🚛 VEHICLE ROUTE MAP DATA:", data);
    } catch (error) {
      console.error("Vehicle Route Map Error:", error);

      setRouteMapData(null);

      setRouteMapError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load vehicle route data.",
      );
    } finally {
      setRouteMapLoading(false);
    }
  };

  /* =========================================================
     FETCH PLANT LOCATIONS
  ========================================================= */

  const fetchPlants = async () => {
    setPlantsLoading(true);

    try {
      const response = await api.get("/api/plants/locations");

      if (response?.data?.success === false) {
        throw new Error(
          response?.data?.message || "Unable to load plant locations.",
        );
      }

      const locationData = response?.data?.data;

      /*
       * Existing Plants page uses:
       *
       * /api/plants/locations
       *
       * and receives an array.
       */

      const loadedPlants = Array.isArray(locationData)
        ? locationData
        : Array.isArray(locationData?.plants)
          ? locationData.plants
          : [];

      setPlants(loadedPlants);

      console.log("🏭 PLANT LOCATIONS:", loadedPlants);
    } catch (error) {
      console.error("Plant Locations Error:", error);

      /*
       * Do not break Vehicles page
       * if plants fail.
       */

      setPlants([]);
    } finally {
      setPlantsLoading(false);
    }
  };

  /* =========================================================
     INITIAL SUMMARY
  ========================================================= */

  useEffect(() => {
    fetchSummary();
  }, []);

  /* =========================================================
     LOAD PLANTS
  ========================================================= */

  useEffect(() => {
    fetchPlants();
  }, []);

  /* =========================================================
     RELOAD ROUTES WHEN HEADER CONTEXT CHANGES
  ========================================================= */

  useEffect(() => {
    fetchRouteMap();
  }, [
    selectedDate,

    selectedCity?.city_id,

    selectedZone?.zone_id,

    selectedDivision?.division_id,

    selectedWard?.ward_id,

    selectedWard?.ward_no,
  ]);

  /* =========================================================
     ROUTE ARRAY
  ========================================================= */

  const routes = Array.isArray(routeMapData?.routes) ? routeMapData.routes : [];

  /* =========================================================
     DISPLAY PLANTS
  ========================================================= */

  const validPlants = Array.isArray(plants)
    ? plants.filter((plant) => {
        const latitude = Number(plant?.latitude);

        const longitude = Number(plant?.longitude);

        return Number.isFinite(latitude) && Number.isFinite(longitude);
      })
    : [];

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
        =================================================== */}

        <section
          className="
            w-full
            min-w-0
          "
        >
          {routeMapError && (
            <div
              className="
                mb-3
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-4
                py-3
                text-sm
                text-red-600
              "
            >
              {routeMapError}
            </div>
          )}

          <VehicleRouteMap
            routes={routes}
            plants={validPlants}
            mapData={routeMapData}
            selectedDate={selectedDate}
          />

          {/* =================================================
              LOADING OVERLAY
          ================================================= */}

          {(routeMapLoading || plantsLoading) && (
            <div
              className="
                mt-2
                text-[11px]
                text-slate-400
              "
            >
              {routeMapLoading && plantsLoading
                ? "Loading vehicle routes and plant locations..."
                : routeMapLoading
                  ? "Loading vehicle routes..."
                  : "Loading plant locations..."}
            </div>
          )}
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
