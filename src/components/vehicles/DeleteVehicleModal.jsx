import { X, Trash2 } from "lucide-react";
import api from "../../api/axios";

export default function DeleteVehicleModal({
  vehicle,
  onClose,
  onSuccess,
}) {
  const handleDelete = async () => {
    try {
      await api.delete(`/api/vehicles/${vehicle.vehicle_id}`);
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to delete vehicle.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[420px] p-6 shadow-xl">

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-red-600">
            Delete Vehicle
          </h2>

          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="flex justify-center mb-5">
          <Trash2 size={56} className="text-red-500" />
        </div>

        <p className="text-center text-gray-700">
          Are you sure you want to delete vehicle
        </p>

        <p className="text-center font-semibold mt-2">
          {vehicle.vehicle_id}
        </p>

        <p className="text-center text-gray-500">
          {vehicle.vehicle_number}
        </p>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>

        </div>

      </div>
    </div>
  );
}