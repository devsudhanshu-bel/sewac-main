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


/*
 * Backend:
 *
 * GET
 * /api/master-citizen/map/city/:cityId
 */

const CITY_MAP_ENDPOINT = (cityId) =>
  `${API_BASE_URL}/api/master-citizen/map/city/${cityId}`;


/* ============================================================
   ZONE COLORS
============================================================ */

const ZONE_COLORS = [
  "#93C5FD",
  "#C4B5FD",
  "#86EFAC",
  "#FDE68A",
  "#F9A8D4",
  "#67E8F9",
  "#FDBA74",
  "#A5B4FC",
  "#BBF7D0",
  "#FCA5A5",
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


function swapCoordinatePair(
  coordinate
) {
  if (
    !isCoordinatePair(
      coordinate
    )
  ) {
    return coordinate;
  }

  return [
    coordinate[1],
    coordinate[0],
    ...coordinate.slice(2),
  ];
}


function swapCoordinatesDeep(
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
    return swapCoordinatePair(
      coordinates
    );
  }

  return coordinates.map(
    (item) =>
      swapCoordinatesDeep(
        item
      )
  );
}


/* ============================================================
   NORMALIZE GEOMETRY
============================================================ */

function normalizeGeometry(
  geometry,
  swapCoordinates = false
) {
  if (!geometry) {
    return null;
  }


  /*
   * GeometryCollection
   */

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
              (item) =>
                normalizeGeometry(
                  item,
                  swapCoordinates
                )
            )
          : [],
    };
  }


  /*
   * Normal geometry
   */

  if (
    Array.isArray(
      geometry.coordinates
    )
  ) {
    return {
      ...geometry,

      coordinates:
        swapCoordinates
          ? swapCoordinatesDeep(
              geometry.coordinates
            )
          : geometry.coordinates,
    };
  }


  return geometry;
}


/* ============================================================
   NORMALIZE GEOJSON
============================================================ */

function normalizeGeoJSON(
  value,
  swapCoordinates = false
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
              (feature) =>
                normalizeGeoJSON(
                  feature,
                  swapCoordinates
                )
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
          parsed.geometry,
          swapCoordinates
        ),
    };
  }


  /*
   * Raw geometry
   */

  if (
    [
      "Point",
      "MultiPoint",
      "LineString",
      "MultiLineString",
      "Polygon",
      "MultiPolygon",
      "GeometryCollection",
    ].includes(
      parsed.type
    )
  ) {
    return {
      type: "Feature",

      properties:
        parsed.properties ||
        {},

      geometry:
        normalizeGeometry(
          parsed,
          swapCoordinates
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
        parsed.properties ||
        {},

      geometry:
        normalizeGeometry(
          parsed.geometry,
          swapCoordinates
        ),
    };
  }


  return null;
}


/* ============================================================
   GEOJSON BOUNDS
============================================================ */

function getGeoJSONBounds(
  geoJSON
) {
  try {
    if (!geoJSON) {
      return null;
    }

    const layer =
      L.geoJSON(
        geoJSON
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
  } catch (error) {
    console.warn(
      "Unable to calculate GeoJSON bounds:",
      error
    );

    return null;
  }
}


/* ============================================================
   ZONE NAME
============================================================ */

function getZoneName(
  zone
) {
  if (
    typeof zone ===
    "string"
  ) {
    return zone;
  }

  return (
    zone?.zoneName ||
    zone?.zone_name ||
    zone?.name ||
    "Unnamed Zone"
  );
}


/* ============================================================
   ZONE BOUNDARY
============================================================ */

/*
 * IMPORTANT
 *
 * Backend zone boundaries are stored as:
 *
 * [latitude, longitude]
 *
 * Leaflet / GeoJSON expects:
 *
 * [longitude, latitude]
 *
 * Therefore:
 *
 * swapCoordinates = true
 */

function getZoneBoundary(
  zone
) {
  if (
    !zone ||
    typeof zone ===
      "string"
  ) {
    return null;
  }

  const rawBoundary =
    zone.geoBoundary ??
    zone.geo_boundary ??
    zone.geometry ??
    zone.boundary ??
    null;

  return normalizeGeoJSON(
    rawBoundary,
    true
  );
}


/* ============================================================
   ZONE TABLE
============================================================ */

function getZoneTableName(
  zone
) {
  if (
    !zone ||
    typeof zone ===
      "string"
  ) {
    return null;
  }

  return (
    zone.zoneTableName ||
    zone.zone_table_name ||
    null
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
      setTimeout(() => {
        map.invalidateSize();
      }, 100),

      setTimeout(() => {
        map.invalidateSize();
      }, 500),

      setTimeout(() => {
        map.invalidateSize();
      }, 1000),
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
   INITIAL CITY BOUNDS CONTROLLER
============================================================ */

function MapBoundsController({
  cityBoundary,
  zones,
}) {
  const map =
    useMap();


  useEffect(() => {
    /*
     * --------------------------------------------------------
     * CITY FIRST
     * --------------------------------------------------------
     */

    const cityBounds =
      getGeoJSONBounds(
        cityBoundary
      );


    if (
      cityBounds &&
      cityBounds.isValid()
    ) {
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


    /*
     * --------------------------------------------------------
     * FALLBACK TO ZONES
     * --------------------------------------------------------
     */

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
      zoneBounds.length ===
      0
    ) {
      return;
    }


    let combinedBounds =
      null;


    zoneBounds.forEach(
      (bounds) => {
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
   ⭐ NEW — SELECTED ZONE FOCUS CONTROLLER
============================================================ */

/*
 * THIS IS THE IMPORTANT PART.
 *
 * Whenever selectedZone changes:
 *
 * 1. Get the zone GeoJSON
 * 2. Calculate its bounds
 * 3. Smoothly fly the map to those bounds
 *
 * This works for:
 *
 * - Dropdown selection
 * - Clicking a zone on the map
 *
 * ============================================================
 */

function SelectedZoneFocusController({
  selectedZone,
}) {
  const map =
    useMap();


  useEffect(() => {
    /*
     * Nothing selected.
     *
     * Do not move the map.
     */

    if (
      !selectedZone
    ) {
      return;
    }


    /*
     * Get selected zone boundary.
     */

    const boundary =
      getZoneBoundary(
        selectedZone
      );


    if (!boundary) {
      console.warn(
        "SELECTED ZONE HAS NO GEOBOUNDARY:",
        selectedZone
      );

      return;
    }


    /*
     * Convert GeoJSON into Leaflet bounds.
     */

    const bounds =
      getGeoJSONBounds(
        boundary
      );


    if (
      !bounds ||
      !bounds.isValid()
    ) {
      console.warn(
        "SELECTED ZONE BOUNDS ARE INVALID:",
        selectedZone
      );

      return;
    }


    /*
     * --------------------------------------------------------
     * SMOOTH ZOOM + FOCUS
     * --------------------------------------------------------
     *
     * flyToBounds is intentionally used instead of
     * fitBounds(... animate: true).
     *
     * This produces a much smoother camera movement.
     */

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
             * More padding on the right because the
             * filter panel sits there.
             */

            paddingBottomRight: [
              360,
              70,
            ],

            maxZoom: 14,

            duration: 1.35,

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
    console.warn(
      "ZONE HAS NO VALID GEOBOUNDARY:",
      zone
    );

    return null;
  }


  const color =
    ZONE_COLORS[
      index %
        ZONE_COLORS.length
    ];


  const zoneName =
    getZoneName(
      zone
    );


  /*
   * Selected zone gets stronger
   * outline and fill.
   */

  const style = {
    color: selected
      ? "#26364A"
      : "#60748A",

    weight: selected
      ? 3.2
      : 1.8,

    opacity: selected
      ? 1
      : 0.9,

    fillColor:
      color,

    fillOpacity:
      selected
        ? 0.55
        : 0.30,

    lineJoin:
      "round",

    lineCap:
      "round",
  };


  const eventHandlers = {
    /*
     * Clicking the actual zone
     * also selects it.
     *
     * SelectedZoneFocusController
     * then performs the smooth zoom.
     */

    click: () => {
      onSelect(
        zone
      );
    },


    /*
     * Hover
     */

    mouseover: (
      event
    ) => {
      const layer =
        event.target;


      layer.setStyle({
        weight: 3,

        opacity: 1,

        fillOpacity:
          selected
            ? 0.60
            : 0.45,
      });


      if (
        layer.bringToFront
      ) {
        layer.bringToFront();
      }
    },


    /*
     * Restore style
     */

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
      key={`zone-${zoneName}-${index}`}
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
     FETCH CITY MAP DATA
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


          /*
           * ---------------------------------------------------
           * CITY
           * ---------------------------------------------------
           */

          const cityData =
            result?.city ||
            null;


          /*
           * ---------------------------------------------------
           * ZONES
           * ---------------------------------------------------
           */

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


          /*
           * Debug all zones.
           */

          zoneData.forEach(
            (
              zone,
              index
            ) => {

              console.log(
                `ZONE ${
                  index + 1
                }:`,
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
                "RAW BOUNDARY:",
                zone?.geoBoundary
              );


              console.log(
                "NORMALIZED BOUNDARY:",
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


          /*
           * Default state:
           * show all zones.
           */

          setSelectedZone(
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
      () => {

        /*
         * City coordinates are already
         * [longitude, latitude].
         *
         * Therefore:
         *
         * swapCoordinates = false
         */

        return normalizeGeoJSON(
          city?.geoBoundary ??
            city?.geo_boundary,
          false
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
     VISIBLE ZONES
  ========================================================== */

  const visibleZones =
    useMemo(
      () => {

        /*
         * ALL ZONES
         */

        if (
          !selectedZone
        ) {
          return zones;
        }


        /*
         * SELECTED ZONE
         *
         * Keep your existing behaviour:
         * only selected zone remains visible.
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
     ⭐ SELECT ZONE
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
          "ZONE:",
          getZoneName(
            zone
          )
        );

        console.log(
          "BOUNDARY:",
          getZoneBoundary(
            zone
          )
        );

        console.log(
          "=========================================="
        );


        /*
         * Setting selectedZone is enough.
         *
         * SelectedZoneFocusController listens
         * to this state and automatically performs
         * the smooth flyToBounds().
         */

        setSelectedZone(
          zone
        );

      },
      []
    );


  /* ==========================================================
     INITIAL CENTER
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

        /* ====================================================
           OUTER CARD
        ==================================================== */

        .cm-wrapper {
          width: 100%;
          background: #ffffff;
          border: 1px solid #dce4ec;
          border-radius: 18px;
          padding: 18px;
          box-sizing: border-box;
          box-shadow:
            0 4px 16px
            rgba(31,45,61,0.045);
        }


        /* ====================================================
           HEADING
        ==================================================== */

        .cm-heading {
          margin:
            0 0 14px 2px;

          font-size:
            22px;

          line-height:
            1.15;

          font-weight:
            700;

          letter-spacing:
            -0.35px;

          color:
            #07111f;
        }


        /* ====================================================
           MAP SHELL
        ==================================================== */

        .cm-map-shell {
          position:
            relative;

          width:
            100%;

          height:
            700px;

          min-height:
            560px;

          overflow:
            hidden;

          border-radius:
            16px;

          border:
            1px solid #d7e0e9;

          background:
            #f3f5f6;
        }


        .cm-map {
          width:
            100%;

          height:
            100%;
        }


        /* ====================================================
           BASE MAP
        ==================================================== */

        .cm-map
        .leaflet-tile-pane {
          filter:
            grayscale(0.35)
            saturate(0.35)
            brightness(1.06);
        }


        /* ====================================================
           ZOOM CONTROL
        ==================================================== */

        .cm-map
        .leaflet-control-zoom {
          margin-top:
            12px;

          margin-left:
            12px;

          border:
            1px solid #d8e1ea;

          border-radius:
            7px;

          overflow:
            hidden;

          box-shadow:
            0 3px 10px
            rgba(36,53,72,0.08);
        }


        .cm-map
        .leaflet-control-zoom a {
          width:
            30px;

          height:
            30px;

          line-height:
            30px;

          font-size:
            17px;

          color:
            #34475b;

          background:
            #ffffff;
        }


        .cm-map
        .leaflet-control-zoom a:hover {
          background:
            #f5f8fb;
        }


        /* ====================================================
           ATTRIBUTION
        ==================================================== */

        .cm-map
        .leaflet-control-attribution {
          font-size:
            9px;

          background:
            rgba(
              255,
              255,
              255,
              0.84
            );
        }


        /* ====================================================
           MAP HEADER
        ==================================================== */

        .cm-map-header {
          position:
            absolute;

          z-index:
            1000;

          top:
            20px;

          left:
            20px;

          width:
            420px;

          min-height:
            82px;

          padding:
            15px 18px;

          box-sizing:
            border-box;

          border-radius:
            14px;

          background:
            rgba(
              255,
              255,
              255,
              0.96
            );

          border:
            1px solid #e0e7ef;

          box-shadow:
            0 6px 20px
            rgba(
              32,
              48,
              65,
              0.09
            );

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          pointer-events:
            none;
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
            30px;

          height:
            30px;

          flex:
            0 0 30px;

          color:
            #587089;
        }


        .cm-header-title {
          font-size:
            19px;

          line-height:
            1.15;

          font-weight:
            700;

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
            #8aa0b8;
        }


        .cm-header-chevron {
          color:
            #34475b;
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
            20px;

          right:
            20px;

          width:
            320px;

          padding:
            18px;

          box-sizing:
            border-box;

          border-radius:
            16px;

          background:
            rgba(
              255,
              255,
              255,
              0.97
            );

          border:
            1px solid #e0e7ef;

          box-shadow:
            0 7px 24px
            rgba(
              32,
              48,
              65,
              0.10
            );
        }


        .cm-filter-title {
          margin-bottom:
            15px;

          font-size:
            15px;

          font-weight:
            700;

          color:
            #34475b;
        }


        .cm-filter-group {
          position:
            relative;

          margin-bottom:
            15px;
        }


        .cm-filter-group:last-child {
          margin-bottom:
            0;
        }


        .cm-filter-label {
          margin-bottom:
            7px;

          font-size:
            11px;

          font-weight:
            700;

          color:
            #8aa0b8;

          letter-spacing:
            0.2px;
        }


        .cm-select {
          width:
            100%;

          min-height:
            48px;

          padding:
            0 14px;

          border-radius:
            12px;

          border:
            1px solid #d4dfeb;

          background:
            #ffffff;

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          gap:
            10px;

          color:
            #34475b;

          font-size:
            13px;

          font-weight:
            600;

          text-align:
            left;

          cursor:
            pointer;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }


        .cm-select:hover {
          border-color:
            #a9bfd5;
        }


        .cm-select:focus {
          outline:
            none;

          border-color:
            #7d9ab8;

          box-shadow:
            0 0 0 3px
            rgba(
              96,
              165,
              250,
              0.10
            );
        }


        .cm-select-disabled {
          opacity:
            0.65;

          cursor:
            not-allowed;
        }


        .cm-select-value {
          overflow:
            hidden;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;
        }


        .cm-select-placeholder {
          color:
            #50647a;
        }


        /* ====================================================
           DROPDOWN
        ==================================================== */

        .cm-dropdown {
          position:
            absolute;

          z-index:
            1500;

          top:
            calc(100% + 6px);

          left:
            0;

          width:
            100%;

          max-height:
            295px;

          overflow-y:
            auto;

          padding:
            5px;

          box-sizing:
            border-box;

          border-radius:
            13px;

          background:
            #ffffff;

          border:
            1px solid #dce5ed;

          box-shadow:
            0 12px 30px
            rgba(
              31,
              45,
              61,
              0.13
            );
        }


        .cm-dropdown-option {
          width:
            100%;

          min-height:
            38px;

          padding:
            8px 10px;

          border:
            0;

          border-radius:
            9px;

          background:
            transparent;

          display:
            flex;

          align-items:
            center;

          gap:
            9px;

          color:
            #50647a;

          font-size:
            12px;

          font-weight:
            500;

          text-align:
            left;

          cursor:
            pointer;

          transition:
            background 0.18s ease,
            color 0.18s ease;
        }


        .cm-dropdown-option:hover {
          background:
            #f4f7fa;

          color:
            #34475b;
        }


        .cm-dropdown-option-active {
          background:
            #eef3f8;

          color:
            #24364a;

          font-weight:
            700;
        }


        .cm-zone-dot {
          width:
            9px;

          height:
            9px;

          flex:
            0 0 9px;

          border-radius:
            50%;

          border:
            1px solid
            rgba(
              52,
              71,
              91,
              0.30
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


        /* ====================================================
           SELECTED ZONE CARD
        ==================================================== */

        .cm-selected-card {
          position:
            absolute;

          z-index:
            1000;

          left:
            20px;

          bottom:
            20px;

          width:
            300px;

          padding:
            13px 15px;

          box-sizing:
            border-box;

          border-radius:
            13px;

          background:
            rgba(
              255,
              255,
              255,
              0.96
            );

          border:
            1px solid #dce5ed;

          box-shadow:
            0 7px 20px
            rgba(
              31,
              45,
              61,
              0.09
            );
        }


        .cm-selected-label {
          display:
            flex;

          align-items:
            center;

          gap:
            7px;

          margin-bottom:
            5px;

          font-size:
            10px;

          font-weight:
            700;

          color:
            #8aa0b8;

          text-transform:
            uppercase;
        }


        .cm-selected-dot {
          width:
            9px;

          height:
            9px;

          border-radius:
            50%;

          border:
            1px solid
            #647d95;
        }


        .cm-selected-name {
          font-size:
            13px;

          line-height:
            1.3;

          font-weight:
            700;

          color:
            #34475b;
        }


        .cm-selected-table {
          margin-top:
            4px;

          font-size:
            10px;

          color:
            #8ca2ba;

          overflow:
            hidden;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;
        }


        /* ====================================================
           LOADING / ERROR
        ==================================================== */

        .cm-state {
          position:
            absolute;

          z-index:
            1200;

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
            10px 15px;

          border-radius:
            10px;

          background:
            rgba(
              255,
              255,
              255,
              0.96
            );

          border:
            1px solid #dce5ed;

          box-shadow:
            0 7px 20px
            rgba(
              31,
              45,
              61,
              0.10
            );

          color:
            #50647a;

          font-size:
            12px;

          font-weight:
            600;
        }


        .cm-error-card {
          color:
            #9b3e3e;

          max-width:
            400px;

          text-align:
            center;
        }


        /* ====================================================
           RESPONSIVE
        ==================================================== */

        @media (
          max-width: 1100px
        ) {

          .cm-map-header {
            width:
              370px;
          }

          .cm-filter-card {
            width:
              285px;
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

            margin-bottom:
              12px;
          }


          .cm-map-shell {
            height:
              650px;

            min-height:
              560px;
          }


          .cm-map-header {
            top:
              12px;

            left:
              12px;

            right:
              12px;

            width:
              auto;

            min-height:
              70px;

            padding:
              12px 14px;
          }


          .cm-header-title {
            font-size:
              16px;
          }


          .cm-header-city {
            font-size:
              11px;
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
              ZOOM
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
              ⭐ SELECTED ZONE AUTO FOCUS
              
              THIS IS THE NEW CONTROLLER.
              
              Whenever selectedZone changes:
              
              -> gets zone boundary
              -> calculates bounds
              -> smooth fly/zoom
              -> focuses selected zone
          ================================================== */}

          <SelectedZoneFocusController
            selectedZone={
              selectedZone
            }
          />


          {/* ==================================================
              ZONE LAYERS
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
              CITY OUTLINE
              
              Keep city boundary above zones.
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
            TOP MAP HEADER
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
               * ----------------------------------------------
               * ALL ZONES
               * ----------------------------------------------
               */

              if (
                !option?.value
              ) {

                setSelectedZone(
                  null
                );

                /*
                 * Return to city overview smoothly.
                 */

                const cityBounds =
                  getGeoJSONBounds(
                    cityBoundary
                  );

                if (
                  cityBounds &&
                  cityBounds.isValid() &&
                  mapRef.current
                ) {
                  mapRef.current.fitBounds(
                    cityBounds,
                    {
                      padding: [
                        40,
                        40,
                      ],

                      maxZoom:
                        12,

                      animate:
                        true,

                      duration:
                        1.0,

                      easeLinearity:
                        0.2,
                    }
                  );
                }

                return;
              }


              /*
               * ----------------------------------------------
               * SELECTED ZONE
               * ----------------------------------------------
               */

              setSelectedZone(
                option.zone ||
                  null
              );

            }}

            renderOption={(
              option,
              index
            ) => {

              /*
               * ALL ZONES
               */

              if (
                !option.value
              ) {
                return (
                  <span>
                    All Zones
                  </span>
                );
              }


              /*
               * FIND COLOR
               */

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

            value=""

            placeholder="All Divisions"

            options={[
              {
                value:
                  "",
                label:
                  "All Divisions",
              },
            ]}

            open={
              openDropdown ===
              "DIVISION"
            }

            setOpen={
              setOpenDropdown
            }

            onChange={() => {}}
          />


          {/* ==================================================
              WARD
          ================================================== */}

          <FilterDropdown
            label="WARD"

            value=""

            placeholder="All Wards"

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

          </div>

        )}


        {/* ====================================================
            LOADING
        ==================================================== */}

        {loading && (

          <div className="cm-state">

            <div className="cm-state-card">
              Loading city boundaries...
            </div>

          </div>

        )}


        {/* ====================================================
            ERROR
        ==================================================== */}

        {!loading &&
          error && (

            <div className="cm-state">

              <div
                className="
                  cm-state-card
                  cm-error-card
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