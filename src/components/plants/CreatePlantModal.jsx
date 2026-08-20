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
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6 overflow-y-auto">

      <div className="bg-white rounded-2xl p-6 w-[700px] max-h-[90vh] overflow-y-auto">

        {/* Header */}

        <div className="flex justify-between items-center mb-5">

          <h2 className="text-xl font-bold">
            {t(
              "plants.createPlant.title",
              "Create Plant"
            )}
          </h2>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        {/* Form */}

        <div className="grid grid-cols-2 gap-4">

          <input
            name="plant_name"
            value={form.plant_name}
            onChange={handleChange}
            placeholder={t(
              "plants.createPlant.plantName",
              "Plant Name"
            )}
            className="border rounded-lg p-3"
          />

          <input
            name="plant_type"
            value={form.plant_type}
            onChange={handleChange}
            placeholder={t(
              "plants.createPlant.plantType",
              "Plant Type"
            )}
            className="border rounded-lg p-3"
          />

          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder={t(
              "plants.createPlant.city",
              "City"
            )}
            className="border rounded-lg p-3"
          />

          <input
            name="zone"
            value={form.zone}
            onChange={handleChange}
            placeholder={t(
              "plants.createPlant.zone",
              "Zone"
            )}
            className="border rounded-lg p-3"
          />

          <input
            name="division"
            value={form.division}
            onChange={handleChange}
            placeholder={t(
              "plants.createPlant.division",
              "Division"
            )}
            className="border rounded-lg p-3"
          />

          <input
            name="ward"
            value={form.ward}
            onChange={handleChange}
            placeholder={t(
              "plants.createPlant.ward",
              "Ward"
            )}
            className="border rounded-lg p-3"
          />

          <input
            name="plant_manager"
            value={form.plant_manager}
            onChange={handleChange}
            placeholder={t(
              "plants.createPlant.plantManager",
              "Plant Manager"
            )}
            className="border rounded-lg p-3"
          />

          <input
            name="capacity_ton_per_day"
            value={form.capacity_ton_per_day}
            onChange={handleChange}
            placeholder={t(
              "plants.createPlant.capacity",
              "Capacity (Ton/Day)"
            )}
            className="border rounded-lg p-3"
          />

          <input
            name="vehicles_enrolled"
            value={form.vehicles_enrolled}
            onChange={handleChange}
            placeholder={t(
              "plants.createPlant.vehiclesEnrolled",
              "Vehicles Enrolled"
            )}
            className="border rounded-lg p-3"
          />

          <input
            name="total_waste_collected"
            value={form.total_waste_collected}
            onChange={handleChange}
            placeholder={t(
              "plants.createPlant.wasteCollected",
              "Waste Collected"
            )}
            className="border rounded-lg p-3"
          />

          <input
            name="latitude"
            value={form.latitude}
            onChange={handleChange}
            placeholder={t(
              "plants.createPlant.latitude",
              "Latitude"
            )}
            className="border rounded-lg p-3"
          />

          <input
            name="longitude"
            value={form.longitude}
            onChange={handleChange}
            placeholder={t(
              "plants.createPlant.longitude",
              "Longitude"
            )}
            className="border rounded-lg p-3"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border rounded-lg p-3"
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

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="border rounded-lg px-5 py-2"
          >
            {t(
              "plants.createPlant.cancel",
              "Cancel"
            )}
          </button>

          <button
            onClick={handleSubmit}
            className="bg-[#6C2BFF] text-white rounded-lg px-5 py-2"
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