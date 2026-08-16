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
     *
     * The Header/FilterContext loads:
     *
     * City
     *   ↓
     * Zone
     *   ↓
     * Division
     *   ↓
     * Ward
     *
     * We should not make an Overview request while that
     * hierarchy is still being resolved.
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
         * API REQUESTS
         * =====================================================
         *
         * SUMMARY and GENERATION TREND use the geographic
         * filter.
         *
         * VEHICLE SUMMARY is global vehicle-master data,
         * so it does not receive the ward filter.
         *
         * MAP currently preserves its existing contract.
         */

        const [summary, vehicleSummary, generationTrend, map] =
          await Promise.all([
            api.get(`/api/admin/overview/summary?${queryString}`),

            api.get("/api/admin/overview/vehicle-summary"),

            api.get(`/api/admin/overview/generation-trend?${queryString}`),

            api.get("/api/admin/overview/map"),
          ]);

        if (!mounted) {
          return;
        }

        /*
         * =====================================================
         * STORE RESPONSE
         * =====================================================
         */

        setOverviewData({
          summary: summary.data.data,

          vehicleSummary: vehicleSummary.data.data,

          generationTrend: generationTrend.data.data,

          map: map.data.data,
        });
      } catch (err) {
        if (!mounted) {
          return;
        }

        console.error("Overview API Error:", err);

        setError(
          err.response?.data?.message || "Unable to connect to the server.",
        );
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
   * LOADING
   * =========================================================
   */

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FAFAFC]">
        <p className="text-lg font-medium text-gray-500">Loading dashboard.</p>
      </div>
    );
  }

  /*
   * =========================================================
   * ERROR
   * =========================================================
   */

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FAFAFC]">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-500">{error}</p>

          <button
            onClick={() => {
              /*
               * Changing a dependency is normally what triggers
               * the request. This button is kept for the existing
               * UI contract.
               */
              window.location.reload();
            }}
            className="
              mt-5
              rounded-xl
              bg-violet-600
              px-5
              py-2
              text-white
              transition
              hover:bg-violet-700
            "
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFAFC]">
      <Header selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

      <main className="space-y-6 px-8 py-6">
        <OverviewKPIs data={overviewData?.summary} />

        <VehicleStats
          vehicleData={overviewData?.vehicleSummary}
          trendData={overviewData?.generationTrend}
        />

        <CityOverviewMap mapData={overviewData?.map} />
      </main>
    </div>
  );
}
