import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import api from "../api/axios";
import Header from "../components/layouts/Header";

import CreatePlantModal from "../components/plants/CreatePlantModal";
import EditPlantModal from "../components/plants/EditPlantModal";
import DeletePlantModal from "../components/plants/DeletePlantModal";

import PlantKPICards from "../components/plants/PlantKPICards";
import PlantLocations from "../components/plants/PlantLocations";
import PlantDirectory from "../components/plants/PlantDirectory";

import { useLanguage } from "../i18n";

/* ===========================================================
   PLANTS PAGE
=========================================================== */

export default function Plants() {
  const { t } = useLanguage();

  /* ===========================================================
     STATE
  =========================================================== */

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [plants, setPlants] = useState([]);
  const [plantLocations, setPlantLocations] = useState([]);
  const [pagination, setPagination] = useState({});

  /* ===========================================================
     MODAL STATE
  =========================================================== */

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [selectedPlant, setSelectedPlant] =
    useState(null);

  /* ===========================================================
     FETCH DASHBOARD DATA
  =========================================================== */

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

      /* =====================================================
         DASHBOARD DATA
      ===================================================== */

      if (dashboardResponse?.data?.success) {
        setDashboardData(
          dashboardResponse.data.data
        );
      }

      /* =====================================================
         PLANTS
      ===================================================== */

      if (plantsResponse?.data?.success) {
        const plantData =
          plantsResponse.data.data;

        setPlants(
          plantData?.plants || []
        );

        setPagination(
          plantData?.pagination || {}
        );
      } else {
        setPlants([]);
        setPagination({});
      }

      /* =====================================================
         PLANT LOCATIONS
      ===================================================== */

      if (locationsResponse?.data?.success) {
        setPlantLocations(
          locationsResponse.data.data || []
        );
      } else {
        setPlantLocations([]);
      }
    } catch (err) {
      console.error(
        "Plants Dashboard Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          t(
            "plants.errors.serverConnection",
            "Unable to connect to the server."
          )
      );
    } finally {
      setLoading(false);
    }
  };

  /* ===========================================================
     CREATE PLANT
  =========================================================== */

  const handleCreatePlant = () => {
    setShowCreateModal(true);
  };

  /* ===========================================================
     EDIT PLANT
  =========================================================== */

  const handleEditPlant = (plant) => {
    setSelectedPlant(plant);
    setShowEditModal(true);
  };

  /* ===========================================================
     DELETE PLANT
  =========================================================== */

  const handleDeletePlant = (plant) => {
    setSelectedPlant(plant);
    setShowDeleteModal(true);
  };

  /* ===========================================================
     INITIAL LOAD
  =========================================================== */

  useEffect(() => {
    fetchDashboard();
  }, []);

  /* ===========================================================
     PREVENT BACKGROUND SCROLL WHEN MODAL IS OPEN
  =========================================================== */

  useEffect(() => {
    const modalOpen =
      showCreateModal ||
      showEditModal ||
      showDeleteModal;

    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [
    showCreateModal,
    showEditModal,
    showDeleteModal,
  ]);

  /* ===========================================================
     LOADING
  =========================================================== */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FD]">
        <p className="text-[14px] font-medium text-gray-500">
          {t(
            "plants.loading",
            "Loading Plant Dashboard..."
          )}
        </p>
      </div>
    );
  }

  /* ===========================================================
     ERROR
  =========================================================== */

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FD]">
        <div className="text-center">

          <p className="text-[15px] font-semibold text-red-500">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchDashboard}
            className="
              mt-5
              rounded-xl
              bg-[#6C2BFF]
              px-5
              py-2.5
              text-[13px]
              font-semibold
              text-white
              transition
              hover:bg-[#5B21E8]
            "
          >
            {t(
              "plants.retry",
              "Retry"
            )}
          </button>

        </div>
      </div>
    );
  }

  /* ===========================================================
     RENDER
  =========================================================== */

  return (
    <div className="flex-1 min-h-screen bg-[#F8F9FD]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <Header variant="dashboard" />

      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}

      <main className="px-6 py-6">

        {/* =================================================
            PAGE HEADING
        ================================================= */}

        <div className="mb-6">

          <h1
            className="
              text-[28px]
              font-bold
              leading-tight
              text-[#16295A]
            "
          >
            {t(
              "plants.title",
              "Plant Overview"
            )}
          </h1>

          <p
            className="
              mt-1.5
              text-[14px]
              leading-6
              text-[#667085]
            "
          >
            {t(
              "plants.description",
              "Monitor all waste processing plants and their operations."
            )}
          </p>

        </div>

        {/* =================================================
            KPI CARDS
        ================================================= */}

        <PlantKPICards
          data={dashboardData}
        />

        {/* =================================================
            PLANT LOCATIONS / MAP
        ================================================= */}

        <PlantLocations
          plants={plantLocations.map(
            (location) => {

              const plant =
                plants.find(
                  (p) =>
                    p.id === location.id
                );

              return {
                ...location,

                plant_manager:
                  plant?.plant_manager,

                vehicles_enrolled:
                  plant?.vehicles_enrolled,

                capacity_ton_per_day:
                  plant?.capacity_ton_per_day,

                latitude:
                  location.latitude,

                longitude:
                  location.longitude,
              };
            }
          )}
        />

        {/* =================================================
            PLANT DIRECTORY
        ================================================= */}

        <PlantDirectory
          plants={plants}
          pagination={pagination}
          onCreatePlant={handleCreatePlant}
          onEditPlant={handleEditPlant}
          onDeletePlant={handleDeletePlant}
        />

        {/* =================================================
            CREATE PLANT MODAL
        ================================================= */}

        {showCreateModal &&
          createPortal(
            <CreatePlantModal
              onClose={() =>
                setShowCreateModal(false)
              }
              onSuccess={() => {
                setShowCreateModal(false);
                fetchDashboard();
              }}
            />,
            document.body
          )}

        {/* =================================================
            EDIT PLANT MODAL
        ================================================= */}

        {showEditModal &&
          selectedPlant &&
          createPortal(
            <EditPlantModal
              plant={selectedPlant}
              onClose={() => {
                setShowEditModal(false);
                setSelectedPlant(null);
              }}
              onSuccess={() => {
                setShowEditModal(false);
                setSelectedPlant(null);
                fetchDashboard();
              }}
            />,
            document.body
          )}

        {/* =================================================
            DELETE PLANT MODAL
        ================================================= */}

        {showDeleteModal &&
          selectedPlant &&
          createPortal(
            <DeletePlantModal
              plant={selectedPlant}
              onClose={() => {
                setShowDeleteModal(false);
                setSelectedPlant(null);
              }}
              onSuccess={() => {
                setShowDeleteModal(false);
                setSelectedPlant(null);
                fetchDashboard();
              }}
            />,
            document.body
          )}

      </main>
    </div>
  );
}import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import api from "../api/axios";
import Header from "../components/layouts/Header";

import CreatePlantModal from "../components/plants/CreatePlantModal";
import EditPlantModal from "../components/plants/EditPlantModal";
import DeletePlantModal from "../components/plants/DeletePlantModal";

import PlantKPICards from "../components/plants/PlantKPICards";
import PlantLocations from "../components/plants/PlantLocations";
import PlantDirectory from "../components/plants/PlantDirectory";

import { useLanguage } from "../i18n";

/* ===========================================================
   PLANTS PAGE
=========================================================== */

export default function Plants() {
  const { t } = useLanguage();

  /* ===========================================================
     STATE
  =========================================================== */

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [plants, setPlants] = useState([]);
  const [plantLocations, setPlantLocations] = useState([]);
  const [pagination, setPagination] = useState({});

  /* ===========================================================
     MODAL STATE
  =========================================================== */

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [selectedPlant, setSelectedPlant] =
    useState(null);

  /* ===========================================================
     FETCH DASHBOARD DATA
  =========================================================== */

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

      /* =====================================================
         DASHBOARD DATA
      ===================================================== */

      if (dashboardResponse?.data?.success) {
        setDashboardData(
          dashboardResponse.data.data
        );
      }

      /* =====================================================
         PLANTS
      ===================================================== */

      if (plantsResponse?.data?.success) {
        const plantData =
          plantsResponse.data.data;

        setPlants(
          plantData?.plants || []
        );

        setPagination(
          plantData?.pagination || {}
        );
      } else {
        setPlants([]);
        setPagination({});
      }

      /* =====================================================
         PLANT LOCATIONS
      ===================================================== */

      if (locationsResponse?.data?.success) {
        setPlantLocations(
          locationsResponse.data.data || []
        );
      } else {
        setPlantLocations([]);
      }
    } catch (err) {
      console.error(
        "Plants Dashboard Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          t(
            "plants.errors.serverConnection",
            "Unable to connect to the server."
          )
      );
    } finally {
      setLoading(false);
    }
  };

  /* ===========================================================
     CREATE PLANT
  =========================================================== */

  const handleCreatePlant = () => {
    setShowCreateModal(true);
  };

  /* ===========================================================
     EDIT PLANT
  =========================================================== */

  const handleEditPlant = (plant) => {
    setSelectedPlant(plant);
    setShowEditModal(true);
  };

  /* ===========================================================
     DELETE PLANT
  =========================================================== */

  const handleDeletePlant = (plant) => {
    setSelectedPlant(plant);
    setShowDeleteModal(true);
  };

  /* ===========================================================
     INITIAL LOAD
  =========================================================== */

  useEffect(() => {
    fetchDashboard();
  }, []);

  /* ===========================================================
     PREVENT BACKGROUND SCROLL WHEN MODAL IS OPEN
  =========================================================== */

  useEffect(() => {
    const modalOpen =
      showCreateModal ||
      showEditModal ||
      showDeleteModal;

    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [
    showCreateModal,
    showEditModal,
    showDeleteModal,
  ]);

  /* ===========================================================
     LOADING
  =========================================================== */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FD]">
        <p className="text-[14px] font-medium text-gray-500">
          {t(
            "plants.loading",
            "Loading Plant Dashboard..."
          )}
        </p>
      </div>
    );
  }

  /* ===========================================================
     ERROR
  =========================================================== */

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FD]">
        <div className="text-center">

          <p className="text-[15px] font-semibold text-red-500">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchDashboard}
            className="
              mt-5
              rounded-xl
              bg-[#6C2BFF]
              px-5
              py-2.5
              text-[13px]
              font-semibold
              text-white
              transition
              hover:bg-[#5B21E8]
            "
          >
            {t(
              "plants.retry",
              "Retry"
            )}
          </button>

        </div>
      </div>
    );
  }

  /* ===========================================================
     RENDER
  =========================================================== */

  return (
    <div className="flex-1 min-h-screen bg-[#F8F9FD]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <Header variant="dashboard" />

      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}

      <main className="px-6 py-6">

        {/* =================================================
            PAGE HEADING
        ================================================= */}

        <div className="mb-6">

          <h1
            className="
              text-[28px]
              font-bold
              leading-tight
              text-[#16295A]
            "
          >
            {t(
              "plants.title",
              "Plant Overview"
            )}
          </h1>

          <p
            className="
              mt-1.5
              text-[14px]
              leading-6
              text-[#667085]
            "
          >
            {t(
              "plants.description",
              "Monitor all waste processing plants and their operations."
            )}
          </p>

        </div>

        {/* =================================================
            KPI CARDS
        ================================================= */}

        <PlantKPICards
          data={dashboardData}
        />

        {/* =================================================
            PLANT LOCATIONS / MAP
        ================================================= */}

        <PlantLocations
          plants={plantLocations.map(
            (location) => {

              const plant =
                plants.find(
                  (p) =>
                    p.id === location.id
                );

              return {
                ...location,

                plant_manager:
                  plant?.plant_manager,

                vehicles_enrolled:
                  plant?.vehicles_enrolled,

                capacity_ton_per_day:
                  plant?.capacity_ton_per_day,

                latitude:
                  location.latitude,

                longitude:
                  location.longitude,
              };
            }
          )}
        />

        {/* =================================================
            PLANT DIRECTORY
        ================================================= */}

        <PlantDirectory
          plants={plants}
          pagination={pagination}
          onCreatePlant={handleCreatePlant}
          onEditPlant={handleEditPlant}
          onDeletePlant={handleDeletePlant}
        />

        {/* =================================================
            CREATE PLANT MODAL
        ================================================= */}

        {showCreateModal &&
          createPortal(
            <CreatePlantModal
              onClose={() =>
                setShowCreateModal(false)
              }
              onSuccess={() => {
                setShowCreateModal(false);
                fetchDashboard();
              }}
            />,
            document.body
          )}

        {/* =================================================
            EDIT PLANT MODAL
        ================================================= */}

        {showEditModal &&
          selectedPlant &&
          createPortal(
            <EditPlantModal
              plant={selectedPlant}
              onClose={() => {
                setShowEditModal(false);
                setSelectedPlant(null);
              }}
              onSuccess={() => {
                setShowEditModal(false);
                setSelectedPlant(null);
                fetchDashboard();
              }}
            />,
            document.body
          )}

        {/* =================================================
            DELETE PLANT MODAL
        ================================================= */}

        {showDeleteModal &&
          selectedPlant &&
          createPortal(
            <DeletePlantModal
              plant={selectedPlant}
              onClose={() => {
                setShowDeleteModal(false);
                setSelectedPlant(null);
              }}
              onSuccess={() => {
                setShowDeleteModal(false);
                setSelectedPlant(null);
                fetchDashboard();
              }}
            />,
            document.body
          )}

      </main>
    </div>
  );
}