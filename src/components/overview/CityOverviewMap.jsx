import React, {
  useEffect,
  useMemo,
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
  ChevronUp,
} from "lucide-react";

import "leaflet/dist/leaflet.css";

/* ============================================================
   CONFIGURATION
============================================================ */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5002";

const DEFAULT_CITY_ID = 1;

/*
 * Subtle zone colours.
 *
 * These are intentionally light because the base map is grey.
 * The selected zone gets a stronger border/fill.
 */
const ZONE_COLORS = [
  "#8DB7E8",
  "#B5A7E8",
  "#8FC9C1",
  "#E4B66B",
  "#D99AB4",
  "#9BB7D4",
  "#A7CFA9",
  "#C8A7D9",
];

/* ============================================================
   HELPERS
============================================================ */

/**
 * Get zone name regardless of whether the backend returns:
 *
 * {
 *   zoneName: "..."
 * }
 *
 * or
 *
 * "Bengaluru East City Corporation"
 */
function getZoneName(zone) {
  if (!zone) return "";

  if (typeof zone === "string") {
    return zone;
  }

  return (
    zone.zoneName ||
    zone.zone_name ||
    zone.name ||
    ""
  );
}

/**
 * Get zone boundary.
 */
function getZoneBoundary(zone) {
  if (!zone || typeof zone === "string") {
    return null;
  }

  return (
    zone.geoBoundary ||
    zone.geo_boundary ||
    zone.geometry ||
    zone.boundary ||
    null
  );
}

/**
 * Get zone table name.
 */
function getZoneTableName(zone) {
  if (!zone || typeof zone === "string") {
    return null;
  }

  return (
    zone.zoneTableName ||
    zone.zone_table_name ||
    null
  );
}

/**
 * Normalise GeoJSON.
 *
 * The backend may return:
 *
 * FeatureCollection
 * Feature
 * Polygon
 * MultiPolygon
 * or sometimes coordinates directly.
 */
function normalizeGeoJSON(value) {
  if (!value) {
    return null;
  }

  let parsed = value;

  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return null;
    }
  }

  if (!parsed) {
    return null;
  }

  /*
   * Already a valid GeoJSON FeatureCollection.
   */
  if (
    parsed.type === "FeatureCollection"
  ) {
    return parsed;
  }

  /*
   * Already a Feature.
   */
  if (
    parsed.type === "Feature"
  ) {
    return parsed;
  }

  /*
   * Polygon / MultiPolygon.
   */
  if (
    parsed.type === "Polygon" ||
    parsed.type === "MultiPolygon"
  ) {
    return {
      type: "Feature",
      properties: {},
      geometry: parsed,
    };
  }

  /*
   * Raw coordinates.
   */
  if (Array.isArray(parsed)) {
    return {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: parsed,
      },
    };
  }

  return null;
}

/**
 * Safely create Leaflet bounds from GeoJSON.
 */
function getGeoJSONBounds(geoJSON) {
  if (!geoJSON) {
    return null;
  }

  try {
    const layer =
      L.geoJSON(geoJSON);

    const bounds =
      layer.getBounds();

    if (
      bounds &&
      bounds.isValid()
    ) {
      return bounds;
    }
  } catch (error) {
    console.error(
      "Failed to calculate GeoJSON bounds:",
      error
    );
  }

  return null;
}

/* ============================================================
   MAP AUTO FIT
============================================================ */

function MapBoundsController({
  geoJSON,
}) {
  const map = useMap();

  useEffect(() => {
    if (!geoJSON) {
      return;
    }

    const bounds =
      getGeoJSONBounds(
        geoJSON
      );

    if (
      bounds &&
      bounds.isValid()
    ) {
      map.fitBounds(
        bounds,
        {
          padding: [
            45,
            45,
          ],
          maxZoom: 12,
        }
      );
    }
  }, [
    geoJSON,
    map,
  ]);

  return null;
}

/* ============================================================
   CITY MAP COMPONENT
============================================================ */

export default function CityMapOverview({
  cityId = DEFAULT_CITY_ID,
}) {
  /* ----------------------------------------------------------
     STATE
  ---------------------------------------------------------- */

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    cityData,
    setCityData,
  ] = useState(null);

  const [
    selectedZone,
    setSelectedZone,
  ] = useState("ALL");

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

  /* ----------------------------------------------------------
     FETCH CITY MAP DATA
  ---------------------------------------------------------- */

  useEffect(() => {
    let cancelled = false;

    async function loadCityMap() {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `${API_BASE_URL}/api/master-citizen/map/city/${cityId}`,
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

        const result =
          await response.json();

        if (cancelled) {
          return;
        }

        /*
         * Expected:
         *
         * {
         *   success: true,
         *   city: {...},
         *   zones: [...]
         * }
         */
        if (
          !result ||
          result.success === false
        ) {
          throw new Error(
            result?.message ||
              "Unable to load city map data."
          );
        }

        setCityData(
          result
        );
      } catch (err) {
        console.error(
          "CITY MAP FETCH ERROR:",
          err
        );

        if (!cancelled) {
          setError(
            err.message ||
              "Unable to load city map."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCityMap();

    return () => {
      cancelled = true;
    };
  }, [
    cityId,
  ]);

  /* ----------------------------------------------------------
     CITY
  ---------------------------------------------------------- */

  const city =
    cityData?.city ||
    null;

  const cityName =
    city?.cityName ||
    city?.city_name ||
    "Bangalore";

  const cityBoundary =
    useMemo(
      () =>
        normalizeGeoJSON(
          city?.geoBoundary ||
            city?.geo_boundary
        ),
      [
        city,
      ]
    );

  /* ----------------------------------------------------------
     ZONES
  ---------------------------------------------------------- */

  const zones =
    useMemo(() => {
      if (
        !Array.isArray(
          cityData?.zones
        )
      ) {
        return [];
      }

      return cityData.zones
        .map(
          (
            zone,
            index
          ) => {
            const name =
              getZoneName(
                zone
              );

            return {
              raw:
                zone,

              id:
                zone?.id ??
                zone?.zoneId ??
                index + 1,

              name,

              geoBoundary:
                normalizeGeoJSON(
                  getZoneBoundary(
                    zone
                  )
                ),

              tableName:
                getZoneTableName(
                  zone
                ),

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
            zone.name
        );
    }, [
      cityData,
    ]);

  /* ----------------------------------------------------------
     SELECTED ZONE
  ---------------------------------------------------------- */

  const activeZone =
    selectedZone === "ALL"
      ? null
      : zones.find(
          (zone) =>
            String(
              zone.id
            ) ===
            String(
              selectedZone
            )
        );

  /* ----------------------------------------------------------
     ZONE SELECTION
  ---------------------------------------------------------- */

  function handleZoneSelect(
    zoneId
  ) {
    setSelectedZone(
      zoneId
    );

    setZoneDropdownOpen(
      false
    );
  }

  /* ----------------------------------------------------------
     LOADING
  ---------------------------------------------------------- */

  if (loading) {
    return (
      <div className="w-full">
        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-[26px] font-semibold text-slate-950">
            CITY OVERVIEW MAP
          </h2>

          <div className="mt-5 flex h-[780px] items-center justify-center rounded-[20px] bg-slate-50">
            <div className="text-[14px] font-medium text-slate-500">
              Loading city map...
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------------
     ERROR
  ---------------------------------------------------------- */

  if (error) {
    return (
      <div className="w-full">
        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-[26px] font-semibold text-slate-950">
            CITY OVERVIEW MAP
          </h2>

          <div className="mt-5 flex h-[500px] items-center justify-center rounded-[20px] bg-slate-50">
            <div className="text-center">
              <p className="text-[15px] font-semibold text-red-500">
                Failed to load city map
              </p>

              <p className="mt-2 text-[13px] text-slate-500">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="w-full">
      {/* ======================================================
          OUTER CARD
      ====================================================== */}

      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">

        {/* ====================================================
            TITLE
        ==================================================== */}

        <h2 className="text-[26px] font-semibold tracking-[-0.02em] text-slate-950">
          CITY OVERVIEW MAP
        </h2>

        {/* ====================================================
            MAP
        ==================================================== */}

        <div className="relative mt-6 h-[790px] overflow-hidden rounded-[20px] border border-slate-200">

          <MapContainer
            center={[
              12.9716,
              77.5946,
            ]}
            zoom={10}
            minZoom={8}
            maxZoom={17}
            zoomControl={true}
            scrollWheelZoom={true}
            className="h-full w-full"
          >

            {/* ==================================================
                GREY BASE MAP
            ================================================== */}

            <TileLayer
              attribution='&copy; OpenStreetMap contributors &copy; CARTO'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />

            {/* ==================================================
                CITY BOUNDARY
                OUTLINE ONLY
            ================================================== */}

            {cityBoundary && (
              <>
                <GeoJSON
                  key={`city-boundary-${cityId}`}
                  data={
                    cityBoundary
                  }
                  style={{
                    color:
                      "#34465A",

                    weight:
                      4,

                    opacity:
                      0.95,

                    fill:
                      false,

                    fillOpacity:
                      0,
                  }}
                />

                <MapBoundsController
                  geoJSON={
                    cityBoundary
                  }
                />
              </>
            )}

            {/* ==================================================
                ZONE BOUNDARIES
            ================================================== */}

            {zones.map(
              (
                zone
              ) => {
                if (
                  !zone.geoBoundary
                ) {
                  return null;
                }

                const isActive =
                  activeZone &&
                  String(
                    activeZone.id
                  ) ===
                    String(
                      zone.id
                    );

                const isAll =
                  selectedZone ===
                  "ALL";

                return (
                  <GeoJSON
                    key={`zone-${zone.id}-${zone.name}`}
                    data={
                      zone.geoBoundary
                    }
                    style={{
                      color:
                        isActive
                          ? "#1E293B"
                          : zone.color,

                      weight:
                        isActive
                          ? 4
                          : 2,

                      opacity:
                        isActive
                          ? 1
                          : 0.9,

                      fillColor:
                        zone.color,

                      fillOpacity:
                        isActive
                          ? 0.38
                          : isAll
                          ? 0.18
                          : 0.10,

                      dashArray:
                        isActive
                          ? undefined
                          : undefined,
                    }}
                    eventHandlers={{
                      click: () =>
                        handleZoneSelect(
                          zone.id
                        ),

                      mouseover:
                        (
                          event
                        ) => {
                          const layer =
                            event.target;

                          layer.setStyle(
                            {
                              weight:
                                3,

                              fillOpacity:
                                0.30,
                            }
                          );
                        },

                      mouseout:
                        (
                          event
                        ) => {
                          const layer =
                            event.target;

                          const currentlyActive =
                            activeZone &&
                            String(
                              activeZone.id
                            ) ===
                              String(
                                zone.id
                              );

                          layer.setStyle(
                            {
                              weight:
                                currentlyActive
                                  ? 4
                                  : 2,

                              fillOpacity:
                                currentlyActive
                                  ? 0.38
                                  : selectedZone ===
                                    "ALL"
                                  ? 0.18
                                  : 0.10,
                            }
                          );
                        },
                    }}
                  />
                );
              }
            )}

          </MapContainer>

          {/* ====================================================
              MAP HEADER
          ==================================================== */}

          <div className="absolute left-7 top-7 z-[1000] w-[620px] max-w-[calc(100%-56px)]">
            <div className="rounded-[18px] border border-slate-200 bg-white px-7 py-5 shadow-[0_8px_30px_rgba(15,23,42,0.10)]">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-5">

                  <MapIcon
                    size={
                      29
                    }
                    strokeWidth={
                      2
                    }
                    className="text-slate-500"
                  />

                  <div>
                    <div className="text-[23px] font-semibold text-slate-700">
                      City Overview Map
                    </div>

                    <div className="mt-1 text-[13px] font-medium text-slate-400">
                      {cityName}
                    </div>
                  </div>

                </div>

                <ChevronDown
                  size={
                    22
                  }
                  className="text-slate-600"
                />

              </div>
            </div>
          </div>

          {/* ====================================================
              RIGHT FILTER PANEL
          ==================================================== */}

          <div className="absolute right-7 top-7 z-[1000] w-[355px]">

            <div className="rounded-[20px] border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.10)]">

              {/* ================================================
                  FILTER TITLE
              ================================================= */}

              <div className="mb-6 text-[18px] font-bold text-slate-700">
                MAP FILTERS
              </div>

              {/* ================================================
                  ZONE
              ================================================= */}

              <div className="relative">

                <label className="mb-2 block text-[13px] font-semibold uppercase tracking-wide text-slate-400">
                  ZONE
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setZoneDropdownOpen(
                      (prev) =>
                        !prev
                    )
                  }
                  className="flex h-[62px] w-full items-center justify-between rounded-[14px] border border-slate-300 bg-white px-5 text-left transition hover:border-slate-400"
                >

                  <span className="truncate text-[16px] font-medium text-slate-600">
                    {activeZone
                      ? activeZone.name
                      : "All Zones"}
                  </span>

                  {zoneDropdownOpen ? (
                    <ChevronUp
                      size={
                        19
                      }
                      className="shrink-0 text-slate-500"
                    />
                  ) : (
                    <ChevronDown
                      size={
                        19
                      }
                      className="shrink-0 text-slate-500"
                    />
                  )}

                </button>

                {/* ==============================================
                    ZONE DROPDOWN
                =============================================== */}

                {zoneDropdownOpen && (
                  <div className="absolute left-0 right-0 top-[91px] z-[1100] overflow-hidden rounded-[15px] border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.14)]">

                    {/* ALL ZONES */}

                    <button
                      type="button"
                      onClick={() =>
                        handleZoneSelect(
                          "ALL"
                        )
                      }
                      className={`flex w-full items-center gap-3 px-5 py-4 text-left text-[14px] font-semibold transition ${
                        selectedZone ===
                        "ALL"
                          ? "bg-slate-100 text-slate-800"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className="h-3 w-3 shrink-0 rounded-full border border-slate-400"
                        style={{
                          background:
                            "#E2E8F0",
                        }}
                      />

                      <span>
                        All Zones
                      </span>
                    </button>

                    {/* ZONES */}

                    <div className="max-h-[300px] overflow-y-auto">

                      {zones.map(
                        (
                          zone
                        ) => {
                          const active =
                            String(
                              selectedZone
                            ) ===
                            String(
                              zone.id
                            );

                          return (
                            <button
                              key={
                                zone.id
                              }
                              type="button"
                              onClick={() =>
                                handleZoneSelect(
                                  zone.id
                                )
                              }
                              className={`flex w-full items-center gap-3 px-5 py-4 text-left transition ${
                                active
                                  ? "bg-slate-50"
                                  : "hover:bg-slate-50"
                              }`}
                            >

                              <span
                                className="h-3 w-3 shrink-0 rounded-full border"
                                style={{
                                  backgroundColor:
                                    zone.color,
                                  borderColor:
                                    active
                                      ? "#334155"
                                      : "#94A3B8",
                                }}
                              />

                              <span
                                className={`truncate text-[14px] ${
                                  active
                                    ? "font-semibold text-slate-800"
                                    : "font-medium text-slate-600"
                                }`}
                                title={
                                  zone.name
                                }
                              >
                                {
                                  zone.name
                                }
                              </span>

                            </button>
                          );
                        }
                      )}

                    </div>
                  </div>
                )}

              </div>

              {/* ================================================
                  DIVISION
              ================================================= */}

              <div className="mt-7">

                <label className="mb-2 block text-[13px] font-semibold uppercase tracking-wide text-slate-400">
                  DIVISION
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setDivisionDropdownOpen(
                      (prev) =>
                        !prev
                    )
                  }
                  className="flex h-[62px] w-full items-center justify-between rounded-[14px] border border-slate-300 bg-white px-5 text-left"
                >

                  <span className="text-[16px] font-medium text-slate-600">
                    All Divisions
                  </span>

                  {divisionDropdownOpen ? (
                    <ChevronUp
                      size={
                        19
                      }
                      className="text-slate-500"
                    />
                  ) : (
                    <ChevronDown
                      size={
                        19
                      }
                      className="text-slate-500"
                    />
                  )}

                </button>

                {divisionDropdownOpen && (
                  <div className="mt-2 rounded-[14px] border border-slate-200 bg-white p-4 shadow-lg">
                    <div className="text-[13px] text-slate-500">
                      Select a zone first to load divisions.
                    </div>
                  </div>
                )}

              </div>

              {/* ================================================
                  WARD
              ================================================= */}

              <div className="mt-7">

                <label className="mb-2 block text-[13px] font-semibold uppercase tracking-wide text-slate-400">
                  WARD
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setWardDropdownOpen(
                      (prev) =>
                        !prev
                    )
                  }
                  className="flex h-[62px] w-full items-center justify-between rounded-[14px] border border-slate-300 bg-white px-5 text-left"
                >

                  <span className="text-[16px] font-medium text-slate-600">
                    All Wards
                  </span>

                  {wardDropdownOpen ? (
                    <ChevronUp
                      size={
                        19
                      }
                      className="text-slate-500"
                    />
                  ) : (
                    <ChevronDown
                      size={
                        19
                      }
                      className="text-slate-500"
                    />
                  )}

                </button>

                {wardDropdownOpen && (
                  <div className="mt-2 rounded-[14px] border border-slate-200 bg-white p-4 shadow-lg">
                    <div className="text-[13px] text-slate-500">
                      Select a division first to load wards.
                    </div>
                  </div>
                )}

              </div>

            </div>
          </div>

          {/* ====================================================
              SELECTED ZONE INFO
          ==================================================== */}

          {activeZone && (
            <div className="absolute bottom-7 left-7 z-[1000] max-w-[390px]">

              <div className="rounded-[16px] border border-slate-200 bg-white px-5 py-4 shadow-[0_8px_30px_rgba(15,23,42,0.12)]">

                <div className="flex items-start gap-3">

                  <span
                    className="mt-1 h-3 w-3 shrink-0 rounded-full border border-slate-500"
                    style={{
                      backgroundColor:
                        activeZone.color,
                    }}
                  />

                  <div>

                    <div className="text-[13px] font-semibold uppercase tracking-wide text-slate-400">
                      SELECTED ZONE
                    </div>

                    <div className="mt-1 text-[15px] font-semibold text-slate-700">
                      {
                        activeZone.name
                      }
                    </div>

                    {activeZone.tableName && (
                      <div className="mt-1 text-[11px] text-slate-400">
                        {
                          activeZone.tableName
                        }
                      </div>
                    )}

                  </div>

                </div>

              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}