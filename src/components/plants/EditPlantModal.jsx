import {
  X,
  MapPin,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import {
  useEffect,
  useState,
} from "react";

import "leaflet/dist/leaflet.css";

import api from "../../api/axios";
import { useLanguage } from "../../i18n";

/* =========================================================
   DEFAULT LOCATION
========================================================= */

const DEFAULT_LOCATION = [
  12.9716,
  77.5946,
];

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
   EDIT PLANT MODAL
========================================================= */

export default function EditPlantModal({
  plant,
  onClose,
  onSuccess,
}) {
  const { t } =
    useLanguage();

  /* =======================================================
     FORM STATE
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
     GEOGRAPHIC DROPDOWN STATE

     EXACT SAME LOGIC AS CREATE VEHICLE
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

  /* =======================================================
     DROPDOWN LOADING STATE
  ======================================================= */

  const [
    locationLoading,
    setLocationLoading,
  ] = useState(false);

  /* =======================================================
     UPDATE LOADING
  ======================================================= */

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

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
     COMMON FIELD CLASS
  ======================================================= */

  const fieldClassName = `
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
    text-gray-700
    outline-none
    transition
    placeholder:text-gray-400
    focus:border-violet-500
    focus:ring-2
    focus:ring-violet-100
    disabled:bg-gray-50
    disabled:text-gray-400
    disabled:cursor-not-allowed
  `;

  /* =======================================================
     LOAD CITIES

     EXACT EXISTING FILTER API
  ======================================================= */

  const loadCities =
    async () => {
      try {
        const response =
          await api.get(
            "/api/filters/cities"
          );

        const data =
          Array.isArray(
            response?.data
          )
            ? response.data
            : [];

        setCities(data);

        return data;
      } catch (error) {
        console.error(
          "Failed to load cities:",
          error
        );

        setCities([]);

        return [];
      }
    };

  /* =======================================================
     LOAD ZONES

     EXACT EXISTING FILTER API
  ======================================================= */

  const loadZones =
    async (
      cityId
    ) => {
      if (!cityId) {
        setZones([]);

        return [];
      }

      try {
        const response =
          await api.get(
            `/api/filters/zones/${cityId}`
          );

        const data =
          Array.isArray(
            response?.data
          )
            ? response.data
            : [];

        setZones(data);

        return data;
      } catch (error) {
        console.error(
          "Failed to load zones:",
          error
        );

        setZones([]);

        return [];
      }
    };

  /* =======================================================
     LOAD DIVISIONS

     EXACT EXISTING FILTER API
  ======================================================= */

  const loadDivisions =
    async (
      zoneId
    ) => {
      if (!zoneId) {
        setDivisions([]);

        return [];
      }

      try {
        const response =
          await api.get(
            `/api/filters/divisions/${zoneId}`
          );

        const data =
          Array.isArray(
            response?.data
          )
            ? response.data
            : [];

        setDivisions(data);

        return data;
      } catch (error) {
        console.error(
          "Failed to load divisions:",
          error
        );

        setDivisions([]);

        return [];
      }
    };

  /* =======================================================
     LOAD WARDS

     EXACT EXISTING FILTER API
  ======================================================= */

  const loadWards =
    async (
      divisionId
    ) => {
      if (!divisionId) {
        setWards([]);

        return [];
      }

      try {
        const response =
          await api.get(
            `/api/filters/wards/${divisionId}`
          );

        const data =
          Array.isArray(
            response?.data
          )
            ? response.data
            : [];

        setWards(data);

        return data;
      } catch (error) {
        console.error(
          "Failed to load wards:",
          error
        );

        setWards([]);

        return [];
      }
    };

  /* =======================================================
     LOAD EXISTING PLANT

     AND REBUILD THE CASCADING DROPDOWN

     Plant:
       City
         ↓
       Zone
         ↓
       Division
         ↓
       Ward
  ======================================================= */

  useEffect(() => {
    let cancelled =
      false;

    const loadPlantLocation =
      async () => {
        if (!plant) {
          return;
        }

        /* -----------------------------------------------
           LOAD BASIC PLANT DATA
        ------------------------------------------------ */

        const latitude =
          Number(
            plant.latitude
          ) ||
          DEFAULT_LOCATION[0];

        const longitude =
          Number(
            plant.longitude
          ) ||
          DEFAULT_LOCATION[1];

        setForm({
          plant_name:
            plant.plant_name ??
            "",

          plant_type:
            plant.plant_type ??
            "",

          city:
            plant.city ??
            "",

          zone:
            plant.zone ??
            "",

          division:
            plant.division ??
            "",

          ward:
            plant.ward ??
            "",

          plant_manager:
            plant.plant_manager ??
            "",

          capacity_ton_per_day:
            plant.capacity_ton_per_day ??
            "",

          vehicles_enrolled:
            plant.vehicles_enrolled ??
            "",

          total_waste_collected:
            plant.total_waste_collected ??
            "",

          latitude,

          longitude,

          status:
            plant.status ??
            "ACTIVE",
        });

        setPosition([
          latitude,
          longitude,
        ]);

        /* -----------------------------------------------
           RESET DROPDOWN DATA
        ------------------------------------------------ */

        setZones([]);
        setDivisions([]);
        setWards([]);

        setLocationLoading(
          true
        );

        try {
          /* ---------------------------------------------
             CITY
          --------------------------------------------- */

          const loadedCities =
            await loadCities();

          if (cancelled) {
            return;
          }

          const selectedCity =
            loadedCities.find(
              (city) =>
                String(
                  city.city_name
                ).trim() ===
                String(
                  plant.city ?? ""
                ).trim()
            );

          if (!selectedCity) {
            return;
          }

          /* ---------------------------------------------
             ZONE
          --------------------------------------------- */

          const loadedZones =
            await loadZones(
              selectedCity.city_id
            );

          if (cancelled) {
            return;
          }

          const selectedZone =
            loadedZones.find(
              (zone) =>
                String(
                  zone.zone_name
                ).trim() ===
                String(
                  plant.zone ?? ""
                ).trim()
            );

          if (!selectedZone) {
            return;
          }

          /* ---------------------------------------------
             DIVISION
          --------------------------------------------- */

          const loadedDivisions =
            await loadDivisions(
              selectedZone.zone_id
            );

          if (cancelled) {
            return;
          }

          const selectedDivision =
            loadedDivisions.find(
              (division) =>
                String(
                  division.division_name
                ).trim() ===
                String(
                  plant.division ?? ""
                ).trim()
            );

          if (!selectedDivision) {
            return;
          }

          /* ---------------------------------------------
             WARD
          --------------------------------------------- */

          const loadedWards =
            await loadWards(
              selectedDivision.division_id
            );

          if (cancelled) {
            return;
          }

          /*
           * We intentionally keep the plant's
           * existing ward name in form.
           *
           * The dropdown will resolve it using
           * the same name → ID lookup used
           * everywhere else.
           */

          void loadedWards;

        } catch (error) {
          console.error(
            "Failed to rebuild plant location hierarchy:",
            error
          );
        } finally {
          if (!cancelled) {
            setLocationLoading(
              false
            );
          }
        }
      };

    loadPlantLocation();

    return () => {
      cancelled = true;
    };
  }, [plant]);

  /* =======================================================
     FORM CHANGE

     Keeps existing map synchronization.
  ======================================================= */

  const handleChange =
    (e) => {
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

      /* -----------------------------------------------
         LATITUDE → MAP
      ------------------------------------------------ */

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

      /* -----------------------------------------------
         LONGITUDE → MAP
      ------------------------------------------------ */

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

  /* =======================================================
     CITY CHANGE

     EXACT SAME CASCADING LOGIC
  ======================================================= */

  const handleCityChange =
    async (e) => {
      const cityId =
        e.target.value;

      const cityName =
        e.target.options[
          e.target.selectedIndex
        ]?.text || "";

      setForm(
        (prev) => ({
          ...prev,

          city:
            cityId
              ? cityName
              : "",

          zone: "",
          division: "",
          ward: "",
        })
      );

      setZones([]);
      setDivisions([]);
      setWards([]);

      if (cityId) {
        await loadZones(
          cityId
        );
      }
    };

  /* =======================================================
     ZONE CHANGE

     EXACT SAME CASCADING LOGIC
  ======================================================= */

  const handleZoneChange =
    async (e) => {
      const zoneId =
        e.target.value;

      const zoneName =
        e.target.options[
          e.target.selectedIndex
        ]?.text || "";

      setForm(
        (prev) => ({
          ...prev,

          zone:
            zoneId
              ? zoneName
              : "",

          division: "",
          ward: "",
        })
      );

      setDivisions([]);
      setWards([]);

      if (zoneId) {
        await loadDivisions(
          zoneId
        );
      }
    };

  /* =======================================================
     DIVISION CHANGE

     EXACT SAME CASCADING LOGIC
  ======================================================= */

  const handleDivisionChange =
    async (e) => {
      const divisionId =
        e.target.value;

      const divisionName =
        e.target.options[
          e.target.selectedIndex
        ]?.text || "";

      setForm(
        (prev) => ({
          ...prev,

          division:
            divisionId
              ? divisionName
              : "",

          ward: "",
        })
      );

      setWards([]);

      if (divisionId) {
        await loadWards(
          divisionId
        );
      }
    };

  /* =======================================================
     WARD CHANGE

     EXACT SAME CASCADING LOGIC
  ======================================================= */

  const handleWardChange =
    (e) => {
      const wardName =
        e.target.options[
          e.target.selectedIndex
        ]?.text || "";

      setForm(
        (prev) => ({
          ...prev,

          ward:
            e.target.value
              ? wardName
              : "",
        })
      );
    };

  /* =======================================================
     MAP LOCATION SELECT
  ======================================================= */

  const handleMapLocation =
    ([lat, lng]) => {
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

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit =
    async () => {
      if (
        !plant?.id ||
        submitting
      ) {
        return;
      }

      try {
        setSubmitting(
          true
        );

        await api.put(
          `/api/plants/${plant.id}`,
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

        if (onSuccess) {
          await onSuccess();
        }

        onClose();

      } catch (err) {
        console.error(
          "Update Plant Error:",
          err
        );

        alert(
          t(
            "plants.editPlant.errors.updateFailed",
            "Failed to update plant."
          )
        );

      } finally {
        setSubmitting(
          false
        );
      }
    };

  /* =======================================================
     DROPDOWN SELECTED VALUES
  ======================================================= */

  const selectedCityId =
    cities.find(
      (city) =>
        city.city_name ===
        form.city
    )?.city_id || "";

  const selectedZoneId =
    zones.find(
      (zone) =>
        zone.zone_name ===
        form.zone
    )?.zone_id || "";

  const selectedDivisionId =
    divisions.find(
      (division) =>
        division.division_name ===
        form.division
    )?.division_id || "";

  const selectedWardId =
    wards.find(
      (ward) =>
        ward.ward_name ===
        form.ward
    )?.ward_id || "";

  /* =======================================================
     RENDER
  ======================================================= */

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
        backdrop-blur-sm
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
                text-[20px]
                font-bold
                text-[#16295A]
                sm:text-[24px]
              "
            >
              {t(
                "plants.editPlant.title",
                "Update Plant"
              )}
            </h2>

            <p
              className="
                mt-1
                text-[12px]
                text-gray-500
                sm:text-[14px]
              "
            >
              {t(
                "plants.editPlant.subtitle",
                "Update plant information and location"
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={
              submitting
            }
            className="
              shrink-0
              rounded-lg
              p-2
              text-gray-400
              transition
              hover:bg-gray-100
              hover:text-gray-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            aria-label={t(
              "plants.editPlant.close",
              "Close"
            )}
          >
            <X size={21} />
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
            py-5
            sm:px-7
            sm:py-6
          "
        >
          {/* =================================================
              LOCATION
          ================================================= */}

          <div className="mb-6">
            <div className="mb-1 flex items-center gap-2">
              <MapPin
                size={19}
                className="shrink-0 text-violet-600"
              />

              <h3
                className="
                  text-[16px]
                  font-semibold
                  text-[#16295A]
                  sm:text-[18px]
                "
              >
                {t(
                  "plants.editPlant.plantLocation",
                  "Plant Location"
                )}
              </h3>
            </div>

            <p
              className="
                mb-4
                text-[12px]
                text-gray-500
                sm:text-[14px]
              "
            >
              {t(
                "plants.editPlant.mapInstruction",
                "Click on the map to update the plant location."
              )}
            </p>

            {/* =================================================
                MAP
            ================================================= */}

            <div
              className="
                relative
                z-0
                isolate
                h-[230px]
                w-full
                overflow-hidden
                rounded-xl
                border
                border-gray-200
                bg-gray-100
                sm:h-[285px]
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
                className="h-full w-full"
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
              FORM
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
            {/* =================================================
                PLANT NAME
            ================================================= */}

            <input
              name="plant_name"
              value={
                form.plant_name
              }
              onChange={
                handleChange
              }
              placeholder={t(
                "plants.editPlant.plantName",
                "Plant Name"
              )}
              disabled={
                submitting
              }
              className={
                fieldClassName
              }
            />

            {/* =================================================
                PLANT TYPE
            ================================================= */}

            <input
              name="plant_type"
              value={
                form.plant_type
              }
              onChange={
                handleChange
              }
              placeholder={t(
                "plants.editPlant.plantType",
                "Plant Type"
              )}
              disabled={
                submitting
              }
              className={
                fieldClassName
              }
            />

            {/* =================================================
                CITY
            ================================================= */}

            <select
              className={
                fieldClassName
              }
              value={
                selectedCityId
              }
              onChange={
                handleCityChange
              }
              disabled={
                submitting ||
                locationLoading
              }
            >
              <option value="">
                {locationLoading
                  ? t(
                      "plants.editPlant.loadingLocation",
                      "Loading cities..."
                    )
                  : t(
                      "plants.editPlant.selectCity",
                      "Select City"
                    )}
              </option>

              {cities.map(
                (
                  city
                ) => (
                  <option
                    key={
                      city.city_id
                    }
                    value={
                      city.city_id
                    }
                  >
                    {
                      city.city_name
                    }
                  </option>
                )
              )}
            </select>

            {/* =================================================
                ZONE
            ================================================= */}

            <select
              className={
                fieldClassName
              }
              value={
                selectedZoneId
              }
              onChange={
                handleZoneChange
              }
              disabled={
                submitting ||
                !form.city ||
                locationLoading
              }
            >
              <option value="">
                {t(
                  "plants.editPlant.selectZone",
                  "Select Zone"
                )}
              </option>

              {zones.map(
                (
                  zone
                ) => (
                  <option
                    key={
                      zone.zone_id
                    }
                    value={
                      zone.zone_id
                    }
                  >
                    {
                      zone.zone_name
                    }
                  </option>
                )
              )}
            </select>

            {/* =================================================
                DIVISION
            ================================================= */}

            <select
              className={
                fieldClassName
              }
              value={
                selectedDivisionId
              }
              onChange={
                handleDivisionChange
              }
              disabled={
                submitting ||
                !form.zone ||
                locationLoading
              }
            >
              <option value="">
                {t(
                  "plants.editPlant.selectDivision",
                  "Select Division"
                )}
              </option>

              {divisions.map(
                (
                  division
                ) => (
                  <option
                    key={
                      division.division_id
                    }
                    value={
                      division.division_id
                    }
                  >
                    {
                      division.division_name
                    }
                  </option>
                )
              )}
            </select>

            {/* =================================================
                WARD
            ================================================= */}

            <select
              className={
                fieldClassName
              }
              value={
                selectedWardId
              }
              onChange={
                handleWardChange
              }
              disabled={
                submitting ||
                !form.division ||
                locationLoading
              }
            >
              <option value="">
                {t(
                  "plants.editPlant.selectWard",
                  "Select Ward"
                )}
              </option>

              {wards.map(
                (
                  ward
                ) => (
                  <option
                    key={
                      ward.ward_id
                    }
                    value={
                      ward.ward_id
                    }
                  >
                    {
                      ward.ward_name
                    }
                  </option>
                )
              )}
            </select>

            {/* =================================================
                PLANT MANAGER
            ================================================= */}

            <input
              name="plant_manager"
              value={
                form.plant_manager
              }
              onChange={
                handleChange
              }
              placeholder={t(
                "plants.editPlant.plantManager",
                "Plant Manager"
              )}
              disabled={
                submitting
              }
              className={
                fieldClassName
              }
            />

            {/* =================================================
                CAPACITY
            ================================================= */}

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
                "plants.editPlant.capacity",
                "Capacity (Ton/Day)"
              )}
              disabled={
                submitting
              }
              className={
                fieldClassName
              }
            />

            {/* =================================================
                VEHICLES
            ================================================= */}

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
                "plants.editPlant.vehiclesEnrolled",
                "Vehicles Enrolled"
              )}
              disabled={
                submitting
              }
              className={
                fieldClassName
              }
            />

            {/* =================================================
                WASTE
            ================================================= */}

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
                "plants.editPlant.wasteCollected",
                "Waste Collected"
              )}
              disabled={
                submitting
              }
              className={
                fieldClassName
              }
            />

            {/* =================================================
                LATITUDE
            ================================================= */}

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
                "plants.editPlant.latitude",
                "Latitude"
              )}
              disabled={
                submitting
              }
              className={
                fieldClassName
              }
            />

            {/* =================================================
                LONGITUDE
            ================================================= */}

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
                "plants.editPlant.longitude",
                "Longitude"
              )}
              disabled={
                submitting
              }
              className={
                fieldClassName
              }
            />

            {/* =================================================
                STATUS
            ================================================= */}

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
              className={
                fieldClassName
              }
            >
              <option value="ACTIVE">
                {t(
                  "plants.editPlant.active",
                  "ACTIVE"
                )}
              </option>

              <option value="INACTIVE">
                {t(
                  "plants.editPlant.inactive",
                  "INACTIVE"
                )}
              </option>
            </select>
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
              "plants.editPlant.cancel",
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
            {submitting
              ? t(
                  "plants.editPlant.updating",
                  "Updating..."
                )
              : t(
                  "plants.editPlant.update",
                  "Update"
                )}
          </button>
        </div>
      </div>
    </div>
  );
}