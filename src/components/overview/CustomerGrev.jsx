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
      <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div className="h-7 w-64 animate-pulse rounded-lg bg-slate-100" />

          <div className="h-8 w-28 animate-pulse rounded-full bg-slate-100" />
        </div>

        <div className="h-[650px] w-full animate-pulse bg-slate-100" />
      </div>
    );
  }

  /* ==========================================================
     ERROR
  ========================================================== */

  if (error) {
    return (
      <div className="w-full rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 font-bold text-red-500">
            !
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-bold text-slate-900">
              Customer Grievances
            </h2>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>

            <p className="mt-2 break-all text-xs text-slate-500">
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
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
            <svg
              width="23"
              height="23"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 12V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6" />

              <path d="M16 16l2 2 4-4" />
            </svg>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Customer Grievances
            </h2>

            <p className="text-xs text-slate-500">
              Bengaluru complaint locations
            </p>
          </div>
        </div>

        <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
          <span className="text-sm font-semibold text-slate-700">
            {visibleComplaints.length}{" "}
            Complaints
          </span>
        </div>
      </div>

      {/* ======================================================
          MAP
      ====================================================== */}

      <div className="h-[650px] w-full">

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

          className="h-full w-full"
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

                  <div className="w-[300px]">

                    {/* ----------------------------------------
                        TITLE
                    ---------------------------------------- */}

                    <div className="mb-3 border-b border-slate-200 pb-3">

                      <div className="text-base font-bold text-slate-900">
                        {complaint
                          ?.data
                          ?.title ||
                          "Customer Complaint"}
                      </div>

                      <div className="mt-1 text-xs font-medium text-slate-500">
                        Ticket:{" "}
                        {complaint
                          ?.data
                          ?.ticket_number ||
                          "N/A"}
                      </div>

                    </div>

                    {/* ----------------------------------------
                        STATUS
                    ---------------------------------------- */}

                    <div className="mb-3 flex items-center justify-between">

                      <span className="text-xs font-medium text-slate-500">
                        Status
                      </span>

                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                        {complaint
                          ?.data
                          ?.status ||
                          "N/A"}
                      </span>

                    </div>

                    {/* ----------------------------------------
                        CATEGORY
                    ---------------------------------------- */}

                    <div className="mb-3 flex items-start justify-between gap-4">

                      <span className="text-xs font-medium text-slate-500">
                        Category
                      </span>

                      <span className="text-right text-xs font-semibold text-slate-800">
                        {complaint
                          ?.data
                          ?.category ||
                          "N/A"}
                      </span>

                    </div>

                    {/* ----------------------------------------
                        PHONE
                    ---------------------------------------- */}

                    <div className="mb-3 flex items-start justify-between gap-4">

                      <span className="text-xs font-medium text-slate-500">
                        Phone
                      </span>

                      <span className="text-right text-xs font-semibold text-slate-800">
                        {complaint
                          ?.data
                          ?.phone_number ||
                          "N/A"}
                      </span>

                    </div>

                    {/* ----------------------------------------
                        DESCRIPTION
                    ---------------------------------------- */}

                    <div className="mb-3">

                      <div className="mb-1 text-xs font-medium text-slate-500">
                        Description
                      </div>

                      <div className="rounded-lg bg-slate-50 p-2.5 text-xs leading-5 text-slate-700">
                        {complaint
                          ?.data
                          ?.description ||
                          "No description available."}
                      </div>

                    </div>

                    {/* ----------------------------------------
                        ADDRESS
                    ---------------------------------------- */}

                    <div className="mb-3">

                      <div className="mb-1 text-xs font-medium text-slate-500">
                        Address
                      </div>

                      <div className="text-xs leading-5 text-slate-700">
                        {complaint
                          ?.data
                          ?.address ||
                          "N/A"}
                      </div>

                    </div>

                    {/* ----------------------------------------
                        COORDINATES
                    ---------------------------------------- */}

                    <div className="border-t border-slate-200 pt-3">

                      <div className="grid grid-cols-2 gap-2">

                        <div className="rounded-lg bg-slate-50 p-2">

                          <div className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                            Latitude
                          </div>

                          <div className="mt-1 text-xs font-semibold text-slate-700">
                            {complaint.lat}
                          </div>

                        </div>

                        <div className="rounded-lg bg-slate-50 p-2">

                          <div className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                            Longitude
                          </div>

                          <div className="mt-1 text-xs font-semibold text-slate-700">
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
                      <div className="mt-3">

                        <img
                          src={
                            complaint
                              .data
                              .image_url
                          }

                          alt="Complaint"

                          className="h-36 w-full rounded-lg object-cover"

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