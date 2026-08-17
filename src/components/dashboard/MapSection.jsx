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
  MapPinned,
  Route,
  Factory,
  Megaphone,
  Map as MapIcon,
  Loader2,
  Truck,
  ChevronDown,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Navigation,
} from "lucide-react";

import { ibbaluruBoundary } from "../../data/ibbaluruBoundary";

/* =========================================================
   API
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
  12.9716,
  77.5946,
];

const DEFAULT_ZOOM = 11;

/* =========================================================
   VEHICLE COLOR
========================================================= */

function getVehicleColor(
  vehicleNumber,
  index = 0,
) {
  if (!vehicleNumber) {
    return ROUTE_COLORS[
      index % ROUTE_COLORS.length
    ];
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

  return ROUTE_COLORS[
    Math.abs(hash) %
      ROUTE_COLORS.length
  ];
}

/* =========================================================
   DATE FORMATTER
========================================================= */

function formatDateForAPI(date) {
  if (!date) {
    const fallback =
      new Date();

    fallback.setDate(
      fallback.getDate() - 1,
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
        date,
      )
    ) {
      return date;
    }

    const parsed =
      new Date(date);

    if (
      !Number.isNaN(
        parsed.getTime(),
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

/* =========================================================
   LOCAL STORAGE
========================================================= */

function getStoredValue(
  ...keys
) {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  for (const key of keys) {
    const value =
      localStorage.getItem(
        key,
      );

    if (
      value !== null &&
      value !== undefined &&
      value !== ""
    ) {
      return value;
    }
  }

  return null;
}

/* =========================================================
   WARD NORMALIZER
========================================================= */

function normalizeWard(
  value,
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const match =
    String(value).match(
      /\d+/,
    );

  return match
    ? Number(match[0])
    : null;
}

/* =========================================================
   TRUCK ICON
========================================================= */

function createTruckIcon(
  color,
) {
  return L.divIcon({
    className:
      "sewac-truck-marker",

    html: `
      <div
        style="
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: white;
          border: 3px solid ${color};
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 5px 18px rgba(15,23,42,0.22);
        "
      >
        <div
          style="
            width: 29px;
            height: 29px;
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

    iconSize: [
      40,
      40,
    ],

    iconAnchor: [
      20,
      20,
    ],

    popupAnchor: [
      0,
      -22,
    ],
  });
}

/* =========================================================
   MAP RESIZE CONTROLLER
========================================================= */

function MapResizeController() {
  const map = useMap();

  useEffect(() => {
    const timer =
      setTimeout(() => {
        map.invalidateSize();
      }, 150);

    const handleResize =
      () => {
        map.invalidateSize();
      };

    window.addEventListener(
      "resize",
      handleResize,
    );

    return () => {
      clearTimeout(timer);

      window.removeEventListener(
        "resize",
        handleResize,
      );
    };
  }, [map]);

  return null;
}

/* =========================================================
   ROUTE FITTER
========================================================= */

function FitRouteBounds({
  vehicles,
}) {
  const map = useMap();

  useEffect(() => {
    if (
      !vehicles ||
      vehicles.length === 0
    ) {
      return;
    }

    const coordinates = [];

    vehicles.forEach(
      (vehicle) => {
        if (
          !Array.isArray(
            vehicle.points,
          )
        ) {
          return;
        }

        vehicle.points.forEach(
          (point) => {
            const lat =
              Number(
                point.latitude,
              );

            const lng =
              Number(
                point.longitude,
              );

            if (
              Number.isFinite(
                lat,
              ) &&
              Number.isFinite(
                lng,
              ) &&
              lat !== 0 &&
              lng !== 0
            ) {
              coordinates.push([
                lat,
                lng,
              ]);
            }
          },
        );
      },
    );

    if (
      coordinates.length ===
      0
    ) {
      return;
    }

    const bounds =
      L.latLngBounds(
        coordinates,
      );

    if (
      bounds.isValid()
    ) {
      map.fitBounds(
        bounds,
        {
          padding: [
            60,
            60,
          ],
          maxZoom: 16,
          animate: true,
        },
      );
    }
  }, [map, vehicles]);

  return null;
}

/* =========================================================
   BOUNDARY FITTER
========================================================= */

function FitBoundary({
  data,
}) {
  const map = useMap();

  useEffect(() => {
    if (!data) {
      return;
    }

    const layer =
      L.geoJSON(data);

    const bounds =
      layer.getBounds();

    if (
      bounds.isValid()
    ) {
      map.fitBounds(
        bounds,
        {
          padding: [
            40,
            40,
          ],
          maxZoom: 15,
          animate: true,
        },
      );
    }
  }, [map, data]);

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
        display: "flex",
        justifyContent:
          "space-between",
        gap: "12px",
        fontSize: "11px",
      }}
    >
      <span
        style={{
          color: "#64748B",
          fontWeight: 600,
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: "#0F172A",
          fontWeight: 600,
          textAlign:
            "right",
          maxWidth: "170px",
          wordBreak:
            "break-word",
        }}
      >
        {value ??
          "—"}
      </span>
    </div>
  );
}

/* =========================================================
   ROUTE POINT POPUP
========================================================= */

function RoutePointPopup({
  point,
  vehicleNumber,
}) {
  return (
    <div
      style={{
        minWidth:
          "245px",
        fontFamily:
          "Inter, Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems:
            "center",
          gap: "9px",
          marginBottom:
            "10px",
          paddingBottom:
            "9px",
          borderBottom:
            "1px solid #E5E7EB",
        }}
      >
        <div
          style={{
            width: "31px",
            height: "31px",
            borderRadius:
              "50%",
            background:
              "#F3E8FF",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
          }}
        >
          🚛
        </div>

        <div>
          <div
            style={{
              fontWeight: 700,
              fontSize:
                "14px",
              color:
                "#111827",
            }}
          >
            {vehicleNumber ||
              point?.vehicleNumber ||
              "Vehicle"}
          </div>

          <div
            style={{
              fontSize:
                "11px",
              color:
                "#6B7280",
              marginTop:
                "2px",
            }}
          >
            Telemetry Point
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: "7px",
        }}
      >
        <PopupRow
          label="Latitude"
          value={
            point?.latitude
          }
        />

        <PopupRow
          label="Longitude"
          value={
            point?.longitude
          }
        />

        <PopupRow
          label="IoT Timestamp"
          value={
            point?.iotTimestamp ||
            point?.iottimestamp
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

        <PopupRow
          label="RFID EPC"
          value={
            point?.rfidEpc
          }
        />

        <PopupRow
          label="Ward No"
          value={
            point?.wardNo
          }
        />
      </div>
    </div>
  );
}

/* =========================================================
   SIMPLE MAP MARKER
========================================================= */

function DataMarker({
  item,
  type,
}) {
  const latitude =
    Number(
      item?.latitude ??
        item?.lat,
    );

  const longitude =
    Number(
      item?.longitude ??
        item?.lng ??
        item?.lon,
    );

  if (
    !Number.isFinite(
      latitude,
    ) ||
    !Number.isFinite(
      longitude,
    )
  ) {
    return null;
  }

  let color =
    "#7C3AED";

  let icon =
    "📍";

  if (
    type === "gvp"
  ) {
    color =
      item?.severity ===
        "HIGH" ||
      item?.severity ===
        "CRITICAL"
        ? "#EF4444"
        : item?.severity ===
          "MEDIUM"
        ? "#F59E0B"
        : "#10B981";

    icon = "🗑️";
  }

  if (
    type === "plant"
  ) {
    color =
      item?.status ===
        "ACTIVE"
        ? "#10B981"
        : "#94A3B8";

    icon = "🏭";
  }

  if (
    type ===
    "grievance"
  ) {
    color =
      item?.priority ===
        "CRITICAL"
        ? "#DC2626"
        : item?.priority ===
          "HIGH"
        ? "#F97316"
        : "#F59E0B";

    icon = "⚠️";
  }

  return (
    <Marker
      position={[
        latitude,
        longitude,
      ]}
      icon={L.divIcon({
        className:
          "sewac-data-marker",
        html: `
          <div
            style="
              width:36px;
              height:36px;
              border-radius:50%;
              background:#fff;
              border:3px solid ${color};
              display:flex;
              align-items:center;
              justify-content:center;
              box-shadow:0 4px 15px rgba(15,23,42,.18);
              font-size:15px;
            "
          >
            ${icon}
          </div>
        `,
        iconSize: [
          36,
          36,
        ],
        iconAnchor: [
          18,
          18,
        ],
      })}
    >
      <Popup>
        <div
          style={{
            minWidth:
              "210px",
            fontFamily:
              "Inter, Arial, sans-serif",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize:
                "14px",
              marginBottom:
                "10px",
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

          <div
            style={{
              display:
                "grid",
              gap: "7px",
            }}
          >
            <PopupRow
              label="Name"
              value={
                item?.name ||
                item?.title ||
                item?.locationName
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
                    item?.frequency ??
                    item?.reports
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
        </div>
      </Popup>
    </Marker>
  );
}

/* =========================================================
   EMPTY VIEW
========================================================= */

function EmptyLayerView({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div
      className="
        absolute
        inset-0
        z-[500]
        flex
        items-center
        justify-center
        pointer-events-none
      "
    >
      <div
        className="
          bg-white/95
          backdrop-blur-md
          rounded-[24px]
          border
          border-slate-200
          shadow-[0_20px_60px_rgba(15,23,42,0.12)]
          px-10
          py-9
          text-center
          max-w-[390px]
        "
      >
        <div
          className="
            w-14
            h-14
            rounded-2xl
            bg-violet-50
            flex
            items-center
            justify-center
            mx-auto
            mb-5
          "
        >
          <Icon
            size={27}
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
            text-slate-500
            leading-relaxed
          "
        >
          {description}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function MapSection({
  mapView = "overview",
  selectedDate,
  wardNo,
  selectedWard,
  selectedDivision,
  divisionName,
}) {
  /* =======================================================
     VIEW
  ======================================================= */

  const [activeView, setActiveView] =
    useState(mapView);

  const [showViewMenu, setShowViewMenu] =
    useState(false);

  const menuRef =
    useRef(null);

  /* =======================================================
     ROUTES
  ======================================================= */

  const [routeData, setRouteData] =
    useState(null);

  const [routeLoading, setRouteLoading] =
    useState(false);

  const [routeError, setRouteError] =
    useState("");

  /* =======================================================
     RESOLVE WARD
  ======================================================= */

  const resolvedWardNo =
    normalizeWard(
      wardNo ??
        selectedWard ??
        getStoredValue(
          "wardNo",
          "wardId",
          "selectedWard",
          "selectedWardNo",
          "headerWardNo",
        ),
    );

  /* =======================================================
     DATE
  ======================================================= */

  const apiDate =
    formatDateForAPI(
      selectedDate ??
        getStoredValue(
          "selectedDate",
          "dashboardDate",
          "routeDate",
        ),
    );

  /* =======================================================
     MAP DATA PLACEHOLDERS
     
     These are deliberately state driven.
     Replace their setters with API responses when
     those endpoints are ready.
  ======================================================= */

  const [gvpData, setGvpData] =
    useState([]);

  const [plantData, setPlantData] =
    useState([]);

  const [grievanceData, setGrievanceData] =
    useState([]);

  /* =======================================================
     KEEP VIEW IN SYNC WITH PARENT
  ======================================================= */

  useEffect(() => {
    if (
      mapView &&
      mapView !== activeView
    ) {
      setActiveView(mapView);
    }
  }, [mapView]);

  /* =======================================================
     CLOSE DROPDOWN
  ======================================================= */

  useEffect(() => {
    const handleOutsideClick =
      (event) => {
        if (
          menuRef.current &&
          !menuRef.current.contains(
            event.target,
          )
        ) {
          setShowViewMenu(
            false,
          );
        }
      };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  /* =======================================================
     MAP VIEWS
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
        "Garbage Vulnerable Points",
      icon: MapPinned,
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

  const selectedMapView =
    mapViews.find(
      (view) =>
        view.id ===
        activeView,
    ) ||
    mapViews[0];

  const ActiveIcon =
    selectedMapView.icon;

  /* =======================================================
     FETCH ROUTES
  ======================================================= */

  const fetchRoutes =
    async () => {
      if (
        !resolvedWardNo
      ) {
        setRouteData(null);

        setRouteError(
          "Please select a ward from the header.",
        );

        return;
      }

      setRouteLoading(true);
      setRouteError("");

      try {
        const url =
          `${API_BASE_URL}/route-map` +
          `?date=${encodeURIComponent(
            apiDate,
          )}` +
          `&wardNo=${encodeURIComponent(
            resolvedWardNo,
          )}`;

        console.log(
          "====================================",
        );

        console.log(
          "🚛 SEWAC ROUTE MAP",
        );

        console.log(
          "DATE:",
          apiDate,
        );

        console.log(
          "WARD:",
          resolvedWardNo,
        );

        console.log(
          "URL:",
          url,
        );

        console.log(
          "====================================",
        );

        const response =
          await fetch(url, {
            method: "GET",
            headers: {
              Accept:
                "application/json",
            },
          });

        const json =
          await response.json();

        if (
          !response.ok
        ) {
          throw new Error(
            json?.message ||
              `Route API returned HTTP ${response.status}`,
          );
        }

        /*
          Support both:

          {
            success:true,
            vehicles:[]
          }

          AND

          {
            success:true,
            data:{
              vehicles:[]
            }
          }
        */

        const payload =
          json?.data &&
          typeof json.data ===
            "object" &&
          !Array.isArray(
            json.data,
          )
            ? json.data
            : json;

        const vehicles =
          Array.isArray(
            payload?.vehicles,
          )
            ? payload.vehicles
            : [];

        const normalizedVehicles =
          vehicles
            .map(
              (
                vehicle,
                vehicleIndex,
              ) => {
                const rawPoints =
                  Array.isArray(
                    vehicle?.points,
                  )
                    ? vehicle.points
                    : Array.isArray(
                        vehicle?.route,
                      )
                    ? vehicle.route
                    : [];

                const points =
                  rawPoints
                    .map(
                      (
                        point,
                      ) => {
                        const latitude =
                          Number(
                            point?.latitude,
                          );

                        const longitude =
                          Number(
                            point?.longitude,
                          );

                        if (
                          !Number.isFinite(
                            latitude,
                          ) ||
                          !Number.isFinite(
                            longitude,
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

                          iotTimestamp:
                            point?.iotTimestamp ||
                            point?.iottimestamp ||
                            point?.timestamp ||
                            point?.createdAt ||
                            null,
                        };
                      },
                    )
                    .filter(
                      Boolean,
                    );

                /*
                  Chronological sorting.
                */

                points.sort(
                  (
                    a,
                    b,
                  ) => {
                    const timeA =
                      new Date(
                        a.iotTimestamp ||
                          0,
                      ).getTime();

                    const timeB =
                      new Date(
                        b.iotTimestamp ||
                          0,
                      ).getTime();

                    if (
                      Number.isNaN(
                        timeA,
                      ) ||
                      Number.isNaN(
                        timeB,
                      )
                    ) {
                      return 0;
                    }

                    return (
                      timeA -
                      timeB
                    );
                  },
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

                  points,

                  color:
                    getVehicleColor(
                      vehicleNumber,
                      vehicleIndex,
                    ),
                };
              },
            )
            .filter(
              (
                vehicle,
              ) =>
                vehicle.points
                  .length >
                0,
            );

        setRouteData({
          ...payload,
          vehicles:
            normalizedVehicles,
        });

        if (
          normalizedVehicles.length ===
          0
        ) {
          setRouteError(
            payload?.message ||
              `No route data available for Ward ${resolvedWardNo}.`,
          );
        }
      } catch (error) {
        console.error(
          "❌ ROUTE MAP ERROR:",
          error,
        );

        setRouteData(
          null,
        );

        setRouteError(
          error?.message ||
            "Unable to load route data.",
        );
      } finally {
        setRouteLoading(
          false,
        );
      }
    };

  /* =======================================================
     ROUTE FETCH TRIGGER
  ======================================================= */

  useEffect(() => {
    if (
      activeView !==
      "route"
    ) {
      return;
    }

    fetchRoutes();
  }, [
    activeView,
    resolvedWardNo,
    apiDate,
  ]);

  /* =======================================================
     VEHICLES
  ======================================================= */

  const vehicles =
    useMemo(
      () =>
        Array.isArray(
          routeData?.vehicles,
        )
          ? routeData.vehicles
          : [],
      [routeData],
    );

  /* =======================================================
     TOTAL GPS
  ======================================================= */

  const totalGpsPoints =
    useMemo(
      () =>
        vehicles.reduce(
          (
            total,
            vehicle,
          ) =>
            total +
            vehicle.points
              .length,
          0,
        ),
      [vehicles],
    );

  /* =======================================================
     OVERVIEW STATS
  ======================================================= */

  const overviewStats = [
    {
      label:
        "Active Vehicles",
      value:
        vehicles.length ||
        "—",
      icon: Truck,
    },

    {
      label:
        "Vulnerable Points",
      value:
        gvpData.length ||
        "—",
      icon: AlertTriangle,
    },

    {
      label:
        "Active Plants",
      value:
        plantData.filter(
          (plant) =>
            String(
              plant?.status,
            ).toUpperCase() ===
            "ACTIVE",
        ).length ||
        "—",
      icon: Factory,
    },

    {
      label:
        "Open Grievances",
      value:
        grievanceData.filter(
          (item) =>
            String(
              item?.status,
            ).toUpperCase() !==
            "RESOLVED",
        ).length ||
        "—",
      icon: Megaphone,
    },
  ];

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
          HEADER
      ================================================= */}

      <div
        className="
          mb-5
          px-1
          flex
          items-end
          justify-between
          gap-5
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
            City operations, vehicle
            routes, vulnerable points,
            plants and grievances
          </p>
        </div>

        <div
          className="
            hidden
            md:flex
            items-center
            gap-2
            text-[12px]
            font-medium
            text-slate-500
          "
        >
          {selectedDivision ||
            divisionName ||
            "All Divisions"}

          <span className="text-slate-300">
            /
          </span>

          {resolvedWardNo
            ? `Ward ${resolvedWardNo}`
            : "All Wards"}
        </div>
      </div>

      {/* =================================================
          MAP
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
        <MapContainer
          center={
            DEFAULT_CENTER
          }
          zoom={
            DEFAULT_ZOOM
          }
          zoomControl={false}
          scrollWheelZoom
          style={{
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        >
          {/* =================================================
              MAP RESIZE
          ================================================= */}

          <MapResizeController />

          {/* =================================================
              ZOOM
          ================================================= */}

          <ZoomControl
            position="bottomright"
          />

          {/* =================================================
              BASE MAP
          ================================================= */}

          <TileLayer
            attribution='&copy; OpenStreetMap contributors &copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          {/* =================================================
              CITY OVERVIEW
          ================================================= */}

          {activeView ===
            "overview" && (
            <>
              <FitBoundary
                data={
                  ibbaluruBoundary
                }
              />

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
                    0.10,
                }}
                onEachFeature={(
                  feature,
                  layer,
                ) => {
                  layer.bindPopup(`
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
                  `);
                }}
              />

              {/* Current vehicle indicators */}

              {vehicles.map(
                (
                  vehicle,
                  index,
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
                        vehicle.color,
                      )}
                    >
                      <Popup>
                        <div
                          style={{
                            minWidth:
                              "190px",
                          }}
                        >
                          <strong>
                            {
                              vehicle.vehicleNumber
                            }
                          </strong>

                          <br />

                          <span>
                            Active
                            vehicle
                          </span>

                          <br />

                          <span>
                            Ward{" "}
                            {
                              resolvedWardNo
                            }
                          </span>
                        </div>
                      </Popup>
                    </Marker>
                  );
                },
              )}

              {/* GVP overview */}

              {gvpData.map(
                (
                  item,
                  index,
                ) => (
                  <DataMarker
                    key={`overview-gvp-${item?.id || index}`}
                    item={item}
                    type="gvp"
                  />
                ),
              )}

              {/* Plants overview */}

              {plantData.map(
                (
                  item,
                  index,
                ) => (
                  <DataMarker
                    key={`overview-plant-${item?.id || index}`}
                    item={item}
                    type="plant"
                  />
                ),
              )}

              {/* Grievances overview */}

              {grievanceData.map(
                (
                  item,
                  index,
                ) => (
                  <DataMarker
                    key={`overview-grievance-${item?.id || index}`}
                    item={item}
                    type="grievance"
                  />
                ),
              )}
            </>
          )}

          {/* =================================================
              ROUTE MAP
          ================================================= */}

          {activeView ===
            "route" && (
            <>
              <FitRouteBounds
                vehicles={
                  vehicles
                }
              />

              {vehicles.map(
                (
                  vehicle,
                  vehicleIndex,
                ) => {
                  const positions =
                    vehicle.points.map(
                      (
                        point,
                      ) =>
                        point.position,
                    );

                  if (
                    positions.length <
                    1
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

                  const start =
                    positions[0];

                  return (
                    <div
                      key={`${vehicle.vehicleNumber}-${vehicleIndex}`}
                    >
                      {/* Route glow */}

                      {positions.length >
                        1 && (
                        <Polyline
                          positions={
                            positions
                          }
                          pathOptions={{
                            color:
                              vehicle.color,
                            weight: 9,
                            opacity:
                              0.14,
                            lineCap:
                              "round",
                            lineJoin:
                              "round",
                          }}
                        />
                      )}

                      {/* Main route */}

                      {positions.length >
                        1 && (
                        <Polyline
                          positions={
                            positions
                          }
                          pathOptions={{
                            color:
                              vehicle.color,
                            weight: 4,
                            opacity:
                              0.95,
                            lineCap:
                              "round",
                            lineJoin:
                              "round",
                          }}
                        />
                      )}

                      {/* Telemetry points */}

                      {vehicle.points.map(
                        (
                          point,
                          pointIndex,
                        ) => (
                          <CircleMarker
                            key={`${vehicle.vehicleNumber}-point-${pointIndex}`}
                            center={
                              point.position
                            }
                            radius={5}
                            pathOptions={{
                              color:
                                "#FFFFFF",
                              weight: 2,
                              fillColor:
                                vehicle.color,
                              fillOpacity:
                                0.95,
                            }}
                          >
                            <Popup
                              maxWidth={
                                340
                              }
                            >
                              <RoutePointPopup
                                point={
                                  point
                                }
                                vehicleNumber={
                                  vehicle.vehicleNumber
                                }
                              />
                            </Popup>
                          </CircleMarker>
                        ),
                      )}

                      {/* Start */}

                      <CircleMarker
                        center={
                          start
                        }
                        radius={
                          9
                        }
                        pathOptions={{
                          color:
                            vehicle.color,
                          weight: 3,
                          fillColor:
                            "#FFFFFF",
                          fillOpacity:
                            1,
                        }}
                      >
                        <Popup>
                          <strong>
                            {
                              vehicle.vehicleNumber
                            }
                          </strong>

                          <br />

                          Route Start
                        </Popup>
                      </CircleMarker>

                      {/* Latest */}

                      {latest && (
                        <Marker
                          position={
                            latest.position
                          }
                          icon={createTruckIcon(
                            vehicle.color,
                          )}
                        >
                          <Popup>
                            <div
                              style={{
                                minWidth:
                                  "200px",
                              }}
                            >
                              <strong>
                                {
                                  vehicle.vehicleNumber
                                }
                              </strong>

                              <br />

                              <span
                                style={{
                                  color:
                                    "#64748B",
                                  fontSize:
                                    "12px",
                                }}
                              >
                                Latest
                                vehicle
                                position
                              </span>

                              <div
                                style={{
                                  marginTop:
                                    "8px",
                                }}
                              >
                                {latest.latitude.toFixed(
                                  6,
                                )}
                                ,{" "}
                                {latest.longitude.toFixed(
                                  6,
                                )}
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      )}
                    </div>
                  );
                },
              )}
            </>
          )}

          {/* =================================================
              GVP
          ================================================= */}

          {activeView ===
            "gvp" && (
            <>
              {gvpData.map(
                (
                  item,
                  index,
                ) => (
                  <DataMarker
                    key={`gvp-${item?.id || index}`}
                    item={item}
                    type="gvp"
                  />
                ),
              )}
            </>
          )}

          {/* =================================================
              PLANTS
          ================================================= */}

          {activeView ===
            "plants" && (
            <>
              {plantData.map(
                (
                  item,
                  index,
                ) => (
                  <DataMarker
                    key={`plant-${item?.id || index}`}
                    item={item}
                    type="plant"
                  />
                ),
              )}
            </>
          )}

          {/* =================================================
              GRIEVANCES
          ================================================= */}

          {activeView ===
            "grievances" && (
            <>
              {grievanceData.map(
                (
                  item,
                  index,
                ) => (
                  <DataMarker
                    key={`grievance-${item?.id || index}`}
                    item={item}
                    type="grievance"
                  />
                ),
              )}
            </>
          )}
        </MapContainer>

        {/* =================================================
            VIEW SELECTOR
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
                  previous,
                ) =>
                  !previous,
              )
            }
            className="
              w-[410px]
              max-w-[calc(100vw-50px)]
              h-[68px]
              px-6
              bg-white
              rounded-[18px]
              border
              border-slate-200
              shadow-[0_8px_25px_rgba(15,23,42,0.12)]
              flex
              items-center
              justify-between
              transition
              hover:shadow-[0_12px_30px_rgba(15,23,42,0.16)]
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
                strokeWidth={
                  2
                }
                style={{
                  color:
                    selectedMapView.color,
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
                  selectedMapView.label
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
                top-[76px]
                left-0
                w-[410px]
                max-w-[calc(100vw-50px)]
                rounded-[18px]
                bg-white
                border
                border-slate-200
                shadow-[0_15px_40px_rgba(15,23,42,0.16)]
                overflow-hidden
              "
            >
              {mapViews.map(
                (
                  view,
                ) => {
                  const Icon =
                    view.icon;

                  const isActive =
                    activeView ===
                    view.id;

                  return (
                    <button
                      key={
                        view.id
                      }
                      type="button"
                      onClick={() => {
                        setActiveView(
                          view.id,
                        );

                        setShowViewMenu(
                          false,
                        );
                      }}
                      className={`
                        w-full
                        px-6
                        py-4
                        flex
                        items-center
                        justify-between
                        transition
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
                          gap-4
                        "
                      >
                        <Icon
                          size={22}
                          style={{
                            color:
                              view.color,
                          }}
                        />

                        <span
                          className="
                            text-[14px]
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
                            19
                          }
                          style={{
                            color:
                              view.color,
                          }}
                        />
                      )}
                    </button>
                  );
                },
              )}
            </div>
          )}
        </div>

        {/* =================================================
            MAP CONTEXT CARD
        ================================================= */}

        <div
          className="
            absolute
            right-5
            top-5
            z-[1000]
            flex
            gap-3
          "
        >
          {/* Division */}

          <div
            className="
              min-w-[180px]
              px-5
              py-3
              rounded-[16px]
              bg-white
              border
              border-slate-200
              shadow-[0_8px_25px_rgba(15,23,42,0.08)]
            "
          >
            <div
              className="
                text-[10px]
                font-bold
                tracking-[0.08em]
                text-slate-400
                uppercase
              "
            >
              DIVISION
            </div>

            <div
              className="
                mt-1
                text-[14px]
                font-semibold
                text-slate-700
              "
            >
              {selectedDivision ||
                divisionName ||
                "All Divisions"}
            </div>
          </div>

          {/* Ward */}

          <div
            className="
              min-w-[150px]
              px-5
              py-3
              rounded-[16px]
              bg-white
              border
              border-slate-200
              shadow-[0_8px_25px_rgba(15,23,42,0.08)]
            "
          >
            <div
              className="
                text-[10px]
                font-bold
                tracking-[0.08em]
                text-slate-400
                uppercase
              "
            >
              WARD
            </div>

            <div
              className="
                mt-1
                text-[14px]
                font-semibold
                text-slate-700
              "
            >
              {resolvedWardNo
                ? `Ward ${resolvedWardNo}`
                : "All Wards"}
            </div>
          </div>
        </div>

        {/* =================================================
            OVERVIEW STATS
        ================================================= */}

        {activeView ===
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
            {overviewStats.map(
              (
                stat,
              ) => {
                const Icon =
                  stat.icon;

                return (
                  <div
                    key={
                      stat.label
                    }
                    className="
                      min-w-[145px]
                      px-4
                      py-3
                      rounded-[16px]
                      bg-white
                      border
                      border-slate-200
                      shadow-[0_8px_25px_rgba(15,23,42,0.10)]
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <Icon
                        size={
                          16
                        }
                        className="text-slate-400"
                      />

                      <span
                        className="
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-wide
                          text-slate-400
                        "
                      >
                        {
                          stat.label
                        }
                      </span>
                    </div>

                    <div
                      className="
                        mt-1
                        text-[19px]
                        font-bold
                        text-slate-800
                      "
                    >
                      {
                        stat.value
                      }
                    </div>
                  </div>
                );
              },
            )}
          </div>
        )}

        {/* =================================================
            ROUTE INFO
        ================================================= */}

        {activeView ===
          "route" &&
          !routeLoading &&
          vehicles.length >
            0 && (
            <div
              className="
                absolute
                left-5
                bottom-5
                z-[1000]
                px-5
                py-3
                rounded-[16px]
                bg-white
                border
                border-slate-200
                shadow-[0_8px_25px_rgba(15,23,42,0.10)]
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-5
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
                    size={
                      17
                    }
                    className="text-slate-500"
                  />

                  <span
                    className="
                      text-[13px]
                      font-semibold
                      text-slate-700
                    "
                  >
                    {
                      vehicles.length
                    }{" "}
                    {vehicles.length ===
                    1
                      ? "Vehicle"
                      : "Vehicles"}
                  </span>
                </div>

                <div
                  className="
                    text-[12px]
                    font-medium
                    text-slate-500
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

        {activeView ===
          "route" && (
          <button
            type="button"
            onClick={
              fetchRoutes
            }
            disabled={
              routeLoading
            }
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
              shadow-[0_8px_25px_rgba(15,23,42,0.10)]
              flex
              items-center
              justify-center
              hover:bg-slate-50
              transition
            "
            title="Refresh route"
          >
            <RefreshCw
              size={18}
              className={
                routeLoading
                  ? "animate-spin text-violet-600"
                  : "text-slate-600"
              }
            />
          </button>
        )}

        {/* =================================================
            ROUTE LOADING
        ================================================= */}

        {activeView ===
          "route" &&
          routeLoading && (
          <div
            className="
              absolute
              inset-0
              z-[900]
              flex
              items-center
              justify-center
              bg-white/45
              backdrop-blur-[2px]
              pointer-events-none
            "
          >
            <div
              className="
                bg-white
                rounded-[18px]
                border
                border-slate-200
                shadow-[0_15px_40px_rgba(15,23,42,0.14)]
                px-6
                py-4
                flex
                items-center
                gap-3
              "
            >
              <Loader2
                size={20}
                className="
                  text-violet-600
                  animate-spin
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
            ROUTE ERROR
        ================================================= */}

        {activeView ===
          "route" &&
          !routeLoading &&
          routeError && (
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
                bg-white
                border
                border-slate-200
                shadow-[0_15px_40px_rgba(15,23,42,0.12)]
                rounded-[16px]
                px-5
                py-3
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
                {
                  routeError
                }
              </span>
            </div>
          </div>
        )}

        {/* =================================================
            GVP EMPTY
        ================================================= */}

        {activeView ===
          "gvp" &&
          gvpData.length ===
            0 && (
          <EmptyLayerView
            icon={
              MapPinned
            }
            title="Garbage Vulnerable Points"
            description="The GVP layer is ready. Connect the GVP endpoint here and its locations will appear directly on the map."
          />
        )}

        {/* =================================================
            PLANTS EMPTY
        ================================================= */}

        {activeView ===
          "plants" &&
          plantData.length ===
            0 && (
          <EmptyLayerView
            icon={
              Factory
            }
            title="Plants Active"
            description="The plant layer is ready. Connect the plants endpoint here and active processing plants will appear on the map."
          />
        )}

        {/* =================================================
            GRIEVANCES EMPTY
        ================================================= */}

        {activeView ===
          "grievances" &&
          grievanceData.length ===
            0 && (
          <EmptyLayerView
            icon={
              Megaphone
            }
            title="Customer Grievances"
            description="The grievance layer is ready. Connect the grievances endpoint here and customer complaints will appear on the map."
          />
        )}
      </div>
    </section>
  );
}