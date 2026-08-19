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


/* ============================================================
   EXACT BACKEND ENDPOINTS
============================================================ */

/*
   CITY
   ------------------------------------------------------------

   GET
   /api/master-citizen/map/city/:cityId
*/

const CITY_MAP_ENDPOINT = (
  cityId
) =>
  `${API_BASE_URL}/api/master-citizen/map/city/${encodeURIComponent(
    cityId
  )}`;


/*
   ZONE → DIVISIONS
   ------------------------------------------------------------

   GET
   /api/master-citizen/map/zone/:zoneTableName/divisions
*/

const ZONE_DIVISIONS_ENDPOINT = (
  zoneTableName
) =>
  `${API_BASE_URL}/api/master-citizen/map/zone/${encodeURIComponent(
    zoneTableName
  )}/divisions`;


/*
   DIVISION → WARDS
   ------------------------------------------------------------

   GET
   /api/master-citizen/map/division/:divisionTableName/wards
*/

const DIVISION_WARDS_ENDPOINT = (
  divisionTableName
) =>
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
    typeof value ===
    "object"
  ) {
    return value;
  }


  if (
    typeof value ===
    "string"
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
    typeof value[0] ===
      "number" &&
    typeof value[1] ===
      "number"
  );

}


/*
 * GeoJSON:
 *
 * [longitude, latitude]
 *
 * Some existing SEWAC boundary
 * records may contain:
 *
 * [latitude, longitude]
 *
 * Only swap when the values
 * clearly indicate that format.
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


/* ============================================================
   NORMALIZE COORDINATES
============================================================ */

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
   NORMALIZE GEOMETRY
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
   NORMALIZE GEOJSON
============================================================ */

function normalizeGeoJSON(
  value
) {

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
              (
                feature
              ) => ({

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
   * Support:
   *
   * {
   *   geometry: {...}
   * }
   */

  if (
    parsed.geometry &&
    typeof parsed.geometry ===
      "object"
  ) {

    return {

      type:
        "Feature",

      properties:
        parsed.properties ||
        {},

      geometry:
        normalizeGeometry(
          parsed.geometry
        ),

    };

  }


  /*
   * Support:
   *
   * {
   *   coordinates: [...]
   * }
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


  return null;
}


/* ============================================================
   GEOJSON BOUNDS
============================================================ */

function getGeoJSONBounds(
  value
) {

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

function getEntityId(
  entity
) {

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


/* ============================================================
   ENTITY COMPARISON
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
    getEntityId(first);

  const secondId =
    getEntityId(second);


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
    nameGetter(first) ===
    nameGetter(second)
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
    division?.divisionId ??
    division?.division_id ??
    division?.id ??
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
    ward?.wardNo ||
    ward?.ward_no ||
    "Unnamed Ward"
  );

}


function getWardId(
  ward
) {

  return (
    ward?.wardId ??
    ward?.ward_id ??
    ward?.id ??
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
   RESPONSE ARRAY HELPER
============================================================ */

function extractArray(
  result,
  key
) {

  if (
    Array.isArray(result)
  ) {
    return result;
  }


  if (
    Array.isArray(
      result?.[key]
    )
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
    Array.isArray(
      result?.data
    )
  ) {
    return result.data;
  }


  return [];

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
            [55, 55],

          maxZoom:
            10,

          animate:
            false,

        }
      );


      return;

    }


    const boundsList =
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
        .filter(Boolean);


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
      i <
      boundsList.length;
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
            [55, 55],

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

    if (!selectedZone) {

      previousZone.current =
        null;

      return;

    }


    const zoneKey =
      getZoneTableName(
        selectedZone
      ) ||
      getZoneName(
        selectedZone
      );


    if (
      previousZone.current ===
      zoneKey
    ) {
      return;
    }


    previousZone.current =
      zoneKey;


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

        padding:
          [85, 85],

        maxZoom:
          12,

        duration:
          0.9,

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


    const divisionKey =
      getDivisionTableName(
        selectedDivision
      ) ||
      getDivisionId(
        selectedDivision
      ) ||
      getDivisionName(
        selectedDivision
      );


    if (
      previousDivision.current ===
      String(divisionKey)
    ) {
      return;
    }


    previousDivision.current =
      String(divisionKey);


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
          14,

        duration:
          0.8,

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

    if (!selectedWard) {

      previousWard.current =
        null;

      return;

    }


    const wardKey =
      getWardId(
        selectedWard
      ) ||
      getWardName(
        selectedWard
      );


    if (
      previousWard.current ===
      String(wardKey)
    ) {
      return;
    }


    previousWard.current =
      String(wardKey);


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
          getZoneTableName(
            zone
          ) ||
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
            ? "#1F354A"
            : "#40556B",

        weight:
          selected
            ? 4.2
            : 2.4,

        opacity:
          1,

        fillColor:
          color,

        fillOpacity:
          selected
            ? 0.50
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
            ? 3.5
            : 1.8,

        opacity:
          1,

        fillColor:
          color,

        fillOpacity:
          selected
            ? 0.64
            : 0.30,

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
          getWardId(
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
            : "#536A7E",

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
            ? 0.68
            : 0.34,

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
          3.8,

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
      className="
        cm-filter-group
      "
    >

      <div
        className="
          cm-filter-label
        "
      >
        {label}
      </div>


      <button

        type="button"

        className={`
          cm-select
          ${
            disabled
              ? "cm-select-disabled"
              : ""
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
          className="
            cm-dropdown
          "
        >

          {options.length ===
          0 ? (

            <div
              className="
                cm-dropdown-empty
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

                    key={
                      `${optionValue}-${index}`
                    }

                    className={`
                      cm-dropdown-option
                      ${
                        selectedOption
                          ? "cm-dropdown-option-active"
                          : ""
                      }
                    `}

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
    divisions,
    setDivisions,
  ] = useState(
    []
  );


  const [
    selectedDivision,
    setSelectedDivision,
  ] = useState(
    null
  );


  const [
    wards,
    setWards,
  ] = useState(
    []
  );


  const [
    selectedWard,
    setSelectedWard,
  ] = useState(
    null
  );


  const [
    divisionsLoading,
    setDivisionsLoading,
  ] = useState(
    false
  );


  const [
    wardsLoading,
    setWardsLoading,
  ] = useState(
    false
  );


  const [
    divisionError,
    setDivisionError,
  ] = useState(
    ""
  );


  const [
    wardError,
    setWardError,
  ] = useState(
    ""
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


  const divisionAbortRef =
    useRef(
      null
    );


  const wardAbortRef =
    useRef(
      null
    );


  /* ==========================================================
     LOAD CITY
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
            CITY_MAP_ENDPOINT(
              cityId
            )
          );

          console.log(
            "============================================================"
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


          setCity(
            loadedCity
          );


          setZones(
            loadedZones
          );


          /*
           * Clear complete hierarchy.
           */

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


      return () => {

        divisionAbortRef.current?.abort();

        wardAbortRef.current?.abort();

      };

    },
    [
      fetchCityMapData,
    ]
  );


  /* ==========================================================
     FETCH DIVISIONS FOR SELECTED ZONE
  ========================================================== */

  const fetchZoneDivisions =
    useCallback(
      async (
        zone
      ) => {

        divisionAbortRef.current?.abort();


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

          return;

        }


        const zoneTableName =
          getZoneTableName(
            zone
          );


        if (
          !zoneTableName
        ) {

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


        /*
         * Clear old wards.
         */

        wardAbortRef.current?.abort();

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


        console.log(
          "============================================================"
        );

        console.log(
          "🏢 ZONE → DIVISIONS"
        );

        console.log(
          "Zone:",
          getZoneName(
            zone
          )
        );

        console.log(
          "Zone table:",
          zoneTableName
        );

        console.log(
          "Endpoint:",
          endpoint
        );

        console.log(
          "============================================================"
        );


        try {

          const response =
            await fetch(

              endpoint,

              {

                method:
                  "GET",

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
            )
              .filter(
                Boolean
              );


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
     FETCH WARDS FOR SELECTED DIVISION
  ========================================================== */

  const fetchDivisionWards =
    useCallback(
      async (
        division
      ) => {

        wardAbortRef.current?.abort();


        if (!division) {

          setWards(
            []
          );

          setSelectedWard(
            null
          );

          return;

        }


        const divisionTableName =
          getDivisionTableName(
            division
          );


        if (
          !divisionTableName
        ) {

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


        console.log(
          "============================================================"
        );

        console.log(
          "📍 DIVISION → WARDS"
        );

        console.log(
          "Division:",
          getDivisionName(
            division
          )
        );

        console.log(
          "Division table:",
          divisionTableName
        );

        console.log(
          "Endpoint:",
          endpoint
        );

        console.log(
          "============================================================"
        );


        try {

          const response =
            await fetch(

              endpoint,

              {

                method:
                  "GET",

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
            )
              .filter(
                Boolean
              );


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
            division
          ) => ({

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
            ward
          ) => ({

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
         * Nothing selected:
         * show every zone.
         */

        if (
          !selectedZone
        ) {

          return zones;

        }


        /*
         * Zone selected:
         * show ONLY selected zone.
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
         * Zone selected:
         * show ALL divisions belonging
         * to that zone.
         */

        if (
          !selectedDivision
        ) {

          return divisions;

        }


        /*
         * Division selected:
         * highlight/show only selected division.
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
        divisions,
        selectedDivision,
      ]
    );


  /* ==========================================================
     VISIBLE WARDS
  ========================================================== */

  const visibleWards =
    useMemo(
      () => {

        /*
         * Wards are ONLY visible
         * after a division is selected.
         */

        if (
          !selectedDivision
        ) {

          return [];

        }


        return wards;

      },
      [
        selectedDivision,
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

        if (!zone) {
          return;
        }


        /*
         * Store exact zone object.
         */

        setSelectedZone(
          zone
        );


        /*
         * Clear everything
         * below zone level.
         */

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


        /*
         * EXACT BACKEND REQUEST:
         *
         * /map/zone/:zoneTableName/divisions
         */

        fetchZoneDivisions(
          zone
        );

      },
      [
        fetchZoneDivisions,
      ]
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

          setWards(
            []
          );

          setWardError(
            ""
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


        /*
         * Store exact division object.
         */

        setSelectedDivision(
          division
        );


        /*
         * Clear previous ward.
         */

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


        /*
         * EXACT BACKEND REQUEST:
         *
         * /map/division/:divisionTableName/wards
         */

        fetchDivisionWards(
          division
        );

      },
      [
        fetchDivisionWards,
      ]
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
     RESET MAP
  ========================================================== */

  const resetMap =
    useCallback(
      () => {

        divisionAbortRef.current?.abort();

        wardAbortRef.current?.abort();


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


        setDivisionsLoading(
          false
        );

        setWardsLoading(
          false
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


        /*
         * Return map to city.
         */

        const map =
          mapRef.current;


        const bounds =
          getGeoJSONBounds(
            cityBoundary
          );


        if (
          map &&
          bounds &&
          bounds.isValid()
        ) {

          map.flyToBounds(
            bounds,
            {

              padding:
                [55, 55],

              maxZoom:
                10,

              duration:
                0.8,

            }
          );

        }

      },
      [
        cityBoundary,
      ]
    );


  /* ==========================================================
     RENDER
  ========================================================== */

  return (

    <section
      className="
        cm-wrapper
      "
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


        .cm-map
        .leaflet-tile-pane {
          filter:
            saturate(.42)
            brightness(1.05);
        }


        .cm-map
        .leaflet-control-zoom {
          margin-left:
            16px;

          margin-top:
            16px;
        }


        .cm-map
        .leaflet-control-zoom a {
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
            #fff;
        }


        .cm-map
        .leaflet-control-attribution {
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
            #fff;

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
            #fff;

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


        .cm-dropdown-empty {
          padding:
            14px 12px;

          color:
            #9aaabd;

          font-size:
            13px;

          font-weight:
            600;

          text-align:
            center;
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
            390px;

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


        .cm-selected-details {
          margin-top:
            10px;

          display:
            grid;

          grid-template-columns:
            repeat(
              3,
              minmax(
                0,
                1fr
              )
            );

          gap:
            10px;
        }


        .cm-detail {
          display:
            flex;

          flex-direction:
            column;

          gap:
            3px;

          min-width:
            0;
        }


        .cm-detail-label {
          font-size:
            10px;

          font-weight:
            700;

          text-transform:
            uppercase;

          color:
            #9aafc4;

          letter-spacing:
            .35px;
        }


        .cm-detail-value {
          font-size:
            12px;

          font-weight:
            700;

          color:
            #526b84;

          overflow:
            hidden;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;
        }


        .cm-status {
          margin-top:
            10px;

          font-size:
            12px;

          font-weight:
            600;

          color:
            #7892ae;
        }


        .cm-error {
          margin-top:
            10px;

          padding-top:
            10px;

          border-top:
            1px solid
            #edf1f5;

          color:
            #e11d48;

          font-size:
            12px;

          line-height:
            1.4;
        }


        .cm-reset-button {
          width:
            100%;

          height:
            52px;

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
            #d5e1ec;

          border-radius:
            15px;

          background:
            #fff;

          color:
            #526b84;

          font-size:
            14px;

          font-weight:
            700;

          cursor:
            pointer;

          transition:
            .2s ease;
        }


        .cm-reset-button:hover {
          border-color:
            #91afd0;

          background:
            #f7fafc;
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


        @media (
          max-width: 1100px
        ) {

          .cm-map-header {
            width:
              45%;
          }

          .cm-filter-card {
            width:
              320px;
          }

        }


        @media (
          max-width: 800px
        ) {

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
              calc(
                100% -
                32px
              );

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
        className="
          cm-heading
        "
      >
        CITY OVERVIEW MAP
      </h2>


      <div
        className="
          cm-map-shell
        "
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

          className="
            cm-map
          "

          preferCanvas={
            false
          }

        >

          <TileLayer

            url="
              https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png
            "

            attribution="
              &copy; OpenStreetMap contributors
              &copy; CARTO
            "

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

            name="
              zonePane
            "

            style={{
              zIndex:
                410,
            }}

          >

            {visibleZones.map(
              (
                zone
              ) => {

                const originalIndex =
                  zones.findIndex(
                    (
                      item
                    ) =>
                      sameEntity(
                        item,
                        zone,
                        getZoneName
                      )
                  );


                return (

                  <ZoneLayer

                    key={
                      `zone-${
                        getZoneTableName(
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
                      originalIndex >=
                      0
                        ? originalIndex
                        : 0
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

                );

              }
            )}

          </Pane>


          {/* ==================================================
              DIVISION LAYER

              ONLY divisions belonging to
              selected zone are shown.
          ================================================== */}

          {selectedZone &&
            visibleDivisions.length >
              0 && (

            <Pane

              name="
                divisionPane
              "

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
                        divisionValue
                      ) => {

                        /*
                         * Store exact division.
                         */

                        setSelectedDivision(
                          divisionValue
                        );


                        /*
                         * Clear old ward.
                         */

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


                        /*
                         * Fetch wards for
                         * THIS division only.
                         */

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


          {/* ==================================================
              WARD LAYER

              ONLY wards belonging to the
              selected division are shown.
          ================================================== */}

          {selectedDivision &&
            visibleWards.length >
              0 && (

            <Pane

              name="
                wardPane
              "

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
                        selectedWard,
                        ward,
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

              Always stays on top.
          ================================================== */}

          <Pane

            name="
              cityBoundaryPane
            "

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
            HEADER
        ==================================================== */}

        <div
          className="
            cm-map-header
          "
        >

          <div
            className="
              cm-header-left
            "
          >

            <MapIcon

              className="
                cm-header-icon
              "

              strokeWidth={
                1.8
              }

            />


            <div>

              <div
                className="
                  cm-header-title
                "
              >
                City Overview Map
              </div>


              {city?.cityName && (

                <div
                  className="
                    cm-header-city
                  "
                >

                  {
                    city.cityName
                  }

                </div>

              )}

            </div>

          </div>


          <ChevronDown

            className="
              cm-header-chevron
            "

            size={
              18
            }

          />

        </div>


        {/* ====================================================
            FILTER PANEL
        ==================================================== */}

        <div
          className="
            cm-filter-card
          "
        >

          <div
            className="
              cm-filter-title
            "
          >
            MAP FILTERS
          </div>


          {/* =================================================
              ZONE
          ================================================= */}

          <FilterDropdown

            label="
              ZONE
            "

            value={
              selectedZoneName
            }

            placeholder="
              All Zones
            "

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
                      cm-zone-dot
                    "

                    style={{
                      backgroundColor:
                        color,
                    }}

                  />


                  <span

                    className="
                      cm-zone-option-name
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


          {/* =================================================
              DIVISION
          ================================================= */}

          <FilterDropdown

            label="
              DIVISION
            "

            value={
              selectedDivisionName
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


          {/* =================================================
              WARD
          ================================================= */}

          <FilterDropdown

            label="
              WARD
            "

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


          {/* =================================================
              STATUS
          ================================================= */}

          {divisionsLoading && (

            <div
              className="
                cm-status
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
                cm-status
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
                cm-error
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
                cm-error
              "
            >

              {
                wardError
              }

            </div>

          )}


          {/* =================================================
              RESET
          ================================================= */}

          {(selectedZone ||
            selectedDivision ||
            selectedWard) && (

            <button

              type="button"

              className="
                cm-reset-button
              "

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


        {/* ====================================================
            SELECTED CARD
        ==================================================== */}

        {(selectedZone ||
          selectedDivision ||
          selectedWard) && (

          <div
            className="
              cm-selected-card
            "
          >

            <div
              className="
                cm-selected-label
              "
            >

              <span

                className="
                  cm-selected-dot
                "

                style={{

                  backgroundColor:

                    selectedWard

                      ? WARD_COLORS[
                          0
                        ]

                      : selectedDivision

                      ? DIVISION_COLORS[
                          Math.max(
                            0,
                            divisions.indexOf(
                              selectedDivision
                            )
                          ) %
                            DIVISION_COLORS.length
                        ]

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
              className="
                cm-selected-name
              "
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
              className="
                cm-selected-table
              "
            >

              {
                selectedWard

                  ? getWardId(
                      selectedWard
                    ) !== null

                    ? `Ward ID: ${getWardId(
                        selectedWard
                      )}`

                    : "Ward boundary"

                  : selectedDivision

                  ? getDivisionTableName(
                      selectedDivision
                    ) ||
                    "Division boundary"

                  : getZoneTableName(
                      selectedZone
                    ) ||
                    "Zone boundary"
              }

            </div>


            <div
              className="
                cm-selected-details
              "
            >

              <div
                className="
                  cm-detail
                "
              >

                <span
                  className="
                    cm-detail-label
                  "
                >
                  City
                </span>

                <span
                  className="
                    cm-detail-value
                  "
                >

                  {
                    city?.cityName ||
                    "Bangalore"
                  }

                </span>

              </div>


              <div
                className="
                  cm-detail
                "
              >

                <span
                  className="
                    cm-detail-label
                  "
                >
                  Divisions
                </span>

                <span
                  className="
                    cm-detail-value
                  "
                >

                  {
                    selectedZone
                      ? divisions.length
                      : "—"
                  }

                </span>

              </div>


              <div
                className="
                  cm-detail
                "
              >

                <span
                  className="
                    cm-detail-label
                  "
                >
                  Wards
                </span>

                <span
                  className="
                    cm-detail-value
                  "
                >

                  {
                    selectedDivision
                      ? wards.length
                      : "—"
                  }

                </span>

              </div>

            </div>

          </div>

        )}


        {/* ====================================================
            LOADING
        ==================================================== */}

        {loading && (

          <div
            className="
              cm-state
            "
          >

            <div
              className="
                cm-state-card
              "
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
            className="
              cm-state
            "
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