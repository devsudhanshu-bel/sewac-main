import { useEffect, useState } from "react";

import api from "../api/axios";

import Header from "../components/layouts/Header";

import OverviewKPIs from "../components/overview/OverviewKPIs";
import VehicleStats from "../components/overview/VehicleStats";
import CityOverviewMap from "../components/overview/CityOverviewMap";

import { useFilters } from "../contexts/FilterContext";

export default function Overview() {
  const [overviewData, setOverviewData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  /*
   * =========================================================
   * FILTER CONTEXT
   * =========================================================
   */

  const { selectedCity, selectedZone, selectedDivision, selectedWard } =
    useFilters();

  /*
   * =========================================================
   * FETCH OVERVIEW
   * =========================================================
   */

  useEffect(() => {
    /*
     * Wait until the cascading filter has finished loading.
     */

    if (!selectedCity || !selectedZone || !selectedDivision || !selectedWard) {
      return;
    }

    let mounted = true;

    const fetchOverview = async () => {
      try {
        setLoading(true);
        setError("");

        /*
         * =====================================================
         * BUILD FILTER QUERY
         * =====================================================
         */

        const params = new URLSearchParams();

        params.set("date", selectedDate);

        params.set("cityId", String(selectedCity.city_id));

        params.set("zoneId", String(selectedZone.zone_id));

        params.set("divisionId", String(selectedDivision.division_id));

        params.set("wardId", String(selectedWard.ward_id));

        const queryString = params.toString();

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

        console.log("Query:", queryString);

        console.log("=================================================");

        /*
         * =====================================================
         * GENERATION TREND QUERY
         * =====================================================
         *
         * Generation Trend is division-wise.
         *
         * Therefore:
         *
         * cityId
         * zoneId
         * divisionId
         *
         * are supplied.
         *
         * wardId is intentionally NOT supplied.
         */

        const trendParams = new URLSearchParams({
          date: selectedDate,

          cityId: String(selectedCity.city_id),

          zoneId: String(selectedZone.zone_id),

          divisionId: String(selectedDivision.division_id),
        });

        /*
         * =====================================================
         * API REQUESTS
         * =====================================================
         */

        const [summary, vehicleSummary, generationTrend] = await Promise.all([
          api.get(`/api/admin/overview/summary?${queryString}`),

          api.get("/api/admin/overview/vehicle-summary"),

          api.get(`/api/admin/overview/generation-trend?${queryString}`),
        ]);

        if (!mounted) {
          return;
        }

        /*
         * =====================================================
         * STORE RESPONSE
         * =====================================================
         */

        const summaryData = summary.data.data;

        const generationTrendData = generationTrend.data.data || [];

        /*
         * =====================================================
         * CHECK FOR NO DATA
         * =====================================================
         *
         * If the selected date has no telemetry,
         * show "No Data Found" while keeping Header alive.
         */

        const hasNoData =
          Number(summaryData?.totalWasteCollected || 0) === 0 &&
          Number(summaryData?.collectionPoints || 0) === 0 &&
          generationTrendData.length === 0;

        setOverviewData({
          summary: summary.data.data,

          vehicleSummary: vehicleSummary.data.data,

          generationTrend: generationTrend.data.data,
        });

        /*
         * Clear any previous error after
         * successful response.
         */

        setError("");
      } catch (err) {
        if (!mounted) {
          return;
        }

        console.error("Overview API Error:", err);

        /*
         * =====================================================
         * MISSING DAY TABLE HANDLING
         * =====================================================
         *
         * PostgreSQL:
         *
         * Code 42P01
         *
         * means the requested relation/table does not exist.
         *
         * Example:
         *
         * day_15082026 does not exist
         *
         * This is NOT a dashboard crash.
         *
         * Treat it as "No Data Found".
         */

        const backendMessage =
          err?.response?.data?.message || err?.message || "";

        const isMissingDayTable =
          backendMessage.includes("42P01") ||
          backendMessage.includes("does not exist") ||
          backendMessage.includes("relation");

        if (isMissingDayTable) {
          setOverviewData({
            summary: null,

            vehicleSummary: {
              totalVehicles: 0,
              runningVehicles: 0,
              inactiveVehicles: 0,
              vehicleStatus: [],
            },

            generationTrend: [],

            map: null,

            hasNoData: true,
          });

          /*
           * IMPORTANT:
           * Do NOT put anything into error.
           */

          setError("");

          return;
        }

        /*
         * =====================================================
         * REAL ERROR
         * =====================================================
         *
         * Keep Header visible.
         * Show the error below the Header.
         *
         * No full-screen error.
         * No Retry button.
         */

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

  /*
   * =========================================================
   * RENDER
   * =========================================================
   *
   * IMPORTANT:
   *
   * Header is ALWAYS rendered.
   *
   * This means even if:
   *
   * day_15082026
   * does not exist,
   *
   * the admin can still use:
   *
   * City
   * Zone
   * Division
   * Ward
   * Date
   *
   * and move back to a valid date.
   */

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFAFC]">
      <Header selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

      {loading && (
        <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-8 py-6">
          <p className="text-lg font-medium text-gray-500">
            Loading dashboard...
          </p>
        </main>
      )}

      {!loading && !error && overviewData?.hasNoData && (
        <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-8 py-6">
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-700">
              No Data Found
            </p>

            <p className="mt-2 text-gray-500">
              No telemetry data is available for {selectedDate}.
            </p>
          </div>
        </main>
      )}

      {!loading && error && (
        <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-8 py-6">
          <div className="text-center">
            <p className="text-lg font-semibold text-red-500">{error}</p>
          </div>
        </main>
      )}

      {!loading && !error && !overviewData?.hasNoData && (
        <main className="space-y-6 px-8 py-6">
          <OverviewKPIs data={overviewData?.summary} />

          <VehicleStats
            vehicleData={overviewData?.vehicleSummary}
            trendData={overviewData?.generationTrend}
          />

          <CityOverviewMap mapData={overviewData?.map} />
        </main>
      )}
    </div>
  );
}
