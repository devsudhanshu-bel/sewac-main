import { useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  CircleMarker,
} from "react-leaflet";
import { Maximize2, X } from "lucide-react";

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
      icon
    </div>
  `,
  className: "",
  iconSize: [40, 40],
});

export default function WorkerRouteOverview() {
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  // Reusable map sub-component rendering logic
  const RenderMap = ({ heightClass }) => (
    <div className={`${heightClass} rounded-xl overflow-hidden transition-all duration-300`}>
      <MapContainer
        center={[12.952, 77.602]}
        zoom={13}
        scrollWheelZoom={isFullscreen} // Enable scroll zoom only in fullscreen mode
        zoomControl={isFullscreen}     // Enable zoom buttons (+/-) only in fullscreen mode
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* glow */}
        <Polyline positions={route1} pathOptions={{ color: "#34d399", weight: 8, opacity: 0.2 }} />
        <Polyline positions={route2} pathOptions={{ color: "#3b82f6", weight: 8, opacity: 0.2 }} />
        <Polyline positions={route3} pathOptions={{ color: "#8b5cf6", weight: 8, opacity: 0.2 }} />
        <Polyline positions={route4} pathOptions={{ color: "#ec4899", weight: 8, opacity: 0.2 }} />

        {/* actual route */}
        <Polyline positions={route1} pathOptions={{ color: "#10b981", weight: 4 }} />
        <Polyline positions={route2} pathOptions={{ color: "#3b82f6", weight: 4 }} />
        <Polyline positions={route3} pathOptions={{ color: "#8b5cf6", weight: 4 }} />
        <Polyline positions={route4} pathOptions={{ color: "#ec4899", weight: 4 }} />

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

        <Marker position={[12.9508, 77.5987]} icon={truckIcon} />
        <Marker position={[12.9695, 77.6238]} icon={truckIcon} />
      </MapContainer>
    </div>
  );

  return (
    <>
      {/* CARD CONTEXT VIEW */}
      <div 
        className="
          bg-white 
          rounded-[28px] 
          border 
          border-gray-100 
          shadow-[0_8px_30px_rgba(0,0,0,0.015)] 
          p-6
          h-[440px]
          flex 
          flex-col
          justify-between
          select-none
          animate-in 
          fade-in-0 
          slide-in-from-bottom-4 
          duration-700
        "
      >
        {/* Header Container Area */}
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-[15px] font-semibold text-slate-900 tracking-tight">
              Worker Route Overview (Live)
            </h3>
            <p className="text-[12px] font-medium text-slate-400 mt-0.5">
              Real-time tracking routing and metrics
            </p>
          </div>

          {/* Action Header controls mapping triggers */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(true)}
              className="flex items-center gap-1 border border-slate-200/80 bg-white text-slate-600 hover:text-slate-900 font-semibold text-[11px] px-2.5 py-1.5 rounded-[10px] shadow-sm transition-colors cursor-pointer outline-none"
            >
              <Maximize2 size={12} />
              <span>View Map</span>
            </button>
            <span className="border border-slate-100/60 bg-slate-50/50 text-slate-500 font-semibold text-[11px] px-2.5 py-1.5 rounded-[10px]">
              Live
            </span>
          </div>
        </div>

        {/* Standard Map Component Embedding */}
        <RenderMap heightClass="h-[160px] my-2" />

        {/* Metrics Grid Layout */}
        <div className="grid grid-cols-3 gap-x-4 gap-y-3 pt-3 border-t border-slate-100/60 shrink-0">
          <div>
            <p className="text-[11px] font-medium text-slate-400 tracking-tight">Distance</p>
            <p className="text-[13px] font-bold text-slate-900 mt-0.5 whitespace-nowrap">128.4 km</p>
          </div>

          <div>
            <p className="text-[11px] font-medium text-slate-400 tracking-tight">Duration</p>
            <p className="text-[13px] font-bold text-slate-900 mt-0.5 whitespace-nowrap">8h 34m</p>
          </div>

          <div>
            <p className="text-[11px] font-medium text-slate-400 tracking-tight">Avg Speed</p>
            <p className="text-[13px] font-bold text-slate-900 mt-0.5 whitespace-nowrap">15 km/h</p>
          </div>

          <div>
            <p className="text-[11px] font-medium text-slate-400 tracking-tight">Stops</p>
            <p className="text-[13px] font-bold text-slate-900 mt-0.5">28</p>
          </div>

          <div className="col-span-2">
            <p className="text-[11px] font-medium text-slate-400 tracking-tight">Collection Points</p>
            <p className="text-[13px] font-bold text-slate-900 mt-0.5">42</p>
          </div>
        </div>
      </div>

      {/* FULLSCREEN POPUP MODAL SCREEN OVERLAY */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 sm:p-6 select-none animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-5xl h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 flex items-center justify-between border-b border-slate-100 bg-white">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Detailed Worker Logistics Trajectory Mapping View
                </h3>
                <p className="text-xs font-medium text-slate-400 mt-0.5">
                  Full spatial monitoring control environment loop
                </p>
              </div>

              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all cursor-pointer border-none outline-none"
              >
                <X size={22} />
              </button>
            </div>

            {/* Immersive Map Container Canvas Area */}
            <div className="flex-1 w-full bg-slate-50 relative p-4">
              <RenderMap heightClass="h-full w-full shadow-inner border border-slate-100" />
            </div>

            {/* Modal Expanded Footer Panel */}
            <div className="bg-slate-50/50 p-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-5 gap-4 text-left">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Distance</p>
                <p className="text-base font-black text-slate-900 mt-0.5">128.4 km</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Duration</p>
                <p className="text-base font-black text-slate-900 mt-0.5">8 hours 34 mins</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Speed</p>
                <p className="text-base font-black text-slate-900 mt-0.5">15 km/h</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Stops</p>
                <p className="text-base font-black text-slate-900 mt-0.5">28 Active Points</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Collection Nodes</p>
                <p className="text-base font-black text-slate-900 mt-0.5">42 Verified Logs</p>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}