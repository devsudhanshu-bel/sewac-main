import { X, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import api from "../../api/axios";
import { useLanguage } from "../../i18n";

/* -------------------------------------------------------
   Default Bengaluru location
------------------------------------------------------- */

const DEFAULT_LOCATION = [12.9716, 77.5946];

/* -------------------------------------------------------
   Custom marker icon
------------------------------------------------------- */

const plantIcon = L.divIcon({
  className: "custom-plant-marker",
  html: `
    <div
      style="
        width: 34px;
        height: 34px;
        border-radius: 50% 50% 50% 0;
        background: #6C2BFF;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 3px 10px rgba(0,0,0,0.25);
        border: 3px solid white;
      "
    >
      <div
        style="
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: white;
        "
      ></div>
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
});

/* -------------------------------------------------------
   Map click handler
------------------------------------------------------- */

function LocationSelector({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

/* -------------------------------------------------------
   Keep map centered when coordinates change
------------------------------------------------------- */

function MapCenterController({ latitude, longitude }) {
  const map = useMap();

  useEffect(() => {
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    ) {
      map.setView([lat, lng], map.getZoom(), {
        animate: true,
      });
    }
  }, [latitude, longitude, map]);

  return null;
}

/* -------------------------------------------------------
   Create Plant Modal
------------------------------------------------------- */

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
    latitude: "",
    longitude: "",
    status: "ACTIVE",
  });

  /* -----------------------------------------------------
     Input handler
  ----------------------------------------------------- */

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* -----------------------------------------------------
     Map location handler
  ----------------------------------------------------- */

  const handleMapLocation = (lat, lng) => {
    setForm((prev) => ({
      ...prev,
      latitude: lat.toFixed(8),
      longitude: lng.toFixed(8),
    }));
  };

  /* -----------------------------------------------------
     Submit
  ----------------------------------------------------- */

  const handleSubmit = async () => {
    try {
      await api.post("/api/plants", {
        ...form,

        capacity_ton_per_day: Number(
          form.capacity_ton_per_day
        ),

        vehicles_enrolled: Number(
          form.vehicles_enrolled
        ),

        total_waste_collected: Number(
          form.total_waste_collected
        ),

        latitude: Number(form.latitude),

        longitude: Number(form.longitude),
      });

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

  /* -----------------------------------------------------
     Map position
  ----------------------------------------------------- */

  const latitude = Number(form.latitude);
  const longitude = Number(form.longitude);

  const hasValidLocation =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180;

  const mapCenter = hasValidLocation
    ? [latitude, longitude]
    : DEFAULT_LOCATION;

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
        p-4
        sm:p-6
        overflow-y-auto
        isolation-isolate
      "
    >
      <div
        className="
          relative
          z-[10000]
          w-full
          max-w-[760px]
          max-h-[92vh]
          overflow-y-auto
          rounded-2xl
          bg-white
          shadow-2xl
        "
      >
        {/* =================================================
            Header
        ================================================= */}

        <div
          className="
            sticky
            top-0
            z-[20]
            flex
            items-center
            justify-between
            border-b
            border-gray-100
            bg-white
            px-6
            py-5
          "
        >
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {t(
                "plants.createPlant.title",
                "Create Plant"
              )}
            </h2>

            <p className="mt-1 text-xs text-gray-500">
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
              rounded-lg
              p-2
              text-gray-500
              transition
              hover:bg-gray-100
              hover:text-gray-700
            "
          >
            <X size={22} />
          </button>
        </div>

        {/* =================================================
            Content
        ================================================= */}

        <div className="px-6 py-6">

          {/* =================================================
              Location Map
          ================================================= */}

          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2">
              <MapPin
                size={16}
                className="text-violet-600"
              />

              <p className="text-sm font-semibold text-gray-800">
                {t(
                  "plants.createPlant.selectLocation",
                  "Plant Location"
                )}
              </p>
            </div>

            <p className="mb-3 text-xs text-gray-500">
              {t(
                "plants.createPlant.mapInstruction",
                "Click on the map to select the plant location."
              )}
            </p>

            {/* Small contained map */}
            <div
              className="
                relative
                h-[230px]
                w-full
                overflow-hidden
                rounded-xl
                border
                border-gray-200
                bg-gray-100
              "
            >
              <MapContainer
                center={mapCenter}
                zoom={12}
                scrollWheelZoom={true}
                className="h-full w-full"
              >
                {/* White / Light CARTO map */}
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                <LocationSelector
                  onSelect={handleMapLocation}
                />

                <MapCenterController
                  latitude={form.latitude}
                  longitude={form.longitude}
                />

                {hasValidLocation && (
                  <Marker
                    position={[
                      latitude,
                      longitude,
                    ]}
                    icon={plantIcon}
                  />
                )}
              </MapContainer>
            </div>
          </div>

          {/* =================================================
              Form
          ================================================= */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

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
                w-full
                rounded-lg
                border
                border-gray-200
                bg-white
                p-3
                text-sm
                outline-none
                transition
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
                w-full
                rounded-lg
                border
                border-gray-200
                bg-white
                p-3
                text-sm
                outline-none
                transition
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
                w-full
                rounded-lg
                border
                border-gray-200
                bg-white
                p-3
                text-sm
                outline-none
                transition
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
                w-full
                rounded-lg
                border
                border-gray-200
                bg-white
                p-3
                text-sm
                outline-none
                transition
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
                w-full
                rounded-lg
                border
                border-gray-200
                bg-white
                p-3
                text-sm
                outline-none
                transition
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
                w-full
                rounded-lg
                border
                border-gray-200
                bg-white
                p-3
                text-sm
                outline-none
                transition
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
                w-full
                rounded-lg
                border
                border-gray-200
                bg-white
                p-3
                text-sm
                outline-none
                transition
                focus:border-violet-500
                focus:ring-2
                focus:ring-violet-100
              "
            />

            {/* Capacity */}

            <input
              name="capacity_ton_per_day"
              type="number"
              step="any"
              value={form.capacity_ton_per_day}
              onChange={handleChange}
              placeholder={t(
                "plants.createPlant.capacity",
                "Capacity (Ton/Day)"
              )}
              className="
                w-full
                rounded-lg
                border
                border-gray-200
                bg-white
                p-3
                text-sm
                outline-none
                transition
                focus:border-violet-500
                focus:ring-2
                focus:ring-violet-100
              "
            />

            {/* Vehicles */}

            <input
              name="vehicles_enrolled"
              type="number"
              value={form.vehicles_enrolled}
              onChange={handleChange}
              placeholder={t(
                "plants.createPlant.vehiclesEnrolled",
                "Vehicles Enrolled"
              )}
              className="
                w-full
                rounded-lg
                border
                border-gray-200
                bg-white
                p-3
                text-sm
                outline-none
                transition
                focus:border-violet-500
                focus:ring-2
                focus:ring-violet-100
              "
            />

            {/* Waste */}

            <input
              name="total_waste_collected"
              type="number"
              step="any"
              value={form.total_waste_collected}
              onChange={handleChange}
              placeholder={t(
                "plants.createPlant.wasteCollected",
                "Waste Collected"
              )}
              className="
                w-full
                rounded-lg
                border
                border-gray-200
                bg-white
                p-3
                text-sm
                outline-none
                transition
                focus:border-violet-500
                focus:ring-2
                focus:ring-violet-100
              "
            />

            {/* Latitude */}

            <input
              name="latitude"
              type="number"
              step="any"
              value={form.latitude}
              onChange={handleChange}
              placeholder={t(
                "plants.createPlant.latitude",
                "Latitude"
              )}
              className="
                w-full
                rounded-lg
                border
                border-gray-200
                bg-white
                p-3
                text-sm
                outline-none
                transition
                focus:border-violet-500
                focus:ring-2
                focus:ring-violet-100
              "
            />

            {/* Longitude */}

            <input
              name="longitude"
              type="number"
              step="any"
              value={form.longitude}
              onChange={handleChange}
              placeholder={t(
                "plants.createPlant.longitude",
                "Longitude"
              )}
              className="
                w-full
                rounded-lg
                border
                border-gray-200
                bg-white
                p-3
                text-sm
                outline-none
                transition
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
                w-full
                rounded-lg
                border
                border-gray-200
                bg-white
                p-3
                text-sm
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
            Footer
        ================================================= */}

        <div
          className="
            flex
            justify-end
            gap-3
            border-t
            border-gray-100
            bg-white
            px-6
            py-5
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg
              border
              border-gray-200
              px-5
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
              rounded-lg
              bg-[#6C2BFF]
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-[#5b21db]
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