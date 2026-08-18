import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Map, {
  Layer,
  Popup,
  Source,
} from "react-map-gl/maplibre";

import {
  Plus,
  Minus,
  RefreshCw,
  MapPin,
  Truck,
} from "lucide-react";

import { gsap } from "gsap";

import "maplibre-gl/dist/maplibre-gl.css";


/* ==========================================================
   API CONFIG
========================================================== */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";


/* ==========================================================
   DEFAULT MAP VIEW
========================================================== */

const DEFAULT_VIEW_STATE = {
  longitude: 77.5946,
  latitude: 12.9716,
  zoom: 11,
};


/* ==========================================================
   GREY MAP STYLE
========================================================== */

const GREY_MAP_STYLE = {
  version: 8,

  sources: {
    osm: {
      type: "raster",

      tiles: [
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      ],

      tileSize: 256,

      attribution:
        "© OpenStreetMap contributors",
    },
  },

  layers: [
    {
      id: "osm-grey",

      type: "raster",

      source: "osm",

      paint: {
        /*
         * Strong desaturation gives us the
         * grey map appearance.
         */

        "raster-saturation": -1,

        /*
         * Slightly soften the map.
         */

        "raster-contrast": -0.12,

        /*
         * Keep the GPS points dominant.
         */

        "raster-opacity": 0.82,
      },
    },
  ],
};


/* ==========================================================
   GET TODAY'S DATE
========================================================== */

function getTodayDate() {
  const now = new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      now.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


/* ==========================================================
   LOCAL STORAGE HELPER
========================================================== */

function getStoredValue(
  ...keys
) {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  for (
    const key of keys
  ) {
    const value =
      localStorage.getItem(
        key
      );

    if (
      value !== null &&
      value !== undefined &&
      value !== ""
    ) {
      return value;
    }
  }

  return null;
}


/* ==========================================================
   NORMALIZE WARD NUMBER
========================================================== */

/*
 * Supports:
 *
 * 216
 * "216"
 * "Ward 216"
 * "Ibbalur (216)"
 */

function normalizeWardNumber(
  value
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const match =
    String(value).match(
      /\d+/
    );

  if (!match) {
    return null;
  }

  const number =
    Number(match[0]);

  return Number.isInteger(
    number
  )
    ? number
    : null;
}


/* ==========================================================
   SAFE DISPLAY VALUE
========================================================== */

function formatValue(
  value
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  if (
    typeof value ===
    "boolean"
  ) {
    return value
      ? "true"
      : "false";
  }

  if (
    typeof value ===
    "object"
  ) {
    try {
      return JSON.stringify(
        value
      );
    } catch {
      return String(
        value
      );
    }
  }

  return String(
    value
  );
}


/* ==========================================================
   FORMAT FIELD NAME
========================================================== */

function formatFieldName(
  field
) {
  return String(field)
    .replace(
      /([A-Z])/g,
      " $1"
    )
    .replace(
      /[_-]+/g,
      " "
    )
    .replace(
      /^./,
      (char) =>
        char.toUpperCase()
    );
}


/* ==========================================================
   POPUP DATA ROW
========================================================== */

function PopupDataRow({
  label,
  value,
}) {
  return (
    <div
      className="
        grid
        grid-cols-[105px_1fr]
        gap-2
        py-1.5
        border-b
        border-slate-100
        last:border-b-0
      "
    >
      <span
        className="
          text-[10px]
          font-medium
          text-slate-400
          break-words
        "
      >
        {label}
      </span>

      <span
        className="
          text-[10px]
          font-medium
          text-slate-700
          break-words
        "
      >
        {formatValue(value)}
      </span>
    </div>
  );
}


/* ==========================================================
   MAIN COMPONENT
========================================================== */

export default function WasteGenMap({
  wardNo: wardNoProp = null,
  selectedWard: selectedWardProp = null,
  selectedDate: selectedDateProp = null,
}) {

  /* ========================================================
     REFS
  ======================================================== */

  const sectionRef =
    useRef(null);

  const collectionCardRef =
    useRef(null);

  const mapRef =
    useRef(null);


  /* ========================================================
     STATE
  ======================================================== */

  const [
    monitoringData,
    setMonitoringData,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    hoveredPoint,
    setHoveredPoint,
  ] = useState(null);

  const [
    hoverPosition,
    setHoverPosition,
  ] = useState(null);

  const [
    viewState,
    setViewState,
  ] = useState(
    DEFAULT_VIEW_STATE
  );


  /* ========================================================
     RESOLVE HEADER WARD
  ======================================================== */

  const selectedWard =
    selectedWardProp ??
    wardNoProp ??
    getStoredValue(
      "selectedWard",
      "selectedWardNo",
      "wardNo",
      "ward",
      "selected_ward",
      "headerWardNo"
    );

  const normalizedWard =
    useMemo(
      () =>
        normalizeWardNumber(
          selectedWard
        ),
      [selectedWard]
    );


  /* ========================================================
     RESOLVE DATE
  ======================================================== */

  const currentDate =
    selectedDateProp ||
    getStoredValue(
      "selectedDate",
      "dashboardDate"
    ) ||
    getTodayDate();


  /* ========================================================
     GSAP CARD ANIMATION
  ======================================================== */

  useEffect(() => {
    const ctx =
      gsap.context(
        () => {

          const tl =
            gsap.timeline({
              defaults: {
                ease:
                  "power3.out",
              },
            });

          tl.from(
            sectionRef.current,
            {
              opacity: 0,
              duration: 0.25,
            }
          ).from(
            collectionCardRef.current,
            {
              opacity: 0,
              y: 55,
              scale: 0.96,
              duration: 1.1,
            },
            "-=0.05"
          );

        },
        sectionRef
      );

    return () =>
      ctx.revert();

  }, []);


  /* ========================================================
     FETCH COLLECTION POINT DATA
  ======================================================== */

  const fetchCollectionPoints =
    useCallback(
      async () => {

        /* --------------------------------------------------
           NO WARD
        -------------------------------------------------- */

        if (
          !normalizedWard
        ) {

          setMonitoringData(
            null
          );

          setError(
            "Please select a ward from the header."
          );

          setLoading(
            false
          );

          return;
        }


        /* --------------------------------------------------
           START LOADING
        -------------------------------------------------- */

        setLoading(
          true
        );

        setError("");

        setHoveredPoint(
          null
        );

        setHoverPosition(
          null
        );


        try {

          /* ----------------------------------------------
             BUILD API URL
          ---------------------------------------------- */

          const url =
            `${API_BASE_URL}/api/collection-point-monitoring` +
            `?wardNo=${encodeURIComponent(
              normalizedWard
            )}` +
            `&date=${encodeURIComponent(
              currentDate
            )}`;


          console.log(
            "=============================================="
          );

          console.log(
            "📍 COLLECTION POINT MONITORING"
          );

          console.log(
            "WARD:",
            normalizedWard
          );

          console.log(
            "DATE:",
            currentDate
          );

          console.log(
            "API:",
            url
          );

          console.log(
            "=============================================="
          );


          /* ----------------------------------------------
             REQUEST
          ---------------------------------------------- */

          const response =
            await fetch(
              url,
              {
                method:
                  "GET",

                headers: {
                  Accept:
                    "application/json",
                },
              }
            );


          /* ----------------------------------------------
             PARSE RESPONSE
          ---------------------------------------------- */

          let result;

          try {

            result =
              await response.json();

          } catch {

            throw new Error(
              "Backend returned an invalid JSON response."
            );

          }


          /* ----------------------------------------------
             HTTP ERROR
          ---------------------------------------------- */

          if (
            !response.ok
          ) {

            throw new Error(
              result?.message ||
              `Collection point API returned HTTP ${response.status}`
            );

          }


          /* ----------------------------------------------
             API ERROR
          ---------------------------------------------- */

          if (
            result?.success ===
            false
          ) {

            throw new Error(
              result?.message ||
              "Unable to retrieve collection point data."
            );

          }


          /* ----------------------------------------------
             STORE DATA
          ---------------------------------------------- */

          setMonitoringData(
            result?.data ||
            null
          );


          console.log(
            "✅ COLLECTION POINT DATA:",
            result?.data
          );


        } catch (
          requestError
        ) {

          console.error(
            "❌ COLLECTION POINT MONITORING ERROR:",
            requestError
          );

          setMonitoringData(
            null
          );

          setError(
            requestError?.message ||
            "Failed to load collection point data."
          );

        } finally {

          setLoading(
            false
          );

        }

      },
      [
        normalizedWard,
        currentDate,
      ]
    );


  /* ========================================================
     FETCH WHEN HEADER WARD / DATE CHANGES
  ======================================================== */

  useEffect(() => {

    fetchCollectionPoints();

  }, [
    fetchCollectionPoints,
  ]);


  /* ========================================================
     BUILD GEOJSON
  ======================================================== */

  const geoJson =
    useMemo(
      () => {

        const features =
          [];


        if (
          !monitoringData ||
          !monitoringData.vehicles
        ) {

          return {
            type:
              "FeatureCollection",

            features,
          };

        }


        Object.entries(
          monitoringData.vehicles
        ).forEach(
          ([
            vehicleNumber,
            vehicle,
          ]) => {

            if (
              !vehicle ||
              !Array.isArray(
                vehicle.points
              )
            ) {
              return;
            }


            vehicle.points.forEach(
              (
                point,
                pointIndex
              ) => {

                const latitude =
                  Number(
                    point?.latitude
                  );

                const longitude =
                  Number(
                    point?.longitude
                  );


                /* ----------------------------------------
                   VALID GPS
                ---------------------------------------- */

                if (
                  !Number.isFinite(
                    latitude
                  ) ||
                  !Number.isFinite(
                    longitude
                  )
                ) {
                  return;
                }


                /*
                 * Ignore obviously invalid
                 * 0,0 coordinates.
                 */

                if (
                  latitude === 0 &&
                  longitude === 0
                ) {
                  return;
                }


                features.push({

                  type:
                    "Feature",

                  id:
                    `${vehicleNumber}-${pointIndex}`,

                  geometry: {

                    type:
                      "Point",

                    coordinates: [
                      longitude,
                      latitude,
                    ],

                  },

                  properties: {

                    vehicleNumber:
                      vehicleNumber,

                    vehicleTableName:
                      vehicle
                        ?.vehicle_table_name ||
                      "",

                    wardNo:
                      vehicle?.ward_no ??
                      normalizedWard,

                    pointIndex:
                      pointIndex,

                    /*
                     * Complete telemetry row.
                     *
                     * Backend has already converted
                     * BigInt values into JSON-safe
                     * strings.
                     */

                    telemetry:
                      JSON.stringify(
                        point?.data ||
                        {}
                      ),

                  },

                });

              }
            );

          }
        );


        return {

          type:
            "FeatureCollection",

          features,

        };

      },
      [
        monitoringData,
        normalizedWard,
      ]
    );


  /* ========================================================
     FIT MAP TO ALL GPS POINTS
  ======================================================== */

  useEffect(() => {

    if (
      !geoJson ||
      geoJson.features.length ===
        0
    ) {
      return;
    }


    const map =
      mapRef.current?.getMap();


    if (!map) {
      return;
    }


    const coordinates =
      geoJson.features
        .map(
          (feature) =>
            feature
              ?.geometry
              ?.coordinates
        )
        .filter(
          (coordinate) =>
            Array.isArray(
              coordinate
            ) &&
            coordinate.length ===
              2 &&
            Number.isFinite(
              Number(
                coordinate[0]
              )
            ) &&
            Number.isFinite(
              Number(
                coordinate[1]
              )
            )
        );


    if (
      coordinates.length ===
      0
    ) {
      return;
    }


    /* ------------------------------------------------------
       SINGLE POINT
    ------------------------------------------------------ */

    if (
      coordinates.length ===
      1
    ) {

      map.flyTo({

        center:
          coordinates[0],

        zoom:
          16,

        duration:
          1200,

      });

      return;
    }


    /* ------------------------------------------------------
       CALCULATE BOUNDS
    ------------------------------------------------------ */

    let minLng =
      Infinity;

    let maxLng =
      -Infinity;

    let minLat =
      Infinity;

    let maxLat =
      -Infinity;


    coordinates.forEach(
      ([
        longitude,
        latitude,
      ]) => {

        minLng =
          Math.min(
            minLng,
            Number(
              longitude
            )
          );

        maxLng =
          Math.max(
            maxLng,
            Number(
              longitude
            )
          );

        minLat =
          Math.min(
            minLat,
            Number(
              latitude
            )
          );

        maxLat =
          Math.max(
            maxLat,
            Number(
              latitude
            )
          );

      }
    );


    /* ------------------------------------------------------
       FIT
    ------------------------------------------------------ */

    map.fitBounds(
      [
        [
          minLng,
          minLat,
        ],
        [
          maxLng,
          maxLat,
        ],
      ],
      {
        padding: 60,

        maxZoom:
          16,

        duration:
          1200,
      }
    );

  }, [
    geoJson,
  ]);


  /* ========================================================
     HOVER / SNAP TO NEAREST POINT
  ======================================================== */

  const handleMapMouseMove =
    useCallback(
      (event) => {

        const map =
          mapRef.current?.getMap();


        if (!map) {
          return;
        }


        /*
         * Instead of requiring the mouse to be
         * exactly over a 6px point, we search a
         * small 18px square around the cursor.
         *
         * This creates the requested SNAP behaviour.
         */

        const x =
          event.point.x;

        const y =
          event.point.y;

        const SNAP_DISTANCE =
          14;


        const nearbyFeatures =
          map.queryRenderedFeatures(
            [
              [
                x -
                  SNAP_DISTANCE,
                y -
                  SNAP_DISTANCE,
              ],
              [
                x +
                  SNAP_DISTANCE,
                y +
                  SNAP_DISTANCE,
              ],
            ],
            {
              layers: [
                "collection-points",
              ],
            }
          );


        if (
          !nearbyFeatures ||
          nearbyFeatures.length ===
            0
        ) {

          setHoveredPoint(
            null
          );

          setHoverPosition(
            null
          );

          return;
        }


        /*
         * Find the feature closest to
         * the actual cursor.
         */

        let nearestFeature =
          nearbyFeatures[0];

        let nearestDistance =
          Infinity;


        nearbyFeatures.forEach(
          (feature) => {

            if (
              !feature?.geometry ||
              feature
                .geometry
                .type !==
                "Point"
            ) {
              return;
            }


            const coordinates =
              feature
                .geometry
                .coordinates;


            const projected =
              map.project(
                {
                  lng:
                    Number(
                      coordinates[0]
                    ),

                  lat:
                    Number(
                      coordinates[1]
                    ),
                }
              );


            const distance =
              Math.sqrt(
                Math.pow(
                  projected.x -
                    x,
                  2
                ) +
                Math.pow(
                  projected.y -
                    y,
                  2
                )
              );


            if (
              distance <
              nearestDistance
            ) {

              nearestDistance =
                distance;

              nearestFeature =
                feature;

            }

          }
        );


        if (
          !nearestFeature?.geometry
        ) {

          return;
        }


        const coordinates =
          nearestFeature
            .geometry
            .coordinates;


        /* ----------------------------------------------------
           TELEMETRY DATA
        ---------------------------------------------------- */

        let telemetryData =
          {};


        try {

          telemetryData =
            JSON.parse(
              nearestFeature
                ?.properties
                ?.telemetry ||
              "{}"
            );

        } catch {

          telemetryData =
            {};

        }


        /* ----------------------------------------------------
           UPDATE HOVERED POINT
        ---------------------------------------------------- */

        setHoveredPoint({

          vehicleNumber:
            nearestFeature
              ?.properties
              ?.vehicleNumber ||
            "Vehicle",

          vehicleTableName:
            nearestFeature
              ?.properties
              ?.vehicleTableName ||
            "",

          wardNo:
            nearestFeature
              ?.properties
              ?.wardNo ??
            normalizedWard,

          pointIndex:
            nearestFeature
              ?.properties
              ?.pointIndex ??
            0,

          latitude:
            Number(
              coordinates[1]
            ),

          longitude:
            Number(
              coordinates[0]
            ),

          data:
            telemetryData,

        });


        /*
         * IMPORTANT:
         *
         * Popup goes to the GPS coordinate,
         * NOT the cursor position.
         *
         * This gives the snap effect.
         */

        setHoverPosition({

          longitude:
            Number(
              coordinates[0]
            ),

          latitude:
            Number(
              coordinates[1]
            ),

        });

      },
      [
        normalizedWard,
      ]
    );


  /* ========================================================
     MOUSE LEAVE
  ======================================================== */

  const handleMapMouseLeave =
    useCallback(
      () => {

        setHoveredPoint(
          null
        );

        setHoverPosition(
          null
        );

      },
      []
    );


  /* ========================================================
     ZOOM IN
  ======================================================== */

  function zoomIn() {

    const map =
      mapRef.current?.getMap();


    if (!map) {
      return;
    }


    map.zoomIn({
      duration:
        300,
    });

  }


  /* ========================================================
     ZOOM OUT
  ======================================================== */

  function zoomOut() {

    const map =
      mapRef.current?.getMap();


    if (!map) {
      return;
    }


    map.zoomOut({
      duration:
        300,
    });

  }


  /* ========================================================
     COUNTS
  ======================================================== */

  const vehicleCount =
    monitoringData
      ?.vehicle_count ||
    0;

  const pointCount =
    monitoringData
      ?.point_count ||
    0;


  /* ========================================================
     RENDER
  ======================================================== */

  return (

    <section
      ref={sectionRef}
      className="
        grid
        grid-cols-1
        gap-5
        h-full
      "
    >

      {/* ====================================================
          COLLECTION POINT CARD
      ==================================================== */}

      <div
        ref={collectionCardRef}
        className="
          bg-white
          rounded-3xl
          border
          border-gray-200
          shadow-[0_2px_12px_rgba(0,0,0,0.04)]
          overflow-hidden
          w-full
          h-full
        "
      >

        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          className="
            px-5
            pt-4
            pb-3
            flex
            items-center
            justify-between
            gap-4
          "
        >

          {/* TITLE */}

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <h3
              className="
                text-[14px]
                font-semibold
                text-[#16295A]
              "
            >
              Collection Point Monitoring
            </h3>

          </div>


          {/* =================================================
              LEGEND + COUNTS
          ================================================= */}

          <div
            className="
              flex
              items-center
              gap-5
            "
          >

            {/* REGISTERED */}

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <span
                className="
                  w-2.5
                  h-2.5
                  rounded-full
                  bg-green-500
                  ring-2
                  ring-green-100
                "
              />

              <span
                className="
                  text-[11px]
                  text-slate-500
                "
              >
                Registered Point
              </span>

            </div>


            {/* VEHICLES */}

            <div
              className="
                hidden
                sm:flex
                items-center
                gap-1.5
                text-[11px]
                text-slate-400
              "
            >

              <Truck
                size={13}
                className="
                  text-slate-400
                "
              />

              <span
                className="
                  font-semibold
                  text-slate-600
                "
              >
                {vehicleCount}
              </span>

              <span>
                vehicles
              </span>

            </div>


            {/* POINTS */}

            <div
              className="
                hidden
                sm:block
                text-[11px]
                text-slate-400
              "
            >

              <span
                className="
                  font-semibold
                  text-slate-600
                "
              >
                {pointCount}
              </span>{" "}

              points

            </div>


            {/* REFRESH */}

            <button
              type="button"
              onClick={
                fetchCollectionPoints
              }
              disabled={
                loading
              }
              title="
                Refresh collection points
              "
              className="
                w-8
                h-8
                rounded-lg
                border
                border-slate-200
                bg-white
                flex
                items-center
                justify-center
                text-slate-500
                hover:bg-slate-50
                hover:text-[#16295A]
                transition-all
                duration-200
                disabled:opacity-40
                disabled:cursor-not-allowed
              "
            >

              <RefreshCw
                size={14}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

            </button>

          </div>

        </div>


        {/* ==================================================
            MAP
        ================================================== */}

        <div
          className="
            relative
            h-[310px]
            bg-[#F7F8FB]
          "
        >

          {/* =================================================
              MAP
          ================================================= */}

          <Map
            ref={mapRef}

            {...viewState}

            onMove={
              (event) =>
                setViewState(
                  event.viewState
                )
            }

            onMouseMove={
              handleMapMouseMove
            }

            onMouseLeave={
              handleMapMouseLeave
            }

            interactiveLayerIds={[
              "collection-points",
            ]}

            cursor={
              hoveredPoint
                ? "pointer"
                : "default"
            }

            mapStyle={
              GREY_MAP_STYLE
            }

            style={{
              width:
                "100%",

              height:
                "100%",
            }}

            attributionControl={
              false
            }
          >

            {/* =================================================
                GPS POINT SOURCE
            ================================================= */}

            <Source
              id="
                collection-points-source
              "

              type="geojson"

              data={
                geoJson
              }
            >

              {/* =============================================
                  WHITE OUTER HALO
              ============================================= */}

              <Layer
                id="
                  collection-points-halo
                "

                type="circle"

                paint={{

                  "circle-radius": [
                    "interpolate",

                    [
                      "linear",
                    ],

                    [
                      "zoom",
                    ],

                    10,
                    5.5,

                    12,
                    7,

                    14,
                    8.5,

                    16,
                    10,

                    18,
                    12,
                  ],

                  "circle-color":
                    "#ffffff",

                  "circle-opacity":
                    0.95,

                }}
              />


              {/* =============================================
                  REGISTERED GPS POINTS
              ============================================= */}

              <Layer
                id="
                  collection-points
                "

                type="circle"

                paint={{

                  /*
                   * Thick points.
                   */

                  "circle-radius": [
                    "interpolate",

                    [
                      "linear",
                    ],

                    [
                      "zoom",
                    ],

                    10,
                    4.5,

                    11,
                    5,

                    12,
                    5.8,

                    14,
                    7,

                    16,
                    8.5,

                    18,
                    10.5,
                  ],

                  /*
                   * ALL points are registered.
                   */

                  "circle-color":
                    "#22c55e",

                  "circle-opacity":
                    0.96,

                  /*
                   * White border.
                   */

                  "circle-stroke-color":
                    "#ffffff",

                  "circle-stroke-width":
                    1.8,

                  "circle-stroke-opacity":
                    1,

                }}
              />

            </Source>


            {/* =================================================
                SNAP HIGHLIGHT
            ================================================= */}

            {hoverPosition && (

              <Source
                id="
                  collection-point-hover-source
                "

                type="geojson"

                data={{
                  type:
                    "FeatureCollection",

                  features: [
                    {
                      type:
                        "Feature",

                      geometry: {
                        type:
                          "Point",

                        coordinates: [
                          hoverPosition.longitude,
                          hoverPosition.latitude,
                        ],
                      },

                      properties: {},
                    },
                  ],
                }}
              >

                {/* OUTER SNAP RING */}

                <Layer
                  id="
                    collection-point-hover-ring
                  "

                  type="circle"

                  paint={{

                    "circle-radius":
                      13,

                    "circle-color":
                      "#22c55e",

                    "circle-opacity":
                      0.16,

                    "circle-stroke-color":
                      "#16a34a",

                    "circle-stroke-width":
                      2,

                    "circle-stroke-opacity":
                      0.85,

                  }}
                />


                {/* SNAP CENTER */}

                <Layer
                  id="
                    collection-point-hover-center
                  "

                  type="circle"

                  paint={{

                    "circle-radius":
                      7,

                    "circle-color":
                      "#16a34a",

                    "circle-opacity":
                      1,

                    "circle-stroke-color":
                      "#ffffff",

                    "circle-stroke-width":
                      2,

                  }}
                />

              </Source>

            )}


            {/* =================================================
                POPUP
            ================================================= */}

            {hoveredPoint &&
              hoverPosition && (

                <Popup
                  longitude={
                    hoverPosition.longitude
                  }

                  latitude={
                    hoverPosition.latitude
                  }

                  closeButton={
                    false
                  }

                  closeOnClick={
                    false
                  }

                  anchor="bottom"

                  offset={
                    16
                  }

                  className="
                    collection-point-popup
                  "
                >

                  <div
                    className="
                      w-[310px]
                      max-w-[310px]
                      max-h-[280px]
                      overflow-y-auto
                      pr-1
                    "
                  >

                    {/* ======================================
                        POPUP HEADER
                    ====================================== */}

                    <div
                      className="
                        flex
                        items-center
                        gap-2.5
                        pb-2.5
                        mb-2
                        border-b
                        border-slate-100
                      "
                    >

                      {/* ICON */}

                      <div
                        className="
                          w-8
                          h-8
                          rounded-full
                          bg-green-50
                          flex
                          items-center
                          justify-center
                          shrink-0
                        "
                      >

                        <MapPin
                          size={15}
                          className="
                            text-green-600
                          "
                        />

                      </div>


                      {/* VEHICLE */}

                      <div
                        className="
                          min-w-0
                        "
                      >

                        <p
                          className="
                            text-[12px]
                            font-semibold
                            text-[#16295A]
                            truncate
                          "
                        >
                          {
                            hoveredPoint.vehicleNumber
                          }
                        </p>

                        <p
                          className="
                            text-[9px]
                            text-slate-400
                            mt-0.5
                          "
                        >
                          Registered Collection Point
                        </p>

                      </div>

                    </div>


                    {/* ======================================
                        LOCATION
                    ====================================== */}

                    <div
                      className="
                        mb-2.5
                        rounded-lg
                        bg-slate-50
                        px-3
                        py-2
                      "
                    >

                      <div
                        className="
                          grid
                          grid-cols-2
                          gap-2
                        "
                      >

                        <div>

                          <p
                            className="
                              text-[8px]
                              uppercase
                              tracking-wide
                              text-slate-400
                            "
                          >
                            Latitude
                          </p>

                          <p
                            className="
                              text-[10px]
                              font-semibold
                              text-slate-700
                              mt-0.5
                            "
                          >
                            {
                              Number(
                                hoveredPoint.latitude
                              ).toFixed(
                                7
                              )
                            }
                          </p>

                        </div>


                        <div>

                          <p
                            className="
                              text-[8px]
                              uppercase
                              tracking-wide
                              text-slate-400
                            "
                          >
                            Longitude
                          </p>

                          <p
                            className="
                              text-[10px]
                              font-semibold
                              text-slate-700
                              mt-0.5
                            "
                          >
                            {
                              Number(
                                hoveredPoint.longitude
                              ).toFixed(
                                7
                              )
                            }
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* ======================================
                        VEHICLE INFORMATION
                    ====================================== */}

                    <div
                      className="
                        mb-2.5
                      "
                    >

                      <PopupDataRow
                        label="Ward"
                        value={
                          hoveredPoint.wardNo
                        }
                      />

                      <PopupDataRow
                        label="Vehicle Table"
                        value={
                          hoveredPoint.vehicleTableName
                        }
                      />

                      <PopupDataRow
                        label="Point Index"
                        value={
                          Number(
                            hoveredPoint.pointIndex
                          ) + 1
                        }
                      />

                    </div>


                    {/* ======================================
                        TELEMETRY DATA
                    ====================================== */}

                    <div>

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          mb-1.5
                        "
                      >

                        <span
                          className="
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-wide
                            text-slate-400
                          "
                        >
                          Telemetry Data
                        </span>

                        <span
                          className="
                            text-[8px]
                            text-green-500
                            font-medium
                          "
                        >
                          LIVE RECORD
                        </span>

                      </div>


                      {hoveredPoint.data &&
                        Object.keys(
                          hoveredPoint.data
                        ).length >
                          0 ? (

                        <div
                          className="
                            rounded-lg
                            border
                            border-slate-100
                            overflow-hidden
                          "
                        >

                          {Object.entries(
                            hoveredPoint.data
                          ).map(
                            ([
                              key,
                              value,
                            ]) => (

                              <PopupDataRow
                                key={
                                  key
                                }

                                label={
                                  formatFieldName(
                                    key
                                  )
                                }

                                value={
                                  value
                                }
                              />

                            )
                          )}

                        </div>

                      ) : (

                        <div
                          className="
                            rounded-lg
                            bg-slate-50
                            px-3
                            py-2
                            text-[10px]
                            text-slate-400
                          "
                        >
                          No telemetry data available.
                        </div>

                      )}

                    </div>

                  </div>

                </Popup>

              )}

          </Map>


          {/* =================================================
              CUSTOM ZOOM CONTROLS
          ================================================= */}

          <div
            className="
              absolute
              top-4
              left-4
              z-10
            "
          >

            <div
              className="
                bg-white
                rounded-xl
                shadow-[0_2px_10px_rgba(0,0,0,0.12)]
                overflow-hidden
                border
                border-slate-100
              "
            >

              {/* PLUS */}

              <button
                type="button"
                onClick={
                  zoomIn
                }
                title="Zoom in"
                className="
                  w-9
                  h-9
                  flex
                  items-center
                  justify-center
                  border-b
                  border-slate-100
                  text-slate-700
                  hover:bg-slate-50
                  transition-colors
                  duration-200
                "
              >

                <Plus
                  size={16}
                />

              </button>


              {/* MINUS */}

              <button
                type="button"
                onClick={
                  zoomOut
                }
                title="Zoom out"
                className="
                  w-9
                  h-9
                  flex
                  items-center
                  justify-center
                  text-slate-700
                  hover:bg-slate-50
                  transition-colors
                  duration-200
                "
              >

                <Minus
                  size={16}
                />

              </button>

            </div>

          </div>


          {/* =================================================
              TOP RIGHT STATUS
          ================================================= */}

          {!loading &&
            !error &&
            normalizedWard && (

              <div
                className="
                  absolute
                  top-4
                  right-4
                  z-10
                  bg-white/95
                  backdrop-blur-sm
                  rounded-lg
                  border
                  border-slate-100
                  shadow-sm
                  px-3
                  py-2
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <span
                    className="
                      w-2
                      h-2
                      rounded-full
                      bg-green-500
                    "
                  />

                  <span
                    className="
                      text-[10px]
                      font-medium
                      text-slate-600
                    "
                  >
                    Ward {normalizedWard}
                  </span>

                </div>

              </div>

            )}


          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (

            <div
              className="
                absolute
                inset-0
                z-[5]
                flex
                items-center
                justify-center
                pointer-events-none
              "
            >

              <div
                className="
                  bg-white/95
                  backdrop-blur-sm
                  rounded-xl
                  px-4
                  py-3
                  shadow-lg
                  border
                  border-slate-100
                  flex
                  items-center
                  gap-2
                "
              >

                <RefreshCw
                  size={14}
                  className="
                    animate-spin
                    text-[#16295A]
                  "
                />

                <span
                  className="
                    text-[11px]
                    text-slate-500
                  "
                >
                  Loading collection points...
                </span>

              </div>

            </div>

          )}


          {/* =================================================
              ERROR
          ================================================= */}

          {!loading &&
            error && (

              <div
                className="
                  absolute
                  inset-0
                  z-[5]
                  flex
                  items-center
                  justify-center
                  pointer-events-none
                "
              >

                <div
                  className="
                    bg-white
                    rounded-xl
                    px-5
                    py-4
                    shadow-lg
                    border
                    border-red-100
                    text-center
                    max-w-[280px]
                  "
                >

                  <p
                    className="
                      text-[12px]
                      font-medium
                      text-slate-600
                    "
                  >
                    Unable to load collection points
                  </p>

                  <p
                    className="
                      text-[10px]
                      text-red-400
                      mt-1
                    "
                  >
                    {error}
                  </p>

                </div>

              </div>

            )}


          {/* =================================================
              EMPTY
          ================================================= */}

          {!loading &&
            !error &&
            normalizedWard &&
            geoJson.features.length ===
              0 && (

              <div
                className="
                  absolute
                  inset-0
                  z-[4]
                  flex
                  items-center
                  justify-center
                  pointer-events-none
                "
              >

                <div
                  className="
                    bg-white/95
                    backdrop-blur-sm
                    rounded-xl
                    px-5
                    py-4
                    shadow-sm
                    border
                    border-slate-100
                    text-center
                  "
                >

                  <MapPin
                    size={18}
                    className="
                      mx-auto
                      text-slate-300
                      mb-2
                    "
                  />

                  <p
                    className="
                      text-[12px]
                      font-medium
                      text-slate-500
                    "
                  >
                    No collection points found
                  </p>

                  <p
                    className="
                      text-[10px]
                      text-slate-400
                      mt-1
                    "
                  >
                    No GPS records were returned
                    for this ward and date.
                  </p>

                </div>

              </div>

            )}


          {/* =================================================
              NO WARD
          ================================================= */}

          {!loading &&
            !normalizedWard && (

              <div
                className="
                  absolute
                  inset-0
                  z-[4]
                  flex
                  items-center
                  justify-center
                  pointer-events-none
                "
              >

                <div
                  className="
                    bg-white/95
                    backdrop-blur-sm
                    rounded-xl
                    px-5
                    py-4
                    shadow-sm
                    border
                    border-slate-100
                    text-center
                  "
                >

                  <MapPin
                    size={18}
                    className="
                      mx-auto
                      text-slate-300
                      mb-2
                    "
                  />

                  <p
                    className="
                      text-[12px]
                      font-medium
                      text-slate-500
                    "
                  >
                    Select a ward
                  </p>

                  <p
                    className="
                      text-[10px]
                      text-slate-400
                      mt-1
                    "
                  >
                    Choose a ward from the header
                    to load collection points.
                  </p>

                </div>

              </div>

            )}

        </div>


        {/* ==================================================
            BOTTOM STATUS
        ================================================== */}

        <div
          className="
            h-[54px]
            px-5
            flex
            items-center
            justify-between
            border-t
            border-slate-100
            bg-white
          "
        >

          {/* LEFT */}

          <div
            className="
              flex
              items-center
              gap-4
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <span
                className="
                  w-2
                  h-2
                  rounded-full
                  bg-green-500
                "
              />

              <span
                className="
                  text-[10px]
                  text-slate-500
                "
              >
                All GPS points are registered
              </span>

            </div>

          </div>


          {/* RIGHT */}

          <div
            className="
              flex
              items-center
              gap-4
            "
          >

            <span
              className="
                text-[10px]
                text-slate-400
              "
            >
              {pointCount} points
            </span>

            <span
              className="
                text-[10px]
                text-slate-400
              "
            >
              {vehicleCount} vehicles
            </span>

          </div>

        </div>

      </div>

    </section>

  );
}