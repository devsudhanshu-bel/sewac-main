import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  ZoomControl,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import {
  UserRound,
  MapPin,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import { useLanguage } from "../../i18n";

import "leaflet/dist/leaflet.css";

/* ============================================================
   CONFIGURATION
============================================================ */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5002";

const CUSTOMER_GREV_ENDPOINT =
  `${API_BASE_URL}/api/complaintsGrev`;

const BENGALURU_CENTER = [
  12.9716,
  77.5946,
];

const DEFAULT_ZOOM = 11;

const CARTO_LIGHT_URL =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

const CARTO_ATTRIBUTION =
  "&copy; OpenStreetMap contributors &copy; CARTO";


/* ============================================================
   SAFE VALUE HELPER
============================================================ */

function safeValue(value) {
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
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  return String(value);
}


/* ============================================================
   FIELD HELPER
============================================================ */

function getField(
  object,
  keys = [],
  fallback = "—"
) {
  if (!object) {
    return fallback;
  }

  for (
    const key of keys
  ) {
    const value =
      object?.[key];

    if (
      value !== null &&
      value !== undefined &&
      value !== ""
    ) {
      return value;
    }
  }

  return fallback;
}


/* ============================================================
   EXTRACT COMPLAINT ARRAY
============================================================ */

function extractComplaints(
  result
) {
  if (
    Array.isArray(result)
  ) {
    return result;
  }

  if (
    Array.isArray(
      result?.data
    )
  ) {
    return result.data;
  }

  if (
    Array.isArray(
      result?.complaints
    )
  ) {
    return result.complaints;
  }

  if (
    Array.isArray(
      result?.data?.complaints
    )
  ) {
    return result.data.complaints;
  }

  if (
    Array.isArray(
      result?.items
    )
  ) {
    return result.items;
  }

  if (
    Array.isArray(
      result?.data?.items
    )
  ) {
    return result.data.items;
  }

  if (
    Array.isArray(
      result?.rows
    )
  ) {
    return result.rows;
  }

  if (
    Array.isArray(
      result?.data?.rows
    )
  ) {
    return result.data.rows;
  }

  return [];
}


/* ============================================================
   NORMALIZE COMPLAINT
============================================================ */

function normalizeComplaint(
  item
) {
  if (!item) {
    return null;
  }

  /*
   * IMPORTANT
   *
   * Backend response is:
   *
   * {
   *   lat,
   *   long,
   *   data: {
   *     id,
   *     ticket_number,
   *     phone_number,
   *     title,
   *     description,
   *     category,
   *     image_url,
   *     address,
   *     status
   *   }
   * }
   *
   * We MUST preserve data.
   */

  const nestedData =
    item?.data &&
    typeof item.data === "object"
      ? item.data
      : {};

  /*
   * Merge both structures.
   *
   * This means the component works with:
   *
   * 1. Current backend:
   *    item.data.title
   *
   * 2. Flat response:
   *    item.title
   */

  const complaintData = {
    ...item,
    ...nestedData,
  };

  const latitude =
    Number(
      item?.lat ??
      item?.latitude ??
      nestedData?.lat ??
      nestedData?.latitude
    );

  const longitude =
    Number(
      item?.long ??
      item?.longitude ??
      item?.lng ??
      item?.lon ??
      nestedData?.long ??
      nestedData?.longitude ??
      nestedData?.lng ??
      nestedData?.lon
    );

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    console.warn(
      "⚠️ INVALID CUSTOMER GRIEVANCE COORDINATES:",
      item
    );

    return null;
  }

  /*
   * Return BOTH:
   *
   * complaint.data
   *
   * AND
   *
   * top-level values
   *
   * so no existing popup logic breaks.
   */

  return {
    ...item,

    latitude,
    longitude,

    lat: latitude,
    long: longitude,

    data: {
      ...nestedData,

      id:
        complaintData?.id ??
        complaintData?.complaint_id ??
        null,

      ticket_number:
        complaintData?.ticket_number ??
        complaintData?.ticketNumber ??
        complaintData?.ticket ??
        "",

      phone_number:
        complaintData?.phone_number ??
        complaintData?.phoneNumber ??
        complaintData?.phone ??
        complaintData?.citizen_phone ??
        complaintData?.citizenPhone ??
        "",

      title:
        complaintData?.title ??
        complaintData?.complaint_title ??
        complaintData?.complaintTitle ??
        complaintData?.subject ??
        "",

      description:
        complaintData?.description ??
        complaintData?.complaint_description ??
        complaintData?.complaintDescription ??
        "",

      category:
        complaintData?.category ??
        complaintData?.complaint_category ??
        complaintData?.complaintCategory ??
        "",

      image_url:
        complaintData?.image_url ??
        complaintData?.imageUrl ??
        complaintData?.complaint_image ??
        "",

      address:
        complaintData?.address ??
        complaintData?.full_address ??
        complaintData?.fullAddress ??
        complaintData?.location ??
        "",

      status:
        complaintData?.status ??
        complaintData?.complaint_status ??
        complaintData?.complaintStatus ??
        "",

      created_at:
        complaintData?.created_at ??
        complaintData?.createdAt ??
        complaintData?.date ??
        complaintData?.timestamp ??
        null,

      remarks:
        complaintData?.remarks ??
        "",
    },
  };
}


/* ============================================================
   BOUNDARY HELPERS
============================================================ */

function isCoordinatePair(
  value
) {
  return (
    Array.isArray(value) &&
    value.length >= 2 &&
    Number.isFinite(
      Number(value[0])
    ) &&
    Number.isFinite(
      Number(value[1])
    )
  );
}


function normalizeBoundaryPair(
  pair
) {
  if (
    !isCoordinatePair(pair)
  ) {
    return null;
  }

  const first =
    Number(pair[0]);

  const second =
    Number(pair[1]);

  /*
   * Bengaluru:
   *
   * latitude  ~ 13
   * longitude ~ 77
   *
   * If it looks like [lng, lat],
   * convert to [lat, lng].
   */

  if (
    Math.abs(first) > 30 &&
    Math.abs(second) < 30
  ) {
    return [
      second,
      first,
    ];
  }

  return [
    first,
    second,
  ];
}


function convertCoordinatesToPaths(
  coordinates
) {
  if (
    !Array.isArray(coordinates)
  ) {
    return [];
  }

  /*
   * Polygon:
   *
   * [
   *   [
   *     [lng, lat],
   *     [lng, lat]
   *   ]
   * ]
   */

  if (
    coordinates.length > 0 &&
    isCoordinatePair(
      coordinates[0]
    )
  ) {
    const path =
      coordinates
        .map(
          normalizeBoundaryPair
        )
        .filter(Boolean);

    return path.length >= 3
      ? [path]
      : [];
  }

  /*
   * Polygon outer ring:
   */

  if (
    coordinates.length > 0 &&
    Array.isArray(
      coordinates[0]
    ) &&
    coordinates[0].length > 0 &&
    isCoordinatePair(
      coordinates[0][0]
    )
  ) {
    return coordinates
      .map(
        (ring) =>
          ring
            .map(
              normalizeBoundaryPair
            )
            .filter(Boolean)
      )
      .filter(
        (ring) =>
          ring.length >= 3
      );
  }

  /*
   * MultiPolygon.
   */

  const output = [];

  coordinates.forEach(
    (item) => {
      const nested =
        convertCoordinatesToPaths(
          item
        );

      output.push(
        ...nested
      );
    }
  );

  return output;
}


function extractBoundaryPaths(
  payload
) {
  const candidates = [
    payload?.boundary,
    payload?.geoBoundary,
    payload?.geo_boundary,
    payload?.cityBoundary,
    payload?.city_boundary,

    payload?.data?.boundary,
    payload?.data?.geoBoundary,
    payload?.data?.geo_boundary,
    payload?.data?.cityBoundary,
    payload?.data?.city_boundary,

    payload?.bengaluruBoundary,
    payload?.bengaluru_boundary,

    payload?.data?.bengaluruBoundary,
    payload?.data?.bengaluru_boundary,
  ];

  for (
    const candidate of candidates
  ) {
    if (!candidate) {
      continue;
    }

    let geometry =
      candidate;

    if (
      typeof geometry ===
      "string"
    ) {
      try {
        geometry =
          JSON.parse(
            geometry
          );
      } catch {
        continue;
      }
    }

    /*
     * GeoJSON Feature
     */

    if (
      geometry?.type ===
      "Feature"
    ) {
      geometry =
        geometry.geometry;
    }

    /*
     * FeatureCollection
     */

    if (
      geometry?.type ===
        "FeatureCollection" &&
      Array.isArray(
        geometry.features
      )
    ) {
      const paths = [];

      geometry.features.forEach(
        (feature) => {
          if (
            feature?.geometry
          ) {
            paths.push(
              ...extractBoundaryPaths(
                {
                  boundary:
                    feature.geometry,
                }
              )
            );
          }
        }
      );

      if (
        paths.length > 0
      ) {
        return paths;
      }
    }

    /*
     * Polygon / MultiPolygon.
     */

    if (
      geometry?.type ===
        "Polygon" ||
      geometry?.type ===
        "MultiPolygon"
    ) {
      const paths =
        convertCoordinatesToPaths(
          geometry.coordinates
        );

      if (
        paths.length > 0
      ) {
        return paths;
      }
    }

    /*
     * Raw coordinate arrays.
     */

    if (
      Array.isArray(
        geometry
      )
    ) {
      const paths =
        convertCoordinatesToPaths(
          geometry
        );

      if (
        paths.length > 0
      ) {
        return paths;
      }
    }
  }

  return [];
}


/* ============================================================
   POINT IN POLYGON
============================================================ */

function isPointInsidePolygon(
  lat,
  lng,
  polygon
) {
  if (
    !polygon ||
    polygon.length < 3
  ) {
    return true;
  }

  let inside =
    false;

  for (
    let i = 0,
      j = polygon.length - 1;
    i < polygon.length;
    j = i++
  ) {
    const yi =
      polygon[i][0];

    const xi =
      polygon[i][1];

    const yj =
      polygon[j][0];

    const xj =
      polygon[j][1];

    const intersect =
      yi > lat !==
        yj > lat &&
      lng <
        ((xj - xi) *
          (lat - yi)) /
          (yj - yi) +
          xi;

    if (
      intersect
    ) {
      inside =
        !inside;
    }
  }

  return inside;
}


/* ============================================================
   PERSON MARKER
============================================================ */

function createPersonIcon() {
  return L.divIcon({
    className:
      "customer-grev-marker-wrapper",

    html: `
      <div
        style="
          width:42px;
          height:50px;
          display:flex;
          align-items:flex-start;
          justify-content:center;
          filter:drop-shadow(0 4px 6px rgba(0,0,0,.22));
        "
      >
        <div
          style="
            width:40px;
            height:40px;
            display:flex;
            align-items:center;
            justify-content:center;
            background:#2f80c9;
            border:3px solid #ffffff;
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
          "
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style="transform:rotate(45deg)"
          >
            <circle
              cx="12"
              cy="8"
              r="3.5"
              fill="white"
            />

            <path
              d="M5.5 20C5.5 16.41 8.41 13.5 12 13.5C15.59 13.5 18.5 16.41 18.5 20"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </div>
    `,

    iconSize: [
      42,
      50,
    ],

    iconAnchor: [
      21,
      48,
    ],

    popupAnchor: [
      0,
      -48,
    ],
  });
}

const PERSON_ICON =
  createPersonIcon();


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
   BENGALURU MAP FOCUS
============================================================ */

function BengaluruMapFocus({
  boundaryPaths,
}) {
  const map =
    useMap();

  useEffect(() => {
    if (
      !boundaryPaths ||
      boundaryPaths.length === 0
    ) {
      map.setView(
        BENGALURU_CENTER,
        DEFAULT_ZOOM,
        {
          animate: false,
        }
      );

      return;
    }

    try {
      const allPoints =
        boundaryPaths.flat();

      const bounds =
        L.latLngBounds(
          allPoints
        );

      if (
        bounds.isValid()
      ) {
        map.fitBounds(
          bounds,
          {
            padding: [
              25,
              25,
            ],

            maxZoom: 12,

            animate: false,
          }
        );
      }
    } catch {
      map.setView(
        BENGALURU_CENTER,
        DEFAULT_ZOOM,
        {
          animate: false,
        }
      );
    }
  }, [
    boundaryPaths,
    map,
  ]);

  return null;
}


/* ============================================================
   STATUS COLORS
============================================================ */

function getStatusClasses(
  status
) {
  const normalized =
    String(
      status || ""
    )
      .trim()
      .toUpperCase();

  if (
    normalized ===
    "CLOSED"
  ) {
    return {
      badge:
        "bg-emerald-50 text-emerald-600",
    };
  }

  if (
    normalized ===
    "PENDING"
  ) {
    return {
      badge:
        "bg-amber-50 text-amber-600",
    };
  }

  if (
    normalized ===
    "READY_FOR_VERIFICATION"
  ) {
    return {
      badge:
        "bg-blue-50 text-blue-600",
    };
  }

  if (
    normalized ===
    "OTP_SENT"
  ) {
    return {
      badge:
        "bg-violet-50 text-violet-600",
    };
  }

  if (
    normalized ===
    "IN_PROGRESS"
  ) {
    return {
      badge:
        "bg-indigo-50 text-indigo-600",
    };
  }

  if (
    normalized ===
    "ASSIGNED"
  ) {
    return {
      badge:
        "bg-sky-50 text-sky-600",
    };
  }

  return {
    badge:
      "bg-slate-100 text-slate-600",
  };
}


/* ============================================================
   FORMAT STATUS
============================================================ */

function formatEnum(
  value
) {
  return String(
    value || "—"
  ).replace(
    /_/g,
    " "
  );
}


/* ============================================================
   DATE FORMATTER
============================================================ */

function formatDate(
  value
) {
  if (!value) {
    return "—";
  }

  try {
    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return String(value);
    }

    return date.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  } catch {
    return String(value);
  }
}


/* ============================================================
   POPUP ROW
============================================================ */

function PopupRow({
  label,
  value,
}) {
  return (
    <div
      className="
        grid
        grid-cols-[72px_minmax(0,1fr)]
        gap-3
        border-b
        border-slate-100
        py-2
        last:border-b-0
      "
    >
      <span
        className="
          text-[10px]
          font-medium
          uppercase
          tracking-[0.25px]
          text-[#8AA0B6]
        "
      >
        {label}
      </span>

      <span
        className="
          min-w-0
          break-words
          text-right
          text-[11px]
          font-semibold
          leading-4
          text-[#24364B]
        "
      >
        {safeValue(value)}
      </span>
    </div>
  );
}


/* ============================================================
   COMPLAINT POPUP
============================================================ */

function ComplaintPopup({
  complaint,
  labels,
}) {
  /*
   * CRITICAL:
   *
   * Always read from complaint.data first.
   *
   * The backend returns:
   *
   * {
   *   lat,
   *   long,
   *   data: {...}
   * }
   */

  const data =
    complaint?.data ||
    {};

  const title =
    getField(
      data,
      [
        "title",
        "complaint_title",
        "complaintTitle",
        "subject",
        "name",
      ],
      "Customer Complaint"
    );

  const ticket =
    getField(
      data,
      [
        "ticket_number",
        "ticketNumber",
        "ticketNo",
        "ticket",
      ],
      "—"
    );

  const status =
    getField(
      data,
      [
        "status",
        "complaint_status",
        "complaintStatus",
      ],
      "—"
    );

  const category =
    getField(
      data,
      [
        "category",
        "complaint_category",
        "complaintCategory",
      ],
      "—"
    );

  const phone =
    getField(
      data,
      [
        "phone_number",
        "phoneNumber",
        "phone",
        "citizen_phone",
        "citizenPhone",
        "contactNumber",
      ],
      "—"
    );

  const description =
    getField(
      data,
      [
        "description",
        "complaint_description",
        "complaintDescription",
      ],
      "—"
    );

  const address =
    getField(
      data,
      [
        "address",
        "full_address",
        "fullAddress",
        "location",
      ],
      "—"
    );

  const id =
    getField(
      data,
      [
        "id",
        "complaint_id",
      ],
      "—"
    );

  const imageUrl =
    getField(
      data,
      [
        "image_url",
        "imageUrl",
        "complaint_image",
      ],
      ""
    );

  const createdAt =
    getField(
      data,
      [
        "created_at",
        "createdAt",
        "date",
        "timestamp",
      ],
      null
    );

  const statusClasses =
    getStatusClasses(
      status
    );

  return (
    <div
      className="
        w-[min(340px,calc(100vw-48px))]
        overflow-hidden
        rounded-[14px]
        bg-white
        text-[#34475B]
      "
    >
      {/* ==================================================
          HEADER
      ================================================== */}

      <div
        className="
          flex
          items-center
          gap-2.5
          border-b
          border-slate-200
          px-3.5
          py-3.5
        "
      >
        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-[10px]
            bg-[#EDF5FC]
            text-[#2F80C9]
          "
        >
          <UserRound
            size={18}
            strokeWidth={2}
          />
        </div>

        <div className="min-w-0">
          <div
            className="
              truncate
              text-[14px]
              font-bold
              text-[#263B50]
            "
          >
            {title}
          </div>

          <div
            className="
              mt-0.5
              truncate
              text-[10px]
              font-semibold
              text-[#8AA0B6]
            "
          >
            {labels.ticket}: {safeValue(ticket)}
          </div>
        </div>
      </div>

      {/* ==================================================
          STATUS
      ================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-2
          border-b
          border-slate-200
          bg-slate-50
          px-3.5
          py-2.5
        "
      >
        <span
          className="
            text-[9px]
            font-bold
            uppercase
            tracking-[0.45px]
            text-[#8AA0B6]
          "
        >
          {labels.status}
        </span>

        <span
          className={`
            inline-flex
            max-w-[190px]
            items-center
            justify-center
            rounded-full
            px-2
            py-1
            text-[9px]
            font-bold
            uppercase
            tracking-[0.2px]
            ${statusClasses.badge}
          `}
        >
          {formatEnum(status)}
        </span>
      </div>

      {/* ==================================================
          DETAILS
      ================================================== */}

      <div
        className="
          max-h-[390px]
          overflow-y-auto
          px-3.5
          pb-3.5
          pt-2
        "
      >
        <PopupRow
          label={labels.id}
          value={id}
        />

        <PopupRow
          label={labels.phone}
          value={phone}
        />

        <div
          className="
            border-b
            border-slate-100
            py-2
          "
        >
          <div
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-[0.45px]
              text-[#8AA0B6]
            "
          >
            {labels.title}
          </div>

          <div
            className="
              mt-1
              break-words
              text-[11px]
              font-semibold
              leading-4
              text-[#24364B]
            "
          >
            {safeValue(title)}
          </div>
        </div>

        <div
          className="
            border-b
            border-slate-100
            py-2
          "
        >
          <div
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-[0.45px]
              text-[#8AA0B6]
            "
          >
            {labels.description}
          </div>

          <div
            className="
              mt-1
              break-words
              rounded-lg
              bg-slate-50
              px-2.5
              py-2
              text-[11px]
              font-medium
              leading-4
              text-[#61758A]
            "
          >
            {safeValue(
              description
            )}
          </div>
        </div>

        <PopupRow
          label={labels.category}
          value={formatEnum(category)}
        />

        <div
          className="
            border-b
            border-slate-100
            py-2
          "
        >
          <div
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-[0.45px]
              text-[#8AA0B6]
            "
          >
            {labels.address}
          </div>

          <div
            className="
              mt-1
              break-words
              text-[11px]
              font-medium
              leading-4
              text-[#465B70]
            "
          >
            {safeValue(address)}
          </div>
        </div>

        <div
          className="
            grid
            grid-cols-2
            gap-2
            border-b
            border-slate-100
            py-2
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
            <div
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-[0.35px]
                text-[#8AA0B6]
              "
            >
              {labels.latitude}
            </div>

            <div
              className="
                mt-1
                break-all
                text-[10px]
                font-semibold
                text-[#34475B]
              "
            >
              {safeValue(
                complaint.latitude
              )}
            </div>
          </div>

          <div
            className="
              rounded-lg
              bg-slate-50
              px-2.5
              py-2
            "
          >
            <div
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-[0.35px]
                text-[#8AA0B6]
              "
            >
              {labels.longitude}
            </div>

            <div
              className="
                mt-1
                break-all
                text-[10px]
                font-semibold
                text-[#34475B]
              "
            >
              {safeValue(
                complaint.longitude
              )}
            </div>
          </div>
        </div>

        {createdAt && (
          <PopupRow
            label={labels.date}
            value={formatDate(
              createdAt
            )}
          />
        )}

        {/* ==================================================
            IMAGE
        ================================================== */}

        {imageUrl && (
          <div
            className="
              pt-2.5
            "
          >
            <div
              className="
                mb-1.5
                text-[9px]
                font-bold
                uppercase
                tracking-[0.45px]
                text-[#8AA0B6]
              "
            >
              {labels.image}
            </div>

            <img
              src={imageUrl}
              alt={labels.imageAlt}
              loading="lazy"
              className="
                block
                h-auto
                max-h-[180px]
                w-full
                rounded-[9px]
                border
                border-slate-200
                object-cover
              "
              onError={(
                event
              ) => {
                event.currentTarget.style.display =
                  "none";
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}


/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function CustomerGrev() {
  const {
    t,
  } = useLanguage();

  const [
    complaints,
    setComplaints,
  ] = useState([]);

  const [
    boundaryPaths,
    setBoundaryPaths,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const abortRef =
    useRef(null);


  /* ==========================================================
     TRANSLATIONS
  ========================================================== */

  const title =
    t(
      "cityOverviewMap.customerGrievances.title",
      "Customer Grievances"
    );

  const subtitle =
    t(
      "cityOverviewMap.customerGrievances.subtitle",
      "Bengaluru complaint locations"
    );

  const loadingText =
    t(
      "cityOverviewMap.customerGrievances.loading",
      "Loading customer grievances..."
    );

  const errorText =
    t(
      "cityOverviewMap.customerGrievances.error",
      "Unable to load customer grievances."
    );

  const emptyText =
    t(
      "cityOverviewMap.customerGrievances.empty",
      "No customer grievances found."
    );

  const labels = {
    id:
      t(
        "cityOverviewMap.customerGrievances.id",
        "ID"
      ),

    ticket:
      t(
        "cityOverviewMap.customerGrievances.ticket",
        "Ticket"
      ),

    status:
      t(
        "cityOverviewMap.customerGrievances.status",
        "Status"
      ),

    category:
      t(
        "cityOverviewMap.customerGrievances.category",
        "Category"
      ),

    phone:
      t(
        "cityOverviewMap.customerGrievances.phone",
        "Phone"
      ),

    title:
      t(
        "cityOverviewMap.customerGrievances.complaintTitle",
        "Title"
      ),

    description:
      t(
        "cityOverviewMap.customerGrievances.description",
        "Description"
      ),

    address:
      t(
        "cityOverviewMap.customerGrievances.address",
        "Address"
      ),

    latitude:
      t(
        "cityOverviewMap.customerGrievances.latitude",
        "Latitude"
      ),

    longitude:
      t(
        "cityOverviewMap.customerGrievances.longitude",
        "Longitude"
      ),

    date:
      t(
        "cityOverviewMap.customerGrievances.date",
        "Date"
      ),

    image:
      t(
        "cityOverviewMap.customerGrievances.image",
        "Complaint Image"
      ),

    imageAlt:
      t(
        "cityOverviewMap.customerGrievances.imageAlt",
        "Complaint"
      ),

    complaints:
      t(
        "cityOverviewMap.customerGrievances.complaints",
        "Complaints"
      ),
  };


  /* ==========================================================
     FETCH COMPLAINTS
  ========================================================== */

  const fetchComplaints =
    async () => {
      abortRef.current?.abort();

      const controller =
        new AbortController();

      abortRef.current =
        controller;

      try {
        setLoading(true);
        setError("");

        console.log(
          "=============================================="
        );

        console.log(
          "📍 CUSTOMER GRIEVANCES MAP REQUEST"
        );

        console.log(
          "ENDPOINT:",
          CUSTOMER_GREV_ENDPOINT
        );

        console.log(
          "=============================================="
        );

        const response =
          await fetch(
            CUSTOMER_GREV_ENDPOINT,
            {
              method: "GET",

              headers: {
                Accept:
                  "application/json",
              },

              signal:
                controller.signal,
            }
          );

        const contentType =
          response.headers.get(
            "content-type"
          ) || "";

        const responseText =
          await response.text();

        if (
          !contentType.includes(
            "application/json"
          )
        ) {
          console.error(
            "❌ NON JSON RESPONSE:",
            responseText.substring(
              0,
              500
            )
          );

          throw new Error(
            `Backend returned ${response.status} ${response.statusText} instead of JSON.`
          );
        }

        let payload;

        try {
          payload =
            JSON.parse(
              responseText
            );
        } catch {
          throw new Error(
            "Backend returned invalid JSON."
          );
        }

        if (
          !response.ok
        ) {
          throw new Error(
            payload?.message ||
              `Request failed with status ${response.status}`
          );
        }

        if (
          controller.signal.aborted
        ) {
          return;
        }

        console.log(
          "✅ CUSTOMER GRIEVANCES RESPONSE:",
          payload
        );

        /*
         * Backend returns:
         *
         * {
         *   data: [
         *     {
         *       lat,
         *       long,
         *       data: {
         *         id,
         *         ticket_number,
         *         phone_number,
         *         title,
         *         description,
         *         category,
         *         image_url,
         *         address,
         *         status
         *       }
         *     }
         *   ]
         * }
         */

        const rawComplaints =
          extractComplaints(
            payload
          );

        console.log(
          "📍 RAW COMPLAINT COUNT:",
          rawComplaints.length
        );

        if (
          rawComplaints.length >
          0
        ) {
          console.log(
            "📍 FIRST RAW COMPLAINT:",
            rawComplaints[0]
          );

          console.log(
            "📍 FIRST NESTED DATA:",
            rawComplaints[0]?.data
          );
        }

        /*
         * Boundary.
         */

        const paths =
          extractBoundaryPaths(
            payload
          );

        console.log(
          "🟢 BENGALURU BOUNDARY POLYGONS:",
          paths.length
        );

        setBoundaryPaths(
          paths
        );

        /*
         * NORMALIZE.
         *
         * THIS IS THE IMPORTANT FIX.
         */

        const normalizedComplaints =
          rawComplaints
            .map(
              normalizeComplaint
            )
            .filter(Boolean);

        console.log(
          "📍 NORMALIZED COMPLAINT COUNT:",
          normalizedComplaints.length
        );

        if (
          normalizedComplaints.length >
          0
        ) {
          console.log(
            "📍 FIRST NORMALIZED COMPLAINT:",
            normalizedComplaints[0]
          );
        }

        setComplaints(
          normalizedComplaints
        );
      } catch (
        requestError
      ) {
        if (
          requestError?.name ===
          "AbortError"
        ) {
          return;
        }

        console.error(
          "❌ CUSTOMER GRIEVANCES ERROR:",
          requestError
        );

        setComplaints(
          []
        );

        setBoundaryPaths(
          []
        );

        setError(
          requestError?.message ||
            errorText
        );
      } finally {
        if (
          !controller.signal.aborted
        ) {
          setLoading(
            false
          );
        }
      }
    };


  /* ==========================================================
     INITIAL LOAD
  ========================================================== */

  useEffect(() => {
    fetchComplaints();

    return () => {
      abortRef.current?.abort();
    };
  }, []);


  /* ==========================================================
     BENGALURU FILTER
  ========================================================== */

  const visibleComplaints =
    useMemo(() => {
      /*
       * If backend already filtered
       * the complaints and no boundary
       * was returned, keep everything.
       */

      if (
        boundaryPaths.length ===
        0
      ) {
        return complaints;
      }

      return complaints.filter(
        (complaint) =>
          boundaryPaths.some(
            (polygon) =>
              isPointInsidePolygon(
                complaint.latitude,
                complaint.longitude,
                polygon
              )
          )
      );
    }, [
      complaints,
      boundaryPaths,
    ]);


  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <div
        className="
          relative
          h-full
          min-h-[420px]
          w-full
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
          sm:min-h-[500px]
          md:min-h-[560px]
          lg:min-h-[620px]
        "
      >
        <div
          className="
            absolute
            inset-0
            animate-pulse
            bg-slate-100
          "
        />

        <div
          className="
            absolute
            left-1/2
            top-1/2
            -translate-x-1/2
            -translate-y-1/2
            rounded-xl
            bg-white
            px-5
            py-3
            text-xs
            font-semibold
            text-slate-500
            shadow-lg
          "
        >
          {loadingText}
        </div>
      </div>
    );
  }


  /* ==========================================================
     ERROR
  ========================================================== */

  if (
    !loading &&
    error
  ) {
    return (
      <div
        className="
          flex
          h-full
          min-h-[420px]
          w-full
          items-center
          justify-center
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm
          sm:min-h-[500px]
          md:min-h-[560px]
        "
      >
        <div
          className="
            flex
            max-w-md
            flex-col
            items-center
            rounded-2xl
            border
            border-red-100
            bg-white
            px-6
            py-7
            text-center
            shadow-sm
          "
        >
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-red-50
              text-red-500
            "
          >
            <AlertCircle
              size={22}
            />
          </div>

          <h3
            className="
              mt-3
              text-base
              font-bold
              text-slate-900
            "
          >
            {title}
          </h3>

          <p
            className="
              mt-2
              text-xs
              leading-5
              text-red-600
            "
          >
            {error}
          </p>

          <button
            type="button"
            onClick={
              fetchComplaints
            }
            className="
              mt-4
              inline-flex
              items-center
              gap-2
              rounded-lg
              border
              border-red-200
              bg-white
              px-3
              py-2
              text-xs
              font-semibold
              text-red-600
              transition
              hover:bg-red-50
            "
          >
            <RefreshCw
              size={14}
            />

            {t(
              "common.retry",
              "Retry"
            )}
          </button>
        </div>
      </div>
    );
  }


  /* ==========================================================
     MAIN RENDER
  ========================================================== */

  return (
    <div
      className="
        relative
        h-full
        min-h-[420px]
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        sm:min-h-[500px]
        md:min-h-[560px]
        lg:min-h-[620px]
        xl:min-h-[650px]
      "
    >
      {/* ==================================================
          MAP
      ================================================== */}

      <MapContainer
        center={
          BENGALURU_CENTER
        }
        zoom={
          DEFAULT_ZOOM
        }
        scrollWheelZoom
        zoomControl={false}
        className="
          !h-full
          !w-full

          [&_.leaflet-container]:!h-full
          [&_.leaflet-container]:!w-full

          [&_.leaflet-tile-pane]:[filter:saturate(.28)_brightness(1.08)]

          [&_.leaflet-control-zoom]:!overflow-hidden
          [&_.leaflet-control-zoom]:!rounded-lg
          [&_.leaflet-control-zoom]:!border
          [&_.leaflet-control-zoom]:!border-[#D8E1EA]
          [&_.leaflet-control-zoom]:!shadow-[0_3px_12px_rgba(36,53,72,0.08)]

          [&_.leaflet-control-zoom_a]:!h-[30px]
          [&_.leaflet-control-zoom_a]:!w-[30px]
          [&_.leaflet-control-zoom_a]:!leading-[30px]
          [&_.leaflet-control-zoom_a]:!bg-white
          [&_.leaflet-control-zoom_a]:!text-[17px]
          [&_.leaflet-control-zoom_a]:!text-[#34475B]

          [&_.leaflet-popup-content-wrapper]:!overflow-hidden
          [&_.leaflet-popup-content-wrapper]:!rounded-[14px]

          [&_.leaflet-popup-content]:!m-0
          [&_.leaflet-popup-content]:!w-auto
          [&_.leaflet-popup-content]:!max-w-none

          [&_.leaflet-popup-tip]:!shadow-[0_4px_10px_rgba(30,45,60,0.08)]
        "
        preferCanvas={false}
      >
        <TileLayer
          url={
            CARTO_LIGHT_URL
          }
          attribution={
            CARTO_ATTRIBUTION
          }
          subdomains={[
            "a",
            "b",
            "c",
            "d",
          ]}
          maxZoom={20}
        />

        <MapSizeController />

        <BengaluruMapFocus
          boundaryPaths={
            boundaryPaths
          }
        />

        <ZoomControl
          position="bottomright"
        />

        {/* ==================================================
            BENGALURU BOUNDARY
        ================================================== */}

        {boundaryPaths.map(
          (
            polygon,
            index
          ) => (
            <Polygon
              key={
                `grievance-boundary-${index}`
              }
              positions={
                polygon
              }
              pathOptions={{
                color:
                  "#2563EB",

                weight: 3,

                opacity:
                  0.95,

                fillColor:
                  "#3B82F6",

                fillOpacity:
                  0.04,
              }}
            />
          )
        )}

        {/* ==================================================
            COMPLAINT MARKERS
        ================================================== */}

        {visibleComplaints.map(
          (
            complaint,
            index
          ) => (
            <Marker
              key={
                complaint?.data
                  ?.id ??
                complaint?.id ??
                `complaint-${index}`
              }
              position={[
                complaint.latitude,
                complaint.longitude,
              ]}
              icon={
                PERSON_ICON
              }
            >
              <Popup
                closeButton
                autoPan
                autoPanPadding={[
                  20,
                  20,
                ]}
                maxWidth={360}
                minWidth={280}
              >
                <ComplaintPopup
                  complaint={
                    complaint
                  }
                  labels={
                    labels
                  }
                />
              </Popup>
            </Marker>
          )
        )}
      </MapContainer>

      {/* ==================================================
          TOP LEFT TITLE
      ================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-3
          top-3
          z-[1000]
          max-w-[calc(100%-24px)]
          rounded-xl
          border
          border-white/80
          bg-white/95
          px-3
          py-2.5
          shadow-[0_10px_30px_rgba(30,45,60,0.08)]
          backdrop-blur-md
          sm:left-4
          sm:top-4
          sm:px-4
          sm:py-3
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-[#EDF5FC]
              text-[#2F80C9]
            "
          >
            <MapPin
              size={17}
            />
          </div>

          <div
            className="
              min-w-0
            "
          >
            <div
              className="
                truncate
                text-[13px]
                font-bold
                text-[#34475B]
                sm:text-[15px]
              "
            >
              {title}
            </div>

            <div
              className="
                truncate
                text-[9px]
                font-semibold
                text-[#8AA1BB]
                sm:text-[10px]
              "
            >
              {subtitle}
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          TOP RIGHT COUNT
      ================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          right-3
          top-3
          z-[1000]
          rounded-full
          border
          border-slate-200
          bg-white/95
          px-3
          py-1.5
          text-[10px]
          font-semibold
          text-slate-600
          shadow-sm
          backdrop-blur-md
          sm:right-4
          sm:top-4
        "
      >
        {visibleComplaints.length}{" "}
        {labels.complaints}
      </div>

      {/* ==================================================
          EMPTY
      ================================================== */}

      {!loading &&
        !error &&
        visibleComplaints.length ===
          0 && (
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              z-[900]
              flex
              items-center
              justify-center
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white/95
                px-4
                py-3
                text-xs
                font-semibold
                text-slate-500
                shadow-lg
                backdrop-blur-md
              "
            >
              <MapPin
                size={15}
              />

              {emptyText}
            </div>
          </div>
        )}
    </div>
  );
}