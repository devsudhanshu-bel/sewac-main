import { useEffect, useState } from "react";

import api from "../api/axios";

import Header from "../components/layouts/Header";

import PlantKPICards from "../components/plants/PlantKPICards";
import PlantLocations from "../components/plants/PlantLocations";
import PlantDirectory from "../components/plants/PlantDirectory";

export default function Plants() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [plants, setPlants] = useState([]);
  const [plantLocations, setPlantLocations] = useState([]);
  const [pagination, setPagination] = useState({});

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [
  dashboardResponse,
  plantsResponse,
  locationsResponse,
] = await Promise.all([
  api.get("/api/plants/dashboard"),
  api.get("/api/plants"),
  api.get("/api/plants/locations"),
]);

      if (dashboardResponse.data.success) {
  setDashboardData(dashboardResponse.data.data);
}

if (plantsResponse.data.success) {
  setPlants(plantsResponse.data.data.plants);
  setPagination(plantsResponse.data.data.pagination);
}
if (locationsResponse.data.success) {
  setPlantLocations(locationsResponse.data.data);
}
    } catch (err) {
      console.error("Plants Dashboard Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const [
  dashboardResponse,
  plantsResponse,
  locationsResponse,
] = await Promise.all([
  api.get("/api/plants/dashboard"),
  api.get("/api/plants"),
  api.get("/api/plants/locations"),
]);

        if (!mounted) return;

        if (dashboardResponse.data.success) {
  setDashboardData(dashboardResponse.data.data);
} else {
  setError(
    dashboardResponse.data.message || "Failed to load dashboard."
  );
}

if (plantsResponse.data.success) {
  setPlants(plantsResponse.data.data.plants);
  setPagination(plantsResponse.data.data.pagination);
}
if (locationsResponse.data.success) {
  setPlantLocations(locationsResponse.data.data);
}
      } catch (err) {
        if (!mounted) return;

        console.error("Plants Dashboard Error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to connect to the server."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F8F9FD]">
        <p className="text-lg font-medium text-gray-500">
          Loading Plant Dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F8F9FD]">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-500">
            {error}
          </p>

          <button
            onClick={fetchDashboard}
            className="mt-5 rounded-xl bg-violet-600 px-5 py-2 text-white transition hover:bg-violet-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-[#F8F9FD]">
      {/* Header */}
      <Header variant="dashboard" />

      {/* Page Content */}
      <div className="p-6">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-[32px] font-bold text-[#16295A]">
            Plant Overview
          </h1>

          <p className="mt-2 text-[15px] text-[#667085]">
            Monitor all waste processing plants and their operations
          </p>
        </div>

        {/* KPI Cards */}
        <PlantKPICards
          data={dashboardData}
        />

        {/* Plant Locations */}
        <PlantLocations plants={plantLocations} />

        {/* Plant Directory */}
        <PlantDirectory
  plants={plants}
  pagination={pagination}
/>
      </div>
    </div>
  );
}