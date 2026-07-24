import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from "react-leaflet";

import {
  Maximize2,
  Factory,
  Truck,
  User,
  MapPinned,
} from "lucide-react";

import "leaflet/dist/leaflet.css";

import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function PlantLocations({
  plants = [],
}) {
  const formattedPlants = plants.map((plant) => ({
    id: plant.id,
    name: plant.plant_name,
    zone: plant.zone,
    manager: plant.manager || "Not Assigned",
    capacity: plant.capacity || "N/A",
    vehicles: plant.vehicles ?? 0,
    status: plant.status,
    position: [
      Number(plant.latitude),
      Number(plant.longitude),
    ],
  }));

  return (
        <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">

      {/* Header */}

      <div className="flex items-center justify-between mb-5">

        <h2 className="text-lg font-bold uppercase text-gray-900">
          Plant Locations
        </h2>

        <button
          className="
            w-10
            h-10
            rounded-xl
            border
            border-gray-200
            flex
            items-center
            justify-center
            hover:bg-gray-50
            transition
          "
        >
          <Maximize2 size={18} />
        </button>

      </div>

      {/* Map */}

      <div className="overflow-hidden rounded-2xl">

        <MapContainer
          center={[12.9716, 77.5946]}
          zoom={11}
          zoomControl={false}
          className="h-[560px] w-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ZoomControl position="bottomright" />

          {formattedPlants.map((plant) => (
            <Marker
              key={plant.id}
              position={plant.position}
            >
              <Popup
                maxWidth={300}
                minWidth={270}
              >
                <div className="p-2">

                  <div className="flex items-center gap-3 mb-4">

                    <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">

                      <Factory
                        size={24}
                        className="text-violet-600"
                      />

                    </div>

                    <div>

                      <h3 className="font-bold text-[16px]">
                        {plant.name}
                      </h3>

                      <span
                        className={`text-xs font-semibold ${
                          plant.status === "ACTIVE"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        ● {plant.status}
                      </span>

                    </div>

                  </div>

                  <div className="space-y-3 text-[13px]">

                    <div className="flex items-center gap-2">

                      <MapPinned
                        size={16}
                        className="text-violet-600"
                      />

                      <span>{plant.zone}</span>

                    </div>

                    <div className="flex items-center gap-2">

                      <User
                        size={16}
                        className="text-violet-600"
                      />

                      <span>{plant.manager}</span>

                    </div>

                    <div className="flex items-center gap-2">

                      <Truck
                        size={16}
                        className="text-violet-600"
                      />

                      <span>{plant.vehicles} Vehicles</span>

                    </div>

                    <div className="flex items-center gap-2">

                      <Factory
                        size={16}
                        className="text-violet-600"
                      />

                      <span>{plant.capacity}</span>

                    </div>

                  </div>

                  <button
                    className="
                      mt-5
                      w-full
                      rounded-xl
                      bg-violet-600
                      text-white
                      py-2.5
                      text-sm
                      font-medium
                      hover:bg-violet-700
                      transition
                    "
                  >
                    View Details
                  </button>

                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

      </div>
          </div>
  );
}