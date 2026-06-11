import {
  MapContainer,
  TileLayer,
  CircleMarker,
} from "react-leaflet";

const hotspots = [
  [12.925, 77.593],
  [12.928, 77.600],
  [12.932, 77.606],
  [12.935, 77.615],
  [12.940, 77.620],
  [12.942, 77.629],
  [12.936, 77.632],
];

export default function CitizensHeatmap() {
  return (
    <div
      className="
        bg-white
        rounded-[28px]
        border
        border-gray-100
        shadow-sm
        h-[340px]
        overflow-hidden
      "
    >
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">
          Citizen Activity Heatmap
        </h3>
      </div>

      <div className="h-[285px]">
        <MapContainer
          center={[12.935, 77.615]}
          zoom={13}
          style={{
            width: "100%",
            height: "100%",
          }}
          zoomControl={false}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

          {hotspots.map((point, index) => (
            <CircleMarker
              key={index}
              center={point}
              radius={12}
              pathOptions={{
                color: "#ff4f93",
                fillColor: "#ff4f93",
                fillOpacity: 0.45,
                weight: 1,
              }}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
}