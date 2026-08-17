import { useState, useRef, useEffect, useMemo } from "react";

import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMap,
  ZoomControl,
} from "react-leaflet";

import L from "leaflet";

import {
  Map as MapIcon,
  Route,
  ChevronDown,
  Truck,
  Navigation,
} from "lucide-react";

import "leaflet/dist/leaflet.css";

/* =========================================================
   CONFIG
========================================================= */

const API_BASE_URL = "https://sewac-main.onrender.com";

const DEFAULT_CENTER = [12.9716, 77.5946];

const VEHICLE_COLORS = [
  "#7C3AED",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#2563EB",
  "#14B8A6",
];

/* =========================================================
   HELPERS
========================================================= */

function getTodayDate() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function normalizeWardNumber(value) {
  if (value === null || value === undefined) return null;

  if (typeof value === "object") {
    return normalizeWardNumber(
      value.wardNo ??
        value.wardNumber ??
        value.ward ??
        value.value ??
        value.id
    );
  }

  const match = String(value).match(/\d+/);

  return match ? Number(match[0]) : null;
}

function getStoredWard() {
  const possibleKeys = [
    "selectedWard",
    "selectedWardNo",
    "wardNo",
    "wardNumber",
    "ward",
    "sewacWard",
    "headerWard",
  ];

  for (const key of possibleKeys) {
    try {
      const localValue = localStorage.getItem(key);

      if (localValue) {
        const parsed = normalizeWardNumber(localValue);

        if (parsed !== null) {
          return parsed;
        }
      }
    } catch (error) {
      // Ignore localStorage errors.
    }
  }

  try {
    const sessionKeys = [
      "selectedWard",
      "selectedWardNo",
      "wardNo",
      "wardNumber",
      "ward",
      "sewacWard",
      "headerWard",
    ];

    for (const key of sessionKeys) {
      const sessionValue = sessionStorage.getItem(key);

      if (sessionValue) {
        const parsed = normalizeWardNumber(sessionValue);

        if (parsed !== null) {
          return parsed;
        }
      }
    }
  } catch (error) {
    // Ignore sessionStorage errors.
  }

  return null;
}

function getStoredDivision() {
  const possibleKeys = [
    "selectedDivision",
    "division",
    "divisionName",
    "sewacDivision",
    "headerDivision",
  ];

  for (const key of possibleKeys) {
    try {
      const value = localStorage.getItem(key);

      if (value) {
        if (value.startsWith("{")) {
          try {
            const parsed = JSON.parse(value);

            return (
              parsed.divisionName ??
              parsed.name ??
              parsed.division ??
              String(value)
            );
          } catch {
            return value;
          }
        }

        return value;
      }
    } catch {
      // Ignore
    }
  }

  try {
    for (const key of possibleKeys) {
      const value = sessionStorage.getItem(key);

      if (value) {
        return value;
      }
    }
  } catch {
    // Ignore
  }

  return null;
}

function getPointCoordinates(point) {
  if (!point || typeof point !== "object") {
    return null;
  }

  const latitude = Number(
    point.latitude ??
      point.lat ??
      point.Latitude ??
      point.LATITUDE
  );

  const longitude = Number(
    point.longitude ??
      point.lng ??
      point.lon ??
      point.Longitude ??
      point.LONGITUDE
  );

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  if (
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  return [latitude, longitude];
}

function getPointTimestamp(point) {
  if (!point) return 0;

  const timestamp =
    point.iottimestamp ??
    point.iotTimestamp ??
    point.receivedtimestamp ??
    point.receivedTimestamp ??
    point.timestamp ??
    point.createdAt;

  if (!timestamp) return 0;

  const value = new Date(timestamp).getTime();

  return Number.isFinite(value) ? value : 0;
}

function getVehicleName(vehicle, index) {
  return (
    vehicle?.vehicleNumber ??
    vehicle?.vehicleNo ??
    vehicle?.vehicleName ??
    vehicle?.vehicle ??
    vehicle?.vehicleTableName ??
    `Vehicle ${index + 1}`
  );
}

/* =========================================================
   MAP FIT COMPONENT
========================================================= */

function FitMapToRoutes({ routes }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !routes?.length) {
      return;
    }

    const allCoordinates = [];

    routes.forEach((route) => {
      route.coordinates.forEach((coordinate) => {
        if (
          Array.isArray(coordinate) &&
          coordinate.length === 2 &&
          Number.isFinite(coordinate[0]) &&
          Number.isFinite(coordinate[1])
        ) {
          allCoordinates.push(coordinate);
        }
      });
    });

    if (!allCoordinates.length) {
      return;
    }

    try {
      const bounds = L.latLngBounds(allCoordinates);

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
  }, [map, routes]);

  return null;
}

/* =========================================================
   START / END MARKERS
========================================================= */

function createRouteMarker(color, type) {
  const symbol = type === "start" ? "▶" : "■";

  return L.divIcon({
    className: "sewac-route-marker",
    html: `
      <div
        style="
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: white;
          border: 3px solid ${color};
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 12px rgba(0,0,0,0.20);
          color: ${color};
          font-size: 10px;
          font-weight: 800;
        "
      >
        ${symbol}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

/* =========================================================
   ROUTE PROCESSING
========================================================= */

function buildRoutes(apiResponse) {
  const root = apiResponse?.data ?? apiResponse;

  const vehicles = Array.isArray(root?.vehicles)
    ? root.vehicles
    : [];

  console.log(
    "[SEWAC ROUTE MAP] Vehicles received:",
    vehicles.length
  );

  const routes = vehicles
    .map((vehicle, vehicleIndex) => {
      const rawPoints = Array.isArray(vehicle?.points)
        ? vehicle.points
        : [];

      const validPoints = rawPoints
        .map((point) => ({
          point,
          coordinates: getPointCoordinates(point),
          timestamp: getPointTimestamp(point),
        }))
        .filter((item) => item.coordinates !== null);

      /*
       * The backend may already return points chronologically.
       * Sorting here guarantees the polyline follows the actual
       * movement sequence.
       */
      validPoints.sort((a, b) => {
        if (!a.timestamp && !b.timestamp) return 0;

        if (!a.timestamp) return -1;

        if (!b.timestamp) return 1;

        return a.timestamp - b.timestamp;
      });

      const coordinates = validPoints.map(
        (item) => item.coordinates
      );

      if (coordinates.length < 2) {
        return null;
      }

      const color =
        VEHICLE_COLORS[vehicleIndex % VEHICLE_COLORS.length];

      return {
        id:
          vehicle?.vehicleTableName ??
          vehicle?.vehicleNumber ??
          vehicleIndex,

        vehicleNumber: getVehicleName(
          vehicle,
          vehicleIndex
        ),

        vehicleTableName:
          vehicle?.vehicleTableName ?? "",

        totalRecords:
          vehicle?.totalRecords ??
          rawPoints.length,

        gpsPoints:
          vehicle?.gpsPoints ??
          coordinates.length,

        coordinates,

        color,

        rawVehicle: vehicle,
      };
    })
    .filter(Boolean);

  console.log(
    "[SEWAC ROUTE MAP] Routes ready:",
    routes
  );

  return routes;
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function CityOverviewMap({
  wardNo: propWardNo = null,
  divisionName: propDivisionName = null,
  selectedWard: propSelectedWard = null,
  selectedDivision: propSelectedDivision = null,
  date: propDate = null,
}) {
  /* -------------------------------------------------------
     MAP VIEW
  ------------------------------------------------------- */

  const [mapViewOpen, setMapViewOpen] = useState(false);

  const [mapView, setMapView] = useState("route");

  /* -------------------------------------------------------
     HEADER DATA
  ------------------------------------------------------- */

  const [wardNo, setWardNo] = useState(
    normalizeWardNumber(
      propWardNo ??
        propSelectedWard ??
        getStoredWard()
    )
  );

  const [divisionName, setDivisionName] =
    useState(
      propDivisionName ??
        propSelectedDivision ??
        getStoredDivision()
    );

  /* -------------------------------------------------------
     DATE
  ------------------------------------------------------- */

  const [selectedDate, setSelectedDate] =
    useState(propDate || getTodayDate());

  /* -------------------------------------------------------
     ROUTE DATA
  ------------------------------------------------------- */

  const [routes, setRoutes] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [requestInfo, setRequestInfo] = useState(
    null
  );

  const mapContainerRef = useRef(null);

  /* =======================================================
     UPDATE HEADER VALUES FROM PROPS
  ======================================================= */

  useEffect(() => {
    const normalized = normalizeWardNumber(
      propWardNo ??
        propSelectedWard
    );

    if (normalized !== null) {
      setWardNo(normalized);
    }
  }, [propWardNo, propSelectedWard]);

  useEffect(() => {
    const division =
      propDivisionName ??
      propSelectedDivision;

    if (division) {
      setDivisionName(division);
    }
  }, [
    propDivisionName,
    propSelectedDivision,
  ]);

  useEffect(() => {
    if (propDate) {
      setSelectedDate(propDate);
    }
  }, [propDate]);

  /* =======================================================
     LISTEN FOR HEADER CHANGES
     
     This supports headers that update localStorage,
     custom events, or both.
  ======================================================= */

  useEffect(() => {
    const refreshHeaderData = () => {
      const storedWard = getStoredWard();
      const storedDivision = getStoredDivision();

      if (storedWard !== null) {
        setWardNo(storedWard);
      }

      if (storedDivision) {
        setDivisionName(storedDivision);
      }
    };

    window.addEventListener(
      "storage",
      refreshHeaderData
    );

    window.addEventListener(
      "ward-change",
      refreshHeaderData
    );

    window.addEventListener(
      "division-change",
      refreshHeaderData
    );

    window.addEventListener(
      "sewac:header-change",
      refreshHeaderData
    );

    window.addEventListener(
      "header-selection-change",
      refreshHeaderData
    );

    return () => {
      window.removeEventListener(
        "storage",
        refreshHeaderData
      );

      window.removeEventListener(
        "ward-change",
        refreshHeaderData
      );

      window.removeEventListener(
        "division-change",
        refreshHeaderData
      );

      window.removeEventListener(
        "sewac:header-change",
        refreshHeaderData
      );

      window.removeEventListener(
        "header-selection-change",
        refreshHeaderData
      );
    };
  }, []);

  /* =======================================================
     ALSO CHECK STORAGE PERIODICALLY
     
     Useful because localStorage changes in the same tab
     do NOT fire the normal "storage" event.
  ======================================================= */

  useEffect(() => {
    const interval = setInterval(() => {
      const storedWard = getStoredWard();
      const storedDivision = getStoredDivision();

      if (
        storedWard !== null &&
        storedWard !== wardNo
      ) {
        setWardNo(storedWard);
      }

      if (
        storedDivision &&
        storedDivision !== divisionName
      ) {
        setDivisionName(storedDivision);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [wardNo, divisionName]);

  /* =======================================================
     FETCH ROUTE
  ======================================================= */

  useEffect(() => {
    /*
     * Only fetch when Route Map is selected.
     */

    if (mapView !== "route") {
      return;
    }

    /*
     * We need a ward because the endpoint requires:
     *
     * /api/route-map?date=YYYY-MM-DD&wardNo=216
     */

    if (!wardNo) {
      console.warn(
        "[SEWAC ROUTE MAP] No ward selected."
      );

      setRoutes([]);
      setError(
        "Please select a ward from the header."
      );

      return;
    }

    let cancelled = false;

    async function fetchRouteData() {
      setLoading(true);
      setError("");

      try {
        const url = new URL(
          `${API_BASE_URL}/api/route-map`
        );

        url.searchParams.set(
          "date",
          selectedDate
        );

        url.searchParams.set(
          "wardNo",
          String(wardNo)
        );

        console.log(
          "[SEWAC ROUTE MAP] Fetching:",
          url.toString()
        );

        const response = await fetch(
          url.toString(),
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Route API returned ${response.status}`
          );
        }

        const json = await response.json();

        console.log(
          "[SEWAC ROUTE MAP] API response:",
          json
        );

        if (cancelled) {
          return;
        }

        /*
         * API response should be:
         *
         * {
         *   success: true,
         *   data: {
         *     success: true,
         *     date: "...",
         *     wardNo: 216,
         *     totalVehicles: 2,
         *     vehicles: [...]
         *   }
         * }
         */

        if (
          json?.success === false ||
          json?.data?.success === false
        ) {
          throw new Error(
            json?.message ??
              json?.data?.message ??
              "Route API returned unsuccessful response."
          );
        }

        const processedRoutes =
          buildRoutes(json);

        setRoutes(processedRoutes);

        setRequestInfo({
          date:
            json?.data?.date ??
            selectedDate,

          wardNo:
            json?.data?.wardNo ??
            wardNo,

          totalVehicles:
            json?.data?.totalVehicles ??
            json?.data?.vehicles?.length ??
            0,

          dayTable:
            json?.data?.dayTable ?? "",
        });

        /*
         * IMPORTANT:
         *
         * If the API returned vehicles but no valid
         * coordinates, tell us exactly that.
         */

        if (
          processedRoutes.length === 0 &&
          Array.isArray(json?.data?.vehicles) &&
          json.data.vehicles.length > 0
        ) {
          console.warn(
            "[SEWAC ROUTE MAP] Vehicles received but no route could be plotted.",
            json.data.vehicles
          );

          setError(
            "Vehicles were received, but no valid GPS route points were found."
          );
        }
      } catch (fetchError) {
        console.error(
          "[SEWAC ROUTE MAP] ERROR:",
          fetchError
        );

        if (!cancelled) {
          setRoutes([]);

          setError(
            fetchError?.message ??
              "Unable to load vehicle route."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchRouteData();

    return () => {
      cancelled = true;
    };
  }, [mapView, wardNo, selectedDate]);

  /* =======================================================
     MAP VIEW OPTIONS
  ======================================================= */

  const mapOptions = useMemo(
    () => [
      {
        id: "city",
        label: "City Overview Map",
        icon: MapIcon,
      },
      {
        id: "route",
        label: "Route Map",
        icon: Route,
      },
    ],
    []
  );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="w-full rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_2px_10px_rgba(15,23,42,0.06)]">
      {/* ===================================================
          TITLE
      =================================================== */}

      <h2 className="mb-7 text-[24px] font-semibold tracking-[-0.02em] text-slate-950">
        CITY OVERVIEW MAP
      </h2>

      {/* ===================================================
          MAP
      =================================================== */}

      <div
        ref={mapContainerRef}
        className="relative h-[700px] w-full overflow-hidden rounded-[24px] border border-slate-200"
      >
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={11}
          zoomControl={false}
          scrollWheelZoom={true}
          className="h-full w-full"
          style={{
            minHeight: "700px",
            zIndex: 1,
          }}
        >
          {/* -----------------------------------------------
              BASE MAP
          ----------------------------------------------- */}

          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ZoomControl position="topleft" />

          {/* -----------------------------------------------
              ROUTES
          ----------------------------------------------- */}

          {mapView === "route" &&
            routes.map((route) => (
              <div key={route.id}>
                <Polyline
                  positions={route.coordinates}
                  pathOptions={{
                    color: route.color,
                    weight: 5,
                    opacity: 0.95,
                    lineCap: "round",
                    lineJoin: "round",
                  }}
                />

                {/* START MARKER */}

                {route.coordinates.length > 0 && (
                  <Marker
                    position={
                      route.coordinates[0]
                    }
                    icon={createRouteMarker(
                      route.color,
                      "start"
                    )}
                  >
                    <Popup>
                      <div className="min-w-[180px]">
                        <div className="mb-2 flex items-center gap-2">
                          <Truck
                            size={17}
                            style={{
                              color: route.color,
                            }}
                          />

                          <strong>
                            {route.vehicleNumber}
                          </strong>
                        </div>

                        <div className="text-xs text-slate-600">
                          Route start
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                )}

                {/* END MARKER */}

                {route.coordinates.length > 1 && (
                  <Marker
                    position={
                      route.coordinates[
                        route.coordinates.length - 1
                      ]
                    }
                    icon={createRouteMarker(
                      route.color,
                      "end"
                    )}
                  >
                    <Popup>
                      <div className="min-w-[180px]">
                        <div className="mb-2 flex items-center gap-2">
                          <Navigation
                            size={17}
                            style={{
                              color: route.color,
                            }}
                          />

                          <strong>
                            {route.vehicleNumber}
                          </strong>
                        </div>

                        <div className="text-xs text-slate-600">
                          Route end
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                )}
              </div>
            ))}

          {/* -----------------------------------------------
              AUTOMATICALLY FIT ROUTES
          ----------------------------------------------- */}

          {mapView === "route" &&
            routes.length > 0 && (
              <FitMapToRoutes routes={routes} />
            )}
        </MapContainer>

        {/* =================================================
            SELECT MAP VIEW
        ================================================= */}

        <div className="absolute left-5 top-5 z-[1000]">
          <div className="mb-2 text-[16px] font-medium text-slate-700">
            Select Map View
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setMapViewOpen(
                  (previous) => !previous
                )
              }
              className="flex h-[74px] w-[470px] items-center justify-between rounded-[18px] border border-slate-200 bg-white px-7 shadow-[0_4px_18px_rgba(15,23,42,0.08)] transition hover:shadow-[0_6px_24px_rgba(15,23,42,0.12)]"
            >
              <div className="flex items-center gap-5">
                {mapView === "route" ? (
                  <Route
                    size={25}
                    strokeWidth={2}
                    className="text-violet-600"
                  />
                ) : (
                  <MapIcon
                    size={25}
                    strokeWidth={2}
                    className="text-blue-600"
                  />
                )}

                <span className="text-[20px] font-semibold text-slate-700">
                  {
                    mapOptions.find(
                      (item) =>
                        item.id === mapView
                    )?.label
                  }
                </span>
              </div>

              <ChevronDown
                size={22}
                className={`text-slate-700 transition-transform ${
                  mapViewOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {/* ---------------------------------------------
                DROPDOWN
            --------------------------------------------- */}

            {mapViewOpen && (
              <div className="absolute left-0 top-[84px] z-[1100] w-[470px] overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.16)]">
                {mapOptions.map((option) => {
                  const Icon = option.icon;

                  const active =
                    mapView === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setMapView(option.id);
                        setMapViewOpen(false);
                      }}
                      className={`flex w-full items-center gap-5 px-7 py-5 text-left transition ${
                        active
                          ? "bg-violet-50"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <Icon
                        size={23}
                        className={
                          active
                            ? "text-violet-600"
                            : "text-slate-500"
                        }
                      />

                      <span
                        className={`text-[17px] font-medium ${
                          active
                            ? "text-slate-800"
                            : "text-slate-700"
                        }`}
                      >
                        {option.label}
                      </span>

                      {active && (
                        <span className="ml-auto text-violet-600">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* =================================================
            HEADER DATA
        ================================================= */}

        <div className="absolute right-5 top-5 z-[1000] flex gap-4">
          {/* DIVISION */}

          <div className="flex h-[72px] min-w-[300px] flex-col justify-center rounded-[18px] border border-slate-200 bg-white px-7 shadow-[0_4px_18px_rgba(15,23,42,0.08)]">
            <span className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-slate-400">
              DIVISION
            </span>

            <span className="text-[18px] font-semibold text-slate-700">
              {divisionName ||
                "Division not selected"}
            </span>
          </div>

          {/* WARD */}

          <div className="flex h-[72px] min-w-[300px] flex-col justify-center rounded-[18px] border border-slate-200 bg-white px-7 shadow-[0_4px_18px_rgba(15,23,42,0.08)]">
            <span className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-slate-400">
              WARD
            </span>

            <span className="text-[18px] font-semibold text-slate-700">
              {wardNo
                ? `Ibblur (${wardNo})`
                : "Ward not selected"}
            </span>
          </div>
        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="absolute bottom-6 left-1/2 z-[1000] -translate-x-1/2">
            <div className="flex items-center gap-3 rounded-[14px] border border-slate-200 bg-white px-5 py-3 shadow-[0_5px_20px_rgba(15,23,42,0.12)]">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-violet-600" />

              <span className="text-[14px] font-semibold text-slate-700">
                Loading vehicle routes...
              </span>
            </div>
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {!loading &&
          error &&
          mapView === "route" && (
            <div className="absolute bottom-6 left-1/2 z-[1000] -translate-x-1/2">
              <div className="flex max-w-[420px] items-center gap-3 rounded-[14px] border border-slate-200 bg-white px-5 py-3 shadow-[0_5px_20px_rgba(15,23,42,0.12)]">
                <Truck
                  size={20}
                  className="shrink-0 text-violet-600"
                />

                <span className="text-[13px] font-semibold text-slate-700">
                  {error}
                </span>
              </div>
            </div>
          )}

        {/* =================================================
            ROUTE LEGEND
        ================================================= */}

        {!loading &&
          routes.length > 0 &&
          mapView === "route" && (
            <div className="absolute bottom-5 left-5 z-[1000] max-h-[260px] max-w-[330px] overflow-auto rounded-[16px] border border-slate-200 bg-white p-4 shadow-[0_6px_24px_rgba(15,23,42,0.12)]">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[13px] font-bold uppercase tracking-wide text-slate-500">
                  Vehicle Routes
                </span>

                <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-bold text-violet-600">
                  {routes.length}
                </span>
              </div>

              <div className="space-y-2">
                {routes.map((route) => (
                  <div
                    key={route.id}
                    className="flex items-center gap-3"
                  >
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{
                        backgroundColor:
                          route.color,
                      }}
                    />

                    <div className="min-w-0">
                      <div className="truncate text-[13px] font-semibold text-slate-700">
                        {route.vehicleNumber}
                      </div>

                      <div className="text-[11px] text-slate-400">
                        {route.coordinates.length} GPS
                        points
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* =================================================
            API DEBUG INFO
        ================================================= */}

        {requestInfo &&
          mapView === "route" &&
          !loading &&
          routes.length > 0 && (
            <div className="absolute bottom-5 right-5 z-[1000] rounded-[14px] border border-slate-200 bg-white/95 px-4 py-3 shadow-[0_4px_16px_rgba(15,23,42,0.10)] backdrop-blur">
              <div className="text-[11px] font-semibold text-slate-400">
                ROUTE DATA
              </div>

              <div className="mt-1 text-[12px] font-semibold text-slate-600">
                {requestInfo.totalVehicles} vehicle
                {requestInfo.totalVehicles === 1
                  ? ""
                  : "s"}
                {" · "}
                {requestInfo.date}
              </div>
            </div>
          )}
      </div>
    </section>
  );
}