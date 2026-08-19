import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  GeoJSON,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import {
  UserRound,
  MapPin,
  Ticket,
  Phone,
  FileText,
  Tag,
  Image as ImageIcon,
  Activity,
  Maximize2,
  Loader2,
  AlertCircle,
} from "lucide-react";

import "leaflet/dist/leaflet.css";


// ============================================================
// LEAFLET DEFAULT MARKER
// ============================================================

import markerIcon2x from
  "leaflet/dist/images/marker-icon-2x.png";

import markerIcon from
  "leaflet/dist/images/marker-icon.png";

import markerShadow from
  "leaflet/dist/images/marker-shadow.png";


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({

  iconRetinaUrl:
    markerIcon2x,

  iconUrl:
    markerIcon,

  shadowUrl:
    markerShadow,

});


// ============================================================
// API
// ============================================================

const API_URL =
  "/api/complaints-grev/locations";


// ============================================================
// MAP BOUNDARY FITTER
// ============================================================

function FitBoundary({
  boundary,
}) {

  const map =
    useMap();


  useEffect(() => {

    if (
      !boundary
    ) {

      return;

    }


    try {

      const geoJsonLayer =
        L.geoJSON(
          boundary
        );


      const bounds =
        geoJsonLayer.getBounds();


      if (
        bounds.isValid()
      ) {

        map.fitBounds(
          bounds,
          {
            padding: [
              35,
              35,
            ],

            maxZoom:
              13,

          }
        );

      }

    } catch (
      error
    ) {

      console.error(
        "❌ Failed to fit Bengaluru boundary:",
        error
      );

    }

  }, [
    boundary,
    map,
  ]);


  return null;

}


// ============================================================
// NORMALIZE BOUNDARY
// ============================================================

function normalizeBoundary(
  boundary
) {

  if (
    !boundary
  ) {

    return null;

  }


  /*
   * GeoJSON Feature
   */

  if (
    boundary.type ===
    "Feature"
  ) {

    return boundary;

  }


  /*
   * GeoJSON FeatureCollection
   */

  if (
    boundary.type ===
    "FeatureCollection"
  ) {

    return boundary;

  }


  /*
   * GeoJSON Polygon / MultiPolygon
   */

  if (
    boundary.type ===
      "Polygon" ||
    boundary.type ===
      "MultiPolygon"
  ) {

    return {

      type:
        "Feature",

      properties:
        {},

      geometry:
        boundary,

    };

  }


  /*
   * Raw Polygon coordinates
   */

  if (
    Array.isArray(
      boundary
    )
  ) {

    return {

      type:
        "Feature",

      properties:
        {},

      geometry: {

        type:
          "Polygon",

        coordinates:
          boundary,

      },

    };

  }


  return null;

}


// ============================================================
// STATUS STYLE
// ============================================================

function getStatusStyle(
  status
) {

  switch (
    status
  ) {

    case "CLOSED":

      return {
        badge:
          "bg-green-100 text-green-700",
      };


    case "ASSIGNED":

      return {
        badge:
          "bg-blue-100 text-blue-700",
      };


    case "IN_PROGRESS":

      return {
        badge:
          "bg-yellow-100 text-yellow-700",
      };


    case "READY_FOR_VERIFICATION":

      return {
        badge:
          "bg-purple-100 text-purple-700",
      };


    case "OTP_SENT":

      return {
        badge:
          "bg-indigo-100 text-indigo-700",
      };


    default:

      return {
        badge:
          "bg-red-100 text-red-700",
      };

  }

}


// ============================================================
// COMPONENT
// ============================================================

export default function CustomerGrev() {

  const [
    complaints,
    setComplaints,
  ] =
    useState([]);


  const [
    boundary,
    setBoundary,
  ] =
    useState(null);


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    error,
    setError,
  ] =
    useState(null);


  const [
    selectedComplaint,
    setSelectedComplaint,
  ] =
    useState(null);


  // ==========================================================
  // FETCH DATA
  // ==========================================================

  useEffect(() => {

    let mounted =
      true;


    const fetchComplaints =
      async () => {

        try {

          setLoading(
            true
          );

          setError(
            null
          );


          console.log(
            "📍 Fetching complaint grievance locations..."
          );


          const response =
            await fetch(
              API_URL
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


          console.log(
            "📍 Complaint grievance response:",
            result
          );


          if (
            !result.success
          ) {

            throw new Error(
              result.message ||
              "Failed to fetch complaint locations."
            );

          }


          if (
            !mounted
          ) {

            return;

          }


          /*
           * Bengaluru boundary
           */

          const normalizedBoundary =
            normalizeBoundary(
              result.boundary
            );


          setBoundary(
            normalizedBoundary
          );


          /*
           * Complaint points
           */

          const validComplaints =
            Array.isArray(
              result.data
            )
              ? result.data.filter(
                  (
                    item
                  ) => {

                    const lat =
                      Number(
                        item?.lat
                      );

                    const long =
                      Number(
                        item?.long
                      );


                    return (
                      Number.isFinite(
                        lat
                      ) &&
                      Number.isFinite(
                        long
                      )
                    );

                  }
                )
              : [];


          setComplaints(
            validComplaints
          );


          console.log(
            "📍 Bengaluru boundary:",
            normalizedBoundary
          );


          console.log(
            "📍 Bengaluru complaints:",
            validComplaints.length
          );

        } catch (
          fetchError
        ) {

          console.error(
            "❌ Complaint grievance frontend error:",
            fetchError
          );


          if (
            mounted
          ) {

            setError(
              fetchError.message ||
              "Unable to load complaint locations."
            );

          }

        } finally {

          if (
            mounted
          ) {

            setLoading(
              false
            );

          }

        }

      };


    fetchComplaints();


    return () => {

      mounted =
        false;

    };

  }, []);


  // ==========================================================
  // MAP CENTER
  // ==========================================================

  const mapCenter =
    useMemo(
      () => {

        /*
         * Bengaluru fallback only.
         *
         * Actual view is fitted to
         * the returned boundary.
         */

        return [
          12.9716,
          77.5946,
        ];

      },
      []
    );


  // ==========================================================
  // MAXIMIZE
  // ==========================================================

  const handleMaximize =
    () => {

      const element =
        document.querySelector(
          ".customer-grev-map"
        );


      if (
        !element
      ) {

        return;

      }


      if (
        !document.fullscreenElement
      ) {

        element
          .requestFullscreen?.();

      } else {

        document
          .exitFullscreen?.();

      }

    };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div
      className="
        customer-grev-map
        mt-8
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-5
        shadow-sm
      "
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          mb-5
          flex
          items-center
          justify-between
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

            <UserRound
              size={20}
              className="text-violet-600"
            />

            <h2
              className="
                text-lg
                font-bold
                uppercase
                tracking-wide
                text-gray-900
              "
            >
              Citizen Grievances
            </h2>

          </div>


          <p
            className="
              mt-1
              text-xs
              text-gray-500
            "
          >
            Complaint locations within Bengaluru
          </p>

        </div>


        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          {/* =================================================
              COUNT
          ================================================= */}

          <div
            className="
              rounded-xl
              border
              border-gray-200
              bg-gray-50
              px-3
              py-2
              text-xs
              font-semibold
              text-gray-700
            "
          >

            {loading
              ? "Loading..."
              : `${complaints.length} Complaints`
            }

          </div>


          {/* =================================================
              MAXIMIZE
          ================================================= */}

          <button
            type="button"
            onClick={
              handleMaximize
            }
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-gray-200
              bg-white
              text-gray-600
              transition
              hover:bg-gray-50
              hover:text-gray-900
            "
            title="Maximize map"
          >

            <Maximize2
              size={18}
            />

          </button>

        </div>

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (

        <div
          className="
            mb-4
            flex
            items-center
            gap-3
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-700
          "
        >

          <AlertCircle
            size={18}
          />

          <span>
            {error}
          </span>

        </div>

      )}


      {/* =====================================================
          MAP
      ===================================================== */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-gray-200
        "
      >

        <MapContainer

          center={
            mapCenter
          }

          zoom={12}

          zoomControl={
            true
          }

          scrollWheelZoom={
            true
          }

          className="
            h-[560px]
            w-full
          "

        >

          {/* =================================================
              TILE LAYER
          ================================================= */}

          <TileLayer

            attribution="
              &copy; OpenStreetMap contributors
              &copy; CARTO
            "

            url="
              https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png
            "

          />


          {/* =================================================
              FIT TO BENGALURU
          ================================================= */}

          <FitBoundary
            boundary={
              boundary
            }
          />


          {/* =================================================
              BENGALURU BOUNDARY
          ================================================= */}

          {boundary && (

            <GeoJSON

              key={
                JSON.stringify(
                  boundary
                )
              }

              data={
                boundary
              }

              style={{
                color:
                  "#7c3aed",

                weight:
                  2.5,

                opacity:
                  0.9,

                fillColor:
                  "#8b5cf6",

                fillOpacity:
                  0.06,

              }}

            />

          )}


          {/* =================================================
              COMPLAINT MARKERS
          ================================================= */}

          {complaints.map(
            (
              complaint,
              index
            ) => {

              const latitude =
                Number(
                  complaint.lat
                );

              const longitude =
                Number(
                  complaint.long
                );


              const data =
                complaint.data ||
                {};


              const statusStyle =
                getStatusStyle(
                  data.status
                );


              return (

                <Marker

                  key={
                    data.id ??
                    index
                  }

                  position={[
                    latitude,
                    longitude,
                  ]}

                  eventHandlers={{
                    mouseover:
                      () => {

                        setSelectedComplaint(
                          data.id
                        );

                      },

                    mouseout:
                      () => {

                        setSelectedComplaint(
                          null
                        );

                      },
                  }}

                >

                  <Popup
                    maxWidth={
                      340
                    }

                    minWidth={
                      300
                    }

                  >

                    <div
                      className="
                        w-[300px]
                        p-1
                      "
                    >

                      {/* =====================================
                          HEADER
                      ===================================== */}

                      <div
                        className="
                          mb-4
                          flex
                          items-start
                          justify-between
                          gap-3
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            gap-3
                          "
                        >

                          <div
                            className="
                              flex
                              h-11
                              w-11
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              bg-violet-100
                            "
                          >

                            <UserRound
                              size={22}
                              className="
                                text-violet-600
                              "
                            />

                          </div>


                          <div>

                            <h3
                              className="
                                max-w-[190px]
                                text-sm
                                font-bold
                                leading-tight
                                text-gray-900
                              "
                            >
                              {data.title ||
                                "Citizen Complaint"
                              }
                            </h3>


                            <span
                              className={`
                                mt-1
                                inline-flex
                                rounded-full
                                px-2
                                py-0.5
                                text-[10px]
                                font-bold
                                ${statusStyle.badge}
                              `}
                            >
                              {data.status ||
                                "UNKNOWN"
                              }
                            </span>

                          </div>

                        </div>

                      </div>


                      {/* =====================================
                          DATA
                      ===================================== */}

                      <div
                        className="
                          space-y-3
                          text-xs
                        "
                      >

                        {/* ===================================
                            TICKET
                        =================================== */}

                        <div
                          className="
                            flex
                            items-start
                            gap-2
                          "
                        >

                          <Ticket
                            size={15}
                            className="
                              mt-0.5
                              shrink-0
                              text-violet-600
                            "
                          />

                          <div>

                            <div
                              className="
                                text-[10px]
                                font-semibold
                                uppercase
                                text-gray-400
                              "
                            >
                              Ticket
                            </div>

                            <div
                              className="
                                font-semibold
                                text-gray-800
                              "
                            >
                              {data.ticket_number ||
                                "N/A"
                              }
                            </div>

                          </div>

                        </div>


                        {/* ===================================
                            PHONE
                        =================================== */}

                        <div
                          className="
                            flex
                            items-start
                            gap-2
                          "
                        >

                          <Phone
                            size={15}
                            className="
                              mt-0.5
                              shrink-0
                              text-violet-600
                            "
                          />

                          <div>

                            <div
                              className="
                                text-[10px]
                                font-semibold
                                uppercase
                                text-gray-400
                              "
                            >
                              Phone
                            </div>

                            <div
                              className="
                                font-semibold
                                text-gray-800
                              "
                            >
                              {data.phone_number ||
                                "N/A"
                              }
                            </div>

                          </div>

                        </div>


                        {/* ===================================
                            CATEGORY
                        =================================== */}

                        <div
                          className="
                            flex
                            items-start
                            gap-2
                          "
                        >

                          <Tag
                            size={15}
                            className="
                              mt-0.5
                              shrink-0
                              text-violet-600
                            "
                          />

                          <div>

                            <div
                              className="
                                text-[10px]
                                font-semibold
                                uppercase
                                text-gray-400
                              "
                            >
                              Category
                            </div>

                            <div
                              className="
                                font-semibold
                                text-gray-800
                              "
                            >
                              {data.category ||
                                "N/A"
                              }
                            </div>

                          </div>

                        </div>


                        {/* ===================================
                            ADDRESS
                        =================================== */}

                        <div
                          className="
                            flex
                            items-start
                            gap-2
                          "
                        >

                          <MapPin
                            size={15}
                            className="
                              mt-0.5
                              shrink-0
                              text-violet-600
                            "
                          />

                          <div>

                            <div
                              className="
                                text-[10px]
                                font-semibold
                                uppercase
                                text-gray-400
                              "
                            >
                              Address
                            </div>

                            <div
                              className="
                                leading-relaxed
                                text-gray-700
                              "
                            >
                              {data.address ||
                                "N/A"
                              }
                            </div>

                          </div>

                        </div>


                        {/* ===================================
                            DESCRIPTION
                        =================================== */}

                        <div
                          className="
                            flex
                            items-start
                            gap-2
                          "
                        >

                          <FileText
                            size={15}
                            className="
                              mt-0.5
                              shrink-0
                              text-violet-600
                            "
                          />

                          <div>

                            <div
                              className="
                                text-[10px]
                                font-semibold
                                uppercase
                                text-gray-400
                              "
                            >
                              Description
                            </div>

                            <div
                              className="
                                leading-relaxed
                                text-gray-700
                              "
                            >
                              {data.description ||
                                "N/A"
                              }
                            </div>

                          </div>

                        </div>


                        {/* ===================================
                            COORDINATES
                        =================================== */}

                        <div
                          className="
                            flex
                            items-start
                            gap-2
                          "
                        >

                          <Activity
                            size={15}
                            className="
                              mt-0.5
                              shrink-0
                              text-violet-600
                            "
                          />

                          <div>

                            <div
                              className="
                                text-[10px]
                                font-semibold
                                uppercase
                                text-gray-400
                              "
                            >
                              Coordinates
                            </div>

                            <div
                              className="
                                font-mono
                                text-[11px]
                                text-gray-700
                              "
                            >
                              {latitude.toFixed(
                                7
                              )}

                              {" , "}

                              {longitude.toFixed(
                                7
                              )}
                            </div>

                          </div>

                        </div>


                        {/* ===================================
                            IMAGE
                        =================================== */}

                        {data.image_url && (

                          <div
                            className="
                              pt-1
                            "
                          >

                            <div
                              className="
                                mb-2
                                flex
                                items-center
                                gap-2
                                text-[10px]
                                font-semibold
                                uppercase
                                text-gray-400
                              "
                            >

                              <ImageIcon
                                size={14}
                              />

                              Complaint Image

                            </div>


                            <img
                              src={
                                data.image_url
                              }
                              alt={
                                data.title ||
                                "Complaint"
                              }
                              className="
                                max-h-40
                                w-full
                                rounded-xl
                                border
                                border-gray-200
                                object-cover
                              "
                            />

                          </div>

                        )}

                      </div>

                    </div>

                  </Popup>

                </Marker>

              );

            }
          )}

        </MapContainer>

      </div>


      {/* =====================================================
          LOADING OVERLAY
      ===================================================== */}

      {loading && (

        <div
          className="
            mt-3
            flex
            items-center
            justify-center
            gap-2
            text-xs
            font-medium
            text-gray-500
          "
        >

          <Loader2
            size={15}
            className="
              animate-spin
            "
          />

          Loading Bengaluru complaint locations...

        </div>

      )}


      {/* =====================================================
          MAP STATUS
      ===================================================== */}

      {!loading &&
        !error && (

          <div
            className="
              mt-3
              flex
              items-center
              justify-between
              text-[11px]
              text-gray-400
            "
          >

            <span>
              Bengaluru city boundary
            </span>

            <span>
              {complaints.length} complaint
              {complaints.length !== 1
                ? "s"
                : ""
              }
            </span>

          </div>

        )}

    </div>

  );

}