import { useEffect, useMemo } from "react";

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
   * JSON STRING
   */

  if (typeof geometry === "string") {
    try {
      geometry = JSON.parse(geometry);
    } catch (error) {
      console.error(
        "Unable to parse GVP boundary:",
        error
      );

      return null;
    }
  }

  if (!geometry || typeof geometry !== "object") {
    return null;
  }

  /*
   * POLYGON / MULTIPOLYGON
   */

  if (
    geometry.type === "Polygon" ||
    geometry.type === "MultiPolygon"
  ) {
    if (!Array.isArray(geometry.coordinates)) {
      return null;
    }

    return {
      type: geometry.type,
      coordinates: reverseCoordinates(
        geometry.coordinates
      ),
    };
  }

  /*
   * FEATURE
   */

  if (geometry.type === "Feature") {
    return normalizeGeometry(
      geometry.geometry
    );
  }

  /*
   * FEATURE COLLECTION
   */

  if (
    geometry.type === "FeatureCollection" &&
    Array.isArray(geometry.features)
  ) {
    const geometries = geometry.features
      .map((feature) =>
        normalizeGeometry(feature?.geometry)
      )
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
   * GENERIC GEOMETRY WRAPPER
   */

  if (geometry.geometry) {
    return normalizeGeometry(
      geometry.geometry
    );
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
      setTimeout(
        () => map.invalidateSize(),
        100
      ),

      setTimeout(
        () => map.invalidateSize(),
        500
      ),

      setTimeout(
        () => map.invalidateSize(),
        1000
      ),
    ];

    const handleResize = () => {
      map.invalidateSize();
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      timers.forEach(clearTimeout);

      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, [map]);

  return null;
}

/* =========================================================
   FIT MAP TO GVP POINTS + WARD BOUNDARY
========================================================= */

function FitGVPMap({
  boundary,
  gvpPoints,
  fitKey,
}) {
  const map = useMap();

  useEffect(() => {
    try {
      const bounds = L.latLngBounds([]);

      /*
       * ONLY GVP POINTS
       */

      if (Array.isArray(gvpPoints)) {
        gvpPoints.forEach((point) => {
          const latitude = Number(
            point.latitude
          );

          const longitude = Number(
            point.longitude
          );

          if (
            Number.isFinite(latitude) &&
            Number.isFinite(longitude)
          ) {
            bounds.extend([
              latitude,
              longitude,
            ]);
          }
        });
      }

      /*
       * SELECTED WARD BOUNDARY
       */

      if (boundary) {
        const boundaryLayer =
          L.geoJSON(boundary);

        const boundaryBounds =
          boundaryLayer.getBounds();

        if (boundaryBounds.isValid()) {
          bounds.extend(
            boundaryBounds
          );
        }
      }

      /*
       * NOTHING AVAILABLE
       */

      if (!bounds.isValid()) {
        map.setView(
          DEFAULT_CENTER,
          DEFAULT_ZOOM,
          {
            animate: false,
          }
        );

        return;
      }

      /*
       * FIT SELECTED WARD
       */

      map.fitBounds(bounds, {
        padding: [30, 30],

        maxZoom: 15,

        animate: true,

        duration: 0.8,
      });
    } catch (error) {
      console.error(
        "Unable to fit GVP map:",
        error
      );

      map.setView(
        DEFAULT_CENTER,
        DEFAULT_ZOOM,
        {
          animate: false,
        }
      );
    }
  }, [
    boundary,
    gvpPoints,
    fitKey,
    map,
  ]);

  return null;
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function GVPOverviewMap({
  selectedDate,
}) {
  /*
   * =======================================================
   * LANGUAGE
   * =======================================================
   */

  const {
    language,
    t,
  } = useLanguage();

  /*
   * =======================================================
   * GLOBAL FILTER CONTEXT
   * =======================================================
   */

  const {
    selectedCity,
    selectedZone,
    selectedDivision,
    selectedWard,
  } = useFilters();

  /*
   * =======================================================
   * STATE
   * =======================================================
   */

  const [
    mapData,
    setMapData,
  ] = useStateSafe();

  const [
    loading,
    setLoading,
  ] = useStateSafe(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useStateSafe("");

  /*
   * =======================================================
   * FILTER IDS
   * =======================================================
   */

  const cityId =
    selectedCity?.city_id ?? null;

  const zoneId =
    selectedZone?.zone_id ?? null;

  const divisionId =
    selectedDivision?.division_id ?? null;

  const wardId =
    selectedWard?.ward_id ?? null;

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
   */

  useEffect(() => {
    let cancelled = false;

    const loadGVPMap = async () => {
      /*
       * ALL HIERARCHY LEVELS ARE REQUIRED
       */

      if (
        !cityId ||
        !zoneId ||
        !divisionId ||
        !wardId
      ) {
        setMapData(null);

        setErrorMessage("");

        setLoading(false);

        return;
      }

      setLoading(true);

      setErrorMessage("");

      try {
        const response =
          await api.get(
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

        if (
          response?.data?.success ===
          false
        ) {
          throw new Error(
            response.data.message ||
              t(
                "wasteGenerators.gvpMap.errors.load",
                "Unable to load GVP points."
              )
          );
        }

        setMapData(
          response?.data?.data ||
            null
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Overview GVP Map Error:",
          error
        );

        setMapData(null);

        setErrorMessage(
          error?.response?.data
            ?.message ||
            error?.message ||
            t(
              "wasteGenerators.gvpMap.errors.load",
              "Unable to load GVP points."
            )
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
  }, [
    selectedDate,
    cityId,
    zoneId,
    divisionId,
    wardId,
    t,
  ]);

  /*
   * =======================================================
   * NORMALIZE WARD BOUNDARY
   * =======================================================
   */

  const boundary = useMemo(
    () =>
      normalizeGeometry(
        mapData?.boundary
      ),
    [mapData?.boundary]
  );

  /*
   * =======================================================
   * GVP POINTS ONLY
   * =======================================================
   */

  const visibleGVPPoints =
    useMemo(() => {
      if (
        !Array.isArray(
          mapData?.gvpPoints
        )
      ) {
        return [];
      }

      return mapData.gvpPoints.filter(
        (point) => {
          const latitude =
            Number(point.latitude);

          const longitude =
            Number(point.longitude);

          return (
            Number.isFinite(
              latitude
            ) &&
            Number.isFinite(
              longitude
            )
          );
        }
      );
    }, [mapData?.gvpPoints]);

  /*
   * =======================================================
   * DISPLAY DATA
   * =======================================================
   */

  const wardName =
    mapData?.ward?.wardName ||
    selectedWard?.ward_name ||
    t(
      "wasteGenerators.gvpMap.selectedWard",
      "Selected Ward"
    );

  const wardNo =
    mapData?.ward?.wardNo ??
    selectedWard?.ward_no ??
    null;

  const gvpCount =
    Number.isFinite(
      Number(
        mapData?.totalGVPPoints
      )
    )
      ? Number(
          mapData.totalGVPPoints
        )
      : visibleGVPPoints.length;

  /*
   * =======================================================
   * DATE LOCALE
   * =======================================================
   */

  const locale =
    language === "kn"
      ? "kn-IN"
      : language === "hi"
      ? "hi-IN"
      : "en-IN";

  /*
   * =======================================================
   * RENDER
   * =======================================================
   */

  return (
    <section className="w-full h-full min-h-0">
      <div
        className="
          flex
          h-full
          w-full
          min-h-0
          flex-col
          overflow-hidden
          rounded-2xl
          sm:rounded-3xl
          border
          border-gray-200
          bg-white
          shadow-[0_2px_12px_rgba(0,0,0,0.04)]
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex
            shrink-0
            flex-col
            gap-2.5
            px-3.5
            pb-2.5
            pt-3
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:gap-4
            sm:px-5
            sm:py-4
          "
        >
          {/* =================================================
              TITLE / LOCATION
          ================================================= */}

          <div className="min-w-0 flex-1">
            <div
              className="
                flex
                min-w-0
                flex-wrap
                items-center
                gap-x-2
                gap-y-1
              "
            >
              <h3
                className="
                  max-w-full
                  truncate
                  text-[13px]
                  font-semibold
                  leading-5
                  text-[#16295A]
                  sm:text-[14px]
                "
              >
                {t(
                  "wasteGenerators.gvpMap.title",
                  "GVP Point Monitoring"
                )}
              </h3>

              <span
                className="
                  shrink-0
                  text-[10px]
                  text-slate-400
                  sm:text-[11px]
                "
              >
                {gvpCount}{" "}
                {t(
                  "wasteGenerators.gvpMap.points",
                  "points"
                )}
              </span>

              {selectedDate && (
                <span
                  className="
                    shrink-0
                    max-w-full
                    truncate
                    text-[10px]
                    text-slate-400
                    sm:text-[11px]
                  "
                >
                  · {selectedDate}
                </span>
              )}
            </div>

            {mapData?.ward && (
              <p
                className="
                  mt-0.5
                  max-w-full
                  truncate
                  text-[9px]
                  leading-4
                  text-slate-400
                  sm:text-[10px]
                "
                title={[
                  mapData.ward.zoneName,
                  mapData.ward.divisionName,
                  wardName,
                  wardNo !== null
                    ? `Ward ${wardNo}`
                    : "",
                ]
                  .filter(Boolean)
                  .join(" · ")}
              >
                {mapData.ward.zoneName}
                {" · "}
                {mapData.ward.divisionName}
                {" · "}
                {wardName}
                {wardNo !== null
                  ? ` · ${t(
                      "wasteGenerators.gvpMap.ward",
                      "Ward"
                    )} ${wardNo}`
                  : ""}
              </p>
            )}
          </div>

          {/* =================================================
              GVP LEGEND
          ================================================= */}

          <div
            className="
              flex
              shrink-0
              items-center
              self-start
              gap-1.5
              rounded-lg
              bg-slate-50
              px-2
              py-1
              sm:self-auto
              sm:bg-transparent
              sm:px-0
              sm:py-0
            "
          >
            <span
              className="
                h-2
                w-2
                shrink-0
                rounded-full
                bg-red-500
                sm:h-2.5
                sm:w-2.5
              "
            />

            <span
              className="
                text-[10px]
                text-slate-500
                sm:text-[11px]
              "
            >
              {t(
                "wasteGenerators.gvpMap.legend",
                "GVP Point"
              )}
            </span>

            <span
              className="
                text-[9px]
                text-slate-400
                sm:text-[10px]
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
            min-h-[300px]
            flex-1
            bg-[#F7F8FB]
            sm:min-h-[340px]
            md:min-h-[380px]
            lg:min-h-[420px]
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
                CARTO MAP
            ================================================= */}

            <TileLayer
              attribution={
                CARTO_ATTRIBUTION
              }
              url={CARTO_LIGHT_URL}
              subdomains={[
                "a",
                "b",
                "c",
                "d",
              ]}
              maxZoom={20}
            />

            <ZoomControl position="topleft" />

            <MapSizeController />

            <FitGVPMap
              boundary={boundary}
              gvpPoints={
                visibleGVPPoints
              }
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
                GVP POINTS ONLY
            ================================================= */}

            {visibleGVPPoints.map(
              (point, index) => {
                const latitude =
                  Number(
                    point.latitude
                  );

                const longitude =
                  Number(
                    point.longitude
                  );

                const gvpKey =
                  point.pointKey ||
                  [
                    point.sourceVehicleTable ||
                      "UNKNOWN_TABLE",

                    point.vehicleNumber ||
                      "UNKNOWN_VEHICLE",

                    point.id ??
                      "NO_ID",

                    point.iotTimestamp ||
                      "NO_TIMESTAMP",

                    latitude.toFixed(7),

                    longitude.toFixed(7),

                    index,
                  ].join("-");

                return (
                  <CircleMarker
                    key={`overview-gvp-${String(
                      gvpKey
                    )}`}
                    center={[
                      latitude,
                      longitude,
                    ]}
                    radius={
                      window.innerWidth <
                      640
                        ? 5
                        : 5.5
                    }
                    pathOptions={{
                      color:
                        "#FFFFFF",

                      weight: 1.5,

                      fillColor:
                        "#EF4444",

                      fillOpacity:
                        0.95,
                    }}
                  >
                    <Tooltip direction="top">
                      <div
                        className="
                          max-w-[220px]
                          text-[10px]
                          leading-4
                          sm:text-xs
                        "
                      >
                        {/* GVP */}

                        <div
                          className="
                            font-semibold
                            text-red-600
                          "
                        >
                          {t(
                            "wasteGenerators.gvpMap.tooltip.gvpPoint",
                            "GVP Point"
                          )}
                        </div>

                        {/* VEHICLE */}

                        {point.vehicleNumber && (
                          <div>
                            <span className="font-medium">
                              {t(
                                "wasteGenerators.gvpMap.tooltip.vehicle",
                                "Vehicle"
                              )}
                              :
                            </span>{" "}
                            {
                              point.vehicleNumber
                            }
                          </div>
                        )}

                        {/* TABLE */}

                        {point.sourceVehicleTable && (
                          <div className="break-all">
                            <span className="font-medium">
                              {t(
                                "wasteGenerators.gvpMap.tooltip.table",
                                "Table"
                              )}
                              :
                            </span>{" "}
                            {
                              point.sourceVehicleTable
                            }
                          </div>
                        )}

                        {/* IOT */}

                        {point.iotTimestamp && (
                          <div>
                            <span className="font-medium">
                              {t(
                                "wasteGenerators.gvpMap.tooltip.iot",
                                "IoT"
                              )}
                              :
                            </span>{" "}
                            {new Date(
                              point.iotTimestamp
                            ).toLocaleString(
                              locale
                            )}
                          </div>
                        )}

                        {/* UNIT */}

                        {point.unitNumber && (
                          <div>
                            <span className="font-medium">
                              {t(
                                "wasteGenerators.gvpMap.tooltip.unit",
                                "Unit"
                              )}
                              :
                            </span>{" "}
                            {
                              point.unitNumber
                            }
                          </div>
                        )}

                        {/* REMARKS */}

                        {point.remarks && (
                          <div className="break-words">
                            <span className="font-medium">
                              {t(
                                "wasteGenerators.gvpMap.tooltip.remarks",
                                "Remarks"
                              )}
                              :
                            </span>{" "}
                            {
                              point.remarks
                            }
                          </div>
                        )}

                        {/* WASTE */}

                        <div>
                          <span className="font-medium">
                            {t(
                              "wasteGenerators.gvpMap.tooltip.gvpWaste",
                              "GVP waste"
                            )}
                            :
                          </span>{" "}
                          {Number(
                            point.gvpWaste ??
                              point.weightDelta ??
                              0
                          ).toFixed(3)}{" "}
                          KG
                        </div>

                        {/* COORDINATES */}

                        <div>
                          <span className="font-medium">
                            {t(
                              "wasteGenerators.gvpMap.tooltip.coordinates",
                              "Coordinates"
                            )}
                            :
                          </span>{" "}
                          {latitude.toFixed(
                            6
                          )}
                          ,{" "}
                          {longitude.toFixed(
                            6
                          )}
                        </div>

                        {/* WARD */}

                        {wardNo !== null && (
                          <div>
                            {t(
                              "wasteGenerators.gvpMap.ward",
                              "Ward"
                            )}{" "}
                            {wardNo}
                          </div>
                        )}
                      </div>
                    </Tooltip>
                  </CircleMarker>
                );
              }
            )}
          </MapContainer>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                z-[1000]
                flex
                items-center
                justify-center
                bg-white/55
                px-4
                backdrop-blur-[1px]
              "
            >
              <div
                className="
                  rounded-xl
                  bg-white
                  px-3
                  py-2
                  text-center
                  text-[10px]
                  text-slate-500
                  shadow
                  sm:px-4
                  sm:text-xs
                "
              >
                {t(
                  "wasteGenerators.gvpMap.loading",
                  "Loading GVP points..."
                )}
              </div>
            </div>
          )}

          {/* =================================================
              NO FILTER
          ================================================= */}

          {!loading &&
            !errorMessage &&
            !wardId && (
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  z-[900]
                  flex
                  items-center
                  justify-center
                  px-4
                "
              >
                <div
                  className="
                    w-full
                    max-w-[320px]
                    rounded-xl
                    bg-white/90
                    px-4
                    py-3
                    text-center
                    shadow
                    sm:px-5
                  "
                >
                  <p
                    className="
                      text-[12px]
                      font-medium
                      text-[#16295A]
                      sm:text-sm
                    "
                  >
                    {t(
                      "wasteGenerators.gvpMap.selectWard",
                      "Select a ward"
                    )}
                  </p>

                  <p
                    className="
                      mt-1
                      text-[10px]
                      leading-4
                      text-slate-400
                      sm:text-xs
                    "
                  >
                    {t(
                      "wasteGenerators.gvpMap.selectWardDescription",
                      "Choose City, Zone, Division and Ward from the header."
                    )}
                  </p>
                </div>
              </div>
            )}

          {/* =================================================
              ERROR
          ================================================= */}

          {!loading &&
            errorMessage && (
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  z-[900]
                  flex
                  items-center
                  justify-center
                  px-4
                "
              >
                <div
                  className="
                    w-full
                    max-w-[340px]
                    rounded-xl
                    bg-white/95
                    px-4
                    py-3
                    text-center
                    shadow
                    sm:px-5
                  "
                >
                  <p
                    className="
                      text-[12px]
                      font-medium
                      text-red-600
                      sm:text-sm
                    "
                  >
                    {t(
                      "wasteGenerators.gvpMap.unavailable",
                      "GVP map unavailable"
                    )}
                  </p>

                  <p
                    className="
                      mt-1
                      break-words
                      text-[10px]
                      leading-4
                      text-slate-400
                      sm:text-xs
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
            visibleGVPPoints.length ===
              0 && (
              <div
                className="
                  pointer-events-none
                  absolute
                  bottom-2
                  right-2
                  z-[900]
                  sm:bottom-3
                  sm:right-3
                "
              >
                <div
                  className="
                    rounded-lg
                    bg-white/90
                    px-2.5
                    py-1.5
                    text-[9px]
                    text-slate-500
                    shadow
                    sm:px-3
                    sm:text-[10px]
                  "
                >
                  {t(
                    "wasteGenerators.gvpMap.empty",
                    "No GVP points for this date"
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   SAFE STATE HELPERS

   These simply keep the component readable while preserving
   normal React useState behavior.
========================================================= */

import {
  useState as useStateSafe,
} from "react";