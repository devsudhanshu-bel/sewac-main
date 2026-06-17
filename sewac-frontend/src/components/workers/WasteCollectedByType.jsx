import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

import { wasteTypeData } from "./workersData";

const COLORS = [
  "#7C3AED", // Purple
  "#EC4899", // Pink
  "#10B981", // Emerald
  "#F59E0B", // Amber
];

export default function WasteCollectedByType() {
  // State hook managing the active segment index for synchronous visual cross-hovering
  const [activeIndex, setActiveIndex] = useState(null);

  const onPieEnter = (_, index) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(null);

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
        justify-between
        select-none
        animate-in 
        fade-in-0 
        slide-in-from-bottom-4 
        duration-700
      "
    >
      {/* Header Container Area */}
      <div className="shrink-0">
        <h3 className="text-[15px] font-semibold text-slate-900 tracking-tight">
          Waste Collected by Type
        </h3>
        <p className="text-[12px] font-medium text-slate-400 mt-0.5">
          Distribution of collected waste
        </p>
      </div>

      {/* Donut Container with Center Text Badging */}
      <div className="h-[210px] w-full relative flex items-center justify-center my-2 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={wasteTypeData}
              innerRadius={68}
              outerRadius={84}
              paddingAngle={4}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              style={{ cursor: "pointer", outline: "none" }}
            >
              {wasteTypeData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  style={{
                    opacity: activeIndex === null || activeIndex === index ? 1 : 0.4,
                    transform: activeIndex === index ? "scale(1.04)" : "scale(1)",
                    transformOrigin: "center",
                    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
                  }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Floating Center Data Summary Micro-badge */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{ transform: "translateY(2px)" }}
        >
          <span 
            className="text-[26px] font-black text-slate-800 tracking-tight transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            style={{ 
              color: activeIndex !== null ? COLORS[activeIndex % COLORS.length] : "#1e293b",
              transform: activeIndex !== null ? "scale(1.06)" : "scale(1)"
            }}
          >
            {activeIndex !== null ? `${wasteTypeData[activeIndex].value}%` : "100%"}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-0.5">
            {activeIndex !== null ? "Share" : "Total"}
          </span>
        </div>
      </div>

      {/* Legend Container System */}
      <div className="flex-1 flex flex-col justify-end space-y-1 pl-0.5">
        {wasteTypeData.map((item, index) => {
          const isItemActive = activeIndex === index;
          return (
            <div
              key={item.name}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={onPieLeave}
              className="flex items-center justify-between py-1.5 px-2.5 rounded-xl transition-all duration-200 ease-out cursor-pointer"
              style={{
                backgroundColor: isItemActive ? "#f8fafc" : "transparent",
                transform: isItemActive ? "translateX(4px)" : "translateX(0)",
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Micro Color Indicator Dot with spring response */}
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-200"
                  style={{
                    backgroundColor: COLORS[index % COLORS.length],
                    transform: isItemActive ? "scale(1.25)" : "scale(1)"
                  }}
                />
                <span 
                  className="text-[13px] font-medium truncate transition-colors duration-200"
                  style={{ color: isItemActive ? "#1e293b" : "#64748b" }}
                >
                  {item.name}
                </span>
              </div>

              <span 
                className="text-[13px] font-bold text-slate-800 transition-all duration-200"
                style={{ color: isItemActive ? COLORS[index % COLORS.length] : "#1e293b" }}
              >
                {item.value}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}