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

const plants = [
  {
    id: 1,
    name: "Shobha Organic Plant",
    zone: "North Zone",
    manager: "Ramesh Kumar",
    capacity: "120 Ton/Day",
    vehicles: 24,
    status: "Operational",
    position: [13.015, 77.556],
  },
  {
    id: 2,
    name: "Green Earth Recyclers",
    zone: "Central Zone",
    manager: "Anjali Singh",
    capacity: "150 Ton/Day",
    vehicles: 28,
    status: "Operational",
    position: [12.978, 77.61],
  },
  {
    id: 3,
    name: "Eco Processors Unit",
    zone: "East Zone",
    manager: "Suresh Patel",
    capacity: "100 Ton/Day",
    vehicles: 18,
    status: "Operational",
    position: [12.962, 77.69],
  },
  {
    id: 4,
    name: "Clean City Solutions",
    zone: "West Zone",
    manager: "Priya Sharma",
    capacity: "200 Ton/Day",
    vehicles: 32,
    status: "Operational",
    position: [12.914, 77.52],
  },
  {
    id: 5,
    name: "Waste To Energy Plant",
    zone: "South Zone",
    manager: "Mahesh Yadav",
    capacity: "250 Ton/Day",
    vehicles: 36,
    status: "Operational",
    position: [12.905, 77.63],
  },
  {
    id: 6,
    name: "BioGreen Facility",
    zone: "North Zone",
    manager: "Deepak Nair",
    capacity: "80 Ton/Day",
    vehicles: 14,
    status: "Operational",
    position: [13.045, 77.61],
  },
  {
    id: 7,
    name: "Future Waste Solutions",
    zone: "South East Zone",
    manager: "Arun Kumar",
    capacity: "140 Ton/Day",
    vehicles: 26,
    status: "Operational",
    position: [12.89, 77.58],
  },
];

export default function PlantLocations() {
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

          {plants.map((plant) => (
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

                      <span className="text-xs text-green-600 font-semibold">
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