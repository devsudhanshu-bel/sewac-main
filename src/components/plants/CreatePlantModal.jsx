import { X } from "lucide-react";
import { useState } from "react";
import api from "../../api/axios";
import { useLanguage } from "../../i18n";

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

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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
        p-6
        overflow-y-auto
        isolation-auto
      "
    >
      <div
        className="
          relative
          z-[10000]
          w-[700px]
          max-w-[95vw]
          max-h-[90vh]
          overflow-y-auto
          rounded-2xl
          bg-white
          p-6
          shadow-2xl
        "
      >
        {/* Header */}

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {t(
              "plants.createPlant.title",
              "Create Plant"
            )}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg
              p-1.5
              text-gray-500
              transition
              hover:bg-gray-100
              hover:text-gray-700
            "
          >
            <X size={22} />
          </button>
        </div>

        {/* Form */}

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
              w-full
              rounded-lg
              border
              border-gray-200
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

        {/* Buttons */}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg
              border
              border-gray-200
              px-5
              py-2
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
              py-2
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