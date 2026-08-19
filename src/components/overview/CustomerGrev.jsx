import React, { useEffect, useMemo, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "";

const COMPLAINTS_ENDPOINT = `${API_BASE_URL}/api/complaints-grev/locations`;

const DEFAULT_VIEW = {
  longitude: 77.5945627,
  latitude: 12.9715987,
  zoom: 11,
};

const STATUS_STYLES = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  ASSIGNED: "bg-blue-50 text-blue-700 border-blue-200",
  IN_PROGRESS: "bg-purple-50 text-purple-700 border-purple-200",
  READY_FOR_VERIFICATION:
    "bg-orange-50 text-orange-700 border-orange-200",
  OTP_SENT: "bg-indigo-50 text-indigo-700 border-indigo-200",
  CLOSED: "bg-green-50 text-green-700 border-green-200",
};

const CATEGORY_LABELS = {
  MISSED_COLLECTION: "Missed Collection",
  OVERFLOWING_BIN: "Overflowing Bin",
  ILLEGAL_DUMPING: "Illegal Dumping",
  STREET_LITTER: "Street Litter",
  DAMAGED_BIN: "Damaged Bin",
  OTHER: "Other",
};

function formatCategory(category) {
  if (!category) return "N/A";

  return (
    CATEGORY_LABELS[category] ||
    category
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}

function formatStatus(status) {
  if (!status) return "N/A";

  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function ComplaintMarker({ selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-150 hover:scale-110 focus:outline-none"
      title="Customer grievance"
    >
      <span
        className={`absolute inset-0 rounded-full border-2 ${
          selected ? "border-purple-500" : "border-blue-500"
        }`}
      />

      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full ${
          selected ? "bg-purple-600" : "bg-blue-600"
        }`}
      >
        {/* Person icon */}
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5.5 20c.7-3.4 2.9-5.5 6.5-5.5s5.8 2.1 6.5 5.5" />
        </svg>
      </span>
    </button>
  );
}

function ComplaintPopup({ complaint, onClose }) {
  if (!complaint) return null;

  const data = complaint.data || {};
  const statusClass =
    STATUS_STYLES[data.status] ||
    "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <div className="w-[330px] max-w-[calc(100vw-60px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
      {/* Header */}
      <div className="border-b border-slate-100 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
              Customer Grievance
            </p>

            <h3 className="mt-1 truncate text-sm font-bold text-slate-800">
              {data.ticket_number || "Complaint"}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
          >
            ×
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="max-h-[390px] overflow-y-auto px-4 py-3">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-500">
            Status
          </span>

          <span
            className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusClass}`}
          >
            {formatStatus(data.status)}
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Title
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-700">
              {data.title || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Description
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              {data.description || "N/A"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
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
                ID
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-700">
                #{data.id ?? "N/A"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Phone Number
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-700">
              {data.phone_number || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Address
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              {data.address || "N/A"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
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

          {data.image_url && (
            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Complaint Image
              </p>

              <img
                src={data.image_url}
                alt="Complaint"
                className="h-32 w-full rounded-xl border border-slate-200 object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CustomerGrev() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const [viewState, setViewState] = useState(DEFAULT_VIEW);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchComplaints = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("📍 CUSTOMER GRIEVANCES MAP REQUEST");
        console.log("ENDPOINT:", COMPLAINTS_ENDPOINT);

        const response = await fetch(COMPLAINTS_ENDPOINT);

        if (!response.ok) {
          throw new Error(
            `Customer grievances request failed with status ${response.status}`
          );
        }

        const result = await response.json();

        console.log("📍 CUSTOMER GRIEVANCES RESPONSE:", result);

        if (!mounted) return;

        const locations = Array.isArray(result?.data)
          ? result.data
          : [];

        const validLocations = locations.filter((item) => {
          const lat = Number(item?.lat);
          const long = Number(item?.long);

          return (
            Number.isFinite(lat) &&
            Number.isFinite(long) &&
            lat >= -90 &&
            lat <= 90 &&
            long >= -180 &&
            long <= 180
          );
        });

        setComplaints(validLocations);

        if (validLocations.length > 0) {
          const first = validLocations[0];

          setViewState((previous) => ({
            ...previous,
            longitude: Number(first.long),
            latitude: Number(first.lat),
            zoom: 11,
          }));
        }
      } catch (err) {
        console.error("CUSTOMER GRIEVANCES ERROR:", err);

        if (!mounted) return;

        setError(
          err?.message ||
            "Unable to load customer grievances."
        );
        setComplaints([]);
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

  const boundsCenter = useMemo(() => {
    if (!complaints.length) return null;

    const latitudes = complaints.map((item) => Number(item.lat));
    const longitudes = complaints.map((item) => Number(item.long));

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLong = Math.min(...longitudes);
    const maxLong = Math.max(...longitudes);

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLong + maxLong) / 2,
    };
  }, [complaints]);

  useEffect(() => {
    if (!boundsCenter || complaints.length <= 1) return;

    setViewState((previous) => ({
      ...previous,
      latitude: boundsCenter.latitude,
      longitude: boundsCenter.longitude,
      zoom: 10,
    }));
  }, [boundsCenter, complaints.length]);

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-800">
            CUSTOMER GRIEVANCES
          </h2>

          <p className="mt-0.5 text-xs font-medium text-slate-400">
            Citizen complaint locations
          </p>
        </div>

        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600">
          {loading ? "Loading..." : `${complaints.length} Complaints`}
        </div>
      </div>

      {/* Map */}
      <div className="relative h-[520px] w-full">
        <Map
          {...viewState}
          onMove={(event) => setViewState(event.viewState)}
          mapStyle="https://tiles.openfreemap.org/styles/bright"
          attributionControl={false}
          reuseMaps
        >
          {complaints.map((complaint, index) => {
            const latitude = Number(complaint.lat);
            const longitude = Number(complaint.long);

            return (
              <Marker
                key={
                  complaint?.data?.id ??
                  `${latitude}-${longitude}-${index}`
                }
                latitude={latitude}
                longitude={longitude}
                anchor="center"
              >
                <ComplaintMarker
                  selected={
                    selectedComplaint?.data?.id ===
                    complaint?.data?.id
                  }
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedComplaint(complaint);
                  }}
                />
              </Marker>
            );
          })}

          {selectedComplaint && (
            <Popup
              latitude={Number(selectedComplaint.lat)}
              longitude={Number(selectedComplaint.long)}
              anchor="bottom"
              closeButton={false}
              closeOnClick={false}
              onClose={() => setSelectedComplaint(null)}
              offset={22}
            >
              <ComplaintPopup
                complaint={selectedComplaint}
                onClose={() => setSelectedComplaint(null)}
              />
            </Popup>
          )}
        </Map>

        {/* Loading */}
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
            <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 shadow-lg">
              Loading customer grievances...
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/50">
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

        {/* Empty */}
        {!loading && !error && complaints.length === 0 && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div className="rounded-2xl border border-slate-200 bg-white/95 px-6 py-4 text-center shadow-lg">
              <p className="text-sm font-bold text-slate-600">
                No customer grievances available
              </p>

              <p className="mt-1 text-xs text-slate-400">
                No valid complaint coordinates were returned.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}