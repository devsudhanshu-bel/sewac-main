import { useEffect, useMemo, useRef, useState } from "react";
import Map, {
  Layer,
  NavigationControl,
  Popup,
  Source,
} from "react-map-gl/maplibre";

import { Plus, Minus, RefreshCw } from "lucide-react";
import { gsap } from "gsap";


/* ==========================================================
   MAPLIBRE CSS
========================================================== */

import "maplibre-gl/dist/maplibre-gl.css";


/* ==========================================================
   CONFIG
========================================================== */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";


/* ==========================================================
   GREY MAP STYLE
========================================================== */

/*
 * We use OpenStreetMap raster tiles and apply a strong
 * desaturation effect through MapLibre.
 *
 * This gives the map the grey / neutral appearance required
 * for the dashboard.
 */

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
      id: "osm",

      type: "raster",

      source: "osm",

      paint: {
        /*
         * Make the base map grey.
         */

        "raster-saturation": -1,

        /*
         * Slightly reduce contrast / visual intensity.
         */

        "raster-contrast": -0.15,

        /*
         * Keep the map visible behind the points.
         */

        "raster-opacity": 0.78,
      },
    },
  ],
};


/* ==========================================================
   DEFAULT CENTER
========================================================== */

const DEFAULT_VIEW_STATE = {
  longitude: 77.5946,
  latitude: 12.9716,
  zoom: 11,
};


/* ==========================================================
   HELPERS
========================================================== */


/*
 * Convert:
 *
 * 2026-08-18
 *
 * into:
 *
 * day_18082026
 *
 * Backend handles this itself, so the frontend only sends
 * the normal YYYY-MM-DD date.
 */

function getTodayDate() {

  const now =
    new Date();


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
   SAFE VALUE FORMATTER
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
    typeof value === "object"
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
   TELEMETRY FIELD LABEL
========================================================== */

function formatFieldName(
  field
) {

  return field
    .replace(
      /([A-Z])/g,
      " $1"
    )
    .replace(
      /^./,
      (char) =>
        char.toUpperCase()
    );

}


/* ==========================================================
   COMPONENT
========================================================== */

export default function WasteGenMap({
  wardNo: wardNoProp,
}) {

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
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState(null);


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


  const [
    currentDate,
    setCurrentDate,
  ] = useState(
    getTodayDate()
  );


  /* ========================================================
     WARD NUMBER
  ======================================================== */

  /*
   * Preferred:
   *
   * <WasteGenMap wardNo={wardNo} />
   *
   * We also check common localStorage keys so that the
   * component can work while the Header integration is being
   * connected.
   */

  const wardNo =
    wardNoProp ||
    localStorage.getItem(
      "wardNo"
    ) ||
    localStorage.getItem(
      "ward_no"
    ) ||
    localStorage.getItem(
      "wardNumber"
    ) ||
    localStorage.getItem(
      "ward_number"
    );


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

              duration:
                0.25,
            }
          )
            .from(
              collectionCardRef.current,
              {
                opacity: 0,

                y: 55,

                scale:
                  0.96,

                duration:
                  1.1,
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

  async function fetchCollectionPoints() {

    if (
      !wardNo
    ) {

      setLoading(
        false
      );

      setError(
        "Ward number is not available."
      );

      return;

    }


    setLoading(
      true
    );

    setError(
      null
    );


    try {

      const url =
        `${API_BASE_URL}/api/collection-point-monitoring` +
        `?wardNo=${encodeURIComponent(
          wardNo
        )}` +
        `&date=${encodeURIComponent(
          currentDate
        )}`;


      console.log(
        "📍 Collection Point Monitoring:",
        url
      );


      const response =
        await fetch(
          url
        );


      if (
        !response.ok
      ) {

        throw new Error(
          `Request failed with status ${response.status}`
        );

      }


      const result =
        await response.json();


      if (
        !result.success
      ) {

        throw new Error(
          result.message ||
            "Failed to retrieve collection point data"
        );

      }


      console.log(
        "📍 Collection Point Monitoring Data:",
        result
      );


      setMonitoringData(
        result.data
      );

    } catch (
      fetchError
    ) {

      console.error(
        "❌ Collection Point Monitoring:",
        fetchError
      );


      setError(
        fetchError.message ||
          "Failed to load collection point data"
      );


      setMonitoringData(
        null
      );

    } finally {

      setLoading(
        false
      );

    }

  }


  /* ========================================================
     FETCH WHEN WARD / DATE CHANGES
  ======================================================== */

  useEffect(() => {

    fetchCollectionPoints();

  }, [
    wardNo,
    currentDate,
  ]);


  /* ========================================================
     BUILD GEOJSON
  ======================================================== */

  const geoJson =
    useMemo(() => {

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
              index
            ) => {

              const latitude =
                Number(
                  point.latitude
                );


              const longitude =
                Number(
                  point.longitude
                );


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


              features.push({

                type:
                  "Feature",

                geometry: {

                  type:
                    "Point",

                  coordinates: [
                    longitude,
                    latitude,
                  ],

                },

                properties: {

                  /*
                   * Vehicle information
                   */

                  vehicleNumber,

                  vehicleTableName:
                    vehicle.vehicle_table_name ||
                    "",

                  wardNo:
                    vehicle.ward_no ??
                    wardNo,

                  pointIndex:
                    index,

                  /*
                   * Store the complete telemetry data
                   * as JSON.
                   */

                  telemetry:
                    JSON.stringify(
                      point.data || {}
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

    }, [
      monitoringData,
      wardNo,
    ]);


  /* ========================================================
     FIT MAP TO ALL POINTS
  ======================================================== */

  useEffect(() => {

    if (
      !geoJson ||
      geoJson.features.length === 0
    ) {

      return;

    }


    const map =
      mapRef.current?.getMap();


    if (!map) {

      return;

    }


    const coordinates =
      geoJson.features.map(
        (feature) =>
          feature.geometry
            .coordinates
      );


    if (
      coordinates.length === 1
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
            longitude
          );

        maxLng =
          Math.max(
            maxLng,
            longitude
          );

        minLat =
          Math.min(
            minLat,
            latitude
          );

        maxLat =
          Math.max(
            maxLat,
            latitude
          );

      }
    );


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

        padding: 55,

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
     MAP LOAD
  ======================================================== */

  function handleMapLoad() {

    if (
      geoJson.features.length === 0
    ) {

      return;

    }


    /*
     * Fitting is handled by the GeoJSON effect.
     */

  }


  /* ========================================================
     MAP HOVER
  ======================================================== */

  function handleMapMouseMove(
    event
  ) {

    const features =
      event.features;


    if (
      !features ||
      features.length === 0
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
     * First feature = topmost / nearest rendered point.
     *
     * This gives the "snap" behaviour when moving over
     * dense GPS points.
     */

    const feature =
      features[0];


    const coordinates =
      feature.geometry.coordinates;


    let telemetryData =
      {};


    try {

      telemetryData =
        JSON.parse(
          feature.properties.telemetry ||
            "{}"
        );

    } catch {

      telemetryData =
        {};

    }


    setHoveredPoint({

      vehicleNumber:
        feature.properties.vehicleNumber,

      vehicleTableName:
        feature.properties.vehicleTableName,

      wardNo:
        feature.properties.wardNo,

      pointIndex:
        feature.properties.pointIndex,

      latitude:
        coordinates[1],

      longitude:
        coordinates[0],

      data:
        telemetryData,

    });


    setHoverPosition({

      longitude:
        coordinates[0],

      latitude:
        coordinates[1],

    });

  }


  /* ========================================================
     MAP LEAVE
  ======================================================== */

  function handleMapMouseLeave() {

    setHoveredPoint(
      null
    );

    setHoverPosition(
      null
    );

  }


  /* ========================================================
     ZOOM
  ======================================================== */

  function zoomIn() {

    const map =
      mapRef.current?.getMap();


    if (
      !map
    ) {

      return;

    }


    map.zoomIn({

      duration:
        300,

    });

  }


  function zoomOut() {

    const map =
      mapRef.current?.getMap();


    if (
      !map
    ) {

      return;

    }


    map.zoomOut({

      duration:
        300,

    });

  }


  /* ========================================================
     POINT COUNT
  ======================================================== */

  const pointCount =
    monitoringData?.point_count ||
    0;


  const vehicleCount =
    monitoringData?.vehicle_count ||
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

      {/* ==================================================
          COLLECTION POINT CARD
      ================================================== */}

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
          "
        >

          {/* TITLE */}

          <div>

            <h3
              className="
                text-[14px]
                font-semibold
                text-[#16295A]
              "
            >
              Collection Point Monitoring
            </h3>

            <div
              className="
                flex
                items-center
                gap-2
                mt-1
              "
            >

              <span
                className="
                  text-[10px]
                  text-slate-400
                "
              >
                Ward {wardNo || "—"}
              </span>


              <span
                className="
                  text-slate-300
                  text-[10px]
                "
              >
                •
              </span>


              <span
                className="
                  text-[10px]
                  text-slate-400
                "
              >
                {currentDate}
              </span>

            </div>

          </div>


          {/* ==================================================
              LEGEND + STATS
          ================================================== */}

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
                  shadow-[0_0_0_3px_rgba(34,197,94,0.12)]
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
                {vehicleCount}
              </span>{" "}
              vehicles
            </div>


            {/* POINTS */}

            <div
              className="
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
                flex
                items-center
                justify-center
                text-slate-500
                hover:bg-slate-50
                hover:text-[#16295A]
                transition-all
                duration-200
                disabled:opacity-40
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

            onMove={(event) =>
              setViewState(
                event.viewState
              )
            }

            onLoad={
              handleMapLoad
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

            {/* ==================================================
                COLLECTION POINT SOURCE
            ================================================== */}

            <Source
              id="collection-points-source"

              type="geojson"

              data={
                geoJson
              }
            >

              {/* ==================================================
                  OUTER POINT
              ================================================== */}

              <Layer
                id="collection-points-halo"

                type="circle"

                paint={{

                  /*
                   * Thick outer ring.
                   */

                  "circle-radius": [
                    "interpolate",

                    [
                      "linear"
                    ],

                    [
                      "zoom"
                    ],

                    10,
                    5,

                    14,
                    7,

                    18,
                    10,
                  ],

                  "circle-color":
                    "#ffffff",

                  "circle-opacity":
                    0.95,

                  "circle-stroke-width":
                    0,

                }}
              />


              {/* ==================================================
                  REGISTERED POINT
              ================================================== */}

              <Layer
                id="collection-points"

                type="circle"

                paint={{

                  /*
                   * Thick visible point.
                   */

                  "circle-radius": [
                    "interpolate",

                    [
                      "linear"
                    ],

                    [
                      "zoom"
                    ],

                    10,
                    3.8,

                    12,
                    5,

                    14,
                    6.5,

                    16,
                    8,

                    18,
                    10,
                  ],

                  /*
                   * All points are registered.
                   */

                  "circle-color":
                    "#22c55e",

                  "circle-opacity":
                    0.92,

                  /*
                   * White border makes dense GPS
                   * points distinguishable.
                   */

                  "circle-stroke-color":
                    "#ffffff",

                  "circle-stroke-width":
                    1.8,

                  "circle-stroke-opacity":
                    1,

                }}
              />


              {/* ==================================================
                  HOVER EFFECT
              ================================================== */}

              <Layer
                id="collection-points-hover"

                type="circle"

                filter={[
                  "==",

                  [
                    "id"
                  ],

                  "__hover__",
                ]}

                paint={{

                  "circle-radius":
                    11,

                  "circle-color":
                    "#16a34a",

                  "circle-opacity":
                    0.22,

                  "circle-stroke-color":
                    "#16a34a",

                  "circle-stroke-width":
                    2,

                }}
              />

            </Source>


            {/* ==================================================
                POPUP
            ================================================== */}

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

                  offset={[
                    0,
                    -10,
                  ]}

                  className="
                    collection-point-popup
                  "
                >

                  <div
                    className="
                      w-[290px]
                      max-h-[270px]
                      overflow-y-auto
                      pr-1
                    "
                  >

                    {/* ==================================================
                        POPUP HEADER
                    ================================================== */}

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-3
                        pb-2
                        mb-2
                        border-b
                        border-slate-100
                      "
                    >

                      <div>

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
                              shadow-[0_0_0_3px_rgba(34,197,94,0.12)]
                            "
                          />

                          <span
                            className="
                              text-[12px]
                              font-semibold
                              text-[#16295A]
                            "
                          >
                            Registered Point
                          </span>

                        </div>

                        <p
                          className="
                            text-[10px]
                            text-slate-400
                            mt-1
                          "
                        >
                          Collection telemetry
                        </p>

                      </div>

                    </div>


                    {/* ==================================================
                        LOCATION
                    ================================================== */}

                    <div
                      className="
                        grid
                        grid-cols-2
                        gap-2
                        mb-3
                      "
                    >

                      <div
                        className="
                          rounded-lg
                          bg-slate-50
                          px-2.5
                          py-2
                        "
                      >

                        <p
                          className="
                            text-[9px]
                            uppercase
                            tracking-wide
                            text-slate-400
                          "
                        >
                          Latitude
                        </p>

                        <p
                          className="
                            text-[11px]
                            font-medium
                            text-slate-700
                            mt-0.5
                          "
                        >
                          {Number(
                            hoveredPoint.latitude
                          ).toFixed(7)}
                        </p>

                      </div>


                      <div
                        className="
                          rounded-lg
                          bg-slate-50
                          px-2.5
                          py-2
                        "
                      >

                        <p
                          className="
                            text-[9px]
                            uppercase
                            tracking-wide
                            text-slate-400
                          "
                        >
                          Longitude
                        </p>

                        <p
                          className="
                            text-[11px]
                            font-medium
                            text-slate-700
                            mt-0.5
                          "
                        >
                          {Number(
                            hoveredPoint.longitude
                          ).toFixed(7)}
                        </p>

                      </div>

                    </div>


                    {/* ==================================================
                        VEHICLE
                    ================================================== */}

                    <div
                      className="
                        mb-3
                        rounded-lg
                        border
                        border-slate-100
                        p-2.5
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          mb-1
                        "
                      >

                        <span
                          className="
                            text-[9px]
                            uppercase
                            tracking-wide
                            text-slate-400
                          "
                        >
                          Vehicle
                        </span>

                        <span
                          className="
                            text-[11px]
                            font-semibold
                            text-[#16295A]
                          "
                        >
                          {
                            hoveredPoint.vehicleNumber
                          }
                        </span>

                      </div>


                      <div
                        className="
                          flex
                          items-center
                          justify-between
                        "
                      >

                        <span
                          className="
                            text-[9px]
                            uppercase
                            tracking-wide
                            text-slate-400
                          "
                        >
                          Point
                        </span>

                        <span
                          className="
                            text-[10px]
                            text-slate-600
                          "
                        >
                          #
                          {Number(
                            hoveredPoint.pointIndex
                          ) + 1}
                        </span>

                      </div>

                    </div>


                    {/* ==================================================
                        COMPLETE TELEMETRY DATA
                    ================================================== */}

                    <div>

                      <p
                        className="
                          text-[9px]
                          uppercase
                          tracking-wide
                          font-semibold
                          text-slate-400
                          mb-2
                        "
                      >
                        Telemetry Data
                      </p>


                      <div
                        className="
                          space-y-1
                        "
                      >

                        {Object.entries(
                          hoveredPoint.data || {}
                        ).map(
                          ([
                            key,
                            value,
                          ]) => {

                            /*
                             * Don't duplicate coordinates because
                             * they are already shown above.
                             */

                            if (
                              key ===
                                "latitude" ||
                              key ===
                                "longitude"
                            ) {

                              return null;

                            }


                            return (

                              <div
                                key={
                                  key
                                }
                                className="
                                  flex
                                  items-start
                                  justify-between
                                  gap-3
                                  py-1
                                  border-b
                                  border-slate-50
                                "
                              >

                                <span
                                  className="
                                    text-[9px]
                                    text-slate-400
                                    shrink-0
                                  "
                                >
                                  {formatFieldName(
                                    key
                                  )}
                                </span>


                                <span
                                  className="
                                    text-[9px]
                                    font-medium
                                    text-slate-700
                                    text-right
                                    break-all
                                  "
                                >
                                  {formatValue(
                                    value
                                  )}
                                </span>

                              </div>

                            );

                          }
                        )}

                      </div>

                    </div>

                  </div>

                </Popup>

              )}


            {/* ==================================================
                MAP NAVIGATION
            ================================================== */}

            <NavigationControl
              position="bottom-right"
              showCompass={false}
              showZoom={false}
            />

          </Map>


          {/* ==================================================
              CUSTOM ZOOM CONTROLS
          ================================================== */}

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
                onClick={
                  zoomIn
                }

                className="
                  w-9
                  h-9
                  flex
                  items-center
                  justify-center
                  border-b
                  border-slate-100
                  hover:bg-slate-50
                  transition-colors
                  duration-300
                "
              >

                <Plus
                  size={16}
                  className="
                    text-slate-600
                  "
                />

              </button>


              <button
                onClick={
                  zoomOut
                }

                className="
                  w-9
                  h-9
                  flex
                  items-center
                  justify-center
                  hover:bg-slate-50
                  transition-colors
                  duration-300
                "
              >

                <Minus
                  size={16}
                  className="
                    text-slate-600
                  "
                />

              </button>

            </div>

          </div>


          {/* ==================================================
              LOADING
          ================================================== */}

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


          {/* ==================================================
              ERROR
          ================================================== */}

          {!loading &&
            error && (

              <div
                className="
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                  z-[4]
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


          {/* ==================================================
              EMPTY STATE
          ================================================== */}

          {!loading &&
            !error &&
            geoJson.features.length === 0 && (

              <div
                className="
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                  z-[4]
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
                    shadow-lg
                    border
                    border-slate-100
                    text-center
                  "
                >

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
                    No GPS telemetry is available
                    for this ward today.
                  </p>

                </div>

              </div>

            )}

        </div>

      </div>

    </section>

  );

}