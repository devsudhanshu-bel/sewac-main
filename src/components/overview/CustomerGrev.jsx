import React, { useEffect, useMemo, useState } from "react";
import Map, {
  Marker,
  Popup,
  NavigationControl,
} from "react-map-gl/maplibre";

import "maplibre-gl/dist/maplibre-gl.css";

/* =========================================================
   BACKEND
========================================================= */

const API_BASE_URL = "https://sewac-main.onrender.com";

/*
  Primary endpoint tested from your backend.

  If your backend route is mounted as:
      /api/complaintsGrev

  this will work directly.

  The fallback below also tries:
      /api/complaintsGrev/map
*/
const ENDPOINTS = [
  `${API_BASE_URL}/api/complaintsGrev`,
  `${API_BASE_URL}/api/complaintsGrev/map`,
];

/* =========================================================
   MAP STYLE
========================================================= */

const MAP_STYLE = {
  version: 8,

  sources: {
    osm: {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution:
        '&copy; OpenStreetMap contributors &copy; CARTO',
    },
  },

  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm",
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

/* =========================================================
   DEFAULT BANGALORE LOCATION
========================================================= */

const DEFAULT_VIEW = {
  longitude: 77.5945627,
  latitude: 12.9715987,
  zoom: 11,
};

/* =========================================================
   PERSON MARKER
========================================================= */

function PersonMarker() {
  return (
    <div className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-blue-600 shadow-lg transition-all duration-200 hover:scale-110">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        className="h-6 w-6"
      >
        <circle cx="12" cy="7" r="3" />
        <path
          d="M5.5 21a6.5 6.5 0 0 1 13 0"
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute -bottom-1 h-2 w-2 rotate-45 bg-blue-600" />
    </div>
  );
}

/* =========================================================
   DATA VALUE HELPER
========================================================= */

function displayValue(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  return String(value);
}

/* =========================================================
   COMPONENT
========================================================= */

export default function CustomerGrev() {
  const [complaints, setComplaints] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedComplaint, setSelectedComplaint] =
    useState(null);

  const [viewState, setViewState] =
    useState(DEFAULT_VIEW);

  /* =======================================================
     FETCH COMPLAINTS
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const loadComplaints = async () => {
      setLoading(true);
      setError("");

      let lastError = null;

      for (const endpoint of ENDPOINTS) {
        try {
          console.log(
            "📍 CUSTOMER GRIEVANCES MAP REQUEST"
          );

          console.log(
            "ENDPOINT:",
            endpoint
          );

          const response = await fetch(endpoint, {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          });

          console.log(
            "CUSTOMER GRIEVANCES STATUS:",
            response.status
          );

          /*
            If endpoint does not exist, try the next one.
          */
          if (!response.ok) {
            lastError = new Error(
              `Request failed with status ${response.status}`
            );

            continue;
          }

          const result = await response.json();

          console.log(
            "CUSTOMER GRIEVANCES RESPONSE:",
            result
          );

          if (!mounted) return;

          /*
            Expected backend payload:

            {
              success: true,
              count: 7,
              data: [
                {
                  lat: 12.9715987,
                  long: 77.5945627,
                  data: {
                    id: 7,
                    ticket_number: "...",
                    ...
                  }
                }
              ]
            }
          */

          if (
            !result ||
            result.success !== true
          ) {
            throw new Error(
              "Invalid complaints response"
            );
          }

          const rawData = Array.isArray(
            result.data
          )
            ? result.data
            : [];

          const validComplaints =
            rawData.filter((item) => {
              const lat = Number(item?.lat);
              const lng = Number(item?.long);

              return (
                Number.isFinite(lat) &&
                Number.isFinite(lng)
              );
            });

          console.log(
            "CUSTOMER GRIEVANCES LOADED:",
            validComplaints.length
          );

          setComplaints(validComplaints);

          /*
            Automatically center on the first
            valid complaint.
          */
          if (
            validComplaints.length > 0
          ) {
            const first =
              validComplaints[0];

            setViewState({
              longitude: Number(first.long),
              latitude: Number(first.lat),
              zoom: 11,
            });
          }

          setLoading(false);

          return;
        } catch (err) {
          console.error(
            "CUSTOMER GRIEVANCES ENDPOINT ERROR:",
            err
          );

          lastError = err;
        }
      }

      if (!mounted) return;

      setLoading(false);

      setError(
        lastError?.message ||
          "Unable to load customer grievances."
      );
    };

    loadComplaints();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     VALID COMPLAINTS
  ======================================================= */

  const validComplaints = useMemo(() => {
    return complaints.filter((item) => {
      const lat = Number(item?.lat);
      const lng = Number(item?.long);

      return (
        Number.isFinite(lat) &&
        Number.isFinite(lng)
      );
    });
  }, [complaints]);

  /* =======================================================
     STATUS BADGE
  ======================================================= */

  const getStatusClass = (status) => {
    switch (status) {
      case "CLOSED":
        return "bg-green-100 text-green-700";

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "ASSIGNED":
        return "bg-blue-100 text-blue-700";

      case "IN_PROGRESS":
        return "bg-purple-100 text-purple-700";

      case "READY_FOR_VERIFICATION":
        return "bg-orange-100 text-orange-700";

      case "OTP_SENT":
        return "bg-indigo-100 text-indigo-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-800">
            Customer Grievances
          </h2>

          <p className="mt-0.5 text-xs font-medium text-slate-400">
            Citizen complaint locations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
            {validComplaints.length} Complaints
          </span>
        </div>
      </div>

      {/* ===================================================
          MAP
      =================================================== */}

      <div className="relative h-[520px] w-full overflow-hidden">
        <Map
          {...viewState}
          onMove={(event) =>
            setViewState(event.viewState)
          }
          mapStyle={MAP_STYLE}
          attributionControl={false}
          reuseMaps
        >
          {/* =================================================
              MAP CONTROLS
          ================================================= */}

          <NavigationControl
            position="bottom-right"
            showCompass={false}
          />

          {/* =================================================
              COMPLAINT MARKERS
          ================================================= */}

          {validComplaints.map(
            (complaint, index) => {
              const latitude =
                Number(complaint.lat);

              const longitude =
                Number(complaint.long);

              const data =
                complaint.data || {};

              return (
                <Marker
                  key={
                    data.id ??
                    data.ticket_number ??
                    index
                  }
                  latitude={latitude}
                  longitude={longitude}
                  anchor="bottom"
                >
                  <div
                    onMouseEnter={() =>
                      setSelectedComplaint(
                        complaint
                      )
                    }
                    onClick={() =>
                      setSelectedComplaint(
                        complaint
                      )
                    }
                    className="cursor-pointer"
                  >
                    <PersonMarker />
                  </div>
                </Marker>
              );
            }
          )}

          {/* =================================================
              POPUP
          ================================================= */}

          {selectedComplaint && (
            <Popup
              latitude={Number(
                selectedComplaint.lat
              )}
              longitude={Number(
                selectedComplaint.long
              )}
              anchor="bottom"
              closeButton={true}
              closeOnClick={false}
              onClose={() =>
                setSelectedComplaint(null)
              }
              offset={45}
              maxWidth="360px"
            >
              {(() => {
                const data =
                  selectedComplaint.data || {};

                return (
                  <div className="w-[310px] p-1">
                    {/* ======================================
                        TITLE
                    ====================================== */}

                    <div className="mb-3 border-b border-slate-200 pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-bold text-slate-800">
                            {displayValue(
                              data.title
                            )}
                          </h3>

                          <p className="mt-1 text-[11px] font-semibold text-slate-400">
                            {displayValue(
                              data.ticket_number
                            )}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-bold ${getStatusClass(
                            data.status
                          )}`}
                        >
                          {displayValue(
                            data.status
                          )}
                        </span>
                      </div>
                    </div>

                    {/* ======================================
                        COMPLETE DATA
                    ====================================== */}

                    <div className="space-y-2.5">
                      {/* ID */}

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Complaint ID
                        </p>

                        <p className="text-xs font-medium text-slate-700">
                          {displayValue(
                            data.id
                          )}
                        </p>
                      </div>

                      {/* PHONE */}

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Phone Number
                        </p>

                        <p className="text-xs font-medium text-slate-700">
                          {displayValue(
                            data.phone_number
                          )}
                        </p>
                      </div>

                      {/* CATEGORY */}

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Category
                        </p>

                        <p className="text-xs font-semibold text-blue-600">
                          {displayValue(
                            data.category
                          ).replace(
                            /_/g,
                            " "
                          )}
                        </p>
                      </div>

                      {/* DESCRIPTION */}

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Description
                        </p>

                        <p className="text-xs leading-relaxed text-slate-600">
                          {displayValue(
                            data.description
                          )}
                        </p>
                      </div>

                      {/* ADDRESS */}

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Address
                        </p>

                        <p className="text-xs leading-relaxed text-slate-600">
                          {displayValue(
                            data.address
                          )}
                        </p>
                      </div>

                      {/* COORDINATES */}

                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-lg bg-slate-50 p-2">
                          <p className="text-[9px] font-bold uppercase text-slate-400">
                            Latitude
                          </p>

                          <p className="mt-0.5 text-[11px] font-semibold text-slate-700">
                            {displayValue(
                              selectedComplaint.lat
                            )}
                          </p>
                        </div>

                        <div className="rounded-lg bg-slate-50 p-2">
                          <p className="text-[9px] font-bold uppercase text-slate-400">
                            Longitude
                          </p>

                          <p className="mt-0.5 text-[11px] font-semibold text-slate-700">
                            {displayValue(
                              selectedComplaint.long
                            )}
                          </p>
                        </div>
                      </div>

                      {/* IMAGE */}

                      {data.image_url && (
                        <div>
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            Complaint Image
                          </p>

                          <img
                            src={
                              data.image_url
                            }
                            alt="Complaint"
                            className="h-32 w-full rounded-lg object-cover"
                            onError={(event) => {
                              event.currentTarget.style.display =
                                "none";
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </Popup>
          )}
        </Map>

        {/* ===================================================
            LOADING
        =================================================== */}

        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
            <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

                <span className="text-sm font-semibold text-slate-600">
                  Loading grievances...
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================
            ERROR
        =================================================== */}

        {!loading && error && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
            <div className="max-w-md rounded-xl border border-red-200 bg-white px-6 py-5 text-center shadow-lg">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500">
                !
              </div>

              <h3 className="text-sm font-bold text-slate-800">
                Unable to load grievances
              </h3>

              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* ===================================================
            NO DATA
        =================================================== */}

        {!loading &&
          !error &&
          validComplaints.length === 0 && (
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
              <div className="rounded-xl border border-slate-200 bg-white/95 px-6 py-4 shadow-lg">
                <p className="text-sm font-semibold text-slate-600">
                  No customer grievances available
                </p>
              </div>
            </div>
          )}
      </div>

      {/* ===================================================
          FOOTER
      =================================================== */}

      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />

          <span className="text-xs font-medium text-slate-500">
            Customer grievance location
          </span>
        </div>

        <span className="text-xs font-semibold text-slate-400">
          {validComplaints.length} locations
        </span>
      </div>
    </section>
  );
}