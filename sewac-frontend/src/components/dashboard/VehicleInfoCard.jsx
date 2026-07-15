import {
  Truck,
  X,
} from "lucide-react";

export default function VehicleInfoCard({
  vehicle,
  onClose,
}) {
  if (!vehicle) return null;

  return (
    <div
      className="
      absolute
      top-5
      right-5
      w-[320px]
      bg-white
      rounded-3xl
      p-5
      shadow-xl
      border
      border-gray-100
      z-[1000]
    "
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
            <Truck className="text-purple-600" />
          </div>

          <div>
            <h3 className="font-semibold">
              {vehicle.number}
            </h3>

            <div className="mt-1 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 inline-flex">
              Active
            </div>
          </div>
        </div>

        <button onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      <div className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Driver</span>
          <span>{vehicle.driver}</span>
        </div>

        <div className="flex justify-between">
          <span>Speed</span>
          <span>{vehicle.speed} km/h</span>
        </div>

        <div className="flex justify-between">
          <span>Waste</span>
          <span>{vehicle.waste}</span>
        </div>

        <div className="flex justify-between">
          <span>Next Stop</span>
          <span>{vehicle.nextStop}</span>
        </div>
      </div>
    </div>
  );
}