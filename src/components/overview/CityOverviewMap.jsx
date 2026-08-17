import {
  useState,
  useRef,
  useEffect,
  useMemo,
} from "react";

import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  CircleMarker,
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
  Loader2,
} from "lucide-react";

import "leaflet/dist/leaflet.css";

/* =========================================================
   CONFIG
========================================================= */

const API_BASE_URL =
  "https://sewac-main.onrender.com/api";

/* =========================================================
   ROUTE COLORS
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
        index % ROUTE_COLORS.length
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
          width:34px;
          height:34px;
          border-radius:50%;
          background:#ffffff;
          border:2px solid ${color};
          display:flex;
          align-items:center;
          justify-content:center;
          box-shadow:0 4px 12px rgba(15,23,42,0.16);
        "
      >
        <div
          style="
            width:25px;
            height:25px;
            border-radius:50%;
            background:${color}18;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:14px;
          "
        >
          🚛
        </div>
      </div>
    `,

    iconSize: [
      34,
      34,
    ],

    iconAnchor: [
      17,
      17,
    ],

    popupAnchor: [
      0,
      -18,
    ],
  });
};

/* =========================================================
   DATE FORMATTER
========================================================= */

function formatDateForAPI(
  date
) {
  if (!date) {
    const fallback =
      new Date();

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
}

/* =========================================================
   LOCAL STORAGE HELPER
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

  for (
    const key of keys
  ) {
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
}

/* =========================================================
   MAP CONTROLLER
========================================================= */

function MapController({
  routes,
  selectedView,
}) {
  const map =
    useMap();

  /* =======================================================
     MAP SIZE
  ======================================================= */

  useEffect(() => {
    if (!map) {
      return;
    }

    const timer =
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
        timer
      );

      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, [map]);

  /* =======================================================
     FIT ROUTE
  ======================================================= */

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

    const allPoints =
      [];

    routes.forEach(
      (vehicle) => {
        if (
          !Array.isArray(
            vehicle?.points
          )
        ) {
          return;
        }

        vehicle.points.forEach(
          (point) => {
            const latitude =
              Number(
                point?.latitude
              );

            const longitude =
              Number(
                point?.longitude
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
              allPoints.push([
                latitude,
                longitude,
              ]);
            }
          }
        );
      }
    );

    if (
      allPoints.length === 0
    ) {
      return;
    }

    try {
      const bounds =
        L.latLngBounds(
          allPoints
        );

      if (
        bounds.isValid()
      ) {
        map.fitBounds(
          bounds,
          {
            padding: [
              70,
              70,
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

  return null;
}

/* =========================================================
   ROUTE POPUP
========================================================= */

function RoutePointPopup({
  point,
  vehicleNumber,
}) {
  return (
    <div
      style={{
        minWidth:
          "190px",

        fontFamily:
          "Inter, Arial, sans-serif",
      }}
    >
      <div
        style={{
          fontSize:
            "14px",

          fontWeight:
            700,

          color:
            "#0F172A",

          marginBottom:
            "8px",
        }}
      >
        {vehicleNumber}
      </div>

      <div
        style={{
          fontSize:
            "11px",

          color:
            "#64748B",

          marginBottom:
            "5px",
        }}
      >
        Latitude:{" "}
        <strong
          style={{
            color:
              "#334155",
          }}
        >
          {Number(
            point?.latitude
          ).toFixed(6)}
        </strong>
      </div>

      <div
        style={{
          fontSize:
            "11px",

          color:
            "#64748B",

          marginBottom:
            "5px",
        }}
      >
        Longitude:{" "}
        <strong
          style={{
            color:
              "#334155",
          }}
        >
          {Number(
            point?.longitude
          ).toFixed(6)}
        </strong>
      </div>

      {(point?.iottimestamp ||
        point?.iotTimestamp) && (
        <div
          style={{
            fontSize:
              "11px",

            color:
              "#64748B",
          }}
        >
          Time:{" "}
          <strong
            style={{
              color:
                "#334155",
            }}
          >
            {point?.iottimestamp ||
              point?.iotTimestamp}
          </strong>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function CityOverviewMap({
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
     STATE
  ======================================================= */

  const [
    selectedView,
    setSelectedView,
  ] = useState("route");

  const [
    showViewMenu,
    setShowViewMenu,
  ] = useState(false);

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

  const menuRef =
    useRef(null);

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
     NORMALIZE WARD
  ======================================================= */

  const normalizedWard =
    useMemo(() => {
      if (
        selectedWard ===
          null ||
        selectedWard ===
          undefined ||
        selectedWard ===
          ""
      ) {
        return null;
      }

      const match =
        String(
          selectedWard
        ).match(
          /\d+/
        );

      return match
        ? Number(
            match[0]
          )
        : null;
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
     FIVE MAP VIEWS
  ======================================================= */

  const mapViews = [
    {
      id: "overview",

      label:
        "City Overview Map",

      icon: MapIcon,

      color:
        "#64748B",
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
          "🚛 SEWAC ROUTE MAP REQUEST"
        );

        console.log(
          "URL:",
          url
        );

        console.log(
          "WARD:",
          normalizedWard
        );

        console.log(
          "DATE:",
          apiDate
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

        console.log(
          "🚛 ROUTE API RESPONSE:",
          json
        );

        /*
        ==================================================
        SUPPORT BOTH:

        {
          vehicles: []
        }

        AND:

        {
          data: {
            vehicles: []
          }
        }
        ==================================================
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

        const vehicleData =
          Array.isArray(
            payload?.vehicles
          )
            ? payload.vehicles
            : [];

        /* =================================================
           NORMALIZE VEHICLES
        ================================================= */

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

                /*
                --------------------------------------------
                SORT TELEMETRY CHRONOLOGICALLY
                --------------------------------------------
                */

                points.sort(
                  (
                    a,
                    b
                  ) => {
                    const timeA =
                      new Date(
                        a?.iottimestamp ||
                          a?.iotTimestamp ||
                          a?.receivedtimestamp ||
                          a?.timestamp ||
                          a?.createdAt ||
                          0
                      ).getTime();

                    const timeB =
                      new Date(
                        b?.iottimestamp ||
                          b?.iotTimestamp ||
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
          "❌ ROUTE MAP ERROR:",
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
     FETCH WHEN ROUTE MAP IS ACTIVE
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
    normalizedWard,
    apiDate,
    selectedView,
  ]);

  /* =======================================================
     STORAGE LISTENER
  ======================================================= */

  useEffect(() => {
    const handleStorageChange =
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
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, [
    selectedView,
    normalizedWard,
    apiDate,
  ]);

  /* =======================================================
     CLOSE MENU OUTSIDE CLICK
  ======================================================= */

  useEffect(() => {
    const handleClickOutside =
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
     TOTAL GPS POINTS
  ======================================================= */

  const totalGpsPoints =
    routes.reduce(
      (
        total,
        vehicle
      ) =>
        total +
        vehicle.points.length,
      0
    );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section
      className="
        w-full
        rounded-[22px]
        bg-white
        border
        border-slate-200
        shadow-[0_2px_8px_rgba(15,23,42,0.04)]
        p-5
      "
    >
      {/* =================================================
          TITLE
      ================================================= */}

      <div
        className="
          mb-5
          px-1
        "
      >
        <h2
          className="
            text-[21px]
            font-semibold
            tracking-[-0.02em]
            text-slate-950
          "
        >
          CITY OVERVIEW MAP
        </h2>
      </div>

      {/* =================================================
          MAP WRAPPER
      ================================================= */}

      <div
        className="
          relative
          w-full
          overflow-hidden
          rounded-[20px]
          border
          border-slate-200
        "
        style={{
          height:
            "650px",
        }}
      >
        {/* =================================================
            LEAFLET MAP

            IMPORTANT:
            zoomControl is TRUE here.

            NO <ZoomControl />
            COMPONENT IS USED.

            This completely fixes:

            ReferenceError:
            ZoomControl is not defined
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
          {/* =================================================
              GREY MAP
          ================================================= */}

          <TileLayer
            attribution='&copy; OpenStreetMap contributors &copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          {/* =================================================
              MAP CONTROLLER
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

                const color =
                  vehicle.color ||
                  getVehicleColor(
                    vehicle.vehicleNumber,
                    vehicleIndex
                  );

                const latestPoint =
                  vehicle.points[
                    vehicle.points
                      .length -
                      1
                  ];

                return (
                  <div
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
                          color,

                          weight:
                            8,

                          opacity:
                            0.12,

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
                          color,

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

                    {/* =======================================
                        GPS POINTS
                    ======================================= */}

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
                            3.5
                          }
                          pathOptions={{
                            color:
                              "#FFFFFF",

                            weight:
                              1.2,

                            fillColor:
                              color,

                            fillOpacity:
                              1,
                          }}
                        >
                          <Popup
                            closeButton={
                              true
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
                      )
                    )}

                    {/* =======================================
                        START
                    ======================================= */}

                    <CircleMarker
                      center={
                        positions[0]
                      }
                      radius={
                        7
                      }
                      pathOptions={{
                        color,

                        weight:
                          2,

                        fillColor:
                          "#FFFFFF",

                        fillOpacity:
                          1,
                      }}
                    >
                      <Popup>
                        <div
                          style={{
                            fontSize:
                              "12px",

                            fontWeight:
                              600,
                          }}
                        >
                          {
                            vehicle.vehicleNumber
                          }

                          <br />

                          <span
                            style={{
                              color:
                                "#64748B",

                              fontWeight:
                                400,
                            }}
                          >
                            Route Start
                          </span>
                        </div>
                      </Popup>
                    </CircleMarker>

                    {/* =======================================
                        CURRENT VEHICLE
                    ======================================= */}

                    {latestPoint && (
                      <Marker
                        position={
                          latestPoint.position
                        }
                        icon={createTruckIcon(
                          color
                        )}
                      >
                        <Popup>
                          <div
                            style={{
                              minWidth:
                                "180px",

                              fontFamily:
                                "Inter, Arial, sans-serif",
                            }}
                          >
                            <div
                              style={{
                                fontSize:
                                  "14px",

                                fontWeight:
                                  700,

                                color:
                                  "#0F172A",

                                marginBottom:
                                  "8px",
                              }}
                            >
                              {
                                vehicle.vehicleNumber
                              }
                            </div>

                            <div
                              style={{
                                fontSize:
                                  "11px",

                                color:
                                  "#64748B",

                                marginBottom:
                                  "5px",
                              }}
                            >
                              Ward{" "}
                              {
                                normalizedWard
                              }
                            </div>

                            <div
                              style={{
                                fontSize:
                                  "11px",

                                color:
                                  "#64748B",

                                marginBottom:
                                  "5px",
                              }}
                            >
                              GPS Points:{" "}
                              {
                                vehicle
                                  .points
                                  .length
                              }
                            </div>

                            <div
                              style={{
                                fontSize:
                                  "11px",

                                color:
                                  "#64748B",
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
              }
            )}
        </MapContainer>

        {/* =================================================
            MAP VIEW SELECTOR
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
          {/* =================================================
              SELECTED VIEW
          ================================================= */}

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
              w-[420px]
              max-w-[calc(100vw-40px)]
              h-[66px]
              px-5
              bg-white
              rounded-[16px]
              border
              border-slate-200
              shadow-[0_6px_20px_rgba(15,23,42,0.09)]
              flex
              items-center
              justify-between
              transition-all
              hover:shadow-[0_8px_24px_rgba(15,23,42,0.12)]
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
                size={22}
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
                  text-[16px]
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
              size={18}
              className={`
                text-slate-600
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

          {/* =================================================
              DROPDOWN
          ================================================= */}

          {showViewMenu && (
            <div
              className="
                absolute
                top-[74px]
                left-0
                w-[420px]
                max-w-[calc(100vw-40px)]
                rounded-[16px]
                bg-white
                border
                border-slate-200
                shadow-[0_14px_32px_rgba(15,23,42,0.12)]
                overflow-hidden
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
                        px-5
                        py-3.5
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
                          gap-4
                        "
                      >
                        <Icon
                          size={19}
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
                            text-[13px]
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
                        <span
                          style={{
                            color:
                              view.color,

                            fontSize:
                              "16px",

                            fontWeight:
                              700,
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </button>
                  );
                }
              )}
            </div>
          )}
        </div>

        {/* =================================================
            DIVISION CARD
        ================================================= */}

        <div
          className="
            absolute
            right-[300px]
            top-5
            z-[1000]
            min-w-[245px]
            px-5
            py-3
            bg-white
            rounded-[16px]
            border
            border-slate-200
            shadow-[0_6px_20px_rgba(15,23,42,0.08)]
          "
        >
          <div
            className="
              text-[10px]
              font-semibold
              tracking-[0.06em]
              uppercase
              text-slate-400
            "
          >
            DIVISION
          </div>

          <div
            className="
              mt-1
              text-[15px]
              font-semibold
              text-slate-700
            "
          >
            {
              selectedDivision ||
              "All Divisions"
            }
          </div>
        </div>

        {/* =================================================
            WARD CARD
        ================================================= */}

        <div
          className="
            absolute
            right-5
            top-5
            z-[1000]
            min-w-[245px]
            px-5
            py-3
            bg-white
            rounded-[16px]
            border
            border-slate-200
            shadow-[0_6px_20px_rgba(15,23,42,0.08)]
          "
        >
          <div
            className="
              text-[10px]
              font-semibold
              tracking-[0.06em]
              uppercase
              text-slate-400
            "
          >
            WARD
          </div>

          <div
            className="
              mt-1
              text-[15px]
              font-semibold
              text-slate-700
            "
          >
            {selectedWard
              ? String(
                  selectedWard
                )
              : "All Wards"}
          </div>
        </div>

        {/* =================================================
            REFRESH
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
                w-[38px]
                h-[38px]
                rounded-full
                bg-white
                border
                border-slate-200
                shadow-[0_5px_16px_rgba(15,23,42,0.10)]
                flex
                items-center
                justify-center
                hover:bg-slate-50
                transition
                disabled:opacity-50
              "
            >
              {loading ? (
                <Loader2
                  size={16}
                  className="
                    text-violet-600
                    animate-spin
                  "
                />
              ) : (
                <RefreshCw
                  size={16}
                  className="
                    text-slate-600
                  "
                />
              )}
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
                left-1/2
                bottom-5
                -translate-x-1/2
                z-[900]
              "
            >
              <div
                className="
                  bg-white
                  border
                  border-slate-200
                  shadow-[0_8px_24px_rgba(15,23,42,0.10)]
                  rounded-[14px]
                  px-5
                  py-3
                  flex
                  items-center
                  gap-3
                "
              >
                <Loader2
                  size={16}
                  className="
                    text-violet-600
                    animate-spin
                  "
                />

                <span
                  className="
                    text-[12px]
                    font-semibold
                    text-slate-600
                  "
                >
                  Loading vehicle routes...
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
                bottom-5
                -translate-x-1/2
                z-[900]
                max-w-[calc(100%-40px)]
              "
            >
              <div
                className="
                  bg-white
                  border
                  border-slate-200
                  shadow-[0_8px_24px_rgba(15,23,42,0.10)]
                  rounded-[14px]
                  px-5
                  py-3
                  flex
                  items-center
                  gap-3
                "
              >
                <Truck
                  size={17}
                  className="
                    text-violet-600
                    shrink-0
                  "
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
            ROUTE INFO
        ================================================= */}

        {selectedView ===
          "route" &&
          !loading &&
          routes.length >
            0 && (
            <div
              className="
                absolute
                left-1/2
                bottom-5
                -translate-x-1/2
                z-[800]
                pointer-events-none
              "
            >
              <div
                className="
                  bg-white
                  border
                  border-slate-200
                  shadow-[0_6px_18px_rgba(15,23,42,0.08)]
                  rounded-[13px]
                  px-4
                  py-2.5
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-4
                    text-[11px]
                    font-medium
                    text-slate-500
                  "
                >
                  <span>
                    {
                      routes.length
                    }{" "}
                    {routes.length ===
                    1
                      ? "Vehicle"
                      : "Vehicles"}
                  </span>

                  <span
                    className="
                      h-3
                      w-px
                      bg-slate-200
                    "
                  />

                  <span>
                    {
                      totalGpsPoints.toLocaleString()
                    }{" "}
                    GPS points
                  </span>
                </div>
              </div>
            </div>
          )}
      </div>
    </section>
  );
}