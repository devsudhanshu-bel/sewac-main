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

import { useLanguage } from "../../context/LanguageContext";


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
   TRANSLATIONS
============================================================ */

const translations = {
  en: {
    title: "Plant Locations",
    subtitle: "Waste processing plants",
    maximize: "Maximize map",

    loading: "Loading plant locations...",
    error: "Unable to load plants.",
    empty: "No plant locations available",

    unnamedPlant: "Unnamed Plant",
    notAssigned: "Not Assigned",
    zoneUnavailable: "N/A",
    unknownStatus: "UNKNOWN",

    vehicles: "Vehicles",
    tonPerDay: "Ton/Day",

    active: "ACTIVE",
    inactive: "INACTIVE",
  },

  kn: {
    title: "ಸಸ್ಯ ಸ್ಥಳಗಳು",
    subtitle: "ತ್ಯಾಜ್ಯ ಸಂಸ್ಕರಣಾ ಘಟಕಗಳು",
    maximize: "ನಕ್ಷೆಯನ್ನು ದೊಡ್ಡದಾಗಿಸಿ",

    loading: "ಸಸ್ಯ ಸ್ಥಳಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
    error: "ಸಸ್ಯಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
    empty: "ಯಾವುದೇ ಸಸ್ಯ ಸ್ಥಳಗಳು ಲಭ್ಯವಿಲ್ಲ",

    unnamedPlant: "ಹೆಸರಿಲ್ಲದ ಸಸ್ಯ",
    notAssigned: "ನಿಯೋಜಿಸಲಾಗಿಲ್ಲ",
    zoneUnavailable: "ಲಭ್ಯವಿಲ್ಲ",
    unknownStatus: "ಅಜ್ಞಾತ",

    vehicles: "ವಾಹನಗಳು",
    tonPerDay: "ಟನ್/ದಿನ",

    active: "ಸಕ್ರಿಯ",
    inactive: "ನಿಷ್ಕ್ರಿಯ",
  },

  hi: {
    title: "प्लांट स्थान",
    subtitle: "कचरा प्रसंस्करण संयंत्र",
    maximize: "मानचित्र बड़ा करें",

    loading: "प्लांट स्थान लोड हो रहे हैं...",
    error: "प्लांट लोड नहीं हो सके।",
    empty: "कोई प्लांट स्थान उपलब्ध नहीं है",

    unnamedPlant: "अनाम प्लांट",
    notAssigned: "नियुक्त नहीं",
    zoneUnavailable: "उपलब्ध नहीं",
    unknownStatus: "अज्ञात",

    vehicles: "वाहन",
    tonPerDay: "टन/दिन",

    active: "सक्रिय",
    inactive: "निष्क्रिय",
  },
};


/* ============================================================
   LANGUAGE HELPER
============================================================ */

function normalizeLanguage(language) {
  const value =
    String(language || "en")
      .toLowerCase()
      .trim();

  if (
    value === "kn" ||
    value === "kannada"
  ) {
    return "kn";
  }

  if (
    value === "hi" ||
    value === "hindi"
  ) {
    return "hi";
  }

  return "en";
}


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

  /* ==========================================================
     GLOBAL LANGUAGE
  ========================================================== */

  const languageContext =
    useLanguage();

  const currentLanguage =
    normalizeLanguage(
      languageContext?.language ??
      languageContext?.lang ??
      "en"
    );

  const t =
    translations[
      currentLanguage
    ] || translations.en;


  /* ==========================================================
     STATE
  ========================================================== */

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
                t.error
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
              t.error
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
    t.error,
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
                t.unnamedPlant,

              zone:
                plant?.zone ||
                plant?.zone_name ||
                plant?.zoneName ||
                t.zoneUnavailable,

              manager:
                plant?.plant_manager ||
                plant?.plantManager ||
                plant?.manager ||
                t.notAssigned,

              capacity:
                plant?.capacity_ton_per_day ??
                plant?.capacityTonPerDay ??
                plant?.capacity ??
                t.zoneUnavailable,

              vehicles:
                plant?.vehicles_enrolled ??
                plant?.vehiclesEnrolled ??
                plant?.vehicles ??
                0,

              status:
                plant?.status ||
                t.unknownStatus,

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
     RENDER
  ========================================================== */

  return (
    <section
      className="
        w-full
        box-border
        rounded-[14px]
        sm:rounded-[16px]
        md:rounded-[18px]
        border
        border-[#dce4ec]
        bg-white
        p-2
        sm:p-3
        md:p-[14px]
        shadow-[0_4px_18px_rgba(31,45,61,0.05)]
      "
    >

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div
        className="
          mb-2
          sm:mb-3
          flex
          min-w-0
          items-center
          justify-between
          gap-2
          sm:gap-3
        "
      >

        {/* LEFT SIDE */}

        <div
          className="
            flex
            min-w-0
            items-center
            gap-2
            sm:gap-3
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
              rounded-lg
              bg-[#f4f7fa]
              sm:h-10
              sm:w-10
              sm:rounded-xl
            "
          >

            <Factory
              className="
                h-5
                w-5
                text-[#617b98]
                sm:h-[23px]
                sm:w-[23px]
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
                text-[15px]
                font-bold
                leading-tight
                text-[#34475b]
                sm:text-[17px]
                md:text-[19px]
              "
            >
              {t.title}
            </div>


            <div
              className="
                mt-[2px]
                truncate
                text-[9px]
                font-semibold
                leading-tight
                text-[#8aa1bb]
                sm:text-[10px]
                md:text-[11px]
              "
            >
              {t.subtitle}
            </div>

          </div>

        </div>


        {/* MAXIMIZE BUTTON */}

        <button
          type="button"
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-lg
            border
            border-[#dce4ec]
            bg-white
            text-[#52677c]
            transition
            duration-200
            hover:border-[#b8c9d9]
            hover:bg-[#f6f9fb]
            active:scale-95
            sm:h-9
            sm:w-9
            sm:rounded-[10px]
            md:h-[38px]
            md:w-[38px]
          "
          onClick={() => {
            /*
             * Fullscreen behaviour can be added here later.
             */
          }}
          title={t.maximize}
          aria-label={t.maximize}
        >

          <Maximize2
            className="
              h-[15px]
              w-[15px]
              sm:h-[17px]
              sm:w-[17px]
            "
          />

        </button>

      </div>


      {/* ====================================================
          MAP
      ==================================================== */}

      <div
        className="
          relative
          w-full
          overflow-hidden
          rounded-[12px]
          border
          border-[#dce4ec]
          bg-[#eef1f3]
          sm:rounded-[15px]
          md:rounded-[18px]
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
            !h-[380px]
            !w-full
            sm:!h-[450px]
            md:!h-[520px]
            lg:!h-[600px]

            [&_.leaflet-tile-pane]:[filter:saturate(.42)_brightness(1.05)]

            [&_.leaflet-control-zoom]:!ml-2
            [&_.leaflet-control-zoom]:!mt-2
            [&_.leaflet-control-zoom]:overflow-hidden
            [&_.leaflet-control-zoom]:rounded-lg
            [&_.leaflet-control-zoom]:border
            [&_.leaflet-control-zoom]:!border-[#d8e1ea]
            [&_.leaflet-control-zoom]:shadow-[0_3px_12px_rgba(36,53,72,0.08)]

            sm:[&_.leaflet-control-zoom]:!ml-3
            sm:[&_.leaflet-control-zoom]:!mt-3

            [&_.leaflet-control-zoom_a]:!h-7
            [&_.leaflet-control-zoom_a]:!w-7
            [&_.leaflet-control-zoom_a]:!leading-7
            [&_.leaflet-control-zoom_a]:!bg-white
            [&_.leaflet-control-zoom_a]:!text-[16px]
            [&_.leaflet-control-zoom_a]:!text-[#34475b]

            sm:[&_.leaflet-control-zoom_a]:!h-[30px]
            sm:[&_.leaflet-control-zoom_a]:!w-[30px]
            sm:[&_.leaflet-control-zoom_a]:!leading-[30px]
            sm:[&_.leaflet-control-zoom_a]:!text-[17px]

            [&_.leaflet-control-attribution]:!text-[8px]
            sm:[&_.leaflet-control-attribution]:!text-[9px]
            [&_.leaflet-control-attribution]:!bg-white/80
          "
        >

          {/* TILE LAYER */}

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


          {/* MAP SIZE */}

          <MapSizeController />


          {/* ZOOM */}

          <ZoomControl
            position="bottomright"
          />


          {/* FIT MAP */}

          <FitBounds
            plants={
              formattedPlants
            }
          />


          {/* ==================================================
              PLANT MARKERS
          ================================================== */}

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
                  minWidth={250}
                  className="plants-popup"
                >

                  <div
                    className="
                      w-full
                      min-w-[220px]
                      p-1
                      sm:min-w-[250px]
                      sm:p-2
                    "
                  >

                    {/* POPUP HEADER */}

                    <div
                      className="
                        mb-3
                        flex
                        items-center
                        gap-2
                        sm:mb-4
                        sm:gap-3
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
                          rounded-lg
                          bg-violet-100
                          sm:h-12
                          sm:w-12
                          sm:rounded-xl
                        "
                      >

                        <Factory
                          className="
                            h-5
                            w-5
                            text-violet-600
                            sm:h-6
                            sm:w-6
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
                            max-w-[180px]
                            truncate
                            text-[14px]
                            font-bold
                            text-[#1f2937]
                            sm:max-w-[210px]
                            sm:text-[16px]
                          "
                        >
                          {plant.name}
                        </h3>


                        <span
                          className={`
                            text-[10px]
                            font-semibold
                            sm:text-xs
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
                            String(
                              plant.status
                            ).toUpperCase() ===
                            "ACTIVE"
                              ? t.active
                              : t.inactive
                          }

                        </span>

                      </div>

                    </div>


                    {/* POPUP DETAILS */}

                    <div
                      className="
                        space-y-2
                        text-[11px]
                        text-[#34475b]
                        sm:space-y-3
                        sm:text-[13px]
                      "
                    >

                      {/* ZONE */}

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                        "
                      >

                        <MapPinned
                          className="
                            h-[14px]
                            w-[14px]
                            shrink-0
                            text-violet-600
                            sm:h-4
                            sm:w-4
                          "
                        />

                        <span
                          className="
                            min-w-0
                            break-words
                          "
                        >
                          {plant.zone}
                        </span>

                      </div>


                      {/* MANAGER */}

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                        "
                      >

                        <User
                          className="
                            h-[14px]
                            w-[14px]
                            shrink-0
                            text-violet-600
                            sm:h-4
                            sm:w-4
                          "
                        />

                        <span
                          className="
                            min-w-0
                            break-words
                          "
                        >
                          {plant.manager}
                        </span>

                      </div>


                      {/* VEHICLES */}

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                        "
                      >

                        <Truck
                          className="
                            h-[14px]
                            w-[14px]
                            shrink-0
                            text-violet-600
                            sm:h-4
                            sm:w-4
                          "
                        />

                        <span>
                          {plant.vehicles}{" "}
                          {t.vehicles}
                        </span>

                      </div>


                      {/* CAPACITY */}

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                        "
                      >

                        <Factory
                          className="
                            h-[14px]
                            w-[14px]
                            shrink-0
                            text-violet-600
                            sm:h-4
                            sm:w-4
                          "
                        />

                        <span>
                          {plant.capacity}{" "}
                          {t.tonPerDay}
                        </span>

                      </div>


                      {/* COORDINATES */}

                      <div
                        className="
                          flex
                          items-start
                          gap-2
                        "
                      >

                        <MapPinned
                          className="
                            mt-[1px]
                            h-[14px]
                            w-[14px]
                            shrink-0
                            text-violet-600
                            sm:h-4
                            sm:w-4
                          "
                        />

                        <span
                          className="
                            break-all
                          "
                        >
                          {plant.latitude},{" "}
                          {plant.longitude}
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

          <div
            className="
              absolute
              left-1/2
              top-1/2
              z-[2000]
              max-w-[calc(100%-32px)]
              -translate-x-1/2
              -translate-y-1/2
              rounded-xl
              border
              border-[#dce4ec]
              bg-white/95
              px-4
              py-3
              text-center
              text-[11px]
              font-semibold
              text-[#667b91]
              shadow-[0_10px_30px_rgba(30,45,60,0.10)]
              sm:px-5
              sm:text-xs
            "
          >
            {t.loading}
          </div>

        )}


        {/* ====================================================
            ERROR
        ==================================================== */}

        {!plantsLoading &&
          plantsError &&
          formattedPlants.length ===
            0 && (

          <div
            className="
              absolute
              left-1/2
              top-1/2
              z-[2000]
              max-w-[calc(100%-32px)]
              -translate-x-1/2
              -translate-y-1/2
              rounded-xl
              border
              border-[#dce4ec]
              bg-white/95
              px-4
              py-3
              text-center
              text-[11px]
              font-semibold
              text-[#667b91]
              shadow-[0_10px_30px_rgba(30,45,60,0.10)]
              sm:px-5
              sm:text-xs
            "
          >
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

          <div
            className="
              absolute
              left-1/2
              top-1/2
              z-[2000]
              max-w-[calc(100%-32px)]
              -translate-x-1/2
              -translate-y-1/2
              rounded-xl
              border
              border-[#dce4ec]
              bg-white/95
              px-4
              py-3
              text-center
              text-[11px]
              font-semibold
              text-[#667b91]
              shadow-[0_10px_30px_rgba(30,45,60,0.10)]
              sm:px-5
              sm:text-xs
            "
          >
            {t.empty}
          </div>

        )}

      </div>

    </section>
  );
}