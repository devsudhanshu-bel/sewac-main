import { useEffect, useState } from "react";

import api from "../api/axios";
import Header from "../components/layouts/Header";

import CreatePlantModal from "../components/plants/CreatePlantModal";
import EditPlantModal from "../components/plants/EditPlantModal";
import DeletePlantModal from "../components/plants/DeletePlantModal";
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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
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

  const handleCreatePlant = () => {
  setShowCreateModal(true);
};

const handleEditPlant = (plant) => {
  setSelectedPlant(plant);
  setShowEditModal(true);
};

const handleDeletePlant = (plant) => {
  setSelectedPlant(plant);
  setShowDeleteModal(true);
};

  useEffect(() => {
  fetchDashboard();
}, []);

useEffect(() => {
  if (
    showCreateModal ||
    showEditModal ||
    showDeleteModal
  ) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [
  showCreateModal,
  showEditModal,
  showDeleteModal,
]);


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
       <PlantLocations
  plants={plantLocations.map((location) => {
    const plant = plants.find((p) => p.id === location.id);


    return {
      ...location,
      plant_manager: plant?.plant_manager,
      vehicles_enrolled: plant?.vehicles_enrolled,
      capacity_ton_per_day: plant?.capacity_ton_per_day,

      latitude: location.latitude,
      longitude: location.longitude,
    };
  })}
/>

        {/* Plant Directory */}
        <PlantDirectory
  plants={plants}
  pagination={pagination}
  onCreatePlant={handleCreatePlant}
  onEditPlant={handleEditPlant}
  onDeletePlant={handleDeletePlant}
/>
{showCreateModal && (
  <CreatePlantModal
    onClose={() => setShowCreateModal(false)}
    onSuccess={fetchDashboard}
  />
)}

{showEditModal && selectedPlant && (
  <EditPlantModal
    plant={selectedPlant}
    onClose={() => {
      setShowEditModal(false);
      setSelectedPlant(null);
    }}
    onSuccess={fetchDashboard}
  />
)}

{showDeleteModal && selectedPlant && (
  <DeletePlantModal
    plant={selectedPlant}
    onClose={() => {
      setShowDeleteModal(false);
      setSelectedPlant(null);
    }}
    onSuccess={fetchDashboard}
  />
)}
      </div>
    </div>
  );
}