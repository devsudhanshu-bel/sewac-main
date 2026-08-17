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
  Pane,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import { ChevronDown, ChevronUp, Map as MapIcon } from "lucide-react";

import { useFilters } from "../../contexts/FilterContext";

import "leaflet/dist/leaflet.css";

/* ============================================================
   CONFIG
============================================================ */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://sewac-main.onrender.com";

const DEFAULT_CITY_ID = 1;

const CITY_MAP_ENDPOINT = (cityId) =>
  `${API_BASE_URL}/api/master-citizen/map/city/${cityId}`;

/* ============================================================
   ZONE COLORS
============================================================ */

const ZONE_COLORS = [
  "#60A5FA",
  "#A78BFA",
  "#34D399",
  "#FBBF24",
  "#F472B6",
  "#22D3EE",
  "#FB923C",
  "#818CF8",
  "#4ADE80",
  "#FB7185",
];

/* ============================================================
   HELPERS
============================================================ */

/*
 * Parse JSON/JSONB values safely.
 */
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
    } catch (error) {
      console.warn("Unable to parse GeoJSON:", error);

      return null;
    }
  }

  return null;
}

/*
 * Check whether a value is:
 *
 * [number, number]
 */
function isCoordinatePair(value) {
  return (
    Array.isArray(value) &&
    value.length >= 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number"
  );
}

/*
 * Swap:
 *
 * [latitude, longitude]
 *
 * into:
 *
 * [longitude, latitude]
 */
function swapCoordinatePair(coordinate) {
  if (!isCoordinatePair(coordinate)) {
    return coordinate;
  }

  return [coordinate[1], coordinate[0]];
}

/*
 * Recursively swap coordinates.
 */
function swapCoordinatesDeep(value) {
  if (isCoordinatePair(value)) {
    return swapCoordinatePair(value);
  }

  if (Array.isArray(value)) {
    return value.map(swapCoordinatesDeep);
  }

  return value;
}

/*
 * Normalize geometry.
 */
function normalizeGeometry(geometry, swapCoordinates = false) {
  if (!geometry) {
    return null;
  }

  /*
   * GeometryCollection
   */
  if (geometry.type === "GeometryCollection") {
    return {
      ...geometry,

      geometries: Array.isArray(geometry.geometries)
        ? geometry.geometries.map((item) =>
            normalizeGeometry(item, swapCoordinates),
          )
        : [],
    };
  }

  /*
   * Normal geometry.
   */
  if (Array.isArray(geometry.coordinates)) {
    return {
      ...geometry,

      coordinates: swapCoordinates
        ? swapCoordinatesDeep(geometry.coordinates)
        : geometry.coordinates,
    };
  }

  return geometry;
}

/*
 * Normalize arbitrary GeoJSON.
 *
 * Supports:
 *
 * FeatureCollection
 * Feature
 * Polygon
 * MultiPolygon
 * LineString
 * MultiLineString
 * Point
 * MultiPoint
 * GeometryCollection
 */
function normalizeGeoJSON(value, swapCoordinates = false) {
  const parsed = parseGeoJSON(value);

  if (!parsed) {
    return null;
  }

  /*
   * FeatureCollection
   */
  if (parsed.type === "FeatureCollection") {
    return {
      ...parsed,

      features: Array.isArray(parsed.features)
        ? parsed.features.map((feature) => ({
            ...feature,

            geometry: normalizeGeometry(feature.geometry, swapCoordinates),
          }))
        : [],
    };
  }

  /*
   * Feature
   */
  if (parsed.type === "Feature") {
    return {
      ...parsed,

      geometry: normalizeGeometry(parsed.geometry, swapCoordinates),
    };
  }

  /*
   * Raw geometry.
   */
  if (
    [
      "Point",
      "MultiPoint",
      "LineString",
      "MultiLineString",
      "Polygon",
      "MultiPolygon",
      "GeometryCollection",
    ].includes(parsed.type)
  ) {
    return {
      type: "Feature",

      properties: parsed.properties || {},

      geometry: normalizeGeometry(parsed, swapCoordinates),
    };
  }

  /*
   * Object containing geometry.
   */
  if (parsed.geometry && typeof parsed.geometry === "object") {
    return {
      type: "Feature",

      properties: parsed.properties || {},

      geometry: normalizeGeometry(parsed.geometry, swapCoordinates),
    };
  }

  return null;
}

/*
 * Calculate Leaflet bounds.
 */
function getGeoJSONBounds(geoJSON) {
  try {
    if (!geoJSON) {
      return null;
    }

    const layer = L.geoJSON(geoJSON);

    const bounds = layer.getBounds();

    if (bounds && bounds.isValid()) {
      return bounds;
    }

    return null;
  } catch (error) {
    console.warn("Unable to calculate GeoJSON bounds:", error);

    return null;
  }
}

/* ============================================================
   ZONE HELPERS
============================================================ */

function getZoneName(zone) {
  if (typeof zone === "string") {
    return zone;
  }

  return zone?.zoneName || zone?.zone_name || zone?.name || "Unnamed Zone";
}

function getZoneId(zone) {
  if (!zone) {
    return null;
  }

  return zone?.id ?? zone?.zoneId ?? zone?.zone_id ?? null;
}

function getZoneBoundary(zone) {
  if (!zone || typeof zone === "string") {
    return null;
  }

  const rawBoundary =
    zone.geoBoundary ??
    zone.geo_boundary ??
    zone.geometry ??
    zone.boundary ??
    null;

  /*
   * Your zone data is currently stored as:
   *
   * [latitude, longitude]
   *
   * Leaflet GeoJSON requires:
   *
   * [longitude, latitude]
   */
  return normalizeGeoJSON(rawBoundary, true);
}

function getZoneTableName(zone) {
  if (!zone || typeof zone === "string") {
    return null;
  }

  return zone.zoneTableName || zone.zone_table_name || null;
}

/* ============================================================
   WARD HELPERS
============================================================ */

function getWardId(ward) {
  if (!ward || typeof ward === "string") {
    return null;
  }

  return ward?.wardId ?? ward?.ward_id ?? ward?.id ?? null;
}

function getWardNo(ward) {
  if (ward === null || ward === undefined) {
    return null;
  }

  if (typeof ward === "object") {
    return (
      ward?.wardNo ??
      ward?.ward_no ??
      ward?.wardNumber ??
      ward?.ward_number ??
      null
    );
  }

  const match = String(ward).match(/\d+/);

  return match ? Number(match[0]) : null;
}

function getWardName(ward) {
  if (typeof ward === "string") {
    return ward;
  }

  return (
    ward?.wardName ||
    ward?.ward_name ||
    ward?.name ||
    `Ward ${getWardNo(ward) ?? ""}`
  );
}

/*
 * IMPORTANT:
 *
 * Ward boundaries are normalized in exactly the same way
 * as zone boundaries.
 *
 * Your Master Citizen hierarchy stores:
 *
 * ward_id
 * ward_no
 * ward_name
 * geo_boundary
 * ward_table_name
 */
function getWardBoundary(ward) {
  if (!ward || typeof ward === "string") {
    return null;
  }

  const rawBoundary =
    ward.geoBoundary ??
    ward.geo_boundary ??
    ward.geometry ??
    ward.boundary ??
    ward.wardBoundary ??
    ward.ward_boundary ??
    null;

  if (!rawBoundary) {
    return null;
  }

  /*
   * Ward boundaries use the same DB coordinate convention
   * as the zone boundaries:
   *
   * [latitude, longitude]
   */
  return normalizeGeoJSON(rawBoundary, true);
}

function getWardTableName(ward) {
  if (!ward || typeof ward === "string") {
    return null;
  }

  return ward.wardTableName || ward.ward_table_name || null;
}

/* ============================================================
   MAP SIZE CONTROLLER
============================================================ */

function MapSizeController() {
  const map = useMap();

  useEffect(() => {
    const timers = [
      setTimeout(() => {
        map.invalidateSize();
      }, 100),

      setTimeout(() => {
        map.invalidateSize();
      }, 500),

      setTimeout(() => {
        map.invalidateSize();
      }, 1000),
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
   INITIAL CITY BOUNDS
============================================================ */

function MapBoundsController({ cityBoundary, zones, selectedWard }) {
  const map = useMap();

  /*
   * Track whether the map has already performed its initial
   * city fit.
   */
  const initialFitDone = useRef(false);

  /*
   * Initial city fit.
   *
   * This happens only once for a loaded city.
   */
  useEffect(() => {
    if (initialFitDone.current) {
      return;
    }

    const cityBounds = getGeoJSONBounds(cityBoundary);

    if (cityBounds && cityBounds.isValid()) {
      map.fitBounds(cityBounds, {
        padding: [45, 45],

        maxZoom: 12,

        animate: false,
      });

      initialFitDone.current = true;

      return;
    }

    /*
     * Fallback to all zones.
     */
    const zoneBounds = zones
      .map((zone) => getGeoJSONBounds(getZoneBoundary(zone)))
      .filter(Boolean);

    if (zoneBounds.length === 0) {
      return;
    }

    let combinedBounds = null;

    zoneBounds.forEach((bounds) => {
      if (!combinedBounds) {
        combinedBounds = bounds;
      } else {
        combinedBounds.extend(bounds);
      }
    });

    if (combinedBounds && combinedBounds.isValid()) {
      map.fitBounds(combinedBounds, {
        padding: [45, 45],

        maxZoom: 12,

        animate: false,
      });

      initialFitDone.current = true;
    }
  }, [cityBoundary, zones, map]);

  /*
   * ==========================================================
   * WARD ZOOM
   * ==========================================================
   *
   * THIS IS THE IMPORTANT PART.
   *
   * Whenever the selected ward changes:
   *
   * 1. Read its geo boundary.
   * 2. Calculate Leaflet bounds.
   * 3. Smoothly fly to the ward.
   *
   * flyToBounds gives the smooth transition requested.
   */
  useEffect(() => {
    if (!selectedWard) {
      return;
    }

    const wardBoundary = getWardBoundary(selectedWard);

    if (!wardBoundary) {
      console.warn(
        "Selected ward does not contain a valid geo boundary:",
        selectedWard,
      );

      return;
    }

    const wardBounds = getGeoJSONBounds(wardBoundary);

    if (!wardBounds || !wardBounds.isValid()) {
      console.warn(
        "Unable to calculate bounds for selected ward:",
        selectedWard,
      );

      return;
    }

    /*
     * Small padding keeps the ward away from the map edges.
     */
    const paddedBounds = wardBounds.pad(0.08);

    /*
     * Smooth zoom.
     *
     * fitBounds is used instead of manually guessing a zoom
     * level because ward sizes can differ.
     */
    map.flyToBounds(paddedBounds, {
      paddingTopLeft: [35, 35],

      paddingBottomRight: [35, 35],

      maxZoom: 16,

      duration: 1.25,

      easeLinearity: 0.18,

      animate: true,
    });
  }, [selectedWard, map]);

  return null;
}

/* ============================================================
   ZONE LAYER
============================================================ */

function ZoneLayer({ zone, index, selected, onSelect }) {
  const boundary = useMemo(() => getZoneBoundary(zone), [zone]);

  if (!boundary) {
    console.warn("ZONE HAS NO VALID GEOBOUNDARY:", zone);

    return null;
  }

  const color = ZONE_COLORS[index % ZONE_COLORS.length];

  const zoneName = getZoneName(zone);

  const defaultStyle = {
    color: selected ? "#26364A" : "#53687D",

    weight: selected ? 3.5 : 1.8,

    opacity: 1,

    fillColor: color,

    fillOpacity: selected ? 0.58 : 0.34,

    lineJoin: "round",

    lineCap: "round",

    interactive: true,
  };

  const eventHandlers = {
    click: () => {
      onSelect(zone);
    },

    mouseover: (event) => {
      const layer = event.target;

      layer.setStyle({
        color: "#26364A",

        weight: 3.5,

        opacity: 1,

        fillColor: color,

        fillOpacity: 0.62,
      });

      if (layer.bringToFront) {
        layer.bringToFront();
      }
    },

    mouseout: (event) => {
      const layer = event.target;

      layer.setStyle(defaultStyle);
    },
  };

  return (
    <GeoJSON
      key={`zone-${getZoneId(zone) ?? zoneName}-${index}`}
      data={boundary}
      style={() => defaultStyle}
      eventHandlers={eventHandlers}
      bubblingMouseEvents={false}
    />
  );
}

/* ============================================================
   WARD LAYER
============================================================ */

function SelectedWardLayer({ ward }) {
  const boundary = useMemo(() => getWardBoundary(ward), [ward]);

  if (!boundary) {
    return null;
  }

  const wardName = getWardName(ward);

  const wardNo = getWardNo(ward);

  /*
   * Selected ward is intentionally stronger than zones.
   *
   * The user should immediately see which ward was selected.
   */
  return (
    <Pane
      name="selectedWardPane"
      style={{
        zIndex: 650,
      }}
    >
      <GeoJSON
        key={`selected-ward-${getWardId(ward) ?? wardNo ?? wardName}`}
        data={boundary}
        style={() => ({
          color: "#172B3F",

          weight: 3.4,

          opacity: 1,

          fillColor: "#7DD3FC",

          fillOpacity: 0.48,

          lineJoin: "round",

          lineCap: "round",

          interactive: false,
        })}
      />
    </Pane>
  );
}

/* ============================================================
   CITY BOUNDARY
============================================================ */

function CityBoundaryLayer({ boundary }) {
  if (!boundary) {
    return null;
  }

  return (
    <GeoJSON
      data={boundary}
      style={() => ({
        color: "#34475B",

        weight: 3.8,

        opacity: 1,

        fillColor: "transparent",

        fillOpacity: 0,

        lineJoin: "round",

        lineCap: "round",
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
      <div className="cm-filter-label">{label}</div>

      <button
        type="button"
        className={`cm-select ${disabled ? "cm-select-disabled" : ""}`}
        onClick={() => {
          if (disabled) {
            return;
          }

          setOpen(open ? null : label);
        }}
      >
        <span className={value ? "cm-select-value" : "cm-select-placeholder"}>
          {value || placeholder}
        </span>

        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>

      {open && !disabled && (
        <div className="cm-dropdown">
          {options.map((option, index) => {
            const optionValue =
              typeof option === "string" ? option : option.value;

            const optionLabel =
              typeof option === "string" ? option : option.label;

            const selectedOption = optionValue === value;

            return (
              <button
                type="button"
                key={`${optionValue}-${index}`}
                className={`cm-dropdown-option ${
                  selectedOption ? "cm-dropdown-option-active" : ""
                }`}
                onClick={() => {
                  onChange(option);

                  setOpen(null);
                }}
              >
                {renderOption ? (
                  renderOption(option, index)
                ) : (
                  <span>{optionLabel}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function CityMapOverview({ cityId = DEFAULT_CITY_ID }) {
  /*
   * ==========================================================
   * GLOBAL HEADER FILTERS
   * ==========================================================
   *
   * These come from the existing FilterContext.
   *
   * We are NOT creating another independent filter state.
   */
  const {
    selectedCity,
    selectedZone: globalSelectedZone,
    selectedDivision: globalSelectedDivision,
    selectedWard: globalSelectedWard,

    zones,
  } = useFilters();

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [city, setCity] = useState(null);

  const [mapZones, setMapZones] = useState([]);

  const [localSelectedZone, setLocalSelectedZone] = useState(null);

  const [openDropdown, setOpenDropdown] = useState(null);

  const mapRef = useRef(null);

  /* ==========================================================
     RESOLVE CITY ID
  ========================================================== */

  const resolvedCityId = useMemo(() => {
    /*
     * Prefer explicit prop.
     */
    if (cityId !== undefined && cityId !== null) {
      return cityId;
    }

    /*
     * Otherwise use global city.
     */
    return (
      selectedCity?.city_id ??
      selectedCity?.cityId ??
      selectedCity?.id ??
      DEFAULT_CITY_ID
    );
  }, [cityId, selectedCity]);

  /* ==========================================================
     FETCH CITY MAP
  ========================================================== */

  const fetchCityMapData = useCallback(async () => {
    try {
      setLoading(true);

      setError("");

      const endpoint = CITY_MAP_ENDPOINT(resolvedCityId);

      console.log("==========================================");

      console.log("🗺️ CITY MAP REQUEST");

      console.log("CITY ID:", resolvedCityId);

      console.log("ENDPOINT:", endpoint);

      console.log("==========================================");

      const response = await fetch(endpoint, {
        method: "GET",

        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `City map request failed with status ${response.status}`,
        );
      }

      const result = await response.json();

      console.log("CITY MAP RESPONSE:", result);

      if (result?.success === false) {
        throw new Error(result.message || "Unable to fetch city map data.");
      }

      const cityData = result?.city || null;

      const zoneData = Array.isArray(result?.zones) ? result.zones : [];

      console.log("CITY:", cityData);

      console.log("TOTAL ZONES:", zoneData.length);

      zoneData.forEach((zone, index) => {
        console.log(`ZONE ${index + 1}:`, getZoneName(zone));

        console.log("ZONE TABLE:", getZoneTableName(zone));

        console.log("RAW ZONE BOUNDARY:", zone?.geoBoundary);

        console.log("NORMALIZED ZONE BOUNDARY:", getZoneBoundary(zone));
      });

      setCity(cityData);

      setMapZones(zoneData);

      /*
       * Do not retain an old local zone when city changes.
       */
      setLocalSelectedZone(null);
    } catch (requestError) {
      console.error("CITY MAP ERROR:", requestError);

      setError(requestError?.message || "Unable to load city map.");
    } finally {
      setLoading(false);
    }
  }, [resolvedCityId]);

  useEffect(() => {
    fetchCityMapData();
  }, [fetchCityMapData]);

  /* ==========================================================
     CITY BOUNDARY
  ========================================================== */

  const cityBoundary = useMemo(() => {
    /*
     * City boundary is already proper GeoJSON:
     *
     * [longitude, latitude]
     *
     * Therefore DO NOT swap it.
     */

    return normalizeGeoJSON(city?.geoBoundary ?? city?.geo_boundary, false);
  }, [city]);

  /* ==========================================================
     SELECTED ZONE
  ========================================================== */

  /*
   * Prefer the global Header zone.
   *
   * If it exists, use it.
   *
   * Otherwise use the local map selection.
   */
  const selectedZone = globalSelectedZone || localSelectedZone || null;

  const selectedZoneName = selectedZone ? getZoneName(selectedZone) : null;

  /* ==========================================================
     ZONE OPTIONS
  ========================================================== */

  const zoneOptions = useMemo(() => {
    /*
     * Prefer zones already available from global
     * FilterContext.
     *
     * Fall back to the map endpoint's zones.
     */
    const sourceZones =
      Array.isArray(mapZones) && mapZones.length
        ? mapZones
        : Array.isArray(zones)
          ? zones
          : [];

    return [
      {
        value: "",
        label: "All Zones",
      },

      ...sourceZones.map((zone) => ({
        value: getZoneName(zone),

        label: getZoneName(zone),

        zone,
      })),
    ];
  }, [mapZones, zones]);

  /* ==========================================================
     VISIBLE ZONES
  ========================================================== */

  const visibleZones = useMemo(() => {
    /*
     * No zone selected:
     *
     * Show every zone.
     */
    if (!selectedZone) {
      return mapZones;
    }

    const selectedId = getZoneId(selectedZone);

    const selectedName = getZoneName(selectedZone);

    return mapZones.filter((zone) => {
      const zoneId = getZoneId(zone);

      const zoneName = getZoneName(zone);

      if (
        selectedId !== null &&
        selectedId !== undefined &&
        zoneId !== null &&
        zoneId !== undefined
      ) {
        return String(zoneId) === String(selectedId);
      }

      return zoneName === selectedName;
    });
  }, [mapZones, selectedZone]);

  /* ==========================================================
     SELECT ZONE
  ========================================================== */

  const handleZoneSelect = useCallback((zone) => {
    setLocalSelectedZone(zone);
  }, []);

  /* ==========================================================
     SELECTED WARD
  ========================================================== */

  /*
   * The Header's selectedWard is the actual source.
   *
   * This can be:
   *
   * {
   *   ward_id,
   *   ward_no,
   *   ward_name,
   *   geo_boundary,
   *   ward_table_name
   * }
   *
   * OR another naming convention from the API.
   */
  const selectedWard = useMemo(() => {
    if (!globalSelectedWard) {
      return null;
    }

    /*
     * "All Wards" should mean:
     *
     * no selected ward.
     */
    if (
      typeof globalSelectedWard === "string" &&
      globalSelectedWard.trim().toLowerCase() === "all wards"
    ) {
      return null;
    }

    return globalSelectedWard;
  }, [globalSelectedWard]);

  /* ==========================================================
     SELECTED WARD DEBUG
  ========================================================== */

  useEffect(() => {
    if (!selectedWard) {
      console.log("🗺️ CITY MAP: ALL WARDS");

      return;
    }

    console.log("==========================================");

    console.log("🗺️ SELECTED WARD");

    console.log("WARD ID:", getWardId(selectedWard));

    console.log("WARD NO:", getWardNo(selectedWard));

    console.log("WARD NAME:", getWardName(selectedWard));

    console.log("WARD TABLE:", getWardTableName(selectedWard));

    console.log(
      "RAW WARD BOUNDARY:",
      selectedWard?.geoBoundary ??
        selectedWard?.geo_boundary ??
        selectedWard?.geometry ??
        selectedWard?.boundary,
    );

    console.log("NORMALIZED WARD BOUNDARY:", getWardBoundary(selectedWard));

    console.log("==========================================");
  }, [selectedWard]);

  /* ==========================================================
     INITIAL CENTER
  ========================================================== */

  const initialCenter = [12.9716, 77.5946];

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <section className="cm-wrapper">
      <style>{`

        /* ====================================================
           OUTER CARD
        ==================================================== */

        .cm-wrapper {
          width: 100%;
          background: #ffffff;
          border: 1px solid #dce4ec;
          border-radius: 18px;
          padding: 16px;
          box-sizing: border-box;
          box-shadow:
            0 4px 18px
            rgba(31, 45, 61, 0.05);
        }


        /* ====================================================
           TITLE
        ==================================================== */

        .cm-heading {
          margin:
            0
            0
            14px
            2px;

          font-size: 21px;
          line-height: 1.15;
          font-weight: 700;
          letter-spacing: -0.35px;
          color: #07111f;
        }


        /* ====================================================
           MAP SHELL
        ==================================================== */

        .cm-map-shell {
          position: relative;
          width: 100%;
          height: 700px;
          min-height: 580px;
          overflow: hidden;
          border-radius: 17px;
          border: 1px solid #d7e0e9;
          background: #f3f5f6;
        }


        .cm-map {
          width: 100%;
          height: 100%;
        }


        /* ====================================================
           GREY BASE MAP
        ==================================================== */

        .cm-map
        .leaflet-tile-pane {
          filter:
            saturate(0.42)
            brightness(1.05);
        }


        /* ====================================================
           ZOOM CONTROL
        ==================================================== */

        .cm-map
        .leaflet-control-zoom {
          margin-top: 12px;
          margin-left: 12px;
          border: 1px solid #d8e1ea;
          border-radius: 8px;
          overflow: hidden;
          box-shadow:
            0 3px 12px
            rgba(36, 53, 72, 0.08);
        }


        .cm-map
        .leaflet-control-zoom a {
          width: 30px;
          height: 30px;
          line-height: 30px;
          font-size: 17px;
          color: #34475b;
          background: #ffffff;
        }


        .cm-map
        .leaflet-control-zoom a:hover {
          background:
            #f5f8fb;
        }


        .cm-map
        .leaflet-control-attribution {
          font-size: 9px;
          background:
            rgba(
              255,
              255,
              255,
              0.82
            );
        }


        /* ====================================================
           TOP MAP HEADER
        ==================================================== */

        .cm-map-header {
          position: absolute;

          z-index: 1000;

          top: 18px;
          left: 18px;

          width: 500px;
          min-height: 68px;

          padding:
            12px
            16px;

          box-sizing: border-box;

          background:
            rgba(
              255,
              255,
              255,
              0.96
            );

          border:
            1px solid
            #dce5ed;

          border-radius:
            15px;

          box-shadow:
            0
            8px
            25px
            rgba(
              31,
              45,
              61,
              0.10
            );

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;
        }


        .cm-header-left {
          display:
            flex;

          align-items:
            center;

          gap:
            12px;
        }


        .cm-header-icon {
          width: 25px;
          height: 25px;
          color: #58718a;
        }


        .cm-header-title {
          font-size: 17px;
          line-height: 1.15;
          font-weight: 700;
          color: #34475b;
        }


        .cm-header-city {
          margin-top: 3px;
          font-size: 10px;
          font-weight: 600;
          color: #8aa0b6;
        }


        .cm-header-chevron {
          color: #34475b;
        }


        /* ====================================================
           FILTER CARD
        ==================================================== */

        .cm-filter-card {
          position: absolute;

          z-index: 1000;

          top: 18px;
          right: 18px;

          width: 320px;

          padding:
            16px;

          box-sizing: border-box;

          background:
            rgba(
              255,
              255,
              255,
              0.97
            );

          border:
            1px solid
            #dce5ed;

          border-radius:
            17px;

          box-shadow:
            0
            8px
            25px
            rgba(
              31,
              45,
              61,
              0.10
            );
        }


        .cm-filter-title {
          margin-bottom: 12px;

          font-size: 14px;
          font-weight: 700;

          color:
            #34475b;
        }


        .cm-filter-group {
          position: relative;

          margin-bottom: 12px;
        }


        .cm-filter-group:last-child {
          margin-bottom: 0;
        }


        .cm-filter-label {
          margin-bottom: 6px;

          font-size: 10px;
          line-height: 1;

          font-weight: 700;

          letter-spacing:
            0.35px;

          color:
            #8aa0b6;
        }


        .cm-select {
          width: 100%;
          height: 43px;

          padding:
            0
            12px;

          border:
            1px solid
            #d7e2ec;

          border-radius:
            11px;

          background:
            #ffffff;

          color:
            #465d75;

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          font-size:
            12px;

          font-weight:
            600;

          cursor:
            pointer;

          transition:
            all
            180ms
            ease;
        }


        .cm-select:hover {
          border-color:
            #aebfd0;
        }


        .cm-select-value {
          overflow:
            hidden;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;

          max-width:
            250px;
        }


        .cm-select-placeholder {
          color:
            #465d75;
        }


        .cm-select-disabled {
          opacity:
            0.55;

          cursor:
            not-allowed;
        }


        /* ====================================================
           DROPDOWN
        ==================================================== */

        .cm-dropdown {
          position: absolute;

          z-index: 5000;

          top:
            calc(
              100%
              +
              5px
            );

          left: 0;

          width: 100%;

          max-height:
            235px;

          overflow-y:
            auto;

          padding:
            4px;

          box-sizing:
            border-box;

          background:
            #ffffff;

          border:
            1px solid
            #dce5ed;

          border-radius:
            11px;

          box-shadow:
            0
            12px
            28px
            rgba(
              31,
              45,
              61,
              0.14
            );
        }


        .cm-dropdown-option {
          width: 100%;

          min-height:
            37px;

          padding:
            7px
            9px;

          border: 0;

          border-radius:
            8px;

          background:
            #ffffff;

          color:
            #465d75;

          display:
            flex;

          align-items:
            center;

          gap:
            8px;

          text-align:
            left;

          font-size:
            11px;

          font-weight:
            500;

          cursor:
            pointer;
        }


        .cm-dropdown-option:hover {
          background:
            #f4f7fa;
        }


        .cm-dropdown-option-active {
          background:
            #eef4f8;

          font-weight:
            700;

          color:
            #263b50;
        }


        .cm-zone-dot {
          width:
            9px;

          height:
            9px;

          min-width:
            9px;

          border-radius:
            50%;

          border:
            1px solid
            rgba(
              36,
              53,
              72,
              0.25
            );
        }


        .cm-zone-option-name {
          overflow:
            hidden;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;
        }


        /* ====================================================
           SELECTED WARD CARD
        ==================================================== */

        .cm-selected-card {
          position: absolute;

          z-index: 1000;

          left: 18px;
          bottom: 18px;

          width:
            280px;

          padding:
            13px
            15px;

          box-sizing:
            border-box;

          background:
            rgba(
              255,
              255,
              255,
              0.96
            );

          border:
            1px solid
            #dce5ed;

          border-radius:
            14px;

          box-shadow:
            0
            8px
            24px
            rgba(
              31,
              45,
              61,
              0.10
            );
        }


        .cm-selected-label {
          display:
            flex;

          align-items:
            center;

          gap:
            7px;

          font-size:
            10px;

          font-weight:
            700;

          letter-spacing:
            0.35px;

          color:
            #8aa0b6;
        }


        .cm-selected-dot {
          width:
            9px;

          height:
            9px;

          border-radius:
            50%;

          border:
            1px solid
            rgba(
              36,
              53,
              72,
              0.25
            );
        }


        .cm-selected-name {
          margin-top:
            5px;

          font-size:
            13px;

          font-weight:
            700;

          line-height:
            1.25;

          color:
            #34475b;
        }


        .cm-selected-table {
          margin-top:
            4px;

          overflow:
            hidden;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;

          font-size:
            9px;

          color:
            #8aa0b6;
        }


        /* ====================================================
           STATE
        ==================================================== */

        .cm-state {
          position:
            absolute;

          z-index:
            1200;

          inset:
            0;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          pointer-events:
            none;
        }


        .cm-state-card {
          padding:
            9px
            14px;

          border-radius:
            10px;

          background:
            rgba(
              255,
              255,
              255,
              0.96
            );

          border:
            1px solid
            #dce5ed;

          box-shadow:
            0
            7px
            20px
            rgba(
              31,
              45,
              61,
              0.10
            );

          color:
            #50647a;

          font-size:
            11px;

          font-weight:
            600;
        }


        .cm-error-card {
          color:
            #9b3e3e;

          max-width:
            400px;

          text-align:
            center;
        }


        /* ====================================================
           RESPONSIVE
        ==================================================== */

        @media (
          max-width: 1100px
        ) {

          .cm-map-header {
            width:
              390px;
          }

          .cm-filter-card {
            width:
              285px;
          }

        }


        @media (
          max-width: 800px
        ) {

          .cm-wrapper {
            padding:
              10px;

            border-radius:
              14px;
          }


          .cm-heading {
            font-size:
              18px;

            margin-bottom:
              10px;
          }


          .cm-map-shell {
            height:
              650px;

            min-height:
              550px;
          }


          .cm-map-header {
            top:
              10px;

            left:
              10px;

            right:
              10px;

            width:
              auto;

            min-height:
              62px;

            padding:
              10px
              12px;
          }


          .cm-header-title {
            font-size:
              15px;
          }


          .cm-header-city {
            font-size:
              10px;
          }


          .cm-filter-card {
            top:
              auto;

            right:
              10px;

            left:
              10px;

            bottom:
              10px;

            width:
              auto;

            max-height:
              270px;

            overflow-y:
              auto;
          }


          .cm-selected-card {
            display:
              none;
          }

        }

      `}</style>

      {/* ======================================================
          HEADING
      ====================================================== */}

      <h2 className="cm-heading">CITY OVERVIEW MAP</h2>

      {/* ======================================================
          MAP
      ====================================================== */}

      <div className="cm-map-shell">
        <MapContainer
          ref={mapRef}
          center={initialCenter}
          zoom={10}
          zoomControl={false}
          className="cm-map"
          preferCanvas={false}
        >
          {/* ==================================================
              GREY BASE MAP
          ================================================== */}

          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap contributors &copy; CARTO"
            subdomains={["a", "b", "c", "d"]}
            maxZoom={20}
          />

          {/* ==================================================
              MAP SIZE
          ================================================== */}

          <MapSizeController />

          {/* ==================================================
              ZOOM
          ================================================== */}

          <ZoomControl position="topleft" />

          {/* ==================================================
              MAP BOUNDS
          ================================================== */}

          <MapBoundsController
            cityBoundary={cityBoundary}
            zones={mapZones}
            selectedWard={selectedWard}
          />

          {/* ==================================================
              ZONE LAYERS
          ================================================== */}

          <Pane
            name="zonesPane"
            style={{
              zIndex: 400,
            }}
          >
            {visibleZones.map((zone, index) => {
              const zoneId = getZoneId(zone);

              const selectedId = getZoneId(selectedZone);

              const selected =
                !!selectedZone &&
                ((zoneId !== null &&
                  selectedId !== null &&
                  String(zoneId) === String(selectedId)) ||
                  getZoneName(zone) === getZoneName(selectedZone));

              return (
                <ZoneLayer
                  key={`zone-layer-${zoneId ?? getZoneName(zone)}-${index}`}
                  zone={zone}
                  index={mapZones.indexOf(zone)}
                  selected={selected}
                  onSelect={handleZoneSelect}
                />
              );
            })}
          </Pane>

          {/* ==================================================
              SELECTED WARD
              
              Render this AFTER zones.
              
              This makes the selected ward sit visibly above
              the colored zone.
          ================================================== */}

          {selectedWard && <SelectedWardLayer ward={selectedWard} />}

          {/* ==================================================
              CITY OUTLINE
              
              Keep the city outline above everything.
          ================================================== */}

          <Pane
            name="cityBoundaryPane"
            style={{
              zIndex: 700,
            }}
          >
            <CityBoundaryLayer boundary={cityBoundary} />
          </Pane>
        </MapContainer>

        {/* ====================================================
            TOP HEADER
        ==================================================== */}

        <div className="cm-map-header">
          <div className="cm-header-left">
            <MapIcon className="cm-header-icon" strokeWidth={1.8} />

            <div>
              <div className="cm-header-title">City Overview Map</div>

              {city?.cityName && (
                <div className="cm-header-city">{city.cityName}</div>
              )}
            </div>
          </div>

          <ChevronDown className="cm-header-chevron" size={18} />
        </div>

        {/* ====================================================
            FILTER CARD
        ==================================================== */}

        <div className="cm-filter-card">
          <div className="cm-filter-title">MAP FILTERS</div>

          {/* ==================================================
              ZONE
          ================================================== */}

          <FilterDropdown
            label="ZONE"
            value={selectedZoneName || ""}
            placeholder="All Zones"
            options={zoneOptions}
            open={openDropdown === "ZONE"}
            setOpen={setOpenDropdown}
            onChange={(option) => {
              if (!option?.value) {
                setLocalSelectedZone(null);

                return;
              }

              setLocalSelectedZone(option.zone || null);
            }}
            renderOption={(option, index) => {
              if (!option.value) {
                return <span>All Zones</span>;
              }

              const zoneIndex = mapZones.findIndex(
                (zone) => getZoneName(zone) === option.value,
              );

              const color =
                ZONE_COLORS[
                  (zoneIndex >= 0 ? zoneIndex : index) % ZONE_COLORS.length
                ];

              return (
                <>
                  <span
                    className="cm-zone-dot"
                    style={{
                      backgroundColor: color,
                    }}
                  />

                  <span className="cm-zone-option-name">{option.label}</span>
                </>
              );
            }}
          />

          {/* ==================================================
              DIVISION
              
              Division selection continues to come from the
              global Header filter context.
          ================================================== */}

          <FilterDropdown
            label="DIVISION"
            value={
              globalSelectedDivision
                ? globalSelectedDivision?.divisionName ||
                  globalSelectedDivision?.division_name ||
                  globalSelectedDivision?.name ||
                  String(globalSelectedDivision)
                : ""
            }
            placeholder="All Divisions"
            options={[
              {
                value: "",
                label: "All Divisions",
              },
            ]}
            open={openDropdown === "DIVISION"}
            setOpen={setOpenDropdown}
            onChange={() => {}}
            disabled={true}
          />

          {/* ==================================================
              WARD
              
              The actual ward is controlled by the global
              Header FilterContext.
          ================================================== */}

          <FilterDropdown
            label="WARD"
            value={selectedWard ? getWardName(selectedWard) : ""}
            placeholder="All Wards"
            options={[
              {
                value: "",
                label: "All Wards",
              },
            ]}
            open={openDropdown === "WARD"}
            setOpen={setOpenDropdown}
            onChange={() => {}}
            disabled={true}
          />
        </div>

        {/* ====================================================
            SELECTED WARD CARD
        ==================================================== */}

        {selectedWard && (
          <div className="cm-selected-card">
            <div className="cm-selected-label">
              <span
                className="cm-selected-dot"
                style={{
                  backgroundColor: "#7DD3FC",
                }}
              />
              SELECTED WARD
            </div>

            <div className="cm-selected-name">
              {getWardName(selectedWard)}

              {getWardNo(selectedWard) !== null && (
                <> ({getWardNo(selectedWard)})</>
              )}
            </div>

            {getWardTableName(selectedWard) && (
              <div className="cm-selected-table">
                {getWardTableName(selectedWard)}
              </div>
            )}
          </div>
        )}

        {/* ====================================================
            LOADING
        ==================================================== */}

        {loading && (
          <div className="cm-state">
            <div className="cm-state-card">Loading city boundaries...</div>
          </div>
        )}

        {/* ====================================================
            ERROR
        ==================================================== */}

        {!loading && error && (
          <div className="cm-state">
            <div
              className="
                cm-state-card
                cm-error-card
              "
            >
              {error}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
