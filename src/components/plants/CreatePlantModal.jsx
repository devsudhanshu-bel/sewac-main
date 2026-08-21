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
   CREATE PLANT MODAL
========================================================= */

export default function CreatePlantModal({
  onClose,
  onSuccess,
}) {
  const { t } = useLanguage();

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
     UPDATE FORM
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

    /*
      Keep map synced with manually entered coordinates.
    */

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
            Number(form.latitude),

          longitude:
            Number(form.longitude),
        }
      );

      onSuccess();
      onClose();

    } catch (err) {
      console.error(err);

      alert(
        t(
          "plants.createPlant.errors.createFailed",
          "Failed to create plant."
        )
      );
    }
  };

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
            onClick={onClose}
            className="
              shrink-0
              rounded-lg
              p-1.5
              sm:p-2
              text-gray-400
              transition
              hover:bg-gray-100
              hover:text-gray-700
            "
          >
            <X
              size={20}
              className="sm:w-[22px] sm:h-[22px]"
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

          <div className="mb-5 sm:mb-6">

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
                className="shrink-0 text-violet-600 sm:w-5 sm:h-5"
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

            {/* Plant Name */}

            <input
              name="plant_name"
              value={form.plant_name}
              onChange={handleChange}
              placeholder={t(
                "plants.createPlant.plantName",
                "Plant Name"
              )}
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
              "
            />

            {/* Plant Type */}

            <input
              name="plant_type"
              value={form.plant_type}
              onChange={handleChange}
              placeholder={t(
                "plants.createPlant.plantType",
                "Plant Type"
              )}
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
              "
            />

            {/* City */}

            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder={t(
                "plants.createPlant.city",
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

            {/* Zone */}

            <input
              name="zone"
              value={form.zone}
              onChange={handleChange}
              placeholder={t(
                "plants.createPlant.zone",
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

            {/* Division */}

            <input
              name="division"
              value={form.division}
              onChange={handleChange}
              placeholder={t(
                "plants.createPlant.division",
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

            {/* Ward */}

            <input
              name="ward"
              value={form.ward}
              onChange={handleChange}
              placeholder={t(
                "plants.createPlant.ward",
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

            {/* Plant Manager */}

            <input
              name="plant_manager"
              value={form.plant_manager}
              onChange={handleChange}
              placeholder={t(
                "plants.createPlant.plantManager",
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

            {/* Capacity */}

            <input
              type="number"
              name="capacity_ton_per_day"
              value={form.capacity_ton_per_day}
              onChange={handleChange}
              placeholder={t(
                "plants.createPlant.capacity",
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

            {/* Vehicles */}

            <input
              type="number"
              name="vehicles_enrolled"
              value={form.vehicles_enrolled}
              onChange={handleChange}
              placeholder={t(
                "plants.createPlant.vehiclesEnrolled",
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

            {/* Waste */}

            <input
              type="number"
              name="total_waste_collected"
              value={form.total_waste_collected}
              onChange={handleChange}
              placeholder={t(
                "plants.createPlant.wasteCollected",
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

            {/* Latitude */}

            <input
              type="number"
              step="any"
              name="latitude"
              value={form.latitude}
              onChange={handleChange}
              placeholder={t(
                "plants.createPlant.latitude",
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

            {/* Longitude */}

            <input
              type="number"
              step="any"
              name="longitude"
              value={form.longitude}
              onChange={handleChange}
              placeholder={t(
                "plants.createPlant.longitude",
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

            {/* Status */}

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
            sm:flex-row
            sm:justify-end
            gap-2
            sm:gap-3
            border-t
            border-gray-100
            bg-white
            px-4
            py-4
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
              "plants.createPlant.cancel",
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
              "plants.createPlant.create",
              "Create"
            )}
          </button>

        </div>

      </div>

    </div>
  );
}