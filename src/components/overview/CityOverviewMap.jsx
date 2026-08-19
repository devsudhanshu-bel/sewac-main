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
  Route,
  RotateCcw,
  MapPinned,
  Factory,
  MessageSquareWarning,
} from "lucide-react";

import { createPortal } from "react-dom";

import Plants from "../plants/Plants";

import "leaflet/dist/leaflet.css";

/* ============================================================
   CONFIGURATION
============================================================ */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5002";

const DEFAULT_CITY_ID = 1;

/* ============================================================
   ENDPOINTS
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

const PLANTS_ENDPOINT =
  `${API_BASE_URL}/api/plants`;

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
   HELPERS
============================================================ */

function parseGeoJSON(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  if (
    typeof value === "object"
  ) {
    return value;
  }

  if (
    typeof value === "string"
  ) {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  return null;
}

function extractArray(result, key) {
  if (Array.isArray(result)) {
    return result;
  }

  if (
    result &&
    Array.isArray(result[key])
  ) {
    return result[key];
  }

  if (
    result?.data &&
    Array.isArray(result.data)
  ) {
    return result.data;
  }

  if (
    result?.data &&
    Array.isArray(result.data[key])
  ) {
    return result.data[key];
  }

  return [];
}

function getZoneId(zone) {
  return (
    zone?.id ??
    zone?.zoneId ??
    zone?.zone_id ??
    null
  );
}

function getZoneName(zone) {
  return (
    zone?.zoneName ??
    zone?.zone_name ??
    zone?.name ??
    zone?.zone ??
    "Unnamed Zone"
  );
}

function getZoneTableName(zone) {
  return (
    zone?.zoneTableName ??
    zone?.zone_table_name ??
    zone?.tableName ??
    zone?.table_name ??
    zone?.zoneTable ??
    null
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

function getDivisionName(division) {
  return (
    division?.divisionName ??
    division?.division_name ??
    division?.name ??
    division?.division ??
    "Unnamed Division"
  );
}

function getDivisionTableName(division) {
  return (
    division?.divisionTableName ??
    division?.division_table_name ??
    division?.tableName ??
    division?.table_name ??
    division?.divisionTable ??
    null
  );
}

function getWardId(ward) {
  return (
    ward?.id ??
    ward?.wardId ??
    ward?.ward_id ??
    null
  );
}

function getWardName(ward) {
  return (
    ward?.wardName ??
    ward?.ward_name ??
    ward?.name ??
    ward?.ward ??
    "Unnamed Ward"
  );
}

function getGeometry(entity) {
  return parseGeoJSON(
    entity?.geoBoundary ??
      entity?.geo_boundary ??
      entity?.geometry ??
      entity?.geoJson ??
      entity?.geo_json ??
      entity?.boundary ??
      null
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
    secondId !== null
  ) {
    return String(firstId) === String(secondId);
  }

  return (
    getName(first) ===
    getName(second)
  );
}

function getGeoJSONBounds(data) {
  if (!data) {
    return null;
  }

  try {
    const layer =
      L.geoJSON(data);

    const bounds =
      layer.getBounds();

    if (
      bounds &&
      bounds.isValid()
    ) {
      return bounds;
    }
  } catch (error) {
    console.warn(
      "Unable to calculate GeoJSON bounds:",
      error
    );
  }

  return null;
}

/* ============================================================
   MAP SIZE CONTROLLER
============================================================ */

function MapSizeController() {
  const map = useMap();

  useEffect(() => {
    const timer =
      setTimeout(() => {
        map.invalidateSize();
      }, 100);

    return () =>
      clearTimeout(timer);
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
  const hasFitted =
    useRef(false);

  useEffect(() => {
    if (
      hasFitted.current
    ) {
      return;
    }

    if (
      cityBoundary
    ) {
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
              40,
              40,
            ],
            maxZoom: 11,
          }
        );

        hasFitted.current =
          true;

        return;
      }
    }

    if (
      zones &&
      zones.length > 0
    ) {
      const bounds =
        L.latLngBounds([]);

      zones.forEach(
        (zone) => {
          const geometry =
            getGeometry(zone);

          const zoneBounds =
            getGeoJSONBounds(
              geometry
            );

          if (
            zoneBounds &&
            zoneBounds.isValid()
          ) {
            bounds.extend(
              zoneBounds
            );
          }
        }
      );

      if (
        bounds.isValid()
      ) {
        map.fitBounds(
          bounds,
          {
            padding: [
              40,
              40,
            ],
            maxZoom: 11,
          }
        );

        hasFitted.current =
          true;
      }
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
  const geometry =
    getGeometry(zone);

  if (!geometry) {
    return null;
  }

  const color =
    ZONE_COLORS[
      index %
        ZONE_COLORS.length
    ];

  return (
    <GeoJSON
      data={geometry}
      style={() => ({
        color:
          selected
            ? "#20364C"
            : "#6B86A0",
        weight:
          selected
            ? 3
            : 1.5,
        opacity: 1,
        fillColor:
          color,
        fillOpacity:
          selected
            ? 0.45
            : 0.22,
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
  const geometry =
    getGeometry(division);

  if (!geometry) {
    return null;
  }

  const color =
    DIVISION_COLORS[
      index %
        DIVISION_COLORS.length
    ];

  return (
    <GeoJSON
      data={geometry}
      style={() => ({
        color:
          selected
            ? "#20364C"
            : color,
        weight:
          selected
            ? 3
            : 1.5,
        opacity: 1,
        fillColor:
          color,
        fillOpacity:
          selected
            ? 0.42
            : 0.16,
      })}
      eventHandlers={{
        click: () =>
          onSelect(division),
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
  const geometry =
    getGeometry(ward);

  if (!geometry) {
    return null;
  }

  const color =
    WARD_COLORS[
      index %
        WARD_COLORS.length
    ];

  return (
    <GeoJSON
      data={geometry}
      style={() => ({
        color:
          selected
            ? "#20364C"
            : color,
        weight:
          selected
            ? 3
            : 1.2,
        opacity: 1,
        fillColor:
          color,
        fillOpacity:
          selected
            ? 0.48
            : 0.18,
      })}
      eventHandlers={{
        click: () =>
          onSelect(ward),
      }}
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
        color: "#263B52",
        weight: 3.6,
        opacity: 1,
        fillColor:
          "transparent",
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

  useEffect(() => {
    if (
      !open ||
      disabled ||
      !buttonRef.current
    ) {
      return;
    }

    const updatePosition =
      () => {
        const rect =
          buttonRef.current.getBoundingClientRect();

        setPosition({
          top:
            rect.bottom + 5,
          left:
            rect.left,
          width:
            rect.width,
        });
      };

    updatePosition();

    window.addEventListener(
      "resize",
      updatePosition
    );

    window.addEventListener(
      "scroll",
      updatePosition,
      true
    );

    return () => {
      window.removeEventListener(
        "resize",
        updatePosition
      );

      window.removeEventListener(
        "scroll",
        updatePosition,
        true
      );
    };
  }, [
    open,
    disabled,
  ]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleOutside =
      (event) => {
        if (
          buttonRef.current?.contains(
            event.target
          ) ||
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
      handleOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutside
      );
    };
  }, [
    open,
    setOpen,
  ]);

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
              top:
                position.top,
              left:
                position.left,
              width:
                position.width,
            }}
          >
            {options.length ===
            0 ? (
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
                      key={`${optionValue}-${index}`}
                      className={`cm-dropdown-option ${
                        selectedOption
                          ? "cm-dropdown-option-active"
                          : ""
                      }`}
                      onMouseDown={(
                        event
                      ) => {
                        event.stopPropagation();
                      }}
                      onClick={() => {
                        onChange?.(
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
            size={15}
          />
        ) : (
          <ChevronDown
            size={15}
          />
        )}
      </button>

      {menu}
    </div>
  );
}

/* ============================================================
   PLACEHOLDER
============================================================ */

function PlaceholderView({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="cm-placeholder-view">
      <div className="cm-placeholder-card">

        <div className="cm-placeholder-icon">
          <Icon
            size={32}
            strokeWidth={1.8}
          />
        </div>

        <div className="cm-placeholder-title">
          {title}
        </div>

        <div className="cm-placeholder-description">
          {description}
        </div>

      </div>
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
  /* ==========================================================
     CITY STATE
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

  /* ==========================================================
     FILTER STATE
  ========================================================== */

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

  /* ==========================================================
     DROPDOWN STATE
  ========================================================== */

  const [
    openDropdown,
    setOpenDropdown,
  ] = useState(null);

  const [
    showViewMenu,
    setShowViewMenu,
  ] = useState(false);

  /* ==========================================================
     IMPORTANT:
     MAP VIEW IS NOW ACTUALLY CONTROLLED HERE
  ========================================================== */

  const [
    mapView,
    setMapView,
  ] = useState("overview");

  /* ==========================================================
     PLANT STATE
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

  const plantsAbortRef =
    useRef(null);

  const divisionAbortRef =
    useRef(null);

  const wardAbortRef =
    useRef(null);

  /* ==========================================================
     CITY MAP
  ========================================================== */

  const fetchCityMapData =
    useCallback(
      async () => {
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

          if (
            !response.ok
          ) {
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
     PLANTS
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

          setPlantsError("");

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

          if (
            !response.ok
          ) {
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
            extractArray(
              result,
              "plants"
            );

          setPlants(
            loadedPlants
          );

          console.log(
            "PLANTS LOADED:",
            loadedPlants.length
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
            "PLANTS ERROR:",
            requestError
          );

          setPlantsError(
            requestError?.message ||
              "Unable to load plants."
          );

          setPlants([]);
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

  /* ==========================================================
     LOAD PLANTS ONLY WHEN PLANTS VIEW IS SELECTED
  ========================================================== */

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
          return;
        }

        const zoneTableName =
          getZoneTableName(
            zone
          );

        if (
          !zoneTableName
        ) {
          setDivisions([]);
          setSelectedDivision(null);

          setDivisionError(
            "Selected zone does not contain a valid zone table name."
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

        setDivisionError("");

        setDivisions([]);
        setSelectedDivision(null);

        setWards([]);
        setSelectedWard(null);

        setWardError("");

        try {
          const response =
            await fetch(
              ZONE_DIVISIONS_ENDPOINT(
                zoneTableName
              ),
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

          if (
            !response.ok
          ) {
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
            );

          setDivisions(
            loadedDivisions
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
            "DIVISIONS ERROR:",
            requestError
          );

          setDivisionError(
            requestError?.message ||
              "Unable to load divisions."
          );

          setDivisions([]);
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
     FETCH WARDS
  ========================================================== */

  const fetchDivisionWards =
    useCallback(
      async (division) => {
        wardAbortRef.current?.abort();

        if (!division) {
          setWards([]);
          setSelectedWard(null);
          return;
        }

        const divisionTableName =
          getDivisionTableName(
            division
          );

        if (
          !divisionTableName
        ) {
          setWards([]);

          setWardError(
            "Selected division does not contain a valid division table name."
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

        setWardError("");
        setWards([]);
        setSelectedWard(null);

        try {
          const response =
            await fetch(
              DIVISION_WARDS_ENDPOINT(
                divisionTableName
              ),
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

          if (
            !response.ok
          ) {
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
            );

          setWards(
            loadedWards
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
            "WARDS ERROR:",
            requestError
          );

          setWardError(
            requestError?.message ||
              "Unable to load wards."
          );

          setWards([]);
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
     SELECT ZONE
  ========================================================== */

  const handleZoneSelect =
    useCallback(
      (zone) => {
        setSelectedZone(
          zone
        );

        setSelectedDivision(
          null
        );

        setSelectedWard(
          null
        );

        setWards([]);

        setWardError("");

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

  /* ==========================================================
     SELECT DIVISION
  ========================================================== */

  const handleDivisionSelect =
    useCallback(
      (option) => {
        const division =
          option?.division ||
          option;

        setSelectedDivision(
          division
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
          division
        );
      },
      [
        fetchDivisionWards,
      ]
    );

  /* ==========================================================
     RESET MAP
  ========================================================== */

  const resetMap =
    useCallback(() => {
      setMapView(
        "overview"
      );

      setSelectedZone(
        null
      );

      setSelectedDivision(
        null
      );

      setSelectedWard(
        null
      );

      setDivisions([]);

      setWards([]);

      setDivisionError("");

      setWardError("");

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

        const boundary =
          getGeometry(
            city
          );

        const bounds =
          getGeoJSONBounds(
            boundary
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
    }, [city]);

  /* ==========================================================
     ⭐ MAP VIEW CHANGE
     THIS IS THE IMPORTANT FIX
  ========================================================== */

  const handleMapViewChange =
    useCallback(
      (view) => {
        console.log(
          "MAP VIEW CHANGED:",
          view
        );

        setShowViewMenu(
          false
        );

        setOpenDropdown(
          null
        );

        /*
         * ALWAYS update local state.
         *
         * This is what makes:
         *
         * City Overview Map
         * Route Maps
         * GVP Points
         * Plants
         * Customer Grievances
         *
         * dynamically change.
         */
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
         * When going back to overview,
         * clear the city-specific selections.
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

          setDivisions([]);

          setWards([]);

          setDivisionError("");

          setWardError("");
        }

        /*
         * IMPORTANT:
         *
         * We DO NOT use window.location.href
         * for Plants.
         *
         * Plants is rendered directly
         * inside this component.
         */

        if (
          view ===
          "plants"
        ) {
          console.log(
            "🌱 PLANTS VIEW SELECTED"
          );
        }

        if (
          view ===
          "gvp"
        ) {
          console.log(
            "📍 GVP VIEW SELECTED"
          );
        }

        if (
          view ===
          "grievances"
        ) {
          console.log(
            "⚠️ GRIEVANCES VIEW SELECTED"
          );
        }
      },
      [
        onViewChange,
      ]
    );

  /* ==========================================================
     OPTIONS
  ========================================================== */

  const mapViewOptions =
    useMemo(
      () => [
        {
          id:
            "overview",
          label:
            "City Overview Map",
          icon:
            MapIcon,
        },
        {
          id:
            "route",
          label:
            "Route Maps",
          icon:
            Route,
        },
        {
          id:
            "gvp",
          label:
            "GVP Points",
          icon:
            MapPinned,
        },
        {
          id:
            "plants",
          label:
            "Plants",
          icon:
            Factory,
        },
        {
          id:
            "grievances",
          label:
            "Customer Grievances",
          icon:
            MessageSquareWarning,
        },
      ],
      []
    );

  const currentView =
    mapViewOptions.find(
      (item) =>
        item.id ===
        mapView
    ) ||
    mapViewOptions[0];

  const CurrentViewIcon =
    currentView.icon;

  /* ==========================================================
     NORMALIZED DATA
  ========================================================== */

  const cityBoundary =
    useMemo(
      () =>
        getGeometry(
          city
        ),
      [city]
    );

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

  const zoneOptions =
    useMemo(
      () => [
        {
          value: "",
          label:
            "All Zones",
        },
        ...zones.map(
          (
            zone
          ) => ({
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
          division:
            null,
        },
        ...divisions.map(
          (
            division
          ) => ({
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

  const wardOptions =
    useMemo(
      () => [
        {
          value: "",
          label:
            "All Wards",
          ward:
            null,
        },
        ...wards.map(
          (
            ward
          ) => ({
            value:
              getWardName(
                ward
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
     VISIBLE DATA
  ========================================================== */

  const visibleDivisions =
    selectedZone
      ? divisions
      : [];

  const visibleWards =
    selectedDivision
      ? wards
      : [];

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
          border-radius: 18px;
          padding: 14px;
          box-sizing: border-box;
          box-shadow:
            0 4px 18px
            rgba(31,45,61,.05);
        }

        .cm-heading {
          margin:
            0 0 10px 2px;
          font-size:
            21px;
          line-height:
            1.15;
          font-weight:
            700;
          letter-spacing:
            -.3px;
          color:
            #07111f;
        }

        .cm-map-shell {
          position:
            relative;
          width:
            100%;
          min-height:
            600px;
          height:
            600px;
          overflow:
            hidden;
          border:
            1px solid #dce4ec;
          border-radius:
            18px;
          background:
            #eef1f3;
        }

        .cm-map,
        .cm-map .leaflet-container {
          width:
            100%;
          height:
            100%;
        }

        .cm-map .leaflet-tile-pane {
          filter:
            saturate(.42)
            brightness(1.05);
        }

        .cm-map .leaflet-control-zoom {
          margin-top:
            12px;
          margin-left:
            12px;
          border:
            1px solid #d8e1ea;
          border-radius:
            8px;
          overflow:
            hidden;
          box-shadow:
            0 3px 12px
            rgba(36,53,72,.08);
        }

        .cm-map .leaflet-control-zoom a {
          width:
            32px;
          height:
            32px;
          line-height:
            32px;
          font-size:
            18px;
          color:
            #34475b;
          background:
            #ffffff;
        }

        .cm-map .leaflet-control-attribution {
          font-size:
            10px;
          background:
            rgba(255,255,255,.82);
        }

        /* HEADER */

        .cm-map-header {
          position:
            absolute;
          z-index:
            2000;
          top:
            18px;
          left:
            18px;
          width:
            min(52%, 520px);
          min-height:
            76px;
          padding:
            14px 18px;
          box-sizing:
            border-box;
          display:
            flex;
          align-items:
            center;
          justify-content:
            space-between;
          background:
            rgba(255,255,255,.97);
          backdrop-filter:
            blur(12px);
          border:
            1px solid
            rgba(216,225,235,.9);
          border-radius:
            16px;
          box-shadow:
            0 12px 30px
            rgba(30,45,60,.08);
        }

        .cm-header-left {
          display:
            flex;
          align-items:
            center;
          gap:
            12px;
          min-width:
            0;
        }

        .cm-header-icon {
          width:
            29px;
          height:
            29px;
          color:
            #617b98;
          flex-shrink:
            0;
        }

        .cm-header-title {
          font-size:
            19px;
          font-weight:
            700;
          line-height:
            1.1;
          color:
            #34475b;
          white-space:
            nowrap;
          overflow:
            hidden;
          text-overflow:
            ellipsis;
        }

        .cm-header-city {
          margin-top:
            4px;
          font-size:
            11px;
          font-weight:
            600;
          color:
            #8aa1bb;
        }

        .cm-header-button {
          width:
            32px;
          height:
            32px;
          display:
            flex;
          align-items:
            center;
          justify-content:
            center;
          border:
            0;
          border-radius:
            9px;
          background:
            transparent;
          color:
            #34475b;
          cursor:
            pointer;
          flex-shrink:
            0;
        }

        .cm-header-button:hover {
          background:
            #f3f7fa;
        }

        /* VIEW MENU */

        .cm-view-menu {
          position:
            absolute;
          z-index:
            3000;
          top:
            calc(100% + 8px);
          left:
            0;
          width:
            280px;
          padding:
            7px;
          background:
            rgba(255,255,255,.98);
          border:
            1px solid #dce4ec;
          border-radius:
            14px;
          box-shadow:
            0 16px 38px
            rgba(30,45,60,.14);
        }

        .cm-view-option {
          width:
            100%;
          min-height:
            42px;
          display:
            flex;
          align-items:
            center;
          gap:
            10px;
          padding:
            9px 11px;
          border:
            0;
          border-radius:
            10px;
          background:
            transparent;
          color:
            #47617b;
          font-size:
            12.5px;
          font-weight:
            600;
          text-align:
            left;
          cursor:
            pointer;
          transition:
            .15s ease;
        }

        .cm-view-option:hover {
          background:
            #f5f8fb;
        }

        .cm-view-option-active {
          background:
            #edf3f8;
          color:
            #20364c;
        }

        /* FILTER CARD */

        .cm-filter-card {
          position:
            absolute;
          z-index:
            2000;
          top:
            18px;
          right:
            18px;
          width:
            300px;
          padding:
            15px;
          box-sizing:
            border-box;
          background:
            rgba(255,255,255,.97);
          backdrop-filter:
            blur(12px);
          border:
            1px solid #dce4ec;
          border-radius:
            16px;
          box-shadow:
            0 12px 30px
            rgba(30,45,60,.09);
        }

        .cm-filter-title {
          margin-bottom:
            13px;
          font-size:
            14px;
          font-weight:
            700;
          color:
            #34475b;
        }

        .cm-filter-group {
          position:
            relative;
          margin-bottom:
            11px;
        }

        .cm-filter-label {
          margin-bottom:
            5px;
          font-size:
            10px;
          font-weight:
            700;
          color:
            #8ba4bf;
          letter-spacing:
            .2px;
        }

        .cm-select {
          width:
            100%;
          height:
            40px;
          display:
            flex;
          align-items:
            center;
          justify-content:
            space-between;
          padding:
            0 11px;
          box-sizing:
            border-box;
          border:
            1px solid #cfddea;
          border-radius:
            10px;
          background:
            #ffffff;
          color:
            #4b6179;
          font-size:
            12px;
          font-weight:
            600;
          text-align:
            left;
          cursor:
            pointer;
        }

        .cm-select:hover {
          border-color:
            #91afd0;
        }

        .cm-select-disabled {
          cursor:
            not-allowed;
          background:
            #f8fafc;
          color:
            #a4b2c0;
          border-color:
            #dce5ee;
          opacity:
            .68;
        }

        .cm-select-value,
        .cm-select-placeholder {
          overflow:
            hidden;
          text-overflow:
            ellipsis;
          white-space:
            nowrap;
        }

        .cm-select-value {
          color:
            #435b73;
        }

        .cm-select-placeholder {
          color:
            #93a4b5;
        }

        /* PORTAL */

        .cm-dropdown-portal {
          position:
            fixed;
          z-index:
            2147483647;
          max-height:
            300px;
          overflow-y:
            auto;
          padding:
            5px;
          box-sizing:
            border-box;
          background:
            #ffffff;
          border:
            1px solid #dce5ee;
          border-radius:
            13px;
          box-shadow:
            0 16px 38px
            rgba(30,45,60,.16);
        }

        .cm-dropdown-option {
          width:
            100%;
          min-height:
            40px;
          display:
            flex;
          align-items:
            center;
          gap:
            8px;
          padding:
            8px 10px;
          box-sizing:
            border-box;
          border:
            0;
          border-radius:
            9px;
          background:
            transparent;
          color:
            #47617b;
          font-size:
            12.5px;
          font-weight:
            600;
          text-align:
            left;
          cursor:
            pointer;
        }

        .cm-dropdown-option:hover {
          background:
            #f5f8fb;
        }

        .cm-dropdown-option-active {
          background:
            #edf3f8;
          color:
            #20364c;
        }

        .cm-dropdown-empty {
          padding:
            12px;
          color:
            #94a3b8;
          font-size:
            12px;
          font-weight:
            600;
          text-align:
            center;
        }

        .cm-zone-dot {
          width:
            10px;
          height:
            10px;
          border-radius:
            50%;
          flex-shrink:
            0;
          border:
            1px solid
            rgba(49,73,96,.35);
        }

        /* STATUS */

        .cm-status {
          margin:
            3px 0 8px;
          padding:
            7px 9px;
          border-radius:
            9px;
          background:
            #f4f8fb;
          color:
            #6f89a4;
          font-size:
            10.5px;
          font-weight:
            600;
        }

        .cm-error {
          margin:
            3px 0 8px;
          padding:
            7px 9px;
          border-radius:
            9px;
          background:
            #fff1f2;
          color:
            #dc2626;
          font-size:
            10.5px;
          line-height:
            1.4;
          font-weight:
            600;
        }

        /* RESET */

        .cm-reset-button {
          width:
            100%;
          height:
            40px;
          display:
            flex;
          align-items:
            center;
          justify-content:
            center;
          gap:
            8px;
          margin-top:
            4px;
          border:
            1px solid #d4e0ea;
          border-radius:
            10px;
          background:
            #ffffff;
          color:
            #4e6a84;
          font-size:
            12px;
          font-weight:
            700;
          cursor:
            pointer;
        }

        .cm-reset-button:hover {
          background:
            #f7fafc;
        }

        /* SPECIAL VIEWS */

        .cm-special-view {
          position:
            absolute;
          inset:
            0;
          z-index:
            1500;
          overflow:
            auto;
          background:
            #ffffff;
        }

        .cm-special-loading {
          height:
            100%;
          display:
            flex;
          align-items:
            center;
          justify-content:
            center;
          font-size:
            13px;
          font-weight:
            600;
          color:
            #607891;
        }

        .cm-placeholder-view {
          width:
            100%;
          height:
            100%;
          display:
            flex;
          align-items:
            center;
          justify-content:
            center;
          background:
            #f8fafc;
        }

        .cm-placeholder-card {
          width:
            320px;
          padding:
            30px;
          text-align:
            center;
          background:
            #ffffff;
          border:
            1px solid #e2e8f0;
          border-radius:
            18px;
          box-shadow:
            0 10px 30px
            rgba(30,45,60,.06);
        }

        .cm-placeholder-icon {
          width:
            62px;
          height:
            62px;
          margin:
            0 auto 15px;
          display:
            flex;
          align-items:
            center;
          justify-content:
            center;
          border-radius:
            16px;
          background:
            #edf3f8;
          color:
            #607b98;
        }

        .cm-placeholder-title {
          font-size:
            17px;
          font-weight:
            700;
          color:
            #34475b;
        }

        .cm-placeholder-description {
          margin-top:
            7px;
          font-size:
            12px;
          line-height:
            1.5;
          color:
            #8ba0b4;
        }

        /* SELECTED CARD */

        .cm-selected-card {
          position:
            absolute;
          z-index:
            2000;
          left:
            18px;
          bottom:
            18px;
          width:
            300px;
          padding:
            14px 16px;
          box-sizing:
            border-box;
          background:
            rgba(255,255,255,.97);
          backdrop-filter:
            blur(12px);
          border:
            1px solid #dce4ec;
          border-radius:
            15px;
          box-shadow:
            0 12px 30px
            rgba(30,45,60,.08);
        }

        .cm-selected-label {
          display:
            flex;
          align-items:
            center;
          gap:
            8px;
          font-size:
            10px;
          font-weight:
            700;
          color:
            #8aa1bb;
        }

        .cm-selected-dot {
          width:
            10px;
          height:
            10px;
          border-radius:
            50%;
          border:
            1px solid
            rgba(49,73,96,.3);
        }

        .cm-selected-name {
          margin-top:
            7px;
          font-size:
            16px;
          font-weight:
            700;
          color:
            #34475b;
        }

        .cm-selected-table {
          margin-top:
            5px;
          padding-bottom:
            9px;
          border-bottom:
            1px solid #e7edf3;
          font-size:
            10px;
          color:
            #8ba4bf;
          overflow:
            hidden;
          text-overflow:
            ellipsis;
          white-space:
            nowrap;
        }

        .cm-selected-info {
          display:
            grid;
          grid-template-columns:
            repeat(3,minmax(0,1fr));
          gap:
            8px;
          margin-top:
            10px;
        }

        .cm-info-label {
          font-size:
            9px;
          font-weight:
            700;
          color:
            #91a7bc;
          text-transform:
            uppercase;
        }

        .cm-info-value {
          margin-top:
            3px;
          font-size:
            11px;
          font-weight:
            700;
          color:
            #49627c;
        }

        /* RESPONSIVE */

        @media (
          max-width: 800px
        ) {
          .cm-map-shell {
            min-height:
              680px;
            height:
              680px;
          }

          .cm-map-header {
            left:
              12px;
            top:
              12px;
            width:
              calc(100% - 24px);
          }

          .cm-filter-card {
            top:
              auto;
            right:
              12px;
            left:
              12px;
            bottom:
              12px;
            width:
              auto;
            max-height:
              300px;
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

      <h2 className="cm-heading">
        CITY OVERVIEW MAP
      </h2>

      {/* ======================================================
          MAP SHELL
      ====================================================== */}

      <div className="cm-map-shell">

        {/* ====================================================
            ACTUAL CITY MAP
        ==================================================== */}

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
              zones={
                zones
              }
            />

            {/* ZONES */}

            {zones.length >
              0 && (
              <Pane
                name="zonePane"
                style={{
                  zIndex:
                    410,
                }}
              >
                {zones.map(
                  (
                    zone,
                    index
                  ) => (
                    <ZoneLayer
                      key={
                        `zone-${
                          getZoneId(
                            zone
                          ) ||
                          getZoneName(
                            zone
                          )
                        }-${index}`
                      }
                      zone={
                        zone
                      }
                      index={
                        index
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
            )}

            {/* DIVISIONS */}

            {selectedZone &&
              visibleDivisions.length >
                0 && (
              <Pane
                name="divisionPane"
                style={{
                  zIndex:
                    415,
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
                        index
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

                        setWards([]);

                        fetchDivisionWards(
                          divisionValue
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

            {/* WARDS */}

            {selectedDivision &&
              visibleWards.length >
                0 && (
              <Pane
                name="wardPane"
                style={{
                  zIndex:
                    418,
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
                      ward={
                        ward
                      }
                      index={
                        index
                      }
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

            {/* CITY OUTLINE */}

            <Pane
              name="cityBoundaryPane"
              style={{
                zIndex:
                  425,
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
            PLANTS
        ==================================================== */}

        {mapView ===
          "plants" && (
          <div className="cm-special-view">

            {plantsLoading ? (
              <div className="cm-special-loading">
                Loading plant locations...
              </div>
            ) : plantsError ? (
              <div className="cm-placeholder-view">
                <div className="cm-placeholder-card">

                  <div className="cm-placeholder-icon">
                    <Factory
                      size={32}
                    />
                  </div>

                  <div className="cm-placeholder-title">
                    Unable to Load Plants
                  </div>

                  <div className="cm-placeholder-description">
                    {plantsError}
                  </div>

                  <button
                    type="button"
                    className="cm-reset-button"
                    style={{
                      marginTop:
                        "18px",
                    }}
                    onClick={
                      fetchPlants
                    }
                  >
                    Retry
                  </button>

                </div>
              </div>
            ) : (
              <Plants
                plants={
                  plants
                }
              />
            )}

          </div>
        )}

        {/* ====================================================
            GVP
        ==================================================== */}

        {mapView ===
          "gvp" && (
          <div className="cm-special-view">

            <PlaceholderView
              icon={
                MapPinned
              }
              title="Garbage Vulnerable Points"
              description="GVP locations will be displayed here."
            />

          </div>
        )}

        {/* ====================================================
            GRIEVANCES
        ==================================================== */}

        {mapView ===
          "grievances" && (
          <div className="cm-special-view">

            <PlaceholderView
              icon={
                MessageSquareWarning
              }
              title="Customer Grievances"
              description="Customer grievance locations will be displayed here."
            />

          </div>
        )}

        {/* ====================================================
            MAP HEADER / DROPDOWN
        ==================================================== */}

        <div
          className={`cm-map-header ${
            showViewMenu
              ? "cm-map-header-open"
              : ""
          }`}
        >

          <div className="cm-header-left">

            <CurrentViewIcon
              className="cm-header-icon"
              strokeWidth={
                1.8
              }
            />

            <div>

              <div className="cm-header-title">
                {
                  currentView.label
                }
              </div>

              <div className="cm-header-city">
                {
                  city?.cityName ||
                  "Bangalore"
                }
              </div>

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
                size={18}
              />
            ) : (
              <ChevronDown
                size={18}
              />
            )}
          </button>

          {/* ==================================================
              DYNAMIC VIEW DROPDOWN
          ================================================== */}

          {showViewMenu && (
            <div className="cm-view-menu">

              {mapViewOptions.map(
                (
                  option
                ) => {
                  const Icon =
                    option.icon;

                  return (
                    <button
                      key={
                        option.id
                      }
                      type="button"
                      className={`cm-view-option ${
                        mapView ===
                        option.id
                          ? "cm-view-option-active"
                          : ""
                      }`}
                      onClick={() =>
                        handleMapViewChange(
                          option.id
                        )
                      }
                    >
                      <Icon
                        size={18}
                      />

                      <span>
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
            FILTER CARD
            ONLY SHOW CITY FILTERS ON OVERVIEW
        ==================================================== */}

        {mapView ===
          "overview" && (
          <div className="cm-filter-card">

            <div className="cm-filter-title">
              MAP FILTERS
            </div>

            {/* ZONE */}

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
                    (
                      zone
                    ) =>
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

                    <span>
                      {
                        option.label
                      }
                    </span>
                  </>
                );
              }}
            />

            {/* DIVISION */}

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
            />

            {/* WARD */}

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
              onChange={(
                option
              ) => {
                if (
                  !option?.ward
                ) {
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
              }}
            />

            {/* STATUS */}

            {loading && (
              <div className="cm-status">
                Loading city map...
              </div>
            )}

            {!loading &&
              error && (
              <div className="cm-error">
                {error}
              </div>
            )}

            {divisionsLoading && (
              <div className="cm-status">
                Loading divisions...
              </div>
            )}

            {divisionError && (
              <div className="cm-error">
                {
                  divisionError
                }
              </div>
            )}

            {wardsLoading && (
              <div className="cm-status">
                Loading wards...
              </div>
            )}

            {wardError && (
              <div className="cm-error">
                {wardError}
              </div>
            )}

            {/* RESET */}

            <button
              type="button"
              className="cm-reset-button"
              onClick={
                resetMap
              }
            >
              <RotateCcw
                size={14}
              />

              Reset Map
            </button>

          </div>
        )}

        {/* ====================================================
            SELECTED WARD CARD
        ==================================================== */}

        {mapView ===
          "overview" &&
          selectedWard && (
          <div className="cm-selected-card">

            <div className="cm-selected-label">

              <span
                className="cm-selected-dot"
                style={{
                  backgroundColor:
                    WARD_COLORS[
                      Math.max(
                        0,
                        wards.findIndex(
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
                  {
                    city?.cityName ||
                    "Bangalore"
                  }
                </div>
              </div>

              <div>
                <div className="cm-info-label">
                  Division
                </div>

                <div className="cm-info-value">
                  {
                    selectedDivision
                      ? getDivisionName(
                          selectedDivision
                        )
                      : "—"
                  }
                </div>
              </div>

              <div>
                <div className="cm-info-label">
                  Wards
                </div>

                <div className="cm-info-value">
                  {
                    wards.length
                  }
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ====================================================
            SELECTED DIVISION CARD
        ==================================================== */}

        {mapView ===
          "overview" &&
          !selectedWard &&
          selectedDivision && (
          <div className="cm-selected-card">

            <div className="cm-selected-label">

              <span
                className="cm-selected-dot"
                style={{
                  backgroundColor:
                    DIVISION_COLORS[
                      Math.max(
                        0,
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
                        )
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
                ) ||
                getDivisionName(
                  selectedDivision
                )
              }
            </div>

            <div className="cm-selected-info">

              <div>
                <div className="cm-info-label">
                  City
                </div>

                <div className="cm-info-value">
                  {
                    city?.cityName ||
                    "Bangalore"
                  }
                </div>
              </div>

              <div>
                <div className="cm-info-label">
                  Wards
                </div>

                <div className="cm-info-value">
                  {
                    wards.length
                  }
                </div>
              </div>

              <div>
                <div className="cm-info-label">
                  Zone
                </div>

                <div className="cm-info-value">
                  {
                    selectedZone
                      ? getZoneName(
                          selectedZone
                        )
                      : "—"
                  }
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ====================================================
            SELECTED ZONE CARD
        ==================================================== */}

        {mapView ===
          "overview" &&
          !selectedWard &&
          !selectedDivision &&
          selectedZone && (
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
                  {
                    city?.cityName ||
                    "Bangalore"
                  }
                </div>
              </div>

              <div>
                <div className="cm-info-label">
                  Divisions
                </div>

                <div className="cm-info-value">
                  {
                    divisions.length
                  }
                </div>
              </div>

              <div>
                <div className="cm-info-label">
                  Wards
                </div>

                <div className="cm-info-value">
                  {
                    wards.length
                  }
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </section>
  );
}