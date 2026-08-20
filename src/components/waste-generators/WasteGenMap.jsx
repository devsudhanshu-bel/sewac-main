import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
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
import { useLanguage } from "../../i18n";

/* =========================================================
   MAP DEFAULTS
========================================================= */

const DEFAULT_CENTER = [12.9716, 77.5946];

const DEFAULT_ZOOM = 11;

const CARTO_LIGHT_URL =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

const CARTO_ATTRIBUTION =
  "&copy; OpenStreetMap contributors &copy; CARTO";

/* =========================================================
   GEOJSON HELPERS
========================================================= */

const isCoordinatePair = (value) =>
  Array.isArray(value) &&
  value.length >= 2 &&
  typeof value[0] === "number" &&
  typeof value[1] === "number";

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

  if (typeof geometry === "string") {
    try {
      geometry = JSON.parse(geometry);
    } catch (error) {
      console.error("Unable to parse ward boundary:", error);

      return null;
    }
  }

  if (!geometry || typeof geometry !== "object") {
    return null;
  }

  if (
    geometry.type === "Polygon" ||
    geometry.type === "MultiPolygon"
  ) {
    if (!Array.isArray(geometry.coordinates)) {
      return null;
    }

    return {
      type: geometry.type,
      coordinates: reverseCoordinates(geometry.coordinates),
    };
  }

  if (geometry.type === "Feature") {
    return normalizeGeometry(geometry.geometry);
  }

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
   FIT MAP TO DATA
========================================================= */

function FitMapToData({
  boundary,
  points,
  gvpPoints,
  fitKey,
}) {
  const map = useMap();

  useEffect(() => {
    try {
      const bounds = L.latLngBounds([]);

      /* =====================================================
         COLLECTION POINTS
      ===================================================== */

      if (Array.isArray(points)) {
        points.forEach((point) => {
          const latitude = Number(point.latitude);
          const longitude = Number(point.longitude);

          if (
            Number.isFinite(latitude) &&
            Number.isFinite(longitude)
          ) {
            bounds.extend([latitude, longitude]);
          }
        });
      }

      /* =====================================================
         GVP POINTS
      ===================================================== */

      if (Array.isArray(gvpPoints)) {
        gvpPoints.forEach((point) => {
          const latitude = Number(point.latitude);
          const longitude = Number(point.longitude);

          if (
            Number.isFinite(latitude) &&
            Number.isFinite(longitude)
          ) {
            bounds.extend([latitude, longitude]);
          }
        });
      }

      /* =====================================================
         WARD BOUNDARY
      ===================================================== */

      if (boundary) {
        const boundaryLayer = L.geoJSON(boundary);

        const boundaryBounds = boundaryLayer.getBounds();

        if (boundaryBounds.isValid()) {
          bounds.extend(boundaryBounds);
        }
      }

      /* =====================================================
         NOTHING TO SHOW
      ===================================================== */

      if (!bounds.isValid()) {
        map.setView(DEFAULT_CENTER, DEFAULT_ZOOM, {
          animate: true,
        });

        return;
      }

      /* =====================================================
         FIT EVERYTHING
      ===================================================== */

      map.fitBounds(bounds, {
        padding: [30, 30],
        maxZoom: 15,
        animate: true,
        duration: 0.8,
      });
    } catch (error) {
      console.error("Unable to fit map bounds:", error);

      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM, {
        animate: true,
      });
    }
  }, [boundary, points, gvpPoints, fitKey, map]);

  return null;
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function WasteGenMap({ selectedDate }) {
  const sectionRef = useRef(null);

  const collectionCardRef = useRef(null);

  const {
    selectedCity,
    selectedZone,
    selectedDivision,
    selectedWard,
  } = useFilters();

  const { t } = useLanguage();

  const [mapData, setMapData] = useState(null);

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  /* =======================================================
     GSAP
  ======================================================= */

  useEffect(() => {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .from(sectionRef.current, {
          opacity: 0,
          duration: 0.25,
        })
        .from(
          collectionCardRef.current,
          {
            opacity: 0,
            y: 55,
            scale: 0.96,
            duration: 1.1,
          },
          "-=0.05"
        );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  /* =======================================================
     FILTER VALUES
  ======================================================= */

  const cityId = selectedCity?.city_id ?? null;

  const zoneId = selectedZone?.zone_id ?? null;

  const divisionId = selectedDivision?.division_id ?? null;

  const wardId = selectedWard?.ward_id ?? null;

  const filterKey = [
    cityId ?? "",
    zoneId ?? "",
    divisionId ?? "",
    wardId ?? "",
    selectedDate ?? "",
  ].join(":");

  /* =======================================================
     LOAD MAP DATA
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadMap = async () => {
      if (!cityId || !zoneId || !divisionId || !wardId) {
        setMapData(null);
        setErrorMessage("");
        setLoading(false);

        return;
      }

      setLoading(true);

      setErrorMessage("");

      try {
        const response = await api.get(
          "/api/waste-generators/map",
          {
            params: {
              date: selectedDate,
              cityId,
              zoneId,
              divisionId,
              wardId,
            },
          }
        );

        if (cancelled) {
          return;
        }

        if (response?.data?.success === false) {
          throw new Error(
            response.data.message ||
              t(
                "wasteGenerators.map.errors.loadWardMap",
                "Unable to load the selected ward map."
              )
          );
        }

        const data = response?.data?.data || null;

        console.log("Waste Generator Map response:", {
          date: data?.date,
          dayTable: data?.dayTable,
          ward: data?.ward,
          totalPoints: data?.totalPoints,
          returnedPoints: Array.isArray(data?.points)
            ? data.points.length
            : 0,
          totalGVPPoints: data?.totalGVPPoints,
          returnedGVPPoints: Array.isArray(data?.gvpPoints)
            ? data.gvpPoints.length
            : 0,
          vehicles: data?.vehicles,
        });

        setMapData(data);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("Waste Generator Map Error:", error);

        setMapData(null);

        setErrorMessage(
          error?.response?.data?.message ||
            error?.message ||
            t(
              "wasteGenerators.map.errors.loadWardMap",
              "Unable to load the selected ward map."
            )
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadMap();

    return () => {
      cancelled = true;
    };
  }, [
    cityId,
    zoneId,
    divisionId,
    wardId,
    selectedDate,
    t,
  ]);

  /* =======================================================
     BOUNDARY
  ======================================================= */

  const boundary = useMemo(() => {
    return normalizeGeometry(mapData?.boundary);
  }, [mapData?.boundary]);

  /* =======================================================
     ALL COLLECTION POINTS
  ======================================================= */

  const visiblePoints = useMemo(() => {
    if (!Array.isArray(mapData?.points)) {
      return [];
    }

    return mapData.points.filter((point) => {
      const latitude = Number(point.latitude);

      const longitude = Number(point.longitude);

      return (
        Number.isFinite(latitude) &&
        Number.isFinite(longitude)
      );
    });
  }, [mapData?.points]);

  /* =======================================================
     GVP POINTS
  ======================================================= */

  const visibleGVPPoints = useMemo(() => {
    if (!Array.isArray(mapData?.gvpPoints)) {
      return [];
    }

    return mapData.gvpPoints.filter((point) => {
      const latitude = Number(point.latitude);

      const longitude = Number(point.longitude);

      return (
        Number.isFinite(latitude) &&
        Number.isFinite(longitude)
      );
    });
  }, [mapData?.gvpPoints]);

  /* =======================================================
     DISPLAY DATA
  ======================================================= */

  const wardName =
    mapData?.ward?.wardName ||
    selectedWard?.ward_name ||
    t(
      "wasteGenerators.map.selectedWard",
      "Selected Ward"
    );

  const wardNo =
    mapData?.ward?.wardNo ??
    selectedWard?.ward_no ??
    null;

  const pointCount = Number.isFinite(
    Number(mapData?.totalPoints)
  )
    ? Number(mapData.totalPoints)
    : visiblePoints.length;

  const gvpCount = Number.isFinite(
    Number(mapData?.totalGVPPoints)
  )
    ? Number(mapData.totalGVPPoints)
    : visibleGVPPoints.length;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section
      ref={sectionRef}
      className="grid grid-cols-1 gap-5 h-full"
    >
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
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="px-5 pt-4 pb-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-[14px] font-semibold text-[#16295A]">
                {t(
                  "wasteGenerators.map.title",
                  "Collection Point Monitoring"
                )}
              </h3>

              <span className="text-[11px] text-slate-400">
                {pointCount}{" "}
                {t(
                  "wasteGenerators.map.points",
                  "points"
                )}
              </span>

              {selectedDate && (
                <span className="text-[11px] text-slate-400">
                  · {selectedDate}
                </span>
              )}
            </div>

            {mapData?.ward && (
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                {mapData.ward.zoneName}
                {" · "}
                {mapData.ward.divisionName}
                {" · "}
                {wardName}

                {wardNo !== null
                  ? ` · ${t(
                      "wasteGenerators.map.ward",
                      "Ward"
                    )} ${wardNo}`
                  : ""}
              </p>
            )}
          </div>

          {/* ==================================================
              LEGEND
          ================================================== */}

          <div className="flex items-center gap-4 shrink-0">
            {/* GREEN */}

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />

              <span className="text-[11px] text-slate-500">
                {t(
                  "wasteGenerators.map.legend.collectionPoint",
                  "Collection Point"
                )}
              </span>
            </div>

            {/* RED */}

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />

              <span className="text-[11px] text-slate-500">
                {t(
                  "wasteGenerators.map.legend.gvpPoint",
                  "GVP Point"
                )}
              </span>

              <span className="text-[10px] text-slate-400">
                ({gvpCount})
              </span>
            </div>
          </div>
        </div>

        {/* ==================================================
            MAP
        ================================================== */}

        <div className="relative h-[310px] bg-[#F7F8FB]">
          <MapContainer
            center={DEFAULT_CENTER}
            zoom={DEFAULT_ZOOM}
            scrollWheelZoom
            zoomControl={false}
            className="h-full w-full"
          >
            <TileLayer
              attribution={CARTO_ATTRIBUTION}
              url={CARTO_LIGHT_URL}
              subdomains={["a", "b", "c", "d"]}
              maxZoom={20}
            />

            <ZoomControl position="topleft" />

            <MapSizeController />

            <FitMapToData
              boundary={boundary}
              points={visiblePoints}
              gvpPoints={visibleGVPPoints}
              fitKey={filterKey}
            />

            {/* =================================================
                SELECTED WARD BOUNDARY
            ================================================= */}

            {boundary && (
              <GeoJSON
                key={`ward-boundary-${filterKey}`}
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
                ALL COLLECTION TELEMETRY — GREEN
            ================================================= */}

            {visiblePoints.map((point, index) => {
              const latitude = Number(point.latitude);

              const longitude = Number(point.longitude);

              const pointKey =
                point.pointKey ||
                [
                  point.sourceVehicleTable ||
                    "UNKNOWN_TABLE",

                  point.vehicleNumber ||
                    "UNKNOWN_VEHICLE",

                  point.id ?? "NO_ID",

                  point.iotTimestamp ||
                    "NO_TIMESTAMP",

                  latitude.toFixed(7),

                  longitude.toFixed(7),

                  index,
                ].join("-");

              return (
                <CircleMarker
                  key={`collection-${String(pointKey)}`}
                  center={[latitude, longitude]}
                  radius={4}
                  pathOptions={{
                    color: "#FFFFFF",
                    weight: 1.25,
                    fillColor: "#16A34A",
                    fillOpacity: 0.9,
                  }}
                >
                  <Tooltip direction="top">
                    <div className="text-xs">
                      <div className="font-semibold">
                        {point.vehicleNumber ||
                          t(
                            "wasteGenerators.map.tooltip.collectionVehicle",
                            "Collection Vehicle"
                          )}
                      </div>

                      {point.sourceVehicleTable && (
                        <div>
                          {t(
                            "wasteGenerators.map.tooltip.table",
                            "Table"
                          )}
                          : {point.sourceVehicleTable}
                        </div>
                      )}

                      {point.iotTimestamp && (
                        <div>
                          {t(
                            "wasteGenerators.map.tooltip.iot",
                            "IoT"
                          )}
                          :{" "}
                          {new Date(
                            point.iotTimestamp
                          ).toLocaleString()}
                        </div>
                      )}

                      <div>
                        {t(
                          "wasteGenerators.map.tooltip.coordinates",
                          "Coordinates"
                        )}
                        : {latitude.toFixed(6)},{" "}
                        {longitude.toFixed(6)}
                      </div>

                      {wardNo !== null && (
                        <div>
                          {t(
                            "wasteGenerators.map.ward",
                            "Ward"
                          )}{" "}
                          {wardNo}
                        </div>
                      )}
                    </div>
                  </Tooltip>
                </CircleMarker>
              );
            })}

            {/* =================================================
                GVP TELEMETRY — RED
            ================================================= */}

            {visibleGVPPoints.map((point, index) => {
              const latitude = Number(point.latitude);

              const longitude = Number(point.longitude);

              const gvpKey =
                point.pointKey ||
                [
                  "GVP",

                  point.sourceVehicleTable ||
                    "UNKNOWN_TABLE",

                  point.vehicleNumber ||
                    "UNKNOWN_VEHICLE",

                  point.id ?? "NO_ID",

                  point.iotTimestamp ||
                    "NO_TIMESTAMP",

                  latitude.toFixed(7),

                  longitude.toFixed(7),

                  index,
                ].join("-");

              return (
                <CircleMarker
                  key={`gvp-${String(gvpKey)}`}
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
                    <div className="text-xs">
                      <div className="font-semibold text-red-600">
                        {t(
                          "wasteGenerators.map.tooltip.gvpPoint",
                          "GVP Point"
                        )}
                      </div>

                      {point.vehicleNumber && (
                        <div>
                          {t(
                            "wasteGenerators.map.tooltip.vehicle",
                            "Vehicle"
                          )}
                          : {point.vehicleNumber}
                        </div>
                      )}

                      {point.sourceVehicleTable && (
                        <div>
                          {t(
                            "wasteGenerators.map.tooltip.table",
                            "Table"
                          )}
                          : {point.sourceVehicleTable}
                        </div>
                      )}

                      {point.iotTimestamp && (
                        <div>
                          {t(
                            "wasteGenerators.map.tooltip.iot",
                            "IoT"
                          )}
                          :{" "}
                          {new Date(
                            point.iotTimestamp
                          ).toLocaleString()}
                        </div>
                      )}

                      {point.unitNumber && (
                        <div>
                          {t(
                            "wasteGenerators.map.tooltip.unit",
                            "Unit"
                          )}
                          : {point.unitNumber}
                        </div>
                      )}

                      {point.remarks && (
                        <div>
                          {t(
                            "wasteGenerators.map.tooltip.remarks",
                            "Remarks"
                          )}
                          : {point.remarks}
                        </div>
                      )}

                      <div>
                        {t(
                          "wasteGenerators.map.tooltip.gvpWaste",
                          "GVP waste"
                        )}
                        :{" "}
                        {Number(
                          point.gvpWaste ??
                            point.weightDelta ??
                            0
                        ).toFixed(3)}
                      </div>

                      <div>
                        {t(
                          "wasteGenerators.map.tooltip.coordinates",
                          "Coordinates"
                        )}
                        : {latitude.toFixed(6)},{" "}
                        {longitude.toFixed(6)}
                      </div>

                      {wardNo !== null && (
                        <div>
                          {t(
                            "wasteGenerators.map.ward",
                            "Ward"
                          )}{" "}
                          {wardNo}
                        </div>
                      )}
                    </div>
                  </Tooltip>
                </CircleMarker>
              );
            })}
          </MapContainer>

          {/* ==================================================
              LOADING
          ================================================== */}

          {loading && (
            <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/55 backdrop-blur-[1px] pointer-events-none">
              <div className="rounded-xl bg-white px-4 py-2 shadow text-xs text-slate-500">
                {t(
                  "wasteGenerators.map.loading",
                  "Loading daily vehicle telemetry..."
                )}
              </div>
            </div>
          )}

          {/* ==================================================
              NO WARD
          ================================================== */}

          {!loading && !errorMessage && !wardId && (
            <div className="absolute inset-0 z-[900] flex items-center justify-center pointer-events-none">
              <div className="rounded-xl bg-white/90 px-5 py-3 shadow text-center">
                <p className="text-sm font-medium text-[#16295A]">
                  {t(
                    "wasteGenerators.map.selectWard",
                    "Select a ward"
                  )}
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  {t(
                    "wasteGenerators.map.selectWardDescription",
                    "Choose City, Zone, Division and Ward from the header."
                  )}
                </p>
              </div>
            </div>
          )}

          {/* ==================================================
              ERROR
          ================================================== */}

          {!loading && errorMessage && (
            <div className="absolute inset-0 z-[900] flex items-center justify-center pointer-events-none">
              <div className="rounded-xl bg-white/95 px-5 py-3 shadow text-center max-w-[320px]">
                <p className="text-sm font-medium text-red-600">
                  {t(
                    "wasteGenerators.map.mapUnavailable",
                    "Map unavailable"
                  )}
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  {errorMessage}
                </p>
              </div>
            </div>
          )}

          {/* ==================================================
              NO BOUNDARY
          ================================================== */}

          {!loading &&
            !errorMessage &&
            wardId &&
            mapData &&
            !boundary && (
              <div className="absolute bottom-3 left-3 z-[900] pointer-events-none">
                <div className="rounded-lg bg-white/90 px-3 py-1.5 shadow text-[10px] text-slate-500">
                  {t(
                    "wasteGenerators.map.noBoundary",
                    "Ward boundary unavailable for this selection"
                  )}
                </div>
              </div>
            )}

          {/* ==================================================
              NO POINTS
          ================================================== */}

          {!loading &&
            !errorMessage &&
            wardId &&
            mapData &&
            visiblePoints.length === 0 && (
              <div className="absolute bottom-3 right-3 z-[900] pointer-events-none">
                <div className="rounded-lg bg-white/90 px-3 py-1.5 shadow text-[10px] text-slate-500">
                  {t(
                    "wasteGenerators.map.noTelemetry",
                    "No telemetry points for this date"
                  )}
                </div>
              </div>
            )}

          {/* ==================================================
              MAP SUMMARY
          ================================================== */}

          {!loading &&
            !errorMessage &&
            mapData &&
            visiblePoints.length > 0 && (
              <div className="absolute bottom-3 left-3 z-[900] pointer-events-none">
                <div className="rounded-lg bg-white/90 px-3 py-1.5 shadow text-[10px] text-slate-500">
                  {t(
                    "wasteGenerators.map.summary.showing",
                    "Showing"
                  )}{" "}
                  <strong>{visiblePoints.length}</strong>{" "}
                  {t(
                    "wasteGenerators.map.summary.telemetryCoordinates",
                    "telemetry coordinates from"
                  )}{" "}
                  {Array.isArray(mapData.vehicles)
                    ? mapData.vehicles.length
                    : 0}{" "}
                  {t(
                    "wasteGenerators.map.summary.vehicleTables",
                    "vehicle tables"
                  )}
                  {gvpCount > 0 && (
                    <>
                      {" · "}
                      <strong className="text-red-500">
                        {gvpCount}
                      </strong>{" "}
                      {t(
                        "wasteGenerators.map.summary.gvpPoints",
                        "GVP points"
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    </section>
  );
}