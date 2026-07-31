import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../models/calendar_response.dart';
import '../services/home_service.dart';
import 'attendance_day.dart';

class StreakCalendar extends StatefulWidget {
  final CalendarResponse calendarData;

  const StreakCalendar({super.key, required this.calendarData});

  @override
  State<StreakCalendar> createState() => _StreakCalendarState();
}

class _StreakCalendarState extends State<StreakCalendar> {
  late CalendarResponse _calendar;

  bool _loading = false;

  @override
  void initState() {
    super.initState();
    _calendar = widget.calendarData;
  }

  @override
  void didUpdateWidget(covariant StreakCalendar oldWidget) {
    super.didUpdateWidget(oldWidget);

    if (oldWidget.calendarData != widget.calendarData) {
      _calendar = widget.calendarData;
    }
  }

  Future<void> _changeMonth(int offset) async {
    if (_loading) return;

    setState(() {
      _loading = true;
    });

    try {
      DateTime month = DateTime(_calendar.year, _calendar.month + offset, 1);

      final response = await HomeService.getCalendar(
        year: month.year,
        month: month.month,
      );

      if (!mounted) return;

      setState(() {
        _calendar = response;
      });
    } catch (e) {
      debugPrint(e.toString());
    }

    if (!mounted) return;

    setState(() {
      _loading = false;
    });
  }

  String _monthName(int month) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return months[month - 1];
  }

  AttendanceStatus _statusFromApi(CalendarDay day) {
    switch (day.status.toUpperCase()) {
      case "ATTENDED":
        return AttendanceStatus.attended;

      case "MISSED":
        return AttendanceStatus.missed;

      case "TODAY":
        return AttendanceStatus.today;

      case "UPCOMING":
        return AttendanceStatus.future;

      default:
        return AttendanceStatus.future;
    }
  }

  List<Widget> _buildCalendarGrid() {
    List<Widget> widgets = [];

    final calendar = _calendar.calendar;

    if (calendar.isEmpty) {
      return widgets;
    }

    final firstWeekday = calendar.first.weekday;

    int leadingSpaces = firstWeekday == 0 ? 6 : firstWeekday - 1;

    for (int i = 0; i < leadingSpaces; i++) {
      widgets.add(
        const AttendanceDay(day: 0, status: AttendanceStatus.otherMonth),
      );
    }

    for (final day in calendar) {
      widgets.add(AttendanceDay(day: day.day, status: _statusFromApi(day)));
    }

    while (widgets.length % 7 != 0) {
      widgets.add(
        const AttendanceDay(day: 0, status: AttendanceStatus.otherMonth),
      );
    }

    return widgets;
  }

  @override
  Widget build(BuildContext context) {
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return LayoutBuilder(
      builder: (context, constraints) {
        final availableWidth = constraints.maxWidth;
        final paddingVal = availableWidth < 340 ? 12.0 : 16.0;

        return ClipRRect(
          borderRadius: BorderRadius.circular(20),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
            child: Container(
              padding: EdgeInsets.fromLTRB(paddingVal, 18, paddingVal, 20),
              decoration: BoxDecoration(
                color: const Color(0xFF4C2878).withValues(alpha: 0.16),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(
                  color: Colors.white.withValues(alpha: 0.12),
                  width: 1.2,
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.18),
                    blurRadius: 22,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  // ===========================
                  // HEADER
                  // ===========================
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Attendance Streak",
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 12,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                              ),
                            ),

                            const SizedBox(height: 2),

                            Text(
                              "Your monthly participation",
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 10,
                                fontWeight: FontWeight.w500,
                                color: Colors.white.withValues(alpha: 0.75),
                              ),
                            ),
                          ],
                        ),
                      ),

                      Row(
                        children: [
                          IconButton(
                            onPressed: _loading ? null : () => _changeMonth(-1),
                            icon: Icon(
                              Icons.chevron_left_rounded,
                              color: Colors.white.withValues(alpha: 0.85),
                            ),
                          ),

                          AnimatedSwitcher(
                            duration: const Duration(milliseconds: 250),
                            child: Text(
                              "${_monthName(_calendar.month)} ${_calendar.year}",
                              key: ValueKey(
                                "${_calendar.month}-${_calendar.year}",
                              ),
                              style: GoogleFonts.plusJakartaSans(
                                color: Colors.white,
                                fontWeight: FontWeight.w700,
                                fontSize: 12,
                              ),
                            ),
                          ),

                          IconButton(
                            onPressed: _loading ? null : () => _changeMonth(1),
                            icon: Icon(
                              Icons.chevron_right_rounded,
                              color: Colors.white.withValues(alpha: 0.85),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),

                  const SizedBox(height: 14),

                  // ===========================
                  // STREAK
                  // ===========================
                  Row(
                    children: [
                      Text(
                        "🔥 Current Streak:",
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: Colors.white.withValues(alpha: 0.75),
                        ),
                      ),

                      const SizedBox(width: 4),

                      AnimatedSwitcher(
                        duration: const Duration(milliseconds: 250),
                        child: Text(
                          "${_calendar.streak} Day${_calendar.streak == 1 ? "" : "s"}",
                          key: ValueKey(_calendar.streak),
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 12.5,
                            fontWeight: FontWeight.w800,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 18),

                  // ===========================
                  // WEEKDAYS
                  // ===========================
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: weekdays.map((day) {
                      return Expanded(
                        child: Center(
                          child: Text(
                            day,
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: Colors.white.withValues(alpha: 0.55),
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),

                  const SizedBox(height: 10),

                  // ===========================
                  // CALENDAR GRID
                  // ===========================

                  AnimatedSwitcher(
                    duration: const Duration(milliseconds: 250),
                    child: _loading
                        ? const SizedBox(
                      height: 240,
                      child: Center(
                        child: CircularProgressIndicator(
                          color: Colors.white,
                        ),
                      ),
                    )
                        : GridView.count(
                      key: ValueKey(
                        "${_calendar.month}-${_calendar.year}",
                      ),
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisCount: 7,
                      mainAxisSpacing: 4,
                      crossAxisSpacing: 4,
                      childAspectRatio: 1,
                      children: _buildCalendarGrid(),
                    ),
                  ),

                  const SizedBox(height: 14),

                  // ===========================
                  // LEGEND
                  // ===========================
                  Wrap(
                    spacing: 12,
                    runSpacing: 6,
                    children: [
                      _buildLegendDot(const Color(0xFF2E7D32), "Attended"),
                      _buildLegendDot(const Color(0xFFC62828), "Missed"),
                      _buildLegendDot(const Color(0xFFA855F7), "Today"),
                    ],
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildLegendDot(Color color, String label) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 7,
          height: 7,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        ),

        const SizedBox(width: 4),

        Text(
          label,
          style: GoogleFonts.plusJakartaSans(
            fontSize: 11,
            fontWeight: FontWeight.w600,
            color: Colors.white.withValues(alpha: 0.8),
          ),
        ),
      ],
    );
  }
}
