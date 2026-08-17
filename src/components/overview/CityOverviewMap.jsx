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
  ChevronDown,
  Map as MapIcon,
} from "lucide-react";

import "leaflet/dist/leaflet.css";

/* ============================================================
   CONFIG
============================================================ */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://YOUR-RENDER-BACKEND.onrender.com";

/*
  Your backend endpoint:

  GET
  /api/master-citizen/map/city/1

  Example:

  {
    "success": true,
    "city": {
      "id": 1,
      "cityName": "Bangalore",
      "geoBoundary": {...},
      "cityTableName": "bangalore_city"
    },
    "zones": [
      {
        "zoneName": "Bengaluru East City Corporation",
        "geoBoundary": {...},
        "zoneTableName": "..."
      }
    ]
  }
*/

const CITY_ID = 1;

/* ============================================================
   ZONE COLORS
============================================================ */

const ZONE_COLORS = [
  "#DCEBFF",
  "#E8DDFB",
  "#DDF4E7",
  "#FFF0D5",
  "#F8DDE5",
  "#DDEFF4",
  "#E9E4D4",
  "#E1E8F5",
  "#F1E1F5",
  "#E1F2E8",
];

/* ============================================================
   HELPERS
============================================================ */

/**
 * Converts whatever GeoJSON structure the backend returns
 * into a structure Leaflet can render.
 */
function normalizeGeoJSON(value) {
  if (!value) {
    return null;
  }

  // Already an object
  if (typeof value === "object") {
    return value;
  }

  // JSON string
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (error) {
      console.error(
        "Failed to parse GeoJSON:",
        error
      );

      return null;
    }
  }

  return null;
}

/**
 * Makes sure the backend GeoJSON is a valid
 * Feature / FeatureCollection / Geometry.
 */
function makeFeatureCollection(value) {
  const geoJson = normalizeGeoJSON(value);

  if (!geoJson) {
    return null;
  }

  if (
    geoJson.type ===
    "FeatureCollection"
  ) {
    return geoJson;
  }

  if (
    geoJson.type ===
    "Feature"
  ) {
    return {
      type: "FeatureCollection",
      features: [geoJson],
    };
  }

  if (geoJson.type) {
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: geoJson,
        },
      ],
    };
  }

  return null;
}

/* ============================================================
   MAP FIT CONTROLLER
============================================================ */

function CityBoundsController({
  geoBoundary,
}) {
  const map = useMap();

  useEffect(() => {
    if (!geoBoundary) {
      return;
    }

    try {
      const layer =
        L.geoJSON(
          geoBoundary
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
              50,
              50,
            ],
            maxZoom: 11,
          }
        );
      }
    } catch (error) {
      console.error(
        "Unable to fit city boundary:",
        error
      );
    }
  }, [
    geoBoundary,
    map,
  ]);

  return null;
}

/* ============================================================
   ZONE STYLE
============================================================ */

function getZoneStyle(
  color,
  selected
) {
  return {
    color: selected
      ? "#26384A"
      : "#64748B",

    weight: selected
      ? 3
      : 1.5,

    opacity: 1,

    fillColor:
      color,

    fillOpacity:
      selected
        ? 0.55
        : 0.38,

    lineCap:
      "round",

    lineJoin:
      "round",
  };
}

/* ============================================================
   CITY STYLE
============================================================ */

const CITY_STYLE = {
  color: "#405268",

  weight: 3,

  opacity: 1,

  fillColor:
    "transparent",

  fillOpacity: 0,

  lineCap:
    "round",

  lineJoin:
    "round",
};

/* ============================================================
   COMPONENT
============================================================ */

export default function CityMapOverview({
  cityId = CITY_ID,
}) {
  /* ----------------------------------------------------------
     STATE
  ---------------------------------------------------------- */

  const [
    cityData,
    setCityData,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    selectedZone,
    setSelectedZone,
  ] = useState("");

  const [
    selectedDivision,
    setSelectedDivision,
  ] = useState("");

  const [
    selectedWard,
    setSelectedWard,
  ] = useState("");

  const [
    zoneDropdownOpen,
    setZoneDropdownOpen,
  ] = useState(false);

  const [
    divisionDropdownOpen,
    setDivisionDropdownOpen,
  ] = useState(false);

  const [
    wardDropdownOpen,
    setWardDropdownOpen,
  ] = useState(false);

  const zoneDropdownRef =
    useRef(null);

  const divisionDropdownRef =
    useRef(null);

  const wardDropdownRef =
    useRef(null);

  /* ==========================================================
     FETCH CITY MAP DATA
  ========================================================== */

  const fetchCityMapData =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError("");

          const token =
            localStorage.getItem(
              "token"
            );

          const endpoint =
            `${API_BASE_URL}/api/master-citizen/map/city/${cityId}`;

          console.log(
            "================================"
          );

          console.log(
            "CITY MAP REQUEST"
          );

          console.log(
            "Endpoint:",
            endpoint
          );

          console.log(
            "City ID:",
            cityId
          );

          console.log(
            "================================"
          );

          const response =
            await fetch(
              endpoint,
              {
                method: "GET",

                headers: {
                  "Content-Type":
                    "application/json",

                  ...(token
                    ? {
                        Authorization:
                          `Bearer ${token}`,
                      }
                    : {}),
                },
              }
            );

          if (
            !response.ok
          ) {
            throw new Error(
              `Map request failed: ${response.status}`
            );
          }

          const result =
            await response.json();

          console.log(
            "CITY MAP RESPONSE:",
            result
          );

          if (
            !result ||
            result.success !==
              true
          ) {
            throw new Error(
              result?.message ||
                "Invalid city map response."
            );
          }

          setCityData(
            result
          );
        } catch (requestError) {
          console.error(
            "CITY MAP ERROR:",
            requestError
          );

          setError(
            requestError?.message ||
              "Unable to load city map."
          );
        } finally {
          setLoading(false);
        }
      },
      [cityId]
    );

  /* ==========================================================
     INITIAL LOAD
  ========================================================== */

  useEffect(() => {
    fetchCityMapData();
  }, [
    fetchCityMapData,
  ]);

  /* ==========================================================
     CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  ========================================================== */

  useEffect(() => {
    function handleOutsideClick(
      event
    ) {
      if (
        zoneDropdownRef.current &&
        !zoneDropdownRef.current.contains(
          event.target
        )
      ) {
        setZoneDropdownOpen(
          false
        );
      }

      if (
        divisionDropdownRef.current &&
        !divisionDropdownRef.current.contains(
          event.target
        )
      ) {
        setDivisionDropdownOpen(
          false
        );
      }

      if (
        wardDropdownRef.current &&
        !wardDropdownRef.current.contains(
          event.target
        )
      ) {
        setWardDropdownOpen(
          false
        );
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /* ==========================================================
     CITY
  ========================================================== */

  const city =
    cityData?.city ||
    null;

  /* ==========================================================
     NORMALIZED CITY BOUNDARY
  ========================================================== */

  const cityBoundary =
    useMemo(() => {
      return makeFeatureCollection(
        city?.geoBoundary
      );
    }, [
      city?.geoBoundary,
    ]);

  /* ==========================================================
     ZONES
  ========================================================== */

  const zones =
    useMemo(() => {
      if (
        !Array.isArray(
          cityData?.zones
        )
      ) {
        return [];
      }

      return cityData.zones;
    }, [
      cityData?.zones,
    ]);

  /* ==========================================================
     NORMALIZED ZONE DATA
  ========================================================== */

  const normalizedZones =
    useMemo(() => {
      return zones
        .map(
          (
            zone,
            index
          ) => {
            const zoneBoundary =
              makeFeatureCollection(
                zone?.geoBoundary
              );

            return {
              ...zone,

              zoneName:
                zone?.zoneName ||
                `Zone ${index + 1}`,

              zoneBoundary,

              color:
                ZONE_COLORS[
                  index %
                    ZONE_COLORS.length
                ],
            };
          }
        )
        .filter(
          (zone) =>
            zone.zoneBoundary
        );
    }, [
      zones,
    ]);

  /* ==========================================================
     FILTERED ZONES
  ========================================================== */

  const visibleZones =
    useMemo(() => {
      if (
        !selectedZone
      ) {
        return normalizedZones;
      }

      return normalizedZones.filter(
        (zone) =>
          zone.zoneName ===
          selectedZone
      );
    }, [
      normalizedZones,
      selectedZone,
    ]);

  /* ==========================================================
     ZONE SELECTION
  ========================================================== */

  const handleZoneSelect =
    useCallback(
      (zoneName) => {
        if (
          zoneName ===
          selectedZone
        ) {
          setSelectedZone(
            ""
          );

          return;
        }

        setSelectedZone(
          zoneName
        );

        setZoneDropdownOpen(
          false
        );
      },
      [selectedZone]
    );

  /* ==========================================================
     DIVISION SELECTION
  ========================================================== */

  const handleDivisionSelect =
    useCallback(
      (value) => {
        setSelectedDivision(
          value
        );

        setDivisionDropdownOpen(
          false
        );
      },
      []
    );

  /* ==========================================================
     WARD SELECTION
  ========================================================== */

  const handleWardSelect =
    useCallback(
      (value) => {
        setSelectedWard(
          value
        );

        setWardDropdownOpen(
          false
        );
      },
      []
    );

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <section className="w-full rounded-[22px] border border-slate-200 bg-white p-6 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
        <h2 className="mb-5 text-[24px] font-bold tracking-[-0.03em] text-slate-950">
          CITY OVERVIEW MAP
        </h2>

        <div className="relative h-[790px] w-full overflow-hidden rounded-[20px] border border-slate-200 bg-slate-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 shadow-sm">
              Loading city map...
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ==========================================================
     ERROR
  ========================================================== */

  if (error) {
    return (
      <section className="w-full rounded-[22px] border border-slate-200 bg-white p-6 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
        <h2 className="mb-5 text-[24px] font-bold tracking-[-0.03em] text-slate-950">
          CITY OVERVIEW MAP
        </h2>

        <div className="flex h-[790px] items-center justify-center rounded-[20px] border border-red-100 bg-red-50">
          <div className="max-w-md rounded-xl border border-red-200 bg-white px-6 py-5 text-center shadow-sm">
            <p className="text-sm font-semibold text-red-600">
              Unable to load city map
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              {error}
            </p>

            <button
              type="button"
              onClick={
                fetchCityMapData
              }
              className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  /* ==========================================================
     MAIN UI
  ========================================================== */

  return (
    <section className="w-full rounded-[22px] border border-slate-200 bg-white p-6 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
      {/* ======================================================
         TITLE
      ====================================================== */}

      <h2 className="mb-5 text-[24px] font-bold tracking-[-0.03em] text-slate-950">
        CITY OVERVIEW MAP
      </h2>

      {/* ======================================================
         MAP
      ====================================================== */}

      <div className="relative h-[790px] w-full overflow-hidden rounded-[20px] border border-slate-200">
        <MapContainer
          center={[
            12.9716,
            77.5946,
          ]}
          zoom={10}
          scrollWheelZoom={true}
          zoomControl={true}
          className="h-full w-full"
          style={{
            height:
              "100%",
            width:
              "100%",
          }}
        >
          {/* ==================================================
             GREY CARTO BASE MAP
          ================================================== */}

          <TileLayer
            attribution='&copy; OpenStreetMap contributors &copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          {/* ==================================================
             FIT TO CITY
          ================================================== */}

          {cityBoundary && (
            <CityBoundsController
              geoBoundary={
                cityBoundary
              }
            />
          )}

          {/* ==================================================
             CITY OUTLINE
             
             IMPORTANT:
             NO FILL.
          ================================================== */}

          {cityBoundary && (
            <GeoJSON
              key={`city-${city?.id || cityId}`}
              data={
                cityBoundary
              }
              style={() =>
                CITY_STYLE
              }
              interactive={
                false
              }
            />
          )}

          {/* ==================================================
             ZONE BOUNDARIES + FILLS
          ================================================== */}

          {visibleZones.map(
            (
              zone,
              index
            ) => {
              const isSelected =
                selectedZone ===
                zone.zoneName;

              return (
                <GeoJSON
                  key={`zone-${zone.zoneName}-${index}`}
                  data={
                    zone.zoneBoundary
                  }
                  style={() =>
                    getZoneStyle(
                      zone.color,
                      isSelected
                    )
                  }
                  onEachFeature={(
                    feature,
                    layer
                  ) => {
                    layer.bindTooltip(
                      zone.zoneName,
                      {
                        sticky:
                          true,

                        direction:
                          "top",

                        opacity:
                          0.95,

                        className:
                          "sewac-zone-tooltip",
                      }
                    );

                    layer.on({
                      mouseover:
                        () => {
                          if (
                            !isSelected
                          ) {
                            layer.setStyle(
                              {
                                weight: 2.5,
                                fillOpacity:
                                  0.55,
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
                              getZoneStyle(
                                zone.color,
                                false
                              )
                            );
                          }
                        },

                      click:
                        () => {
                          setSelectedZone(
                            zone.zoneName
                          );
                        },
                    });
                  }}
                />
              );
            }
          )}
        </MapContainer>

        {/* ====================================================
           MAP HEADER CARD
        ==================================================== */}

        <div className="pointer-events-none absolute left-7 top-7 z-[1000]">
          <div className="pointer-events-auto flex h-[76px] w-[500px] items-center justify-between rounded-[18px] border border-slate-200 bg-white px-6 shadow-[0_5px_18px_rgba(15,23,42,0.10)]">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center text-slate-500">
                <MapIcon
                  size={31}
                  strokeWidth={
                    1.8
                  }
                />
              </div>

              <div>
                <p className="text-[20px] font-semibold tracking-[-0.02em] text-slate-700">
                  City Overview
                  Map
                </p>

                {city?.cityName && (
                  <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                    {city.cityName}
                  </p>
                )}
              </div>
            </div>

            <ChevronDown
              size={21}
              strokeWidth={
                2
              }
              className="text-slate-600"
            />
          </div>
        </div>

        {/* ====================================================
           RIGHT FILTER PANEL
        ==================================================== */}

        <div className="absolute right-7 top-7 z-[1000] w-[285px]">
          <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_5px_18px_rgba(15,23,42,0.10)]">
            {/* ================================================
               TITLE
            ================================================= */}

            <div className="mb-4">
              <p className="text-[14px] font-bold tracking-[-0.01em] text-slate-700">
                MAP FILTERS
              </p>
            </div>

            {/* ================================================
               ZONE
            ================================================= */}

            <div
              ref={
                zoneDropdownRef
              }
              className="mb-4"
            >
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.04em] text-slate-400">
                ZONE
              </label>

              <button
                type="button"
                onClick={() =>
                  setZoneDropdownOpen(
                    (previous) =>
                      !previous
                  )
                }
                className="flex h-[50px] w-full items-center justify-between rounded-[11px] border border-slate-200 bg-white px-4 text-left transition hover:border-slate-300"
              >
                <span className="truncate text-[13px] font-semibold text-slate-600">
                  {selectedZone ||
                    "All Zones"}
                </span>

                <ChevronDown
                  size={17}
                  className={`shrink-0 text-slate-500 transition-transform ${
                    zoneDropdownOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {zoneDropdownOpen && (
                <div className="relative z-[1100] mt-1 max-h-[250px] overflow-y-auto rounded-[11px] border border-slate-200 bg-white p-1 shadow-[0_8px_25px_rgba(15,23,42,0.12)]">
                  {/* ALL ZONES */}

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedZone(
                        ""
                      );

                      setZoneDropdownOpen(
                        false
                      );
                    }}
                    className={`w-full rounded-lg px-3 py-2.5 text-left text-[12px] font-semibold transition ${
                      !selectedZone
                        ? "bg-slate-100 text-slate-800"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    All Zones
                  </button>

                  {/* ACTUAL ZONES */}

                  {zones.map(
                    (
                      zone,
                      index
                    ) => (
                      <button
                        key={`zone-option-${index}`}
                        type="button"
                        onClick={() =>
                          handleZoneSelect(
                            zone.zoneName
                          )
                        }
                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[12px] font-medium transition ${
                          selectedZone ===
                          zone.zoneName
                            ? "bg-slate-100 font-semibold text-slate-800"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full border border-slate-400"
                          style={{
                            backgroundColor:
                              ZONE_COLORS[
                                index %
                                  ZONE_COLORS.length
                              ],
                          }}
                        />

                        <span className="truncate">
                          {
                            zone.zoneName
                          }
                        </span>
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* ================================================
               DIVISION
            ================================================= */}

            <div
              ref={
                divisionDropdownRef
              }
              className="mb-4"
            >
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.04em] text-slate-400">
                DIVISION
              </label>

              <button
                type="button"
                onClick={() =>
                  setDivisionDropdownOpen(
                    (previous) =>
                      !previous
                  )
                }
                className="flex h-[50px] w-full items-center justify-between rounded-[11px] border border-slate-200 bg-white px-4 text-left transition hover:border-slate-300"
              >
                <span className="truncate text-[13px] font-semibold text-slate-600">
                  {selectedDivision ||
                    "All Divisions"}
                </span>

                <ChevronDown
                  size={17}
                  className={`shrink-0 text-slate-500 transition-transform ${
                    divisionDropdownOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {divisionDropdownOpen && (
                <div className="relative z-[1100] mt-1 rounded-[11px] border border-slate-200 bg-white p-1 shadow-[0_8px_25px_rgba(15,23,42,0.12)]">
                  <button
                    type="button"
                    onClick={() =>
                      handleDivisionSelect(
                        ""
                      )
                    }
                    className="w-full rounded-lg px-3 py-2.5 text-left text-[12px] font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    All Divisions
                  </button>

                  <div className="px-3 py-2 text-[11px] leading-4 text-slate-400">
                    Division data will
                    populate when the
                    division endpoint is
                    connected.
                  </div>
                </div>
              )}
            </div>

            {/* ================================================
               WARD
            ================================================= */}

            <div
              ref={
                wardDropdownRef
              }
            >
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.04em] text-slate-400">
                WARD
              </label>

              <button
                type="button"
                onClick={() =>
                  setWardDropdownOpen(
                    (previous) =>
                      !previous
                  )
                }
                className="flex h-[50px] w-full items-center justify-between rounded-[11px] border border-slate-200 bg-white px-4 text-left transition hover:border-slate-300"
              >
                <span className="truncate text-[13px] font-semibold text-slate-600">
                  {selectedWard ||
                    "All Wards"}
                </span>

                <ChevronDown
                  size={17}
                  className={`shrink-0 text-slate-500 transition-transform ${
                    wardDropdownOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {wardDropdownOpen && (
                <div className="relative z-[1100] mt-1 rounded-[11px] border border-slate-200 bg-white p-1 shadow-[0_8px_25px_rgba(15,23,42,0.12)]">
                  <button
                    type="button"
                    onClick={() =>
                      handleWardSelect(
                        ""
                      )
                    }
                    className="w-full rounded-lg px-3 py-2.5 text-left text-[12px] font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    All Wards
                  </button>

                  <div className="px-3 py-2 text-[11px] leading-4 text-slate-400">
                    Ward data will
                    populate when the
                    ward endpoint is
                    connected.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ====================================================
           SELECTED ZONE INDICATOR
        ==================================================== */}

        {selectedZone && (
          <div className="absolute bottom-6 left-1/2 z-[1000] -translate-x-1/2">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-[0_5px_18px_rgba(15,23,42,0.12)]">
              <span
                className="h-3 w-3 rounded-full border border-slate-400"
                style={{
                  backgroundColor:
                    normalizedZones.find(
                      (
                        zone
                      ) =>
                        zone.zoneName ===
                        selectedZone
                    )?.color ||
                    "#DCEBFF",
                }}
              />

              <span className="text-[12px] font-semibold text-slate-600">
                {selectedZone}
              </span>

              <button
                type="button"
                onClick={() =>
                  setSelectedZone(
                    ""
                  )
                }
                className="ml-1 text-[11px] font-bold text-slate-400 transition hover:text-slate-700"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* ====================================================
           NO ZONE BOUNDARIES
        ==================================================== */}

        {!loading &&
          cityBoundary &&
          normalizedZones.length ===
            0 && (
            <div className="absolute bottom-6 left-1/2 z-[1000] -translate-x-1/2">
              <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-[12px] font-semibold text-slate-500 shadow-[0_5px_18px_rgba(15,23,42,0.10)]">
                No zone boundaries
                available.
              </div>
            </div>
          )}
      </div>

      {/* ======================================================
         SMALL MAP CSS
      ====================================================== */}

      <style>
        {`
          .sewac-zone-tooltip {
            border: 1px solid #dbe3ec !important;
            border-radius: 8px !important;
            padding: 6px 9px !important;
            font-size: 11px !important;
            font-weight: 600 !important;
            color: #334155 !important;
            background: #ffffff !important;
            box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12) !important;
          }

          .sewac-zone-tooltip:before {
            border-top-color: #ffffff !important;
          }

          .leaflet-container {
            font-family: inherit;
            background: #f5f7f8;
          }

          .leaflet-control-zoom {
            border: 1px solid #dbe3ec !important;
            border-radius: 8px !important;
            overflow: hidden;
            box-shadow: 0 3px 10px rgba(15, 23, 42, 0.08) !important;
          }

          .leaflet-control-zoom a {
            color: #475569 !important;
            background: #ffffff !important;
            border-color: #e2e8f0 !important;
          }

          .leaflet-control-zoom a:hover {
            background: #f8fafc !important;
          }

          .leaflet-control-attribution {
            font-size: 10px !important;
          }
        `}
      </style>
    </section>
  );
}