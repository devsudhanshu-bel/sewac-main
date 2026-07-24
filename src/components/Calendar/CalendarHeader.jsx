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
        flex
        items-center
        justify-between
        px-5
        py-5
        border-b
        border-violet-100
        bg-gradient-to-r
        from-violet-50
        via-white
        to-fuchsia-50
      "
    >
      {/* Previous */}

      <button
        onClick={onPrevious}
        className="
          group
          w-10
          h-10
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
          size={18}
          className="
            text-violet-600
            transition-colors
            duration-300
            group-hover:text-white
          "
        />
      </button>

      {/* Month */}

      <motion.div
        key={monthLabel(currentMonth)}
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.25,
        }}
        className="text-center"
      >
        <h2
          className="
            text-[20px]
            font-bold
            tracking-tight
            text-slate-900
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

      {/* Next */}

      <button
        onClick={onNext}
        className="
          group
          w-10
          h-10
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
          size={18}
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