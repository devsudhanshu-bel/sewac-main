import { useState, useMemo, useRef, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { 
  TrendingUp, 
  Heading, 
  TrendingDown,
  MoreVertical
} from "lucide-react";

import { activityTrendData } from "./mockData";

const OperationalTrendChart = () => {
  // Types: "line" | "increasing_ogive" | "decreasing_ogive"
  const [graphType, setGraphType] = useState("line");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dynamically transform data based on state selection
  const processedData = useMemo(() => {
    if (graphType === "line") return activityTrendData;

    const totalCollections = activityTrendData.reduce((sum, item) => sum + (item.collections || 0), 0);
    const totalIssues = activityTrendData.reduce((sum, item) => sum + (item.issues || 0), 0);

    let cumulativeCollections = 0;
    let cumulativeIssues = 0;

    return activityTrendData.map((item) => {
      const currentCollections = item.collections || 0;
      const currentIssues = item.issues || 0;

      if (graphType === "increasing_ogive") {
        cumulativeCollections += currentCollections;
        cumulativeIssues += currentIssues;
        return {
          ...item,
          collections: cumulativeCollections,
          issues: cumulativeIssues,
        };
      } else {
        const res = {
          ...item,
          collections: totalCollections - cumulativeCollections,
          issues: totalIssues - cumulativeIssues,
        };
        cumulativeCollections += currentCollections;
        cumulativeIssues += currentIssues;
        return res;
      }
    });
  }, [graphType]);

  const getChartTitle = () => {
    switch (graphType) {
      case "increasing_ogive":
        return "Operational Trend (Increasing Ogive)";
      case "decreasing_ogive":
        return "Operational Trend (Decreasing Ogive)";
      default:
        return "Operational Activity Trend";
    }
  };

  return (
    <div 
      className="dashboard-card trend-card" 
      style={{ 
        fontFamily: "sans-serif",
        backgroundColor: "#ffffff",
        padding: "24px",
        borderRadius: "24px",
        border: "1px solid #f3f4f6",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.03)"
      }}
    >
      {/* Header Container */}
      <div 
        className="card-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "24px"
        }}
      >
        <div>
          <h3 
            style={{ 
              fontFamily: "sans-serif", 
              margin: 0, 
              fontSize: "16px", 
              fontWeight: 600, 
              color: "#111827" 
            }}
          >
            {getChartTitle()}
          </h3>

          {/* Legend Items */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "6px",
              fontSize: "12px",
              color: "#6b7280",
              fontFamily: "sans-serif",
              fontWeight: 500
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#8b5cf6",
                  display: "inline-block",
                }}
              />
              Collections
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#ff4da6",
                  display: "inline-block",
                }}
              />
              Issues
            </div>
          </div>
        </div>

        {/* Configuration Actions */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center", position: "relative" }} ref={dropdownRef}>
          
          {/* Timeframe Pill */}
          <span 
            style={{ 
              fontFamily: "sans-serif", 
              fontSize: "12px", 
              fontWeight: 500, 
              color: "#6b7280",
              backgroundColor: "#f9fafb",
              padding: "4px 10px",
              borderRadius: "12px",
              border: "1px solid #f3f4f6"
            }}
          >
            Last 30 Days
          </span>

          {/* Three-Dot Action Trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: "none",
              border: "none",
              color: "#9ca3af",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              outline: "none"
            }}
          >
            <MoreVertical size={20} />
          </button>

          {/* Custom Popover Dropdown Menu (Horizontal Row via Lucide Icons) */}
          {isOpen && (
            <div
              style={{
                position: "absolute",
                top: "34px",
                right: "0",
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                padding: "6px",
                zIndex: 50,
                display: "flex",
                flexDirection: "row",
                gap: "4px"
              }}
            >
              {[
                { 
                  id: "line", 
                  label: "Standard Line Chart", 
                  icon: TrendingUp 
                },
                { 
                  id: "increasing_ogive", 
                  label: "Increasing Ogive Curve", 
                  icon: Heading 
                },
                { 
                  id: "decreasing_ogive", 
                  label: "Decreasing Ogive Curve", 
                  icon: TrendingDown 
                }
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
                      borderRadius: "8px",
                      cursor: "pointer",
                      outline: "none",
                      transition: "background-color 0.2s"
                    }}
                  >
                    <IconComponent 
                      size={18} 
                      style={{
                        color: isSelected ? "#8b5cf6" : "#6b7280",
                        transition: "color 0.2s"
                      }}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Chart Container */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={processedData}
          margin={{
            top: 10,
            right: 10,
            left: -15,
            bottom: 0,
          }}
        >
          <CartesianGrid stroke="#f3f4f6" vertical={false} />

          <XAxis 
            dataKey="day" 
            tickLine={false}
            axisLine={false}
            dy={10}
            tick={{ fontFamily: "sans-serif", fontSize: 12, fill: "#9ca3af" }}
          />

          <YAxis 
            tickLine={false}
            axisLine={false}
            dx={-5}
            tick={{ fontFamily: "sans-serif", fontSize: 12, fill: "#9ca3af" }}
          />

          <Tooltip 
            wrapperStyle={{ fontFamily: "sans-serif" }}
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              fontSize: "12px"
            }}
          />

          <Line
            type="monotone"
            dataKey="collections"
            stroke="#8b5cf6"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: "#ffffff", stroke: "#8b5cf6" }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />

          <Line
            type="monotone"
            dataKey="issues"
            stroke="#ff4da6"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: "#ffffff", stroke: "#ff4da6" }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>  
    </div>
  );
};

export default OperationalTrendChart;