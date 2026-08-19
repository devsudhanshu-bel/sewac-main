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
   CONFIG
============================================================ */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://sewac-main.onrender.com";

const DEFAULT_CITY_ID = 1;


/* ============================================================
   ONE API ONLY
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
  "#38BDF8",
  "#A3E635",
  "#F87171",
  "#C084FC",
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
  "#F97316",
  "#84CC16",
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
   COORDINATE NORMALIZATION
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

  /*
   * Bangalore coordinates:
   *
   * latitude  ≈ 13
   * longitude ≈ 77
   *
   * GeoJSON:
   * [longitude, latitude]
   *
   * If backend sends:
   * [latitude, longitude]
   *
   * swap them.
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


  /* FEATURE COLLECTION */

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


  /* FEATURE */

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


  /* DIRECT GEOMETRY */

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


  /* OBJECT CONTAINING GEOMETRY */

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


  /* RAW COORDINATES */

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

    if (
      bounds &&
      bounds.isValid()
    ) {

      return bounds;

    }

  } catch {

    return null;

  }

  return null;
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

  return String(value);
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
   IMPORTANT:
   DIVISIONS COME FROM THE ZONE OBJECT
============================================================ */

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


  /*
   * Compatibility:
   *
   * zone.data.divisions
   */

  if (
    Array.isArray(
      zone?.data?.divisions
    )
  ) {

    return zone.data.divisions;

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
   IMPORTANT:
   WARDS COME FROM THE DIVISION OBJECT
============================================================ */

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


  /*
   * Compatibility:
   *
   * division.data.wards
   */

  if (
    Array.isArray(
      division?.data?.wards
    )
  ) {

    return division.data.wards;

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


function getWardId(
  ward
) {

  return (
    ward?.id ??
    ward?.wardId ??
    ward?.ward_id ??
    ward?.wardNo ??
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
   ENTITY COMPARISON
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
   MAP SIZE
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


    const onResize = () =>
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
          padding: [
            55,
            55,
          ],

          /*
           * Keep the initial
           * city overview zoomed out.
           */
          maxZoom: 10,

          animate: false,
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
          padding: [
            55,
            55,
          ],

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
      getZoneId(
        selectedZone
      );


    const zoneName =
      getZoneName(
        selectedZone
      );


    const focusKey =
      zoneId !== null &&
      zoneId !== undefined
        ? String(zoneId)
        : zoneName;


    if (
      previousZone.current ===
      focusKey
    ) {

      return;

    }


    previousZone.current =
      focusKey;


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
        /*
         * This gives the zone enough
         * breathing room around it.
         */
        padding: [
          110,
          110,
        ],

        maxZoom: 12,

        duration: 1.1,

        easeLinearity: 0.2,

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
      getDivisionId(
        selectedDivision
      );


    const divisionName =
      getDivisionName(
        selectedDivision
      );


    const focusKey =
      divisionId !== null &&
      divisionId !== undefined
        ? String(divisionId)
        : divisionName;


    if (
      previousDivision.current ===
      focusKey
    ) {

      return;

    }


    previousDivision.current =
      focusKey;


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
        padding: [
          100,
          100,
        ],

        maxZoom: 14,

        duration: 1.0,

        easeLinearity: 0.2,
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
      getWardId(
        selectedWard
      );


    const wardName =
      getWardName(
        selectedWard
      );


    const focusKey =
      wardId !== null &&
      wardId !== undefined
        ? String(wardId)
        : wardName;


    if (
      previousWard.current ===
      focusKey
    ) {

      return;

    }


    previousWard.current =
      focusKey;


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
        padding: [
          90,
          90,
        ],

        maxZoom: 15,

        duration: 1.0,

        easeLinearity: 0.2,
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
  hasDivisionSelection,
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


  const style = {

    /*
     * When selected, the zone
     * gets a strong dark outline.
     */

    color:
      selected
        ? "#1F354A"
        : "#40556B",

    weight:
      selected
        ? 4
        : 2.2,

    opacity: 1,

    fillColor:
      color,

    /*
     * Once divisions are visible,
     * make the zone background subtle
     * so divisions remain clearly visible.
     */

    fillOpacity:
      selected
        ? hasDivisionSelection
          ? 0.08
          : 0.18
        : 0.34,

    lineJoin:
      "round",

    lineCap:
      "round",

  };


  return (
    <GeoJSON
      key={
        `zone-${getZoneId(
          zone
        ) ?? getZoneName(
          zone
        )}-${index}`
      }

      data={
        boundary
      }

      style={() =>
        style
      }

      eventHandlers={{

        click: () =>
          onSelect(
            zone
          ),

        mouseover: (
          event
        ) => {

          if (
            selected
          ) {
            return;
          }

          event.target.setStyle({
            weight: 3,
            fillOpacity: 0.48,
          });

        },

        mouseout: (
          event
        ) => {

          event.target.setStyle(
            style
          );

        },

      }}

      bubblingMouseEvents={
        false
      }
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


  const style = {

    color:
      selected
        ? "#172B3F"
        : color,

    weight:
      selected
        ? 3.4
        : 2,

    opacity: 1,

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

  };


  return (
    <GeoJSON
      key={
        `division-${getDivisionId(
          division
        ) ?? getDivisionName(
          division
        )}-${index}`
      }

      data={
        boundary
      }

      style={() =>
        style
      }

      eventHandlers={{

        click: () =>
          onSelect?.(
            division
          ),

        mouseover: (
          event
        ) => {

          if (
            selected
          ) {
            return;
          }

          event.target.setStyle({
            weight: 3,
            fillOpacity: 0.52,
          });

          if (
            event.target.bringToFront
          ) {
            event.target.bringToFront();
          }

        },

        mouseout: (
          event
        ) => {

          event.target.setStyle(
            style
          );

        },

      }}

      bubblingMouseEvents={
        false
      }
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


  const style = {

    color:
      selected
        ? "#14283B"
        : color,

    weight:
      selected
        ? 3.2
        : 1.8,

    opacity: 1,

    fillColor:
      color,

    fillOpacity:
      selected
        ? 0.65
        : 0.42,

    lineJoin:
      "round",

    lineCap:
      "round",

  };


  return (
    <GeoJSON
      key={
        `ward-${getWardId(
          ward
        ) ?? getWardName(
          ward
        )}-${index}`
      }

      data={
        boundary
      }

      style={() =>
        style
      }

      eventHandlers={{

        click: () =>
          onSelect?.(
            ward
          ),

        mouseover: (
          event
        ) => {

          if (
            selected
          ) {
            return;
          }

          event.target.setStyle({
            weight: 2.8,
            fillOpacity: 0.56,
          });

          if (
            event.target.bringToFront
          ) {
            event.target.bringToFront();
          }

        },

        mouseout: (
          event
        ) => {

          event.target.setStyle(
            style
          );

        },

      }}

      bubblingMouseEvents={
        false
      }
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


  const [
    viewMenuOpen,
    setViewMenuOpen,
  ] = useState(
    false
  );


  const mapRef =
    useRef(null);


  /* ==========================================================
     FETCH CITY MAP
     
     IMPORTANT:
     ONE REQUEST ONLY.
     
     Backend response already contains:
     
     CITY
       ↓
     ZONES
       ↓
     DIVISIONS
       ↓
     WARDS
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
              result?.message ||
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


          console.log(
            "=========================================="
          );

          console.log(
            "🗺️ CITY MAP HIERARCHY LOADED"
          );

          console.log(
            "CITY:",
            loadedCity
              ?.cityName
          );

          console.log(
            "ZONES:",
            loadedZones.length
          );

          console.log(
            "DIVISIONS:",
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
            )
          );

          console.log(
            "WARDS:",
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
            )
          );

          console.log(
            "=========================================="
          );


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


          setOpenDropdown(
            null
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

          setLoading(
            false
          );

        }

      },
      [cityId]
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
          city?.geo_boundary ??
          city?.geometry ??
          city?.boundary
        ),
      [city]
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
     SELECTED ZONE DIVISIONS
     
     THIS IS THE IMPORTANT FIX.
     
     We DO NOT fetch divisions.
     
     We read:
     
     selectedZone.divisions
  ========================================================== */

  const divisions =
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


  /* ============================================================
     SELECTED DIVISION WARDS
     
     Again:
     
     NO API CALL.
     
     Read directly from:
     
     selectedDivision.wards
  ============================================================ */

  const wards =
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


  /* ============================================================
     ZONE OPTIONS
  ============================================================ */

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


  /* ============================================================
     DIVISION OPTIONS
  ============================================================ */

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


  /* ============================================================
     WARD OPTIONS
  ============================================================ */

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


  /* ============================================================
     VISIBLE ZONES
  ============================================================ */

  const visibleZones =
    useMemo(
      () => {

        if (
          !selectedZone
        ) {

          return zones;

        }


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


  /* ============================================================
     VISIBLE DIVISIONS
     
     No division selected:
       show ALL divisions of selected zone.
     
     Division selected:
       show ONLY selected division.
  ============================================================ */

  const visibleDivisions =
    useMemo(
      () => {

        if (
          !selectedZone
        ) {

          return [];

        }


        if (
          !selectedDivision
        ) {

          return divisions;

        }


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
        divisions,
        selectedDivision,
      ]
    );


  /* ============================================================
     VISIBLE WARDS
     
     No division selected:
       no wards.
     
     Division selected:
       ALL wards of that division.
     
     Ward selected:
       ONLY selected ward.
  ============================================================ */

  const visibleWards =
    useMemo(
      () => {

        if (
          !selectedDivision
        ) {

          return [];

        }


        if (
          !selectedWard
        ) {

          return wards;

        }


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

      },
      [
        selectedDivision,
        wards,
        selectedWard,
      ]
    );


  /* ============================================================
     ZONE SELECT
  ============================================================ */

  const handleZoneSelect =
    useCallback(
      (
        zone
      ) => {

        console.log(
          "=========================================="
        );

        console.log(
          "📍 ZONE SELECTED"
        );

        console.log(
          "ZONE:",
          getZoneName(
            zone
          )
        );

        console.log(
          "DIVISIONS:",
          getZoneDivisions(
            zone
          ).length
        );

        console.log(
          "=========================================="
        );


        setSelectedZone(
          zone
        );


        /*
         * Clear children.
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


  /* ============================================================
     DIVISION SELECT
  ============================================================ */

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


        console.log(
          "=========================================="
        );

        console.log(
          "🏢 DIVISION SELECTED"
        );

        console.log(
          "DIVISION:",
          getDivisionName(
            division
          )
        );

        console.log(
          "WARDS:",
          getDivisionWards(
            division
          ).length
        );

        console.log(
          "=========================================="
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


  /* ============================================================
     WARD SELECT
  ============================================================ */

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
          option.ward ||
          null
        );


        setOpenDropdown(
          null
        );

      },
      []
    );


  /* ============================================================
     RESET
  ============================================================ */

  const handleReset =
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

        setViewMenuOpen(
          false
        );

      },
      []
    );


  /* ============================================================
     SELECTED ZONE COLOR
  ============================================================ */

  const selectedZoneIndex =
    selectedZone
      ? Math.max(
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
        )
      : 0;


  const selectedZoneColor =
    ZONE_COLORS[
      selectedZoneIndex %
        ZONE_COLORS.length
    ];


  /* ============================================================
     HEADER VIEW NAVIGATION
  ============================================================ */

  const handleRouteMap =
    useCallback(
      () => {

        /*
         * Existing SEWAC route-map page.
         *
         * If your route is different,
         * change ONLY this URL.
         */

        window.location.href =
          "/admin/route-map";

      },
      []
    );


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


        /* =====================================================
           HEADER
        ===================================================== */

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
        }


        .cm-header-button:hover {
          background: #f3f7fa;
        }


        .cm-view-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 20px;
          width: 240px;
          padding: 7px;
          background: #fff;
          border: 1px solid #dce4ec;
          border-radius: 14px;
          box-shadow: 0 18px 45px rgba(30,45,60,.14);
        }


        .cm-view-option {
          width: 100%;
          min-height: 48px;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 0 13px;
          border: 0;
          border-radius: 10px;
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


        /* =====================================================
           FILTER CARD
        ===================================================== */

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
          cursor: pointer;
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


        .cm-option-color {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          flex-shrink: 0;
          border: 1px solid rgba(49,73,96,.25);
        }


        .cm-zone-option-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }


        /* =====================================================
           RESET
        ===================================================== */

        .cm-reset-button {
          width: 100%;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border: 1px solid #d5e0ea;
          border-radius: 15px;
          background: #fff;
          color: #536d87;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: .2s ease;
        }


        .cm-reset-button:hover {
          border-color: #9bb4cc;
          background: #f8fafc;
        }


        /* =====================================================
           SELECTED CARD
        ===================================================== */

        .cm-selected-card {
          position: absolute;
          z-index: 1000;
          left: 28px;
          bottom: 28px;
          width: 390px;
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


        .cm-hierarchy-row {
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }


        .cm-hierarchy-pill {
          padding: 6px 9px;
          border-radius: 8px;
          background: #f3f7fa;
          color: #607991;
          font-size: 11px;
          font-weight: 700;
        }


        .cm-hierarchy-pill-active {
          background: #e9f1f7;
          color: #28445c;
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


        /* =====================================================
           STATES
        ===================================================== */

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
            max-height: 360px;
            overflow-y: auto;
          }


          .cm-selected-card {
            display: none;
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
                zone
              ) => {

                const zoneIndex =
                  zones.findIndex(
                    (
                      item
                    ) =>
                      sameEntity(
                        item,
                        zone,
                        getZoneId,
                        getZoneName
                      )
                  );


                return (

                  <ZoneLayer

                    key={
                      `zone-${getZoneId(
                        zone
                      ) ?? getZoneName(
                        zone
                      )}`
                    }

                    zone={
                      zone
                    }

                    index={
                      zoneIndex
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

                    hasDivisionSelection={
                      !!selectedDivision
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
                        ) ?? getDivisionName(
                          division
                        )}`
                      }

                      division={
                        division
                      }

                      index={
                        divisions.findIndex(
                          (
                            item
                          ) =>
                            sameEntity(
                              item,
                              division,
                              getDivisionId,
                              getDivisionName
                            )
                        )
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

                      onSelect={
                        handleDivisionSelect
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
                        `ward-${getWardId(
                          ward
                        ) ?? getWardName(
                          ward
                        )}`
                      }

                      ward={
                        ward
                      }

                      index={
                        wards.findIndex(
                          (
                            item
                          ) =>
                            sameEntity(
                              item,
                              ward,
                              getWardId,
                              getWardName
                            )
                        )
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
              
              IMPORTANT:
              This is ONLY the outline.
              It does not cover divisions/wards.
          ================================================== */}

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


        {/* ====================================================
            MAP HEADER / VIEW DROPDOWN
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


          <button

            type="button"

            className="cm-header-button"

            onClick={() =>
              setViewMenuOpen(
                (
                  value
                ) =>
                  !value
              )
            }

          >

            {viewMenuOpen ? (

              <ChevronUp
                size={
                  18
                }
              />

            ) : (

              <ChevronDown
                size={
                  18
                }
              />

            )}

          </button>


          {viewMenuOpen && (

            <div
              className="cm-view-menu"
            >

              <button

                type="button"

                className={
                  "cm-view-option cm-view-option-active"
                }

                onClick={() => {

                  setViewMenuOpen(
                    false
                  );

                }}

              >

                <MapIcon
                  size={
                    18
                  }
                />

                City Overview Map

              </button>


              <button

                type="button"

                className="cm-view-option"

                onClick={
                  handleRouteMap
                }

              >

                <Route
                  size={
                    18
                  }
                />

                Route Map

              </button>

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

                handleReset();

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


          {/* ============================
              DIVISION
          ============================ */}

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
              option,
              index
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


              const color =
                DIVISION_COLORS[
                  (
                    option.index ??
                    index
                  ) %
                    DIVISION_COLORS.length
                ];


              return (

                <>

                  <span

                    className="cm-option-color"

                    style={{
                      backgroundColor:
                        color,
                    }}

                  />

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

                </>

              );

            }}

          />


          {/* ============================
              WARD
          ============================ */}

          <FilterDropdown

            label="WARD"

            value={
              selectedWard
                ? getWardName(
                    selectedWard
                  )
                : ""
            }

            placeholder={
              !selectedDivision
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
              !selectedDivision ||
              wards.length ===
                0
            }

            onChange={
              handleWardSelect
            }

            renderOption={(
              option,
              index
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


              const color =
                WARD_COLORS[
                  (
                    option.index ??
                    index
                  ) %
                    WARD_COLORS.length
                ];


              return (

                <>

                  <span

                    className="cm-option-color"

                    style={{
                      backgroundColor:
                        color,
                    }}

                  />

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

                </>

              );

            }}

          />


          {/* ============================
              RESET
          ============================ */}

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
            SELECTED INFORMATION CARD
        ==================================================== */}

        {selectedZone && (

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
                    selectedZoneColor,
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


            {selectedDivision &&
              !selectedWard && (

                <div
                  className="cm-selected-table"
                >

                  Division:
                  {" "}
                  {
                    getDivisionName(
                      selectedDivision
                    )
                  }

                </div>

              )}


            {selectedWard && (

              <div
                className="cm-selected-table"
              >

                Division:
                {" "}
                {
                  getDivisionName(
                    selectedDivision
                  )
                }

              </div>

            )}


            {!selectedDivision && (

              <div
                className="cm-selected-table"
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

            )}


            <div
              className="cm-hierarchy-row"
            >

              <div
                className={
                  `cm-hierarchy-pill ${
                    !selectedDivision &&
                    !selectedWard
                      ? "cm-hierarchy-pill-active"
                      : ""
                  }`
                }
              >

                Zone

              </div>


              <div
                className={
                  `cm-hierarchy-pill ${
                    selectedDivision &&
                    !selectedWard
                      ? "cm-hierarchy-pill-active"
                      : ""
                  }`
                }
              >

                Divisions:
                {" "}
                {
                  divisions.length
                }

              </div>


              <div
                className={
                  `cm-hierarchy-pill ${
                    selectedWard
                      ? "cm-hierarchy-pill-active"
                      : ""
                  }`
                }
              >

                Wards:
                {" "}
                {
                  selectedDivision
                    ? wards.length
                    : 0
                }

              </div>

            </div>


            {!selectedDivision && (

              <div
                className="cm-division-status"
              >

                {
                  divisions.length
                }
                {" "}
                division
                {
                  divisions.length ===
                  1
                    ? ""
                    : "s"
                }
                {" "}
                available in this zone.

              </div>

            )}


            {selectedDivision && (
              <div
                className="cm-division-status"
              >

                {
                  wards.length
                }
                {" "}
                ward
                {
                  wards.length ===
                  1
                    ? ""
                    : "s"
                }
                {" "}
                available in this division.

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