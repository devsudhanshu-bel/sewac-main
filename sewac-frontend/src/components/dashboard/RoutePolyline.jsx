import { Polyline } from "react-leaflet";

export default function RoutePolyline({ route }) {
  return (
    <Polyline
      positions={route}
      pathOptions={{
        color: "#a78bfa", // lighter purple
        weight: 4,
        opacity: 0.65,
      }}
    />
  );
}