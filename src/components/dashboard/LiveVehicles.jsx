import { Truck } from "lucide-react";

const vehicles = [
  {
    number: "KA 01 AB 1234",
    speed: "28 km/h",
    status: "On Route",
  },
  {
    number: "KA 01 CD 5678",
    speed: "32 km/h",
    status: "On Route",
  },
  {
    number: "KA 03 EF 9012",
    speed: "24 km/h",
    status: "On Route",
  },
  {
    number: "KA 02 GH 3456",
    speed: "30 km/h",
    status: "On Route",
  },
  {
    number: "KA 05 IJ 6789",
    speed: "26 km/h",
    status: "On Route",
  },
];

export default function LiveVehicles() {
  return (
    <div
        className="
        bg-white
        rounded-[28px]
        border
        border-gray-100
        p-5
        h-[400px]
        w-full
        shadow-sm
        "
    >
      {/* Header */}

      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900 text-lg">
          Live Vehicles
        </h3>

        <button className="text-purple-500 text-sm font-medium hover:text-purple-600">
          View All
        </button>
      </div>

      {/* Vehicle List */}

      <div className="space-y-5">
        {vehicles.map((vehicle, index) => (
          <div
            key={index}
            className="
            flex
            items-center
            justify-between
          "
          >
            {/* Left */}

            <div className="flex items-center gap-3">
              <div
                className="
                w-11
                h-11
                rounded-xl
                bg-green-50
                flex
                items-center
                justify-center
              "
              >
                <Truck
                  size={18}
                  className="text-green-500"
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-800">
                  {vehicle.number}
                </h4>

                <p className="text-xs text-green-500">
                  {vehicle.status}
                </p>
              </div>
            </div>

            {/* Right */}

            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">
                {vehicle.speed}
              </span>

              <div className="w-2 h-2 rounded-full bg-green-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}