import {
  MapContainer,
  TileLayer,
  ZoomControl,
  GeoJSON,
  Polyline,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import {
  useEffect,
  useMemo,
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
} from "lucide-react";

import { ibbaluruBoundary } from "../../data/ibbaluruBoundary";

/*
====================================================
API
====================================================
*/

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5002";

/*
====================================================
MAP COLORS
====================================================

Each vehicle gets a stable color.

====================================================
*/

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

/*
====================================================
HELPERS
====================================================
*/

/*
Convert different date formats into:

YYYY-MM-DD
*/

function formatDateForAPI(date) {
  if (!date) {
    return new Date()
      .toISOString()
      .slice(0, 10);
  }

  if (
    typeof date === "string"
  ) {
    /*
    Already:

    2026-08-16
    */

    if (
      /^\d{4}-\d{2}-\d{2}$/.test(
        date,
      )
    ) {
      return date;
    }

    /*
    ISO string
    */

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

  if (date instanceof Date) {
    return date
      .toISOString()
      .slice(0, 10);
  }

  return new Date()
    .toISOString()
    .slice(0, 10);
}

/*
====================================================
GET WARD FROM HEADER / STORAGE
====================================================

The preferred value is the prop.

If the parent doesn't pass it yet,
we also check common localStorage keys.

====================================================
*/

function getStoredWardNo() {
  const possibleKeys = [
    "wardNo",
    "wardId",
    "selectedWard",
    "selectedWardNo",
    "headerWardNo",
  ];

  for (
    const key of possibleKeys
  ) {
    const value =
      localStorage.getItem(key);

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

/*
====================================================
FIT MAP TO ROUTES
====================================================
*/

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
          !vehicle.route ||
          !Array.isArray(
            vehicle.route,
          )
        ) {
          return;
        }

        vehicle.route.forEach(
          (point) => {
            const latitude =
              Number(
                point.latitude,
              );

            const longitude =
              Number(
                point.longitude,
              );

            if (
              Number.isFinite(
                latitude,
              ) &&
              Number.isFinite(
                longitude,
              )
            ) {
              coordinates.push([
                latitude,
                longitude,
              ]);
            }
          },
        );
      },
    );

    if (
      coordinates.length === 0
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
            50,
            50,
          ],
          maxZoom: 16,
          animate: true,
        },
      );
    }
  }, [map, vehicles]);

  return null;
}

/*
====================================================
FIT WARD BOUNDARY
====================================================
*/

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
            30,
            30,
          ],
        },
      );
    }
  }, [map, data]);

  return null;
}

/*
====================================================
ROUTE POINT POPUP
====================================================
*/

function RoutePointPopup({
  point,
  vehicleNumber,
}) {
  if (!point) {
    return null;
  }

  return (
    <div
      style={{
        minWidth: "240px",
        fontFamily:
          "Inter, Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "10px",
          paddingBottom: "8px",
          borderBottom:
            "1px solid #E5E7EB",
        }}
      >
        <div
          style={{
            width: "30px",
            height: "30px",
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
              fontSize: "14px",
              color: "#111827",
            }}
          >
            {vehicleNumber ||
              point.vehicleNumber ||
              "Vehicle"}
          </div>

          <div
            style={{
              fontSize: "11px",
              color: "#6B7280",
              marginTop: "2px",
            }}
          >
            Telemetry Point
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr",
          gap: "7px",
        }}
      >
        <PopupRow
          label="Latitude"
          value={
            point.latitude
          }
        />

        <PopupRow
          label="Longitude"
          value={
            point.longitude
          }
        />

        <PopupRow
          label="IoT Timestamp"
          value={
            point.iotTimestamp
          }
        />

        <PopupRow
          label="Wet Weight"
          value={
            point.wetWeight
          }
        />

        <PopupRow
          label="Dry Weight"
          value={
            point.dryWeight
          }
        />

        <PopupRow
          label="RFID EPC"
          value={
            point.rfidEpc
          }
        />

        <PopupRow
          label="Ward No"
          value={
            point.wardNo
          }
        />
      </div>
    </div>
  );
}

/*
====================================================
POPUP ROW
====================================================
*/

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
          color: "#6B7280",
          fontWeight: 600,
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: "#111827",
          fontWeight: 600,
          textAlign: "right",
          maxWidth: "160px",
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

/*
====================================================
PLACEHOLDER VIEW
====================================================
*/

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
        z-[500]
        flex
        items-center
        justify-center
        bg-white/75
        backdrop-blur-[2px]
      "
    >
      <div
        className="
          bg-white
          rounded-3xl
          border
          border-gray-100
          shadow-[0_20px_60px_rgba(15,23,42,0.12)]
          px-10
          py-9
          text-center
          max-w-[360px]
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

/*
====================================================
MAIN COMPONENT
====================================================
*/

export default function MapSection({
  mapView = "overview",
  selectedDate,
  wardNo,
}) {
  /*
  ==================================================
  ROUTE DATA
  ==================================================
  */

  const [routeData, setRouteData] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /*
  ==================================================
  RESOLVE DATE
  ==================================================
  */

  const apiDate =
    formatDateForAPI(
      selectedDate,
    );

  /*
  ==================================================
  RESOLVE WARD
  ==================================================
  */

  const resolvedWardNo =
    wardNo ||
    getStoredWardNo();

  /*
  ==================================================
  FETCH ROUTE MAP
  ==================================================

  Only fetch when:

  mapView === route

  ==================================================
  */

  useEffect(() => {
    if (
      mapView !== "route"
    ) {
      return;
    }

    /*
    No ward selected
    */

    if (
      !resolvedWardNo
    ) {
      setRouteData(null);

      setError(
        "Please select a ward from the header.",
      );

      return;
    }

    let cancelled =
      false;

    const fetchRoutes =
      async () => {
        try {
          setLoading(true);
          setError("");

          setRouteData(null);

          const url =
            `${API_BASE_URL}/api/route-map` +
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
            "🚛 FETCHING ROUTE MAP",
          );

          console.log(
            "Date:",
            apiDate,
          );

          console.log(
            "Ward:",
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
              json.message ||
                "Failed to fetch route map.",
            );
          }

          if (
            cancelled
          ) {
            return;
          }

          /*
          ==================================================
          BACKEND RESPONSE

          {
            success: true,
            date: "...",
            wardNo: "...",
            vehicles: [...]
          }

          OR:

          {
            success: true,
            data: {
              success: true,
              date: "...",
              wardNo: "...",
              vehicles: [...]
            }
          }

          Support BOTH.
          ==================================================
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

          setRouteData({
            ...payload,
            vehicles,
          });

          /*
          If backend says no vehicles,
          don't treat it as a technical error.
          */

          if (
            vehicles.length ===
            0
          ) {
            setError(
              payload?.message ||
                `No vehicles found for Ward ${resolvedWardNo} on ${apiDate}.`,
            );
          }
        } catch (fetchError) {
          console.error(
            "❌ Route Map Error:",
            fetchError,
          );

          if (
            !cancelled
          ) {
            setError(
              fetchError.message ||
                "Failed to load route data.",
            );

            setRouteData(null);
          }
        } finally {
          if (
            !cancelled
          ) {
            setLoading(false);
          }
        }
      };

    fetchRoutes();

    return () => {
      cancelled = true;
    };
  }, [
    mapView,
    apiDate,
    resolvedWardNo,
  ]);

  /*
  ==================================================
  VEHICLE ROUTES
  ==================================================
  */

  const vehicles =
    useMemo(() => {
      if (
        !routeData?.vehicles
      ) {
        return [];
      }

      return routeData.vehicles;
    }, [routeData]);

  /*
  ==================================================
  RENDER
  ==================================================
  */

  return (
    <div
      className="
        bg-white
        rounded-[28px]
        border
        border-gray-100
        overflow-hidden
        h-full
        relative
        shadow-sm
      "
    >
      <MapContainer
        center={[
          12.9258,
          77.659,
        ]}
        zoom={13}
        zoomControl={false}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {/* =================================================
            ZOOM
        ================================================= */}

        <ZoomControl
          position="topleft"
        />

        {/* =================================================
            BASE MAP
        ================================================= */}

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* =================================================
            CITY OVERVIEW
        ================================================= */}

        {mapView ===
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
                  0.12,
              }}
              onEachFeature={(
                feature,
                layer,
              ) => {
                layer.bindPopup(`
                  <div style="padding:4px">
                    <strong>
                      ${
                        feature
                          ?.properties
                          ?.name ||
                        "Ward"
                      }
                    </strong>
                    <br/>
                    Ward ID:
                    ${
                      feature
                        ?.properties
                        ?.wardId ??
                      "—"
                    }
                  </div>
                `);
              }}
            />

            {/* Overview vehicle indicator */}

            <CircleMarker
              center={[
                12.9021212,
                77.6548327,
              ]}
              radius={18}
              pathOptions={{
                color:
                  "#3B82F6",
                weight: 3,
                fillColor:
                  "#FFFFFF",
                fillOpacity:
                  1,
              }}
            >
              <Popup>
                <strong>
                  Vehicle Location
                </strong>
              </Popup>
            </CircleMarker>
          </>
        )}

        {/* =================================================
            ROUTE MAP
        ================================================= */}

        {mapView ===
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
                const color =
                  ROUTE_COLORS[
                    vehicleIndex %
                      ROUTE_COLORS.length
                  ];

                /*
                ==================================================
                SORT ROUTE BY TIME

                Backend should already return
                time ordered data, but we sort
                again defensively.
                ==================================================
                */

                const route =
                  Array.isArray(
                    vehicle.route,
                  )
                    ? [
                        ...vehicle.route,
                      ].sort(
                        (
                          a,
                          b,
                        ) => {
                          const timeA =
                            new Date(
                              a.iotTimestamp ||
                                a.timestamp ||
                                a.createdAt ||
                                0,
                            ).getTime();

                          const timeB =
                            new Date(
                              b.iotTimestamp ||
                                b.timestamp ||
                                b.createdAt ||
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
                      )
                    : [];

                const coordinates =
                  route
                    .map(
                      (
                        point,
                      ) => [
                        Number(
                          point.latitude,
                        ),
                        Number(
                          point.longitude,
                        ),
                      ],
                    )
                    .filter(
                      (
                        coordinate,
                      ) =>
                        Number.isFinite(
                          coordinate[0],
                        ) &&
                        Number.isFinite(
                          coordinate[1],
                        ),
                    );

                if (
                  coordinates.length ===
                  0
                ) {
                  return null;
                }

                return (
                  <div
                    key={
                      vehicle.vehicleNumber ||
                      vehicleIndex
                    }
                  >
                    {/* =================================================
                        VEHICLE ROUTE LINE
                    ================================================= */}

                    <Polyline
                      positions={
                        coordinates
                      }
                      pathOptions={{
                        color,
                        weight: 5,
                        opacity: 0.88,
                        lineCap:
                          "round",
                        lineJoin:
                          "round",
                      }}
                    />

                    {/* =================================================
                        TELEMETRY POINTS

                        THICK DOTS
                    ================================================= */}

                    {route.map(
                      (
                        point,
                        pointIndex,
                      ) => {
                        const latitude =
                          Number(
                            point.latitude,
                          );

                        const longitude =
                          Number(
                            point.longitude,
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

                        return (
                          <CircleMarker
                            key={`${vehicle.vehicleNumber}-${pointIndex}`}
                            center={[
                              latitude,
                              longitude,
                            ]}
                            radius={7}
                            pathOptions={{
                              color:
                                "#FFFFFF",
                              weight: 2,
                              fillColor:
                                color,
                              fillOpacity:
                                1,
                            }}
                            eventHandlers={{
                              mouseover:
                                (
                                  event,
                                ) => {
                                  event.target.openPopup();
                                },
                            }}
                          >
                            <Popup
                              closeButton={
                                true
                              }
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
                        );
                      },
                    )}

                    {/* =================================================
                        VEHICLE START POINT
                    ================================================= */}

                    <CircleMarker
                      center={
                        coordinates[0]
                      }
                      radius={10}
                      pathOptions={{
                        color,
                        weight: 3,
                        fillColor:
                          "#FFFFFF",
                        fillOpacity:
                          1,
                      }}
                    >
                      <Popup>
                        <div>
                          <strong>
                            {
                              vehicle.vehicleNumber
                            }
                          </strong>

                          <br />

                          <span>
                            Route Start
                          </span>
                        </div>
                      </Popup>
                    </CircleMarker>

                    {/* =================================================
                        VEHICLE END POINT
                    ================================================= */}

                    {coordinates.length >
                      1 && (
                      <CircleMarker
                        center={
                          coordinates[
                            coordinates.length -
                              1
                          ]
                        }
                        radius={10}
                        pathOptions={{
                          color,
                          weight: 3,
                          fillColor:
                            color,
                          fillOpacity:
                            1,
                        }}
                      >
                        <Popup>
                          <div>
                            <strong>
                              {
                                vehicle.vehicleNumber
                              }
                            </strong>

                            <br />

                            <span>
                              Latest
                              Position
                            </span>
                          </div>
                        </Popup>
                      </CircleMarker>
                    )}
                  </div>
                );
              },
            )}
          </>
        )}
      </MapContainer>

      {/* =================================================
          ROUTE LOADING
      ================================================= */}

      {mapView ===
        "route" &&
        loading && (
          <div
            className="
              absolute
              inset-0
              z-[700]
              flex
              items-center
              justify-center
              bg-white/55
              backdrop-blur-[2px]
              pointer-events-none
            "
          >
            <div
              className="
                bg-white
                rounded-2xl
                shadow-[0_15px_40px_rgba(15,23,42,0.14)]
                px-5
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
                Loading vehicle routes...
              </span>
            </div>
          </div>
        )}

      {/* =================================================
          ROUTE ERROR / EMPTY
      ================================================= */}

      {mapView ===
        "route" &&
        !loading &&
        error && (
          <div
            className="
              absolute
              left-1/2
              bottom-6
              -translate-x-1/2
              z-[800]
            "
          >
            <div
              className="
                bg-white
                border
                border-gray-100
                shadow-[0_15px_40px_rgba(15,23,42,0.12)]
                rounded-2xl
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
                {error}
              </span>
            </div>
          </div>
        )}

      {/* =================================================
          GVP
      ================================================= */}

      {mapView ===
        "gvp" && (
        <PlaceholderView
          icon={MapPinned}
          title="Garbage Vulnerable Points"
          description="GVP locations will be displayed here."
        />
      )}

      {/* =================================================
          PLANTS
      ================================================= */}

      {mapView ===
        "plants" && (
        <PlaceholderView
          icon={Factory}
          title="Plants Active"
          description="Active waste processing plants will be displayed here."
        />
      )}

      {/* =================================================
          GRIEVANCES
      ================================================= */}

      {mapView ===
        "grievances" && (
        <PlaceholderView
          icon={Megaphone}
          title="Customer Grievances"
          description="Customer grievance locations will be displayed here."
        />
      )}
    </div>
  );
}