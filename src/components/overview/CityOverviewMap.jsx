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
  Loader2,
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
   CITY ENDPOINT
============================================================ */

const CITY_MAP_ENDPOINT = (cityId) =>
  `${API_BASE_URL}/api/master-citizen/map/city/${cityId}`;


/* ============================================================
   ⭐ NEW — ZONE → DIVISIONS ENDPOINT
============================================================ */

const ZONE_DIVISIONS_ENDPOINT = (
  zoneTableName
) =>
  `${API_BASE_URL}/api/master-citizen/map/zone/${encodeURIComponent(
    zoneTableName
  )}`;


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
   JSON HELPERS
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

    } catch (
      error
    ) {

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


  if (
    parsed.type ===
    "FeatureCollection"
  ) {
    return parsed;
  }


  if (
    parsed.type ===
    "Feature"
  ) {
    return parsed;
  }


  if (
    [
      "Polygon",
      "MultiPolygon",
      "LineString",
      "MultiLineString",
      "Point",
      "MultiPoint",
      "GeometryCollection",
    ].includes(
      parsed.type
    )
  ) {

    return {

      type:
        "Feature",

      properties:
        {},

      geometry:
        parsed,

    };
  }


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
        parsed.geometry,

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

    const normalized =
      normalizeGeoJSON(
        geoJSON
      );


    if (!normalized) {
      return null;
    }


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

  } catch (
    error
  ) {

    console.warn(
      "Unable to calculate bounds:",
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
   ZONE BOUNDARY
============================================================ */

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


  return normalizeGeoJSON(
    zone.geoBoundary ??
      zone.geo_boundary ??
      zone.geometry ??
      zone.boundary
  );
}


/* ============================================================
   DIVISION NAME
============================================================ */

function getDivisionName(
  division
) {

  if (
    typeof division ===
    "string"
  ) {
    return division;
  }


  return (
    division?.divisionName ||
    division?.division_name ||
    division?.name ||
    "Unnamed Division"
  );
}


/* ============================================================
   DIVISION TABLE
============================================================ */

function getDivisionTableName(
  division
) {

  if (
    !division ||
    typeof division ===
      "string"
  ) {
    return null;
  }


  return (
    division.divisionTableName ||
    division.division_table_name ||
    null
  );
}


/* ============================================================
   DIVISION BOUNDARY
============================================================ */

function getDivisionBoundary(
  division
) {

  if (
    !division ||
    typeof division ===
      "string"
  ) {
    return null;
  }


  return normalizeGeoJSON(
    division.geoBoundary ??
      division.geo_boundary ??
      division.geometry ??
      division.boundary
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
   INITIAL MAP FIT
============================================================ */

function MapBoundsController({
  cityBoundary,
  zones,
}) {

  const map =
    useMap();


  useEffect(
    () => {

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

            maxZoom:
              12,

            animate:
              false,

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
        zoneBounds.length ===
        0
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

        map.fitBounds(
          combinedBounds,
          {

            padding: [
              40,
              40,
            ],

            maxZoom:
              12,

            animate:
              false,

          }
        );
      }

    },
    [
      cityBoundary,
      zones,
      map,
    ]
  );


  return null;
}


/* ============================================================
   ⭐ SELECTED ZONE FOCUS
============================================================ */

function SelectedZoneFocusController({
  selectedZone,
}) {

  const map =
    useMap();


  useEffect(
    () => {

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

              paddingBottomRight: [
                360,
                70,
              ],

              maxZoom:
                14,

              duration:
                1.35,

              easeLinearity:
                0.18,

              animate:
                true,

            }
          );

        }
      );

    },
    [
      selectedZone,
      map,
    ]
  );


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
      [
        zone,
      ]
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
            ? "#26364A"
            : "#526579",

        weight:
          selected
            ? 3.4
            : 1.8,

        opacity:
          selected
            ? 1
            : 0.95,

        fillColor:
          color,

        fillOpacity:
          selected
            ? 0.55
            : 0.34,

        lineJoin:
          "round",

        lineCap:
          "round",

      })}

      eventHandlers={{

        click: () => {

          onSelect(
            zone
          );

        },

        mouseover: (
          event
        ) => {

          if (
            selected
          ) {
            return;
          }


          event.target.setStyle({

            weight:
              2.6,

            fillOpacity:
              0.46,

          });
        },

        mouseout: (
          event
        ) => {

          if (
            selected
          ) {
            return;
          }


          event.target.setStyle({

            weight:
              1.8,

            fillOpacity:
              0.34,

          });
        },

      }}

    />
  );
}


/* ============================================================
   ⭐ DIVISION LAYER
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
      [
        division,
      ]
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
          "#334155",

        weight:
          1.4,

        opacity:
          0.95,

        fillColor:
          color,

        fillOpacity:
          0.16,

        lineJoin:
          "round",

        lineCap:
          "round",

        dashArray:
          "4 3",

      })}

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
        {
          label
        }
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


  /* ==========================================================
     ⭐ DIVISION STATE
  ========================================================== */

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
    divisionLoading,
    setDivisionLoading,
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
    openDropdown,
    setOpenDropdown,
  ] = useState(
    null
  );


  const mapRef =
    useRef(null);


  /* ==========================================================
     FETCH CITY
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
            "🗺️ CITY MAP RESPONSE:",
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
     ⭐ FETCH DIVISIONS FOR SELECTED ZONE
  ========================================================== */

  const fetchZoneDivisions =
    useCallback(
      async (
        zone
      ) => {

        const zoneTableName =
          getZoneTableName(
            zone
          );


        if (
          !zoneTableName
        ) {

          console.error(
            "❌ SELECTED ZONE DOES NOT HAVE zoneTableName:",
            zone
          );

          setDivisions(
            []
          );

          setDivisionError(
            "Selected zone does not contain a zone table name."
          );

          return;
        }


        try {

          setDivisionLoading(
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


          const endpoint =
            ZONE_DIVISIONS_ENDPOINT(
              zoneTableName
            );


          console.log(
            "=========================================="
          );

          console.log(
            "📍 ZONE SELECTED"
          );

          console.log(
            "ZONE NAME:",
            getZoneName(
              zone
            )
          );

          console.log(
            "ZONE TABLE:",
            zoneTableName
          );

          console.log(
            "DIVISION ENDPOINT:",
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
              `Zone division request failed with status ${response.status}`
            );
          }


          const result =
            await response.json();


          console.log(
            "📦 ZONE DIVISION RESPONSE:",
            result
          );


          if (
            result?.success ===
            false
          ) {

            throw new Error(
              result.message ||
                "Unable to fetch divisions."
            );
          }


          /*
           * Support both:
           *
           * result.divisions
           *
           * and:
           *
           * result.zone.divisions
           */

          const divisionData =
            Array.isArray(
              result?.divisions
            )
              ? result.divisions
              : Array.isArray(
                  result?.zone?.divisions
                )
                ? result.zone.divisions
                : [];


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

          setDivisionLoading(
            false
          );
        }

      },
      []
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
     SELECTED DIVISION NAME
  ========================================================== */

  const selectedDivisionName =
    selectedDivision
      ? getDivisionName(
          selectedDivision
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
     ⭐ VISIBLE DIVISIONS
  ========================================================== */

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
            getDivisionName(
              division
            ) ===
            selectedDivisionName
        );

      },
      [
        selectedZone,
        selectedDivision,
        selectedDivisionName,
        divisions,
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

        /*
         * ------------------------------------------------------
         * STEP 1
         *
         * Immediately record the selected zone.
         * ------------------------------------------------------
         */

        setSelectedZone(
          zone
        );


        /*
         * ------------------------------------------------------
         * STEP 2
         *
         * Reset previous division state immediately.
         * ------------------------------------------------------
         */

        setSelectedDivision(
          null
        );


        setDivisions(
          []
        );


        /*
         * ------------------------------------------------------
         * STEP 3
         *
         * Immediately trigger the backend request.
         * ------------------------------------------------------
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

        .cm-wrapper {
          width: 100%;
          background: #ffffff;
          border: 1px solid #dce4ec;
          border-radius: 20px;
          padding: 24px;
          box-sizing: border-box;
          box-shadow: 0 4px 18px rgba(31,45,61,0.05);
        }

        .cm-heading {
          margin: 0 0 18px 4px;
          font-size: 25px;
          line-height: 1.15;
          font-weight: 700;
          letter-spacing: -0.5px;
          color: #07111f;
        }

        .cm-map-shell {
          position: relative;
          width: 100%;
          height: 780px;
          min-height: 620px;
          overflow: hidden;
          border-radius: 18px;
          border: 1px solid #d7e0e9;
          background: #f3f5f6;
        }

        .cm-map {
          width: 100%;
          height: 100%;
        }

        .cm-map .leaflet-tile-pane {
          filter: saturate(0.45) brightness(1.04);
        }

        .cm-map .leaflet-control-zoom {
          margin-top: 14px;
          margin-left: 14px;
          border: 1px solid #d8e1ea;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 3px 12px rgba(36,53,72,0.08);
        }

        .cm-map .leaflet-control-zoom a {
          width: 32px;
          height: 32px;
          line-height: 32px;
          font-size: 18px;
          color: #34475b;
          background: #ffffff;
        }

        .cm-map .leaflet-control-attribution {
          font-size: 10px;
          background: rgba(255,255,255,0.82);
        }

        .cm-map-header {
          position: absolute;
          z-index: 1000;
          top: 28px;
          left: 28px;
          width: min(520px, calc(100% - 650px));
          min-width: 400px;
          padding: 22px 28px;
          box-sizing: border-box;
          border-radius: 20px;
          background: rgba(255,255,255,0.95);
          border: 1px solid #e5ebf1;
          box-shadow: 0 12px 35px rgba(30,50,70,0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          backdrop-filter: blur(10px);
        }

        .cm-header-left {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .cm-header-icon {
          width: 34px;
          height: 34px;
          color: #607b97;
        }

        .cm-header-title {
          font-size: 24px;
          line-height: 1.1;
          font-weight: 700;
          color: #34475b;
        }

        .cm-header-city {
          margin-top: 7px;
          font-size: 13px;
          font-weight: 600;
          color: #8ba0b7;
        }

        .cm-header-chevron {
          color: #526579;
        }

        .cm-filter-card {
          position: absolute;
          z-index: 1000;
          top: 28px;
          right: 28px;
          width: 330px;
          padding: 24px;
          box-sizing: border-box;
          border-radius: 20px;
          background: rgba(255,255,255,0.96);
          border: 1px solid #e5ebf1;
          box-shadow: 0 15px 40px rgba(30,50,70,0.10);
          backdrop-filter: blur(10px);
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
          font-size: 12px;
          font-weight: 700;
          color: #8ba0b7;
          letter-spacing: 0.3px;
        }

        .cm-select {
          width: 100%;
          height: 58px;
          padding: 0 16px;
          box-sizing: border-box;
          border-radius: 14px;
          border: 1px solid #cfdce8;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #4d6279;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .cm-select:hover {
          border-color: #8aa8c4;
        }

        .cm-select-disabled {
          opacity: 0.55;
          cursor: not-allowed;
          background: #f8fafc;
        }

        .cm-select-value {
          max-width: 250px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .cm-select-placeholder {
          color: #4d6279;
        }

        .cm-dropdown {
          position: absolute;
          z-index: 2000;
          top: calc(100% + 7px);
          left: 0;
          width: 100%;
          max-height: 300px;
          overflow-y: auto;
          padding: 6px;
          box-sizing: border-box;
          border-radius: 14px;
          border: 1px solid #e2e9f0;
          background: #ffffff;
          box-shadow: 0 15px 40px rgba(15,23,42,0.14);
        }

        .cm-dropdown-option {
          width: 100%;
          min-height: 46px;
          padding: 9px 12px;
          border: 0;
          border-radius: 10px;
          background: transparent;
          display: flex;
          align-items: center;
          gap: 10px;
          text-align: left;
          color: #4d6279;
          font-size: 13px;
          cursor: pointer;
        }

        .cm-dropdown-option:hover {
          background: #f4f7fb;
        }

        .cm-dropdown-option-active {
          background: #edf3f9;
          color: #274c70;
          font-weight: 700;
        }

        .cm-zone-dot,
        .cm-division-dot {
          width: 10px;
          height: 10px;
          min-width: 10px;
          border-radius: 50%;
          border: 1px solid rgba(50,70,90,0.35);
        }

        .cm-zone-option-name,
        .cm-division-option-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .cm-selected-card {
          position: absolute;
          z-index: 1000;
          left: 28px;
          bottom: 28px;
          width: 350px;
          padding: 20px;
          box-sizing: border-box;
          border-radius: 18px;
          background: rgba(255,255,255,0.96);
          border: 1px solid #e5ebf1;
          box-shadow: 0 12px 35px rgba(30,50,70,0.10);
          backdrop-filter: blur(10px);
        }

        .cm-selected-label {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 11px;
          font-weight: 700;
          color: #8ba0b7;
        }

        .cm-selected-dot {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          border: 1px solid rgba(50,70,90,0.3);
        }

        .cm-selected-name {
          margin-top: 10px;
          font-size: 16px;
          font-weight: 700;
          color: #34475b;
        }

        .cm-selected-table {
          margin-top: 7px;
          font-size: 11px;
          color: #8ba0b7;
          word-break: break-all;
        }

        .cm-division-info {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #edf1f5;
          font-size: 12px;
          color: #64788e;
        }

        .cm-loading-divisions {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
          font-size: 11px;
          color: #71869b;
        }

        .cm-state {
          position: absolute;
          z-index: 3000;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.45);
          backdrop-filter: blur(2px);
        }

        .cm-state-card {
          padding: 18px 22px;
          border-radius: 14px;
          background: #ffffff;
          box-shadow: 0 15px 40px rgba(15,23,42,0.12);
          font-size: 13px;
          font-weight: 600;
          color: #475569;
        }

        .cm-error {
          position: absolute;
          z-index: 3500;
          left: 28px;
          top: 28px;
          padding: 12px 16px;
          border-radius: 12px;
          background: #fff1f2;
          border: 1px solid #fecdd3;
          color: #be123c;
          font-size: 12px;
          font-weight: 600;
        }

        @media (max-width: 1100px) {

          .cm-map-header {
            width: 48%;
            min-width: 320px;
          }

          .cm-filter-card {
            width: 290px;
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


          {/* ==================================================
              DIVISION BOUNDARIES
          ================================================== */}

          <Pane
            name="divisionPane"
            style={{
              zIndex:
                405,
            }}
          >

            {visibleDivisions.map(
              (
                division,
                index
              ) => (

                <DivisionLayer
                  key={
                    `division-${getDivisionName(
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


          {/* ==================================================
              ZONE BOUNDARIES
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
                  zones.indexOf(
                    zone
                  );


                return (

                  <ZoneLayer
                    key={
                      `zone-${getZoneName(
                        zone
                      )}-${zoneIndex}`
                    }

                    zone={
                      zone
                    }

                    index={
                      zoneIndex
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

                );
              }
            )}

          </Pane>


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
            HEADER
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
            FILTERS
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

              if (
                !option?.value
              ) {

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

                return;
              }


              /*
               * IMPORTANT:
               *
               * This immediately:
               *
               * 1. Records selected zone
               * 2. Gets zoneTableName
               * 3. Calls backend
               * 4. Loads divisions
               */

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
              selectedDivisionName ||
              ""
            }

            placeholder={
              divisionLoading
                ? "Loading divisions..."
                : selectedZone
                  ? "All Divisions"
                  : "Select Zone First"
            }

            options={
              selectedZone
                ? divisionOptions
                : [
                    {
                      value:
                        "",
                      label:
                        "Select Zone First",
                    },
                  ]
            }

            disabled={
              !selectedZone ||
              divisionLoading
            }

            open={
              openDropdown ===
              "DIVISION"
            }

            setOpen={
              setOpenDropdown
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


              const divisionIndex =
                divisions.findIndex(
                  (
                    division
                  ) =>
                    getDivisionName(
                      division
                    ) ===
                    option.value
                );


              const color =
                DIVISION_COLORS[
                  (
                    divisionIndex >=
                    0
                      ? divisionIndex
                      : index
                  ) %
                    DIVISION_COLORS.length
                ];


              return (
                <>

                  <span
                    className="cm-division-dot"

                    style={{
                      backgroundColor:
                        color,
                    }}
                  />

                  <span className="cm-division-option-name">
                    {
                      option.label
                    }
                  </span>

                </>
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

            disabled={
              !selectedDivision
            }

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


            {/* ==================================================
                DIVISION STATUS
            ================================================== */}

            {divisionLoading && (

              <div className="cm-loading-divisions">

                <Loader2
                  size={
                    13
                  }

                  className="animate-spin"
                />

                Loading divisions...

              </div>

            )}


            {!divisionLoading &&
              !divisionError &&
              selectedZone && (

                <div className="cm-division-info">

                  {

                    divisions.length ===
                    0

                      ? "No divisions found."

                      : `${divisions.length} division${
                          divisions.length ===
                          1
                            ? ""
                            : "s"
                        } loaded`

                  }

                </div>

              )}


            {divisionError && (

              <div
                className="cm-division-info"
                style={{
                  color:
                    "#be123c",
                }}
              >

                {
                  divisionError
                }

              </div>

            )}

          </div>

        )}


        {/* ====================================================
            INITIAL LOADING
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

        {error && (

          <div className="cm-error">

            {
              error
            }

          </div>

        )}

      </div>

    </section>
  );
}