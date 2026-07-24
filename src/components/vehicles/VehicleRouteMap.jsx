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

import {
  Route,
  Truck,
  Warehouse,
  MapPin,
  Loader2,
  Navigation,
} from "lucide-react";

/* ===========================================================
   CUSTOM ICONS
=========================================================== */

const createTruckIcon = (color) =>
  new L.DivIcon({
    className: "",
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -18],

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
          box-shadow:0 8px 20px rgba(0,0,0,.18);
          color:white;
          font-size:18px;
        "
      >
        🚛
      </div>
    `,
  });

const activeTruckIcon = createTruckIcon("#16C47F");
const inactiveTruckIcon = createTruckIcon("#9CA3AF");

const depotIcon = new L.DivIcon({
  className: "",
  iconSize: [34, 34],
  iconAnchor: [17, 17],

  html: `
    <div
      style="
        width:34px;
        height:34px;
        border-radius:10px;
        background:#111827;
        color:white;
        display:flex;
        justify-content:center;
        align-items:center;
        border:2px solid white;
        box-shadow:0 8px 20px rgba(0,0,0,.18);
        font-size:17px;
      "
    >
      🏭
    </div>
  `,
});

const collectionIcon = new L.DivIcon({
  className: "",
  iconSize: [18, 18],
  iconAnchor: [9, 9],

  html: `
    <div
      style="
        width:18px;
        height:18px;
        border-radius:50%;
        background:#16C47F;
        border:3px solid white;
        box-shadow:0 5px 10px rgba(0,0,0,.18);
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
        padding: [50, 50],
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
              `https://router.project-osrm.org/route/v1/driving/${vehicle.start[1]},${vehicle.start[0]};${vehicle.end[1]},${vehicle.end[0]}?overview=full&geometries=geojson`
            );

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
          })
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
     HELPERS
  =========================================================== */

  const activeVehicles = useMemo(
    () =>
      routes.filter(
        (vehicle) => vehicle.status === "active"
      ),
    [routes]
  );

  const inactiveVehicles = useMemo(
    () =>
      routes.filter(
        (vehicle) => vehicle.status === "inactive"
      ),
    [routes]
  );

  const totalDistance = useMemo(() => {
    return routes.reduce(
      (sum, vehicle) => sum + vehicle.distance,
      0
    );
  }, [routes]);

  const totalDuration = useMemo(() => {
    return routes.reduce(
      (sum, vehicle) => sum + vehicle.duration,
      0
    );
  }, [routes]);

  const formatDistance = (meters) =>
    `${(meters / 1000).toFixed(1)} km`;

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);

    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }

    return `${mins} min`;
  };

  return (    <section className="mt-8 bg-white rounded-[30px] border border-[#ECECF3] shadow-sm overflow-hidden">

      {/* ===========================================================
          HEADER
      =========================================================== */}

      <div className="flex items-center justify-between h-[84px] px-8 border-b border-[#EEF2F7] bg-white">

        {/* Left */}

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-2xl bg-[#F4EEFF] flex items-center justify-center">

            <Route
              size={22}
              className="text-[#6C2BFF]"
            />

          </div>

          <div>

            <h2 className="text-[19px] font-semibold text-[#111827]">
              Vehicle Route Map
            </h2>

            <p className="text-[13px] text-[#6B7280] mt-0.5">
              Real-time Fleet Tracking using OpenStreetMap & OSRM
            </p>

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-3">

          <div className="px-5 py-2 rounded-full bg-[#EEF4FF]">

            <span className="text-sm font-semibold text-[#2563EB]">

              {routes.length} Vehicles

            </span>

          </div>

          <div className="px-5 py-2 rounded-full bg-[#ECFDF3]">

            <span className="text-sm font-semibold text-[#16A34A]">

              {activeVehicles.length} Active

            </span>

          </div>

          <div className="px-5 py-2 rounded-full bg-[#FEF3C7]">

            <span className="text-sm font-semibold text-[#D97706]">

              {formatDistance(totalDistance)}

            </span>

          </div>

        </div>

      </div>

      {/* ===========================================================
          MAP
      =========================================================== */}

      <div className="relative h-[650px]">

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

          {/* ===========================================================
              DEPOT
          =========================================================== */}

          <Marker
            position={depot}
            icon={depotIcon}
          >
            <Popup>

              <div className="space-y-3 min-w-[220px]">

                <h3 className="font-semibold text-base">
                  BBMP Depot
                </h3>

                <div className="flex justify-between">

                  <span>Status</span>

                  <span className="font-semibold text-green-600">
                    Operational
                  </span>

                </div>

                <div className="flex justify-between">

                  <span>Total Vehicles</span>

                  <span className="font-semibold">
                    {routes.length}
                  </span>

                </div>

              </div>

            </Popup>
          </Marker>

          {/* ===========================================================
              COLLECTION POINTS
          =========================================================== */}

          {collectionPoints.map((point, index) => (

            <Marker
              key={index}
              position={point}
              icon={collectionIcon}
            >

              <Popup>

                <div className="min-w-[180px]">

                  <h3 className="font-semibold">
                    Collection Point {index + 1}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Waste Collection Zone
                  </p>

                </div>

              </Popup>

            </Marker>

          ))}

          {/* ===========================================================
              VEHICLE MARKERS
          =========================================================== */}

          {routes.map((vehicle) => {

            if (!vehicle.geometry.length) return null;

            const current =
              vehicle.geometry[0];

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

                  <div className="space-y-3 min-w-[240px]">

                    <h3 className="text-base font-semibold">
                      {vehicle.id}
                    </h3>

                    <div className="flex justify-between">

                      <span>Driver</span>

                      <span className="font-medium">
                        {vehicle.driver}
                      </span>

                    </div>

                    <div className="flex justify-between">

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

                    <div className="flex justify-between">

                      <span>Distance</span>

                      <span className="font-medium">
                        {formatDistance(vehicle.distance)}
                      </span>

                    </div>

                    <div className="flex justify-between">

                      <span>ETA</span>

                      <span className="font-medium">
                        {formatDuration(vehicle.duration)}
                      </span>

                    </div>

                  </div>

                </Popup>

              </Marker>

            );

          })}

          {/* ===========================================================
              CONTINUE PART 3
          =========================================================== */}
                    {/* ===========================================================
              ROUTE POLYLINES
          =========================================================== */}

          {routes.map((vehicle) => {

            if (!vehicle.geometry.length) return null;

            return (

              <Polyline
                key={vehicle.id}
                positions={vehicle.geometry.map(
                  ([lng, lat]) => [lat, lng]
                )}
                pathOptions={{
                  color: vehicle.color,
                  weight: 6,
                  opacity: 0.95,
                  lineCap: "round",
                  lineJoin: "round",
                }}
              >

                <Popup>

                  <div className="min-w-[230px]">

                    <h3 className="font-semibold text-base mb-4">
                      {vehicle.id} Route
                    </h3>

                    <div className="space-y-3">

                      <div className="flex justify-between">

                        <span className="text-gray-500">
                          Driver
                        </span>

                        <span className="font-medium">
                          {vehicle.driver}
                        </span>

                      </div>

                      <div className="flex justify-between">

                        <span className="text-gray-500">
                          Route Distance
                        </span>

                        <span className="font-semibold">
                          {formatDistance(vehicle.distance)}
                        </span>

                      </div>

                      <div className="flex justify-between">

                        <span className="text-gray-500">
                          Estimated Time
                        </span>

                        <span className="font-semibold">
                          {formatDuration(vehicle.duration)}
                        </span>

                      </div>

                      <div className="flex justify-between">

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

        {/* ===========================================================
            LOADING
        =========================================================== */}

        {loading && (

          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-[1000]">

            <Loader2
              size={40}
              className="animate-spin text-[#6C2BFF]"
            />

            <h3 className="mt-5 text-lg font-semibold text-[#111827]">
              Loading Routes
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Fetching routes from OSRM...
            </p>

          </div>

        )}

        {/* ===========================================================
            ERROR
        =========================================================== */}

        {error && (

          <div className="absolute inset-0 bg-white flex items-center justify-center z-[1000]">

            <div className="text-center">

              <h3 className="text-xl font-semibold text-red-600">
                Failed to Load Routes
              </h3>

              <p className="text-gray-500 mt-3">
                {error}
              </p>

            </div>

          </div>

        )}

        {/* ===========================================================
            LEGEND
        =========================================================== */}

        <div className="absolute top-6 right-6 z-[999] w-[250px] rounded-3xl bg-white border border-[#ECECF3] shadow-xl p-6">

          <h3 className="font-semibold text-[#111827] mb-5">
            Map Legend
          </h3>

          <div className="space-y-4">

            <div className="flex items-center gap-3">

              <div className="w-4 h-4 rounded-full bg-[#16C47F]" />

              <span className="text-sm">
                Active Vehicle
              </span>

            </div>

            <div className="flex items-center gap-3">

              <div className="w-4 h-4 rounded-full bg-[#9CA3AF]" />

              <span className="text-sm">
                Inactive Vehicle
              </span>

            </div>

            <div className="flex items-center gap-3">

              <div className="w-8 h-[5px] rounded-full bg-[#6C2BFF]" />

              <span className="text-sm">
                Route
              </span>

            </div>

            <div className="flex items-center gap-3">

              <div className="w-4 h-4 rounded-full bg-[#16C47F] border-2 border-white shadow" />

              <span className="text-sm">
                Collection Point
              </span>

            </div>

            <div className="flex items-center gap-3">

              <div className="w-5 h-5 rounded-md bg-[#111827]" />

              <span className="text-sm">
                Depot
              </span>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
