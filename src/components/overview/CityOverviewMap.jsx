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
   DIVISION ENDPOINT
============================================================ */

/*
 * IMPORTANT
 *
 * The backend route is:
 *
 * GET
 * /api/master-citizen/cities/:cityId/zones/:zoneId/divisions
 *
 * It expects:
 *
 * cityId
 * zoneId
 *
 * NOT zoneTableName.
 */

const ZONE_DIVISIONS_ENDPOINT = (
  cityId,
  zoneId
) =>
  `${API_BASE_URL}/api/master-citizen/cities/${cityId}/zones/${zoneId}/divisions`;


/* ============================================================
   ZONE COLORS
============================================================ */

const ZONE_COLORS = [
  "#60A5FA",
  "#A78BFA",
  "#34D399",
  "#FBBF24",
  "#F472B6",
  "#22D3EE",
  "#FB923C",
  "#818CF8",
  "#4ADE80",
  "#FB7185",
];


/* ============================================================
   DIVISION COLORS
============================================================ */

const DIVISION_COLORS = [
  "#2563EB",
  "#7C3AED",
  "#059669",
  "#D97706",
  "#DB2777",
  "#0891B2",
  "#EA580C",
  "#4F46E5",
  "#16A34A",
  "#DC2626",
];


/* ============================================================
   BASIC HELPERS
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
      return JSON.parse(value);
    } catch (error) {
      console.warn(
        "Unable to parse GeoJSON:",
        error
      );

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
 * Your backend boundary data has been observed in
 * [LATITUDE, LONGITUDE] form.
 *
 * GeoJSON / Leaflet expects:
 *
 * [LONGITUDE, LATITUDE]
 *
 * This helper automatically detects the common
 * Bengaluru coordinate arrangement.
 */

function normalizeCoordinate(
  coordinate
) {
  if (
    !isCoordinatePair(
      coordinate
    )
  ) {
    return coordinate;
  }

  const first =
    coordinate[0];

  const second =
    coordinate[1];

  /*
   * [LAT, LNG]
   *
   * Bengaluru:
   *
   * LAT ≈ 12.x / 13.x
   * LNG ≈ 77.x
   */

  if (
    Math.abs(first) <= 90 &&
    Math.abs(second) > 90
  ) {
    return [
      second,
      first,
    ];
  }

  /*
   * Already [LNG, LAT].
   */

  return [
    first,
    second,
  ];
}


/* ============================================================
   RECURSIVELY NORMALIZE COORDINATES
============================================================ */

function normalizeCoordinates(
  coordinates
) {
  if (
    !Array.isArray(
      coordinates
    )
  ) {
    return coordinates;
  }

  if (
    isCoordinatePair(
      coordinates
    )
  ) {
    return normalizeCoordinate(
      coordinates
    );
  }

  return coordinates.map(
    (
      item
    ) =>
      normalizeCoordinates(
        item
      )
  );
}


/* ============================================================
   NORMALIZE GEOJSON
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
              ) => ({
                ...feature,

                geometry:
                  feature?.geometry
                    ? {
                        ...feature.geometry,

                        coordinates:
                          normalizeCoordinates(
                            feature
                              .geometry
                              .coordinates
                          ),
                      }
                    : feature?.geometry,
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
        parsed.geometry
          ? {
              ...parsed.geometry,

              coordinates:
                normalizeCoordinates(
                  parsed
                    .geometry
                    .coordinates
                ),
            }
          : parsed.geometry,
    };
  }

  /*
   * Direct geometry
   */

  if (
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

  return parsed;
}


/* ============================================================
   GET ZONE NAME
============================================================ */

function getZoneName(
  zone
) {
  return (
    zone?.zoneName ||
    zone?.zone_name ||
    "Unnamed Zone"
  );
}


/* ============================================================
   GET ZONE ID
============================================================ */

function getZoneId(
  zone
) {
  const value =
    zone?.id ??
    zone?.zoneId ??
    zone?.zone_id;

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const numeric =
    Number(value);

  return Number.isInteger(
    numeric
  )
    ? numeric
    : null;
}


/* ============================================================
   GET ZONE TABLE
============================================================ */

function getZoneTableName(
  zone
) {
  return (
    zone?.zoneTableName ||
    zone?.zone_table_name ||
    null
  );
}


/* ============================================================
   GET ZONE BOUNDARY
============================================================ */

function getZoneBoundary(
  zone
) {
  return normalizeGeoJSON(
    zone?.geoBoundary ??
      zone?.geo_boundary
  );
}


/* ============================================================
   GET DIVISION NAME
============================================================ */

function getDivisionName(
  division
) {
  return (
    division?.divisionName ||
    division?.division_name ||
    "Unnamed Division"
  );
}


/* ============================================================
   GET DIVISION ID
============================================================ */

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


/* ============================================================
   GET DIVISION TABLE
============================================================ */

function getDivisionTableName(
  division
) {
  return (
    division?.divisionTableName ||
    division?.division_table_name ||
    null
  );
}


/* ============================================================
   GET DIVISION BOUNDARY
============================================================ */

function getDivisionBoundary(
  division
) {
  return normalizeGeoJSON(
    division?.geoBoundary ??
      division?.geo_boundary
  );
}


/* ============================================================
   GEOJSON BOUNDS
============================================================ */

function getGeoJSONBounds(
  geojson
) {
  if (!geojson) {
    return null;
  }

  try {
    const layer =
      new window.L.GeoJSON(
        geojson
      );

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

    const handleResize =
      () => {
        map.invalidateSize();
      };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      timers.forEach(
        clearTimeout
      );

      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, [map]);

  return null;
}


/* ============================================================
   INITIAL CITY BOUNDS
============================================================ */

function MapBoundsController({
  cityBoundary,
  zones,
}) {
  const map =
    useMap();

  const initializedRef =
    useRef(false);

  useEffect(() => {
    if (
      initializedRef.current
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
      initializedRef.current =
        true;

      map.fitBounds(
        cityBounds,
        {
          padding: [
            40,
            40,
          ],

          maxZoom: 12,

          animate: false,
        }
      );

      return;
    }

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
      zoneBounds.length === 0
    ) {
      return;
    }

    let combinedBounds =
      null;

    zoneBounds.forEach(
      (
        bounds
      ) => {
        if (
          !combinedBounds
        ) {
          combinedBounds =
            bounds;
        } else {
          combinedBounds.extend(
            bounds
          );
        }
      }
    );

    if (
      combinedBounds &&
      combinedBounds.isValid()
    ) {
      initializedRef.current =
        true;

      map.fitBounds(
        combinedBounds,
        {
          padding: [
            40,
            40,
          ],

          maxZoom: 12,

          animate: false,
        }
      );
    }
  }, [
    cityBoundary,
    zones,
    map,
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

  useEffect(() => {
    if (
      !selectedZone
    ) {
      return;
    }

    const boundary =
      getZoneBoundary(
        selectedZone
      );

    if (!boundary) {
      return;
    }

    const bounds =
      getGeoJSONBounds(
        boundary
      );

    if (
      !bounds ||
      !bounds.isValid()
    ) {
      return;
    }

    requestAnimationFrame(
      () => {
        map.flyToBounds(
          bounds,
          {
            paddingTopLeft: [
              50,
              50,
            ],

            /*
             * Leave room for the
             * right-side filter card.
             */

            paddingBottomRight: [
              380,
              80,
            ],

            maxZoom: 14,

            duration: 1.25,

            easeLinearity: 0.18,

            animate: true,
          }
        );
      }
    );
  }, [
    selectedZone,
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
  const boundary =
    useMemo(
      () =>
        getZoneBoundary(
          zone
        ),
      [zone]
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
    color:
      selected
        ? "#26384A"
        : color,

    weight:
      selected
        ? 3.2
        : 2,

    opacity: 1,

    fillColor:
      color,

    fillOpacity:
      selected
        ? 0.52
        : 0.34,

    lineJoin:
      "round",

    lineCap:
      "round",
  };

  const eventHandlers = {
    click: () => {
      onSelect(
        zone
      );
    },

    mouseover: (
      event
    ) => {
      const layer =
        event.target;

      layer.setStyle({
        weight: 3,
        opacity: 1,
        fillOpacity: 0.55,
      });

      if (
        layer.bringToFront
      ) {
        layer.bringToFront();
      }
    },

    mouseout: (
      event
    ) => {
      const layer =
        event.target;

      layer.setStyle(
        style
      );
    },
  };

  return (
    <GeoJSON
      key={
        `zone-${getZoneName(
          zone
        )}-${index}`
      }
      data={
        boundary
      }
      style={() =>
        style
      }
      eventHandlers={
        eventHandlers
      }
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
}) {
  const boundary =
    useMemo(
      () =>
        getDivisionBoundary(
          division
        ),
      [division]
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
        )}-${index}`
      }
      data={
        boundary
      }
      style={() => ({
        color:
          color,

        weight:
          1.7,

        opacity:
          0.95,

        fillColor:
          color,

        fillOpacity:
          0.08,

        lineJoin:
          "round",

        lineCap:
          "round",

        dashArray:
          "5 4",
      })}
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
          "#34475B",

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

  /*
   * ==========================================================
   * DIVISIONS
   * ==========================================================
   */

  const [
    divisions,
    setDivisions,
  ] = useState(
    []
  );

  const [
    divisionsLoading,
    setDivisionsLoading,
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
    selectedDivision,
    setSelectedDivision,
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
     FETCH CITY MAP
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

          const endpoint =
            CITY_MAP_ENDPOINT(
              cityId
            );

          console.log(
            "=========================================="
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
            endpoint
          );

          console.log(
            "=========================================="
          );

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

          console.log(
            "CITY MAP RESPONSE:",
            result
          );

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

          console.log(
            "CITY:",
            cityData
          );

          console.log(
            "TOTAL ZONES:",
            zoneData.length
          );

          zoneData.forEach(
            (
              zone,
              index
            ) => {

              console.log(
                `ZONE ${index + 1}:`,
                getZoneName(
                  zone
                )
              );

              console.log(
                "ZONE ID:",
                getZoneId(
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
                "ZONE BOUNDARY:",
                getZoneBoundary(
                  zone
                )
              );
            }
          );

          setCity(
            cityData
          );

          setZones(
            zoneData
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

          setDivisionError(
            ""
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
     FETCH DIVISIONS FOR SELECTED ZONE
  ========================================================== */

  const fetchZoneDivisions =
    useCallback(
      async (
        zone
      ) => {

        if (
          !zone
        ) {
          setDivisions(
            []
          );

          setSelectedDivision(
            null
          );

          setDivisionError(
            ""
          );

          return;
        }

        const zoneId =
          getZoneId(
            zone
          );

        if (
          !zoneId
        ) {

          console.error(
            "❌ SELECTED ZONE HAS NO VALID ID:",
            zone
          );

          setDivisions(
            []
          );

          setSelectedDivision(
            null
          );

          setDivisionError(
            "Selected zone does not contain a valid zone ID."
          );

          return;
        }

        const endpoint =
          ZONE_DIVISIONS_ENDPOINT(
            cityId,
            zoneId
          );

        try {

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

          console.log(
            "=========================================="
          );

          console.log(
            "🏢 ZONE DIVISIONS REQUEST"
          );

          console.log(
            "CITY ID:",
            cityId
          );

          console.log(
            "ZONE ID:",
            zoneId
          );

          console.log(
            "ZONE NAME:",
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
            "ENDPOINT:",
            endpoint
          );

          console.log(
            "=========================================="
          );

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
              }
            );

          console.log(
            "DIVISION RESPONSE STATUS:",
            response.status
          );

          if (
            !response.ok
          ) {

            let backendMessage =
              "";

            try {
              const errorBody =
                await response.json();

              backendMessage =
                errorBody?.message ||
                "";
            } catch {
              /*
               * Response may not
               * contain JSON.
               */
            }

            throw new Error(
              backendMessage ||
                `Zone division request failed with status ${response.status}`
            );
          }

          const result =
            await response.json();

          console.log(
            "🏢 ZONE DIVISION RESPONSE:",
            result
          );

          if (
            result?.success ===
            false
          ) {

            throw new Error(
              result.message ||
                "Unable to fetch zone divisions."
            );
          }

          /*
           * ----------------------------------------------------
           * BACKEND CAN RETURN:
           *
           * {
           *   success: true,
           *   divisions: [...]
           * }
           *
           * OR
           *
           * {
           *   success: true,
           *   data: [...]
           * }
           *
           * OR
           *
           * [...]
           *
           * Support all three.
           * ----------------------------------------------------
           */

          let divisionData =
            [];

          if (
            Array.isArray(
              result
            )
          ) {

            divisionData =
              result;

          } else if (
            Array.isArray(
              result?.divisions
            )
          ) {

            divisionData =
              result.divisions;

          } else if (
            Array.isArray(
              result?.data
            )
          ) {

            divisionData =
              result.data;

          } else if (
            Array.isArray(
              result?.data?.divisions
            )
          ) {

            divisionData =
              result.data.divisions;

          }

          console.log(
            "TOTAL DIVISIONS:",
            divisionData.length
          );

          divisionData.forEach(
            (
              division,
              index
            ) => {

              console.log(
                `DIVISION ${
                  index + 1
                }:`,
                getDivisionName(
                  division
                )
              );

              console.log(
                "DIVISION ID:",
                getDivisionId(
                  division
                )
              );

              console.log(
                "DIVISION TABLE:",
                getDivisionTableName(
                  division
                )
              );

              console.log(
                "DIVISION BOUNDARY:",
                getDivisionBoundary(
                  division
                )
              );
            }
          );

          setDivisions(
            divisionData
          );

        } catch (
          requestError
        ) {

          console.error(
            "❌ ZONE DIVISION ERROR:",
            requestError
          );

          setDivisionError(
            requestError?.message ||
              "Unable to load divisions."
          );

          setDivisions(
            []
          );

        } finally {

          setDivisionsLoading(
            false
          );

        }
      },
      [
        cityId,
      ]
    );


  /* ==========================================================
     CITY BOUNDARY
  ========================================================== */

  const cityBoundary =
    useMemo(
      () => {

        return normalizeGeoJSON(
          city?.geoBoundary ??
            city?.geo_boundary
        );

      },
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
     ZONE OPTIONS
  ========================================================== */

  const zoneOptions =
    useMemo(
      () => {

        return [
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
        ];

      },
      [
        zones,
      ]
    );


  /* ==========================================================
     DIVISION OPTIONS
  ========================================================== */

  const divisionOptions =
    useMemo(
      () => {

        return [
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
        ];

      },
      [
        divisions,
      ]
    );


  /* ==========================================================
     VISIBLE ZONES
  ========================================================== */

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

        if (
          !selectedDivision
        ) {
          return divisions;
        }

        const selectedName =
          getDivisionName(
            selectedDivision
          );

        return divisions.filter(
          (
            division
          ) =>
            getDivisionName(
              division
            ) ===
            selectedName
        );

      },
      [
        divisions,
        selectedDivision,
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

        console.log(
          "=========================================="
        );

        console.log(
          "🎯 ZONE SELECTED"
        );

        console.log(
          "ZONE ID:",
          getZoneId(
            zone
          )
        );

        console.log(
          "ZONE NAME:",
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
          "=========================================="
        );

        /*
         * IMPORTANT:
         *
         * Update selected zone FIRST.
         *
         * This means the UI immediately records
         * the selected zone.
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
         * Then fetch divisions
         * for this exact zone.
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
     SELECT DIVISION
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

          return;
        }

        setSelectedDivision(
          option.division ||
            null
        );

      },
      []
    );


  /* ==========================================================
     MAP CENTER
  ========================================================== */

  const initialCenter =
    [
      12.9716,
      77.5946,
    ];


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
          border-radius: 20px;
          padding: 24px;
          box-sizing: border-box;
          box-shadow:
            0 4px 18px
            rgba(31,45,61,0.05);
        }

        .cm-heading {
          margin:
            0 0 18px 4px;

          font-size:
            25px;

          line-height:
            1.15;

          font-weight:
            700;

          color:
            #0F172A;

          letter-spacing:
            -0.5px;
        }

        .cm-map-shell {
          position:
            relative;

          width:
            100%;

          height:
            790px;

          overflow:
            hidden;

          border:
            1px solid #dce4ec;

          border-radius:
            22px;

          background:
            #eef1f3;
        }

        .cm-map {
          width:
            100%;

          height:
            100%;
        }

        .cm-map-header {
          position:
            absolute;

          z-index:
            1000;

          top:
            30px;

          left:
            30px;

          width:
            min(52%, 620px);

          min-height:
            92px;

          padding:
            20px 28px;

          box-sizing:
            border-box;

          background:
            rgba(
              255,
              255,
              255,
              0.96
            );

          backdrop-filter:
            blur(12px);

          border:
            1px solid
            rgba(
              216,
              225,
              235,
              0.9
            );

          border-radius:
            20px;

          box-shadow:
            0 15px 40px
            rgba(
              30,
              45,
              60,
              0.08
            );
        }

        .cm-header-left {
          display:
            flex;

          align-items:
            center;

          gap:
            18px;
        }

        .cm-header-icon {
          width:
            36px;

          height:
            36px;

          color:
            #607B99;

          flex:
            0 0 auto;
        }

        .cm-header-title {
          font-size:
            25px;

          line-height:
            1.15;

          font-weight:
            700;

          color:
            #34475B;
        }

        .cm-header-city {
          margin-top:
            7px;

          font-size:
            14px;

          font-weight:
            600;

          color:
            #8BA4BF;
        }

        .cm-filter-panel {
          position:
            absolute;

          z-index:
            1000;

          top:
            30px;

          right:
            30px;

          width:
            340px;

          padding:
            26px;

          box-sizing:
            border-box;

          background:
            rgba(
              255,
              255,
              255,
              0.97
            );

          backdrop-filter:
            blur(12px);

          border:
            1px solid
            #e0e7ef;

          border-radius:
            22px;

          box-shadow:
            0 18px 45px
            rgba(
              31,
              45,
              61,
              0.10
            );
        }

        .cm-filter-title {
          margin-bottom:
            20px;

          font-size:
            16px;

          font-weight:
            700;

          color:
            #34475B;
        }

        .cm-filter-group {
          position:
            relative;

          margin-bottom:
            20px;
        }

        .cm-filter-group:last-child {
          margin-bottom:
            0;
        }

        .cm-filter-label {
          margin-bottom:
            9px;

          font-size:
            12px;

          font-weight:
            700;

          letter-spacing:
            0.3px;

          color:
            #8CA2BC;
        }

        .cm-select {
          width:
            100%;

          height:
            58px;

          padding:
            0 17px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          border:
            1px solid
            #d4dfeb;

          border-radius:
            15px;

          background:
            #ffffff;

          color:
            #4C627D;

          font-size:
            14px;

          font-weight:
            600;

          text-align:
            left;

          cursor:
            pointer;

          transition:
            all 0.2s ease;
        }

        .cm-select:hover {
          border-color:
            #9db4cd;
        }

        .cm-select-disabled {
          cursor:
            not-allowed;

          background:
            #f8fafc;

          color:
            #a3b0bd;
        }

        .cm-select-value {
          display:
            block;

          max-width:
            270px;

          overflow:
            hidden;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;
        }

        .cm-select-placeholder {
          color:
            #536A84;
        }

        .cm-dropdown {
          position:
            absolute;

          z-index:
            3000;

          top:
            calc(
              100% + 7px
            );

          left:
            0;

          width:
            100%;

          max-height:
            300px;

          overflow-y:
            auto;

          padding:
            6px;

          box-sizing:
            border-box;

          border:
            1px solid
            #e0e7ef;

          border-radius:
            15px;

          background:
            #ffffff;

          box-shadow:
            0 15px 35px
            rgba(
              31,
              45,
              61,
              0.12
            );
        }

        .cm-dropdown-option {
          width:
            100%;

          min-height:
            43px;

          padding:
            9px 11px;

          display:
            flex;

          align-items:
            center;

          gap:
            10px;

          border:
            0;

          border-radius:
            10px;

          background:
            transparent;

          color:
            #4C627D;

          font-size:
            13px;

          font-weight:
            600;

          text-align:
            left;

          cursor:
            pointer;
        }

        .cm-dropdown-option:hover {
          background:
            #f4f7fb;
        }

        .cm-dropdown-option-active {
          background:
            #eef3f8;
          color:
            #243A52;
        }

        .cm-zone-dot {
          width:
            11px;

          height:
            11px;

          flex:
            0 0 auto;

          border-radius:
            999px;

          border:
            1px solid
            rgba(
              0,
              0,
              0,
              0.15
            );
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
            30px;

          bottom:
            30px;

          width:
            350px;

          padding:
            20px 24px;

          box-sizing:
            border-box;

          background:
            rgba(
              255,
              255,
              255,
              0.97
            );

          backdrop-filter:
            blur(12px);

          border:
            1px solid
            #e0e7ef;

          border-radius:
            20px;

          box-shadow:
            0 18px 40px
            rgba(
              31,
              45,
              61,
              0.10
            );
        }

        .cm-selected-label {
          display:
            flex;

          align-items:
            center;

          gap:
            8px;

          margin-bottom:
            10px;

          font-size:
            11px;

          font-weight:
            800;

          color:
            #7892AE;
        }

        .cm-selected-dot {
          width:
            12px;

          height:
            12px;

          border-radius:
            999px;

          border:
            1px solid
            rgba(
              0,
              0,
              0,
              0.15
            );
        }

        .cm-selected-name {
          font-size:
            17px;

          line-height:
            1.35;

          font-weight:
            700;

          color:
            #34475B;
        }

        .cm-selected-table {
          margin-top:
            7px;

          padding-bottom:
            12px;

          border-bottom:
            1px solid
            #e6edf4;

          font-size:
            11px;

          color:
            #8BA4BF;

          overflow:
            hidden;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;
        }

        .cm-division-status {
          margin-top:
            12px;

          font-size:
            11px;

          font-weight:
            600;

          color:
            #7892AE;
        }

        .cm-division-error {
          margin-top:
            12px;

          padding-top:
            12px;

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

        .cm-state {
          position:
            absolute;

          z-index:
            2000;

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
            14px 20px;

          border-radius:
            12px;

          background:
            rgba(
              255,
              255,
              255,
              0.95
            );

          border:
            1px solid
            #e0e7ef;

          box-shadow:
            0 12px 30px
            rgba(
              0,
              0,
              0,
              0.08
            );

          color:
            #536A84;

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

          .cm-filter-panel {
            width:
              300px;
          }

        }

        @media (
          max-width: 800px
        ) {

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
                100% - 32px
              );
          }

          .cm-filter-panel {
            left:
              16px;

            right:
              16px;

            top:
              145px;

            width:
              auto;
          }

          .cm-selected-card {
            left:
              16px;

            bottom:
              16px;

            width:
              calc(
                100% - 32px
              );
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
          center={
            initialCenter
          }
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

          {/* ==================================================
              BASE MAP
          ================================================== */}

          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap contributors &copy; CARTO'
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


          {/* ==================================================
              MAP SIZE
          ================================================== */}

          <MapSizeController />


          {/* ==================================================
              ZOOM CONTROL
          ================================================== */}

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
          />


          {/* ==================================================
              SELECTED ZONE FOCUS
          ================================================== */}

          <SelectedZoneFocusController
            selectedZone={
              selectedZone
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
                    `zone-layer-${getZoneName(
                      zone
                    )}-${index}`
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
              DIVISION BOUNDARIES
              
              Only rendered after a zone is selected.
          ================================================== */}

          {selectedZone &&
            divisions.length >
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
                        `division-layer-${getDivisionId(
                          division
                        )}-${index}`
                      }
                      division={
                        division
                      }
                      index={
                        index
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
            TOP HEADER
        ==================================================== */}

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
                  {
                    city.cityName
                  }
                </div>
              )}

            </div>

          </div>

        </div>


        {/* ====================================================
            FILTER PANEL
        ==================================================== */}

        <div className="cm-filter-panel">

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

              if (
                !option?.value
              ) {

                setSelectedZone(
                  null
                );

                setSelectedDivision(
                  null
                );

                setDivisions(
                  []
                );

                setDivisionError(
                  ""
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
            value=""
            placeholder={
              selectedDivision
                ? "All Wards"
                : "All Wards"
            }
            options={[
              {
                value:
                  "",
                label:
                  "All Wards",
              },
            ]}
            open={
              openDropdown ===
              "WARD"
            }
            setOpen={
              setOpenDropdown
            }
            disabled={
              true
            }
            onChange={() => {}}
          />

        </div>


        {/* ====================================================
            SELECTED ZONE CARD
        ==================================================== */}

        {selectedZone && (

          <div className="cm-selected-card">

            <div className="cm-selected-label">

              <span
                className="cm-selected-dot"
                style={{
                  backgroundColor:
                    ZONE_COLORS[
                      zones.indexOf(
                        selectedZone
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


            {getZoneTableName(
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


            {/* ==================================================
                DIVISION STATUS
            ================================================== */}

            {divisionsLoading && (

              <div className="cm-division-status">

                Loading divisions...

              </div>

            )}


            {!divisionsLoading &&
              !divisionError &&
              selectedZone && (

                <div className="cm-division-status">

                  {divisions.length}{" "}
                  division
                  {divisions.length ===
                  1
                    ? ""
                    : "s"}{" "}
                  loaded

                </div>

              )}


            {divisionError && (

              <div className="cm-division-error">

                {divisionError}

              </div>

            )}

          </div>

        )}


        {/* ====================================================
            CITY LOADING
        ==================================================== */}

        {loading && (

          <div className="cm-state">

            <div className="cm-state-card">

              Loading city boundaries...

            </div>

          </div>

        )}


        {/* ====================================================
            CITY ERROR
        ==================================================== */}

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