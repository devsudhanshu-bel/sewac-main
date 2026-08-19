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

import "leaflet/dist/leaflet.css";


/* ============================================================
   CONFIGURATION
============================================================ */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL 


/*
 * Customer grievances endpoint
 */
const CUSTOMER_GREV_ENDPOINT =
  `${API_BASE_URL}/api/complaintsGrev`;


/* ============================================================
   CUSTOM PERSON MARKER
============================================================ */

const createPersonIcon = () =>
  L.divIcon({
    className:
      "customer-grev-marker-wrapper",

    html: `
      <div class="customer-grev-marker">
        <div class="customer-grev-marker-inner">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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


const PERSON_ICON =
  createPersonIcon();


/* ============================================================
   EXTRACT DATA
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
   * Expected backend format:
   *
   * {
   *   lat,
   *   long,
   *   data: {
   *      ...
   *   }
   * }
   */

  const complaintData =
    item?.data || item;

  const latitude =
    Number(
      item?.lat ??
      complaintData?.lat ??
      complaintData?.latitude
    );

  const longitude =
    Number(
      item?.long ??
      complaintData?.long ??
      complaintData?.longitude
    );

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null;
  }

  return {
    latitude,
    longitude,

    data: {
      id:
        complaintData?.id ??
        null,

      ticket_number:
        complaintData?.ticket_number ??
        "",

      phone_number:
        complaintData?.phone_number ??
        "",

      title:
        complaintData?.title ??
        "",

      description:
        complaintData?.description ??
        "",

      category:
        complaintData?.category ??
        "",

      image_url:
        complaintData?.image_url ??
        "",

      address:
        complaintData?.address ??
        "",

      status:
        complaintData?.status ??
        "",
    },
  };
}


/* ============================================================
   MAP FIT CONTROLLER
============================================================ */

function ComplaintMapFit({
  complaints,
}) {

  const map =
    useMap();

  useEffect(() => {

    if (
      !complaints ||
      complaints.length === 0
    ) {
      return;
    }

    if (
      complaints.length === 1
    ) {

      map.setView(
        [
          complaints[0].latitude,
          complaints[0].longitude,
        ],
        14,
        {
          animate: true,
        }
      );

      return;
    }

    const bounds =
      L.latLngBounds(
        complaints.map(
          (
            complaint
          ) => [
            complaint.latitude,
            complaint.longitude,
          ]
        )
      );

    if (
      !bounds.isValid()
    ) {
      return;
    }

    map.fitBounds(
      bounds,
      {
        padding: [
          80,
          80,
        ],

        maxZoom:
          15,

        animate: true,
      }
    );

  }, [
    complaints,
    map,
  ]);

  return null;
}


/* ============================================================
   MAP SIZE CONTROLLER
============================================================ */

function MapSizeController() {

  const map =
    useMap();

  useEffect(() => {

    const timers = [
      setTimeout(
        () => {
          map.invalidateSize();
        },
        100
      ),

      setTimeout(
        () => {
          map.invalidateSize();
        },
        500
      ),

      setTimeout(
        () => {
          map.invalidateSize();
        },
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

  }, [
    map,
  ]);

  return null;
}


/* ============================================================
   STATUS CLASS
============================================================ */

function getStatusClass(
  status
) {

  switch (
    String(
      status || ""
    ).toUpperCase()
  ) {

    case "CLOSED":
      return "status-closed";

    case "PENDING":
      return "status-pending";

    case "ASSIGNED":
      return "status-assigned";

    case "IN_PROGRESS":
      return "status-progress";

    case "READY_FOR_VERIFICATION":
      return "status-verification";

    case "OTP_SENT":
      return "status-otp";

    default:
      return "status-default";
  }
}


/* ============================================================
   POPUP
============================================================ */

function ComplaintPopup({
  complaint,
}) {

  const data =
    complaint.data;

  return (
    <div className="cgv-popup">

      {/* HEADER */}

      <div className="cgv-popup-header">

        <div className="cgv-popup-icon">

          <UserRound
            size={18}
            strokeWidth={2}
          />

        </div>

        <div className="cgv-popup-heading">

          <div className="cgv-popup-title">
            Customer Grievance
          </div>

          <div className="cgv-popup-ticket">
            {data.ticket_number || "No ticket number"}
          </div>

        </div>

      </div>


      {/* STATUS */}

      <div className="cgv-popup-status-row">

        <span className="cgv-popup-label">
          STATUS
        </span>

        <span
          className={`cgv-status ${getStatusClass(
            data.status
          )}`}
        >
          {String(
            data.status || "UNKNOWN"
          ).replace(
            /_/g,
            " "
          )}
        </span>

      </div>


      {/* DATA */}

      <div className="cgv-popup-content">

        <div className="cgv-data-row">

          <span className="cgv-data-label">
            ID
          </span>

          <span className="cgv-data-value">
            {data.id ?? "—"}
          </span>

        </div>


        <div className="cgv-data-row">

          <span className="cgv-data-label">
            PHONE
          </span>

          <span className="cgv-data-value">
            {data.phone_number || "—"}
          </span>

        </div>


        <div className="cgv-data-row cgv-data-row-column">

          <span className="cgv-data-label">
            TITLE
          </span>

          <span className="cgv-data-value">
            {data.title || "—"}
          </span>

        </div>


        <div className="cgv-data-row cgv-data-row-column">

          <span className="cgv-data-label">
            DESCRIPTION
          </span>

          <span className="cgv-data-value cgv-description">
            {data.description || "—"}
          </span>

        </div>


        <div className="cgv-data-row">

          <span className="cgv-data-label">
            CATEGORY
          </span>

          <span className="cgv-data-value">
            {String(
              data.category || "—"
            ).replace(
              /_/g,
              " "
            )}
          </span>

        </div>


        <div className="cgv-data-row cgv-data-row-column">

          <span className="cgv-data-label">
            ADDRESS
          </span>

          <span className="cgv-data-value">
            {data.address || "—"}
          </span>

        </div>


        <div className="cgv-data-row">

          <span className="cgv-data-label">
            LATITUDE
          </span>

          <span className="cgv-data-value">
            {complaint.latitude}
          </span>

        </div>


        <div className="cgv-data-row">

          <span className="cgv-data-label">
            LONGITUDE
          </span>

          <span className="cgv-data-value">
            {complaint.longitude}
          </span>

        </div>


        {/* IMAGE */}

        {data.image_url && (

          <div className="cgv-image-section">

            <div className="cgv-data-label">
              IMAGE
            </div>

            <img
              src={data.image_url}
              alt="Complaint"
              className="cgv-complaint-image"
              loading="lazy"
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

  const [
    complaints,
    setComplaints,
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
          "============================================================"
        );

        console.log(
          "📍 CUSTOMER GRIEVANCES MAP REQUEST"
        );

        console.log(
          "ENDPOINT:",
          CUSTOMER_GREV_ENDPOINT
        );

        console.log(
          "============================================================"
        );


        const response =
          await fetch(
            CUSTOMER_GREV_ENDPOINT,
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


        if (
          !response.ok
        ) {

          throw new Error(
            `Customer grievances request failed with status ${response.status}`
          );

        }


        const result =
          await response.json();


        console.log(
          "📍 CUSTOMER GRIEVANCES RESPONSE:",
          result
        );


        if (
          result?.success ===
          false
        ) {

          throw new Error(
            result.message ||
              "Unable to load customer grievances."
          );

        }


        const rawComplaints =
          extractComplaints(
            result
          );


        const normalized =
          rawComplaints
            .map(
              normalizeComplaint
            )
            .filter(
              Boolean
            );


        console.log(
          "📍 CUSTOMER GRIEVANCES LOADED:",
          normalized.length
        );


        if (
          normalized.length > 0
        ) {

          console.log(
            "📍 FIRST GRIEVANCE:",
            normalized[0]
          );

        }


        setComplaints(
          normalized
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


        setError(
          requestError?.message ||
            "Unable to load customer grievances."
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
     MARKER DATA
  ========================================================== */

  const markerData =
    useMemo(
      () => complaints,
      [complaints]
    );


  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="cgv-container">

      <style>{`

        /* ====================================================
           CONTAINER
        ==================================================== */

        .cgv-container {
          position: relative;

          width: 100%;
          height: 100%;

          min-height: 500px;

          overflow: hidden;

          background: #ffffff;

          border-radius: 18px;
        }


        /* ====================================================
           MAP
        ==================================================== */

        .cgv-map {
          width: 100%;
          height: 100%;
        }


        .cgv-map
        .leaflet-container {
          width: 100%;
          height: 100%;
        }


        .cgv-map
        .leaflet-tile-pane {
          filter:
            saturate(.28)
            brightness(1.08);
        }


        /* ====================================================
           PERSON MARKER
        ==================================================== */

        .customer-grev-marker-wrapper {
          background: transparent;
          border: none;
        }


        .customer-grev-marker {
          width: 42px;
          height: 50px;

          display: flex;

          align-items: flex-start;
          justify-content: center;

          filter:
            drop-shadow(
              0 4px 6px
              rgba(0,0,0,.22)
            );
        }


        .customer-grev-marker-inner {
          width: 40px;
          height: 40px;

          margin-top: 0;

          display: flex;

          align-items: center;
          justify-content: center;

          background:
            #2f80c9;

          border:
            3px solid
            #ffffff;

          border-radius:
            50% 50% 50% 0;

          transform:
            rotate(-45deg);
        }


        .customer-grev-marker-inner svg {
          transform:
            rotate(45deg);
        }


        /* ====================================================
           POPUP
        ==================================================== */

        .cgv-map
        .leaflet-popup-content-wrapper {
          padding: 0;

          border-radius:
            14px;

          overflow: hidden;

          box-shadow:
            0 12px 35px
            rgba(
              30,
              45,
              60,
              .18
            );
        }


        .cgv-map
        .leaflet-popup-content {
          margin: 0;

          width: 340px !important;

          max-width:
            340px;
        }


        .cgv-map
        .leaflet-popup-tip {
          box-shadow:
            0 4px 10px
            rgba(
              30,
              45,
              60,
              .08
            );
        }


        .cgv-popup {
          width: 100%;

          background:
            #ffffff;

          color:
            #34475b;
        }


        /* ====================================================
           POPUP HEADER
        ==================================================== */

        .cgv-popup-header {
          display: flex;

          align-items: center;

          gap: 10px;

          padding:
            14px 15px;

          border-bottom:
            1px solid
            #e7edf3;
        }


        .cgv-popup-icon {
          width: 36px;
          height: 36px;

          display: flex;

          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border-radius: 10px;

          background:
            #edf5fc;

          color:
            #2f80c9;
        }


        .cgv-popup-heading {
          min-width: 0;
        }


        .cgv-popup-title {
          font-size: 14px;

          font-weight: 700;

          color:
            #263b50;
        }


        .cgv-popup-ticket {
          margin-top: 2px;

          font-size: 11px;

          font-weight: 600;

          color:
            #8aa0b6;

          white-space: nowrap;

          overflow: hidden;

          text-overflow: ellipsis;
        }


        /* ====================================================
           STATUS
        ==================================================== */

        .cgv-popup-status-row {
          display: flex;

          align-items: center;

          justify-content:
            space-between;

          gap: 10px;

          padding:
            10px 15px;

          background:
            #f8fafc;

          border-bottom:
            1px solid
            #e7edf3;
        }


        .cgv-popup-label,
        .cgv-data-label {
          font-size: 9px;

          font-weight: 700;

          letter-spacing:
            .45px;

          color:
            #8aa0b6;
        }


        .cgv-status {
          display: inline-flex;

          align-items: center;

          justify-content: center;

          padding:
            4px 8px;

          border-radius:
            999px;

          font-size: 9px;

          font-weight: 700;

          letter-spacing:
            .25px;
        }


        .status-pending {
          color:
            #9a6700;

          background:
            #fff4cc;
        }


        .status-closed {
          color:
            #16704a;

          background:
            #dcfce7;
        }


        .status-assigned {
          color:
            #1d4ed8;

          background:
            #dbeafe;
        }


        .status-progress {
          color:
            #6d28d9;

          background:
            #ede9fe;
        }


        .status-verification {
          color:
            #0369a1;

          background:
            #e0f2fe;
        }


        .status-otp {
          color:
            #9d174d;

          background:
            #fce7f3;
        }


        .status-default {
          color:
            #475569;

          background:
            #f1f5f9;
        }


        /* ====================================================
           DATA
        ==================================================== */

        .cgv-popup-content {
          padding:
            10px 15px 14px;

          max-height:
            390px;

          overflow-y:
            auto;
        }


        .cgv-data-row {
          display: grid;

          grid-template-columns:
            90px 1fr;

          gap: 10px;

          padding:
            7px 0;

          border-bottom:
            1px solid
            #f0f3f6;
        }


        .cgv-data-row:last-child {
          border-bottom:
            none;
        }


        .cgv-data-row-column {
          display: flex;

          flex-direction:
            column;

          gap: 3px;
        }


        .cgv-data-value {
          min-width: 0;

          font-size: 11px;

          line-height:
            1.45;

          font-weight: 600;

          color:
            #465b70;

          overflow-wrap:
            anywhere;
        }


        .cgv-description {
          font-weight: 500;

          color:
            #61758a;
        }


        /* ====================================================
           IMAGE
        ==================================================== */

        .cgv-image-section {
          padding-top:
            10px;
        }


        .cgv-complaint-image {
          display: block;

          width: 100%;

          max-height: 180px;

          margin-top: 6px;

          object-fit: cover;

          border-radius:
            9px;

          border:
            1px solid
            #e1e8ef;
        }


        /* ====================================================
           LOADING
        ==================================================== */

        .cgv-state {
          position: absolute;

          inset: 0;

          z-index: 1000;

          display: flex;

          align-items: center;
          justify-content: center;

          pointer-events: none;
        }


        .cgv-state-card {
          display: flex;

          align-items: center;

          gap: 9px;

          padding:
            11px 15px;

          background:
            rgba(
              255,
              255,
              255,
              .96
            );

          border:
            1px solid
            #dce5ed;

          border-radius:
            11px;

          box-shadow:
            0 8px 25px
            rgba(
              30,
              45,
              60,
              .12
            );

          font-size:
            12px;

          font-weight:
            600;

          color:
            #617b98;
        }


        .cgv-loading-icon {
          animation:
            cgv-spin 1s linear infinite;
        }


        @keyframes cgv-spin {
          from {
            transform:
              rotate(0deg);
          }

          to {
            transform:
              rotate(360deg);
          }
        }


        /* ====================================================
           ERROR
        ==================================================== */

        .cgv-error {
          color:
            #b42318;
        }


        .cgv-retry {
          display: inline-flex;

          align-items: center;

          gap: 5px;

          margin-left: 8px;

          padding:
            5px 8px;

          border:
            1px solid
            #e3b7b3;

          border-radius:
            7px;

          background:
            #fff;

          color:
            #b42318;

          font-size:
            10px;

          font-weight:
            700;

          cursor: pointer;
        }


        /* ====================================================
           EMPTY
        ==================================================== */

        .cgv-empty {
          color:
            #617b98;
        }


        /* ====================================================
           RESPONSIVE
        ==================================================== */

        @media (
          max-width: 600px
        ) {

          .cgv-map
          .leaflet-popup-content {
            width:
              290px !important;

            max-width:
              290px;
          }

        }

      `}</style>


      {/* ====================================================
          MAP
      ==================================================== */}

      <MapContainer
        center={[
          12.9716,
          77.5946,
        ]}

        zoom={11}

        zoomControl={false}

        className="cgv-map"

        scrollWheelZoom={true}

        preferCanvas={false}
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

          maxZoom={20}
        />


        <ZoomControl
          position="bottomright"
        />


        <MapSizeController />


        <ComplaintMapFit
          complaints={
            markerData
          }
        />


        {/* ==================================================
            COMPLAINT MARKERS
        ================================================== */}

        {markerData.map(
          (
            complaint
          ) => (

            <Marker
              key={
                `complaint-${
                  complaint.data.id
                }-${
                  complaint.latitude
                }-${
                  complaint.longitude
                }`
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
                closeButton={true}
                autoPan={true}
              >

                <ComplaintPopup
                  complaint={
                    complaint
                  }
                />

              </Popup>

            </Marker>

          )
        )}

      </MapContainer>


      {/* ====================================================
          LOADING
      ==================================================== */}

      {loading && (

        <div className="cgv-state">

          <div className="cgv-state-card">

            <RefreshCw
              size={15}
              className="cgv-loading-icon"
            />

            Loading customer grievances...

          </div>

        </div>

      )}


      {/* ====================================================
          ERROR
      ==================================================== */}

      {!loading &&
        error && (

        <div className="cgv-state">

          <div
            className={
              "cgv-state-card cgv-error"
            }
          >

            <AlertCircle
              size={16}
            />

            <span>
              {error}
            </span>

            <button
              type="button"
              className="cgv-retry"
              onClick={
                fetchComplaints
              }
            >
              Retry
            </button>

          </div>

        </div>

      )}


      {/* ====================================================
          EMPTY
      ==================================================== */}

      {!loading &&
        !error &&
        markerData.length === 0 && (

        <div className="cgv-state">

          <div
            className={
              "cgv-state-card cgv-empty"
            }
          >

            <MapPin
              size={16}
            />

            No customer grievances available

          </div>

        </div>

      )}

    </div>
  );
}