import { useEffect, useMemo, useState } from "react";

import L from "leaflet";

import {
  CircleMarker,
  GeoJSON,
  MapContainer,
  TileLayer,
  Tooltip,
  ZoomControl,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import api from "../../api/axios";

import { useFilters } from "../../contexts/FilterContext";

/* =========================================================
   MAP DEFAULTS
========================================================= */

const DEFAULT_CENTER = [12.9716, 77.5946];

const DEFAULT_ZOOM = 11;

const CARTO_LIGHT_URL =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

const CARTO_ATTRIBUTION = "&copy; OpenStreetMap contributors &copy; CARTO";

/* =========================================================
   GEOJSON HELPERS
========================================================= */

const isCoordinatePair = (value) =>
  Array.isArray(value) &&
  value.length >= 2 &&
  typeof value[0] === "number" &&
  typeof value[1] === "number";

/* =========================================================
   REVERSE COORDINATES
========================================================= */

const reverseCoordinates = (value) => {
  if (isCoordinatePair(value)) {
    return [value[1], value[0]];
  }

  if (Array.isArray(value)) {
    return value.map(reverseCoordinates);
  }

  return value;
};

/* =========================================================
   NORMALIZE BOUNDARY
========================================================= */

const normalizeGeometry = (value) => {
  if (!value) {
    return null;
  }

  let geometry = value;

  /*
   * JSON string
   */

  if (typeof geometry === "string") {
    try {
      geometry = JSON.parse(geometry);
    } catch (error) {
      console.error("Unable to parse GVP boundary:", error);

      return null;
    }
  }

  if (!geometry || typeof geometry !== "object") {
    return null;
  }

  /*
   * Polygon / MultiPolygon
   */

  if (geometry.type === "Polygon" || geometry.type === "MultiPolygon") {
    if (!Array.isArray(geometry.coordinates)) {
      return null;
    }

    return {
      type: geometry.type,

      coordinates: reverseCoordinates(geometry.coordinates),
    };
  }

  /*
   * Feature
   */

  if (geometry.type === "Feature") {
    return normalizeGeometry(geometry.geometry);
  }

  /*
   * FeatureCollection
   */

  if (
    geometry.type === "FeatureCollection" &&
    Array.isArray(geometry.features)
  ) {
    const geometries = geometry.features
      .map((feature) => normalizeGeometry(feature?.geometry))
      .filter(Boolean);

    if (geometries.length === 0) {
      return null;
    }

    if (geometries.length === 1) {
      return geometries[0];
    }

    const polygons = [];

    geometries.forEach((item) => {
      if (item.type === "Polygon") {
        polygons.push(item.coordinates);
      }

      if (item.type === "MultiPolygon") {
        polygons.push(...item.coordinates);
      }
    });

    if (polygons.length === 0) {
      return null;
    }

    return {
      type: "MultiPolygon",

      coordinates: polygons,
    };
  }

  /*
   * Generic geometry wrapper
   */

  if (geometry.geometry) {
    return normalizeGeometry(geometry.geometry);
  }

  return null;
};

/* =========================================================
   MAP SIZE CONTROLLER
========================================================= */

function MapSizeController() {
  const map = useMap();

  useEffect(() => {
    const timers = [
      setTimeout(() => map.invalidateSize(), 100),

      setTimeout(() => map.invalidateSize(), 500),

      setTimeout(() => map.invalidateSize(), 1000),
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

/* =========================================================
   FIT MAP TO GVP POINTS + WARD BOUNDARY
========================================================= */

function FitGVPMap({ boundary, gvpPoints, fitKey }) {
  const map = useMap();

  useEffect(() => {
    try {
      const bounds = L.latLngBounds([]);

      /*
       * ONLY GVP POINTS
       */

      if (Array.isArray(gvpPoints)) {
        gvpPoints.forEach((point) => {
          const latitude = Number(point.latitude);

          const longitude = Number(point.longitude);

          if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
            bounds.extend([latitude, longitude]);
          }
        });
      }

      /*
       * Selected ward boundary
       */

      if (boundary) {
        const boundaryLayer = L.geoJSON(boundary);

        const boundaryBounds = boundaryLayer.getBounds();

        if (boundaryBounds.isValid()) {
          bounds.extend(boundaryBounds);
        }
      }

      /*
       * Nothing available
       */

      if (!bounds.isValid()) {
        map.setView(DEFAULT_CENTER, DEFAULT_ZOOM, {
          animate: false,
        });

        return;
      }

      /*
       * Fit selected ward
       */

      map.fitBounds(bounds, {
        padding: [30, 30],

        maxZoom: 15,

        animate: true,

        duration: 0.8,
      });
    } catch (error) {
      console.error("Unable to fit GVP map:", error);

      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM, {
        animate: false,
      });
    }
  }, [boundary, gvpPoints, fitKey, map]);

  return null;
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function GVPOverviewMap({ selectedDate }) {
  /*
   * =======================================================
   * GLOBAL FILTER CONTEXT
   * =======================================================
   */

  const { selectedCity, selectedZone, selectedDivision, selectedWard } =
    useFilters();

  /*
   * =======================================================
   * STATE
   * =======================================================
   */

  const [mapData, setMapData] = useState(null);

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  /*
   * =======================================================
   * FILTER IDS
   * =======================================================
   */

  const cityId = selectedCity?.city_id ?? null;

  const zoneId = selectedZone?.zone_id ?? null;

  const divisionId = selectedDivision?.division_id ?? null;

  const wardId = selectedWard?.ward_id ?? null;

  /*
   * =======================================================
   * FILTER KEY
   * =======================================================
   */

  const filterKey = [
    cityId ?? "",
    zoneId ?? "",
    divisionId ?? "",
    wardId ?? "",
    selectedDate ?? "",
  ].join(":");

  /*
   * =======================================================
   * LOAD MAP DATA
   * =======================================================
   *
   * IMPORTANT:
   *
   * We call the SAME backend map endpoint used by
   * WasteGenMap.
   *
   * We do NOT call WasteGenMap itself.
   *
   * We simply consume:
   *
   * response.data.data.gvpPoints
   *
   * and ignore:
   *
   * response.data.data.points
   */

  useEffect(() => {
    let cancelled = false;

    const loadGVPMap = async () => {
      /*
       * All hierarchy levels are required because
       * the existing backend map endpoint resolves
       * the physical ward telemetry tables.
       */

      if (!cityId || !zoneId || !divisionId || !wardId) {
        setMapData(null);

        setErrorMessage("");

        setLoading(false);

        return;
      }

      setLoading(true);

      setErrorMessage("");

      try {
        const response = await api.get("/api/waste-generators/map", {
          params: {
            date: selectedDate,

            cityId,

            zoneId,

            divisionId,

            wardId,
          },
        });

        if (cancelled) {
          return;
        }

        if (response?.data?.success === false) {
          throw new Error(
            response.data.message || "Unable to load GVP points.",
          );
        }

        setMapData(response?.data?.data || null);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("Overview GVP Map Error:", error);

        setMapData(null);

        setErrorMessage(
          error?.response?.data?.message ||
            error?.message ||
            "Unable to load GVP points.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadGVPMap();

    return () => {
      cancelled = true;
    };
  }, [selectedDate, cityId, zoneId, divisionId, wardId]);

  /*
   * =======================================================
   * NORMALIZE WARD BOUNDARY
   * =======================================================
   */

  const boundary = useMemo(
    () => normalizeGeometry(mapData?.boundary),
    [mapData?.boundary],
  );

  /*
   * =======================================================
   * GVP POINTS ONLY
   * =======================================================
   *
   * IMPORTANT:
   *
   * mapData.points
   *     = normal collection telemetry
   *
   * mapData.gvpPoints
   *     = GVP telemetry
   *
   * We intentionally use ONLY gvpPoints.
   */

  const visibleGVPPoints = useMemo(() => {
    if (!Array.isArray(mapData?.gvpPoints)) {
      return [];
    }

    return mapData.gvpPoints.filter((point) => {
      const latitude = Number(point.latitude);

      const longitude = Number(point.longitude);

      return Number.isFinite(latitude) && Number.isFinite(longitude);
    });
  }, [mapData?.gvpPoints]);

  /*
   * =======================================================
   * DISPLAY DATA
   * =======================================================
   */

  const wardName =
    mapData?.ward?.wardName || selectedWard?.ward_name || "Selected Ward";

  const wardNo = mapData?.ward?.wardNo ?? selectedWard?.ward_no ?? null;

  const gvpCount = Number.isFinite(Number(mapData?.totalGVPPoints))
    ? Number(mapData.totalGVPPoints)
    : visibleGVPPoints.length;

  /*
   * =======================================================
   * RENDER
   * =======================================================
   */

  return (
    <section className="w-full h-full min-h-0">
      <div
        className="
          bg-white
          rounded-3xl
          border
          border-gray-200
          shadow-[0_2px_12px_rgba(0,0,0,0.04)]
          overflow-hidden
          w-full
          h-full
          flex
          flex-col
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            px-5
            pt-4
            pb-3
            flex
            items-center
            justify-between
            gap-4
            shrink-0
          "
        >
          <div className="min-w-0">
            <div
              className="
                flex
                items-center
                gap-3
                flex-wrap
              "
            >
              <h3
                className="
                  text-[14px]
                  font-semibold
                  text-[#16295A]
                "
              >
                GVP Point Monitoring
              </h3>

              <span
                className="
                  text-[11px]
                  text-slate-400
                "
              >
                {gvpCount} points
              </span>

              {selectedDate && (
                <span
                  className="
                    text-[11px]
                    text-slate-400
                  "
                >
                  · {selectedDate}
                </span>
              )}
            </div>

            {mapData?.ward && (
              <p
                className="
                  text-[10px]
                  text-slate-400
                  mt-0.5
                  truncate
                "
              >
                {mapData.ward.zoneName}
                {" · "}
                {mapData.ward.divisionName}
                {" · "}
                {wardName}

                {wardNo !== null ? ` · Ward ${wardNo}` : ""}
              </p>
            )}
          </div>

          {/* =================================================
              GVP LEGEND ONLY
          ================================================= */}

          <div
            className="
              flex
              items-center
              gap-2
              shrink-0
            "
          >
            <span
              className="
                w-2.5
                h-2.5
                rounded-full
                bg-red-500
              "
            />

            <span
              className="
                text-[11px]
                text-slate-500
              "
            >
              GVP Point
            </span>

            <span
              className="
                text-[10px]
                text-slate-400
              "
            >
              ({gvpCount})
            </span>
          </div>
        </div>

        {/* =================================================
            MAP
        ================================================= */}

        <div
          className="
            relative
            flex-1
            min-h-[310px]
            bg-[#F7F8FB]
          "
        >
          <MapContainer
            center={DEFAULT_CENTER}
            zoom={DEFAULT_ZOOM}
            scrollWheelZoom
            zoomControl={false}
            className="h-full w-full"
          >
            {/* =================================================
                SAME CARTO MAP AS WASTEGENMAP
            ================================================= */}

            <TileLayer
              attribution={CARTO_ATTRIBUTION}
              url={CARTO_LIGHT_URL}
              subdomains={["a", "b", "c", "d"]}
              maxZoom={20}
            />

            <ZoomControl position="topleft" />

            <MapSizeController />

            <FitGVPMap
              boundary={boundary}
              gvpPoints={visibleGVPPoints}
              fitKey={filterKey}
            />

            {/* =================================================
                SELECTED WARD BOUNDARY
            ================================================= */}

            {boundary && (
              <GeoJSON
                key={`gvp-boundary-${filterKey}`}
                data={boundary}
                style={{
                  color: "#4F46E5",

                  weight: 3,

                  opacity: 1,

                  fillColor: "#6366F1",

                  fillOpacity: 0.07,
                }}
              />
            )}

            {/* =================================================
                GVP POINTS ONLY — RED
            ================================================= */}

            {visibleGVPPoints.map((point, index) => {
              const latitude = Number(point.latitude);

              const longitude = Number(point.longitude);

              const gvpKey =
                point.pointKey ||
                [
                  point.sourceVehicleTable || "UNKNOWN_TABLE",

                  point.vehicleNumber || "UNKNOWN_VEHICLE",

                  point.id ?? "NO_ID",

                  point.iotTimestamp || "NO_TIMESTAMP",

                  latitude.toFixed(7),

                  longitude.toFixed(7),

                  index,
                ].join("-");

              return (
                <CircleMarker
                  key={`overview-gvp-${String(gvpKey)}`}
                  center={[latitude, longitude]}
                  radius={5.5}
                  pathOptions={{
                    color: "#FFFFFF",

                    weight: 1.5,

                    fillColor: "#EF4444",

                    fillOpacity: 0.95,
                  }}
                >
                  <Tooltip direction="top">
                    <div
                      className="
                          text-xs
                        "
                    >
                      <div
                        className="
                            font-semibold
                            text-red-600
                          "
                      >
                        GVP Point
                      </div>

                      {point.vehicleNumber && (
                        <div>Vehicle: {point.vehicleNumber}</div>
                      )}

                      {point.sourceVehicleTable && (
                        <div>Table: {point.sourceVehicleTable}</div>
                      )}

                      {point.iotTimestamp && (
                        <div>
                          IoT: {new Date(point.iotTimestamp).toLocaleString()}
                        </div>
                      )}

                      {point.unitNumber && <div>Unit: {point.unitNumber}</div>}

                      {point.remarks && <div>Remarks: {point.remarks}</div>}

                      <div>
                        GVP waste:{" "}
                        {Number(
                          point.gvpWaste ?? point.weightDelta ?? 0,
                        ).toFixed(3)}{" "}
                        KG
                      </div>

                      <div>
                        Coordinates: {latitude.toFixed(6)},{" "}
                        {longitude.toFixed(6)}
                      </div>

                      {wardNo !== null && <div>Ward {wardNo}</div>}
                    </div>
                  </Tooltip>
                </CircleMarker>
              );
            })}
          </MapContainer>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <div
              className="
                absolute
                inset-0
                z-[1000]
                flex
                items-center
                justify-center
                bg-white/55
                backdrop-blur-[1px]
                pointer-events-none
              "
            >
              <div
                className="
                  rounded-xl
                  bg-white
                  px-4
                  py-2
                  shadow
                  text-xs
                  text-slate-500
                "
              >
                Loading GVP points...
              </div>
            </div>
          )}

          {/* =================================================
              NO FILTER
          ================================================= */}

          {!loading && !errorMessage && !wardId && (
            <div
              className="
                  absolute
                  inset-0
                  z-[900]
                  flex
                  items-center
                  justify-center
                  pointer-events-none
                "
            >
              <div
                className="
                    rounded-xl
                    bg-white/90
                    px-5
                    py-3
                    shadow
                    text-center
                  "
              >
                <p
                  className="
                      text-sm
                      font-medium
                      text-[#16295A]
                    "
                >
                  Select a ward
                </p>

                <p
                  className="
                      text-xs
                      text-slate-400
                      mt-1
                    "
                >
                  Choose City, Zone, Division and Ward from the header.
                </p>
              </div>
            </div>
          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {!loading && errorMessage && (
            <div
              className="
                  absolute
                  inset-0
                  z-[900]
                  flex
                  items-center
                  justify-center
                  pointer-events-none
                "
            >
              <div
                className="
                    rounded-xl
                    bg-white/95
                    px-5
                    py-3
                    shadow
                    text-center
                    max-w-[320px]
                  "
              >
                <p
                  className="
                      text-sm
                      font-medium
                      text-red-600
                    "
                >
                  GVP map unavailable
                </p>

                <p
                  className="
                      text-xs
                      text-slate-400
                      mt-1
                    "
                >
                  {errorMessage}
                </p>
              </div>
            </div>
          )}

          {/* =================================================
              NO GVP POINTS
          ================================================= */}

          {!loading &&
            !errorMessage &&
            wardId &&
            mapData &&
            visibleGVPPoints.length === 0 && (
              <div
                className="
                  absolute
                  bottom-3
                  right-3
                  z-[900]
                  pointer-events-none
                "
              >
                <div
                  className="
                    rounded-lg
                    bg-white/90
                    px-3
                    py-1.5
                    shadow
                    text-[10px]
                    text-slate-500
                  "
                >
                  No GVP points for this date
                </div>
              </div>
            )}
        </div>
      </div>
    </section>
  );
}
