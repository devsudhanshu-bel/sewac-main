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
  MapPinned,
  Factory,
  MessageSquareWarning,
} from "lucide-react";

import { createPortal } from "react-dom";

import Plants from "../plants/Plants";
import CustomerGrev from "./CustomerGrev";
import GVPOverviewMap from "./GVPOverviewMap";

import { useFilters } from "../../contexts/FilterContext";

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
   PLANTS ENDPOINT
============================================================ */

const PLANTS_ENDPOINT = `${API_BASE_URL}/api/plants`;

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

function normalizeCoordinatePair(pair) {
  if (!isCoordinatePair(pair)) {
    return pair;
  }

  const first = Number(pair[0]);
  const second = Number(pair[1]);

  /*
   * Bengaluru:
   *
   * latitude  ≈ 13
   * longitude ≈ 77
   *
   * If backend gives [lat, lng],
   * convert to GeoJSON [lng, lat].
   */

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
  if (isCoordinatePair(value)) {
    return normalizeCoordinatePair(value);
  }

  if (Array.isArray(value)) {
    return value.map(normalizeCoordinates);
  }

  return value;
}

function normalizeGeoJSON(value) {
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
        ? parsed.features
            .map((feature) =>
              normalizeGeoJSON(feature)
            )
            .filter(Boolean)
        : [],
    };
  }

  /*
   * Feature
   */

  if (parsed.type === "Feature") {
    if (!parsed.geometry) {
      return null;
    }

    return {
      ...parsed,

      geometry: normalizeGeoJSON(
        parsed.geometry
      ),
    };
  }

  /*
   * GeometryCollection
   */

  if (
    parsed.type ===
    "GeometryCollection"
  ) {
    return {
      ...parsed,

      geometries: Array.isArray(
        parsed.geometries
      )
        ? parsed.geometries
            .map(normalizeGeoJSON)
            .filter(Boolean)
        : [],
    };
  }

  /*
   * Geometry object
   */

  if (
    parsed.type &&
    parsed.coordinates
  ) {
    return {
      ...parsed,

      coordinates:
        normalizeCoordinates(
          parsed.coordinates
        ),
    };
  }

  /*
   * Raw coordinates
   */

  if (Array.isArray(parsed)) {
    return {
      type: "Feature",

      properties: {},

      geometry: {
        type: "Polygon",

        coordinates:
          normalizeCoordinates(parsed),
      },
    };
  }

  /*
   * Object containing geometry
   */

  if (
    parsed.geometry &&
    typeof parsed.geometry ===
      "object"
  ) {
    return normalizeGeoJSON({
      type: "Feature",

      properties:
        parsed.properties || {},

      geometry: parsed.geometry,
    });
  }

  /*
   * Object containing coordinates
   */

  if (parsed.coordinates) {
    return {
      type: "Feature",

      properties:
        parsed.properties || {},

      geometry: {
        type:
          parsed.type ||
          "Polygon",

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

function getWardName(ward) {
  return (
    ward?.wardName ||
    ward?.ward_name ||
    ward?.name ||
    (ward?.wardNo !== undefined
      ? `Ward ${ward.wardNo}`
      : "Unnamed Ward")
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

  const firstId =
    getId(first);

  const secondId =
    getId(second);

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

function extractArray(
  result,
  key
) {
  if (
    Array.isArray(result?.[key])
  ) {
    return result[key];
  }

  if (
    Array.isArray(
      result?.data?.[key]
    )
  ) {
    return result.data[key];
  }

  if (
    Array.isArray(result?.data)
  ) {
    return result.data;
  }

  if (Array.isArray(result)) {
    return result;
  }

  return [];
}

/* ============================================================
   MAP SIZE CONTROLLER
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

    const resizeHandler = () => {
      map.invalidateSize();
    };

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

  const fitted =
    useRef(false);

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
      index <
      zoneBounds.length;
      index += 1
    ) {
      combined.extend(
        zoneBounds[index]
      );
    }

    if (
      combined.isValid()
    ) {
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

  const previous =
    useRef("");

  useEffect(() => {
    let target = null;
    let key = "";

    if (selectedWard) {
      target =
        getWardBoundary(
          selectedWard
        );

      key = `ward:${
        getWardId(
          selectedWard
        ) ||
        getWardName(
          selectedWard
        )
      }`;
    } else if (
      selectedDivision
    ) {
      target =
        getDivisionBoundary(
          selectedDivision
        );

      key = `division:${
        getDivisionId(
          selectedDivision
        ) ||
        getDivisionName(
          selectedDivision
        )
      }`;
    } else if (
      selectedZone
    ) {
      target =
        getZoneBoundary(
          selectedZone
        );

      key = `zone:${
        getZoneId(
          selectedZone
        ) ||
        getZoneName(
          selectedZone
        )
      }`;
    } else {
      previous.current = "";
      return;
    }

    if (
      previous.current === key
    ) {
      return;
    }

    previous.current = key;

    const bounds =
      getGeoJSONBounds(target);

    if (
      !bounds ||
      !bounds.isValid()
    ) {
      return;
    }

    let padding = [
      90,
      90,
    ];

    let maxZoom = 13;

    if (selectedDivision) {
      padding = [
        100,
        100,
      ];

      maxZoom = 15;
    }

    if (selectedWard) {
      padding = [
        120,
        120,
      ];

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
      key={`zone-${
        getZoneTableName(zone) ||
        getZoneName(zone)
      }-${index}`}
      data={boundary}
      style={() => ({
        color: selected
          ? "#1F354A"
          : "#40556B",

        weight: selected
          ? 4.2
          : 2.4,

        opacity: 1,

        fillColor: selected
          ? "transparent"
          : color,

        fillOpacity: selected
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
      key={`division-${
        getDivisionTableName(
          division
        ) ||
        getDivisionId(
          division
        ) ||
        getDivisionName(
          division
        )
      }-${index}`}
      data={boundary}
      style={() => ({
        color: selected
          ? "#172B3F"
          : "#52677C",

        weight: selected
          ? 3.5
          : 1.8,

        opacity: 1,

        fillColor: color,

        fillOpacity: selected
          ? 0.64
          : 0.3,

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
      key={`ward-${
        getWardId(ward) ||
        getWardName(ward)
      }-${index}`}
      data={boundary}
      style={() => ({
        color: selected
          ? "#142536"
          : "#536A7E",

        weight: selected
          ? 3.2
          : 1.5,

        opacity: 1,

        fillColor: color,

        fillOpacity: selected
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
   PORTAL FILTER DROPDOWN
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
  const buttonRef =
    useRef(null);

  const menuRef =
    useRef(null);

  const [
    position,
    setPosition,
  ] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const updatePosition =
    useCallback(() => {
      if (!buttonRef.current) {
        return;
      }

      const rect =
        buttonRef.current.getBoundingClientRect();

      setPosition({
        top:
          rect.bottom + 7,
        left: rect.left,
        width: rect.width,
      });
    }, []);

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    updatePosition();

    const handlePosition =
      () => updatePosition();

    window.addEventListener(
      "resize",
      handlePosition
    );

    window.addEventListener(
      "scroll",
      handlePosition,
      true
    );

    return () => {
      window.removeEventListener(
        "resize",
        handlePosition
      );

      window.removeEventListener(
        "scroll",
        handlePosition,
        true
      );
    };
  }, [
    open,
    updatePosition,
  ]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleOutsideClick =
      (event) => {
        if (
          buttonRef.current?.contains(
            event.target
          )
        ) {
          return;
        }

        if (
          menuRef.current?.contains(
            event.target
          )
        ) {
          return;
        }

        setOpen(null);
      };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, [
    open,
    setOpen,
  ]);

  const handleOptionClick =
    (option) => {
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
            className="
              fixed
              z-[2147483647]
              max-h-[300px]
              overflow-y-auto
              rounded-[13px]
              border
              border-[#DCE5EE]
              bg-white
              p-1
              shadow-[0_16px_38px_rgba(30,45,60,0.16)]
            "
            style={{
              top: position.top,
              left: position.left,
              width: position.width,
            }}
          >
            {options.length ===
            0 ? (
              <div
                className="
                  px-3
                  py-3
                  text-center
                  text-[11px]
                  font-semibold
                  text-slate-400
                "
              >
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
                      key={`${optionValue}-${index}`}
                      className={`
                        flex
                        min-h-[40px]
                        w-full
                        items-center
                        gap-2
                        rounded-[9px]
                        px-2.5
                        py-2
                        text-left
                        text-[12px]
                        font-semibold
                        transition
                        ${
                          selectedOption
                            ? "bg-[#EDF3F8] text-[#20364C]"
                            : "text-[#47617B] hover:bg-[#F5F8FB]"
                        }
                      `}
                      onMouseDown={(
                        event
                      ) => {
                        event.stopPropagation();
                      }}
                      onClick={() =>
                        handleOptionClick(
                          option
                        )
                      }
                    >
                      {renderOption ? (
                        renderOption(
                          option,
                          index
                        )
                      ) : (
                        <span className="truncate">
                          {optionLabel}
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
    <div className="relative mb-[13px]">
      <div
        className="
          mb-1.5
          text-[11px]
          font-bold
          tracking-[0.15px]
          text-[#8BA4BF]
        "
      >
        {label}
      </div>

      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        className={`
          flex
          h-12
          w-full
          items-center
          justify-between
          rounded-[13px]
          border
          px-3.5
          text-left
          text-[13px]
          font-semibold
          transition
          ${
            disabled
              ? "cursor-not-allowed border-[#DCE5EE] bg-[#F8FAFC] text-[#A4B2C0] opacity-70"
              : "cursor-pointer border-[#CFDDEA] bg-white text-[#435B73] hover:border-[#91AFD0]"
          }
        `}
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
          className="
            min-w-0
            overflow-hidden
            text-ellipsis
            whitespace-nowrap
          "
        >
          {value ||
            placeholder}
        </span>

        {open ? (
          <ChevronUp
            size={14}
            className="shrink-0"
          />
        ) : (
          <ChevronDown
            size={14}
            className="shrink-0"
          />
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
  selectedDate,
}) {
  /* ==========================================================
     GLOBAL HEADER FILTERS
  ========================================================== */

  const {
    selectedCity: headerSelectedCity,
    selectedZone: headerSelectedZone,
    selectedDivision:
      headerSelectedDivision,
    selectedWard: headerSelectedWard,
  } = useFilters();

  /*
   * These values intentionally remain connected
   * to FilterContext so this component does not
   * maintain another global filter system.
   */

  void headerSelectedCity;
  void headerSelectedZone;
  void headerSelectedDivision;
  void headerSelectedWard;

  /* ==========================================================
     STATE
  ========================================================== */

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

  /* ==========================================================
     MAP VIEW
  ========================================================== */

  const [
    mapView,
    setMapView,
  ] = useState("overview");

  /* ==========================================================
     PLANTS STATE
  ========================================================== */

  const [
    plants,
    setPlants,
  ] = useState([]);

  const [
    plantsLoading,
    setPlantsLoading,
  ] = useState(false);

  const [
    plantsError,
    setPlantsError,
  ] = useState("");

  /* ==========================================================
     REFS
  ========================================================== */

  const mapRef =
    useRef(null);

  const divisionAbortRef =
    useRef(null);

  const wardAbortRef =
    useRef(null);

  const plantsAbortRef =
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

          setSelectedZone(
            null
          );

          setDivisions(
            []
          );

          setSelectedDivision(
            null
          );

          setWards(
            []
          );

          setSelectedWard(
            null
          );

          setDivisionError(
            ""
          );

          setWardError(
            ""
          );

          setOpenDropdown(
            null
          );

          console.log(
            "✅ CITY MAP LOADED",
            {
              city:
                loadedCity?.cityName,

              zones:
                loadedZones.length,
            }
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

      plantsAbortRef.current?.abort();
    };
  }, [
    fetchCityMapData,
  ]);

  /* ==========================================================
     FETCH ZONE DIVISIONS
  ========================================================== */

  const fetchZoneDivisions =
    useCallback(
      async (zone) => {
        divisionAbortRef.current?.abort();

        wardAbortRef.current?.abort();

        if (!zone) {
          setDivisions(
            []
          );

          setSelectedDivision(
            null
          );

          setWards(
            []
          );

          setSelectedWard(
            null
          );

          setDivisionError(
            ""
          );

          setWardError(
            ""
          );

          return;
        }

        const zoneTableName =
          getZoneTableName(
            zone
          );

        if (!zoneTableName) {
          setDivisions(
            []
          );

          setSelectedDivision(
            null
          );

          setDivisionError(
            "Selected zone does not contain a valid zoneTableName."
          );

          return;
        }

        const controller =
          new AbortController();

        divisionAbortRef.current =
          controller;

        setDivisionsLoading(
          true
        );

        setDivisionError(
          ""
        );

        setDivisions(
          []
        );

        setSelectedDivision(
          null
        );

        setWards(
          []
        );

        setSelectedWard(
          null
        );

        setWardError(
          ""
        );

        const endpoint =
          ZONE_DIVISIONS_ENDPOINT(
            zoneTableName
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

          setDivisions(
            []
          );

          setDivisionError(
            requestError?.message ||
              "Unable to load divisions."
          );
        } finally {
          if (
            !controller.signal
              .aborted
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
     FETCH DIVISION WARDS
  ========================================================== */

  const fetchDivisionWards =
    useCallback(
      async (division) => {
        wardAbortRef.current?.abort();

        if (!division) {
          setWards(
            []
          );

          setSelectedWard(
            null
          );

          setWardError(
            ""
          );

          return;
        }

        const divisionTableName =
          getDivisionTableName(
            division
          );

        if (!divisionTableName) {
          setWards(
            []
          );

          setSelectedWard(
            null
          );

          setWardError(
            "Selected division does not contain a valid divisionTableName."
          );

          return;
        }

        const controller =
          new AbortController();

        wardAbortRef.current =
          controller;

        setWardsLoading(
          true
        );

        setWardError(
          ""
        );

        setWards(
          []
        );

        setSelectedWard(
          null
        );

        const endpoint =
          DIVISION_WARDS_ENDPOINT(
            divisionTableName
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

          setWards(
            []
          );

          setWardError(
            requestError?.message ||
              "Unable to load wards."
          );
        } finally {
          if (
            !controller.signal
              .aborted
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

        setSelectedZone(
          zone
        );

        setSelectedDivision(
          null
        );

        setSelectedWard(
          null
        );

        setDivisions(
          []
        );

        setWards(
          []
        );

        setDivisionError(
          ""
        );

        setWardError(
          ""
        );

        setOpenDropdown(
          null
        );

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
          setSelectedDivision(
            null
          );

          setSelectedWard(
            null
          );

          setWards(
            []
          );

          setOpenDropdown(
            null
          );

          return;
        }

        const division =
          option.division;

        setSelectedDivision(
          division
        );

        setSelectedWard(
          null
        );

        setWards(
          []
        );

        setWardError(
          ""
        );

        setOpenDropdown(
          null
        );

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
          setSelectedWard(
            null
          );

          setOpenDropdown(
            null
          );

          return;
        }

        setSelectedWard(
          option.ward
        );

        setOpenDropdown(
          null
        );
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
     FETCH PLANTS
  ========================================================== */

  const fetchPlants =
    useCallback(
      async () => {
        plantsAbortRef.current?.abort();

        const controller =
          new AbortController();

        plantsAbortRef.current =
          controller;

        try {
          setPlantsLoading(
            true
          );

          setPlantsError(
            ""
          );

          const response =
            await fetch(
              PLANTS_ENDPOINT,
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
              `Plants request failed with status ${response.status}`
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
                "Unable to fetch plants."
            );
          }

          const loadedPlants =
            Array.isArray(
              result?.plants
            )
              ? result.plants
              : Array.isArray(
                  result?.data
                )
                ? result.data
                : Array.isArray(
                    result
                  )
                  ? result
                  : [];

          setPlants(
            loadedPlants
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
            "❌ PLANTS ERROR:",
            requestError
          );

          setPlantsError(
            requestError?.message ||
              "Unable to load plants."
          );
        } finally {
          if (
            !controller.signal
              .aborted
          ) {
            setPlantsLoading(
              false
            );
          }
        }
      },
      []
    );

  useEffect(() => {
    if (
      mapView !==
      "plants"
    ) {
      return;
    }

    if (
      plants.length > 0
    ) {
      return;
    }

    fetchPlants();
  }, [
    mapView,
    plants.length,
    fetchPlants,
  ]);

  /* ==========================================================
     FILTER OPTIONS
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
     VISIBLE ZONES
  ========================================================== */

  const visibleZones =
    useMemo(() => {
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
    }, [
      zones,
      selectedZone,
    ]);

  /* ==========================================================
     VISIBLE DIVISIONS
  ========================================================== */

  const visibleDivisions =
    useMemo(() => {
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
    }, [
      selectedZone,
      selectedDivision,
      divisions,
    ]);

  /* ==========================================================
     VISIBLE WARDS
  ========================================================== */

  const visibleWards =
    useMemo(() => {
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
    }, [
      selectedDivision,
      selectedWard,
      wards,
    ]);

  /* ==========================================================
     RESET MAP
  ========================================================== */

  const resetMap =
    useCallback(() => {
      setSelectedZone(
        null
      );

      setSelectedDivision(
        null
      );

      setSelectedWard(
        null
      );

      setDivisions(
        []
      );

      setWards(
        []
      );

      setDivisionError(
        ""
      );

      setWardError(
        ""
      );

      setOpenDropdown(
        null
      );

      setShowViewMenu(
        false
      );

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
     MAP VIEW CHANGE
  ========================================================== */

  const handleMapViewChange =
    useCallback(
      (view) => {
        setShowViewMenu(
          false
        );

        setOpenDropdown(
          null
        );

        /*
         * Route Maps still
         * uses the existing
         * dedicated page.
         */

        if (
          view ===
          "route"
        ) {
          if (
            typeof onViewChange ===
            "function"
          ) {
            onViewChange(
              view
            );
          }

          window.location.href =
            "/admin/route-map";

          return;
        }

        setMapView(
          view
        );

        if (
          typeof onViewChange ===
          "function"
        ) {
          onViewChange(
            view
          );
        }

        /*
         * Returning to City Overview
         * resets map selection.
         */

        if (
          view ===
          "overview"
        ) {
          setSelectedZone(
            null
          );

          setSelectedDivision(
            null
          );

          setSelectedWard(
            null
          );

          setDivisions(
            []
          );

          setWards(
            []
          );

          setDivisionError(
            ""
          );

          setWardError(
            ""
          );
        }
      },
      [onViewChange]
    );

  /* ==========================================================
     VIEW MENU OPTIONS
  ========================================================== */

  const mapViewOptions =
    [
      {
        id: "overview",
        label:
          "City Overview Map",
        icon: MapIcon,
      },

      {
        id: "route",
        label:
          "Route Maps",
        icon: Route,
      },

      {
        id: "gvp",
        label:
          "GVP Points",
        icon: MapPinned,
      },

      {
        id: "plants",
        label:
          "Plants",
        icon: Factory,
      },

      {
        id: "grievances",
        label:
          "Customer Grievances",
        icon:
          MessageSquareWarning,
      },
    ];

  const currentView =
    mapViewOptions.find(
      (option) =>
        option.id ===
        mapView
    ) ||
    mapViewOptions[0];

  const CurrentViewIcon =
    currentView.icon;

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <section
      className="
        relative
        w-full
        box-border
        rounded-[18px]
        border
        border-[#DCE4EC]
        bg-white
        p-2.5
        sm:p-3
        md:p-3.5
        shadow-[0_4px_18px_rgba(31,45,61,0.05)]
      "
    >
      {/* ====================================================
          PAGE HEADING
      ==================================================== */}

      <h2
        className="
          mb-2.5
          ml-0.5
          truncate
          text-[18px]
          font-bold
          leading-[1.15]
          tracking-[-0.3px]
          text-[#07111F]
          sm:text-[20px]
          lg:text-[21px]
        "
      >
        OVERVIEW MAPS
      </h2>

      {/* ====================================================
          MAP SHELL
      ==================================================== */}

      <div
        className="
          relative
          h-[520px]
          min-h-[520px]
          w-full
          overflow-hidden
          rounded-[18px]
          border
          border-[#DCE4EC]
          bg-[#EEF1F3]

          sm:h-[560px]
          sm:min-h-[560px]

          md:h-[600px]
          md:min-h-[600px]

          lg:h-[600px]
          lg:min-h-[600px]

          xl:h-[620px]
          xl:min-h-[620px]
        "
      >
        {/* ==================================================
            CITY OVERVIEW MAP
        ================================================== */}

        {mapView ===
          "overview" && (
          <MapContainer
            ref={mapRef}
            center={[
              12.9716,
              77.5946,
            ]}
            zoom={10}
            zoomControl={false}
            className="
              !h-full
              !w-full

              [&_.leaflet-container]:!h-full
              [&_.leaflet-container]:!w-full

              [&_.leaflet-tile-pane]:[filter:saturate(.42)_brightness(1.05)]

              [&_.leaflet-control-attribution]:text-[9px]
              [&_.leaflet-control-attribution]:bg-white/80

              [&_.leaflet-control-zoom]:mt-3
              [&_.leaflet-control-zoom]:ml-3
              [&_.leaflet-control-zoom]:overflow-hidden
              [&_.leaflet-control-zoom]:rounded-lg
              [&_.leaflet-control-zoom]:border
              [&_.leaflet-control-zoom]:border-[#D8E1EA]
              [&_.leaflet-control-zoom]:shadow-[0_3px_12px_rgba(36,53,72,0.08)]

              [&_.leaflet-control-zoom_a]:!h-[30px]
              [&_.leaflet-control-zoom_a]:!w-[30px]
              [&_.leaflet-control-zoom_a]:!leading-[30px]
              [&_.leaflet-control-zoom_a]:!bg-white
              [&_.leaflet-control-zoom_a]:!text-[17px]
              [&_.leaflet-control-zoom_a]:!text-[#34475B]
            "
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

            {/* ==================================================
                ZONES
            ================================================== */}

            <Pane
              name="zonePane"
              style={{
                zIndex: 410,
              }}
            >
              {visibleZones.map(
                (
                  zone,
                  index
                ) => {
                  const actualIndex =
                    zones.findIndex(
                      (item) =>
                        sameEntity(
                          item,
                          zone,
                          getZoneId,
                          getZoneName
                        )
                    );

                  return (
                    <ZoneLayer
                      key={`zone-${getZoneName(
                        zone
                      )}-${index}`}
                      zone={zone}
                      index={
                        actualIndex >=
                        0
                          ? actualIndex
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
                  );
                }
              )}
            </Pane>

            {/* ==================================================
                DIVISIONS
            ================================================== */}

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
                    ) => {
                      const actualIndex =
                        divisions.findIndex(
                          (item) =>
                            sameEntity(
                              item,
                              division,
                              getDivisionId,
                              getDivisionName
                            )
                        );

                      return (
                        <DivisionLayer
                          key={`division-${
                            getDivisionTableName(
                              division
                            ) ||
                            getDivisionId(
                              division
                            ) ||
                            getDivisionName(
                              division
                            )
                          }-${index}`}
                          division={
                            division
                          }
                          index={
                            actualIndex >=
                            0
                              ? actualIndex
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
                          onSelect={(
                            divisionValue
                          ) => {
                            setSelectedDivision(
                              divisionValue
                            );

                            setSelectedWard(
                              null
                            );

                            setWards(
                              []
                            );

                            setWardError(
                              ""
                            );

                            setOpenDropdown(
                              null
                            );

                            fetchDivisionWards(
                              divisionValue
                            );
                          }}
                        />
                      );
                    }
                  )}
                </Pane>
              )}

            {/* ==================================================
                WARDS
            ================================================== */}

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
                        key={`ward-${
                          getWardId(
                            ward
                          ) ||
                          getWardName(
                            ward
                          )
                        }-${index}`}
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
                        onSelect={(
                          wardValue
                        ) => {
                          setSelectedWard(
                            wardValue
                          );

                          setOpenDropdown(
                            null
                          );
                        }}
                      />
                    )
                  )}
                </Pane>
              )}

            {/* ==================================================
                CITY OUTLINE
            ================================================== */}

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
        )}

        {/* ====================================================
            PLANTS MAP
        ==================================================== */}

        {mapView ===
          "plants" && (
          <div
            className="
              absolute
              inset-0
              h-full
              w-full
              min-h-full
              overflow-hidden
              bg-[#EEF1F3]

              [&_.mt-8]:!m-0
              [&_.mt-8]:!h-full
              [&_.mt-8]:!min-h-full
              [&_.mt-8]:!w-full
              [&_.mt-8]:!rounded-none
              [&_.mt-8]:!border-0
              [&_.mt-8]:!bg-transparent
              [&_.mt-8]:!p-0
              [&_.mt-8]:!shadow-none

              [&_.mt-8>.flex.items-center.justify-between]:!hidden

              [&_.mt-8>.overflow-hidden]:!m-0
              [&_.mt-8>.overflow-hidden]:!h-full
              [&_.mt-8>.overflow-hidden]:!w-full
              [&_.mt-8>.overflow-hidden]:!rounded-none

              [&_.leaflet-container]:!h-full
              [&_.leaflet-container]:!min-h-full
              [&_.leaflet-container]:!w-full
            "
          >
            {plantsLoading ? (
              <div
                className="
                  flex
                  h-full
                  w-full
                  items-center
                  justify-center
                  p-8
                  text-[12px]
                  font-semibold
                  text-[#536A84]
                "
              >
                Loading plant locations...
              </div>
            ) : plantsError ? (
              <div
                className="
                  flex
                  h-full
                  w-full
                  items-center
                  justify-center
                  p-6
                  sm:p-8
                "
              >
                <div
                  className="
                    w-full
                    max-w-[420px]
                    rounded-2xl
                    border
                    border-[#DCE4EC]
                    bg-white/97
                    p-6
                    text-center
                    shadow-[0_12px_30px_rgba(30,45,60,0.08)]
                    sm:p-7
                  "
                >
                  <div
                    className="
                      mx-auto
                      mb-3.5
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      bg-violet-100
                      text-violet-600
                    "
                  >
                    <Factory
                      size={30}
                    />
                  </div>

                  <div
                    className="
                      text-[16px]
                      font-bold
                      text-[#34475B]
                    "
                  >
                    Unable to Load Plants
                  </div>

                  <div
                    className="
                      mt-2
                      text-[12px]
                      leading-5
                      text-[#8AA1BB]
                    "
                  >
                    {plantsError}
                  </div>
                </div>
              </div>
            ) : (
              <Plants
                plants={plants}
              />
            )}
          </div>
        )}

        {/* ====================================================
            CUSTOMER GRIEVANCES
        ==================================================== */}

        {mapView ===
          "grievances" && (
          <div
            className="
              absolute
              inset-0
              h-full
              w-full
              min-h-full
              overflow-auto
              bg-[#EEF1F3]
            "
          >
            <CustomerGrev />
          </div>
        )}

        {/* ====================================================
            GVP POINTS MAP
        ==================================================== */}

        {mapView ===
          "gvp" && (
          <div
            className="
              absolute
              inset-0
              h-full
              w-full
              min-h-0
              overflow-hidden
            "
          >
            <GVPOverviewMap
              selectedDate={
                selectedDate
              }
            />
          </div>
        )}

        {/* ====================================================
            CITY OVERVIEW DROPDOWN HEADER
        ==================================================== */}

        <div
          className={`
            absolute
            left-3
            top-3
            z-[2000]
            flex
            min-h-[64px]
            w-[calc(100%-24px)]
            items-center
            justify-between
            rounded-2xl
            border
            border-white/80
            bg-white/97
            px-3
            py-2.5
            shadow-[0_12px_30px_rgba(30,45,60,0.07)]
            backdrop-blur-xl

            sm:left-[18px]
            sm:top-[18px]
            sm:w-[min(50%,540px)]
            sm:px-[18px]
            sm:py-[13px]

            ${
              showViewMenu
                ? "z-[3001]"
                : ""
            }
          `}
        >
          <div
            className="
              flex
              min-w-0
              items-center
              gap-2.5
              sm:gap-3
            "
          >
            <CurrentViewIcon
              className="
                h-7
                w-7
                shrink-0
                text-[#617B98]
                sm:h-[29px]
                sm:w-[29px]
              "
              strokeWidth={1.8}
            />

            <div className="min-w-0">
              <div
                className="
                  truncate
                  text-[16px]
                  font-bold
                  leading-[1.1]
                  text-[#34475B]
                  sm:text-[19px]
                "
              >
                {currentView.label}
              </div>

              {mapView ===
                "overview" &&
                city?.cityName && (
                  <div
                    className="
                      mt-0.5
                      text-[9px]
                      font-semibold
                      text-[#8AA1BB]
                      sm:mt-[3px]
                      sm:text-[11px]
                    "
                  >
                    {city.cityName}
                  </div>
                )}

              {mapView ===
                "plants" && (
                <div
                  className="
                    mt-0.5
                    text-[9px]
                    font-semibold
                    text-[#8AA1BB]
                    sm:mt-[3px]
                    sm:text-[11px]
                  "
                >
                  Plant Locations
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            className="
              flex
              h-[30px]
              w-[30px]
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-[#34475B]
              transition
              hover:bg-[#F3F7FA]
            "
            onClick={() =>
              setShowViewMenu(
                (current) =>
                  !current
              )
            }
          >
            {showViewMenu ? (
              <ChevronUp
                size={16}
              />
            ) : (
              <ChevronDown
                size={16}
              />
            )}
          </button>

          {/* ==================================================
              VIEW OPTIONS
          ================================================== */}

          {showViewMenu && (
            <div
              className="
                absolute
                right-1
                top-[calc(100%+7px)]
                z-[3000]
                w-[210px]
                rounded-[13px]
                border
                border-[#DCE5EE]
                bg-white/99
                p-1.5
                shadow-[0_16px_35px_rgba(30,45,60,0.14)]
                backdrop-blur-xl

                sm:right-2.5
                sm:w-[225px]
              "
            >
              {mapViewOptions.map(
                (option) => {
                  const OptionIcon =
                    option.icon;

                  const isActive =
                    option.id ===
                    mapView;

                  return (
                    <button
                      key={
                        option.id
                      }
                      type="button"
                      className={`
                        flex
                        min-h-[40px]
                        w-full
                        items-center
                        gap-2
                        rounded-[9px]
                        px-2.5
                        py-2
                        text-left
                        text-[11px]
                        font-semibold
                        transition
                        sm:text-[12.5px]

                        ${
                          isActive
                            ? "bg-[#EDF3F8] text-[#20364C]"
                            : "text-[#40556B] hover:bg-[#F4F7FA]"
                        }
                      `}
                      onClick={() =>
                        handleMapViewChange(
                          option.id
                        )
                      }
                    >
                      <OptionIcon
                        size={16}
                        strokeWidth={1.9}
                        className="shrink-0"
                      />

                      <span className="truncate">
                        {
                          option.label
                        }
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          )}
        </div>

        {/* ====================================================
            MAP FILTERS
        ==================================================== */}

        {mapView ===
          "overview" && (
          <div
            className="
              absolute
              bottom-3
              left-3
              right-3
              z-[2000]
              max-h-[300px]
              overflow-y-auto
              rounded-2xl
              border
              border-white/80
              bg-white/97
              p-3
              shadow-[0_12px_30px_rgba(30,45,60,0.08)]
              backdrop-blur-xl

              sm:bottom-auto
              sm:left-auto
              sm:right-[18px]
              sm:top-[18px]
              sm:w-[300px]
              sm:max-h-none
              sm:overflow-visible
              sm:p-[18px]

              lg:w-[330px]
            "
          >
            <div
              className="
                mb-3
                text-[14px]
                font-bold
                text-[#34475B]
                sm:mb-3.5
                sm:text-[15px]
              "
            >
              MAP FILTERS
            </div>

            {/* ==================================================
                ZONE
            ================================================== */}

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
                      className="
                        h-2.5
                        w-2.5
                        shrink-0
                        rounded-full
                        border
                        border-[#314960]/35
                      "
                      style={{
                        backgroundColor:
                          color,
                      }}
                    />

                    <span
                      className="
                        min-w-0
                        overflow-hidden
                        text-ellipsis
                        whitespace-nowrap
                      "
                    >
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
            ================================================== */}

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
                divisions.length ===
                  0
              }
              onChange={
                handleDivisionSelect
              }
              renderOption={(
                option
              ) => (
                <span
                  className="
                    min-w-0
                    overflow-hidden
                    text-ellipsis
                    whitespace-nowrap
                  "
                >
                  {
                    option.label
                  }
                </span>
              )}
            />

            {/* ==================================================
                WARD
            ================================================== */}

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
                wards.length ===
                  0
              }
              onChange={
                handleWardSelect
              }
              renderOption={(
                option
              ) => (
                <span
                  className="
                    min-w-0
                    overflow-hidden
                    text-ellipsis
                    whitespace-nowrap
                  "
                >
                  {
                    option.label
                  }
                </span>
              )}
            />

            {/* ==================================================
                STATUS
            ================================================== */}

            {divisionsLoading && (
              <div
                className="
                  mb-2
                  rounded-[9px]
                  bg-[#F4F8FB]
                  px-2.5
                  py-1.5
                  text-[10px]
                  font-semibold
                  text-[#6F89A4]
                  sm:text-[10.5px]
                "
              >
                Loading divisions for{" "}
                {
                  selectedZoneName
                }
                ...
              </div>
            )}

            {wardsLoading && (
              <div
                className="
                  mb-2
                  rounded-[9px]
                  bg-[#F4F8FB]
                  px-2.5
                  py-1.5
                  text-[10px]
                  font-semibold
                  text-[#6F89A4]
                  sm:text-[10.5px]
                "
              >
                Loading wards for{" "}
                {
                  selectedDivisionName
                }
                ...
              </div>
            )}

            {divisionError && (
              <div
                className="
                  mb-2
                  rounded-[9px]
                  bg-rose-50
                  px-2.5
                  py-1.5
                  text-[10px]
                  font-semibold
                  leading-4
                  text-red-600
                  sm:text-[10.5px]
                "
              >
                {
                  divisionError
                }
              </div>
            )}

            {wardError && (
              <div
                className="
                  mb-2
                  rounded-[9px]
                  bg-rose-50
                  px-2.5
                  py-1.5
                  text-[10px]
                  font-semibold
                  leading-4
                  text-red-600
                  sm:text-[10.5px]
                "
              >
                {
                  wardError
                }
              </div>
            )}

            {/* ==================================================
                RESET
            ================================================== */}

            {(
              selectedZone ||
              selectedDivision ||
              selectedWard
            ) && (
              <button
                type="button"
                className="
                  mt-0.5
                  flex
                  h-11
                  w-full
                  items-center
                  justify-center
                  gap-1.5
                  rounded-[11px]
                  border
                  border-[#D4E0EA]
                  bg-white
                  text-[11px]
                  font-bold
                  text-[#4E6A84]
                  transition
                  hover:border-[#9DB5CC]
                  hover:bg-[#F7FAFC]
                  sm:text-[12px]
                "
                onClick={
                  resetMap
                }
              >
                <RotateCcw
                  size={14}
                />

                Reset Map
              </button>
            )}
          </div>
        )}

        {/* ====================================================
            SELECTED WARD / DIVISION / ZONE CARD
        ==================================================== */}

        {mapView ===
          "overview" &&
          (selectedWard ? (
            <div
              className="
                absolute
                bottom-3
                left-3
                z-[2000]
                hidden
                w-[340px]
                rounded-[15px]
                border
                border-[#DCE4EC]
                bg-white/97
                p-[15px_18px]
                shadow-[0_12px_30px_rgba(30,45,60,0.08)]
                backdrop-blur-xl

                md:block
                lg:bottom-[18px]
                lg:left-[18px]
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[10px]
                  font-bold
                  text-[#8AA1BB]
                "
              >
                <span
                  className="
                    h-2.5
                    w-2.5
                    rounded-full
                    border
                    border-[#314960]/30
                  "
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
                                (
                                  ward
                                ) =>
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

              <div
                className="
                  mt-1.5
                  text-[16px]
                  font-bold
                  text-[#34475B]
                "
              >
                {
                  getWardName(
                    selectedWard
                  )
                }
              </div>

              <div
                className="
                  mt-1
                  overflow-hidden
                  border-b
                  border-[#E7EDF3]
                  pb-2
                  text-[10px]
                  text-[#8BA4BF]
                  text-ellipsis
                  whitespace-nowrap
                "
              >
                Ward ID:{" "}
                {
                  getWardId(
                    selectedWard
                  ) ?? "—"
                }
              </div>

              <div
                className="
                  mt-2.5
                  grid
                  grid-cols-3
                  gap-2
                "
              >
                <div>
                  <div
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      text-[#91A7BC]
                    "
                  >
                    City
                  </div>

                  <div
                    className="
                      mt-0.5
                      text-[11px]
                      font-bold
                      text-[#49627C]
                    "
                  >
                    {
                      city?.cityName ||
                      "Bangalore"
                    }
                  </div>
                </div>

                <div>
                  <div
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      text-[#91A7BC]
                    "
                  >
                    Division
                  </div>

                  <div
                    className="
                      mt-0.5
                      text-[11px]
                      font-bold
                      text-[#49627C]
                    "
                  >
                    {
                      getDivisionName(
                        selectedDivision
                      )
                    }
                  </div>
                </div>

                <div>
                  <div
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      text-[#91A7BC]
                    "
                  >
                    Wards
                  </div>

                  <div
                    className="
                      mt-0.5
                      text-[11px]
                      font-bold
                      text-[#49627C]
                    "
                  >
                    {
                      wards.length
                    }
                  </div>
                </div>
              </div>
            </div>
          ) : selectedDivision ? (
            <div
              className="
                absolute
                bottom-3
                left-3
                z-[2000]
                hidden
                w-[340px]
                rounded-[15px]
                border
                border-[#DCE4EC]
                bg-white/97
                p-[15px_18px]
                shadow-[0_12px_30px_rgba(30,45,60,0.08)]
                backdrop-blur-xl

                md:block
                lg:bottom-[18px]
                lg:left-[18px]
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[10px]
                  font-bold
                  text-[#8AA1BB]
                "
              >
                <span
                  className="
                    h-2.5
                    w-2.5
                    rounded-full
                    border
                    border-[#314960]/30
                  "
                  style={{
                    backgroundColor:
                      DIVISION_COLORS[
                        (
                          divisions.findIndex(
                            (
                              division
                            ) =>
                              sameEntity(
                                division,
                                selectedDivision,
                                getDivisionId,
                                getDivisionName
                              )
                          ) >= 0
                            ? divisions.findIndex(
                                (
                                  division
                                ) =>
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

              <div
                className="
                  mt-1.5
                  text-[16px]
                  font-bold
                  text-[#34475B]
                "
              >
                {
                  getDivisionName(
                    selectedDivision
                  )
                }
              </div>

              <div
                className="
                  mt-1
                  overflow-hidden
                  border-b
                  border-[#E7EDF3]
                  pb-2
                  text-[10px]
                  text-[#8BA4BF]
                  text-ellipsis
                  whitespace-nowrap
                "
              >
                {
                  getDivisionTableName(
                    selectedDivision
                  ) ||
                  "Division"
                }
              </div>

              <div
                className="
                  mt-2.5
                  grid
                  grid-cols-3
                  gap-2
                "
              >
                <div>
                  <div
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      text-[#91A7BC]
                    "
                  >
                    City
                  </div>

                  <div
                    className="
                      mt-0.5
                      text-[11px]
                      font-bold
                      text-[#49627C]
                    "
                  >
                    {
                      city?.cityName ||
                      "Bangalore"
                    }
                  </div>
                </div>

                <div>
                  <div
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      text-[#91A7BC]
                    "
                  >
                    Divisions
                  </div>

                  <div
                    className="
                      mt-0.5
                      text-[11px]
                      font-bold
                      text-[#49627C]
                    "
                  >
                    {
                      divisions.length
                    }
                  </div>
                </div>

                <div>
                  <div
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      text-[#91A7BC]
                    "
                  >
                    Wards
                  </div>

                  <div
                    className="
                      mt-0.5
                      text-[11px]
                      font-bold
                      text-[#49627C]
                    "
                  >
                    {
                      wards.length
                    }
                  </div>
                </div>
              </div>
            </div>
          ) : selectedZone ? (
            <div
              className="
                absolute
                bottom-3
                left-3
                z-[2000]
                hidden
                w-[340px]
                rounded-[15px]
                border
                border-[#DCE4EC]
                bg-white/97
                p-[15px_18px]
                shadow-[0_12px_30px_rgba(30,45,60,0.08)]
                backdrop-blur-xl

                md:block
                lg:bottom-[18px]
                lg:left-[18px]
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[10px]
                  font-bold
                  text-[#8AA1BB]
                "
              >
                <span
                  className="
                    h-2.5
                    w-2.5
                    rounded-full
                    border
                    border-[#314960]/30
                  "
                  style={{
                    backgroundColor:
                      ZONE_COLORS[
                        Math.max(
                          0,
                          zones.findIndex(
                            (
                              zone
                            ) =>
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

              <div
                className="
                  mt-1.5
                  text-[16px]
                  font-bold
                  text-[#34475B]
                "
              >
                {
                  getZoneName(
                    selectedZone
                  )
                }
              </div>

              <div
                className="
                  mt-1
                  overflow-hidden
                  border-b
                  border-[#E7EDF3]
                  pb-2
                  text-[10px]
                  text-[#8BA4BF]
                  text-ellipsis
                  whitespace-nowrap
                "
              >
                {
                  getZoneTableName(
                    selectedZone
                  ) ||
                  getZoneName(
                    selectedZone
                  )
                }
              </div>

              <div
                className="
                  mt-2.5
                  grid
                  grid-cols-3
                  gap-2
                "
              >
                <div>
                  <div
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      text-[#91A7BC]
                    "
                  >
                    City
                  </div>

                  <div
                    className="
                      mt-0.5
                      text-[11px]
                      font-bold
                      text-[#49627C]
                    "
                  >
                    {
                      city?.cityName ||
                      "Bangalore"
                    }
                  </div>
                </div>

                <div>
                  <div
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      text-[#91A7BC]
                    "
                  >
                    Divisions
                  </div>

                  <div
                    className="
                      mt-0.5
                      text-[11px]
                      font-bold
                      text-[#49627C]
                    "
                  >
                    {
                      divisions.length
                    }
                  </div>
                </div>

                <div>
                  <div
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      text-[#91A7BC]
                    "
                  >
                    Wards
                  </div>

                  <div
                    className="
                      mt-0.5
                      text-[11px]
                      font-bold
                      text-[#49627C]
                    "
                  >
                    {divisions.reduce(
                      (
                        total,
                        division
                      ) =>
                        total +
                        (Array.isArray(
                          division?.wards
                        )
                          ? division
                              .wards
                              .length
                          : 0),
                      0
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null)}

        {/* ====================================================
            LOADING
        ==================================================== */}

        {loading && (
          <div
            className="
              absolute
              inset-0
              z-[4000]
              flex
              items-center
              justify-center
              pointer-events-none
            "
          >
            <div
              className="
                rounded-[10px]
                border
                border-[#DFE7EF]
                bg-white/96
                px-4
                py-2.5
                text-[12px]
                font-semibold
                text-[#536A84]
                shadow-[0_12px_30px_rgba(0,0,0,0.08)]
              "
            >
              Loading city map...
            </div>
          </div>
        )}

        {/* ====================================================
            ERROR
        ==================================================== */}

        {!loading &&
          error && (
            <div
              className="
                absolute
                inset-0
                z-[4000]
                flex
                items-center
                justify-center
                pointer-events-none
              "
            >
              <div
                className="
                  max-w-[90%]
                  rounded-[10px]
                  border
                  border-[#DFE7EF]
                  bg-white/96
                  px-4
                  py-2.5
                  text-center
                  text-[12px]
                  font-semibold
                  text-red-600
                  shadow-[0_12px_30px_rgba(0,0,0,0.08)]
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