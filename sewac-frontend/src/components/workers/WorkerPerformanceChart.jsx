import { useState, useMemo, useRef, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { 
  TrendingUp, 
  Heading, 
  TrendingDown,
  MoreVertical
} from "lucide-react";

// Pulling safely from your authentic worker stats file source
import { performanceData } from "./workersData";

// Injecting hardware-accelerated menu animations directly into document header context
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes springMenuIn {
      0% { opacity: 0; transform: scale(0.92) translateY(-8px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
    .spring-menu-animate { 
      animation: springMenuIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; 
    }
  `;
  document.head.appendChild(styleSheet);
}

export default function WorkerPerformanceChart() {
  // Graph mutation states: "line" | "increasing_ogive" | "decreasing_ogive"
  const [graphType, setGraphType] = useState("line");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Auto-dismiss dropdown overlay card on outside window interaction click loops
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cumulative math translation layer calculating running metrics dynamically
  const processedData = useMemo(() => {
    if (!performanceData) return [];
    if (graphType === "line") return performanceData;

    const totalCollections = performanceData.reduce((sum, item) => sum + (item.collectionPoints || 0), 0);
    const totalWaste = performanceData.reduce((sum, item) => sum + (item.wasteCollected || 0), 0);

    let cumulativeCollections = 0;
    let cumulativeWaste = 0;

    return performanceData.map((item) => {
      const currentCollections = item.collectionPoints || 0;
      const currentWaste = item.wasteCollected || 0;

      if (graphType === "increasing_ogive") {
        cumulativeCollections += currentCollections;
        cumulativeWaste += currentWaste;
        return {
          ...item,
          collectionPoints: cumulativeCollections,
          wasteCollected: cumulativeWaste,
        };
      } else {
        const res = {
          ...item,
          collectionPoints: totalCollections - cumulativeCollections,
          wasteCollected: totalWaste - cumulativeWaste,
        };
        cumulativeCollections += currentCollections;
        cumulativeWaste += currentWaste;
        return res;
      }
    });
  }, [graphType]);

  const getChartTitle = () => {
    switch (graphType) {
      case "increasing_ogive":
        return "Worker Performance (Increasing Ogive)";
      case "decreasing_ogive":
        return "Worker Performance (Decreasing Ogive)";
      default:
        return "Worker Performance Overview";
    }
  };

  return (
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
        select-none
        animate-in 
        fade-in-0 
        slide-in-from-bottom-4 
        duration-700
      "
    >
      {/* Header Container Area */}
      <div className="flex items-center justify-between mb-5 shrink-0">
        <div>
          <h3 className="text-[15px] font-semibold text-slate-900 tracking-tight">
            {getChartTitle()}
          </h3>
          <p className="text-[12px] font-medium text-slate-400 mt-0.5">
            Collection points and waste collected
          </p>
        </div>

        {/* Configuration Dropdown Triggers */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center", position: "relative" }} ref={dropdownRef}>
          
          {/* Static Window Timeframe Indicator tag */}
          <span 
            className="border border-slate-100/60 bg-slate-50/50 text-slate-500 font-semibold text-[11px]"
            style={{ 
              padding: "5px 10px",
              borderRadius: "10px",
            }}
          >
            Last 30 Days
          </span>

          {/* Three-Dot Popover Action Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: "none",
              border: "none",
              color: isOpen ? "#6b7280" : "#9ca3af",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              outline: "none",
              backgroundColor: isOpen ? "#f3f4f6" : "transparent",
              transform: isOpen ? "rotate(90deg) scale(1.05)" : "rotate(0deg) scale(1)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            }}
          >
            <MoreVertical size={18} />
          </button>

          {/* Horizontal Action Popover Panel Component */}
          {isOpen && (
            <div
              className="spring-menu-animate"
              style={{
                position: "absolute",
                top: "36px",
                right: "0",
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "14px",
                boxShadow: "0 12px 30px -4px rgba(0, 0, 0, 0.08)",
                padding: "6px",
                zIndex: 50,
                display: "flex",
                flexDirection: "row",
                gap: "4px",
                transformOrigin: "top right"
              }}
            >
              {[
                { id: "line", label: "Standard Line Chart", icon: TrendingUp },
                { id: "increasing_ogive", label: "Increasing Ogive Curve", icon: Heading },
                { id: "decreasing_ogive", label: "Decreasing Ogive Curve", icon: TrendingDown }
              ].map((option) => {
                const IconComponent = option.icon;
                const isSelected = graphType === option.id;
                
                return (
                  <button
                    key={option.id}
                    title={option.label}
                    onClick={() => {
                      setGraphType(option.id);
                      setIsOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "36px",
                      height: "36px",
                      backgroundColor: isSelected ? "#f3e8ff" : "transparent",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                      outline: "none",
                      transform: "scale(1)",
                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.92)"}
                    onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                  >
                    <IconComponent 
                      size={18} 
                      style={{
                        color: isSelected ? "#8b5cf6" : "#6b7280",
                        transform: isSelected ? "scale(1.05)" : "scale(1)",
                        transition: "all 0.2s"
                      }} 
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Legend Identification rows mapping baseline categories */}
      <div className="flex items-center gap-6 mb-5 shrink-0 pl-0.5">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-600 transition-transform duration-300 group-hover:scale-125" />
          <span className="text-[12px] font-medium text-slate-500 transition-colors duration-300 group-hover:text-slate-800">
            Collection Points
          </span>
        </div>

        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-2.5 h-2.5 rounded-full bg-pink-500 transition-transform duration-300 group-hover:scale-125" />
          <span className="text-[12px] font-medium text-slate-500 transition-colors duration-300 group-hover:text-slate-800">
            Waste Collected
          </span>
        </div>
      </div>

      {/* Vector Line Chart Canvas Viewport */}
      <div className="flex-1 w-full min-h-0 text-[11px] font-medium">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={processedData}
            margin={{ top: 5, right: 10, left: -24, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94a3b8", fontWeight: 500 }}
              dy={8}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94a3b8", fontWeight: 500 }}
              dx={-6}
            />

            <Tooltip 
              content={<CustomChartTooltip />}
              cursor={{ stroke: "#e2e8f0", strokeWidth: 1, strokeDasharray: "4 4" }}
            />

            <Line
              type="monotone"
              dataKey="collectionPoints"
              stroke="#7C3AED"
              strokeWidth={3}
              dot={{ r: 4, fill: "#ffffff", stroke: "#7C3AED", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#7C3AED", stroke: "#ffffff", strokeWidth: 2 }}
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="cubic-bezier(0.34, 1.56, 0.64, 1)"
            />

            <Line
              type="monotone"
              dataKey="wasteCollected"
              stroke="#EC4899"
              strokeWidth={3}
              dot={{ r: 4, fill: "#ffffff", stroke: "#EC4899", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#EC4899", stroke: "#ffffff", strokeWidth: 2 }}
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="cubic-bezier(0.34, 1.56, 0.64, 1)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* SUB-COMPONENT: Modern Micro-Tooltip overlay card mapping indices parameters cleanly */
function CustomChartTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-[0_12px_30px_rgba(15,23,42,0.06)] animate-in fade-in-0 zoom-in-95 duration-150 flex flex-col gap-1.5">
        <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400 border-b border-slate-50 pb-1 mb-0.5">
          {label} Overview
        </p>
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center gap-5 justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-600 text-[12px] font-medium">
                {entry.name === "collectionPoints" ? "Collection Points" : "Waste Collected"}
              </span>
            </div>
            <span className="text-slate-900 text-[12px] font-bold">
              {entry.value.toLocaleString()}{entry.name === "wasteCollected" ? " Tons" : ""}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}