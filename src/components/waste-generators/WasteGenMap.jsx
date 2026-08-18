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
        "raster-saturation": -1,
        "raster-contrast": -0.12,
        "raster-brightness-min": 0.12,
        "raster-brightness-max": 0.92,
        "raster-opacity": 0.82,
      },
    },
  ],
};


/* ==========================================================
   HEADER STORAGE KEYS
========================================================== */

/*
 * IMPORTANT:
 *
 * We are NOT changing the Header.
 *
 * WasteGenMap simply reads the values already maintained
 * by the Header.
 *
 * Ward keys:
 */

const HEADER_WARD_KEYS = [
  "selectedWard",
  "selectedWardNo",
  "wardNo",
  "ward",
  "selected_ward",
  "headerWardNo",
];


/*
 * Date keys:
 */

const HEADER_DATE_KEYS = [
  "selectedDate",
  "dashboardDate",
  "headerDate",
  "date",
  "selected_date",
  "dashboard_date",
];


/* ==========================================================
   READ HEADER VALUE
========================================================== */

function getHeaderStoredValue(keys) {
  if (
    typeof window === "undefined"
  ) {
    return null;
  }

  /*
   * Check localStorage first.
   */

  for (const key of keys) {
    try {
      const value =
        window.localStorage.getItem(key);

      if (
        value !== null &&
        value !== undefined &&
        value !== ""
      ) {
        return value;
      }
    } catch {
      // Ignore storage errors.
    }
  }


  /*
   * Then check sessionStorage.
   */

  for (const key of keys) {
    try {
      const value =
        window.sessionStorage.getItem(key);

      if (
        value !== null &&
        value !== undefined &&
        value !== ""
      ) {
        return value;
      }
    } catch {
      // Ignore storage errors.
    }
  }


  /*
   * Finally check URL query parameters.
   *
   * This does NOT change the Header.
   * It simply allows the component to consume
   * an existing dynamic header selection if it
   * is represented in the URL.
   */

  try {
    const params =
      new URLSearchParams(
        window.location.search
      );

    for (const key of keys) {
      const value =
        params.get(key);

      if (
        value !== null &&
        value !== undefined &&
        value !== ""
      ) {
        return value;
      }
    }
  } catch {
    // Ignore URL parsing errors.
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

function normalizeWardNumber(value) {
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

  return Number.isInteger(number)
    ? number
    : null;
}


/* ==========================================================
   NORMALIZE HEADER DATE
========================================================== */

/*
 * Backend expects:
 *
 * YYYY-MM-DD
 *
 * Supported Header values:
 *
 * 2026-08-17
 * 2026/08/17
 * 17-08-2026
 * 17/08/2026
 * ISO datetime strings
 */

function normalizeHeaderDate(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const raw =
    String(value).trim();


  /*
   * YYYY-MM-DD
   */

  let match =
    raw.match(
      /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/
    );

  if (match) {
    const year =
      match[1];

    const month =
      String(match[2]).padStart(
        2,
        "0"
      );

    const day =
      String(match[3]).padStart(
        2,
        "0"
      );

    return `${year}-${month}-${day}`;
  }


  /*
   * DD-MM-YYYY
   *
   * or
   *
   * DD/MM/YYYY
   */

  match =
    raw.match(
      /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/
    );

  if (match) {
    const day =
      String(match[1]).padStart(
        2,
        "0"
      );

    const month =
      String(match[2]).padStart(
        2,
        "0"
      );

    const year =
      match[3];

    return `${year}-${month}-${day}`;
  }


  /*
   * If Header stores a normal
   * JavaScript date / ISO datetime.
   */

  const parsed =
    new Date(raw);

  if (
    !Number.isNaN(
      parsed.getTime()
    )
  ) {
    const year =
      parsed.getFullYear();

    const month =
      String(
        parsed.getMonth() + 1
      ).padStart(
        2,
        "0"
      );

    const day =
      String(
        parsed.getDate()
      ).padStart(
        2,
        "0"
      );

    return `${year}-${month}-${day}`;
  }


  return null;
}


/* ==========================================================
   INITIAL HEADER STATE
========================================================== */

function getHeaderWard() {
  return getHeaderStoredValue(
    HEADER_WARD_KEYS
  );
}


function getHeaderDate() {
  return getHeaderStoredValue(
    HEADER_DATE_KEYS
  );
}


/* ==========================================================
   SAFE DISPLAY VALUE
========================================================== */

function formatValue(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  if (
    typeof value === "boolean"
  ) {
    return value
      ? "true"
      : "false";
  }

  if (
    typeof value === "object"
  ) {
    try {
      return JSON.stringify(
        value
      );
    } catch {
      return String(value);
    }
  }

  return String(value);
}


/* ==========================================================
   FORMAT FIELD NAME
========================================================== */

function formatFieldName(field) {
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

export default function WasteGenMap() {

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
     HEADER STATE
  ======================================================== */

  const [
    headerWard,
    setHeaderWard,
  ] = useState(
    getHeaderWard
  );

  const [
    headerDate,
    setHeaderDate,
  ] = useState(
    getHeaderDate
  );


  /* ========================================================
     NORMALIZED HEADER VALUES
  ======================================================== */

  const normalizedWard =
    useMemo(
      () =>
        normalizeWardNumber(
          headerWard
        ),
      [headerWard]
    );


  /*
   * IMPORTANT:
   *
   * There is intentionally NO getTodayDate()
   * fallback here.
   *
   * The date MUST come from Header.
   */

  const currentDate =
    useMemo(
      () =>
        normalizeHeaderDate(
          headerDate
        ),
      [headerDate]
    );


  /* ========================================================
     DATA STATE
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
     READ HEADER CHANGES
  ======================================================== */

  useEffect(() => {

    /*
     * The Header can update localStorage/sessionStorage
     * inside the same browser tab.
     *
     * Because the native "storage" event does not fire
     * in the same tab that changed localStorage, we also
     * perform a lightweight check periodically.
     */

    const checkHeaderState =
      () => {

        const nextWard =
          getHeaderWard();

        const nextDate =
          getHeaderDate();


        setHeaderWard(
          (previous) => {

            if (
              String(previous ?? "") !==
              String(nextWard ?? "")
            ) {
              return nextWard;
            }

            return previous;
          }
        );


        setHeaderDate(
          (previous) => {

            if (
              String(previous ?? "") !==
              String(nextDate ?? "")
            ) {
              return nextDate;
            }

            return previous;
          }
        );
      };


    /*
     * Immediately check.
     */

    checkHeaderState();


    /*
     * Listen for cross-tab storage changes.
     */

    window.addEventListener(
      "storage",
      checkHeaderState
    );


    /*
     * Lightweight same-tab polling.
     *
     * This means the Header does NOT need
     * to be modified.
     */

    const interval =
      window.setInterval(
        checkHeaderState,
        500
      );


    return () => {

      window.removeEventListener(
        "storage",
        checkHeaderState
      );

      window.clearInterval(
        interval
      );

    };

  }, []);


  /* ========================================================
     GSAP ANIMATION
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
           NO DATE
        -------------------------------------------------- */

        if (
          !currentDate
        ) {

          setMonitoringData(
            null
          );

          setError(
            "Please select a date from the header."
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
             API URL
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
            "WARD FROM HEADER:",
            normalizedWard
          );

          console.log(
            "DATE FROM HEADER:",
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
             PARSE JSON
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
     FETCH WHEN HEADER CHANGES
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


                /*
                 * Ignore invalid coordinates.
                 */

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


                if (
                  latitude === 0 &&
                  longitude === 0
                ) {
                  return;
                }


                /*
                 * Complete telemetry row.
                 *
                 * Backend already converts BigInt
                 * into JSON-safe values.
                 */

                const telemetry =
                  point?.data ||
                  point ||
                  {};


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
                      vehicle
                        ?.vehicleTableName ||
                      "",

                    wardNo:
                      vehicle?.ward_no ??
                      vehicle?.wardNo ??
                      normalizedWard,

                    pointIndex:
                      pointIndex,

                    telemetry:
                      JSON.stringify(
                        telemetry
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
     FIT MAP TO GPS POINTS
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
       SINGLE GPS POINT
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
            Number(longitude)
          );

        maxLng =
          Math.max(
            maxLng,
            Number(longitude)
          );

        minLat =
          Math.min(
            minLat,
            Number(latitude)
          );

        maxLat =
          Math.max(
            maxLat,
            Number(latitude)
          );

      }
    );


    /* ------------------------------------------------------
       FIT BOUNDS
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
     HOVER / SNAP TO NEAREST GPS POINT
  ======================================================== */

  const handleMapMouseMove =
    useCallback(
      (event) => {

        const map =
          mapRef.current?.getMap();


        if (!map) {
          return;
        }


        const x =
          event.point.x;

        const y =
          event.point.y;


        /*
         * Snap radius.
         *
         * The point does NOT need to be
         * hit exactly.
         */

        const SNAP_DISTANCE =
          18;


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


        /* --------------------------------------------------
           FIND NEAREST POINT
        -------------------------------------------------- */

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
              map.project({
                lng:
                  Number(
                    coordinates[0]
                  ),

                lat:
                  Number(
                    coordinates[1]
                  ),
              });


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


        /* --------------------------------------------------
           PARSE TELEMETRY
        -------------------------------------------------- */

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


        /* --------------------------------------------------
           SET HOVERED POINT
        -------------------------------------------------- */

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
         * Popup is anchored to the
         * actual GPS point.
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

  const zoomIn =
    useCallback(
      () => {

        const map =
          mapRef.current?.getMap();


        if (!map) {
          return;
        }


        map.zoomIn({
          duration:
            300,
        });

      },
      []
    );


  /* ========================================================
     ZOOM OUT
  ======================================================== */

  const zoomOut =
    useCallback(
      () => {

        const map =
          mapRef.current?.getMap();


        if (!map) {
          return;
        }


        map.zoomOut({
          duration:
            300,
        });

      },
      []
    );


  /* ========================================================
     COUNTS
  ======================================================== */

  const vehicleCount =
    Number(
      monitoringData
        ?.vehicle_count ||
      0
    );


  const pointCount =
    Number(
      monitoringData
        ?.point_count ||
      geoJson.features.length ||
      0
    );


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

            {/* REGISTERED POINT */}

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
              title="Refresh collection points"
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
                COLLECTION POINT SOURCE
            ================================================= */}

            <Source
              id="collection-points-source"
              type="geojson"
              data={geoJson}
            >

              {/* =============================================
                  WHITE OUTER HALO
              ============================================= */}

              <Layer
                id="collection-points-halo"
                type="circle"
                paint={{

                  "circle-radius": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],

                    10,
                    7,

                    12,
                    9,

                    14,
                    11,

                    16,
                    13,

                    18,
                    15,
                  ],

                  "circle-color":
                    "#ffffff",

                  "circle-opacity":
                    0.95,

                }}
              />


              {/* =============================================
                  ALL GPS POINTS
                  ALL = REGISTERED
              ============================================= */}

              <Layer
                id="collection-points"
                type="circle"
                paint={{

                  /*
                   * THICK GPS POINTS
                   */

                  "circle-radius": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],

                    10,
                    5.5,

                    11,
                    6,

                    12,
                    7,

                    13,
                    8,

                    14,
                    9,

                    16,
                    10.5,

                    18,
                    12,
                  ],

                  /*
                   * ALL POINTS ARE REGISTERED.
                   */

                  "circle-color":
                    "#22c55e",

                  "circle-opacity":
                    0.98,

                  "circle-stroke-color":
                    "#ffffff",

                  "circle-stroke-width":
                    2,

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
                id="collection-point-hover-source"
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
                  id="collection-point-hover-ring"
                  type="circle"
                  paint={{

                    "circle-radius":
                      16,

                    "circle-color":
                      "#22c55e",

                    "circle-opacity":
                      0.12,

                    "circle-stroke-color":
                      "#16a34a",

                    "circle-stroke-width":
                      2,

                    "circle-stroke-opacity":
                      0.9,

                  }}
                />


                {/* SNAP CENTER */}

                <Layer
                  id="collection-point-hover-center"
                  type="circle"
                  paint={{

                    "circle-radius":
                      8,

                    "circle-color":
                      "#16a34a",

                    "circle-opacity":
                      1,

                    "circle-stroke-color":
                      "#ffffff",

                    "circle-stroke-width":
                      2.5,

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
                    18
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

                      <PopupDataRow
                        label="Date"
                        value={
                          currentDate
                        }
                      />

                    </div>


                    {/* ======================================
                        TELEMETRY
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
                          REGISTERED
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
            normalizedWard &&
            currentDate && (

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

                  <span
                    className="
                      text-[9px]
                      text-slate-400
                    "
                  >
                    •
                  </span>

                  <span
                    className="
                      text-[9px]
                      text-slate-400
                    "
                  >
                    {currentDate}
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
                    max-w-[300px]
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
            currentDate &&
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
              NO HEADER SELECTION
          ================================================= */}

          {!loading &&
            (!normalizedWard ||
              !currentDate) && (

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
                    Select ward and date
                  </p>

                  <p
                    className="
                      text-[10px]
                      text-slate-400
                      mt-1
                    "
                  >
                    Choose the ward and date from
                    the header to load collection
                    points.
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