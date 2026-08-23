import React, { useEffect, useMemo } from "react";

import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

// ============================================================
// VEHICLE ICON
// ============================================================

const vehicleIcon = L.divIcon({
  className: "sewac-vehicle-marker",

  html: `
    <div
      style="
        width:38px;
        height:38px;
        border-radius:50%;
        background:#16A34A;
        border:4px solid #ffffff;
        box-shadow:0 3px 10px rgba(0,0,0,0.25);
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:19px;
      "
    >
      🚛
    </div>
  `,

  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -19],
});

// ============================================================
// FIT MAP TO ROUTES
// ============================================================

const RouteBounds = ({ routes }) => {
  const map = useMap();

  useEffect(() => {
    if (!routes?.length) {
      return;
    }

    const bounds = L.latLngBounds([]);

    routes.forEach((route) => {
      if (!Array.isArray(route.points)) {
        return;
      }

      route.points.forEach((point) => {
        const lat = Number(point.latitude);
        const lng = Number(point.longitude);

        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          bounds.extend([lat, lng]);
        }
      });
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [40, 40],
        maxZoom: 16,
      });
    }
  }, [map, routes]);

  return null;
};

// ============================================================
// ROUTE MAP
// ============================================================

const RouteMap = ({ mapData, selectedDate }) => {
  const routes = Array.isArray(mapData?.routes) ? mapData.routes : [];

  // ==========================================================
  // DEFAULT CENTER
  // ==========================================================

  const defaultCenter = useMemo(() => {
    for (const route of routes) {
      if (Array.isArray(route.points) && route.points.length > 0) {
        const first = route.points[0];

        const lat = Number(first.latitude);
        const lng = Number(first.longitude);

        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          return [lat, lng];
        }
      }
    }

    // Bengaluru fallback
    return [12.9716, 77.5946];
  }, [routes]);

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section className="w-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex items-center justify-between px-6 py-5">
        <div>
          <h2 className="text-[18px] font-semibold text-[#16295A]">
            Vehicle Route Map
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Traced vehicle routes for {selectedDate}
          </p>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500" />

            <span className="text-sm text-gray-500">Route</span>
          </div>

          <div className="text-sm font-semibold text-gray-600">
            {routes.length} vehicle
            {routes.length === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      {/* ======================================================
          MAP
      ====================================================== */}

      <div
        className="relative w-full"
        style={{
          height: "520px",
        }}
      >
        <MapContainer
          center={defaultCenter}
          zoom={13}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          {/* ==================================================
              MAP TILES
          ================================================== */}

          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap contributors &copy; CARTO"
            subdomains={["a", "b", "c", "d"]}
            maxZoom={20}
          />

          {/* ==================================================
              AUTO FIT
          ================================================== */}

          <RouteBounds routes={routes} />

          {/* ==================================================
              VEHICLE ROUTES
          ================================================== */}

          {routes.map((route, index) => {
            const points = Array.isArray(route.points) ? route.points : [];

            const positions = points
              .map((point) => [Number(point.latitude), Number(point.longitude)])
              .filter(
                ([lat, lng]) => Number.isFinite(lat) && Number.isFinite(lng),
              );

            if (!positions.length) {
              return null;
            }

            const startPosition = positions[0];

            const endPosition = positions[positions.length - 1];

            const key =
              route.vehicleNumber || route.heartbeatTableName || index;

            return (
              <React.Fragment key={key}>
                {/* ==========================================
                    TRACED ROUTE
                ========================================== */}

                {positions.length > 1 && (
                  <Polyline
                    positions={positions}
                    pathOptions={{
                      color: "#10B981",
                      weight: 5,
                      opacity: 0.9,
                      lineCap: "round",
                      lineJoin: "round",
                    }}
                  />
                )}

                {/* ==========================================
                    START POINT
                ========================================== */}

                <CircleMarker
                  center={startPosition}
                  radius={7}
                  pathOptions={{
                    color: "#ffffff",
                    weight: 3,
                    fillColor: "#2563EB",
                    fillOpacity: 1,
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <div className="font-semibold">Route Start</div>

                      <div className="mt-1">
                        Vehicle: {route.vehicleNumber || "N/A"}
                      </div>

                      <div>Ward: {route.wardNo ?? "N/A"}</div>
                    </div>
                  </Popup>
                </CircleMarker>

                {/* ==========================================
                    LAST / CURRENT POSITION
                ========================================== */}

                <Marker position={endPosition} icon={vehicleIcon}>
                  <Popup>
                    <div className="min-w-[190px] text-sm">
                      <div className="mb-2 text-base font-semibold text-[#16295A]">
                        Vehicle Details
                      </div>

                      <div>
                        Vehicle: <strong>{route.vehicleNumber || "N/A"}</strong>
                      </div>

                      <div>Ward: {route.wardNo ?? "N/A"}</div>

                      <div>
                        GPS Points: {route.pointCount || positions.length}
                      </div>

                      <div>
                        Last Update:{" "}
                        {route.endPoint?.timestamp
                          ? new Date(route.endPoint.timestamp).toLocaleString()
                          : "N/A"}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}
        </MapContainer>

        {/* ====================================================
            EMPTY STATE
        ==================================================== */}

        {routes.length === 0 && (
          <div className="pointer-events-none absolute inset-0 z-[1000] flex items-center justify-center">
            <div className="rounded-2xl bg-white/95 px-8 py-6 text-center shadow-lg">
              <div className="text-base font-semibold text-gray-700">
                No vehicle route data available
              </div>

              <div className="mt-1 text-sm text-gray-500">
                No heartbeat GPS points were found for the selected date and
                filters.
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            ROUTE SUMMARY
        ==================================================== */}

        {routes.length > 0 && (
          <div className="pointer-events-none absolute left-4 top-4 z-[1000]">
            <div className="rounded-xl bg-white/95 px-4 py-3 shadow-md">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Route Tracking
              </div>

              <div className="mt-1 text-sm font-semibold text-gray-800">
                {routes.length} vehicle
                {routes.length === 1 ? "" : "s"}
              </div>

              <div className="text-xs text-gray-500">
                {mapData?.totalRoutePoints || 0} GPS points
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RouteMap;
