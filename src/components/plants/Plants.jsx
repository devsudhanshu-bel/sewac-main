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

import {
  Maximize2,
  Factory,
  Truck,
  User,
  MapPinned,
} from "lucide-react";

import "leaflet/dist/leaflet.css";

import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";


/* ============================================================
   CONFIGURATION
============================================================ */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5002";

const PLANTS_ENDPOINT =
  `${API_BASE_URL}/api/plants`;


/* ============================================================
   LEAFLET DEFAULT MARKER ICON
============================================================ */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


/* ============================================================
   EXTRACT PLANTS FROM API RESPONSE
============================================================ */

function extractPlants(result) {
  if (Array.isArray(result)) {
    return result;
  }

  if (Array.isArray(result?.plants)) {
    return result.plants;
  }

  if (Array.isArray(result?.data)) {
    return result.data;
  }

  if (Array.isArray(result?.data?.plants)) {
    return result.data.plants;
  }

  if (Array.isArray(result?.items)) {
    return result.items;
  }

  if (Array.isArray(result?.data?.items)) {
    return result.data.items;
  }

  if (Array.isArray(result?.rows)) {
    return result.rows;
  }

  if (Array.isArray(result?.data?.rows)) {
    return result.data.rows;
  }

  return [];
}


/* ============================================================
   COORDINATE HELPERS
============================================================ */

function getLatitude(plant) {
  return (
    plant?.latitude ??
    plant?.lat ??
    plant?.location?.latitude ??
    plant?.location?.lat ??
    null
  );
}


function getLongitude(plant) {
  return (
    plant?.longitude ??
    plant?.lng ??
    plant?.lon ??
    plant?.location?.longitude ??
    plant?.location?.lng ??
    plant?.location?.lon ??
    null
  );
}


/* ============================================================
   FIT MAP TO PLANTS
============================================================ */

function FitBounds({ plants }) {
  const map = useMap();

  useEffect(() => {
    if (!plants.length) {
      return;
    }

    if (plants.length === 1) {
      map.setView(
        plants[0].position,
        15
      );

      return;
    }

    const bounds = L.latLngBounds(
      plants.map(
        (plant) => plant.position
      )
    );

    if (!bounds.isValid()) {
      return;
    }

    map.fitBounds(
      bounds,
      {
        padding: [
          60,
          60,
        ],
      }
    );

  }, [
    plants,
    map,
  ]);

  return null;
}


/* ============================================================
   MAP SIZE CONTROLLER
============================================================ */

function MapSizeController() {
  const map = useMap();

  useEffect(() => {

    const timers = [
      setTimeout(
        () => map.invalidateSize(),
        100
      ),

      setTimeout(
        () => map.invalidateSize(),
        500
      ),

      setTimeout(
        () => map.invalidateSize(),
        1000
      ),
    ];


    const handleResize = () => {
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
   MAIN COMPONENT
============================================================ */

export default function Plants({
  plants: incomingPlants = [],
}) {

  const [fetchedPlants, setFetchedPlants] =
    useState([]);

  const [plantsLoading, setPlantsLoading] =
    useState(false);

  const [plantsError, setPlantsError] =
    useState("");

  const abortRef =
    useRef(null);


  /* ==========================================================
     USE PARENT DATA WHEN AVAILABLE.
     OTHERWISE FETCH DIRECTLY.
  ========================================================== */

  useEffect(() => {

    /*
     * If CityMapOverview already supplied plants,
     * use those and do not make another request.
     */

    if (
      Array.isArray(incomingPlants) &&
      incomingPlants.length > 0
    ) {
      setFetchedPlants([]);
      setPlantsError("");
      setPlantsLoading(false);

      return;
    }


    /*
     * Parent supplied no plant data.
     * Fetch the same endpoint used by the Plants page.
     */

    abortRef.current?.abort();

    const controller =
      new AbortController();

    abortRef.current =
      controller;

    const loadPlants =
      async () => {

        try {

          setPlantsLoading(true);
          setPlantsError("");

          console.log(
            "🌱 PLANTS MAP REQUEST:",
            PLANTS_ENDPOINT
          );

          const response =
            await fetch(
              PLANTS_ENDPOINT,
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

          if (!response.ok) {
            throw new Error(
              `Plants request failed with status ${response.status}`
            );
          }

          const result =
            await response.json();

          console.log(
            "🌱 PLANTS MAP RESPONSE:",
            result
          );

          if (
            result?.success ===
            false
          ) {
            throw new Error(
              result.message ||
                "Unable to fetch plants."
            );
          }

          const loadedPlants =
            extractPlants(
              result
            );

          console.log(
            "🌱 PLANTS MAP LOADED:",
            loadedPlants.length
          );

          if (
            loadedPlants.length > 0
          ) {
            console.log(
              "🌱 FIRST PLANT:",
              loadedPlants[0]
            );
          }

          setFetchedPlants(
            loadedPlants
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
            "❌ PLANTS MAP ERROR:",
            requestError
          );

          setFetchedPlants(
            []
          );

          setPlantsError(
            requestError?.message ||
              "Unable to load plants."
          );

        } finally {

          if (
            !controller.signal.aborted
          ) {
            setPlantsLoading(
              false
            );
          }

        }

      };


    loadPlants();


    return () => {

      controller.abort();

    };

  }, [
    incomingPlants,
  ]);


  /* ==========================================================
     FINAL PLANT DATA
  ========================================================== */

  const plants =
    Array.isArray(incomingPlants) &&
    incomingPlants.length > 0
      ? incomingPlants
      : fetchedPlants;


  /* ==========================================================
     FORMAT PLANT DATA
  ========================================================== */

  const formattedPlants =
    useMemo(() => {

      return plants

        .filter(
          (plant) => {

            const latitude =
              Number(
                getLatitude(
                  plant
                )
              );

            const longitude =
              Number(
                getLongitude(
                  plant
                )
              );

            return (
              Number.isFinite(
                latitude
              ) &&
              Number.isFinite(
                longitude
              ) &&
              latitude >= -90 &&
              latitude <= 90 &&
              longitude >= -180 &&
              longitude <= 180 &&
              !(
                latitude === 0 &&
                longitude === 0
              )
            );

          }
        )

        .map(
          (plant, index) => {

            const latitude =
              Number(
                getLatitude(
                  plant
                )
              );

            const longitude =
              Number(
                getLongitude(
                  plant
                )
              );

            return {

              id:
                plant?.id ??
                `plant-${index}`,

              name:
                plant?.plant_name ||
                plant?.plantName ||
                plant?.name ||
                "Unnamed Plant",

              zone:
                plant?.zone ||
                plant?.zone_name ||
                plant?.zoneName ||
                "N/A",

              manager:
                plant?.plant_manager ||
                plant?.plantManager ||
                plant?.manager ||
                "Not Assigned",

              capacity:
                plant?.capacity_ton_per_day ??
                plant?.capacityTonPerDay ??
                plant?.capacity ??
                "N/A",

              vehicles:
                plant?.vehicles_enrolled ??
                plant?.vehiclesEnrolled ??
                plant?.vehicles ??
                0,

              status:
                plant?.status ||
                "UNKNOWN",

              position: [
                latitude,
                longitude,
              ],

              latitude,
              longitude,

            };

          }
        );

    }, [
      plants,
    ]);


  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <section className="plants-wrapper">

      <style>{`

        .plants-wrapper {
          width: 100%;
          background: #ffffff;
          border: 1px solid #dce4ec;
          border-radius: 18px;
          padding: 14px;
          box-sizing: border-box;
          box-shadow:
            0 4px 18px
            rgba(31,45,61,.05);
        }


        .plants-heading {
          margin:
            0 0 10px 2px;

          font-size:
            21px;

          line-height:
            1.15;

          font-weight:
            700;

          letter-spacing:
            -.3px;

          color:
            #07111f;
        }


        .plants-map-shell {
          position:
            relative;

          width:
            100%;

          height:
            600px;

          min-height:
            600px;

          overflow:
            hidden;

          border:
            1px solid
            #dce4ec;

          border-radius:
            18px;

          background:
            #eef1f3;
        }


        .plants-map,
        .plants-map
        .leaflet-container {
          width:
            100%;

          height:
            100%;
        }


        .plants-map
        .leaflet-tile-pane {
          filter:
            saturate(.42)
            brightness(1.05);
        }


        .plants-map
        .leaflet-control-zoom {
          margin-top:
            12px;

          margin-left:
            12px;

          border:
            1px solid
            #d8e1ea;

          border-radius:
            8px;

          overflow:
            hidden;

          box-shadow:
            0 3px 12px
            rgba(36,53,72,.08);
        }


        .plants-map
        .leaflet-control-zoom a {
          width:
            30px;

          height:
            30px;

          line-height:
            30px;

          font-size:
            17px;

          color:
            #34475b;

          background:
            #ffffff;
        }


        .plants-map
        .leaflet-control-attribution {
          font-size:
            9px;

          background:
            rgba(
              255,
              255,
              255,
              .82
            );
        }


        .plants-header {
          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          margin-bottom:
            14px;
        }


        .plants-header-left {
          display:
            flex;

          align-items:
            center;

          gap:
            10px;
        }


        .plants-header-icon {
          width:
            27px;

          height:
            27px;

          color:
            #617b98;
        }


        .plants-header-title {
          font-size:
            19px;

          font-weight:
            700;

          line-height:
            1.1;

          color:
            #34475b;
        }


        .plants-header-subtitle {
          margin-top:
            3px;

          font-size:
            11px;

          font-weight:
            600;

          color:
            #8aa1bb;
        }


        .plants-maximize-button {
          width:
            38px;

          height:
            38px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          border:
            1px solid
            #dce4ec;

          border-radius:
            10px;

          background:
            #ffffff;

          color:
            #52677c;

          cursor:
            pointer;

          transition:
            .2s ease;
        }


        .plants-maximize-button:hover {
          background:
            #f6f9fb;

          border-color:
            #b8c9d9;
        }


        .plants-empty {
          position:
            absolute;

          z-index:
            2000;

          top:
            50%;

          left:
            50%;

          transform:
            translate(
              -50%,
              -50%
            );

          padding:
            14px 20px;

          background:
            rgba(
              255,
              255,
              255,
              .96
            );

          border:
            1px solid
            #dce4ec;

          border-radius:
            12px;

          box-shadow:
            0 10px 30px
            rgba(
              30,
              45,
              60,
              .10
            );

          color:
            #667b91;

          font-size:
            12px;

          font-weight:
            600;

          white-space:
            nowrap;
        }


        .plants-loading {
          position:
            absolute;

          z-index:
            2100;

          top:
            50%;

          left:
            50%;

          transform:
            translate(
              -50%,
              -50%
            );

          padding:
            14px 20px;

          background:
            rgba(
              255,
              255,
              255,
              .96
            );

          border:
            1px solid
            #dce4ec;

          border-radius:
            12px;

          box-shadow:
            0 10px 30px
            rgba(
              30,
              45,
              60,
              .10
            );

          color:
            #667b91;

          font-size:
            12px;

          font-weight:
            600;

          white-space:
            nowrap;
        }


        @media (
          max-width: 800px
        ) {

          .plants-wrapper {
            padding:
              10px;
          }


          .plants-heading {
            font-size:
              19px;
          }


          .plants-map-shell {
            height:
              500px;

            min-height:
              500px;
          }


          .plants-header-title {
            font-size:
              17px;
          }


          .plants-header-subtitle {
            font-size:
              10px;
          }

        }

      `}</style>


      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="plants-header">

        <div className="plants-header-left">

          <Factory
            className="plants-header-icon"
            strokeWidth={1.8}
          />

          <div>

            <div className="plants-header-title">
              Plant Locations
            </div>

            <div className="plants-header-subtitle">
              Waste processing plants
            </div>

          </div>

        </div>


        <button
          type="button"
          className="plants-maximize-button"
          onClick={() => {
            /*
             * Fullscreen behaviour can be added here later.
             */
          }}
          title="Maximize map"
        >

          <Maximize2
            size={17}
          />

        </button>

      </div>


      {/* ====================================================
          MAP
      ==================================================== */}

      <div className="plants-map-shell">

        <MapContainer
          center={[
            13.0358,
            77.597,
          ]}
          zoom={13}
          zoomControl={false}
          className="plants-map"
        >

          <TileLayer
            attribution="&copy; OpenStreetMap contributors &copy; CARTO"
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            subdomains={[
              "a",
              "b",
              "c",
              "d",
            ]}
            maxZoom={20}
          />


          <MapSizeController />

          <ZoomControl
            position="bottomright"
          />

          <FitBounds
            plants={
              formattedPlants
            }
          />


          {formattedPlants.map(
            (plant) => (

              <Marker
                key={
                  plant.id
                }
                position={
                  plant.position
                }
              >

                <Popup
                  maxWidth={300}
                  minWidth={270}
                >

                  <div className="p-2">

                    <div className="flex items-center gap-3 mb-4">

                      <div className="
                        w-12
                        h-12
                        rounded-xl
                        bg-violet-100
                        flex
                        items-center
                        justify-center
                      ">

                        <Factory
                          size={24}
                          className="text-violet-600"
                        />

                      </div>


                      <div>

                        <h3 className="
                          font-bold
                          text-[16px]
                        ">

                          {
                            plant.name
                          }

                        </h3>


                        <span
                          className={`
                            text-xs
                            font-semibold
                            ${
                              String(
                                plant.status
                              ).toUpperCase() ===
                              "ACTIVE"
                                ? "text-green-600"
                                : "text-red-500"
                            }
                          `}
                        >

                          ●{" "}
                          {
                            plant.status
                          }

                        </span>

                      </div>

                    </div>


                    <div className="
                      space-y-3
                      text-[13px]
                    ">

                      <div className="
                        flex
                        items-center
                        gap-2
                      ">

                        <MapPinned
                          size={16}
                          className="text-violet-600"
                        />

                        <span>
                          {
                            plant.zone
                          }
                        </span>

                      </div>


                      <div className="
                        flex
                        items-center
                        gap-2
                      ">

                        <User
                          size={16}
                          className="text-violet-600"
                        />

                        <span>
                          {
                            plant.manager
                          }
                        </span>

                      </div>


                      <div className="
                        flex
                        items-center
                        gap-2
                      ">

                        <Truck
                          size={16}
                          className="text-violet-600"
                        />

                        <span>
                          {
                            plant.vehicles
                          }{" "}
                          Vehicles
                        </span>

                      </div>


                      <div className="
                        flex
                        items-center
                        gap-2
                      ">

                        <Factory
                          size={16}
                          className="text-violet-600"
                        />

                        <span>
                          {
                            plant.capacity
                          }{" "}
                          Ton/Day
                        </span>

                      </div>


                      <div className="
                        flex
                        items-center
                        gap-2
                      ">

                        <MapPinned
                          size={16}
                          className="text-violet-600"
                        />

                        <span>
                          {
                            plant.latitude
                          }
                          ,{" "}
                          {
                            plant.longitude
                          }
                        </span>

                      </div>

                    </div>

                  </div>

                </Popup>

              </Marker>

            )
          )}

        </MapContainer>


        {/* ====================================================
            LOADING
        ==================================================== */}

        {plantsLoading &&
          formattedPlants.length ===
            0 && (

          <div className="plants-loading">
            Loading plant locations...
          </div>

        )}


        {/* ====================================================
            ERROR
        ==================================================== */}

        {!plantsLoading &&
          plantsError &&
          formattedPlants.length ===
            0 && (

          <div className="plants-empty">
            {plantsError}
          </div>

        )}


        {/* ====================================================
            EMPTY STATE
        ==================================================== */}

        {!plantsLoading &&
          !plantsError &&
          formattedPlants.length ===
            0 && (

          <div className="plants-empty">
            No plant locations available
          </div>

        )}

      </div>

    </section>
  );
}