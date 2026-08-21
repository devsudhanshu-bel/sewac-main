import { useEffect, useMemo, useRef, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  ZoomControl,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import { Route, Loader2 } from "lucide-react";

/* ===========================================================
   CUSTOM TRUCK ICON
=========================================================== */

const createTruckIcon = (color) =>
  new L.DivIcon({
    className: "",
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -17],

    html: `
      <div
        style="
          width:38px;
          height:38px;
          border-radius:50%;
          background:${color};
          display:flex;
          align-items:center;
          justify-content:center;
          border:3px solid white;
          box-shadow:0 6px 16px rgba(0,0,0,.18);
          color:white;
          font-size:16px;
        "
      >
        🚛
      </div>
    `,
  });

const activeTruckIcon = createTruckIcon("#16C47F");
const inactiveTruckIcon = createTruckIcon("#9CA3AF");

/* ===========================================================
   DEPOT ICON
=========================================================== */

const depotIcon = new L.DivIcon({
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 16],

  html: `
    <div
      style="
        width:32px;
        height:32px;
        border-radius:9px;
        background:#111827;
        color:white;
        display:flex;
        justify-content:center;
        align-items:center;
        border:2px solid white;
        box-shadow:0 6px 16px rgba(0,0,0,.18);
        font-size:15px;
      "
    >
      🏭
    </div>
  `,
});

/* ===========================================================
   COLLECTION POINT ICON
=========================================================== */

const collectionIcon = new L.DivIcon({
  className: "",
  iconSize: [16, 16],
  iconAnchor: [8, 8],

  html: `
    <div
      style="
        width:16px;
        height:16px;
        border-radius:50%;
        background:#16C47F;
        border:3px solid white;
        box-shadow:0 4px 9px rgba(0,0,0,.18);
      "
    ></div>
  `,
});

/* ===========================================================
   DUMMY VEHICLES
=========================================================== */

const vehicles = [
  {
    id: "KA-01-AB-1024",
    driver: "Ramesh",
    status: "active",
    color: "#6C2BFF",
    start: [12.9716, 77.5946],
    end: [12.9442, 77.6208],
  },

  {
    id: "KA-01-CD-7812",
    driver: "Suresh",
    status: "active",
    color: "#2563EB",
    start: [12.9586, 77.6061],
    end: [12.9791, 77.6513],
  },

  {
    id: "KA-01-EF-6328",
    driver: "Arun",
    status: "active",
    color: "#16C47F",
    start: [12.9514, 77.5654],
    end: [12.9311, 77.6032],
  },

  {
    id: "KA-01-GH-2245",
    driver: "Mahesh",
    status: "inactive",
    color: "#EF4444",
    start: [12.9643, 77.6335],
    end: [12.9212, 77.6735],
  },
];

/* ===========================================================
   DEPOT
=========================================================== */

const depot = [12.9568, 77.5961];

/* ===========================================================
   COLLECTION POINTS
=========================================================== */

const collectionPoints = [
  [12.9654, 77.6035],
  [12.9512, 77.6154],
  [12.9432, 77.5904],
  [12.9723, 77.6284],
  [12.9844, 77.6471],
];

/* ===========================================================
   FIT BOUNDS
=========================================================== */

function FitBounds({ routes }) {
  const map = useMap();

  useEffect(() => {
    if (!routes.length) return;

    const bounds = [];

    routes.forEach((route) => {
      route.geometry.forEach(([lng, lat]) => {
        bounds.push([lat, lng]);
      });
    });

    if (bounds.length) {
      map.fitBounds(bounds, {
        padding: [40, 40],
      });
    }
  }, [map, routes]);

  return null;
}

/* ===========================================================
   COMPONENT
=========================================================== */

export default function VehicleRouteMap() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isMounted = useRef(true);

  /* ===========================================================
     MOUNT / UNMOUNT
  =========================================================== */

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  /* ===========================================================
     FETCH OSRM ROUTES
  =========================================================== */

  useEffect(() => {
    async function fetchRoutes() {
      try {
        setLoading(true);

        const result = await Promise.all(
          vehicles.map(async (vehicle) => {
            const response = await fetch(
              `https://router.project-osrm.org/route/v1/driving/${vehicle.start[1]},${vehicle.start[0]};${vehicle.end[1]},${vehicle.end[0]}?overview=full&geometries=geojson`,
            );

            if (!response.ok) {
              throw new Error(
                `OSRM request failed: ${response.status}`,
              );
            }

            const data = await response.json();

            return {
              ...vehicle,
              geometry:
                data.routes?.[0]?.geometry?.coordinates ?? [],
              distance:
                data.routes?.[0]?.distance ?? 0,
              duration:
                data.routes?.[0]?.duration ?? 0,
            };
          }),
        );

        if (isMounted.current) {
          setRoutes(result);
          setError(null);
        }
      } catch (err) {
        console.error(err);

        if (isMounted.current) {
          setError("Failed to fetch OSRM routes.");
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    }

    fetchRoutes();
  }, []);

  /* ===========================================================
     ACTIVE VEHICLES
  =========================================================== */

  const activeVehicles = useMemo(
    () =>
      routes.filter(
        (vehicle) => vehicle.status === "active",
      ),
    [routes],
  );

  /* ===========================================================
     INACTIVE VEHICLES
  =========================================================== */

  const inactiveVehicles = useMemo(
    () =>
      routes.filter(
        (vehicle) => vehicle.status === "inactive",
      ),
    [routes],
  );

  /* ===========================================================
     TOTAL DISTANCE
  =========================================================== */

  const totalDistance = useMemo(() => {
    return routes.reduce(
      (sum, vehicle) => sum + vehicle.distance,
      0,
    );
  }, [routes]);

  /* ===========================================================
     TOTAL DURATION
  =========================================================== */

  const totalDuration = useMemo(() => {
    return routes.reduce(
      (sum, vehicle) => sum + vehicle.duration,
      0,
    );
  }, [routes]);

  /* ===========================================================
     FORMAT DISTANCE
  =========================================================== */

  const formatDistance = (meters) =>
    `${(meters / 1000).toFixed(1)} km`;

  /* ===========================================================
     FORMAT DURATION
  =========================================================== */

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);

    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }

    return `${mins} min`;
  };

  /* ===========================================================
     RENDER
  =========================================================== */

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
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-4
          border-b
          border-[#EEF2F7]
          bg-white
        "
      >
        {/* ================= LEFT ================= */}

        <div className="flex items-center gap-3 min-w-0">
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
            <Route
              size={20}
              strokeWidth={2.2}
              className="text-[#6C2BFF]"
            />
          </div>

          <div className="min-w-0">
            <h2
              className="
                text-[17px]
                sm:text-[18px]
                font-semibold
                text-[#111827]
                leading-tight
              "
            >
              Vehicle Route Map
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
              Real-time Fleet Tracking using OpenStreetMap & OSRM
            </p>
          </div>
        </div>

        {/* ================= RIGHT ================= */}

        <div
          className="
            flex
            items-center
            gap-2
            flex-wrap
            sm:justify-end
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
              {routes.length} Vehicles
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
      </div>

      {/* =====================================================
          MAP
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
        <MapContainer
          center={[12.9716, 77.5946]}
          zoom={12}
          zoomControl={false}
          className="w-full h-full"
        >
          <ZoomControl position="topleft" />

          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          <FitBounds routes={routes} />

          {/* =================================================
              DEPOT
          ================================================= */}

          <Marker
            position={depot}
            icon={depotIcon}
          >
            <Popup>
              <div className="space-y-2 min-w-[190px]">
                <h3 className="font-semibold text-sm">
                  BBMP Depot
                </h3>

                <div className="flex justify-between text-sm">
                  <span>Status</span>

                  <span className="font-semibold text-green-600">
                    Operational
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Total Vehicles</span>

                  <span className="font-semibold">
                    {routes.length}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>

          {/* =================================================
              COLLECTION POINTS
          ================================================= */}

          {collectionPoints.map((point, index) => (
            <Marker
              key={index}
              position={point}
              icon={collectionIcon}
            >
              <Popup>
                <div className="min-w-[160px]">
                  <h3 className="font-semibold text-sm">
                    Collection Point {index + 1}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Waste Collection Zone
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* =================================================
              VEHICLE MARKERS
          ================================================= */}

          {routes.map((vehicle) => {
            if (!vehicle.geometry.length) return null;

            const current = vehicle.geometry[0];

            return (
              <Marker
                key={vehicle.id}
                position={[
                  current[1],
                  current[0],
                ]}
                icon={
                  vehicle.status === "active"
                    ? activeTruckIcon
                    : inactiveTruckIcon
                }
              >
                <Popup>
                  <div className="space-y-2 min-w-[210px]">
                    <h3 className="text-sm font-semibold">
                      {vehicle.id}
                    </h3>

                    <div className="flex justify-between text-sm">
                      <span>Driver</span>

                      <span className="font-medium">
                        {vehicle.driver}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Status</span>

                      <span
                        className={`font-semibold ${
                          vehicle.status === "active"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {vehicle.status}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Distance</span>

                      <span className="font-medium">
                        {formatDistance(
                          vehicle.distance,
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>ETA</span>

                      <span className="font-medium">
                        {formatDuration(
                          vehicle.duration,
                        )}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* =================================================
              ROUTE POLYLINES
          ================================================= */}

          {routes.map((vehicle) => {
            if (!vehicle.geometry.length) return null;

            return (
              <Polyline
                key={vehicle.id}
                positions={vehicle.geometry.map(
                  ([lng, lat]) => [lat, lng],
                )}
                pathOptions={{
                  color: vehicle.color,
                  weight: 5,
                  opacity: 0.95,
                  lineCap: "round",
                  lineJoin: "round",
                }}
              >
                <Popup>
                  <div className="min-w-[210px]">
                    <h3 className="font-semibold text-sm mb-3">
                      {vehicle.id} Route
                    </h3>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          Driver
                        </span>

                        <span className="font-medium">
                          {vehicle.driver}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          Route Distance
                        </span>

                        <span className="font-semibold">
                          {formatDistance(
                            vehicle.distance,
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          Estimated Time
                        </span>

                        <span className="font-semibold">
                          {formatDuration(
                            vehicle.duration,
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          Vehicle Status
                        </span>

                        <span
                          className={`font-semibold ${
                            vehicle.status === "active"
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {vehicle.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Polyline>
            );
          })}
        </MapContainer>

        {/* ===================================================
            LOADING
        =================================================== */}

        {loading && (
          <div
            className="
              absolute
              inset-0
              bg-white/80
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
              className="animate-spin text-[#6C2BFF]"
            />

            <h3 className="mt-4 text-base font-semibold text-[#111827]">
              Loading Routes
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              Fetching routes from OSRM...
            </p>
          </div>
        )}

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div
            className="
              absolute
              inset-0
              bg-white
              flex
              items-center
              justify-center
              z-[1000]
              px-5
            "
          >
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-600">
                Failed to Load Routes
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* ===================================================
            MAP LEGEND
        =================================================== */}

        <div
          className="
            absolute
            top-4
            right-4
            sm:top-5
            sm:right-5
            z-[999]
            w-[190px]
            sm:w-[210px]
            rounded-2xl
            bg-white
            border
            border-[#ECECF3]
            shadow-lg
            p-4
            sm:p-5
          "
        >
          <h3 className="text-sm font-semibold text-[#111827] mb-4">
            Map Legend
          </h3>

          <div className="space-y-3">
            {/* ACTIVE */}

            <div className="flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 rounded-full bg-[#16C47F] shrink-0" />

              <span className="text-xs text-[#111827]">
                Active Vehicle
              </span>
            </div>

            {/* INACTIVE */}

            <div className="flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 rounded-full bg-[#9CA3AF] shrink-0" />

              <span className="text-xs text-[#111827]">
                Inactive Vehicle
              </span>
            </div>

            {/* ROUTE */}

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-1 rounded-full bg-[#6C2BFF] shrink-0" />

              <span className="text-xs text-[#111827]">
                Route
              </span>
            </div>

            {/* COLLECTION POINT */}

            <div className="flex items-center gap-2.5">
              <div
                className="
                  w-3.5
                  h-3.5
                  rounded-full
                  bg-[#16C47F]
                  border-2
                  border-white
                  shadow
                  shrink-0
                "
              />

              <span className="text-xs text-[#111827]">
                Collection Point
              </span>
            </div>

            {/* DEPOT */}

            <div className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-md bg-[#111827] shrink-0" />

              <span className="text-xs text-[#111827]">
                Depot
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}