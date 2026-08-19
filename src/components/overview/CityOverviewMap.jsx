import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
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
  Route,
  RotateCcw,
} from "lucide-react";

import { createPortal } from "react-dom";

import "leaflet/dist/leaflet.css";


/* ============================================================
   CONFIGURATION
============================================================ */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5002";

const DEFAULT_CITY_ID = 1;


/* ============================================================
   EXACT BACKEND ENDPOINTS
============================================================ */

const CITY_MAP_ENDPOINT = (cityId) =>
  `${API_BASE_URL}/api/master-citizen/map/city/${encodeURIComponent(
    cityId
  )}`;

const ZONE_DIVISIONS_ENDPOINT = (zoneTableName) =>
  `${API_BASE_URL}/api/master-citizen/map/zone/${encodeURIComponent(
    zoneTableName
  )}/divisions`;

const DIVISION_WARDS_ENDPOINT = (divisionTableName) =>
  `${API_BASE_URL}/api/master-citizen/map/division/${encodeURIComponent(
    divisionTableName
  )}/wards`;


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
  "#38BDF8",
  "#A3E635",
  "#FB7185",
  "#2DD4BF",
];

const WARD_COLORS = [
  "#38BDF8",
  "#818CF8",
  "#34D399",
  "#F59E0B",
  "#EC4899",
  "#14B8A6",
  "#8B5CF6",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#E879F9",
  "#2DD4BF",
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
 * Bengaluru coordinates:
 *
 * latitude  ≈ 13
 * longitude ≈ 77
 *
 * Backend data can contain either:
 *
 * [lat, lng]
 * [lng, lat]
 *
 * Only the clearly reversed [lat, lng] form is swapped.
 */
function normalizeCoordinatePair(pair) {
  if (!isCoordinatePair(pair)) {
    return pair;
  }

  const first = Number(pair[0]);
  const second = Number(pair[1]);

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

  return value.map(normalizeCoordinates);
}


/* ============================================================
   GEOMETRY NORMALIZER
============================================================ */

/*
 * IMPORTANT FIX FOR CENTRAL ZONE
 *
 * The backend's Central zone is returned as a
 * GeometryCollection. Some of the other zones are regular
 * Polygon/MultiPolygon objects.
 *
 * Leaflet is much more reliable here if we flatten a
 * GeometryCollection into individual Feature objects.
 *
 * This keeps every valid geometry instead of allowing one
 * problematic geometry to prevent the whole Central zone
 * from rendering.
 */

function flattenGeometry(geometry, output = []) {
  if (!geometry || typeof geometry !== "object") {
    return output;
  }

  if (geometry.type === "GeometryCollection") {
    const geometries = Array.isArray(geometry.geometries)
      ? geometry.geometries
      : [];

    geometries.forEach((child) => {
      flattenGeometry(child, output);
    });

    return output;
  }

  if (geometry.coordinates) {
    output.push({
      ...geometry,
      coordinates: normalizeCoordinates(
        geometry.coordinates
      ),
    });
  }

  return output;
}

function normalizeGeometry(geometry) {
  if (!geometry || typeof geometry !== "object") {
    return null;
  }

  if (geometry.type === "GeometryCollection") {
    const flattened = flattenGeometry(
      geometry,
      []
    );

    return {
      type: "GeometryCollection",
      geometries: flattened,
    };
  }

  if (geometry.coordinates) {
    return {
      ...geometry,
      coordinates: normalizeCoordinates(
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

  /* ----------------------------------------------------------
     FeatureCollection
  ---------------------------------------------------------- */

  if (parsed.type === "FeatureCollection") {
    const features = [];

    const sourceFeatures = Array.isArray(
      parsed.features
    )
      ? parsed.features
      : [];

    sourceFeatures.forEach((feature) => {
      if (!feature?.geometry) {
        return;
      }

      const geometries = flattenGeometry(
        feature.geometry,
        []
      );

      geometries.forEach((geometry) => {
        features.push({
          type: "Feature",
          properties: feature.properties || {},
          geometry,
        });
      });
    });

    return {
      type: "FeatureCollection",
      features,
    };
  }

  /* ----------------------------------------------------------
     Feature
  ---------------------------------------------------------- */

  if (parsed.type === "Feature") {
    if (!parsed.geometry) {
      return null;
    }

    const geometries = flattenGeometry(
      parsed.geometry,
      []
    );

    if (geometries.length === 1) {
      return {
        type: "Feature",
        properties: parsed.properties || {},
        geometry: geometries[0],
      };
    }

    return {
      type: "FeatureCollection",
      features: geometries.map((geometry) => ({
        type: "Feature",
        properties: parsed.properties || {},
        geometry,
      })),
    };
  }

  /* ----------------------------------------------------------
     Raw geometry
  ---------------------------------------------------------- */

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
    const geometries = flattenGeometry(
      parsed,
      []
    );

    if (geometries.length === 1) {
      return {
        type: "Feature",
        properties: parsed.properties || {},
        geometry: geometries[0],
      };
    }

    return {
      type: "FeatureCollection",
      features: geometries.map((geometry) => ({
        type: "Feature",
        properties: parsed.properties || {},
        geometry,
      })),
    };
  }

  /* ----------------------------------------------------------
     Object containing geometry
  ---------------------------------------------------------- */

  if (
    parsed.geometry &&
    typeof parsed.geometry === "object"
  ) {
    return normalizeGeoJSON({
      type: "Feature",
      properties: parsed.properties || {},
      geometry: parsed.geometry,
    });
  }

  /* ----------------------------------------------------------
     Raw coordinates
  ---------------------------------------------------------- */

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

  if (parsed.coordinates) {
    return {
      type: "Feature",
      properties: parsed.properties || {},
      geometry: {
        type: parsed.type || "Polygon",
        coordinates: normalizeCoordinates(
          parsed.coordinates
        ),
      },
    };
  }

  return null;
}

function getGeoJSONBounds(value) {
  const normalized = normalizeGeoJSON(value);

  if (!normalized) {
    return null;
  }

  try {
    const layer = L.geoJSON(normalized);
    const bounds = layer.getBounds();

    if (bounds && bounds.isValid()) {
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


/* ============================================================
   ENTITY HELPERS
============================================================ */

function getEntityId(entity) {
  return (
    entity?.id ??
    entity?.zoneId ??
    entity?.zone_id ??
    entity?.divisionId ??
    entity?.division_id ??
    entity?.wardId ??
    entity?.ward_id ??
    null
  );
}

function getZoneName(zone) {
  return (
    zone?.zoneName ||
    zone?.zone_name ||
    zone?.name ||
    "Unnamed Zone"
  );
}

function getZoneId(zone) {
  return (
    zone?.id ??
    zone?.zoneId ??
    zone?.zone_id ??
    null
  );
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

function getDivisionTableName(division) {
  return (
    division?.divisionTableName ||
    division?.division_table_name ||
    null
  );
}

function getDivisionBoundary(division) {
  return normalizeGeoJSON(
    division?.geoBoundary ??
      division?.geo_boundary ??
      division?.geometry ??
      division?.boundary
  );
}

function getWardName(ward) {
  return (
    ward?.wardName ||
    ward?.ward_name ||
    ward?.name ||
    (
      ward?.wardNo !== undefined
        ? `Ward ${ward.wardNo}`
        : "Unnamed Ward"
    )
  );
}

function getWardId(ward) {
  return (
    ward?.id ??
    ward?.wardId ??
    ward?.ward_id ??
    ward?.wardNo ??
    null
  );
}

function getWardBoundary(ward) {
  return normalizeGeoJSON(
    ward?.geoBoundary ??
      ward?.geo_boundary ??
      ward?.geometry ??
      ward?.boundary
  );
}

function sameEntity(
  first,
  second,
  getId,
  getName
) {
  if (!first || !second) {
    return false;
  }

  const firstId = getId(first);
  const secondId = getId(second);

  if (
    firstId !== null &&
    firstId !== undefined &&
    secondId !== null &&
    secondId !== undefined
  ) {
    return (
      String(firstId) ===
      String(secondId)
    );
  }

  return (
    getName(first) ===
    getName(second)
  );
}


/* ============================================================
   RESPONSE HELPERS
============================================================ */

function extractArray(result, key) {
  if (Array.isArray(result?.[key])) {
    return result[key];
  }

  if (Array.isArray(result?.data?.[key])) {
    return result.data[key];
  }

  if (Array.isArray(result?.data)) {
    return result.data;
  }

  if (Array.isArray(result)) {
    return result;
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

    const resizeHandler = () =>
      map.invalidateSize();

    window.addEventListener(
      "resize",
      resizeHandler
    );

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener(
        "resize",
        resizeHandler
      );
    };
  }, [map]);

  return null;
}


/* ============================================================
   INITIAL CITY FIT
============================================================ */

function InitialCityFit({
  cityBoundary,
  zones,
}) {
  const map = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (fitted.current) {
      return;
    }

    const bounds =
      getGeoJSONBounds(
        cityBoundary
      );

    if (
      bounds &&
      bounds.isValid()
    ) {
      fitted.current = true;

      map.fitBounds(
        bounds,
        {
          padding: [60, 60],
          maxZoom: 10,
          animate: false,
        }
      );

      return;
    }

    const zoneBounds = zones
      .map((zone) =>
        getGeoJSONBounds(
          getZoneBoundary(zone)
        )
      )
      .filter(Boolean);

    if (!zoneBounds.length) {
      return;
    }

    const combined =
      L.latLngBounds(
        zoneBounds[0]
      );

    for (
      let index = 1;
      index < zoneBounds.length;
      index += 1
    ) {
      combined.extend(
        zoneBounds[index]
      );
    }

    if (combined.isValid()) {
      fitted.current = true;

      map.fitBounds(
        combined,
        {
          padding: [60, 60],
          maxZoom: 10,
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
   SELECTION FOCUS
============================================================ */

function SelectionFocusController({
  selectedZone,
  selectedDivision,
  selectedWard,
}) {
  const map = useMap();
  const previous = useRef("");

  useEffect(() => {
    let target = null;
    let key = "";

    if (selectedWard) {
      target =
        getWardBoundary(
          selectedWard
        );

      key =
        `ward:${getWardId(
          selectedWard
        ) || getWardName(
          selectedWard
        )}`;
    } else if (selectedDivision) {
      target =
        getDivisionBoundary(
          selectedDivision
        );

      key =
        `division:${getDivisionId(
          selectedDivision
        ) || getDivisionName(
          selectedDivision
        )}`;
    } else if (selectedZone) {
      target =
        getZoneBoundary(
          selectedZone
        );

      key =
        `zone:${getZoneId(
          selectedZone
        ) || getZoneName(
          selectedZone
        )}`;
    } else {
      previous.current = "";
      return;
    }

    if (previous.current === key) {
      return;
    }

    previous.current = key;

    const bounds =
      getGeoJSONBounds(target);

    if (!bounds || !bounds.isValid()) {
      return;
    }

    let padding = [90, 90];
    let maxZoom = 13;

    if (selectedDivision) {
      padding = [100, 100];
      maxZoom = 15;
    }

    if (selectedWard) {
      padding = [120, 120];
      maxZoom = 17;
    }

    map.flyToBounds(
      bounds,
      {
        padding,
        maxZoom,
        duration: 0.9,
        easeLinearity: 0.25,
      }
    );
  }, [
    map,
    selectedZone,
    selectedDivision,
    selectedWard,
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
      key={
        `zone-${
          getZoneTableName(zone) ||
          getZoneName(zone)
        }-${index}`
      }
      data={boundary}
      style={() => ({
        color:
          selected
            ? "#1F354A"
            : "#40556B",

        weight:
          selected
            ? 4.2
            : 2.4,

        opacity: 1,

        /*
         * When selected, ONLY the zone outline
         * remains visible so divisions can be
         * seen clearly underneath it.
         */
        fillColor:
          selected
            ? "transparent"
            : color,

        fillOpacity:
          selected
            ? 0
            : 0.38,

        lineJoin: "round",
        lineCap: "round",
      })}
      eventHandlers={{
        click: (event) => {
          if (
            event?.originalEvent
          ) {
            L.DomEvent.stopPropagation(
              event.originalEvent
            );
          }

          onSelect?.(zone);
        },
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
      key={
        `division-${
          getDivisionTableName(
            division
          ) ||
          getDivisionId(
            division
          ) ||
          getDivisionName(
            division
          )
        }-${index}`
      }
      data={boundary}
      style={() => ({
        color:
          selected
            ? "#172B3F"
            : "#52677C",

        weight:
          selected
            ? 3.5
            : 1.8,

        opacity: 1,
        fillColor: color,

        fillOpacity:
          selected
            ? 0.64
            : 0.30,

        lineJoin: "round",
        lineCap: "round",
      })}
      eventHandlers={{
        click: (event) => {
          if (
            event?.originalEvent
          ) {
            L.DomEvent.stopPropagation(
              event.originalEvent
            );
          }

          onSelect?.(division);
        },
      }}
    />
  );
}


/* ============================================================
   WARD LAYER
============================================================ */

function WardLayer({
  ward,
  index,
  selected,
  onSelect,
}) {
  const boundary =
    getWardBoundary(ward);

  if (!boundary) {
    return null;
  }

  const color =
    WARD_COLORS[
      index %
        WARD_COLORS.length
    ];

  return (
    <GeoJSON
      key={
        `ward-${
          getWardId(ward) ||
          getWardName(ward)
        }-${index}`
      }
      data={boundary}
      style={() => ({
        color:
          selected
            ? "#142536"
            : "#536A7E",

        weight:
          selected
            ? 3.2
            : 1.5,

        opacity: 1,
        fillColor: color,

        fillOpacity:
          selected
            ? 0.68
            : 0.34,

        lineJoin: "round",
        lineCap: "round",
      })}
      eventHandlers={{
        click: (event) => {
          if (
            event?.originalEvent
          ) {
            L.DomEvent.stopPropagation(
              event.originalEvent
            );
          }

          onSelect?.(ward);
        },
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
   PORTAL DROPDOWN
============================================================ */

/*
 * IMPORTANT DROPDOWN FIX
 *
 * The old dropdown was absolutely positioned inside:
 *
 * .cm-map-shell { overflow: hidden; }
 *
 * and inside Leaflet's stacking context.
 *
 * That is why the menu could visually appear but its
 * options could become impossible to click reliably.
 *
 * The menu below is rendered into document.body using
 * a portal and position: fixed.
 *
 * It therefore sits above Leaflet and is always clickable.
 */

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
  const buttonRef =
    useRef(null);

  const menuRef =
    useRef(null);

  const [position, setPosition] =
    useState({
      top: 0,
      left: 0,
      width: 0,
    });

  const updatePosition =
    useCallback(() => {
      const element =
        buttonRef.current;

      if (!element) {
        return;
      }

      const rect =
        element.getBoundingClientRect();

      setPosition({
        top:
          rect.bottom + 8,
        left:
          rect.left,
        width:
          rect.width,
      });
    }, []);

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    updatePosition();

    const handleReposition =
      () => updatePosition();

    window.addEventListener(
      "resize",
      handleReposition
    );

    window.addEventListener(
      "scroll",
      handleReposition,
      true
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleReposition
      );

      window.removeEventListener(
        "scroll",
        handleReposition,
        true
      );
    };
  }, [
    open,
    updatePosition,
    options.length,
  ]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown =
      (event) => {
        const target =
          event.target;

        if (
          buttonRef.current?.contains(
            target
          )
        ) {
          return;
        }

        if (
          menuRef.current?.contains(
            target
          )
        ) {
          return;
        }

        setOpen(null);
      };

    document.addEventListener(
      "mousedown",
      handlePointerDown
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handlePointerDown
      );
    };
  }, [
    open,
    setOpen,
  ]);

  const handleOptionClick =
    (option) => {
      /*
       * Run the selection FIRST.
       * Only then close the menu.
       */
      onChange?.(option);
      setOpen(null);
    };

  const menu =
    open &&
    !disabled &&
    typeof document !==
      "undefined"
      ? createPortal(
          <div
            ref={menuRef}
            className="cm-dropdown-portal"
            style={{
              top: position.top,
              left: position.left,
              width: position.width,
            }}
          >
            {options.length === 0 ? (
              <div className="cm-dropdown-empty">
                No options available
              </div>
            ) : (
              options.map(
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
                      key={
                        `${optionValue}-${index}`
                      }
                      className={
                        `cm-dropdown-option ${
                          selectedOption
                            ? "cm-dropdown-option-active"
                            : ""
                        }`
                      }
                      onMouseDown={(event) => {
                        /*
                         * Prevent the document's outside
                         * mousedown handler from closing
                         * the menu before click fires.
                         */
                        event.stopPropagation();
                      }}
                      onClick={() =>
                        handleOptionClick(
                          option
                        )
                      }
                    >
                      {renderOption
                        ? renderOption(
                            option,
                            index
                          )
                        : (
                          <span>
                            {
                              optionLabel
                            }
                          </span>
                        )}
                    </button>
                  );
                }
              )
            )}
          </div>,
          document.body
        )
      : null;

  return (
    <div className="cm-filter-group">
      <div className="cm-filter-label">
        {label}
      </div>

      <button
        ref={buttonRef}
        type="button"
        className={
          `cm-select ${
            disabled
              ? "cm-select-disabled"
              : ""
          }`
        }
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
          {value || placeholder}
        </span>

        {open ? (
          <ChevronUp size={15} />
        ) : (
          <ChevronDown size={15} />
        )}
      </button>

      {menu}
    </div>
  );
}


/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function CityMapOverview({
  cityId = DEFAULT_CITY_ID,
  onViewChange,
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
    divisions,
    setDivisions,
  ] = useState([]);

  const [
    selectedDivision,
    setSelectedDivision,
  ] = useState(null);

  const [
    wards,
    setWards,
  ] = useState([]);

  const [
    selectedWard,
    setSelectedWard,
  ] = useState(null);

  const [
    divisionsLoading,
    setDivisionsLoading,
  ] = useState(false);

  const [
    wardsLoading,
    setWardsLoading,
  ] = useState(false);

  const [
    divisionError,
    setDivisionError,
  ] = useState("");

  const [
    wardError,
    setWardError,
  ] = useState("");

  const [
    openDropdown,
    setOpenDropdown,
  ] = useState(null);

  const [
    showViewMenu,
    setShowViewMenu,
  ] = useState(false);

  const mapRef =
    useRef(null);

  const divisionAbortRef =
    useRef(null);

  const wardAbortRef =
    useRef(null);

  /* ==========================================================
     LOAD CITY
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
            "============================================================"
          );

          console.log(
            "🗺️ CITY MAP REQUEST"
          );

          console.log(
            "CITY ID:",
            cityId
          );

          console.log(
            "ENDPOINT:",
            endpoint
          );

          console.log(
            "============================================================"
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

          const loadedCity =
            result?.city ||
            null;

          const loadedZones =
            Array.isArray(
              result?.zones
            )
              ? result.zones
              : [];

          setCity(
            loadedCity
          );

          setZones(
            loadedZones
          );

          setSelectedZone(null);
          setDivisions([]);
          setSelectedDivision(null);
          setWards([]);
          setSelectedWard(null);
          setDivisionError("");
          setWardError("");
          setOpenDropdown(null);

          console.log(
            "✅ CITY MAP LOADED"
          );

          console.log(
            "City:",
            loadedCity?.cityName
          );

          console.log(
            "Zones:",
            loadedZones.length
          );

          console.log(
            "Central zone:",
            loadedZones.some(
              (zone) =>
                getZoneName(
                  zone
                ).toLowerCase()
                  .includes("central")
            )
          );

        } catch (
          requestError
        ) {
          console.error(
            "❌ CITY MAP ERROR:",
            requestError
          );

          setError(
            requestError?.message ||
              "Unable to load city map."
          );
        } finally {
          setLoading(false);
        }
      },
      [cityId]
    );

  useEffect(() => {
    fetchCityMapData();

    return () => {
      divisionAbortRef.current?.abort();
      wardAbortRef.current?.abort();
    };
  }, [
    fetchCityMapData,
  ]);


  /* ==========================================================
     FETCH DIVISIONS
  ========================================================== */

  const fetchZoneDivisions =
    useCallback(
      async (zone) => {
        divisionAbortRef.current?.abort();

        wardAbortRef.current?.abort();

        if (!zone) {
          setDivisions([]);
          setSelectedDivision(null);
          setWards([]);
          setSelectedWard(null);
          setDivisionError("");
          setWardError("");
          return;
        }

        const zoneTableName =
          getZoneTableName(
            zone
          );

        if (!zoneTableName) {
          setDivisions([]);
          setSelectedDivision(null);
          setDivisionError(
            "Selected zone does not contain a valid zoneTableName."
          );
          return;
        }

        const controller =
          new AbortController();

        divisionAbortRef.current =
          controller;

        setDivisionsLoading(true);
        setDivisionError("");
        setDivisions([]);
        setSelectedDivision(null);
        setWards([]);
        setSelectedWard(null);
        setWardError("");

        const endpoint =
          ZONE_DIVISIONS_ENDPOINT(
            zoneTableName
          );

        console.log(
          "🏢 ZONE → DIVISIONS",
          {
            zone:
              getZoneName(zone),
            zoneTableName,
            endpoint,
          }
        );

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
                signal:
                  controller.signal,
              }
            );

          if (!response.ok) {
            throw new Error(
              `Zone divisions request failed with status ${response.status}`
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
                "Unable to fetch divisions."
            );
          }

          const loadedDivisions =
            extractArray(
              result,
              "divisions"
            ).filter(Boolean);

          setDivisions(
            loadedDivisions
          );

          console.log(
            "✅ DIVISIONS LOADED:",
            loadedDivisions.length
          );
        } catch (
          requestError
        ) {
          if (
            requestError?.name ===
            "AbortError"
          ) {
            return;
          }

          console.error(
            "❌ ZONE DIVISIONS ERROR:",
            requestError
          );

          setDivisions([]);
          setDivisionError(
            requestError?.message ||
              "Unable to load divisions."
          );
        } finally {
          if (
            !controller.signal.aborted
          ) {
            setDivisionsLoading(
              false
            );
          }
        }
      },
      []
    );


  /* ==========================================================
     FETCH WARDS
  ========================================================== */

  const fetchDivisionWards =
    useCallback(
      async (division) => {
        wardAbortRef.current?.abort();

        if (!division) {
          setWards([]);
          setSelectedWard(null);
          setWardError("");
          return;
        }

        const divisionTableName =
          getDivisionTableName(
            division
          );

        if (!divisionTableName) {
          setWards([]);
          setSelectedWard(null);
          setWardError(
            "Selected division does not contain a valid divisionTableName."
          );
          return;
        }

        const controller =
          new AbortController();

        wardAbortRef.current =
          controller;

        setWardsLoading(true);
        setWardError("");
        setWards([]);
        setSelectedWard(null);

        const endpoint =
          DIVISION_WARDS_ENDPOINT(
            divisionTableName
          );

        console.log(
          "📍 DIVISION → WARDS",
          {
            division:
              getDivisionName(
                division
              ),
            divisionTableName,
            endpoint,
          }
        );

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
                signal:
                  controller.signal,
              }
            );

          if (!response.ok) {
            throw new Error(
              `Division wards request failed with status ${response.status}`
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
                "Unable to fetch wards."
            );
          }

          const loadedWards =
            extractArray(
              result,
              "wards"
            ).filter(Boolean);

          setWards(
            loadedWards
          );

          console.log(
            "✅ WARDS LOADED:",
            loadedWards.length
          );
        } catch (
          requestError
        ) {
          if (
            requestError?.name ===
            "AbortError"
          ) {
            return;
          }

          console.error(
            "❌ DIVISION WARDS ERROR:",
            requestError
          );

          setWards([]);
          setWardError(
            requestError?.message ||
              "Unable to load wards."
          );
        } finally {
          if (
            !controller.signal.aborted
          ) {
            setWardsLoading(
              false
            );
          }
        }
      },
      []
    );


  /* ==========================================================
     SELECTION HANDLERS
  ========================================================== */

  const handleZoneSelect =
    useCallback(
      (zone) => {
        if (!zone) {
          return;
        }

        setSelectedZone(zone);
        setSelectedDivision(null);
        setSelectedWard(null);
        setDivisions([]);
        setWards([]);
        setDivisionError("");
        setWardError("");
        setOpenDropdown(null);

        fetchZoneDivisions(
          zone
        );
      },
      [
        fetchZoneDivisions,
      ]
    );

  const handleDivisionSelect =
    useCallback(
      (option) => {
        if (!option?.value) {
          setSelectedDivision(null);
          setSelectedWard(null);
          setWards([]);
          setOpenDropdown(null);
          return;
        }

        const division =
          option.division;

        setSelectedDivision(
          division
        );

        setSelectedWard(null);
        setWards([]);
        setWardError("");
        setOpenDropdown(null);

        fetchDivisionWards(
          division
        );
      },
      [
        fetchDivisionWards,
      ]
    );

  const handleWardSelect =
    useCallback(
      (option) => {
        if (!option?.value) {
          setSelectedWard(null);
          setOpenDropdown(null);
          return;
        }

        setSelectedWard(
          option.ward
        );

        setOpenDropdown(null);
      },
      []
    );


  /* ==========================================================
     CITY BOUNDARY
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
              getZoneTableName(
                zone
              ) ||
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
      ],
      [zones]
    );

  const divisionOptions =
    useMemo(
      () => [
        {
          value: "",
          label:
            "All Divisions",
        },

        ...divisions.map(
          (division) => ({
            value:
              getDivisionTableName(
                division
              ) ||
              String(
                getDivisionId(
                  division
                ) ??
                  getDivisionName(
                    division
                  )
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

  const wardOptions =
    useMemo(
      () => [
        {
          value: "",
          label: "All Wards",
        },

        ...wards.map(
          (ward) => ({
            value:
              String(
                getWardId(
                  ward
                ) ??
                  getWardName(
                    ward
                  )
              ),

            label:
              getWardName(
                ward
              ),

            ward,
          })
        ),
      ],
      [wards]
    );


  /* ==========================================================
     VISIBLE LAYERS
  ========================================================== */

  const visibleZones =
    useMemo(
      () => {
        if (!selectedZone) {
          return zones;
        }

        return zones.filter(
          (zone) =>
            sameEntity(
              zone,
              selectedZone,
              getZoneId,
              getZoneName
            )
        );
      },
      [
        zones,
        selectedZone,
      ]
    );

  const visibleDivisions =
    useMemo(
      () => {
        if (!selectedZone) {
          return [];
        }

        if (!selectedDivision) {
          return divisions;
        }

        return divisions.filter(
          (division) =>
            sameEntity(
              division,
              selectedDivision,
              getDivisionId,
              getDivisionName
            )
        );
      },
      [
        selectedZone,
        selectedDivision,
        divisions,
      ]
    );

  const visibleWards =
    useMemo(
      () => {
        if (!selectedDivision) {
          return [];
        }

        if (!selectedWard) {
          return wards;
        }

        return wards.filter(
          (ward) =>
            sameEntity(
              ward,
              selectedWard,
              getWardId,
              getWardName
            )
        );
      },
      [
        selectedDivision,
        selectedWard,
        wards,
      ]
    );


  /* ==========================================================
     SELECTED NAMES
  ========================================================== */

  const selectedZoneName =
    selectedZone
      ? getZoneName(
          selectedZone
        )
      : "";

  const selectedDivisionName =
    selectedDivision
      ? getDivisionName(
          selectedDivision
        )
      : "";

  const selectedWardName =
    selectedWard
      ? getWardName(
          selectedWard
        )
      : "";


  /* ==========================================================
     RESET
  ========================================================== */

  const resetMap =
    useCallback(() => {
      setSelectedZone(null);
      setSelectedDivision(null);
      setSelectedWard(null);
      setDivisions([]);
      setWards([]);
      setDivisionError("");
      setWardError("");
      setOpenDropdown(null);
      setShowViewMenu(false);

      setTimeout(() => {
        const map =
          mapRef.current;

        if (!map) {
          return;
        }

        const bounds =
          getGeoJSONBounds(
            cityBoundary
          );

        if (
          bounds &&
          bounds.isValid()
        ) {
          map.fitBounds(
            bounds,
            {
              padding: [
                60,
                60,
              ],
              maxZoom: 10,
              animate: true,
            }
          );
        }
      }, 50);
    }, [
      cityBoundary,
    ]);


  /* ==========================================================
     VIEW MENU
  ========================================================== */

  const handleMapViewChange =
    useCallback(
      (view) => {
        setShowViewMenu(false);

        if (
          typeof onViewChange ===
          "function"
        ) {
          onViewChange(view);
        }

        /*
         * Keep this compatible with the existing
         * SEWAC route-map page.
         */
        if (view === "route") {
          window.location.href =
            "/admin/route-map";
        }
      },
      [
        onViewChange,
      ]
    );


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
          padding: 18px;
          box-sizing: border-box;
          box-shadow:
            0 4px 18px
            rgba(31,45,61,.05);
        }

        .cm-heading {
          margin:
            0 0 14px 2px;
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
          filter:
            saturate(.42)
            brightness(1.05);
        }

        .cm-map .leaflet-control-zoom {
          margin-top: 14px;
          margin-left: 14px;
          border:
            1px solid #d8e1ea;
          border-radius: 8px;
          overflow: hidden;
          box-shadow:
            0 3px 12px
            rgba(36,53,72,.08);
        }

        .cm-map .leaflet-control-zoom a {
          width: 32px;
          height: 32px;
          line-height: 32px;
          font-size: 18px;
          color: #34475b;
          background: #ffffff;
        }

        .cm-map .leaflet-control-attribution {
          font-size: 10px;
          background:
            rgba(255,255,255,.82);
        }

        /* ============================
           MAP HEADER
        ============================ */

        .cm-map-header {
          position: absolute;
          z-index: 2000;
          top: 28px;
          left: 28px;
          width: min(52%, 620px);
          min-height: 88px;
          padding: 18px 24px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background:
            rgba(255,255,255,.96);
          backdrop-filter: blur(12px);
          border:
            1px solid
            rgba(216,225,235,.9);
          border-radius: 20px;
          box-shadow:
            0 15px 40px
            rgba(30,45,60,.08);
        }

        .cm-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
          min-width: 0;
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
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cm-header-city {
          margin-top: 5px;
          font-size: 13px;
          font-weight: 600;
          color: #8aa1bb;
        }

        .cm-header-button {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 10px;
          background: transparent;
          color: #34475b;
          cursor: pointer;
          flex-shrink: 0;
        }

        .cm-header-button:hover {
          background: #f3f7fa;
        }

        .cm-header-chevron {
          transition:
            transform .2s ease;
        }

        .cm-map-header-open
        .cm-header-chevron {
          transform:
            rotate(180deg);
        }

        .cm-view-menu {
          position: absolute;
          z-index: 3000;
          top: calc(100% + 8px);
          right: 20px;
          width: 240px;
          padding: 8px;
          box-sizing: border-box;
          background:
            rgba(255,255,255,.98);
          backdrop-filter:
            blur(14px);
          border:
            1px solid #dce5ee;
          border-radius: 16px;
          box-shadow:
            0 18px 45px
            rgba(30,45,60,.14);
        }

        .cm-view-option {
          width: 100%;
          min-height: 50px;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 10px 13px;
          border: 0;
          border-radius: 12px;
          background: transparent;
          color: #40556b;
          font-size: 14px;
          font-weight: 600;
          text-align: left;
          cursor: pointer;
        }

        .cm-view-option:hover {
          background: #f4f7fa;
        }

        .cm-view-option-active {
          background: #edf3f8;
          color: #20364c;
        }

        /* ============================
           FILTER CARD
        ============================ */

        .cm-filter-card {
          position: absolute;
          z-index: 2000;
          top: 28px;
          right: 28px;
          width: 370px;
          padding: 24px;
          box-sizing: border-box;
          background:
            rgba(255,255,255,.97);
          backdrop-filter:
            blur(12px);
          border:
            1px solid #dce4ec;
          border-radius: 20px;
          box-shadow:
            0 15px 40px
            rgba(30,45,60,.09);
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
          cursor: pointer;
        }

        .cm-select:hover {
          border-color: #91afd0;
        }

        .cm-select-disabled {
          cursor: not-allowed;
          background: #f8fafc;
          color: #a4b2c0;
          border-color: #dce5ee;
          opacity: .68;
        }

        .cm-select-value,
        .cm-select-placeholder {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .cm-select-value {
          color: #435b73;
        }

        .cm-select-placeholder {
          color: #93a4b5;
        }

        /* ============================
           PORTAL DROPDOWN
        ============================ */

        .cm-dropdown-portal {
          position: fixed;
          z-index: 2147483647;
          max-height: 330px;
          overflow-y: auto;
          padding: 6px;
          box-sizing: border-box;
          background: #ffffff;
          border:
            1px solid #dce5ee;
          border-radius: 16px;
          box-shadow:
            0 18px 45px
            rgba(30,45,60,.16);
        }

        .cm-dropdown-option {
          width: 100%;
          min-height: 48px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          box-sizing: border-box;
          border: 0;
          border-radius: 12px;
          background: transparent;
          color: #47617b;
          font-size: 14px;
          font-weight: 600;
          text-align: left;
          cursor: pointer;
          transition: .15s ease;
        }

        .cm-dropdown-option:hover {
          background: #f5f8fb;
        }

        .cm-dropdown-option:active {
          background: #eaf1f7;
        }

        .cm-dropdown-option-active {
          background: #edf3f8;
          color: #20364c;
        }

        .cm-dropdown-empty {
          padding: 14px;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 600;
          text-align: center;
        }

        .cm-zone-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
          border:
            1px solid
            rgba(49,73,96,.35);
        }

        .cm-zone-option-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* ============================
           STATUS / ERROR
        ============================ */

        .cm-status {
          margin:
            4px 0 10px;
          padding:
            9px 11px;
          border-radius: 10px;
          background: #f4f8fb;
          color: #6f89a4;
          font-size: 12px;
          font-weight: 600;
        }

        .cm-error {
          margin:
            4px 0 10px;
          padding:
            9px 11px;
          border-radius: 10px;
          background: #fff1f2;
          color: #dc2626;
          font-size: 12px;
          line-height: 1.4;
          font-weight: 600;
        }

        /* ============================
           SELECTED CARD
        ============================ */

        .cm-selected-card {
          position: absolute;
          z-index: 2000;
          left: 28px;
          bottom: 28px;
          width: 360px;
          padding: 18px 22px;
          box-sizing: border-box;
          background:
            rgba(255,255,255,.97);
          backdrop-filter:
            blur(12px);
          border:
            1px solid #dce4ec;
          border-radius: 18px;
          box-shadow:
            0 15px 40px
            rgba(30,45,60,.09);
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
          border:
            1px solid
            rgba(49,73,96,.3);
        }

        .cm-selected-name {
          margin-top: 9px;
          font-size: 18px;
          font-weight: 700;
          color: #34475b;
        }

        .cm-selected-table {
          margin-top: 7px;
          padding-bottom: 11px;
          border-bottom:
            1px solid #e7edf3;
          font-size: 11px;
          color: #8ba4bf;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .cm-selected-info {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-top: 13px;
        }

        .cm-info-label {
          font-size: 10px;
          font-weight: 700;
          color: #91a7bc;
          text-transform: uppercase;
        }

        .cm-info-value {
          margin-top: 4px;
          font-size: 12px;
          font-weight: 700;
          color: #49627c;
        }

        .cm-reset-button {
          width: 100%;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          margin-top: 4px;
          border:
            1px solid #d4e0ea;
          border-radius: 14px;
          background: #fff;
          color: #4e6a84;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: .2s ease;
        }

        .cm-reset-button:hover {
          background: #f7fafc;
          border-color: #9db5cc;
        }

        /* ============================
           LOADING / ERROR
        ============================ */

        .cm-state {
          position: absolute;
          z-index: 4000;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .cm-state-card {
          padding: 12px 18px;
          border-radius: 12px;
          background:
            rgba(255,255,255,.96);
          border:
            1px solid #dfe7ef;
          box-shadow:
            0 12px 30px
            rgba(0,0,0,.08);
          color: #536a84;
          font-size: 13px;
          font-weight: 600;
        }

        .cm-state-error {
          color: #dc2626;
        }

        @media (max-width: 1100px) {
          .cm-filter-card {
            width: 320px;
          }

          .cm-map-header {
            width: 45%;
          }
        }

        @media (max-width: 800px) {
          .cm-wrapper {
            padding: 12px;
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
            width:
              calc(100% - 32px);
            min-height: 70px;
            padding:
              12px 16px;
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

          <ZoomControl
            position="topleft"
          />

          <InitialCityFit
            cityBoundary={
              cityBoundary
            }
            zones={zones}
          />

          <SelectionFocusController
            selectedZone={
              selectedZone
            }
            selectedDivision={
              selectedDivision
            }
            selectedWard={
              selectedWard
            }
          />

          {/* ============================
              ZONES
          ============================ */}

          <Pane
            name="zonePane"
            style={{
              zIndex: 410,
            }}
          >
            {visibleZones.map(
              (zone, index) => (
                <ZoneLayer
                  key={
                    `zone-${
                      getZoneName(
                        zone
                      )
                    }-${index}`
                  }
                  zone={zone}
                  index={
                    zones.findIndex(
                      (item) =>
                        sameEntity(
                          item,
                          zone,
                          getZoneId,
                          getZoneName
                        )
                    ) >= 0
                      ? zones.findIndex(
                          (item) =>
                            sameEntity(
                              item,
                              zone,
                              getZoneId,
                              getZoneName
                            )
                        )
                      : index
                  }
                  selected={
                    !!selectedZone &&
                    sameEntity(
                      zone,
                      selectedZone,
                      getZoneId,
                      getZoneName
                    )
                  }
                  onSelect={
                    handleZoneSelect
                  }
                />
              )
            )}
          </Pane>

          {/* ============================
              DIVISIONS
          ============================ */}

          {selectedZone &&
            visibleDivisions.length >
              0 && (
              <Pane
                name="divisionPane"
                style={{
                  zIndex: 415,
                }}
              >
                {visibleDivisions.map(
                  (
                    division,
                    index
                  ) => (
                    <DivisionLayer
                      key={
                        `division-${
                          getDivisionTableName(
                            division
                          ) ||
                          getDivisionId(
                            division
                          ) ||
                          getDivisionName(
                            division
                          )
                        }-${index}`
                      }
                      division={
                        division
                      }
                      index={
                        divisions.findIndex(
                          (item) =>
                            sameEntity(
                              item,
                              division,
                              getDivisionId,
                              getDivisionName
                            )
                        ) >= 0
                          ? divisions.findIndex(
                              (item) =>
                                sameEntity(
                                  item,
                                  division,
                                  getDivisionId,
                                  getDivisionName
                                )
                            )
                          : index
                      }
                      selected={
                        !!selectedDivision &&
                        sameEntity(
                          division,
                          selectedDivision,
                          getDivisionId,
                          getDivisionName
                        )
                      }
                      onSelect={
                        (
                          divisionValue
                        ) => {
                          setSelectedDivision(
                            divisionValue
                          );

                          setSelectedWard(
                            null
                          );

                          setWards([]);

                          setWardError("");

                          setOpenDropdown(
                            null
                          );

                          fetchDivisionWards(
                            divisionValue
                          );
                        }
                      }
                    />
                  )
                )}
              </Pane>
            )}

          {/* ============================
              WARDS
          ============================ */}

          {selectedDivision &&
            visibleWards.length >
              0 && (
              <Pane
                name="wardPane"
                style={{
                  zIndex: 418,
                }}
              >
                {visibleWards.map(
                  (
                    ward,
                    index
                  ) => (
                    <WardLayer
                      key={
                        `ward-${
                          getWardId(
                            ward
                          ) ||
                          getWardName(
                            ward
                          )
                        }-${index}`
                      }
                      ward={ward}
                      index={index}
                      selected={
                        !!selectedWard &&
                        sameEntity(
                          ward,
                          selectedWard,
                          getWardId,
                          getWardName
                        )
                      }
                      onSelect={
                        (
                          wardValue
                        ) => {
                          setSelectedWard(
                            wardValue
                          );

                          setOpenDropdown(
                            null
                          );
                        }
                      }
                    />
                  )
                )}
              </Pane>
            )}

          {/* ============================
              CITY OUTLINE
          ============================ */}

          <Pane
            name="cityBoundaryPane"
            style={{
              zIndex: 425,
            }}
          >
            <CityBoundaryLayer
              boundary={
                cityBoundary
              }
            />
          </Pane>
        </MapContainer>


        {/* ====================================================
            MAP VIEW HEADER
        ==================================================== */}

        <div
          className={
            `cm-map-header ${
              showViewMenu
                ? "cm-map-header-open"
                : ""
            }`
          }
        >
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

          <button
            type="button"
            className="cm-header-button"
            onClick={() =>
              setShowViewMenu(
                (current) =>
                  !current
              )
            }
          >
            {showViewMenu ? (
              <ChevronUp
                className="cm-header-chevron"
                size={18}
              />
            ) : (
              <ChevronDown
                className="cm-header-chevron"
                size={18}
              />
            )}
          </button>

          {showViewMenu && (
            <div className="cm-view-menu">
              <button
                type="button"
                className={
                  "cm-view-option cm-view-option-active"
                }
                onClick={() =>
                  setShowViewMenu(
                    false
                  )
                }
              >
                <MapIcon size={18} />
                City Overview Map
              </button>

              <button
                type="button"
                className="cm-view-option"
                onClick={() =>
                  handleMapViewChange(
                    "route"
                  )
                }
              >
                <Route size={18} />
                Route Map
              </button>
            </div>
          )}
        </div>


        {/* ====================================================
            FILTER CARD
        ==================================================== */}

        <div className="cm-filter-card">

          <div className="cm-filter-title">
            MAP FILTERS
          </div>

          {/* ============================
              ZONE
          ============================ */}

          <FilterDropdown
            label="ZONE"
            value={
              selectedZoneName
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
                resetMap();
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
                    sameEntity(
                      zone,
                      option.zone,
                      getZoneId,
                      getZoneName
                    )
                );

              const color =
                ZONE_COLORS[
                  (
                    zoneIndex >=
                    0
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
                    {
                      option.label
                    }
                  </span>
                </>
              );
            }}
          />


          {/* ============================
              DIVISION
          ============================ */}

          <FilterDropdown
            label="DIVISION"
            value={
              selectedDivisionName
            }
            placeholder={
              !selectedZone
                ? "Select a Zone First"
                : divisionsLoading
                  ? "Loading Divisions..."
                  : divisions.length
                    ? "All Divisions"
                    : "No Divisions"
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
            ) => (
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
                {
                  option.label
                }
              </span>
            )}
          />


          {/* ============================
              WARD
          ============================ */}

          <FilterDropdown
            label="WARD"
            value={
              selectedWardName
            }
            placeholder={
              !selectedDivision
                ? "Select a Division First"
                : wardsLoading
                  ? "Loading Wards..."
                  : wards.length
                    ? "All Wards"
                    : "No Wards"
            }
            options={
              wardOptions
            }
            open={
              openDropdown ===
              "WARD"
            }
            setOpen={
              setOpenDropdown
            }
            disabled={
              !selectedDivision ||
              wardsLoading ||
              wards.length === 0
            }
            onChange={
              handleWardSelect
            }
            renderOption={(
              option
            ) => (
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
                {
                  option.label
                }
              </span>
            )}
          />


          {/* ============================
              STATUS
          ============================ */}

          {divisionsLoading && (
            <div className="cm-status">
              Loading divisions for{" "}
              {selectedZoneName}...
            </div>
          )}

          {wardsLoading && (
            <div className="cm-status">
              Loading wards for{" "}
              {selectedDivisionName}...
            </div>
          )}

          {divisionError && (
            <div className="cm-error">
              {divisionError}
            </div>
          )}

          {wardError && (
            <div className="cm-error">
              {wardError}
            </div>
          )}


          {/* ============================
              RESET
          ============================ */}

          {(
            selectedZone ||
            selectedDivision ||
            selectedWard
          ) && (
            <button
              type="button"
              className="cm-reset-button"
              onClick={
                resetMap
              }
            >
              <RotateCcw
                size={16}
              />
              Reset Map
            </button>
          )}
        </div>


        {/* ====================================================
            SELECTION CARD
        ==================================================== */}

        {selectedWard ? (
          <div className="cm-selected-card">
            <div className="cm-selected-label">
              <span
                className="cm-selected-dot"
                style={{
                  backgroundColor:
                    WARD_COLORS[
                      (
                        wards.findIndex(
                          (ward) =>
                            sameEntity(
                              ward,
                              selectedWard,
                              getWardId,
                              getWardName
                            )
                        ) >= 0
                          ? wards.findIndex(
                              (ward) =>
                                sameEntity(
                                  ward,
                                  selectedWard,
                                  getWardId,
                                  getWardName
                                )
                            )
                          : 0
                      ) %
                        WARD_COLORS.length
                    ],
                }}
              />
              SELECTED WARD
            </div>

            <div className="cm-selected-name">
              {
                getWardName(
                  selectedWard
                )
              }
            </div>

            <div className="cm-selected-table">
              Ward ID:{" "}
              {
                getWardId(
                  selectedWard
                ) ?? "—"
              }
            </div>

            <div className="cm-selected-info">
              <div>
                <div className="cm-info-label">
                  City
                </div>
                <div className="cm-info-value">
                  {city?.cityName ||
                    "Bangalore"}
                </div>
              </div>

              <div>
                <div className="cm-info-label">
                  Division
                </div>
                <div className="cm-info-value">
                  {
                    getDivisionName(
                      selectedDivision
                    )
                  }
                </div>
              </div>

              <div>
                <div className="cm-info-label">
                  Wards
                </div>
                <div className="cm-info-value">
                  {wards.length}
                </div>
              </div>
            </div>
          </div>
        ) : selectedDivision ? (
          <div className="cm-selected-card">
            <div className="cm-selected-label">
              <span
                className="cm-selected-dot"
                style={{
                  backgroundColor:
                    DIVISION_COLORS[
                      (
                        divisions.findIndex(
                          (division) =>
                            sameEntity(
                              division,
                              selectedDivision,
                              getDivisionId,
                              getDivisionName
                            )
                        ) >= 0
                          ? divisions.findIndex(
                              (division) =>
                                sameEntity(
                                  division,
                                  selectedDivision,
                                  getDivisionId,
                                  getDivisionName
                                )
                            )
                          : 0
                      ) %
                        DIVISION_COLORS.length
                    ],
                }}
              />
              SELECTED DIVISION
            </div>

            <div className="cm-selected-name">
              {
                getDivisionName(
                  selectedDivision
                )
              }
            </div>

            <div className="cm-selected-table">
              {
                getDivisionTableName(
                  selectedDivision
                ) || "Division"
              }
            </div>

            <div className="cm-selected-info">
              <div>
                <div className="cm-info-label">
                  City
                </div>
                <div className="cm-info-value">
                  {city?.cityName ||
                    "Bangalore"}
                </div>
              </div>

              <div>
                <div className="cm-info-label">
                  Divisions
                </div>
                <div className="cm-info-value">
                  {divisions.length}
                </div>
              </div>

              <div>
                <div className="cm-info-label">
                  Wards
                </div>
                <div className="cm-info-value">
                  {wards.length}
                </div>
              </div>
            </div>
          </div>
        ) : selectedZone ? (
          <div className="cm-selected-card">
            <div className="cm-selected-label">
              <span
                className="cm-selected-dot"
                style={{
                  backgroundColor:
                    ZONE_COLORS[
                      Math.max(
                        0,
                        zones.findIndex(
                          (zone) =>
                            sameEntity(
                              zone,
                              selectedZone,
                              getZoneId,
                              getZoneName
                            )
                        )
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

            <div className="cm-selected-table">
              {
                getZoneTableName(
                  selectedZone
                ) ||
                getZoneName(
                  selectedZone
                )
              }
            </div>

            <div className="cm-selected-info">
              <div>
                <div className="cm-info-label">
                  City
                </div>
                <div className="cm-info-value">
                  {city?.cityName ||
                    "Bangalore"}
                </div>
              </div>

              <div>
                <div className="cm-info-label">
                  Divisions
                </div>
                <div className="cm-info-value">
                  {divisions.length}
                </div>
              </div>

              <div>
                <div className="cm-info-label">
                  Wards
                </div>
                <div className="cm-info-value">
                  {divisions.reduce(
                    (
                      total,
                      division
                    ) =>
                      total +
                      (
                        Array.isArray(
                          division?.wards
                        )
                          ? division.wards.length
                          : 0
                      ),
                    0
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}


        {/* ====================================================
            LOADING / ERROR
        ==================================================== */}

        {loading && (
          <div className="cm-state">
            <div className="cm-state-card">
              Loading city map...
            </div>
          </div>
        )}

        {!loading &&
          error && (
            <div className="cm-state">
              <div
                className={
                  "cm-state-card cm-state-error"
                }
              >
                {error}
              </div>
            </div>
          )}

      </div>
    </section>
  );
}