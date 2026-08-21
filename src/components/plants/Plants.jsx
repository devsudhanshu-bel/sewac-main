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

import { useLanguage } from "../../i18n";


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

function FitBounds({
  plants,
}) {
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

    const bounds =
      L.latLngBounds(
        plants.map(
          (plant) =>
            plant.position
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

  /* ==========================================================
     LANGUAGE
  ========================================================== */

  const {
    t,
  } = useLanguage();


  /* ==========================================================
     STATE
  ========================================================== */

  const [
    fetchedPlants,
    setFetchedPlants,
  ] = useState([]);

  const [
    plantsLoading,
    setPlantsLoading,
  ] = useState(false);

  const [
    plantsError,
    setPlantsError,
  ] = useState("");

  const abortRef =
    useRef(null);


  /* ==========================================================
     FETCH PLANTS WHEN PARENT DATA IS NOT PROVIDED
  ========================================================== */

  useEffect(() => {

    /*
     * If CityMapOverview already supplied plants,
     * use those and do not make another request.
     */

    if (
      Array.isArray(
        incomingPlants
      ) &&
      incomingPlants.length > 0
    ) {

      setFetchedPlants([]);

      setPlantsError("");

      setPlantsLoading(false);

      return;
    }


    /*
     * Parent supplied no plant data.
     * Fetch directly from the plants endpoint.
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


          if (
            !response.ok
          ) {

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
                t(
                  "plants.errors.serverConnection",
                  "Unable to fetch plants."
                )
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
              t(
                "plants.errors.serverConnection",
                "Unable to load plants."
              )
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
    t,
  ]);


  /* ==========================================================
     FINAL PLANT DATA
  ========================================================== */

  const plants =
    Array.isArray(
      incomingPlants
    ) &&
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
          (
            plant,
            index
          ) => {

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
                t(
                  "plants.map.unnamedPlant",
                  "Unnamed Plant"
                ),

              zone:
                plant?.zone ||
                plant?.zone_name ||
                plant?.zoneName ||
                "N/A",

              manager:
                plant?.plant_manager ||
                plant?.plantManager ||
                plant?.manager ||
                t(
                  "plants.map.notAssigned",
                  "Not Assigned"
                ),

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
      t,
    ]);


  /* ==========================================================
     STATUS HELPER
  ========================================================== */

  const getStatusLabel =
    (status) => {

      const normalized =
        String(
          status || ""
        )
          .trim()
          .toUpperCase();


      if (
        normalized ===
        "ACTIVE"
      ) {

        return t(
          "common.active",
          "Active"
        );

      }


      if (
        normalized ===
        "INACTIVE"
      ) {

        return t(
          "common.inactive",
          "Inactive"
        );

      }


      return status ||
        t(
          "plants.map.unknown",
          "Unknown"
        );
    };


  /* ==========================================================
     RENDER
  ========================================================== */

  return (

    <section
      className="
        mt-8
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-[#DCE4EC]
        bg-white
        shadow-sm
        box-border
      "
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          flex
          min-h-[76px]
          w-full
          items-center
          justify-between
          gap-4
          px-4
          py-3
          sm:px-5
          md:px-6
        "
      >

        {/* LEFT */}

        <div
          className="
            flex
            min-w-0
            items-center
            gap-3
          "
        >

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-[#F2F6FA]
              sm:h-11
              sm:w-11
            "
          >

            <Factory
              className="
                h-6
                w-6
                text-[#617B98]
                sm:h-7
                sm:w-7
              "
              strokeWidth={1.8}
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
                text-[16px]
                font-bold
                leading-tight
                text-[#34475B]
                sm:text-[18px]
                md:text-[19px]
              "
            >

              {t(
                "plants.map.title",
                "Plant Locations"
              )}

            </div>


            <div
              className="
                mt-1
                truncate
                text-[10px]
                font-semibold
                leading-tight
                text-[#8AA1BB]
                sm:text-[11px]
              "
            >

              {t(
                "plants.map.subtitle",
                "Waste processing plants"
              )}

            </div>

          </div>

        </div>


        {/* MAXIMIZE */}

        <button
          type="button"
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-lg
            border
            border-[#DCE4EC]
            bg-white
            text-[#52677C]
            transition
            hover:border-[#B8C9D9]
            hover:bg-[#F6F9FB]
            active:scale-95
            sm:h-10
            sm:w-10
          "
          onClick={() => {
            /*
             * Fullscreen behaviour can be added later.
             */
          }}
          title={t(
            "plants.map.maximize",
            "Maximize map"
          )}
          aria-label={t(
            "plants.map.maximize",
            "Maximize map"
          )}
        >

          <Maximize2
            size={17}
          />

        </button>

      </div>


      {/* =====================================================
          MAP
      ===================================================== */}

      <div
        className="
          relative
          h-[430px]
          w-full
          overflow-hidden
          rounded-b-2xl
          border-t
          border-[#DCE4EC]
          bg-[#EEF1F3]
          sm:h-[500px]
          md:h-[560px]
          lg:h-[600px]
        "
      >

        <MapContainer
          center={[
            13.0358,
            77.597,
          ]}
          zoom={13}
          zoomControl={false}
          className="
            !h-full
            !w-full
          "
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


          {/* =================================================
              PLANT MARKERS
          ================================================= */}

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
                  maxWidth={320}
                  minWidth={260}
                >

                  <div
                    className="
                      w-full
                      max-w-[290px]
                      p-1
                    "
                  >

                    {/* =======================================
                        POPUP HEADER
                    ======================================== */}

                    <div
                      className="
                        mb-4
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

                        <Factory
                          size={23}
                          className="
                            text-violet-600
                          "
                        />

                      </div>


                      <div
                        className="
                          min-w-0
                        "
                      >

                        <h3
                          className="
                            truncate
                            text-[15px]
                            font-bold
                            text-[#172033]
                          "
                        >

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
                            getStatusLabel(
                              plant.status
                            )
                          }

                        </span>

                      </div>

                    </div>


                    {/* =======================================
                        POPUP DETAILS
                    ======================================== */}

                    <div
                      className="
                        space-y-3
                        text-[12px]
                        sm:text-[13px]
                      "
                    >

                      {/* ZONE */}

                      <div
                        className="
                          flex
                          min-w-0
                          items-center
                          gap-2
                        "
                      >

                        <MapPinned
                          size={16}
                          className="
                            shrink-0
                            text-violet-600
                          "
                        />

                        <span
                          className="
                            min-w-0
                            truncate
                            text-[#34475B]
                          "
                        >

                          {
                            plant.zone
                          }

                        </span>

                      </div>


                      {/* MANAGER */}

                      <div
                        className="
                          flex
                          min-w-0
                          items-center
                          gap-2
                        "
                      >

                        <User
                          size={16}
                          className="
                            shrink-0
                            text-violet-600
                          "
                        />

                        <span
                          className="
                            min-w-0
                            truncate
                            text-[#34475B]
                          "
                        >

                          {
                            plant.manager
                          }

                        </span>

                      </div>


                      {/* VEHICLES */}

                      <div
                        className="
                          flex
                          min-w-0
                          items-center
                          gap-2
                        "
                      >

                        <Truck
                          size={16}
                          className="
                            shrink-0
                            text-violet-600
                          "
                        />

                        <span
                          className="
                            min-w-0
                            truncate
                            text-[#34475B]
                          "
                        >

                          {
                            plant.vehicles
                          }{" "}

                          {t(
                            "plants.map.vehicles",
                            "Vehicles"
                          )}

                        </span>

                      </div>


                      {/* CAPACITY */}

                      <div
                        className="
                          flex
                          min-w-0
                          items-center
                          gap-2
                        "
                      >

                        <Factory
                          size={16}
                          className="
                            shrink-0
                            text-violet-600
                          "
                        />

                        <span
                          className="
                            min-w-0
                            truncate
                            text-[#34475B]
                          "
                        >

                          {
                            plant.capacity
                          }{" "}

                          {t(
                            "plants.map.tonPerDay",
                            "Ton/Day"
                          )}

                        </span>

                      </div>


                      {/* COORDINATES */}

                      <div
                        className="
                          flex
                          min-w-0
                          items-start
                          gap-2
                        "
                      >

                        <MapPinned
                          size={16}
                          className="
                            mt-0.5
                            shrink-0
                            text-violet-600
                          "
                        />

                        <span
                          className="
                            break-all
                            text-[#34475B]
                          "
                        >

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


        {/* =====================================================
            LOADING
        ===================================================== */}

        {plantsLoading &&
          formattedPlants.length === 0 && (

            <div
              className="
                absolute
                inset-0
                z-[2000]
                flex
                items-center
                justify-center
                bg-white/40
                p-4
              "
            >

              <div
                className="
                  max-w-[calc(100%-32px)]
                  rounded-xl
                  border
                  border-[#DCE4EC]
                  bg-white/95
                  px-4
                  py-3
                  text-center
                  text-[11px]
                  font-semibold
                  text-[#667B91]
                  shadow-[0_10px_30px_rgba(30,45,60,0.10)]
                  sm:px-5
                  sm:text-xs
                "
              >

                {t(
                  "plants.map.loading",
                  "Loading plant locations..."
                )}

              </div>

            </div>

        )}


        {/* =====================================================
            ERROR
        ===================================================== */}

        {!plantsLoading &&
          plantsError &&
          formattedPlants.length === 0 && (

            <div
              className="
                absolute
                inset-0
                z-[2000]
                flex
                items-center
                justify-center
                p-4
              "
            >

              <div
                className="
                  max-w-[calc(100%-32px)]
                  rounded-xl
                  border
                  border-[#DCE4EC]
                  bg-white/95
                  px-4
                  py-3
                  text-center
                  text-[11px]
                  font-semibold
                  text-red-500
                  shadow-[0_10px_30px_rgba(30,45,60,0.10)]
                  sm:px-5
                  sm:text-xs
                "
              >

                {plantsError}

              </div>

            </div>

        )}


        {/* =====================================================
            EMPTY STATE
        ===================================================== */}

        {!plantsLoading &&
          !plantsError &&
          formattedPlants.length === 0 && (

            <div
              className="
                absolute
                inset-0
                z-[1900]
                flex
                items-center
                justify-center
                p-4
              "
            >

              <div
                className="
                  max-w-[calc(100%-32px)]
                  rounded-xl
                  border
                  border-[#DCE4EC]
                  bg-white/95
                  px-4
                  py-3
                  text-center
                  text-[11px]
                  font-semibold
                  text-[#667B91]
                  shadow-[0_10px_30px_rgba(30,45,60,0.10)]
                  sm:px-5
                  sm:text-xs
                "
              >

                {t(
                  "plants.map.empty",
                  "No plant locations available"
                )}

              </div>

            </div>

        )}

      </div>

    </section>
  );
}