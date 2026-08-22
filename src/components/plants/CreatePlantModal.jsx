import {
  X,
  MapPin,
  ChevronDown,
  Loader2,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import { useCallback, useEffect, useState } from "react";

import "leaflet/dist/leaflet.css";

import api from "../../api/axios";
import { useLanguage } from "../../i18n";

/* =========================================================
   DEFAULT LOCATION
========================================================= */

const DEFAULT_LOCATION = [12.9716, 77.5946];

/* =========================================================
   API BASE URL
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5002";

/* =========================================================
   EXACT SEWAC LOCATION ENDPOINTS
========================================================= */

/*
 * City list
 */
const CITIES_ENDPOINT =
  `${API_BASE_URL}/api/master-citizen/cities`;

/*
 * Complete city map.
 *
 * This is the SAME city map endpoint used by the
 * existing SEWAC map/header hierarchy.
 */
const CITY_MAP_ENDPOINT = (cityId) =>
  `${API_BASE_URL}/api/master-citizen/map/city/${encodeURIComponent(
    cityId
  )}`;

/*
 * Zone → Division
 *
 * IMPORTANT:
 * The existing SEWAC logic uses zoneTableName.
 */
const ZONE_DIVISIONS_ENDPOINT = (
  zoneTableName
) =>
  `${API_BASE_URL}/api/master-citizen/map/zone/${encodeURIComponent(
    zoneTableName
  )}/divisions`;

/*
 * Division → Ward
 *
 * IMPORTANT:
 * The existing SEWAC logic uses divisionTableName.
 */
const DIVISION_WARDS_ENDPOINT = (
  divisionTableName
) =>
  `${API_BASE_URL}/api/master-citizen/map/division/${encodeURIComponent(
    divisionTableName
  )}/wards`;

/* =========================================================
   HELPERS
========================================================= */

const extractArray = (
  result,
  key
) => {
  if (Array.isArray(result?.[key])) {
    return result[key];
  }

  if (Array.isArray(result?.data?.[key])) {
    return result.data[key];
  }

  if (Array.isArray(result?.data)) {
    return result.data;
  }

  if (Array.isArray(result)) {
    return result;
  }

  return [];
};

/* =========================================================
   CITY HELPERS
========================================================= */

const getCityId = (city) =>
  city?.cityId ??
  city?.city_id ??
  city?.id ??
  city?.value ??
  null;

const getCityName = (city) =>
  city?.cityName ??
  city?.city_name ??
  city?.name ??
  city?.label ??
  "";

/* =========================================================
   ZONE HELPERS
========================================================= */

const getZoneName = (zone) =>
  zone?.zoneName ??
  zone?.zone_name ??
  zone?.name ??
  zone?.label ??
  "";

const getZoneTableName = (zone) =>
  zone?.zoneTableName ??
  zone?.zone_table_name ??
  zone?.tableName ??
  zone?.table_name ??
  "";

/* =========================================================
   DIVISION HELPERS
========================================================= */

const getDivisionName = (
  division
) =>
  division?.divisionName ??
  division?.division_name ??
  division?.name ??
  division?.label ??
  "";

const getDivisionTableName = (
  division
) =>
  division?.divisionTableName ??
  division?.division_table_name ??
  division?.tableName ??
  division?.table_name ??
  "";

/* =========================================================
   WARD HELPERS
========================================================= */

const getWardName = (ward) =>
  ward?.wardName ??
  ward?.ward_name ??
  ward?.name ??
  ward?.label ??
  ward?.wardNo ??
  ward?.ward_no ??
  "";

/* =========================================================
   PURPLE PLANT MARKER
========================================================= */

const plantIcon = L.divIcon({
  className:
    "plant-location-marker",

  html: `
    <div
      style="
        width: 38px;
        height: 38px;
        border-radius: 50% 50% 50% 0;
        background: #7c3aed;
        border: 3px solid white;
        box-shadow: 0 3px 10px rgba(0,0,0,0.30);
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
      "
    >
      <div
        style="
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
        "
      ></div>
    </div>
  `,

  iconSize: [
    38,
    38,
  ],

  iconAnchor: [
    19,
    38,
  ],
});

/* =========================================================
   MAP CLICK HANDLER
========================================================= */

function LocationSelector({
  onSelect,
}) {
  useMapEvents({
    click(e) {
      onSelect([
        e.latlng.lat,
        e.latlng.lng,
      ]);
    },
  });

  return null;
}

/* =========================================================
   MAP CENTER CONTROLLER
========================================================= */

function MapCenterController({
  position,
}) {
  const map = useMap();

  useEffect(() => {
    if (
      Array.isArray(position) &&
      position.length === 2 &&
      Number.isFinite(position[0]) &&
      Number.isFinite(position[1])
    ) {
      map.setView(
        position,
        map.getZoom(),
        {
          animate: true,
        }
      );

      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  }, [
    position,
    map,
  ]);

  return null;
}

/* =========================================================
   DROPDOWN COMPONENT
========================================================= */

function LocationDropdown({
  label,
  value,
  placeholder,
  options,
  disabled,
  loading,
  onChange,
  noOptionsText,
}) {
  return (
    <div className="min-w-0">
      <label
        className="
          mb-2
          block
          text-[12px]
          sm:text-[13px]
          font-medium
          text-[#16295A]
        "
      >
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          disabled={
            disabled || loading
          }
          className="
            h-12
            sm:h-14
            w-full
            appearance-none
            rounded-xl
            border
            border-gray-200
            bg-white
            px-4
            pr-10
            text-[13px]
            sm:text-[15px]
            text-gray-800
            outline-none
            transition
            focus:border-violet-500
            focus:ring-2
            focus:ring-violet-100
            disabled:cursor-not-allowed
            disabled:bg-gray-50
            disabled:text-gray-400
          "
        >
          <option value="">
            {loading
              ? "Loading..."
              : options.length === 0 &&
                  !value
                ? noOptionsText
                : placeholder}
          </option>

          {options.map(
            (option, index) => (
              <option
                key={
                  String(
                    option.value
                  ) +
                  "-" +
                  index
                }
                value={
                  option.value
                }
              >
                {option.label}
              </option>
            )
          )}
        </select>

        {loading ? (
          <Loader2
            className="
              pointer-events-none
              absolute
              right-4
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              animate-spin
              text-violet-500
            "
          />
        ) : (
          <ChevronDown
            className="
              pointer-events-none
              absolute
              right-4
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              text-gray-400
            "
          />
        )}
      </div>
    </div>
  );
}

/* =========================================================
   CREATE PLANT MODAL
========================================================= */

export default function CreatePlantModal({
  onClose,
  onSuccess,
}) {
  const { t } =
    useLanguage();

  /* =======================================================
     FORM
  ======================================================= */

  const [
    form,
    setForm,
  ] = useState({
    plant_name: "",
    plant_type: "",

    city: "",
    zone: "",
    division: "",
    ward: "",

    plant_manager: "",

    capacity_ton_per_day: "",
    vehicles_enrolled: "",
    total_waste_collected: "",

    latitude:
      DEFAULT_LOCATION[0],

    longitude:
      DEFAULT_LOCATION[1],

    status: "ACTIVE",
  });

  /* =======================================================
     MAP POSITION
  ======================================================= */

  const [
    position,
    setPosition,
  ] = useState(
    DEFAULT_LOCATION
  );

  /* =======================================================
     CITY / ZONE / DIVISION / WARD STATE
  ======================================================= */

  const [
    cities,
    setCities,
  ] = useState([]);

  const [
    zones,
    setZones,
  ] = useState([]);

  const [
    divisions,
    setDivisions,
  ] = useState([]);

  const [
    wards,
    setWards,
  ] = useState([]);

  const [
    selectedCity,
    setSelectedCity,
  ] = useState(null);

  const [
    selectedZone,
    setSelectedZone,
  ] = useState(null);

  const [
    selectedDivision,
    setSelectedDivision,
  ] = useState(null);

  const [
    selectedWard,
    setSelectedWard,
  ] = useState(null);

  /* =======================================================
     LOADING STATES
  ======================================================= */

  const [
    citiesLoading,
    setCitiesLoading,
  ] = useState(false);

  const [
    zonesLoading,
    setZonesLoading,
  ] = useState(false);

  const [
    divisionsLoading,
    setDivisionsLoading,
  ] = useState(false);

  const [
    wardsLoading,
    setWardsLoading,
  ] = useState(false);

  /* =======================================================
     ERRORS
  ======================================================= */

  const [
    locationError,
    setLocationError,
  ] = useState("");

  /* =======================================================
     SUBMIT LOADING
  ======================================================= */

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  /* =========================================================
     LOAD CITIES
  ========================================================= */

  const fetchCities =
    useCallback(
      async () => {
        try {
          setCitiesLoading(
            true
          );

          setLocationError(
            ""
          );

          const response =
            await fetch(
              CITIES_ENDPOINT,
              {
                method: "GET",

                headers: {
                  Accept:
                    "application/json",
                },
              }
            );

          if (
            !response.ok
          ) {
            throw new Error(
              `Cities request failed with status ${response.status}`
            );
          }

          const result =
            await response.json();

          if (
            result?.success ===
            false
          ) {
            throw new Error(
              result.message ||
                "Unable to fetch cities."
            );
          }

          const loadedCities =
            extractArray(
              result,
              "cities"
            ).filter(
              Boolean
            );

          setCities(
            loadedCities
          );

          /*
           * If there is only one city,
           * automatically select it.
           */
          if (
            loadedCities.length ===
            1
          ) {
            const onlyCity =
              loadedCities[0];

            const cityId =
              getCityId(
                onlyCity
              );

            if (
              cityId !==
              null
            ) {
              handleCitySelect(
                onlyCity
              );
            }
          }
        } catch (
          error
        ) {
          console.error(
            "❌ CITIES ERROR:",
            error
          );

          setCities(
            []
          );

          setLocationError(
            error?.message ||
              "Unable to load cities."
          );
        } finally {
          setCitiesLoading(
            false
          );
        }
      },
      []
    );

  /* =========================================================
     LOAD CITIES ON MODAL OPEN
  ========================================================= */

  useEffect(() => {
    fetchCities();
  }, [
    fetchCities,
  ]);

  /* =========================================================
     CITY SELECT
  ========================================================= */

  const handleCitySelect =
    async (
      city
    ) => {
      const cityId =
        getCityId(city);

      if (
        cityId ===
        null ||
        cityId ===
        undefined
      ) {
        return;
      }

      /*
       * Store the ACTUAL city object.
       *
       * Same philosophy as the existing
       * SEWAC map/header logic.
       */
      setSelectedCity(
        city
      );

      setSelectedZone(
        null
      );

      setSelectedDivision(
        null
      );

      setSelectedWard(
        null
      );

      setZones([]);
      setDivisions([]);
      setWards([]);

      setForm(
        (prev) => ({
          ...prev,

          city:
            getCityName(
              city
            ),

          zone: "",
          division: "",
          ward: "",
        })
      );

      setZonesLoading(
        true
      );

      setLocationError(
        ""
      );

      try {
        /*
         * SAME city map endpoint used
         * by the existing SEWAC hierarchy.
         */
        const endpoint =
          CITY_MAP_ENDPOINT(
            cityId
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

        if (
          !response.ok
        ) {
          throw new Error(
            `City map request failed with status ${response.status}`
          );
        }

        const result =
          await response.json();

        if (
          result?.success ===
          false
        ) {
          throw new Error(
            result.message ||
              "Unable to fetch city location data."
          );
        }

        /*
         * EXACTLY like existing map logic:
         *
         * city
         * ↓
         * zones
         */
        const loadedZones =
          Array.isArray(
            result?.zones
          )
            ? result.zones
            : [];

        setZones(
          loadedZones
        );
      } catch (
        error
      ) {
        console.error(
          "❌ CITY LOCATION ERROR:",
          error
        );

        setZones(
          []
        );

        setLocationError(
          error?.message ||
            "Unable to load zones."
        );
      } finally {
        setZonesLoading(
          false
        );
      }
    };

  /* =========================================================
     ZONE SELECT
  ========================================================= */

  const handleZoneSelect =
    async (
      zone
    ) => {
      if (!zone) {
        setSelectedZone(
          null
        );

        setSelectedDivision(
          null
        );

        setSelectedWard(
          null
        );

        setDivisions([]);
        setWards([]);

        setForm(
          (prev) => ({
            ...prev,
            zone: "",
            division: "",
            ward: "",
          })
        );

        return;
      }

      /*
       * Store the ORIGINAL zone object.
       *
       * This is important because the backend
       * hierarchy uses zoneTableName.
       */
      setSelectedZone(
        zone
      );

      setSelectedDivision(
        null
      );

      setSelectedWard(
        null
      );

      setDivisions([]);
      setWards([]);

      setForm(
        (prev) => ({
          ...prev,

          zone:
            getZoneName(
              zone
            ),

          division: "",
          ward: "",
        })
      );

      const zoneTableName =
        getZoneTableName(
          zone
        );

      /*
       * EXACT same validation as the
       * existing SEWAC map logic.
       */
      if (
        !zoneTableName
      ) {
        setLocationError(
          "Selected zone does not contain a valid zoneTableName."
        );

        return;
      }

      setDivisionsLoading(
        true
      );

      setLocationError(
        ""
      );

      try {
        /*
         * EXACT existing endpoint:
         *
         * /api/master-citizen/map/zone/:zoneTableName/divisions
         */
        const endpoint =
          ZONE_DIVISIONS_ENDPOINT(
            zoneTableName
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

        if (
          !response.ok
        ) {
          throw new Error(
            `Zone divisions request failed with status ${response.status}`
          );
        }

        const result =
          await response.json();

        if (
          result?.success ===
          false
        ) {
          throw new Error(
            result.message ||
              "Unable to fetch divisions."
          );
        }

        const loadedDivisions =
          extractArray(
            result,
            "divisions"
          ).filter(
            Boolean
          );

        setDivisions(
          loadedDivisions
        );
      } catch (
        error
      ) {
        console.error(
          "❌ ZONE → DIVISIONS ERROR:",
          error
        );

        setDivisions([]);

        setLocationError(
          error?.message ||
            "Unable to load divisions."
        );
      } finally {
        setDivisionsLoading(
          false
        );
      }
    };

  /* =========================================================
     DIVISION SELECT
  ========================================================= */

  const handleDivisionSelect =
    async (
      division
    ) => {
      if (!division) {
        setSelectedDivision(
          null
        );

        setSelectedWard(
          null
        );

        setWards([]);

        setForm(
          (prev) => ({
            ...prev,

            division: "",
            ward: "",
          })
        );

        return;
      }

      /*
       * Store the ORIGINAL division object.
       */
      setSelectedDivision(
        division
      );

      setSelectedWard(
        null
      );

      setWards([]);

      setForm(
        (prev) => ({
          ...prev,

          division:
            getDivisionName(
              division
            ),

          ward: "",
        })
      );

      const divisionTableName =
        getDivisionTableName(
          division
        );

      /*
       * EXACT same validation as
       * existing SEWAC map logic.
       */
      if (
        !divisionTableName
      ) {
        setLocationError(
          "Selected division does not contain a valid divisionTableName."
        );

        return;
      }

      setWardsLoading(
        true
      );

      setLocationError(
        ""
      );

      try {
        /*
         * EXACT existing endpoint:
         *
         * /api/master-citizen/map/division/:divisionTableName/wards
         */
        const endpoint =
          DIVISION_WARDS_ENDPOINT(
            divisionTableName
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

        if (
          !response.ok
        ) {
          throw new Error(
            `Division wards request failed with status ${response.status}`
          );
        }

        const result =
          await response.json();

        if (
          result?.success ===
          false
        ) {
          throw new Error(
            result.message ||
              "Unable to fetch wards."
          );
        }

        const loadedWards =
          extractArray(
            result,
            "wards"
          ).filter(
            Boolean
          );

        setWards(
          loadedWards
        );
      } catch (
        error
      ) {
        console.error(
          "❌ DIVISION → WARDS ERROR:",
          error
        );

        setWards([]);

        setLocationError(
          error?.message ||
            "Unable to load wards."
        );
      } finally {
        setWardsLoading(
          false
        );
      }
    };

  /* =========================================================
     WARD SELECT
  ========================================================= */

  const handleWardSelect =
    (
      ward
    ) => {
      if (!ward) {
        setSelectedWard(
          null
        );

        setForm(
          (prev) => ({
            ...prev,
            ward: "",
          })
        );

        return;
      }

      /*
       * Store the ORIGINAL ward object.
       */
      setSelectedWard(
        ward
      );

      setForm(
        (prev) => ({
          ...prev,

          ward:
            String(
              getWardName(
                ward
              )
            ),
        })
      );

      setLocationError(
        ""
      );
    };

  /* =========================================================
     NORMAL FORM INPUT
  ========================================================= */

  const handleChange = (
    e
  ) => {
    const {
      name,
      value,
    } = e.target;

    setForm(
      (prev) => ({
        ...prev,
        [name]: value,
      })
    );

    /*
     * Keep map synced with
     * manually entered coordinates.
     */

    if (
      name ===
      "latitude"
    ) {
      const lat =
        Number(value);

      if (
        Number.isFinite(
          lat
        ) &&
        lat >= -90 &&
        lat <= 90
      ) {
        setPosition(
          (prev) => [
            lat,
            prev[1],
          ]
        );
      }
    }

    if (
      name ===
      "longitude"
    ) {
      const lng =
        Number(value);

      if (
        Number.isFinite(
          lng
        ) &&
        lng >= -180 &&
        lng <= 180
      ) {
        setPosition(
          (prev) => [
            prev[0],
            lng,
          ]
        );
      }
    }
  };

  /* =========================================================
     MAP LOCATION SELECT
  ========================================================= */

  const handleMapLocation =
    ([
      lat,
      lng,
    ]) => {
      setPosition([
        lat,
        lng,
      ]);

      setForm(
        (prev) => ({
          ...prev,

          latitude:
            lat.toFixed(7),

          longitude:
            lng.toFixed(7),
        })
      );
    };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit =
    async () => {
      if (
        submitting
      ) {
        return;
      }

      setSubmitting(
        true
      );

      try {
        await api.post(
          "/api/plants",
          {
            ...form,

            capacity_ton_per_day:
              Number(
                form.capacity_ton_per_day
              ),

            vehicles_enrolled:
              Number(
                form.vehicles_enrolled
              ),

            total_waste_collected:
              Number(
                form.total_waste_collected
              ),

            latitude:
              Number(
                form.latitude
              ),

            longitude:
              Number(
                form.longitude
              ),
          }
        );

        onSuccess();
        onClose();
      } catch (
        err
      ) {
        console.error(
          err
        );

        alert(
          t(
            "plants.createPlant.errors.createFailed",
            "Failed to create plant."
          )
        );
      } finally {
        setSubmitting(
          false
        );
      }
    };

  /* =========================================================
     DROPDOWN OPTIONS
  ========================================================= */

  const cityOptions =
    cities
      .map(
        (city) => ({
          value:
            String(
              getCityId(
                city
              )
            ),

          label:
            getCityName(
              city
            ),

          city,
        })
      )
      .filter(
        (option) =>
          option.value !==
            "null" &&
          option.label
      );

  const zoneOptions =
    zones
      .map(
        (zone) => ({
          value:
            getZoneTableName(
              zone
            ) ||
            getZoneName(
              zone
            ),

          label:
            getZoneName(
              zone
            ),

          zone,
        })
      )
      .filter(
        (option) =>
          option.label
      );

  const divisionOptions =
    divisions
      .map(
        (division) => ({
          value:
            getDivisionTableName(
              division
            ) ||
            getDivisionName(
              division
            ),

          label:
            getDivisionName(
              division
            ),

          division,
        })
      )
      .filter(
        (option) =>
          option.label
      );

  const wardOptions =
    wards
      .map(
        (ward) => ({
          value:
            String(
              getWardName(
                ward
              )
            ),

          label:
            String(
              getWardName(
                ward
              )
            ),

          ward,
        })
      )
      .filter(
        (option) =>
          option.label
      );

  /* =========================================================
     CURRENT SELECT VALUES
  ========================================================= */

  const selectedCityValue =
    selectedCity
      ? String(
          getCityId(
            selectedCity
          )
        )
      : "";

  const selectedZoneValue =
    selectedZone
      ? getZoneTableName(
          selectedZone
        ) ||
        getZoneName(
          selectedZone
        )
      : "";

  const selectedDivisionValue =
    selectedDivision
      ? getDivisionTableName(
          selectedDivision
        ) ||
        getDivisionName(
          selectedDivision
        )
      : "";

  const selectedWardValue =
    selectedWard
      ? String(
          getWardName(
            selectedWard
          )
        )
      : "";

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-black/40
        p-3
        sm:p-4
        isolation-auto
      "
    >
      {/* ===================================================
          MODAL
      =================================================== */}

      <div
        className="
          relative
          z-[10000]
          flex
          w-full
          max-w-[900px]
          max-h-[95vh]
          sm:max-h-[92vh]
          flex-col
          overflow-hidden
          rounded-xl
          sm:rounded-2xl
          bg-white
          shadow-2xl
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex
            shrink-0
            items-start
            justify-between
            gap-4
            border-b
            border-gray-100
            px-4
            py-4
            sm:px-7
            sm:py-6
          "
        >
          <div className="min-w-0">
            <h2
              className="
                text-[19px]
                sm:text-[24px]
                font-bold
                text-[#16295A]
                leading-tight
              "
            >
              {t(
                "plants.createPlant.title",
                "Create Plant"
              )}
            </h2>

            <p
              className="
                mt-1
                text-[12px]
                sm:text-[14px]
                text-gray-500
                leading-relaxed
              "
            >
              {t(
                "plants.createPlant.subtitle",
                "Add a new waste processing plant"
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              submitting
            }
            className="
              shrink-0
              rounded-lg
              p-1.5
              sm:p-2
              text-gray-400
              transition
              hover:bg-gray-100
              hover:text-gray-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <X
              size={20}
              className="
                sm:w-[22px]
                sm:h-[22px]
              "
            />
          </button>
        </div>

        {/* =================================================
            SCROLLABLE CONTENT
        ================================================= */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            px-4
            py-4
            sm:px-7
            sm:py-6
          "
        >
          {/* =================================================
              LOCATION SECTION
          ================================================= */}

          <div
            className="
              mb-5
              sm:mb-6
            "
          >
            <div
              className="
                mb-1
                flex
                items-center
                gap-2
              "
            >
              <MapPin
                size={18}
                className="
                  shrink-0
                  text-violet-600
                  sm:w-5
                  sm:h-5
                "
              />

              <h3
                className="
                  text-[16px]
                  sm:text-[18px]
                  font-semibold
                  text-[#16295A]
                "
              >
                {t(
                  "plants.createPlant.plantLocation",
                  "Plant Location"
                )}
              </h3>
            </div>

            <p
              className="
                mb-3
                sm:mb-4
                text-[12px]
                sm:text-[14px]
                text-gray-500
              "
            >
              {t(
                "plants.createPlant.mapInstruction",
                "Click on the map to select the plant location."
              )}
            </p>

            {/* =================================================
                CITY / ZONE / DIVISION / WARD
            ================================================= */}

            <div
              className="
                mb-4
                grid
                grid-cols-1
                gap-3
                sm:grid-cols-2
                sm:gap-4
              "
            >
              {/* CITY */}

              <LocationDropdown
                label={t(
                  "plants.createPlant.city",
                  "City"
                )}
                value={
                  selectedCityValue
                }
                placeholder={t(
                  "plants.createPlant.selectCity",
                  "Select City"
                )}
                options={
                  cityOptions
                }
                loading={
                  citiesLoading
                }
                disabled={
                  submitting
                }
                noOptionsText={t(
                  "plants.createPlant.noCities",
                  "No cities available"
                )}
                onChange={(
                  e
                ) => {
                  const city =
                    cities.find(
                      (
                        item
                      ) =>
                        String(
                          getCityId(
                            item
                          )
                        ) ===
                        e.target
                          .value
                    );

                  handleCitySelect(
                    city
                  );
                }}
              />

              {/* ZONE */}

              <LocationDropdown
                label={t(
                  "plants.createPlant.zone",
                  "Zone"
                )}
                value={
                  selectedZoneValue
                }
                placeholder={
                  selectedCity
                    ? t(
                        "plants.createPlant.selectZone",
                        "Select Zone"
                      )
                    : t(
                        "plants.createPlant.selectCityFirst",
                        "Select City First"
                      )
                }
                options={
                  zoneOptions
                }
                loading={
                  zonesLoading
                }
                disabled={
                  !selectedCity ||
                  submitting
                }
                noOptionsText={t(
                  "plants.createPlant.noZones",
                  "No zones available"
                )}
                onChange={(
                  e
                ) => {
                  const zone =
                    zones.find(
                      (
                        item
                      ) =>
                        (
                          getZoneTableName(
                            item
                          ) ||
                          getZoneName(
                            item
                          )
                        ) ===
                        e.target
                          .value
                    );

                  handleZoneSelect(
                    zone
                  );
                }}
              />

              {/* DIVISION */}

              <LocationDropdown
                label={t(
                  "plants.createPlant.division",
                  "Division"
                )}
                value={
                  selectedDivisionValue
                }
                placeholder={
                  selectedZone
                    ? t(
                        "plants.createPlant.selectDivision",
                        "Select Division"
                      )
                    : t(
                        "plants.createPlant.selectZoneFirst",
                        "Select Zone First"
                      )
                }
                options={
                  divisionOptions
                }
                loading={
                  divisionsLoading
                }
                disabled={
                  !selectedZone ||
                  submitting
                }
                noOptionsText={t(
                  "plants.createPlant.noDivisions",
                  "No divisions available"
                )}
                onChange={(
                  e
                ) => {
                  const division =
                    divisions.find(
                      (
                        item
                      ) =>
                        (
                          getDivisionTableName(
                            item
                          ) ||
                          getDivisionName(
                            item
                          )
                        ) ===
                        e.target
                          .value
                    );

                  handleDivisionSelect(
                    division
                  );
                }}
              />

              {/* WARD */}

              <LocationDropdown
                label={t(
                  "plants.createPlant.ward",
                  "Ward"
                )}
                value={
                  selectedWardValue
                }
                placeholder={
                  selectedDivision
                    ? t(
                        "plants.createPlant.selectWard",
                        "Select Ward"
                      )
                    : t(
                        "plants.createPlant.selectDivisionFirst",
                        "Select Division First"
                      )
                }
                options={
                  wardOptions
                }
                loading={
                  wardsLoading
                }
                disabled={
                  !selectedDivision ||
                  submitting
                }
                noOptionsText={t(
                  "plants.createPlant.noWards",
                  "No wards available"
                )}
                onChange={(
                  e
                ) => {
                  const ward =
                    wards.find(
                      (
                        item
                      ) =>
                        String(
                          getWardName(
                            item
                          )
                        ) ===
                        e.target
                          .value
                    );

                  handleWardSelect(
                    ward
                  );
                }}
              />
            </div>

            {/* =================================================
                LOCATION ERROR
            ================================================= */}

            {locationError && (
              <div
                className="
                  mb-4
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-[12px]
                  leading-5
                  text-red-600
                "
              >
                {locationError}
              </div>
            )}

            {/* =================================================
                MAP
            ================================================= */}

            <div
              className="
                relative
                z-0
                isolate
                h-[220px]
                sm:h-[285px]
                w-full
                overflow-hidden
                rounded-xl
                border
                border-gray-200
                bg-gray-100
              "
            >
              <MapContainer
                center={
                  position
                }
                zoom={11}
                scrollWheelZoom={
                  true
                }
                zoomControl={
                  true
                }
                className="
                  h-full
                  w-full
                "
                style={{
                  height:
                    "100%",
                  width:
                    "100%",
                  zIndex: 0,
                }}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  subdomains="abcd"
                  maxZoom={20}
                />

                <LocationSelector
                  onSelect={
                    handleMapLocation
                  }
                />

                <MapCenterController
                  position={
                    position
                  }
                />

                <Marker
                  position={
                    position
                  }
                  icon={
                    plantIcon
                  }
                />
              </MapContainer>
            </div>
          </div>

          {/* =================================================
              OTHER FORM FIELDS
          ================================================= */}

          <div
            className="
              grid
              grid-cols-1
              gap-3
              sm:gap-4
              md:grid-cols-2
            "
          >
            {/* Plant Name */}

            <div>
              <label
                className="
                  mb-2
                  block
                  text-[12px]
                  sm:text-[13px]
                  font-medium
                  text-[#16295A]
                "
              >
                {t(
                  "plants.createPlant.plantName",
                  "Plant Name"
                )}
              </label>

              <input
                name="plant_name"
                value={
                  form.plant_name
                }
                onChange={
                  handleChange
                }
                placeholder={t(
                  "plants.createPlant.plantNamePlaceholder",
                  "Plant Name"
                )}
                disabled={
                  submitting
                }
                className="
                  h-12
                  sm:h-14
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-4
                  text-[13px]
                  sm:text-[15px]
                  text-gray-800
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-violet-500
                  focus:ring-2
                  focus:ring-violet-100
                  disabled:bg-gray-50
                "
              />
            </div>

            {/* Plant Type */}

            <div>
              <label
                className="
                  mb-2
                  block
                  text-[12px]
                  sm:text-[13px]
                  font-medium
                  text-[#16295A]
                "
              >
                {t(
                  "plants.createPlant.plantType",
                  "Plant Type"
                )}
              </label>

              <input
                name="plant_type"
                value={
                  form.plant_type
                }
                onChange={
                  handleChange
                }
                placeholder={t(
                  "plants.createPlant.plantTypePlaceholder",
                  "Plant Type"
                )}
                disabled={
                  submitting
                }
                className="
                  h-12
                  sm:h-14
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-4
                  text-[13px]
                  sm:text-[15px]
                  text-gray-800
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-violet-500
                  focus:ring-2
                  focus:ring-violet-100
                  disabled:bg-gray-50
                "
              />
            </div>

            {/* Plant Manager */}

            <div>
              <label
                className="
                  mb-2
                  block
                  text-[12px]
                  sm:text-[13px]
                  font-medium
                  text-[#16295A]
                "
              >
                {t(
                  "plants.createPlant.plantManager",
                  "Plant Manager"
                )}
              </label>

              <input
                name="plant_manager"
                value={
                  form.plant_manager
                }
                onChange={
                  handleChange
                }
                placeholder={t(
                  "plants.createPlant.plantManagerPlaceholder",
                  "Plant Manager"
                )}
                disabled={
                  submitting
                }
                className="
                  h-12
                  sm:h-14
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-4
                  text-[13px]
                  sm:text-[15px]
                  text-gray-800
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-violet-500
                  focus:ring-2
                  focus:ring-violet-100
                  disabled:bg-gray-50
                "
              />
            </div>

            {/* Capacity */}

            <div>
              <label
                className="
                  mb-2
                  block
                  text-[12px]
                  sm:text-[13px]
                  font-medium
                  text-[#16295A]
                "
              >
                {t(
                  "plants.createPlant.capacity",
                  "Capacity (Ton/Day)"
                )}
              </label>

              <input
                type="number"
                name="capacity_ton_per_day"
                value={
                  form.capacity_ton_per_day
                }
                onChange={
                  handleChange
                }
                placeholder={t(
                  "plants.createPlant.capacity",
                  "Capacity (Ton/Day)"
                )}
                disabled={
                  submitting
                }
                className="
                  h-12
                  sm:h-14
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  px-4
                  text-[13px]
                  sm:text-[15px]
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-violet-500
                  focus:ring-2
                  focus:ring-violet-100
                  disabled:bg-gray-50
                "
              />
            </div>

            {/* Vehicles */}

            <div>
              <label
                className="
                  mb-2
                  block
                  text-[12px]
                  sm:text-[13px]
                  font-medium
                  text-[#16295A]
                "
              >
                {t(
                  "plants.createPlant.vehiclesEnrolled",
                  "Vehicles Enrolled"
                )}
              </label>

              <input
                type="number"
                name="vehicles_enrolled"
                value={
                  form.vehicles_enrolled
                }
                onChange={
                  handleChange
                }
                placeholder={t(
                  "plants.createPlant.vehiclesEnrolled",
                  "Vehicles Enrolled"
                )}
                disabled={
                  submitting
                }
                className="
                  h-12
                  sm:h-14
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  px-4
                  text-[13px]
                  sm:text-[15px]
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-violet-500
                  focus:ring-2
                  focus:ring-violet-100
                  disabled:bg-gray-50
                "
              />
            </div>

            {/* Waste */}

            <div>
              <label
                className="
                  mb-2
                  block
                  text-[12px]
                  sm:text-[13px]
                  font-medium
                  text-[#16295A]
                "
              >
                {t(
                  "plants.createPlant.wasteCollected",
                  "Waste Collected"
                )}
              </label>

              <input
                type="number"
                name="total_waste_collected"
                value={
                  form.total_waste_collected
                }
                onChange={
                  handleChange
                }
                placeholder={t(
                  "plants.createPlant.wasteCollected",
                  "Waste Collected"
                )}
                disabled={
                  submitting
                }
                className="
                  h-12
                  sm:h-14
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  px-4
                  text-[13px]
                  sm:text-[15px]
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-violet-500
                  focus:ring-2
                  focus:ring-violet-100
                  disabled:bg-gray-50
                "
              />
            </div>

            {/* Latitude */}

            <div>
              <label
                className="
                  mb-2
                  block
                  text-[12px]
                  sm:text-[13px]
                  font-medium
                  text-[#16295A]
                "
              >
                {t(
                  "plants.createPlant.latitude",
                  "Latitude"
                )}
              </label>

              <input
                type="number"
                step="any"
                name="latitude"
                value={
                  form.latitude
                }
                onChange={
                  handleChange
                }
                placeholder={t(
                  "plants.createPlant.latitude",
                  "Latitude"
                )}
                disabled={
                  submitting
                }
                className="
                  h-12
                  sm:h-14
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  px-4
                  text-[13px]
                  sm:text-[15px]
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-violet-500
                  focus:ring-2
                  focus:ring-violet-100
                  disabled:bg-gray-50
                "
              />
            </div>

            {/* Longitude */}

            <div>
              <label
                className="
                  mb-2
                  block
                  text-[12px]
                  sm:text-[13px]
                  font-medium
                  text-[#16295A]
                "
              >
                {t(
                  "plants.createPlant.longitude",
                  "Longitude"
                )}
              </label>

              <input
                type="number"
                step="any"
                name="longitude"
                value={
                  form.longitude
                }
                onChange={
                  handleChange
                }
                placeholder={t(
                  "plants.createPlant.longitude",
                  "Longitude"
                )}
                disabled={
                  submitting
                }
                className="
                  h-12
                  sm:h-14
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  px-4
                  text-[13px]
                  sm:text-[15px]
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-violet-500
                  focus:ring-2
                  focus:ring-violet-100
                  disabled:bg-gray-50
                "
              />
            </div>

            {/* Status */}

            <div>
              <label
                className="
                  mb-2
                  block
                  text-[12px]
                  sm:text-[13px]
                  font-medium
                  text-[#16295A]
                "
              >
                {t(
                  "plants.createPlant.status",
                  "Status"
                )}
              </label>

              <div className="relative">
                <select
                  name="status"
                  value={
                    form.status
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    submitting
                  }
                  className="
                    h-12
                    sm:h-14
                    w-full
                    appearance-none
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    px-4
                    pr-10
                    text-[13px]
                    sm:text-[15px]
                    outline-none
                    transition
                    focus:border-violet-500
                    focus:ring-2
                    focus:ring-violet-100
                    disabled:bg-gray-50
                  "
                >
                  <option value="ACTIVE">
                    {t(
                      "plants.createPlant.active",
                      "ACTIVE"
                    )}
                  </option>

                  <option value="INACTIVE">
                    {t(
                      "plants.createPlant.inactive",
                      "INACTIVE"
                    )}
                  </option>
                </select>

                <ChevronDown
                  className="
                    pointer-events-none
                    absolute
                    right-4
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-gray-400
                  "
                />
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div
          className="
            flex
            shrink-0
            flex-col-reverse
            gap-2
            border-t
            border-gray-100
            bg-white
            px-4
            py-4
            sm:flex-row
            sm:justify-end
            sm:gap-3
            sm:px-7
            sm:py-5
          "
        >
          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              submitting
            }
            className="
              w-full
              rounded-xl
              border
              border-gray-200
              px-6
              py-2.5
              text-sm
              font-medium
              text-gray-700
              transition
              hover:bg-gray-50
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:w-auto
            "
          >
            {t(
              "plants.createPlant.cancel",
              "Cancel"
            )}
          </button>

          <button
            type="button"
            onClick={
              handleSubmit
            }
            disabled={
              submitting
            }
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#6C2BFF]
              px-7
              py-2.5
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-[#5B21D6]
              disabled:cursor-not-allowed
              disabled:opacity-60
              sm:w-auto
            "
          >
            {submitting && (
              <Loader2
                className="
                  h-4
                  w-4
                  animate-spin
                "
              />
            )}

            {submitting
              ? t(
                  "plants.createPlant.creating",
                  "Creating..."
                )
              : t(
                  "plants.createPlant.create",
                  "Create"
                )}
          </button>
        </div>
      </div>
    </div>
  );
}