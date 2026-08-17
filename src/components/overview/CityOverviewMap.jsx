import { useState, useRef, useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import {
  Map as MapIcon,
  Route,
  MapPin,
  Factory,
  Megaphone,
  ChevronDown,
  Truck,
  Navigation,
  RefreshCw,
} from "lucide-react";

import "leaflet/dist/leaflet.css";

/* =========================================================
   CONFIG
========================================================= */

const API_BASE_URL = "https://sewac-main.onrender.com/api";

/*
  Different vehicles get different colors.
  The same vehicle keeps the same color.
*/
const ROUTE_COLORS = [
  "#7C3AED",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#3B82F6",
  "#14B8A6",
];

/* =========================================================
   VEHICLE COLOR
========================================================= */

const getVehicleColor = (vehicleNumber, index = 0) => {
  if (!vehicleNumber) {
    return ROUTE_COLORS[index % ROUTE_COLORS.length];
  }

  let hash = 0;

  for (let i = 0; i < vehicleNumber.length; i++) {
    hash = vehicleNumber.charCodeAt(i) + ((hash << 5) - hash);
  }

  return ROUTE_COLORS[Math.abs(hash) % ROUTE_COLORS.length];
};

/* =========================================================
   VEHICLE ICON
========================================================= */

const createTruckIcon = (color) => {
  return L.divIcon({
    className: "sewac-truck-marker",
    html: `
      <div
        style="
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: white;
          border: 3px solid ${color};
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(0,0,0,0.18);
        "
      >
        <div
          style="
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: ${color}18;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
          "
        >
          🚛
        </div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20],
  });
};

/* =========================================================
   MAP CONTROLLER
========================================================= */

function MapController({ routes, selectedView }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    /*
      Force Leaflet to recalculate its dimensions.
      This is important because the map is inside a dashboard card.
    */
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    const handleResize = () => {
      map.invalidateSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [map]);

  /*
    When route data arrives, automatically fit the map
    around all available route coordinates.
  */
  useEffect(() => {
    if (selectedView !== "route") return;

    const allPoints = [];

    routes.forEach((vehicle) => {
      if (!vehicle.points) return;

      vehicle.points.forEach((point) => {
        const lat = Number(point.latitude);
        const lng = Number(point.longitude);

        if (
          Number.isFinite(lat) &&
          Number.isFinite(lng) &&
          lat !== 0 &&
          lng !== 0
        ) {
          allPoints.push([lat, lng]);
        }
      });
    });

    if (allPoints.length === 0) return;

    try {
      const bounds = L.latLngBounds(allPoints);

      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [70, 70],
          maxZoom: 15,
          animate: true,
        });
      }
    } catch (error) {
      console.error("Failed to fit route bounds:", error);
    }
  }, [routes, selectedView, map]);

  return null;
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function CityOverviewMap({
  selectedWard: selectedWardProp = null,
  selectedDivision: selectedDivisionProp = null,
  wardNo: wardNoProp = null,
  divisionName: divisionNameProp = null,
  selectedDate: selectedDateProp = null,
}) {
  /* =======================================================
     STATE
  ======================================================= */

  const [selectedView, setSelectedView] = useState("route");

  const [showViewMenu, setShowViewMenu] = useState(false);

  const [routes, setRoutes] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [lastUpdated, setLastUpdated] = useState(null);

  const [mapCenter, setMapCenter] = useState([12.9716, 77.5946]);

  const [mapZoom, setMapZoom] = useState(11);

  const menuRef = useRef(null);

  /* =======================================================
     HEADER DATA
     
     The component first uses props coming from Header/page.
     
     If props aren't provided, it also checks common localStorage
     values so the map can still work independently.
  ======================================================= */

  const getStoredValue = (...keys) => {
    if (typeof window === "undefined") return null;

    for (const key of keys) {
      const value = localStorage.getItem(key);

      if (value !== null && value !== undefined && value !== "") {
        return value;
      }
    }

    return null;
  };

  const selectedWard =
    selectedWardProp ??
    wardNoProp ??
    getStoredValue(
      "selectedWard",
      "selectedWardNo",
      "wardNo",
      "ward",
      "selected_ward"
    );

  const selectedDivision =
    selectedDivisionProp ??
    divisionNameProp ??
    getStoredValue(
      "selectedDivision",
      "divisionName",
      "division",
      "selected_division"
    );

  /* =======================================================
     NORMALIZE WARD NUMBER
  ======================================================= */

  const normalizedWard = useMemo(() => {
    if (
      selectedWard === null ||
      selectedWard === undefined ||
      selectedWard === ""
    ) {
      return null;
    }

    /*
      Handles:
      216
      "216"
      "Ibblur (216)"
      "Ward 216"
    */
    const match = String(selectedWard).match(/\d+/);

    return match ? Number(match[0]) : null;
  }, [selectedWard]);

  /* =======================================================
     DATE
  ======================================================= */

  const getApiDate = () => {
    /*
      If Header sends selectedDate, use it.
    */

    if (selectedDateProp) {
      return selectedDateProp;
    }

    /*
      Otherwise try localStorage.
    */

    const storedDate = getStoredValue(
      "selectedDate",
      "dashboardDate",
      "routeDate"
    );

    if (storedDate) {
      return storedDate;
    }

    /*
      IMPORTANT:
      Your API example is for 2026-08-16.
      We use yesterday as the fallback because route data
      is generally the completed previous day's route.
    */

    const date = new Date();

    date.setDate(date.getDate() - 1);

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  /* =======================================================
     FETCH ROUTE DATA
  ======================================================= */

  const fetchRoutes = async () => {
    /*
      Route map requires a ward.
    */

    if (!normalizedWard) {
      setRoutes([]);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const date = getApiDate();

      const url =
        `${API_BASE_URL}/route-map` +
        `?date=${encodeURIComponent(date)}` +
        `&wardNo=${encodeURIComponent(normalizedWard)}`;

      console.log("====================================");
      console.log("SEWAC ROUTE MAP REQUEST");
      console.log("URL:", url);
      console.log("WARD:", normalizedWard);
      console.log("DATE:", date);
      console.log("====================================");

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Route API returned HTTP ${response.status}`
        );
      }

      const result = await response.json();

      console.log("SEWAC ROUTE MAP RESPONSE:", result);

      /*
        Your backend response is:

        {
          success: true,
          data: {
            success: true,
            date: "...",
            wardNo: 216,
            totalVehicles: 2,
            vehicles: [...]
          }
        }
      */

      const payload = result?.data ?? result;

      const vehicleData = Array.isArray(payload?.vehicles)
        ? payload.vehicles
        : [];

      /*
        Normalize every vehicle.
      */

      const normalizedVehicles = vehicleData
        .map((vehicle, vehicleIndex) => {
          const rawPoints = Array.isArray(vehicle?.points)
            ? vehicle.points
            : [];

          /*
            IMPORTANT:
            Leaflet expects:

            [latitude, longitude]

            Backend gives:

            latitude
            longitude
          */

          const points = rawPoints
            .map((point) => {
              const latitude = Number(point?.latitude);

              const longitude = Number(point?.longitude);

              if (
                !Number.isFinite(latitude) ||
                !Number.isFinite(longitude)
              ) {
                return null;
              }

              if (latitude === 0 || longitude === 0) {
                return null;
              }

              return {
                ...point,
                latitude,
                longitude,
                position: [latitude, longitude],
              };
            })
            .filter(Boolean);

          /*
            Sort points chronologically.

            This ensures the polyline follows the actual
            vehicle movement rather than database order.
          */

          points.sort((a, b) => {
            const timeA = new Date(
              a.iottimestamp ||
                a.receivedtimestamp ||
                0
            ).getTime();

            const timeB = new Date(
              b.iottimestamp ||
                b.receivedtimestamp ||
                0
            ).getTime();

            return timeA - timeB;
          });

          const vehicleNumber =
            vehicle?.vehicleNumber ||
            vehicle?.vehicleNo ||
            vehicle?.registrationNumber ||
            `Vehicle ${vehicleIndex + 1}`;

          return {
            ...vehicle,
            vehicleNumber,
            vehicleTableName:
              vehicle?.vehicleTableName ||
              vehicle?.vehicleTable ||
              "",
            points,
            color: getVehicleColor(
              vehicleNumber,
              vehicleIndex
            ),
          };
        })
        /*
          Don't render vehicles that have no valid GPS.
        */
        .filter((vehicle) => vehicle.points.length > 0);

      console.log(
        "NORMALIZED ROUTES:",
        normalizedVehicles
      );

      setRoutes(normalizedVehicles);

      setLastUpdated(new Date());

      /*
        Calculate center from all GPS points.
      */

      const allPoints = normalizedVehicles.flatMap(
        (vehicle) => vehicle.points
      );

      if (allPoints.length > 0) {
        const totalLat = allPoints.reduce(
          (sum, point) => sum + point.latitude,
          0
        );

        const totalLng = allPoints.reduce(
          (sum, point) => sum + point.longitude,
          0
        );

        setMapCenter([
          totalLat / allPoints.length,
          totalLng / allPoints.length,
        ]);

        /*
          Reasonable initial zoom.
          MapController will fit exact route bounds.
        */

        setMapZoom(12);
      }
    } catch (err) {
      console.error(
        "SEWAC ROUTE MAP ERROR:",
        err
      );

      setRoutes([]);

      setError(
        err?.message ||
          "Unable to load route data."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     FETCH WHEN WARD CHANGES
  ======================================================= */

  useEffect(() => {
    if (selectedView !== "route") {
      return;
    }

    fetchRoutes();
  }, [
    normalizedWard,
    selectedDateProp,
    selectedView,
  ]);

  /* =======================================================
     AUTO REFRESH HEADER DATA
     
     If Header changes localStorage, listen for storage events.
  ======================================================= */

  useEffect(() => {
    const handleStorageChange = () => {
      if (selectedView === "route") {
        fetchRoutes();
      }
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, [selectedView, normalizedWard]);

  /* =======================================================
     CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  ======================================================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setShowViewMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =======================================================
     MAP VIEW OPTIONS
  ======================================================= */

  const mapViews = [
    {
      id: "overview",
      label: "City Overview Map",
      icon: MapIcon,
      color: "#2563EB",
    },
    {
      id: "route",
      label: "Route Map",
      icon: Route,
      color: "#7C3AED",
    },
    {
      id: "gvp",
      label: "Garbage Vulnerable Points (GVP)",
      icon: MapPin,
      color: "#16A34A",
    },
    {
      id: "plants",
      label: "Plants Active",
      icon: Factory,
      color: "#059669",
    },
    {
      id: "complaints",
      label: "Customer Grievances",
      icon: Megaphone,
      color: "#EC4899",
    },
  ];

  const activeView =
    mapViews.find(
      (view) => view.id === selectedView
    ) || mapViews[1];

  const ActiveIcon = activeView.icon;

  /* =======================================================
     ROUTE POINTS
  ======================================================= */

  const totalGpsPoints = routes.reduce(
    (total, vehicle) =>
      total + vehicle.points.length,
    0
  );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="w-full rounded-[28px] bg-white border border-slate-200 shadow-[0_2px_10px_rgba(15,23,42,0.05)] p-6">

      {/* =================================================
          TITLE
      ================================================= */}

      <div className="mb-6 px-1">
        <h2 className="text-[23px] font-semibold tracking-[-0.02em] text-slate-950">
          CITY OVERVIEW MAP
        </h2>
      </div>

      {/* =================================================
          MAP
      ================================================= */}

      <div
        className="relative w-full overflow-hidden rounded-[24px] border border-slate-200"
        style={{
          height: "700px",
        }}
      >

        {/* =================================================
            LEAFLET MAP
        ================================================= */}

        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          zoomControl={true}
          style={{
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        >

          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* ===============================================
              MAP CONTROLLER
          =============================================== */}

          <MapController
            routes={routes}
            selectedView={selectedView}
          />

          {/* ===============================================
              ROUTES
          =============================================== */}

          {selectedView === "route" &&
            routes.map((vehicle, vehicleIndex) => {

              /*
                Convert normalized points into:

                [
                  [lat, lng],
                  [lat, lng],
                  ...
                ]
              */

              const positions = vehicle.points.map(
                (point) => point.position
              );

              /*
                Safety check.
                A line needs at least two points.
              */

              if (positions.length < 2) {
                return null;
              }

              const latestPoint =
                vehicle.points[
                  vehicle.points.length - 1
                ];

              return (
                <div key={`${vehicle.vehicleNumber}-${vehicleIndex}`}>

                  {/* =====================================
                      OUTER GLOW
                  ===================================== */}

                  <Polyline
                    positions={positions}
                    pathOptions={{
                      color: vehicle.color,
                      weight: 8,
                      opacity: 0.16,
                      lineCap: "round",
                      lineJoin: "round",
                    }}
                  />

                  {/* =====================================
                      MAIN ROUTE
                  ===================================== */}

                  <Polyline
                    positions={positions}
                    pathOptions={{
                      color: vehicle.color,
                      weight: 4,
                      opacity: 0.95,
                      lineCap: "round",
                      lineJoin: "round",
                    }}
                  />

                  {/* =====================================
                      CURRENT VEHICLE MARKER
                  ===================================== */}

                  {latestPoint && (
                    <Marker
                      position={
                        latestPoint.position
                      }
                      icon={createTruckIcon(
                        vehicle.color
                      )}
                    >
                      <Popup>
                        <div
                          style={{
                            minWidth: "190px",
                            fontFamily:
                              "Inter, sans-serif",
                          }}
                        >
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: "15px",
                              marginBottom: "8px",
                            }}
                          >
                            {vehicle.vehicleNumber}
                          </div>

                          <div
                            style={{
                              fontSize: "13px",
                              color: "#64748B",
                              marginBottom: "5px",
                            }}
                          >
                            Ward {normalizedWard}
                          </div>

                          <div
                            style={{
                              fontSize: "13px",
                              color: "#64748B",
                              marginBottom: "5px",
                            }}
                          >
                            GPS Points:{" "}
                            {vehicle.points.length}
                          </div>

                          <div
                            style={{
                              fontSize: "13px",
                              color: "#64748B",
                            }}
                          >
                            Last Location:
                            <br />
                            {latestPoint.latitude.toFixed(
                              6
                            )}
                            ,{" "}
                            {latestPoint.longitude.toFixed(
                              6
                            )}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  )}
                </div>
              );
            })}

        </MapContainer>

        {/* =================================================
            MAP VIEW SELECTOR
        ================================================= */}

        <div
          ref={menuRef}
          className="absolute left-5 top-5"
          style={{
            zIndex: 1000,
          }}
        >

          <button
            type="button"
            onClick={() =>
              setShowViewMenu(
                (previous) => !previous
              )
            }
            className="
              w-[470px]
              max-w-[calc(100vw-80px)]
              h-[74px]
              px-7
              bg-white
              rounded-[18px]
              border
              border-slate-200
              shadow-[0_8px_25px_rgba(15,23,42,0.10)]
              flex
              items-center
              justify-between
              transition-all
              hover:shadow-[0_10px_30px_rgba(15,23,42,0.14)]
            "
          >

            <div className="flex items-center gap-5">

              <ActiveIcon
                size={26}
                strokeWidth={2}
                style={{
                  color:
                    activeView.color,
                }}
              />

              <span className="text-[20px] font-semibold text-slate-700">
                {activeView.label}
              </span>

            </div>

            <ChevronDown
              size={22}
              className={`
                text-slate-700
                transition-transform
                ${
                  showViewMenu
                    ? "rotate-180"
                    : ""
                }
              `}
            />

          </button>

          {/* =================================================
              DROPDOWN
          ================================================= */}

          {showViewMenu && (
            <div
              className="
                absolute
                top-[82px]
                left-0
                w-[470px]
                max-w-[calc(100vw-80px)]
                rounded-[18px]
                bg-white
                border
                border-slate-200
                shadow-[0_15px_40px_rgba(15,23,42,0.15)]
                overflow-hidden
              "
            >

              {mapViews.map((view) => {
                const Icon = view.icon;

                const isActive =
                  selectedView === view.id;

                return (
                  <button
                    key={view.id}
                    type="button"
                    onClick={() => {
                      setSelectedView(
                        view.id
                      );

                      setShowViewMenu(false);
                    }}
                    className={`
                      w-full
                      px-7
                      py-5
                      flex
                      items-center
                      justify-between
                      transition-colors
                      ${
                        isActive
                          ? "bg-violet-50"
                          : "bg-white hover:bg-slate-50"
                      }
                    `}
                  >

                    <div className="flex items-center gap-5">

                      <Icon
                        size={24}
                        strokeWidth={2}
                        style={{
                          color:
                            view.color,
                        }}
                      />

                      <span className="text-[16px] font-medium text-slate-700">
                        {view.label}
                      </span>

                    </div>

                    {isActive && (
                      <span
                        style={{
                          color:
                            view.color,
                          fontSize: "22px",
                          fontWeight: 700,
                        }}
                      >
                        ✓
                      </span>
                    )}

                  </button>
                );
              })}

            </div>
          )}

        </div>

        {/* =================================================
            HEADER FILTERS
        ================================================= */}

        <div
          className="
            absolute
            right-5
            top-5
            flex
            gap-4
          "
          style={{
            zIndex: 1000,
          }}
        >

          {/* ===============================================
              DIVISION
          =============================================== */}

          <div
            className="
              min-w-[300px]
              px-6
              py-4
              bg-white
              rounded-[18px]
              border
              border-slate-200
              shadow-[0_8px_25px_rgba(15,23,42,0.08)]
            "
          >

            <div className="text-[12px] font-semibold tracking-wide uppercase text-slate-400">
              DIVISION
            </div>

            <div className="mt-1 text-[17px] font-semibold text-slate-700">
              {selectedDivision ||
                "All Divisions"}
            </div>

          </div>

          {/* ===============================================
              WARD
          =============================================== */}

          <div
            className="
              min-w-[300px]
              px-6
              py-4
              bg-white
              rounded-[18px]
              border
              border-slate-200
              shadow-[0_8px_25px_rgba(15,23,42,0.08)]
            "
          >

            <div className="text-[12px] font-semibold tracking-wide uppercase text-slate-400">
              WARD
            </div>

            <div className="mt-1 text-[17px] font-semibold text-slate-700">
              {selectedWard
                ? String(selectedWard)
                : "All Wards"}
            </div>

          </div>

        </div>

        {/* =================================================
            REFRESH BUTTON
        ================================================= */}

        {selectedView === "route" &&
          normalizedWard && (
            <button
              type="button"
              onClick={fetchRoutes}
              disabled={loading}
              title="Refresh route"
              className="
                absolute
                right-5
                bottom-5
                z-[1000]
                w-[44px]
                h-[44px]
                rounded-full
                bg-white
                border
                border-slate-200
                shadow-[0_6px_20px_rgba(15,23,42,0.12)]
                flex
                items-center
                justify-center
                hover:bg-slate-50
                transition
              "
            >

              <RefreshCw
                size={18}
                className={
                  loading
                    ? "animate-spin text-violet-600"
                    : "text-slate-600"
                }
              />

            </button>
          )}

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div
            className="
              absolute
              left-1/2
              top-1/2
              -translate-x-1/2
              -translate-y-1/2
              z-[1000]
              px-6
              py-4
              rounded-[16px]
              bg-white
              border
              border-slate-200
              shadow-[0_10px_30px_rgba(15,23,42,0.14)]
              flex
              items-center
              gap-3
            "
          >

            <RefreshCw
              size={18}
              className="animate-spin text-violet-600"
            />

            <span className="text-[14px] font-semibold text-slate-700">
              Loading route...
            </span>

          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {!loading &&
          error &&
          selectedView === "route" && (
            <div
              className="
                absolute
                left-1/2
                bottom-8
                -translate-x-1/2
                z-[1000]
                px-6
                py-4
                rounded-[16px]
                bg-white
                border
                border-red-200
                shadow-[0_8px_25px_rgba(15,23,42,0.10)]
              "
            >

              <div className="flex items-center gap-3">

                <Truck
                  size={20}
                  className="text-red-500"
                />

                <span className="text-[14px] font-semibold text-red-600">
                  {error}
                </span>

              </div>

            </div>
          )}

        {/* =================================================
            NO WARD
        ================================================= */}

        {!normalizedWard &&
          selectedView === "route" && (
            <div
              className="
                absolute
                left-1/2
                bottom-8
                -translate-x-1/2
                z-[1000]
                px-6
                py-4
                rounded-[16px]
                bg-white
                border
                border-slate-200
                shadow-[0_8px_25px_rgba(15,23,42,0.10)]
              "
            >

              <div className="flex items-center gap-3">

                <Truck
                  size={20}
                  className="text-violet-600"
                />

                <span className="text-[14px] font-semibold text-slate-600">
                  Please select a ward from the header.
                </span>

              </div>

            </div>
          )}

        {/* =================================================
            NO ROUTE
        ================================================= */}

        {!loading &&
          !error &&
          normalizedWard &&
          selectedView === "route" &&
          routes.length === 0 && (
            <div
              className="
                absolute
                left-1/2
                bottom-8
                -translate-x-1/2
                z-[1000]
                px-6
                py-4
                rounded-[16px]
                bg-white
                border
                border-slate-200
                shadow-[0_8px_25px_rgba(15,23,42,0.10)]
              "
            >

              <div className="flex items-center gap-3">

                <Navigation
                  size={20}
                  className="text-violet-600"
                />

                <span className="text-[14px] font-semibold text-slate-600">
                  No route data available for Ward{" "}
                  {normalizedWard}.
                </span>

              </div>

            </div>
          )}

        {/* =================================================
            ROUTE INFO
        ================================================= */}

        {selectedView === "route" &&
          routes.length > 0 && (
            <div
              className="
                absolute
                left-5
                bottom-5
                z-[1000]
                px-5
                py-4
                rounded-[16px]
                bg-white
                border
                border-slate-200
                shadow-[0_8px_25px_rgba(15,23,42,0.10)]
              "
            >

              <div className="flex items-center gap-5">

                {/* VEHICLES */}

                <div className="flex items-center gap-2">

                  <Truck
                    size={18}
                    className="text-slate-500"
                  />

                  <span className="text-[13px] font-semibold text-slate-700">
                    {routes.length}{" "}
                    {routes.length === 1
                      ? "Vehicle"
                      : "Vehicles"}
                  </span>

                </div>

                {/* GPS */}

                <div className="text-[13px] font-medium text-slate-500">
                  {totalGpsPoints.toLocaleString()} GPS
                  points
                </div>

              </div>

            </div>
          )}

      </div>

    </section>
  );
}