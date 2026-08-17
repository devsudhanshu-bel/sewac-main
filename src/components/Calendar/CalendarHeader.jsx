import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { motion } from "framer-motion";

import { monthLabel } from "./calendarUtils";

export default function CalendarHeader({
  currentMonth,
  onPrevious,
  onNext,
}) {
  return (
    <div
      className="
        relative
        w-full
        min-h-[112px]
        px-5
        pt-5
        pb-4
        pr-[68px]
        bg-gradient-to-r
        from-violet-50/70
        via-white
        to-fuchsia-50/70
        border-b
        border-violet-100
        flex
        items-center
        justify-between
        gap-3
      "
    >
      {/* =====================================================
          PREVIOUS MONTH
      ===================================================== */}

      <button
        type="button"
        onClick={onPrevious}
        aria-label="Previous month"
        className="
          group
          w-9
          h-9
          shrink-0
          rounded-xl
          bg-white
          border
          border-violet-100
          flex
          items-center
          justify-center
          shadow-sm
          transition-all
          duration-300
          hover:scale-105
          hover:bg-violet-600
          hover:border-violet-600
        "
      >
        <ChevronLeft
          size={17}
          strokeWidth={2}
          className="
            text-violet-600
            transition-colors
            duration-300
            group-hover:text-white
          "
        />
      </button>

      {/* =====================================================
          MONTH
      ===================================================== */}

      <motion.div
        key={monthLabel(currentMonth)}
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.25,
        }}
        className="
          flex-1
          min-w-0
          text-center
        "
      >
        <h2
          className="
            text-[20px]
            leading-tight
            font-bold
            tracking-tight
            text-slate-900
            whitespace-nowrap
          "
        >
          {monthLabel(currentMonth)}
        </h2>

        <p
          className="
            mt-1
            text-[12px]
            text-violet-500
            font-medium
          "
        >
          Choose a date
        </p>
      </motion.div>

      {/* =====================================================
          NEXT MONTH

          This is deliberately kept LEFT of the close
          button because the header reserves right-side
          space for the X.
      ===================================================== */}

      <button
        type="button"
        onClick={onNext}
        aria-label="Next month"
        className="
          group
          w-9
          h-9
          shrink-0
          rounded-xl
          bg-white
          border
          border-violet-100
          flex
          items-center
          justify-center
          shadow-sm
          transition-all
          duration-300
          hover:scale-105
          hover:bg-violet-600
          hover:border-violet-600
        "
      >
        <ChevronRight
          size={17}
          strokeWidth={2}
          className="
            text-violet-600
            transition-colors
            duration-300
            group-hover:text-white
          "
        />
      </button>
    </div>
  );
}