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
   CONFIGURATION
============================================================ */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5002";

const DEFAULT_CITY_ID = 1;


/*
 * IMPORTANT
 *
 * THIS IS THE ONLY API REQUEST USED BY THIS MAP.
 *
 * The backend already returns:
 *
 * CITY
 *   ↓
 * ZONES
 *   ↓
 * DIVISIONS
 *   ↓
 * WARDS
 *
 * Therefore we DO NOT request divisions again.
 *
 * We DO NOT request wards again.
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
 * GeoJSON normally uses:
 *
 * [longitude, latitude]
 *
 * If backend accidentally gives:
 *
 * [latitude, longitude]
 *
 * we correct it.
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


  /*
   * Bengaluru:
   *
   * latitude  ≈ 13
   * longitude ≈ 77
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

      geometry:
        normalizeGeometry(
          parsed
        ),

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
   * Raw coordinates
   */

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

  const map =
    useMap();


  const didFit =
    useRef(false);


  useEffect(() => {

    if (
      didFit.current
    ) {

      return;

    }


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
     * Fallback to zones.
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
      !boundsList.length
    ) {

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
  ]);


  return null;

}


/* ============================================================
   SELECTED ZONE FOCUS
============================================================ */

function SelectedZoneFocusController({
  selectedZone,
}) {

  const map =
    useMap();


  const previousZone =
    useRef(null);


  useEffect(() => {

    if (
      !selectedZone
    ) {

      previousZone.current =
        null;

      return;

    }


    const zoneId =
      getEntityId(
        selectedZone
      );


    const zoneName =
      getZoneName(
        selectedZone
      );


    const identity =
      zoneId ||
      zoneName;


    if (
      previousZone.current ===
      identity
    ) {

      return;

    }


    previousZone.current =
      identity;


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


    /*
     * Zone should fill the map nicely,
     * but not become ridiculously zoomed.
     */

    map.flyToBounds(
      bounds,
      {

        padding:
          [80, 80],

        maxZoom:
          13,

        duration:
          1.0,

        easeLinearity:
          0.25,

      }
    );

  }, [
    map,
    selectedZone,
  ]);


  return null;

}


/* ============================================================
   SELECTED DIVISION FOCUS
============================================================ */

function SelectedDivisionFocusController({
  selectedDivision,
}) {

  const map =
    useMap();


  const previousDivision =
    useRef(null);


  useEffect(() => {

    if (
      !selectedDivision
    ) {

      previousDivision.current =
        null;

      return;

    }


    const divisionId =
      getEntityId(
        selectedDivision
      );


    const divisionName =
      getDivisionName(
        selectedDivision
      );


    const identity =
      divisionId ||
      divisionName;


    if (
      previousDivision.current ===
      identity
    ) {

      return;

    }


    previousDivision.current =
      identity;


    const bounds =
      getGeoJSONBounds(
        getDivisionBoundary(
          selectedDivision
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

        padding:
          [100, 100],

        maxZoom:
          15,

        duration:
          0.9,

        easeLinearity:
          0.25,

      }
    );

  }, [
    map,
    selectedDivision,
  ]);


  return null;

}


/* ============================================================
   SELECTED WARD FOCUS
============================================================ */

function SelectedWardFocusController({
  selectedWard,
}) {

  const map =
    useMap();


  const previousWard =
    useRef(null);


  useEffect(() => {

    if (
      !selectedWard
    ) {

      previousWard.current =
        null;

      return;

    }


    const wardId =
      getEntityId(
        selectedWard
      );


    const wardName =
      getWardName(
        selectedWard
      );


    const identity =
      wardId ||
      wardName;


    if (
      previousWard.current ===
      identity
    ) {

      return;

    }


    previousWard.current =
      identity;


    const bounds =
      getGeoJSONBounds(
        getWardBoundary(
          selectedWard
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

        padding:
          [120, 120],

        maxZoom:
          16,

        duration:
          0.8,

        easeLinearity:
          0.25,

      }
    );

  }, [
    map,
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
          getZoneName(zone)
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

        click:
          () =>
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
            ? 3
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
            ? 0.65
            : 0.32,

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

        className={
          `cm-select ${
            disabled
              ? "cm-select-disabled"
              : ""
          }`
        }

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

                  className={
                    `cm-dropdown-option ${
                      selectedOption
                        ? "cm-dropdown-option-active"
                        : ""
                    }`
                  }

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


  /*
   * Selected zone object.
   */

  const [
    selectedZone,
    setSelectedZone,
  ] = useState(
    null
  );


  /*
   * Selected division object.
   */

  const [
    selectedDivision,
    setSelectedDivision,
  ] = useState(
    null
  );


  /*
   * Selected ward object.
   */

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
     FETCH COMPLETE CITY MAP
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
            "🗺️ FRONTEND CITY MAP REQUEST"
          );

          console.log(
            "============================================================"
          );

          console.log(
            "City ID:",
            cityId
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


          const cityData =
            result?.city ||
            null;


          const zoneData =
            Array.isArray(
              result?.zones
            )
              ? result.zones
              : [];


          /*
           * IMPORTANT:
           *
           * We store the complete nested
           * hierarchy exactly as returned
           * by backend.
           */

          setCity(
            cityData
          );

          setZones(
            zoneData
          );


          /*
           * Reset selections.
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


          console.log(
            "------------------------------------------------------------"
          );

          console.log(
            "✅ CITY MAP RECEIVED"
          );

          console.log(
            "City:",
            cityData?.cityName
          );

          console.log(
            "Zones:",
            zoneData.length
          );

          console.log(
            "Divisions:",
            zoneData.reduce(
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
          );

          console.log(
            "Wards:",
            zoneData.reduce(
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
          );

          console.log(
            "Citizen data: NOT LOADED"
          );

          console.log(
            "------------------------------------------------------------"
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
     SELECTED ZONE DIVISIONS
  ========================================================== */

  const divisions =
    useMemo(
      () => {

        if (
          !selectedZone
        ) {

          return [];

        }


        /*
         * THIS IS THE IMPORTANT FIX.
         *
         * We DO NOT fetch divisions.
         *
         * We directly use:
         *
         * selectedZone.divisions
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
     SELECTED DIVISION WARDS
  ========================================================== */

  const wards =
    useMemo(
      () => {

        if (
          !selectedDivision
        ) {

          return [];

        }


        /*
         * Directly use:
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
            zone,
            index
          ) => ({

            value:
              getEntityId(
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

            index,

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

        ...divisions.map(
          (
            division,
            index
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

            index,

          })
        ),

      ],
      [
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
            ward,
            index
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

            index,

          })
        ),

      ],
      [
        wards,
      ]
    );


  /* ==========================================================
     VISIBLE ZONES
============================================================ */

  const visibleZones =
    useMemo(
      () => {

        /*
         * No zone selected:
         *
         * show all five zones.
         */

        if (
          !selectedZone
        ) {

          return zones;

        }


        /*
         * Zone selected:
         *
         * show ONLY that zone.
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
  ============================================================= */

  const visibleDivisions =
    useMemo(
      () => {

        /*
         * No selected zone:
         *
         * no divisions should be rendered.
         */

        if (
          !selectedZone
        ) {

          return [];

        }


        /*
         * No selected division:
         *
         * show ALL divisions belonging
         * to the selected zone ONLY.
         */

        if (
          !selectedDivision
        ) {

          return divisions;

        }


        /*
         * Selected division:
         *
         * show ONLY that division.
         */

        return divisions.filter(
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
        divisions,
      ]
    );


  /* ==========================================================
     VISIBLE WARDS
  ============================================================= */

  const visibleWards =
    useMemo(
      () => {

        /*
         * No division:
         *
         * show nothing.
         */

        if (
          !selectedDivision
        ) {

          return [];

        }


        /*
         * Division selected but
         * no ward selected:
         *
         * show ALL wards belonging
         * to that division.
         */

        if (
          !selectedWard
        ) {

          return wards;

        }


        /*
         * Ward selected:
         *
         * show ONLY that ward.
         */

        return wards.filter(
          (
            ward
          ) =>
            sameEntity(
              ward,
              selectedWard,
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
     SELECT ZONE
  ========================================================== */

  const handleZoneSelect =
    useCallback(
      (
        zone
      ) => {

        if (
          !zone
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
          "🎯 ZONE SELECTED"
        );

        console.log(
          "Zone:",
          getZoneName(
            zone
          )
        );

        console.log(
          "Divisions belonging to this zone:",
          getZoneDivisions(
            zone
          ).length
        );

        console.log(
          "============================================================"
        );


        /*
         * Set zone.
         */

        setSelectedZone(
          zone
        );


        /*
         * CRITICAL:
         *
         * Reset everything below zone.
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
         * "All Divisions"
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
          option.division;


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
          "🏢 DIVISION SELECTED"
        );

        console.log(
          "Division:",
          getDivisionName(
            division
          )
        );

        console.log(
          "Wards belonging to this division:",
          getDivisionWards(
            division
          ).length
        );

        console.log(
          "============================================================"
        );


        /*
         * Set selected division.
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
          option.ward;


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
          "📍 WARD SELECTED"
        );

        console.log(
          "Ward:",
          getWardName(
            ward
          )
        );

        console.log(
          "============================================================"
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
     RESET MAP
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
         * Refit to city.
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
                    [35, 35],

                  maxZoom:
                    11,

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
     SELECTED ZONE NAME
  ========================================================== */

  const selectedZoneName =
    selectedZone
      ? getZoneName(
          selectedZone
        )
      : "";


  /* ==========================================================
     SELECTED DIVISION NAME
  ========================================================== */

  const selectedDivisionName =
    selectedDivision
      ? getDivisionName(
          selectedDivision
        )
      : "";


  /* ==========================================================
     SELECTED WARD NAME
  ========================================================== */

  const selectedWardName =
    selectedWard
      ? getWardName(
          selectedWard
        )
      : "";


  /* ============================================================
     RENDER
  ============================================================ */

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

          max-height:
            calc(100% - 56px);

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
            1px solid #dbe4ed;

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

        .cm-reset-button {
          width:
            100%;

          height:
            54px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          gap:
            8px;

          border:
            1px solid #d3dfeb;

          border-radius:
            15px;

          background:
            #ffffff;

          color:
            #526a82;

          font-size:
            15px;

          font-weight:
            700;

          cursor:
            pointer;

          transition:
            .2s ease;
        }

        .cm-reset-button:hover {
          background:
            #f7f9fb;

          border-color:
            #a9bdd1;
        }

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
            370px;

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

        .cm-selected-stat {
          margin-top:
            10px;

          font-size:
            12px;

          font-weight:
            600;

          color:
            #7892ae;
        }

        .cm-selected-hierarchy {
          margin-top:
            12px;

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

        .cm-selected-hierarchy strong {
          color:
            #526a82;
        }

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
              360px;

            overflow-y:
              auto;
          }

          .cm-selected-card {
            display:
              none;
          }

        }

      `}</style>


      <h2
        className="cm-heading"
      >
        CITY OVERVIEW MAP
      </h2>


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


          <MapBoundsController
            cityBoundary={
              cityBoundary
            }

            zones={
              zones
            }
          />


          <SelectedZoneFocusController
            selectedZone={
              selectedZone
            }
          />


          <SelectedDivisionFocusController
            selectedDivision={
              selectedDivision
            }
          />


          <SelectedWardFocusController
            selectedWard={
              selectedWard
            }
          />


          {/* ==================================================
              ZONE LAYER
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
                    }`
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
              DIVISION LAYER

              IMPORTANT:
              Only divisions belonging to selected zone.
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
                      }`
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
                        getDivisionName
                      )
                    }

                    onSelect={
                      (
                        division
                      ) => {

                        setSelectedDivision(
                          division
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
              WARD LAYER

              IMPORTANT:
              Wards are rendered ONLY after a division
              is selected.
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
                      }`
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
                        getWardName
                      )
                    }

                    onSelect={
                      (
                        ward
                      ) =>
                        setSelectedWard(
                          ward
                        )
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
            MAP HEADER
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


              const color =
                ZONE_COLORS[
                  (
                    option.index ??
                    index
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
              selectedZone
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
              divisions.length ===
                0
            }

            onChange={
              handleDivisionSelect
            }

            renderOption={(
              option
            ) => {

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
                ? wards.length
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
              wards.length ===
                0
            }

            onChange={
              handleWardSelect
            }

            renderOption={(
              option
            ) => {

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

            className="cm-reset-button"

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

        {(selectedZone ||
          selectedDivision ||
          selectedWard) && (

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

              {selectedWard
                ? "SELECTED WARD"
                : selectedDivision
                ? "SELECTED DIVISION"
                : "SELECTED ZONE"}

            </div>


            <div
              className="cm-selected-name"
            >

              {selectedWard
                ? getWardName(
                    selectedWard
                  )
                : selectedDivision
                ? getDivisionName(
                    selectedDivision
                  )
                : getZoneName(
                    selectedZone
                  )}

            </div>


            <div
              className="cm-selected-hierarchy"
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


            {selectedZone &&
              !selectedDivision && (

              <div
                className="cm-selected-stat"
              >
                {
                  divisions.length
                }{" "}
                division
                {
                  divisions.length ===
                  1
                    ? ""
                    : "s"
                }{" "}
                in this zone
              </div>

            )}


            {selectedDivision &&
              !selectedWard && (

              <div
                className="cm-selected-stat"
              >
                {
                  wards.length
                }{" "}
                ward
                {
                  wards.length ===
                  1
                    ? ""
                    : "s"
                }{" "}
                in this division
              </div>

            )}

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