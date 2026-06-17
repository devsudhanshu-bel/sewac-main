  import { useState, useRef, useEffect } from "react";
  import {
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    ResponsiveContainer,
  } from "recharts";
  import { PieChart, BarChart3, MoreVertical } from "lucide-react";

  const data = [
    { name: "Collection Logging", value: 58, color: "#ff4da6" },
    { name: "Issue Reporting", value: 17, color: "#8b5cf6" },
    { name: "RFID Verification", value: 12, color: "#f59e0b" },
    { name: "Citizen Verification", value: 8, color: "#3b82f6" },
    { name: "Profile Updates", value: 5, color: "#10b981" },
  ];

  const ActivityContribution = () => {
    const [viewType, setViewType] = useState("pie");
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const onPieEnter = (_, index) => setActiveIndex(index);
    const onPieLeave = () => setActiveIndex(null);

    return (
      <div 
        style={{ 
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          backgroundColor: "#ffffff",
          padding: "24px",
          borderRadius: "24px",
          border: "1px solid #f3f4f6",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)",
          boxSizing: "border-box",
          width: "100%",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Header Container */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px"
          }}
        >
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#111827", letterSpacing: "-0.01em" }}>
            Activity Contribution
          </h3>

          {/* Dropdown Controller */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center", position: "relative" }} ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              style={{
                background: "none",
                border: "none",
                color: "#9ca3af",
                cursor: "pointer",
                padding: "6px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                outline: "none",
                backgroundColor: isOpen ? "#f3f4f6" : "transparent",
                transition: "background-color 0.2s"
              }}
            >
              <MoreVertical size={18} />
            </button>

            {/* Action Popover */}
            {isOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "36px",
                  right: "0",
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "14px",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
                  padding: "6px",
                  zIndex: 50,
                  display: "flex",
                  flexDirection: "row",
                  gap: "4px"
                }}
              >
                {[
                  { id: "pie", label: "Donut View", icon: PieChart },
                  { id: "progress", label: "Progress Bars", icon: BarChart3 }
                ].map((view) => {
                  const IconComponent = view.icon;
                  const isSelected = viewType === view.id;

                  return (
                    <button
                      key={view.id}
                      title={view.label}
                      onClick={() => {
                        setViewType(view.id);
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
                        transition: "all 0.2s"
                      }}
                    >
                      <IconComponent 
                        size={18} 
                        style={{ color: isSelected ? "#8b5cf6" : "#6b7280" }} 
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        {viewType === "pie" ? (
          <>
            {/* Centered Large Donut Wrapper */}
            <div style={{ width: "100%", position: "relative", height: "180px", marginBottom: "20px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    innerRadius={62}
                    outerRadius={76}
                    stroke="#ffffff"
                    strokeWidth={2}
                    startAngle={90}
                    endAngle={-270}
                    onMouseEnter={onPieEnter}
                    onMouseLeave={onPieLeave}
                    style={{ cursor: 'pointer', outline: 'none' }}
                  >
                    {data.map((item, index) => (
                      <Cell
                        key={item.name}
                        fill={item.color}
                        style={{
                          opacity: activeIndex === null || activeIndex === index ? 1 : 0.4,
                          transform: activeIndex === index ? 'scale(1.03)' : 'scale(1)',
                          transformOrigin: 'center',
                          transition: "all 0.2s ease"
                        }}
                      />
                    ))}
                  </Pie>
                </RechartsPieChart>
              </ResponsiveContainer>

              {/* Inner Content Badge */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  pointerEvents: "none",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "28px",
                    fontWeight: 800,
                    color: activeIndex !== null ? data[activeIndex].color : "#111827",
                    lineHeight: "1",
                    transition: "color 0.15s ease"
                  }}
                >
                  {activeIndex !== null ? `${data[activeIndex].value}%` : "100%"}
                </h2>
                <span
                  style={{
                    color: "#9ca3af",
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginTop: "4px"
                  }}
                >
                  {activeIndex !== null ? "Share" : "Activity"}
                </span>
              </div>
            </div>

            {/* Clean Dashboard Legend Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "10px 16px",
                borderTop: "1px solid #f3f4f6",
                paddingTop: "16px"
              }}
            >
              {data.map((item, index) => {
                const isItemActive = activeIndex === index;
                return (
                  <div
                    key={item.name}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={onPieLeave}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "6px 10px",
                      borderRadius: "10px",
                      backgroundColor: isItemActive ? "#faf5ff" : "transparent",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: item.color,
                          flexShrink: 0
                        }}
                      />
                      <span 
                        style={{ 
                          fontSize: "13px", 
                          color: isItemActive ? "#111827" : "#4b5563", 
                          fontWeight: isItemActive ? 600 : 500,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}
                      >
                        {item.name}
                      </span>
                    </div>
                    <strong style={{ fontSize: "13px", color: "#111827", fontWeight: 700, marginLeft: "6px" }}>
                      {item.value}%
                    </strong>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* VIEW 2: Progress Bars (Unchanged Structure, Enhanced Margins) */
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              paddingTop: "8px"
            }}
          >
            {data.map((item) => (
              <div key={item.name} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ color: "#4b5563", fontWeight: 600 }}>{item.name}</span>
                  <span style={{ color: "#111827", fontWeight: 700 }}>{item.value}%</span>
                </div>
                <div 
                  style={{ 
                    width: "100%", 
                    height: "8px", 
                    backgroundColor: "#f3f4f6", 
                    borderRadius: "999px",
                    overflow: "hidden"
                  }}
                >
                  <div 
                    style={{ 
                      width: `${item.value}%`, 
                      height: "100%", 
                      backgroundColor: item.color, 
                      borderRadius: "999px",
                      transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  export default ActivityContribution;