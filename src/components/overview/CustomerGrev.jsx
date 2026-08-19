import React, { useEffect, useMemo, useState } from "react";
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

const API_BASE_URL = "https://sewac-main.onrender.com";

const COMPLAINTS_ENDPOINT =
  `${API_BASE_URL}/api/complaints-grev/locations`;

/* ============================================================
   BENGALURU DEFAULT VIEW
============================================================ */

const BENGALURU_CENTER = [12.9716, 77.5946];

const DEFAULT_ZOOM = 11;

/* ============================================================
   PERSON MARKER
============================================================ */

const complaintIcon = L.divIcon({
  className: "custom-complaint-marker",
  html: `
    <div
      style="
        width: 42px;
        height: 42px;
        border-radius: 9999px;
        background: #2563eb;
        border: 3px solid white;
        box-shadow:
          0 4px 12px rgba(0,0,0,0.25),
          0 0 0 3px rgba(37,99,235,0.15);
        display: flex;
        align-items: center;
        justify-content: center;
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
        <circle cx="12" cy="8" r="4"></circle>
        <path d="M4 21c0-4.418 3.582-8 8-8s8 3.582 8 8"></path>
      </svg>
    </div>
  `,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
  popupAnchor: [0, -22],
});

/* ============================================================
   FIT MAP TO BENGALURU BOUNDARY
============================================================ */

function BengaluruMapFocus({ boundary }) {
  const map = useMap();

  useEffect(() => {
    if (!boundary || boundary.length === 0) {
      map.setView(BENGALURU_CENTER, DEFAULT_ZOOM);
      return;
    }

    try {
      const bounds = L.latLngBounds(boundary);

      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [30, 30],
          maxZoom: 12,
          animate: false,
        });
      }
    } catch (error) {
      console.error(
        "❌ Failed to focus Bengaluru boundary:",
        error
      );

      map.setView(
        BENGALURU_CENTER,
        DEFAULT_ZOOM
      );
    }
  }, [boundary, map]);

  return null;
}

/* ============================================================
   EXTRACT BOUNDARY FROM BACKEND RESPONSE
============================================================ */

function extractBoundary(payload) {
  /*
   Supported backend formats:

   1.
   {
     success: true,
     data: [...],
     boundary: [...]
   }

   2.
   {
     success: true,
     data: {
       complaints: [...],
       boundary: [...]
     }
   }

   3.
   {
     success: true,
     data: [...],
     city: {
       boundary: [...]
     }
   }

   4. GeoJSON:
   {
     boundary: {
       type: "Feature",
       geometry: {
         type: "Polygon",
         coordinates: [...]
       }
     }
  */

  let boundary =
    payload?.boundary ||
    payload?.city?.boundary ||
    payload?.data?.boundary ||
    payload?.cityBoundary ||
    null;

  if (!boundary) {
    return [];
  }

  /* ----------------------------------------------------------
     GeoJSON Feature
  ---------------------------------------------------------- */

  if (
    boundary.type === "Feature" &&
    boundary.geometry
  ) {
    boundary = boundary.geometry;
  }

  /* ----------------------------------------------------------
     GeoJSON FeatureCollection
  ---------------------------------------------------------- */

  if (
    boundary.type === "FeatureCollection" &&
    Array.isArray(boundary.features)
  ) {
    const firstFeature =
      boundary.features[0];

    if (
      firstFeature?.geometry
    ) {
      boundary =
        firstFeature.geometry;
    }
  }

  /* ----------------------------------------------------------
     GeoJSON Geometry
  ---------------------------------------------------------- */

  if (
    boundary.type === "Polygon" &&
    Array.isArray(boundary.coordinates)
  ) {
    const ring =
      boundary.coordinates[0];

    return ring
      .map((point) => {
        if (
          Array.isArray(point) &&
          point.length >= 2
        ) {
          return [
            Number(point[1]),
            Number(point[0]),
          ];
        }

        return null;
      })
      .filter(Boolean);
  }

  /* ----------------------------------------------------------
     GeoJSON MultiPolygon
  ---------------------------------------------------------- */

  if (
    boundary.type === "MultiPolygon" &&
    Array.isArray(boundary.coordinates)
  ) {
    const polygon =
      boundary.coordinates[0];

    const ring =
      polygon?.[0];

    if (!Array.isArray(ring)) {
      return [];
    }

    return ring
      .map((point) => {
        if (
          Array.isArray(point) &&
          point.length >= 2
        ) {
          return [
            Number(point[1]),
            Number(point[0]),
          ];
        }

        return null;
      })
      .filter(Boolean);
  }

  /* ----------------------------------------------------------
     Simple [lat, long] array
  ---------------------------------------------------------- */

  if (Array.isArray(boundary)) {
    return boundary
      .map((point) => {
        if (
          Array.isArray(point) &&
          point.length >= 2
        ) {
          return [
            Number(point[0]),
            Number(point[1]),
          ];
        }

        /*
         Support object format:
         { lat: ..., long: ... }
        */

        if (
          point &&
          typeof point === "object" &&
          point.lat !== undefined &&
          point.long !== undefined
        ) {
          return [
            Number(point.lat),
            Number(point.long),
          ];
        }

        /*
         Support:
         { latitude: ..., longitude: ... }
        */

        if (
          point &&
          typeof point === "object" &&
          point.latitude !== undefined &&
          point.longitude !== undefined
        ) {
          return [
            Number(point.latitude),
            Number(point.longitude),
          ];
        }

        return null;
      })
      .filter(
        (point) =>
          point &&
          Number.isFinite(point[0]) &&
          Number.isFinite(point[1])
      );
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

  let inside = false;

  for (
    let i = 0,
      j = polygon.length - 1;
    i < polygon.length;
    j = i++
  ) {
    const yi = polygon[i][0];
    const xi = polygon[i][1];

    const yj = polygon[j][0];
    const xj = polygon[j][1];

    const intersect =
      yi > lat !== yj > lat &&
      lng <
        ((xj - xi) *
          (lat - yi)) /
          (yj - yi) +
          xi;

    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function CustomerGrev() {
  const [complaints, setComplaints] =
    useState([]);

  const [boundary, setBoundary] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* ==========================================================
     FETCH DATA
  ========================================================== */

  useEffect(() => {
    let cancelled = false;

    const fetchComplaints =
      async () => {
        try {
          setLoading(true);
          setError("");

          console.log(
            "=============================================="
          );

          console.log(
            "📍 CUSTOMER GRIEVANCES MAP"
          );

          console.log(
            "📡 ENDPOINT:",
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

          /*
           IMPORTANT:
           Do not immediately call response.json().
           First check whether backend actually
           returned JSON.
          */

          const contentType =
            response.headers.get(
              "content-type"
            ) || "";

          const responseText =
            await response.text();

          if (
            !contentType.includes(
              "application/json"
            )
          ) {
            console.error(
              "❌ Backend returned non-JSON response:"
            );

            console.error(
              responseText.substring(
                0,
                500
              )
            );

            throw new Error(
              `Backend returned ${response.status} ${response.statusText} instead of JSON. Check the API URL.`
            );
          }

          let payload;

          try {
            payload =
              JSON.parse(
                responseText
              );
          } catch (jsonError) {
            console.error(
              "❌ Invalid JSON response:",
              responseText
            );

            throw new Error(
              "Backend returned invalid JSON."
            );
          }

          if (!response.ok) {
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

          /* --------------------------------------------------
             COMPLAINT DATA
          -------------------------------------------------- */

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
              payload?.data?.complaints
            )
          ) {
            complaintData =
              payload.data.complaints;
          }

          /* --------------------------------------------------
             BOUNDARY
          -------------------------------------------------- */

          const parsedBoundary =
            extractBoundary(
              payload
            );

          console.log(
            "🟢 BENGALURU BOUNDARY POINTS:",
            parsedBoundary.length
          );

          setBoundary(
            parsedBoundary
          );

          /* --------------------------------------------------
             CLEAN COMPLAINT DATA
          -------------------------------------------------- */

          const cleanedComplaints =
            complaintData
              .map(
                (item) => ({
                  ...item,

                  lat: Number(
                    item?.lat ??
                      item?.latitude
                  ),

                  long: Number(
                    item?.long ??
                      item?.longitude
                  ),
                })
              )
              .filter(
                (item) =>
                  Number.isFinite(
                    item.lat
                  ) &&
                  Number.isFinite(
                    item.long
                  )
              );

          setComplaints(
            cleanedComplaints
          );
        } catch (fetchError) {
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

    fetchComplaints();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ==========================================================
     ONLY KEEP COMPLAINTS INSIDE BENGALURU
  ========================================================== */

  const visibleComplaints =
    useMemo(() => {
      if (
        boundary.length < 3
      ) {
        /*
         If boundary has not arrived,
         don't accidentally hide all
         complaints.
        */

        return complaints;
      }

      return complaints.filter(
        (complaint) =>
          isPointInsidePolygon(
            complaint.lat,
            complaint.long,
            boundary
          )
      );
    }, [
      complaints,
      boundary,
    ]);

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            CUSTOMER GRIEVANCES
          </h2>

          <div className="h-8 w-24 animate-pulse rounded-full bg-slate-100" />
        </div>

        <div className="h-[650px] w-full animate-pulse rounded-2xl bg-slate-100" />
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
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
            !
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900">
              Customer Grievances
            </h2>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>

            <p className="mt-2 break-all text-xs text-slate-500">
              Endpoint:{" "}
              {COMPLAINTS_ENDPOINT}
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
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
          center={BENGALURU_CENTER}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom={true}
          zoomControl={true}
          className="h-full w-full"
        >
          {/* --------------------------------------------------
              MAP TILES
          -------------------------------------------------- */}

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* --------------------------------------------------
              AUTOMATIC BENGALURU FOCUS
          -------------------------------------------------- */}

          <BengaluruMapFocus
            boundary={boundary}
          />

          {/* --------------------------------------------------
              BENGALURU BOUNDARY
          -------------------------------------------------- */}

          {boundary.length >= 3 && (
            <Polygon
              positions={boundary}
              pathOptions={{
                color: "#2563eb",
                weight: 3,
                opacity: 0.9,
                fillColor: "#2563eb",
                fillOpacity: 0.06,
              }}
            />
          )}

          {/* --------------------------------------------------
              COMPLAINT MARKERS
          -------------------------------------------------- */}

          {visibleComplaints.map(
            (complaint, index) => (
              <Marker
                key={
                  complaint?.data?.id ??
                  index
                }
                position={[
                  complaint.lat,
                  complaint.long,
                ]}
                icon={complaintIcon}
              >
                <Popup
                  closeButton={true}
                  maxWidth={350}
                >
                  <div className="w-[300px]">
                    {/* TITLE */}

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

                    {/* STATUS */}

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

                    {/* CATEGORY */}

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

                    {/* PHONE */}

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

                    {/* DESCRIPTION */}

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

                    {/* ADDRESS */}

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

                    {/* COORDINATES */}

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

                    {/* IMAGE */}

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