import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  MapContainer,
  TileLayer,
  GeoJSON,
  ZoomControl,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import {
  Map as MapIcon,
  ChevronDown,
  Loader2,
  AlertCircle,
} from "lucide-react";

import "leaflet/dist/leaflet.css";

/**
 * ============================================================
 * CONFIGURATION
 * ============================================================
 *
 * Add this to your frontend .env:
 *
 * VITE_API_BASE_URL=https://your-render-backend.onrender.com
 *
 * Example:
 *
 * VITE_API_BASE_URL=https://sewac-main.onrender.com
 *
 * IMPORTANT:
 * Do NOT put /api at the end.
 *
 * ============================================================
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5002";


/**
 * City ID
 *
 * Currently Bangalore = 1.
 *
 * Later this can come from your city selector/auth context.
 */
const CITY_ID = 1;


/**
 * ============================================================
 * MAP CONFIGURATION
 * ============================================================
 */

const DEFAULT_CENTER = [
  12.9716,
  77.5946,
];

const DEFAULT_ZOOM = 11;


/**
 * Grey CARTO map.
 */
const MAP_TILE_URL =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";


/**
 * ============================================================
 * MAP FITTER
 * ============================================================
 *
 * Automatically fits the map around the city boundary.
 * ============================================================
 */

function FitGeoJsonBounds({
  geoJson,
}) {
  const map = useMap();

  useEffect(() => {
    if (!geoJson) {
      return;
    }

    try {
      const layer =
        L.geoJSON(
          geoJson
        );

      const bounds =
        layer.getBounds();

      if (
        bounds &&
        bounds.isValid()
      ) {
        map.fitBounds(
          bounds,
          {
            padding: [
              35,
              35,
            ],
            maxZoom: 12,
          }
        );
      }
    } catch (error) {
      console.error(
        "Failed to fit GeoJSON bounds:",
        error
      );
    }
  }, [
    geoJson,
    map,
  ]);

  return null;
}


/**
 * ============================================================
 * GEOJSON NORMALIZER
 * ============================================================
 *
 * Backend can return:
 *
 * 1. FeatureCollection
 * 2. Feature
 * 3. Polygon
 * 4. MultiPolygon
 *
 * This function makes sure Leaflet receives something
 * GeoJSON-compatible.
 * ============================================================
 */

function normalizeGeoJson(
  value
) {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
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
      console.error(
        "Invalid GeoJSON string:",
        error
      );

      return null;
    }
  }

  if (
    typeof value !== "object"
  ) {
    return null;
  }

  /**
   * Already a proper GeoJSON object.
   */
  if (
    value.type
  ) {
    return value;
  }

  return null;
}


/**
 * ============================================================
 * CITY BOUNDARY STYLE
 * ============================================================
 *
 * City is ONLY an outline.
 *
 * No fill.
 * ============================================================
 */

const CITY_BOUNDARY_STYLE = {
  color: "#475569",
  weight: 3,
  opacity: 0.95,
  fill: false,
  fillOpacity: 0,
};


/**
 * ============================================================
 * ZONE BOUNDARY STYLE
 * ============================================================
 */

const ZONE_BOUNDARY_STYLE = {
  color: "#64748B",
  weight: 1.8,
  opacity: 0.9,
  fillColor: "#94A3B8",
  fillOpacity: 0.055,
};


/**
 =============================================================
 * SELECTED ZONE STYLE
 =============================================================
 */

const SELECTED_ZONE_STYLE = {
  color: "#7C3AED",
  weight: 2.6,
  opacity: 1,
  fillColor: "#8B5CF6",
  fillOpacity: 0.12,
};


/**
 * ============================================================
 * MAIN COMPONENT
 * ============================================================
 */

export default function CityMapOverview() {

  /**
   * ----------------------------------------------------------
   * DATA STATE
   * ----------------------------------------------------------
   */

  const [
    cityData,
    setCityData,
  ] = useState(null);

  const [
    zones,
    setZones,
  ] = useState([]);

  const [
    selectedZone,
    setSelectedZone,
  ] = useState("");


  /**
   * ----------------------------------------------------------
   * UI STATE
   * ----------------------------------------------------------
   */

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");


  /**
   * ----------------------------------------------------------
   * DROPDOWN STATE
   * ----------------------------------------------------------
   */

  const [
    mapModeOpen,
    setMapModeOpen,
  ] = useState(false);

  const [
    zoneOpen,
    setZoneOpen,
  ] = useState(false);

  const [
    divisionOpen,
    setDivisionOpen,
  ] = useState(false);

  const [
    wardOpen,
    setWardOpen,
  ] = useState(false);


  /**
   * ----------------------------------------------------------
   * PLACEHOLDER FILTER STATES
   * ----------------------------------------------------------
   *
   * We are integrating City + Zone first.
   *
   * Division/Ward will be connected in the next API stage.
   * ----------------------------------------------------------
   */

  const [
    selectedDivision,
    setSelectedDivision,
  ] = useState(
    "All Divisions"
  );

  const [
    selectedWard,
    setSelectedWard,
  ] = useState(
    "All Wards"
  );


  /**
   * ==========================================================
   * FETCH CITY MAP DATA
   * ==========================================================
   */

  const fetchCityMapData =
    useCallback(
      async () => {

        try {

          setLoading(true);
          setError("");

          /**
           * Endpoint:
           *
           * GET
           * /api/master-citizen/map/city/:cityId
           */

          const endpoint =
            `${API_BASE_URL}/api/master-citizen/map/city/${CITY_ID}`;


          console.log(
            "===================================="
          );

          console.log(
            "🗺️ CITY MAP REQUEST"
          );

          console.log(
            "API:",
            endpoint
          );

          console.log(
            "City ID:",
            CITY_ID
          );

          console.log(
            "===================================="
          );


          const response =
            await fetch(
              endpoint,
              {
                method: "GET",

                headers: {
                  Accept:
                    "application/json",
                },
              }
            );


          /**
           * HTTP error.
           */

          if (
            !response.ok
          ) {

            let errorMessage =
              `Request failed with status ${response.status}`;

            try {

              const errorData =
                await response.json();

              if (
                errorData?.message
              ) {
                errorMessage =
                  errorData.message;
              }

            } catch (
              parseError
            ) {
              // Ignore JSON parsing failure.
            }

            throw new Error(
              errorMessage
            );
          }


          const data =
            await response.json();


          console.log(
            "🗺️ CITY MAP RESPONSE:",
            data
          );


          /**
           * Backend success validation.
           */

          if (
            data?.success === false
          ) {
            throw new Error(
              data?.message ||
              "Backend returned an unsuccessful response."
            );
          }


          /**
           * City data.
           */

          const receivedCity =
            data?.city || null;


          /**
           * Zones.
           */

          const receivedZones =
            Array.isArray(
              data?.zones
            )
              ? data.zones
              : [];


          setCityData(
            receivedCity
          );

          setZones(
            receivedZones
          );


          /**
           * Default:
           *
           * All Zones
           *
           * Don't select a specific zone initially.
           */

          setSelectedZone("");


          console.log(
            "🏙️ CITY:",
            receivedCity
          );

          console.log(
            "📍 TOTAL ZONES:",
            receivedZones.length
          );

          console.log(
            "📍 ZONES:",
            receivedZones
          );

        } catch (
          fetchError
        ) {

          console.error(
            "❌ CITY MAP FETCH ERROR:",
            fetchError
          );

          setError(
            fetchError?.message ||
            "Unable to load city map."
          );

          setCityData(
            null
          );

          setZones([]);

        } finally {

          setLoading(false);

        }

      },
      []
    );


  /**
   * ==========================================================
   * INITIAL LOAD
   * ==========================================================
   */

  useEffect(
    () => {
      fetchCityMapData();
    },
    [
      fetchCityMapData,
    ]
  );


  /**
   * ==========================================================
   * NORMALIZED CITY BOUNDARY
   * ==========================================================
   */

  const cityBoundary =
    useMemo(
      () =>
        normalizeGeoJson(
          cityData?.geoBoundary
        ),
      [
        cityData,
      ]
    );


  /**
   * ==========================================================
   * NORMALIZED ZONE DATA
   * ==========================================================
   */

  const normalizedZones =
    useMemo(
      () => {

        return zones
          .map(
            (
              zone,
              index
            ) => {

              if (
                typeof zone ===
                "string"
              ) {

                return {
                  zoneName:
                    zone,

                  geoBoundary:
                    null,

                  zoneTableName:
                    null,

                  index,
                };

              }


              return {

                zoneName:
                  zone?.zoneName ||
                  `Zone ${index + 1}`,

                geoBoundary:
                  normalizeGeoJson(
                    zone?.geoBoundary
                  ),

                zoneTableName:
                  zone?.zoneTableName ||
                  null,

                index,

              };

            }
          );

      },
      [
        zones,
      ]
    );


  /**
   * ==========================================================
   * SELECTED ZONE
   * ==========================================================
   */

  const selectedZoneObject =
    useMemo(
      () => {

        if (
          !selectedZone
        ) {
          return null;
        }

        return (
          normalizedZones.find(
            (zone) =>
              zone.zoneName ===
              selectedZone
          ) ||
          null
        );

      },
      [
        normalizedZones,
        selectedZone,
      ]
    );


  /**
   * ==========================================================
   * ZONE DROPDOWN HANDLER
   * ==========================================================
   */

  const handleZoneSelect =
    (
      zoneName
    ) => {

      setSelectedZone(
        zoneName
      );

      setZoneOpen(
        false
      );

      /**
       * Reset lower-level filters
       * when changing zone.
       */

      setSelectedDivision(
        "All Divisions"
      );

      setSelectedWard(
        "All Wards"
      );

    };


  /**
   * ==========================================================
   * MAP CENTER
   * ==========================================================
   */

  const mapCenter =
    DEFAULT_CENTER;


  /**
   * ==========================================================
   * RENDER
   * ==========================================================
   */

  return (
    <div
      style={{
        width: "100%",
        border:
          "1px solid #E2E8F0",
        borderRadius: "24px",
        background: "#FFFFFF",
        padding: "26px",
        boxSizing:
          "border-box",
        boxShadow:
          "0 2px 10px rgba(15, 23, 42, 0.035)",
      }}
    >

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div
        style={{
          marginBottom:
            "26px",
        }}
      >

        <h2
          style={{
            margin: 0,
            fontSize: "27px",
            lineHeight: 1.2,
            fontWeight: 700,
            letterSpacing:
              "-0.4px",
            color: "#020617",
          }}
        >
          CITY OVERVIEW MAP
        </h2>

      </div>


      {/* =====================================================
          MAP WRAPPER
          ===================================================== */}

      <div
        style={{
          position:
            "relative",
          width: "100%",
          height: "810px",
          minHeight:
            "620px",
          overflow:
            "hidden",
          border:
            "1px solid #CBD5E1",
          borderRadius:
            "22px",
          background:
            "#F8FAFC",
        }}
      >

        {/* ===================================================
            MAP
            =================================================== */}

        <MapContainer
          center={
            mapCenter
          }
          zoom={
            DEFAULT_ZOOM
          }
          zoomControl={
            false
          }
          scrollWheelZoom={
            true
          }
          style={{
            width: "100%",
            height: "100%",
            background:
              "#F8FAFC",
          }}
        >

          <TileLayer
            url={
              MAP_TILE_URL
            }
            attribution="&copy; OpenStreetMap contributors &copy; CARTO"
          />


          {/* =================================================
              CUSTOM ZOOM CONTROL
              ================================================= */}

          <ZoomControl
            position="topleft"
          />


          {/* =================================================
              CITY BOUNDARY
              =================================================
              
              CITY = OUTLINE ONLY
              ================================================= */}

          {cityBoundary && (
            <>

              <GeoJSON
                key="city-boundary"
                data={
                  cityBoundary
                }
                style={() =>
                  CITY_BOUNDARY_STYLE
                }
              />

              <FitGeoJsonBounds
                geoJson={
                  cityBoundary
                }
              />

            </>
          )}


          {/* =================================================
              ZONE BOUNDARIES
              ================================================= */}

          {normalizedZones.map(
            (
              zone
            ) => {

              if (
                !zone.geoBoundary
              ) {
                return null;
              }


              const isSelected =
                selectedZone ===
                zone.zoneName;


              return (
                <GeoJSON
                  key={
                    zone.zoneTableName ||
                    zone.zoneName
                  }
                  data={
                    zone.geoBoundary
                  }
                  style={() =>
                    isSelected
                      ? SELECTED_ZONE_STYLE
                      : ZONE_BOUNDARY_STYLE
                  }
                  onEachFeature={(
                    feature,
                    layer
                  ) => {

                    /**
                     * Popup.
                     */

                    layer.bindTooltip(
                      zone.zoneName,
                      {
                        sticky:
                          true,

                        direction:
                          "center",

                        className:
                          "sewac-zone-tooltip",
                      }
                    );


                    /**
                     * Hover.
                     */

                    layer.on(
                      {
                        mouseover:
                          () => {

                            if (
                              !isSelected
                            ) {

                              layer.setStyle(
                                {
                                  color:
                                    "#475569",

                                  weight:
                                    2.5,

                                  fillColor:
                                    "#64748B",

                                  fillOpacity:
                                    0.10,
                                }
                              );

                            }

                          },

                        mouseout:
                          () => {

                            if (
                              !isSelected
                            ) {

                              layer.setStyle(
                                ZONE_BOUNDARY_STYLE
                              );

                            }

                          },

                        click:
                          () => {

                            handleZoneSelect(
                              zone.zoneName
                            );

                          },
                      }
                    );

                  }}
                />
              );

            }
          )}

        </MapContainer>


        {/* ===================================================
            MAP MODE CARD
            =================================================== */}

        <div
          style={{
            position:
              "absolute",
            top: "26px",
            left: "26px",
            width: "525px",
            zIndex: 1000,
          }}
        >

          <button
            type="button"
            onClick={() =>
              setMapModeOpen(
                !mapModeOpen
              )
            }
            style={{
              width: "100%",
              height: "82px",
              border:
                "1px solid #D9E2EC",
              borderRadius:
                "18px",
              background:
                "#FFFFFF",
              display:
                "flex",
              alignItems:
                "center",
              justifyContent:
                "space-between",
              padding:
                "0 28px",
              cursor:
                "pointer",
              boxShadow:
                "0 5px 18px rgba(15, 23, 42, 0.07)",
            }}
          >

            <div
              style={{
                display:
                  "flex",
                alignItems:
                  "center",
                gap: "20px",
              }}
            >

              <MapIcon
                size={28}
                strokeWidth={
                  1.9
                }
                color="#64748B"
              />

              <span
                style={{
                  fontSize:
                    "20px",
                  fontWeight:
                    650,
                  color:
                    "#334155",
                }}
              >
                City Overview Map
              </span>

            </div>


            <ChevronDown
              size={21}
              color="#475569"
              style={{
                transform:
                  mapModeOpen
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                transition:
                  "transform 0.2s ease",
              }}
            />

          </button>


          {/* =================================================
              MODE DROPDOWN
              ================================================= */}

          {mapModeOpen && (
            <div
              style={{
                marginTop:
                  "8px",
                background:
                  "#FFFFFF",
                border:
                  "1px solid #E2E8F0",
                borderRadius:
                  "14px",
                boxShadow:
                  "0 10px 30px rgba(15, 23, 42, 0.10)",
                overflow:
                  "hidden",
              }}
            >

              <div
                style={{
                  padding:
                    "14px 18px",
                  fontSize:
                    "14px",
                  color:
                    "#475569",
                  fontWeight:
                    600,
                }}
              >
                City Overview Map
              </div>

            </div>
          )}

        </div>


        {/* ===================================================
            MAP FILTERS
            =================================================== */}

        <div
          style={{
            position:
              "absolute",
            top: "132px",
            left: "26px",
            width: "305px",
            zIndex: 1000,
            background:
              "#FFFFFF",
            border:
              "1px solid #D9E2EC",
            borderRadius:
              "20px",
            padding:
              "22px 20px",
            boxSizing:
              "border-box",
            boxShadow:
              "0 6px 20px rgba(15, 23, 42, 0.07)",
          }}
        >

          {/* ===============================================
              FILTER TITLE
              =============================================== */}

          <div
            style={{
              marginBottom:
                "18px",
              fontSize:
                "14px",
              fontWeight:
                750,
              color:
                "#334155",
              letterSpacing:
                "0.2px",
            }}
          >
            MAP FILTERS
          </div>


          {/* ===============================================
              ZONE
              =============================================== */}

          <div
            style={{
              marginBottom:
                "16px",
            }}
          >

            <div
              style={{
                marginBottom:
                  "8px",
                fontSize:
                  "13px",
                fontWeight:
                  650,
                color:
                  "#94A3B8",
                letterSpacing:
                  "0.2px",
              }}
            >
              ZONE
            </div>


            <div
              style={{
                position:
                  "relative",
              }}
            >

              <button
                type="button"
                onClick={() =>
                  setZoneOpen(
                    !zoneOpen
                  )
                }
                style={{
                  width: "100%",
                  height: "54px",
                  border:
                    "1px solid #D9E2EC",
                  borderRadius:
                    "13px",
                  background:
                    "#FFFFFF",
                  display:
                    "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "space-between",
                  padding:
                    "0 17px",
                  cursor:
                    "pointer",
                  color:
                    "#475569",
                  fontSize:
                    "15px",
                  fontWeight:
                    600,
                }}
              >

                <span
                  style={{
                    overflow:
                      "hidden",
                    textOverflow:
                      "ellipsis",
                    whiteSpace:
                      "nowrap",
                  }}
                >
                  {selectedZone ||
                    "All Zones"}
                </span>

                <ChevronDown
                  size={18}
                  color="#64748B"
                  style={{
                    flexShrink: 0,
                    transform:
                      zoneOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    transition:
                      "transform 0.2s ease",
                  }}
                />

              </button>


              {zoneOpen && (
                <div
                  style={{
                    position:
                      "absolute",
                    left: 0,
                    right: 0,
                    top:
                      "calc(100% + 6px)",
                    background:
                      "#FFFFFF",
                    border:
                      "1px solid #E2E8F0",
                    borderRadius:
                      "12px",
                    boxShadow:
                      "0 12px 28px rgba(15, 23, 42, 0.12)",
                    overflow:
                      "hidden",
                    maxHeight:
                      "250px",
                    overflowY:
                      "auto",
                    zIndex: 1100,
                  }}
                >

                  <button
                    type="button"
                    onClick={() =>
                      handleZoneSelect(
                        ""
                      )
                    }
                    style={{
                      width: "100%",
                      border: 0,
                      background:
                        selectedZone === ""
                          ? "#F8FAFC"
                          : "#FFFFFF",
                      textAlign:
                        "left",
                      padding:
                        "12px 15px",
                      cursor:
                        "pointer",
                      color:
                        "#334155",
                      fontSize:
                        "14px",
                      fontWeight:
                        600,
                    }}
                  >
                    All Zones
                  </button>


                  {normalizedZones.map(
                    (
                      zone
                    ) => (

                      <button
                        key={
                          zone.zoneTableName ||
                          zone.zoneName
                        }
                        type="button"
                        onClick={() =>
                          handleZoneSelect(
                            zone.zoneName
                          )
                        }
                        style={{
                          width: "100%",
                          border: 0,
                          borderTop:
                            "1px solid #F1F5F9",
                          background:
                            selectedZone ===
                            zone.zoneName
                              ? "#F8FAFC"
                              : "#FFFFFF",
                          textAlign:
                            "left",
                          padding:
                            "12px 15px",
                          cursor:
                            "pointer",
                          color:
                            "#334155",
                          fontSize:
                            "14px",
                          fontWeight:
                            selectedZone ===
                            zone.zoneName
                              ? 700
                              : 500,
                        }}
                      >
                        {zone.zoneName}
                      </button>

                    )
                  )}

                </div>
              )}

            </div>

          </div>


          {/* ===============================================
              DIVISION
              =============================================== */}

          <div
            style={{
              marginBottom:
                "16px",
            }}
          >

            <div
              style={{
                marginBottom:
                  "8px",
                fontSize:
                  "13px",
                fontWeight:
                  650,
                color:
                  "#94A3B8",
              }}
            >
              DIVISION
            </div>


            <div
              style={{
                position:
                  "relative",
              }}
            >

              <button
                type="button"
                onClick={() =>
                  setDivisionOpen(
                    !divisionOpen
                  )
                }
                style={{
                  width: "100%",
                  height: "54px",
                  border:
                    "1px solid #D9E2EC",
                  borderRadius:
                    "13px",
                  background:
                    "#FFFFFF",
                  display:
                    "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "space-between",
                  padding:
                    "0 17px",
                  cursor:
                    "pointer",
                  color:
                    "#475569",
                  fontSize:
                    "15px",
                  fontWeight:
                    600,
                }}
              >

                <span>
                  {selectedDivision}
                </span>

                <ChevronDown
                  size={18}
                  color="#64748B"
                  style={{
                    transform:
                      divisionOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                  }}
                />

              </button>


              {divisionOpen && (
                <div
                  style={{
                    position:
                      "absolute",
                    left: 0,
                    right: 0,
                    top:
                      "calc(100% + 6px)",
                    background:
                      "#FFFFFF",
                    border:
                      "1px solid #E2E8F0",
                    borderRadius:
                      "12px",
                    boxShadow:
                      "0 12px 28px rgba(15, 23, 42, 0.12)",
                    zIndex: 1100,
                    overflow:
                      "hidden",
                  }}
                >

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDivision(
                        "All Divisions"
                      );

                      setDivisionOpen(
                        false
                      );
                    }}
                    style={{
                      width: "100%",
                      border: 0,
                      background:
                        "#FFFFFF",
                      textAlign:
                        "left",
                      padding:
                        "12px 15px",
                      cursor:
                        "pointer",
                      fontSize:
                        "14px",
                      color:
                        "#334155",
                    }}
                  >
                    All Divisions
                  </button>

                  <div
                    style={{
                      padding:
                        "10px 15px",
                      fontSize:
                        "12px",
                      color:
                        "#94A3B8",
                      borderTop:
                        "1px solid #F1F5F9",
                    }}
                  >
                    Division integration
                    coming next
                  </div>

                </div>
              )}

            </div>

          </div>


          {/* ===============================================
              WARD
              =============================================== */}

          <div>

            <div
              style={{
                marginBottom:
                  "8px",
                fontSize:
                  "13px",
                fontWeight:
                  650,
                color:
                  "#94A3B8",
              }}
            >
              WARD
            </div>


            <div
              style={{
                position:
                  "relative",
              }}
            >

              <button
                type="button"
                onClick={() =>
                  setWardOpen(
                    !wardOpen
                  )
                }
                style={{
                  width: "100%",
                  height: "54px",
                  border:
                    "1px solid #D9E2EC",
                  borderRadius:
                    "13px",
                  background:
                    "#FFFFFF",
                  display:
                    "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "space-between",
                  padding:
                    "0 17px",
                  cursor:
                    "pointer",
                  color:
                    "#475569",
                  fontSize:
                    "15px",
                  fontWeight:
                    600,
                }}
              >

                <span>
                  {selectedWard}
                </span>

                <ChevronDown
                  size={18}
                  color="#64748B"
                  style={{
                    transform:
                      wardOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                  }}
                />

              </button>


              {wardOpen && (
                <div
                  style={{
                    position:
                      "absolute",
                    left: 0,
                    right: 0,
                    bottom:
                      "calc(100% + 6px)",
                    background:
                      "#FFFFFF",
                    border:
                      "1px solid #E2E8F0",
                    borderRadius:
                      "12px",
                    boxShadow:
                      "0 12px 28px rgba(15, 23, 42, 0.12)",
                    zIndex: 1100,
                    overflow:
                      "hidden",
                  }}
                >

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedWard(
                        "All Wards"
                      );

                      setWardOpen(
                        false
                      );
                    }}
                    style={{
                      width: "100%",
                      border: 0,
                      background:
                        "#FFFFFF",
                      textAlign:
                        "left",
                      padding:
                        "12px 15px",
                      cursor:
                        "pointer",
                      fontSize:
                        "14px",
                      color:
                        "#334155",
                    }}
                  >
                    All Wards
                  </button>

                  <div
                    style={{
                      padding:
                        "10px 15px",
                      fontSize:
                        "12px",
                      color:
                        "#94A3B8",
                      borderTop:
                        "1px solid #F1F5F9",
                    }}
                  >
                    Ward integration
                    coming next
                  </div>

                </div>
              )}

            </div>

          </div>

        </div>


        {/* ===================================================
            LOADING
            =================================================== */}

        {loading && (
          <div
            style={{
              position:
                "absolute",
              inset: 0,
              zIndex: 1200,
              display:
                "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              background:
                "rgba(255,255,255,0.45)",
              pointerEvents:
                "none",
            }}
          >

            <div
              style={{
                display:
                  "flex",
                alignItems:
                  "center",
                gap: "9px",
                padding:
                  "11px 16px",
                border:
                  "1px solid #E2E8F0",
                borderRadius:
                  "12px",
                background:
                  "#FFFFFF",
                boxShadow:
                  "0 8px 24px rgba(15,23,42,0.10)",
                color:
                  "#475569",
                fontSize:
                  "13px",
                fontWeight:
                  600,
              }}
            >

              <Loader2
                size={17}
                className="sewac-map-spin"
              />

              Loading city map...

            </div>

          </div>
        )}


        {/* ===================================================
            ERROR
            =================================================== */}

        {!loading &&
          error && (
            <div
              style={{
                position:
                  "absolute",
                left: "50%",
                top: "50%",
                transform:
                  "translate(-50%, -50%)",
                zIndex: 1200,
                width: "min(420px, calc(100% - 40px))",
                padding:
                  "18px",
                border:
                  "1px solid #FECACA",
                borderRadius:
                  "14px",
                background:
                  "#FFFFFF",
                boxShadow:
                  "0 10px 30px rgba(15,23,42,0.12)",
                display:
                  "flex",
                gap: "12px",
                alignItems:
                  "flex-start",
              }}
            >

              <AlertCircle
                size={21}
                color="#DC2626"
                style={{
                  flexShrink: 0,
                }}
              />

              <div>

                <div
                  style={{
                    fontSize:
                      "14px",
                    fontWeight:
                      700,
                    color:
                      "#991B1B",
                    marginBottom:
                      "4px",
                  }}
                >
                  Unable to load map
                </div>

                <div
                  style={{
                    fontSize:
                      "12px",
                    lineHeight:
                      1.5,
                    color:
                      "#64748B",
                  }}
                >
                  {error}
                </div>

              </div>

            </div>
          )}


        {/* ===================================================
            NO DATA
            =================================================== */}

        {!loading &&
          !error &&
          !cityBoundary && (
            <div
              style={{
                position:
                  "absolute",
                left: "50%",
                bottom: "28px",
                transform:
                  "translateX(-50%)",
                zIndex: 1000,
                padding:
                  "11px 18px",
                border:
                  "1px solid #E2E8F0",
                borderRadius:
                  "12px",
                background:
                  "#FFFFFF",
                boxShadow:
                  "0 6px 20px rgba(15,23,42,0.08)",
                fontSize:
                  "13px",
                fontWeight:
                  600,
                color:
                  "#64748B",
              }}
            >
              City boundary unavailable.
            </div>
          )}

      </div>


      {/* =====================================================
          GLOBAL LOCAL STYLES
          ===================================================== */}

      <style>
        {`
          .sewac-map-spin {
            animation: sewac-map-spin 1s linear infinite;
          }

          @keyframes sewac-map-spin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          .sewac-zone-tooltip {
            border: 1px solid #CBD5E1 !important;
            background: #FFFFFF !important;
            color: #334155 !important;
            font-size: 12px !important;
            font-weight: 600 !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 12px rgba(15, 23, 42, 0.10) !important;
            padding: 6px 9px !important;
          }

          .sewac-zone-tooltip::before {
            border-top-color: #FFFFFF !important;
          }

          .leaflet-control-zoom {
            border: 1px solid #D9E2EC !important;
            box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08) !important;
          }

          .leaflet-control-zoom a {
            color: #475569 !important;
            background: #FFFFFF !important;
            border-color: #E2E8F0 !important;
          }

          .leaflet-control-zoom a:hover {
            background: #F8FAFC !important;
          }
        `}
      </style>

    </div>
  );
}