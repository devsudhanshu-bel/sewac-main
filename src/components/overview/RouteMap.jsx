import React, { useEffect, useMemo } from "react";

import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Marker,
  Popup,
  GeoJSON,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

/* ============================================================
   VEHICLE ICON
============================================================ */

const vehicleIcon = L.divIcon({
  className: "sewac-route-vehicle-marker",

  html: `
    <div
      style="
        width:38px;
        height:38px;
        border-radius:50%;
        background:#16A34A;
        border:4px solid #FFFFFF;
        box-shadow:0 3px 10px rgba(0,0,0,0.25);
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:18px;
      "
    >
      🚛
    </div>
  `,

  iconSize: [38, 38],

  iconAnchor: [19, 19],

  popupAnchor: [0, -19],
});

/* ============================================================
   GEOJSON NORMALIZER
============================================================ */

function normalizeGeoJSON(value) {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "object") {
    return value;
  }

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  return null;
}

/* ============================================================
   GET BOUNDARY
============================================================ */

function getBoundary(
  selectedCity,
  selectedZone,
  selectedDivision,
  selectedWard,
) {
  /*
   * Most specific selected boundary wins.
   *
   * Ward
   *   ↓
   * Division
   *   ↓
   * Zone
   *   ↓
   * City
   */

  if (selectedWard) {
    return normalizeGeoJSON(
      selectedWard.geoBoundary ??
        selectedWard.geo_boundary ??
        selectedWard.geometry ??
        selectedWard.boundary,
    );
  }

  if (selectedDivision) {
    return normalizeGeoJSON(
      selectedDivision.geoBoundary ??
        selectedDivision.geo_boundary ??
        selectedDivision.geometry ??
        selectedDivision.boundary,
    );
  }

  if (selectedZone) {
    return normalizeGeoJSON(
      selectedZone.geoBoundary ??
        selectedZone.geo_boundary ??
        selectedZone.geometry ??
        selectedZone.boundary,
    );
  }

  if (selectedCity) {
    return normalizeGeoJSON(
      selectedCity.geoBoundary ??
        selectedCity.geo_boundary ??
        selectedCity.geometry ??
        selectedCity.boundary,
    );
  }

  return null;
}

/* ============================================================
   MAP SIZE CONTROLLER
============================================================ */

function MapSizeController() {
  const map = useMap();

  useEffect(() => {
    const timers = [
      setTimeout(() => map.invalidateSize(), 100),

      setTimeout(() => map.invalidateSize(), 400),

      setTimeout(() => map.invalidateSize(), 800),
    ];

    const handleResize = () => {
      map.invalidateSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      timers.forEach(clearTimeout);

      window.removeEventListener("resize", handleResize);
    };
  }, [map]);

  return null;
}

/* ============================================================
   ROUTE BOUNDS
============================================================ */

function RouteBounds({ routes, boundary }) {
  const map = useMap();

  useEffect(() => {
    /*
     * Boundary takes priority for initial geographic context.
     */

    if (boundary) {
      try {
        const geoJsonLayer = L.geoJSON(boundary);

        const bounds = geoJsonLayer.getBounds();

        if (bounds.isValid()) {
          map.fitBounds(bounds, {
            padding: [50, 50],

            maxZoom: 14,

            animate: false,
          });

          return;
        }
      } catch {
        // Fall through to route bounds.
      }
    }

    /*
     * If no boundary is available,
     * fit to route GPS points.
     */

    if (!Array.isArray(routes) || routes.length === 0) {
      return;
    }

    const bounds = L.latLngBounds([]);

    routes.forEach((route) => {
      if (!Array.isArray(route.points)) {
        return;
      }

      route.points.forEach((point) => {
        const latitude = Number(point.latitude);

        const longitude = Number(point.longitude);

        if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
          bounds.extend([latitude, longitude]);
        }
      });
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [50, 50],

        maxZoom: 16,

        animate: false,
      });
    }
  }, [map, routes, boundary]);

  return null;
}

/* ============================================================
   SELECTED BOUNDARY FIT
============================================================ */

function SelectedBoundaryController({ boundary, boundaryKey }) {
  const map = useMap();

  useEffect(() => {
    if (!boundary) {
      return;
    }

    try {
      const layer = L.geoJSON(boundary);

      const bounds = layer.getBounds();

      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [60, 60],

          maxZoom: 14,

          animate: true,
        });
      }
    } catch {
      // Invalid boundary should not break route map.
    }
  }, [map, boundary, boundaryKey]);

  return null;
}

/* ============================================================
   ROUTE MAP
============================================================ */

const RouteMap = ({
  mapData,

  selectedDate,

  selectedCity,

  selectedZone,

  selectedDivision,

  selectedWard,
}) => {
  const routes = Array.isArray(mapData?.routes) ? mapData.routes : [];

  /* ==========================================================
     SELECTED BOUNDARY
  ========================================================== */

  const selectedBoundary = useMemo(
    () =>
      getBoundary(selectedCity, selectedZone, selectedDivision, selectedWard),
    [selectedCity, selectedZone, selectedDivision, selectedWard],
  );

  /* ==========================================================
     BOUNDARY KEY
  ========================================================== */

  const boundaryKey = useMemo(
    () => JSON.stringify(selectedBoundary || null),
    [selectedBoundary],
  );

  /* ==========================================================
     DEFAULT CENTER
  ========================================================== */

  const defaultCenter = useMemo(() => {
    /*
     * Try selected boundary first.
     */

    if (selectedBoundary) {
      try {
        const layer = L.geoJSON(selectedBoundary);

        const bounds = layer.getBounds();

        if (bounds.isValid()) {
          const center = bounds.getCenter();

          return [center.lat, center.lng];
        }
      } catch {
        // Fall through.
      }
    }

    /*
     * Then use first GPS point.
     */

    for (const route of routes) {
      if (!Array.isArray(route.points)) {
        continue;
      }

      for (const point of route.points) {
        const lat = Number(point.latitude);

        const lng = Number(point.longitude);

        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          return [lat, lng];
        }
      }
    }

    /*
     * Bengaluru fallback.
     */

    return [12.9716, 77.5946];
  }, [routes, selectedBoundary]);

  /* ==========================================================
     FILTER DESCRIPTION
  ========================================================== */

  const filterDescription =
    selectedWard?.ward_name ||
    selectedWard?.wardName ||
    selectedDivision?.division_name ||
    selectedDivision?.divisionName ||
    selectedZone?.zone_name ||
    selectedZone?.zoneName ||
    selectedCity?.city_name ||
    selectedCity?.cityName ||
    "All selected areas";

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div
      className="
        relative
        h-full
        min-h-full
        w-full
        overflow-hidden
        bg-[#EEF1F3]
      "
    >
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom
        zoomControl
        className="
          !h-full
          !min-h-full
          !w-full

          [&_.leaflet-container]:!h-full
          [&_.leaflet-container]:!w-full

          [&_.leaflet-control-attribution]:!text-[9px]
          [&_.leaflet-control-attribution]:!bg-white/80
        "
      >
        {/* ==================================================
            MAP
        ================================================== */}

        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
          subdomains={["a", "b", "c", "d"]}
          maxZoom={20}
        />

        <MapSizeController />

        {/* ==================================================
            SELECTED BOUNDARY
        ================================================== */}

        {selectedBoundary && (
          <GeoJSON
            key={`route-boundary-${boundaryKey}`}
            data={selectedBoundary}
            style={{
              color: "#334E68",

              weight: 3,

              opacity: 1,

              fillColor: "#94A3B8",

              fillOpacity: 0.06,

              lineJoin: "round",

              lineCap: "round",
            }}
          />
        )}

        {/* ==================================================
            FIT TO FILTERED BOUNDARY
        ================================================== */}

        <SelectedBoundaryController
          boundary={selectedBoundary}
          boundaryKey={boundaryKey}
        />

        {/* ==================================================
            FALLBACK ROUTE FIT
        ================================================== */}

        <RouteBounds routes={routes} boundary={selectedBoundary} />

        {/* ==================================================
            VEHICLE ROUTES
        ================================================== */}

        {routes.map((route, routeIndex) => {
          const points = Array.isArray(route.points) ? route.points : [];

          const positions = points
            .map((point) => [Number(point.latitude), Number(point.longitude)])
            .filter(
              (position) =>
                Number.isFinite(position[0]) && Number.isFinite(position[1]),
            );

          if (positions.length === 0) {
            return null;
          }

          const startPosition = positions[0];

          const endPosition = positions[positions.length - 1];

          const vehicleKey =
            route.vehicleNumber ||
            route.heartbeatTableName ||
            `route-${routeIndex}`;

          return (
            <React.Fragment key={vehicleKey}>
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
                    START
                ========================================== */}

              <CircleMarker
                center={startPosition}
                radius={6}
                pathOptions={{
                  color: "#FFFFFF",

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
                    CURRENT / LAST POSITION
                ========================================== */}

              <Marker position={endPosition} icon={vehicleIcon}>
                <Popup>
                  <div className="min-w-[200px] text-sm">
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

      {/* ======================================================
          MAP HEADER
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-4
          top-4
          z-[1000]
          max-w-[360px]
        "
      >
        <div
          className="
            rounded-2xl
            border
            border-white/80
            bg-white/95
            px-4
            py-3
            shadow-[0_10px_30px_rgba(30,45,60,0.10)]
            backdrop-blur-xl
          "
        >
          <div className="text-xs font-bold uppercase tracking-wide text-[#60758B]">
            Vehicle Route Map
          </div>

          <div className="mt-1 text-sm font-semibold text-[#34475B]">
            {filterDescription}
          </div>

          <div className="mt-1 text-xs text-[#8AA1BB]">
            {selectedDate || "Selected date"}
          </div>
        </div>
      </div>

      {/* ======================================================
          ROUTE SUMMARY
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-4
          left-4
          z-[1000]
        "
      >
        <div
          className="
            rounded-xl
            border
            border-white/80
            bg-white/95
            px-4
            py-3
            shadow-md
            backdrop-blur-xl
          "
        >
          <div className="text-xs font-semibold uppercase tracking-wide text-[#7C91A8]">
            Route Tracking
          </div>

          <div className="mt-1 text-sm font-bold text-[#34475B]">
            {routes.length} vehicle
            {routes.length === 1 ? "" : "s"}
          </div>

          <div className="text-xs text-[#8AA1BB]">
            {mapData?.totalRoutePoints || 0} GPS points
          </div>
        </div>
      </div>

      {/* ======================================================
          EMPTY STATE
      ====================================================== */}

      {routes.length === 0 && (
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-[900]
            flex
            items-center
            justify-center
          "
        >
          <div
            className="
              rounded-2xl
              border
              border-[#DCE4EC]
              bg-white/95
              px-8
              py-6
              text-center
              shadow-lg
            "
          >
            <div className="text-base font-semibold text-[#34475B]">
              No vehicle route data available
            </div>

            <div className="mt-1 text-sm text-[#8AA1BB]">
              No heartbeat GPS points were found for the selected date and
              filters.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteMap;
