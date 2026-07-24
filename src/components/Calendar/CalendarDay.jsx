import { motion } from "framer-motion";

import {
  dayNumber,
  fullDate,
  isCurrentMonth,
  isSelectedDay,
  isTodayDate,
} from "./calendarUtils";

export default function CalendarDay({
  day,
  currentMonth,
  selectedDate,
  onSelect,
}) {
  const selected = isSelectedDay(
    day,
    selectedDate
  );

  const today = isTodayDate(day);

  const current = isCurrentMonth(
    day,
    currentMonth
  );

  return (
    <motion.button
      whileHover={{
        scale: 1.08,
      }}
      whileTap={{
        scale: 0.95,
      }}
      transition={{
        duration: 0.15,
      }}
      onClick={() => onSelect(day)}
      title={fullDate(day)}
      className={`
        relative
        w-11
        h-11
        rounded-2xl
        flex
        items-center
        justify-center
        text-[14px]
        font-semibold
        transition-all
        duration-300
        select-none

        ${
          selected
            ? `
              bg-gradient-to-br
              from-violet-600
              via-purple-600
              to-fuchsia-500
              text-white
              shadow-lg
              shadow-violet-300/50
            `
            : today
            ? `
              border-2
              border-violet-500
              text-violet-700
              bg-violet-50
            `
            : current
            ? `
              text-slate-800
              hover:bg-violet-50
              hover:text-violet-700
            `
            : `
              text-slate-300
              hover:text-slate-500
            `
        }
      `}
    >
      {dayNumber(day)}

      {/* Today Dot */}

      {today && !selected && (
        <span
          className="
            absolute
            bottom-1.5
            w-1.5
            h-1.5
            rounded-full
            bg-violet-600
          "
        />
      )}

      {/* Selected Glow */}

      {selected && (
        <motion.div
          layoutId="selected-day"
          className="
            absolute
            inset-0
            rounded-2xl
            ring-2
            ring-white/60
          "
        />
      )}
    </motion.button>
  );
}