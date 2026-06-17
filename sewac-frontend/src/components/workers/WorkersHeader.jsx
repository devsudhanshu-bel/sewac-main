import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Download,
  Filter,
  Check,
} from "lucide-react";

// Mock options datasets for the dashboard filter criteria
const FILTER_OPTIONS = {
  area: ["All Areas", "North Zone", "South Zone", "East Zone", "West Zone", "Central Core"],
  worker: ["All Workers", "Ramesh Kumar", "Suresh Babu", "Mahesh P.", "Shankar R.", "Ravi Kumar"],
  vehicle: ["All Vehicles", "Compactor Truck 01", "Dumper Placer 04", "Auto Tipper 09", "Mini Tipper 12"],
  dateRange: ["Today", "Yesterday", "This Week", "Last Week", "This Month", "Custom Range"]
};

export default function WorkersHeader() {
  // Global active filter state values tracking
  const [filters, setFilters] = useState({
    area: "All Areas",
    worker: "All Workers",
    vehicle: "All Vehicles",
    dateRange: "This Week"
  });

  // Independent open popover tracker string ('area' | 'worker' | 'vehicle' | 'dateRange' | null)
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  const containerRef = useRef(null);

  // Hook targeting clicks hitting outside the entire operational filter wrapper bounding container
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (type) => {
    setActiveDropdown(activeDropdown === type ? null : type);
  };

  const handleSelectOption = (type, option) => {
    setFilters(prev => ({ ...prev, [type]: option }));
    setActiveDropdown(null);
  };

  return (
    <div 
      className="
        space-y-6 
        select-none 
        animate-in 
        fade-in-0 
        slide-in-from-top-4 
        duration-700 
        ease-[cubic-bezier(0.16,1,0.3,1)]
      "
    >
      {/* Page Heading Typography Context */}
      <div>
        <h1 className="text-[30px] font-black tracking-tight text-slate-900">
          Workers Dashboard
        </h1>
        <p className="text-sm font-medium text-slate-400 mt-0.5">
          Monitor workforce performance and collection activities
        </p>
      </div>

      {/* Control Actions Row Core Wrapper */}
      <div className="flex items-center justify-between flex-wrap gap-4" ref={containerRef}>
        
        {/* Dynamic Filter Triggers Group */}
        <div className="flex items-center gap-4 flex-wrap flex-1 min-w-0">

          {/* 1. AREA DROPDOWN FILTER ELEMENT */}
          <div className="relative flex-1 sm:flex-none min-w-[180px]">
            <div 
              onClick={() => toggleDropdown("area")}
              className={`
                bg-white border rounded-2xl px-4 h-14 flex items-center justify-between shadow-[0_4px_12px_rgba(15,23,42,0.015)] 
                cursor-pointer group transition-all duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.98]
                ${activeDropdown === "area" ? "border-purple-400 ring-2 ring-purple-100 -translate-y-0.5 shadow-[0_8px_20px_rgba(15,23,42,0.04)]" : "border-slate-100/90 hover:border-slate-200/80 hover:shadow-[0_8px_20px_rgba(15,23,42,0.04)]"}
              `}
            >
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">Area</p>
                <p className="text-[13px] font-semibold text-slate-800">{filters.area}</p>
              </div>
              <ChevronDown 
                size={16} 
                className={`text-slate-400 transition-transform duration-300 ease-out ${activeDropdown === "area" ? "rotate-180 text-purple-500" : "group-hover:translate-y-0.5"}`} 
              />
            </div>
            {activeDropdown === "area" && (
              <DropdownMenu type="area" current={filters.area} options={FILTER_OPTIONS.area} onSelect={handleSelectOption} />
            )}
          </div>

          {/* 2. WORKER DROPDOWN FILTER ELEMENT */}
          <div className="relative flex-1 sm:flex-none min-w-[180px]">
            <div 
              onClick={() => toggleDropdown("worker")}
              className={`
                bg-white border rounded-2xl px-4 h-14 flex items-center justify-between shadow-[0_4px_12px_rgba(15,23,42,0.015)] 
                cursor-pointer group transition-all duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.98]
                ${activeDropdown === "worker" ? "border-purple-400 ring-2 ring-purple-100 -translate-y-0.5 shadow-[0_8px_20px_rgba(15,23,42,0.04)]" : "border-slate-100/90 hover:border-slate-200/80 hover:shadow-[0_8px_20px_rgba(15,23,42,0.04)]"}
              `}
            >
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">Worker</p>
                <p className="text-[13px] font-semibold text-slate-800">{filters.worker}</p>
              </div>
              <ChevronDown 
                size={16} 
                className={`text-slate-400 transition-transform duration-300 ease-out ${activeDropdown === "worker" ? "rotate-180 text-purple-500" : "group-hover:translate-y-0.5"}`} 
              />
            </div>
            {activeDropdown === "worker" && (
              <DropdownMenu type="worker" current={filters.worker} options={FILTER_OPTIONS.worker} onSelect={handleSelectOption} />
            )}
          </div>

          {/* 3. VEHICLE DROPDOWN FILTER ELEMENT */}
          <div className="relative flex-1 sm:flex-none min-w-[180px]">
            <div 
              onClick={() => toggleDropdown("vehicle")}
              className={`
                bg-white border rounded-2xl px-4 h-14 flex items-center justify-between shadow-[0_4px_12px_rgba(15,23,42,0.015)] 
                cursor-pointer group transition-all duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.98]
                ${activeDropdown === "vehicle" ? "border-purple-400 ring-2 ring-purple-100 -translate-y-0.5 shadow-[0_8px_20px_rgba(15,23,42,0.04)]" : "border-slate-100/90 hover:border-slate-200/80 hover:shadow-[0_8px_20px_rgba(15,23,42,0.04)]"}
              `}
            >
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">Vehicle</p>
                <p className="text-[13px] font-semibold text-slate-800">{filters.vehicle}</p>
              </div>
              <ChevronDown 
                size={16} 
                className={`text-slate-400 transition-transform duration-300 ease-out ${activeDropdown === "vehicle" ? "rotate-180 text-purple-500" : "group-hover:translate-y-0.5"}`} 
              />
            </div>
            {activeDropdown === "vehicle" && (
              <DropdownMenu type="vehicle" current={filters.vehicle} options={FILTER_OPTIONS.vehicle} onSelect={handleSelectOption} />
            )}
          </div>

          {/* 4. DATE RANGE DROPDOWN FILTER ELEMENT */}
          <div className="relative flex-1 sm:flex-none min-w-[180px]">
            <div 
              onClick={() => toggleDropdown("dateRange")}
              className={`
                bg-white border rounded-2xl px-4 h-14 flex items-center justify-between shadow-[0_4px_12px_rgba(15,23,42,0.015)] 
                cursor-pointer group transition-all duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.98]
                ${activeDropdown === "dateRange" ? "border-purple-400 ring-2 ring-purple-100 -translate-y-0.5 shadow-[0_8px_20px_rgba(15,23,42,0.04)]" : "border-slate-100/90 hover:border-slate-200/80 hover:shadow-[0_8px_20px_rgba(15,23,42,0.04)]"}
              `}
            >
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">Date Range</p>
                <p className="text-[13px] font-semibold text-slate-800">{filters.dateRange}</p>
              </div>
              <ChevronDown 
                size={16} 
                className={`text-slate-400 transition-transform duration-300 ease-out ${activeDropdown === "dateRange" ? "rotate-180 text-purple-500" : "group-hover:translate-y-0.5"}`} 
              />
            </div>
            {activeDropdown === "dateRange" && (
              <DropdownMenu type="dateRange" current={filters.dateRange} options={FILTER_OPTIONS.dateRange} onSelect={handleSelectOption} />
            )}
          </div>

          {/* More Secondary Extra Filters Action */}
          <button 
            className="
              h-14 px-5 rounded-2xl bg-white border border-slate-100 text-[13px] font-bold text-slate-600
              shadow-[0_4px_12px_rgba(15,23,42,0.015)] flex items-center gap-2 outline-none transition-all duration-300
              hover:bg-slate-50/60 hover:text-slate-900 hover:border-slate-200 active:scale-95
            "
          >
            <Filter size={15} className="text-slate-400" />
            More Filters
          </button>

        </div>

        {/* Global Dataset CSV Export Button */}
        <button 
          className="
            h-14 px-6 rounded-2xl border border-pink-200 bg-pink-50/10 text-pink-500 text-[14px] font-bold
            flex items-center gap-2 outline-none transition-all duration-300 hover:bg-pink-50 hover:border-pink-300
            hover:shadow-[0_10px_20px_rgba(236,72,153,0.06)] active:scale-[0.97] group
          "
        >
          <Download size={16} className="transition-transform duration-300 group-hover:translate-y-[-1px]" />
          Export Report
        </button>

      </div>
    </div>
  );
}

/* SUB-COMPONENT: Reusable Layer Popover Options Overlay Menu */
function DropdownMenu({ type, current, options, onSelect }) {
  return (
    <div 
      className="
        absolute left-0 top-[62px] w-full min-w-[220px] bg-white border border-slate-100 rounded-2xl 
        p-1.5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] z-50 flex flex-col gap-0.5 origin-top
        animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200 ease-out
      "
    >
      {options.map((option) => {
        const isSelected = current === option;
        return (
          <button
            key={option}
            onClick={() => onSelect(type, option)}
            className={`
              w-full h-10 px-3 rounded-xl flex items-center justify-between text-left text-[13px] font-medium
              transition-all duration-150 outline-none
              ${isSelected ? "bg-purple-50 text-purple-600 font-semibold" : "text-slate-600 hover:bg-slate-50/80 hover:text-slate-900"}
            `}
          >
            <span className="truncate">{option}</span>
            {isSelected && <Check size={14} className="text-purple-500 shrink-0 ml-2" />}
          </button>
        );
      })}
    </div>
  );
}