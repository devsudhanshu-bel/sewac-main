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
  RotateCcw,
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
 * ============================================================
 * ONE AND ONLY API REQUEST
 * ============================================================
 *
 * Backend:
 *
 * CITY
 *   ↓
 * ZONES
 *   ↓
 * DIVISIONS
 *   ↓
 * WARDS
 *
 * The frontend does NOT make another request when:
 *
 * Zone is selected
 * Division is selected
 * Ward is selected
 *
 * Everything is filtered from the original response.
 */

const CITY_MAP_ENDPOINT = (cityId) =>
  `${API_BASE_URL}/api/master-citizen/map/city/${cityId}`;


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

const WARD_COLORS = [
  "#38BDF8",
  "#818CF8",
  "#34D399",
  "#F59E0B",
  "#EC4899",
  "#14B8A6",
  "#8B5CF6",
  "#06B6D4",
];


/* ============================================================
   GEOJSON HELPERS
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


/* ============================================================
   COORDINATE HELPERS
============================================================ */

function isCoordinatePair(value) {
  return (
    Array.isArray(value) &&
    value.length >= 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number"
  );
}


/*
 * Bangalore:
 *
 * Latitude  ≈ 13
 * Longitude ≈ 77
 *
 * GeoJSON:
 *
 * [longitude, latitude]
 *
 * Some raw database boundaries:
 *
 * [latitude, longitude]
 *
 * Swap only when the pair clearly matches
 * [latitude, longitude].
 */

function normalizeCoordinatePair(pair) {
  if (
    !isCoordinatePair(pair)
  ) {
    return pair;
  }

  const first =
    pair[0];

  const second =
    pair[1];

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
  if (
    !Array.isArray(value)
  ) {
    return value;
  }

  if (
    isCoordinatePair(value)
  ) {
    return normalizeCoordinatePair(
      value
    );
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

  if (
    geometry.coordinates
  ) {
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
  const parsed =
    parseGeoJSON(value);

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

  if (
    parsed.type ===
    "Feature"
  ) {
    return {
      ...parsed,

      geometry:
        normalizeGeometry(
          parsed.geometry
        ),
    };
  }

  if (
    parsed.type ===
      "Polygon" ||
    parsed.type ===
      "MultiPolygon" ||
    parsed.type ===
      "LineString" ||
    parsed.type ===
      "MultiLineString" ||
    parsed.type ===
      "Point" ||
    parsed.type ===
      "MultiPoint" ||
    parsed.type ===
      "GeometryCollection"
  ) {
    return {
      type: "Feature",

      properties: {},

      geometry:
        normalizeGeometry(
          parsed
        ),
    };
  }

  if (
    parsed.geometry &&
    typeof parsed.geometry ===
      "object"
  ) {
    return {
      type: "Feature",

      properties:
        parsed.properties ||
        {},

      geometry:
        normalizeGeometry(
          parsed.geometry
        ),
    };
  }

  if (
    parsed.coordinates
  ) {
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
      L.geoJSON(
        normalized
      );

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
   GENERIC ENTITY HELPERS
============================================================ */

function getEntityId(entity) {
  if (!entity) {
    return null;
  }

  const value =
    entity?.id ??
    entity?.zoneId ??
    entity?.zone_id ??
    entity?.divisionId ??
    entity?.division_id ??
    entity?.wardId ??
    entity?.ward_id ??
    null;

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  return String(value);
}


function sameEntity(
  first,
  second,
  getName
) {
  if (
    !first ||
    !second
  ) {
    return false;
  }

  const firstId =
    getEntityId(first);

  const secondId =
    getEntityId(second);

  /*
   * IDs are authoritative whenever
   * both entities have an ID.
   */

  if (
    firstId !== null &&
    secondId !== null
  ) {
    return (
      firstId ===
      secondId
    );
  }

  /*
   * Otherwise compare names.
   */

  return (
    getName(first) ===
    getName(second)
  );
}


/* ============================================================
   ZONE HELPERS
============================================================ */

function getZoneName(zone) {
  return (
    zone?.zoneName ||
    zone?.zone_name ||
    zone?.name ||
    "Unnamed Zone"
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


/*
 * IMPORTANT:
 *
 * This is the ONLY source for divisions
 * after a zone is selected.
 */

function getZoneDivisions(zone) {
  if (
    Array.isArray(
      zone?.divisions
    )
  ) {
    return zone.divisions;
  }

  if (
    Array.isArray(
      zone?.division
    )
  ) {
    return zone.division;
  }

  return [];
}


/* ============================================================
   DIVISION HELPERS
============================================================ */

function getDivisionName(
  division
) {
  return (
    division?.divisionName ||
    division?.division_name ||
    division?.name ||
    "Unnamed Division"
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


/*
 * IMPORTANT:
 *
 * This is the ONLY source for wards
 * after a division is selected.
 */

function getDivisionWards(
  division
) {
  if (
    Array.isArray(
      division?.wards
    )
  ) {
    return division.wards;
  }

  if (
    Array.isArray(
      division?.ward
    )
  ) {
    return division.ward;
  }

  return [];
}


/* ============================================================
   WARD HELPERS
============================================================ */

function getWardName(ward) {
  return (
    ward?.wardName ||
    ward?.ward_name ||
    ward?.name ||
    `Ward ${ward?.wardNo ?? ""}`
  );
}


function getWardTableName(ward) {
  return (
    ward?.wardTableName ||
    ward?.ward_table_name ||
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


/* ============================================================
   MAP SIZE CONTROLLER
============================================================ */

function MapSizeController() {
  const map =
    useMap();

  useEffect(() => {
    const timers = [
      setTimeout(
        () =>
          map.invalidateSize(),
        100
      ),

      setTimeout(
        () =>
          map.invalidateSize(),
        500
      ),

      setTimeout(
        () =>
          map.invalidateSize(),
        1000
      ),
    ];

    const resizeHandler =
      () =>
        map.invalidateSize();

    window.addEventListener(
      "resize",
      resizeHandler
    );

    return () => {
      timers.forEach(
        clearTimeout
      );

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
  const map =
    useMap();

  const hasFitted =
    useRef(false);

  useEffect(() => {
    if (
      hasFitted.current
    ) {
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
      hasFitted.current =
        true;

      map.fitBounds(
        cityBounds,
        {
          padding:
            [40, 40],

          maxZoom:
            11,

          animate:
            false,
        }
      );

      return;
    }

    const zoneBounds =
      zones
        .map(
          (zone) =>
            getGeoJSONBounds(
              getZoneBoundary(
                zone
              )
            )
        )
        .filter(
          Boolean
        );

    if (
      !zoneBounds.length
    ) {
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
      hasFitted.current =
        true;

      map.fitBounds(
        combined,
        {
          padding:
            [40, 40],

          maxZoom:
            11,

          animate:
            false,
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
  const map =
    useMap();

  const previousSelection =
    useRef("");

  useEffect(() => {
    let target =
      null;

    let selectionKey =
      "";

    /*
     * WARD
     */

    if (
      selectedWard
    ) {
      target =
        getWardBoundary(
          selectedWard
        );

      selectionKey =
        `ward:${getEntityId(
          selectedWard
        ) || getWardName(
          selectedWard
        )}`;
    }

    /*
     * DIVISION
     */

    else if (
      selectedDivision
    ) {
      target =
        getDivisionBoundary(
          selectedDivision
        );

      selectionKey =
        `division:${getEntityId(
          selectedDivision
        ) || getDivisionName(
          selectedDivision
        )}`;
    }

    /*
     * ZONE
     */

    else if (
      selectedZone
    ) {
      target =
        getZoneBoundary(
          selectedZone
        );

      selectionKey =
        `zone:${getEntityId(
          selectedZone
        ) || getZoneName(
          selectedZone
        )}`;
    }

    /*
     * NOTHING SELECTED
     */

    else {
      previousSelection.current =
        "";

      return;
    }

    if (
      selectionKey ===
      previousSelection.current
    ) {
      return;
    }

    previousSelection.current =
      selectionKey;

    const bounds =
      getGeoJSONBounds(
        target
      );

    if (
      !bounds ||
      !bounds.isValid()
    ) {
      return;
    }

    /*
     * Zone:
     *   normal zoom
     *
     * Division:
     *   closer
     *
     * Ward:
     *   closest
     */

    let padding =
      [80, 80];

    let maxZoom =
      13;

    if (
      selectedDivision
    ) {
      padding =
        [100, 100];

      maxZoom =
        15;
    }

    if (
      selectedWard
    ) {
      padding =
        [120, 120];

      maxZoom =
        17;
    }

    map.flyToBounds(
      bounds,
      {
        padding,
        maxZoom,

        duration:
          0.9,

        easeLinearity:
          0.25,
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
    getZoneBoundary(
      zone
    );

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
      data={
        boundary
      }

      style={() => ({
        color:
          selected
            ? "#263B52"
            : "#40556B",

        weight:
          selected
            ? 3.8
            : 2.4,

        opacity:
          1,

        fillColor:
          color,

        fillOpacity:
          selected
            ? 0.20
            : 0.38,

        lineJoin:
          "round",

        lineCap:
          "round",
      })}

      eventHandlers={{
        click: () =>
          onSelect(
            zone
          ),
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
      data={
        boundary
      }

      style={() => ({
        color:
          selected
            ? "#172B3F"
            : "#52677C",

        weight:
          selected
            ? 3.2
            : 1.8,

        opacity:
          1,

        fillColor:
          color,

        fillOpacity:
          selected
            ? 0.48
            : 0.26,

        lineJoin:
          "round",

        lineCap:
          "round",
      })}

      eventHandlers={{
        click: () =>
          onSelect?.(
            division
          ),
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
    getWardBoundary(
      ward
    );

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
      data={
        boundary
      }

      style={() => ({
        color:
          selected
            ? "#0F2940"
            : "#52677C",

        weight:
          selected
            ? 3
            : 1.3,

        opacity:
          1,

        fillColor:
          color,

        fillOpacity:
          selected
            ? 0.62
            : 0.30,

        lineJoin:
          "round",

        lineCap:
          "round",
      })}

      eventHandlers={{
        click: () =>
          onSelect?.(
            ward
          ),
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
      data={
        boundary
      }

      style={() => ({
        color:
          "#263B52",

        weight:
          3.6,

        opacity:
          1,

        fillColor:
          "transparent",

        fillOpacity:
          0,

        lineJoin:
          "round",

        lineCap:
          "round",
      })}

      interactive={
        false
      }
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
          if (
            disabled
          ) {
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
          {
            value ||
            placeholder
          }
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

      {open &&
        !disabled && (
          <div className="cm-dropdown">

            {options.length ===
            0 ? (
              <div className="cm-empty-option">
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

          </div>
        )}
    </div>
  );
}


/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function CityMapOverview({
  cityId =
    DEFAULT_CITY_ID,
}) {

  const [
    loading,
    setLoading,
  ] = useState(
    true
  );

  const [
    error,
    setError,
  ] = useState(
    ""
  );

  const [
    city,
    setCity,
  ] = useState(
    null
  );

  const [
    zones,
    setZones,
  ] = useState(
    []
  );

  const [
    selectedZone,
    setSelectedZone,
  ] = useState(
    null
  );

  const [
    selectedDivision,
    setSelectedDivision,
  ] = useState(
    null
  );

  const [
    selectedWard,
    setSelectedWard,
  ] = useState(
    null
  );

  const [
    openDropdown,
    setOpenDropdown,
  ] = useState(
    null
  );

  const mapRef =
    useRef(null);


  /* ==========================================================
     CITY MAP REQUEST
  ========================================================== */

  const fetchCityMapData =
    useCallback(
      async () => {

        try {

          setLoading(
            true
          );

          setError(
            ""
          );

          const response =
            await fetch(
              CITY_MAP_ENDPOINT(
                cityId
              ),
              {
                method:
                  "GET",

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

          const loadedZones =
            Array.isArray(
              result?.zones
            )
              ? result.zones
              : [];

          setCity(
            result?.city ||
              null
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

          setOpenDropdown(
            null
          );


          /* ==================================================
             DEBUG HIERARCHY
          ================================================== */

          console.log("");

          console.log(
            "============================================================"
          );

          console.log(
            "🗺️ FRONTEND CITY MAP HIERARCHY"
          );

          console.log(
            "============================================================"
          );

          console.log(
            "City:",
            result?.city?.cityName
          );

          console.log(
            "Zones:",
            loadedZones.length
          );


          const totalDivisions =
            loadedZones.reduce(
              (
                total,
                zone
              ) =>
                total +
                getZoneDivisions(
                  zone
                ).length,

              0
            );


          const totalWards =
            loadedZones.reduce(
              (
                total,
                zone
              ) =>
                total +
                getZoneDivisions(
                  zone
                ).reduce(
                  (
                    divisionTotal,
                    division
                  ) =>
                    divisionTotal +
                    getDivisionWards(
                      division
                    ).length,

                  0
                ),

              0
            );


          console.log(
            "Divisions:",
            totalDivisions
          );

          console.log(
            "Wards:",
            totalWards
          );

          console.log(
            "Citizen data: NOT USED"
          );

          console.log(
            "============================================================"
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

          setLoading(
            false
          );

        }

      },

      [
        cityId,
      ]
    );


  useEffect(() => {

    fetchCityMapData();

  }, [
    fetchCityMapData,
  ]);


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

      [
        city,
      ]
    );


  /* ==========================================================
     SELECTED ZONE → DIVISIONS
  ========================================================== */

  const selectedZoneDivisions =
    useMemo(
      () => {

        if (
          !selectedZone
        ) {
          return [];
        }

        /*
         * THIS IS THE CRITICAL FIX.
         *
         * Divisions come ONLY from:
         *
         * selectedZone.divisions
         *
         * No endpoint.
         * No global division state.
         * No database request.
         */

        return getZoneDivisions(
          selectedZone
        );

      },

      [
        selectedZone,
      ]
    );


  /* ==========================================================
     SELECTED DIVISION → WARDS
  ========================================================== */

  const selectedDivisionWards =
    useMemo(
      () => {

        if (
          !selectedDivision
        ) {
          return [];
        }

        /*
         * THIS IS THE SECOND CRITICAL FIX.
         *
         * Wards come ONLY from:
         *
         * selectedDivision.wards
         */

        return getDivisionWards(
          selectedDivision
        );

      },

      [
        selectedDivision,
      ]
    );


  /* ==========================================================
     ZONE OPTIONS
  ========================================================== */

  const zoneOptions =
    useMemo(
      () => [

        {
          value:
            "",

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

      [
        zones,
      ]
    );


  /* ==========================================================
     DIVISION OPTIONS
  ========================================================== */

  const divisionOptions =
    useMemo(
      () => [

        {
          value:
            "",

          label:
            "All Divisions",
        },

        ...selectedZoneDivisions.map(
          (
            division
          ) => ({

            value:
              getEntityId(
                division
              ) ||
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

      [
        selectedZoneDivisions,
      ]
    );


  /* ==========================================================
     WARD OPTIONS
  ========================================================== */

  const wardOptions =
    useMemo(
      () => [

        {
          value:
            "",

          label:
            "All Wards",
        },

        ...selectedDivisionWards.map(
          (
            ward
          ) => ({

            value:
              getEntityId(
                ward
              ) ||
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

      [
        selectedDivisionWards,
      ]
    );


  /* ==========================================================
     VISIBLE ZONES
  ========================================================== */

  const visibleZones =
    useMemo(
      () => {

        /*
         * NOTHING SELECTED:
         *
         * Show all zones.
         */

        if (
          !selectedZone
        ) {
          return zones;
        }


        /*
         * ZONE SELECTED:
         *
         * Show ONLY selected zone.
         */

        return zones.filter(
          (
            zone
          ) =>
            sameEntity(
              zone,
              selectedZone,
              getZoneName
            )
        );

      },

      [
        zones,
        selectedZone,
      ]
    );


  /* ==========================================================
     VISIBLE DIVISIONS
  ========================================================== */

  const visibleDivisions =
    useMemo(
      () => {

        /*
         * No zone:
         *
         * DO NOT SHOW DIVISIONS.
         */

        if (
          !selectedZone
        ) {
          return [];
        }


        /*
         * Zone selected:
         *
         * SHOW ALL DIVISIONS
         * BELONGING TO THAT ZONE.
         */

        if (
          !selectedDivision
        ) {
          return selectedZoneDivisions;
        }


        /*
         * Division selected:
         *
         * SHOW ONLY THAT DIVISION.
         */

        return selectedZoneDivisions.filter(
          (
            division
          ) =>
            sameEntity(
              division,
              selectedDivision,
              getDivisionName
            )
        );

      },

      [
        selectedZone,
        selectedDivision,
        selectedZoneDivisions,
      ]
    );


  /* ==========================================================
     VISIBLE WARDS
  ========================================================== */

  const visibleWards =
    useMemo(
      () => {

        /*
         * Wards are NOT shown at zone level.
         */

        if (
          !selectedDivision
        ) {
          return [];
        }


        /*
         * Only wards from the selected
         * division are shown.
         */

        return selectedDivisionWards;

      },

      [
        selectedDivision,
        selectedDivisionWards,
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
     SELECT ZONE
  ========================================================== */

  const handleZoneSelect =
    useCallback(
      (
        option
      ) => {

        /*
         * ALL ZONES
         */

        if (
          !option?.value
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

          setOpenDropdown(
            null
          );

          return;
        }


        const zone =
          option.zone ||
          null;

        if (
          !zone
        ) {
          return;
        }


        console.log("");

        console.log(
          "============================================================"
        );

        console.log(
          "🟣 ZONE SELECTED"
        );

        console.log(
          "============================================================"
        );

        console.log(
          "Zone:",
          getZoneName(
            zone
          )
        );

        console.log(
          "Zone ID:",
          getEntityId(
            zone
          )
        );

        console.log(
          "Zone table:",
          getZoneTableName(
            zone
          )
        );

        console.log(
          "Divisions in this zone:",
          getZoneDivisions(
            zone
          ).length
        );

        console.log(
          "============================================================"
        );


        /*
         * STORE EXACT OBJECT.
         *
         * No reconstruction.
         * No second request.
         */

        setSelectedZone(
          zone
        );


        /*
         * Reset children.
         */

        setSelectedDivision(
          null
        );

        setSelectedWard(
          null
        );

        setOpenDropdown(
          null
        );

      },

      []
    );


  /* ==========================================================
     SELECT DIVISION
  ========================================================== */

  const handleDivisionSelect =
    useCallback(
      (
        option
      ) => {

        /*
         * ALL DIVISIONS
         */

        if (
          !option?.value
        ) {

          setSelectedDivision(
            null
          );

          setSelectedWard(
            null
          );

          setOpenDropdown(
            null
          );

          return;
        }


        const division =
          option.division ||
          null;

        if (
          !division
        ) {
          return;
        }


        console.log("");

        console.log(
          "============================================================"
        );

        console.log(
          "🔵 DIVISION SELECTED"
        );

        console.log(
          "============================================================"
        );

        console.log(
          "Division:",
          getDivisionName(
            division
          )
        );

        console.log(
          "Division ID:",
          getEntityId(
            division
          )
        );

        console.log(
          "Wards in this division:",
          getDivisionWards(
            division
          ).length
        );

        console.log(
          "============================================================"
        );


        /*
         * EXACT division object
         * from selectedZone.divisions.
         */

        setSelectedDivision(
          division
        );


        /*
         * Reset ward.
         */

        setSelectedWard(
          null
        );

        setOpenDropdown(
          null
        );

      },

      []
    );


  /* ==========================================================
     SELECT WARD
  ========================================================== */

  const handleWardSelect =
    useCallback(
      (
        option
      ) => {

        /*
         * ALL WARDS
         */

        if (
          !option?.value
        ) {

          setSelectedWard(
            null
          );

          setOpenDropdown(
            null
          );

          return;
        }


        const ward =
          option.ward ||
          null;

        if (
          !ward
        ) {
          return;
        }


        console.log("");

        console.log(
          "============================================================"
        );

        console.log(
          "🟢 WARD SELECTED"
        );

        console.log(
          "============================================================"
        );

        console.log(
          "Ward:",
          getWardName(
            ward
          )
        );

        console.log(
          "Ward ID:",
          getEntityId(
            ward
          )
        );

        console.log(
          "============================================================"
        );


        /*
         * Ward comes directly from:
         *
         * selectedDivision.wards
         */

        setSelectedWard(
          ward
        );

        setOpenDropdown(
          null
        );

      },

      []
    );


  /* ==========================================================
     RESET MAP
  ========================================================== */

  const resetMap =
    useCallback(
      () => {

        setSelectedZone(
          null
        );

        setSelectedDivision(
          null
        );

        setSelectedWard(
          null
        );

        setOpenDropdown(
          null
        );

      },

      []
    );


  /* ==========================================================
     HAS SELECTION
  ========================================================== */

  const hasSelection =
    !!(
      selectedZone ||
      selectedDivision ||
      selectedWard
    );


  /* ==========================================================
     SELECTED ZONE INDEX
  ========================================================== */

  const selectedZoneIndex =
    selectedZone
      ? zones.findIndex(
          (
            zone
          ) =>
            sameEntity(
              zone,
              selectedZone,
              getZoneName
            )
        )
      : -1;


  /* ==========================================================
     SELECTED CARD COLOR
  ========================================================== */

  const selectedColor =
    selectedWard
      ? "#38BDF8"

      : selectedDivision
      ? "#A78BFA"

      : selectedZone
      ? ZONE_COLORS[
          Math.max(
            0,
            selectedZoneIndex
          ) %
            ZONE_COLORS.length
        ]

      : "#93C5FD";


  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <section className="cm-wrapper">

      <style>{`

        .cm-wrapper {
          width:
            100%;

          background:
            #ffffff;

          border:
            1px solid
            #dce4ec;

          border-radius:
            20px;

          padding:
            18px;

          box-sizing:
            border-box;

          box-shadow:
            0 4px 18px
            rgba(31,45,61,.05);
        }


        .cm-heading {
          margin:
            0 0 14px 2px;

          font-size:
            24px;

          line-height:
            1.15;

          font-weight:
            700;

          letter-spacing:
            -.4px;

          color:
            #07111f;
        }


        .cm-map-shell {
          position:
            relative;

          width:
            100%;

          height:
            790px;

          min-height:
            600px;

          overflow:
            hidden;

          border:
            1px solid
            #dce4ec;

          border-radius:
            20px;

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
            14px;

          margin-left:
            14px;

          border:
            1px solid
            #d8e1ea;

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


        /* =====================================================
           HEADER
        ===================================================== */

        .cm-map-header {
          position:
            absolute;

          z-index:
            1000;

          top:
            28px;

          left:
            28px;

          width:
            min(52%, 620px);

          min-height:
            88px;

          padding:
            18px 24px;

          box-sizing:
            border-box;

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          background:
            rgba(255,255,255,.96);

          backdrop-filter:
            blur(12px);

          border:
            1px solid
            rgba(216,225,235,.9);

          border-radius:
            20px;

          box-shadow:
            0 15px 40px
            rgba(30,45,60,.08);
        }


        .cm-header-left {
          display:
            flex;

          align-items:
            center;

          gap:
            16px;
        }


        .cm-header-icon {
          width:
            34px;

          height:
            34px;

          color:
            #617b98;

          flex-shrink:
            0;
        }


        .cm-header-title {
          font-size:
            24px;

          font-weight:
            700;

          line-height:
            1.1;

          color:
            #34475b;
        }


        .cm-header-city {
          margin-top:
            5px;

          font-size:
            13px;

          font-weight:
            600;

          color:
            #8aa1bb;
        }


        .cm-header-chevron {
          color:
            #34475b;

          flex-shrink:
            0;
        }


        /* =====================================================
           FILTER CARD
        ===================================================== */

        .cm-filter-card {
          position:
            absolute;

          z-index:
            1000;

          top:
            28px;

          right:
            28px;

          width:
            370px;

          padding:
            24px;

          box-sizing:
            border-box;

          background:
            rgba(255,255,255,.97);

          backdrop-filter:
            blur(12px);

          border:
            1px solid
            #dce4ec;

          border-radius:
            20px;

          box-shadow:
            0 15px 40px
            rgba(30,45,60,.09);
        }


        .cm-filter-title {
          margin-bottom:
            20px;

          font-size:
            18px;

          font-weight:
            700;

          color:
            #34475b;
        }


        .cm-filter-group {
          position:
            relative;

          margin-bottom:
            18px;
        }


        .cm-filter-label {
          margin-bottom:
            8px;

          font-size:
            13px;

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
            56px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          padding:
            0 18px;

          box-sizing:
            border-box;

          border:
            1px solid
            #cfddea;

          border-radius:
            16px;

          background:
            #ffffff;

          color:
            #4b6179;

          font-size:
            16px;

          font-weight:
            600;

          text-align:
            left;

          transition:
            .2s ease;

          cursor:
            pointer;
        }


        .cm-select:hover {
          border-color:
            #91afd0;
        }


        .cm-select-disabled {
          opacity:
            .58;

          cursor:
            not-allowed;

          background:
            #f8fafc;
        }


        .cm-select-value,
        .cm-select-placeholder {
          overflow:
            hidden;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;

          max-width:
            calc(100% - 28px);
        }


        .cm-select-placeholder {
          color:
            #9aaabd;
        }


        .cm-dropdown {
          position:
            absolute;

          z-index:
            2000;

          top:
            88px;

          left:
            0;

          width:
            100%;

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
            1px solid
            #dbe4ed;

          border-radius:
            16px;

          box-shadow:
            0 15px 40px
            rgba(30,45,60,.13);
        }


        .cm-dropdown-option {
          width:
            100%;

          min-height:
            44px;

          display:
            flex;

          align-items:
            center;

          gap:
            10px;

          padding:
            9px 12px;

          box-sizing:
            border-box;

          border:
            0;

          border-radius:
            12px;

          background:
            transparent;

          color:
            #4b6179;

          font-size:
            14px;

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


        .cm-empty-option {
          padding:
            14px;

          text-align:
            center;

          color:
            #9aaabd;

          font-size:
            13px;

          font-weight:
            600;
        }


        .cm-zone-dot {
          width:
            12px;

          height:
            12px;

          border-radius:
            50%;

          flex-shrink:
            0;

          border:
            1px solid
            rgba(49,73,96,.35);
        }


        .cm-zone-option-name {
          overflow:
            hidden;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;
        }


        /* =====================================================
           RESET
        ===================================================== */

        .cm-reset-button {
          width:
            100%;

          height:
            44px;

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
            1px solid
            #dbe4ed;

          border-radius:
            12px;

          background:
            #ffffff;

          color:
            #526a83;

          font-size:
            13px;

          font-weight:
            700;

          cursor:
            pointer;

          transition:
            .2s ease;
        }


        .cm-reset-button:hover {
          background:
            #f5f8fb;

          border-color:
            #bfcddd;
        }


        /* =====================================================
           SELECTED CARD
        ===================================================== */

        .cm-selected-card {
          position:
            absolute;

          z-index:
            1000;

          left:
            28px;

          bottom:
            28px;

          width:
            380px;

          padding:
            18px 22px;

          box-sizing:
            border-box;

          background:
            rgba(255,255,255,.97);

          backdrop-filter:
            blur(12px);

          border:
            1px solid
            #dce4ec;

          border-radius:
            18px;

          box-shadow:
            0 15px 40px
            rgba(30,45,60,.09);
        }


        .cm-selected-label {
          display:
            flex;

          align-items:
            center;

          gap:
            9px;

          font-size:
            12px;

          font-weight:
            700;

          color:
            #8aa1bb;
        }


        .cm-selected-dot {
          width:
            12px;

          height:
            12px;

          border-radius:
            50%;

          border:
            1px solid
            rgba(49,73,96,.3);
        }


        .cm-selected-name {
          margin-top:
            9px;

          font-size:
            17px;

          font-weight:
            700;

          color:
            #34475b;
        }


        .cm-selected-table {
          margin-top:
            6px;

          padding-bottom:
            10px;

          border-bottom:
            1px solid
            #e7edf3;

          font-size:
            11px;

          color:
            #8ba4bf;

          overflow:
            hidden;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;
        }


        .cm-selection-path {
          margin-top:
            12px;

          padding-top:
            12px;

          border-top:
            1px solid
            #edf1f5;

          font-size:
            12px;

          line-height:
            1.55;

          color:
            #7892ae;
        }


        .cm-selection-path strong {
          color:
            #536a84;
        }


        /* =====================================================
           STATUS
        ===================================================== */

        .cm-state {
          position:
            absolute;

          z-index:
            3000;

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
            12px 18px;

          border-radius:
            12px;

          background:
            rgba(255,255,255,.96);

          border:
            1px solid
            #dfe7ef;

          box-shadow:
            0 12px 30px
            rgba(0,0,0,.08);

          color:
            #536a84;

          font-size:
            13px;

          font-weight:
            600;
        }


        .cm-error-card {
          color:
            #dc2626;
        }


        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 1100px) {

          .cm-map-header {
            width:
              45%;
          }

          .cm-filter-card {
            width:
              320px;
          }

        }


        @media (max-width: 800px) {

          .cm-wrapper {
            padding:
              12px;

            border-radius:
              14px;
          }


          .cm-heading {
            font-size:
              19px;
          }


          .cm-map-shell {
            height:
              680px;
          }


          .cm-map-header {
            left:
              16px;

            top:
              16px;

            width:
              calc(100% - 32px);

            min-height:
              70px;

            padding:
              12px 16px;
          }


          .cm-header-title {
            font-size:
              18px;
          }


          .cm-header-city {
            font-size:
              11px;
          }


          .cm-filter-card {
            top:
              auto;

            right:
              16px;

            left:
              16px;

            bottom:
              16px;

            width:
              auto;

            max-height:
              340px;

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
          MAP
      ====================================================== */}

      <div className="cm-map-shell">

        <MapContainer
          ref={
            mapRef
          }

          center={[
            12.9716,
            77.5946,
          ]}

          zoom={
            10
          }

          zoomControl={
            false
          }

          className="cm-map"

          preferCanvas={
            false
          }
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

            maxZoom={
              20
            }
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
              ZONE LEVEL
          ================================================== */}

          <Pane
            name="zonePane"

            style={{
              zIndex:
                410,
            }}
          >

            {visibleZones.map(
              (
                zone,
                index
              ) => (

                <ZoneLayer
                  key={
                    `zone-${getEntityId(zone) || getZoneName(zone)}-${index}`
                  }

                  zone={
                    zone
                  }

                  index={
                    zones.indexOf(
                      zone
                    )
                  }

                  selected={
                    !!selectedZone &&
                    sameEntity(
                      zone,
                      selectedZone,
                      getZoneName
                    )
                  }

                  onSelect={
                    (
                      zoneValue
                    ) => {

                      handleZoneSelect({
                        value:
                          getEntityId(
                            zoneValue
                          ) ||
                          getZoneName(
                            zoneValue
                          ),

                        zone:
                          zoneValue,
                      });

                    }
                  }
                />

              )
            )}

          </Pane>


          {/* ==================================================
              DIVISION LEVEL
          ================================================== */}

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
                      `division-${getEntityId(division) || getDivisionName(division)}-${index}`
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


          {/* ==================================================
              WARD LEVEL
          ================================================== */}

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
                      `ward-${getEntityId(ward) || getWardName(ward)}-${index}`
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


          {/* ==================================================
              CITY OUTLINE
          ================================================== */}

          <Pane
            name="cityBoundaryPane"

            style={{
              zIndex:
                420,
            }}
          >

            <CityBoundaryLayer
              boundary={
                cityBoundary
              }
            />

          </Pane>

        </MapContainer>


        {/* ==================================================
            MAP HEADER
        ================================================== */}

        <div
          className="cm-map-header"
        >

          <div
            className="cm-header-left"
          >

            <MapIcon
              className="cm-header-icon"
              strokeWidth={
                1.8
              }
            />

            <div>

              <div
                className="cm-header-title"
              >
                City Overview Map
              </div>

              {city?.cityName && (

                <div
                  className="cm-header-city"
                >
                  {
                    city.cityName
                  }
                </div>

              )}

            </div>

          </div>


          <ChevronDown
            className="cm-header-chevron"
            size={
              18
            }
          />

        </div>


        {/* ==================================================
            FILTER CARD
        ================================================== */}

        <div
          className="cm-filter-card"
        >

          <div
            className="cm-filter-title"
          >
            MAP FILTERS
          </div>


          {/* =================================================
              ZONE
          ================================================= */}

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

            onChange={
              handleZoneSelect
            }

            renderOption={
              (
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

                    <span
                      className="cm-zone-option-name"
                    >
                      {
                        option.label
                      }
                    </span>

                  </>
                );

              }
            }
          />


          {/* =================================================
              DIVISION
          ================================================= */}

          <FilterDropdown
            label="DIVISION"

            value={
              selectedDivisionName
            }

            placeholder={
              !selectedZone

                ? "Select a Zone First"

                : selectedZoneDivisions.length
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
              selectedZoneDivisions.length ===
                0
            }

            onChange={
              handleDivisionSelect
            }

            renderOption={
              (
                option
              ) => {

                if (
                  !option.value
                ) {

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
                    {
                      option.label
                    }
                  </span>
                );

              }
            }
          />


          {/* =================================================
              WARD
          ================================================= */}

          <FilterDropdown
            label="WARD"

            value={
              selectedWardName
            }

            placeholder={
              !selectedDivision

                ? "Select a Division First"

                : selectedDivisionWards.length
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
              selectedDivisionWards.length ===
                0
            }

            onChange={
              handleWardSelect
            }

            renderOption={
              (
                option
              ) => {

                if (
                  !option.value
                ) {

                  return (
                    <span>
                      All Wards
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
                    {
                      option.label
                    }
                  </span>
                );

              }
            }
          />


          {/* =================================================
              RESET
          ================================================= */}

          {hasSelection && (

            <button
              type="button"

              className="cm-reset-button"

              onClick={
                resetMap
              }
            >

              <RotateCcw
                size={
                  15
                }
              />

              Reset Map

            </button>

          )}

        </div>


        {/* ==================================================
            SELECTED INFORMATION
        ================================================== */}

        {hasSelection && (

          <div
            className="cm-selected-card"
          >

            <div
              className="cm-selected-label"
            >

              <span
                className="cm-selected-dot"

                style={{
                  backgroundColor:
                    selectedColor,
                }}
              />

              {
                selectedWard
                  ? "SELECTED WARD"
                  : selectedDivision
                  ? "SELECTED DIVISION"
                  : "SELECTED ZONE"
              }

            </div>


            <div
              className="cm-selected-name"
            >

              {
                selectedWard
                  ? getWardName(
                      selectedWard
                    )
                  : selectedDivision
                  ? getDivisionName(
                      selectedDivision
                    )
                  : getZoneName(
                      selectedZone
                    )
              }

            </div>


            {/* =================================================
                TABLE NAME
            ================================================= */}

            {selectedWard &&
              getWardTableName(
                selectedWard
              ) && (

              <div
                className="cm-selected-table"
              >
                {
                  getWardTableName(
                    selectedWard
                  )
                }
              </div>

            )}


            {selectedDivision &&
              !selectedWard &&
              getDivisionTableName(
                selectedDivision
              ) && (

              <div
                className="cm-selected-table"
              >
                {
                  getDivisionTableName(
                    selectedDivision
                  )
                }
              </div>

            )}


            {selectedZone &&
              !selectedDivision &&
              getZoneTableName(
                selectedZone
              ) && (

              <div
                className="cm-selected-table"
              >
                {
                  getZoneTableName(
                    selectedZone
                  )
                }
              </div>

            )}


            {/* =================================================
                HIERARCHY PATH
            ================================================= */}

            <div
              className="cm-selection-path"
            >

              <div>
                <strong>
                  City:
                </strong>{" "}
                {
                  city?.cityName ||
                  "Bangalore"
                }
              </div>


              {selectedZone && (

                <div>
                  <strong>
                    Zone:
                  </strong>{" "}
                  {
                    getZoneName(
                      selectedZone
                    )
                  }
                </div>

              )}


              {selectedDivision && (

                <div>
                  <strong>
                    Division:
                  </strong>{" "}
                  {
                    getDivisionName(
                      selectedDivision
                    )
                  }
                </div>

              )}


              {selectedWard && (

                <div>
                  <strong>
                    Ward:
                  </strong>{" "}
                  {
                    getWardName(
                      selectedWard
                    )
                  }
                </div>

              )}

            </div>

          </div>

        )}


        {/* ==================================================
            LOADING
        ================================================== */}

        {loading && (

          <div
            className="cm-state"
          >

            <div
              className="cm-state-card"
            >
              Loading city boundaries...
            </div>

          </div>

        )}


        {/* ==================================================
            ERROR
        ================================================== */}

        {!loading &&
          error && (

          <div
            className="cm-state"
          >

            <div
              className="cm-state-card cm-error-card"
            >
              {
                error
              }
            </div>

          </div>

        )}

      </div>
    </section>
  );
}