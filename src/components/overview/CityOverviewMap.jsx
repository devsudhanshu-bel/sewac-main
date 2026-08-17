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
  "https://sewac-main.onrender.com";

const DEFAULT_CITY_ID = 1;

const CITY_MAP_ENDPOINT = (cityId) =>
  `${API_BASE_URL}/api/master-citizen/map/city/${cityId}`;

/*
 * IMPORTANT:
 * The selected zone's TABLE NAME is used first.
 *
 * Because the backend route name may differ between the deployed
 * branch and the local branch, the frontend tries the table-name
 * routes first and then the ID routes as compatibility fallbacks.
 *
 * The first successful endpoint wins.
 */
const ZONE_DIVISION_ENDPOINTS = ({
  zoneTableName,
  zoneId,
}) => {
  const endpoints = [];

  if (zoneTableName) {
    const encodedTable = encodeURIComponent(
      zoneTableName
    );

    endpoints.push(
      `${API_BASE_URL}/api/master-citizen/divisions/zone-table/${encodedTable}`,
      `${API_BASE_URL}/api/master-citizen/division/zone-table/${encodedTable}`,
      `${API_BASE_URL}/api/master-citizen/divisions/${encodedTable}`
    );
  }

  if (zoneId !== null && zoneId !== undefined) {
    endpoints.push(
      `${API_BASE_URL}/api/master-citizen/divisions/zone/${zoneId}`,
      `${API_BASE_URL}/api/master-citizen/divisions/${zoneId}`
    );
  }

  return endpoints;
};

/* ============================================================
   COLORS
============================================================ */

const ZONE_COLORS = [
  "#93C5FD",
  "#C4B5FD",
  "#86EFAC",
  "#FDE68A",
  "#F9A8D4",
];

const DIVISION_COLORS = [
  "#60A5FA",
  "#A78BFA",
  "#34D399",
  "#FBBF24",
  "#F472B6",
  "#22D3EE",
  "#FB923C",
  "#818CF8",
];

/* ============================================================
   GEOJSON HELPERS
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

function isCoordinatePair(value) {
  return (
    Array.isArray(value) &&
    value.length >= 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number"
  );
}

/*
 * PostgreSQL data in this project has appeared in both forms:
 *
 * GeoJSON:
 *   [longitude, latitude]
 *
 * and raw boundary arrays:
 *   [latitude, longitude]
 *
 * We only swap when the pair clearly looks like
 * [latitude, longitude].
 */
function normalizeCoordinatePair(pair) {
  if (!isCoordinatePair(pair)) {
    return pair;
  }

  const first = pair[0];
  const second = pair[1];

  if (
    Math.abs(first) <= 30 &&
    Math.abs(second) >= 60
  ) {
    return [
      second,
      first,
      ...pair.slice(2),
    ];
  }

  return pair;
}

function normalizeCoordinates(value) {
  if (!Array.isArray(value)) {
    return value;
  }

  if (isCoordinatePair(value)) {
    return normalizeCoordinatePair(value);
  }

  return value.map(
    normalizeCoordinates
  );
}

function normalizeGeometry(geometry) {
  if (!geometry) {
    return null;
  }

  if (
    geometry.type ===
    "GeometryCollection"
  ) {
    return {
      ...geometry,
      geometries:
        Array.isArray(
          geometry.geometries
        )
          ? geometry.geometries.map(
              normalizeGeometry
            )
          : [],
    };
  }

  if (geometry.coordinates) {
    return {
      ...geometry,
      coordinates:
        normalizeCoordinates(
          geometry.coordinates
        ),
    };
  }

  return geometry;
}

function normalizeGeoJSON(value) {
  const parsed = parseGeoJSON(value);

  if (!parsed) {
    return null;
  }

  if (
    parsed.type ===
    "FeatureCollection"
  ) {
    return {
      ...parsed,
      features:
        Array.isArray(
          parsed.features
        )
          ? parsed.features.map(
              (feature) => ({
                ...feature,
                geometry:
                  normalizeGeometry(
                    feature?.geometry
                  ),
              })
            )
          : [],
    };
  }

  if (parsed.type === "Feature") {
    return {
      ...parsed,
      geometry:
        normalizeGeometry(
          parsed.geometry
        ),
    };
  }

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
      geometry:
        normalizeGeometry(parsed),
    };
  }

  if (
    parsed.geometry &&
    typeof parsed.geometry === "object"
  ) {
    return {
      type: "Feature",
      properties:
        parsed.properties || {},
      geometry:
        normalizeGeometry(
          parsed.geometry
        ),
    };
  }

  /*
   * Some APIs return:
   * { coordinates: [...] }
   */
  if (parsed.coordinates) {
    return {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates:
          normalizeCoordinates(
            parsed.coordinates
          ),
      },
    };
  }

  return null;
}

function getGeoJSONBounds(value) {
  const normalized =
    normalizeGeoJSON(value);

  if (!normalized) {
    return null;
  }

  try {
    const layer =
      L.geoJSON(normalized);

    const bounds =
      layer.getBounds();

    return bounds?.isValid()
      ? bounds
      : null;
  } catch {
    return null;
  }
}

/* ============================================================
   DATA HELPERS
============================================================ */

function getZoneName(zone) {
  return (
    zone?.zoneName ||
    zone?.zone_name ||
    zone?.name ||
    "Unnamed Zone"
  );
}

function getZoneId(zone) {
  const value =
    zone?.id ??
    zone?.zoneId ??
    zone?.zone_id ??
    null;

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const numeric =
    Number(value);

  return Number.isInteger(numeric)
    ? numeric
    : null;
}

function getZoneTableName(zone) {
  return (
    zone?.zoneTableName ||
    zone?.zone_table_name ||
    null
  );
}

function getZoneBoundary(zone) {
  return normalizeGeoJSON(
    zone?.geoBoundary ??
      zone?.geo_boundary ??
      zone?.geometry ??
      zone?.boundary
  );
}

function getDivisionName(division) {
  return (
    division?.divisionName ||
    division?.division_name ||
    division?.name ||
    "Unnamed Division"
  );
}

function getDivisionId(division) {
  return (
    division?.id ??
    division?.divisionId ??
    division?.division_id ??
    null
  );
}

function getDivisionTableName(
  division
) {
  return (
    division?.divisionTableName ||
    division?.division_table_name ||
    null
  );
}

function getDivisionBoundary(
  division
) {
  return normalizeGeoJSON(
    division?.geoBoundary ??
      division?.geo_boundary ??
      division?.geometry ??
      division?.boundary
  );
}

/* ============================================================
   RESPONSE NORMALIZER
============================================================ */

function extractDivisions(result) {
  if (Array.isArray(result)) {
    return result;
  }

  if (
    Array.isArray(
      result?.divisions
    )
  ) {
    return result.divisions;
  }

  if (
    Array.isArray(
      result?.data
    )
  ) {
    return result.data;
  }

  if (
    Array.isArray(
      result?.data?.divisions
    )
  ) {
    return result.data.divisions;
  }

  if (
    Array.isArray(
      result?.zone?.divisions
    )
  ) {
    return result.zone.divisions;
  }

  return [];
}

/* ============================================================
   MAP SIZE
============================================================ */

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

    const onResize = () =>
      map.invalidateSize();

    window.addEventListener(
      "resize",
      onResize
    );

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener(
        "resize",
        onResize
      );
    };
  }, [map]);

  return null;
}

/* ============================================================
   INITIAL CITY FIT
============================================================ */

function MapBoundsController({
  cityBoundary,
  zones,
}) {
  const map = useMap();
  const didFit = useRef(false);

  useEffect(() => {
    if (didFit.current) {
      return;
    }

    const cityBounds =
      getGeoJSONBounds(
        cityBoundary
      );

    if (
      cityBounds &&
      cityBounds.isValid()
    ) {
      didFit.current = true;

      map.fitBounds(
        cityBounds,
        {
          padding: [35, 35],
          maxZoom: 11,
          animate: false,
        }
      );

      return;
    }

    const boundsList =
      zones
        .map((zone) =>
          getGeoJSONBounds(
            getZoneBoundary(zone)
          )
        )
        .filter(Boolean);

    if (!boundsList.length) {
      return;
    }

    const combined =
      L.latLngBounds(
        boundsList[0]
      );

    for (
      let i = 1;
      i < boundsList.length;
      i += 1
    ) {
      combined.extend(
        boundsList[i]
      );
    }

    if (combined.isValid()) {
      didFit.current = true;

      map.fitBounds(
        combined,
        {
          padding: [35, 35],
          maxZoom: 11,
          animate: false,
        }
      );
    }
  }, [
    map,
    cityBoundary,
    zones,
  ]);

  return null;
}

/* ============================================================
   SELECTED ZONE FOCUS
============================================================ */

function SelectedZoneFocusController({
  selectedZone,
}) {
  const map = useMap();
  const previousZone =
    useRef(null);

  useEffect(() => {
    if (!selectedZone) {
      previousZone.current = null;
      return;
    }

    const zoneName =
      getZoneName(selectedZone);

    if (
      previousZone.current ===
      zoneName
    ) {
      return;
    }

    previousZone.current =
      zoneName;

    const bounds =
      getGeoJSONBounds(
        getZoneBoundary(
          selectedZone
        )
      );

    if (
      !bounds ||
      !bounds.isValid()
    ) {
      return;
    }

    map.flyToBounds(
      bounds,
      {
        padding: [90, 90],
        maxZoom: 12,
        duration: 1.1,
        easeLinearity: 0.25,
      }
    );
  }, [
    map,
    selectedZone,
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

  const color =
    ZONE_COLORS[
      index %
        ZONE_COLORS.length
    ];

  return (
    <GeoJSON
      key={`zone-${getZoneName(
        zone
      )}-${index}`}
      data={boundary}
      style={() => ({
        color: selected
          ? "#263B52"
          : "#40556B",
        weight: selected
          ? 3.2
          : 2.2,
        opacity: 1,
        fillColor: color,
        fillOpacity: selected
          ? 0.58
          : 0.38,
        lineJoin: "round",
        lineCap: "round",
      })}
      eventHandlers={{
        click: () =>
          onSelect(zone),
      }}
    />
  );
}

/* ============================================================
   DIVISION LAYER
============================================================ */

function DivisionLayer({
  division,
  index,
  selected,
  onSelect,
}) {
  const boundary =
    getDivisionBoundary(
      division
    );

  if (!boundary) {
    return null;
  }

  const color =
    DIVISION_COLORS[
      index %
        DIVISION_COLORS.length
    ];

  return (
    <GeoJSON
      key={`division-${getDivisionId(
        division
      )}-${index}`}
      data={boundary}
      style={() => ({
        color: selected
          ? "#172B3F"
          : "#52677C",
        weight: selected
          ? 3
          : 1.5,
        opacity: 1,
        fillColor: color,
        fillOpacity: selected
          ? 0.62
          : 0.25,
        lineJoin: "round",
        lineCap: "round",
      })}
      eventHandlers={{
        click: () =>
          onSelect?.(division),
      }}
    />
  );
}

/* ============================================================
   CITY OUTLINE
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
        color: "#263B52",
        weight: 3.6,
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
   FILTER DROPDOWN
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
            open ? null : label
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
          {value || placeholder}
        </span>

        {open ? (
          <ChevronUp size={15} />
        ) : (
          <ChevronDown size={15} />
        )}
      </button>

      {open && !disabled && (
        <div className="cm-dropdown">
          {options.map(
            (option, index) => {
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
                optionValue === value;

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
                    setOpen(null);
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
  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [city, setCity] =
    useState(null);

  const [zones, setZones] =
    useState([]);

  const [
    selectedZone,
    setSelectedZone,
  ] = useState(null);

  const [
    divisions,
    setDivisions,
  ] = useState([]);

  const [
    selectedDivision,
    setSelectedDivision,
  ] = useState(null);

  const [
    divisionsLoading,
    setDivisionsLoading,
  ] = useState(false);

  const [
    divisionError,
    setDivisionError,
  ] = useState("");

  const [
    openDropdown,
    setOpenDropdown,
  ] = useState(null);

  const mapRef =
    useRef(null);

  /* ==========================================================
     CITY MAP REQUEST
  ========================================================== */

  const fetchCityMapData =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            CITY_MAP_ENDPOINT(
              cityId
            ),
            {
              method: "GET",
              headers: {
                Accept:
                  "application/json",
              },
            }
          );

        if (!response.ok) {
          throw new Error(
            `City map request failed with status ${response.status}`
          );
        }

        const result =
          await response.json();

        if (
          result?.success ===
          false
        ) {
          throw new Error(
            result.message ||
              "Unable to fetch city map data."
          );
        }

        setCity(
          result?.city || null
        );

        setZones(
          Array.isArray(
            result?.zones
          )
            ? result.zones
            : []
        );

        setSelectedZone(null);
        setDivisions([]);
        setSelectedDivision(null);
        setDivisionError("");
      } catch (requestError) {
        console.error(
          "CITY MAP ERROR:",
          requestError
        );

        setError(
          requestError?.message ||
            "Unable to load city map."
        );
      } finally {
        setLoading(false);
      }
    }, [cityId]);

  useEffect(() => {
    fetchCityMapData();
  }, [fetchCityMapData]);

  /* ==========================================================
     FETCH DIVISIONS
  ========================================================== */

  const fetchZoneDivisions =
    useCallback(
      async (zone) => {
        if (!zone) {
          setDivisions([]);
          setSelectedDivision(null);
          setDivisionError("");
          return;
        }

        const zoneTableName =
          getZoneTableName(zone);

        const zoneId =
          getZoneId(zone);

        if (!zoneTableName) {
          setDivisions([]);
          setSelectedDivision(null);
          setDivisionError(
            "Selected zone does not contain a valid zone table name."
          );
          return;
        }

        const endpoints =
          ZONE_DIVISION_ENDPOINTS({
            zoneTableName,
            zoneId,
          });

        setDivisionsLoading(true);
        setDivisionError("");
        setDivisions([]);
        setSelectedDivision(null);

        console.log(
          "=========================================="
        );
        console.log(
          "🏢 ZONE DIVISIONS REQUEST"
        );
        console.log(
          "ZONE:",
          getZoneName(zone)
        );
        console.log(
          "ZONE TABLE:",
          zoneTableName
        );
        console.log(
          "ZONE ID:",
          zoneId
        );
        console.log(
          "ENDPOINTS:",
          endpoints
        );
        console.log(
          "=========================================="
        );

        let lastStatus = null;
        let loaded = false;

        try {
          for (
            const endpoint of endpoints
          ) {
            try {
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

              lastStatus =
                response.status;

              console.log(
                "DIVISION ENDPOINT:",
                endpoint,
                "STATUS:",
                response.status
              );

              /*
               * A 404 simply means this compatibility
               * route does not exist. Try the next
               * route instead of immediately breaking.
               */
              if (
                response.status ===
                404
              ) {
                continue;
              }

              let result = null;

              try {
                result =
                  await response.json();
              } catch {
                result = null;
              }

              if (!response.ok) {
                continue;
              }

              if (
                result?.success ===
                false
              ) {
                continue;
              }

              const divisionData =
                extractDivisions(
                  result
                );

              if (
                divisionData.length >
                0
              ) {
                console.log(
                  "✅ DIVISIONS LOADED:",
                  divisionData.length
                );

                setDivisions(
                  divisionData
                );

                loaded = true;
                break;
              }

              /*
               * A successful endpoint with zero divisions
               * is still a valid response.
               */
              if (
                result &&
                (
                  Array.isArray(
                    result?.divisions
                  ) ||
                  Array.isArray(
                    result?.data
                  ) ||
                  Array.isArray(
                    result
                  )
                )
              ) {
                setDivisions([]);
                loaded = true;
                break;
              }
            } catch (endpointError) {
              console.warn(
                "Division endpoint failed:",
                endpoint,
                endpointError
              );
            }
          }

          if (!loaded) {
            throw new Error(
              `Unable to load divisions for the selected zone${lastStatus ? ` (last status ${lastStatus})` : ""}.`
            );
          }
        } catch (requestError) {
          console.error(
            "❌ ZONE DIVISION ERROR:",
            requestError
          );

          setDivisionError(
            requestError?.message ||
              "Unable to load divisions."
          );

          setDivisions([]);
        } finally {
          setDivisionsLoading(false);
        }
      },
      []
    );

  /* ==========================================================
     NORMALIZED CITY
  ========================================================== */

  const cityBoundary =
    useMemo(
      () =>
        normalizeGeoJSON(
          city?.geoBoundary ??
            city?.geo_boundary
        ),
      [city]
    );

  const selectedZoneName =
    selectedZone
      ? getZoneName(
          selectedZone
        )
      : null;

  /* ==========================================================
     OPTIONS
  ========================================================== */

  const zoneOptions =
    useMemo(
      () => [
        {
          value: "",
          label: "All Zones",
        },
        ...zones.map(
          (zone) => ({
            value:
              getZoneName(zone),
            label:
              getZoneName(zone),
            zone,
          })
        ),
      ],
      [zones]
    );

  const divisionOptions =
    useMemo(
      () => [
        {
          value: "",
          label: "All Divisions",
        },
        ...divisions.map(
          (division) => ({
            value:
              getDivisionName(
                division
              ),
            label:
              getDivisionName(
                division
              ),
            division,
          })
        ),
      ],
      [divisions]
    );

  /* ==========================================================
     VISIBLE ZONES
  ========================================================== */

  const visibleZones =
    useMemo(() => {
      if (!selectedZone) {
        return zones;
      }

      return zones.filter(
        (zone) =>
          getZoneName(zone) ===
          selectedZoneName
      );
    }, [
      zones,
      selectedZone,
      selectedZoneName,
    ]);

  /* ==========================================================
     VISIBLE DIVISIONS
  ========================================================== */

  const visibleDivisions =
    useMemo(() => {
      if (!selectedDivision) {
        return divisions;
      }

      const selectedName =
        getDivisionName(
          selectedDivision
        );

      return divisions.filter(
        (division) =>
          getDivisionName(
            division
          ) === selectedName
      );
    }, [
      divisions,
      selectedDivision,
    ]);

  /* ==========================================================
     ZONE SELECT
  ========================================================== */

  const handleZoneSelect =
    useCallback(
      (zone) => {
        /*
         * STEP 1:
         * Record the selected zone immediately.
         */
        setSelectedZone(zone);

        /*
         * STEP 2:
         * Reset dependent filters immediately.
         */
        setSelectedDivision(null);
        setDivisions([]);
        setDivisionError("");

        /*
         * STEP 3:
         * Close dropdown.
         */
        setOpenDropdown(null);

        /*
         * STEP 4:
         * Fetch divisions using this zone's
         * actual zoneTableName.
         */
        fetchZoneDivisions(zone);
      },
      [fetchZoneDivisions]
    );

  /* ==========================================================
     DIVISION SELECT
  ========================================================== */

  const handleDivisionSelect =
    useCallback((option) => {
      if (!option?.value) {
        setSelectedDivision(null);
        return;
      }

      setSelectedDivision(
        option.division || null
      );
    }, []);

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <section className="cm-wrapper">
      <style>{`
        .cm-wrapper {
          width: 100%;
          background: #fff;
          border: 1px solid #dce4ec;
          border-radius: 20px;
          padding: 18px;
          box-sizing: border-box;
          box-shadow: 0 4px 18px rgba(31,45,61,.05);
        }

        .cm-heading {
          margin: 0 0 14px 2px;
          font-size: 24px;
          line-height: 1.15;
          font-weight: 700;
          letter-spacing: -.4px;
          color: #07111f;
        }

        .cm-map-shell {
          position: relative;
          width: 100%;
          height: 790px;
          min-height: 600px;
          overflow: hidden;
          border: 1px solid #dce4ec;
          border-radius: 20px;
          background: #eef1f3;
        }

        .cm-map,
        .cm-map .leaflet-container {
          width: 100%;
          height: 100%;
        }

        .cm-map .leaflet-tile-pane {
          filter: saturate(.42) brightness(1.05);
        }

        .cm-map .leaflet-control-zoom {
          margin-top: 14px;
          margin-left: 14px;
          border: 1px solid #d8e1ea;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 3px 12px rgba(36,53,72,.08);
        }

        .cm-map .leaflet-control-zoom a {
          width: 32px;
          height: 32px;
          line-height: 32px;
          font-size: 18px;
          color: #34475b;
          background: #fff;
        }

        .cm-map .leaflet-control-attribution {
          font-size: 10px;
          background: rgba(255,255,255,.82);
        }

        .cm-map-header {
          position: absolute;
          z-index: 1000;
          top: 28px;
          left: 28px;
          width: min(52%, 620px);
          min-height: 88px;
          padding: 18px 24px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255,255,255,.96);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(216,225,235,.9);
          border-radius: 20px;
          box-shadow: 0 15px 40px rgba(30,45,60,.08);
        }

        .cm-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .cm-header-icon {
          width: 34px;
          height: 34px;
          color: #617b98;
          flex-shrink: 0;
        }

        .cm-header-title {
          font-size: 24px;
          font-weight: 700;
          line-height: 1.1;
          color: #34475b;
        }

        .cm-header-city {
          margin-top: 5px;
          font-size: 13px;
          font-weight: 600;
          color: #8aa1bb;
        }

        .cm-header-chevron {
          color: #34475b;
          flex-shrink: 0;
        }

        .cm-filter-card {
          position: absolute;
          z-index: 1000;
          top: 28px;
          right: 28px;
          width: 370px;
          padding: 24px;
          box-sizing: border-box;
          background: rgba(255,255,255,.97);
          backdrop-filter: blur(12px);
          border: 1px solid #dce4ec;
          border-radius: 20px;
          box-shadow: 0 15px 40px rgba(30,45,60,.09);
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

        .cm-filter-label {
          margin-bottom: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #8ba4bf;
          letter-spacing: .2px;
        }

        .cm-select {
          width: 100%;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 18px;
          box-sizing: border-box;
          border: 1px solid #cfddea;
          border-radius: 16px;
          background: #fff;
          color: #4b6179;
          font-size: 16px;
          font-weight: 600;
          text-align: left;
          transition: .2s ease;
        }

        .cm-select:hover {
          border-color: #91afd0;
        }

        .cm-select-disabled {
          opacity: .58;
          cursor: not-allowed;
          background: #f8fafc;
        }

        .cm-select-value,
        .cm-select-placeholder {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: calc(100% - 28px);
        }

        .cm-select-placeholder {
          color: #9aaabd;
        }

        .cm-dropdown {
          position: absolute;
          z-index: 2000;
          top: 88px;
          left: 0;
          width: 100%;
          max-height: 300px;
          overflow-y: auto;
          padding: 5px;
          box-sizing: border-box;
          background: #fff;
          border: 1px solid #dbe4ed;
          border-radius: 16px;
          box-shadow: 0 15px 40px rgba(30,45,60,.13);
        }

        .cm-dropdown-option {
          width: 100%;
          min-height: 44px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          box-sizing: border-box;
          border: 0;
          border-radius: 12px;
          background: transparent;
          color: #4b6179;
          font-size: 14px;
          font-weight: 600;
          text-align: left;
          cursor: pointer;
        }

        .cm-dropdown-option:hover {
          background: #f5f8fb;
        }

        .cm-dropdown-option-active {
          background: #edf3f8;
          color: #20364c;
        }

        .cm-zone-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
          border: 1px solid rgba(49,73,96,.35);
        }

        .cm-zone-option-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .cm-selected-card {
          position: absolute;
          z-index: 1000;
          left: 28px;
          bottom: 28px;
          width: 350px;
          padding: 18px 22px;
          box-sizing: border-box;
          background: rgba(255,255,255,.97);
          backdrop-filter: blur(12px);
          border: 1px solid #dce4ec;
          border-radius: 18px;
          box-shadow: 0 15px 40px rgba(30,45,60,.09);
        }

        .cm-selected-label {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 12px;
          font-weight: 700;
          color: #8aa1bb;
        }

        .cm-selected-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 1px solid rgba(49,73,96,.3);
        }

        .cm-selected-name {
          margin-top: 9px;
          font-size: 17px;
          font-weight: 700;
          color: #34475b;
        }

        .cm-selected-table {
          margin-top: 6px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e7edf3;
          font-size: 11px;
          color: #8ba4bf;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .cm-division-status {
          margin-top: 10px;
          font-size: 12px;
          font-weight: 600;
          color: #7892ae;
        }

        .cm-division-error {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #edf1f5;
          color: #e11d48;
          font-size: 12px;
          line-height: 1.4;
        }

        .cm-state {
          position: absolute;
          z-index: 3000;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .cm-state-card {
          padding: 12px 18px;
          border-radius: 12px;
          background: rgba(255,255,255,.96);
          border: 1px solid #dfe7ef;
          box-shadow: 0 12px 30px rgba(0,0,0,.08);
          color: #536a84;
          font-size: 13px;
          font-weight: 600;
        }

        .cm-error-card {
          color: #dc2626;
        }

        @media (max-width: 1100px) {
          .cm-map-header {
            width: 45%;
          }

          .cm-filter-card {
            width: 320px;
          }
        }

        @media (max-width: 800px) {
          .cm-wrapper {
            padding: 12px;
            border-radius: 14px;
          }

          .cm-heading {
            font-size: 19px;
          }

          .cm-map-shell {
            height: 680px;
          }

          .cm-map-header {
            left: 16px;
            top: 16px;
            width: calc(100% - 32px);
            min-height: 70px;
            padding: 12px 16px;
          }

          .cm-header-title {
            font-size: 18px;
          }

          .cm-header-city {
            font-size: 11px;
          }

          .cm-filter-card {
            top: auto;
            right: 16px;
            left: 16px;
            bottom: 16px;
            width: auto;
            max-height: 310px;
            overflow-y: auto;
          }

          .cm-selected-card {
            display: none;
          }
        }
      `}</style>

      <h2 className="cm-heading">
        CITY OVERVIEW MAP
      </h2>

      <div className="cm-map-shell">
        <MapContainer
          ref={mapRef}
          center={[
            12.9716,
            77.5946,
          ]}
          zoom={10}
          zoomControl={false}
          className="cm-map"
          preferCanvas={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap contributors &copy; CARTO"
            subdomains={[
              "a",
              "b",
              "c",
              "d",
            ]}
            maxZoom={20}
          />

          <MapSizeController />

          <ZoomControl position="topleft" />

          <MapBoundsController
            cityBoundary={
              cityBoundary
            }
            zones={zones}
          />

          <SelectedZoneFocusController
            selectedZone={
              selectedZone
            }
          />

          <Pane
            name="zonePane"
            style={{ zIndex: 410 }}
          >
            {visibleZones.map(
              (zone, index) => (
                <ZoneLayer
                  key={`zone-${getZoneName(
                    zone
                  )}-${index}`}
                  zone={zone}
                  index={zones.indexOf(
                    zone
                  )}
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
          </Pane>

          {selectedZone &&
            divisions.length > 0 && (
              <Pane
                name="divisionPane"
                style={{ zIndex: 415 }}
              >
                {visibleDivisions.map(
                  (
                    division,
                    index
                  ) => (
                    <DivisionLayer
                      key={`division-${getDivisionId(
                        division
                      )}-${index}`}
                      division={
                        division
                      }
                      index={index}
                      selected={
                        !!selectedDivision &&
                        getDivisionName(
                          selectedDivision
                        ) ===
                          getDivisionName(
                            division
                          )
                      }
                      onSelect={
                        setSelectedDivision
                      }
                    />
                  )
                )}
              </Pane>
            )}

          <Pane
            name="cityBoundaryPane"
            style={{ zIndex: 420 }}
          >
            <CityBoundaryLayer
              boundary={
                cityBoundary
              }
            />
          </Pane>
        </MapContainer>

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
            size={18}
          />
        </div>

        <div className="cm-filter-card">
          <div className="cm-filter-title">
            MAP FILTERS
          </div>

          <FilterDropdown
            label="ZONE"
            value={
              selectedZoneName || ""
            }
            placeholder="All Zones"
            options={zoneOptions}
            open={
              openDropdown ===
              "ZONE"
            }
            setOpen={
              setOpenDropdown
            }
            onChange={(option) => {
              if (!option?.value) {
                setSelectedZone(null);
                setSelectedDivision(null);
                setDivisions([]);
                setDivisionError("");
                setOpenDropdown(null);
                return;
              }

              handleZoneSelect(
                option.zone
              );
            }}
            renderOption={(
              option,
              index
            ) => {
              if (!option.value) {
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
                  (
                    zoneIndex >= 0
                      ? zoneIndex
                      : index
                  ) %
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
                    {option.label}
                  </span>
                </>
              );
            }}
          />

          <FilterDropdown
            label="DIVISION"
            value={
              selectedDivision
                ? getDivisionName(
                    selectedDivision
                  )
                : ""
            }
            placeholder={
              divisionsLoading
                ? "Loading Divisions..."
                : selectedZone
                ? divisions.length
                  ? "All Divisions"
                  : "No Divisions"
                : "Select a Zone First"
            }
            options={
              divisionOptions
            }
            open={
              openDropdown ===
              "DIVISION"
            }
            setOpen={
              setOpenDropdown
            }
            disabled={
              !selectedZone ||
              divisionsLoading ||
              divisions.length === 0
            }
            onChange={
              handleDivisionSelect
            }
            renderOption={(
              option
            ) => {
              if (!option.value) {
                return (
                  <span>
                    All Divisions
                  </span>
                );
              }

              return (
                <span
                  style={{
                    overflow:
                      "hidden",
                    textOverflow:
                      "ellipsis",
                    whiteSpace:
                      "nowrap",
                  }}
                >
                  {option.label}
                </span>
              );
            }}
          />

          <FilterDropdown
            label="WARD"
            value=""
            placeholder={
              selectedDivision
                ? "All Wards"
                : "All Wards"
            }
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
            disabled
            onChange={() => {}}
          />
        </div>

        {selectedZone && (
          <div className="cm-selected-card">
            <div className="cm-selected-label">
              <span
                className="cm-selected-dot"
                style={{
                  backgroundColor:
                    ZONE_COLORS[
                      Math.max(
                        0,
                        zones.indexOf(
                          selectedZone
                        )
                      ) %
                        ZONE_COLORS.length
                    ],
                }}
              />

              SELECTED ZONE
            </div>

            <div className="cm-selected-name">
              {getZoneName(
                selectedZone
              )}
            </div>

            {getZoneTableName(
              selectedZone
            ) && (
              <div className="cm-selected-table">
                {getZoneTableName(
                  selectedZone
                )}
              </div>
            )}

            {divisionsLoading && (
              <div className="cm-division-status">
                Loading divisions...
              </div>
            )}

            {!divisionsLoading &&
              !divisionError &&
              selectedZone && (
                <div className="cm-division-status">
                  {divisions.length} division
                  {divisions.length === 1
                    ? ""
                    : "s"} loaded
                </div>
              )}

            {divisionError && (
              <div className="cm-division-error">
                {divisionError}
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="cm-state">
            <div className="cm-state-card">
              Loading city boundaries...
            </div>
          </div>
        )}

        {!loading && error && (
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