import {
  MapContainer,
  TileLayer,
  ZoomControl,
  GeoJSON,
  Polyline,
  CircleMarker,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import L from "leaflet";

import {
  Map as MapIcon,
  Route,
  MapPin,
  Factory,
  Megaphone,
  ChevronDown,
  Truck,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { ibbaluruBoundary } from "../../data/ibbaluruBoundary";

/* =========================================================
   CONFIG
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://sewac-main.onrender.com/api";

/* =========================================================
   ROUTE COLORS
========================================================= */

const ROUTE_COLORS = [
  "#7C3AED",
  "#2563EB",
  "#10B981",
  "#F97316",
  "#EC4899",
  "#06B6D4",
  "#EF4444",
  "#84CC16",
  "#F59E0B",
  "#8B5CF6",
];

/* =========================================================
   DEFAULT MAP
========================================================= */

const DEFAULT_CENTER = [
  12.9258,
  77.659,
];

const DEFAULT_ZOOM = 13;

/* =========================================================
   HELPERS
========================================================= */

function getVehicleColor(
  vehicleNumber,
  index = 0
) {
  if (!vehicleNumber) {
    return (
      ROUTE_COLORS[
        index %
          ROUTE_COLORS.length
      ]
    );
  }

  let hash = 0;

  for (
    let i = 0;
    i < vehicleNumber.length;
    i++
  ) {
    hash =
      vehicleNumber.charCodeAt(i) +
      ((hash << 5) - hash);
  }

  return (
    ROUTE_COLORS[
      Math.abs(hash) %
        ROUTE_COLORS.length
    ]
  );
}

function normalizeWard(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "";
  }

  const match =
    String(value).match(/\d+/);

  return match
    ? match[0]
    : "";
}

function formatDateForAPI(date) {
  if (!date) {
    const fallback =
      new Date();

    fallback.setDate(
      fallback.getDate() - 1
    );

    return fallback
      .toISOString()
      .slice(0, 10);
  }

  if (
    typeof date === "string"
  ) {
    if (
      /^\d{4}-\d{2}-\d{2}$/.test(
        date
      )
    ) {
      return date;
    }

    const parsed =
      new Date(date);

    if (
      !Number.isNaN(
        parsed.getTime()
      )
    ) {
      return parsed
        .toISOString()
        .slice(0, 10);
    }

    return date;
  }

  if (
    date instanceof Date
  ) {
    return date
      .toISOString()
      .slice(0, 10);
  }

  return new Date()
    .toISOString()
    .slice(0, 10);
}

function getStoredValue(
  ...keys
) {
  if (
    typeof window ===
    "undefined"
  ) {
    return "";
  }

  for (const key of keys) {
    const value =
      localStorage.getItem(
        key
      );

    if (
      value !== null &&
      value !== undefined &&
      value !== ""
    ) {
      return value;
    }
  }

  return "";
}

/* =========================================================
   TRUCK ICON
========================================================= */

function createTruckIcon(
  color
) {
  return L.divIcon({
    className:
      "sewac-truck-marker",

    html: `
      <div
        style="
          width:42px;
          height:42px;
          border-radius:50%;
          background:#ffffff;
          border:3px solid ${color};
          display:flex;
          align-items:center;
          justify-content:center;
          box-shadow:0 7px 20px rgba(15,23,42,.20);
        "
      >
        <div
          style="
            width:31px;
            height:31px;
            border-radius:50%;
            background:${color}18;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:17px;
          "
        >
          🚛
        </div>
      </div>
    `,

    iconSize: [
      42,
      42,
    ],

    iconAnchor: [
      21,
      21,
    ],

    popupAnchor: [
      0,
      -23,
    ],
  });
}

/* =========================================================
   MAP CONTROLLER
========================================================= */

function MapController({
  routes,
  selectedView,
  boundary,
}) {
  const map =
    useMap();

  useEffect(() => {
    const timer =
      setTimeout(() => {
        map.invalidateSize();
      }, 150);

    const resize =
      () => {
        map.invalidateSize();
      };

    window.addEventListener(
      "resize",
      resize
    );

    return () => {
      clearTimeout(timer);

      window.removeEventListener(
        "resize",
        resize
      );
    };
  }, [map]);

  useEffect(() => {
    if (
      selectedView !==
      "route"
    ) {
      return;
    }

    if (
      !routes ||
      routes.length ===
        0
    ) {
      return;
    }

    const coordinates =
      [];

    routes.forEach(
      (vehicle) => {
        if (
          !Array.isArray(
            vehicle.points
          )
        ) {
          return;
        }

        vehicle.points.forEach(
          (point) => {
            const lat =
              Number(
                point.latitude
              );

            const lng =
              Number(
                point.longitude
              );

            if (
              Number.isFinite(
                lat
              ) &&
              Number.isFinite(
                lng
              ) &&
              lat !== 0 &&
              lng !== 0
            ) {
              coordinates.push([
                lat,
                lng,
              ]);
            }
          }
        );
      }
    );

    if (
      coordinates.length ===
      0
    ) {
      return;
    }

    const bounds =
      L.latLngBounds(
        coordinates
      );

    if (
      bounds.isValid()
    ) {
      map.fitBounds(
        bounds,
        {
          padding: [
            80,
            80,
          ],
          maxZoom: 15,
          animate: true,
        }
      );
    }
  }, [
    routes,
    selectedView,
    map,
  ]);

  useEffect(() => {
    if (
      selectedView !==
      "overview"
    ) {
      return;
    }

    if (!boundary) {
      return;
    }

    const layer =
      L.geoJSON(
        boundary
      );

    const bounds =
      layer.getBounds();

    if (
      bounds.isValid()
    ) {
      map.fitBounds(
        bounds,
        {
          padding: [
            50,
            50,
          ],
          maxZoom: 14,
          animate: true,
        }
      );
    }
  }, [
    boundary,
    selectedView,
    map,
  ]);

  return null;
}

/* =========================================================
   POPUP ROW
========================================================= */

function PopupRow({
  label,
  value,
}) {
  return (
    <div
      style={{
        display:
          "flex",
        justifyContent:
          "space-between",
        gap: "16px",
        marginBottom:
          "7px",
        fontSize:
          "12px",
      }}
    >
      <span
        style={{
          color:
            "#64748B",
        }}
      >
        {label}
      </span>

      <strong
        style={{
          color:
            "#0F172A",
          textAlign:
            "right",
        }}
      >
        {value ??
          "—"}
      </strong>
    </div>
  );
}

/* =========================================================
   EMPTY LAYER
========================================================= */

function EmptyLayer({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div
      className="
        absolute
        inset-0
        z-[600]
        flex
        items-center
        justify-center
        pointer-events-none
      "
    >
      <div
        className="
          bg-white/95
          backdrop-blur
          rounded-[24px]
          border
          border-slate-200
          shadow-[0_20px_60px_rgba(15,23,42,0.12)]
          px-10
          py-9
          text-center
          max-w-[380px]
        "
      >
        <div
          className="
            mx-auto
            mb-5
            w-14
            h-14
            rounded-2xl
            bg-violet-50
            flex
            items-center
            justify-center
          "
        >
          <Icon
            size={26}
            className="text-violet-600"
          />
        </div>

        <h3
          className="
            text-[18px]
            font-semibold
            text-slate-800
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-2
            text-[13px]
            leading-relaxed
            text-slate-500
          "
        >
          {description}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   DATA MARKER
========================================================= */

function DataMarker({
  item,
  type,
}) {
  const latitude =
    Number(
      item?.latitude ??
        item?.lat
    );

  const longitude =
    Number(
      item?.longitude ??
        item?.lng ??
        item?.lon
    );

  if (
    !Number.isFinite(
      latitude
    ) ||
    !Number.isFinite(
      longitude
    )
  ) {
    return null;
  }

  let color =
    "#7C3AED";

  let symbol =
    "📍";

  if (
    type === "gvp"
  ) {
    symbol = "🗑️";

    color =
      String(
        item?.severity
      ).toUpperCase() ===
        "HIGH" ||
      String(
        item?.severity
      ).toUpperCase() ===
        "CRITICAL"
        ? "#EF4444"
        : String(
            item?.severity
          ).toUpperCase() ===
          "MEDIUM"
        ? "#F59E0B"
        : "#10B981";
  }

  if (
    type === "plant"
  ) {
    symbol = "🏭";

    color =
      String(
        item?.status
      ).toUpperCase() ===
      "ACTIVE"
        ? "#10B981"
        : "#94A3B8";
  }

  if (
    type ===
    "grievance"
  ) {
    symbol = "⚠️";

    color =
      String(
        item?.priority
      ).toUpperCase() ===
        "CRITICAL"
        ? "#DC2626"
        : String(
            item?.priority
          ).toUpperCase() ===
          "HIGH"
        ? "#F97316"
        : "#F59E0B";
  }

  return (
    <Marker
      position={[
        latitude,
        longitude,
      ]}
      icon={L.divIcon({
        className:
          "sewac-map-data-marker",

        html: `
          <div
            style="
              width:40px;
              height:40px;
              border-radius:50%;
              background:white;
              border:3px solid ${color};
              display:flex;
              align-items:center;
              justify-content:center;
              box-shadow:0 7px 20px rgba(15,23,42,.18);
              font-size:17px;
            "
          >
            ${symbol}
          </div>
        `,

        iconSize: [
          40,
          40,
        ],

        iconAnchor: [
          20,
          20,
        ],
      })}
    >
      <Popup>
        <div
          style={{
            minWidth:
              "230px",
            fontFamily:
              "Inter, sans-serif",
          }}
        >
          <div
            style={{
              fontSize:
                "15px",
              fontWeight:
                700,
              marginBottom:
                "12px",
              color:
                "#0F172A",
            }}
          >
            {type ===
              "gvp" &&
              "Garbage Vulnerable Point"}

            {type ===
              "plant" &&
              "Waste Processing Plant"}

            {type ===
              "grievance" &&
              "Customer Grievance"}
          </div>

          <PopupRow
            label="Name"
            value={
              item?.name ||
              item?.title
            }
          />

          <PopupRow
            label="Ward"
            value={
              item?.wardNo
            }
          />

          {type ===
            "gvp" && (
            <>
              <PopupRow
                label="Severity"
                value={
                  item?.severity
                }
              />

              <PopupRow
                label="Reports"
                value={
                  item?.reports ??
                  item?.frequency
                }
              />

              <PopupRow
                label="Status"
                value={
                  item?.status
                }
              />
            </>
          )}

          {type ===
            "plant" && (
            <>
              <PopupRow
                label="Status"
                value={
                  item?.status
                }
              />

              <PopupRow
                label="Capacity"
                value={
                  item?.capacity
                }
              />

              <PopupRow
                label="Current Load"
                value={
                  item?.currentLoad
                }
              />
            </>
          )}

          {type ===
            "grievance" && (
            <>
              <PopupRow
                label="Category"
                value={
                  item?.category
                }
              />

              <PopupRow
                label="Priority"
                value={
                  item?.priority
                }
              />

              <PopupRow
                label="Status"
                value={
                  item?.status
                }
              />
            </>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

/* =========================================================
   MAIN
========================================================= */

export default function MapSection({
  selectedWard:
    selectedWardProp = null,

  selectedDivision:
    selectedDivisionProp = null,

  wardNo:
    wardNoProp = null,

  divisionName:
    divisionNameProp = null,

  selectedDate:
    selectedDateProp = null,
}) {
  /* =======================================================
     MAP VIEW
  ======================================================= */

  const [
    selectedView,
    setSelectedView,
  ] = useState(
    "overview"
  );

  const [
    showViewMenu,
    setShowViewMenu,
  ] = useState(false);

  const menuRef =
    useRef(null);

  /* =======================================================
     ROUTES
  ======================================================= */

  const [
    routes,
    setRoutes,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    lastUpdated,
    setLastUpdated,
  ] = useState(null);

  /* =======================================================
     FUTURE MAP DATA
  ======================================================= */

  const [
    gvpData,
    setGvpData,
  ] = useState([]);

  const [
    plantData,
    setPlantData,
  ] = useState([]);

  const [
    grievanceData,
    setGrievanceData,
  ] = useState([]);

  /*
    These setters are intentionally kept here.

    When the actual APIs are connected,
    only the fetch functions need to change.
  */

  /* =======================================================
     WARD
  ======================================================= */

  const storedWard =
    getStoredValue(
      "wardNo",
      "wardId",
      "selectedWard",
      "selectedWardNo",
      "headerWardNo"
    );

  const normalizedWard =
    normalizeWard(
      wardNoProp ??
        selectedWardProp ??
        storedWard
    );

  /* =======================================================
     DIVISION
  ======================================================= */

  const selectedDivision =
    selectedDivisionProp ??
    divisionNameProp ??
    getStoredValue(
      "selectedDivision",
      "divisionName",
      "headerDivision"
    );

  /* =======================================================
     DATE
  ======================================================= */

  const apiDate =
    formatDateForAPI(
      selectedDateProp ??
        getStoredValue(
          "selectedDate",
          "dashboardDate",
          "routeDate"
        )
    );

  /* =======================================================
     MAP OPTIONS
  ======================================================= */

  const mapViews = [
    {
      id: "overview",
      label:
        "City Overview Map",
      icon: MapIcon,
      color:
        "#2563EB",
    },

    {
      id: "route",
      label:
        "Route Map",
      icon: Route,
      color:
        "#7C3AED",
    },

    {
      id: "gvp",
      label:
        "Garbage Vulnerable Points (GVP)",
      icon: MapPin,
      color:
        "#16A34A",
    },

    {
      id: "plants",
      label:
        "Plants Active",
      icon: Factory,
      color:
        "#059669",
    },

    {
      id: "grievances",
      label:
        "Customer Grievances",
      icon: Megaphone,
      color:
        "#EC4899",
    },
  ];

  const activeView =
    mapViews.find(
      (view) =>
        view.id ===
        selectedView
    ) ||
    mapViews[0];

  const ActiveIcon =
    activeView.icon;

  /* =======================================================
     FETCH ROUTES
  ======================================================= */

  const fetchRoutes =
    async () => {
      if (
        !normalizedWard
      ) {
        setRoutes([]);
        setError(
          "Please select a ward from the header."
        );
        return;
      }

      setLoading(true);
      setError("");

      try {
        const url =
          `${API_BASE_URL}/route-map` +
          `?date=${encodeURIComponent(
            apiDate
          )}` +
          `&wardNo=${encodeURIComponent(
            normalizedWard
          )}`;

        console.log(
          "===================================="
        );

        console.log(
          "🚛 SEWAC ROUTE MAP"
        );

        console.log(
          "DATE:",
          apiDate
        );

        console.log(
          "WARD:",
          normalizedWard
        );

        console.log(
          "URL:",
          url
        );

        console.log(
          "===================================="
        );

        const response =
          await fetch(
            url,
            {
              method:
                "GET",
              headers: {
                Accept:
                  "application/json",
              },
            }
          );

        const json =
          await response.json();

        if (
          !response.ok
        ) {
          throw new Error(
            json?.message ||
              `Route API returned HTTP ${response.status}`
          );
        }

        const payload =
          json?.data &&
          typeof json.data ===
            "object" &&
          !Array.isArray(
            json.data
          )
            ? json.data
            : json;

        const vehicleData =
          Array.isArray(
            payload?.vehicles
          )
            ? payload.vehicles
            : [];

        const normalizedVehicles =
          vehicleData
            .map(
              (
                vehicle,
                vehicleIndex
              ) => {
                const rawPoints =
                  Array.isArray(
                    vehicle?.points
                  )
                    ? vehicle.points
                    : Array.isArray(
                        vehicle?.route
                      )
                    ? vehicle.route
                    : [];

                const points =
                  rawPoints
                    .map(
                      (
                        point
                      ) => {
                        const latitude =
                          Number(
                            point?.latitude
                          );

                        const longitude =
                          Number(
                            point?.longitude
                          );

                        if (
                          !Number.isFinite(
                            latitude
                          ) ||
                          !Number.isFinite(
                            longitude
                          ) ||
                          latitude ===
                            0 ||
                          longitude ===
                            0
                        ) {
                          return null;
                        }

                        return {
                          ...point,

                          latitude,

                          longitude,

                          position: [
                            latitude,
                            longitude,
                          ],
                        };
                      }
                    )
                    .filter(
                      Boolean
                    );

                points.sort(
                  (
                    a,
                    b
                  ) => {
                    const timeA =
                      new Date(
                        a?.iotTimestamp ||
                          a?.iottimestamp ||
                          a?.receivedtimestamp ||
                          a?.timestamp ||
                          a?.createdAt ||
                          0
                      ).getTime();

                    const timeB =
                      new Date(
                        b?.iotTimestamp ||
                          b?.iottimestamp ||
                          b?.receivedtimestamp ||
                          b?.timestamp ||
                          b?.createdAt ||
                          0
                      ).getTime();

                    if (
                      Number.isNaN(
                        timeA
                      ) ||
                      Number.isNaN(
                        timeB
                      )
                    ) {
                      return 0;
                    }

                    return (
                      timeA -
                      timeB
                    );
                  }
                );

                const vehicleNumber =
                  vehicle?.vehicleNumber ||
                  vehicle?.vehicleNo ||
                  vehicle?.registrationNumber ||
                  `Vehicle ${
                    vehicleIndex +
                    1
                  }`;

                return {
                  ...vehicle,

                  vehicleNumber,

                  vehicleTableName:
                    vehicle?.vehicleTableName ||
                    vehicle?.vehicleTable ||
                    "",

                  points,

                  color:
                    getVehicleColor(
                      vehicleNumber,
                      vehicleIndex
                    ),
                };
              }
            )
            .filter(
              (
                vehicle
              ) =>
                vehicle.points
                  .length >
                0
            );

        console.log(
          "NORMALIZED ROUTES:",
          normalizedVehicles
        );

        setRoutes(
          normalizedVehicles
        );

        setLastUpdated(
          new Date()
        );

        if (
          normalizedVehicles.length ===
          0
        ) {
          setError(
            payload?.message ||
              `No vehicles found for Ward ${normalizedWard} on ${apiDate}.`
          );
        }
      } catch (
        fetchError
      ) {
        console.error(
          "SEWAC ROUTE MAP ERROR:",
          fetchError
        );

        setRoutes([]);

        setError(
          fetchError?.message ||
            "Unable to load route data."
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  /* =======================================================
     ROUTE FETCH
  ======================================================= */

  useEffect(() => {
    if (
      selectedView !==
      "route"
    ) {
      return;
    }

    fetchRoutes();
  }, [
    selectedView,
    normalizedWard,
    apiDate,
  ]);

  /* =======================================================
     STORAGE LISTENER
  ======================================================= */

  useEffect(() => {
    const handleStorage =
      () => {
        if (
          selectedView ===
          "route"
        ) {
          fetchRoutes();
        }
      };

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, [
    selectedView,
    normalizedWard,
    apiDate,
  ]);

  /* =======================================================
     OUTSIDE CLICK
  ======================================================= */

  useEffect(() => {
    const handleClick =
      (event) => {
        if (
          menuRef.current &&
          !menuRef.current.contains(
            event.target
          )
        ) {
          setShowViewMenu(
            false
          );
        }
      };

    document.addEventListener(
      "mousedown",
      handleClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClick
      );
    };
  }, []);

  /* =======================================================
     STATS
  ======================================================= */

  const totalGpsPoints =
    useMemo(
      () =>
        routes.reduce(
          (
            total,
            vehicle
          ) =>
            total +
            vehicle.points
              .length,
          0
        ),
      [routes]
    );

  const activeVehicles =
    routes.length;

  const activePlants =
    plantData.filter(
      (plant) =>
        String(
          plant?.status
        ).toUpperCase() ===
        "ACTIVE"
    ).length;

  const openGrievances =
    grievanceData.filter(
      (item) =>
        String(
          item?.status
        ).toUpperCase() !==
        "RESOLVED"
    ).length;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section
      className="
        w-full
        rounded-[28px]
        bg-white
        border
        border-slate-200
        shadow-[0_2px_10px_rgba(15,23,42,0.05)]
        p-6
      "
    >
      {/* =================================================
          PAGE TITLE
      ================================================= */}

      <div
        className="
          mb-6
          px-1
          flex
          items-end
          justify-between
        "
      >
        <div>
          <h2
            className="
              text-[23px]
              font-semibold
              tracking-[-0.02em]
              text-slate-950
            "
          >
            MAPS
          </h2>

          <p
            className="
              mt-1
              text-[13px]
              text-slate-500
            "
          >
            City operations, routes,
            vulnerable points, plants
            and customer grievances
          </p>
        </div>

        <div
          className="
            text-[12px]
            font-medium
            text-slate-500
          "
        >
          {lastUpdated
            ? `Updated ${lastUpdated.toLocaleTimeString(
                [],
                {
                  hour:
                    "2-digit",
                  minute:
                    "2-digit",
                }
              )}`
            : "Live map"}
        </div>
      </div>

      {/* =================================================
          MAP WRAPPER
      ================================================= */}

      <div
        className="
          relative
          w-full
          h-[700px]
          overflow-hidden
          rounded-[24px]
          border
          border-slate-200
        "
      >
        {/* =================================================
            LEAFLET
        ================================================= */}

        <MapContainer
          center={
            DEFAULT_CENTER
          }
          zoom={
            DEFAULT_ZOOM
          }
          zoomControl={false}
          scrollWheelZoom={
            true
          }
          style={{
            width:
              "100%",
            height:
              "100%",
            zIndex: 1,
          }}
        >
          <ZoomControl
            position="bottomright"
          />

          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          <MapController
            routes={routes}
            selectedView={
              selectedView
            }
            boundary={
              ibbaluruBoundary
            }
          />

          {/* =================================================
              CITY OVERVIEW
          ================================================= */}

          {selectedView ===
            "overview" && (
            <>
              <GeoJSON
                data={
                  ibbaluruBoundary
                }
                style={{
                  color:
                    "#10B981",
                  weight: 4,
                  opacity: 0.95,
                  fillColor:
                    "#10B981",
                  fillOpacity:
                    0.12,
                }}
                onEachFeature={(
                  feature,
                  layer
                ) => {
                  layer.bindPopup(
                    `
                    <div
                      style="
                        min-width:180px;
                        font-family:Inter,Arial,sans-serif;
                      "
                    >
                      <strong>
                        ${
                          feature
                            ?.properties
                            ?.name ||
                          "Ward"
                        }
                      </strong>

                      <br/>

                      <span
                        style="
                          color:#64748B;
                          font-size:12px;
                        "
                      >
                        Ward ID:
                        ${
                          feature
                            ?.properties
                            ?.wardId ??
                          "—"
                        }
                      </span>
                    </div>
                    `
                  );
                }}
              />

              {/* Current vehicles */}

              {routes.map(
                (
                  vehicle,
                  index
                ) => {
                  const latest =
                    vehicle
                      .points[
                      vehicle
                        .points
                        .length -
                        1
                    ];

                  if (
                    !latest
                  ) {
                    return null;
                  }

                  return (
                    <Marker
                      key={`overview-${vehicle.vehicleNumber}-${index}`}
                      position={
                        latest.position
                      }
                      icon={createTruckIcon(
                        vehicle.color
                      )}
                    >
                      <Popup>
                        <div
                          style={{
                            minWidth:
                              "200px",
                          }}
                        >
                          <div
                            style={{
                              fontWeight:
                                700,
                              fontSize:
                                "15px",
                              marginBottom:
                                "8px",
                            }}
                          >
                            {
                              vehicle.vehicleNumber
                            }
                          </div>

                          <PopupRow
                            label="Ward"
                            value={
                              normalizedWard
                            }
                          />

                          <PopupRow
                            label="GPS Points"
                            value={
                              vehicle
                                .points
                                .length
                            }
                          />
                        </div>
                      </Popup>
                    </Marker>
                  );
                }
              )}

              {/* Future GVP markers */}

              {gvpData.map(
                (
                  item,
                  index
                ) => (
                  <DataMarker
                    key={`overview-gvp-${item?.id || index}`}
                    item={
                      item
                    }
                    type="gvp"
                  />
                )
              )}

              {/* Future plants */}

              {plantData.map(
                (
                  item,
                  index
                ) => (
                  <DataMarker
                    key={`overview-plant-${item?.id || index}`}
                    item={
                      item
                    }
                    type="plant"
                  />
                )
              )}

              {/* Future grievances */}

              {grievanceData.map(
                (
                  item,
                  index
                ) => (
                  <DataMarker
                    key={`overview-grievance-${item?.id || index}`}
                    item={
                      item
                    }
                    type="grievance"
                  />
                )
              )}
            </>
          )}

          {/* =================================================
              ROUTES
          ================================================= */}

          {selectedView ===
            "route" && (
            <>
              {routes.map(
                (
                  vehicle,
                  vehicleIndex
                ) => {
                  const positions =
                    vehicle.points.map(
                      (
                        point
                      ) =>
                        point.position
                    );

                  if (
                    positions.length ===
                    0
                  ) {
                    return null;
                  }

                  const latest =
                    vehicle
                      .points[
                      vehicle
                        .points
                        .length -
                        1
                    ];

                  return (
                    <div
                      key={`${vehicle.vehicleNumber}-${vehicleIndex}`}
                    >
                      {positions.length >
                        1 && (
                        <Polyline
                          positions={
                            positions
                          }
                          pathOptions={{
                            color:
                              vehicle.color,
                            weight:
                              9,
                            opacity:
                              0.14,
                            lineCap:
                              "round",
                            lineJoin:
                              "round",
                          }}
                        />
                      )}

                      {positions.length >
                        1 && (
                        <Polyline
                          positions={
                            positions
                          }
                          pathOptions={{
                            color:
                              vehicle.color,
                            weight:
                              4,
                            opacity:
                              0.95,
                            lineCap:
                              "round",
                            lineJoin:
                              "round",
                          }}
                        />
                      )}

                      {vehicle.points.map(
                        (
                          point,
                          pointIndex
                        ) => (
                          <CircleMarker
                            key={`${vehicle.vehicleNumber}-${pointIndex}`}
                            center={
                              point.position
                            }
                            radius={
                              4
                            }
                            pathOptions={{
                              color:
                                "#FFFFFF",
                              weight:
                                2,
                              fillColor:
                                vehicle.color,
                              fillOpacity:
                                0.95,
                            }}
                          >
                            <Popup>
                              <div
                                style={{
                                  minWidth:
                                    "240px",
                                  fontFamily:
                                    "Inter, sans-serif",
                                }}
                              >
                                <div
                                  style={{
                                    fontWeight:
                                      700,
                                    fontSize:
                                      "15px",
                                    marginBottom:
                                      "12px",
                                  }}
                                >
                                  {
                                    vehicle.vehicleNumber
                                  }
                                </div>

                                <PopupRow
                                  label="Latitude"
                                  value={point.latitude.toFixed(
                                    6
                                  )}
                                />

                                <PopupRow
                                  label="Longitude"
                                  value={point.longitude.toFixed(
                                    6
                                  )}
                                />

                                <PopupRow
                                  label="Timestamp"
                                  value={
                                    point?.iotTimestamp ||
                                    point?.iottimestamp ||
                                    point?.receivedtimestamp ||
                                    point?.timestamp
                                  }
                                />

                                <PopupRow
                                  label="Ward"
                                  value={
                                    point?.wardNo ??
                                    normalizedWard
                                  }
                                />

                                <PopupRow
                                  label="Wet Weight"
                                  value={
                                    point?.wetWeight
                                  }
                                />

                                <PopupRow
                                  label="Dry Weight"
                                  value={
                                    point?.dryWeight
                                  }
                                />
                              </div>
                            </Popup>
                          </CircleMarker>
                        )
                      )}

                      {latest && (
                        <Marker
                          position={
                            latest.position
                          }
                          icon={createTruckIcon(
                            vehicle.color
                          )}
                        >
                          <Popup>
                            <div
                              style={{
                                minWidth:
                                  "220px",
                              }}
                            >
                              <div
                                style={{
                                  fontWeight:
                                    700,
                                  fontSize:
                                    "15px",
                                  marginBottom:
                                    "10px",
                                }}
                              >
                                {
                                  vehicle.vehicleNumber
                                }
                              </div>

                              <PopupRow
                                label="Ward"
                                value={
                                  normalizedWard
                                }
                              />

                              <PopupRow
                                label="GPS Points"
                                value={
                                  vehicle
                                    .points
                                    .length
                                }
                              />

                              <PopupRow
                                label="Latitude"
                                value={latest.latitude.toFixed(
                                  6
                                )}
                              />

                              <PopupRow
                                label="Longitude"
                                value={latest.longitude.toFixed(
                                  6
                                )}
                              />
                            </div>
                          </Popup>
                        </Marker>
                      )}
                    </div>
                  );
                }
              )}
            </>
          )}

          {/* =================================================
              GVP
          ================================================= */}

          {selectedView ===
            "gvp" &&
            gvpData.map(
              (
                item,
                index
              ) => (
                <DataMarker
                  key={`gvp-${item?.id || index}`}
                  item={
                    item
                  }
                  type="gvp"
                />
              )
            )}

          {/* =================================================
              PLANTS
          ================================================= */}

          {selectedView ===
            "plants" &&
            plantData.map(
              (
                item,
                index
              ) => (
                <DataMarker
                  key={`plant-${item?.id || index}`}
                  item={
                    item
                  }
                  type="plant"
                />
              )
            )}

          {/* =================================================
              GRIEVANCES
          ================================================= */}

          {selectedView ===
            "grievances" &&
            grievanceData.map(
              (
                item,
                index
              ) => (
                <DataMarker
                  key={`grievance-${item?.id || index}`}
                  item={
                    item
                  }
                  type="grievance"
                />
              )
            )}
        </MapContainer>

        {/* =================================================
            MAP VIEW DROPDOWN
        ================================================= */}

        <div
          ref={menuRef}
          className="
            absolute
            left-5
            top-5
            z-[1000]
          "
        >
          <button
            type="button"
            onClick={() =>
              setShowViewMenu(
                (
                  previous
                ) =>
                  !previous
              )
            }
            className="
              w-[410px]
              h-[70px]
              max-w-[calc(100vw-40px)]
              px-6
              bg-white
              rounded-[18px]
              border
              border-slate-200
              shadow-[0_8px_28px_rgba(15,23,42,0.13)]
              flex
              items-center
              justify-between
              hover:shadow-[0_12px_32px_rgba(15,23,42,0.17)]
              transition
            "
          >
            <div
              className="
                flex
                items-center
                gap-4
              "
            >
              <ActiveIcon
                size={25}
                strokeWidth={2}
                style={{
                  color:
                    activeView.color,
                }}
              />

              <span
                className="
                  text-[17px]
                  font-semibold
                  text-slate-700
                "
              >
                {
                  activeView.label
                }
              </span>
            </div>

            <ChevronDown
              size={21}
              className={`
                text-slate-500
                transition-transform
                ${
                  showViewMenu
                    ? "rotate-180"
                    : ""
                }
              `}
            />
          </button>

          {showViewMenu && (
            <div
              className="
                absolute
                left-0
                top-[78px]
                w-[410px]
                max-w-[calc(100vw-40px)]
                bg-white
                rounded-[18px]
                border
                border-slate-200
                overflow-hidden
                shadow-[0_18px_45px_rgba(15,23,42,0.16)]
              "
            >
              {mapViews.map(
                (
                  view
                ) => {
                  const Icon =
                    view.icon;

                  const isActive =
                    selectedView ===
                    view.id;

                  return (
                    <button
                      key={
                        view.id
                      }
                      type="button"
                      onClick={() => {
                        setSelectedView(
                          view.id
                        );

                        setShowViewMenu(
                          false
                        );

                        setError(
                          ""
                        );
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
                      <div
                        className="
                          flex
                          items-center
                          gap-5
                        "
                      >
                        <Icon
                          size={24}
                          strokeWidth={
                            2
                          }
                          style={{
                            color:
                              view.color,
                          }}
                        />

                        <span
                          className="
                            text-[16px]
                            font-medium
                            text-slate-700
                          "
                        >
                          {
                            view.label
                          }
                        </span>
                      </div>

                      {isActive && (
                        <CheckCircle2
                          size={
                            21
                          }
                          style={{
                            color:
                              view.color,
                          }}
                        />
                      )}
                    </button>
                  );
                }
              )}
            </div>
          )}
        </div>

        {/* =================================================
            DIVISION + WARD
        ================================================= */}

        <div
          className="
            absolute
            right-5
            top-5
            z-[1000]
            flex
            gap-4
          "
        >
          <div
            className="
              min-w-[260px]
              px-6
              py-4
              bg-white
              rounded-[18px]
              border
              border-slate-200
              shadow-[0_8px_25px_rgba(15,23,42,0.08)]
            "
          >
            <div
              className="
                text-[11px]
                font-semibold
                tracking-wide
                uppercase
                text-slate-400
              "
            >
              DIVISION
            </div>

            <div
              className="
                mt-1
                text-[16px]
                font-semibold
                text-slate-700
              "
            >
              {selectedDivision ||
                "All Divisions"}
            </div>
          </div>

          <div
            className="
              min-w-[210px]
              px-6
              py-4
              bg-white
              rounded-[18px]
              border
              border-slate-200
              shadow-[0_8px_25px_rgba(15,23,42,0.08)]
            "
          >
            <div
              className="
                text-[11px]
                font-semibold
                tracking-wide
                uppercase
                text-slate-400
              "
            >
              WARD
            </div>

            <div
              className="
                mt-1
                text-[16px]
                font-semibold
                text-slate-700
              "
            >
              {normalizedWard
                ? `Ward ${normalizedWard}`
                : "All Wards"}
            </div>
          </div>
        </div>

        {/* =================================================
            OVERVIEW STATS
        ================================================= */}

        {selectedView ===
          "overview" && (
          <div
            className="
              absolute
              left-5
              bottom-5
              z-[1000]
              flex
              gap-3
            "
          >
            <div
              className="
                px-5
                py-3
                bg-white
                rounded-[16px]
                border
                border-slate-200
                shadow-[0_7px_22px_rgba(15,23,42,0.10)]
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[10px]
                  uppercase
                  tracking-wide
                  font-semibold
                  text-slate-400
                "
              >
                <Truck
                  size={15}
                />

                Active Vehicles
              </div>

              <div
                className="
                  mt-1
                  text-[20px]
                  font-bold
                  text-slate-800
                "
              >
                {
                  activeVehicles
                }
              </div>
            </div>

            <div
              className="
                px-5
                py-3
                bg-white
                rounded-[16px]
                border
                border-slate-200
                shadow-[0_7px_22px_rgba(15,23,42,0.10)]
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[10px]
                  uppercase
                  tracking-wide
                  font-semibold
                  text-slate-400
                "
              >
                <AlertTriangle
                  size={15}
                />

                Vulnerable Points
              </div>

              <div
                className="
                  mt-1
                  text-[20px]
                  font-bold
                  text-slate-800
                "
              >
                {
                  gvpData.length
                }
              </div>
            </div>

            <div
              className="
                px-5
                py-3
                bg-white
                rounded-[16px]
                border
                border-slate-200
                shadow-[0_7px_22px_rgba(15,23,42,0.10)]
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[10px]
                  uppercase
                  tracking-wide
                  font-semibold
                  text-slate-400
                "
              >
                <Factory
                  size={15}
                />

                Active Plants
              </div>

              <div
                className="
                  mt-1
                  text-[20px]
                  font-bold
                  text-slate-800
                "
              >
                {
                  activePlants
                }
              </div>
            </div>

            <div
              className="
                px-5
                py-3
                bg-white
                rounded-[16px]
                border
                border-slate-200
                shadow-[0_7px_22px_rgba(15,23,42,0.10)]
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[10px]
                  uppercase
                  tracking-wide
                  font-semibold
                  text-slate-400
                "
              >
                <Megaphone
                  size={15}
                />

                Open Grievances
              </div>

              <div
                className="
                  mt-1
                  text-[20px]
                  font-bold
                  text-slate-800
                "
              >
                {
                  openGrievances
                }
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            ROUTE INFO
        ================================================= */}

        {selectedView ===
          "route" &&
          routes.length >
            0 &&
          !loading && (
            <div
              className="
                absolute
                left-5
                bottom-5
                z-[1000]
                px-5
                py-3
                bg-white
                rounded-[16px]
                border
                border-slate-200
                shadow-[0_7px_22px_rgba(15,23,42,0.10)]
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-6
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <Truck
                    size={17}
                    className="text-violet-600"
                  />

                  <span
                    className="
                      text-[13px]
                      font-semibold
                      text-slate-700
                    "
                  >
                    {
                      routes.length
                    }{" "}
                    {routes.length ===
                    1
                      ? "Vehicle"
                      : "Vehicles"}
                  </span>
                </div>

                <div
                  className="
                    text-[12px]
                    text-slate-500
                    font-medium
                  "
                >
                  {totalGpsPoints.toLocaleString()}{" "}
                  GPS points
                </div>
              </div>
            </div>
          )}

        {/* =================================================
            ROUTE REFRESH
        ================================================= */}

        {selectedView ===
          "route" &&
          normalizedWard && (
          <button
            type="button"
            onClick={
              fetchRoutes
            }
            disabled={
              loading
            }
            title="Refresh route"
            className="
              absolute
              right-5
              bottom-5
              z-[1000]
              w-[46px]
              h-[46px]
              rounded-full
              bg-white
              border
              border-slate-200
              shadow-[0_7px_22px_rgba(15,23,42,0.12)]
              flex
              items-center
              justify-center
              hover:bg-slate-50
              transition
            "
          >
            <RefreshCw
              size={19}
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

        {selectedView ===
          "route" &&
          loading && (
          <div
            className="
              absolute
              inset-0
              z-[800]
              flex
              items-center
              justify-center
              bg-white/35
              backdrop-blur-[2px]
              pointer-events-none
            "
          >
            <div
              className="
                px-6
                py-4
                bg-white
                rounded-[18px]
                border
                border-slate-200
                shadow-[0_15px_40px_rgba(15,23,42,0.14)]
                flex
                items-center
                gap-3
              "
            >
              <Loader2
                size={20}
                className="
                  animate-spin
                  text-violet-600
                "
              />

              <span
                className="
                  text-[13px]
                  font-semibold
                  text-slate-700
                "
              >
                Loading vehicle
                routes...
              </span>
            </div>
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {selectedView ===
          "route" &&
          !loading &&
          error && (
          <div
            className="
              absolute
              left-1/2
              bottom-6
              -translate-x-1/2
              z-[1000]
            "
          >
            <div
              className="
                px-5
                py-3
                bg-white
                rounded-[16px]
                border
                border-slate-200
                shadow-[0_10px_30px_rgba(15,23,42,0.12)]
                flex
                items-center
                gap-3
                whitespace-nowrap
              "
            >
              <Truck
                size={18}
                className="text-violet-600"
              />

              <span
                className="
                  text-[12px]
                  font-semibold
                  text-slate-600
                "
              >
                {error}
              </span>
            </div>
          </div>
        )}

        {/* =================================================
            EMPTY GVP
        ================================================= */}

        {selectedView ===
          "gvp" &&
          gvpData.length ===
            0 && (
          <EmptyLayer
            icon={
              MapPin
            }
            title="Garbage Vulnerable Points"
            description="GVP locations will appear here once the GVP data source is connected."
          />
        )}

        {/* =================================================
            EMPTY PLANTS
        ================================================= */}

        {selectedView ===
          "plants" &&
          plantData.length ===
            0 && (
          <EmptyLayer
            icon={
              Factory
            }
            title="Plants Active"
            description="Active waste-processing plants will appear here once the plant data source is connected."
          />
        )}

        {/* =================================================
            EMPTY GRIEVANCES
        ================================================= */}

        {selectedView ===
          "grievances" &&
          grievanceData.length ===
            0 && (
          <EmptyLayer
            icon={
              Megaphone
            }
            title="Customer Grievances"
            description="Customer grievance locations will appear here once the grievance data source is connected."
          />
        )}
      </div>
    </section>
  );
}