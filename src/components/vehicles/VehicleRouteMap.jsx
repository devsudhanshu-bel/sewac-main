import { useEffect, useMemo, useState } from "react";

import api from "../../api/axios";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  CircleMarker,
  ZoomControl,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import {
  Route,
  Loader2,
  Factory,
  MapPinned,
  User,
  Truck,
  Radio,
} from "lucide-react";

import { useFilters } from "../../contexts/FilterContext";

import LiveMap from "./LiveMap";

import "leaflet/dist/leaflet.css";

/* ============================================================
   VEHICLE ROUTE COLORS
============================================================ */

const VEHICLE_ROUTE_COLORS = [
  "#6C2BFF",
  "#2563EB",
  "#16C47F",
  "#EF4444",
  "#F59E0B",
  "#DB2777",
  "#0891B2",
  "#7C3AED",
  "#EA580C",
  "#65A30D",
];

/* ============================================================
   VEHICLE COLOR
============================================================ */

function getVehicleRouteColor(vehicleId) {
  const value = String(vehicleId || "");

  let hash = 0;

  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);

    hash |= 0;
  }

  return VEHICLE_ROUTE_COLORS[Math.abs(hash) % VEHICLE_ROUTE_COLORS.length];
}

/* ============================================================
   VEHICLE ICON
============================================================ */

function createTruckIcon(color) {
  return new L.DivIcon({
    className: "sewac-route-vehicle-marker",

    iconSize: [42, 42],

    iconAnchor: [21, 21],

    popupAnchor: [0, -21],

    html: `
      <div
        style="
          width:42px;
          height:42px;
          border-radius:50%;
          background:${color};
          display:flex;
          align-items:center;
          justify-content:center;
          border:3px solid white;
          box-shadow:
            0 6px 18px
            rgba(0,0,0,.25);
          font-size:18px;
        "
      >
        🚛
      </div>
    `,
  });
}

/* ============================================================
   PLANT ICON
============================================================ */

const plantIcon = new L.DivIcon({
  className: "sewac-plant-marker",

  iconSize: [40, 40],

  iconAnchor: [20, 20],

  popupAnchor: [0, -20],

  html: `
      <div
        style="
          width:40px;
          height:40px;
          border-radius:12px;
          background:#111827;
          display:flex;
          align-items:center;
          justify-content:center;
          border:3px solid white;
          box-shadow:
            0 6px 18px
            rgba(0,0,0,.25);
          font-size:19px;
        "
      >
        🏭
      </div>
    `,
});

/* ============================================================
   GPS POINT NORMALIZER
============================================================ */

function normalizeGpsPoint(point) {
  if (!point) {
    return null;
  }

  /*
   * Backend:
   *
   * latitude
   * longitude
   *
   * Leaflet:
   *
   * [latitude, longitude]
   */

  const latitude = Number(point.latitude ?? point.lat);

  const longitude = Number(point.longitude ?? point.lng ?? point.lon);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return null;
  }

  return [latitude, longitude];
}

/* ============================================================
   PLANT POSITION
============================================================ */

function getPlantPosition(plant) {
  if (!plant) {
    return null;
  }

  const latitude = Number(plant.latitude ?? plant.lat);

  const longitude = Number(plant.longitude ?? plant.lng ?? plant.lon);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return null;
  }

  return [latitude, longitude];
}

/* ============================================================
   VEHICLE ID
============================================================ */

function getVehicleId(vehicle) {
  return (
    vehicle?.vehicleNumber ||
    vehicle?.vehicle_number ||
    vehicle?.vehicleId ||
    vehicle?.vehicle_id ||
    vehicle?.id ||
    vehicle?.heartbeatTableName ||
    "UNKNOWN"
  );
}

/* ============================================================
   MAP BOUNDS
============================================================ */

function FitVehicleAndPlantBounds({ routes, plants }) {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds([]);

    let hasCoordinates = false;

    /* ========================================================
       VEHICLE ROUTES
    ======================================================== */

    routes.forEach((vehicle) => {
      if (!Array.isArray(vehicle._points)) {
        return;
      }

      vehicle._points.forEach((point) => {
        if (!point) {
          return;
        }

        bounds.extend(point);

        hasCoordinates = true;
      });
    });

    /* ========================================================
       PLANTS
    ======================================================== */

    plants.forEach((plant) => {
      const position = getPlantPosition(plant);

      if (!position) {
        return;
      }

      bounds.extend(position);

      hasCoordinates = true;
    });

    /* ========================================================
       FIT
    ======================================================== */

    if (hasCoordinates && bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [60, 60],

        maxZoom: 15,

        animate: false,
      });
    }
  }, [map, routes, plants]);

  return null;
}

/* ============================================================
   MAP SIZE CONTROLLER
============================================================ */

function MapSizeController() {
  const map = useMap();

  useEffect(() => {
    const timers = [
      setTimeout(() => map.invalidateSize(), 100),

      setTimeout(() => map.invalidateSize(), 400),

      setTimeout(() => map.invalidateSize(), 800),
    ];

    const handleResize = () => {
      map.invalidateSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      timers.forEach(clearTimeout);

      window.removeEventListener("resize", handleResize);
    };
  }, [map]);

  return null;
}

/* ============================================================
   DISTANCE
============================================================ */

function formatDistance(meters) {
  if (!Number.isFinite(Number(meters))) {
    return "0.0 km";
  }

  return `${(Number(meters) / 1000).toFixed(1)} km`;
}

/* ============================================================
   DURATION
============================================================ */

function formatDuration(seconds) {
  if (!Number.isFinite(Number(seconds))) {
    return "N/A";
  }

  const hrs = Math.floor(Number(seconds) / 3600);

  const mins = Math.floor((Number(seconds) % 3600) / 60);

  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }

  return `${mins} min`;
}

/* ============================================================
   VEHICLE ROUTE MAP
============================================================ */

export default function VehicleRouteMap({ selectedDate }) {
  /* ==========================================================
     HEADER FILTER CONTEXT
  ========================================================== */

  const { selectedCity, selectedZone, selectedDivision, selectedWard } =
    useFilters();

  /* ==========================================================
     MAP MODE
     
     route = historical route map
     live  = socket.io live map
  ========================================================== */

  const [mapMode, setMapMode] = useState("route");

  /* ==========================================================
     ROUTES
  ========================================================== */

  const [routes, setRoutes] = useState([]);

  /* ==========================================================
     PLANTS
  ========================================================== */

  const [plants, setPlants] = useState([]);

  /* ==========================================================
     LOADING
  ========================================================== */

  const [loading, setLoading] = useState(true);

  /* ==========================================================
     ERROR
  ========================================================== */

  const [error, setError] = useState("");

  /* ==========================================================
     FETCH ROUTES + PLANTS
     
     THIS REMAINS THE SAME EXISTING API FLOW.
  ========================================================== */

  useEffect(() => {
    let mounted = true;

    const fetchMapData = async () => {
      /*
       * ------------------------------------------------------
       * WAIT FOR FILTER CASCADE
       * ------------------------------------------------------
       */

      if (
        !selectedCity ||
        !selectedZone ||
        !selectedDivision ||
        !selectedWard
      ) {
        if (mounted) {
          setRoutes([]);

          setPlants([]);

          setLoading(false);
        }

        return;
      }

      try {
        setLoading(true);

        setError("");

        /* ==================================================
             FILTER IDS
          ================================================== */

        const cityId =
          selectedCity.city_id ?? selectedCity.cityId ?? selectedCity.id;

        const zoneId =
          selectedZone.zone_id ?? selectedZone.zoneId ?? selectedZone.id;

        const divisionId =
          selectedDivision.division_id ??
          selectedDivision.divisionId ??
          selectedDivision.id;

        const wardId =
          selectedWard.ward_id ?? selectedWard.wardId ?? selectedWard.id;

        /* ==================================================
             QUERY
          ================================================== */

        const params = new URLSearchParams();

        params.set("date", selectedDate);

        params.set("cityId", String(cityId));

        params.set("zoneId", String(zoneId));

        params.set("divisionId", String(divisionId));

        params.set("wardId", String(wardId));

        const queryString = params.toString();

        console.log("=================================================");

        console.log("VEHICLE ROUTE MAP REQUEST");

        console.log("Date:", selectedDate);

        console.log("City:", cityId);

        console.log("Zone:", zoneId);

        console.log("Division:", divisionId);

        console.log("Ward:", wardId);

        console.log("Query:", queryString);

        console.log("=================================================");

        /* ==================================================
             EXISTING ROUTE MAP API
          ================================================== */

        const routeRequest = api.get(`/api/admin/overview/map?${queryString}`);

        /* ==================================================
             EXISTING PLANT LOCATION API
          ================================================== */

        const plantRequest = api.get("/api/plants/locations");

        const [routeResponse, plantResponse] = await Promise.all([
          routeRequest,
          plantRequest,
        ]);

        if (!mounted) {
          return;
        }

        /* ==================================================
             ROUTE RESPONSE
          ================================================== */

        const routeData = routeResponse?.data?.data || {};

        const returnedRoutes = Array.isArray(routeData.routes)
          ? routeData.routes
          : [];

        /* ==================================================
             PLANT RESPONSE
          ================================================== */

        const plantData = plantResponse?.data?.data;

        const returnedPlants = Array.isArray(plantData)
          ? plantData
          : Array.isArray(plantData?.plants)
            ? plantData.plants
            : [];

        /* ==================================================
             STORE
          ================================================== */

        setRoutes(returnedRoutes);

        setPlants(returnedPlants);

        console.log("VEHICLE ROUTE MAP RESPONSE:", routeData);

        console.log("ROUTES FOUND:", returnedRoutes.length);

        console.log("PLANTS FOUND:", returnedPlants.length);
      } catch (err) {
        if (!mounted) {
          return;
        }

        console.error("Vehicle Route Map Error:", err);

        setRoutes([]);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load vehicle route data.",
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchMapData();

    return () => {
      mounted = false;
    };
  }, [
    selectedDate,

    selectedCity?.city_id,

    selectedCity?.cityId,

    selectedCity?.id,

    selectedZone?.zone_id,

    selectedZone?.zoneId,

    selectedZone?.id,

    selectedDivision?.division_id,

    selectedDivision?.divisionId,

    selectedDivision?.id,

    selectedWard?.ward_id,

    selectedWard?.wardId,

    selectedWard?.id,
  ]);

  /* ==========================================================
     PREPARE ROUTES
  ========================================================== */

  const preparedRoutes = useMemo(() => {
    return routes
      .map((vehicle, index) => {
        const vehicleId = getVehicleId(vehicle);

        const points = Array.isArray(vehicle.points)
          ? vehicle.points.map(normalizeGpsPoint).filter(Boolean)
          : [];

        return {
          ...vehicle,

          _vehicleId: vehicleId,

          _routeColor: getVehicleRouteColor(vehicleId),

          _points: points,

          _index: index,
        };
      })
      .filter((vehicle) => vehicle._points.length > 0);
  }, [routes]);

  /* ==========================================================
     ACTIVE VEHICLES
  ========================================================== */

  const activeVehicles = useMemo(
    () =>
      preparedRoutes.filter(
        (vehicle) => String(vehicle.status ?? "").toLowerCase() === "active",
      ),
    [preparedRoutes],
  );

  /* ==========================================================
     TOTAL DISTANCE
  ========================================================== */

  const totalDistance = useMemo(
    () =>
      preparedRoutes.reduce(
        (sum, vehicle) => sum + Number(vehicle.distance || 0),
        0,
      ),
    [preparedRoutes],
  );

  /* ==========================================================
     VALID PLANTS
  ========================================================== */

  const validPlants = useMemo(
    () =>
      Array.isArray(plants)
        ? plants.filter((plant) => Boolean(getPlantPosition(plant)))
        : [],
    [plants],
  );

  /* ==========================================================
     DEFAULT CENTER
  ========================================================== */

  const defaultCenter = useMemo(() => {
    for (const vehicle of preparedRoutes) {
      if (vehicle._points.length > 0) {
        return vehicle._points[0];
      }
    }

    for (const plant of validPlants) {
      const position = getPlantPosition(plant);

      if (position) {
        return position;
      }
    }

    return [12.9716, 77.5946];
  }, [preparedRoutes, validPlants]);

  /* ==========================================================
     MAP DATA FOR LIVE MAP
     
     We deliberately pass the already-fetched route data
     into LiveMap so it can use the latest historical point
     as its initial position before Socket.IO updates arrive.
  ========================================================== */

  const liveMapData = useMemo(
    () => ({
      routes: preparedRoutes.map((route) => ({
        ...route,

        /*
         * LiveMap expects the original backend point
         * objects here, not Leaflet [lat,lng] arrays.
         */
        points: Array.isArray(route.points) ? route.points : [],

        endPoint:
          route.endPoint ||
          (Array.isArray(route.points)
            ? route.points[route.points.length - 1]
            : null),
      })),

      totalVehicles: preparedRoutes.length,

      totalRoutePoints: preparedRoutes.reduce(
        (total, route) => total + Number(route.points?.length || 0),
        0,
      ),
    }),
    [preparedRoutes],
  );

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <section
      className="
        mt-4
        bg-white
        rounded-[24px]
        border
        border-[#ECECF3]
        shadow-sm
        overflow-hidden
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          min-h-[74px]
          px-5
          sm:px-6
          lg:px-7
          py-4
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-4
          border-b
          border-[#EEF2F7]
          bg-white
        "
      >
        {/* ===================================================
            TITLE
        =================================================== */}

        <div
          className="
            flex
            items-center
            gap-3
            min-w-0
          "
        >
          <div
            className="
              w-10
              h-10
              sm:w-11
              sm:h-11
              shrink-0
              rounded-xl
              bg-[#F4EEFF]
              flex
              items-center
              justify-center
            "
          >
            {mapMode === "live" ? (
              <Radio
                size={20}
                strokeWidth={2.2}
                className="
                  text-[#16A34A]
                "
              />
            ) : (
              <Route
                size={20}
                strokeWidth={2.2}
                className="
                  text-[#6C2BFF]
                "
              />
            )}
          </div>

          <div
            className="
              min-w-0
            "
          >
            <h2
              className="
                text-[17px]
                sm:text-[18px]
                font-semibold
                text-[#111827]
                leading-tight
              "
            >
              {mapMode === "live" ? "Live Vehicle Map" : "Vehicle Route Map"}
            </h2>

            <p
              className="
                text-[11px]
                sm:text-[12px]
                text-[#6B7280]
                mt-1
                truncate
              "
            >
              {mapMode === "live"
                ? "Real-time vehicle tracking"
                : "Vehicle routes and plant locations"}
            </p>
          </div>
        </div>

        {/* ===================================================
            MAP MODE SWITCH
        =================================================== */}

        <div
          className="
            flex
            items-center
            gap-1
            p-1
            rounded-xl
            bg-[#F3F4F6]
            border
            border-[#E5E7EB]
            shrink-0
          "
        >
          {/* ROUTE MAP */}

          <button
            type="button"
            onClick={() => setMapMode("route")}
            className={`
              flex
              items-center
              justify-center
              gap-2
              px-4
              sm:px-5
              py-2
              rounded-lg
              text-xs
              sm:text-sm
              font-semibold
              transition-all
              duration-200
              ${
                mapMode === "route"
                  ? `
                    bg-white
                    text-[#6C2BFF]
                    shadow-sm
                  `
                  : `
                    text-[#64748B]
                    hover:text-[#34475B]
                  `
              }
            `}
          >
            <Route size={16} strokeWidth={2.2} />

            <span>Route Map</span>
          </button>

          {/* LIVE MAP */}

          <button
            type="button"
            onClick={() => setMapMode("live")}
            className={`
              flex
              items-center
              justify-center
              gap-2
              px-4
              sm:px-5
              py-2
              rounded-lg
              text-xs
              sm:text-sm
              font-semibold
              transition-all
              duration-200
              ${
                mapMode === "live"
                  ? `
                    bg-white
                    text-[#16A34A]
                    shadow-sm
                  `
                  : `
                    text-[#64748B]
                    hover:text-[#34475B]
                  `
              }
            `}
          >
            <span
              className={`
                relative
                flex
                items-center
                justify-center
                w-4
                h-4
              `}
            >
              <span
                className={`
                  absolute
                  w-2.5
                  h-2.5
                  rounded-full
                  ${mapMode === "live" ? "bg-[#16A34A]" : "bg-[#94A3B8]"}
                `}
              />

              {mapMode === "live" && (
                <span
                  className="
                    absolute
                    w-4
                    h-4
                    rounded-full
                    bg-[#16A34A]/20
                    animate-ping
                  "
                />
              )}
            </span>

            <span>Live Map</span>
          </button>
        </div>

        {/* ===================================================
            ROUTE MODE STATS
        =================================================== */}

        {mapMode === "route" && (
          <div
            className="
              flex
              items-center
              gap-2
              flex-wrap
              lg:justify-end
            "
          >
            {/* VEHICLES */}

            <div
              className="
                px-3
                sm:px-4
                py-1.5
                rounded-full
                bg-[#EEF4FF]
              "
            >
              <span
                className="
                  text-[11px]
                  sm:text-xs
                  font-semibold
                  text-[#2563EB]
                  whitespace-nowrap
                "
              >
                {preparedRoutes.length} Vehicles
              </span>
            </div>

            {/* ACTIVE */}

            <div
              className="
                px-3
                sm:px-4
                py-1.5
                rounded-full
                bg-[#ECFDF3]
              "
            >
              <span
                className="
                  text-[11px]
                  sm:text-xs
                  font-semibold
                  text-[#16A34A]
                  whitespace-nowrap
                "
              >
                {activeVehicles.length} Active
              </span>
            </div>

            {/* PLANTS */}

            <div
              className="
                px-3
                sm:px-4
                py-1.5
                rounded-full
                bg-[#F3F4F6]
              "
            >
              <span
                className="
                  text-[11px]
                  sm:text-xs
                  font-semibold
                  text-[#374151]
                  whitespace-nowrap
                "
              >
                {validPlants.length} Plants
              </span>
            </div>

            {/* DISTANCE */}

            <div
              className="
                px-3
                sm:px-4
                py-1.5
                rounded-full
                bg-[#FEF3C7]
              "
            >
              <span
                className="
                  text-[11px]
                  sm:text-xs
                  font-semibold
                  text-[#D97706]
                  whitespace-nowrap
                "
              >
                {formatDistance(totalDistance)}
              </span>
            </div>
          </div>
        )}

        {/* ===================================================
            LIVE MODE STATUS
        =================================================== */}

        {mapMode === "live" && (
          <div
            className="
              flex
              items-center
              gap-2
              px-3
              sm:px-4
              py-1.5
              rounded-full
              bg-[#ECFDF3]
              border
              border-[#BBF7D0]
            "
          >
            <span
              className="
                relative
                flex
                w-2.5
                h-2.5
              "
            >
              <span
                className="
                  absolute
                  inline-flex
                  w-full
                  h-full
                  rounded-full
                  bg-[#22C55E]
                  opacity-75
                  animate-ping
                "
              />

              <span
                className="
                  relative
                  inline-flex
                  w-2.5
                  h-2.5
                  rounded-full
                  bg-[#16A34A]
                "
              />
            </span>

            <span
              className="
                text-[11px]
                sm:text-xs
                font-semibold
                text-[#15803D]
                whitespace-nowrap
              "
            >
              LIVE TRACKING
            </span>
          </div>
        )}
      </div>

      {/* =====================================================
          MAP CONTENT
      ===================================================== */}

      <div
        className="
          relative
          h-[430px]
          sm:h-[480px]
          md:h-[520px]
          lg:h-[560px]
          xl:h-[580px]
        "
      >
        {/* ===================================================
            LIVE MAP
        =================================================== */}

        {mapMode === "live" && (
          <div
            className="
              absolute
              inset-0
            "
          >
            <LiveMap
              mapData={liveMapData}
              selectedDate={selectedDate}
              selectedCity={selectedCity}
              selectedZone={selectedZone}
              selectedDivision={selectedDivision}
              selectedWard={selectedWard}
            />
          </div>
        )}

        {/* ===================================================
            ROUTE MAP
        =================================================== */}

        {mapMode === "route" && (
          <>
            <MapContainer
              center={defaultCenter}
              zoom={12}
              zoomControl={false}
              scrollWheelZoom
              className="
                w-full
                h-full
              "
            >
              <ZoomControl position="topleft" />

              <TileLayer
                attribution="&copy; OpenStreetMap contributors &copy; CARTO"
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                maxZoom={20}
              />

              <MapSizeController />

              <FitVehicleAndPlantBounds
                routes={preparedRoutes}
                plants={validPlants}
              />

              {/* ==================================================
                  PLANT LOCATIONS
              ================================================== */}

              {validPlants.map((plant, index) => {
                const position = getPlantPosition(plant);

                if (!position) {
                  return null;
                }

                const plantId = plant.id ?? plant.plant_id ?? index;

                return (
                  <Marker
                    key={`plant-${plantId}`}
                    position={position}
                    icon={plantIcon}
                  >
                    <Popup maxWidth={300} minWidth={240}>
                      <div className="p-1 sm:p-2">
                        <div
                          className="
                              flex
                              items-center
                              gap-3
                              mb-4
                            "
                        >
                          <div
                            className="
                                w-11
                                h-11
                                rounded-xl
                                bg-violet-100
                                flex
                                items-center
                                justify-center
                                shrink-0
                              "
                          >
                            <Factory size={23} className="text-violet-600" />
                          </div>

                          <div
                            className="
                                min-w-0
                              "
                          >
                            <h3
                              className="
                                  font-bold
                                  text-[15px]
                                  text-gray-900
                                "
                            >
                              {plant.plant_name ?? plant.name ?? "Plant"}
                            </h3>

                            {plant.status && (
                              <span
                                className={`
                                    text-xs
                                    font-semibold
                                    ${
                                      String(plant.status).toUpperCase() ===
                                      "ACTIVE"
                                        ? "text-green-600"
                                        : "text-red-500"
                                    }
                                  `}
                              >
                                ● {plant.status}
                              </span>
                            )}
                          </div>
                        </div>

                        <div
                          className="
                              space-y-3
                              text-[13px]
                            "
                        >
                          {plant.zone && (
                            <div
                              className="
                                  flex
                                  items-start
                                  gap-2
                                "
                            >
                              <MapPinned
                                size={15}
                                className="
                                    text-violet-600
                                    mt-0.5
                                    shrink-0
                                  "
                              />

                              <span>{plant.zone}</span>
                            </div>
                          )}

                          {plant.plant_manager && (
                            <div
                              className="
                                  flex
                                  items-start
                                  gap-2
                                "
                            >
                              <User
                                size={15}
                                className="
                                    text-violet-600
                                    mt-0.5
                                    shrink-0
                                  "
                              />

                              <span>{plant.plant_manager}</span>
                            </div>
                          )}

                          {plant.capacity_ton_per_day !== undefined && (
                            <div
                              className="
                                  flex
                                  items-center
                                  gap-2
                                "
                            >
                              <Factory
                                size={15}
                                className="
                                    text-violet-600
                                    shrink-0
                                  "
                              />

                              <span>{plant.capacity_ton_per_day} Ton/Day</span>
                            </div>
                          )}

                          {plant.vehicles_enrolled !== undefined && (
                            <div
                              className="
                                  flex
                                  items-center
                                  gap-2
                                "
                            >
                              <Truck
                                size={15}
                                className="
                                    text-violet-600
                                    shrink-0
                                  "
                              />

                              <span>{plant.vehicles_enrolled} Vehicles</span>
                            </div>
                          )}

                          <div
                            className="
                                flex
                                items-start
                                gap-2
                              "
                          >
                            <MapPinned
                              size={15}
                              className="
                                  text-violet-600
                                  mt-0.5
                                  shrink-0
                                "
                            />

                            <span>
                              {position[0]}, {position[1]}
                            </span>
                          </div>
                        </div>

                        <div
                          className="
                              mt-4
                              pt-3
                              border-t
                              border-gray-200
                              text-xs
                              text-gray-400
                            "
                        >
                          Plant location
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* ==================================================
                  VEHICLE ROUTES
              ================================================== */}

              {preparedRoutes.map((vehicle) => {
                const vehicleId = vehicle._vehicleId;

                const routeColor = vehicle._routeColor;

                const positions = vehicle._points;

                if (positions.length === 0) {
                  return null;
                }

                const firstPosition = positions[0];

                const lastPosition = positions[positions.length - 1];

                return (
                  <div key={`vehicle-group-${vehicleId}`}>
                    {/* ROUTE */}

                    {positions.length > 1 && (
                      <Polyline
                        positions={positions}
                        pathOptions={{
                          color: routeColor,

                          weight: 5,

                          opacity: 0.92,

                          lineCap: "round",

                          lineJoin: "round",
                        }}
                      />
                    )}

                    {/* START */}

                    <CircleMarker
                      center={firstPosition}
                      radius={6}
                      pathOptions={{
                        color: "#FFFFFF",

                        weight: 3,

                        fillColor: routeColor,

                        fillOpacity: 1,
                      }}
                    >
                      <Popup>
                        <div
                          className="
                              min-w-[200px]
                            "
                        >
                          <div
                            className="
                                font-semibold
                                text-sm
                                mb-2
                              "
                          >
                            Route Start
                          </div>

                          <div className="text-sm">
                            Vehicle: <strong>{vehicleId}</strong>
                          </div>

                          <div
                            className="
                                mt-2
                                flex
                                items-center
                                gap-2
                              "
                          >
                            <span
                              style={{
                                display: "inline-block",

                                width: "30px",

                                height: "5px",

                                borderRadius: "999px",

                                backgroundColor: routeColor,
                              }}
                            />

                            <span
                              className="
                                  text-xs
                                  text-gray-500
                                "
                            >
                              Vehicle route
                            </span>
                          </div>
                        </div>
                      </Popup>
                    </CircleMarker>

                    {/* CURRENT / LAST */}

                    <Marker
                      position={lastPosition}
                      icon={createTruckIcon(routeColor)}
                    >
                      <Popup maxWidth={280}>
                        <div
                          className="
                              min-w-[220px]
                              text-sm
                            "
                        >
                          <div
                            className="
                                text-base
                                font-semibold
                                text-[#16295A]
                                mb-3
                              "
                          >
                            Vehicle Details
                          </div>

                          <div className="space-y-2">
                            <div>
                              Vehicle: <strong>{vehicleId}</strong>
                            </div>

                            <div>
                              Status:{" "}
                              <strong
                                className={
                                  String(vehicle.status ?? "").toLowerCase() ===
                                  "active"
                                    ? "text-green-600"
                                    : "text-gray-500"
                                }
                              >
                                {vehicle.status ?? "N/A"}
                              </strong>
                            </div>

                            <div>
                              Ward: <strong>{vehicle.wardNo ?? "N/A"}</strong>
                            </div>

                            <div>
                              GPS Points: <strong>{positions.length}</strong>
                            </div>

                            <div>
                              Distance:{" "}
                              <strong>
                                {formatDistance(vehicle.distance)}
                              </strong>
                            </div>

                            <div>
                              Duration:{" "}
                              <strong>
                                {formatDuration(vehicle.duration)}
                              </strong>
                            </div>

                            <div>
                              Last Update:{" "}
                              <strong>
                                {vehicle.endPoint?.timestamp
                                  ? new Date(
                                      vehicle.endPoint.timestamp,
                                    ).toLocaleString()
                                  : "N/A"}
                              </strong>
                            </div>
                          </div>

                          <div
                            className="
                                mt-3
                                pt-2
                                border-t
                                border-gray-200
                                flex
                                items-center
                                gap-2
                              "
                          >
                            <span
                              style={{
                                display: "inline-block",

                                width: "32px",

                                height: "5px",

                                borderRadius: "999px",

                                backgroundColor: routeColor,
                              }}
                            />

                            <span
                              className="
                                  text-xs
                                  text-gray-500
                                "
                            >
                              Vehicle route
                            </span>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  </div>
                );
              })}
            </MapContainer>

            {/* =================================================
                ROUTE LOADING
            ================================================= */}

            {loading && (
              <div
                className="
                  absolute
                  inset-0
                  bg-white/70
                  backdrop-blur-sm
                  flex
                  flex-col
                  items-center
                  justify-center
                  z-[1000]
                "
              >
                <Loader2
                  size={34}
                  className="
                    animate-spin
                    text-[#6C2BFF]
                  "
                />

                <h3
                  className="
                    mt-4
                    text-base
                    font-semibold
                    text-[#111827]
                  "
                >
                  Loading Vehicle Routes
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    text-gray-500
                  "
                >
                  Loading routes and plant locations...
                </p>
              </div>
            )}

            {/* =================================================
                ROUTE ERROR
            ================================================= */}

            {!loading && error && (
              <div
                className="
                    absolute
                    inset-0
                    bg-white/90
                    flex
                    items-center
                    justify-center
                    z-[1000]
                    px-5
                  "
              >
                <div
                  className="
                      text-center
                      max-w-md
                    "
                >
                  <h3
                    className="
                        text-lg
                        font-semibold
                        text-red-600
                      "
                  >
                    Failed to Load Vehicle Routes
                  </h3>

                  <p
                    className="
                        text-sm
                        text-gray-500
                        mt-2
                      "
                  >
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* =================================================
                LEGEND
            ================================================= */}

            <div
              className="
                absolute
                top-4
                right-4
                sm:top-5
                sm:right-5
                z-[999]
                w-[205px]
                rounded-2xl
                bg-white
                border
                border-[#ECECF3]
                shadow-lg
                p-4
              "
            >
              <h3
                className="
                  text-sm
                  font-semibold
                  text-[#111827]
                  mb-4
                "
              >
                Map Legend
              </h3>

              <div className="space-y-3">
                {/* PLANT */}

                <div
                  className="
                    flex
                    items-center
                    gap-2.5
                  "
                >
                  <div
                    className="
                      w-5
                      h-5
                      rounded-md
                      bg-[#111827]
                      flex
                      items-center
                      justify-center
                      text-[10px]
                    "
                  >
                    🏭
                  </div>

                  <span
                    className="
                      text-xs
                      text-[#111827]
                    "
                  >
                    Plant Location
                  </span>
                </div>

                {/* VEHICLE */}

                <div
                  className="
                    flex
                    items-center
                    gap-2.5
                  "
                >
                  <div
                    className="
                      w-5
                      h-5
                      rounded-full
                      bg-[#16C47F]
                      border-2
                      border-white
                      shadow
                      flex
                      items-center
                      justify-center
                      text-[9px]
                    "
                  >
                    🚛
                  </div>

                  <span
                    className="
                      text-xs
                      text-[#111827]
                    "
                  >
                    Vehicle
                  </span>
                </div>

                {/* ROUTE */}

                <div
                  className="
                    flex
                    items-center
                    gap-2.5
                  "
                >
                  <div
                    className="
                      w-8
                      h-1
                      rounded-full
                      bg-[#6C2BFF]
                    "
                  />

                  <span
                    className="
                      text-xs
                      text-[#111827]
                    "
                  >
                    Vehicle Route
                  </span>
                </div>

                <div className="pt-1">
                  <span
                    className="
                      text-[10px]
                      text-gray-400
                    "
                  >
                    Each vehicle has a unique route color.
                  </span>
                </div>
              </div>
            </div>

            {/* =================================================
                DATE
            ================================================= */}

            {selectedDate && (
              <div
                className="
                  absolute
                  bottom-4
                  right-4
                  z-[999]
                  rounded-xl
                  bg-white/95
                  border
                  border-[#ECECF3]
                  shadow-md
                  px-4
                  py-2
                "
              >
                <span
                  className="
                    text-xs
                    font-semibold
                    text-[#60758B]
                  "
                >
                  Date:{" "}
                  <span
                    className="
                      text-[#34475B]
                    "
                  >
                    {selectedDate}
                  </span>
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* =====================================================
          ROUTE EMPTY STATE
          
          Only shown in Route Map mode.
      ===================================================== */}

      {mapMode === "route" &&
        !loading &&
        !error &&
        preparedRoutes.length === 0 && (
          <div
            className="
              px-6
              py-10
              text-center
            "
          >
            <div
              className="
                text-base
                font-semibold
                text-[#34475B]
              "
            >
              No vehicle route data available
            </div>

            <div
              className="
                mt-1
                text-sm
                text-[#8AA1BB]
              "
            >
              No vehicle GPS route data was found for the selected date and
              filters.
            </div>
          </div>
        )}
    </section>
  );
}
