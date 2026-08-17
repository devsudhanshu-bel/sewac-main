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
  "http://localhost:5002";

const DEFAULT_CITY_ID = 1;


/* ============================================================
   ONE AND ONLY API ENDPOINT
============================================================ */

/*
 * Backend response:
 *
 * CITY
 *   ↓
 * ZONES
 *   ↓
 * DIVISIONS
 *   ↓
 * WARDS
 *
 * No citizen data is used here.
 *
 * We do NOT make another request when selecting:
 *
 * Zone
 * Division
 * Ward
 */

const CITY_MAP_ENDPOINT = (
  cityId
) =>
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

      return JSON.parse(
        value
      );

    } catch {

      return null;

    }

  }


  return null;
}


/* ============================================================
   COORDINATE HELPERS
============================================================ */

function isCoordinatePair(
  value
) {

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
 * GeoJSON normally uses:
 *
 * [longitude, latitude]
 *
 * If the backend gives:
 *
 * [latitude, longitude]
 *
 * we swap it.
 */

function normalizeCoordinatePair(
  pair
) {

  if (
    !isCoordinatePair(
      pair
    )
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


function normalizeCoordinates(
  value
) {

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


/* ============================================================
   GEOJSON GEOMETRY NORMALIZER
============================================================ */

function normalizeGeometry(
  geometry
) {

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


/* ============================================================
   GEOJSON NORMALIZER
============================================================ */

function normalizeGeoJSON(
  value
) {

  const parsed =
    parseGeoJSON(
      value
    );


  if (!parsed) {
    return null;
  }


  /*
   * FeatureCollection
   */

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


  /*
   * Feature
   */

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


  /*
   * Geometry
   */

  if (
    parsed.type &&
    parsed.coordinates
  ) {

    return {

      type: "Feature",

      properties:
        parsed.properties || {},

      geometry:
        normalizeGeometry(
          parsed
        ),

    };

  }


  /*
   * Raw coordinate array
   */

  if (
    Array.isArray(parsed)
  ) {

    return {

      type: "Feature",

      properties: {},

      geometry: {

        type: "Polygon",

        coordinates:
          normalizeCoordinates(
            parsed
          ),

      },

    };

  }


  /*
   * { coordinates: [...] }
   */

  if (
    parsed.coordinates
  ) {

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


/* ============================================================
   GEOJSON BOUNDS
============================================================ */

function getGeoJSONBounds(
  value
) {

  const normalized =
    normalizeGeoJSON(
      value
    );


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


    if (
      bounds &&
      bounds.isValid()
    ) {

      return bounds;

    }


    return null;

  } catch {

    return null;

  }

}


/* ============================================================
   DATA HELPERS
============================================================ */

function getZoneName(
  zone
) {

  return (
    zone?.zoneName ||
    zone?.zone_name ||
    zone?.name ||
    "Unnamed Zone"
  );

}


function getZoneId(
  zone
) {

  return (
    zone?.id ??
    zone?.zoneId ??
    zone?.zone_id ??
    null
  );

}


function getZoneTableName(
  zone
) {

  return (
    zone?.zoneTableName ||
    zone?.zone_table_name ||
    null
  );

}


function getZoneBoundary(
  zone
) {

  return normalizeGeoJSON(

    zone?.geoBoundary ??
    zone?.geo_boundary ??
    zone?.geometry ??
    zone?.boundary

  );

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


function getDivisionId(
  division
) {

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
   WARD HELPERS
============================================================ */

function getWardName(
  ward
) {

  return (
    ward?.wardName ||
    ward?.ward_name ||
    ward?.name ||
    "Unnamed Ward"
  );

}


function getWardId(
  ward
) {

  return (
    ward?.id ??
    ward?.wardId ??
    ward?.ward_id ??
    null
  );

}


function getWardTableName(
  ward
) {

  return (
    ward?.wardTableName ||
    ward?.ward_table_name ||
    null
  );

}


function getWardBoundary(
  ward
) {

  return normalizeGeoJSON(

    ward?.geoBoundary ??
    ward?.geo_boundary ??
    ward?.geometry ??
    ward?.boundary

  );

}


/* ============================================================
   STABLE ID HELPERS
============================================================ */

function sameEntity(
  first,
  second,
  getId,
  getName
) {

  if (
    !first ||
    !second
  ) {
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


    const onResize =
      () =>
        map.invalidateSize();


    window.addEventListener(
      "resize",
      onResize
    );


    return () => {

      timers.forEach(
        clearTimeout
      );

      window.removeEventListener(
        "resize",
        onResize
      );

    };

  }, [
    map,
  ]);


  return null;

}


/* ============================================================
   INITIAL CITY FIT
============================================================ */

function MapBoundsController({
  cityBoundary,
  zones,
  hasSelection,
}) {

  const map =
    useMap();


  const didFit =
    useRef(false);


  useEffect(() => {

    /*
     * Never re-fit the entire city after
     * the user has selected something.
     */

    if (
      hasSelection
    ) {
      return;
    }


    if (
      didFit.current
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

      didFit.current =
        true;


      map.fitBounds(
        cityBounds,
        {

          padding:
            [35, 35],

          maxZoom:
            11,

          animate:
            false,

        }
      );


      return;

    }


    /*
     * Fallback:
     * combine all zone boundaries.
     */

    const boundsList =
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
      boundsList.length === 0
    ) {

      return;

    }


    const combined =
      L.latLngBounds(
        boundsList[0]
      );


    for (
      let index = 1;
      index <
      boundsList.length;
      index += 1
    ) {

      combined.extend(
        boundsList[index]
      );

    }


    if (
      combined.isValid()
    ) {

      didFit.current =
        true;


      map.fitBounds(
        combined,
        {

          padding:
            [35, 35],

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
    hasSelection,
  ]);


  return null;

}


/* ============================================================
   HIERARCHY FOCUS CONTROLLER
============================================================ */

function HierarchyFocusController({
  selectedZone,
  selectedDivision,
  selectedWard,
}) {

  const map =
    useMap();


  const previousKey =
    useRef(null);


  useEffect(() => {

    let target =
      null;

    let targetKey =
      null;

    let padding =
      [90, 90];

    let maxZoom =
      12;


    /*
     * PRIORITY:
     *
     * Ward
     * ↓
     * Division
     * ↓
     * Zone
     */

    if (
      selectedWard
    ) {

      target =
        getWardBoundary(
          selectedWard
        );

      targetKey =
        `ward-${getWardId(
          selectedWard
        )}-${getWardName(
          selectedWard
        )}`;

      padding =
        [70, 70];

      maxZoom =
        15;

    } else if (
      selectedDivision
    ) {

      target =
        getDivisionBoundary(
          selectedDivision
        );

      targetKey =
        `division-${getDivisionId(
          selectedDivision
        )}-${getDivisionName(
          selectedDivision
        )}`;

      padding =
        [80, 80];

      maxZoom =
        14;

    } else if (
      selectedZone
    ) {

      target =
        getZoneBoundary(
          selectedZone
        );

      targetKey =
        `zone-${getZoneId(
          selectedZone
        )}-${getZoneName(
          selectedZone
        )}`;

      padding =
        [90, 90];

      maxZoom =
        12;

    } else {

      previousKey.current =
        null;

      return;

    }


    /*
     * Do not repeatedly fly to the same
     * boundary on every render.
     */

    if (
      previousKey.current ===
      targetKey
    ) {

      return;

    }


    previousKey.current =
      targetKey;


    const bounds =
      getGeoJSONBounds(
        target
      );


    if (
      !bounds ||
      !bounds.isValid()
    ) {

      console.warn(
        "⚠️ Cannot fit selected boundary:",
        targetKey
      );

      return;

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

      key={
        `zone-${getZoneId(
          zone
        )}-${getZoneName(
          zone
        )}`
      }

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
            ? 3.4
            : 2.2,

        opacity:
          1,

        fillColor:
          color,

        fillOpacity:
          selected
            ? 0.58
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

      key={
        `division-${getDivisionId(
          division
        )}-${getDivisionName(
          division
        )}`
      }

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
            : 1.5,

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

      key={
        `ward-${getWardId(
          ward
        )}-${getWardName(
          ward
        )}`
      }

      data={
        boundary
      }

      style={() => ({

        color:
          selected
            ? "#102A43"
            : "#60758A",

        weight:
          selected
            ? 3.2
            : 1.1,

        opacity:
          1,

        fillColor:
          color,

        fillOpacity:
          selected
            ? 0.65
            : 0.28,

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

    <div
      className="cm-filter-group"
    >

      <div
        className="cm-filter-label"
      >
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

        <div
          className="cm-dropdown"
        >

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
                        {
                          optionLabel
                        }
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


  /*
   * IMPORTANT:
   *
   * `zones` is the ORIGINAL server response.
   *
   * We never modify these objects.
   */

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
    useRef(
      null
    );


  /* ==========================================================
     ONE API REQUEST
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


          console.log(
            ""
          );

          console.log(
            "============================================================"
          );

          console.log(
            "🗺️ CITY MAP REQUEST"
          );

          console.log(
            "============================================================"
          );

          console.log(
            "CITY ID:",
            cityId
          );

          console.log(
            "ENDPOINT:",
            CITY_MAP_ENDPOINT(
              cityId
            )
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


          const loadedCity =
            result?.city ||
            null;


          const loadedZones =
            Array.isArray(
              result?.zones
            )
              ? result.zones
              : [];


          /*
           * Calculate frontend-safe totals.
           */

          const totalDivisions =
            loadedZones.reduce(
              (
                total,
                zone
              ) => {

                const zoneDivisions =
                  Array.isArray(
                    zone?.divisions
                  )
                    ? zone.divisions
                    : [];


                return (
                  total +
                  zoneDivisions.length
                );

              },
              0
            );


          const totalWards =
            loadedZones.reduce(
              (
                total,
                zone
              ) => {

                const zoneDivisions =
                  Array.isArray(
                    zone?.divisions
                  )
                    ? zone.divisions
                    : [];


                return (

                  total +

                  zoneDivisions.reduce(
                    (
                      divisionTotal,
                      division
                    ) => {

                      const divisionWards =
                        Array.isArray(
                          division?.wards
                        )
                          ? division.wards
                          : [];


                      return (
                        divisionTotal +
                        divisionWards.length
                      );

                    },
                    0
                  )

                );

              },
              0
            );


          console.log(
            "============================================================"
          );

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


          setCity(
            loadedCity
          );


          setZones(
            loadedZones
          );


          /*
           * Reset selection whenever the city
           * itself is reloaded.
           */

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


  useEffect(
    () => {

      fetchCityMapData();

    },
    [
      fetchCityMapData,
    ]
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

      [
        city,
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
     CRITICAL:
     DIVISIONS BELONG ONLY TO SELECTED ZONE
  ========================================================== */

  const divisions =
    useMemo(
      () => {

        if (
          !selectedZone
        ) {

          return [];

        }


        return Array.isArray(
          selectedZone?.divisions
        )
          ? selectedZone.divisions
          : [];

      },
      [
        selectedZone,
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
      [
        divisions,
      ]
    );


  /* ==========================================================
     CRITICAL:
     WARDS BELONG ONLY TO SELECTED DIVISION
  ========================================================== */

  const wards =
    useMemo(
      () => {

        /*
         * No zone:
         *
         * There must be no wards.
         */

        if (
          !selectedZone
        ) {

          return [];

        }


        /*
         * Division selected:
         *
         * ONLY wards from this division.
         */

        if (
          selectedDivision
        ) {

          return Array.isArray(
            selectedDivision?.wards
          )
            ? selectedDivision.wards
            : [];

        }


        /*
         * No division selected:
         *
         * ALL wards belonging to the
         * currently selected zone.
         */

        return divisions.reduce(
          (
            allWards,
            division
          ) => {

            const divisionWards =
              Array.isArray(
                division?.wards
              )
                ? division.wards
                : [];


            return [
              ...allWards,
              ...divisionWards,
            ];

          },
          []
        );

      },
      [
        selectedZone,
        selectedDivision,
        divisions,
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
      [
        wards,
      ]
    );


  /* ==========================================================
     VISIBLE ZONES
  ========================================================== */

  const visibleZones =
    useMemo(
      () => {

        /*
         * CITY LEVEL
         *
         * Show all zones.
         */

        if (
          !selectedZone
        ) {

          return zones;

        }


        /*
         * ZONE LEVEL
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


  /* ==========================================================
     VISIBLE DIVISIONS
  ========================================================== */

  const visibleDivisions =
    useMemo(
      () => {

        /*
         * No zone:
         *
         * No divisions are shown.
         */

        if (
          !selectedZone
        ) {

          return [];

        }


        /*
         * All Divisions:
         *
         * ONLY divisions inside selected zone.
         */

        if (
          !selectedDivision
        ) {

          return divisions;

        }


        /*
         * Particular Division:
         *
         * ONLY that division.
         */

        return divisions.filter(
          (
            division
          ) =>

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


  /* ==========================================================
     VISIBLE WARDS
  ========================================================== */

  const visibleWards =
    useMemo(
      () => {

        /*
         * No zone:
         *
         * absolutely no wards.
         */

        if (
          !selectedZone
        ) {

          return [];

        }


        /*
         * Division selected:
         *
         * wards already come ONLY from
         * selectedDivision.wards.
         */

        if (
          selectedDivision
        ) {

          if (
            selectedWard
          ) {

            return wards.filter(
              (
                ward
              ) =>

                sameEntity(
                  ward,
                  selectedWard,
                  getWardId,
                  getWardName
                )

            );

          }


          return wards;

        }


        /*
         * Zone selected but no division:
         *
         * show all wards belonging to
         * divisions of that zone.
         */

        return wards;

      },
      [
        selectedZone,
        selectedDivision,
        selectedWard,
        wards,
      ]
    );


  /* ==========================================================
     ZONE SELECT
  ========================================================== */

  const handleZoneSelect =
    useCallback(
      (
        zone
      ) => {

        if (
          !zone
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


        console.log(
          ""
        );

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
          getZoneId(
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
          Array.isArray(
            zone?.divisions
          )
            ? zone.divisions.length
            : 0
        );


        /*
         * IMPORTANT:
         *
         * We store the EXACT zone object
         * from the original zones array.
         *
         * We do NOT rebuild it.
         * We do NOT modify it.
         */

        setSelectedZone(
          zone
        );


        /*
         * Reset everything below it.
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
     DIVISION SELECT
  ========================================================== */

  const handleDivisionSelect =
    useCallback(
      (
        option
      ) => {

        /*
         * All Divisions
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


        console.log(
          ""
        );

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
          getDivisionId(
            division
          )
        );

        console.log(
          "Wards in this division:",
          Array.isArray(
            division?.wards
          )
            ? division.wards.length
            : 0
        );


        /*
         * IMPORTANT:
         *
         * This division is already taken
         * directly from selectedZone.divisions.
         *
         * Therefore it can NEVER belong
         * to another zone.
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
     WARD SELECT
  ========================================================== */

  const handleWardSelect =
    useCallback(
      (
        option
      ) => {

        /*
         * All Wards
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


        /*
         * Extra safety:
         *
         * Never allow a ward outside
         * the currently selected division
         * to be selected.
         */

        if (
          selectedDivision &&
          !sameEntity(
            ward,
            selectedWard || ward,
            getWardId,
            getWardName
          )
        ) {

          /*
           * The option itself already comes
           * from the selected division's
           * ward list, so this block should
           * normally never execute.
           */

        }


        console.log(
          ""
        );

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
          getWardId(
            ward
          )
        );


        setSelectedWard(
          ward
        );


        setOpenDropdown(
          null
        );

      },
      [
        selectedDivision,
        selectedWard,
      ]
    );


  /* ==========================================================
     HAS MAP SELECTION
  ========================================================== */

  const hasSelection =
    !!(
      selectedZone ||
      selectedDivision ||
      selectedWard
    );


  /* ==========================================================
     SELECTED CARD DATA
  ========================================================== */

  const selectedColor =
    selectedWard
      ? "#38BDF8"
      : selectedDivision
      ? "#60A5FA"
      : selectedZone
      ? ZONE_COLORS[
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
        ]
      : "#93C5FD";


  /* ==========================================================
     RENDER
  ========================================================== */

  return (

    <section
      className="cm-wrapper"
    >

      <style>{`

        .cm-wrapper {
          width: 100%;
          background: #fff;
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

          border:
            1px solid #dce4ec;

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

          background: #fff;
        }


        .cm-map .leaflet-control-attribution {
          font-size: 10px;

          background:
            rgba(255,255,255,.82);
        }


        /* ====================================================
           HEADER
        ==================================================== */

        .cm-map-header {
          position: absolute;

          z-index: 1000;

          top: 28px;
          left: 28px;

          width:
            min(52%, 620px);

          min-height: 88px;

          padding:
            18px 24px;

          box-sizing: border-box;

          display: flex;

          align-items: center;

          justify-content:
            space-between;

          background:
            rgba(255,255,255,.96);

          backdrop-filter:
            blur(12px);

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


        /* ====================================================
           FILTER CARD
        ==================================================== */

        .cm-filter-card {
          position: absolute;

          z-index: 1000;

          top: 28px;
          right: 28px;

          width: 370px;

          max-height:
            calc(100% - 56px);

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

          justify-content:
            space-between;

          padding:
            0 18px;

          box-sizing: border-box;

          border:
            1px solid #cfddea;

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
        }


        .cm-select-value {
          color:
            #435b73;

          overflow:
            hidden;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;
        }


        .cm-select-placeholder {
          color:
            #93a4b5;

          overflow:
            hidden;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;
        }


        /* ====================================================
           DROPDOWN
        ==================================================== */

        .cm-dropdown {
          position: absolute;

          z-index: 5000;

          top:
            calc(100% + 8px);

          left: 0;

          width: 100%;

          max-height: 330px;

          overflow-y: auto;

          padding: 6px;

          box-sizing: border-box;

          background: #fff;

          border:
            1px solid #dce5ee;

          border-radius: 16px;

          box-shadow:
            0 15px 40px
            rgba(30,45,60,.12);
        }


        .cm-dropdown-option {
          width: 100%;

          min-height: 48px;

          display: flex;

          align-items: center;

          gap: 10px;

          padding:
            10px 12px;

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
          background:
            #f5f8fb;
        }


        .cm-dropdown-option-active {
          background:
            #edf3f8;

          color:
            #20364c;
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
          overflow:
            hidden;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;
        }


        /* ====================================================
           SELECTED CARD
        ==================================================== */

        .cm-selected-card {
          position: absolute;

          z-index: 1000;

          left: 28px;
          bottom: 28px;

          width: 360px;

          padding:
            18px 22px;

          box-sizing:
            border-box;

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

          font-size: 17px;

          font-weight: 700;

          color: #34475b;
        }


        .cm-selected-table {
          margin-top: 6px;

          padding-bottom: 10px;

          border-bottom:
            1px solid #e7edf3;

          font-size: 11px;

          color: #8ba4bf;

          overflow: hidden;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;
        }


        .cm-hierarchy-status {
          margin-top: 10px;

          display: flex;

          flex-direction: column;

          gap: 4px;

          font-size: 12px;

          font-weight: 600;

          color: #7892ae;
        }


        .cm-hierarchy-status strong {
          color:
            #526a83;
        }


        /* ====================================================
           STATE
        ==================================================== */

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
          padding:
            12px 18px;

          border-radius: 12px;

          background:
            rgba(255,255,255,.96);

          border:
            1px solid #dfe7ef;

          box-shadow:
            0 12px 30px
            rgba(0,0,0,.08);

          color:
            #536a84;

          font-size: 13px;

          font-weight: 600;
        }


        .cm-error-card {
          color:
            #dc2626;
        }


        /* ====================================================
           SCROLLBAR
        ==================================================== */

        .cm-dropdown::-webkit-scrollbar {
          width: 7px;
        }


        .cm-dropdown::-webkit-scrollbar-track {
          background:
            transparent;
        }


        .cm-dropdown::-webkit-scrollbar-thumb {
          background:
            #cbd5df;

          border-radius:
            999px;
        }


        /* ====================================================
           RESPONSIVE
        ==================================================== */

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

            border-radius:
              14px;
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

            max-height:
              330px;

            overflow-y:
              auto;
          }


          .cm-selected-card {
            display: none;
          }

        }

      `}</style>


      {/* ======================================================
          TITLE
      ====================================================== */}

      <h2
        className="cm-heading"
      >
        CITY OVERVIEW MAP
      </h2>


      {/* ======================================================
          MAP
      ====================================================== */}

      <div
        className="cm-map-shell"
      >

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


          {/* ==================================================
              INITIAL CITY FIT
          ================================================== */}

          <MapBoundsController

            cityBoundary={
              cityBoundary
            }

            zones={
              zones
            }

            hasSelection={
              hasSelection
            }

          />


          {/* ==================================================
              HIERARCHY FOCUS
          ================================================== */}

          <HierarchyFocusController

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
                    `zone-${getZoneId(
                      zone
                    )}-${getZoneName(
                      zone
                    )}`
                  }

                  zone={
                    zone
                  }

                  index={
                    zones.indexOf(
                      zone
                    ) >= 0
                      ? zones.indexOf(
                          zone
                        )
                      : index
                  }

                  selected={

                    !!selectedZone &&

                    sameEntity(
                      selectedZone,
                      zone,
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


          {/* ==================================================
              DIVISIONS
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
                      `division-${getDivisionId(
                        division
                      )}-${getDivisionName(
                        division
                      )}`
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
                        selectedDivision,
                        division,
                        getDivisionId,
                        getDivisionName
                      )

                    }

                    onSelect={(
                      division
                    ) => {

                      /*
                       * IMPORTANT:
                       *
                       * Division can only be
                       * selected from
                       * selectedZone.divisions.
                       */

                      setSelectedDivision(
                        division
                      );

                      setSelectedWard(
                        null
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
              WARDS
          ================================================== */}

          {selectedZone &&
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
                      `ward-${getWardId(
                        ward
                      )}-${getWardName(
                        ward
                      )}`
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
                        selectedWard,
                        ward,
                        getWardId,
                        getWardName
                      )

                    }

                    onSelect={(
                      ward
                    ) => {

                      /*
                       * Ward is always
                       * taken from the
                       * current visible
                       * hierarchy.
                       */

                      setSelectedWard(
                        ward
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

          {!selectedZone && (

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

          )}


          {/* ==================================================
              SELECTED ZONE OUTLINE
          ================================================== */}

          {selectedZone && (

            <Pane

              name="selectedZoneOutlinePane"

              style={{
                zIndex:
                  420,
              }}

            >

              <GeoJSON

                data={
                  getZoneBoundary(
                    selectedZone
                  )
                }

                style={() => ({

                  color:
                    "#263B52",

                  weight:
                    4,

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

            </Pane>

          )}

        </MapContainer>


        {/* ====================================================
            HEADER
        ==================================================== */}

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


        {/* ====================================================
            FILTER PANEL
        ==================================================== */}

        <div
          className="cm-filter-card"
        >

          <div
            className="cm-filter-title"
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

                handleZoneSelect(
                  null
                );

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


                  <span
                    className="cm-zone-option-name"
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

                : divisions.length >
                  0

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

              divisions.length ===
                0

            }

            onChange={
              handleDivisionSelect
            }

            renderOption={(
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

            }}

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

              !selectedZone

                ? "Select a Zone First"

                : !selectedDivision

                ? "Select a Division First"

                : wards.length >
                  0

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

              !selectedZone ||

              !selectedDivision ||

              wards.length ===
                0

            }

            onChange={
              handleWardSelect
            }

            renderOption={(
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

            }}

          />

        </div>


        {/* ====================================================
            SELECTED HIERARCHY CARD
        ==================================================== */}

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


            {/* ==================================================
                TABLE NAME
            ================================================== */}

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


            {/* ==================================================
                HIERARCHY STATUS
            ================================================== */}

            <div
              className="cm-hierarchy-status"
            >

              {selectedZone && (

                <div>

                  <strong>
                    Divisions:
                  </strong>{" "}

                  {
                    divisions.length
                  }

                </div>

              )}


              {selectedZone &&
                !selectedDivision && (

                <div>

                  <strong>
                    Wards in zone:
                  </strong>{" "}

                  {
                    wards.length
                  }

                </div>

              )}


              {selectedDivision && (

                <div>

                  <strong>
                    Wards in division:
                  </strong>{" "}

                  {
                    wards.length
                  }

                </div>

              )}

            </div>

          </div>

        )}


        {/* ====================================================
            LOADING
        ==================================================== */}

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


        {/* ====================================================
            ERROR
        ==================================================== */}

        {!loading &&
          error && (

          <div
            className="cm-state"
          >

            <div
              className="
                cm-state-card
                cm-error-card
              "
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