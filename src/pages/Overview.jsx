import { useEffect, useState } from "react";

import api from "../api/axios";

import Header from "../components/layouts/Header";

import OverviewKPIs from "../components/overview/OverviewKPIs";
import VehicleStats from "../components/overview/VehicleStats";
import CityOverviewMap from "../components/overview/CityOverviewMap";

export default function Overview() {
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        summary,
        vehicleSummary,
        generationTrend,
        map,
      ] = await Promise.all([
        api.get("/api/admin/overview/summary"),
        api.get("/api/admin/overview/vehicle-summary"),
        api.get("/api/admin/overview/generation-trend"),
        api.get("/api/admin/overview/map"),
      ]);

      setOverviewData({
        summary: summary.data.data,
        vehicleSummary: vehicleSummary.data.data,
        generationTrend: generationTrend.data.data,
        map: map.data.data,
      });
    } catch (err) {
      console.error("Overview API Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FAFAFC]">
        <p className="text-lg font-medium text-gray-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FAFAFC]">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-500">
            {error}
          </p>

          <button
            onClick={fetchOverview}
            className="mt-5 rounded-xl bg-violet-600 px-5 py-2 text-white transition hover:bg-violet-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFAFC]">
      <Header />

      <main className="space-y-6 px-8 py-6">
        <OverviewKPIs
          data={overviewData?.summary}
        />

        <VehicleStats
          vehicleData={overviewData?.vehicleSummary}
          trendData={overviewData?.generationTrend}
        />

        <CityOverviewMap
          mapData={overviewData?.map}
        />
      </main>
    </div>
  );
}