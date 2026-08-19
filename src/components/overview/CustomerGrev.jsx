import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ============================================================
   BACKEND
============================================================ */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "https://sewac-main.onrender.com";

const API_ENDPOINT =
  `${API_BASE_URL}/api/complaints-grev/locations`;


/* ============================================================
   BENGALURU CITY BOUNDARY
============================================================ */

/*
 * Bengaluru geographic boundary used to:
 *
 * 1. Remove complaints outside Bengaluru
 * 2. Keep the map focused around Bengaluru
 * 3. Prevent the map from being dragged far outside
 *
 * Approximate Bengaluru city limits:
 *
 * South-West : 12.83, 77.40
 * North-East : 13.15, 77.80
 *
 * This is intentionally slightly larger than the dense
 * central Bengaluru area so valid outskirts are not removed.
 */

const BENGALURU_BOUNDS = L.latLngBounds(
  [12.83, 77.40],
  [13.15, 77.80]
);


/* ============================================================
   DEFAULT MAP POSITION
============================================================ */

const DEFAULT_CENTER = [
  12.9715987,
  77.5945627,
];


/* ============================================================
   CATEGORY LABELS
============================================================ */

const CATEGORY_LABELS = {
  MISSED_COLLECTION: "Missed Collection",
  OVERFLOWING_BIN: "Overflowing Bin",
  ILLEGAL_DUMPING: "Illegal Dumping",
  STREET_LITTER: "Street Litter",
  DAMAGED_BIN: "Damaged Bin",
  OTHER: "Other",
};


/* ============================================================
   STATUS STYLES
============================================================ */

const STATUS_STYLES = {
  PENDING:
    "bg-amber-50 text-amber-700 border-amber-200",

  ASSIGNED:
    "bg-blue-50 text-blue-700 border-blue-200",

  IN_PROGRESS:
    "bg-purple-50 text-purple-700 border-purple-200",

  READY_FOR_VERIFICATION:
    "bg-orange-50 text-orange-700 border-orange-200",

  OTP_SENT:
    "bg-indigo-50 text-indigo-700 border-indigo-200",

  CLOSED:
    "bg-emerald-50 text-emerald-700 border-emerald-200",
};


/* ============================================================
   HELPERS
============================================================ */

const formatCategory = (category) => {
  if (!category) {
    return "N/A";
  }

  if (CATEGORY_LABELS[category]) {
    return CATEGORY_LABELS[category];
  }

  return category
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
};


const formatStatus = (status) => {
  if (!status) {
    return "N/A";
  }

  return status
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
};


/* ============================================================
   CHECK IF POINT IS INSIDE BENGALURU
============================================================ */

const isInsideBengaluru = (lat, lng) => {
  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng)
  ) {
    return false;
  }

  return BENGALURU_BOUNDS.contains(
    L.latLng(lat, lng)
  );
};


/* ============================================================
   PERSON MAP ICON
============================================================ */

const createPersonIcon = (selected = false) => {
  return L.divIcon({

    className: "",

    html: `
      <div
        style="
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: ${selected ? "#7c3aed" : "#2563eb"};
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >

        <svg
          width="20"
          height="20"
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
            r="3.5"
          ></circle>

          <path
            d="M5.5 20c.7-3.4 2.9-5.5 6.5-5.5s5.8 2.1 6.5 5.5"
          ></path>

        </svg>

      </div>
    `,

    iconSize: [
      38,
      38,
    ],

    iconAnchor: [
      19,
      19,
    ],

    popupAnchor: [
      0,
      -20,
    ],

  });
};


/* ============================================================
   MAP AUTO CENTER
============================================================ */

function MapAutoCenter() {

  const map = useMap();


  useEffect(() => {

    /*
     * Initial focus is always Bengaluru.
     */

    map.fitBounds(
      BENGALURU_BOUNDS,
      {
        padding: [
          25,
          25,
        ],

        maxZoom: 13,
      }
    );


  }, [map]);


  return null;
}


/* ============================================================
   COMPLAINT POPUP
============================================================ */

function ComplaintPopup({
  complaint,
}) {

  if (!complaint) {
    return null;
  }


  const data =
    complaint.data || {};


  const statusClass =
    STATUS_STYLES[data.status] ||
    "bg-slate-50 text-slate-700 border-slate-200";


  return (

    <div className="w-[320px] max-w-[80vw] overflow-hidden rounded-xl bg-white">


      {/* ======================================================
         HEADER
      ====================================================== */}

      <div className="border-b border-slate-100 px-4 py-3">

        <div className="flex items-start justify-between gap-3">

          <div className="min-w-0">

            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Customer Grievance
            </p>

            <p className="mt-1 truncate text-sm font-bold text-slate-800">
              {data.ticket_number || "Complaint"}
            </p>

          </div>


          <span
            className={`shrink-0 rounded-full border px-2 py-1 text-[9px] font-bold ${statusClass}`}
          >
            {formatStatus(data.status)}
          </span>

        </div>

      </div>


      {/* ======================================================
         BODY
      ====================================================== */}

      <div className="max-h-[400px] overflow-y-auto px-4 py-3">


        {/* TITLE */}

        <div className="mb-3">

          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
            Title
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-700">
            {data.title || "N/A"}
          </p>

        </div>


        {/* DESCRIPTION */}

        <div className="mb-3">

          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
            Description
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-600">
            {data.description || "N/A"}
          </p>

        </div>


        {/* CATEGORY + ID */}

        <div className="mb-3 grid grid-cols-2 gap-3">

          <div>

            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Category
            </p>

            <p className="mt-1 text-xs font-semibold text-slate-700">
              {formatCategory(data.category)}
            </p>

          </div>


          <div>

            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Complaint ID
            </p>

            <p className="mt-1 text-xs font-semibold text-slate-700">
              #{data.id ?? "N/A"}
            </p>

          </div>

        </div>


        {/* PHONE */}

        <div className="mb-3">

          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
            Phone Number
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-700">
            {data.phone_number || "N/A"}
          </p>

        </div>


        {/* ADDRESS */}

        <div className="mb-3">

          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
            Address
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-600">
            {data.address || "N/A"}
          </p>

        </div>


        {/* COORDINATES */}

        <div className="mb-3 grid grid-cols-2 gap-3">

          <div>

            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Latitude
            </p>

            <p className="mt-1 text-[11px] font-medium text-slate-700">
              {complaint.lat}
            </p>

          </div>


          <div>

            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Longitude
            </p>

            <p className="mt-1 text-[11px] font-medium text-slate-700">
              {complaint.long}
            </p>

          </div>

        </div>


        {/* IMAGE */}

        {data.image_url && (

          <div>

            <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Complaint Image
            </p>

            <img
              src={data.image_url}
              alt="Complaint"
              className="h-32 w-full rounded-lg border border-slate-200 object-cover"
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
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState(null);


  const [
    selectedId,
    setSelectedId,
  ] = useState(null);


  /* ==========================================================
     FETCH CUSTOMER GRIEVANCES
  ========================================================== */

  useEffect(() => {

    let mounted = true;


    const fetchComplaints = async () => {

      try {

        setLoading(true);

        setError(null);


        console.log(
          ""
        );

        console.log(
          "=================================================="
        );

        console.log(
          "📍 CUSTOMER GRIEVANCES MAP REQUEST"
        );

        console.log(
          "ENDPOINT:",
          API_ENDPOINT
        );

        console.log(
          "📍 CITY:",
          "Bengaluru"
        );

        console.log(
          "=================================================="
        );


        const response =
          await fetch(
            API_ENDPOINT
          );


        if (!response.ok) {

          throw new Error(
            `Customer grievances request failed with status ${response.status}`
          );

        }


        const result =
          await response.json();


        console.log(
          "📍 CUSTOMER GRIEVANCES RESPONSE:",
          result
        );


        if (!mounted) {
          return;
        }


        const locations =
          Array.isArray(
            result?.data
          )
            ? result.data
            : [];


        /* ====================================================
           VALIDATE + BENGALURU FILTER
        ==================================================== */

        const bengaluruLocations =
          locations.filter(
            (item) => {

              const lat =
                Number(
                  item?.lat
                );

              const lng =
                Number(
                  item?.long
                );


              /*
               * First make sure coordinates are valid.
               */

              if (
                !Number.isFinite(lat) ||
                !Number.isFinite(lng)
              ) {

                return false;

              }


              if (
                lat < -90 ||
                lat > 90 ||
                lng < -180 ||
                lng > 180
              ) {

                return false;

              }


              /*
               * Only Bengaluru points survive.
               */

              return isInsideBengaluru(
                lat,
                lng
              );

            }
          );


        console.log(
          "📍 TOTAL COMPLAINTS:",
          locations.length
        );


        console.log(
          "📍 BENGALURU COMPLAINTS:",
          bengaluruLocations.length
        );


        console.log(
          "📍 REMOVED OUTSIDE-CITY POINTS:",
          locations.length -
            bengaluruLocations.length
        );


        if (
          locations.length !==
          bengaluruLocations.length
        ) {

          console.log(
            "🛑 Outside Bengaluru complaints were filtered."
          );

        }


        setComplaints(
          bengaluruLocations
        );


      } catch (err) {

        console.error(
          "❌ CUSTOMER GRIEVANCES ERROR:",
          err
        );


        if (!mounted) {
          return;
        }


        setError(
          err?.message ||
            "Unable to load customer grievances."
        );


        setComplaints(
          []
        );


      } finally {

        if (mounted) {

          setLoading(
            false
          );

        }

      }

    };


    fetchComplaints();


    return () => {

      mounted = false;

    };

  }, []);


  /* ==========================================================
     RENDER
  ========================================================== */

  return (

    <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">


      {/* ======================================================
         HEADER
      ====================================================== */}

      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

        <div>

          <h2 className="text-lg font-bold tracking-tight text-slate-800">
            CUSTOMER GRIEVANCES
          </h2>

          <p className="mt-0.5 text-xs font-medium text-slate-400">
            Bengaluru citizen complaint locations
          </p>

        </div>


        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600">

          {loading
            ? "Loading..."
            : `${complaints.length} Complaints`}

        </div>

      </div>


      {/* ======================================================
         MAP
      ====================================================== */}

      <div className="relative h-[520px] w-full">


        <MapContainer
          center={DEFAULT_CENTER}
          zoom={11}
          scrollWheelZoom={true}
          zoomControl={true}
          maxBounds={BENGALURU_BOUNDS}
          maxBoundsViscosity={1.0}
          minZoom={10}
          className="h-full w-full"
        >


          {/* ==================================================
             LIGHT / WHITE MAP
          ================================================== */}

          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap &copy; CARTO"
          />


          {/* ==================================================
             AUTO CENTER ON BENGALURU
          ================================================== */}

          <MapAutoCenter />


          {/* ==================================================
             COMPLAINT MARKERS
          ================================================== */}

          {complaints.map(
            (
              complaint,
              index
            ) => {

              const lat =
                Number(
                  complaint.lat
                );

              const lng =
                Number(
                  complaint.long
                );


              const complaintId =
                complaint?.data?.id ??
                `complaint-${index}`;


              const isSelected =
                selectedId ===
                complaintId;


              return (

                <Marker
                  key={
                    complaintId
                  }

                  position={[
                    lat,
                    lng,
                  ]}

                  icon={createPersonIcon(
                    isSelected
                  )}

                  eventHandlers={{

                    mouseover:
                      () => {

                        setSelectedId(
                          complaintId
                        );

                      },

                    mouseout:
                      () => {

                        setSelectedId(
                          null
                        );

                      },

                    click:
                      () => {

                        setSelectedId(
                          complaintId
                        );

                      },

                  }}
                >

                  <Popup
                    closeButton={true}
                    closeOnClick={false}
                    autoPan={true}
                    className="customer-grev-popup"
                  >

                    <ComplaintPopup
                      complaint={
                        complaint
                      }
                    />

                  </Popup>

                </Marker>

              );

            }
          )}

        </MapContainer>


        {/* ====================================================
           LOADING
        ==================================================== */}

        {loading && (

          <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/60 backdrop-blur-[1px]">

            <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 shadow-lg">

              Loading customer grievances...

            </div>

          </div>

        )}


        {/* ====================================================
           ERROR
        ==================================================== */}

        {!loading &&
          error && (

            <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/60">

              <div className="mx-4 max-w-md rounded-2xl border border-red-200 bg-white px-6 py-5 text-center shadow-xl">

                <p className="text-sm font-bold text-red-600">
                  Unable to load grievances
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {error}
                </p>

              </div>

            </div>

          )}


        {/* ====================================================
           EMPTY STATE
        ==================================================== */}

        {!loading &&
          !error &&
          complaints.length === 0 && (

            <div className="pointer-events-none absolute inset-0 z-[900] flex items-center justify-center">

              <div className="rounded-2xl border border-slate-200 bg-white/95 px-6 py-4 text-center shadow-lg">

                <p className="text-sm font-bold text-slate-600">
                  No Bengaluru grievances available
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  No valid complaint locations were found inside Bengaluru.
                </p>

              </div>

            </div>

          )}

      </div>

    </section>

  );
}