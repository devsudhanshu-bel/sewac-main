import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";

/* ================================
   Weekday Labels
================================ */

export const WEEK_DAYS = [
  "Su",
  "Mo",
  "Tu",
  "We",
  "Th",
  "Fr",
  "Sa",
];

/* ================================
   Month Helpers
================================ */

export const nextMonth = (date) =>
  addMonths(date, 1);

export const previousMonth = (date) =>
  subMonths(date, 1);

export const monthLabel = (date) =>
  format(date, "MMMM yyyy");

/* ================================
   Calendar Grid
================================ */

export function generateCalendarDays(currentMonth) {
  const monthStart = startOfMonth(currentMonth);

  const monthEnd = endOfMonth(currentMonth);

  const calendarStart = startOfWeek(monthStart);

  const calendarEnd = endOfWeek(monthEnd);

  return eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });
}

/* ================================
   Date Helpers
================================ */

export function isCurrentMonth(
  day,
  currentMonth
) {
  return isSameMonth(day, currentMonth);
}

export function isSelectedDay(
  day,
  selectedDate
) {
  if (!selectedDate) return false;

  return isSameDay(day, selectedDate);
}

export function isTodayDate(day) {
  return isToday(day);
}

export function dayNumber(day) {
  return format(day, "d");
}

export function fullDate(day) {
  return format(day, "dd MMM yyyy");
}

/* ================================
   Grid Helpers
================================ */

export function calendarWeeks(currentMonth) {
  const days =
    generateCalendarDays(currentMonth);

  const weeks = [];

  for (
    let i = 0;
    i < days.length;
    i += 7
  ) {
    weeks.push(days.slice(i, i + 7));
  }

  return weeks;
}

/* ================================
   Comparison Helpers
================================ */

export function sameMonth(
  a,
  b
) {
  return isSameMonth(a, b);
}

export function sameDay(
  a,
  b
) {
  return isSameDay(a, b);
}

/* ================================
   Initial Month
================================ */

export function getInitialMonth(
  selectedDate
) {
  return selectedDate || new Date();
}

/* ================================
   Button Labels
================================ */

export const TODAY_LABEL = "Today";

export const APPLY_LABEL = "Apply";

export const CANCEL_LABEL = "Cancel";