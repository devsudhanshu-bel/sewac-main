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
import { useEffect, useState } from "react";

import "leaflet/dist/leaflet.css";

import api from "../../api/axios";
import { useLanguage } from "../../i18n";

/* =========================================================
   DEFAULT LOCATION
========================================================= */

const DEFAULT_LOCATION = [12.9716, 77.5946];

/* =========================================================
   PURPLE PLANT MARKER
========================================================= */

const plantIcon = L.divIcon({
  className: "plant-location-marker",
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
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

/* =========================================================
   MAP CLICK HANDLER
========================================================= */

function LocationSelector({ onSelect }) {
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

function MapCenterController({ position }) {
  const map = useMap();

  useEffect(() => {
    if (
      Array.isArray(position) &&
      position.length === 2 &&
      Number.isFinite(position[0]) &&
      Number.isFinite(position[1])
    ) {
      map.setView(position, map.getZoom(), {
        animate: true,
      });

      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  }, [position, map]);

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
  const { t } = useLanguage();

  /* =======================================================
     FORM STATE
  ======================================================= */

  const [form, setForm] = useState({
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
    latitude: DEFAULT_LOCATION[0],
    longitude: DEFAULT_LOCATION[1],
    status: "ACTIVE",
  });

  /* =======================================================
     MAP POSITION
  ======================================================= */

  const [position, setPosition] = useState(
    DEFAULT_LOCATION
  );

  /* =======================================================
     LOAD PLANT DATA
  ======================================================= */

  useEffect(() => {
    if (!plant) return;

    const latitude =
      Number(plant.latitude) ||
      DEFAULT_LOCATION[0];

    const longitude =
      Number(plant.longitude) ||
      DEFAULT_LOCATION[1];

    setForm({
      plant_name: plant.plant_name ?? "",
      plant_type: plant.plant_type ?? "",
      city: plant.city ?? "",
      zone: plant.zone ?? "",
      division: plant.division ?? "",
      ward: plant.ward ?? "",
      plant_manager:
        plant.plant_manager ?? "",
      capacity_ton_per_day:
        plant.capacity_ton_per_day ?? "",
      vehicles_enrolled:
        plant.vehicles_enrolled ?? "",
      total_waste_collected:
        plant.total_waste_collected ?? "",
      latitude,
      longitude,
      status: plant.status ?? "ACTIVE",
    });

    setPosition([
      latitude,
      longitude,
    ]);
  }, [plant]);

  /* =======================================================
     FORM CHANGE
  ======================================================= */

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    /* -------------------------------------------------------
       SYNC LATITUDE WITH MAP
    ------------------------------------------------------- */

    if (name === "latitude") {
      const lat = Number(value);

      if (
        Number.isFinite(lat) &&
        lat >= -90 &&
        lat <= 90
      ) {
        setPosition((prev) => [
          lat,
          prev[1],
        ]);
      }
    }

    /* -------------------------------------------------------
       SYNC LONGITUDE WITH MAP
    ------------------------------------------------------- */

    if (name === "longitude") {
      const lng = Number(value);

      if (
        Number.isFinite(lng) &&
        lng >= -180 &&
        lng <= 180
      ) {
        setPosition((prev) => [
          prev[0],
          lng,
        ]);
      }
    }
  };

  /* =======================================================
     MAP LOCATION SELECT
  ======================================================= */

  const handleMapLocation = ([lat, lng]) => {
    setPosition([
      lat,
      lng,
    ]);

    setForm((prev) => ({
      ...prev,
      latitude: lat.toFixed(7),
      longitude: lng.toFixed(7),
    }));
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async () => {
    if (!plant?.id) return;

    try {
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
            Number(form.latitude),

          longitude:
            Number(form.longitude),
        }
      );

      onSuccess();
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
    }
  };

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
                sm:text-[24px]
                font-bold
                text-[#16295A]
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
                sm:text-[14px]
                text-gray-500
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
            className="
              shrink-0
              rounded-lg
              p-2
              text-gray-400
              transition
              hover:bg-gray-100
              hover:text-gray-700
            "
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
                  sm:text-[18px]
                  font-semibold
                  text-[#16295A]
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
                sm:text-[14px]
                text-gray-500
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
                center={position}
                zoom={11}
                scrollWheelZoom={true}
                zoomControl={true}
                className="h-full w-full"
                style={{
                  height: "100%",
                  width: "100%",
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
                  onSelect={handleMapLocation}
                />

                <MapCenterController
                  position={position}
                />

                <Marker
                  position={position}
                  icon={plantIcon}
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
              value={form.plant_name}
              onChange={handleChange}
              placeholder={t(
                "plants.editPlant.plantName",
                "Plant Name"
              )}
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
              "
            />

            {/* =================================================
                PLANT TYPE
            ================================================= */}

            <input
              name="plant_type"
              value={form.plant_type}
              onChange={handleChange}
              placeholder={t(
                "plants.editPlant.plantType",
                "Plant Type"
              )}
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
              "
            />

            {/* =================================================
                CITY
            ================================================= */}

            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder={t(
                "plants.editPlant.city",
                "City"
              )}
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
              "
            />

            {/* =================================================
                ZONE
            ================================================= */}

            <input
              name="zone"
              value={form.zone}
              onChange={handleChange}
              placeholder={t(
                "plants.editPlant.zone",
                "Zone"
              )}
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
              "
            />

            {/* =================================================
                DIVISION
            ================================================= */}

            <input
              name="division"
              value={form.division}
              onChange={handleChange}
              placeholder={t(
                "plants.editPlant.division",
                "Division"
              )}
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
              "
            />

            {/* =================================================
                WARD
            ================================================= */}

            <input
              name="ward"
              value={form.ward}
              onChange={handleChange}
              placeholder={t(
                "plants.editPlant.ward",
                "Ward"
              )}
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
              "
            />

            {/* =================================================
                PLANT MANAGER
            ================================================= */}

            <input
              name="plant_manager"
              value={form.plant_manager}
              onChange={handleChange}
              placeholder={t(
                "plants.editPlant.plantManager",
                "Plant Manager"
              )}
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
              "
            />

            {/* =================================================
                CAPACITY
            ================================================= */}

            <input
              type="number"
              name="capacity_ton_per_day"
              value={form.capacity_ton_per_day}
              onChange={handleChange}
              placeholder={t(
                "plants.editPlant.capacity",
                "Capacity (Ton/Day)"
              )}
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
              "
            />

            {/* =================================================
                VEHICLES
            ================================================= */}

            <input
              type="number"
              name="vehicles_enrolled"
              value={form.vehicles_enrolled}
              onChange={handleChange}
              placeholder={t(
                "plants.editPlant.vehiclesEnrolled",
                "Vehicles Enrolled"
              )}
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
              "
            />

            {/* =================================================
                WASTE
            ================================================= */}

            <input
              type="number"
              name="total_waste_collected"
              value={form.total_waste_collected}
              onChange={handleChange}
              placeholder={t(
                "plants.editPlant.wasteCollected",
                "Waste Collected"
              )}
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
              "
            />

            {/* =================================================
                LATITUDE
            ================================================= */}

            <input
              type="number"
              step="any"
              name="latitude"
              value={form.latitude}
              onChange={handleChange}
              placeholder={t(
                "plants.editPlant.latitude",
                "Latitude"
              )}
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
              "
            />

            {/* =================================================
                LONGITUDE
            ================================================= */}

            <input
              type="number"
              step="any"
              name="longitude"
              value={form.longitude}
              onChange={handleChange}
              placeholder={t(
                "plants.editPlant.longitude",
                "Longitude"
              )}
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
              "
            />

            {/* =================================================
                STATUS
            ================================================= */}

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
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
                outline-none
                transition
                focus:border-violet-500
                focus:ring-2
                focus:ring-violet-100
              "
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
            onClick={onClose}
            className="
              w-full
              sm:w-auto
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
            "
          >
            {t(
              "plants.editPlant.cancel",
              "Cancel"
            )}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="
              w-full
              sm:w-auto
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
            "
          >
            {t(
              "plants.editPlant.update",
              "Update"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}