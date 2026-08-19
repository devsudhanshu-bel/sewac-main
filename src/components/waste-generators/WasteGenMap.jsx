import { useEffect, useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { gsap } from "gsap";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useFilters } from "../../contexts/FilterContext";

/*
|--------------------------------------------------------------------------
| DEFAULT MAP POSITION
|--------------------------------------------------------------------------
*/

const BANGALORE_CENTER = [12.9716, 77.5946];

/*
|--------------------------------------------------------------------------
| API BASE URL
|--------------------------------------------------------------------------
|
| Use your existing Vite environment variable.
|
| Example:
| VITE_API_BASE_URL=http://localhost:5000
|
| or your deployed backend URL.
|
*/

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

/*
|--------------------------------------------------------------------------
| AUTHORIZATION HELPER
|--------------------------------------------------------------------------
|
| We only classify a point as explicitly unauthorized when the telemetry
| row actually contains an authorization/status value indicating that.
|
| If no authorization information exists in the telemetry row, the point
| defaults to green because the current backend does not define an
| authorization field in the collection-point-monitoring service.
|
*/

function isUnauthorizedPoint(data = {}) {
  const booleanFields = [
    data.authorized,
    data.isAuthorized,
    data.is_authorized,
  ];

  for (const value of booleanFields) {
    if (typeof value === "boolean") {
      return value === false;
    }
  }

  const statusFields = [
    data.authorizationStatus,
    data.authorization_status,
    data.collectionPointStatus,
    data.collection_point_status,
    data.pointStatus,
    data.point_status,
  ];

  for (const value of statusFields) {
    if (typeof value !== "string") continue;

    const normalized = value.trim().toLowerCase();

    if (
      normalized === "unauthorized" ||
      normalized === "un_authorized" ||
      normalized === "not authorized" ||
      normalized === "not_authorized"
    ) {
      return true;
    }

    if (normalized === "authorized" || normalized === "authorised") {
      return false;
    }
  }

  return false;
}

/*
|--------------------------------------------------------------------------
| POPUP HTML
|--------------------------------------------------------------------------
*/

function buildPopupContent({ vehicleNumber, point }) {
  const data = point?.data || {};

  const timestamp =
    data.iotTimestamp ||
    data.receivedTimestamp ||
    data.created_at ||
    data.createdAt ||
    "N/A";

  const latitude = Number.isFinite(Number(point.latitude))
    ? Number(point.latitude).toFixed(6)
    : "N/A";

  const longitude = Number.isFinite(Number(point.longitude))
    ? Number(point.longitude).toFixed(6)
    : "N/A";

  const driver = data.driverName || data.driver_name || "N/A";

  const weight =
    data.cumulativeWeight ?? data.cumulative_weight ?? data.weight ?? "N/A";

  const wasteType = data.wasteType || data.waste_type || "N/A";

  const rfid =
    data.rfidEpc ||
    data.rfid_epc ||
    data.rfidNumber ||
    data.rfid_number ||
    "N/A";

  const status = isUnauthorizedPoint(data) ? "Unauthorized" : "Authorized";

  return `
    <div style="
      min-width: 220px;
      font-family: Inter, Arial, sans-serif;
      color: #16295A;
    ">
      <div style="
        font-size: 13px;
        font-weight: 700;
        margin-bottom: 10px;
      ">
        Collection Point
      </div>

      <div style="
        display: grid;
        grid-template-columns: 90px 1fr;
        gap: 6px 8px;
        font-size: 11px;
      ">
        <span style="color:#64748b;">Vehicle</span>
        <strong>${vehicleNumber || "N/A"}</strong>

        <span style="color:#64748b;">Status</span>
        <strong style="
          color:${status === "Unauthorized" ? "#ef4444" : "#16a34a"};
        ">
          ${status}
        </strong>

        <span style="color:#64748b;">Latitude</span>
        <span>${latitude}</span>

        <span style="color:#64748b;">Longitude</span>
        <span>${longitude}</span>

        <span style="color:#64748b;">Driver</span>
        <span>${driver}</span>

        <span style="color:#64748b;">Waste Type</span>
        <span>${wasteType}</span>

        <span style="color:#64748b;">Weight</span>
        <span>${weight}</span>

        <span style="color:#64748b;">RFID</span>
        <span>${rfid}</span>

        <span style="color:#64748b;">Time</span>
        <span>${timestamp}</span>
      </div>
    </div>
  `;
}

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

export default function WasteGenMap({ selectedDate }) {
  const sectionRef = useRef(null);
  const collectionCardRef = useRef(null);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const pointsLayerRef = useRef(null);

  const { selectedWard } = useFilters();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pointCount, setPointCount] = useState(0);
  const [vehicleCount, setVehicleCount] = useState(0);

  /*
  |--------------------------------------------------------------------------
  | DEFAULT DATE
  |--------------------------------------------------------------------------
  */

  const effectiveDate =
    typeof selectedDate === "string" && selectedDate
      ? selectedDate
      : new Date().toISOString().split("T")[0];

  /*
  |--------------------------------------------------------------------------
  | GSAP CARD ANIMATION
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      if (sectionRef.current) {
        tl.from(sectionRef.current, {
          opacity: 0,
          duration: 0.25,
        });
      }

      if (collectionCardRef.current) {
        tl.from(
          collectionCardRef.current,
          {
            opacity: 0,
            y: 55,
            scale: 0.96,
            duration: 1.1,
          },
          "-=0.05",
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | INITIALIZE LEAFLET MAP
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!mapContainerRef.current) return;

    /*
    |--------------------------------------------------------------------------
    | Prevent duplicate map initialization
    |--------------------------------------------------------------------------
    */

    if (mapRef.current) {
      return;
    }

    const map = L.map(mapContainerRef.current, {
      center: BANGALORE_CENTER,
      zoom: 12,
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: true,
    });

    /*
    |--------------------------------------------------------------------------
    | OpenStreetMap grayscale tiles
    |--------------------------------------------------------------------------
    |
    | Leaflet supports OpenStreetMap tile layers directly.
    | We apply grayscale through the tile pane so the map has the
    | grey visual style requested for the dashboard.
    |
    */

    const tiles = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
        className: "sewac-grey-map-tiles",
      },
    );

    tiles.addTo(map);

    /*
    |--------------------------------------------------------------------------
    | Point layer
    |--------------------------------------------------------------------------
    */

    const pointLayer = L.layerGroup().addTo(map);

    mapRef.current = map;
    pointsLayerRef.current = pointLayer;

    /*
    |--------------------------------------------------------------------------
    | Small delay so Leaflet correctly calculates its dimensions
    |--------------------------------------------------------------------------
    */

    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    /*
    |--------------------------------------------------------------------------
    | CLEANUP
    |--------------------------------------------------------------------------
    */

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      pointsLayerRef.current = null;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | FETCH + PLOT COLLECTION POINTS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const map = mapRef.current;
    const pointLayer = pointsLayerRef.current;

    if (!map || !pointLayer) return;

    /*
    |--------------------------------------------------------------------------
    | Clear old points
    |--------------------------------------------------------------------------
    */

    pointLayer.clearLayers();

    setPointCount(0);
    setVehicleCount(0);
    setError("");

    /*
    |--------------------------------------------------------------------------
    | No ward selected
    |--------------------------------------------------------------------------
    */

    if (!selectedWard?.ward_no) {
      map.setView(BANGALORE_CENTER, 12);
      return;
    }

    const controller = new AbortController();

    async function loadCollectionPoints() {
      try {
        setLoading(true);

        const wardNo = selectedWard.ward_no;

        const url =
          `${API_BASE_URL}/api/collection-point-monitoring` +
          `?wardNo=${encodeURIComponent(wardNo)}` +
          `&date=${encodeURIComponent(effectiveDate)}`;

        const response = await fetch(url, {
          method: "GET",
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          let message = `Request failed with status ${response.status}`;

          try {
            const errorBody = await response.json();

            if (errorBody?.message) {
              message = errorBody.message;
            }
          } catch {
            // Keep default error message.
          }

          throw new Error(message);
        }

        const result = await response.json();

        if (!result?.success) {
          throw new Error(
            result?.message || "Failed to retrieve collection point data",
          );
        }

        const monitoringData = result.data || {};

        const vehicles = monitoringData.vehicles || {};

        const vehicleEntries = Object.entries(vehicles);

        setVehicleCount(vehicleEntries.length);

        /*
        |--------------------------------------------------------------------------
        | Flatten every vehicle's points into one array.
        |--------------------------------------------------------------------------
        */

        const allPoints = [];

        vehicleEntries.forEach(([vehicleNumber, vehicle]) => {
          const points = Array.isArray(vehicle?.points) ? vehicle.points : [];

          points.forEach((point) => {
            const latitude = Number(point?.latitude);
            const longitude = Number(point?.longitude);

            if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
              return;
            }

            allPoints.push({
              vehicleNumber,
              vehicle,
              point: {
                ...point,
                latitude,
                longitude,
              },
            });
          });
        });

        setPointCount(allPoints.length);

        /*
        |--------------------------------------------------------------------------
        | Plot every GPS point
        |--------------------------------------------------------------------------
        */

        const bounds = [];

        allPoints.forEach(({ vehicleNumber, point }) => {
          const { latitude, longitude, data = {} } = point;

          const unauthorized = isUnauthorizedPoint(data);

          const markerColor = unauthorized ? "#ef4444" : "#16a34a";

          const marker = L.circleMarker([latitude, longitude], {
            radius: 6,
            color: "#ffffff",
            weight: 2,
            fillColor: markerColor,
            fillOpacity: 0.95,
            opacity: 1,
            bubblingMouseEvents: true,
          });

          marker.bindPopup(
            buildPopupContent({
              vehicleNumber,
              point,
            }),
            {
              maxWidth: 320,
              closeButton: true,
            },
          );

          marker.addTo(pointLayer);

          bounds.push([latitude, longitude]);
        });

        /*
        |--------------------------------------------------------------------------
        | Automatically fit map to all points
        |--------------------------------------------------------------------------
        */

        if (bounds.length > 0) {
          const latLngBounds = L.latLngBounds(bounds);

          map.fitBounds(latLngBounds, {
            padding: [35, 35],
            maxZoom: 16,
            animate: true,
          });
        } else {
          /*
          |--------------------------------------------------------------------------
          | No GPS data
          |--------------------------------------------------------------------------
          */

          map.setView(BANGALORE_CENTER, 12);
        }
      } catch (err) {
        if (err?.name === "AbortError") {
          return;
        }

        console.error("Collection point monitoring map error:", err);

        setError(err?.message || "Unable to load collection points");

        map.setView(BANGALORE_CENTER, 12);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadCollectionPoints();

    return () => {
      controller.abort();
    };
  }, [selectedWard?.ward_no, effectiveDate]);

  /*
  |--------------------------------------------------------------------------
  | CUSTOM ZOOM BUTTONS
  |--------------------------------------------------------------------------
  */

  const handleZoomIn = () => {
    if (!mapRef.current) return;

    mapRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (!mapRef.current) return;

    mapRef.current.zoomOut();
  };

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <section ref={sectionRef} className="grid grid-cols-1 gap-5 h-full">
      <div
        ref={collectionCardRef}
        className="
          bg-white
          rounded-3xl
          border
          border-gray-200
          shadow-[0_2px_12px_rgba(0,0,0,0.04)]
          overflow-hidden
          w-full
          h-full
        "
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="px-5 pt-4 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-[14px] font-semibold text-[#16295A]">
              Collection Point Monitoring
            </h3>

            {pointCount > 0 && (
              <span className="text-[10px] text-slate-400">
                {pointCount} points
              </span>
            )}
          </div>

          <div className="flex items-center gap-6">
            {/* Authorized */}

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>

              <span className="text-[11px] text-slate-500">
                Authorized Point
              </span>
            </div>

            {/* Unauthorized */}

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>

              <span className="text-[11px] text-slate-500">
                Unauthorized Point
              </span>
            </div>
          </div>
        </div>

        {/* =====================================================
            MAP
        ===================================================== */}

        <div className="relative h-[310px] bg-[#F7F8FB]">
          {/* ===================================================
              LEAFLET MAP CONTAINER
          =================================================== */}

          <div ref={mapContainerRef} className="absolute inset-0 z-0" />

          {/* ===================================================
              CUSTOM ZOOM CONTROLS
          =================================================== */}

          <div className="absolute top-4 left-4 z-[1000]">
            <div
              className="
                bg-white
                rounded-xl
                shadow-[0_2px_10px_rgba(0,0,0,0.12)]
                overflow-hidden
                border
                border-gray-200
              "
            >
              <button
                type="button"
                onClick={handleZoomIn}
                className="
                  w-9
                  h-9
                  flex
                  items-center
                  justify-center
                  border-b
                  border-gray-200
                  hover:bg-slate-50
                  transition-colors
                  duration-300
                "
                aria-label="Zoom in"
              >
                <Plus size={16} />
              </button>

              <button
                type="button"
                onClick={handleZoomOut}
                className="
                  w-9
                  h-9
                  flex
                  items-center
                  justify-center
                  hover:bg-slate-50
                  transition-colors
                  duration-300
                "
                aria-label="Zoom out"
              >
                <Minus size={16} />
              </button>
            </div>
          </div>

          {/* ===================================================
              LOADING
          =================================================== */}

          {loading && (
            <div
              className="
                absolute
                inset-0
                z-[900]
                pointer-events-none
                flex
                items-center
                justify-center
              "
            >
              <div
                className="
                  bg-white/95
                  backdrop-blur-sm
                  rounded-xl
                  px-4
                  py-2.5
                  shadow-[0_4px_20px_rgba(0,0,0,0.08)]
                  border
                  border-gray-100
                "
              >
                <div className="flex items-center gap-2">
                  <div
                    className="
                      w-3.5
                      h-3.5
                      rounded-full
                      border-2
                      border-violet-200
                      border-t-violet-600
                      animate-spin
                    "
                  />

                  <span className="text-[11px] text-slate-500">
                    Loading collection points...
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================
              ERROR
          =================================================== */}

          {!loading && error && (
            <div
              className="
                absolute
                inset-0
                z-[900]
                pointer-events-none
                flex
                items-center
                justify-center
              "
            >
              <div
                className="
                  bg-white/95
                  backdrop-blur-sm
                  rounded-xl
                  px-5
                  py-3
                  shadow-[0_4px_20px_rgba(0,0,0,0.08)]
                  border
                  border-red-100
                  text-center
                "
              >
                <p className="text-[12px] font-medium text-red-500">
                  Unable to load collection points
                </p>

                <p className="text-[10px] text-slate-400 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* ===================================================
              NO POINTS
          =================================================== */}

          {!loading && !error && selectedWard?.ward_no && pointCount === 0 && (
            <div
              className="
                  absolute
                  inset-0
                  z-[800]
                  pointer-events-none
                  flex
                  items-center
                  justify-center
                "
            >
              <div
                className="
                    bg-white/90
                    backdrop-blur-sm
                    rounded-xl
                    px-5
                    py-3
                    shadow-[0_4px_20px_rgba(0,0,0,0.06)]
                    border
                    border-gray-100
                    text-center
                  "
              >
                <p className="text-[12px] text-slate-500">
                  No collection points found
                </p>

                <p className="text-[10px] text-slate-400 mt-1">
                  No GPS telemetry is available for this ward and date.
                </p>
              </div>
            </div>
          )}

          {/* ===================================================
              VEHICLE COUNT
          =================================================== */}

          {!loading && vehicleCount > 0 && (
            <div
              className="
                absolute
                bottom-3
                left-3
                z-[1000]
                bg-white/95
                backdrop-blur-sm
                rounded-lg
                px-3
                py-1.5
                shadow-[0_2px_8px_rgba(0,0,0,0.10)]
                border
                border-gray-100
              "
            >
              <span className="text-[10px] text-slate-500">
                {vehicleCount} vehicle
                {vehicleCount !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* =======================================================
          MAP STYLING
      ======================================================= */}

      <style>
        {`
          .sewac-grey-map-tiles {
            filter:
              grayscale(100%)
              brightness(1.04)
              contrast(0.90);
          }

          .leaflet-container {
            font-family: Inter, Arial, sans-serif;
            background: #f7f8fb;
          }

          .leaflet-control-attribution {
            font-size: 8px !important;
            background: rgba(255,255,255,0.85) !important;
          }

          .leaflet-popup-content-wrapper {
            border-radius: 12px;
          }

          .leaflet-popup-content {
            margin: 12px;
          }

          .leaflet-popup-tip {
            box-shadow: none;
          }

          .leaflet-interactive {
            cursor: pointer;
          }
        `}
      </style>
    </section>
  );
}
