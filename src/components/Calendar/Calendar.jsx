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
  /* =========================================================
     STATE
  ========================================================= */

  const [open, setOpen] = useState(false);

  const [selectedDate, setSelectedDate] =
    useState(value ?? new Date());

  const [currentMonth, setCurrentMonth] =
    useState(getInitialMonth(value));

  /* =========================================================
     REFS
  ========================================================= */

  const wrapperRef = useRef(null);

  const popupRef = useRef(null);

  const triggerRef = useRef(null);

  /* =========================================================
     SYNC WITH PARENT VALUE
  ========================================================= */

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setCurrentMonth(value);
    }
  }, [value]);

  /* =========================================================
     POPUP ANIMATION
  ========================================================= */

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

  /* =========================================================
     CLOSE WHEN CLICKING OUTSIDE
  ========================================================= */

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

    return () => {
      window.removeEventListener(
        "mousedown",
        outside
      );
    };
  }, []);

  /* =========================================================
     MONTH NAVIGATION
  ========================================================= */

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

  /* =========================================================
     SELECT DATE
  ========================================================= */

  function selectDay(day) {
    setSelectedDate(day);
  }

  /* =========================================================
     TODAY
  ========================================================= */

  function today() {
    const now = new Date();

    setSelectedDate(now);
    setCurrentMonth(now);
  }

  /* =========================================================
     APPLY
  ========================================================= */

  function apply() {
    onChange?.(selectedDate);

    setOpen(false);
  }

  /* =========================================================
     CANCEL
  ========================================================= */

  function cancel() {
    const resetDate = value ?? new Date();

    setSelectedDate(resetDate);

    setCurrentMonth(
      getInitialMonth(resetDate)
    );

    setOpen(false);
  }

  /* =========================================================
     CALENDAR WEEKS
  ========================================================= */

  const weeks =
    calendarWeeks(currentMonth);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      ref={wrapperRef}
      className="relative"
    >
      {/* =====================================================
          CALENDAR TRIGGER
      ===================================================== */}

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
        {/* Calendar Icon */}

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

        {/* Date */}

        <span
          className="
            text-[12px]
            font-semibold
            text-slate-700
            tracking-wide
            whitespace-nowrap
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

      {/* =====================================================
          CALENDAR POPUP
      ===================================================== */}

      {open && (
        <div
          ref={popupRef}
          className="
            absolute
            right-0
            top-full
            mt-3
            w-[360px]
            rounded-[26px]
            bg-white
            border
            border-violet-100
            shadow-[0_30px_80px_rgba(15,23,42,0.18)]
            overflow-hidden
            z-[9999]
          "
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <div className="relative">
            <CalendarHeader
              currentMonth={currentMonth}
              onPrevious={goPrevious}
              onNext={goNext}
            />

            {/* =================================================
                CLOSE BUTTON

                Positioned INSIDE the calendar header area
                so it stays aligned with the popup.
            ================================================= */}

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close calendar"
              className="
                absolute
                top-1/2
                right-4
                -translate-y-1/2
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
                hover:border-violet-200
                transition-all
                duration-300
                z-20
              "
            >
              <X
                size={15}
                strokeWidth={2}
                className="text-violet-500"
              />
            </button>
          </div>

          {/* =================================================
              DAYS
          ================================================= */}

          <div className="px-5 pt-4 pb-1">
            {/* Weekday Header */}

            <div
              className="
                grid
                grid-cols-7
                mb-3
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

            {/* Calendar Grid */}

            <div className="space-y-1">
              {weeks.map(
                (week, weekIndex) => (
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
                          currentMonth={
                            currentMonth
                          }
                          selectedDate={
                            selectedDate
                          }
                          onSelect={
                            selectDay
                          }
                        />
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div
            className="
              mt-4
              px-5
              py-4
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
            {/* Today */}

            <button
              type="button"
              onClick={today}
              className="
                h-9
                px-4
                rounded-xl
                bg-violet-100
                text-violet-700
                text-[12px]
                font-semibold
                hover:bg-violet-200
                transition-all
                duration-300
              "
            >
              {TODAY_LABEL}
            </button>

            {/* Right Actions */}

            <div className="flex items-center gap-2">
              {/* Cancel */}

              <button
                type="button"
                onClick={cancel}
                className="
                  h-9
                  px-4
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  text-[12px]
                  font-medium
                  text-gray-600
                  hover:bg-gray-50
                  transition-all
                  duration-300
                "
              >
                {CANCEL_LABEL}
              </button>

              {/* Apply */}

              <button
                type="button"
                onClick={apply}
                className="
                  h-9
                  px-5
                  rounded-xl
                  bg-gradient-to-r
                  from-violet-600
                  via-purple-600
                  to-fuchsia-500
                  text-white
                  text-[12px]
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
        </div>
      )}
    </div>
  );
}