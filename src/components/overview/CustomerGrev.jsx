import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  ZoomControl,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import {
  MessageSquareWarning,
  X,
} from "lucide-react";

import { useLanguage } from "../../i18n";

import "leaflet/dist/leaflet.css";

/* ============================================================
   BACKEND
============================================================ */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://sewac-main.onrender.com";

const COMPLAINTS_ENDPOINT =
  `${API_BASE_URL}/api/complaints-grev/locations`;

/* ============================================================
   DEFAULT BENGALURU VIEW
============================================================ */

const BENGALURU_CENTER = [
  12.9716,
  77.5946,
];

const DEFAULT_ZOOM = 11;

/* ============================================================
   CARTO MAP
============================================================ */

const CARTO_LIGHT_URL =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

const CARTO_ATTRIBUTION =
  "&copy; OpenStreetMap contributors &copy; CARTO";

/* ============================================================
   PERSON / GRIEVANCE MARKER
============================================================ */

const complaintIcon =
  L.divIcon({
    className:
      "customer-grievance-marker",

    html: `
      <div
        style="
          width:42px;
          height:42px;
          border-radius:9999px;
          background:#2563eb;
          border:3px solid white;
          box-shadow:
            0 4px 12px rgba(0,0,0,0.25),
            0 0 0 3px rgba(37,99,235,0.15);
          display:flex;
          align-items:center;
          justify-content:center;
        "
      >
        <svg
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle
            cx="12"
            cy="8"
            r="4"
          ></circle>

          <path
            d="M4 21c0-4.418 3.582-8 8-8s8 3.582 8 8"
          ></path>
        </svg>
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
      -22,
    ],
  });

/* ============================================================
   VALIDATE COORDINATE
============================================================ */

function isValidCoordinate(value) {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}

/* ============================================================
   NORMALIZE POINT
============================================================ */

function normalizePoint(
  point,
  geoJsonMode = false
) {
  /* ----------------------------------------------------------
     ARRAY
  ---------------------------------------------------------- */

  if (
    Array.isArray(point) &&
    point.length >= 2
  ) {
    const first =
      Number(point[0]);

    const second =
      Number(point[1]);

    if (
      !Number.isFinite(first) ||
      !Number.isFinite(second)
    ) {
      return null;
    }

    /*
     * GeoJSON:
     * [longitude, latitude]
     *
     * Normal:
     * [latitude, longitude]
     */

    if (geoJsonMode) {
      return [
        second,
        first,
      ];
    }

    return [
      first,
      second,
    ];
  }

  /* ----------------------------------------------------------
     OBJECT
  ---------------------------------------------------------- */

  if (
    point &&
    typeof point === "object"
  ) {
    const latitude =
      Number(
        point.lat ??
          point.latitude ??
          point.y
      );

    const longitude =
      Number(
        point.lng ??
          point.long ??
          point.longitude ??
          point.x
      );

    if (
      Number.isFinite(latitude) &&
      Number.isFinite(longitude)
    ) {
      return [
        latitude,
        longitude,
      ];
    }
  }

  return null;
}

/* ============================================================
   GEOJSON → LEAFLET PATHS
============================================================ */

function geoJsonToPaths(
  geometry
) {
  if (!geometry) {
    return [];
  }

  /*
   * Feature
   */

  if (
    geometry.type ===
    "Feature"
  ) {
    return geoJsonToPaths(
      geometry.geometry
    );
  }

  /*
   * FeatureCollection
   */

  if (
    geometry.type ===
    "FeatureCollection"
  ) {
    if (
      !Array.isArray(
        geometry.features
      )
    ) {
      return [];
    }

    return geometry.features.flatMap(
      (feature) =>
        geoJsonToPaths(
          feature
        )
    );
  }

  /*
   * Polygon
   */

  if (
    geometry.type ===
    "Polygon"
  ) {
    const outerRing =
      geometry.coordinates?.[0];

    if (
      !Array.isArray(
        outerRing
      )
    ) {
      return [];
    }

    const path =
      outerRing
        .map((point) =>
          normalizePoint(
            point,
            true
          )
        )
        .filter(Boolean);

    return path.length >= 3
      ? [path]
      : [];
  }

  /*
   * MultiPolygon
   */

  if (
    geometry.type ===
    "MultiPolygon"
  ) {
    if (
      !Array.isArray(
        geometry.coordinates
      )
    ) {
      return [];
    }

    const paths = [];

    geometry.coordinates.forEach(
      (polygon) => {
        const outerRing =
          polygon?.[0];

        if (
          !Array.isArray(
            outerRing
          )
        ) {
          return;
        }

        const path =
          outerRing
            .map((point) =>
              normalizePoint(
                point,
                true
              )
            )
            .filter(Boolean);

        if (
          path.length >= 3
        ) {
          paths.push(path);
        }
      }
    );

    return paths;
  }

  return [];
}

/* ============================================================
   POSSIBLE JSON
============================================================ */

function parsePossibleJson(
  value
) {
  if (
    typeof value !==
    "string"
  ) {
    return value;
  }

  const trimmed =
    value.trim();

  if (!trimmed) {
    return value;
  }

  try {
    return JSON.parse(
      trimmed
    );
  } catch {
    return value;
  }
}

/* ============================================================
   EXTRACT BENGALURU BOUNDARY
============================================================ */

function extractBoundaryPaths(
  payload
) {
  const possibleKeys = [
    "boundary",
    "city_boundary",
    "cityBoundary",
    "bengaluru_boundary",
    "bengaluruBoundary",
    "geometry",
    "geojson",
    "geoJson",
    "polygon",
    "coordinates",
  ];

  const candidates = [];

  /*
   * Direct payload keys
   */

  possibleKeys.forEach(
    (key) => {
      if (
        payload?.[key] !==
          undefined &&
        payload?.[key] !== null
      ) {
        candidates.push(
          payload[key]
        );
      }
    }
  );

  /*
   * Nested objects
   */

  const nestedObjects = [
    payload?.city,
    payload?.data,
    payload?.result,
    payload?.map,
    payload?.cityData,
  ];

  nestedObjects.forEach(
    (object) => {
      if (
        !object ||
        typeof object !==
          "object"
      ) {
        return;
      }

      possibleKeys.forEach(
        (key) => {
          if (
            object[key] !==
              undefined &&
            object[key] !== null
          ) {
            candidates.push(
              object[key]
            );
          }
        }
      );
    }
  );

  /*
   * Data array
   */

  if (
    Array.isArray(
      payload?.data
    )
  ) {
    payload.data.forEach(
      (item) => {
        if (
          !item ||
          typeof item !==
            "object"
        ) {
          return;
        }

        possibleKeys.forEach(
          (key) => {
            if (
              item[key] !==
                undefined &&
              item[key] !== null
            ) {
              candidates.push(
                item[key]
              );
            }
          }
        );
      }
    );
  }

  /*
   * Process candidates
   */

  for (
    const rawCandidate of
      candidates
  ) {
    const candidate =
      parsePossibleJson(
        rawCandidate
      );

    /*
     * GeoJSON
     */

    if (
      candidate &&
      typeof candidate ===
        "object" &&
      candidate.type
    ) {
      const paths =
        geoJsonToPaths(
          candidate
        );

      if (
        paths.length > 0
      ) {
        return paths;
      }
    }

    /*
     * Direct coordinates
     */

    if (
      Array.isArray(
        candidate
      )
    ) {
      /*
       * Single polygon:
       * [
       *   [lat,lng],
       *   [lat,lng]
       * ]
       */

      if (
        candidate.length > 0 &&
        candidate.every(
          (item) =>
            Array.isArray(item) &&
            item.length >= 2 &&
            typeof item[0] !==
              "object"
        )
      ) {
        const path =
          candidate
            .map((point) =>
              normalizePoint(
                point
              )
            )
            .filter(Boolean);

        if (
          path.length >= 3
        ) {
          return [path];
        }
      }

      /*
       * Multiple polygons
       */

      const paths =
        candidate
          .map((polygon) => {
            if (
              !Array.isArray(
                polygon
              )
            ) {
              return null;
            }

            const path =
              polygon
                .map((point) =>
                  normalizePoint(
                    point
                  )
                )
                .filter(Boolean);

            return path.length >= 3
              ? path
              : null;
          })
          .filter(Boolean);

      if (
        paths.length > 0
      ) {
        return paths;
      }
    }
  }

  return [];
}

/* ============================================================
   POINT INSIDE POLYGON
============================================================ */

function isPointInsidePolygon(
  lat,
  lng,
  polygon
) {
  if (
    !polygon ||
    polygon.length < 3
  ) {
    return true;
  }

  let inside =
    false;

  for (
    let i = 0,
      j =
        polygon.length - 1;
    i < polygon.length;
    j = i++
  ) {
    const yi =
      polygon[i][0];

    const xi =
      polygon[i][1];

    const yj =
      polygon[j][0];

    const xj =
      polygon[j][1];

    const intersect =
      yi > lat !==
        yj > lat &&
      lng <
        ((xj - xi) *
          (lat - yi)) /
          (yj - yi) +
          xi;

    if (intersect) {
      inside =
        !inside;
    }
  }

  return inside;
}

/* ============================================================
   MAP SIZE CONTROLLER
============================================================ */

function MapSizeController() {
  const map =
    useMap();

  useEffect(() => {
    const timers = [
      setTimeout(
        () =>
          map.invalidateSize(),
        100
      ),

      setTimeout(
        () =>
          map.invalidateSize(),
        500
      ),

      setTimeout(
        () =>
          map.invalidateSize(),
        1000
      ),
    ];

    const handleResize =
      () => {
        map.invalidateSize();
      };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      timers.forEach(
        clearTimeout
      );

      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, [map]);

  return null;
}

/* ============================================================
   BENGALURU MAP FOCUS
============================================================ */

function BengaluruMapFocus({
  boundaryPaths,
}) {
  const map =
    useMap();

  useEffect(() => {
    if (
      !boundaryPaths ||
      boundaryPaths.length === 0
    ) {
      map.setView(
        BENGALURU_CENTER,
        DEFAULT_ZOOM,
        {
          animate: false,
        }
      );

      return;
    }

    try {
      const allPoints =
        boundaryPaths.flat();

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
              25,
              25,
            ],

            maxZoom: 12,

            animate: false,
          }
        );
      }
    } catch (focusError) {
      console.error(
        "BENGALURU MAP FOCUS ERROR:",
        focusError
      );

      map.setView(
        BENGALURU_CENTER,
        DEFAULT_ZOOM,
        {
          animate: false,
        }
      );
    }
  }, [
    boundaryPaths,
    map,
  ]);

  return null;
}

/* ============================================================
   FIELD HELPER
============================================================ */

function getField(
  object,
  keys,
  fallback = ""
) {
  for (
    const key of keys
  ) {
    const value =
      object?.[key];

    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      return value;
    }
  }

  return fallback;
}

/* ============================================================
   DATE FORMATTER
============================================================ */

function formatDate(
  value
) {
  if (!value) {
    return "—";
  }

  try {
    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return String(value);
    }

    return date.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  } catch {
    return String(value);
  }
}

/* ============================================================
   STATUS COLOR
============================================================ */

function getStatusClasses(
  status
) {
  const normalized =
    String(status || "")
      .toUpperCase();

  if (
    normalized ===
    "CLOSED"
  ) {
    return {
      badge:
        "bg-emerald-50 text-emerald-600",
      dot:
        "bg-emerald-500",
    };
  }

  if (
    normalized ===
    "PENDING"
  ) {
    return {
      badge:
        "bg-amber-50 text-amber-600",
      dot:
        "bg-amber-500",
    };
  }

  if (
    normalized ===
    "OTP_SENT"
  ) {
    return {
      badge:
        "bg-violet-50 text-violet-600",
      dot:
        "bg-violet-500",
    };
  }

  return {
    badge:
      "bg-blue-50 text-blue-600",
    dot:
      "bg-blue-500",
  };
}

/* ============================================================
   POPUP ROW
============================================================ */

function PopupRow({
  label,
  value,
}) {
  return (
    <div
      className="
        grid
        grid-cols-[minmax(70px,0.7fr)_minmax(0,1.3fr)]
        gap-3
        py-1.5
        text-[11px]
        sm:text-[12px]
      "
    >
      <span
        className="
          text-[#6E86A0]
        "
      >
        {label}
      </span>

      <span
        className="
          min-w-0
          break-words
          text-right
          font-semibold
          text-[#24364B]
        "
      >
        {value || "—"}
      </span>
    </div>
  );
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function CustomerGrev() {
  const {
    language,
    t,
  } = useLanguage();

  const [
    complaints,
    setComplaints,
  ] = useState([]);

  const [
    boundaryPaths,
    setBoundaryPaths,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  /* ==========================================================
     TRANSLATIONS
  ========================================================== */

  const title =
    t(
      "cityOverviewMap.customerGrievances.title",
      "Customer Grievances"
    );

  const loadingText =
    t(
      "cityOverviewMap.customerGrievances.loading",
      "Loading customer grievances..."
    );

  const errorText =
    t(
      "cityOverviewMap.customerGrievances.error",
      "Unable to load customer grievances."
    );

  const noComplaintsText =
    t(
      "cityOverviewMap.customerGrievances.empty",
      "No customer grievances found."
    );

  const labels = {
    ticket:
      t(
        "cityOverviewMap.customerGrievances.ticket",
        "Ticket"
      ),

    status:
      t(
        "cityOverviewMap.customerGrievances.status",
        "Status"
      ),

    category:
      t(
        "cityOverviewMap.customerGrievances.category",
        "Category"
      ),

    phone:
      t(
        "cityOverviewMap.customerGrievances.phone",
        "Phone"
      ),

    description:
      t(
        "cityOverviewMap.customerGrievances.description",
        "Description"
      ),

    address:
      t(
        "cityOverviewMap.customerGrievances.address",
        "Address"
      ),

    latitude:
      t(
        "cityOverviewMap.customerGrievances.latitude",
        "Latitude"
      ),

    longitude:
      t(
        "cityOverviewMap.customerGrievances.longitude",
        "Longitude"
      ),

    date:
      t(
        "cityOverviewMap.customerGrievances.date",
        "Date"
      ),

    complaints:
      t(
        "cityOverviewMap.customerGrievances.complaints",
        "Complaints"
      ),
  };

  /* ==========================================================
     FETCH COMPLAINTS
  ========================================================== */

  useEffect(() => {
    let cancelled =
      false;

    const fetchData =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await fetch(
              COMPLAINTS_ENDPOINT,
              {
                method: "GET",

                headers: {
                  Accept:
                    "application/json",
                },
              }
            );

          const contentType =
            response.headers.get(
              "content-type"
            ) || "";

          const responseText =
            await response.text();

          /*
           * Prevent HTML / wrong endpoint
           * responses from crashing JSON parsing.
           */

          if (
            !contentType.includes(
              "application/json"
            )
          ) {
            throw new Error(
              `Backend returned ${response.status} ${response.statusText} instead of JSON.`
            );
          }

          let payload;

          try {
            payload =
              JSON.parse(
                responseText
              );
          } catch {
            throw new Error(
              "Backend returned invalid JSON."
            );
          }

          if (
            !response.ok
          ) {
            throw new Error(
              payload?.message ||
                `Request failed with status ${response.status}`
            );
          }

          if (cancelled) {
            return;
          }

          /*
           * Complaint array can be returned
           * in different backend shapes.
           */

          let complaintData =
            [];

          if (
            Array.isArray(
              payload?.data
            )
          ) {
            complaintData =
              payload.data;
          } else if (
            Array.isArray(
              payload?.complaints
            )
          ) {
            complaintData =
              payload.complaints;
          } else if (
            Array.isArray(
              payload?.data
                ?.complaints
            )
          ) {
            complaintData =
              payload.data
                .complaints;
          }

          /*
           * Bengaluru boundary.
           */

          const paths =
            extractBoundaryPaths(
              payload
            );

          setBoundaryPaths(
            paths
          );

          /*
           * Normalize complaint
           * coordinates.
           */

          const cleanedComplaints =
            complaintData
              .map(
                (item) => {
                  const lat =
                    Number(
                      item?.lat ??
                        item?.latitude
                    );

                  const long =
                    Number(
                      item?.long ??
                        item?.longitude ??
                        item?.lng
                    );

                  return {
                    ...item,
                    lat,
                    long,
                  };
                }
              )
              .filter(
                (item) =>
                  isValidCoordinate(
                    item.lat
                  ) &&
                  isValidCoordinate(
                    item.long
                  )
              );

          setComplaints(
            cleanedComplaints
          );
        } catch (
          fetchError
        ) {
          console.error(
            "CUSTOMER GRIEVANCES ERROR:",
            fetchError
          );

          if (!cancelled) {
            setError(
              fetchError?.message ||
                errorText
            );
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [errorText]);

  /* ==========================================================
     ONLY SHOW COMPLAINTS INSIDE BENGALURU
  ========================================================== */

  const visibleComplaints =
    useMemo(() => {
      if (
        boundaryPaths.length ===
        0
      ) {
        return complaints;
      }

      return complaints.filter(
        (complaint) =>
          boundaryPaths.some(
            (polygon) =>
              isPointInsidePolygon(
                complaint.lat,
                complaint.long,
                polygon
              )
          )
      );
    }, [
      complaints,
      boundaryPaths,
    ]);

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <div
        className="
          relative
          flex
          h-full
          min-h-[420px]
          w-full
          items-center
          justify-center
          overflow-hidden
          rounded-[14px]
          bg-[#EEF1F3]
          sm:min-h-[500px]
          md:min-h-[560px]
          lg:min-h-[620px]
        "
      >
        <div
          className="
            flex
            flex-col
            items-center
            gap-3
            rounded-2xl
            border
            border-white/80
            bg-white/95
            px-6
            py-5
            text-center
            shadow-[0_12px_35px_rgba(30,45,60,0.08)]
          "
        >
          <div
            className="
              h-8
              w-8
              animate-spin
              rounded-full
              border-2
              border-slate-200
              border-t-blue-600
            "
          />

          <p
            className="
              text-[12px]
              font-semibold
              text-[#536B84]
            "
          >
            {loadingText}
          </p>
        </div>
      </div>
    );
  }

  /* ==========================================================
     ERROR
  ========================================================== */

  if (error) {
    return (
      <div
        className="
          flex
          min-h-[420px]
          w-full
          items-center
          justify-center
          rounded-[14px]
          bg-[#EEF1F3]
          p-4
          sm:min-h-[500px]
          md:min-h-[560px]
        "
      >
        <div
          className="
            w-full
            max-w-md
            rounded-2xl
            border
            border-red-100
            bg-white
            p-5
            shadow-[0_12px_35px_rgba(30,45,60,0.08)]
            sm:p-6
          "
        >
          <div
            className="
              flex
              items-start
              gap-3
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-red-50
                text-red-500
              "
            >
              <MessageSquareWarning
                size={19}
              />
            </div>

            <div
              className="
                min-w-0
              "
            >
              <h2
                className="
                  text-[14px]
                  font-bold
                  text-[#17243A]
                "
              >
                {title}
              </h2>

              <p
                className="
                  mt-1.5
                  break-words
                  text-[11px]
                  leading-5
                  text-red-500
                "
              >
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================================
     MAIN MAP
  ========================================================== */

  return (
    <div
      className="
        relative
        h-full
        min-h-[420px]
        w-full
        overflow-hidden
        rounded-[14px]
        bg-[#EEF1F3]

        sm:min-h-[500px]
        md:min-h-[560px]
        lg:min-h-[620px]
        xl:min-h-[650px]
      "
    >
      <MapContainer
        center={
          BENGALURU_CENTER
        }
        zoom={
          DEFAULT_ZOOM
        }
        scrollWheelZoom
        zoomControl={false}
        className="
          h-full
          min-h-[420px]
          w-full

          sm:min-h-[500px]
          md:min-h-[560px]
          lg:min-h-[620px]
          xl:min-h-[650px]
        "
      >
        {/* ==================================================
            CARTO MAP
        ================================================== */}

        <TileLayer
          attribution={
            CARTO_ATTRIBUTION
          }
          url={
            CARTO_LIGHT_URL
          }
          subdomains={[
            "a",
            "b",
            "c",
            "d",
          ]}
          maxZoom={20}
        />

        <MapSizeController />

        <BengaluruMapFocus
          boundaryPaths={
            boundaryPaths
          }
        />

        <ZoomControl
          position="topleft"
        />

        {/* ==================================================
            BENGALURU BOUNDARY
        ================================================== */}

        {boundaryPaths.map(
          (
            polygon,
            index
          ) => (
            <Polygon
              key={
                `grievance-boundary-${index}`
              }
              positions={
                polygon
              }
              pathOptions={{
                color:
                  "#2563EB",
                weight: 3,
                opacity: 0.95,
                fillColor:
                  "#3B82F6",
                fillOpacity:
                  0.04,
              }}
            />
          )
        )}

        {/* ==================================================
            COMPLAINT MARKERS
        ================================================== */}

        {visibleComplaints.map(
          (
            complaint,
            index
          ) => {
            const ticket =
              getField(
                complaint,
                [
                  "ticketNumber",
                  "ticket_number",
                  "ticketNo",
                  "ticket",
                  "id",
                ],
                `#${index + 1}`
              );

            const complaintTitle =
              getField(
                complaint,
                [
                  "title",
                  "complaintTitle",
                  "complaint_title",
                  "subject",
                  "name",
                ],
                title
              );

            const status =
              getField(
                complaint,
                [
                  "status",
                  "complaintStatus",
                ],
                "—"
              );

            const category =
              getField(
                complaint,
                [
                  "category",
                  "complaintCategory",
                  "complaint_category",
                ],
                "—"
              );

            const phone =
              getField(
                complaint,
                [
                  "phone",
                  "phoneNumber",
                  "citizenPhone",
                  "citizen_phone",
                  "contactNumber",
                ],
                "—"
              );

            const description =
              getField(
                complaint,
                [
                  "description",
                  "complaintDescription",
                  "complaint_description",
                ],
                "—"
              );

            const address =
              getField(
                complaint,
                [
                  "address",
                  "location",
                  "fullAddress",
                ],
                "—"
              );

            const createdAt =
              getField(
                complaint,
                [
                  "createdAt",
                  "created_at",
                  "date",
                  "timestamp",
                ],
                ""
              );

            const statusClasses =
              getStatusClasses(
                status
              );

            return (
              <Marker
                key={
                  complaint.id ??
                  ticket ??
                  `complaint-${index}`
                }
                position={[
                  complaint.lat,
                  complaint.long,
                ]}
                icon={
                  complaintIcon
                }
              >
                <Popup
                  maxWidth={360}
                  minWidth={250}
                  closeButton
                  className="
                    customer-grievance-popup
                  "
                >
                  <div
                    className="
                      w-[240px]
                      max-w-[calc(100vw-60px)]
                      overflow-hidden
                      rounded-xl
                      bg-white
                      sm:w-[310px]
                    "
                  >
                    {/* ======================================
                        POPUP HEADER
                    ====================================== */}

                    <div
                      className="
                        border-b
                        border-slate-100
                        pb-3
                      "
                    >
                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-3
                        "
                      >
                        <div
                          className="
                            min-w-0
                          "
                        >
                          <h3
                            className="
                              break-words
                              text-[14px]
                              font-bold
                              leading-5
                              text-[#162033]
                              sm:text-[16px]
                            "
                          >
                            {
                              complaintTitle
                            }
                          </h3>

                          <p
                            className="
                              mt-1
                              break-all
                              text-[10px]
                              text-[#7890AA]
                              sm:text-[11px]
                            "
                          >
                            {
                              labels.ticket
                            }
                            :{" "}
                            {ticket}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ======================================
                        STATUS
                    ====================================== */}

                    <div
                      className="
                        mt-3
                        flex
                        items-center
                        justify-between
                        gap-3
                      "
                    >
                      <span
                        className="
                          text-[11px]
                          text-[#69819B]
                          sm:text-[12px]
                        "
                      >
                        {
                          labels.status
                        }
                      </span>

                      <span
                        className={`
                          inline-flex
                          max-w-[170px]
                          items-center
                          gap-1.5
                          rounded-full
                          px-2.5
                          py-1
                          text-right
                          text-[9px]
                          font-bold
                          sm:text-[10px]
                          ${statusClasses.badge}
                        `}
                      >
                        <span
                          className={`
                            h-1.5
                            w-1.5
                            shrink-0
                            rounded-full
                            ${statusClasses.dot}
                          `}
                        />

                        <span
                          className="
                            break-words
                          "
                        >
                          {status}
                        </span>
                      </span>
                    </div>

                    {/* ======================================
                        BASIC DATA
                    ====================================== */}

                    <div
                      className="
                        mt-2
                        divide-y
                        divide-slate-100
                      "
                    >
                      <PopupRow
                        label={
                          labels.category
                        }
                        value={
                          category
                        }
                      />

                      <PopupRow
                        label={
                          labels.phone
                        }
                        value={
                          phone
                        }
                      />
                    </div>

                    {/* ======================================
                        DESCRIPTION
                    ====================================== */}

                    <div
                      className="
                        mt-2
                      "
                    >
                      <p
                        className="
                          mb-1
                          text-[10px]
                          font-medium
                          text-[#6E86A0]
                          sm:text-[11px]
                        "
                      >
                        {
                          labels.description
                        }
                      </p>

                      <div
                        className="
                          max-h-[100px]
                          overflow-y-auto
                          rounded-xl
                          bg-[#F6F8FA]
                          px-3
                          py-2.5
                          text-[10px]
                          leading-4
                          text-[#40566D]
                          sm:text-[11px]
                        "
                      >
                        {
                          description
                        }
                      </div>
                    </div>

                    {/* ======================================
                        ADDRESS
                    ====================================== */}

                    <div
                      className="
                        mt-2
                      "
                    >
                      <p
                        className="
                          mb-1
                          text-[10px]
                          font-medium
                          text-[#6E86A0]
                          sm:text-[11px]
                        "
                      >
                        {
                          labels.address
                        }
                      </p>

                      <p
                        className="
                          break-words
                          text-[10px]
                          leading-4
                          text-[#40566D]
                          sm:text-[11px]
                        "
                      >
                        {address}
                      </p>
                    </div>

                    {/* ======================================
                        COORDINATES
                    ====================================== */}

                    <div
                      className="
                        mt-3
                        grid
                        grid-cols-2
                        gap-2
                      "
                    >
                      <div
                        className="
                          rounded-lg
                          bg-[#F6F8FA]
                          px-2.5
                          py-2
                        "
                      >
                        <p
                          className="
                            text-[8px]
                            font-semibold
                            uppercase
                            tracking-wide
                            text-[#9AAABC]
                          "
                        >
                          {
                            labels.latitude
                          }
                        </p>

                        <p
                          className="
                            mt-0.5
                            break-all
                            text-[10px]
                            font-semibold
                            text-[#34495E]
                          "
                        >
                          {
                            Number(
                              complaint.lat
                            ).toFixed(
                              7
                            )
                          }
                        </p>
                      </div>

                      <div
                        className="
                          rounded-lg
                          bg-[#F6F8FA]
                          px-2.5
                          py-2
                        "
                      >
                        <p
                          className="
                            text-[8px]
                            font-semibold
                            uppercase
                            tracking-wide
                            text-[#9AAABC]
                          "
                        >
                          {
                            labels.longitude
                          }
                        </p>

                        <p
                          className="
                            mt-0.5
                            break-all
                            text-[10px]
                            font-semibold
                            text-[#34495E]
                          "
                        >
                          {
                            Number(
                              complaint.long
                            ).toFixed(
                              7
                            )
                          }
                        </p>
                      </div>
                    </div>

                    {/* ======================================
                        CREATED DATE
                    ====================================== */}

                    {createdAt && (
                      <div
                        className="
                          mt-2
                          border-t
                          border-slate-100
                          pt-2
                        "
                      >
                        <PopupRow
                          label={
                            labels.date
                          }
                          value={formatDate(
                            createdAt
                          )}
                        />
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          }
        )}
      </MapContainer>

      {/* ====================================================
          EMPTY STATE
      ==================================================== */}

      {visibleComplaints.length ===
        0 && (
        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-4
            z-[500]
            flex
            justify-center
            px-4
          "
        >
          <div
            className="
              rounded-xl
              border
              border-white/80
              bg-white/95
              px-4
              py-2.5
              text-center
              text-[10px]
              font-semibold
              text-[#71869D]
              shadow-[0_8px_25px_rgba(30,45,60,0.08)]
              sm:text-[11px]
            "
          >
            {noComplaintsText}
          </div>
        </div>
      )}

      {/* ====================================================
          RESPONSIVE COMPLAINT COUNT
      ==================================================== */}

      {visibleComplaints.length >
        0 && (
        <div
          className="
            pointer-events-none
            absolute
            bottom-3
            right-3
            z-[500]
            sm:bottom-4
            sm:right-4
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
              rounded-full
              border
              border-white/80
              bg-white/95
              px-3
              py-1.5
              text-[9px]
              font-semibold
              text-[#58708A]
              shadow-[0_8px_25px_rgba(30,45,60,0.08)]
              sm:px-3.5
              sm:py-2
              sm:text-[10px]
            "
          >
            <span
              className="
                h-2
                w-2
                rounded-full
                bg-red-500
              "
            />

            {visibleComplaints.length}{" "}
            {labels.complaints}
          </div>
        </div>
      )}
    </div>
  );
}