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
} from "lucide-react";

import "leaflet/dist/leaflet.css";


/* ============================================================
   CONFIGURATION
============================================================ */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://sewac-main.onrender.com";

const DEFAULT_CITY_ID = 1;


/* ============================================================
   CITY MAP ENDPOINT
============================================================ */

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
   GEOJSON PARSING
============================================================ */

function parseGeoJSON(
  value
) {

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
 * Bengaluru:
 *
 * Latitude  ≈ 13
 * Longitude ≈ 77
 *
 * GeoJSON:
 *
 * [longitude, latitude]
 *
 * If backend gives:
 *
 * [latitude, longitude]
 *
 * convert it to:
 *
 * [longitude, latitude]
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
    Number(pair[0]);

  const second =
    Number(pair[1]);


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
    (
      item
    ) =>
      normalizeCoordinates(
        item
      )
  );

}


/* ============================================================
   GEOJSON GEOMETRY NORMALIZATION
============================================================ */

function normalizeGeometry(
  geometry
) {

  if (
    !geometry ||
    typeof geometry !== "object"
  ) {

    return null;

  }


  if (
    !geometry.type
  ) {

    return null;

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
              (
                feature
              ) => {

                if (
                  !feature?.geometry
                ) {

                  return feature;

                }

                return {
                  ...feature,

                  geometry:
                    normalizeGeometry(
                      feature.geometry
                    ),
                };

              }
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

    if (
      !parsed.geometry
    ) {

      return parsed;

    }


    return {
      ...parsed,

      geometry:
        normalizeGeometry(
          parsed.geometry
        ),
    };

  }


  /*
   * Raw Geometry
   */

  if (
    parsed.type &&
    parsed.coordinates
  ) {

    return normalizeGeometry(
      parsed
    );

  }


  /*
   * Raw coordinates
   */

  if (
    parsed.coordinates
  ) {

    return {
      type:
        "Feature",

      properties:
        {},

      geometry: {
        type:
          "Polygon",

        coordinates:
          normalizeCoordinates(
            parsed.coordinates
          ),
      },
    };

  }


  /*
   * Raw array
   */

  if (
    Array.isArray(parsed)
  ) {

    return {
      type:
        "Feature",

      properties:
        {},

      geometry: {
        type:
          "Polygon",

        coordinates:
          normalizeCoordinates(
            parsed
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
   ENTITY HELPERS
============================================================ */

function getEntityId(
  entity
) {

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


  return String(
    value
  );

}


/* ============================================================
   ZONE HELPERS
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


function getZoneDivisions(
  zone
) {

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

function getWardName(
  ward
) {

  return (
    ward?.wardName ||
    ward?.ward_name ||
    ward?.name ||
    (
      ward?.wardNo !==
      undefined
        ? `Ward ${ward.wardNo}`
        : "Unnamed Ward"
    )
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
   SAFE ENTITY COMPARISON
============================================================ */

function sameEntity(
  first,
  second,
  nameGetter
) {

  if (
    !first ||
    !second
  ) {

    return false;

  }


  const firstId =
    getEntityId(
      first
    );

  const secondId =
    getEntityId(
      second
    );


  /*
   * IDs are authoritative.
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
   * Fallback to name.
   */

  return (
    nameGetter(first) ===
    nameGetter(second)
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


      /*
       * CITY LEVEL ONLY
       *
       * Slightly more zoomed out than before.
       *
       * Selection zoom is NOT affected.
       */

      map.fitBounds(
        cityBounds,
        {

          padding:
            [60, 60],

          maxZoom:
            10,

          animate:
            false,

        }
      );


      return;

    }


    /*
     * Fallback:
     * Fit all zones.
     */

    const zoneBounds =
      zones
        .map(
          (
            zone
          ) =>
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
            [60, 60],

          maxZoom:
            10,

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
   HIERARCHY FOCUS
============================================================ */

function HierarchyFocusController({
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
     * WARD HAS HIGHEST PRIORITY
     */

    if (
      selectedWard
    ) {

      target =
        getWardBoundary(
          selectedWard
        );


      selectionKey =
        `ward:${
          getEntityId(
            selectedWard
          ) ||
          getWardName(
            selectedWard
          )
        }`;

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
        `division:${
          getEntityId(
            selectedDivision
          ) ||
          getDivisionName(
            selectedDivision
          )
        }`;

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
        `zone:${
          getEntityId(
            selectedZone
          ) ||
          getZoneName(
            selectedZone
          )
        }`;

    }


    else {

      previousSelection.current =
        "";

      return;

    }


    /*
     * Don't refit the same
     * selection repeatedly.
     */

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
     * ZONE
     */

    let padding =
      [
        80,
        80,
      ];

    let maxZoom =
      13;


    /*
     * DIVISION
     */

    if (
      selectedDivision
    ) {

      padding =
        [
          100,
          100,
        ];

      maxZoom =
        15;

    }


    /*
     * WARD
     */

    if (
      selectedWard
    ) {

      padding =
        [
          120,
          120,
        ];

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

      key={
        `zone-${
          getZoneName(
            zone
          )
        }-${index}`
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
            ? 3.5
            : 2.2,

        opacity:
          1,

        /*
         * IMPORTANT:
         *
         * Selected zone is transparent
         * so divisions remain visible.
         */

        fillColor:
          selected
            ? "transparent"
            : color,

        fillOpacity:
          selected
            ? 0
            : 0.38,

        lineJoin:
          "round",

        lineCap:
          "round",

      })}

      eventHandlers={{

        click:
          () =>
            onSelect?.(
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
        `division-${
          getEntityId(
            division
          ) ||
          getDivisionName(
            division
          )
        }-${index}`
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
            : 1.7,

        opacity:
          1,

        fillColor:
          color,

        fillOpacity:
          selected
            ? 0.62
            : 0.28,

        lineJoin:
          "round",

        lineCap:
          "round",

      })}

      eventHandlers={{

        click:
          () =>
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
        `ward-${
          getEntityId(
            ward
          ) ||
          getWardName(
            ward
          )
        }-${index}`
      }

      data={
        boundary
      }

      style={() => ({

        color:
          selected
            ? "#142536"
            : "#5D7084",

        weight:
          selected
            ? 3
            : 1.4,

        opacity:
          1,

        fillColor:
          color,

        fillOpacity:
          selected
            ? 0.68
            : 0.28,

        lineJoin:
          "round",

        lineCap:
          "round",

      })}

      eventHandlers={{

        click:
          () =>
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
   GENERIC FILTER DROPDOWN
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

                  key={
                    `${optionValue}-${index}`
                  }

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

  cityId =
    DEFAULT_CITY_ID,

  /*
   * OPTIONAL:
   *
   * If parent already owns the map-view state,
   * it can receive:
   *
   * "overview"
   * "route"
   *
   * from this dropdown.
   *
   * Existing usage without this prop
   * continues to work.
   */

  onViewChange,

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
   * Original server response.
   *
   * We do NOT mutate it.
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


  /*
   * NEW:
   *
   * Header map-view dropdown.
   */

  const [
    selectedMapView,
    setSelectedMapView,
  ] = useState(
    "overview"
  );


  const [
    showMapViewMenu,
    setShowMapViewMenu,
  ] = useState(
    false
  );


  const mapRef =
    useRef(
      null
    );


  const mapViewMenuRef =
    useRef(
      null
    );


  /* ==========================================================
     LOAD COMPLETE CITY MAP
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
           * Calculate totals only for logging.
           */

          let divisionCount =
            0;

          let wardCount =
            0;


          loadedZones.forEach(
            (
              zone
            ) => {

              const zoneDivisions =
                getZoneDivisions(
                  zone
                );


              divisionCount +=
                zoneDivisions.length;


              zoneDivisions.forEach(
                (
                  division
                ) => {

                  wardCount +=
                    getDivisionWards(
                      division
                    ).length;

                }
              );

            }
          );


          console.log(
            "------------------------------------------------------------"
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
            divisionCount
          );

          console.log(
            "Wards:",
            wardCount
          );

          console.log(
            "Citizen data:",
            "NOT USED"
          );

          console.log(
            "------------------------------------------------------------"
          );


          /*
           * Store exactly what backend returned.
           */

          setCity(
            loadedCity
          );


          setZones(
            loadedZones
          );


          /*
           * Reset hierarchy.
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
     CLOSE MAP VIEW DROPDOWN OUTSIDE
  ========================================================== */

  useEffect(
    () => {

      const handleOutsideClick =
        (
          event
        ) => {

          if (
            mapViewMenuRef.current &&
            !mapViewMenuRef.current.contains(
              event.target
            )
          ) {

            setShowMapViewMenu(
              false
            );

          }

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

    },

    []

  );


  /* ==========================================================
     NORMALIZED CITY BOUNDARY
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
     SELECTED ZONE DIVISIONS
  ========================================================== */

  const selectedZoneDivisions =
    useMemo(
      () => {

        if (
          !selectedZone
        ) {

          return [];

        }


        return getZoneDivisions(
          selectedZone
        );

      },

      [
        selectedZone,
      ]

    );


  /* ==========================================================
     SELECTED DIVISION WARDS
  ========================================================== */

  const selectedDivisionWards =
    useMemo(
      () => {

        if (
          !selectedDivision
        ) {

          return [];

        }


        return getDivisionWards(
          selectedDivision
        );

      },

      [
        selectedDivision,
      ]

    );


  /* ==========================================================
     VISIBLE ZONES
  ========================================================== */

  const visibleZones =
    useMemo(
      () => {

        /*
         * No selection:
         * show all zones.
         */

        if (
          !selectedZone
        ) {

          return zones;

        }


        /*
         * Zone selected:
         * show only selected zone.
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
         * no divisions.
         */

        if (
          !selectedZone
        ) {

          return [];

        }


        /*
         * Zone selected but no division:
         * show ONLY divisions belonging
         * to selected zone.
         */

        if (
          !selectedDivision
        ) {

          return selectedZoneDivisions;

        }


        /*
         * Division selected:
         * show ONLY that division.
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
         * Wards are displayed ONLY
         * after division selection.
         */

        if (
          !selectedDivision
        ) {

          return [];

        }


        return selectedDivisionWards;

      },

      [
        selectedDivision,
        selectedDivisionWards,
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


        /*
         * Store exact zone object.
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
     DIVISION SELECT
  ========================================================== */

  const handleDivisionSelect =
    useCallback(
      (
        option
      ) => {

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
          "Wards:",
          getDivisionWards(
            division
          ).length
        );


        setSelectedDivision(
          division
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
     WARD SELECT
  ========================================================== */

  const handleWardSelect =
    useCallback(
      (
        option
      ) => {

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
     RESET
  ========================================================== */

  const handleReset =
    useCallback(
      () => {

        console.log(
          "🔄 RESETTING CITY MAP"
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


        /*
         * Refit CITY ONLY.
         *
         * Slightly more zoomed out.
         *
         * Selection zoom remains unchanged.
         */

        setTimeout(
          () => {

            const map =
              mapRef.current;


            if (
              !map
            ) {

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

                  padding:
                    [60, 60],

                  maxZoom:
                    10,

                  animate:
                    true,

                }
              );

            }

          },

          50

        );

      },

      [
        cityBoundary,
      ]

    );


  /* ==========================================================
     MAP VIEW OPTIONS
  ========================================================== */

  const mapViewOptions =
    [

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
          "Route Map",

        icon:
          Route,

      },

    ];


  const activeMapView =
    mapViewOptions.find(
      (
        item
      ) =>
        item.id ===
        selectedMapView
    ) ||
    mapViewOptions[0];


  const ActiveMapIcon =
    activeMapView.icon;


  /* ==========================================================
     MAP VIEW CHANGE
  ========================================================== */

  const handleMapViewChange =
    useCallback(
      (
        view
      ) => {

        setSelectedMapView(
          view
        );

        setShowMapViewMenu(
          false
        );


        /*
         * Allow parent to control
         * the actual route-map view.
         */

        if (
          typeof onViewChange ===
          "function"
        ) {

          onViewChange(
            view
          );

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

    <section
      className="cm-wrapper"
    >

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
            1px solid #dce4ec;

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


        /* ====================================================
           HEADER DROPDOWN
        ==================================================== */

        .cm-map-header {
          position:
            absolute;

          z-index:
            2000;

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

          cursor:
            pointer;
        }


        .cm-header-left {
          display:
            flex;

          align-items:
            center;

          gap:
            16px;

          min-width:
            0;
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

          white-space:
            nowrap;

          overflow:
            hidden;

          text-overflow:
            ellipsis;
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

          transition:
            transform .2s ease;
        }


        .cm-map-header-open
        .cm-header-chevron {
          transform:
            rotate(180deg);
        }


        .cm-view-menu {
          position:
            absolute;

          z-index:
            2500;

          top:
            124px;

          left:
            28px;

          width:
            min(52%, 620px);

          padding:
            8px;

          box-sizing:
            border-box;

          background:
            rgba(255,255,255,.98);

          backdrop-filter:
            blur(14px);

          border:
            1px solid #dce5ee;

          border-radius:
            16px;

          box-shadow:
            0 18px 45px
            rgba(30,45,60,.14);
        }


        .cm-view-option {
          width:
            100%;

          min-height:
            54px;

          display:
            flex;

          align-items:
            center;

          gap:
            12px;

          padding:
            10px 14px;

          border:
            0;

          border-radius:
            12px;

          background:
            transparent;

          color:
            #47617b;

          font-size:
            14px;

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
            #f4f7fa;
        }


        .cm-view-option-active {
          background:
            #edf3f8;

          color:
            #20364c;
        }


        .cm-view-option-icon {
          width:
            20px;

          height:
            20px;

          flex-shrink:
            0;
        }


        .cm-view-option-check {
          margin-left:
            auto;

          color:
            #2563eb;

          font-size:
            15px;

          font-weight:
            800;
        }


        /* ====================================================
           FILTER CARD
        ==================================================== */

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
            1px solid #dce4ec;

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
            1px solid #cfddea;

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
           FILTER DROPDOWN
        ==================================================== */

        .cm-dropdown {
          position:
            absolute;

          z-index:
            5000;

          top:
            calc(100% + 8px);

          left:
            0;

          width:
            100%;

          max-height:
            330px;

          overflow-y:
            auto;

          padding:
            6px;

          box-sizing:
            border-box;

          background:
            #ffffff;

          border:
            1px solid #dce5ee;

          border-radius:
            16px;

          box-shadow:
            0 15px 40px
            rgba(30,45,60,.12);
        }


        .cm-dropdown-option {
          width:
            100%;

          min-height:
            48px;

          display:
            flex;

          align-items:
            center;

          gap:
            10px;

          padding:
            10px 12px;

          box-sizing:
            border-box;

          border:
            0;

          border-radius:
            12px;

          background:
            transparent;

          color:
            #47617b;

          font-size:
            14px;

          font-weight:
            600;

          text-align:
            left;

          cursor:
            pointer;

          transition:
            .15s ease;
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


        /* ====================================================
           SELECTED CARD
        ==================================================== */

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
            360px;

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
            1px solid #e7edf3;

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


        .cm-hierarchy-status {
          margin-top:
            10px;

          display:
            flex;

          flex-direction:
            column;

          gap:
            5px;

          font-size:
            12px;

          font-weight:
            600;

          color:
            #7892ae;
        }


        .cm-selection-path {
          margin-top:
            12px;

          padding-top:
            10px;

          border-top:
            1px solid #edf1f5;

          display:
            flex;

          flex-direction:
            column;

          gap:
            5px;

          font-size:
            12px;

          color:
            #7892ae;
        }


        .cm-selection-path strong {
          color:
            #536a84;
        }


        /* ====================================================
           RESET
        ==================================================== */

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
            1px solid #dbe4ed;

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


        /* ====================================================
           STATUS
        ==================================================== */

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
            1px solid #dfe7ef;

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


        /* ====================================================
           RESPONSIVE
        ==================================================== */

        @media (max-width: 1100px) {

          .cm-map-header {
            width:
              45%;
          }


          .cm-view-menu {
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


          .cm-view-menu {
            top:
              98px;

            left:
              16px;

            width:
              calc(100% - 32px);
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

          <InitialCityFit

            cityBoundary={
              cityBoundary
            }

            zones={
              zones
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
                    `zone-${
                      getEntityId(
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
                      `division-${
                        getEntityId(
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

                      }
                    }

                  />

                )
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
                        getEntityId(
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
                        getWardName
                      )

                    }

                    onSelect={
                      setSelectedWard
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


        {/* ====================================================
            MAP VIEW DROPDOWN HEADER
        ==================================================== */}

        <div
          ref={
            mapViewMenuRef
          }
        >

          <button

            type="button"

            className={`cm-map-header ${
              showMapViewMenu
                ? "cm-map-header-open"
                : ""
            }`}

            onClick={() =>
              setShowMapViewMenu(
                (
                  current
                ) =>
                  !current
              )
            }

          >

            <div
              className="cm-header-left"
            >

              <ActiveMapIcon
                className="cm-header-icon"
                strokeWidth={
                  1.8
                }
              />


              <div>

                <div
                  className="cm-header-title"
                >

                  {
                    activeMapView.label
                  }

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

              className=
                "cm-header-chevron"

              size={
                18
              }

            />

          </button>


          {showMapViewMenu && (

            <div
              className="cm-view-menu"
            >

              {mapViewOptions.map(
                (
                  option
                ) => {

                  const OptionIcon =
                    option.icon;


                  const isActive =
                    selectedMapView ===
                    option.id;


                  return (

                    <button

                      key={
                        option.id
                      }

                      type="button"

                      className={`cm-view-option ${
                        isActive
                          ? "cm-view-option-active"
                          : ""
                      }`}

                      onClick={() =>
                        handleMapViewChange(
                          option.id
                        )
                      }

                    >

                      <OptionIcon

                        className=
                          "cm-view-option-icon"

                        strokeWidth={
                          1.9
                        }

                      />


                      <span>
                        {
                          option.label
                        }
                      </span>


                      {isActive && (

                        <span
                          className=
                            "cm-view-option-check"
                        >
                          ✓
                        </span>

                      )}

                    </button>

                  );

                }
              )}

            </div>

          )}

        </div>


        {/* ====================================================
            FILTER CARD
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

                    className=
                      "cm-zone-dot"

                    style={{
                      backgroundColor:
                        color,
                    }}

                  />


                  <span
                    className=
                      "cm-zone-option-name"
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

              selectedZone

                ? selectedZoneDivisions.length
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
              selectedZoneDivisions.length ===
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

              selectedDivision

                ? selectedDivisionWards.length
                  ? "All Wards"
                  : "No Wards"

                : "Select a Division First"

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


          {/* ==================================================
              RESET
          ================================================== */}

          <button

            type="button"

            className=
              "cm-reset-button"

            onClick={
              handleReset
            }

          >

            <RotateCcw
              size={
                16
              }
            />

            Reset Map

          </button>

        </div>


        {/* ====================================================
            SELECTION CARD
        ==================================================== */}

        {(
          selectedZone ||
          selectedDivision ||
          selectedWard
        ) && (

          <div
            className=
              "cm-selected-card"
          >

            <div
              className=
                "cm-selected-label"
            >

              <span

                className=
                  "cm-selected-dot"

                style={{

                  backgroundColor:

                    selectedWard

                      ? "#38BDF8"

                      : selectedDivision

                      ? "#A78BFA"

                      : ZONE_COLORS[
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


              {
                selectedWard
                  ? "SELECTED WARD"
                  : selectedDivision
                  ? "SELECTED DIVISION"
                  : "SELECTED ZONE"
              }

            </div>


            <div
              className=
                "cm-selected-name"
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


            <div
              className=
                "cm-selection-path"
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


            <div
              className=
                "cm-hierarchy-status"
            >

              <div>

                Zones:{" "}

                {
                  zones.length
                }

              </div>


              <div>

                Divisions:{" "}

                {
                  selectedZone
                    ? selectedZoneDivisions.length
                    : zones.reduce(
                        (
                          total,
                          zone
                        ) =>
                          total +
                          getZoneDivisions(
                            zone
                          ).length,
                        0
                      )
                }

              </div>


              <div>

                Wards:{" "}

                {
                  selectedDivision
                    ? selectedDivisionWards.length
                    : selectedZone
                    ? selectedZoneDivisions.reduce(
                        (
                          total,
                          division
                        ) =>
                          total +
                          getDivisionWards(
                            division
                          ).length,
                        0
                      )
                    : zones.reduce(
                        (
                          zoneTotal,
                          zone
                        ) =>
                          zoneTotal +
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
                      )
                }

              </div>

            </div>

          </div>

        )}


        {/* ====================================================
            LOADING
        ==================================================== */}

        {loading && (

          <div
            className=
              "cm-state"
          >

            <div
              className=
                "cm-state-card"
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
            className=
              "cm-state"
          >

            <div
              className=
                "cm-state-card cm-error-card"
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