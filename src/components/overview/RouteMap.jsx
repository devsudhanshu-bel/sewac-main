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
   VEHICLE TRAIL COLORS
============================================================ */

const VEHICLE_TRAIL_COLORS = [
  "#10B981", // Green
  "#2563EB", // Blue
  "#F59E0B", // Amber
  "#DC2626", // Red
  "#7C3AED", // Violet
  "#DB2777", // Pink
  "#0891B2", // Cyan
  "#EA580C", // Orange
  "#4F46E5", // Indigo
  "#65A30D", // Lime
];

/* ============================================================
   GET DETERMINISTIC VEHICLE COLOR
============================================================ */

function getVehicleTrailColor(vehicleId) {
  const id = String(vehicleId || "");

  let hash = 0;

  for (let i = 0; i < id.length; i += 1) {
    hash = (hash << 5) - hash + id.charCodeAt(i);

    hash |= 0;
  }

  const index = Math.abs(hash) % VEHICLE_TRAIL_COLORS.length;

  return VEHICLE_TRAIL_COLORS[index];
}

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
   BASIC GEOJSON PARSER
============================================================ */

function parseGeoJSON(value) {
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
   GEOJSON COORDINATE HELPERS
============================================================ */

function isCoordinatePair(value) {
  return (
    Array.isArray(value) &&
    value.length >= 2 &&
    Number.isFinite(Number(value[0])) &&
    Number.isFinite(Number(value[1]))
  );
}

/* ============================================================
   NORMALIZE SINGLE BOUNDARY COORDINATE
============================================================ */

function normalizeCoordinatePair(pair) {
  if (!isCoordinatePair(pair)) {
    return pair;
  }

  const first = Number(pair[0]);

  const second = Number(pair[1]);

  if (Math.abs(first) <= 30 && Math.abs(second) >= 60) {
    return [second, first, ...pair.slice(2)];
  }

  return pair;
}

/* ============================================================
   NORMALIZE NESTED COORDINATES
============================================================ */

function normalizeCoordinates(value) {
  if (isCoordinatePair(value)) {
    return normalizeCoordinatePair(value);
  }

  if (Array.isArray(value)) {
    return value.map(normalizeCoordinates);
  }

  return value;
}

/* ============================================================
   NORMALIZE GEOJSON
============================================================ */

function normalizeGeoJSON(value) {
  const parsed = parseGeoJSON(value);

  if (!parsed) {
    return null;
  }

  /* ==========================================================
     FEATURE COLLECTION
  ========================================================== */

  if (parsed.type === "FeatureCollection") {
    return {
      ...parsed,

      features: Array.isArray(parsed.features)
        ? parsed.features.map(normalizeGeoJSON).filter(Boolean)
        : [],
    };
  }

  /* ==========================================================
     FEATURE
  ========================================================== */

  if (parsed.type === "Feature") {
    if (!parsed.geometry) {
      return null;
    }

    return {
      ...parsed,

      geometry: normalizeGeoJSON(parsed.geometry),
    };
  }

  /* ==========================================================
     GEOMETRY COLLECTION
  ========================================================== */

  if (parsed.type === "GeometryCollection") {
    return {
      ...parsed,

      geometries: Array.isArray(parsed.geometries)
        ? parsed.geometries.map(normalizeGeoJSON).filter(Boolean)
        : [],
    };
  }

  /* ==========================================================
     STANDARD GEOMETRY
  ========================================================== */

  if (parsed.type && parsed.coordinates) {
    return {
      ...parsed,

      coordinates: normalizeCoordinates(parsed.coordinates),
    };
  }

  /* ==========================================================
     RAW COORDINATE ARRAY
  ========================================================== */

  if (Array.isArray(parsed)) {
    return {
      type: "Feature",

      properties: {},

      geometry: {
        type: "Polygon",

        coordinates: normalizeCoordinates(parsed),
      },
    };
  }

  /* ==========================================================
     OBJECT WITH GEOMETRY
  ========================================================== */

  if (parsed.geometry && typeof parsed.geometry === "object") {
    return normalizeGeoJSON({
      type: "Feature",

      properties: parsed.properties || {},

      geometry: parsed.geometry,
    });
  }

  /* ==========================================================
     OBJECT WITH COORDINATES
  ========================================================== */

  if (parsed.coordinates) {
    return {
      type: "Feature",

      properties: parsed.properties || {},

      geometry: {
        type: parsed.type || "Polygon",

        coordinates: normalizeCoordinates(parsed.coordinates),
      },
    };
  }

  return null;
}

/* ============================================================
   GET SELECTED BOUNDARY
============================================================ */

function getBoundary(
  selectedCity,
  selectedZone,
  selectedDivision,
  selectedWard,
) {
  /*
   * Most specific selected
   * boundary wins.
   *
   * Ward
   * ↓
   * Division
   * ↓
   * Zone
   * ↓
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
   GPS COORDINATE NORMALIZER
============================================================ */

/*
 * HB telemetry:
 *
 * latitude
 * longitude
 *
 * Leaflet:
 *
 * [latitude, longitude]
 */

function normalizeGpsPoint(point) {
  if (!point) {
    return null;
  }

  const latitude = Number(point.latitude);

  const longitude = Number(point.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return [latitude, longitude];
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
     * Selected boundary first.
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
        // Fall through.
      }
    }

    /*
     * Otherwise fit route
     * GPS points.
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
        const position = normalizeGpsPoint(point);

        if (position) {
          bounds.extend(position);
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
      // Invalid boundary
      // should not break map.
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
     * Selected boundary.
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
        // Continue.
      }
    }

    /*
     * First valid GPS point.
     */

    for (const route of routes) {
      if (!Array.isArray(route.points)) {
        continue;
      }

      for (const point of route.points) {
        const position = normalizeGpsPoint(point);

        if (position) {
          return position;
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
            MAP TILES
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
            FIT TO SELECTED BOUNDARY
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

          /*
           * HB GPS:
           *
           * latitude
           * longitude
           */

          const positions = points
            .map((point) => normalizeGpsPoint(point))
            .filter((position) => Array.isArray(position));

          if (positions.length === 0) {
            return null;
          }

          const startPosition = positions[0];

          const endPosition = positions[positions.length - 1];

          /*
           * Stable vehicle key.
           */

          const vehicleKey =
            route.vehicleNumber ||
            route.heartbeatTableName ||
            `route-${routeIndex}`;

          /*
           * UNIQUE COLOR FOR
           * THIS VEHICLE.
           */

          const trailColor = getVehicleTrailColor(vehicleKey);

          return (
            <React.Fragment key={vehicleKey}>
              {/* ========================================
                    TRACED ROUTE
                ======================================== */}

              {positions.length > 1 && (
                <Polyline
                  positions={positions}
                  pathOptions={{
                    color: trailColor,

                    weight: 5,

                    opacity: 0.9,

                    lineCap: "round",

                    lineJoin: "round",
                  }}
                />
              )}

              {/* ========================================
                    START POINT
                ======================================== */}

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
                  <div className="min-w-[190px] text-sm">
                    <div className="font-semibold">Route Start</div>

                    <div className="mt-1">
                      Vehicle: {route.vehicleNumber || "N/A"}
                    </div>

                    <div>Ward: {route.wardNo ?? "N/A"}</div>

                    <div className="mt-2 flex items-center gap-2">
                      <span
                        style={{
                          display: "inline-block",

                          width: "28px",

                          height: "4px",

                          borderRadius: "999px",

                          backgroundColor: trailColor,
                        }}
                      />

                      <span>Route color</span>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>

              {/* ========================================
                    CURRENT / LAST POSITION
                ======================================== */}

              <Marker position={endPosition} icon={vehicleIcon}>
                <Popup>
                  <div className="min-w-[220px] text-sm">
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

                    {/* ==================================
                          TRAIL COLOR INDICATOR
                      ================================== */}

                    <div className="mt-3 flex items-center gap-2 border-t border-[#E5EAF0] pt-2">
                      <span
                        style={{
                          display: "inline-block",

                          width: "32px",

                          height: "5px",

                          borderRadius: "999px",

                          backgroundColor: trailColor,
                        }}
                      />

                      <span className="text-xs text-[#8AA1BB]">
                        Vehicle route
                      </span>
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
