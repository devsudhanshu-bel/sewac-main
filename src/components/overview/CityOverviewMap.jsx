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

import RouteMap from "./RouteMap";

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
import { useLanguage } from "../../i18n";

import "leaflet/dist/leaflet.css";

/* ============================================================
   CONFIGURATION
============================================================ */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5002";

const DEFAULT_CITY_ID = 1;

/* ============================================================
   EXACT BACKEND ENDPOINTS
============================================================ */

const CITY_MAP_ENDPOINT = (cityId) =>
  `${API_BASE_URL}/api/master-citizen/map/city/${encodeURIComponent(cityId)}`;

const ZONE_DIVISIONS_ENDPOINT = (zoneTableName) =>
  `${API_BASE_URL}/api/master-citizen/map/zone/${encodeURIComponent(
    zoneTableName,
  )}/divisions`;

const DIVISION_WARDS_ENDPOINT = (divisionTableName) =>
  `${API_BASE_URL}/api/master-citizen/map/division/${encodeURIComponent(
    divisionTableName,
  )}/wards`;

/* ============================================================
   PLANTS ENDPOINT
============================================================ */

const PLANTS_ENDPOINT = `${API_BASE_URL}/api/plants`;

/* ============================================================
   COLORS
============================================================ */

const ZONE_COLORS = ["#93C5FD", "#C4B5FD", "#86EFAC", "#FDE68A", "#F9A8D4"];

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

  if (Math.abs(first) <= 30 && Math.abs(second) >= 60) {
    return [second, first, ...pair.slice(2)];
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

  /* ==========================================================
     FEATURE COLLECTION
  ========================================================== */

  if (parsed.type === "FeatureCollection") {
    return {
      ...parsed,

      features: Array.isArray(parsed.features)
        ? parsed.features
            .map((feature) => normalizeGeoJSON(feature))
            .filter(Boolean)
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
     GEOMETRY OBJECT
  ========================================================== */

  if (parsed.type && parsed.coordinates) {
    return {
      ...parsed,

      coordinates: normalizeCoordinates(parsed.coordinates),
    };
  }

  /* ==========================================================
     RAW COORDINATES
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
     OBJECT CONTAINING GEOMETRY
  ========================================================== */

  if (parsed.geometry && typeof parsed.geometry === "object") {
    return normalizeGeoJSON({
      type: "Feature",

      properties: parsed.properties || {},

      geometry: parsed.geometry,
    });
  }

  /* ==========================================================
     OBJECT CONTAINING COORDINATES
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
    console.warn("Unable to calculate GeoJSON bounds:", error);

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
  return zone?.zoneName || zone?.zone_name || zone?.name || "Unnamed Zone";
}

function getZoneId(zone) {
  return zone?.id ?? zone?.zoneId ?? zone?.zone_id ?? null;
}

function getZoneTableName(zone) {
  return zone?.zoneTableName || zone?.zone_table_name || null;
}

function getZoneBoundary(zone) {
  return normalizeGeoJSON(
    zone?.geoBoundary ?? zone?.geo_boundary ?? zone?.geometry ?? zone?.boundary,
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
  return division?.id ?? division?.divisionId ?? division?.division_id ?? null;
}

function getDivisionTableName(division) {
  return division?.divisionTableName || division?.division_table_name || null;
}

function getDivisionBoundary(division) {
  return normalizeGeoJSON(
    division?.geoBoundary ??
      division?.geo_boundary ??
      division?.geometry ??
      division?.boundary,
  );
}

function getWardName(ward) {
  return (
    ward?.wardName ||
    ward?.ward_name ||
    ward?.name ||
    (ward?.wardNo !== undefined ? `Ward ${ward.wardNo}` : "Unnamed Ward")
  );
}

function getWardId(ward) {
  return ward?.id ?? ward?.wardId ?? ward?.ward_id ?? ward?.wardNo ?? null;
}

function getWardBoundary(ward) {
  return normalizeGeoJSON(
    ward?.geoBoundary ?? ward?.geo_boundary ?? ward?.geometry ?? ward?.boundary,
  );
}

function sameEntity(first, second, getId, getName) {
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
    return String(firstId) === String(secondId);
  }

  return getName(first) === getName(second);
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
   INITIAL CITY FIT
============================================================ */

function InitialCityFit({ cityBoundary, zones }) {
  const map = useMap();

  const didFitRef = useRef(false);

  useEffect(() => {
    if (didFitRef.current) {
      return;
    }

    const bounds = getGeoJSONBounds(cityBoundary);

    if (bounds && bounds.isValid()) {
      didFitRef.current = true;

      map.fitBounds(bounds, {
        padding: [50, 50],

        maxZoom: 10,

        animate: false,
      });

      return;
    }

    if (Array.isArray(zones) && zones.length) {
      const zoneBounds = zones
        .map((zone) => getGeoJSONBounds(getZoneBoundary(zone)))
        .filter(Boolean);

      if (zoneBounds.length) {
        const combined = L.latLngBounds([]);

        zoneBounds.forEach((bounds) => {
          combined.extend(bounds);
        });

        if (combined.isValid()) {
          didFitRef.current = true;

          map.fitBounds(combined, {
            padding: [50, 50],

            maxZoom: 10,

            animate: false,
          });
        }
      }
    }
  }, [cityBoundary, zones, map]);

  return null;
}

/* ============================================================
   SELECTION FOCUS CONTROLLER
============================================================ */

function SelectionFocusController({
  selectedZone,
  selectedDivision,
  selectedWard,
}) {
  const map = useMap();

  useEffect(() => {
    const selected = selectedWard || selectedDivision || selectedZone;

    if (!selected) {
      return;
    }

    let boundary = null;

    if (selectedWard) {
      boundary = getWardBoundary(selectedWard);
    } else if (selectedDivision) {
      boundary = getDivisionBoundary(selectedDivision);
    } else if (selectedZone) {
      boundary = getZoneBoundary(selectedZone);
    }

    const bounds = getGeoJSONBounds(boundary);

    if (bounds && bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [70, 70],

        maxZoom: 13,

        animate: true,
      });
    }
  }, [selectedZone, selectedDivision, selectedWard, map]);

  return null;
}

/* ============================================================
   ZONE LAYER
============================================================ */

function ZoneLayer({ zone, index, selected, onSelect }) {
  const boundary = getZoneBoundary(zone);

  if (!boundary) {
    return null;
  }

  const color = ZONE_COLORS[index % ZONE_COLORS.length];

  return (
    <GeoJSON
      key={`zone-${getZoneName(zone)}-${index}`}
      data={boundary}
      style={() => ({
        color: selected ? "#1F354A" : "#40556B",

        weight: selected ? 4.2 : 2.4,

        opacity: 1,

        fillColor: selected ? "transparent" : color,

        fillOpacity: selected ? 0 : 0.38,

        lineJoin: "round",

        lineCap: "round",
      })}
      eventHandlers={{
        click: (event) => {
          if (event?.originalEvent) {
            L.DomEvent.stopPropagation(event.originalEvent);
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

function DivisionLayer({ division, index, selected, onSelect }) {
  const boundary = getDivisionBoundary(division);

  if (!boundary) {
    return null;
  }

  const color = DIVISION_COLORS[index % DIVISION_COLORS.length];

  return (
    <GeoJSON
      key={`division-${
        getDivisionTableName(division) ||
        getDivisionId(division) ||
        getDivisionName(division)
      }-${index}`}
      data={boundary}
      style={() => ({
        color: selected ? "#172B3F" : "#52677C",

        weight: selected ? 3.5 : 1.8,

        opacity: 1,

        fillColor: color,

        fillOpacity: selected ? 0.64 : 0.3,

        lineJoin: "round",

        lineCap: "round",
      })}
      eventHandlers={{
        click: (event) => {
          if (event?.originalEvent) {
            L.DomEvent.stopPropagation(event.originalEvent);
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

function WardLayer({ ward, index, selected, onSelect }) {
  const boundary = getWardBoundary(ward);

  if (!boundary) {
    return null;
  }

  const color = WARD_COLORS[index % WARD_COLORS.length];

  return (
    <GeoJSON
      key={`ward-${getWardId(ward) || getWardName(ward)}-${index}`}
      data={boundary}
      style={() => ({
        color: selected ? "#142536" : "#536A7E",

        weight: selected ? 3.2 : 1.5,

        opacity: 1,

        fillColor: color,

        fillOpacity: selected ? 0.68 : 0.34,

        lineJoin: "round",

        lineCap: "round",
      })}
      eventHandlers={{
        click: (event) => {
          if (event?.originalEvent) {
            L.DomEvent.stopPropagation(event.originalEvent);
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

function CityBoundaryLayer({ boundary }) {
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
  const buttonRef = useRef(null);

  const menuRef = useRef(null);

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) {
      return;
    }

    const rect = buttonRef.current.getBoundingClientRect();

    setPosition({
      top: rect.bottom + 7,

      left: rect.left,

      width: rect.width,
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    updatePosition();

    const handlePosition = () => {
      updatePosition();
    };

    window.addEventListener("resize", handlePosition);

    window.addEventListener("scroll", handlePosition, true);

    return () => {
      window.removeEventListener("resize", handlePosition);

      window.removeEventListener("scroll", handlePosition, true);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleOutsideClick = (event) => {
      if (buttonRef.current?.contains(event.target)) {
        return;
      }

      if (menuRef.current?.contains(event.target)) {
        return;
      }

      setOpen(null);
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open, setOpen]);

  const handleOptionClick = (option) => {
    onChange(option);
    setOpen(null);
  };

  const menu =
    open && !disabled && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={menuRef}
            className="
              fixed
              z-[2147483647]
              max-h-[300px]
              overflow-y-auto
              rounded-2xl
              border
              border-[#DCE5EE]
              bg-white
              p-1.5
              shadow-[0_18px_45px_rgba(30,45,60,0.16)]
            "
            style={{
              top: position.top,

              left: position.left,

              width: position.width,
            }}
          >
            {options.length === 0 ? (
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
              options.map((option, index) => {
                const optionValue =
                  typeof option === "string" ? option : option.value;

                const optionLabel =
                  typeof option === "string" ? option : option.label;

                const selectedOption = optionValue === value;

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
                        text-[11px]
                        font-semibold
                        transition
                        sm:text-[12px]

                        ${
                          selectedOption
                            ? "bg-[#EDF3F8] text-[#20364C]"
                            : "text-[#47617B] hover:bg-[#F5F8FB]"
                        }
                      `}
                    onMouseDown={(event) => {
                      event.stopPropagation();
                    }}
                    onClick={() => handleOptionClick(option)}
                  >
                    {renderOption ? (
                      renderOption(option, index)
                    ) : (
                      <span className="truncate">{optionLabel}</span>
                    )}
                  </button>
                );
              })
            )}
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="relative mb-3">
      <div
        className="
          mb-1.5
          text-[9px]
          font-bold
          tracking-[0.15px]
          text-[#8BA4BF]
          sm:text-[10px]
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
          h-11
          w-full
          items-center
          justify-between
          rounded-[13px]
          border
          px-3.5
          text-left
          text-[11px]
          font-semibold
          transition
          sm:h-12
          sm:text-[12px]

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

          setOpen(open ? null : label);
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
          {value || placeholder}
        </span>

        {open ? (
          <ChevronUp size={14} className="shrink-0" />
        ) : (
          <ChevronDown size={14} className="shrink-0" />
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
  mapData,
}) {
  /* ==========================================================
     LANGUAGE
  ========================================================== */

  const { t } = useLanguage();

  /* ==========================================================
     GLOBAL HEADER FILTERS
  ========================================================== */

  const {
    selectedCity: headerSelectedCity,

    selectedZone: headerSelectedZone,

    selectedDivision: headerSelectedDivision,

    selectedWard: headerSelectedWard,
  } = useFilters();

  /* ==========================================================
     STATE
  ========================================================== */

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [city, setCity] = useState(null);

  const [zones, setZones] = useState([]);

  const [selectedZone, setSelectedZone] = useState(null);

  const [divisions, setDivisions] = useState([]);

  const [selectedDivision, setSelectedDivision] = useState(null);

  const [wards, setWards] = useState([]);

  const [selectedWard, setSelectedWard] = useState(null);

  const [divisionsLoading, setDivisionsLoading] = useState(false);

  const [wardsLoading, setWardsLoading] = useState(false);

  const [divisionError, setDivisionError] = useState("");

  const [wardError, setWardError] = useState("");

  const [openDropdown, setOpenDropdown] = useState(null);

  const [showViewMenu, setShowViewMenu] = useState(false);

  /* ==========================================================
     MAP VIEW
  ========================================================== */

  const [mapView, setMapView] = useState("overview");

  /* ==========================================================
     PLANTS
  ========================================================== */

  const [plants, setPlants] = useState([]);

  const [plantsLoading, setPlantsLoading] = useState(false);

  const [plantsError, setPlantsError] = useState("");

  /* ==========================================================
     REFS
  ========================================================== */

  const mapRef = useRef(null);

  const divisionAbortRef = useRef(null);

  const wardAbortRef = useRef(null);

  const plantsAbortRef = useRef(null);

  /* ==========================================================
     LOAD CITY MAP
  ========================================================== */

  const fetchCityMapData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const endpoint = CITY_MAP_ENDPOINT(cityId);

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

      if (result?.success === false) {
        throw new Error(result.message || "Unable to fetch city map data.");
      }

      const loadedCity = result?.city || null;

      const loadedZones = Array.isArray(result?.zones) ? result.zones : [];

      setCity(loadedCity);

      setZones(loadedZones);

      setSelectedZone(null);

      setDivisions([]);

      setSelectedDivision(null);

      setWards([]);

      setSelectedWard(null);

      setDivisionError("");

      setWardError("");

      setOpenDropdown(null);
    } catch (requestError) {
      console.error("CITY MAP ERROR:", requestError);

      setError(requestError?.message || "Unable to load city map.");
    } finally {
      setLoading(false);
    }
  }, [cityId]);

  useEffect(() => {
    fetchCityMapData();

    return () => {
      divisionAbortRef.current?.abort();
      wardAbortRef.current?.abort();
      plantsAbortRef.current?.abort();
    };
  }, [fetchCityMapData]);

  /* ==========================================================
     FETCH ZONE → DIVISIONS
  ========================================================== */

  const fetchZoneDivisions = useCallback(async (zone) => {
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

    const zoneTableName = getZoneTableName(zone);

    if (!zoneTableName) {
      setDivisions([]);
      setSelectedDivision(null);

      setDivisionError(
        "Selected zone does not contain a valid zone table name.",
      );

      return;
    }

    const controller = new AbortController();

    divisionAbortRef.current = controller;

    setDivisionsLoading(true);
    setDivisionError("");

    setDivisions([]);
    setSelectedDivision(null);

    setWards([]);
    setSelectedWard(null);
    setWardError("");

    const endpoint = ZONE_DIVISIONS_ENDPOINT(zoneTableName);

    try {
      const response = await fetch(endpoint, {
        method: "GET",

        headers: {
          Accept: "application/json",
        },

        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(
          `Zone divisions request failed with status ${response.status}`,
        );
      }

      const result = await response.json();

      if (result?.success === false) {
        throw new Error(result.message || "Unable to fetch divisions.");
      }

      const loadedDivisions = extractArray(result, "divisions").filter(Boolean);

      setDivisions(loadedDivisions);
    } catch (requestError) {
      if (requestError?.name === "AbortError") {
        return;
      }

      console.error("DIVISIONS ERROR:", requestError);

      setDivisions([]);
      setDivisionError(requestError?.message || "Unable to load divisions.");
    } finally {
      if (!controller.signal.aborted) {
        setDivisionsLoading(false);
      }
    }
  }, []);

  /* ==========================================================
     FETCH DIVISION → WARDS
  ========================================================== */

  const fetchDivisionWards = useCallback(async (division) => {
    wardAbortRef.current?.abort();

    if (!division) {
      setWards([]);
      setSelectedWard(null);
      setWardError("");
      return;
    }

    const divisionTableName = getDivisionTableName(division);

    if (!divisionTableName) {
      setWards([]);
      setSelectedWard(null);

      setWardError(
        "Selected division does not contain a valid division table name.",
      );

      return;
    }

    const controller = new AbortController();

    wardAbortRef.current = controller;

    setWardsLoading(true);
    setWardError("");

    setWards([]);
    setSelectedWard(null);

    const endpoint = DIVISION_WARDS_ENDPOINT(divisionTableName);

    try {
      const response = await fetch(endpoint, {
        method: "GET",

        headers: {
          Accept: "application/json",
        },

        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(
          `Division wards request failed with status ${response.status}`,
        );
      }

      const result = await response.json();

      if (result?.success === false) {
        throw new Error(result.message || "Unable to fetch wards.");
      }

      const loadedWards = extractArray(result, "wards").filter(Boolean);

      setWards(loadedWards);
    } catch (requestError) {
      if (requestError?.name === "AbortError") {
        return;
      }

      console.error("WARDS ERROR:", requestError);

      setWards([]);
      setWardError(requestError?.message || "Unable to load wards.");
    } finally {
      if (!controller.signal.aborted) {
        setWardsLoading(false);
      }
    }
  }, []);

  /* ==========================================================
     SELECTION HANDLERS
  ========================================================== */

  const handleZoneSelect = useCallback(
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

      fetchZoneDivisions(zone);
    },
    [fetchZoneDivisions],
  );

  const handleDivisionSelect = useCallback(
    (option) => {
      if (!option?.value) {
        setSelectedDivision(null);

        setSelectedWard(null);

        setWards([]);

        setOpenDropdown(null);

        return;
      }

      const division = option.division;

      setSelectedDivision(division);

      setSelectedWard(null);

      setWards([]);

      setWardError("");

      setOpenDropdown(null);

      fetchDivisionWards(division);
    },
    [fetchDivisionWards],
  );

  const handleWardSelect = useCallback((option) => {
    if (!option?.value) {
      setSelectedWard(null);

      setOpenDropdown(null);

      return;
    }

    setSelectedWard(option.ward);

    setOpenDropdown(null);
  }, []);

  /* ==========================================================
     CITY BOUNDARY
  ========================================================== */

  const cityBoundary = useMemo(
    () => normalizeGeoJSON(city?.geoBoundary ?? city?.geo_boundary),
    [city],
  );

  /* ==========================================================
     SELECTED NAMES
  ========================================================== */

  const selectedZoneName = selectedZone ? getZoneName(selectedZone) : "";

  const selectedDivisionName = selectedDivision
    ? getDivisionName(selectedDivision)
    : "";

  const selectedWardName = selectedWard ? getWardName(selectedWard) : "";

  /* ==========================================================
     FETCH PLANTS
  ========================================================== */

  const fetchPlants = useCallback(async () => {
    plantsAbortRef.current?.abort();

    const controller = new AbortController();

    plantsAbortRef.current = controller;

    try {
      setPlantsLoading(true);

      setPlantsError("");

      const response = await fetch(PLANTS_ENDPOINT, {
        method: "GET",

        headers: {
          Accept: "application/json",
        },

        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Plants request failed with status ${response.status}`);
      }

      const result = await response.json();

      if (result?.success === false) {
        throw new Error(result.message || "Unable to fetch plants.");
      }

      const loadedPlants = Array.isArray(result?.plants)
        ? result.plants
        : Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result)
            ? result
            : [];

      setPlants(loadedPlants);
    } catch (requestError) {
      if (requestError?.name === "AbortError") {
        return;
      }

      console.error("PLANTS ERROR:", requestError);

      setPlantsError(requestError?.message || "Unable to load plants.");
    } finally {
      if (!controller.signal.aborted) {
        setPlantsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (mapView !== "plants") {
      return;
    }

    if (plants.length > 0) {
      return;
    }

    fetchPlants();
  }, [mapView, plants.length, fetchPlants]);

  /* ==========================================================
     FILTER OPTIONS
  ========================================================== */

  const zoneOptions = useMemo(
    () => [
      {
        value: "",
        label: t("overview.cityOverviewMap.allZones", "All Zones"),
      },

      ...zones.map((zone) => ({
        value: getZoneName(zone),

        label: getZoneName(zone),

        zone,
      })),
    ],
    [zones, t],
  );

  const divisionOptions = useMemo(
    () => [
      {
        value: "",
        label: t("overview.cityOverviewMap.allDivisions", "All Divisions"),
      },

      ...divisions.map((division) => ({
        value: getDivisionName(division),

        label: getDivisionName(division),

        division,
      })),
    ],
    [divisions, t],
  );

  const wardOptions = useMemo(
    () => [
      {
        value: "",
        label: t("overview.cityOverviewMap.allWards", "All Wards"),
      },

      ...wards.map((ward) => ({
        value: getWardName(ward),

        label: getWardName(ward),

        ward,
      })),
    ],
    [wards, t],
  );

  /* ==========================================================
     VISIBLE ZONES
  ========================================================== */

  const visibleZones = useMemo(() => {
    if (!selectedZone) {
      return zones;
    }

    return zones.filter((zone) =>
      sameEntity(zone, selectedZone, getZoneId, getZoneName),
    );
  }, [zones, selectedZone]);

  /* ==========================================================
     VISIBLE DIVISIONS
  ========================================================== */

  const visibleDivisions = useMemo(() => {
    if (!selectedZone) {
      return [];
    }

    if (!selectedDivision) {
      return divisions;
    }

    return divisions.filter((division) =>
      sameEntity(division, selectedDivision, getDivisionId, getDivisionName),
    );
  }, [selectedZone, selectedDivision, divisions]);

  /* ==========================================================
     VISIBLE WARDS
  ========================================================== */

  const visibleWards = useMemo(() => {
    if (!selectedDivision) {
      return [];
    }

    if (!selectedWard) {
      return wards;
    }

    return wards.filter((ward) =>
      sameEntity(ward, selectedWard, getWardId, getWardName),
    );
  }, [selectedDivision, selectedWard, wards]);

  /* ==========================================================
     RESET MAP
  ========================================================== */

  const resetMap = useCallback(() => {
    setMapView("overview");

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
      const map = mapRef.current;

      if (!map) {
        return;
      }

      const bounds = getGeoJSONBounds(cityBoundary);

      if (bounds && bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [60, 60],

          maxZoom: 10,

          animate: true,
        });
      }
    }, 50);
  }, [cityBoundary]);

  /* ==========================================================
     MAP VIEW CHANGE
  ========================================================== */

  const handleMapViewChange = useCallback(
    (view) => {
      setShowViewMenu(false);

      setOpenDropdown(null);

      /*
       * Route Maps intentionally
       * keeps the existing route-map page.
       */

      if (view === "route") {
        setMapView("route");

        if (typeof onViewChange === "function") {
          onViewChange(view);
        }

        return;
      }

      setMapView(view);

      if (typeof onViewChange === "function") {
        onViewChange(view);
      }

      if (view === "overview") {
        setSelectedZone(null);

        setSelectedDivision(null);

        setSelectedWard(null);

        setDivisions([]);
        setWards([]);

        setDivisionError("");
        setWardError("");
      }
    },
    [onViewChange],
  );

  /* ==========================================================
     VIEW OPTIONS
  ========================================================== */

  const mapViewOptions = [
    {
      id: "overview",

      label: t("overview.cityOverviewMap.cityOverview", "City Overview Map"),

      icon: MapIcon,
    },

    {
      id: "route",

      label: t("overview.cityOverviewMap.routeMaps", "Route Maps"),

      icon: Route,
    },

    {
      id: "gvp",

      label: t("overview.cityOverviewMap.gvpPoints", "GVP Points"),

      icon: MapPinned,
    },

    {
      id: "plants",

      label: t("overview.cityOverviewMap.plants", "Plants"),

      icon: Factory,
    },

    {
      id: "grievances",

      label: t(
        "overview.cityOverviewMap.customerGrievances",
        "Customer Grievances",
      ),

      icon: MessageSquareWarning,
    },
  ];

  const currentView =
    mapViewOptions.find((option) => option.id === mapView) || mapViewOptions[0];

  const CurrentViewIcon = currentView.icon;

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <section
      className="
        relative
        box-border
        w-full
        min-w-0
        rounded-[18px]
        border
        border-[#DCE4EC]
        bg-white
        p-2.5
        shadow-[0_4px_18px_rgba(31,45,61,0.05)]

        sm:p-3

        md:p-3.5
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
        {t("overview.cityOverviewMap.title", "OVERVIEW MAPS")}
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
          min-w-0
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

        {mapView === "overview" && (
          <MapContainer
            ref={mapRef}
            center={[12.9716, 77.5946]}
            zoom={10}
            zoomControl={false}
            className="
              !h-full
              !w-full

              [&_.leaflet-container]:!h-full
              [&_.leaflet-container]:!w-full

              [&_.leaflet-tile-pane]:[filter:saturate(.42)_brightness(1.05)]

              [&_.leaflet-control-attribution]:!text-[9px]
              [&_.leaflet-control-attribution]:!bg-white/80

              [&_.leaflet-control-zoom]:!mt-3
              [&_.leaflet-control-zoom]:!ml-3
              [&_.leaflet-control-zoom]:!overflow-hidden
              [&_.leaflet-control-zoom]:!rounded-lg
              [&_.leaflet-control-zoom]:!border
              [&_.leaflet-control-zoom]:!border-[#D8E1EA]
              [&_.leaflet-control-zoom]:!shadow-[0_3px_12px_rgba(36,53,72,0.08)]

              [&_.leaflet-control-zoom_a]:!h-[30px]
              [&_.leaflet-control-zoom_a]:!w-[30px]
              [&_.leaflet-control-zoom_a]:!leading-[30px]
              [&_.leaflet-control-zoom_a]:!bg-white
              [&_.leaflet-control-zoom_a]:!text-[17px]
              [&_.leaflet-control-zoom_a]:!text-[#34475B]

              sm:[&_.leaflet-control-zoom_a]:!h-[32px]
              sm:[&_.leaflet-control-zoom_a]:!w-[32px]
              sm:[&_.leaflet-control-zoom_a]:!leading-[32px]
            "
            preferCanvas={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution="&copy; OpenStreetMap contributors &copy; CARTO"
              subdomains={["a", "b", "c", "d"]}
              maxZoom={20}
            />

            <MapSizeController />

            <ZoomControl position="topleft" />

            <InitialCityFit cityBoundary={cityBoundary} zones={zones} />

            <SelectionFocusController
              selectedZone={selectedZone}
              selectedDivision={selectedDivision}
              selectedWard={selectedWard}
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
              {visibleZones.map((zone, index) => {
                const actualIndex = zones.findIndex((item) =>
                  sameEntity(item, zone, getZoneId, getZoneName),
                );

                return (
                  <ZoneLayer
                    key={`zone-${getZoneName(zone)}-${index}`}
                    zone={zone}
                    index={actualIndex >= 0 ? actualIndex : index}
                    selected={
                      !!selectedZone &&
                      sameEntity(zone, selectedZone, getZoneId, getZoneName)
                    }
                    onSelect={handleZoneSelect}
                  />
                );
              })}
            </Pane>

            {/* ==================================================
                DIVISIONS
            ================================================== */}

            {selectedZone && visibleDivisions.length > 0 && (
              <Pane
                name="divisionPane"
                style={{
                  zIndex: 415,
                }}
              >
                {visibleDivisions.map((division, index) => {
                  const actualIndex = divisions.findIndex((item) =>
                    sameEntity(item, division, getDivisionId, getDivisionName),
                  );

                  return (
                    <DivisionLayer
                      key={`division-${
                        getDivisionTableName(division) ||
                        getDivisionId(division) ||
                        getDivisionName(division)
                      }-${index}`}
                      division={division}
                      index={actualIndex >= 0 ? actualIndex : index}
                      selected={
                        !!selectedDivision &&
                        sameEntity(
                          division,
                          selectedDivision,
                          getDivisionId,
                          getDivisionName,
                        )
                      }
                      onSelect={(divisionValue) => {
                        setSelectedDivision(divisionValue);

                        setSelectedWard(null);

                        setWards([]);

                        setWardError("");

                        setOpenDropdown(null);

                        fetchDivisionWards(divisionValue);
                      }}
                    />
                  );
                })}
              </Pane>
            )}

            {/* ==================================================
                WARDS
            ================================================== */}

            {selectedDivision && visibleWards.length > 0 && (
              <Pane
                name="wardPane"
                style={{
                  zIndex: 418,
                }}
              >
                {visibleWards.map((ward, index) => (
                  <WardLayer
                    key={`ward-${
                      getWardId(ward) || getWardName(ward)
                    }-${index}`}
                    ward={ward}
                    index={index}
                    selected={
                      !!selectedWard &&
                      sameEntity(ward, selectedWard, getWardId, getWardName)
                    }
                    onSelect={(wardValue) => {
                      setSelectedWard(wardValue);

                      setOpenDropdown(null);
                    }}
                  />
                ))}
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
              <CityBoundaryLayer boundary={cityBoundary} />
            </Pane>
          </MapContainer>
        )}

        {/* ====================================================
            ROUTE MAPS
        ==================================================== */}

        {mapView === "route" && (
          <div
            className="
              absolute
              inset-0
              z-[1]
              h-full
              min-h-full
              w-full
              overflow-hidden
              bg-[#EEF1F3]
            "
          >
            <RouteMap
              mapData={mapData}
              selectedDate={selectedDate}
              selectedCity={headerSelectedCity}
              selectedZone={headerSelectedZone}
              selectedDivision={headerSelectedDivision}
              selectedWard={headerSelectedWard}
            />
          </div>
        )}

        {/* ====================================================
            PLANTS
        ==================================================== */}

        {mapView === "plants" && (
          <div
            className="
              absolute
              inset-0
              h-full
              min-h-full
              w-full
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
                  p-6
                  text-center
                  text-[11px]
                  font-semibold
                  text-[#536A84]
                  sm:p-8
                  sm:text-[12px]
                "
              >
                {t(
                  "overview.cityOverviewMap.loadingPlants",
                  "Loading plant locations...",
                )}
              </div>
            ) : plantsError ? (
              <div
                className="
                  flex
                  h-full
                  w-full
                  items-center
                  justify-center
                  p-5
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
                    bg-white/95
                    p-5
                    text-center
                    shadow-[0_12px_30px_rgba(30,45,60,0.08)]
                    sm:p-7
                  "
                >
                  <div
                    className="
                      mx-auto
                      mb-3
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-2xl
                      bg-violet-100
                      text-violet-600
                      sm:h-14
                      sm:w-14
                    "
                  >
                    <Factory size={28} />
                  </div>

                  <div
                    className="
                      text-[14px]
                      font-bold
                      text-[#34475B]
                      sm:text-[16px]
                    "
                  >
                    {t(
                      "overview.cityOverviewMap.unableLoadPlants",
                      "Unable to Load Plants",
                    )}
                  </div>

                  <div
                    className="
                      mt-2
                      text-[11px]
                      leading-5
                      text-[#8AA1BB]
                      sm:text-[12px]
                    "
                  >
                    {plantsError}
                  </div>
                </div>
              </div>
            ) : (
              <Plants plants={plants} />
            )}
          </div>
        )}

        {/* ====================================================
            CUSTOMER GRIEVANCES
        ==================================================== */}

        {mapView === "grievances" && (
          <div
            className="
              absolute
              inset-0
              h-full
              min-h-full
              w-full
              overflow-auto
              bg-[#EEF1F3]
            "
          >
            <CustomerGrev />
          </div>
        )}

        {/* ====================================================
            GVP POINTS
        ==================================================== */}

        {mapView === "gvp" && (
          <div
            className="
              absolute
              inset-0
              h-full
              min-h-0
              w-full
              overflow-hidden
            "
          >
            <GVPOverviewMap selectedDate={selectedDate} />
          </div>
        )}

        {/* ====================================================
            MAP VIEW HEADER
        ==================================================== */}

        <div
          className="
            absolute
            left-3
            right-3
            top-3
            z-[2000]

            flex
            min-h-[64px]
            items-center
            justify-between

            rounded-2xl
            border
            border-white/80
            bg-white/95

            px-3
            py-2.5

            shadow-[0_15px_40px_rgba(30,45,60,0.08)]
            backdrop-blur-xl

            sm:left-5
            sm:right-auto
            sm:top-5
            sm:w-[46%]
            sm:min-w-[360px]
            sm:px-4
            sm:py-3

            lg:left-6
            lg:top-6
            lg:w-[52%]
            lg:max-w-[620px]
            lg:min-h-[78px]
            lg:px-5
          "
        >
          <div
            className="
              flex
              min-w-0
              items-center
              gap-2.5
              sm:gap-3
              lg:gap-4
            "
          >
            <CurrentViewIcon
              className="
                h-7
                w-7
                shrink-0
                text-[#617B98]

                sm:h-8
                sm:w-8

                lg:h-[34px]
                lg:w-[34px]
              "
              strokeWidth={1.8}
            />

            <div
              className="
                min-w-0
              "
            >
              <div
                className="
                  truncate
                  text-[17px]
                  font-bold
                  leading-tight
                  text-[#34475B]

                  sm:text-[19px]

                  lg:text-[22px]
                "
              >
                {currentView.label}
              </div>

              {mapView === "overview" && city?.cityName && (
                <div
                  className="
                      mt-0.5
                      truncate
                      text-[10px]
                      font-semibold
                      text-[#8AA1BB]

                      sm:text-[11px]

                      lg:text-[12px]
                    "
                >
                  {city.cityName}
                </div>
              )}

              {mapView === "plants" && (
                <div
                  className="
                    mt-0.5
                    text-[10px]
                    font-semibold
                    text-[#8AA1BB]

                    sm:text-[11px]
                  "
                >
                  {t(
                    "overview.cityOverviewMap.plantLocations",
                    "Plant Locations",
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            aria-label={t(
              "overview.cityOverviewMap.changeMapView",
              "Change map view",
            )}
            className="
              ml-2
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-transparent
              text-[#34475B]
              transition
              hover:bg-[#F3F7FA]

              sm:h-9
              sm:w-9
            "
            onClick={() => setShowViewMenu((current) => !current)}
          >
            {showViewMenu ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
          </button>

          {/* ==================================================
              VIEW MENU
          ================================================== */}

          {showViewMenu && (
            <div
              className="
                absolute
                right-1
                top-[calc(100%+7px)]
                z-[3000]

                w-[210px]
                rounded-xl
                border
                border-[#DCE5EE]
                bg-white/99
                p-1.5

                shadow-[0_16px_35px_rgba(30,45,60,0.14)]
                backdrop-blur-xl

                sm:right-0
                sm:w-[225px]
              "
            >
              {mapViewOptions.map((option) => {
                const OptionIcon = option.icon;

                const isActive = option.id === mapView;

                return (
                  <button
                    key={option.id}
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

                        sm:text-[12px]

                        ${
                          isActive
                            ? "bg-[#EDF3F8] text-[#20364C]"
                            : "text-[#40556B] hover:bg-[#F4F7FA]"
                        }
                      `}
                    onClick={() => handleMapViewChange(option.id)}
                  >
                    <OptionIcon
                      size={16}
                      strokeWidth={1.9}
                      className="shrink-0"
                    />

                    <span className="truncate">{option.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ====================================================
            MAP FILTERS
        ==================================================== */}

        {mapView === "overview" && (
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
              bg-white/95

              p-3

              shadow-[0_12px_30px_rgba(30,45,60,0.08)]
              backdrop-blur-xl

              sm:bottom-auto
              sm:left-auto
              sm:right-5
              sm:top-5
              sm:w-[300px]
              sm:max-h-none
              sm:overflow-visible
              sm:p-4

              lg:right-[18px]
              lg:w-[330px]
              lg:p-[18px]
            "
          >
            <div
              className="
                mb-3
                text-[13px]
                font-bold
                text-[#34475B]

                sm:text-[14px]

                lg:text-[15px]
              "
            >
              {t("overview.cityOverviewMap.mapFilters", "MAP FILTERS")}
            </div>

            {/* ==================================================
                ZONE
            ================================================== */}

            <FilterDropdown
              label={t("overview.cityOverviewMap.zone", "ZONE")}
              value={selectedZoneName}
              placeholder={t("overview.cityOverviewMap.allZones", "All Zones")}
              options={zoneOptions}
              open={openDropdown === t("overview.cityOverviewMap.zone", "ZONE")}
              setOpen={setOpenDropdown}
              onChange={(option) => {
                if (!option?.value) {
                  resetMap();
                  return;
                }

                handleZoneSelect(option.zone);
              }}
              renderOption={(option, index) => {
                if (!option.value) {
                  return <span>{option.label}</span>;
                }

                const zoneIndex = zones.findIndex((zone) =>
                  sameEntity(zone, option.zone, getZoneId, getZoneName),
                );

                const color =
                  ZONE_COLORS[
                    (zoneIndex >= 0 ? zoneIndex : index) % ZONE_COLORS.length
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
                        backgroundColor: color,
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
                      {option.label}
                    </span>
                  </>
                );
              }}
            />

            {/* ==================================================
                DIVISION
            ================================================== */}

            <FilterDropdown
              label={t("overview.cityOverviewMap.division", "DIVISION")}
              value={selectedDivisionName}
              placeholder={
                !selectedZone
                  ? t(
                      "overview.cityOverviewMap.selectZoneFirst",
                      "Select a Zone First",
                    )
                  : divisionsLoading
                    ? t(
                        "overview.cityOverviewMap.loadingDivisions",
                        "Loading Divisions...",
                      )
                    : divisions.length
                      ? t(
                          "overview.cityOverviewMap.allDivisions",
                          "All Divisions",
                        )
                      : t(
                          "overview.cityOverviewMap.noDivisions",
                          "No Divisions",
                        )
              }
              options={divisionOptions}
              open={
                openDropdown ===
                t("overview.cityOverviewMap.division", "DIVISION")
              }
              setOpen={setOpenDropdown}
              disabled={
                !selectedZone || divisionsLoading || divisions.length === 0
              }
              onChange={handleDivisionSelect}
              renderOption={(option) => (
                <span
                  className="
                    min-w-0
                    overflow-hidden
                    text-ellipsis
                    whitespace-nowrap
                  "
                >
                  {option.label}
                </span>
              )}
            />

            {/* ==================================================
                WARD
            ================================================== */}

            <FilterDropdown
              label={t("overview.cityOverviewMap.ward", "WARD")}
              value={selectedWardName}
              placeholder={
                !selectedDivision
                  ? t(
                      "overview.cityOverviewMap.selectDivisionFirst",
                      "Select a Division First",
                    )
                  : wardsLoading
                    ? t(
                        "overview.cityOverviewMap.loadingWards",
                        "Loading Wards...",
                      )
                    : wards.length
                      ? t("overview.cityOverviewMap.allWards", "All Wards")
                      : t("overview.cityOverviewMap.noWards", "No Wards")
              }
              options={wardOptions}
              open={openDropdown === t("overview.cityOverviewMap.ward", "WARD")}
              setOpen={setOpenDropdown}
              disabled={!selectedDivision || wardsLoading || wards.length === 0}
              onChange={handleWardSelect}
              renderOption={(option) => (
                <span
                  className="
                    min-w-0
                    overflow-hidden
                    text-ellipsis
                    whitespace-nowrap
                  "
                >
                  {option.label}
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
                  rounded-lg
                  bg-[#F4F8FB]
                  px-2.5
                  py-2
                  text-[10px]
                  font-semibold
                  text-[#6F89A4]
                "
              >
                {t(
                  "overview.cityOverviewMap.loadingDivisionsFor",
                  "Loading divisions for",
                )}{" "}
                {selectedZoneName}
                ...
              </div>
            )}

            {wardsLoading && (
              <div
                className="
                  mb-2
                  rounded-lg
                  bg-[#F4F8FB]
                  px-2.5
                  py-2
                  text-[10px]
                  font-semibold
                  text-[#6F89A4]
                "
              >
                {t(
                  "overview.cityOverviewMap.loadingWardsFor",
                  "Loading wards for",
                )}{" "}
                {selectedDivisionName}
                ...
              </div>
            )}

            {divisionError && (
              <div
                className="
                  mb-2
                  border-t
                  border-[#EDF1F5]
                  pt-2
                  text-[10px]
                  leading-4
                  text-rose-600
                "
              >
                {divisionError}
              </div>
            )}

            {wardError && (
              <div
                className="
                  mb-2
                  border-t
                  border-[#EDF1F5]
                  pt-2
                  text-[10px]
                  leading-4
                  text-rose-600
                "
              >
                {wardError}
              </div>
            )}

            {/* ==================================================
                RESET
            ================================================== */}

            {(selectedZone || selectedDivision || selectedWard) && (
              <button
                type="button"
                className="
                  flex
                  h-10
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-[#D4E0EA]
                  bg-white
                  text-[10px]
                  font-bold
                  text-[#4E6A84]
                  transition
                  hover:border-[#9DB5CC]
                  hover:bg-[#F7FAFC]

                  sm:h-11
                  sm:text-[11px]
                "
                onClick={resetMap}
              >
                <RotateCcw size={14} />

                {t("overview.cityOverviewMap.resetMap", "Reset Map")}
              </button>
            )}
          </div>
        )}

        {/* ====================================================
            SELECTED LOCATION CARD
        ==================================================== */}

        {mapView === "overview" &&
          (selectedWard ? (
            <div
              className="
                absolute
                bottom-4
                left-4
                z-[1900]

                hidden
                w-[330px]

                rounded-2xl
                border
                border-[#DCE4EC]
                bg-white/97

                p-4

                shadow-[0_12px_30px_rgba(30,45,60,0.08)]
                backdrop-blur-xl

                md:block
                lg:w-[350px]
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-wide
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
                        (wards.findIndex((ward) =>
                          sameEntity(
                            ward,
                            selectedWard,
                            getWardId,
                            getWardName,
                          ),
                        ) >= 0
                          ? wards.findIndex((ward) =>
                              sameEntity(
                                ward,
                                selectedWard,
                                getWardId,
                                getWardName,
                              ),
                            )
                          : 0) % WARD_COLORS.length
                      ],
                  }}
                />

                {t("overview.cityOverviewMap.selectedWard", "Selected Ward")}
              </div>

              <div
                className="
                  mt-1.5
                  truncate
                  text-[15px]
                  font-bold
                  text-[#34475B]
                "
              >
                {getWardName(selectedWard)}
              </div>

              <div
                className="
                  mt-1
                  truncate
                  border-b
                  border-[#E7EDF3]
                  pb-2
                  text-[10px]
                  text-[#8BA4BF]
                "
              >
                {t("overview.cityOverviewMap.wardId", "Ward ID")}:{" "}
                {getWardId(selectedWard) ?? "—"}
              </div>

              <div
                className="
                  mt-3
                  grid
                  grid-cols-3
                  gap-2
                "
              >
                <div>
                  <div
                    className="
                      text-[8px]
                      font-bold
                      uppercase
                      text-[#91A7BC]
                    "
                  >
                    {t("overview.cityOverviewMap.city", "City")}
                  </div>

                  <div
                    className="
                      mt-0.5
                      truncate
                      text-[10px]
                      font-bold
                      text-[#49627C]
                    "
                  >
                    {city?.cityName || "Bangalore"}
                  </div>
                </div>

                <div>
                  <div
                    className="
                      text-[8px]
                      font-bold
                      uppercase
                      text-[#91A7BC]
                    "
                  >
                    {t("overview.cityOverviewMap.division", "Division")}
                  </div>

                  <div
                    className="
                      mt-0.5
                      truncate
                      text-[10px]
                      font-bold
                      text-[#49627C]
                    "
                  >
                    {getDivisionName(selectedDivision)}
                  </div>
                </div>

                <div>
                  <div
                    className="
                      text-[8px]
                      font-bold
                      uppercase
                      text-[#91A7BC]
                    "
                  >
                    {t("overview.cityOverviewMap.wards", "Wards")}
                  </div>

                  <div
                    className="
                      mt-0.5
                      text-[10px]
                      font-bold
                      text-[#49627C]
                    "
                  >
                    {wards.length}
                  </div>
                </div>
              </div>
            </div>
          ) : selectedDivision ? (
            <div
              className="
                absolute
                bottom-4
                left-4
                z-[1900]

                hidden
                w-[330px]

                rounded-2xl
                border
                border-[#DCE4EC]
                bg-white/97

                p-4

                shadow-[0_12px_30px_rgba(30,45,60,0.08)]
                backdrop-blur-xl

                md:block
                lg:w-[350px]
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-wide
                  text-[#8AA1BB]
                "
              >
                <span
                  className="
                    h-2.5
                    w-2.5
                    rounded-full
                  "
                  style={{
                    backgroundColor:
                      DIVISION_COLORS[
                        (divisions.findIndex((division) =>
                          sameEntity(
                            division,
                            selectedDivision,
                            getDivisionId,
                            getDivisionName,
                          ),
                        ) >= 0
                          ? divisions.findIndex((division) =>
                              sameEntity(
                                division,
                                selectedDivision,
                                getDivisionId,
                                getDivisionName,
                              ),
                            )
                          : 0) % DIVISION_COLORS.length
                      ],
                  }}
                />

                {t(
                  "overview.cityOverviewMap.selectedDivision",
                  "Selected Division",
                )}
              </div>

              <div
                className="
                  mt-1.5
                  truncate
                  text-[15px]
                  font-bold
                  text-[#34475B]
                "
              >
                {getDivisionName(selectedDivision)}
              </div>

              <div
                className="
                  mt-1
                  truncate
                  border-b
                  border-[#E7EDF3]
                  pb-2
                  text-[10px]
                  text-[#8BA4BF]
                "
              >
                {getDivisionTableName(selectedDivision) || "Division"}
              </div>

              <div
                className="
                  mt-3
                  grid
                  grid-cols-3
                  gap-2
                "
              >
                <div>
                  <div
                    className="
                      text-[8px]
                      font-bold
                      uppercase
                      text-[#91A7BC]
                    "
                  >
                    {t("overview.cityOverviewMap.city", "City")}
                  </div>

                  <div
                    className="
                      mt-0.5
                      truncate
                      text-[10px]
                      font-bold
                      text-[#49627C]
                    "
                  >
                    {city?.cityName || "Bangalore"}
                  </div>
                </div>

                <div>
                  <div
                    className="
                      text-[8px]
                      font-bold
                      uppercase
                      text-[#91A7BC]
                    "
                  >
                    {t("overview.cityOverviewMap.divisions", "Divisions")}
                  </div>

                  <div
                    className="
                      mt-0.5
                      text-[10px]
                      font-bold
                      text-[#49627C]
                    "
                  >
                    {divisions.length}
                  </div>
                </div>

                <div>
                  <div
                    className="
                      text-[8px]
                      font-bold
                      uppercase
                      text-[#91A7BC]
                    "
                  >
                    {t("overview.cityOverviewMap.wards", "Wards")}
                  </div>

                  <div
                    className="
                      mt-0.5
                      text-[10px]
                      font-bold
                      text-[#49627C]
                    "
                  >
                    {wards.length}
                  </div>
                </div>
              </div>
            </div>
          ) : selectedZone ? (
            <div
              className="
                absolute
                bottom-4
                left-4
                z-[1900]

                hidden
                w-[330px]

                rounded-2xl
                border
                border-[#DCE4EC]
                bg-white/97

                p-4

                shadow-[0_12px_30px_rgba(30,45,60,0.08)]
                backdrop-blur-xl

                md:block
                lg:w-[350px]
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-wide
                  text-[#8AA1BB]
                "
              >
                <span
                  className="
                    h-2.5
                    w-2.5
                    rounded-full
                  "
                  style={{
                    backgroundColor:
                      ZONE_COLORS[
                        Math.max(
                          0,
                          zones.findIndex((zone) =>
                            sameEntity(
                              zone,
                              selectedZone,
                              getZoneId,
                              getZoneName,
                            ),
                          ),
                        ) % ZONE_COLORS.length
                      ],
                  }}
                />

                {t("overview.cityOverviewMap.selectedZone", "Selected Zone")}
              </div>

              <div
                className="
                  mt-1.5
                  truncate
                  text-[15px]
                  font-bold
                  text-[#34475B]
                "
              >
                {getZoneName(selectedZone)}
              </div>

              <div
                className="
                  mt-1
                  truncate
                  border-b
                  border-[#E7EDF3]
                  pb-2
                  text-[10px]
                  text-[#8BA4BF]
                "
              >
                {getZoneTableName(selectedZone) || getZoneName(selectedZone)}
              </div>

              <div
                className="
                  mt-3
                  grid
                  grid-cols-3
                  gap-2
                "
              >
                <div>
                  <div
                    className="
                      text-[8px]
                      font-bold
                      uppercase
                      text-[#91A7BC]
                    "
                  >
                    {t("overview.cityOverviewMap.city", "City")}
                  </div>

                  <div
                    className="
                      mt-0.5
                      truncate
                      text-[10px]
                      font-bold
                      text-[#49627C]
                    "
                  >
                    {city?.cityName || "Bangalore"}
                  </div>
                </div>

                <div>
                  <div
                    className="
                      text-[8px]
                      font-bold
                      uppercase
                      text-[#91A7BC]
                    "
                  >
                    {t("overview.cityOverviewMap.divisions", "Divisions")}
                  </div>

                  <div
                    className="
                      mt-0.5
                      text-[10px]
                      font-bold
                      text-[#49627C]
                    "
                  >
                    {divisions.length}
                  </div>
                </div>

                <div>
                  <div
                    className="
                      text-[8px]
                      font-bold
                      uppercase
                      text-[#91A7BC]
                    "
                  >
                    {t("overview.cityOverviewMap.wards", "Wards")}
                  </div>

                  <div
                    className="
                      mt-0.5
                      text-[10px]
                      font-bold
                      text-[#49627C]
                    "
                  >
                    {divisions.reduce(
                      (total, division) =>
                        total +
                        (Array.isArray(division?.wards)
                          ? division.wards.length
                          : 0),
                      0,
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
              pointer-events-none
              absolute
              inset-0
              z-[4000]
              flex
              items-center
              justify-center
            "
          >
            <div
              className="
                rounded-xl
                border
                border-[#DFE7EF]
                bg-white/95
                px-4
                py-2.5
                text-[11px]
                font-semibold
                text-[#536A84]
                shadow-[0_12px_30px_rgba(0,0,0,0.08)]

                sm:text-[12px]
              "
            >
              {t("overview.cityOverviewMap.loading", "Loading city map...")}
            </div>
          </div>
        )}

        {/* ====================================================
            ERROR
        ==================================================== */}

        {!loading && error && (
          <div
            className="
                pointer-events-none
                absolute
                inset-0
                z-[4000]
                flex
                items-center
                justify-center
                p-4
              "
          >
            <div
              className="
                  max-w-[90%]
                  rounded-xl
                  border
                  border-[#DFE7EF]
                  bg-white/95
                  px-4
                  py-2.5
                  text-center
                  text-[11px]
                  font-semibold
                  text-red-600
                  shadow-[0_12px_30px_rgba(0,0,0,0.08)]

                  sm:text-[12px]
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
