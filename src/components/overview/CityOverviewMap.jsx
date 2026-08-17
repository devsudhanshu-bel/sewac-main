import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import {
  Map as MapIcon,
  ChevronDown,
  RotateCcw,
  Layers3,
} from "lucide-react";

import "leaflet/dist/leaflet.css";


/* ============================================================
   CONFIGURATION
   ============================================================ */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5002";

const CITY_ID = 1;

const CITY_MAP_ENDPOINT =
  `${API_BASE_URL}/api/master-citizen/map/city/${CITY_ID}`;


/* ============================================================
   COLORS
   ============================================================ */

const ZONE_COLORS = [
  "#A8E6CF",
  "#BDE0FE",
  "#FFD6A5",
  "#FFCAD4",
  "#CDB4DB",
  "#CAFFBF",
  "#FDFFB6",
];

const DIVISION_COLORS = [
  "#A8DADC",
  "#BDE0FE",
  "#CDB4DB",
  "#FFD6A5",
  "#FFCAD4",
  "#CAFFBF",
  "#B8E0D2",
];

const WARD_COLORS = [
  "#BDE0FE",
  "#FFD6A5",
  "#FFCAD4",
  "#CDB4DB",
  "#A8E6CF",
  "#CAFFBF",
  "#A2D2FF",
];


/* ============================================================
   HELPERS
   ============================================================ */

function getId(item) {
  if (!item) return null;

  return (
    item.id ??
    item.zoneId ??
    item.divisionId ??
    item.wardId ??
    item._id ??
    null
  );
}


function getName(item, type = "") {
  if (!item) return "Unknown";

  if (type === "zone") {
    return (
      item.zoneName ??
      item.name ??
      item.zone_name ??
      item.title ??
      `Zone ${item.id ?? ""}`
    );
  }

  if (type === "division") {
    return (
      item.divisionName ??
      item.name ??
      item.division_name ??
      item.title ??
      `Division ${item.id ?? ""}`
    );
  }

  if (type === "ward") {
    return (
      item.wardName ??
      item.name ??
      item.ward_name ??
      item.title ??
      `Ward ${item.id ?? ""}`
    );
  }

  return (
    item.name ??
    item.title ??
    item.cityName ??
    item.city_name ??
    "Unknown"
  );
}


/**
 * Converts different possible geometry formats into
 * GeoJSON-compatible geometry.
 */
function extractGeoJSON(item) {
  if (!item) return null;

  const possible =
    item.geoBoundary ??
    item.geoJson ??
    item.geoJSON ??
    item.geometry ??
    item.boundary ??
    item.geo_boundary ??
    null;

  if (!possible) return null;

  let value = possible;

  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      return null;
    }
  }

  if (!value) return null;

  /*
   * Full Feature
   */
  if (value.type === "Feature") {
    return value;
  }

  /*
   * FeatureCollection
   */
  if (value.type === "FeatureCollection") {
    return value;
  }

  /*
   * Geometry object
   */
  if (
    value.type &&
    Array.isArray(value.coordinates)
  ) {
    return {
      type: "Feature",
      properties: {},
      geometry: value,
    };
  }

  /*
   * Sometimes backend may return:
   *
   * {
   *   name: "...",
   *   type: "Polygon",
   *   coordinates: [...]
   * }
   */
  if (
    value.type &&
    value.coordinates
  ) {
    return {
      type: "Feature",
      properties: {},
      geometry: value,
    };
  }

  return null;
}


/**
 * Turns any geometry into an array of GeoJSON Features.
 */
function geometryToFeatures(geometry) {
  if (!geometry) return [];

  if (geometry.type === "FeatureCollection") {
    return Array.isArray(geometry.features)
      ? geometry.features
      : [];
  }

  if (geometry.type === "Feature") {
    return [geometry];
  }

  return [];
}


/**
 * Get all coordinates from a GeoJSON object.
 */
function getCoordinatesFromGeometry(geometry) {
  if (!geometry) return [];

  const features =
    geometryToFeatures(geometry);

  const coordinates = [];

  features.forEach((feature) => {
    const geometryObject =
      feature?.geometry;

    if (!geometryObject) return;

    const collect = (coords) => {
      if (!Array.isArray(coords)) return;

      if (
        coords.length >= 2 &&
        typeof coords[0] === "number" &&
        typeof coords[1] === "number"
      ) {
        coordinates.push([
          coords[1],
          coords[0],
        ]);

        return;
      }

      coords.forEach(collect);
    };

    collect(
      geometryObject.coordinates
    );
  });

  return coordinates;
}


/* ============================================================
   MAP FIT COMPONENT
   ============================================================ */

function FitToGeoJSON({
  geometry,
  padding = [40, 40],
  maxZoom = 14,
}) {
  const map = useMap();

  useEffect(() => {
    if (!geometry) return;

    const coords =
      getCoordinatesFromGeometry(
        geometry
      );

    if (!coords.length) return;

    try {
      const bounds =
        L.latLngBounds(coords);

      if (!bounds.isValid()) return;

      map.fitBounds(
        bounds,
        {
          padding,
          maxZoom,
          animate: true,
          duration: 0.7,
        }
      );
    } catch (error) {
      console.error(
        "Map fit error:",
        error
      );
    }
  }, [
    geometry,
    map,
    maxZoom,
    padding,
  ]);

  return null;
}


/* ============================================================
   MAP CONTROLLER
   ============================================================ */

function MapController({
  targetGeometry,
}) {
  return (
    <FitToGeoJSON
      geometry={targetGeometry}
      padding={[80, 80]}
      maxZoom={13}
    />
  );
}


/* ============================================================
   GEOJSON LAYER
   ============================================================ */

function BoundaryLayer({
  geometry,
  fillColor,
  borderColor = "#243B53",
  fillOpacity = 0.58,
  weight = 2,
  onClick,
  featureType,
  item,
}) {
  if (!geometry) {
    return null;
  }

  const features =
    geometryToFeatures(
      geometry
    );

  if (!features.length) {
    return null;
  }

  return (
    <>
      {features.map(
        (feature, index) => (
          <GeoJSON
            key={`${getId(item) || "geo"}-${featureType}-${index}`}
            data={feature}
            style={() => ({
              color: borderColor,
              weight,
              opacity: 1,
              fillColor,
              fillOpacity,
            })}
            eventHandlers={{
              click: () => {
                if (onClick) {
                  onClick(item);
                }
              },
              mouseover: (event) => {
                const layer =
                  event.target;

                layer.setStyle({
                  weight: weight + 1,
                  fillOpacity:
                    Math.min(
                      fillOpacity + 0.12,
                      0.85
                    ),
                });

                if (
                  layer.bringToFront
                ) {
                  layer.bringToFront();
                }
              },
              mouseout: (event) => {
                const layer =
                  event.target;

                layer.setStyle({
                  weight,
                  fillOpacity,
                });
              },
            }}
          />
        )
      )}
    </>
  );
}


/* ============================================================
   DROPDOWN
   ============================================================ */

function Dropdown({
  label,
  value,
  placeholder,
  options,
  disabled = false,
  open,
  setOpen,
  onChange,
  getOptionLabel,
  getOptionValue,
}) {
  const wrapperRef =
    useRef(null);

  useEffect(() => {
    const handleOutside =
      (event) => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(
            event.target
          )
        ) {
          setOpen(false);
        }
      };

    document.addEventListener(
      "mousedown",
      handleOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutside
      );
    };
  }, [setOpen]);

  const selected =
    options.find(
      (option) =>
        String(
          getOptionValue(option)
        ) === String(value)
    );

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "relative",
      }}
    >
      <label
        style={{
          display: "block",
          fontSize: 14,
          fontWeight: 700,
          color: "#86A4C3",
          marginBottom: 10,
          letterSpacing: 0.2,
        }}
      >
        {label}
      </label>

      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          setOpen(!open);
        }}
        style={{
          width: "100%",
          height: 58,
          borderRadius: 18,
          border: "1px solid #CFE0EF",
          background:
            disabled
              ? "#F7FAFC"
              : "#FFFFFF",
          padding:
            "0 18px",
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          cursor:
            disabled
              ? "not-allowed"
              : "pointer",
          color:
            disabled
              ? "#B9C9D9"
              : selected
              ? "#4D6680"
              : "#9AAFC3",
          fontSize: 16,
          fontWeight: 600,
          textAlign: "left",
        }}
      >
        <span
          style={{
            overflow: "hidden",
            textOverflow:
              "ellipsis",
            whiteSpace:
              "nowrap",
          }}
        >
          {selected
            ? getOptionLabel(
                selected
              )
            : placeholder}
        </span>

        <ChevronDown
          size={19}
          style={{
            flexShrink: 0,
            transform:
              open
                ? "rotate(180deg)"
                : "rotate(0deg)",
            transition:
              "transform 0.2s",
          }}
        />
      </button>

      {open &&
        !disabled && (
          <div
            style={{
              position:
                "absolute",
              zIndex: 5000,
              left: 0,
              right: 0,
              top: "calc(100% + 8px)",
              background:
                "#FFFFFF",
              border:
                "1px solid #D7E4EF",
              borderRadius: 18,
              boxShadow:
                "0 18px 50px rgba(39, 68, 94, 0.16)",
              padding: 7,
              maxHeight: 280,
              overflowY:
                "auto",
            }}
          >
            {options.length ===
            0 ? (
              <div
                style={{
                  padding: 16,
                  color: "#9AAFC3",
                  fontWeight: 600,
                }}
              >
                No options available
              </div>
            ) : (
              options.map(
                (
                  option,
                  index
                ) => {
                  const optionValue =
                    getOptionValue(
                      option
                    );

                  const isSelected =
                    String(
                      optionValue
                    ) ===
                    String(value);

                  return (
                    <button
                      type="button"
                      key={
                        optionValue ??
                        index
                      }
                      onClick={() => {
                        onChange(
                          optionValue
                        );
                        setOpen(false);
                      }}
                      style={{
                        width:
                          "100%",
                        border:
                          "none",
                        background:
                          isSelected
                            ? "#EDF5FA"
                            : "transparent",
                        borderRadius:
                          13,
                        padding:
                          "13px 15px",
                        textAlign:
                          "left",
                        fontSize: 15,
                        fontWeight:
                          600,
                        color:
                          "#34516E",
                        cursor:
                          "pointer",
                        marginBottom:
                          2,
                      }}
                    >
                      {
                        getOptionLabel(
                          option
                        )
                      }
                    </button>
                  );
                }
              )
            )}
          </div>
        )}
    </div>
  );
}


/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export default function CityOverviewMap() {

  /* ----------------------------------------------------------
     STATE
     ---------------------------------------------------------- */

  const [
    mapData,
    setMapData,
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
    selectedZoneId,
    setSelectedZoneId,
  ] = useState(null);

  const [
    selectedDivisionId,
    setSelectedDivisionId,
  ] = useState(null);

  const [
    selectedWardId,
    setSelectedWardId,
  ] = useState(null);

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


  /* ----------------------------------------------------------
     FETCH CITY MAP
     ---------------------------------------------------------- */

  const loadCityMap =
    useCallback(
      async () => {

        try {

          setLoading(true);
          setError(null);

          console.log(
            "🗺️ Fetching city map:",
            CITY_MAP_ENDPOINT
          );

          const response =
            await fetch(
              CITY_MAP_ENDPOINT,
              {
                method: "GET",
                headers: {
                  Accept:
                    "application/json",
                },
              }
            );

          if (!response.ok) {
            throw new Error(
              `City map request failed with status ${response.status}`
            );
          }

          const json =
            await response.json();

          console.log(
            "✅ CITY MAP RESPONSE:",
            json
          );

          if (
            !json ||
            !json.success
          ) {
            throw new Error(
              json?.message ||
              "Invalid city map response."
            );
          }

          setMapData(json);

          /*
           * IMPORTANT:
           *
           * We DO NOT hardcode Central/East/North.
           *
           * We use exactly the zones returned
           * by the backend.
           */

          const zones =
            Array.isArray(
              json.zones
            )
              ? json.zones
              : [];

          if (zones.length) {
            setSelectedZoneId(
              getId(zones[0])
            );
          }

        } catch (err) {

          console.error(
            "❌ CITY MAP FETCH ERROR:",
            err
          );

          setError(
            err?.message ||
            "Unable to load city map."
          );

        } finally {

          setLoading(false);

        }

      },
      []
    );


  useEffect(() => {
    loadCityMap();
  }, [loadCityMap]);


  /* ==========================================================
     NORMALIZED ZONES
     ========================================================== */

  const zones =
    useMemo(() => {

      if (
        !mapData ||
        !Array.isArray(
          mapData.zones
        )
      ) {
        return [];
      }

      return mapData.zones;

    }, [mapData]);


  /* ==========================================================
     SELECTED ZONE
     ========================================================== */

  const selectedZone =
    useMemo(() => {

      if (
        selectedZoneId ===
        null
      ) {
        return null;
      }

      return (
        zones.find(
          (zone) =>
            String(
              getId(zone)
            ) ===
            String(
              selectedZoneId
            )
        ) || null
      );

    }, [
      zones,
      selectedZoneId,
    ]);


  /* ==========================================================
     DIVISIONS
     
     THIS IS THE IMPORTANT FIX.
     
     We NEVER search globally for divisions.
     
     Divisions MUST come from:
     
     selectedZone.divisions
     
     ========================================================== */

  const availableDivisions =
    useMemo(() => {

      if (
        !selectedZone
      ) {
        return [];
      }

      return Array.isArray(
        selectedZone.divisions
      )
        ? selectedZone.divisions
        : [];

    }, [
      selectedZone,
    ]);


  /* ==========================================================
     SELECTED DIVISION
     ========================================================== */

  const selectedDivision =
    useMemo(() => {

      if (
        selectedDivisionId ===
        null
      ) {
        return null;
      }

      return (
        availableDivisions.find(
          (division) =>
            String(
              getId(
                division
              )
            ) ===
            String(
              selectedDivisionId
            )
        ) || null
      );

    }, [
      availableDivisions,
      selectedDivisionId,
    ]);


  /* ==========================================================
     WARDS
     
     AGAIN:
     
     We NEVER search wards globally.
     
     Wards MUST come from:
     
     selectedDivision.wards
     
     ========================================================== */

  const availableWards =
    useMemo(() => {

      if (
        !selectedDivision
      ) {
        return [];
      }

      return Array.isArray(
        selectedDivision.wards
      )
        ? selectedDivision.wards
        : [];

    }, [
      selectedDivision,
    ]);


  /* ==========================================================
     SELECTED WARD
     ========================================================== */

  const selectedWard =
    useMemo(() => {

      if (
        selectedWardId ===
        null
      ) {
        return null;
      }

      return (
        availableWards.find(
          (ward) =>
            String(
              getId(ward)
            ) ===
            String(
              selectedWardId
            )
        ) || null
      );

    }, [
      availableWards,
      selectedWardId,
    ]);


  /* ==========================================================
     WHAT SHOULD BE DISPLAYED?
     
     CITY:
       all zones
     
     ZONE:
       selected zone
       + its divisions
     
     DIVISION:
       selected division
       + its wards
     
     WARD:
       selected ward
     
     ========================================================== */

  const displayMode =
    selectedWard
      ? "ward"
      : selectedDivision
      ? "division"
      : selectedZone
      ? "zone"
      : "city";


  /* ==========================================================
     MAP GEOMETRY
     ========================================================== */

  const mapGeometry =
    useMemo(() => {

      if (
        displayMode ===
        "ward"
      ) {
        return extractGeoJSON(
          selectedWard
        );
      }

      if (
        displayMode ===
        "division"
      ) {
        return extractGeoJSON(
          selectedDivision
        );
      }

      if (
        displayMode ===
        "zone"
      ) {
        return extractGeoJSON(
          selectedZone
        );
      }

      return extractGeoJSON(
        mapData?.city
      );

    }, [
      displayMode,
      selectedWard,
      selectedDivision,
      selectedZone,
      mapData,
    ]);


  /* ==========================================================
     RESET
     ========================================================== */

  const resetMap =
    useCallback(() => {

      if (!zones.length) {
        return;
      }

      setSelectedZoneId(
        getId(zones[0])
      );

      setSelectedDivisionId(
        null
      );

      setSelectedWardId(
        null
      );

      setZoneOpen(false);
      setDivisionOpen(false);
      setWardOpen(false);

    }, [zones]);


  /* ==========================================================
     ZONE CHANGE
     ========================================================== */

  const handleZoneChange =
    useCallback(
      (zoneId) => {

        console.log(
          "ZONE SELECTED:",
          zoneId
        );

        setSelectedZoneId(
          zoneId
        );

        /*
         * VERY IMPORTANT:
         *
         * When zone changes,
         * division MUST be cleared.
         */

        setSelectedDivisionId(
          null
        );

        /*
         * Ward must also be cleared.
         */

        setSelectedWardId(
          null
        );

      },
      []
    );


  /* ==========================================================
     DIVISION CHANGE
     ========================================================== */

  const handleDivisionChange =
    useCallback(
      (divisionId) => {

        console.log(
          "DIVISION SELECTED:",
          divisionId
        );

        setSelectedDivisionId(
          divisionId
        );

        /*
         * Changing division means
         * previously selected ward
         * is no longer valid.
         */

        setSelectedWardId(
          null
        );

      },
      []
    );


  /* ==========================================================
     WARD CHANGE
     ========================================================== */

  const handleWardChange =
    useCallback(
      (wardId) => {

        console.log(
          "WARD SELECTED:",
          wardId
        );

        setSelectedWardId(
          wardId
        );

      },
      []
    );


  /* ==========================================================
     LOADING
     ========================================================== */

  if (loading) {

    return (
      <div
        style={{
          width: "100%",
          minHeight: 650,
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
          fontSize: 18,
          fontWeight: 600,
          color: "#45627E",
        }}
      >
        Loading City Map...
      </div>
    );

  }


  /* ==========================================================
     ERROR
     ========================================================== */

  if (error) {

    return (
      <div
        style={{
          width: "100%",
          minHeight: 500,
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
          flexDirection:
            "column",
          gap: 16,
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#C24141",
          }}
        >
          Failed to load City Map
        </div>

        <div
          style={{
            fontSize: 14,
            color: "#6B7F93",
          }}
        >
          {error}
        </div>

        <button
          type="button"
          onClick={
            loadCityMap
          }
          style={{
            border: "none",
            borderRadius: 12,
            padding:
              "11px 18px",
            background:
              "#294C68",
            color:
              "#FFFFFF",
            cursor:
              "pointer",
            fontWeight: 700,
          }}
        >
          Retry
        </button>
      </div>
    );

  }


  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <div
      style={{
        width: "100%",
        padding: "0 14px 20px",
        boxSizing:
          "border-box",
      }}
    >

      {/* =====================================================
          TITLE
          ===================================================== */}

      <h1
        style={{
          margin:
            "0 0 12px 0",
          fontSize: 28,
          fontWeight: 800,
          color: "#0C243A",
          letterSpacing:
            "-0.5px",
        }}
      >
        CITY OVERVIEW MAP
      </h1>


      {/* =====================================================
          MAP WRAPPER
          ===================================================== */}

      <div
        style={{
          position:
            "relative",
          width: "100%",
          height: 920,
          border:
            "1px solid #D7E3ED",
          borderRadius: 24,
          overflow:
            "hidden",
          background:
            "#F9FBFC",
          boxShadow:
            "0 8px 30px rgba(38, 68, 93, 0.06)",
        }}
      >

        {/* ===================================================
            MAP
            =================================================== */}

        <MapContainer
          center={[
            12.9716,
            77.5946,
          ]}
          zoom={10}
          minZoom={8}
          maxZoom={18}
          scrollWheelZoom
          zoomControl
          style={{
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        >

          <TileLayer
            attribution='&copy; OpenStreetMap contributors &copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />


          {/* =================================================
              CITY BOUNDARY
              ================================================= */}

          {displayMode ===
            "city" &&
            mapGeometry && (
              <BoundaryLayer
                geometry={
                  mapGeometry
                }
                fillColor="#FFFFFF"
                fillOpacity={0.08}
                borderColor="#203A51"
                weight={4}
                featureType="city"
                item={
                  mapData?.city
                }
              />
            )}


          {/* =================================================
              ZONE MODE
              
              ONLY SELECTED ZONE
              + ITS DIVISIONS
              
              NO OTHER ZONES.
              ================================================= */}

          {displayMode ===
            "zone" &&
            selectedZone && (

              <>

                <BoundaryLayer
                  geometry={
                    extractGeoJSON(
                      selectedZone
                    )
                  }
                  fillColor={
                    ZONE_COLORS[
                      zones.findIndex(
                        (z) =>
                          String(
                            getId(z)
                          ) ===
                          String(
                            selectedZoneId
                          )
                      ) %
                        ZONE_COLORS.length
                    ]
                  }
                  fillOpacity={
                    0.18
                  }
                  borderColor="#203A51"
                  weight={4}
                  featureType="zone"
                  item={
                    selectedZone
                  }
                />


                {availableDivisions.map(
                  (
                    division,
                    index
                  ) => {

                    const divisionGeometry =
                      extractGeoJSON(
                        division
                      );

                    if (
                      !divisionGeometry
                    ) {
                      return null;
                    }

                    return (
                      <BoundaryLayer
                        key={`division-${getId(
                          division
                        )}-${index}`}
                        geometry={
                          divisionGeometry
                        }
                        fillColor={
                          DIVISION_COLORS[
                            index %
                              DIVISION_COLORS.length
                          ]
                        }
                        fillOpacity={
                          0.58
                        }
                        borderColor="#47647A"
                        weight={2}
                        featureType="division"
                        item={
                          division
                        }
                        onClick={() =>
                          handleDivisionChange(
                            getId(
                              division
                            )
                          )
                        }
                      />
                    );

                  }
                )}

              </>
            )}


          {/* =================================================
              DIVISION MODE
              
              ONLY SELECTED DIVISION
              + ITS WARDS
              ================================================= */}

          {displayMode ===
            "division" &&
            selectedDivision && (

              <>

                <BoundaryLayer
                  geometry={
                    extractGeoJSON(
                      selectedDivision
                    )
                  }
                  fillColor="#FFFFFF"
                  fillOpacity={0.12}
                  borderColor="#203A51"
                  weight={4}
                  featureType="division"
                  item={
                    selectedDivision
                  }
                />


                {availableWards.map(
                  (
                    ward,
                    index
                  ) => {

                    const wardGeometry =
                      extractGeoJSON(
                        ward
                      );

                    if (
                      !wardGeometry
                    ) {
                      return null;
                    }

                    return (
                      <BoundaryLayer
                        key={`ward-${getId(
                          ward
                        )}-${index}`}
                        geometry={
                          wardGeometry
                        }
                        fillColor={
                          WARD_COLORS[
                            index %
                              WARD_COLORS.length
                          ]
                        }
                        fillOpacity={
                          0.62
                        }
                        borderColor="#526C80"
                        weight={2}
                        featureType="ward"
                        item={ward}
                        onClick={() =>
                          handleWardChange(
                            getId(
                              ward
                            )
                          )
                        }
                      />
                    );

                  }
                )}

              </>
            )}


          {/* =================================================
              WARD MODE
              
              ONLY SELECTED WARD
              ================================================= */}

          {displayMode ===
            "ward" &&
            selectedWard && (

              <BoundaryLayer
                geometry={
                  extractGeoJSON(
                    selectedWard
                  )
                }
                fillColor="#A8E6CF"
                fillOpacity={0.72}
                borderColor="#203A51"
                weight={4}
                featureType="ward"
                item={
                  selectedWard
                }
              />
            )}


          {/* =================================================
              AUTO FIT
              ================================================= */}

          <MapController
            targetGeometry={
              mapGeometry
            }
          />

        </MapContainer>


        {/* ===================================================
            HEADER CARD
            =================================================== */}

        <div
          style={{
            position:
              "absolute",
            zIndex: 1000,
            left: 30,
            top: 30,
            width:
              "min(52%, 730px)",
            minWidth: 500,
            height: 106,
            background:
              "rgba(255,255,255,0.96)",
            backdropFilter:
              "blur(10px)",
            border:
              "1px solid #D6E3ED",
            borderRadius: 24,
            boxShadow:
              "0 14px 40px rgba(42, 70, 94, 0.12)",
            display:
              "flex",
            alignItems:
              "center",
            padding:
              "0 28px",
            boxSizing:
              "border-box",
          }}
        >

          <MapIcon
            size={42}
            strokeWidth={1.8}
            color="#64829D"
          />

          <div
            style={{
              marginLeft: 22,
            }}
          >
            <div
              style={{
                fontSize: 30,
                fontWeight: 800,
                color: "#344D64",
                lineHeight: 1.1,
              }}
            >
              City Overview Map
            </div>

            <div
              style={{
                marginTop: 5,
                fontSize: 16,
                fontWeight: 700,
                color: "#82A4C4",
              }}
            >
              {mapData?.city
                ?.cityName ||
                "Bangalore"}
            </div>
          </div>

          <ChevronDown
            size={22}
            color="#344D64"
            style={{
              marginLeft:
                "auto",
            }}
          />

        </div>


        {/* ===================================================
            FILTER PANEL
            =================================================== */}

        <div
          style={{
            position:
              "absolute",
            zIndex: 2000,
            top: 30,
            right: 30,
            width:
              "min(31%, 440px)",
            minWidth: 360,
            background:
              "rgba(255,255,255,0.97)",
            backdropFilter:
              "blur(12px)",
            border:
              "1px solid #D6E3ED",
            borderRadius: 24,
            boxShadow:
              "0 18px 50px rgba(42, 70, 94, 0.13)",
            padding: 28,
            boxSizing:
              "border-box",
          }}
        >

          <div
            style={{
              fontSize: 23,
              fontWeight: 800,
              color: "#344D64",
              marginBottom: 28,
            }}
          >
            MAP FILTERS
          </div>


          {/* =================================================
              ZONE
              ================================================= */}

          <Dropdown
            label="ZONE"
            value={
              selectedZoneId
            }
            placeholder="Select Zone"
            options={zones}
            open={zoneOpen}
            setOpen={
              setZoneOpen
            }
            onChange={
              handleZoneChange
            }
            getOptionLabel={(
              zone
            ) =>
              getName(
                zone,
                "zone"
              )
            }
            getOptionValue={(
              zone
            ) =>
              getId(zone)
            }
          />


          {/* =================================================
              DIVISION
              ================================================= */}

          <div
            style={{
              marginTop: 24,
            }}
          >

            <Dropdown
              label="DIVISION"
              value={
                selectedDivisionId
              }
              placeholder="All Divisions"
              options={
                availableDivisions
              }
              open={
                divisionOpen
              }
              setOpen={
                setDivisionOpen
              }
              disabled={
                !selectedZone
              }
              onChange={
                handleDivisionChange
              }
              getOptionLabel={(
                division
              ) =>
                getName(
                  division,
                  "division"
                )
              }
              getOptionValue={(
                division
              ) =>
                getId(
                  division
                )
              }
            />

          </div>


          {/* =================================================
              WARD
              ================================================= */}

          <div
            style={{
              marginTop: 24,
            }}
          >

            <Dropdown
              label="WARD"
              value={
                selectedWardId
              }
              placeholder={
                selectedDivision
                  ? "Select Ward"
                  : "Select a Division First"
              }
              options={
                availableWards
              }
              open={
                wardOpen
              }
              setOpen={
                setWardOpen
              }
              disabled={
                !selectedDivision
              }
              onChange={
                handleWardChange
              }
              getOptionLabel={(
                ward
              ) =>
                getName(
                  ward,
                  "ward"
                )
              }
              getOptionValue={(
                ward
              ) =>
                getId(ward)
              }
            />

          </div>


          {/* =================================================
              RESET
              ================================================= */}

          <button
            type="button"
            onClick={
              resetMap
            }
            style={{
              width: "100%",
              height: 54,
              marginTop: 24,
              border:
                "1px solid #D2E1EC",
              borderRadius: 15,
              background:
                "#FFFFFF",
              color: "#49657F",
              fontSize: 15,
              fontWeight: 700,
              cursor:
                "pointer",
              display:
                "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              gap: 9,
            }}
          >

            <RotateCcw
              size={18}
            />

            Reset Map

          </button>

        </div>


        {/* ===================================================
            SELECTED INFORMATION CARD
            =================================================== */}

        <div
          style={{
            position:
              "absolute",
            zIndex: 1500,
            left: 30,
            bottom: 30,
            width: 420,
            background:
              "rgba(255,255,255,0.97)",
            backdropFilter:
              "blur(10px)",
            border:
              "1px solid #D6E3ED",
            borderRadius: 22,
            boxShadow:
              "0 14px 40px rgba(42, 70, 94, 0.13)",
            padding:
              "24px 26px",
            boxSizing:
              "border-box",
          }}
        >

          <div
            style={{
              display:
                "flex",
              alignItems:
                "center",
              gap: 10,
              color: "#82A4C4",
              fontSize: 14,
              fontWeight: 800,
              textTransform:
                "uppercase",
            }}
          >

            <span
              style={{
                width: 14,
                height: 14,
                borderRadius:
                  "50%",
                background:
                  displayMode ===
                  "zone"
                    ? "#A8E6CF"
                    : displayMode ===
                      "division"
                    ? "#BDE0FE"
                    : displayMode ===
                      "ward"
                    ? "#FFD6A5"
                    : "#CDB4DB",
                display:
                  "inline-block",
              }}
            />

            Selected{" "}
            {displayMode}

          </div>


          <div
            style={{
              marginTop: 16,
              fontSize: 21,
              fontWeight: 800,
              color: "#344D64",
            }}
          >

            {displayMode ===
              "ward" &&
              getName(
                selectedWard,
                "ward"
              )}

            {displayMode ===
              "division" &&
              getName(
                selectedDivision,
                "division"
              )}

            {displayMode ===
              "zone" &&
              getName(
                selectedZone,
                "zone"
              )}

            {displayMode ===
              "city" &&
              (mapData?.city
                ?.cityName ||
                "Bangalore")}

          </div>


          <div
            style={{
              marginTop: 8,
              fontSize: 14,
              color: "#82A4C4",
              fontWeight: 600,
              overflowWrap:
                "anywhere",
            }}
          >

            {displayMode ===
              "ward" &&
              `Ward ID: ${getId(
                selectedWard
              )}`}

            {displayMode ===
              "division" &&
              `Division ID: ${getId(
                selectedDivision
              )}`}

            {displayMode ===
              "zone" &&
              `Zone ID: ${getId(
                selectedZone
              )}`}

            {displayMode ===
              "city" &&
              "Complete city boundary"}

          </div>


          <div
            style={{
              height: 1,
              background:
                "#DFE8EF",
              margin:
                "17px 0",
            }}
          />


          {displayMode ===
            "zone" && (
            <>
              <div
                style={{
                  fontSize: 14,
                  color: "#617C96",
                  fontWeight: 600,
                }}
              >
                Divisions:{" "}
                <strong>
                  {
                    availableDivisions.length
                  }
                </strong>
              </div>

              <div
                style={{
                  marginTop: 6,
                  fontSize: 14,
                  color: "#617C96",
                  fontWeight: 600,
                }}
              >
                Wards:{" "}
                <strong>
                  {
                    availableDivisions.reduce(
                      (
                        total,
                        division
                      ) =>
                        total +
                        (
                          Array.isArray(
                            division?.wards
                          )
                            ? division
                                .wards
                                .length
                            : 0
                        ),
                      0
                    )
                  }
                </strong>
              </div>
            </>
          )}


          {displayMode ===
            "division" && (
            <>
              <div
                style={{
                  fontSize: 14,
                  color: "#617C96",
                  fontWeight: 600,
                }}
              >
                Zone:{" "}
                <strong>
                  {getName(
                    selectedZone,
                    "zone"
                  )}
                </strong>
              </div>

              <div
                style={{
                  marginTop: 6,
                  fontSize: 14,
                  color: "#617C96",
                  fontWeight: 600,
                }}
              >
                Wards:{" "}
                <strong>
                  {
                    availableWards.length
                  }
                </strong>
              </div>
            </>
          )}


          {displayMode ===
            "ward" && (
            <>
              <div
                style={{
                  fontSize: 14,
                  color: "#617C96",
                  fontWeight: 600,
                }}
              >
                Zone:{" "}
                <strong>
                  {getName(
                    selectedZone,
                    "zone"
                  )}
                </strong>
              </div>

              <div
                style={{
                  marginTop: 6,
                  fontSize: 14,
                  color: "#617C96",
                  fontWeight: 600,
                }}
              >
                Division:{" "}
                <strong>
                  {getName(
                    selectedDivision,
                    "division"
                  )}
                </strong>
              </div>
            </>
          )}

        </div>

      </div>

    </div>
  );
}