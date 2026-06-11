import "leaflet/dist/leaflet.css";

import L from "leaflet";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  CircleMarker,
} from "react-leaflet";

const truckIcon = L.divIcon({
  html: `
    <div style="
      width:40px;
      height:40px;
      border-radius:50%;
      background:#8b5cf6;
      display:flex;
      align-items:center;
      justify-content:center;
      color:white;
      font-size:18px;
      border:4px solid white;
      box-shadow:0 4px 12px rgba(0,0,0,.15);
    ">
      🚛
    </div>
  `,
  className: "",
  iconSize: [40, 40],
});

export default function WorkerRouteOverview() {
  const route1 = [
    [12.9305, 77.5712],
    [12.9342, 77.5765],
    [12.9391, 77.5823],
  ];

  const route2 = [
    [12.9391, 77.5823],
    [12.9445, 77.5905],
    [12.9508, 77.5987],
  ];

  const route3 = [
    [12.9508, 77.5987],
    [12.9581, 77.6074],
    [12.9648, 77.6161],
  ];

  const route4 = [
    [12.9648, 77.6161],
    [12.9695, 77.6238],
    [12.9736, 77.6302],
  ];

  const collectionPoints = [
    [12.9342, 77.5765],
    [12.9391, 77.5823],
    [12.9445, 77.5905],
    [12.9581, 77.6074],
    [12.9695, 77.6238],
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

      <div className="flex items-center justify-between p-6 pb-3">
        <div>
          <h3 className="font-semibold text-gray-900">
            Worker Route Overview (Live)
          </h3>
        </div>

        <div className="px-3 py-1 rounded-full bg-pink-500 text-white text-xs font-medium">
          Live
        </div>
      </div>

      <div className="h-[250px]">
        <MapContainer
          center={[12.952, 77.602]}
          zoom={13}
          scrollWheelZoom={false}
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          {/* glow */}

          <Polyline
            positions={route1}
            pathOptions={{
              color: "#34d399",
              weight: 8,
              opacity: 0.2,
            }}
          />

          <Polyline
            positions={route2}
            pathOptions={{
              color: "#3b82f6",
              weight: 8,
              opacity: 0.2,
            }}
          />

          <Polyline
            positions={route3}
            pathOptions={{
              color: "#8b5cf6",
              weight: 8,
              opacity: 0.2,
            }}
          />

          <Polyline
            positions={route4}
            pathOptions={{
              color: "#ec4899",
              weight: 8,
              opacity: 0.2,
            }}
          />

          {/* actual route */}

          <Polyline
            positions={route1}
            pathOptions={{
              color: "#10b981",
              weight: 4,
            }}
          />

          <Polyline
            positions={route2}
            pathOptions={{
              color: "#3b82f6",
              weight: 4,
            }}
          />

          <Polyline
            positions={route3}
            pathOptions={{
              color: "#8b5cf6",
              weight: 4,
            }}
          />

          <Polyline
            positions={route4}
            pathOptions={{
              color: "#ec4899",
              weight: 4,
            }}
          />

          {collectionPoints.map((point, index) => (
            <CircleMarker
              key={index}
              center={point}
              radius={6}
              pathOptions={{
                color: "#ec4899",
                fillColor: "#fff",
                fillOpacity: 1,
                weight: 3,
              }}
            />
          ))}

          <Marker
            position={[12.9508, 77.5987]}
            icon={truckIcon}
          />

          <Marker
            position={[12.9695, 77.6238]}
            icon={truckIcon}
          />
        </MapContainer>
      </div>

      <div className="grid grid-cols-5 border-t border-gray-100 px-6 py-4">
        <div>
          <p className="text-xs text-gray-500">Distance</p>
          <p className="font-semibold">128.4 km</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Duration</p>
          <p className="font-semibold">8h 34m</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Avg Speed</p>
          <p className="font-semibold">15 km/h</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Stops</p>
          <p className="font-semibold">28</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Collection Points</p>
          <p className="font-semibold">42</p>
        </div>
      </div>

    </div>
  );
}