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
   MAP STYLE
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
   STORAGE KEYS
========================================================== */

const HEADER_WARD_KEYS = [
  "selectedWard",
  "selectedWardNo",
  "wardNo",
  "ward",
  "selected_ward",
  "headerWardNo",
];

const HEADER_DATE_KEYS = [
  "selectedDate",
  "dashboardDate",
  "headerDate",
  "date",
  "selected_date",
  "dashboard_date",
];


/* ==========================================================
   GET STORED VALUE
========================================================== */

function getStoredValue(keys) {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  for (
    const key of keys
  ) {
    try {
      const value =
        window.localStorage.getItem(
          key
        );

      if (
        value !== null &&
        value !== undefined &&
        value !== ""
      ) {
        return value;
      }
    } catch {
      // Ignore.
    }
  }

  for (
    const key of keys
  ) {
    try {
      const value =
        window.sessionStorage.getItem(
          key
        );

      if (
        value !== null &&
        value !== undefined &&
        value !== ""
      ) {
        return value;
      }
    } catch {
      // Ignore.
    }
  }

  return null;
}


/* ==========================================================
   WARD NORMALIZER
========================================================== */

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

  if (
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    const candidates = [
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

    for (
      const candidate of
      candidates
    ) {
      const normalized =
        normalizeWardNumber(
          candidate
        );

      if (
        normalized !== null
      ) {
        return normalized;
      }
    }

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
   DATE FORMAT
========================================================== */

function formatDateObject(
  date
) {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${year}-${month}-${day}`;
}


/* ==========================================================
   VALIDATE DATE
========================================================== */

function isReasonableDate(
  value
) {
  if (!value) {
    return false;
  }

  const match =
    String(value).match(
      /^(\d{4})-(\d{2})-(\d{2})$/
    );

  if (!match) {
    return false;
  }

  const year =
    Number(match[1]);

  const month =
    Number(match[2]);

  const day =
    Number(match[3]);

  /*
   * Prevent stale garbage dates such as:
   *
   * 2001-01-05
   *
   * from reaching the backend.
   */

  if (
    year < 2020 ||
    year > 2100
  ) {
    return false;
  }

  if (
    month < 1 ||
    month > 12
  ) {
    return false;
  }

  if (
    day < 1 ||
    day > 31
  ) {
    return false;
  }

  return true;
}


/* ==========================================================
   STRICT DATE NORMALIZER
========================================================== */

function normalizeHeaderDate(
  value
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  if (
    value instanceof Date
  ) {
    if (
      Number.isNaN(
        value.getTime()
      )
    ) {
      return null;
    }

    const formatted =
      formatDateObject(
        value
      );

    return isReasonableDate(
      formatted
    )
      ? formatted
      : null;
  }

  let raw =
    String(value)
      .trim();

  /*
   * Remove accidental JSON quotes.
   */

  raw =
    raw.replace(
      /^["']|["']$/g,
      ""
    );

  /*
   * YYYY-MM-DD
   */

  let match =
    raw.match(
      /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/
    );

  if (match) {
    const formatted =
      [
        match[1],

        String(
          match[2]
        ).padStart(
          2,
          "0"
        ),

        String(
          match[3]
        ).padStart(
          2,
          "0"
        ),
      ].join("-");

    return isReasonableDate(
      formatted
    )
      ? formatted
      : null;
  }

  /*
   * DD-MM-YYYY
   *
   * DD/MM/YYYY
   */

  match =
    raw.match(
      /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/
    );

  if (match) {
    const formatted =
      [
        match[3],

        String(
          match[2]
        ).padStart(
          2,
          "0"
        ),

        String(
          match[1]
        ).padStart(
          2,
          "0"
        ),
      ].join("-");

    return isReasonableDate(
      formatted
    )
      ? formatted
      : null;
  }

  /*
   * DD MON YYYY
   */

  match =
    raw.match(
      /^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/
    );

  if (match) {
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
      months[
        match[2].toLowerCase()
      ];

    if (month) {
      const formatted =
        [
          match[3],

          month,

          String(
            match[1]
          ).padStart(
            2,
            "0"
          ),
        ].join("-");

      return isReasonableDate(
        formatted
      )
        ? formatted
        : null;
    }
  }

  /*
   * IMPORTANT:
   *
   * DO NOT use:
   *
   * new Date(raw)
   *
   * here.
   *
   * That was one of the reasons
   * strange dates could reach the
   * backend.
   */

  return null;
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

  /*
   * Search buttons first.
   */

  const buttons =
    Array.from(
      document.querySelectorAll(
        "header button"
      )
    );

  for (
    const button of buttons
  ) {
    const text =
      button.textContent
        ?.replace(
          /\s+/g,
          " "
        )
        .trim();

    if (!text) {
      continue;
    }

    /*
     * Exact date formats.
     */

    const patterns = [
      /\b\d{4}[-/]\d{1,2}[-/]\d{1,2}\b/,
      /\b\d{1,2}[-/]\d{1,2}[-/]\d{4}\b/,
      /\b\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4}\b/,
    ];

    for (
      const pattern of
      patterns
    ) {
      const match =
        text.match(
          pattern
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
  }

  /*
   * Search entire header as fallback.
   */

  const headers =
    Array.from(
      document.querySelectorAll(
        "header"
      )
    );

  for (
    const header of headers
  ) {
    const text =
      header.textContent
        ?.replace(
          /\s+/g,
          " "
        )
        .trim();

    if (!text) {
      continue;
    }

    const patterns = [
      /\b\d{4}[-/]\d{1,2}[-/]\d{1,2}\b/,
      /\b\d{1,2}[-/]\d{1,2}[-/]\d{4}\b/,
      /\b\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4}\b/,
    ];

    for (
      const pattern of
      patterns
    ) {
      const match =
        text.match(
          pattern
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
  }

  return null;
}


/* ==========================================================
   COORDINATE HELPERS
========================================================== */

function validLatitude(
  value
) {
  const number =
    Number(value);

  return (
    Number.isFinite(
      number
    ) &&
    number >= -90 &&
    number <= 90
  );
}


function validLongitude(
  value
) {
  const number =
    Number(value);

  return (
    Number.isFinite(
      number
    ) &&
    number >= -180 &&
    number <= 180
  );
}


/* ==========================================================
   EXTRACT COORDINATES
========================================================== */

function extractCoordinates(
  point
) {
  if (!point) {
    return null;
  }

  /*
   * --------------------------------------------------------
   * DIRECT LATITUDE / LONGITUDE
   * --------------------------------------------------------
   */

  const directLatitude =
    Number(
      point.latitude
    );

  const directLongitude =
    Number(
      point.longitude
    );

  if (
    validLatitude(
      directLatitude
    ) &&
    validLongitude(
      directLongitude
    )
  ) {
    if (
      !(
        directLatitude === 0 &&
        directLongitude === 0
      )
    ) {
      return {
        latitude:
          directLatitude,

        longitude:
          directLongitude,
      };
    }
  }


  /*
   * --------------------------------------------------------
   * lat / lng
   * --------------------------------------------------------
   */

  const shortLatitude =
    Number(
      point.lat
    );

  const shortLongitude =
    Number(
      point.lng
    );

  if (
    validLatitude(
      shortLatitude
    ) &&
    validLongitude(
      shortLongitude
    )
  ) {
    if (
      !(
        shortLatitude === 0 &&
        shortLongitude === 0
      )
    ) {
      return {
        latitude:
          shortLatitude,

        longitude:
          shortLongitude,
      };
    }
  }


  /*
   * --------------------------------------------------------
   * longitude / latitude aliases
   * --------------------------------------------------------
   */

  const latitudeValue =
    Number(
      point.latitude ??
      point.lat ??
      point.lat_value ??
      point.latitude_value
    );

  const longitudeValue =
    Number(
      point.longitude ??
      point.lng ??
      point.lon ??
      point.long ??
      point.longitude_value
    );

  if (
    validLatitude(
      latitudeValue
    ) &&
    validLongitude(
      longitudeValue
    )
  ) {
    if (
      !(
        latitudeValue === 0 &&
        longitudeValue === 0
      )
    ) {
      return {
        latitude:
          latitudeValue,

        longitude:
          longitudeValue,
      };
    }
  }


  /*
   * --------------------------------------------------------
   * NESTED DATA
   * --------------------------------------------------------
   */

  const nestedCandidates = [
    point.data,
    point.telemetry,
    point.location,
    point.position,
    point.gps,
    point.coordinates,
  ];

  for (
    const nested of
    nestedCandidates
  ) {
    if (
      !nested ||
      typeof nested !==
        "object"
    ) {
      continue;
    }

    const nestedCoordinates =
      extractCoordinates(
        nested
      );

    if (
      nestedCoordinates
    ) {
      return nestedCoordinates;
    }
  }


  /*
   * --------------------------------------------------------
   * GEOJSON COORDINATES
   *
   * GeoJSON:
   *
   * [longitude, latitude]
   * --------------------------------------------------------
   */

  if (
    Array.isArray(
      point.coordinates
    ) &&
    point.coordinates.length >=
      2
  ) {
    const first =
      Number(
        point.coordinates[0]
      );

    const second =
      Number(
        point.coordinates[1]
      );

    /*
     * Normal GeoJSON:
     * [lng, lat]
     */

    if (
      validLongitude(first) &&
      validLatitude(second)
    ) {
      if (
        !(
          first === 0 &&
          second === 0
        )
      ) {
        return {
          latitude:
            second,

          longitude:
            first,
        };
      }
    }
  }


  /*
   * --------------------------------------------------------
   * GEOJSON GEOMETRY
   * --------------------------------------------------------
   */

  if (
    point.geometry?.coordinates
  ) {
    const coordinates =
      point.geometry.coordinates;

    if (
      Array.isArray(
        coordinates
      ) &&
      coordinates.length >=
        2
    ) {
      const first =
        Number(
          coordinates[0]
        );

      const second =
        Number(
          coordinates[1]
        );

      if (
        validLongitude(first) &&
        validLatitude(second)
      ) {
        if (
          !(
            first === 0 &&
            second === 0
          )
        ) {
          return {
            latitude:
              second,

            longitude:
              first,
          };
        }
      }
    }
  }


  return null;
}


/* ==========================================================
   NORMALIZE VEHICLES
========================================================== */

function normalizeVehicles(
  data
) {
  if (!data) {
    return [];
  }

  const collection =
    data.vehicles ||
    data.vehicleData ||
    data.vehicle_data ||
    data.trucks ||
    data.vehicleRecords ||
    data.vehicle_records;

  /*
   * ARRAY
   */

  if (
    Array.isArray(
      collection
    )
  ) {
    return collection.map(
      (
        vehicle,
        index
      ) => ({
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


  /*
   * OBJECT
   */

  if (
    collection &&
    typeof collection ===
      "object"
  ) {
    return Object.entries(
      collection
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
   * SINGLE VEHICLE
   */

  if (
    data.vehicle &&
    typeof data.vehicle ===
      "object"
  ) {
    return [
      {
        vehicleKey:
          data.vehicle
            .vehicleNumber ||
          data.vehicle
            .vehicle_number ||
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
   EXTRACT POINT ARRAY
========================================================== */

function extractPointArray(
  vehicle
) {
  if (!vehicle) {
    return [];
  }

  const candidates = [
    vehicle.points,

    vehicle.gps_points,

    vehicle.gpsPoints,

    vehicle.locations,

    vehicle.records,

    vehicle.telemetry,

    vehicle.data?.points,

    vehicle.data?.gps_points,

    vehicle.data?.gpsPoints,

    vehicle.data?.locations,

    vehicle.data?.records,
  ];

  for (
    const candidate of
    candidates
  ) {
    if (
      Array.isArray(
        candidate
      )
    ) {
      return candidate;
    }
  }

  return [];
}


/* ==========================================================
   EXTRACT ALL GPS POINTS
========================================================== */

function extractAllGpsPoints(
  monitoringData,
  normalizedWard
) {
  const output = [];

  if (!monitoringData) {
    return output;
  }

  /*
   * --------------------------------------------------------
   * VEHICLES
   * --------------------------------------------------------
   */

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

          const {
            latitude,
            longitude,
          } =
            coordinates;

          if (
            !validLatitude(
              latitude
            ) ||
            !validLongitude(
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


  /*
   * --------------------------------------------------------
   * TOP LEVEL ARRAYS
   * --------------------------------------------------------
   */

  if (
    output.length === 0
  ) {
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

    for (
      const candidate of
      topLevelArrays
    ) {
      if (
        !Array.isArray(
          candidate
        )
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

          const {
            latitude,
            longitude,
          } =
            coordinates;

          if (
            !validLatitude(
              latitude
            ) ||
            !validLongitude(
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
   SAFE JSON STRINGIFY
========================================================== */

function safeJSONStringify(
  value
) {
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


/* ==========================================================
   FORMAT VALUE
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
    selectedWard:
      contextWard,
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

  const requestAbortRef =
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
    mapReady,
    setMapReady,
  ] = useState(false);

  const [
    viewState,
    setViewState,
  ] = useState(
    DEFAULT_VIEW_STATE
  );

  /*
   * IMPORTANT:
   *
   * Header DOM date gets priority.
   */

  const [
    headerDate,
    setHeaderDate,
  ] = useState(
    () => {
      const propDate =
        normalizeHeaderDate(
          selectedDateProp
        );

      if (propDate) {
        return propDate;
      }

      const domDate =
        findHeaderDate();

      if (domDate) {
        return domDate;
      }

      const storedDate =
        normalizeHeaderDate(
          getStoredValue(
            HEADER_DATE_KEYS
          )
        );

      return storedDate;
    }
  );


  /* ========================================================
     RESOLVE WARD
  ======================================================== */

  const selectedWard =
    selectedWardProp ??
    wardNoProp ??
    contextWard ??
    getStoredValue(
      HEADER_WARD_KEYS
    );

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
    normalizeHeaderDate(
      headerDate
    );


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

    /*
     * Initial check.
     */

    updateHeaderDate();

    /*
     * MutationObserver.
     */

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

    /*
     * Fallback.
     */

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
              duration:
                0.25,
            }
          ).from(
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
     FETCH COLLECTION POINTS
  ======================================================== */

  const fetchCollectionPoints =
    useCallback(
      async () => {
        /*
         * ----------------------------------------------------
         * WARD VALIDATION
         * ----------------------------------------------------
         */

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

        /*
         * ----------------------------------------------------
         * DATE VALIDATION
         * ----------------------------------------------------
         */

        if (
          !currentDate ||
          !isReasonableDate(
            currentDate
          )
        ) {
          setMonitoringData(
            null
          );

          setError(
            "Please select a valid date from the header."
          );

          setLoading(
            false
          );

          return;
        }

        /*
         * ----------------------------------------------------
         * ABORT PREVIOUS REQUEST
         * ----------------------------------------------------
         */

        if (
          requestAbortRef.current
        ) {
          requestAbortRef.current.abort();
        }

        const controller =
          new AbortController();

        requestAbortRef.current =
          controller;

        /*
         * ----------------------------------------------------
         * LOADING
         * ----------------------------------------------------
         */

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

        /*
         * ----------------------------------------------------
         * URL
         * ----------------------------------------------------
         */

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

        try {
          /*
           * --------------------------------------------------
           * REQUEST
           * --------------------------------------------------
           */

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

                signal:
                  controller.signal,
              }
            );

          /*
           * --------------------------------------------------
           * JSON
           * --------------------------------------------------
           */

          let result =
            null;

          try {
            result =
              await response.json();
          } catch {
            result =
              null;
          }

          console.log(
            "📦 RAW COLLECTION POINT RESPONSE:",
            result
          );

          /*
           * --------------------------------------------------
           * HTTP ERROR
           * --------------------------------------------------
           */

          if (
            !response.ok
          ) {
            throw new Error(
              result?.message ||
              result?.error ||
              `Collection point API returned HTTP ${response.status}`
            );
          }

          /*
           * --------------------------------------------------
           * API ERROR
           * --------------------------------------------------
           */

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
           * --------------------------------------------------
           * NORMALIZE RESPONSE
           *
           * Supports:
           *
           * { data: {...} }
           *
           * OR
           *
           * {...}
           * --------------------------------------------------
           */

          const data =
            result?.data ??
            result;

          console.log(
            "📦 NORMALIZED DATA:",
            data
          );

          console.log(
            "🚛 VEHICLES:",
            data?.vehicles
          );

          console.log(
            "🚛 VEHICLE COUNT:",
            data?.vehicle_count
          );

          console.log(
            "📍 POINT COUNT:",
            data?.point_count
          );

          /*
           * --------------------------------------------------
           * STORE
           * --------------------------------------------------
           */

          setMonitoringData(
            data
          );

        } catch (
          requestError
        ) {
          /*
           * Abort is normal when filters change.
           */

          if (
            requestError?.name ===
            "AbortError"
          ) {
            return;
          }

          console.error(
            "❌ COLLECTION POINT MONITORING ERROR:",
            requestError
          );

          /*
           * IMPORTANT:
           *
           * Keep map component alive.
           * Do not throw.
           */

          setError(
            requestError?.message ||
            "Failed to load collection point data."
          );

        } finally {
          if (
            requestAbortRef.current ===
            controller
          ) {
            requestAbortRef.current =
              null;
          }

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
     FETCH ON FILTER CHANGE
  ======================================================== */

  useEffect(() => {
    fetchCollectionPoints();

    return () => {
      if (
        requestAbortRef.current
      ) {
        requestAbortRef.current.abort();
      }
    };
  }, [
    fetchCollectionPoints,
  ]);


  /* ========================================================
     CLEANUP MAP
  ======================================================== */

  useEffect(() => {
    return () => {
      if (
        requestAbortRef.current
      ) {
        requestAbortRef.current.abort();
      }
    };
  }, []);


  /* ========================================================
     EXTRACT GPS POINTS
  ======================================================== */

  const gpsPoints =
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
========================================================== */

  const geoJson =
    useMemo(
      () => {
        const features =
          gpsPoints.map(
            (
              gpsPoint,
              index
            ) => {
              const {
                vehicleKey,
                vehicle,
                point,
                pointIndex,
                coordinates,
                wardNo,
              } =
                gpsPoint;

              const latitude =
                Number(
                  coordinates.latitude
                );

              const longitude =
                Number(
                  coordinates.longitude
                );

              return {
                type:
                  "Feature",

                /*
                 * IMPORTANT:
                 *
                 * NO SPACES.
                 *
                 * This is a clean MapLibre
                 * feature ID.
                 */

                id:
                  `gps-point-${index}`,

                geometry: {
                  type:
                    "Point",

                  /*
                   * GeoJSON MUST be:
                   *
                   * [longitude, latitude]
                   */

                  coordinates: [
                    longitude,
                    latitude,
                  ],
                },

                properties: {
                  vehicleNumber:
                    String(
                      vehicleKey ||
                      "Vehicle"
                    ),

                  vehicleTableName:
                    vehicle
                      ?.vehicle_table_name ||
                    vehicle
                      ?.vehicleTableName ||
                    "",

                  wardNo:
                    wardNo ??
                    normalizedWard,

                  pointIndex:
                    pointIndex,

                  latitude:
                    latitude,

                  longitude:
                    longitude,

                  telemetry:
                    safeJSONStringify(
                      point?.data ||
                      point ||
                      {}
                    ),
                },
              };
            }
          );

        const result = {
          type:
            "FeatureCollection",

          features,
        };

        console.log(
          "📍 EXTRACTED GPS POINTS:",
          gpsPoints.length
        );

        console.log(
          "🗺️ GEOJSON FEATURES:",
          features.length
        );

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

        return result;
      },
      [
        gpsPoints,
        normalizedWard,
      ]
    );


  /* ========================================================
     FIT MAP TO GPS POINTS
  ======================================================== */

  useEffect(() => {
    if (
      !mapReady
    ) {
      return;
    }

    if (
      !geoJson ||
      !Array.isArray(
        geoJson.features
      ) ||
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
            feature
              ?.geometry
              ?.coordinates
        )
        .filter(
          (
            coordinate
          ) =>
            Array.isArray(
              coordinate
            ) &&
            coordinate.length >=
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

    console.log(
      "🗺️ FITTING MAP TO:",
      coordinates.length,
      "GPS POINTS"
    );

    /*
     * ------------------------------------------------------
     * SINGLE POINT
     * ------------------------------------------------------
     */

    if (
      coordinates.length ===
      1
    ) {
      map.flyTo({
        center: [
          Number(
            coordinates[0][0]
          ),
          Number(
            coordinates[0][1]
          ),
        ],

        zoom:
          16,

        duration:
          1000,
      });

      return;
    }

    /*
     * ------------------------------------------------------
     * BOUNDS
     * ------------------------------------------------------
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
      (coordinate) => {
        const longitude =
          Number(
            coordinate[0]
          );

        const latitude =
          Number(
            coordinate[1]
          );

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
     * Protect against zero-size
     * bounds.
     */

    if (
      minLng === maxLng &&
      minLat === maxLat
    ) {
      map.flyTo({
        center: [
          minLng,
          minLat,
        ],

        zoom:
          16,

        duration:
          1000,
      });

      return;
    }

    const lngPadding =
      Math.max(
        (
          maxLng -
          minLng
        ) *
          0.15,

        0.002
      );

    const latPadding =
      Math.max(
        (
          maxLat -
          minLat
        ) *
          0.15,

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
        padding:
          45,

        maxZoom:
          16,

        duration:
          1200,

        essential:
          true,
      }
    );
  }, [
    geoJson,
    mapReady,
  ]);


  /* ========================================================
     MAP MOUSE MOVE
  ======================================================== */

  const handleMapMouseMove =
    useCallback(
      (
        event
      ) => {
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
          18;

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
          setHoveredPoint(
            null
          );

          setHoverPosition(
            null
          );

          return;
        }

        let nearestFeature =
          nearbyFeatures[0];

        let nearestDistance =
          Infinity;

        nearbyFeatures.forEach(
          (
            feature
          ) => {
            if (
              !feature?.geometry ||
              feature.geometry.type !==
                "Point"
            ) {
              return;
            }

            const coordinates =
              feature
                .geometry
                .coordinates;

            if (
              !Array.isArray(
                coordinates
              )
            ) {
              return;
            }

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

        const latitude =
          Number(
            coordinates[1]
          );

        const longitude =
          Number(
            coordinates[0]
          );

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

          latitude,

          longitude,

          data:
            telemetryData,
        });

        setHoverPosition({
          longitude,

          latitude,
        });
      },
      [
        normalizedWard,
      ]
    );


  /* ========================================================
     MAP LEAVE
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
        ?.vehicle_count
    ) ||
    new Set(
      gpsPoints.map(
        (
          point
        ) =>
          point.vehicleKey
      )
    ).size ||
    0;

  const pointCount =
    Number(
      monitoringData
        ?.point_count
    ) ||
    gpsPoints.length;


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
        ref={
          collectionCardRef
        }
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

            onLoad={() => {
              console.log(
                "🗺️ MAPLIBRE MAP LOADED"
              );

              setMapReady(
                true
              );
            }}

            onMove={
              (
                event
              ) =>
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

                IMPORTANT:
                IDs contain NO SPACES.
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


              {/* GREEN GPS POINTS */}

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
                HOVER HIGHLIGHT

                Again: NO WHITESPACE in IDs.
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

                      id:
                        "hover-point",

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

                  offset={
                    18
                  }

                  className="collection-point-popup"
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

                    {/* POPUP HEADER */}

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


                    {/* COORDINATES */}

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
                                hoveredPoint
                                  .longitude
                              ).toFixed(
                                7
                              )
                            }
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* BASIC DATA */}

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
                          RECORD
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
              WARD STATUS
          ================================================= */}

          {!loading &&
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
                z-[20]
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
                  z-[20]
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
                    max-w-[320px]
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

                  {currentDate && (
                    <p
                      className="
                        text-[9px]
                        text-slate-400
                        mt-2
                      "
                    >
                      Requested date:{" "}
                      {currentDate}
                    </p>
                  )}

                </div>

              </div>
            )}


          {/* =================================================
              POINT COUNT EXISTS BUT NO GPS
          ================================================= */}

          {!loading &&
            !error &&
            normalizedWard &&
            currentDate &&
            pointCount > 0 &&
            gpsPoints.length ===
              0 && (
              <div
                className="
                  absolute
                  inset-0
                  z-[15]
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
                    GPS coordinates not found
                  </p>

                  <p
                    className="
                      text-[10px]
                      text-slate-400
                      mt-1
                    "
                  >
                    The API returned{" "}
                    {pointCount} points,
                    but no valid latitude
                    and longitude values
                    were extracted.
                  </p>

                </div>

              </div>
            )}


          {/* =================================================
              NO POINTS
          ================================================= */}

          {!loading &&
            !error &&
            normalizedWard &&
            currentDate &&
            pointCount === 0 && (
              <div
                className="
                  absolute
                  inset-0
                  z-[15]
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
                    for Ward{" "}
                    {normalizedWard}
                    on{" "}
                    {currentDate}.
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
                  z-[15]
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