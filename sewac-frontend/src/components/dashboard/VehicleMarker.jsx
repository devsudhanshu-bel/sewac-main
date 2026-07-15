import L from "leaflet";
import { Marker } from "react-leaflet";
import { renderToString } from "react-dom/server";
import { MdLocalShipping } from "react-icons/md";

function createTruckIcon(color = "#60a5fa") {
  return L.divIcon({
    html: `
      <div style="
        position:relative;
        width:44px;
        height:44px;
        border-radius:50%;
        background:white;
        display:flex;
        align-items:center;
        justify-content:center;
        border:3px solid ${color};
        box-shadow:0 6px 16px rgba(0,0,0,0.12);
      ">
        <div style="
          position:absolute;
          top:2px;
          right:2px;
          width:10px;
          height:10px;
          border-radius:50%;
          background:#22c55e;
          border:2px solid white;
        "></div>

        ${renderToString(
          <MdLocalShipping
            size={20}
            color={color}
          />
        )}
      </div>
    `,
    className: "",
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}

export default function VehicleMarker({
  vehicle,
  onClick,
  color = "#60a5fa", // Default Blue
}) {
  return (
    <Marker
      position={vehicle.position}
      icon={createTruckIcon(color)}
      eventHandlers={{
        click: () => onClick(vehicle),
      }}
    />
  );
}