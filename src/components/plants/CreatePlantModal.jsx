import { X, MapPin } from "lucide-react";
import { useState } from "react";
import api from "../../api/axios";
import { useLanguage } from "../../i18n";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ===========================================================
   LEAFLET MARKER FIX
=========================================================== */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ===========================================================
   MAP CLICK HANDLER
=========================================================== */

function LocationPicker({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      onLocationSelect({
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6),
      });
    },
  });

  return null;
}

/* ===========================================================
   CREATE PLANT MODAL
=========================================================== */

export default function CreatePlantModal({
  onClose,
  onSuccess,
}) {
  const { t } = useLanguage();

  /* ===========================================================
     FORM STATE
  =========================================================== */

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

  const [submitting, setSubmitting] = useState(false);

  /* ===========================================================
     DEFAULT MAP POSITION
  =========================================================== */

  const defaultPosition = [12.9716, 77.5946];

  const selectedPosition =
    form.latitude && form.longitude
      ? [
          Number(form.latitude),
          Number(form.longitude),
        ]
      : defaultPosition;

  /* ===========================================================
     HANDLE INPUT
  =========================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ===========================================================
     HANDLE MAP LOCATION
  =========================================================== */

  const handleLocationSelect = ({
    latitude,
    longitude,
  }) => {
    setForm((prev) => ({
      ...prev,
      latitude,
      longitude,
    }));
  };

  /* ===========================================================
     SUBMIT
  =========================================================== */

  const handleSubmit = async () => {
    try {
      if (
        !form.plant_name ||
        !form.plant_type ||
        !form.city ||
        !form.zone ||
        !form.division ||
        !form.ward ||
        !form.plant_manager ||
        !form.capacity_ton_per_day ||
        !form.vehicles_enrolled ||
        !form.total_waste_collected ||
        !form.latitude ||
        !form.longitude
      ) {
        alert(
          t(
            "plants.createPlant.errors.fillAllFields",
            "Please fill all fields."
          )
        );

        return;
      }

      setSubmitting(true);

      await api.post("/api/plants", {
        ...form,

        capacity_ton_per_day:
          Number(form.capacity_ton_per_day),

        vehicles_enrolled:
          Number(form.vehicles_enrolled),

        total_waste_collected:
          Number(form.total_waste_collected),

        latitude:
          Number(form.latitude),

        longitude:
          Number(form.longitude),
      });

      await onSuccess();
      onClose();
    } catch (err) {
      console.error("Create Plant Error:", err);

      alert(
        t(
          "plants.createPlant.errors.createFailed",
          "Failed to create plant."
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ===========================================================
     RENDER
  =========================================================== */

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
      "
    >
      {/* =====================================================
          MODAL
      ===================================================== */}

      <div
        className="
          relative
          w-full
          max-w-[760px]
          max-h-[92vh]
          overflow-y-auto
          overflow-x-hidden
          rounded-2xl
          bg-white
          shadow-2xl
        "
      >
        {/* ===================================================
            HEADER
        =================================================== */}

        <div
          className="
            sticky
            top-0
            z-20
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
            <h2 className="text-[20px] font-bold text-[#16295A]">
              {t(
                "plants.createPlant.title",
                "Create Plant"
              )}
            </h2>

            <p className="mt-1 text-[13px] text-gray-500">
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
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              text-gray-500
              transition
              hover:bg-gray-100
              hover:text-gray-800
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* ===================================================
            BODY
        =================================================== */}

        <div className="px-6 py-6">

          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <div className="mb-5">
            <h3 className="mb-3 text-[14px] font-semibold text-[#16295A]">
              {t(
                "plants.createPlant.basicInformation",
                "Basic Information"
              )}
            </h3>

            <div className="grid grid-cols-2 gap-4">

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
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  px-3
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
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  px-3
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
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  px-3
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
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  px-3
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
              LOCATION INFORMATION
          ================================================= */}

          <div className="mb-5">
            <h3 className="mb-3 text-[14px] font-semibold text-[#16295A]">
              {t(
                "plants.createPlant.locationInformation",
                "Location Information"
              )}
            </h3>

            <div className="grid grid-cols-2 gap-4">

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
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  px-3
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
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  px-3
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
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  px-3
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
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  px-3
                  text-sm
                  outline-none
                  transition
                  focus:border-violet-500
                  focus:ring-2
                  focus:ring-violet-100
                "
              />

            </div>
          </div>

          {/* =================================================
              CAPACITY INFORMATION
          ================================================= */}

          <div className="mb-5">
            <h3 className="mb-3 text-[14px] font-semibold text-[#16295A]">
              {t(
                "plants.createPlant.capacityInformation",
                "Capacity & Collection"
              )}
            </h3>

            <div className="grid grid-cols-3 gap-4">

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
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  px-3
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
                type="number"
                name="vehicles_enrolled"
                value={form.vehicles_enrolled}
                onChange={handleChange}
                placeholder={t(
                  "plants.createPlant.vehiclesEnrolled",
                  "Vehicles Enrolled"
                )}
                className="
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  px-3
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
                type="number"
                step="0.01"
                name="total_waste_collected"
                value={form.total_waste_collected}
                onChange={handleChange}
                placeholder={t(
                  "plants.createPlant.wasteCollected",
                  "Waste Collected"
                )}
                className="
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  px-3
                  text-sm
                  outline-none
                  transition
                  focus:border-violet-500
                  focus:ring-2
                  focus:ring-violet-100
                "
              />

            </div>
          </div>

          {/* =================================================
              MAP LOCATION
          ================================================= */}

          <div className="mb-5">

            <div className="mb-3 flex items-center justify-between">

              <div>
                <h3 className="flex items-center gap-2 text-[14px] font-semibold text-[#16295A]">
                  <MapPin
                    size={16}
                    className="text-violet-600"
                  />

                  {t(
                    "plants.createPlant.plantLocation",
                    "Plant Location"
                  )}
                </h3>

                <p className="mt-1 text-[12px] text-gray-500">
                  {t(
                    "plants.createPlant.mapInstruction",
                    "Click on the map to select the plant location."
                  )}
                </p>
              </div>

              {form.latitude && form.longitude && (
                <div className="rounded-lg bg-violet-50 px-3 py-2 text-right">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-violet-500">
                    Coordinates
                  </p>

                  <p className="text-[11px] font-semibold text-violet-700">
                    {form.latitude}, {form.longitude}
                  </p>
                </div>
              )}

            </div>

            {/* =================================================
                IMPORTANT:
                MAP IS CONTAINED INSIDE THIS BOX
            ================================================= */}

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
                center={selectedPosition}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full"
                style={{
                  height: "100%",
                  width: "100%",
                }}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <LocationPicker
                  onLocationSelect={
                    handleLocationSelect
                  }
                />

                {form.latitude &&
                  form.longitude && (
                    <Marker
                      position={[
                        Number(form.latitude),
                        Number(form.longitude),
                      ]}
                    />
                  )}
              </MapContainer>
            </div>

            {/* =================================================
                COORDINATE INPUTS
            ================================================= */}

            <div className="mt-3 grid grid-cols-2 gap-4">

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
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  px-3
                  text-sm
                  outline-none
                  transition
                  focus:border-violet-500
                  focus:ring-2
                  focus:ring-violet-100
                "
              />

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
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  px-3
                  text-sm
                  outline-none
                  transition
                  focus:border-violet-500
                  focus:ring-2
                  focus:ring-violet-100
                "
              />

            </div>

          </div>

        </div>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <div
          className="
            flex
            justify-end
            gap-3
            border-t
            border-gray-100
            bg-white
            px-6
            py-4
          "
        >

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
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
              disabled:cursor-not-allowed
              disabled:opacity-50
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
            disabled={submitting}
            className="
              rounded-lg
              bg-[#6C2BFF]
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-[#5820D6]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
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