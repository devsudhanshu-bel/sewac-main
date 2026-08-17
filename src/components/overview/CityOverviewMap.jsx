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
  "#BFDBFE",
  "#DDD6FE",
  "#A7F3D0",
  "#FEF3C7",
  "#FBCFE8",
  "#BAE6FD",
  "#FED7AA",
  "#C7D2FE",
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
 * Bengaluru boundaries in some old
 * records were stored as:
 *
 * [latitude, longitude]
 *
 * GeoJSON requires:
 *
 * [longitude, latitude]
 *
 * Detect and correct that format.
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


  /*
   * Bengaluru:
   *
   * latitude  ~ 12
   * longitude ~ 77
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
   * Raw Geometry
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
   * { coordinates: [...] }
   */

  if (
    parsed.coordinates
  ) {

    return {
      type:
        "Feature",

      properties:
        parsed.properties ||
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
   NORMALIZE DIVISIONS
============================================================ */

function getZoneDivisions(
  zone
) {

  if (
    !zone
  ) {
    return [];
  }


  if (
    Array.isArray(
      zone?.divisions
    )
  ) {

    return zone.divisions;

  }


  return [];

}


/* ============================================================
   NORMALIZE WARDS
============================================================ */

function getDivisionWards(
  division
) {

  if (
    !division
  ) {
    return [];
  }


  if (
    Array.isArray(
      division?.wards
    )
  ) {

    return division.wards;

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
     * First try city boundary.
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
     * Fallback:
     * combine all zones.
     */

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


    const zoneName =
      getZoneName(
        selectedZone
      );


    if (
      previousZone.current ===
      zoneName
    ) {

      return;

    }


    previousZone.current =
      zoneName;


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
          [90, 90],

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


    const divisionName =
      getDivisionName(
        selectedDivision
      );


    if (
      previousDivision.current ===
      divisionName
    ) {

      return;

    }


    previousDivision.current =
      divisionName;


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
          [75, 75],

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


    const wardName =
      getWardName(
        selectedWard
      );


    if (
      previousWard.current ===
      wardName
    ) {

      return;

    }


    previousWard.current =
      wardName;


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
          [60, 60],

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
            ? 0.52
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
            : 0.25,

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
            ? 3
            : 1,

        opacity:
          1,

        fillColor:
          color,

        fillOpacity:
          selected
            ? 0.68
            : 0.22,

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

          <div className="cm-dropdown">

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
  cityId =
    DEFAULT_CITY_ID,
}) {

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );


  const [
    error,
    setError,
  ] =
    useState(
      ""
    );


  const [
    city,
    setCity,
  ] =
    useState(
      null
    );


  const [
    zones,
    setZones,
  ] =
    useState(
      []
    );


  const [
    selectedZone,
    setSelectedZone,
  ] =
    useState(
      null
    );


  const [
    selectedDivision,
    setSelectedDivision,
  ] =
    useState(
      null
    );


  const [
    selectedWard,
    setSelectedWard,
  ] =
    useState(
      null
    );


  const [
    openDropdown,
    setOpenDropdown,
  ] =
    useState(
      null
    );


  const mapRef =
    useRef(
      null
    );


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
            "=========================================="
          );

          console.log(
            "🗺️ CITY MAP REQUEST"
          );

          console.log(
            "CITY:",
            cityId
          );

          console.log(
            "=========================================="
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
           * IMPORTANT:
           *
           * We DO NOT call another API here.
           *
           * The city endpoint already contains:
           *
           * zone
           *   -> divisions
           *        -> wards
           */

          console.log(
            "=========================================="
          );

          console.log(
            "✅ CITY MAP LOADED"
          );

          console.log(
            "CITY:",
            loadedCity?.cityName
          );

          console.log(
            "ZONES:",
            loadedZones.length
          );


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
            "DIVISIONS:",
            divisionCount
          );

          console.log(
            "WARDS:",
            wardCount
          );

          console.log(
            "CITIZEN DATA: NOT LOADED"
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
     SELECTED ZONE NAME
  ========================================================== */

  const selectedZoneName =
    selectedZone
      ? getZoneName(
          selectedZone
        )
      : null;


  /* ==========================================================
     SELECTED DIVISION NAME
  ========================================================== */

  const selectedDivisionName =
    selectedDivision
      ? getDivisionName(
          selectedDivision
        )
      : null;


  /* ==========================================================
     SELECTED WARD NAME
  ========================================================== */

  const selectedWardName =
    selectedWard
      ? getWardName(
          selectedWard
        )
      : null;


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


        return getZoneDivisions(
          selectedZone
        );

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
     SELECTED DIVISION WARDS
  ========================================================== */

  const wards =
    useMemo(
      () => {

        /*
         * No division:
         *
         * Return ALL wards belonging
         * to the selected zone.
         */

        if (
          !selectedDivision
        ) {

          return divisions.reduce(

            (
              allWards,
              division
            ) => {

              return [

                ...allWards,

                ...getDivisionWards(
                  division
                ),

              ];

            },

            []

          );

        }


        /*
         * Division selected:
         *
         * ONLY wards belonging to
         * that division.
         */

        return getDivisionWards(
          selectedDivision
        );

      },
      [
        divisions,
        selectedDivision,
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
         * No zone selected:
         *
         * Show every zone.
         */

        if (
          !selectedZone
        ) {

          return zones;

        }


        /*
         * Zone selected:
         *
         * ONLY selected zone.
         */

        return zones.filter(
          (
            zone
          ) =>
            getZoneName(
              zone
            ) ===
            selectedZoneName
        );

      },
      [
        zones,
        selectedZone,
        selectedZoneName,
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
         * No divisions should be
         * displayed.
         */

        if (
          !selectedZone
        ) {

          return [];

        }


        /*
         * No division:
         *
         * Show every division
         * belonging to selected zone.
         */

        if (
          !selectedDivision
        ) {

          return divisions;

        }


        /*
         * Division selected:
         *
         * ONLY selected division.
         */

        return divisions.filter(
          (
            division
          ) =>
            getDivisionName(
              division
            ) ===
            selectedDivisionName
        );

      },
      [
        selectedZone,
        divisions,
        selectedDivision,
        selectedDivisionName,
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
         * No wards.
         */

        if (
          !selectedZone
        ) {

          return [];

        }


        /*
         * Specific ward selected:
         *
         * ONLY that ward.
         */

        if (
          selectedWard
        ) {

          return [
            selectedWard,
          ];

        }


        /*
         * No division:
         *
         * Show all wards belonging
         * to selected zone.
         */

        if (
          !selectedDivision
        ) {

          return wards;

        }


        /*
         * Division selected:
         *
         * Show only wards of
         * selected division.
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
          return;
        }


        console.log(
          "=========================================="
        );

        console.log(
          "🟣 ZONE SELECTED"
        );

        console.log(
          "ZONE:",
          getZoneName(
            zone
          )
        );

        console.log(
          "ZONE TABLE:",
          getZoneTableName(
            zone
          )
        );

        console.log(
          "DIVISIONS:",
          getZoneDivisions(
            zone
          ).length
        );


        let zoneWardCount =
          0;


        getZoneDivisions(
          zone
        ).forEach(
          (
            division
          ) => {

            zoneWardCount +=
              getDivisionWards(
                division
              ).length;

          }
        );


        console.log(
          "WARDS IN ZONE:",
          zoneWardCount
        );

        console.log(
          "=========================================="
        );


        /*
         * Record zone immediately.
         */

        setSelectedZone(
          zone
        );


        /*
         * Reset division.
         */

        setSelectedDivision(
          null
        );


        /*
         * Reset ward.
         */

        setSelectedWard(
          null
        );


        /*
         * Close dropdown.
         */

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


        console.log(
          "=========================================="
        );

        console.log(
          "🔵 DIVISION SELECTED"
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


        /*
         * Ward belongs to division,
         * so previous ward selection
         * must be cleared.
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


        console.log(
          "=========================================="
        );

        console.log(
          "🟢 WARD SELECTED"
        );

        console.log(
          "WARD:",
          getWardName(
            ward
          )
        );

        console.log(
          "=========================================="
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
     RENDER
  ========================================================== */

  return (

    <section className="cm-wrapper">

      <style>{`

        .cm-wrapper {
          width: 100%;
          background: #fff;
          border: 1px solid #dce4ec;
          border-radius: 20px;
          padding: 18px;
          box-sizing: border-box;
          box-shadow:
            0 4px 18px rgba(31,45,61,.05);
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
          filter:
            saturate(.42)
            brightness(1.05);
        }

        .cm-map .leaflet-control-zoom {
          margin-top: 14px;
          margin-left: 14px;
          border: 1px solid #d8e1ea;
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

        .cm-filter-card {
          position: absolute;
          z-index: 1000;
          top: 28px;
          right: 28px;
          width: 370px;
          padding: 24px;
          box-sizing: border-box;
          background:
            rgba(255,255,255,.97);
          backdrop-filter: blur(12px);
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
          border-color: #91afd0;
        }

        .cm-select-disabled {
          background: #f7f9fb;
          color: #9aaabd;
          cursor: not-allowed;
        }

        .cm-select-value {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 90%;
        }

        .cm-select-placeholder {
          color: #526a83;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 90%;
        }

        .cm-dropdown {
          position: absolute;
          z-index: 5000;
          top: calc(100% + 7px);
          left: 0;
          width: 100%;
          max-height: 360px;
          overflow-y: auto;
          padding: 7px;
          box-sizing: border-box;
          background: #fff;
          border:
            1px solid #d7e1eb;
          border-radius: 16px;
          box-shadow:
            0 15px 35px
            rgba(34,52,70,.13);
        }

        .cm-dropdown-option {
          width: 100%;
          min-height: 48px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          box-sizing: border-box;
          border: none;
          border-radius: 12px;
          background: transparent;
          color: #405a75;
          font-size: 15px;
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
          border:
            1px solid
            rgba(49,73,96,.35);
        }

        .cm-zone-option-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .cm-selected-card {
          position: absolute;
          z-index: 1000;
          left: 28px;
          bottom: 28px;
          width: 360px;
          padding: 18px 22px;
          box-sizing: border-box;
          background:
            rgba(255,255,255,.97);
          backdrop-filter: blur(12px);
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
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .cm-hierarchy-status {
          margin-top: 11px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .cm-stat-pill {
          padding: 5px 9px;
          border-radius: 8px;
          background: #f3f6f9;
          color: #607891;
          font-size: 11px;
          font-weight: 700;
        }

        .cm-selection-status {
          margin-top: 12px;
          padding-top: 11px;
          border-top:
            1px solid #edf1f5;
          font-size: 12px;
          font-weight: 600;
          color: #7892ae;
        }

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
            width:
              calc(100% - 32px);
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
            max-height: 390px;
            overflow-y: visible;
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

        {/* ==================================================
            MAP
        ================================================== */}

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
                zone,
                index
              ) => (

                <ZoneLayer

                  key={`zone-${getZoneName(
                    zone
                  )}-${index}`}

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

                    getZoneName(
                      selectedZone
                    ) ===
                    getZoneName(
                      zone
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

                      key={`division-${getDivisionId(
                        division
                      )}-${index}`}

                      division={
                        division
                      }

                      index={
                        index
                      }

                      selected={

                        !!selectedDivision &&

                        getDivisionName(
                          selectedDivision
                        ) ===
                        getDivisionName(
                          division
                        )

                      }

                      onSelect={
                        setSelectedDivision
                      }

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

                      key={`ward-${getWardId(
                        ward
                      )}-${getWardName(
                        ward
                      )}-${index}`}

                      ward={
                        ward
                      }

                      index={
                        index
                      }

                      selected={

                        !!selectedWard &&

                        getWardName(
                          selectedWard
                        ) ===
                        getWardName(
                          ward
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


        {/* ==================================================
            MAP HEADER
        ================================================== */}

        <div className="cm-map-header">

          <div className="cm-header-left">

            <MapIcon

              className="cm-header-icon"

              strokeWidth={
                1.8
              }

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

        <div className="cm-filter-card">

          <div className="cm-filter-title">
            MAP FILTERS
          </div>


          {/* ==================================================
              ZONE
          ================================================== */}

          <FilterDropdown

            label="ZONE"

            value={
              selectedZoneName ||
              ""
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


          {/* ==================================================
              DIVISION
          ================================================== */}

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

              selectedWardName ||
              ""

            }

            placeholder={

              !selectedZone

                ? "Select a Zone First"

                : !selectedDivision

                  ? "Select a Division First"

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


        {/* ==================================================
            SELECTION INFORMATION
        ================================================== */}

        {selectedZone && (

          <div className="cm-selected-card">

            <div className="cm-selected-label">

              <span

                className="cm-selected-dot"

                style={{

                  backgroundColor:
                    ZONE_COLORS[

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


            <div className="cm-selected-name">

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


            {!selectedDivision &&
              getZoneTableName(
                selectedZone
              ) && (

                <div className="cm-selected-table">

                  {
                    getZoneTableName(
                      selectedZone
                    )
                  }

                </div>

              )}


            <div className="cm-hierarchy-status">

              <span className="cm-stat-pill">

                {divisions.length}

                {" "}

                division
                {divisions.length === 1
                  ? ""
                  : "s"}

              </span>


              <span className="cm-stat-pill">

                {wards.length}

                {" "}

                ward
                {wards.length === 1
                  ? ""
                  : "s"}

              </span>

            </div>


            <div className="cm-selection-status">

              {selectedWard

                ? `Showing only ${getWardName(
                    selectedWard
                  )}`

                : selectedDivision

                  ? `Showing ${getDivisionWards(
                      selectedDivision
                    ).length} wards in ${getDivisionName(
                      selectedDivision
                    )}`

                  : `Showing all ${divisions.length} divisions and ${wards.length} wards in ${getZoneName(
                      selectedZone
                    )}`}

            </div>

          </div>

        )}


        {/* ==================================================
            LOADING
        ================================================== */}

        {loading && (

          <div className="cm-state">

            <div className="cm-state-card">

              Loading city boundaries...

            </div>

          </div>

        )}


        {/* ==================================================
            ERROR
        ================================================== */}

        {!loading &&
          error && (

            <div className="cm-state">

              <div className="cm-state-card cm-error-card">

                {error}

              </div>

            </div>

          )}

      </div>

    </section>

  );

}