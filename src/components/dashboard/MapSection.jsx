import {
  useState,
  useRef,
  useEffect,
  useMemo,
  Fragment,
} from "react";

import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  CircleMarker,
  GeoJSON,
  ZoomControl,
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
  RefreshCw,
  Check,
  Loader2,
} from "lucide-react";

import "leaflet/dist/leaflet.css";

import { ibbaluruBoundary } from "../../data/ibbaluruBoundary";

/* =========================================================
   API
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://sewac-main.onrender.com/api";

/* =========================================================
   ROUTE COLORS

   Same vehicle number = same color.
========================================================= */

const ROUTE_COLORS = [
  "#7C3AED",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#3B82F6",
  "#14B8A6",
  "#F97316",
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

const getVehicleColor = (
  vehicleNumber,
  index = 0
) => {
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
};

/* =========================================================
   SAFE LOCAL STORAGE
========================================================= */

const getStoredValue = (
  ...keys
) => {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
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

  return null;
};

/* =========================================================
   NORMALIZE WARD
========================================================= */

const normalizeWard = (
  value
) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const match =
    String(value).match(
      /\d+/
    );

  return match
    ? Number(match[0])
    : null;
};

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDateForAPI = (
  date
) => {
  if (!date) {
    const fallback =
      new Date();

    /*
      Route data normally represents
      the completed previous day.
    */

    fallback.setDate(
      fallback.getDate() - 1
    );

    const year =
      fallback.getFullYear();

    const month =
      String(
        fallback.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        fallback.getDate()
      ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  if (
    typeof date ===
    "string"
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
      const year =
        parsed.getFullYear();

      const month =
        String(
          parsed.getMonth() + 1
        ).padStart(2, "0");

      const day =
        String(
          parsed.getDate()
        ).padStart(2, "0");

      return `${year}-${month}-${day}`;
    }

    return date;
  }

  if (
    date instanceof Date
  ) {
    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        date.getDate()
      ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  return formatDateForAPI(
    null
  );
};

/* =========================================================
   TRUCK ICON
========================================================= */

const createTruckIcon = (
  color
) => {
  return L.divIcon({
    className:
      "sewac-truck-marker",

    html: `
      <div
        style="
          width:42px;
          height:42px;
          border-radius:50%;
          background:white;
          border:3px solid ${color};
          display:flex;
          align-items:center;
          justify-content:center;
          box-shadow:0 5px 18px rgba(15,23,42,0.20);
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
};

/* =========================================================
   MAP CONTROLLER
========================================================= */

function MapController({
  routes,
  selectedView,
}) {
  const map =
    useMap();

  /* -------------------------------------------------------
     MAP RESIZE
  ------------------------------------------------------- */

  useEffect(() => {
    if (!map) {
      return;
    }

    const timeout =
      setTimeout(() => {
        map.invalidateSize();
      }, 250);

    const handleResize =
      () => {
        map.invalidateSize();
      };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      clearTimeout(
        timeout
      );

      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, [map]);

  /* -------------------------------------------------------
     FIT ROUTE
  ------------------------------------------------------- */

  useEffect(() => {
    if (
      selectedView !==
      "route"
    ) {
      return;
    }

    if (
      !routes ||
      routes.length === 0
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
            const latitude =
              Number(
                point.latitude
              );

            const longitude =
              Number(
                point.longitude
              );

            if (
              Number.isFinite(
                latitude
              ) &&
              Number.isFinite(
                longitude
              ) &&
              latitude !== 0 &&
              longitude !== 0
            ) {
              coordinates.push([
                latitude,
                longitude,
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

    try {
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
    } catch (
      error
    ) {
      console.error(
        "Failed to fit route bounds:",
        error
      );
    }
  }, [
    routes,
    selectedView,
    map,
  ]);

  /* -------------------------------------------------------
     CITY OVERVIEW
  ------------------------------------------------------- */

  useEffect(() => {
    if (
      selectedView !==
      "overview"
    ) {
      return;
    }

    if (
      !ibbaluruBoundary
    ) {
      return;
    }

    try {
      const layer =
        L.geoJSON(
          ibbaluruBoundary
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
    } catch (
      error
    ) {
      console.error(
        "Failed to fit ward boundary:",
        error
      );
    }
  }, [
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
   PLACEHOLDER VIEW
========================================================= */

function PlaceholderView({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div
      className="
        absolute
        inset-0
        z-[700]
        pointer-events-none
        flex
        items-center
        justify-center
      "
    >
      <div
        className="
          bg-white/95
          backdrop-blur-sm
          border
          border-slate-200
          rounded-[20px]
          px-8
          py-7
          shadow-[0_15px_45px_rgba(15,23,42,0.12)]
          text-center
          max-w-[380px]
        "
      >
        <div
          className="
            mx-auto
            mb-4
            w-12
            h-12
            rounded-2xl
            bg-violet-50
            flex
            items-center
            justify-center
          "
        >
          <Icon
            size={23}
            className="text-violet-600"
          />
        </div>

        <h3
          className="
            text-[16px]
            font-semibold
            text-slate-800
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-2
            text-[12px]
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
   MAIN COMPONENT
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

  /*
    IMPORTANT:
    Screenshot shows Route Map selected initially.
  */

  const [
    selectedView,
    setSelectedView,
  ] = useState(
    "route"
  );

  const [
    showViewMenu,
    setShowViewMenu,
  ] = useState(false);

  const menuRef =
    useRef(null);

  /* =======================================================
     ROUTE DATA
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

  /* =======================================================
     HEADER DATA
  ======================================================= */

  const selectedWard =
    selectedWardProp ??
    wardNoProp ??
    getStoredValue(
      "selectedWard",
      "selectedWardNo",
      "wardNo",
      "ward",
      "selected_ward",
      "headerWardNo"
    );

  const selectedDivision =
    selectedDivisionProp ??
    divisionNameProp ??
    getStoredValue(
      "selectedDivision",
      "divisionName",
      "division",
      "selected_division",
      "headerDivision"
    );

  /* =======================================================
     NORMALIZED WARD
  ======================================================= */

  const normalizedWard =
    useMemo(() => {
      return normalizeWard(
        selectedWard
      );
    }, [
      selectedWard,
    ]);

  /* =======================================================
     DATE
  ======================================================= */

  const apiDate =
    useMemo(() => {
      if (
        selectedDateProp
      ) {
        return formatDateForAPI(
          selectedDateProp
        );
      }

      const storedDate =
        getStoredValue(
          "selectedDate",
          "dashboardDate",
          "routeDate"
        );

      return formatDateForAPI(
        storedDate
      );
    }, [
      selectedDateProp,
    ]);

  /* =======================================================
     MAP VIEW OPTIONS

     EXACTLY FIVE OPTIONS
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
      id: "complaints",

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
    mapViews[1];

  const ActiveIcon =
    activeView.icon;

  /* =======================================================
     FETCH ROUTES
  ======================================================= */

  const fetchRoutes =
    async () => {
      /*
        Route requires ward.
      */

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

        let json =
          null;

        try {
          json =
            await response.json();
        } catch {
          throw new Error(
            "The route server returned an invalid response."
          );
        }

        if (
          !response.ok
        ) {
          throw new Error(
            json?.message ||
              `Route API returned HTTP ${response.status}`
          );
        }

        /*
          Backend may return:

          {
            success: true,
            vehicles: []
          }

          OR:

          {
            success: true,
            data: {
              vehicles: []
            }
          }
        */

        const payload =
          json?.data &&
          typeof json.data ===
            "object" &&
          !Array.isArray(
            json.data
          )
            ? json.data
            : json;

        const rawVehicles =
          Array.isArray(
            payload?.vehicles
          )
            ? payload.vehicles
            : [];

        /*
          Normalize every vehicle.
        */

        const normalizedVehicles =
          rawVehicles
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

                /*
                  Convert GPS values to
                  numeric Leaflet positions.
                */

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

                /*
                  Sort telemetry
                  chronologically.
                */

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
          "🚛 NORMALIZED VEHICLES:",
          normalizedVehicles
        );

        setRoutes(
          normalizedVehicles
        );

        /*
          Do not show an error
          when there is simply no
          route data.
        */

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
          "❌ Route Map Error:",
          fetchError
        );

        setRoutes([]);

        setError(
          fetchError?.message ||
            "Failed to load route data."
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  /* =======================================================
     FETCH ROUTES WHEN:

     - Route Map selected
     - Ward changes
     - Date changes
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
     STORAGE EVENT

     Header may update localStorage.
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
     CLOSE DROPDOWN
  ======================================================= */

  useEffect(() => {
    const handleOutside =
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
      handleOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutside
      );
    };
  }, []);

  /* =======================================================
     ROUTE STATS
  ======================================================= */

  const totalGpsPoints =
    routes.reduce(
      (
        total,
        vehicle
      ) =>
        total +
        vehicle.points
          .length,
      0
    );

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
        border-[#E4EAF1]
        shadow-[0_2px_12px_rgba(15,23,42,0.05)]
        p-7
      "
    >
      {/* =================================================
          TITLE
      ================================================= */}

      <div
        className="
          mb-7
          px-1
        "
      >
        <h2
          className="
            text-[28px]
            font-semibold
            tracking-[-0.025em]
            text-[#07111F]
          "
        >
          CITY OVERVIEW MAP
        </h2>
      </div>

      {/* =================================================
          MAP FRAME
      ================================================= */}

      <div
        className="
          relative
          w-full
          h-[700px]
          overflow-hidden
          rounded-[25px]
          border
          border-[#E0E6ED]
          bg-[#EEF2F4]
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
          scrollWheelZoom={
            true
          }
          zoomControl={
            false
          }
          style={{
            width:
              "100%",
            height:
              "100%",
            zIndex: 1,
          }}
        >
          {/* =================================================
              MAP TILES

              Standard OSM appearance,
              matching the screenshot.
          ================================================= */}

          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* =================================================
              ZOOM
          ================================================= */}

          <ZoomControl
            position="topleft"
          />

          {/* =================================================
              CONTROLLER
          ================================================= */}

          <MapController
            routes={
              routes
            }
            selectedView={
              selectedView
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

                  opacity:
                    0.95,

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

                        <br />

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
            </>
          )}

          {/* =================================================
              ROUTE MAP
          ================================================= */}

          {selectedView ===
            "route" &&
            routes.map(
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

                const latestPoint =
                  vehicle.points[
                    vehicle.points
                      .length -
                      1
                  ];

                return (
                  <Fragment
                    key={`${vehicle.vehicleNumber}-${vehicleIndex}`}
                  >
                    {/* =======================================
                        ROUTE GLOW
                    ======================================= */}

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
                            10,

                          opacity:
                            0.13,

                          lineCap:
                            "round",

                          lineJoin:
                            "round",
                        }}
                      />
                    )}

                    {/* =======================================
                        MAIN ROUTE
                    ======================================= */}

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
                            5,

                          opacity:
                            0.9,

                          lineCap:
                            "round",

                          lineJoin:
                            "round",
                        }}
                      />
                    )}

                    {/* =======================================
                        GPS POINTS
                    ======================================= */}

                    {vehicle.points.map(
                      (
                        point,
                        pointIndex
                      ) => (
                        <CircleMarker
                          key={`${vehicle.vehicleNumber}-point-${pointIndex}`}
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
                              1,
                          }}
                        >
                          <Popup>
                            <div
                              style={{
                                minWidth:
                                  "240px",

                                fontFamily:
                                  "Inter, Arial, sans-serif",
                              }}
                            >
                              <div
                                style={{
                                  fontSize:
                                    "15px",

                                  fontWeight:
                                    700,

                                  color:
                                    "#0F172A",

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
                                label="Ward"
                                value={
                                  point?.wardNo ??
                                  normalizedWard ??
                                  "—"
                                }
                              />

                              <PopupRow
                                label="Timestamp"
                                value={
                                  point?.iotTimestamp ||
                                  point?.iottimestamp ||
                                  point?.receivedtimestamp ||
                                  point?.timestamp ||
                                  point?.createdAt
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

                    {/* =======================================
                        CURRENT VEHICLE
                    ======================================= */}

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
                              minWidth:
                                "220px",

                              fontFamily:
                                "Inter, Arial, sans-serif",
                            }}
                          >
                            <div
                              style={{
                                fontSize:
                                  "15px",

                                fontWeight:
                                  700,

                                color:
                                  "#0F172A",

                                marginBottom:
                                  "12px",
                              }}
                            >
                              {
                                vehicle.vehicleNumber
                              }
                            </div>

                            <PopupRow
                              label="Ward"
                              value={
                                normalizedWard ??
                                "—"
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
                              value={latestPoint.latitude.toFixed(
                                6
                              )}
                            />

                            <PopupRow
                              label="Longitude"
                              value={latestPoint.longitude.toFixed(
                                6
                              )}
                            />
                          </div>
                        </Popup>
                      </Marker>
                    )}
                  </Fragment>
                );
              }
            )}

          {/* =================================================
              GVP

              UI is ready.
              Real API can be connected here.
          ================================================= */}

          {selectedView ===
            "gvp" && (
            <PlaceholderView
              icon={
                MapPin
              }
              title="Garbage Vulnerable Points"
              description="GVP locations will be displayed here once the GVP data endpoint is connected."
            />
          )}

          {/* =================================================
              PLANTS
          ================================================= */}

          {selectedView ===
            "plants" && (
            <PlaceholderView
              icon={
                Factory
              }
              title="Plants Active"
              description="Active waste-processing plants will be displayed here once the plant data endpoint is connected."
            />
          )}

          {/* =================================================
              CUSTOMER GRIEVANCES
          ================================================= */}

          {selectedView ===
            "complaints" && (
            <PlaceholderView
              icon={
                Megaphone
              }
              title="Customer Grievances"
              description="Customer grievance locations will be displayed here once the grievance data endpoint is connected."
            />
          )}
        </MapContainer>

        {/* =================================================
            TOP LEFT MAP SELECTOR
        ================================================= */}

        <div
          ref={menuRef}
          className="
            absolute
            left-6
            top-6
            z-[1000]
          "
        >
          {/* ===============================================
              SELECTED VIEW BUTTON
          =============================================== */}

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
              w-[570px]
              max-w-[calc(100vw-48px)]
              h-[88px]
              rounded-[20px]
              bg-white
              border
              border-[#E0E6ED]
              shadow-[0_8px_25px_rgba(15,23,42,0.12)]
              px-8
              flex
              items-center
              justify-between
              transition-all
              duration-200
              hover:shadow-[0_12px_32px_rgba(15,23,42,0.16)]
            "
          >
            <div
              className="
                flex
                items-center
                gap-6
              "
            >
              <ActiveIcon
                size={30}
                strokeWidth={
                  2
                }
                style={{
                  color:
                    activeView.color,
                }}
              />

              <span
                className="
                  text-[24px]
                  font-semibold
                  tracking-[-0.02em]
                  text-[#33445D]
                "
              >
                {
                  activeView.label
                }
              </span>
            </div>

            <ChevronDown
              size={27}
              strokeWidth={
                2
              }
              className={`
                text-[#33445D]
                transition-transform
                duration-200
                ${
                  showViewMenu
                    ? "rotate-180"
                    : ""
                }
              `}
            />
          </button>

          {/* ===============================================
              DROPDOWN
          =============================================== */}

          {showViewMenu && (
            <div
              className="
                absolute
                left-0
                top-[100px]
                w-[570px]
                max-w-[calc(100vw-48px)]
                overflow-hidden
                rounded-[20px]
                bg-white
                border
                border-[#E0E6ED]
                shadow-[0_20px_45px_rgba(15,23,42,0.16)]
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

                        /*
                          Clear route errors
                          when switching
                          to another map.
                        */

                        if (
                          view.id !==
                          "route"
                        ) {
                          setError(
                            ""
                          );
                        }
                      }}
                      className={`
                        w-full
                        min-h-[76px]
                        px-8
                        flex
                        items-center
                        justify-between
                        transition-colors
                        duration-150
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
                          size={25}
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
                            font-semibold
                            text-[#33445D]
                          "
                        >
                          {
                            view.label
                          }
                        </span>
                      </div>

                      {isActive && (
                        <Check
                          size={
                            21
                          }
                          strokeWidth={
                            2.5
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
            DIVISION
        ================================================= */}

        <div
          className="
            absolute
            right-[405px]
            top-6
            z-[1000]
            w-[365px]
            h-[88px]
            rounded-[20px]
            bg-white
            border
            border-[#E0E6ED]
            shadow-[0_8px_25px_rgba(15,23,42,0.10)]
            px-7
            py-5
          "
        >
          <div
            className="
              text-[14px]
              font-semibold
              uppercase
              tracking-[0.02em]
              text-[#8FA1BA]
            "
          >
            DIVISION
          </div>

          <div
            className="
              mt-1
              text-[22px]
              font-semibold
              text-[#33445D]
            "
          >
            {selectedDivision ||
              "All Divisions"}
          </div>
        </div>

        {/* =================================================
            WARD
        ================================================= */}

        <div
          className="
            absolute
            right-6
            top-6
            z-[1000]
            w-[365px]
            h-[88px]
            rounded-[20px]
            bg-white
            border
            border-[#E0E6ED]
            shadow-[0_8px_25px_rgba(15,23,42,0.10)]
            px-7
            py-5
          "
        >
          <div
            className="
              text-[14px]
              font-semibold
              uppercase
              tracking-[0.02em]
              text-[#8FA1BA]
            "
          >
            WARD
          </div>

          <div
            className="
              mt-1
              text-[22px]
              font-semibold
              text-[#33445D]
            "
          >
            {normalizedWard
              ? `Ward ${normalizedWard}`
              : "All Wards"}
          </div>
        </div>

        {/* =================================================
            ROUTE REFRESH
        ================================================= */}

        {selectedView ===
          "route" && (
          <button
            type="button"
            onClick={
              fetchRoutes
            }
            disabled={
              loading ||
              !normalizedWard
            }
            title={
              normalizedWard
                ? "Refresh route"
                : "Select a ward first"
            }
            className="
              absolute
              right-6
              bottom-6
              z-[1000]
              w-[46px]
              h-[46px]
              rounded-full
              bg-white
              border
              border-[#E0E6ED]
              shadow-[0_7px_20px_rgba(15,23,42,0.12)]
              flex
              items-center
              justify-center
              transition-all
              hover:bg-slate-50
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {loading ? (
              <Loader2
                size={19}
                className="
                  animate-spin
                  text-violet-600
                "
              />
            ) : (
              <RefreshCw
                size={19}
                className="
                  text-slate-600
                "
              />
            )}
          </button>
        )}

        {/* =================================================
            ROUTE INFORMATION
        ================================================= */}

        {selectedView ===
          "route" &&
          routes.length >
            0 &&
          !loading && (
          <div
            className="
              absolute
              left-1/2
              bottom-6
              -translate-x-1/2
              z-[1000]
              bg-white
              rounded-[16px]
              border
              border-[#E0E6ED]
              shadow-[0_7px_22px_rgba(15,23,42,0.10)]
              px-5
              py-3
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
                  text-[12px]
                  font-semibold
                  text-slate-600
                "
              >
                <Truck
                  size={17}
                  className="
                    text-violet-600
                  "
                />

                {
                  routes.length
                }{" "}
                {routes.length ===
                1
                  ? "Vehicle"
                  : "Vehicles"}
              </div>

              <div
                className="
                  h-4
                  w-px
                  bg-slate-200
                "
              />

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
            ERROR / WARD MESSAGE

            This is intentionally the small pill
            shown in your screenshot.
        ================================================= */}

        {selectedView ===
          "route" &&
          error && (
          <div
            className="
              absolute
              left-1/2
              bottom-6
              -translate-x-1/2
              z-[1000]
              max-w-[calc(100%-48px)]
            "
          >
            <div
              className="
                min-h-[58px]
                px-7
                py-4
                bg-white
                rounded-[16px]
                border
                border-[#E0E6ED]
                shadow-[0_8px_25px_rgba(15,23,42,0.12)]
                flex
                items-center
                gap-4
              "
            >
              <Truck
                size={22}
                strokeWidth={
                  2
                }
                className="
                  shrink-0
                  text-violet-600
                "
              />

              <span
                className="
                  text-[16px]
                  font-semibold
                  text-[#53657D]
                  whitespace-nowrap
                "
              >
                {error}
              </span>
            </div>
          </div>
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
              left-1/2
              bottom-6
              -translate-x-1/2
              z-[1000]
            "
          >
            <div
              className="
                bg-white
                rounded-[16px]
                border
                border-[#E0E6ED]
                shadow-[0_8px_25px_rgba(15,23,42,0.12)]
                px-6
                py-4
                flex
                items-center
                gap-3
              "
            >
              <Loader2
                size={19}
                className="
                  animate-spin
                  text-violet-600
                "
              />

              <span
                className="
                  text-[13px]
                  font-semibold
                  text-slate-600
                "
              >
                Loading route...
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}