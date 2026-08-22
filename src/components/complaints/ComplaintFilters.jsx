import {
  Search,
  CalendarDays,
  RotateCcw,
  ChevronDown,
} from "lucide-react";

import { useLanguage } from "../../i18n/LanguageContext";

export default function ComplaintFilters({
  filters,
  onFilterChange,
  onReset,
}) {
  const { t } = useLanguage();

  const categoryOptions = [
    {
      value: "",
      label: t("complaints.filters.all"),
    },
    {
      value: "MISSED_COLLECTION",
      label: t("complaints.filters.categories.missedCollection"),
    },
    {
      value: "OVERFLOWING_BIN",
      label: t("complaints.filters.categories.overflowingBin"),
    },
    {
      value: "ILLEGAL_DUMPING",
      label: t("complaints.filters.categories.illegalDumping"),
    },
    {
      value: "STREET_LITTER",
      label: t("complaints.filters.categories.streetLitter"),
    },
    {
      value: "DAMAGED_BIN",
      label: t("complaints.filters.categories.damagedBin"),
    },
    {
      value: "OTHER",
      label: t("complaints.filters.categories.other"),
    },
  ];

  return (
    <div
      className="
        w-full
        rounded-2xl
        border
        border-gray-100
        bg-white
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

        <div className="relative min-w-0 flex-1">
          <Search
            size={14}
            className="
              pointer-events-none
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            type="text"
            value={filters?.search || ""}
            onChange={(e) =>
              onFilterChange("search", e.target.value)
            }
            placeholder={t(
              "complaints.filters.searchPlaceholder"
            )}
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
              text-[#16295A]
              outline-none
              transition
              placeholder:text-gray-400
              focus:border-violet-400
              focus:ring-2
              focus:ring-violet-100

              sm:text-[11px]
            "
          />
        </div>

        {/* ===================================================
            CATEGORY
        =================================================== */}

        <div className="w-full shrink-0 sm:w-[150px] md:w-[160px]">
          <FilterSelect
            label={t("complaints.filters.category")}
            value={filters?.category || ""}
            onChange={(value) =>
              onFilterChange("category", value)
            }
            options={categoryOptions}
          />
        </div>
      </div>

      {/* =====================================================
          BOTTOM ROW
      ===================================================== */}

      <div
        className="
          mt-2.5
          flex
          flex-col
          gap-2.5

          sm:mt-3
          sm:flex-row
          sm:flex-wrap
          sm:items-center
          sm:gap-3
        "
      >
        {/* ===================================================
            DATE FROM
        =================================================== */}

        <div className="relative w-full shrink-0 sm:w-[150px] md:w-[160px]">
          <CalendarDays
            size={14}
            className="
              pointer-events-none
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-gray-500
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
              text-gray-600
              outline-none
              transition
              focus:border-violet-400
              focus:ring-2
              focus:ring-violet-100

              sm:text-[11px]
            "
          />
        </div>

        {/* ===================================================
            TO LABEL
        =================================================== */}

        <span
          className="
            hidden
            shrink-0
            text-[10px]
            text-gray-400

            sm:block
          "
        >
          {t("complaints.filters.to")}
        </span>

        {/* ===================================================
            DATE TO
        =================================================== */}

        <div className="relative w-full shrink-0 sm:w-[150px] md:w-[160px]">
          <CalendarDays
            size={14}
            className="
              pointer-events-none
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-gray-500
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
              text-gray-600
              outline-none
              transition
              focus:border-violet-400
              focus:ring-2
              focus:ring-violet-100

              sm:text-[11px]
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
            flex
            h-9
            w-full
            shrink-0
            items-center
            justify-center
            gap-2
            rounded-lg
            border
            border-gray-200
            bg-white
            px-3
            text-[10px]
            font-semibold
            text-gray-500
            transition
            hover:border-violet-300
            hover:bg-violet-50
            hover:text-violet-600
            active:scale-[0.98]

            sm:w-auto
            sm:text-[11px]
          "
        >
          <RotateCcw size={13} />

          {t("complaints.filters.reset")}
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
          h-9
          w-full
          cursor-pointer
          appearance-none
          rounded-lg
          border
          border-gray-200
          bg-white
          px-3
          pr-8
          pt-2
          text-[10px]
          font-medium
          text-[#16295A]
          outline-none
          transition
          focus:border-violet-400
          focus:ring-2
          focus:ring-violet-100

          sm:text-[11px]
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
          pointer-events-none
          absolute
          left-3
          top-[3px]
          bg-white
          px-0.5
          text-[8px]
          font-medium
          leading-none
          text-gray-500
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
          pointer-events-none
          absolute
          right-3
          top-1/2
          -translate-y-1/2
          text-gray-500
        "
      />
    </div>
  );
}