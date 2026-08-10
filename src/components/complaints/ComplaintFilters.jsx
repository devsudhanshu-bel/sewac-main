import {
  Search,
  CalendarDays,
  RotateCcw,
  ChevronDown,
} from "lucide-react";

export default function ComplaintFilters() {
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
      {/* ================= TOP ROW ================= */}

      <div className="flex items-center gap-3">

        {/* Search */}

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

        {/* Status */}

        <FilterSelect
          label="Status"
          options={[
            "All",
            "Pending",
            "In Progress",
            "Resolved",
          ]}
        />

        {/* Category */}

        <FilterSelect
          label="Category"
          options={[
            "All",
            "Solid Waste",
            "Drainage",
            "Road",
            "Street Light",
          ]}
        />

        {/* Assigned To */}

        <FilterSelect
          label="Assigned To"
          options={[
            "All",
            "Ramesh K.",
            "Suresh M.",
            "Mahesh T.",
          ]}
        />
      </div>

      {/* ================= BOTTOM ROW ================= */}

      <div className="flex items-center gap-3 mt-3">

        {/* Date Range */}

        <button
          className="
            h-9
            w-[220px]
            rounded-lg
            border
            border-gray-200
            bg-white
            px-3
            flex
            items-center
            gap-2
            text-left
            hover:border-violet-400
            transition
          "
        >
          <CalendarDays
            size={14}
            className="text-gray-500 shrink-0"
          />

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-gray-600">
              01 Jul 2026
            </span>

            <span className="text-[10px] text-gray-400">
              –
            </span>

            <span className="text-[10px] font-medium text-gray-600">
              31 Jul 2026
            </span>
          </div>
        </button>

        {/* Reset */}

        <button
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

function FilterSelect({ label, options }) {
  return (
    <div className="relative w-[125px] shrink-0">

      <select
        defaultValue={options[0]}
        className="
          peer
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
          <option key={option} value={option}>
            {option}
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