import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  GeoJSON,
  CircleMarker,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import { io } from "socket.io-client";

import "leaflet/dist/leaflet.css";

/* ============================================================
   SOCKET CONFIG
============================================================ */

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  window.location.origin;

/* ============================================================
   VEHICLE TRAIL COLORS
============================================================ */

const VEHICLE_TRAIL_COLORS = [
  "#10B981",
  "#2563EB",
  "#F59E0B",
  "#DC2626",
  "#7C3AED",
  "#DB2777",
  "#0891B2",
  "#EA580C",
  "#4F46E5",
  "#65A30D",
];

/* ============================================================
   VEHICLE COLOR
============================================================ */

function getVehicleTrailColor(vehicleId) {
  const id = String(vehicleId || "");

  let hash = 0;

  for (let i = 0; i < id.length; i += 1) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }

  return VEHICLE_TRAIL_COLORS[Math.abs(hash) % VEHICLE_TRAIL_COLORS.length];
}

/* ============================================================
   VEHICLE ICON
============================================================ */

const createVehicleIcon = (online = true) =>
  L.divIcon({
    className: "sewac-live-vehicle-marker",

    html: `
      <div
        style="
          position:relative;
          width:46px;
          height:46px;
          border-radius:50%;
          background:${online ? "#16A34A" : "#94A3B8"};
          border:4px solid #FFFFFF;
          box-shadow:0 4px 14px rgba(0,0,0,0.25);
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:21px;
        "
      >
        🚛

        ${
          online
            ? `
              <span
                style="
                  position:absolute;
                  right:-1px;
                  bottom:-1px;
                  width:12px;
                  height:12px;
                  border-radius:50%;
                  background:#22C55E;
                  border:2px solid white;
                "
              ></span>
            `
            : ""
        }
      </div>
    `,

    iconSize: [46, 46],
    iconAnchor: [23, 23],
    popupAnchor: [0, -23],
  });

/* ============================================================
   PLANT ICON
============================================================ */

const plantIcon = new L.DivIcon({
  className: "sewac-live-plant-marker",

  html: `
    <div
      style="
        width:42px;
        height:42px;
        border-radius:12px;
        background:#111827;
        display:flex;
        align-items:center;
        justify-content:center;
        border:3px solid #FFFFFF;
        box-shadow:0 6px 18px rgba(0,0,0,.25);
        font-size:19px;
      "
    >
      🏭
    </div>
  `,

  iconSize: [42, 42],
  iconAnchor: [21, 21],
  popupAnchor: [0, -21],
});

/* ============================================================
   GEOJSON PARSER
============================================================ */

function parseGeoJSON(value) {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "object") {
    return value;
  }

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  return null;
}

/* ============================================================
   GEOJSON COORDINATE HELPERS
============================================================ */

function isCoordinatePair(value) {
  return (
    Array.isArray(value) &&
    value.length >= 2 &&
    Number.isFinite(Number(value[0])) &&
    Number.isFinite(Number(value[1]))
  );
}

function normalizeCoordinatePair(pair) {
  if (!isCoordinatePair(pair)) {
    return pair;
  }

  const first = Number(pair[0]);
  const second = Number(pair[1]);

  /*
   * Boundary data may arrive as:
   * [latitude, longitude]
   *
   * GeoJSON requires:
   * [longitude, latitude]
   */

  if (Math.abs(first) <= 30 && Math.abs(second) >= 60) {
    return [second, first, ...pair.slice(2)];
  }

  return pair;
}

function normalizeCoordinates(value) {
  if (isCoordinatePair(value)) {
    return normalizeCoordinatePair(value);
  }

  if (Array.isArray(value)) {
    return value.map(normalizeCoordinates);
  }

  return value;
}

/* ============================================================
   NORMALIZE GEOJSON
============================================================ */

function normalizeGeoJSON(value) {
  const parsed = parseGeoJSON(value);

  if (!parsed) {
    return null;
  }

  if (parsed.type === "FeatureCollection") {
    return {
      ...parsed,

      features: Array.isArray(parsed.features)
        ? parsed.features.map(normalizeGeoJSON).filter(Boolean)
        : [],
    };
  }

  if (parsed.type === "Feature") {
    if (!parsed.geometry) {
      return null;
    }

    return {
      ...parsed,
      geometry: normalizeGeoJSON(parsed.geometry),
    };
  }

  if (parsed.type === "GeometryCollection") {
    return {
      ...parsed,

      geometries: Array.isArray(parsed.geometries)
        ? parsed.geometries.map(normalizeGeoJSON).filter(Boolean)
        : [],
    };
  }

  if (parsed.type && parsed.coordinates) {
    return {
      ...parsed,
      coordinates: normalizeCoordinates(parsed.coordinates),
    };
  }

  if (Array.isArray(parsed)) {
    return {
      type: "Feature",

      properties: {},

      geometry: {
        type: "Polygon",
        coordinates: normalizeCoordinates(parsed),
      },
    };
  }

  if (parsed.geometry && typeof parsed.geometry === "object") {
    return normalizeGeoJSON({
      type: "Feature",
      properties: parsed.properties || {},
      geometry: parsed.geometry,
    });
  }

  if (parsed.coordinates) {
    return {
      type: "Feature",

      properties: parsed.properties || {},

      geometry: {
        type: parsed.type || "Polygon",
        coordinates: normalizeCoordinates(parsed.coordinates),
      },
    };
  }

  return null;
}

/* ============================================================
   SELECTED BOUNDARY
============================================================ */

function getBoundary(
  selectedCity,
  selectedZone,
  selectedDivision,
  selectedWard,
) {
  const extract = (value) =>
    normalizeGeoJSON(
      value?.geoBoundary ??
        value?.geo_boundary ??
        value?.geometry ??
        value?.boundary,
    );

  if (selectedWard) {
    return extract(selectedWard);
  }

  if (selectedDivision) {
    return extract(selectedDivision);
  }

  if (selectedZone) {
    return extract(selectedZone);
  }

  if (selectedCity) {
    return extract(selectedCity);
  }

  return null;
}

/* ============================================================
   GPS POSITION
============================================================ */

function gpsPosition(latitude, longitude) {
  const lat = Number(latitude);
  const lng = Number(longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  if (lat < -90 || lat > 90) {
    return null;
  }

  if (lng < -180 || lng > 180) {
    return null;
  }

  return [lat, lng];
}

/* ============================================================
   PLANT POSITION
============================================================ */

function getPlantPosition(plant) {
  if (!plant) {
    return null;
  }

  const latitude = Number(plant.latitude ?? plant.lat ?? plant.latitute);

  const longitude = Number(
    plant.longitude ?? plant.lng ?? plant.lon ?? plant.long,
  );

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return null;
  }

  return [latitude, longitude];
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

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [map]);

  return null;
}

/* ============================================================
   BOUNDARY CONTROLLER
============================================================ */

function BoundaryController({ boundary }) {
  const map = useMap();

  useEffect(() => {
    if (!boundary) {
      return;
    }

    try {
      const layer = L.geoJSON(boundary);
      const bounds = layer.getBounds();

      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [60, 60],
          maxZoom: 14,
          animate: true,
        });
      }
    } catch (error) {
      console.warn("Live map boundary error:", error);
    }
  }, [map, boundary]);

  return null;
}

/* ============================================================
   LIVE MAP
============================================================ */

export default function LiveMap({
  mapData,

  plants,

  selectedDate,

  selectedCity,

  selectedZone,

  selectedDivision,

  selectedWard,
}) {
  /* ==========================================================
     INITIAL ROUTES
  ========================================================== */

  const initialRoutes = useMemo(
    () => (Array.isArray(mapData?.routes) ? mapData.routes : []),
    [mapData],
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
     VEHICLES
  ========================================================== */

  const [vehicles, setVehicles] = useState(() => {
    const initial = {};

    initialRoutes.forEach((route) => {
      if (!route?.vehicleNumber) {
        return;
      }

      const endpoint = route.endPoint;

      if (!endpoint) {
        return;
      }

      const position = gpsPosition(endpoint.latitude, endpoint.longitude);

      if (!position) {
        return;
      }

      const vehicleId = String(route.vehicleNumber);

      initial[vehicleId] = {
        vehicleId,

        vehicleNumber: route.vehicleNumber,

        wardNo: route.wardNo ?? null,

        latitude: position[0],

        longitude: position[1],

        startLatitude: position[0],

        startLongitude: position[1],

        targetLatitude: position[0],

        targetLongitude: position[1],

        animationStart: 0,

        animationDuration: 1500,

        online: false,

        lastUpdate: endpoint.timestamp
          ? new Date(endpoint.timestamp).getTime()
          : 0,

        routePoints: Array.isArray(route.points) ? route.points : [],
      };
    });

    return initial;
  });

  /* ==========================================================
     TOAST
  ========================================================== */

  const [toast, setToast] = useState(null);

  /* ==========================================================
     REFS
  ========================================================== */

  const vehiclesRef = useRef(vehicles);

  const socketRef = useRef(null);

  const animationRef = useRef(null);

  const toastTimerRef = useRef(null);

  const offlineTimerRef = useRef(null);

  /* ==========================================================
     VEHICLE REF
  ========================================================== */

  useEffect(() => {
    vehiclesRef.current = vehicles;
  }, [vehicles]);

  /* ==========================================================
     TOAST
  ========================================================== */

  const showToast = useCallback((title, message, type = "success") => {
    setToast({
      id: Date.now(),
      title,
      message,
      type,
    });

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  /* ==========================================================
     FILTER MATCH
  ========================================================== */

  const matchesFilters = useCallback(
    (heartbeat) => {
      if (!heartbeat) {
        return false;
      }

      if (selectedWard) {
        const selectedWardId =
          selectedWard.wardNo ??
          selectedWard.ward_no ??
          selectedWard.id ??
          selectedWard.wardId;

        if (selectedWardId !== undefined && selectedWardId !== null) {
          if (Number(heartbeat.wardNo) !== Number(selectedWardId)) {
            return false;
          }
        }
      }

      return true;
    },
    [selectedWard],
  );

  /* ==========================================================
     SMOOTH INTERPOLATION
  ========================================================== */

  const animateVehicles = useCallback(() => {
    const now = performance.now();

    setVehicles((current) => {
      let changed = false;

      const next = {
        ...current,
      };

      Object.keys(next).forEach((vehicleId) => {
        const vehicle = next[vehicleId];

        if (!vehicle) {
          return;
        }

        if (
          !Number.isFinite(vehicle.startLatitude) ||
          !Number.isFinite(vehicle.startLongitude) ||
          !Number.isFinite(vehicle.targetLatitude) ||
          !Number.isFinite(vehicle.targetLongitude)
        ) {
          return;
        }

        const startTime = vehicle.animationStart || now;

        const duration = vehicle.animationDuration || 1500;

        const elapsed = now - startTime;

        const progress = Math.min(Math.max(elapsed / duration, 0), 1);

        const eased = progress * progress * (3 - 2 * progress);

        const latitude =
          vehicle.startLatitude +
          (vehicle.targetLatitude - vehicle.startLatitude) * eased;

        const longitude =
          vehicle.startLongitude +
          (vehicle.targetLongitude - vehicle.startLongitude) * eased;

        next[vehicleId] = {
          ...vehicle,
          latitude,
          longitude,
        };

        changed = true;
      });

      return changed ? next : current;
    });

    animationRef.current = requestAnimationFrame(animateVehicles);
  }, []);

  /* ==========================================================
     START ANIMATION
  ========================================================== */

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animateVehicles);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animateVehicles]);

  /* ==========================================================
     SOCKET.IO
  ========================================================== */

  useEffect(() => {
    if (!SOCKET_URL) {
      console.error("Socket URL is not configured.");

      return undefined;
    }

    console.log("Connecting Live Maps Socket:", SOCKET_URL);

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],

      reconnection: true,

      reconnectionAttempts: Infinity,

      reconnectionDelay: 1000,

      timeout: 10000,
    });

    socketRef.current = socket;

    /* CONNECT */

    socket.on("connect", () => {
      console.log("Live Maps Socket connected:", socket.id);

      socket.emit("live:subscribe", {
        cityId: selectedCity?.cityId ?? selectedCity?.id ?? null,

        zoneId: selectedZone?.zoneId ?? selectedZone?.id ?? null,

        divisionId:
          selectedDivision?.divisionId ?? selectedDivision?.id ?? null,

        wardId: selectedWard?.wardId ?? selectedWard?.id ?? null,
      });
    });

    /* LIVE HEARTBEAT */

    socket.on("vehicle:heartbeat", (heartbeat) => {
      console.log("LIVE VEHICLE UPDATE:", heartbeat);

      if (!matchesFilters(heartbeat)) {
        return;
      }

      const vehicleId = String(
        heartbeat.vehicleId || heartbeat.vehicleNumber || "",
      ).trim();

      if (!vehicleId) {
        return;
      }

      const position = gpsPosition(heartbeat.latitude, heartbeat.longitude);

      if (!position) {
        console.warn("Invalid live GPS:", heartbeat);

        return;
      }

      const timestamp = heartbeat.timestamp
        ? new Date(heartbeat.timestamp).getTime()
        : Date.now();

      setVehicles((current) => {
        const existing = current[vehicleId];

        const currentLatitude = Number.isFinite(existing?.latitude)
          ? existing.latitude
          : position[0];

        const currentLongitude = Number.isFinite(existing?.longitude)
          ? existing.longitude
          : position[1];

        const wasOffline = !existing || !existing.online;

        if (wasOffline) {
          showToast("Vehicle Online", `${vehicleId} is now live.`, "success");
        }

        return {
          ...current,

          [vehicleId]: {
            ...(existing || {}),

            vehicleId,

            vehicleNumber: heartbeat.vehicleNumber || vehicleId,

            wardNo: heartbeat.wardNo ?? existing?.wardNo ?? null,

            latitude: currentLatitude,

            longitude: currentLongitude,

            startLatitude: currentLatitude,

            startLongitude: currentLongitude,

            targetLatitude: position[0],

            targetLongitude: position[1],

            animationStart: performance.now(),

            animationDuration: 1500,

            online: true,

            lastUpdate: timestamp,

            routePoints: existing?.routePoints || [],
          },
        };
      });
    });

    /* SOCKET ERROR */

    socket.on("connect_error", (error) => {
      console.error("Live Maps Socket connection error:", error);
    });

    /* DISCONNECT */

    socket.on("disconnect", (reason) => {
      console.warn("Live Maps Socket disconnected:", reason);
    });

    /* CLEANUP */

    return () => {
      socket.off("connect");
      socket.off("vehicle:heartbeat");
      socket.off("connect_error");
      socket.off("disconnect");

      socket.disconnect();

      socketRef.current = null;
    };
  }, [
    selectedCity,
    selectedZone,
    selectedDivision,
    selectedWard,
    matchesFilters,
    showToast,
  ]);

  /* ==========================================================
     INITIAL ROUTE DATA UPDATE
  ========================================================== */

  useEffect(() => {
    setVehicles((current) => {
      const next = {
        ...current,
      };

      initialRoutes.forEach((route) => {
        if (!route?.vehicleNumber) {
          return;
        }

        const endpoint = route.endPoint;

        if (!endpoint) {
          return;
        }

        const position = gpsPosition(endpoint.latitude, endpoint.longitude);

        if (!position) {
          return;
        }

        const vehicleId = String(route.vehicleNumber);

        const existing = next[vehicleId];

        next[vehicleId] = {
          ...(existing || {}),

          vehicleId,

          vehicleNumber: route.vehicleNumber,

          wardNo: route.wardNo ?? existing?.wardNo ?? null,

          latitude: existing?.latitude ?? position[0],

          longitude: existing?.longitude ?? position[1],

          startLatitude: existing?.startLatitude ?? position[0],

          startLongitude: existing?.startLongitude ?? position[1],

          targetLatitude: existing?.targetLatitude ?? position[0],

          targetLongitude: existing?.targetLongitude ?? position[1],

          online: existing?.online ?? false,

          lastUpdate:
            existing?.lastUpdate ??
            (endpoint.timestamp ? new Date(endpoint.timestamp).getTime() : 0),

          routePoints: Array.isArray(route.points)
            ? route.points
            : existing?.routePoints || [],
        };
      });

      return next;
    });
  }, [initialRoutes]);

  /* ==========================================================
     ONLINE / OFFLINE
  ========================================================== */

  useEffect(() => {
    offlineTimerRef.current = setInterval(() => {
      const now = Date.now();

      setVehicles((current) => {
        let changed = false;

        const next = {
          ...current,
        };

        Object.keys(next).forEach((vehicleId) => {
          const vehicle = next[vehicleId];

          if (!vehicle) {
            return;
          }

          const lastUpdate = Number(vehicle.lastUpdate || 0);

          const age = now - lastUpdate;

          const online = lastUpdate > 0 && age <= 30000;

          if (vehicle.online && !online) {
            showToast(
              "Vehicle Offline",
              `${vehicleId} has stopped sending live GPS.`,
              "warning",
            );
          }

          if (vehicle.online !== online) {
            changed = true;

            next[vehicleId] = {
              ...vehicle,
              online,
            };
          }
        });

        return changed ? next : current;
      });
    }, 5000);

    return () => {
      if (offlineTimerRef.current) {
        clearInterval(offlineTimerRef.current);
      }
    };
  }, [showToast]);

  /* ==========================================================
     TOAST CLEANUP
  ========================================================== */

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  /* ==========================================================
     SELECTED BOUNDARY
  ========================================================== */

  const selectedBoundary = useMemo(
    () =>
      getBoundary(selectedCity, selectedZone, selectedDivision, selectedWard),
    [selectedCity, selectedZone, selectedDivision, selectedWard],
  );

  /* ==========================================================
     MAP CENTER
  ========================================================== */

  const center = useMemo(() => {
    if (selectedBoundary) {
      try {
        const layer = L.geoJSON(selectedBoundary);

        const bounds = layer.getBounds();

        if (bounds.isValid()) {
          const mapCenter = bounds.getCenter();

          return [mapCenter.lat, mapCenter.lng];
        }
      } catch {
        // Continue.
      }
    }

    const firstVehicle = Object.values(vehicles)[0];

    if (firstVehicle) {
      return [firstVehicle.latitude, firstVehicle.longitude];
    }

    const firstPlant = validPlants[0];

    if (firstPlant) {
      const position = getPlantPosition(firstPlant);

      if (position) {
        return position;
      }
    }

    return [12.9716, 77.5946];
  }, [selectedBoundary, vehicles, validPlants]);

  /* ==========================================================
     VISIBLE VEHICLES
  ========================================================== */

  const visibleVehicles = useMemo(
    () =>
      Object.values(vehicles).filter((vehicle) => {
        if (selectedWard) {
          const selectedWardNo =
            selectedWard.wardNo ??
            selectedWard.ward_no ??
            selectedWard.id ??
            selectedWard.wardId;

          if (selectedWardNo !== undefined && selectedWardNo !== null) {
            if (Number(vehicle.wardNo) !== Number(selectedWardNo)) {
              return false;
            }
          }
        }

        return true;
      }),
    [vehicles, selectedWard],
  );

  /* ==========================================================
     ONLINE COUNT
  ========================================================== */

  const onlineCount = visibleVehicles.filter(
    (vehicle) => vehicle.online,
  ).length;

  /* ==========================================================
     FILTER DESCRIPTION
  ========================================================== */

  const filterDescription =
    selectedWard?.ward_name ||
    selectedWard?.wardName ||
    selectedDivision?.division_name ||
    selectedDivision?.divisionName ||
    selectedZone?.zone_name ||
    selectedZone?.zoneName ||
    selectedCity?.city_name ||
    selectedCity?.cityName ||
    "All selected areas";

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div
      className="
        relative
        h-full
        min-h-full
        w-full
        overflow-hidden
        bg-[#EEF1F3]
      "
    >
      <MapContainer
        center={center}
        zoom={14}
        zoomControl
        scrollWheelZoom
        className="
          !h-full
          !min-h-full
          !w-full
        "
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
          subdomains={["a", "b", "c", "d"]}
          maxZoom={20}
        />

        <MapSizeController />

        <BoundaryController boundary={selectedBoundary} />

        {/* ==================================================
            SELECTED BOUNDARY
        ================================================== */}

        {selectedBoundary && (
          <GeoJSON
            key={JSON.stringify(selectedBoundary)}
            data={selectedBoundary}
            style={{
              color: "#334E68",

              weight: 3,

              opacity: 1,

              fillColor: "#94A3B8",

              fillOpacity: 0.06,

              lineJoin: "round",

              lineCap: "round",
            }}
          />
        )}

        {/* ==================================================
            PLANT LOCATIONS
        ================================================== */}

        {validPlants.map((plant, index) => {
          const position = getPlantPosition(plant);

          if (!position) {
            return null;
          }

          const plantId = plant.id ?? plant.plant_id ?? plant.plantId ?? index;

          const plantName =
            plant.plant_name ?? plant.plantName ?? plant.name ?? "Plant";

          const plantStatus = plant.status ?? plant.plant_status;

          const plantZone = plant.zone ?? plant.zone_name ?? plant.zoneName;

          const plantManager =
            plant.plant_manager ?? plant.plantManager ?? plant.manager_name;

          const capacity =
            plant.capacity_ton_per_day ??
            plant.capacityTonPerDay ??
            plant.capacity;

          const enrolledVehicles =
            plant.vehicles_enrolled ?? plant.vehiclesEnrolled;

          return (
            <Marker
              key={`live-plant-${plantId}`}
              position={position}
              icon={plantIcon}
            >
              <Popup maxWidth={300} minWidth={240}>
                <div className="p-1 sm:p-2">
                  {/* HEADER */}

                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className="
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-violet-100
                        "
                    >
                      🏭
                    </div>

                    <div className="min-w-0">
                      <h3
                        className="
                            text-[15px]
                            font-bold
                            text-gray-900
                          "
                      >
                        {plantName}
                      </h3>

                      {plantStatus && (
                        <span
                          className={`
                              text-xs
                              font-semibold
                              ${
                                String(plantStatus).toUpperCase() === "ACTIVE"
                                  ? "text-green-600"
                                  : "text-red-500"
                              }
                            `}
                        >
                          ● {plantStatus}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* DETAILS */}

                  <div className="space-y-3 text-[13px]">
                    {plantZone && (
                      <div className="flex items-start gap-2">
                        <span className="text-violet-600">📍</span>

                        <span>{plantZone}</span>
                      </div>
                    )}

                    {plantManager && (
                      <div className="flex items-start gap-2">
                        <span className="text-violet-600">👤</span>

                        <span>{plantManager}</span>
                      </div>
                    )}

                    {capacity !== undefined && capacity !== null && (
                      <div className="flex items-center gap-2">
                        <span className="text-violet-600">🏭</span>

                        <span>{capacity} Ton/Day</span>
                      </div>
                    )}

                    {enrolledVehicles !== undefined &&
                      enrolledVehicles !== null && (
                        <div className="flex items-center gap-2">
                          <span className="text-violet-600">🚛</span>

                          <span>{enrolledVehicles} Vehicles</span>
                        </div>
                      )}

                    {/* COORDINATES */}

                    <div className="flex items-start gap-2">
                      <span className="text-violet-600">📍</span>

                      <span>
                        {position[0].toFixed(6)}, {position[1].toFixed(6)}
                      </span>
                    </div>
                  </div>

                  <div
                    className="
                        mt-4
                        border-t
                        border-gray-200
                        pt-3
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
            LIVE VEHICLES
        ================================================== */}

        {visibleVehicles.map((vehicle) => {
          const position = gpsPosition(vehicle.latitude, vehicle.longitude);

          if (!position) {
            return null;
          }

          const routePositions = Array.isArray(vehicle.routePoints)
            ? vehicle.routePoints
                .map((point) => gpsPosition(point.latitude, point.longitude))
                .filter(Boolean)
            : [];

          const trailColor = getVehicleTrailColor(vehicle.vehicleId);

          return (
            <React.Fragment key={vehicle.vehicleId}>
              {/* VEHICLE TRAIL */}

              {routePositions.length > 1 && (
                <Polyline
                  positions={routePositions}
                  pathOptions={{
                    color: trailColor,

                    weight: 4,

                    opacity: 0.7,

                    lineCap: "round",

                    lineJoin: "round",
                  }}
                />
              )}

              {/* VEHICLE MARKER */}

              <Marker
                position={position}
                icon={createVehicleIcon(vehicle.online)}
              >
                <Popup>
                  <div className="min-w-[230px]">
                    <div className="mb-2 text-base font-bold text-[#34475B]">
                      Live Vehicle Tracking
                    </div>

                    <div className="text-sm text-[#60758B]">
                      Vehicle:{" "}
                      <strong className="text-[#34475B]">
                        {vehicle.vehicleNumber}
                      </strong>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-sm text-[#60758B]">
                      <span
                        style={{
                          display: "inline-block",

                          width: "28px",

                          height: "4px",

                          borderRadius: "999px",

                          backgroundColor: trailColor,
                        }}
                      />

                      <span>Vehicle trail</span>
                    </div>

                    <div className="mt-1 text-sm text-[#60758B]">
                      Ward:{" "}
                      <strong className="text-[#34475B]">
                        {vehicle.wardNo ?? "N/A"}
                      </strong>
                    </div>

                    <div className="mt-1 text-sm text-[#60758B]">
                      Status:{" "}
                      <strong
                        className={
                          vehicle.online ? "text-green-600" : "text-red-500"
                        }
                      >
                        {vehicle.online ? "ONLINE" : "OFFLINE"}
                      </strong>
                    </div>

                    <div className="mt-2 border-t border-[#E5EAF0] pt-2 text-xs text-[#8AA1BB]">
                      Latitude: {Number(vehicle.latitude).toFixed(6)}
                    </div>

                    <div className="text-xs text-[#8AA1BB]">
                      Longitude: {Number(vehicle.longitude).toFixed(6)}
                    </div>

                    <div className="mt-1 text-xs text-[#8AA1BB]">
                      Last update:{" "}
                      {vehicle.lastUpdate
                        ? new Date(vehicle.lastUpdate).toLocaleTimeString()
                        : "N/A"}
                    </div>
                  </div>
                </Popup>
              </Marker>

              {/* LIVE LOCATION DOT */}

              <CircleMarker
                center={position}
                radius={4}
                pathOptions={{
                  color: "#FFFFFF",

                  weight: 2,

                  fillColor: vehicle.online ? "#22C55E" : "#94A3B8",

                  fillOpacity: 1,
                }}
              />
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* ======================================================
          LIVE HEADER
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-4
          top-4
          z-[1000]
        "
      >
        <div
          className="
            rounded-2xl
            border
            border-white/80
            bg-white/95
            px-4
            py-3
            shadow-[0_10px_30px_rgba(30,45,60,0.12)]
            backdrop-blur-xl
          "
        >
          <div className="flex items-center gap-2">
            <span
              className={`
                h-2.5
                w-2.5
                rounded-full
                ${
                  onlineCount > 0
                    ? "animate-pulse bg-green-500"
                    : "bg-slate-400"
                }
              `}
            />

            <span className="text-xs font-bold uppercase tracking-wide text-[#60758B]">
              Live Vehicle Tracking
            </span>
          </div>

          <div className="mt-1 text-sm font-semibold text-[#34475B]">
            {onlineCount} online
          </div>

          <div className="mt-1 text-xs text-[#8AA1BB]">{filterDescription}</div>

          <div className="text-xs text-[#8AA1BB]">
            {selectedDate || "Today"}
          </div>
        </div>
      </div>

      {/* ======================================================
          LIVE SUMMARY
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-4
          left-4
          z-[1000]
        "
      >
        <div
          className="
            rounded-xl
            border
            border-white/80
            bg-white/95
            px-4
            py-3
            shadow-[0_10px_30px_rgba(30,45,60,0.12)]
            backdrop-blur-xl
          "
        >
          <div className="text-[10px] font-bold uppercase tracking-wide text-[#8AA1BB]">
            LIVE
          </div>

          <div className="mt-1 text-sm font-bold text-[#34475B]">
            {visibleVehicles.length} vehicles
          </div>

          <div className="text-xs text-[#8AA1BB]">
            {onlineCount} receiving GPS
          </div>
        </div>
      </div>

      {/* ======================================================
          LIVE TOAST
      ====================================================== */}

      {toast && (
        <div
          className="
            pointer-events-none
            absolute
            right-4
            top-4
            z-[5000]
          "
        >
          <div
            className="
              min-w-[270px]
              rounded-2xl
              border
              border-white/80
              bg-white/95
              px-4
              py-3
              shadow-[0_15px_40px_rgba(30,45,60,0.16)]
              backdrop-blur-xl
            "
          >
            <div className="flex items-start gap-3">
              <div
                className={`
                  mt-0.5
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  ${toast.type === "warning" ? "bg-amber-100" : "bg-green-100"}
                `}
              >
                🚛
              </div>

              <div>
                <div className="text-sm font-bold text-[#34475B]">
                  {toast.title}
                </div>

                <div className="mt-0.5 text-xs text-[#8AA1BB]">
                  {toast.message}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          EMPTY VEHICLE STATE
      ====================================================== */}

      {visibleVehicles.length === 0 && (
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-[900]
            flex
            items-center
            justify-center
          "
        >
          <div
            className="
              rounded-2xl
              border
              border-[#DCE4EC]
              bg-white/95
              px-8
              py-6
              text-center
              shadow-lg
            "
          >
            <div className="text-base font-semibold text-[#34475B]">
              No live vehicles
            </div>

            <div className="mt-1 text-sm text-[#8AA1BB]">
              No vehicles are currently sending live GPS data for the selected
              filters.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
