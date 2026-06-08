import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  ZoomControl,
} from "react-leaflet";

import {
  Radio,
  Layers3,
  Navigation,
  Truck,
  X,
  ArrowRight,
} from "lucide-react";

const route1 = [
  [12.925, 77.593],
  [12.928, 77.600],
  [12.932, 77.606],
  [12.935, 77.615],
  [12.940, 77.620],
];

const route2 = [
  [12.935, 77.615],
  [12.938, 77.623],
  [12.942, 77.629],
];

const greenPoints = [
  [12.927, 77.596],
  [12.931, 77.603],
  [12.938, 77.612],
  [12.944, 77.622],
  [12.941, 77.608],
  [12.936, 77.632],
  [12.929, 77.621],
];

const purpleVehicles = [
  [12.928, 77.600],
  [12.935, 77.615],
  [12.942, 77.629],
  [12.931, 77.620],
];

const pinkNodes = [
  [12.935, 77.615],
  [12.939, 77.620],
];

export default function MapSection() {
  return (
    <div
      className="
      bg-white
      rounded-[28px]
      border
      border-gray-100
      overflow-hidden
      h-[400px]
      relative
      shadow-sm
    "
    >
      <MapContainer
        center={[12.935, 77.615]}
        zoom={14}
        zoomControl={false}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <ZoomControl position="topleft" />

        {/* Light Theme Map */}

        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

        {/* Purple Routes */}

        <Polyline
          positions={route1}
          pathOptions={{
            color: "#8b5cf6",
            weight: 4,
          }}
        />

        <Polyline
          positions={route2}
          pathOptions={{
            color: "#ff4fa3",
            weight: 4,
          }}
        />

        {/* Green Collection Points */}

        {greenPoints.map((point, index) => (
          <CircleMarker
            key={index}
            center={point}
            radius={6}
            pathOptions={{
              color: "#10b981",
              fillColor: "#10b981",
              fillOpacity: 1,
            }}
          />
        ))}

        {/* Vehicle Markers */}

        {purpleVehicles.map((point, index) => (
          <CircleMarker
            key={`v-${index}`}
            center={point}
            radius={14}
            pathOptions={{
              color: "#a855f7",
              fillColor: "#ffffff",
              fillOpacity: 1,
              weight: 3,
            }}
          />
        ))}

        {/* Pink Nodes */}

        {pinkNodes.map((point, index) => (
          <CircleMarker
            key={`p-${index}`}
            center={point}
            radius={9}
            pathOptions={{
              color: "#ff4fa3",
              fillColor: "#ffffff",
              fillOpacity: 1,
              weight: 3,
            }}
          />
        ))}
      </MapContainer>

      {/* LIVE BUTTON */}

      <div className="absolute top-5 left-5">
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-2 rounded-xl shadow-lg flex flex-col items-center">
          <Radio size={14} />
          <span className="text-[10px] mt-1">Live</span>
        </div>
      </div>

      {/* LEFT CONTROLS */}

      <div className="absolute left-5 top-28 flex flex-col gap-3">
        <button className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center">
          <Layers3 size={18} className="text-gray-500" />
        </button>

        <button className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center">
          <Navigation size={18} className="text-gray-500" />
        </button>
      </div>

      {/* VEHICLE DETAILS CARD */}

      <div
        className="
        absolute
        top-5
        right-5
        w-[290px]
        bg-white
        rounded-[26px]
        p-5
        shadow-xl
        border
        border-gray-100
      "
      >
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Truck size={20} className="text-purple-500" />
            </div>

            <div>
              <h3 className="font-semibold">
                KA 01 AB 1234
              </h3>

              <div className="mt-1 inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-600 text-[11px]">
                On Route
              </div>
            </div>
          </div>

          <button>
            <X size={16} />
          </button>
        </div>

        <div className="mt-6 space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Driver</span>
            <span>Ramesh Kumar</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Speed</span>
            <span>28 km/h</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Waste Collected</span>
            <span>1.2 Ton</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Next Stop</span>
            <span>5th Cross, Jayanagar</span>
          </div>
        </div>

        <button
          className="
          mt-6
          w-full
          h-12
          border
          border-pink-200
          rounded-xl
          text-pink-500
          flex
          items-center
          justify-center
          gap-2
          hover:bg-pink-50
        "
        >
          View Full Details
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}