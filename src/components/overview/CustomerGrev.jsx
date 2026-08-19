import React, { useEffect, useMemo, useState } from "react";
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
   API
============================================================ */

const COMPLAINTS_API =
  "https://sewac-main.onrender.com/api/complaintsGrev";

/* ============================================================
   DEFAULT MAP POSITION
============================================================ */

const DEFAULT_CENTER = [12.9715987, 77.5945627];
const DEFAULT_ZOOM = 12;

/* ============================================================
   PERSON ICON
============================================================ */

const createPersonIcon = () =>
  L.divIcon({
    className: "",
    html: `
      <div
        style="
          width:34px;
          height:34px;
          border-radius:50%;
          background:#ffffff;
          border:2px solid #64748b;
          display:flex;
          align-items:center;
          justify-content:center;
          box-shadow:0 4px 12px rgba(15,23,42,0.22);
          font-size:19px;
        "
      >
        👤
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
  });

const personIcon = createPersonIcon();

/* ============================================================
   MAP RESIZE FIX
============================================================ */

function MapResizeHandler() {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => clearTimeout(timer);
  }, [map]);

  return null;
}

/* ============================================================
   FIT MAP TO COMPLAINTS
============================================================ */

function ComplaintMapController({ complaints }) {
  const map = useMap();

  useEffect(() => {
    if (!complaints || complaints.length === 0) {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      return;
    }

    const validPoints = complaints
      .filter(
        (item) =>
          Number.isFinite(Number(item.lat)) &&
          Number.isFinite(Number(item.long))
      )
      .map((item) => [
        Number(item.lat),
        Number(item.long),
      ]);

    if (validPoints.length === 0) {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      return;
    }

    if (validPoints.length === 1) {
      map.setView(validPoints[0], 14);
      return;
    }

    const bounds = L.latLngBounds(validPoints);

    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 15,
    });
  }, [complaints, map]);

  return null;
}

/* ============================================================
   STATUS COLOR
============================================================ */

const getStatusClasses = (status) => {
  switch (status) {
    case "CLOSED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "ASSIGNED":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "IN_PROGRESS":
      return "bg-purple-50 text-purple-700 border-purple-200";

    case "READY_FOR_VERIFICATION":
      return "bg-orange-50 text-orange-700 border-orange-200";

    case "OTP_SENT":
      return "bg-cyan-50 text-cyan-700 border-cyan-200";

    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

/* ============================================================
   POPUP
============================================================ */

function ComplaintPopup({ complaint }) {
  const data = complaint?.data || {};

  return (
    <div className="w-[280px] font-sans text-slate-700">
      {/* Header */}
      <div className="mb-3 border-b border-slate-200 pb-3">
        <div className="text-[15px] font-bold text-slate-800">
          {data.title || "Customer Grievance"}
        </div>

        <div className="mt-1 text-[11px] font-medium text-slate-500">
          {data.ticket_number || "No ticket number"}
        </div>
      </div>

      {/* Status */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Status
        </span>

        <span
          className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${getStatusClasses(
            data.status
          )}`}
        >
          {data.status || "UNKNOWN"}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2.5 text-[12px]">
        <div>
          <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            ID
          </div>

          <div className="font-medium text-slate-700">
            {data.id ?? "-"}
          </div>
        </div>

        <div>
          <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Phone Number
          </div>

          <div className="font-medium text-slate-700">
            {data.phone_number || "-"}
          </div>
        </div>

        <div>
          <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Category
          </div>

          <div className="font-medium text-slate-700">
            {data.category || "-"}
          </div>
        </div>

        <div>
          <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Address
          </div>

          <div className="font-medium leading-4 text-slate-700">
            {data.address || "-"}
          </div>
        </div>

        <div>
          <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Description
          </div>

          <div className="leading-4 text-slate-600">
            {data.description || "-"}
          </div>
        </div>

        <div>
          <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Coordinates
          </div>

          <div className="font-mono text-[10px] text-slate-600">
            {Number(complaint.lat).toFixed(7)},{" "}
            {Number(complaint.long).toFixed(7)}
          </div>
        </div>
      </div>

      {/* Image */}
      {data.image_url && (
        <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
          <img
            src={data.image_url}
            alt="Complaint"
            className="h-32 w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}
    </div>
  );
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function CustomerGrev() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ==========================================================
     FETCH COMPLAINTS
  ========================================================== */

  useEffect(() => {
    let mounted = true;

    const fetchComplaints = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("==========================================");
        console.log("📍 CUSTOMER GRIEVANCES MAP REQUEST");
        console.log("ENDPOINT:", COMPLAINTS_API);
        console.log("==========================================");

        const response = await fetch(COMPLAINTS_API);

        if (!response.ok) {
          throw new Error(
            `Customer grievances request failed with status ${response.status}`
          );
        }

        const result = await response.json();

        console.log("📍 CUSTOMER GRIEVANCES RESPONSE:", result);

        if (!result?.success) {
          throw new Error(
            result?.message || "Failed to load customer grievances"
          );
        }

        const rows = Array.isArray(result?.data)
          ? result.data
          : [];

        const validRows = rows.filter((item) => {
          const lat = Number(item?.lat);
          const long = Number(item?.long);

          return (
            Number.isFinite(lat) &&
            Number.isFinite(long)
          );
        });

        console.log(
          "📍 CUSTOMER GRIEVANCES LOADED:",
          validRows.length
        );

        if (mounted) {
          setComplaints(validRows);
        }
      } catch (err) {
        console.error(
          "❌ CUSTOMER GRIEVANCES ERROR:",
          err
        );

        if (mounted) {
          setError(
            err?.message ||
              "Unable to load customer grievances"
          );

          setComplaints([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchComplaints();

    return () => {
      mounted = false;
    };
  }, []);

  /* ==========================================================
     MEMOIZED STATS
  ========================================================== */

  const complaintCount = complaints.length;

  const statusCount = useMemo(() => {
    return complaints.reduce((acc, complaint) => {
      const status =
        complaint?.data?.status || "UNKNOWN";

      acc[status] = (acc[status] || 0) + 1;

      return acc;
    }, {});
  }, [complaints]);

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-800">
            Customer Grievances
          </h2>

          <p className="mt-0.5 text-xs font-medium text-slate-400">
            Live citizen complaint locations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Complaints
            </div>

            <div className="text-sm font-bold text-slate-700">
              {loading ? "..." : complaintCount}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Closed
            </div>

            <div className="text-sm font-bold text-emerald-600">
              {loading
                ? "..."
                : statusCount.CLOSED || 0}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
          {error}
        </div>
      )}

      {/* ======================================================
          MAP
      ====================================================== */}

      <div className="relative h-[520px] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom={true}
          zoomControl={true}
          className="h-full w-full"
        >
          {/* Pale / white map */}
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          <MapResizeHandler />

          <ComplaintMapController
            complaints={complaints}
          />

          {/* ==================================================
              COMPLAINT MARKERS
          ================================================== */}

          {complaints.map((complaint, index) => {
            const lat = Number(complaint.lat);
            const long = Number(complaint.long);

            if (
              !Number.isFinite(lat) ||
              !Number.isFinite(long)
            ) {
              return null;
            }

            return (
              <Marker
                key={
                  complaint?.data?.id ??
                  complaint?.data?.ticket_number ??
                  `${lat}-${long}-${index}`
                }
                position={[lat, long]}
                icon={personIcon}
              >
                <Popup
                  closeButton={true}
                  maxWidth={320}
                  minWidth={280}
                >
                  <ComplaintPopup
                    complaint={complaint}
                  />
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* ====================================================
            LOADING
        ==================================================== */}

        {loading && (
          <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
            <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600" />

                <span className="text-xs font-semibold text-slate-600">
                  Loading grievances...
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            EMPTY STATE
        ==================================================== */}

        {!loading &&
          !error &&
          complaints.length === 0 && (
            <div className="absolute inset-0 z-[900] flex items-center justify-center pointer-events-none">
              <div className="rounded-xl border border-slate-200 bg-white px-6 py-4 text-center shadow-lg">
                <div className="text-sm font-bold text-slate-700">
                  No customer grievances available
                </div>

                <div className="mt-1 text-xs text-slate-400">
                  No valid complaint coordinates were
                  returned by the API.
                </div>
              </div>
            </div>
          )}

        {/* ====================================================
            MAP LEGEND
        ==================================================== */}

        {!loading &&
          complaints.length > 0 && (
            <div className="absolute bottom-4 left-4 z-[800] rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur">
              <div className="flex items-center gap-2">
                <span className="text-base">
                  👤
                </span>

                <span className="text-[10px] font-semibold text-slate-600">
                  Citizen grievance
                </span>
              </div>
            </div>
          )}
      </div>
    </section>
  );
}