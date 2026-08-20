import { X } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useLanguage } from "../../i18n";

export default function EditPlantModal({
  plant,
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

  useEffect(() => {
    if (plant) {
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
    }
  }, [plant]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await api.put(`/api/plants/${plant.id}`, {
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
          "plants.editPlant.errors.updateFailed",
          "Failed to update plant."
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
              "plants.editPlant.title",
              "Update Plant"
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
          <input
            name="plant_name"
            value={form.plant_name}
            onChange={handleChange}
            placeholder={t(
              "plants.editPlant.plantName",
              "Plant Name"
            )}
            className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />

          <input
            name="plant_type"
            value={form.plant_type}
            onChange={handleChange}
            placeholder={t(
              "plants.editPlant.plantType",
              "Plant Type"
            )}
            className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />

          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder={t(
              "plants.editPlant.city",
              "City"
            )}
            className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />

          <input
            name="zone"
            value={form.zone}
            onChange={handleChange}
            placeholder={t(
              "plants.editPlant.zone",
              "Zone"
            )}
            className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />

          <input
            name="division"
            value={form.division}
            onChange={handleChange}
            placeholder={t(
              "plants.editPlant.division",
              "Division"
            )}
            className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />

          <input
            name="ward"
            value={form.ward}
            onChange={handleChange}
            placeholder={t(
              "plants.editPlant.ward",
              "Ward"
            )}
            className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />

          <input
            name="plant_manager"
            value={form.plant_manager}
            onChange={handleChange}
            placeholder={t(
              "plants.editPlant.plantManager",
              "Plant Manager"
            )}
            className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />

          <input
            name="capacity_ton_per_day"
            type="number"
            value={form.capacity_ton_per_day}
            onChange={handleChange}
            placeholder={t(
              "plants.editPlant.capacity",
              "Capacity"
            )}
            className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />

          <input
            name="vehicles_enrolled"
            type="number"
            value={form.vehicles_enrolled}
            onChange={handleChange}
            placeholder={t(
              "plants.editPlant.vehiclesEnrolled",
              "Vehicles Enrolled"
            )}
            className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />

          <input
            name="total_waste_collected"
            type="number"
            value={form.total_waste_collected}
            onChange={handleChange}
            placeholder={t(
              "plants.editPlant.wasteCollected",
              "Waste Collected"
            )}
            className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />

          <input
            name="latitude"
            type="number"
            step="any"
            value={form.latitude}
            onChange={handleChange}
            placeholder={t(
              "plants.editPlant.latitude",
              "Latitude"
            )}
            className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />

          <input
            name="longitude"
            type="number"
            step="any"
            value={form.longitude}
            onChange={handleChange}
            placeholder={t(
              "plants.editPlant.longitude",
              "Longitude"
            )}
            className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-200 bg-white p-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
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
              "plants.editPlant.cancel",
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
              "plants.editPlant.update",
              "Update"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}