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
        "raster-opacity": 0.82,
      },
    },
  ],
};


/* ==========================================================
   SAFE VALUE
========================================================== */

function formatValue(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
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
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (char) =>
      char.toUpperCase()
    );
}


/* ==========================================================
   NORMALIZE WARD
========================================================== */

function normalizeWardNumber(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const match =
    String(value).match(/\d+/);

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
   NORMALIZE DATE
========================================================== */

/*
 * IMPORTANT:
 *
 * Date comes from the Header.
 *
 * WasteGenMap does NOT generate today's date.
 *
 * The parent/Header should pass:
 *
 * selectedDate="2026-08-17"
 *
 * or another dynamic date.
 */

function normalizeDate(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const stringValue =
    String(value).trim();

  /*
   * Already YYYY-MM-DD
   */

  if (
    /^\d{4}-\d{2}-\d{2}$/.test(
      stringValue
    )
  ) {
    return stringValue;
  }

  /*
   * DD Mon YYYY
   *
   * Example:
   * 17 Aug 2026
   */

  const match =
    stringValue.match(
      /^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/
    );

  if (match) {
    const day =
      String(match[1]).padStart(
        2,
        "0"
      );

    const monthName =
      match[2].toLowerCase();

    const year =
      match[3];

    const months = {
      jan: "01",
      january: "01",
      feb: "02",
      february: "02",
      mar: "03",
      march: "03",
      apr: "04",
      april: "04",
      may: "05",
      jun: "06",
      june: "06",
      jul: "07",
      july: "07",
      aug: "08",
      august: "08",
      sep: "09",
      september: "09",
      oct: "10",
      october: "10",
      nov: "11",
      november: "11",
      dec: "12",
      december: "12",
    };

    const month =
      months[monthName];

    if (month) {
      return `${year}-${month}-${day}`;
    }
  }

  /*
   * Try normal Date parsing.
   */

  const parsed =
    new Date(stringValue);

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
      ).padStart(2, "0");

    const day =
      String(
        parsed.getDate()
      ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  return stringValue;
}


/* ==========================================================
   EXTRACT VEHICLES
========================================================== */

/*
 * Backend may return:
 *
 * vehicles: {
 *   KA05AB1237: {...}
 * }
 *
 * OR:
 *
 * vehicles: [
 *   {
 *     vehicleNumber: "KA05AB1237",
 *     points: [...]
 *   }
 * ]
 */

function extractVehicles(vehicles) {
  if (!vehicles) {
    return [];
  }

  /*
   * ARRAY
   */

  if (Array.isArray(vehicles)) {
    return vehicles.map(
      (vehicle, index) => ({
        vehicle,
        vehicleKey:
          vehicle?.vehicleNumber ||
          vehicle?.vehicle_number ||
          vehicle?.vehicleNo ||
          vehicle?.vehicle_no ||
          vehicle?.registrationNumber ||
          vehicle?.registration_number ||
          vehicle?.vehicle ||
          `vehicle-${index}`,
      })
    );
  }

  /*
   * OBJECT
   */

  if (
    typeof vehicles ===
    "object"
  ) {
    return Object.entries(
      vehicles
    ).map(
      ([
        vehicleKey,
        vehicle,
      ]) => ({
        vehicle,
        vehicleKey,
      })
    );
  }

  return [];
}


/* ==========================================================
   EXTRACT POINTS
========================================================== */

function extractPoints(vehicle) {
  if (!vehicle) {
    return [];
  }

  /*
   * Most likely structure
   */

  if (
    Array.isArray(
      vehicle.points
    )
  ) {
    return vehicle.points;
  }

  /*
   * Alternate names
   */

  if (
    Array.isArray(
      vehicle.gpsPoints
    )
  ) {
    return vehicle.gpsPoints;
  }

  if (
    Array.isArray(
      vehicle.gps_points
    )
  ) {
    return vehicle.gps_points;
  }

  if (
    Array.isArray(
      vehicle.telemetry
    )
  ) {
    return vehicle.telemetry;
  }

  if (
    Array.isArray(
      vehicle.records
    )
  ) {
    return vehicle.records;
  }

  if (
    Array.isArray(
      vehicle.data
    )
  ) {
    return vehicle.data;
  }

  return [];
}


/* ==========================================================
   EXTRACT LATITUDE
========================================================== */

function extractLatitude(point) {
  if (!point) {
    return null;
  }

  const candidates = [
    point.latitude,
    point.lat,
    point.Latitude,
    point.LATITUDE,

    point.data?.latitude,
    point.data?.lat,
    point.data?.Latitude,

    point.telemetry?.latitude,
    point.telemetry?.lat,

    point.location?.latitude,
    point.location?.lat,

    point.location?.coordinates?.[1],
  ];

  for (
    const candidate of candidates
  ) {
    if (
      candidate !== null &&
      candidate !== undefined &&
      candidate !== ""
    ) {
      const number =
        Number(candidate);

      if (
        Number.isFinite(
          number
        )
      ) {
        return number;
      }
    }
  }

  return null;
}


/* ==========================================================
   EXTRACT LONGITUDE
========================================================== */

function extractLongitude(point) {
  if (!point) {
    return null;
  }

  const candidates = [
    point.longitude,
    point.lng,
    point.lon,
    point.Longitude,
    point.LONGITUDE,

    point.data?.longitude,
    point.data?.lng,
    point.data?.lon,
    point.data?.Longitude,

    point.telemetry?.longitude,
    point.telemetry?.lng,

    point.location?.longitude,
    point.location?.lng,

    point.location?.coordinates?.[0],
  ];

  for (
    const candidate of candidates
  ) {
    if (
      candidate !== null &&
      candidate !== undefined &&
      candidate !== ""
    ) {
      const number =
        Number(candidate);

      if (
        Number.isFinite(
          number
        )
      ) {
        return number;
      }
    }
  }

  return null;
}


/* ==========================================================
   EXTRACT TELEMETRY
========================================================== */

function extractTelemetry(point) {
  if (!point) {
    return {};
  }

  /*
   * If backend wraps the actual
   * telemetry row inside data.
   */

  if (
    point.data &&
    typeof point.data ===
      "object" &&
    !Array.isArray(
      point.data
    )
  ) {
    return point.data;
  }

  if (
    point.telemetry &&
    typeof point.telemetry ===
      "object" &&
    !Array.isArray(
      point.telemetry
    )
  ) {
    return point.telemetry;
  }

  /*
   * Otherwise use the entire
   * point object.
   */

  return point;
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

  /*
   * IMPORTANT:
   * Date must come from Header.
   */

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
     HEADER WARD
  ======================================================== */

  const selectedWard =
    selectedWardProp ??
    wardNoProp;

  const normalizedWard =
    useMemo(
      () =>
        normalizeWardNumber(
          selectedWard
        ),
      [selectedWard]
    );


  /* ========================================================
     HEADER DATE
  ======================================================== */

  const currentDate =
    useMemo(
      () =>
        normalizeDate(
          selectedDateProp
        ),
      [selectedDateProp]
    );


  /* ========================================================
     GSAP
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
     FETCH DATA
  ======================================================== */

  const fetchCollectionPoints =
    useCallback(
      async () => {
        /*
         * NO WARD
         */

        if (!normalizedWard) {
          setMonitoringData(null);

          setError(
            "Please select a ward from the header."
          );

          setLoading(false);

          return;
        }


        /*
         * NO DATE
         *
         * This is intentional.
         *
         * We DO NOT generate today's date.
         */

        if (!currentDate) {
          setMonitoringData(null);

          setError(
            "Please select a date from the header."
          );

          setLoading(false);

          return;
        }


        setLoading(true);

        setError("");

        setHoveredPoint(null);

        setHoverPosition(null);


        try {
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


          let result;

          try {
            result =
              await response.json();
          } catch {
            throw new Error(
              "Backend returned invalid JSON."
            );
          }


          if (!response.ok) {
            throw new Error(
              result?.message ||
              `Collection point API returned HTTP ${response.status}`
            );
          }


          if (
            result?.success ===
            false
          ) {
            throw new Error(
              result?.message ||
              "Unable to retrieve collection point data."
            );
          }


          console.log(
            "✅ FULL COLLECTION POINT RESPONSE:",
            result
          );


          console.log(
            "📦 MONITORING DATA:",
            result?.data
          );


          /*
           * STORE
           */

          setMonitoringData(
            result?.data ||
            null
          );
        } catch (
          requestError
        ) {
          console.error(
            "❌ COLLECTION POINT ERROR:",
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
          setLoading(false);
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
========================================================== */

  const geoJson =
    useMemo(
      () => {
        const features = [];

        if (!monitoringData) {
          return {
            type:
              "FeatureCollection",
            features,
          };
        }


        /*
         * EXTRACT VEHICLES
         */

        const vehicleEntries =
          extractVehicles(
            monitoringData.vehicles
          );


        console.log(
          "🚛 VEHICLE ENTRIES:",
          vehicleEntries.length
        );


        /*
         * LOOP VEHICLES
         */

        vehicleEntries.forEach(
          ({
            vehicle,
            vehicleKey,
          }) => {
            const points =
              extractPoints(
                vehicle
              );


            console.log(
              `📍 ${vehicleKey}:`,
              points.length,
              "points"
            );


            points.forEach(
              (
                point,
                pointIndex
              ) => {
                const latitude =
                  extractLatitude(
                    point
                  );

                const longitude =
                  extractLongitude(
                    point
                  );


                /*
                 * INVALID GPS
                 */

                if (
                  latitude === null ||
                  longitude === null
                ) {
                  return;
                }


                /*
                 * INVALID 0,0
                 */

                if (
                  latitude === 0 &&
                  longitude === 0
                ) {
                  return;
                }


                /*
                 * BASIC GPS RANGE
                 */

                if (
                  latitude < -90 ||
                  latitude > 90 ||
                  longitude < -180 ||
                  longitude > 180
                ) {
                  return;
                }


                const telemetry =
                  extractTelemetry(
                    point
                  );


                const feature = {
                  type:
                    "Feature",

                  id:
                    `collection-point-${features.length}`,

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
                      vehicleKey,

                    vehicleTableName:
                      vehicle
                        ?.vehicle_table_name ||
                      vehicle
                        ?.vehicleTableName ||
                      vehicle
                        ?.tableName ||
                      "",

                    wardNo:
                      vehicle?.ward_no ??
                      vehicle?.wardNo ??
                      normalizedWard,

                    pointIndex,

                    telemetry:
                      JSON.stringify(
                        telemetry
                      ),
                  },
                };


                features.push(
                  feature
                );
              }
            );
          }
        );


        console.log(
          "🟢 GEOJSON FEATURES CREATED:",
          features.length
        );


        /*
         * VERY IMPORTANT DEBUG
         */

        if (
          features.length > 0
        ) {
          console.log(
            "📍 FIRST GPS FEATURE:",
            features[0]
          );

          console.log(
            "📍 FIRST GPS COORDINATES:",
            features[0]
              ?.geometry
              ?.coordinates
          );
        }


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
     FIT MAP TO POINTS
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


    console.log(
      "🗺️ MAP FIT COORDINATES:",
      coordinates.length
    );


    if (
      coordinates.length ===
      0
    ) {
      return;
    }


    /*
     * ONE POINT
     */

    if (
      coordinates.length ===
      1
    ) {
      map.flyTo({
        center:
          coordinates[0],

        zoom:
          17,

        duration:
          1200,
      });

      return;
    }


    /*
     * BOUNDS
     */

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
        lng,
        lat,
      ]) => {
        const longitude =
          Number(lng);

        const latitude =
          Number(lat);


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


    /*
     * Prevent zero-size bounds.
     */

    if (
      minLng === maxLng
    ) {
      minLng -= 0.001;
      maxLng += 0.001;
    }

    if (
      minLat === maxLat
    ) {
      minLat -= 0.001;
      maxLat += 0.001;
    }


    /*
     * FIT
     */

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
        padding: 70,

        maxZoom:
          17,

        duration:
          1200,

        essential:
          true,
      }
    );
  }, [
    geoJson,
  ]);


  /* ========================================================
     HOVER SNAP
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
         * Larger snap area.
         */

        const SNAP_DISTANCE =
          20;


        let nearbyFeatures =
          [];


        try {
          nearbyFeatures =
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
        } catch {
          nearbyFeatures =
            [];
        }


        if (
          !nearbyFeatures ||
          nearbyFeatures.length ===
            0
        ) {
          setHoveredPoint(null);

          setHoverPosition(null);

          return;
        }


        /*
         * FIND CLOSEST
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
          !nearestFeature
        ) {
          return;
        }


        const coordinates =
          nearestFeature
            .geometry
            .coordinates;


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
            Number(
              nearestFeature
                ?.properties
                ?.pointIndex
            ) || 0,

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
    useCallback(() => {
      setHoveredPoint(null);

      setHoverPosition(null);
    }, []);


  /* ========================================================
     ZOOM
  ======================================================== */

  function zoomIn() {
    const map =
      mapRef.current?.getMap();

    if (!map) {
      return;
    }

    map.zoomIn({
      duration: 300,
    });
  }


  function zoomOut() {
    const map =
      mapRef.current?.getMap();

    if (!map) {
      return;
    }

    map.zoomOut({
      duration: 300,
    });
  }


  /* ========================================================
     COUNTS
  ======================================================== */

  const vehicleCount =
    Number(
      monitoringData
        ?.vehicle_count
    ) || 0;

  /*
   * Use actual rendered features
   * when available.
   *
   * This makes the UI expose if
   * backend points and rendered
   * points differ.
   */

  const pointCount =
    geoJson.features.length ||
    Number(
      monitoringData
        ?.point_count
    ) ||
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
              title="Refresh collection points"
              className="
                w-10
                h-10
                rounded-xl
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
                size={15}
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
            h-[390px]
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
                GPS SOURCE
            ================================================= */}

            <Source
              id="collection-points-source"
              type="geojson"
              data={geoJson}
            >
              {/* =================================================
                  OUTER WHITE HALO
              ================================================= */}

              <Layer
                id="collection-points-halo"
                type="circle"
                source="collection-points-source"
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


              {/* =================================================
                  GREEN GPS POINTS
              ================================================= */}

              <Layer
                id="collection-points"
                type="circle"
                source="collection-points-source"
                paint={{
                  /*
                   * LARGE / THICK POINTS
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

                    15,
                    10,

                    16,
                    11,

                    18,
                    13,
                  ],

                  /*
                   * BRIGHT REGISTERED GREEN
                   */

                  "circle-color":
                    "#00C853",

                  "circle-opacity":
                    1,

                  /*
                   * WHITE BORDER
                   */

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
                <Layer
                  id="collection-point-hover-ring"
                  type="circle"
                  source="collection-point-hover-source"
                  paint={{
                    "circle-radius":
                      17,

                    "circle-color":
                      "#00C853",

                    "circle-opacity":
                      0.12,

                    "circle-stroke-color":
                      "#00A844",

                    "circle-stroke-width":
                      2.5,

                    "circle-stroke-opacity":
                      0.9,
                  }}
                />

                <Layer
                  id="collection-point-hover-center"
                  type="circle"
                  source="collection-point-hover-source"
                  paint={{
                    "circle-radius":
                      8,

                    "circle-color":
                      "#00C853",

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

                  offset={18}

                  className="
                    collection-point-popup
                  "
                >
                  <div
                    className="
                      w-[310px]
                      max-w-[310px]
                      max-h-[300px]
                      overflow-y-auto
                      pr-1
                    "
                  >
                    {/* HEADER */}

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


                    {/* LOCATION */}

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
                            {Number(
                              hoveredPoint.latitude
                            ).toFixed(7)}
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
                            {Number(
                              hoveredPoint.longitude
                            ).toFixed(7)}
                          </p>
                        </div>
                      </div>
                    </div>


                    {/* BASIC INFORMATION */}

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


                    {/* TELEMETRY */}

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
              ZOOM CONTROLS
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
                className="
                  w-12
                  h-12
                  flex
                  items-center
                  justify-center
                  border-b
                  border-slate-100
                  text-slate-700
                  hover:bg-slate-50
                  transition-colors
                "
              >
                <Plus
                  size={19}
                />
              </button>

              <button
                type="button"
                onClick={
                  zoomOut
                }
                className="
                  w-12
                  h-12
                  flex
                  items-center
                  justify-center
                  text-slate-700
                  hover:bg-slate-50
                  transition-colors
                "
              >
                <Minus
                  size={19}
                />
              </button>
            </div>
          </div>


          {/* =================================================
              WARD STATUS
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
                      w-2.5
                      h-2.5
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
                    No GPS points could be plotted
                  </p>

                  <p
                    className="
                      text-[10px]
                      text-slate-400
                      mt-1
                    "
                  >
                    The API returned data, but no valid
                    latitude/longitude pairs were found.
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
            FOOTER
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