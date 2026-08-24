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
  Marker,
  Popup,
  Polyline,
  GeoJSON,
  CircleMarker,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import { io } from "socket.io-client";

import "leaflet/dist/leaflet.css";

/* ============================================================
   SOCKET CONFIG
============================================================ */

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  window.location.origin;

/* ============================================================
   VEHICLE ICON
============================================================ */

const createVehicleIcon = (
  online = true,
) =>
  L.divIcon({
    className:
      "sewac-live-vehicle-marker",

    html: `
      <div
        style="
          position:relative;
          width:46px;
          height:46px;
          border-radius:50%;
          background:${
            online
              ? "#16A34A"
              : "#94A3B8"
          };
          border:4px solid #FFFFFF;
          box-shadow:
            0 4px 14px
            rgba(0,0,0,0.25);
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:21px;
        "
      >
        🚛

        ${
          online
            ? `
              <span
                style="
                  position:absolute;
                  right:-1px;
                  bottom:-1px;
                  width:12px;
                  height:12px;
                  border-radius:50%;
                  background:#22C55E;
                  border:2px solid white;
                "
              ></span>
            `
            : ""
        }
      </div>
    `,

    iconSize: [
      46,
      46,
    ],

    iconAnchor: [
      23,
      23,
    ],

    popupAnchor: [
      0,
      -23,
    ],
  });

/* ============================================================
   GEOJSON PARSER
============================================================ */

function parseGeoJSON(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  if (
    typeof value === "object"
  ) {
    return value;
  }

  if (
    typeof value === "string"
  ) {
    try {
      return JSON.parse(
        value,
      );
    } catch {
      return null;
    }
  }

  return null;
}

/* ============================================================
   GEOJSON COORDINATE HELPERS
============================================================ */

function isCoordinatePair(
  value,
) {
  return (
    Array.isArray(value) &&
    value.length >= 2 &&
    Number.isFinite(
      Number(value[0]),
    ) &&
    Number.isFinite(
      Number(value[1]),
    )
  );
}

/* ============================================================
   NORMALIZE BOUNDARY COORDINATES
============================================================ */

function normalizeCoordinatePair(
  pair,
) {
  if (
    !isCoordinatePair(pair)
  ) {
    return pair;
  }

  const first =
    Number(pair[0]);

  const second =
    Number(pair[1]);

  /*
   * SEWAC boundary data may
   * arrive as:
   *
   * [latitude, longitude]
   *
   * GeoJSON requires:
   *
   * [longitude, latitude]
   */

  if (
    Math.abs(first) <= 30 &&
    Math.abs(second) >= 60
  ) {
    return [
      second,
      first,
      ...pair.slice(2),
    ];
  }

  return pair;
}

/* ============================================================
   NORMALIZE NESTED COORDINATES
============================================================ */

function normalizeCoordinates(
  value,
) {
  if (
    isCoordinatePair(value)
  ) {
    return normalizeCoordinatePair(
      value,
    );
  }

  if (
    Array.isArray(value)
  ) {
    return value.map(
      normalizeCoordinates,
    );
  }

  return value;
}

/* ============================================================
   NORMALIZE GEOJSON
============================================================ */

function normalizeGeoJSON(
  value,
) {
  const parsed =
    parseGeoJSON(value);

  if (!parsed) {
    return null;
  }

  /* ----------------------------------------------------------
     FEATURE COLLECTION
  ---------------------------------------------------------- */

  if (
    parsed.type ===
    "FeatureCollection"
  ) {
    return {
      ...parsed,

      features:
        Array.isArray(
          parsed.features,
        )
          ? parsed.features
              .map(
                normalizeGeoJSON,
              )
              .filter(Boolean)
          : [],
    };
  }

  /* ----------------------------------------------------------
     FEATURE
  ---------------------------------------------------------- */

  if (
    parsed.type ===
    "Feature"
  ) {
    if (
      !parsed.geometry
    ) {
      return null;
    }

    return {
      ...parsed,

      geometry:
        normalizeGeoJSON(
          parsed.geometry,
        ),
    };
  }

  /* ----------------------------------------------------------
     GEOMETRY COLLECTION
  ---------------------------------------------------------- */

  if (
    parsed.type ===
    "GeometryCollection"
  ) {
    return {
      ...parsed,

      geometries:
        Array.isArray(
          parsed.geometries,
        )
          ? parsed.geometries
              .map(
                normalizeGeoJSON,
              )
              .filter(Boolean)
          : [],
    };
  }

  /* ----------------------------------------------------------
     STANDARD GEOMETRY
  ---------------------------------------------------------- */

  if (
    parsed.type &&
    parsed.coordinates
  ) {
    return {
      ...parsed,

      coordinates:
        normalizeCoordinates(
          parsed.coordinates,
        ),
    };
  }

  /* ----------------------------------------------------------
     RAW COORDINATE ARRAY
  ---------------------------------------------------------- */

  if (
    Array.isArray(parsed)
  ) {
    return {
      type: "Feature",

      properties: {},

      geometry: {
        type: "Polygon",

        coordinates:
          normalizeCoordinates(
            parsed,
          ),
      },
    };
  }

  /* ----------------------------------------------------------
     OBJECT CONTAINING GEOMETRY
  ---------------------------------------------------------- */

  if (
    parsed.geometry &&
    typeof parsed.geometry ===
      "object"
  ) {
    return normalizeGeoJSON({
      type: "Feature",

      properties:
        parsed.properties ||
        {},

      geometry:
        parsed.geometry,
    });
  }

  return null;
}

/* ============================================================
   GET SELECTED BOUNDARY
============================================================ */

function getBoundary(
  selectedCity,
  selectedZone,
  selectedDivision,
  selectedWard,
) {
  const extract =
    (value) =>
      normalizeGeoJSON(
        value?.geoBoundary ??
          value?.geo_boundary ??
          value?.geometry ??
          value?.boundary,
      );

  /*
   * Ward has highest priority.
   */

  if (
    selectedWard
  ) {
    return extract(
      selectedWard,
    );
  }

  /*
   * Division.
   */

  if (
    selectedDivision
  ) {
    return extract(
      selectedDivision,
    );
  }

  /*
   * Zone.
   */

  if (
    selectedZone
  ) {
    return extract(
      selectedZone,
    );
  }

  /*
   * City.
   */

  if (
    selectedCity
  ) {
    return extract(
      selectedCity,
    );
  }

  return null;
}

/* ============================================================
   GPS POSITION
============================================================ */

/*
 * HB telemetry uses:
 *
 * latitude
 * longitude
 *
 * Leaflet uses:
 *
 * [latitude, longitude]
 *
 * DO NOT SWAP THEM.
 */

function gpsPosition(
  latitude,
  longitude,
) {
  const lat =
    Number(latitude);

  const lng =
    Number(longitude);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng)
  ) {
    return null;
  }

  if (
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    return null;
  }

  return [
    lat,
    lng,
  ];
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
        () =>
          map.invalidateSize(),
        100,
      ),

      setTimeout(
        () =>
          map.invalidateSize(),
        400,
      ),

      setTimeout(
        () =>
          map.invalidateSize(),
        800,
      ),
    ];

    return () => {
      timers.forEach(
        clearTimeout,
      );
    };
  }, [map]);

  return null;
}

/* ============================================================
   BOUNDARY CONTROLLER
============================================================ */

function BoundaryController({
  boundary,
}) {
  const map =
    useMap();

  useEffect(() => {
    if (!boundary) {
      return;
    }

    try {
      const layer =
        L.geoJSON(
          boundary,
        );

      const bounds =
        layer.getBounds();

      if (
        bounds.isValid()
      ) {
        map.fitBounds(
          bounds,
          {
            padding: [
              60,
              60,
            ],

            maxZoom: 14,

            animate: true,
          },
        );
      }
    } catch (error) {
      console.warn(
        "Live map boundary error:",
        error,
      );
    }
  }, [
    map,
    boundary,
  ]);

  return null;
}

/* ============================================================
   LIVE MAP
============================================================ */

export default function LiveMap({
  mapData,

  selectedDate,

  selectedCity,

  selectedZone,

  selectedDivision,

  selectedWard,
}) {
  /* ==========================================================
     INITIAL ROUTES
  ========================================================== */

  const initialRoutes =
    useMemo(
      () =>
        Array.isArray(
          mapData?.routes,
        )
          ? mapData.routes
          : [],
      [mapData],
    );

  /* ==========================================================
     VEHICLE STATE
  ========================================================== */

  const [vehicles, setVehicles] =
    useState(() => {
      const initial = {};

      initialRoutes.forEach(
        (route) => {
          if (
            !route?.vehicleNumber
          ) {
            return;
          }

          const endPoint =
            route.endPoint;

          if (!endPoint) {
            return;
          }

          const position =
            gpsPosition(
              endPoint.latitude,
              endPoint.longitude,
            );

          if (!position) {
            return;
          }

          const vehicleId =
            String(
              route.vehicleNumber,
            );

          initial[
            vehicleId
          ] = {
            vehicleId,

            vehicleNumber:
              route.vehicleNumber,

            wardNo:
              route.wardNo ??
              null,

            latitude:
              position[0],

            longitude:
              position[1],

            startLatitude:
              position[0],

            startLongitude:
              position[1],

            targetLatitude:
              position[0],

            targetLongitude:
              position[1],

            animationStart:
              0,

            animationDuration:
              1500,

            online: false,

            lastUpdate:
              endPoint.timestamp
                ? new Date(
                    endPoint.timestamp,
                  ).getTime()
                : 0,

            routePoints:
              Array.isArray(
                route.points,
              )
                ? route.points
                : [],
          };
        },
      );

      return initial;
    });

  /* ==========================================================
     REFS
  ========================================================== */

  const vehiclesRef =
    useRef(
      vehicles,
    );

  const socketRef =
    useRef(null);

  const animationRef =
    useRef(null);

  const toastTimerRef =
    useRef(null);

  const offlineTimerRef =
    useRef(null);

  /* ==========================================================
     TOAST STATE
  ========================================================== */

  const [toast, setToast] =
    useState(null);

  /* ==========================================================
     KEEP VEHICLE REF UPDATED
  ========================================================== */

  useEffect(() => {
    vehiclesRef.current =
      vehicles;
  }, [vehicles]);

  /* ==========================================================
     SHOW TOAST
  ========================================================== */

  const showToast =
    useCallback(
      (
        title,
        message,
        type = "success",
      ) => {
        setToast({
          id: Date.now(),

          title,

          message,

          type,
        });

        if (
          toastTimerRef.current
        ) {
          clearTimeout(
            toastTimerRef.current,
          );
        }

        toastTimerRef.current =
          setTimeout(() => {
            setToast(null);
          }, 3500);
      },
      [],
    );

  /* ==========================================================
     FILTER MATCHING
  ========================================================== */

  const matchesFilters =
    useCallback(
      (heartbeat) => {
        if (!heartbeat) {
          return false;
        }

        /*
         * Ward filter.
         */

        if (
          selectedWard
        ) {
          const selectedWardId =
            selectedWard.wardNo ??
            selectedWard.ward_no ??
            selectedWard.id ??
            selectedWard.wardId;

          if (
            selectedWardId !==
              undefined &&
            selectedWardId !==
              null
          ) {
            if (
              Number(
                heartbeat.wardNo,
              ) !==
                Number(
                  selectedWardId,
                )
            ) {
              return false;
            }
          }
        }

        /*
         * The initial route
         * response already respects
         * the selected city/zone/
         * division/ward scope.
         *
         * Therefore we only accept
         * socket vehicles that belong
         * to the current map dataset.
         */

        if (
          initialRoutes.length >
          0
        ) {
          const vehicleExists =
            initialRoutes.some(
              (route) =>
                String(
                  route.vehicleNumber,
                ) ===
                String(
                  heartbeat.vehicleId ||
                    heartbeat.vehicleNumber,
                ),
            );

          if (
            !vehicleExists
          ) {
            return false;
          }
        }

        return true;
      },
      [
        selectedWard,
        initialRoutes,
      ],
    );

  /* ==========================================================
     SMOOTH INTERPOLATION
  ========================================================== */

  const animateVehicles =
    useCallback(
      () => {
        const now =
          performance.now();

        setVehicles(
          (current) => {
            let changed =
              false;

            const next = {
              ...current,
            };

            Object.keys(
              next,
            ).forEach(
              (vehicleId) => {
                const vehicle =
                  next[
                    vehicleId
                  ];

                if (
                  !vehicle
                ) {
                  return;
                }

                if (
                  !Number.isFinite(
                    vehicle.startLatitude,
                  ) ||
                  !Number.isFinite(
                    vehicle.startLongitude,
                  ) ||
                  !Number.isFinite(
                    vehicle.targetLatitude,
                  ) ||
                  !Number.isFinite(
                    vehicle.targetLongitude,
                  )
                ) {
                  return;
                }

                const startTime =
                  vehicle.animationStart ||
                  now;

                const duration =
                  vehicle.animationDuration ||
                  1500;

                const elapsed =
                  now -
                  startTime;

                const progress =
                  Math.min(
                    Math.max(
                      elapsed /
                        duration,
                      0,
                    ),
                    1,
                  );

                /*
                 * Smoothstep:
                 *
                 * 3t² - 2t³
                 */

                const eased =
                  progress *
                  progress *
                  (3 -
                    2 *
                      progress);

                const latitude =
                  vehicle.startLatitude +
                  (
                    vehicle.targetLatitude -
                    vehicle.startLatitude
                  ) *
                    eased;

                const longitude =
                  vehicle.startLongitude +
                  (
                    vehicle.targetLongitude -
                    vehicle.startLongitude
                  ) *
                    eased;

                if (
                  Number.isFinite(
                    latitude,
                  ) &&
                  Number.isFinite(
                    longitude,
                  )
                ) {
                  next[
                    vehicleId
                  ] = {
                    ...vehicle,

                    latitude,

                    longitude,
                  };

                  changed =
                    true;
                }
              },
            );

            return changed
              ? next
              : current;
          },
        );

        animationRef.current =
          requestAnimationFrame(
            animateVehicles,
          );
      },
      [],
    );

  /* ==========================================================
     START ANIMATION LOOP
  ========================================================== */

  useEffect(() => {
    animationRef.current =
      requestAnimationFrame(
        animateVehicles,
      );

    return () => {
      if (
        animationRef.current
      ) {
        cancelAnimationFrame(
          animationRef.current,
        );
      }
    };
  }, [
    animateVehicles,
  ]);

  /* ==========================================================
     SOCKET.IO CONNECTION
  ========================================================== */

  useEffect(() => {
    /*
     * Do not create a socket
     * if the URL is unavailable.
     */

    if (
      !SOCKET_URL
    ) {
      console.error(
        "❌ VITE_SOCKET_URL is not configured.",
      );

      return undefined;
    }

    console.log(
      "🔌 Connecting Live Maps Socket:",
      SOCKET_URL,
    );

    const socket =
      io(
        SOCKET_URL,
        {
          transports: [
            "websocket",
            "polling",
          ],

          reconnection: true,

          reconnectionAttempts:
            Infinity,

          reconnectionDelay:
            1000,

          timeout: 10000,
        },
      );

    socketRef.current =
      socket;

    /* --------------------------------------------------------
       CONNECTED
    -------------------------------------------------------- */

    socket.on(
      "connect",
      () => {
        console.log(
          "🔌 Live Maps Socket connected:",
          socket.id,
        );

        /*
         * Subscribe to current
         * geographic filters.
         */

        socket.emit(
          "live:subscribe",
          {
            cityId:
              selectedCity?.cityId ??
              selectedCity?.id ??
              null,

            zoneId:
              selectedZone?.zoneId ??
              selectedZone?.id ??
              null,

            divisionId:
              selectedDivision?.divisionId ??
              selectedDivision?.id ??
              null,

            wardId:
              selectedWard?.wardId ??
              selectedWard?.id ??
              null,
          },
        );
      },
    );

    /* --------------------------------------------------------
       LIVE HEARTBEAT
    -------------------------------------------------------- */

    socket.on(
      "vehicle:heartbeat",
      (heartbeat) => {
        console.log(
          "📡 LIVE VEHICLE UPDATE:",
          heartbeat,
        );

        if (
          !matchesFilters(
            heartbeat,
          )
        ) {
          return;
        }

        const vehicleId =
          String(
            heartbeat.vehicleId ||
              heartbeat.vehicleNumber ||
              "",
          ).trim();

        if (!vehicleId) {
          return;
        }

        const position =
          gpsPosition(
            heartbeat.latitude,
            heartbeat.longitude,
          );

        if (!position) {
          console.warn(
            "⚠️ Invalid live GPS:",
            heartbeat,
          );

          return;
        }

        const timestamp =
          heartbeat.timestamp
            ? new Date(
                heartbeat.timestamp,
              ).getTime()
            : Date.now();

        setVehicles(
          (current) => {
            const existing =
              current[
                vehicleId
              ];

            /*
             * First update:
             * use the received point.
             */

            const currentLatitude =
              Number.isFinite(
                existing?.latitude,
              )
                ? existing.latitude
                : position[0];

            const currentLongitude =
              Number.isFinite(
                existing?.longitude,
              )
                ? existing.longitude
                : position[1];

            const wasOffline =
              !existing ||
              !existing.online;

            if (
              wasOffline
            ) {
              showToast(
                "Vehicle Online",
                `${vehicleId} is now live.`,
                "success",
              );
            }

            return {
              ...current,

              [vehicleId]: {
                ...(existing ||
                  {}),

                vehicleId,

                vehicleNumber:
                  heartbeat.vehicleNumber ||
                  vehicleId,

                wardNo:
                  heartbeat.wardNo ??
                  existing?.wardNo ??
                  null,

                /*
                 * Current rendered
                 * position.
                 */

                latitude:
                  currentLatitude,

                longitude:
                  currentLongitude,

                /*
                 * Interpolation start.
                 */

                startLatitude:
                  currentLatitude,

                startLongitude:
                  currentLongitude,

                /*
                 * Interpolation target.
                 */

                targetLatitude:
                  position[0],

                targetLongitude:
                  position[1],

                animationStart:
                  performance.now(),

                /*
                 * Normal heartbeat
                 * interval can be handled
                 * smoothly.
                 */

                animationDuration:
                  1500,

                online: true,

                lastUpdate:
                  timestamp,

                routePoints:
                  existing?.routePoints ||
                  [],
              },
            };
          },
        );
      },
    );

    /* --------------------------------------------------------
       SOCKET ERROR
    -------------------------------------------------------- */

    socket.on(
      "connect_error",
      (error) => {
        console.error(
          "❌ Live Maps Socket connection error:",
          error,
        );
      },
    );

    /* --------------------------------------------------------
       SOCKET DISCONNECT
    -------------------------------------------------------- */

    socket.on(
      "disconnect",
      (reason) => {
        console.warn(
          "🔌 Live Maps Socket disconnected:",
          reason,
        );
      },
    );

    /* --------------------------------------------------------
       CLEANUP
    -------------------------------------------------------- */

    return () => {
      socket.off(
        "connect",
      );

      socket.off(
        "vehicle:heartbeat",
      );

      socket.off(
        "connect_error",
      );

      socket.off(
        "disconnect",
      );

      socket.disconnect();

      socketRef.current =
        null;
    };
  }, [
    selectedCity,
    selectedZone,
    selectedDivision,
    selectedWard,
    matchesFilters,
    showToast,
  ]);

  /* ==========================================================
     INITIAL DATA UPDATE
  ========================================================== */

  useEffect(() => {
    setVehicles(
      (current) => {
        const next = {
          ...current,
        };

        initialRoutes.forEach(
          (route) => {
            if (
              !route?.vehicleNumber
            ) {
              return;
            }

            const endpoint =
              route.endPoint;

            if (!endpoint) {
              return;
            }

            const position =
              gpsPosition(
                endpoint.latitude,
                endpoint.longitude,
              );

            if (!position) {
              return;
            }

            const vehicleId =
              String(
                route.vehicleNumber,
              );

            const existing =
              next[
                vehicleId
              ];

            next[
              vehicleId
            ] = {
              ...(existing ||
                {}),

              vehicleId,

              vehicleNumber:
                route.vehicleNumber,

              wardNo:
                route.wardNo ??
                existing?.wardNo ??
                null,

              latitude:
                existing?.latitude ??
                position[0],

              longitude:
                existing?.longitude ??
                position[1],

              startLatitude:
                existing?.startLatitude ??
                position[0],

              startLongitude:
                existing?.startLongitude ??
                position[1],

              targetLatitude:
                existing?.targetLatitude ??
                position[0],

              targetLongitude:
                existing?.targetLongitude ??
                position[1],

              online:
                existing?.online ??
                false,

              lastUpdate:
                existing?.lastUpdate ??
                (
                  endpoint.timestamp
                    ? new Date(
                        endpoint.timestamp,
                      ).getTime()
                    : 0
                ),

              routePoints:
                Array.isArray(
                  route.points,
                )
                  ? route.points
                  : existing?.routePoints ||
                    [],
            };
          },
        );

        return next;
      },
    );
  }, [
    initialRoutes,
  ]);

  /* ==========================================================
     ONLINE / OFFLINE DETECTOR
  ========================================================== */

  useEffect(() => {
    /*
     * Vehicle is considered online
     * when heartbeat age <= 30 sec.
     */

    offlineTimerRef.current =
      setInterval(() => {
        const now =
          Date.now();

        setVehicles(
          (current) => {
            let changed =
              false;

            const next = {
              ...current,
            };

            Object.keys(
              next,
            ).forEach(
              (vehicleId) => {
                const vehicle =
                  next[
                    vehicleId
                  ];

                if (
                  !vehicle
                ) {
                  return;
                }

                const lastUpdate =
                  Number(
                    vehicle.lastUpdate ||
                      0,
                  );

                const age =
                  now -
                  lastUpdate;

                const online =
                  lastUpdate >
                    0 &&
                  age <=
                    30000;

                /*
                 * ONLINE -> OFFLINE
                 */

                if (
                  vehicle.online &&
                  !online
                ) {
                  showToast(
                    "Vehicle Offline",
                    `${vehicleId} has stopped sending live GPS.`,
                    "warning",
                  );
                }

                if (
                  vehicle.online !==
                  online
                ) {
                  changed =
                    true;

                  next[
                    vehicleId
                  ] = {
                    ...vehicle,

                    online,
                  };
                }
              },
            );

            return changed
              ? next
              : current;
          },
        );
      }, 5000);

    return () => {
      if (
        offlineTimerRef.current
      ) {
        clearInterval(
          offlineTimerRef.current,
        );
      }
    };
  }, [
    showToast,
  ]);

  /* ==========================================================
     TOAST CLEANUP
  ========================================================== */

  useEffect(() => {
    return () => {
      if (
        toastTimerRef.current
      ) {
        clearTimeout(
          toastTimerRef.current,
        );
      }
    };
  }, []);

  /* ==========================================================
     SELECTED BOUNDARY
  ========================================================== */

  const selectedBoundary =
    useMemo(
      () =>
        getBoundary(
          selectedCity,
          selectedZone,
          selectedDivision,
          selectedWard,
        ),
      [
        selectedCity,
        selectedZone,
        selectedDivision,
        selectedWard,
      ],
    );

  /* ==========================================================
     MAP CENTER
  ========================================================== */

  const center =
    useMemo(() => {
      /*
       * Boundary first.
       */

      if (
        selectedBoundary
      ) {
        try {
          const layer =
            L.geoJSON(
              selectedBoundary,
            );

          const bounds =
            layer.getBounds();

          if (
            bounds.isValid()
          ) {
            const mapCenter =
              bounds.getCenter();

            return [
              mapCenter.lat,
              mapCenter.lng,
            ];
          }
        } catch {
          // continue
        }
      }

      /*
       * First vehicle.
       */

      const firstVehicle =
        Object.values(
          vehicles,
        )[0];

      if (
        firstVehicle
      ) {
        return [
          firstVehicle.latitude,
          firstVehicle.longitude,
        ];
      }

      /*
       * Bengaluru fallback.
       */

      return [
        12.9716,
        77.5946,
      ];
    }, [
      selectedBoundary,
      vehicles,
    ]);

  /* ==========================================================
     VISIBLE VEHICLES
  ========================================================== */

  const visibleVehicles =
    useMemo(
      () =>
        Object.values(
          vehicles,
        ).filter(
          (vehicle) => {
            /*
             * Ward filter.
             */

            if (
              selectedWard
            ) {
              const selectedWardNo =
                selectedWard.wardNo ??
                selectedWard.ward_no ??
                selectedWard.id ??
                selectedWard.wardId;

              if (
                selectedWardNo !==
                  undefined &&
                selectedWardNo !==
                  null
              ) {
                if (
                  Number(
                    vehicle.wardNo,
                  ) !==
                    Number(
                      selectedWardNo,
                    )
                ) {
                  return false;
                }
              }
            }

            return true;
          },
        ),
      [
        vehicles,
        selectedWard,
      ],
    );

  /* ==========================================================
     ONLINE COUNT
  ========================================================== */

  const onlineCount =
    visibleVehicles.filter(
      (vehicle) =>
        vehicle.online,
    ).length;

  /* ==========================================================
     FILTER DESCRIPTION
  ========================================================== */

  const filterDescription =
    selectedWard?.ward_name ||
    selectedWard?.wardName ||
    selectedDivision?.division_name ||
    selectedDivision?.divisionName ||
    selectedZone?.zone_name ||
    selectedZone?.zoneName ||
    selectedCity?.city_name ||
    selectedCity?.cityName ||
    "All selected areas";

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div
      className="
        relative
        h-full
        min-h-full
        w-full
        overflow-hidden
        bg-[#EEF1F3]
      "
    >
      {/* ======================================================
          MAP
      ====================================================== */}

      <MapContainer
        center={center}
        zoom={14}
        zoomControl
        scrollWheelZoom
        className="
          !h-full
          !min-h-full
          !w-full
        "
      >
        {/* ====================================================
            TILES
        ==================================================== */}

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

        <MapSizeController />

        {/* ====================================================
            BOUNDARY FIT
        ==================================================== */}

        <BoundaryController
          boundary={
            selectedBoundary
          }
        />

        {/* ====================================================
            SELECTED BOUNDARY
        ==================================================== */}

        {selectedBoundary && (
          <GeoJSON
            key={JSON.stringify(
              selectedBoundary,
            )}
            data={
              selectedBoundary
            }
            style={{
              color:
                "#334E68",

              weight: 3,

              opacity: 1,

              fillColor:
                "#94A3B8",

              fillOpacity:
                0.06,

              lineJoin:
                "round",

              lineCap:
                "round",
            }}
          />
        )}

        {/* ====================================================
            VEHICLES
        ==================================================== */}

        {visibleVehicles.map(
          (vehicle) => {
            const position =
              gpsPosition(
                vehicle.latitude,
                vehicle.longitude,
              );

            if (
              !position
            ) {
              return null;
            }

            /*
             * Route trail.
             */

            const routePositions =
              Array.isArray(
                vehicle.routePoints,
              )
                ? vehicle.routePoints
                    .map(
                      (point) =>
                        gpsPosition(
                          point.latitude,
                          point.longitude,
                        ),
                    )
                    .filter(
                      Boolean,
                    )
                : [];

            return (
              <React.Fragment
                key={
                  vehicle.vehicleId
                }
              >
                {/* ==================================================
                    ROUTE TRAIL
                ================================================== */}

                {routePositions.length >
                  1 && (
                  <Polyline
                    positions={
                      routePositions
                    }
                    pathOptions={{
                      color:
                        "#10B981",

                      weight: 4,

                      opacity: 0.45,

                      lineCap:
                        "round",

                      lineJoin:
                        "round",
                    }}
                  />
                )}

                {/* ==================================================
                    VEHICLE MARKER
                ================================================== */}

                <Marker
                  position={
                    position
                  }
                  icon={createVehicleIcon(
                    vehicle.online,
                  )}
                >
                  <Popup>
                    <div className="min-w-[220px]">
                      <div className="mb-2 text-base font-bold text-[#34475B]">
                        Live Vehicle Tracking
                      </div>

                      <div className="text-sm text-[#60758B]">
                        Vehicle:{" "}
                        <strong className="text-[#34475B]">
                          {
                            vehicle.vehicleNumber
                          }
                        </strong>
                      </div>

                      <div className="mt-1 text-sm text-[#60758B]">
                        Ward:{" "}
                        <strong className="text-[#34475B]">
                          {
                            vehicle.wardNo ??
                            "N/A"
                          }
                        </strong>
                      </div>

                      <div className="mt-1 text-sm text-[#60758B]">
                        Status:{" "}
                        <strong
                          className={
                            vehicle.online
                              ? "text-green-600"
                              : "text-red-500"
                          }
                        >
                          {vehicle.online
                            ? "ONLINE"
                            : "OFFLINE"}
                        </strong>
                      </div>

                      <div className="mt-2 border-t border-[#E5EAF0] pt-2 text-xs text-[#8AA1BB]">
                        Latitude:{" "}
                        {Number(
                          vehicle.latitude,
                        ).toFixed(
                          6,
                        )}
                      </div>

                      <div className="text-xs text-[#8AA1BB]">
                        Longitude:{" "}
                        {Number(
                          vehicle.longitude,
                        ).toFixed(
                          6,
                        )}
                      </div>

                      <div className="mt-1 text-xs text-[#8AA1BB]">
                        Last update:{" "}
                        {vehicle.lastUpdate
                          ? new Date(
                              vehicle.lastUpdate,
                            ).toLocaleTimeString()
                          : "N/A"}
                      </div>
                    </div>
                  </Popup>
                </Marker>

                {/* ==================================================
                    LIVE LOCATION DOT
                ================================================== */}

                <CircleMarker
                  center={
                    position
                  }
                  radius={4}
                  pathOptions={{
                    color:
                      "#FFFFFF",

                    weight: 2,

                    fillColor:
                      vehicle.online
                        ? "#22C55E"
                        : "#94A3B8",

                    fillOpacity: 1,
                  }}
                />
              </React.Fragment>
            );
          },
        )}
      </MapContainer>

      {/* ======================================================
          LIVE HEADER
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-4
          top-4
          z-[1000]
        "
      >
        <div
          className="
            rounded-2xl
            border
            border-white/80
            bg-white/95
            px-4
            py-3
            shadow-[0_10px_30px_rgba(30,45,60,0.12)]
            backdrop-blur-xl
          "
        >
          <div className="flex items-center gap-2">
            <span
              className={`
                h-2.5
                w-2.5
                rounded-full
                ${
                  onlineCount >
                  0
                    ? "animate-pulse bg-green-500"
                    : "bg-slate-400"
                }
              `}
            />

            <span className="text-xs font-bold uppercase tracking-wide text-[#60758B]">
              Live Vehicle Tracking
            </span>
          </div>

          <div className="mt-1 text-sm font-semibold text-[#34475B]">
            {onlineCount} online
          </div>

          <div className="mt-1 text-xs text-[#8AA1BB]">
            {filterDescription}
          </div>

          <div className="text-xs text-[#8AA1BB]">
            {selectedDate ||
              "Today"}
          </div>
        </div>
      </div>

      {/* ======================================================
          LIVE SUMMARY
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-4
          left-4
          z-[1000]
        "
      >
        <div
          className="
            rounded-xl
            border
            border-white/80
            bg-white/95
            px-4
            py-3
            shadow-[0_10px_30px_rgba(30,45,60,0.12)]
            backdrop-blur-xl
          "
        >
          <div className="text-[10px] font-bold uppercase tracking-wide text-[#8AA1BB]">
            LIVE
          </div>

          <div className="mt-1 text-sm font-bold text-[#34475B]">
            {visibleVehicles.length}{" "}
            vehicles
          </div>

          <div className="text-xs text-[#8AA1BB]">
            {onlineCount} receiving GPS
          </div>
        </div>
      </div>

      {/* ======================================================
          LIVE TOAST
      ====================================================== */}

      {toast && (
        <div
          className="
            pointer-events-none
            absolute
            right-4
            top-4
            z-[5000]
          "
        >
          <div
            className="
              min-w-[270px]
              rounded-2xl
              border
              border-white/80
              bg-white/95
              px-4
              py-3
              shadow-[0_15px_40px_rgba(30,45,60,0.16)]
              backdrop-blur-xl
            "
          >
            <div className="flex items-start gap-3">
              <div
                className={`
                  mt-0.5
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  ${
                    toast.type ===
                    "warning"
                      ? "bg-amber-100"
                      : "bg-green-100"
                  }
                `}
              >
                🚛
              </div>

              <div>
                <div className="text-sm font-bold text-[#34475B]">
                  {
                    toast.title
                  }
                </div>

                <div className="mt-0.5 text-xs text-[#8AA1BB]">
                  {
                    toast.message
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          EMPTY STATE
      ====================================================== */}

      {visibleVehicles.length ===
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
              rounded-2xl
              border
              border-[#DCE4EC]
              bg-white/95
              px-8
              py-6
              text-center
              shadow-lg
            "
          >
            <div className="text-base font-semibold text-[#34475B]">
              No live vehicles
            </div>

            <div className="mt-1 text-sm text-[#8AA1BB]">
              No vehicles are
              currently sending
              live GPS data for
              the selected filters.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}