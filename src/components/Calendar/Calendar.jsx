import {
  CalendarDays,
  X,
} from "lucide-react";

import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
} from "react";

import { gsap } from "gsap";

import CalendarHeader from "./CalendarHeader";
import CalendarDay from "./CalendarDay";

import {
  WEEK_DAYS,
  calendarWeeks,
  previousMonth,
  nextMonth,
  getInitialMonth,
  TODAY_LABEL,
  APPLY_LABEL,
  CANCEL_LABEL,
} from "./calendarUtils";

export default function Calendar({
  value,
  onChange,
}) {
  const [open, setOpen] = useState(false);

  const [selectedDate, setSelectedDate] =
    useState(value ?? new Date());

  const [currentMonth, setCurrentMonth] =
    useState(getInitialMonth(value));

  const wrapperRef = useRef(null);

  const popupRef = useRef(null);

  const triggerRef = useRef(null);

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setCurrentMonth(value);
    }
  }, [value]);

  useLayoutEffect(() => {
    if (!open || !popupRef.current) return;

    gsap.fromTo(
      popupRef.current,
      {
        opacity: 0,
        y: 14,
        scale: 0.96,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.32,
        ease: "power4.out",
      }
    );
  }, [open]);

  useEffect(() => {
    function outside(e) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    window.addEventListener(
      "mousedown",
      outside
    );

    return () =>
      window.removeEventListener(
        "mousedown",
        outside
      );
  }, []);

  function goPrevious() {
    setCurrentMonth((prev) =>
      previousMonth(prev)
    );
  }

  function goNext() {
    setCurrentMonth((prev) =>
      nextMonth(prev)
    );
  }

  function selectDay(day) {
    setSelectedDate(day);
  }

  function today() {
    const now = new Date();

    setSelectedDate(now);
    setCurrentMonth(now);
  }

  function apply() {
    onChange?.(selectedDate);

    setOpen(false);
  }

  function cancel() {
    setSelectedDate(value);

    setCurrentMonth(
      getInitialMonth(value)
    );

    setOpen(false);
  }

  const weeks =
    calendarWeeks(currentMonth);

  return (
    <div
      ref={wrapperRef}
      className="relative"
    >

      {/* Trigger */}

      <button
        ref={triggerRef}
        onClick={() =>
          setOpen(!open)
        }
        className="
          group
          h-10
          px-4
          rounded-2xl
          bg-white
          border
          border-gray-200
          shadow-sm
          flex
          items-center
          gap-3
          hover:border-violet-400
          hover:shadow-md
          transition-all
          duration-300
        "
      >

        <div
          className="
            w-8
            h-8
            rounded-xl
            bg-gradient-to-br
            from-violet-600
            via-purple-600
            to-fuchsia-500
            flex
            items-center
            justify-center
            shadow-md
          "
        >

          <CalendarDays
            size={15}
            className="text-white"
          />

        </div>

        <span
          className="
            text-[12px]
            font-semibold
            text-slate-700
            tracking-wide
          "
        >
          {selectedDate.toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          )}
        </span>

      </button>

      {open && (

        <div
          ref={popupRef}
          className="
            absolute
            right-0
            mt-4
            w-[360px]
            rounded-[28px]
            bg-white/95
            backdrop-blur-xl
            border
            border-violet-100
            shadow-[0_30px_80px_rgba(15,23,42,0.18)]
            overflow-hidden
            z-[999]
          "
        >

          <CalendarHeader
            currentMonth={currentMonth}
            onPrevious={goPrevious}
            onNext={goNext}
          />

          <div className="px-6 pt-5">

            <div
              className="
                grid
                grid-cols-7
                mb-4
              "
            >
              {WEEK_DAYS.map((day) => (
                <div
                  key={day}
                  className="
                    h-8
                    flex
                    items-center
                    justify-center
                    text-[12px]
                    font-semibold
                    text-violet-500
                  "
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="space-y-1">
                              {weeks.map((week, weekIndex) => (

                <div
                  key={weekIndex}
                  className="
                    grid
                    grid-cols-7
                    mb-1
                  "
                >
                  {week.map((day) => (

                    <div
                      key={day.toISOString()}
                      className="
                        flex
                        items-center
                        justify-center
                        py-0.5
                      "
                    >
                      <CalendarDay
                        day={day}
                        currentMonth={currentMonth}
                        selectedDate={selectedDate}
                        onSelect={selectDay}
                      />
                    </div>

                  ))}
                </div>

              ))}
            </div>

          </div>

          {/* Footer */}

          <div
            className="
              mt-5
              px-5
              py-5
              border-t
              border-violet-100
              bg-gradient-to-r
              from-violet-50/60
              via-white
              to-fuchsia-50/60
              flex
              items-center
              justify-between
            "
          >

            {/* Left */}

            <button
              onClick={today}
              className="
                h-10
                px-4
                rounded-xl
                bg-violet-100
                text-violet-700
                text-[13px]
                font-semibold
                hover:bg-violet-200
                transition-all
                duration-300
              "
            >
              {TODAY_LABEL}
            </button>

            {/* Right */}

            <div className="flex items-center gap-2">

              <button
                onClick={cancel}
                className="
                  h-10
                  px-4
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  text-[13px]
                  font-medium
                  text-gray-600
                  hover:bg-gray-50
                  transition-all
                  duration-300
                "
              >
                {CANCEL_LABEL}
              </button>

              <button
                onClick={apply}
                className="
                  h-10
                  px-5
                  rounded-xl
                  bg-gradient-to-r
                  from-violet-600
                  via-purple-600
                  to-fuchsia-500
                  text-white
                  text-[13px]
                  font-semibold
                  shadow-lg
                  shadow-violet-300/40
                  hover:scale-[1.03]
                  transition-all
                  duration-300
                "
              >
                {APPLY_LABEL}
              </button>

            </div>

          </div>

          {/* Close */}

          <button
            onClick={() => setOpen(false)}
            className="
              absolute
              top-5
              right-5
              w-8
              h-8
              rounded-xl
              bg-white
              border
              border-violet-100
              flex
              items-center
              justify-center
              shadow-sm
              hover:bg-violet-50
              transition-all
              duration-300
            "
          >
            <X
              size={15}
              className="text-violet-500"
            />
          </button>

        </div>

      )}

    </div>
  );
}