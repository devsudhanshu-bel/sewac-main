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
  useMap,
} from "react-leaflet";

import L from "leaflet";

import { useLanguage } from "../../i18n";

import "leaflet/dist/leaflet.css";

/* ============================================================
   BACKEND
============================================================ */

const API_BASE_URL =
  "https://sewac-main.onrender.com";

const COMPLAINTS_ENDPOINT =
  `${API_BASE_URL}/api/complaints-grev/locations`;

/* ============================================================
   BENGALURU DEFAULT VIEW
============================================================ */

const BENGALURU_CENTER = [
  12.9716,
  77.5946,
];

const DEFAULT_ZOOM = 11;

/* ============================================================
   PERSON MARKER
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
   NUMBER VALIDATION
============================================================ */

function isValidCoordinate(
  value
) {
  return (
    typeof value ===
      "number" &&
    Number.isFinite(value)
  );
}

/* ============================================================
   CONVERT POINT TO LEAFLET [LAT, LNG]
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
      GeoJSON:
      [longitude, latitude]

      Normal backend:
      [latitude, longitude]
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
    typeof point ===
      "object"
  ) {
    if (
      point.lat !==
        undefined &&
      point.long !==
        undefined
    ) {
      const lat =
        Number(point.lat);

      const lng =
        Number(point.long);

      if (
        Number.isFinite(lat) &&
        Number.isFinite(lng)
      ) {
        return [
          lat,
          lng,
        ];
      }
    }

    if (
      point.latitude !==
        undefined &&
      point.longitude !==
        undefined
    ) {
      const lat =
        Number(
          point.latitude
        );

      const lng =
        Number(
          point.longitude
        );

      if (
        Number.isFinite(lat) &&
        Number.isFinite(lng)
      ) {
        return [
          lat,
          lng,
        ];
      }
    }

    if (
      point.lat !==
        undefined &&
      point.lng !==
        undefined
    ) {
      const lat =
        Number(point.lat);

      const lng =
        Number(point.lng);

      if (
        Number.isFinite(lat) &&
        Number.isFinite(lng)
      ) {
        return [
          lat,
          lng,
        ];
      }
    }
  }

  return null;
}

/* ============================================================
   NORMALIZE SIMPLE BOUNDARY
============================================================ */

function normalizeBoundary(
  boundary
) {
  if (
    !Array.isArray(
      boundary
    )
  ) {
    return [];
  }

  const points =
    boundary
      .map((point) =>
        normalizePoint(
          point,
          false
        )
      )
      .filter(Boolean);

  if (
    points.length < 3
  ) {
    return [];
  }

  return [
    points,
  ];
}

/* ============================================================
   GEOJSON → POLYGON PATHS
============================================================ */

function geoJsonToPaths(
  geometry
) {
  if (!geometry) {
    return [];
  }

  /* ----------------------------------------------------------
     FEATURE
  ---------------------------------------------------------- */

  if (
    geometry.type ===
      "Feature"
  ) {
    return geoJsonToPaths(
      geometry.geometry
    );
  }

  /* ----------------------------------------------------------
     FEATURE COLLECTION
  ---------------------------------------------------------- */

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

  /* ----------------------------------------------------------
     POLYGON
  ---------------------------------------------------------- */

  if (
    geometry.type ===
      "Polygon"
  ) {
    const rings =
      geometry.coordinates;

    if (
      !Array.isArray(
        rings
      )
    ) {
      return [];
    }

    /*
      First ring = outer boundary.
    */

    const outerRing =
      rings[0];

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

    return path.length >=
      3
      ? [path]
      : [];
  }

  /* ----------------------------------------------------------
     MULTI POLYGON
  ---------------------------------------------------------- */

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
   PARSE POSSIBLE JSON STRING
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

  if (
    !trimmed
  ) {
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
  console.log(
    "🔎 SEARCHING FOR BENGALURU BOUNDARY..."
  );

  /*
    Possible backend property names.
  */

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

  /* ----------------------------------------------------------
     DIRECT SEARCH
  ---------------------------------------------------------- */

  const directCandidates = [];

  possibleKeys.forEach(
    (key) => {
      if (
        payload &&
        payload[key] !==
          undefined &&
        payload[key] !== null
      ) {
        directCandidates.push(
          payload[key]
        );
      }
    }
  );

  /*
    Check nested objects such as:
      payload.city.boundary
      payload.data.boundary
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
            object[key] !==
              null
          ) {
            directCandidates.push(
              object[key]
            );
          }
        }
      );
    }
  );

  /* ----------------------------------------------------------
     SEARCH ARRAY ITEMS
  ---------------------------------------------------------- */

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
              item[key] !==
                null
            ) {
              directCandidates.push(
                item[key]
              );
            }
          }
        );
      }
    );
  }

  /* ----------------------------------------------------------
     PROCESS CANDIDATES
  ---------------------------------------------------------- */

  for (
    const candidateRaw of
      directCandidates
  ) {
    const candidate =
      parsePossibleJson(
        candidateRaw
      );

    console.log(
      "🔍 BOUNDARY CANDIDATE:",
      candidate
    );

    /* --------------------------------------------------------
       GEOJSON
    -------------------------------------------------------- */

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
        console.log(
          "✅ GEOJSON BOUNDARY FOUND:",
          paths.length,
          "polygon(s)"
        );

        return paths;
      }
    }

    /* --------------------------------------------------------
       ARRAY
    -------------------------------------------------------- */

    if (
      Array.isArray(
        candidate
      )
    ) {
      /*
        Direct array of points:
          [
            [lat, lng],
            [lat, lng]
          ]
      */

      if (
        candidate.length >
          0 &&
        Array.isArray(
          candidate[0]
        ) &&
        candidate[0].length >=
          2 &&
        typeof candidate[0][0] !==
          "object"
      ) {
        const paths =
          normalizeBoundary(
            candidate
          );

        if (
          paths.length > 0
        ) {
          console.log(
            "✅ SIMPLE BOUNDARY FOUND:",
            paths[0].length,
            "points"
          );

          return paths;
        }
      }

      /*
        Nested arrays:
          [
            [
              [lat,lng],
              [lat,lng]
            ]
          ]
      */

      if (
        Array.isArray(
          candidate[0]
        ) &&
        Array.isArray(
          candidate[0][0]
        )
      ) {
        const paths =
          candidate
            .map(
              (ring) =>
                normalizeBoundary(
                  ring
                )
            )
            .flat();

        if (
          paths.length > 0
        ) {
          console.log(
            "✅ NESTED BOUNDARY FOUND:",
            paths.length,
            "polygon(s)"
          );

          return paths;
        }
      }
    }
  }

  console.warn(
    "⚠️ NO BENGALURU BOUNDARY FOUND IN RESPONSE"
  );

  console.warn(
    "⚠️ RESPONSE KEYS:",
    Object.keys(
      payload || {}
    )
  );

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

    if (
      intersect
    ) {
      inside =
        !inside;
    }
  }

  return inside;
}

/* ============================================================
   MAP FOCUS COMPONENT
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
        console.log(
          "🎯 FITTING MAP TO BENGALURU BOUNDARY"
        );

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
    } catch (error) {
      console.error(
        "❌ BENGALURU MAP FOCUS ERROR:",
        error
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
   MAIN COMPONENT
============================================================ */

export default function CustomerGrev() {
  /* ==========================================================
     LANGUAGE
  ========================================================== */

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

  const subtitle =
    t(
      "cityOverviewMap.customerGrievances.subtitle",
      "Bengaluru complaint locations"
    );

  const complaintsText =
    t(
      "cityOverviewMap.customerGrievances.complaints",
      "Complaints"
    );

  const loadingTitle =
    t(
      "cityOverviewMap.customerGrievances.loading",
      "Loading customer grievances..."
    );

  const errorTitle =
    t(
      "cityOverviewMap.customerGrievances.error",
      "Unable to load customer grievances."
    );

  const customerComplaintText =
    t(
      "cityOverviewMap.customerGrievances.customerComplaint",
      "Customer Complaint"
    );

  const ticketText =
    t(
      "cityOverviewMap.customerGrievances.ticket",
      "Ticket"
    );

  const statusText =
    t(
      "cityOverviewMap.customerGrievances.status",
      "Status"
    );

  const categoryText =
    t(
      "cityOverviewMap.customerGrievances.category",
      "Category"
    );

  const phoneText =
    t(
      "cityOverviewMap.customerGrievances.phone",
      "Phone"
    );

  const descriptionText =
    t(
      "cityOverviewMap.customerGrievances.description",
      "Description"
    );

  const addressText =
    t(
      "cityOverviewMap.customerGrievances.address",
      "Address"
    );

  const latitudeText =
    t(
      "cityOverviewMap.customerGrievances.latitude",
      "Latitude"
    );

  const longitudeText =
    t(
      "cityOverviewMap.customerGrievances.longitude",
      "Longitude"
    );

  const noDescriptionText =
    t(
      "cityOverviewMap.customerGrievances.noDescription",
      "No description available."
    );

  const notAvailableText =
    t(
      "cityOverviewMap.customerGrievances.notAvailable",
      "N/A"
    );

  const complaintImageAlt =
    t(
      "cityOverviewMap.customerGrievances.imageAlt",
      "Complaint"
    );

  /*
    Keep the locale ready for future
    date/string formatting without
    changing the existing data logic.
  */

  const locale =
    language === "kn"
      ? "kn-IN"
      : language === "hi"
      ? "hi-IN"
      : "en-IN";

  /* ==========================================================
     FETCH COMPLAINTS + BOUNDARY
  ========================================================== */

  useEffect(() => {
    let cancelled =
      false;

    const fetchData =
      async () => {
        try {
          setLoading(true);
          setError("");

          console.log(
            "=============================================="
          );

          console.log(
            "📍 CUSTOMER GRIEVANCES MAP REQUEST"
          );

          console.log(
            "ENDPOINT:",
            COMPLAINTS_ENDPOINT
          );

          console.log(
            "=============================================="
          );

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

          /* ------------------------------------------------
             HTML / WRONG ENDPOINT PROTECTION
          ------------------------------------------------ */

          if (
            !contentType.includes(
              "application/json"
            )
          ) {
            console.error(
              "❌ NON JSON RESPONSE:"
            );

            console.error(
              responseText.substring(
                0,
                500
              )
            );

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
          } catch (
            jsonError
          ) {
            console.error(
              "❌ JSON PARSE ERROR:",
              jsonError
            );

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

          if (
            cancelled
          ) {
            return;
          }

          console.log(
            "✅ CUSTOMER GRIEVANCES RESPONSE:",
            payload
          );

          /* =================================================
             COMPLAINT DATA
          ================================================= */

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

          /* =================================================
             BENGALURU BOUNDARY
          ================================================= */

          const paths =
            extractBoundaryPaths(
              payload
            );

          console.log(
            "🟢 BENGALURU BOUNDARY POLYGONS:",
            paths.length
          );

          console.log(
            "🟢 BENGALURU BOUNDARY TOTAL POINTS:",
            paths.reduce(
              (
                total,
                path
              ) =>
                total +
                path.length,
              0
            )
          );

          setBoundaryPaths(
            paths
          );

          /* =================================================
             CLEAN COMPLAINT DATA
          ================================================= */

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
                        item?.longitude
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

          console.log(
            "📍 TOTAL COMPLAINTS:",
            cleanedComplaints.length
          );

          setComplaints(
            cleanedComplaints
          );
        } catch (
          fetchError
        ) {
          console.error(
            "❌ CUSTOMER GRIEVANCES ERROR:",
            fetchError
          );

          if (
            !cancelled
          ) {
            setError(
              fetchError.message ||
                "Failed to load customer grievances."
            );
          }
        } finally {
          if (
            !cancelled
          ) {
            setLoading(false);
          }
        }
      };

    fetchData();

    return () => {
      cancelled =
        true;
    };
  }, []);

  /* ==========================================================
     ONLY COMPLAINTS INSIDE BENGALURU
  ========================================================== */

  const visibleComplaints =
    useMemo(() => {
      if (
        boundaryPaths.length ===
        0
      ) {
        /*
          Boundary hasn't arrived.
          Keep the complaints visible.
        */

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
          w-full
          overflow-hidden
          rounded-xl
          sm:rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >
        <div
          className="
            flex
            flex-col
            gap-3
            border-b
            border-slate-200
            px-3
            py-3
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:px-6
            sm:py-5
          "
        >
          <div
            className="
              h-6
              w-48
              animate-pulse
              rounded-lg
              bg-slate-100
              sm:h-7
              sm:w-64
            "
          />

          <div
            className="
              h-8
              w-24
              animate-pulse
              rounded-full
              bg-slate-100
              sm:w-28
            "
          />
        </div>

        <div
          className="
            h-[420px]
            w-full
            animate-pulse
            bg-slate-100
            sm:h-[500px]
            md:h-[560px]
            lg:h-[650px]
          "
        />
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
          w-full
          rounded-xl
          sm:rounded-2xl
          border
          border-red-200
          bg-white
          p-4
          shadow-sm
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
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-red-50
              font-bold
              text-red-500
              sm:h-10
              sm:w-10
            "
          >
            !
          </div>

          <div
            className="
              min-w-0
              flex-1
            "
          >
            <h2
              className="
                text-sm
                font-bold
                text-slate-900
                sm:text-base
              "
            >
              {title}
            </h2>

            <p
              className="
                mt-1
                break-words
                text-xs
                text-red-600
                sm:text-sm
              "
            >
              {error ||
                errorTitle}
            </p>

            <p
              className="
                mt-2
                break-all
                text-[10px]
                text-slate-500
                sm:text-xs
              "
            >
              {COMPLAINTS_ENDPOINT}
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================================
     MAIN RENDER
  ========================================================== */

  return (
    <div
      className="
        w-full
        min-w-0
        overflow-hidden
        rounded-xl
        sm:rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        className="
          flex
          flex-col
          gap-3
          border-b
          border-slate-200
          bg-white
          px-3
          py-3
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:px-5
          sm:py-4
          md:px-6
          md:py-5
        "
      >
        <div
          className="
            flex
            min-w-0
            items-center
            gap-2.5
            sm:gap-3
          "
        >

          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-slate-50
              text-slate-600
              sm:h-10
              sm:w-10
              sm:rounded-xl
            "
          >
            <svg
              width="23"
              height="23"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="
                h-5
                w-5
                sm:h-[23px]
                sm:w-[23px]
              "
            >
              <path d="M20 12V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6" />

              <path d="M16 16l2 2 4-4" />
            </svg>
          </div>

          <div
            className="
              min-w-0
            "
          >
            <h2
              className="
                truncate
                text-base
                font-bold
                text-slate-900
                sm:text-lg
                md:text-xl
              "
            >
              {title}
            </h2>

            <p
              className="
                truncate
                text-[10px]
                text-slate-500
                sm:text-xs
              "
            >
              {subtitle}
            </p>
          </div>
        </div>

        <div
          className="
            self-start
            rounded-full
            border
            border-slate-200
            bg-slate-50
            px-3
            py-1.5
            sm:self-auto
            sm:px-4
            sm:py-2
          "
        >
          <span
            className="
              whitespace-nowrap
              text-[11px]
              font-semibold
              text-slate-700
              sm:text-xs
              md:text-sm
            "
          >
            {visibleComplaints.length}{" "}
            {complaintsText}
          </span>
        </div>
      </div>

      {/* ======================================================
          MAP
      ====================================================== */}

      <div
        className="
          h-[420px]
          w-full
          min-w-0
          sm:h-[500px]
          md:h-[560px]
          lg:h-[650px]
        "
      >

        <MapContainer
          center={
            BENGALURU_CENTER
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

          className="
            h-full
            w-full
          "
        >

          {/* ==================================================
              PALE WHITE MAP
          ================================================== */}

          <TileLayer
            attribution='&copy; OpenStreetMap contributors &copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            subdomains={[
              "a",
              "b",
              "c",
              "d",
            ]}
            maxZoom={20}
          />

          {/* ==================================================
              FOCUS ONLY BENGALURU
          ================================================== */}

          <BengaluruMapFocus
            boundaryPaths={
              boundaryPaths
            }
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
                key={`bengaluru-boundary-${index}`}
                positions={
                  polygon
                }

                pathOptions={{
                  color:
                    "#2563eb",

                  weight: 3,

                  opacity: 1,

                  fillColor:
                    "#2563eb",

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
            ) => (
              <Marker
                key={
                  complaint
                    ?.data
                    ?.id ??
                  index
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
                  closeButton={
                    true
                  }

                  maxWidth={
                    350
                  }
                >

                  <div
                    className="
                      w-[280px]
                      max-w-[calc(100vw-40px)]
                      sm:w-[300px]
                    "
                  >

                    {/* ----------------------------------------
                        TITLE
                    ---------------------------------------- */}

                    <div
                      className="
                        mb-3
                        border-b
                        border-slate-200
                        pb-3
                      "
                    >

                      <div
                        className="
                          break-words
                          text-sm
                          font-bold
                          text-slate-900
                          sm:text-base
                        "
                      >
                        {complaint
                          ?.data
                          ?.title ||
                          customerComplaintText}
                      </div>

                      <div
                        className="
                          mt-1
                          break-all
                          text-[10px]
                          font-medium
                          text-slate-500
                          sm:text-xs
                        "
                      >
                        {ticketText}:{" "}
                        {complaint
                          ?.data
                          ?.ticket_number ||
                          notAvailableText}
                      </div>

                    </div>

                    {/* ----------------------------------------
                        STATUS
                    ---------------------------------------- */}

                    <div
                      className="
                        mb-3
                        flex
                        items-start
                        justify-between
                        gap-3
                      "
                    >

                      <span
                        className="
                          shrink-0
                          text-[10px]
                          font-medium
                          text-slate-500
                          sm:text-xs
                        "
                      >
                        {statusText}
                      </span>

                      <span
                        className="
                          max-w-[65%]
                          break-words
                          rounded-full
                          bg-blue-50
                          px-2
                          py-1
                          text-right
                          text-[10px]
                          font-semibold
                          text-blue-700
                          sm:px-2.5
                          sm:text-xs
                        "
                      >
                        {complaint
                          ?.data
                          ?.status ||
                          notAvailableText}
                      </span>

                    </div>

                    {/* ----------------------------------------
                        CATEGORY
                    ---------------------------------------- */}

                    <div
                      className="
                        mb-3
                        flex
                        items-start
                        justify-between
                        gap-3
                      "
                    >

                      <span
                        className="
                          shrink-0
                          text-[10px]
                          font-medium
                          text-slate-500
                          sm:text-xs
                        "
                      >
                        {categoryText}
                      </span>

                      <span
                        className="
                          min-w-0
                          max-w-[65%]
                          break-words
                          text-right
                          text-[10px]
                          font-semibold
                          text-slate-800
                          sm:text-xs
                        "
                      >
                        {complaint
                          ?.data
                          ?.category ||
                          notAvailableText}
                      </span>

                    </div>

                    {/* ----------------------------------------
                        PHONE
                    ---------------------------------------- */}

                    <div
                      className="
                        mb-3
                        flex
                        items-start
                        justify-between
                        gap-3
                      "
                    >

                      <span
                        className="
                          shrink-0
                          text-[10px]
                          font-medium
                          text-slate-500
                          sm:text-xs
                        "
                      >
                        {phoneText}
                      </span>

                      <span
                        className="
                          min-w-0
                          max-w-[65%]
                          break-all
                          text-right
                          text-[10px]
                          font-semibold
                          text-slate-800
                          sm:text-xs
                        "
                      >
                        {complaint
                          ?.data
                          ?.phone_number ||
                          notAvailableText}
                      </span>

                    </div>

                    {/* ----------------------------------------
                        DESCRIPTION
                    ---------------------------------------- */}

                    <div
                      className="
                        mb-3
                      "
                    >

                      <div
                        className="
                          mb-1
                          text-[10px]
                          font-medium
                          text-slate-500
                          sm:text-xs
                        "
                      >
                        {descriptionText}
                      </div>

                      <div
                        className="
                          max-h-24
                          overflow-y-auto
                          break-words
                          rounded-lg
                          bg-slate-50
                          p-2
                          text-[10px]
                          leading-4
                          text-slate-700
                          sm:p-2.5
                          sm:text-xs
                          sm:leading-5
                        "
                      >
                        {complaint
                          ?.data
                          ?.description ||
                          noDescriptionText}
                      </div>

                    </div>

                    {/* ----------------------------------------
                        ADDRESS
                    ---------------------------------------- */}

                    <div
                      className="
                        mb-3
                      "
                    >

                      <div
                        className="
                          mb-1
                          text-[10px]
                          font-medium
                          text-slate-500
                          sm:text-xs
                        "
                      >
                        {addressText}
                      </div>

                      <div
                        className="
                          max-h-20
                          overflow-y-auto
                          break-words
                          text-[10px]
                          leading-4
                          text-slate-700
                          sm:text-xs
                          sm:leading-5
                        "
                      >
                        {complaint
                          ?.data
                          ?.address ||
                          notAvailableText}
                      </div>

                    </div>

                    {/* ----------------------------------------
                        COORDINATES
                    ---------------------------------------- */}

                    <div
                      className="
                        border-t
                        border-slate-200
                        pt-3
                      "
                    >

                      <div
                        className="
                          grid
                          grid-cols-2
                          gap-2
                        "
                      >

                        <div
                          className="
                            min-w-0
                            rounded-lg
                            bg-slate-50
                            p-2
                          "
                        >

                          <div
                            className="
                              text-[9px]
                              font-medium
                              uppercase
                              tracking-wide
                              text-slate-400
                              sm:text-[10px]
                            "
                          >
                            {latitudeText}
                          </div>

                          <div
                            className="
                              mt-1
                              break-all
                              text-[10px]
                              font-semibold
                              text-slate-700
                              sm:text-xs
                            "
                          >
                            {complaint.lat}
                          </div>

                        </div>

                        <div
                          className="
                            min-w-0
                            rounded-lg
                            bg-slate-50
                            p-2
                          "
                        >

                          <div
                            className="
                              text-[9px]
                              font-medium
                              uppercase
                              tracking-wide
                              text-slate-400
                              sm:text-[10px]
                            "
                          >
                            {longitudeText}
                          </div>

                          <div
                            className="
                              mt-1
                              break-all
                              text-[10px]
                              font-semibold
                              text-slate-700
                              sm:text-xs
                            "
                          >
                            {complaint.long}
                          </div>

                        </div>

                      </div>

                    </div>

                    {/* ----------------------------------------
                        IMAGE
                    ---------------------------------------- */}

                    {complaint
                      ?.data
                      ?.image_url && (
                      <div
                        className="
                          mt-3
                        "
                      >

                        <img
                          src={
                            complaint
                              .data
                              .image_url
                          }

                          alt={
                            complaintImageAlt
                          }

                          className="
                            h-28
                            w-full
                            rounded-lg
                            object-cover
                            sm:h-36
                          "

                          onError={(
                            event
                          ) => {
                            event.currentTarget.style.display =
                              "none";
                          }}
                        />

                      </div>
                    )}

                  </div>

                </Popup>

              </Marker>
            )
          )}

        </MapContainer>

      </div>

    </div>
  );
}