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

import { useFilters } from "../../contexts/FilterContext";

import "maplibre-gl/dist/maplibre-gl.css";


/* ==========================================================
   API CONFIG
========================================================== */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://sewac-main.onrender.com";


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

  if (
    typeof value === "object"
  ) {
    const possibleValues = [
      value.ward_no,
      value.wardNo,
      value.ward_number,
      value.wardNumber,
      value.ward_id,
      value.id,
      value.value,
      value.ward_name,
      value.name,
    ];

    for (const candidate of possibleValues) {
      const normalized =
        normalizeWardNumber(candidate);

      if (normalized !== null) {
        return normalized;
      }
    }

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

function normalizeHeaderDate(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  if (value instanceof Date) {
    if (
      Number.isNaN(
        value.getTime()
      )
    ) {
      return null;
    }

    return formatDateObject(value);
  }

  const raw =
    String(value)
      .trim();

  let match =
    raw.match(
      /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/
    );

  if (match) {
    return [
      match[1],
      String(match[2]).padStart(2, "0"),
      String(match[3]).padStart(2, "0"),
    ].join("-");
  }

  match =
    raw.match(
      /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/
    );

  if (match) {
    return [
      match[3],
      String(match[2]).padStart(2, "0"),
      String(match[1]).padStart(2, "0"),
    ].join("-");
  }

  match =
    raw.match(
      /^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/
    );

  if (match) {
    const monthMap = {
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
      sept: "09",
      september: "09",

      oct: "10",
      october: "10",

      nov: "11",
      november: "11",

      dec: "12",
      december: "12",
    };

    const month =
      monthMap[
        match[2].toLowerCase()
      ];

    if (month) {
      return [
        match[3],
        month,
        String(match[1]).padStart(2, "0"),
      ].join("-");
    }
  }

  const parsed =
    new Date(raw);

  if (
    !Number.isNaN(
      parsed.getTime()
    )
  ) {
    return formatDateObject(parsed);
  }

  return null;
}


/* ==========================================================
   FORMAT DATE OBJECT
========================================================== */

function formatDateObject(date) {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


/* ==========================================================
   FIND HEADER DATE
========================================================== */

function findHeaderDate() {
  if (
    typeof document ===
    "undefined"
  ) {
    return null;
  }

  const buttons =
    Array.from(
      document.querySelectorAll(
        "header button"
      )
    );

  for (const button of buttons) {
    const text =
      button.textContent
        ?.replace(/\s+/g, " ")
        .trim();

    if (!text) {
      continue;
    }

    const embedded =
      text.match(
        /\b\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4}\b/
      );

    if (embedded) {
      const parsed =
        normalizeHeaderDate(
          embedded[0]
        );

      if (parsed) {
        return parsed;
      }
    }

    const normalized =
      normalizeHeaderDate(text);

    if (normalized) {
      return normalized;
    }
  }

  const headers =
    Array.from(
      document.querySelectorAll(
        "header"
      )
    );

  for (const header of headers) {
    const text =
      header.textContent
        ?.replace(/\s+/g, " ")
        .trim();

    if (!text) {
      continue;
    }

    const match =
      text.match(
        /\b\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4}\b/
      );

    if (!match) {
      continue;
    }

    const parsed =
      normalizeHeaderDate(
        match[0]
      );

    if (parsed) {
      return parsed;
    }
  }

  return null;
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
   POPUP ROW
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
   NUMBER HELPER
========================================================== */

function toFiniteNumber(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number =
    Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}


/* ==========================================================
   FIND COORDINATES FROM ANY POINT SHAPE
========================================================== */

/*
 * This is the important fix.
 *
 * The old code only checked:
 *
 * vehicle.points
 *
 * This function supports all common backend
 * representations.
 */

function extractCoordinates(point) {
  if (!point) {
    return null;
  }


  /* --------------------------------------------------------
     ARRAY COORDINATES
     [longitude, latitude]
  -------------------------------------------------------- */

  if (
    Array.isArray(point) &&
    point.length >= 2
  ) {
    const first =
      toFiniteNumber(point[0]);

    const second =
      toFiniteNumber(point[1]);

    if (
      first !== null &&
      second !== null
    ) {
      /*
       * GeoJSON convention:
       * [longitude, latitude]
       */

      if (
        Math.abs(first) <= 180 &&
        Math.abs(second) <= 90
      ) {
        return {
          longitude: first,
          latitude: second,
        };
      }
    }
  }


  /* --------------------------------------------------------
     coordinates: [lng, lat]
  -------------------------------------------------------- */

  if (
    Array.isArray(
      point.coordinates
    ) &&
    point.coordinates.length >= 2
  ) {
    const longitude =
      toFiniteNumber(
        point.coordinates[0]
      );

    const latitude =
      toFiniteNumber(
        point.coordinates[1]
      );

    if (
      longitude !== null &&
      latitude !== null
    ) {
      return {
        longitude,
        latitude,
      };
    }
  }


  /* --------------------------------------------------------
     location.coordinates
  -------------------------------------------------------- */

  if (
    point.location &&
    Array.isArray(
      point.location.coordinates
    ) &&
    point.location.coordinates.length >= 2
  ) {
    const longitude =
      toFiniteNumber(
        point.location.coordinates[0]
      );

    const latitude =
      toFiniteNumber(
        point.location.coordinates[1]
      );

    if (
      longitude !== null &&
      latitude !== null
    ) {
      return {
        longitude,
        latitude,
      };
    }
  }


  /* --------------------------------------------------------
     LATITUDE / LONGITUDE
  -------------------------------------------------------- */

  const latitudeCandidates = [
    point.latitude,
    point.lat,
    point.latitud,
    point.gps_latitude,
    point.gpsLatitude,
    point.latitude_value,
  ];

  const longitudeCandidates = [
    point.longitude,
    point.lng,
    point.lon,
    point.long,
    point.gps_longitude,
    point.gpsLongitude,
    point.longitude_value,
  ];

  let latitude = null;
  let longitude = null;

  for (
    const candidate
    of latitudeCandidates
  ) {
    const value =
      toFiniteNumber(candidate);

    if (value !== null) {
      latitude = value;
      break;
    }
  }

  for (
    const candidate
    of longitudeCandidates
  ) {
    const value =
      toFiniteNumber(candidate);

    if (value !== null) {
      longitude = value;
      break;
    }
  }

  if (
    latitude !== null &&
    longitude !== null
  ) {
    return {
      latitude,
      longitude,
    };
  }


  /* --------------------------------------------------------
     NESTED LOCATION OBJECT
  -------------------------------------------------------- */

  if (
    point.location &&
    typeof point.location ===
      "object"
  ) {
    const nested =
      extractCoordinates(
        point.location
      );

    if (nested) {
      return nested;
    }
  }


  /* --------------------------------------------------------
     NESTED DATA OBJECT
  -------------------------------------------------------- */

  if (
    point.data &&
    typeof point.data ===
      "object"
  ) {
    const nested =
      extractCoordinates(
        point.data
      );

    if (nested) {
      return nested;
    }
  }


  /* --------------------------------------------------------
     NESTED TELEMETRY
  -------------------------------------------------------- */

  if (
    point.telemetry &&
    typeof point.telemetry ===
      "object"
  ) {
    const nested =
      extractCoordinates(
        point.telemetry
      );

    if (nested) {
      return nested;
    }
  }


  return null;
}


/* ==========================================================
   FIND POINT ARRAY INSIDE VEHICLE
========================================================== */

function extractPointArray(vehicle) {
  if (!vehicle) {
    return [];
  }


  /* --------------------------------------------------------
     DIRECT ARRAYS
  -------------------------------------------------------- */

  const possibleArrays = [
    vehicle.points,
    vehicle.gps_points,
    vehicle.gpsPoints,
    vehicle.gps_data,
    vehicle.gpsData,
    vehicle.locations,
    vehicle.location_points,
    vehicle.locationPoints,
    vehicle.coordinates,
    vehicle.records,
    vehicle.records_data,
    vehicle.telemetry,
    vehicle.data?.points,
    vehicle.data?.gps_points,
    vehicle.data?.gpsPoints,
    vehicle.data?.locations,
    vehicle.data?.records,
  ];


  for (
    const candidate
    of possibleArrays
  ) {
    if (
      Array.isArray(candidate) &&
      candidate.length > 0
    ) {
      return candidate;
    }
  }


  /* --------------------------------------------------------
     IF VEHICLE ITSELF IS AN ARRAY
  -------------------------------------------------------- */

  if (
    Array.isArray(vehicle)
  ) {
    return vehicle;
  }


  return [];
}


/* ==========================================================
   NORMALIZE VEHICLES
========================================================== */

/*
 * Supports:
 *
 * vehicles: {
 *   "vehicle1": {...},
 *   "vehicle2": {...}
 * }
 *
 * AND:
 *
 * vehicles: [
 *   {...},
 *   {...}
 * ]
 */

function normalizeVehicles(data) {
  if (!data) {
    return [];
  }


  const vehicleCollection =
    data.vehicles ||
    data.vehicleData ||
    data.vehicle_data ||
    data.trucks ||
    data.vehicleRecords ||
    data.vehicle_records;


  if (
    Array.isArray(
      vehicleCollection
    )
  ) {
    return vehicleCollection.map(
      (vehicle, index) => ({
        vehicleKey:
          vehicle?.vehicleNumber ||
          vehicle?.vehicle_number ||
          vehicle?.vehicleNo ||
          vehicle?.vehicle_no ||
          vehicle?.registrationNumber ||
          vehicle?.registration_number ||
          vehicle?.id ||
          `vehicle-${index + 1}`,

        vehicle,
      })
    );
  }


  if (
    vehicleCollection &&
    typeof vehicleCollection ===
      "object"
  ) {
    return Object.entries(
      vehicleCollection
    ).map(
      ([
        vehicleKey,
        vehicle,
      ]) => ({
        vehicleKey,
        vehicle,
      })
    );
  }


  /*
   * Some APIs return a single vehicle.
   */

  if (
    data.vehicle &&
    typeof data.vehicle ===
      "object"
  ) {
    return [
      {
        vehicleKey:
          data.vehicle.vehicleNumber ||
          data.vehicle.vehicle_number ||
          data.vehicle.id ||
          "vehicle-1",

        vehicle:
          data.vehicle,
      },
    ];
  }


  return [];
}


/* ==========================================================
   GET VEHICLE NAME
========================================================== */

function getVehicleName(
  vehicleKey,
  vehicle
) {
  return (
    vehicle?.vehicleNumber ||
    vehicle?.vehicle_number ||
    vehicle?.vehicleNo ||
    vehicle?.vehicle_no ||
    vehicle?.vehicle_name ||
    vehicle?.vehicleName ||
    vehicle?.registrationNumber ||
    vehicle?.registration_number ||
    vehicleKey ||
    "Vehicle"
  );
}


/* ==========================================================
   EXTRACT ALL GPS POINTS
========================================================== */

/*
 * This converts whatever the backend gives us
 * into one consistent array.
 */

function extractAllGpsPoints(
  monitoringData,
  normalizedWard
) {
  const output = [];


  if (!monitoringData) {
    return output;
  }


  /* --------------------------------------------------------
     VEHICLE BASED DATA
  -------------------------------------------------------- */

  const vehicles =
    normalizeVehicles(
      monitoringData
    );


  vehicles.forEach(
    ({
      vehicleKey,
      vehicle,
    }) => {

      const points =
        extractPointArray(
          vehicle
        );


      points.forEach(
        (
          point,
          pointIndex
        ) => {

          const coordinates =
            extractCoordinates(
              point
            );


          if (!coordinates) {
            return;
          }


          if (
            coordinates.latitude === 0 &&
            coordinates.longitude === 0
          ) {
            return;
          }


          output.push({
            vehicleKey,
            vehicle,
            point,
            pointIndex,
            coordinates,
            wardNo:
              vehicle?.ward_no ??
              vehicle?.wardNo ??
              vehicle?.ward_number ??
              normalizedWard,
          });
        }
      );
    }
  );


  /* --------------------------------------------------------
     TOP LEVEL POINT ARRAYS
  -------------------------------------------------------- */

  const topLevelArrays = [
    monitoringData.points,
    monitoringData.gps_points,
    monitoringData.gpsPoints,
    monitoringData.locations,
    monitoringData.records,
    monitoringData.data?.points,
    monitoringData.data?.gps_points,
    monitoringData.data?.gpsPoints,
    monitoringData.data?.locations,
    monitoringData.data?.records,
  ];


  /*
   * Only use top-level arrays if vehicle extraction
   * didn't already give us the same records.
   */

  if (
    output.length === 0
  ) {

    for (
      const candidate
      of topLevelArrays
    ) {

      if (
        !Array.isArray(candidate)
      ) {
        continue;
      }


      candidate.forEach(
        (
          point,
          index
        ) => {

          const coordinates =
            extractCoordinates(
              point
            );


          if (!coordinates) {
            return;
          }


          if (
            coordinates.latitude === 0 &&
            coordinates.longitude === 0
          ) {
            return;
          }


          output.push({
            vehicleKey:
              point?.vehicleNumber ||
              point?.vehicle_number ||
              point?.vehicleNo ||
              point?.vehicle_no ||
              "Vehicle",

            vehicle:
              point?.vehicle ||
              {},

            point,

            pointIndex:
              index,

            coordinates,

            wardNo:
              point?.ward_no ??
              point?.wardNo ??
              normalizedWard,
          });
        }
      );


      if (
        output.length > 0
      ) {
        break;
      }
    }
  }


  return output;
}


/* ==========================================================
   MAIN COMPONENT
========================================================== */

export default function WasteGenMap({
  wardNo:
    wardNoProp = null,

  selectedWard:
    selectedWardProp = null,

  selectedDate:
    selectedDateProp = null,
}) {

  /* ========================================================
     FILTER CONTEXT
  ======================================================== */

  const {
    selectedWard: contextWard,
  } =
    useFilters();


  /* ========================================================
     REFS
  ======================================================== */

  const sectionRef =
    useRef(null);

  const collectionCardRef =
    useRef(null);

  const mapRef =
    useRef(null);

  const headerObserverRef =
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
    headerDate,
    setHeaderDate,
  ] = useState(
    () =>
      normalizeHeaderDate(
        selectedDateProp
      ) ||
      findHeaderDate()
  );


  const [
    viewState,
    setViewState,
  ] = useState(
    DEFAULT_VIEW_STATE
  );


  /* ========================================================
     RESOLVE WARD
  ======================================================== */

  const selectedWard =
    selectedWardProp ||
    wardNoProp ||
    contextWard;


  const normalizedWard =
    useMemo(
      () =>
        normalizeWardNumber(
          selectedWard
        ),
      [
        selectedWard,
      ]
    );


  /* ========================================================
     RESOLVE DATE
  ======================================================== */

  const currentDate =
    normalizeHeaderDate(
      selectedDateProp
    ) ||
    headerDate;


  /* ========================================================
     WATCH HEADER DATE
  ======================================================== */

  useEffect(() => {

    if (
      selectedDateProp
    ) {
      return;
    }


    const updateHeaderDate =
      () => {

        const detectedDate =
          findHeaderDate();


        if (
          detectedDate &&
          detectedDate !==
            headerDate
        ) {
          console.log(
            "📅 HEADER DATE CHANGED:",
            detectedDate
          );

          setHeaderDate(
            detectedDate
          );
        }
      };


    updateHeaderDate();


    if (
      typeof MutationObserver !==
      "undefined"
    ) {

      const observer =
        new MutationObserver(
          () => {
            updateHeaderDate();
          }
        );


      observer.observe(
        document.body,
        {
          childList: true,
          subtree: true,
          characterData: true,
        }
      );


      headerObserverRef.current =
        observer;


      return () => {
        observer.disconnect();

        headerObserverRef.current =
          null;
      };
    }


    const interval =
      window.setInterval(
        updateHeaderDate,
        500
      );


    return () =>
      window.clearInterval(
        interval
      );

  }, [
    selectedDateProp,
    headerDate,
  ]);


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
          )


          .from(
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
     FETCH COLLECTION POINTS
  ======================================================== */

  const fetchCollectionPoints =
    useCallback(
      async () => {

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
            "================================================"
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
            "================================================"
          );


          const response =
            await fetch(
              url,
              {
                method: "GET",

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
              "Backend returned an invalid JSON response."
            );
          }


          if (
            !response.ok
          ) {
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


          /*
           * IMPORTANT:
           *
           * Don't blindly assume result.data.
           */

          const data =
            result?.data ??
            result;


          console.log(
            "✅ RAW COLLECTION POINT RESPONSE:",
            result
          );


          console.log(
            "📦 NORMALIZED DATA:",
            data
          );


          setMonitoringData(
            data
          );


          const extracted =
            extractAllGpsPoints(
              data,
              normalizedWard
            );


          console.log(
            "📍 EXTRACTED GPS POINTS:",
            extracted.length
          );


          if (
            extracted.length === 0
          ) {

            console.warn(
              "⚠️ API returned GPS counts but no coordinates were found."
            );

            console.warn(
              "⚠️ Inspect the object above under NORMALIZED DATA."
            );
          }


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

          setLoading(false);
        }

      },
      [
        normalizedWard,
        currentDate,
      ]
    );


  /* ========================================================
     FETCH WHEN FILTERS CHANGE
  ======================================================== */

  useEffect(() => {

    fetchCollectionPoints();

  }, [
    fetchCollectionPoints,
  ]);


  /* ========================================================
     EXTRACT GPS RECORDS
  ======================================================== */

  const extractedGpsPoints =
    useMemo(
      () =>
        extractAllGpsPoints(
          monitoringData,
          normalizedWard
        ),
      [
        monitoringData,
        normalizedWard,
      ]
    );


  /* ========================================================
     GEOJSON
  ======================================================== */

  const geoJson =
    useMemo(
      () => {

        const features = [];


        extractedGpsPoints.forEach(
          ({
            vehicleKey,
            vehicle,
            point,
            pointIndex,
            coordinates,
            wardNo,
          }) => {

            const telemetry =
              point?.data ||
              point?.telemetry ||
              point ||
              {};


            features.push({

              type:
                "Feature",

              id:
                `${vehicleKey}-${pointIndex}-${coordinates.longitude}-${coordinates.latitude}`,

              geometry: {

                type:
                  "Point",

                coordinates: [
                  coordinates.longitude,
                  coordinates.latitude,
                ],
              },

              properties: {

                vehicleNumber:
                  getVehicleName(
                    vehicleKey,
                    vehicle
                  ),

                vehicleTableName:
                  vehicle
                    ?.vehicle_table_name ||
                  vehicle
                    ?.vehicleTableName ||
                  vehicle
                    ?.table_name ||
                  vehicle
                    ?.tableName ||
                  "",

                wardNo:
                  wardNo ??
                  normalizedWard,

                pointIndex,

                status:
                  "registered",

                telemetry:
                  safeJSONStringify(
                    telemetry
                  ),
              },
            });
          }
        );


        console.log(
          "🗺️ GEOJSON FEATURES:",
          features.length
        );


        return {

          type:
            "FeatureCollection",

          features,
        };

      },
      [
        extractedGpsPoints,
        normalizedWard,
      ]
    );


  /* ========================================================
     FIT MAP TO GPS DATA
  ======================================================== */

  useEffect(() => {

    if (
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
          (
            feature
          ) =>
            feature?.geometry?.coordinates
        )
        .filter(
          (
            coordinate
          ) =>
            Array.isArray(
              coordinate
            ) &&
            coordinate.length === 2
        );


    if (
      coordinates.length ===
      0
    ) {
      return;
    }


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


    const lngPadding =
      Math.max(
        (
          maxLng -
          minLng
        ) * 0.15,
        0.002
      );


    const latPadding =
      Math.max(
        (
          maxLat -
          minLat
        ) * 0.15,
        0.002
      );


    map.fitBounds(
      [
        [
          minLng -
            lngPadding,

          minLat -
            latPadding,
        ],

        [
          maxLng +
            lngPadding,

          maxLat +
            latPadding,
        ],
      ],
      {
        padding: 45,
        maxZoom: 16,
        duration: 1200,
      }
    );

  }, [
    geoJson,
  ]);


  /* ========================================================
     SNAP TO NEAREST POINT
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


        const SNAP_DISTANCE =
          20;


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

          setHoveredPoint(null);

          setHoverPosition(null);

          return;
        }


        let nearestFeature =
          nearbyFeatures[0];

        let nearestDistance =
          Infinity;


        nearbyFeatures.forEach(
          (feature) => {

            if (
              !feature?.geometry ||
              feature.geometry.type !==
                "Point"
            ) {
              return;
            }


            const coordinates =
              feature.geometry.coordinates;


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
    useCallback(
      () => {

        setHoveredPoint(null);

        setHoverPosition(null);

      },
      []
    );


  /* ========================================================
     ZOOM
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
          duration: 300,
        });

      },
      []
    );


  const zoomOut =
    useCallback(
      () => {

        const map =
          mapRef.current?.getMap();

        if (!map) {
          return;
        }

        map.zoomOut({
          duration: 300,
        });

      },
      []
    );


  /* ========================================================
     COUNTS
  ======================================================== */

  const vehicleCount =
    Number(
      monitoringData?.vehicle_count ??
      monitoringData?.vehicleCount ??
      monitoringData?.vehicles_count
    ) ||
    normalizeVehicles(
      monitoringData
    ).length ||
    0;


  const apiPointCount =
    Number(
      monitoringData?.point_count ??
      monitoringData?.pointCount ??
      monitoringData?.gps_point_count ??
      monitoringData?.gpsPointCount ??
      monitoringData?.total_points ??
      monitoringData?.totalPoints
    ) || 0;


  const pointCount =
    apiPointCount ||
    geoJson.features.length;


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
          CARD
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
              gap-5
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
              width: "100%",
              height: "100%",
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

              {/* WHITE HALO */}

              <Layer
                id="collection-points-halo"
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
                    5,

                    12,
                    6.5,

                    14,
                    8,

                    16,
                    10,

                    18,
                    12,
                  ],

                  "circle-color":
                    "#ffffff",

                  "circle-opacity":
                    0.96,

                }}
              />


              {/* REGISTERED POINT */}

              <Layer
                id="collection-points"
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
                    4.5,

                    11,
                    5,

                    12,
                    6,

                    14,
                    7.5,

                    16,
                    9,

                    18,
                    11,
                  ],

                  "circle-color":
                    "#22c55e",

                  "circle-opacity":
                    0.96,

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
                HOVER SOURCE
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

                          hoverPosition
                            .longitude,

                          hoverPosition
                            .latitude,

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
                  paint={{

                    "circle-radius":
                      14,

                    "circle-color":
                      "#22c55e",

                    "circle-opacity":
                      0.14,

                    "circle-stroke-color":
                      "#16a34a",

                    "circle-stroke-width":
                      2,

                    "circle-stroke-opacity":
                      0.9,

                  }}
                />


                <Layer
                  id="collection-point-hover-center"
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
                    hoverPosition
                      .longitude
                  }

                  latitude={
                    hoverPosition
                      .latitude
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
                      max-h-[280px]
                      overflow-y-auto
                      pr-1
                    "
                  >

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
                            hoveredPoint
                              .vehicleNumber
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
                                hoveredPoint
                                  .latitude
                              ).toFixed(7)
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
                                hoveredPoint
                                  .longitude
                              ).toFixed(7)
                            }
                          </p>

                        </div>

                      </div>

                    </div>


                    <div
                      className="
                        mb-2.5
                      "
                    >

                      <PopupDataRow
                        label="Ward"
                        value={
                          hoveredPoint
                            .wardNo
                        }
                      />

                      <PopupDataRow
                        label="Vehicle Table"
                        value={
                          hoveredPoint
                            .vehicleTableName
                        }
                      />

                      <PopupDataRow
                        label="Point Index"
                        value={
                          Number(
                            hoveredPoint
                              .pointIndex
                          ) + 1
                        }
                      />

                      <PopupDataRow
                        label="Status"
                        value="Registered"
                      />

                      <PopupDataRow
                        label="Date"
                        value={
                          currentDate
                        }
                      />

                    </div>


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
                          RECORD
                        </span>

                      </div>


                      {hoveredPoint.data &&
                        Object.keys(
                          hoveredPoint.data
                        ).length > 0 ? (

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
                                key={key}
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
                onClick={zoomIn}
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
                onClick={zoomOut}
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
              WARD STATUS
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
                    No GPS coordinates found
                  </p>


                  <p
                    className="
                      text-[10px]
                      text-slate-400
                      mt-1
                    "
                  >
                    The API returned {pointCount}{" "}
                    points, but no valid latitude
                    and longitude fields could be
                    extracted.
                  </p>

                </div>

              </div>

            )}


          {/* =================================================
              NO HEADER SELECTION
          ================================================= */}

          {!loading &&
            (
              !normalizedWard ||
              !currentDate
            ) && (

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
                    Select a ward and date
                  </p>


                  <p
                    className="
                      text-[10px]
                      text-slate-400
                      mt-1
                    "
                  >
                    Choose the ward and date
                    from the Header.
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


/* ==========================================================
   SAFE JSON STRINGIFY
========================================================== */

function safeJSONStringify(value) {
  try {

    return JSON.stringify(
      value,
      (
        key,
        currentValue
      ) => {

        if (
          typeof currentValue ===
          "bigint"
        ) {
          return String(
            currentValue
          );
        }

        return currentValue;
      }
    );

  } catch {

    return "{}";
  }
}