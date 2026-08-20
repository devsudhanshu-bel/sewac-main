import { X, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import api from "../../api/axios";
import { useLanguage } from "../../i18n";

/* =========================================================
   LEAFLET MARKER ICON
========================================================= */

const plantIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/* =========================================================
   MAP CLICK HANDLER
========================================================= */

function LocationSelector({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      onLocationSelect(lat, lng);
    },
  });

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
    latitude: "",
    longitude: "",
    status: "ACTIVE",
  });

  /* =======================================================
     SUBMITTING STATE
  ======================================================= */

  const [submitting, setSubmitting] = useState(false);

  /* =======================================================
     LOAD PLANT DATA
  ======================================================= */

  useEffect(() => {
    if (!plant) return;

    setForm({
      plant_name: plant.plant_name ?? "",
      plant_type: plant.plant_type ?? "",
      city: plant.city ?? "",
      zone: plant.zone ?? "",
      division: plant.division ?? "",
      ward: plant.ward ?? "",
      plant_manager: plant.plant_manager ?? "",
      capacity_ton_per_day:
        plant.capacity_ton_per_day ?? "",
      vehicles_enrolled:
        plant.vehicles_enrolled ?? "",
      total_waste_collected:
        plant.total_waste_collected ?? "",
      latitude: plant.latitude ?? "",
      longitude: plant.longitude ?? "",
      status: plant.status ?? "ACTIVE",
    });
  }, [plant]);

  /* =======================================================
     INPUT CHANGE
  ======================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =======================================================
     MAP LOCATION CHANGE
  ======================================================= */

  const handleLocationSelect = (lat, lng) => {
    setForm((prev) => ({
      ...prev,
      latitude: Number(lat.toFixed(6)),
      longitude: Number(lng.toFixed(6)),
    }));
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateForm = () => {
    if (!form.plant_name.trim()) {
      alert(
        t(
          "plants.editPlant.validation.plantName",
          "Please enter plant name."
        )
      );
      return false;
    }

    if (!form.plant_type.trim()) {
      alert(
        t(
          "plants.editPlant.validation.plantType",
          "Please enter plant type."
        )
      );
      return false;
    }

    if (
      form.latitude === "" ||
      form.longitude === ""
    ) {
      alert(
        t(
          "plants.editPlant.validation.location",
          "Please select the plant location on the map."
        )
      );
      return false;
    }

    return true;
  };

  /* =======================================================
     UPDATE PLANT
  ======================================================= */

  const handleSubmit = async () => {
    if (!plant?.id) return;

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      await api.put(`/api/plants/${plant.id}`, {
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
      setSubmitting(false);
    }
  };

  /* =======================================================
     MAP CENTER
  ======================================================= */

  const latitude =
    Number(form.latitude) || 12.9716;

  const longitude =
    Number(form.longitude) || 77.5946;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/40
        p-4
        sm:p-6
      "
    >
      {/* ===================================================
          MODAL
      =================================================== */}

      <div
        className="
          bg-white
          rounded-2xl
          w-full
          max-w-[720px]
          max-h-[92vh]
          overflow-y-auto
          shadow-2xl
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            sticky
            top-0
            z-20
            bg-white
            flex
            justify-between
            items-center
            px-6
            py-5
            border-b
            border-gray-100
          "
        >
          <div>
            <h2 className="text-xl font-bold text-[#16295A]">
              {t(
                "plants.editPlant.title",
                "Update Plant"
              )}
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              {t(
                "plants.editPlant.subtitle",
                "Update plant details and location"
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              w-9
              h-9
              rounded-lg
              flex
              items-center
              justify-center
              text-gray-500
              hover:bg-gray-100
              hover:text-gray-800
              transition
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="px-6 py-5">

          {/* ===============================================
              PLANT DETAILS
          =============================================== */}

          <div className="mb-6">

            <h3 className="text-sm font-semibold text-[#16295A] mb-3">
              {t(
                "plants.editPlant.plantDetails",
                "Plant Details"
              )}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Plant Name */}

              <input
                name="plant_name"
                value={form.plant_name}
                onChange={handleChange}
                placeholder={t(
                  "plants.editPlant.plantName",
                  "Plant Name"
                )}
                className="
                  w-full
                  border
                  border-gray-200
                  rounded-lg
                  px-3
                  py-3
                  text-sm
                  outline-none
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
                  "plants.editPlant.plantType",
                  "Plant Type"
                )}
                className="
                  w-full
                  border
                  border-gray-200
                  rounded-lg
                  px-3
                  py-3
                  text-sm
                  outline-none
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
                  "plants.editPlant.city",
                  "City"
                )}
                className="
                  w-full
                  border
                  border-gray-200
                  rounded-lg
                  px-3
                  py-3
                  text-sm
                  outline-none
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
                  "plants.editPlant.zone",
                  "Zone"
                )}
                className="
                  w-full
                  border
                  border-gray-200
                  rounded-lg
                  px-3
                  py-3
                  text-sm
                  outline-none
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
                  "plants.editPlant.division",
                  "Division"
                )}
                className="
                  w-full
                  border
                  border-gray-200
                  rounded-lg
                  px-3
                  py-3
                  text-sm
                  outline-none
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
                  "plants.editPlant.ward",
                  "Ward"
                )}
                className="
                  w-full
                  border
                  border-gray-200
                  rounded-lg
                  px-3
                  py-3
                  text-sm
                  outline-none
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
                  "plants.editPlant.plantManager",
                  "Plant Manager"
                )}
                className="
                  w-full
                  border
                  border-gray-200
                  rounded-lg
                  px-3
                  py-3
                  text-sm
                  outline-none
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
                  "plants.editPlant.capacity",
                  "Capacity (Ton/Day)"
                )}
                className="
                  w-full
                  border
                  border-gray-200
                  rounded-lg
                  px-3
                  py-3
                  text-sm
                  outline-none
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
                  "plants.editPlant.vehiclesEnrolled",
                  "Vehicles Enrolled"
                )}
                className="
                  w-full
                  border
                  border-gray-200
                  rounded-lg
                  px-3
                  py-3
                  text-sm
                  outline-none
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
                  "plants.editPlant.wasteCollected",
                  "Waste Collected"
                )}
                className="
                  w-full
                  border
                  border-gray-200
                  rounded-lg
                  px-3
                  py-3
                  text-sm
                  outline-none
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
                  border
                  border-gray-200
                  rounded-lg
                  px-3
                  py-3
                  text-sm
                  outline-none
                  focus:border-violet-500
                  focus:ring-2
                  focus:ring-violet-100
                  bg-white
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

          {/* ===============================================
              LOCATION SECTION
          =============================================== */}

          <div>

            <div className="flex items-center gap-2 mb-3">

              <MapPin
                size={17}
                className="text-violet-600"
              />

              <h3 className="text-sm font-semibold text-[#16295A]">
                {t(
                  "plants.editPlant.location",
                  "Plant Location"
                )}
              </h3>

            </div>

            <p className="text-xs text-gray-500 mb-3">
              {t(
                "plants.editPlant.mapInstruction",
                "Click on the map to update the plant location."
              )}
            </p>

            {/* =============================================
                SMALL MAP BOX
            ============================================= */}

            <div
              className="
                w-full
                h-[240px]
                rounded-xl
                overflow-hidden
                border
                border-gray-200
                shadow-sm
                relative
              "
            >
              <MapContainer
                center={[
                  latitude,
                  longitude,
                ]}
                zoom={12}
                scrollWheelZoom={true}
                className="h-full w-full"
              >

                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution="&copy; OpenStreetMap contributors &copy; CARTO"
                />

                <LocationSelector
                  onLocationSelect={
                    handleLocationSelect
                  }
                />

                <Marker
                  position={[
                    latitude,
                    longitude,
                  ]}
                  icon={plantIcon}
                />

              </MapContainer>
            </div>

            {/* =============================================
                COORDINATES
            ============================================= */}

            <div className="grid grid-cols-2 gap-4 mt-4">

              {/* Latitude */}

              <div>

                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  {t(
                    "plants.editPlant.latitude",
                    "Latitude"
                  )}
                </label>

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
                    w-full
                    border
                    border-gray-200
                    rounded-lg
                    px-3
                    py-3
                    text-sm
                    outline-none
                    focus:border-violet-500
                    focus:ring-2
                    focus:ring-violet-100
                  "
                />

              </div>

              {/* Longitude */}

              <div>

                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  {t(
                    "plants.editPlant.longitude",
                    "Longitude"
                  )}
                </label>

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
                    w-full
                    border
                    border-gray-200
                    rounded-lg
                    px-3
                    py-3
                    text-sm
                    outline-none
                    focus:border-violet-500
                    focus:ring-2
                    focus:ring-violet-100
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
            justify-end
            gap-3
            px-6
            py-5
            border-t
            border-gray-100
            bg-white
          "
        >

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="
              border
              border-gray-200
              rounded-lg
              px-5
              py-2.5
              text-sm
              font-medium
              text-gray-700
              hover:bg-gray-50
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
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
            disabled={submitting}
            className="
              bg-[#6C2BFF]
              text-white
              rounded-lg
              px-5
              py-2.5
              text-sm
              font-semibold
              hover:bg-[#5B21D6]
              transition
              disabled:opacity-60
              disabled:cursor-not-allowed
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