import {
  Search,
  CalendarDays,
  RotateCcw,
  ChevronDown,
} from "lucide-react";

export default function ComplaintFilters({
  filters,
  onFilterChange,
  onReset,
}) {
  return (
    <div
      className="
        w-full
        bg-white
        rounded-2xl
        border
        border-gray-100
        shadow-[0_6px_20px_rgba(15,23,42,0.04)]
        p-3
        sm:p-4
      "
    >
      {/* =====================================================
          TOP ROW
      ===================================================== */}

      <div
        className="
          flex
          flex-col
          gap-2.5
          sm:flex-row
          sm:items-center
          sm:gap-3
        "
      >
        {/* ===================================================
            SEARCH
        =================================================== */}

        <div className="relative flex-1 min-w-0">
          <Search
            size={14}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-gray-400
              pointer-events-none
            "
          />

          <input
            type="text"
            value={filters?.search || ""}
            onChange={(e) =>
              onFilterChange("search", e.target.value)
            }
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
              sm:text-[11px]
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

        {/* ===================================================
            CATEGORY
        =================================================== */}

        <div className="w-full sm:w-[150px] md:w-[160px] shrink-0">
          <FilterSelect
            label="Category"
            value={filters?.category || ""}
            onChange={(value) =>
              onFilterChange("category", value)
            }
            options={[
              {
                value: "",
                label: "All",
              },
              {
                value: "MISSED_COLLECTION",
                label: "Missed Collection",
              },
              {
                value: "OVERFLOWING_BIN",
                label: "Overflowing Bin",
              },
              {
                value: "ILLEGAL_DUMPING",
                label: "Illegal Dumping",
              },
              {
                value: "STREET_LITTER",
                label: "Street Litter",
              },
              {
                value: "DAMAGED_BIN",
                label: "Damaged Bin",
              },
              {
                value: "OTHER",
                label: "Other",
              },
            ]}
          />
        </div>
      </div>

      {/* =====================================================
          BOTTOM ROW
      ===================================================== */}

      <div
        className="
          flex
          flex-col
          gap-2.5
          mt-2.5
          sm:flex-row
          sm:flex-wrap
          sm:items-center
          sm:gap-3
          sm:mt-3
        "
      >
        {/* ===================================================
            DATE FROM
        =================================================== */}

        <div className="relative w-full sm:w-[150px] md:w-[160px] shrink-0">
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
            value={filters?.dateFrom || ""}
            onChange={(e) =>
              onFilterChange("dateFrom", e.target.value)
            }
            className="
              h-9
              w-full
              rounded-lg
              border
              border-gray-200
              bg-white
              pl-9
              pr-3
              text-[10px]
              sm:text-[11px]
              text-gray-600
              outline-none
              focus:border-violet-400
              focus:ring-2
              focus:ring-violet-100
              transition
            "
          />
        </div>

        {/* ===================================================
            TO LABEL
        =================================================== */}

        <span
          className="
            hidden
            sm:block
            text-[10px]
            text-gray-400
            shrink-0
          "
        >
          to
        </span>

        {/* ===================================================
            DATE TO
        =================================================== */}

        <div className="relative w-full sm:w-[150px] md:w-[160px] shrink-0">
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
            value={filters?.dateTo || ""}
            onChange={(e) =>
              onFilterChange("dateTo", e.target.value)
            }
            className="
              h-9
              w-full
              rounded-lg
              border
              border-gray-200
              bg-white
              pl-9
              pr-3
              text-[10px]
              sm:text-[11px]
              text-gray-600
              outline-none
              focus:border-violet-400
              focus:ring-2
              focus:ring-violet-100
              transition
            "
          />
        </div>

        {/* ===================================================
            RESET FILTERS
        =================================================== */}

        <button
          type="button"
          onClick={onReset}
          className="
            h-9
            w-full
            sm:w-auto
            px-3
            rounded-lg
            border
            border-gray-200
            bg-white
            flex
            items-center
            justify-center
            gap-2
            text-[10px]
            sm:text-[11px]
            font-semibold
            text-gray-500
            hover:border-violet-300
            hover:text-violet-600
            hover:bg-violet-50
            active:scale-[0.98]
            transition
            shrink-0
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

function FilterSelect({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div className="relative w-full">
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
          sm:text-[11px]
          font-medium
          text-[#16295A]
          outline-none
          focus:border-violet-400
          focus:ring-2
          focus:ring-violet-100
          transition
          cursor-pointer
        "
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {/* ===================================================
          FLOATING LABEL
      =================================================== */}

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
          leading-none
        "
      >
        {label}
      </span>

      {/* ===================================================
          DROPDOWN ICON
      =================================================== */}

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