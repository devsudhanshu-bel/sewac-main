import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  MapContainer,
  TileLayer,
  GeoJSON,
  ZoomControl,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import {
  ChevronDown,
  ChevronUp,
  Map as MapIcon,
} from "lucide-react";

import "leaflet/dist/leaflet.css";

/* ============================================================
   CONFIG
============================================================ */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5002";

const DEFAULT_CITY_ID = 1;

/*
 * Your backend endpoint:
 *
 * GET /api/master-citizen/map/city/:cityId
 *
 * Example:
 *
 * http://localhost:5002/api/master-citizen/map/city/1
 */

const CITY_MAP_ENDPOINT = (cityId) =>
  `${API_BASE_URL}/api/master-citizen/map/city/${cityId}`;


/* ============================================================
   ZONE COLORS
============================================================ */

const ZONE_COLORS = [
  "#93C5FD",
  "#C4B5FD",
  "#86EFAC",
  "#FDE68A",
  "#F9A8D4",
  "#67E8F9",
  "#FDBA74",
  "#A5B4FC",
  "#BBF7D0",
  "#FCA5A5",
];


/* ============================================================
   HELPERS
============================================================ */

/**
 * Safely convert JSON strings into objects.
 */
function parseGeoJSON(value) {
  if (!value) {
    return null;
  }

  if (typeof value === "object") {
    return value;
  }

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (error) {
      console.warn(
        "Unable to parse GeoJSON:",
        error
      );

      return null;
    }
  }

  return null;
}


/**
 * Convert various possible boundary formats
 * into a valid GeoJSON object.
 *
 * Supported:
 *
 * Feature
 * FeatureCollection
 * Polygon
 * MultiPolygon
 * GeometryCollection
 */
function normalizeGeoJSON(value) {
  const parsed = parseGeoJSON(value);

  if (!parsed) {
    return null;
  }

  /*
   * Already a FeatureCollection
   */
  if (
    parsed.type ===
    "FeatureCollection"
  ) {
    return parsed;
  }

  /*
   * Already a Feature
   */
  if (
    parsed.type === "Feature"
  ) {
    return parsed;
  }

  /*
   * Raw geometry
   */
  if (
    parsed.type === "Polygon" ||
    parsed.type === "MultiPolygon" ||
    parsed.type === "LineString" ||
    parsed.type === "MultiLineString" ||
    parsed.type === "Point" ||
    parsed.type === "MultiPoint" ||
    parsed.type === "GeometryCollection"
  ) {
    return {
      type: "Feature",
      properties: {},
      geometry: parsed,
    };
  }

  /*
   * Sometimes backend data can accidentally
   * contain a geometry inside "geometry".
   */
  if (
    parsed.geometry &&
    typeof parsed.geometry === "object"
  ) {
    return {
      type: "Feature",
      properties:
        parsed.properties || {},
      geometry: parsed.geometry,
    };
  }

  return null;
}


/**
 * Get Leaflet bounds from GeoJSON.
 */
function getGeoJSONBounds(
  geoJSON
) {
  try {
    const normalized =
      normalizeGeoJSON(
        geoJSON
      );

    if (!normalized) {
      return null;
    }

    const layer =
      L.geoJSON(
        normalized
      );

    const bounds =
      layer.getBounds();

    if (
      bounds &&
      bounds.isValid()
    ) {
      return bounds;
    }

    return null;
  } catch (error) {
    console.warn(
      "Unable to calculate GeoJSON bounds:",
      error
    );

    return null;
  }
}


/**
 * Get readable zone name.
 */
function getZoneName(zone) {
  if (
    typeof zone === "string"
  ) {
    return zone;
  }

  return (
    zone?.zoneName ||
    zone?.zone_name ||
    zone?.name ||
    "Unnamed Zone"
  );
}


/**
 * Get zone boundary.
 */
function getZoneBoundary(zone) {
  if (
    !zone ||
    typeof zone === "string"
  ) {
    return null;
  }

  return normalizeGeoJSON(
    zone.geoBoundary ??
      zone.geo_boundary ??
      zone.geometry ??
      zone.boundary
  );
}


/**
 * Get zone table name.
 */
function getZoneTableName(zone) {
  if (
    !zone ||
    typeof zone === "string"
  ) {
    return null;
  }

  return (
    zone.zoneTableName ||
    zone.zone_table_name ||
    null
  );
}


/* ============================================================
   MAP FIT COMPONENT
============================================================ */

function MapBoundsController({
  cityBoundary,
  zones,
}) {
  const map = useMap();

  useEffect(() => {
    /*
     * Prefer city boundary.
     */
    const cityBounds =
      getGeoJSONBounds(
        cityBoundary
      );

    if (
      cityBounds &&
      cityBounds.isValid()
    ) {
      map.fitBounds(
        cityBounds,
        {
          padding: [
            30,
            30,
          ],
          maxZoom: 11,
          animate: false,
        }
      );

      return;
    }

    /*
     * Fallback:
     * fit to all zone boundaries.
     */
    const validZoneBounds =
      zones
        .map((zone) =>
          getGeoJSONBounds(
            getZoneBoundary(zone)
          )
        )
        .filter(Boolean);

    if (
      validZoneBounds.length === 0
    ) {
      return;
    }

    const combinedBounds =
      validZoneBounds.reduce(
        (
          accumulated,
          bounds
        ) => {
          if (
            !accumulated
          ) {
            return bounds;
          }

          return accumulated.extend(
            bounds
          );
        },
        null
      );

    if (
      combinedBounds &&
      combinedBounds.isValid()
    ) {
      map.fitBounds(
        combinedBounds,
        {
          padding: [
            30,
            30,
          ],
          maxZoom: 11,
          animate: false,
        }
      );
    }
  }, [
    cityBoundary,
    zones,
    map,
  ]);

  return null;
}


/* ============================================================
   ZONE LAYER
============================================================ */

function ZoneLayer({
  zone,
  index,
  selected,
  onSelect,
}) {
  const boundary =
    getZoneBoundary(zone);

  if (!boundary) {
    return null;
  }

  const baseColor =
    ZONE_COLORS[
      index %
        ZONE_COLORS.length
    ];

  const zoneName =
    getZoneName(zone);

  const style = {
    color: selected
      ? "#26364A"
      : "#60748A",

    weight: selected
      ? 3.2
      : 1.8,

    opacity: selected
      ? 1
      : 0.9,

    fillColor:
      baseColor,

    fillOpacity:
      selected
        ? 0.48
        : 0.26,

    lineJoin:
      "round",

    lineCap:
      "round",
  };

  const eventHandlers = {
    click: () => {
      onSelect(zone);
    },

    mouseover: (
      event
    ) => {
      const layer =
        event.target;

      layer.setStyle({
        weight: 3,
        opacity: 1,
        fillOpacity: 0.52,
      });

      if (
        layer.bringToFront
      ) {
        layer.bringToFront();
      }
    },

    mouseout: (
      event
    ) => {
      const layer =
        event.target;

      layer.setStyle(
        style
      );
    },
  };

  return (
    <GeoJSON
      key={`zone-${zoneName}-${index}`}
      data={boundary}
      style={() => style}
      eventHandlers={
        eventHandlers
      }
      bubblingMouseEvents={false}
    />
  );
}


/* ============================================================
   CITY BOUNDARY
============================================================ */

function CityBoundaryLayer({
  boundary,
}) {
  if (!boundary) {
    return null;
  }

  return (
    <GeoJSON
      data={boundary}
      style={() => ({
        color: "#34475B",
        weight: 3.4,
        opacity: 1,
        fillOpacity: 0,
        fillColor:
          "transparent",
        lineJoin:
          "round",
        lineCap:
          "round",
      })}
      interactive={false}
    />
  );
}


/* ============================================================
   DROPDOWN
============================================================ */

function FilterDropdown({
  label,
  value,
  placeholder,
  options,
  open,
  setOpen,
  onChange,
  disabled = false,
  renderOption,
}) {
  return (
    <div className="cm-filter-group">
      <div className="cm-filter-label">
        {label}
      </div>

      <button
        type="button"
        className={`cm-select ${
          disabled
            ? "cm-select-disabled"
            : ""
        }`}
        onClick={() => {
          if (disabled) {
            return;
          }

          setOpen(
            open
              ? null
              : label
          );
        }}
      >
        <span
          className={
            value
              ? "cm-select-value"
              : "cm-select-placeholder"
          }
        >
          {value ||
            placeholder}
        </span>

        {open ? (
          <ChevronUp
            size={16}
          />
        ) : (
          <ChevronDown
            size={16}
          />
        )}
      </button>

      {open &&
        !disabled && (
          <div className="cm-dropdown">
            {options.map(
              (
                option,
                index
              ) => {
                const optionValue =
                  typeof option ===
                  "string"
                    ? option
                    : option.value;

                const optionLabel =
                  typeof option ===
                  "string"
                    ? option
                    : option.label;

                const selectedOption =
                  optionValue ===
                  value;

                return (
                  <button
                    type="button"
                    key={`${optionValue}-${index}`}
                    className={`cm-dropdown-option ${
                      selectedOption
                        ? "cm-dropdown-option-active"
                        : ""
                    }`}
                    onClick={() => {
                      onChange(
                        option
                      );

                      setOpen(
                        null
                      );
                    }}
                  >
                    {renderOption
                      ? renderOption(
                          option,
                          index
                        )
                      : (
                        <span>
                          {optionLabel}
                        </span>
                      )}
                  </button>
                );
              }
            )}
          </div>
        )}
    </div>
  );
}


/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function CityMapOverview({
  cityId = DEFAULT_CITY_ID,
}) {
  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    city,
    setCity,
  ] = useState(null);

  const [
    zones,
    setZones,
  ] = useState([]);

  const [
    selectedZone,
    setSelectedZone,
  ] = useState(null);

  const [
    openDropdown,
    setOpenDropdown,
  ] = useState(null);

  const mapRef =
    useRef(null);


  /* ==========================================================
     FETCH CITY MAP DATA
  ========================================================== */

  const fetchCityMapData =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError("");

          const endpoint =
            CITY_MAP_ENDPOINT(
              cityId
            );

          console.log(
            "CITY MAP REQUEST:",
            endpoint
          );

          const response =
            await fetch(
              endpoint,
              {
                method: "GET",
                headers: {
                  Accept:
                    "application/json",
                },
              }
            );

          if (
            !response.ok
          ) {
            throw new Error(
              `City map request failed with status ${response.status}`
            );
          }

          const result =
            await response.json();

          console.log(
            "CITY MAP RESPONSE:",
            result
          );

          if (
            result?.success ===
              false
          ) {
            throw new Error(
              result.message ||
                "Unable to fetch city map data."
            );
          }

          /*
           * Your backend response:
           *
           * {
           *   success: true,
           *   city: {
           *      id,
           *      cityName,
           *      geoBoundary,
           *      cityTableName
           *   },
           *   zones: [...]
           * }
           */

          const cityData =
            result?.city ||
            null;

          const zoneData =
            Array.isArray(
              result?.zones
            )
              ? result.zones
              : [];

          setCity(
            cityData
          );

          setZones(
            zoneData
          );

          /*
           * Start with all zones.
           */
          setSelectedZone(
            null
          );
        } catch (
          requestError
        ) {
          console.error(
            "CITY MAP ERROR:",
            requestError
          );

          setError(
            requestError?.message ||
              "Unable to load city map."
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      [cityId]
    );


  useEffect(() => {
    fetchCityMapData();
  }, [
    fetchCityMapData,
  ]);


  /* ==========================================================
     NORMALIZED CITY BOUNDARY
  ========================================================== */

  const cityBoundary =
    useMemo(() => {
      return normalizeGeoJSON(
        city?.geoBoundary ??
          city?.geo_boundary
      );
    }, [city]);


  /* ==========================================================
     SELECTED ZONE
  ========================================================== */

  const selectedZoneName =
    selectedZone
      ? getZoneName(
          selectedZone
        )
      : null;


  /* ==========================================================
     ZONE OPTIONS
  ========================================================== */

  const zoneOptions =
    useMemo(() => {
      return [
        {
          value: "",
          label: "All Zones",
        },
        ...zones.map(
          (zone) => ({
            value:
              getZoneName(
                zone
              ),
            label:
              getZoneName(
                zone
              ),
            zone,
          })
        ),
      ];
    }, [zones]);


  /* ==========================================================
     VISIBLE ZONES
  ========================================================== */

  const visibleZones =
    useMemo(() => {
      if (
        !selectedZone
      ) {
        return zones;
      }

      return zones.filter(
        (zone) =>
          getZoneName(
            zone
          ) ===
          selectedZoneName
      );
    }, [
      zones,
      selectedZone,
      selectedZoneName,
    ]);


  /* ==========================================================
     SELECT ZONE
  ========================================================== */

  const handleZoneSelect =
    useCallback(
      (zone) => {
        setSelectedZone(
          zone
        );
      },
      []
    );


  /* ==========================================================
     MAP CENTER
  ========================================================== */

  const initialCenter =
    [
      12.9716,
      77.5946,
    ];


  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <section className="cm-wrapper">
      <style>{`
        .cm-wrapper {
          width: 100%;
          background: #ffffff;
          border: 1px solid #dce4ec;
          border-radius: 20px;
          padding: 24px;
          box-sizing: border-box;
          box-shadow: 0 4px 18px rgba(31, 45, 61, 0.05);
        }

        .cm-heading {
          margin: 0 0 18px 4px;
          font-size: 25px;
          line-height: 1.15;
          font-weight: 700;
          letter-spacing: -0.5px;
          color: #07111f;
        }

        .cm-map-shell {
          position: relative;
          width: 100%;
          height: 780px;
          min-height: 620px;
          overflow: hidden;
          border-radius: 18px;
          border: 1px solid #d7e0e9;
          background: #f3f5f6;
        }

        .cm-map {
          width: 100%;
          height: 100%;
        }

        .cm-map .leaflet-tile-pane {
          filter: saturate(0.45) brightness(1.04);
        }

        .cm-map .leaflet-control-zoom {
          margin-top: 14px;
          margin-left: 14px;
          border: 1px solid #d8e1ea;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 3px 12px rgba(36, 53, 72, 0.08);
        }

        .cm-map .leaflet-control-zoom a {
          width: 32px;
          height: 32px;
          line-height: 32px;
          font-size: 18px;
          color: #34475b;
          background: #ffffff;
        }

        .cm-map .leaflet-control-zoom a:hover {
          background: #f5f8fb;
        }

        .cm-map .leaflet-control-attribution {
          font-size: 10px;
          background: rgba(255,255,255,0.82);
        }

        /* ====================================================
           TOP MAP HEADER
        ==================================================== */

        .cm-map-header {
          position: absolute;
          z-index: 1000;
          top: 28px;
          left: 28px;
          width: 500px;
          min-height: 104px;
          padding: 20px 24px;
          box-sizing: border-box;
          border-radius: 16px;
          background: rgba(255,255,255,0.97);
          border: 1px solid #e0e7ef;
          box-shadow: 0 7px 24px rgba(32, 48, 65, 0.10);
          display: flex;
          align-items: center;
          justify-content: space-between;
          pointer-events: none;
        }

        .cm-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
          min-width: 0;
        }

        .cm-header-icon {
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          color: #587089;
        }

        .cm-header-title {
          font-size: 23px;
          line-height: 1.15;
          font-weight: 700;
          color: #34475b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cm-header-city {
          margin-top: 6px;
          font-size: 14px;
          font-weight: 600;
          color: #8aa0b8;
        }

        .cm-header-chevron {
          color: #34475b;
          flex: 0 0 auto;
        }

        /* ====================================================
           FILTER CARD
        ==================================================== */

        .cm-filter-card {
          position: absolute;
          z-index: 1000;
          top: 28px;
          right: 28px;
          width: 360px;
          padding: 22px;
          box-sizing: border-box;
          border-radius: 16px;
          background: rgba(255,255,255,0.98);
          border: 1px solid #dfe7ef;
          box-shadow: 0 8px 26px rgba(32, 48, 65, 0.10);
        }

        .cm-filter-title {
          margin-bottom: 20px;
          font-size: 18px;
          font-weight: 700;
          color: #34475b;
        }

        .cm-filter-group {
          position: relative;
          margin-bottom: 18px;
        }

        .cm-filter-group:last-child {
          margin-bottom: 0;
        }

        .cm-filter-label {
          margin-bottom: 8px;
          font-size: 13px;
          line-height: 1;
          font-weight: 700;
          color: #8ca2ba;
          letter-spacing: 0.15px;
          text-transform: uppercase;
        }

        .cm-select {
          width: 100%;
          min-height: 58px;
          padding: 0 15px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border: 1px solid #cbd9e7;
          border-radius: 13px;
          background: #ffffff;
          color: #40546b;
          font-family: inherit;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .cm-select:hover {
          border-color: #aebfd0;
        }

        .cm-select:focus {
          outline: none;
          border-color: #8fa9c1;
          box-shadow: 0 0 0 3px rgba(100, 130, 160, 0.10);
        }

        .cm-select-disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .cm-select-value,
        .cm-select-placeholder {
          min-width: 0;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: left;
        }

        .cm-select-placeholder {
          color: #40546b;
        }

        .cm-dropdown {
          position: absolute;
          z-index: 1100;
          top: calc(100% + 7px);
          left: 0;
          right: 0;
          max-height: 290px;
          overflow-y: auto;
          padding: 5px;
          border: 1px solid #d9e3ec;
          border-radius: 13px;
          background: #ffffff;
          box-shadow: 0 12px 28px rgba(31, 45, 61, 0.13);
        }

        .cm-dropdown-option {
          width: 100%;
          min-height: 42px;
          padding: 9px 10px;
          border: 0;
          border-radius: 9px;
          background: transparent;
          display: flex;
          align-items: center;
          gap: 10px;
          text-align: left;
          font-family: inherit;
          font-size: 13px;
          line-height: 1.3;
          font-weight: 500;
          color: #435871;
          cursor: pointer;
        }

        .cm-dropdown-option:hover {
          background: #f2f6fa;
        }

        .cm-dropdown-option-active {
          background: #edf4f9;
          color: #263f58;
          font-weight: 700;
        }

        .cm-zone-dot {
          width: 11px;
          height: 11px;
          flex: 0 0 11px;
          border-radius: 50%;
          border: 1px solid rgba(44, 63, 82, 0.35);
        }

        .cm-zone-option-name {
          min-width: 0;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        /* ====================================================
           SELECTED ZONE INFO
        ==================================================== */

        .cm-selected-card {
          position: absolute;
          z-index: 1000;
          left: 28px;
          bottom: 28px;
          width: 350px;
          padding: 17px 20px;
          box-sizing: border-box;
          border-radius: 15px;
          background: rgba(255,255,255,0.97);
          border: 1px solid #dce5ed;
          box-shadow: 0 8px 24px rgba(31, 45, 61, 0.10);
        }

        .cm-selected-label {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 7px;
          font-size: 12px;
          font-weight: 700;
          color: #8aa0b8;
          text-transform: uppercase;
        }

        .cm-selected-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 1px solid #647d95;
        }

        .cm-selected-name {
          font-size: 16px;
          line-height: 1.3;
          font-weight: 700;
          color: #34475b;
        }

        .cm-selected-table {
          margin-top: 6px;
          font-size: 12px;
          color: #8ca2ba;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* ====================================================
           LOADING / ERROR
        ==================================================== */

        .cm-state {
          position: absolute;
          z-index: 1200;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .cm-state-card {
          padding: 13px 18px;
          border-radius: 11px;
          background: rgba(255,255,255,0.96);
          border: 1px solid #dce5ed;
          box-shadow: 0 8px 24px rgba(31,45,61,0.10);
          color: #50647a;
          font-size: 13px;
          font-weight: 600;
        }

        .cm-error-card {
          color: #9b3e3e;
          max-width: 420px;
          text-align: center;
        }

        /* ====================================================
           RESPONSIVE
        ==================================================== */

        @media (max-width: 1100px) {
          .cm-map-header {
            width: 430px;
          }

          .cm-filter-card {
            width: 320px;
          }
        }

        @media (max-width: 800px) {
          .cm-wrapper {
            padding: 14px;
            border-radius: 14px;
          }

          .cm-heading {
            font-size: 21px;
            margin-bottom: 14px;
          }

          .cm-map-shell {
            height: 680px;
            min-height: 600px;
          }

          .cm-map-header {
            top: 16px;
            left: 16px;
            right: 16px;
            width: auto;
            min-height: 80px;
            padding: 15px 17px;
          }

          .cm-header-title {
            font-size: 18px;
          }

          .cm-header-city {
            font-size: 12px;
          }

          .cm-filter-card {
            top: auto;
            right: 16px;
            left: 16px;
            bottom: 16px;
            width: auto;
            max-height: 320px;
            overflow-y: auto;
          }

          .cm-selected-card {
            display: none;
          }
        }
      `}</style>


      {/* ======================================================
          HEADING
      ====================================================== */}

      <h2 className="cm-heading">
        CITY OVERVIEW MAP
      </h2>


      {/* ======================================================
          MAP
      ====================================================== */}

      <div className="cm-map-shell">

        <MapContainer
          ref={mapRef}
          center={
            initialCenter
          }
          zoom={10}
          zoomControl={false}
          className="cm-map"
          preferCanvas={false}
        >

          {/* ==================================================
              GREY MAP
          ================================================== */}

          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap contributors &copy; CARTO'
            subdomains={[
              "a",
              "b",
              "c",
              "d",
            ]}
            maxZoom={20}
          />


          {/* ==================================================
              ZOOM
          ================================================== */}

          <ZoomControl
            position="topleft"
          />


          {/* ==================================================
              FIT CITY
          ================================================== */}

          <MapBoundsController
            cityBoundary={
              cityBoundary
            }
            zones={zones}
          />


          {/* ==================================================
              ZONES
          ================================================== */}

          {visibleZones.map(
            (
              zone,
              index
            ) => (
              <ZoneLayer
                key={`zone-layer-${getZoneName(
                  zone
                )}-${index}`}
                zone={zone}
                index={
                  zones.indexOf(
                    zone
                  )
                }
                selected={
                  !!selectedZone &&
                  getZoneName(
                    selectedZone
                  ) ===
                    getZoneName(
                      zone
                    )
                }
                onSelect={
                  handleZoneSelect
                }
              />
            )
          )}


          {/* ==================================================
              CITY OUTLINE

              IMPORTANT:
              This is deliberately rendered AFTER
              zones so the city border remains visible.
          ================================================== */}

          <CityBoundaryLayer
            boundary={
              cityBoundary
            }
          />

        </MapContainer>


        {/* ====================================================
            TOP HEADER
        ==================================================== */}

        <div className="cm-map-header">

          <div className="cm-header-left">

            <MapIcon
              className="cm-header-icon"
              strokeWidth={1.8}
            />

            <div>
              <div className="cm-header-title">
                City Overview Map
              </div>

              {city?.cityName && (
                <div className="cm-header-city">
                  {city.cityName}
                </div>
              )}
            </div>

          </div>

          <ChevronDown
            className="cm-header-chevron"
            size={20}
          />

        </div>


        {/* ====================================================
            FILTER CARD
        ==================================================== */}

        <div className="cm-filter-card">

          <div className="cm-filter-title">
            MAP FILTERS
          </div>


          {/* ==================================================
              ZONE
          ================================================== */}

          <FilterDropdown
            label="ZONE"
            value={
              selectedZoneName ||
              ""
            }
            placeholder="All Zones"
            options={
              zoneOptions
            }
            open={
              openDropdown ===
              "ZONE"
            }
            setOpen={
              setOpenDropdown
            }
            onChange={(
              option
            ) => {
              if (
                !option?.value
              ) {
                setSelectedZone(
                  null
                );

                return;
              }

              setSelectedZone(
                option.zone ||
                  null
              );
            }}
            renderOption={(
              option,
              index
            ) => {
              if (
                !option.value
              ) {
                return (
                  <span>
                    All Zones
                  </span>
                );
              }

              const zoneIndex =
                zones.findIndex(
                  (zone) =>
                    getZoneName(
                      zone
                    ) ===
                    option.value
                );

              const color =
                ZONE_COLORS[
                  (zoneIndex >=
                  0
                    ? zoneIndex
                    : index) %
                    ZONE_COLORS.length
                ];

              return (
                <>
                  <span
                    className="cm-zone-dot"
                    style={{
                      backgroundColor:
                        color,
                    }}
                  />

                  <span className="cm-zone-option-name">
                    {
                      option.label
                    }
                  </span>
                </>
              );
            }}
          />


          {/* ==================================================
              DIVISION

              Kept ready for the next integration.
          ================================================== */}

          <FilterDropdown
            label="DIVISION"
            value=""
            placeholder="All Divisions"
            options={[
              {
                value: "",
                label:
                  "All Divisions",
              },
            ]}
            open={
              openDropdown ===
              "DIVISION"
            }
            setOpen={
              setOpenDropdown
            }
            onChange={() => {}}
          />


          {/* ==================================================
              WARD

              Kept ready for the next integration.
          ================================================== */}

          <FilterDropdown
            label="WARD"
            value=""
            placeholder="All Wards"
            options={[
              {
                value: "",
                label:
                  "All Wards",
              },
            ]}
            open={
              openDropdown ===
              "WARD"
            }
            setOpen={
              setOpenDropdown
            }
            onChange={() => {}}
          />

        </div>


        {/* ====================================================
            SELECTED ZONE INFORMATION
        ==================================================== */}

        {selectedZone && (
          <div className="cm-selected-card">

            <div className="cm-selected-label">

              <span
                className="cm-selected-dot"
                style={{
                  backgroundColor:
                    ZONE_COLORS[
                      zones.indexOf(
                        selectedZone
                      ) %
                        ZONE_COLORS.length
                    ],
                }}
              />

              SELECTED ZONE

            </div>

            <div className="cm-selected-name">
              {
                getZoneName(
                  selectedZone
                )
              }
            </div>

            {getZoneTableName(
              selectedZone
            ) && (
              <div className="cm-selected-table">
                {
                  getZoneTableName(
                    selectedZone
                  )
                }
              </div>
            )}

          </div>
        )}


        {/* ====================================================
            LOADING
        ==================================================== */}

        {loading && (
          <div className="cm-state">
            <div className="cm-state-card">
              Loading city boundaries...
            </div>
          </div>
        )}


        {/* ====================================================
            ERROR
        ==================================================== */}

        {!loading &&
          error && (
            <div className="cm-state">
              <div className="cm-state-card cm-error-card">
                {error}
              </div>
            </div>
          )}

      </div>
    </section>
  );
}