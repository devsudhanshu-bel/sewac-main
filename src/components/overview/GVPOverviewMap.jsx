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
   NORMALIZE GVP BOUNDARY
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
        normalizeGeometry(
          feature?.geometry
        )
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
        polygons.push(
          ...item.coordinates
        );
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

   Important because this component is rendered inside the
   City Overview map container and can change size when the
   user changes views or browser dimensions.
========================================================= */

function MapSizeController() {
  const map = useMap();

  useEffect(() => {
    const timers = [
      setTimeout(
        () => map.invalidateSize(),
        50
      ),

      setTimeout(
        () => map.invalidateSize(),
        250
      ),

      setTimeout(
        () => map.invalidateSize(),
        600
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
   FIT GVP MAP
========================================================= */

function FitGVPMap({
  boundary,
  gvpPoints,
  fitKey,
}) {
  const map = useMap();

  useEffect(() => {
    try {
      const bounds =
        L.latLngBounds([]);

      /*
       * =====================================================
       * GVP POINTS
       * =====================================================
       */

      if (
        Array.isArray(gvpPoints)
      ) {
        gvpPoints.forEach(
          (point) => {
            const latitude =
              Number(
                point.latitude
              );

            const longitude =
              Number(
                point.longitude
              );

            if (
              Number.isFinite(
                latitude
              ) &&
              Number.isFinite(
                longitude
              )
            ) {
              bounds.extend([
                latitude,
                longitude,
              ]);
            }
          }
        );
      }

      /*
       * =====================================================
       * WARD BOUNDARY
       * =====================================================
       */

      if (boundary) {
        const boundaryLayer =
          L.geoJSON(
            boundary
          );

        const boundaryBounds =
          boundaryLayer.getBounds();

        if (
          boundaryBounds.isValid()
        ) {
          bounds.extend(
            boundaryBounds
          );
        }
      }

      /*
       * =====================================================
       * NOTHING AVAILABLE
       * =====================================================
       */

      if (
        !bounds.isValid()
      ) {
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
       * =====================================================
       * FIT EVERYTHING
       * =====================================================
       */

      const isSmallScreen =
        typeof window !==
          "undefined" &&
        window.innerWidth < 640;

      map.fitBounds(
        bounds,
        {
          padding: isSmallScreen
            ? [20, 20]
            : [35, 35],

          maxZoom: 15,

          animate: true,

          duration: 0.8,
        }
      );
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
   SAFE VALUE FORMATTER
========================================================= */

function formatValue(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  if (
    typeof value === "object"
  ) {
    try {
      return JSON.stringify(
        value
      );
    } catch {
      return String(value);
    }
  }

  return String(value);
}

/* =========================================================
   FIELD NAME FORMATTER
========================================================= */

function formatFieldName(
  field
) {
  return String(field)
    .replace(
      /([A-Z])/g,
      " $1"
    )
    .replace(
      /[_-]+/g,
      " "
    )
    .replace(
      /^./,
      (char) =>
        char.toUpperCase()
    );
}

/* =========================================================
   POPUP DATA ROW
========================================================= */

function PopupDataRow({
  label,
  value,
}) {
  return (
    <div
      className="
        grid
        grid-cols-[minmax(75px,95px)_minmax(0,1fr)]
        gap-2
        border-b
        border-slate-100
        py-1.5
        last:border-b-0
      "
    >
      <span
        className="
          break-words
          text-[9px]
          font-medium
          leading-4
          text-slate-400
          sm:text-[10px]
        "
      >
        {label}
      </span>

      <span
        className="
          min-w-0
          break-words
          text-[9px]
          font-medium
          leading-4
          text-slate-700
          sm:text-[10px]
        "
      >
        {formatValue(value)}
      </span>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function GVPOverviewMap({
  selectedDate,
}) {
  /* =======================================================
     LANGUAGE
  ======================================================= */

  const {
    language,
    t,
  } = useLanguage();

  /* =======================================================
     GLOBAL FILTER CONTEXT
  ======================================================= */

  const {
    selectedCity,
    selectedZone,
    selectedDivision,
    selectedWard,
  } = useFilters();

  /* =======================================================
     FILTER IDS
  ======================================================= */

  const cityId =
    selectedCity?.city_id ??
    null;

  const zoneId =
    selectedZone?.zone_id ??
    null;

  const divisionId =
    selectedDivision
      ?.division_id ?? null;

  const wardId =
    selectedWard?.ward_id ??
    null;

  /* =======================================================
     FILTER KEY
  ======================================================= */

  const filterKey = [
    cityId ?? "",
    zoneId ?? "",
    divisionId ?? "",
    wardId ?? "",
    selectedDate ?? "",
  ].join(":");

  /* =======================================================
     STATE
  ======================================================= */

  const [
    mapData,
    setMapData,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  /* =======================================================
     LOAD GVP DATA
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadGVPMap =
      async () => {
        /*
         * Backend requires the complete hierarchy.
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
                  date:
                    selectedDate,

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
            response?.data
              ?.success === false
          ) {
            throw new Error(
              response.data
                .message ||
                t(
                  "wasteGenerators.gvpMap.errors.load",
                  "Unable to load GVP points."
                )
            );
          }

          setMapData(
            response?.data
              ?.data || null
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
            error?.response
              ?.data?.message ||
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

  /* =======================================================
     NORMALIZE WARD BOUNDARY
  ======================================================= */

  const boundary =
    useMemo(
      () =>
        normalizeGeometry(
          mapData?.boundary
        ),
      [
        mapData?.boundary,
      ]
    );

  /* =======================================================
     GVP POINTS ONLY
  ======================================================= */

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
            Number(
              point.latitude
            );

          const longitude =
            Number(
              point.longitude
            );

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
    }, [
      mapData?.gvpPoints,
    ]);

  /* =======================================================
     DISPLAY DATA
  ======================================================= */

  const wardName =
    mapData?.ward
      ?.wardName ||
    selectedWard
      ?.ward_name ||
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

  /* =======================================================
     DATE LOCALE
  ======================================================= */

  const locale =
    language === "kn"
      ? "kn-IN"
      : language === "hi"
      ? "hi-IN"
      : "en-IN";

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section
      className="
        flex
        h-full
        min-h-0
        w-full
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-gray-200
        bg-white
        shadow-[0_2px_12px_rgba(0,0,0,0.04)]
        sm:rounded-3xl
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
          border-b
          border-slate-100
          bg-white
          px-3.5
          py-3
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:gap-4
          sm:px-5
          sm:py-3.5
        "
      >
        {/* =================================================
            TITLE
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
                  text-[10px]
                  text-slate-400
                  sm:text-[11px]
                "
              >
                ·{" "}
                {new Date(
                  selectedDate
                ).toLocaleDateString(
                  locale
                )}
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
            >
              {mapData.ward.zoneName}
              {" · "}
              {
                mapData.ward
                  .divisionName
              }
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
            LEGEND
        ================================================= */}

        <div
          className="
            flex
            shrink-0
            items-center
            gap-2
            self-start
            sm:self-center
          "
        >
          <span
            className="
              h-2.5
              w-2.5
              shrink-0
              rounded-full
              bg-red-500
              ring-2
              ring-red-100
              sm:h-3
              sm:w-3
            "
          />

          <span
            className="
              text-[10px]
              font-medium
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
          min-h-0
          flex-1
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
              CARTO LIGHT MAP
          ================================================= */}

          <TileLayer
            attribution={
              CARTO_ATTRIBUTION
            }
            url={
              CARTO_LIGHT_URL
            }
            subdomains={[
              "a",
              "b",
              "c",
              "d",
            ]}
            maxZoom={20}
          />

          {/* =================================================
              MAP SIZE
          ================================================= */}

          <MapSizeController />

          {/* =================================================
              ZOOM
          ================================================= */}

          <ZoomControl
            position="topleft"
          />

          {/* =================================================
              FIT MAP
          ================================================= */}

          <FitGVPMap
            boundary={
              boundary
            }
            gvpPoints={
              visibleGVPPoints
            }
            fitKey={filterKey}
          />

          {/* =================================================
              WARD BOUNDARY
          ================================================= */}

          {boundary && (
            <GeoJSON
              key={`gvp-boundary-${filterKey}`}
              data={boundary}
              style={{
                color:
                  "#4F46E5",

                weight: 3,

                opacity: 1,

                fillColor:
                  "#6366F1",

                fillOpacity:
                  0.07,

                lineJoin:
                  "round",

                lineCap:
                  "round",
              }}
            />
          )}

          {/* =================================================
              GVP POINTS
          ================================================= */}

          {visibleGVPPoints.map(
            (
              point,
              index
            ) => {
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

                  latitude.toFixed(
                    7
                  ),

                  longitude.toFixed(
                    7
                  ),

                  index,
                ].join("-");

              /*
               * -----------------------------------------------
               * POPUP DATA
               * -----------------------------------------------
               */

              const telemetry =
                point?.data &&
                typeof point.data ===
                  "object"
                  ? point.data
                  : point?.telemetry &&
                    typeof point.telemetry ===
                      "object"
                  ? point.telemetry
                  : {};

              const vehicle =
                point.vehicleNumber ||
                point.vehicle_number ||
                point.vehicleNo ||
                point.vehicle_no ||
                "—";

              const table =
                point.sourceVehicleTable ||
                point.vehicleTableName ||
                point.vehicle_table_name ||
                "—";

              const timestamp =
                point.iotTimestamp ||
                point.iot_timestamp ||
                point.timestamp ||
                "—";

              const unit =
                point.unit ||
                point.unitName ||
                point.unit_name ||
                telemetry?.unit ||
                "—";

              const remarks =
                point.remarks ||
                point.remark ||
                telemetry?.remarks ||
                telemetry?.remark ||
                "—";

              const gvpWaste =
                point.gvpWaste ??
                point.gvp_waste ??
                point.waste ??
                point.weight ??
                telemetry?.gvpWaste ??
                telemetry?.gvp_waste ??
                "—";

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
                    typeof window !==
                      "undefined" &&
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

                    stroke: true,
                  }}
                >
                  {/* =================================================
                      GVP TOOLTIP
                  ================================================= */}

                  <Tooltip
                    direction="top"
                    offset={[
                      0,
                      -6,
                    ]}
                    opacity={1}
                    className="
                      !rounded-xl
                      !border
                      !border-slate-200
                      !bg-white
                      !px-0
                      !py-0
                      !text-slate-700
                      !shadow-[0_10px_30px_rgba(15,23,42,0.14)]
                    "
                  >
                    <div
                      className="
                        w-[240px]
                        max-w-[calc(100vw-40px)]
                        overflow-hidden
                        rounded-xl
                        bg-white
                        sm:w-[260px]
                      "
                    >
                      {/* HEADER */}

                      <div
                        className="
                          border-b
                          border-slate-100
                          px-3
                          py-2.5
                        "
                      >
                        <div
                          className="
                            text-[12px]
                            font-bold
                            text-red-500
                          "
                        >
                          {t(
                            "wasteGenerators.gvpMap.tooltip.gvpPoint",
                            "GVP Point"
                          )}
                        </div>

                        <div
                          className="
                            mt-0.5
                            break-all
                            text-[10px]
                            text-slate-400
                          "
                        >
                          {vehicle}
                        </div>
                      </div>

                      {/* DATA */}

                      <div
                        className="
                          max-h-[260px]
                          overflow-y-auto
                          px-3
                          py-2
                        "
                      >
                        <PopupDataRow
                          label={t(
                            "wasteGenerators.gvpMap.tooltip.vehicle",
                            "Vehicle"
                          )}
                          value={
                            vehicle
                          }
                        />

                        <PopupDataRow
                          label={t(
                            "wasteGenerators.gvpMap.tooltip.table",
                            "Table"
                          )}
                          value={
                            table
                          }
                        />

                        <PopupDataRow
                          label={t(
                            "wasteGenerators.gvpMap.tooltip.iot",
                            "IoT"
                          )}
                          value={
                            timestamp
                          }
                        />

                        <PopupDataRow
                          label={t(
                            "wasteGenerators.gvpMap.tooltip.unit",
                            "Unit"
                          )}
                          value={
                            unit
                          }
                        />

                        <PopupDataRow
                          label={t(
                            "wasteGenerators.gvpMap.tooltip.remarks",
                            "Remarks"
                          )}
                          value={
                            remarks
                          }
                        />

                        <PopupDataRow
                          label={t(
                            "wasteGenerators.gvpMap.tooltip.gvpWaste",
                            "GVP waste"
                          )}
                          value={
                            gvpWaste
                          }
                        />

                        <PopupDataRow
                          label={t(
                            "wasteGenerators.gvpMap.tooltip.coordinates",
                            "Coordinates"
                          )}
                          value={`${latitude.toFixed(
                            7
                          )}, ${longitude.toFixed(
                            7
                          )}`}
                        />

                        <PopupDataRow
                          label={t(
                            "wasteGenerators.gvpMap.ward",
                            "Ward"
                          )}
                          value={
                            wardNo ??
                            "—"
                          }
                        />

                        {/* EXTRA TELEMETRY */}

                        {Object.keys(
                          telemetry
                        ).length >
                          0 && (
                          <div
                            className="
                              mt-2
                              border-t
                              border-slate-100
                              pt-2
                            "
                          >
                            <div
                              className="
                                mb-1.5
                                text-[8px]
                                font-semibold
                                uppercase
                                tracking-[0.08em]
                                text-slate-400
                              "
                            >
                              {t(
                                "wasteGenerators.gvpMap.tooltip.telemetry",
                                "Telemetry"
                              )}
                            </div>

                            {Object.entries(
                              telemetry
                            )
                              .filter(
                                ([
                                  key,
                                ]) =>
                                  ![
                                    "unit",
                                    "unitName",
                                    "unit_name",
                                    "remarks",
                                    "remark",
                                    "gvpWaste",
                                    "gvp_waste",
                                  ].includes(
                                    key
                                  )
                              )
                              .slice(
                                0,
                                12
                              )
                              .map(
                                ([
                                  key,
                                  value,
                                ]) => (
                                  <PopupDataRow
                                    key={
                                      key
                                    }
                                    label={formatFieldName(
                                      key
                                    )}
                                    value={
                                      value
                                    }
                                  />
                                )
                              )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Tooltip>
                </CircleMarker>
              );
            }
          )}
        </MapContainer>

        {/* =================================================
            LOADING STATE
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
              bg-white/35
              backdrop-blur-[1px]
            "
          >
            <div
              className="
                rounded-xl
                border
                border-slate-200
                bg-white/95
                px-4
                py-2.5
                text-[11px]
                font-medium
                text-slate-500
                shadow-[0_8px_25px_rgba(15,23,42,0.08)]
                sm:text-[12px]
              "
            >
              {t(
                "wasteGenerators.gvpMap.loading",
                "Loading GVP data..."
              )}
            </div>
          </div>
        )}

        {/* =================================================
            ERROR STATE
        ================================================= */}

        {!loading &&
          errorMessage && (
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                z-[1000]
                flex
                items-center
                justify-center
                p-4
              "
            >
              <div
                className="
                  max-w-[420px]
                  rounded-2xl
                  border
                  border-red-100
                  bg-white/95
                  px-5
                  py-4
                  text-center
                  shadow-[0_10px_30px_rgba(15,23,42,0.08)]
                "
              >
                <div
                  className="
                    text-[12px]
                    font-semibold
                    text-red-500
                    sm:text-[13px]
                  "
                >
                  {t(
                    "wasteGenerators.gvpMap.errors.load",
                    "Unable to load GVP points."
                  )}
                </div>

                <div
                  className="
                    mt-1.5
                    break-words
                    text-[10px]
                    leading-4
                    text-slate-400
                    sm:text-[11px]
                  "
                >
                  {errorMessage}
                </div>
              </div>
            </div>
          )}

        {/* =================================================
            NO FILTER STATE
        ================================================= */}

        {!loading &&
          !errorMessage &&
          (!cityId ||
            !zoneId ||
            !divisionId ||
            !wardId) && (
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                z-[900]
                flex
                items-center
                justify-center
                p-4
              "
            >
              <div
                className="
                  max-w-[380px]
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white/95
                  px-5
                  py-4
                  text-center
                  shadow-[0_10px_30px_rgba(15,23,42,0.08)]
                "
              >
                <div
                  className="
                    text-[12px]
                    font-semibold
                    text-slate-600
                    sm:text-[13px]
                  "
                >
                  {t(
                    "wasteGenerators.gvpMap.selectWard",
                    "Select a ward"
                  )}
                </div>

                <div
                  className="
                    mt-1
                    text-[10px]
                    leading-4
                    text-slate-400
                    sm:text-[11px]
                  "
                >
                  {t(
                    "wasteGenerators.gvpMap.selectWardDescription",
                    "Choose City, Zone, Division and Ward from the header."
                  )}
                </div>
              </div>
            </div>
          )}

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {!loading &&
          !errorMessage &&
          cityId &&
          zoneId &&
          divisionId &&
          wardId &&
          visibleGVPPoints.length ===
            0 && (
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                z-[900]
                flex
                items-center
                justify-center
                p-4
              "
            >
              <div
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white/95
                  px-5
                  py-4
                  text-center
                  shadow-[0_10px_30px_rgba(15,23,42,0.08)]
                "
              >
                <div
                  className="
                    text-[12px]
                    font-semibold
                    text-slate-600
                    sm:text-[13px]
                  "
                >
                  {t(
                    "wasteGenerators.gvpMap.empty",
                    "No GVP points available for the selected ward."
                  )}
                </div>
              </div>
            </div>
          )}
      </div>
    </section>
  );
}