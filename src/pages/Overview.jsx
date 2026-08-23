import { useEffect, useState } from "react";

import api from "../api/axios";

import Header from "../components/layouts/Header";

import OverviewKPIs from "../components/overview/OverviewKPIs";
import VehicleStats from "../components/overview/VehicleStats";
import RouteMap from "../components/overview/RouteMap";

import { useFilters } from "../contexts/FilterContext";

export default function Overview() {
  const [overviewData, setOverviewData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  // ==========================================================
  // FILTER CONTEXT
  // ==========================================================

  const { selectedCity, selectedZone, selectedDivision, selectedWard } =
    useFilters();

  // ==========================================================
  // FETCH OVERVIEW
  // ==========================================================

  useEffect(() => {
    /*
     * Wait until cascading filters
     * are completely resolved.
     */

    if (!selectedCity || !selectedZone || !selectedDivision || !selectedWard) {
      return;
    }

    let mounted = true;

    const fetchOverview = async () => {
      try {
        setLoading(true);

        setError("");

        // ==================================================
        // MAIN QUERY
        // ==================================================

        const params = new URLSearchParams();

        params.set("date", selectedDate);

        params.set("cityId", String(selectedCity.city_id));

        params.set("zoneId", String(selectedZone.zone_id));

        params.set("divisionId", String(selectedDivision.division_id));

        params.set("wardId", String(selectedWard.ward_id));

        const queryString = params.toString();

        // ==================================================
        // GENERATION TREND
        // ==================================================
        //
        // Trend remains division-wise.
        //
        // Therefore wardId is intentionally
        // excluded.
        // ==================================================

        const trendParams = new URLSearchParams();

        trendParams.set("date", selectedDate);

        trendParams.set("cityId", String(selectedCity.city_id));

        trendParams.set("zoneId", String(selectedZone.zone_id));

        trendParams.set("divisionId", String(selectedDivision.division_id));

        const trendQueryString = trendParams.toString();

        // ==================================================
        // DEBUG
        // ==================================================

        console.log("=================================================");

        console.log("OVERVIEW FILTER REQUEST");

        console.log("City:", selectedCity.city_name, selectedCity.city_id);

        console.log("Zone:", selectedZone.zone_name, selectedZone.zone_id);

        console.log(
          "Division:",
          selectedDivision.division_name,
          selectedDivision.division_id,
        );

        console.log(
          "Ward:",
          selectedWard.ward_name,
          selectedWard.ward_id,
          "Ward No:",
          selectedWard.ward_no,
        );

        console.log("Date:", selectedDate);

        console.log("Summary Query:", queryString);

        console.log("Trend Query:", trendQueryString);

        console.log("=================================================");

        // ==================================================
        // API REQUESTS
        // ==================================================

        const [
          summaryResponse,
          vehicleSummaryResponse,
          generationTrendResponse,
          mapResponse,
        ] = await Promise.all([
          api.get(`/api/admin/overview/summary?${queryString}`),

          api.get(`/api/admin/overview/vehicle-summary?${queryString}`),

          api.get(`/api/admin/overview/generation-trend?${trendQueryString}`),

          /*
           * ROUTE MAP
           *
           * IMPORTANT:
           * Uses the COMPLETE Header state.
           */

          api.get(`/api/admin/overview/map?${queryString}`),
        ]);

        if (!mounted) {
          return;
        }

        // ==================================================
        // SAFE RESPONSE EXTRACTION
        // ==================================================

        const summaryData = summaryResponse?.data?.data || {};

        const vehicleSummaryData = vehicleSummaryResponse?.data?.data || {};

        const generationTrendData = Array.isArray(
          generationTrendResponse?.data?.data,
        )
          ? generationTrendResponse.data.data
          : [];

        const mapData = mapResponse?.data?.data || {
          defaultView: "route-map",

          routes: [],

          totalVehicles: 0,

          totalRoutePoints: 0,
        };

        // ==================================================
        // NORMALIZED SUMMARY
        // ==================================================

        const normalizedSummary = {
          totalWasteCollected: Number(summaryData.totalWasteCollected) || 0,

          collectionPoints: Number(summaryData.collectionPoints) || 0,

          totalCitizens: Number(summaryData.totalCitizens) || 0,

          trashGiven: Number(summaryData.trashGiven) || 0,

          notGiven: Number(summaryData.notGiven) || 0,
        };

        // ==================================================
        // NORMALIZED VEHICLE SUMMARY
        // ==================================================

        const normalizedVehicleSummary = {
          totalVehicles: Number(vehicleSummaryData.totalVehicles) || 0,

          runningVehicles: Number(vehicleSummaryData.runningVehicles) || 0,

          inactiveVehicles: Number(vehicleSummaryData.inactiveVehicles) || 0,

          vehicleStatus: Array.isArray(vehicleSummaryData.vehicleStatus)
            ? vehicleSummaryData.vehicleStatus
            : [],

          inactivityThresholdMinutes:
            Number(vehicleSummaryData.inactivityThresholdMinutes) || 30,
        };

        // ==================================================
        // STORE
        // ==================================================

        setOverviewData({
          summary: normalizedSummary,

          vehicleSummary: normalizedVehicleSummary,

          generationTrend: generationTrendData,

          map: mapData,
        });

        setError("");
      } catch (err) {
        if (!mounted) {
          return;
        }

        console.error("Overview API Error:", err);

        const backendMessage =
          err?.response?.data?.message || err?.message || "";

        /*
         * Missing dynamic day table
         * is a valid zero-data state.
         */

        const isMissingDayTable =
          backendMessage.includes("42P01") ||
          backendMessage.includes("does not exist") ||
          backendMessage.includes("relation");

        if (isMissingDayTable) {
          setOverviewData({
            summary: {
              totalWasteCollected: 0,

              collectionPoints: 0,

              totalCitizens: 0,

              trashGiven: 0,

              notGiven: 0,
            },

            vehicleSummary: {
              totalVehicles: 0,

              runningVehicles: 0,

              inactiveVehicles: 0,

              vehicleStatus: [],

              inactivityThresholdMinutes: 30,
            },

            generationTrend: [],

            map: {
              defaultView: "route-map",

              routes: [],

              totalVehicles: 0,

              totalRoutePoints: 0,
            },
          });

          setError("");

          return;
        }

        setOverviewData(null);

        setError(backendMessage || "Unable to connect to the server.");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchOverview();

    return () => {
      mounted = false;
    };
  }, [
    selectedDate,

    selectedCity?.city_id,

    selectedZone?.zone_id,

    selectedDivision?.division_id,

    selectedWard?.ward_id,
  ]);

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFAFC]">
      <Header selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

      {/* ====================================================
          LOADING
      ==================================================== */}

      {loading && (
        <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-8 py-6">
          <p className="text-lg font-medium text-gray-500">
            Loading dashboard...
          </p>
        </main>
      )}

      {/* ====================================================
          ERROR
      ==================================================== */}

      {!loading && error && (
        <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-8 py-6">
          <div className="text-center">
            <p className="text-lg font-semibold text-red-500">{error}</p>
          </div>
        </main>
      )}

      {/* ====================================================
          DASHBOARD
      ==================================================== */}

      {!loading && !error && overviewData && (
        <main className="space-y-6 px-8 py-6">
          {/* ================================================
                KPI
            ================================================ */}

          <OverviewKPIs data={overviewData.summary} />

          {/* ================================================
                VEHICLES
            ================================================ */}

          <VehicleStats
            vehicleData={overviewData.vehicleSummary}
            trendData={overviewData.generationTrend}
          />

          {/* ================================================
                ROUTE MAP
            ================================================ */}

          <RouteMap mapData={overviewData.map} selectedDate={selectedDate} />
        </main>
      )}
    </div>
  );
}
