import {
  MapContainer,
  TileLayer,
  ZoomControl,
  GeoJSON,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { useEffect, useState } from "react";
import L from "leaflet";

import VehicleMarker from "./VehicleMarker";
import VehicleInfoCard from "./VehicleInfoCard";

import { vehicles as initialVehicles } from "../../data/mockVehicles";
import { ibbaluruBoundary } from "../../data/ibbaluruBoundary";

/* ---------------- FIT TO WARD ---------------- */

function FitBoundary({ data }) {
  const map = useMap();

  useEffect(() => {
    const layer = L.geoJSON(data);

    map.fitBounds(layer.getBounds(), {
      padding: [30, 30],
    });
  }, [map, data]);

  return null;
}

/* ---------------- MAIN COMPONENT ---------------- */

export default function MapSection() {
  const [vehicles, setVehicles] = useState(initialVehicles);

  const [selectedVehicle, setSelectedVehicle] =
    useState(null);

  /* ---------------- DEMO VEHICLE MOVEMENT ---------------- */

  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((vehicle) => {
          const [lat, lng] = vehicle.position;

          return {
            ...vehicle,
            position: [
              lat + (Math.random() - 0.5) * 0.00015,
              lng + (Math.random() - 0.5) * 0.00015,
            ],
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="
        bg-white
        rounded-[28px]
        border
        border-gray-100
        overflow-hidden
        h-[450px]
        relative
        shadow-sm
      "
    >
      <MapContainer
        center={[12.9258, 77.659]}
        zoom={15}
        zoomControl={false}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <ZoomControl position="topleft" />

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* AUTO FIT TO IBBALURU */}

        <FitBoundary data={ibbaluruBoundary} />

        {/* IBBALURU WARD */}

        <GeoJSON
          data={ibbaluruBoundary}
          style={{
            color: "#b794f3",
            weight: 4,
            opacity: 0.9,
            fillColor: "#c4b5fd",
            fillOpacity: 0.15,
          }}
          onEachFeature={(feature, layer) => {
            layer.bindPopup(`
              <div style="padding:4px">
                <strong>${feature.properties.name}</strong>
                <br/>
                Ward ID: ${feature.properties.wardId}
              </div>
            `);
          }}
        />

        {/* VEHICLES ONLY */}

        {vehicles.map((vehicle) => (
          <VehicleMarker
            key={vehicle.id}
            vehicle={vehicle}
            onClick={setSelectedVehicle}
          />
        ))}
      </MapContainer>

      <VehicleInfoCard
        vehicle={selectedVehicle}
        onClose={() =>
          setSelectedVehicle(null)
        }
      />
    </div>
  );
}