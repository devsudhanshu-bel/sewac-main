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

/*
 * Render backend.
 *
 * If VITE_API_BASE_URL exists, it will be used.
 *
 * Otherwise:
 *
 * https://sewac-main.onrender.com
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://sewac-main.onrender.com";


const DEFAULT_CITY_ID = 1;


/*
 * Backend endpoint:
 *
 * GET
 * /api/master-citizen/map/city/:cityId
 *
 * Example:
 *
 * https://sewac-main.onrender.com
 * /api/master-citizen/map/city/1
 */

const CITY_MAP_ENDPOINT = (cityId) =>
  `${API_BASE_URL}/api/master-citizen/map/city/${cityId}`;


/* ============================================================
   ZONE COLORS
============================================================ */

/*
 * Each zone gets one stable color based on its index.
 *
 * These are intentionally soft because the map itself is
 * light/grey.
 */

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
   HELPERS
============================================================ */


/*
 * ------------------------------------------------------------
 * PARSE JSON
 * ------------------------------------------------------------
 */

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


/*
 * ------------------------------------------------------------
 * DETECT COORDINATE PAIR
 * ------------------------------------------------------------
 *
 * A coordinate pair is:
 *
 * [number, number]
 *
 * Example:
 *
 * [77.5946, 12.9716]
 *
 * or:
 *
 * [12.9716, 77.5946]
 *
 * ------------------------------------------------------------
 */

function isCoordinatePair(value) {
  return (
    Array.isArray(value) &&
    value.length >= 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number"
  );
}


/*
 * ------------------------------------------------------------
 * SWAP LAT/LNG
 * ------------------------------------------------------------
 *
 * IMPORTANT:
 *
 * Your zone tables currently return coordinates as:
 *
 * [LATITUDE, LONGITUDE]
 *
 * Example:
 *
 * [13.0389658, 77.6437683]
 *
 * Leaflet/GeoJSON expects:
 *
 * [LONGITUDE, LATITUDE]
 *
 * Therefore:
 *
 * [13.0389658, 77.6437683]
 *
 * becomes:
 *
 * [77.6437683, 13.0389658]
 *
 * ------------------------------------------------------------
 */

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


/*
 * ------------------------------------------------------------
 * RECURSIVELY SWAP COORDINATES
 * ------------------------------------------------------------
 *
 * Handles:
 *
 * Polygon
 * MultiPolygon
 * LineString
 * MultiLineString
 *
 * and arbitrary nested coordinate arrays.
 *
 * ------------------------------------------------------------
 */

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


/*
 * ------------------------------------------------------------
 * NORMALIZE GEOJSON
 * ------------------------------------------------------------
 *
 * Converts:
 *
 * Polygon
 * MultiPolygon
 * Feature
 * FeatureCollection
 * GeometryCollection
 *
 * into something Leaflet can directly consume.
 *
 * ------------------------------------------------------------
 */

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
   * ----------------------------------------------------------
   * FEATURE COLLECTION
   * ----------------------------------------------------------
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
   * ----------------------------------------------------------
   * FEATURE
   * ----------------------------------------------------------
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
   * ----------------------------------------------------------
   * RAW GEOMETRY
   * ----------------------------------------------------------
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
   * ----------------------------------------------------------
   * OBJECT WITH GEOMETRY
   * ----------------------------------------------------------
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


/*
 * ------------------------------------------------------------
 * NORMALIZE GEOMETRY
 * ------------------------------------------------------------
 */

function normalizeGeometry(
  geometry,
  swapCoordinates
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
   * Normal geometry with coordinates
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


/*
 * ------------------------------------------------------------
 * GEOJSON BOUNDS
 * ------------------------------------------------------------
 */

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


/*
 * ------------------------------------------------------------
 * ZONE NAME
 * ------------------------------------------------------------
 */

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


/*
 * ------------------------------------------------------------
 * ZONE BOUNDARY
 * ------------------------------------------------------------
 *
 * IMPORTANT:
 *
 * The backend zone coordinates are currently:
 *
 * [latitude, longitude]
 *
 * Therefore swapCoordinates = true.
 *
 * ------------------------------------------------------------
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


/*
 * ------------------------------------------------------------
 * ZONE TABLE
 * ------------------------------------------------------------
 */

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
    /*
     * The map is inside a dashboard card.
     *
     * Force Leaflet to recalculate dimensions.
     */

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
   MAP BOUNDS CONTROLLER
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
     * FIRST PRIORITY:
     * CITY BOUNDARY
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
     * FALLBACK:
     * ALL ZONES
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
   ZONE LAYER
============================================================ */

function ZoneLayer({
  zone,
  index,
  selected,
  onSelect,
}) {
  /*
   * IMPORTANT:
   *
   * This function now converts:
   *
   * [LAT, LNG]
   *
   * into:
   *
   * [LNG, LAT]
   *
   * before passing it to Leaflet.
   */

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
   * ----------------------------------------------------------
   * DEFAULT STYLE
   * ----------------------------------------------------------
   */

  const defaultStyle = {
    color: selected
      ? "#26364A"
      : "#53687D",

    weight: selected
      ? 3.5
      : 2,

    opacity: 1,

    fillColor:
      color,

    fillOpacity: selected
      ? 0.58
      : 0.34,

    lineJoin:
      "round",

    lineCap:
      "round",

    interactive: true,
  };


  /*
   * ----------------------------------------------------------
   * EVENTS
   * ----------------------------------------------------------
   */

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
        color:
          "#26364A",

        weight: 3.5,

        opacity: 1,

        fillColor:
          color,

        fillOpacity:
          0.62,
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
        defaultStyle
      );


      /*
       * Keep city boundary above
       * the zone.
       */

      if (
        layer.bringToFront
      ) {
        layer.bringToFront();
      }
    },
  };


  return (
    <GeoJSON
      key={`zone-${zoneName}-${index}`}
      data={
        boundary
      }
      style={() =>
        defaultStyle
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
        color: "#34475B",

        weight: 3.8,

        opacity: 1,

        fillColor:
          "transparent",

        fillOpacity: 0,

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
  ] = useState("");


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
    useRef(null);


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
           * Print every zone and whether
           * it contains a boundary.
           */

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
           * Start with all zones visible.
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
      [cityId]
    );


  useEffect(() => {
    fetchCityMapData();
  }, [
    fetchCityMapData,
  ]);


  /* ==========================================================
     NORMALIZED CITY BOUNDARY
  ========================================================== */

  /*
   * IMPORTANT:
   *
   * City GeoJSON is already:
   *
   * [longitude, latitude]
   *
   * Therefore:
   *
   * swapCoordinates = false
   */

  const cityBoundary =
    useMemo(
      () => {
        return normalizeGeoJSON(
          city?.geoBoundary ??
            city?.geo_boundary,
          false
        );
      },
      [city]
    );


  /* ==========================================================
     SELECTED ZONE
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
        ];
      },
      [zones]
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
         * SELECTED ZONE ONLY
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
     SELECT ZONE
  ========================================================== */

  const handleZoneSelect =
    useCallback(
      (
        zone
      ) => {

        setSelectedZone(
          zone
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
          box-shadow: 0 4px 16px rgba(31,45,61,0.045);
        }


        /* ====================================================
           PAGE HEADING
        ==================================================== */

        .cm-heading {
          margin: 0 0 14px 2px;
          font-size: 22px;
          line-height: 1.15;
          font-weight: 700;
          letter-spacing: -0.35px;
          color: #07111f;
        }


        /* ====================================================
           MAP SHELL
        ==================================================== */

        .cm-map-shell {
          position: relative;
          width: 100%;
          height: 700px;
          min-height: 560px;
          overflow: hidden;
          border-radius: 16px;
          border: 1px solid #d7e0e9;
          background: #f3f5f6;
        }


        .cm-map {
          width: 100%;
          height: 100%;
        }


        /* ====================================================
           GREY CARTO MAP
        ==================================================== */

        .cm-map .leaflet-tile-pane {
          filter:
            grayscale(0.35)
            saturate(0.35)
            brightness(1.06);
        }


        /* ====================================================
           ZOOM
        ==================================================== */

        .cm-map .leaflet-control-zoom {
          margin-top: 12px;
          margin-left: 12px;
          border: 1px solid #d8e1ea;
          border-radius: 7px;
          overflow: hidden;
          box-shadow:
            0 3px 10px rgba(36,53,72,0.08);
        }


        .cm-map .leaflet-control-zoom a {
          width: 30px;
          height: 30px;
          line-height: 30px;
          font-size: 17px;
          color: #34475b;
          background: #ffffff;
        }


        .cm-map .leaflet-control-zoom a:hover {
          background: #f5f8fb;
        }


        /* ====================================================
           ATTRIBUTION
        ==================================================== */

        .cm-map .leaflet-control-attribution {
          font-size: 9px;
          background:
            rgba(255,255,255,0.84);
        }


        /* ====================================================
           MAP HEADER
        ==================================================== */

        .cm-map-header {
          position: absolute;
          z-index: 1000;

          top: 20px;
          left: 20px;

          width: 420px;
          min-height: 82px;

          padding: 15px 18px;

          box-sizing: border-box;

          border-radius: 14px;

          background:
            rgba(255,255,255,0.96);

          border:
            1px solid #e0e7ef;

          box-shadow:
            0 6px 20px
            rgba(32,48,65,0.09);

          display: flex;
          align-items: center;
          justify-content: space-between;

          pointer-events: none;
        }


        .cm-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }


        .cm-header-icon {
          width: 30px;
          height: 30px;
          flex: 0 0 30px;
          color: #587089;
        }


        .cm-header-title {
          font-size: 19px;
          line-height: 1.15;
          font-weight: 700;
          color: #34475b;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }


        .cm-header-city {
          margin-top: 4px;
          font-size: 12px;
          font-weight: 600;
          color: #8aa0b8;
        }


        .cm-header-chevron {
          color: #34475b;
          flex: 0 0 auto;
        }


        /* ====================================================
           FILTER CARD
        ==================================================== */

        .cm-filter-card {
          position: absolute;
          z-index: 1000;

          top: 20px;
          right: 20px;

          width: 310px;

          padding: 17px;

          box-sizing: border-box;

          border-radius: 14px;

          background:
            rgba(255,255,255,0.97);

          border:
            1px solid #dfe7ef;

          box-shadow:
            0 7px 22px
            rgba(32,48,65,0.09);
        }


        .cm-filter-title {
          margin-bottom: 15px;

          font-size: 15px;
          font-weight: 700;

          color: #34475b;
        }


        .cm-filter-group {
          position: relative;
          margin-bottom: 14px;
        }


        .cm-filter-group:last-child {
          margin-bottom: 0;
        }


        .cm-filter-label {
          margin-bottom: 6px;

          font-size: 11px;
          line-height: 1;

          font-weight: 700;

          color: #8ca2ba;

          letter-spacing: 0.1px;

          text-transform: uppercase;
        }


        /* ====================================================
           SELECT
        ==================================================== */

        .cm-select {
          width: 100%;
          min-height: 48px;

          padding:
            0 12px;

          box-sizing: border-box;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 10px;

          border:
            1px solid #cbd9e7;

          border-radius: 11px;

          background: #ffffff;

          color: #40546b;

          font-family: inherit;

          font-size: 13px;

          font-weight: 600;

          cursor: pointer;

          transition:
            border-color 0.15s ease,
            box-shadow 0.15s ease;
        }


        .cm-select:hover {
          border-color: #aebfd0;
        }


        .cm-select:focus {
          outline: none;

          border-color: #8fa9c1;

          box-shadow:
            0 0 0 3px
            rgba(100,130,160,0.09);
        }


        .cm-select-disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }


        .cm-select-value,
        .cm-select-placeholder {
          min-width: 0;

          overflow: hidden;

          white-space: nowrap;

          text-overflow: ellipsis;

          text-align: left;
        }


        .cm-select-placeholder {
          color: #40546b;
        }


        /* ====================================================
           DROPDOWN
        ==================================================== */

        .cm-dropdown {
          position: absolute;

          z-index: 1100;

          top:
            calc(100% + 6px);

          left: 0;
          right: 0;

          max-height: 260px;

          overflow-y: auto;

          padding: 4px;

          border:
            1px solid #d9e3ec;

          border-radius: 11px;

          background: #ffffff;

          box-shadow:
            0 12px 26px
            rgba(31,45,61,0.13);
        }


        .cm-dropdown-option {
          width: 100%;

          min-height: 38px;

          padding:
            7px 8px;

          border: 0;

          border-radius: 8px;

          background: transparent;

          display: flex;

          align-items: center;

          gap: 9px;

          text-align: left;

          font-family: inherit;

          font-size: 12px;

          line-height: 1.3;

          font-weight: 500;

          color: #435871;

          cursor: pointer;
        }


        .cm-dropdown-option:hover {
          background: #f2f6fa;
        }


        .cm-dropdown-option-active {
          background: #edf4f9;
          color: #263f58;
          font-weight: 700;
        }


        /* ====================================================
           ZONE DOT
        ==================================================== */

        .cm-zone-dot {
          width: 9px;
          height: 9px;

          flex:
            0 0 9px;

          border-radius: 50%;

          border:
            1px solid
            rgba(44,63,82,0.35);
        }


        .cm-zone-option-name {
          min-width: 0;

          overflow: hidden;

          white-space: nowrap;

          text-overflow: ellipsis;
        }


        /* ====================================================
           SELECTED ZONE CARD
        ==================================================== */

        .cm-selected-card {
          position: absolute;

          z-index: 1000;

          left: 20px;
          bottom: 20px;

          width: 300px;

          padding:
            13px 15px;

          box-sizing: border-box;

          border-radius: 13px;

          background:
            rgba(255,255,255,0.96);

          border:
            1px solid #dce5ed;

          box-shadow:
            0 7px 20px
            rgba(31,45,61,0.09);
        }


        .cm-selected-label {
          display: flex;

          align-items: center;

          gap: 7px;

          margin-bottom: 5px;

          font-size: 10px;

          font-weight: 700;

          color: #8aa0b8;

          text-transform: uppercase;
        }


        .cm-selected-dot {
          width: 9px;
          height: 9px;

          border-radius: 50%;

          border:
            1px solid #647d95;
        }


        .cm-selected-name {
          font-size: 13px;

          line-height: 1.3;

          font-weight: 700;

          color: #34475b;
        }


        .cm-selected-table {
          margin-top: 4px;

          font-size: 10px;

          color: #8ca2ba;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;
        }


        /* ====================================================
           LOADING / ERROR
        ==================================================== */

        .cm-state {
          position: absolute;

          z-index: 1200;

          inset: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          pointer-events: none;
        }


        .cm-state-card {
          padding:
            10px 15px;

          border-radius: 10px;

          background:
            rgba(255,255,255,0.96);

          border:
            1px solid #dce5ed;

          box-shadow:
            0 7px 20px
            rgba(31,45,61,0.10);

          color: #50647a;

          font-size: 12px;

          font-weight: 600;
        }


        .cm-error-card {
          color: #9b3e3e;

          max-width: 400px;

          text-align: center;
        }


        /* ====================================================
           RESPONSIVE
        ==================================================== */

        @media (max-width: 1100px) {

          .cm-map-header {
            width: 370px;
          }

          .cm-filter-card {
            width: 285px;
          }

        }


        @media (max-width: 800px) {

          .cm-wrapper {
            padding: 12px;
            border-radius: 14px;
          }


          .cm-heading {
            font-size: 19px;
            margin-bottom: 12px;
          }


          .cm-map-shell {
            height: 650px;
            min-height: 560px;
          }


          .cm-map-header {
            top: 12px;
            left: 12px;
            right: 12px;

            width: auto;

            min-height: 70px;

            padding:
              12px 14px;
          }


          .cm-header-title {
            font-size: 16px;
          }


          .cm-header-city {
            font-size: 11px;
          }


          .cm-filter-card {
            top: auto;

            right: 12px;
            left: 12px;
            bottom: 12px;

            width: auto;

            max-height: 300px;

            overflow-y: auto;
          }


          .cm-selected-card {
            display: none;
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
          ref={mapRef}
          center={
            initialCenter
          }
          zoom={10}
          zoomControl={
            false
          }
          className="cm-map"
          preferCanvas={
            false
          }
        >

          {/* ==================================================
              GREY BASE MAP
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
            maxZoom={20}
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
              FIT CITY
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
              ZONE LAYER
              
              IMPORTANT:
              
              ZONE DATA IS NORMALIZED FROM:
              
              [LAT,LNG]
              
              TO:
              
              [LNG,LAT]
              
              INSIDE ZoneLayer.
          ================================================== */}

          <Pane
            name="zonePane"
            style={{
              zIndex: 410,
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
              
              Rendered AFTER the zones and in a higher pane.
              
              This keeps the Bengaluru city boundary visible
              around all coloured zones.
          ================================================== */}

          <Pane
            name="cityBoundaryPane"
            style={{
              zIndex: 420,
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


          <ChevronDown
            className="cm-header-chevron"
            size={18}
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
               * ALL ZONES
               */

              if (
                !option?.value
              ) {

                setSelectedZone(
                  null
                );

                return;
              }


              /*
               * INDIVIDUAL ZONE
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
               * FIND ZONE INDEX
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
                value: "",
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
                value: "",
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
            SELECTED ZONE INFORMATION
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

              <div className="cm-state-card cm-error-card">

                {error}

              </div>

            </div>

          )}

      </div>

    </section>
  );
}