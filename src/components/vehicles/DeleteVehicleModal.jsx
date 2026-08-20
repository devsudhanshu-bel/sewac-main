import {
  X,
  Trash2,
} from "lucide-react";

import api from "../../api/axios";

import { useLanguage } from "../../i18n";

export default function DeleteVehicleModal({
  vehicle,
  onClose,
  onSuccess,
}) {
  const { t } = useLanguage();

  /* ===========================================================
     DELETE VEHICLE
  =========================================================== */

  const handleDelete = async () => {
    try {
      await api.delete(
        `/api/vehicles/${vehicle.vehicle_id}`
      );

      onSuccess();
    } catch (err) {
      console.error(err);

      alert(
        t(
          "vehicles.deleteVehicle.errors.deleteFailed",
          "Failed to delete vehicle."
        )
      );
    }
  };

  /* ===========================================================
     RENDER
  =========================================================== */

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl w-[420px] p-6 shadow-xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex justify-between items-center mb-5">

          <h2 className="text-xl font-bold text-red-600">
            {t(
              "vehicles.deleteVehicle.title",
              "Delete Vehicle"
            )}
          </h2>

          <button onClick={onClose}>
            <X size={22} />
          </button>

        </div>

        {/* =====================================================
            ICON
        ===================================================== */}

        <div className="flex justify-center mb-5">

          <Trash2
            size={56}
            className="text-red-500"
          />

        </div>

        {/* =====================================================
            MESSAGE
        ===================================================== */}

        <p className="text-center text-gray-700">
          {t(
            "vehicles.deleteVehicle.confirmation",
            "Are you sure you want to delete vehicle"
          )}
        </p>

        <p className="text-center font-semibold mt-2">
          {vehicle.vehicle_id}
        </p>

        {/* =====================================================
            ACTIONS
        ===================================================== */}

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-lg"
          >
            {t(
              "vehicles.deleteVehicle.cancel",
              "Cancel"
            )}
          </button>

          <button
            onClick={handleDelete}
            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            {t(
              "vehicles.deleteVehicle.delete",
              "Delete"
            )}
          </button>

        </div>

      </div>

    </div>
  );
}