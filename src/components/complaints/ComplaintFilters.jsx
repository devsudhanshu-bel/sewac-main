import { Search, CalendarDays, RotateCcw, ChevronDown } from "lucide-react";

export default function ComplaintFilters({ filters, onFilterChange, onReset }) {
  return (
    <div
      className="
        w-full
        bg-white
        rounded-2xl
        border
        border-gray-100
        shadow-[0_6px_20px_rgba(15,23,42,0.04)]
        p-4
      "
    >
      {/* =====================================================
          TOP ROW
      ===================================================== */}

      <div className="flex items-center gap-3">
        {/* ================= SEARCH ================= */}

        <div className="relative flex-1">
          <Search
            size={14}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder="Search by ticket, phone, title, address..."
            className="
              w-full
              h-9
              rounded-lg
              border
              border-gray-200
              bg-white
              pl-9
              pr-3
              text-[10px]
              text-[#16295A]
              outline-none
              placeholder:text-gray-400
              focus:border-violet-400
              focus:ring-2
              focus:ring-violet-100
              transition
            "
          />
        </div>

        {/* ================= STATUS ================= */}

        <FilterSelect
          label="Status"
          value={filters.status}
          onChange={(value) => onFilterChange("status", value)}
          options={[
            {
              value: "",
              label: "All",
            },
            {
              value: "PENDING",
              label: "Pending",
            },
            {
              value: "READY_FOR_VERIFICATION",
              label: "Ready for Verification",
            },
            {
              value: "OTP_SENT",
              label: "OTP Sent",
            },
            {
              value: "CLOSED",
              label: "Closed",
            },
          ]}
        />

        {/* ================= CATEGORY ================= */}

        <FilterSelect
          label="Category"
          value={filters.category}
          onChange={(value) => onFilterChange("category", value)}
          options={[
            {
              value: "",
              label: "All",
            },
            {
              value: "SOLID_WASTE",
              label: "Solid Waste",
            },
            {
              value: "DRAINAGE",
              label: "Drainage",
            },
            {
              value: "ROAD",
              label: "Road",
            },
            {
              value: "STREET_LIGHT",
              label: "Street Light",
            },
          ]}
        />
      </div>

      {/* =====================================================
          BOTTOM ROW
      ===================================================== */}

      <div className="flex items-center gap-3 mt-3">
        {/* ================= DATE FROM ================= */}

        <div className="relative">
          <CalendarDays
            size={14}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-gray-500
              pointer-events-none
            "
          />

          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onFilterChange("dateFrom", e.target.value)}
            className="
              h-9
              w-[150px]
              rounded-lg
              border
              border-gray-200
              bg-white
              pl-9
              pr-3
              text-[10px]
              text-gray-600
              outline-none
              focus:border-violet-400
              focus:ring-2
              focus:ring-violet-100
            "
          />
        </div>

        <span className="text-[10px] text-gray-400">to</span>

        {/* ================= DATE TO ================= */}

        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => onFilterChange("dateTo", e.target.value)}
          className="
            h-9
            w-[150px]
            rounded-lg
            border
            border-gray-200
            bg-white
            px-3
            text-[10px]
            text-gray-600
            outline-none
            focus:border-violet-400
            focus:ring-2
            focus:ring-violet-100
          "
        />

        {/* ================= RESET ================= */}

        <button
          type="button"
          onClick={onReset}
          className="
            h-9
            px-3
            rounded-lg
            border
            border-gray-200
            bg-white
            flex
            items-center
            gap-2
            text-[10px]
            font-semibold
            text-gray-500
            hover:border-violet-300
            hover:text-violet-600
            hover:bg-violet-50
            transition
          "
        >
          <RotateCcw size={13} />
          Reset Filters
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   FILTER SELECT
========================================================= */

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="relative w-[150px] shrink-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          h-9
          appearance-none
          rounded-lg
          border
          border-gray-200
          bg-white
          px-3
          pt-2
          pr-8
          text-[10px]
          font-medium
          text-[#16295A]
          outline-none
          focus:border-violet-400
          focus:ring-2
          focus:ring-violet-100
          transition
        "
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Floating label */}

      <span
        className="
          absolute
          left-3
          top-[3px]
          text-[8px]
          font-medium
          text-gray-500
          pointer-events-none
          bg-white
          px-0.5
        "
      >
        {label}
      </span>

      <ChevronDown
        size={12}
        className="
          absolute
          right-3
          top-1/2
          -translate-y-1/2
          text-gray-500
          pointer-events-none
        "
      />
    </div>
  );
}
