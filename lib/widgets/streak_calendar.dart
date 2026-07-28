import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:sewac_citizen_app/widgets/attendance_day.dart';

class StreakCalendar extends StatefulWidget {
  const StreakCalendar({super.key});

  @override
  State<StreakCalendar> createState() => _StreakCalendarState();
}

class _StreakCalendarState extends State<StreakCalendar> {
  DateTime _currentDate = DateTime(2026, 6, 1);

  final Map<int, AttendanceStatus> _june2026Attendance = {
    1: AttendanceStatus.attended,
    2: AttendanceStatus.missed,
    3: AttendanceStatus.attended,
    4: AttendanceStatus.attended,
    5: AttendanceStatus.missed,
    6: AttendanceStatus.attended,
    7: AttendanceStatus.attended,
    8: AttendanceStatus.attended,
    9: AttendanceStatus.missed,
    10: AttendanceStatus.attended,
    11: AttendanceStatus.attended,
    12: AttendanceStatus.attended,
    13: AttendanceStatus.missed,
    14: AttendanceStatus.attended,
    15: AttendanceStatus.attended,
    16: AttendanceStatus.attended,
    17: AttendanceStatus.attended,
    18: AttendanceStatus.missed,
    19: AttendanceStatus.attended,
    20: AttendanceStatus.attended,
    21: AttendanceStatus.missed,
    22: AttendanceStatus.attended,
    23: AttendanceStatus.attended,
    24: AttendanceStatus.today,
    25: AttendanceStatus.attended,
    26: AttendanceStatus.missed,
    27: AttendanceStatus.attended,
    28: AttendanceStatus.attended,
    29: AttendanceStatus.attended,
    30: AttendanceStatus.attended,
  };

  void _nextMonth() {
    setState(() {
      _currentDate = DateTime(_currentDate.year, _currentDate.month + 1, 1);
    });
  }

  void _previousMonth() {
    setState(() {
      _currentDate = DateTime(_currentDate.year, _currentDate.month - 1, 1);
    });
  }

  String _getMonthName(int month) {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    return months[month - 1];
  }

  @override
  Widget build(BuildContext context) {
    final weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return LayoutBuilder(
      builder: (context, constraints) {
        final double availableWidth = constraints.maxWidth;
        final double paddingVal = availableWidth < 340 ? 12.0 : 16.0;

        return ClipRRect(
          borderRadius: BorderRadius.circular(24),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
            child: Container(
              padding: EdgeInsets.fromLTRB(paddingVal, 16, paddingVal, 14),
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
                    blurRadius: 24,
                    spreadRadius: 0,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Header
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            FittedBox(
                              fit: BoxFit.scaleDown,
                              alignment: Alignment.centerLeft,
                              child: Text(
                                'Attendance Streak',
                                style: GoogleFonts.plusJakartaSans(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w800,
                                  color: Colors.white,
                                  letterSpacing: -0.2,
                                ),
                              ),
                            ),
                            const SizedBox(height: 2),
                            FittedBox(
                              fit: BoxFit.scaleDown,
                              alignment: Alignment.centerLeft,
                              child: Text(
                                'Your monthly participation',
                                style: GoogleFonts.plusJakartaSans(
                                  fontSize: 11.5,
                                  fontWeight: FontWeight.w500,
                                  color: Colors.white.withValues(alpha: 0.75),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            onPressed: _previousMonth,
                            icon: Icon(
                              Icons.chevron_left_rounded,
                              color: Colors.white.withValues(alpha: 0.85),
                              size: 20,
                            ),
                            padding: EdgeInsets.zero,
                            constraints: const BoxConstraints(),
                            splashRadius: 16,
                          ),
                          const SizedBox(width: 2),
                          AnimatedSwitcher(
                            duration: const Duration(milliseconds: 220),
                            transitionBuilder: (child, animation) {
                              return FadeTransition(
                                opacity: animation,
                                child: SlideTransition(
                                  position: Tween<Offset>(
                                    begin: const Offset(0.0, 0.15),
                                    end: Offset.zero,
                                  ).animate(animation),
                                  child: child,
                                ),
                              );
                            },
                            child: Text(
                              '${_getMonthName(_currentDate.month)} ${_currentDate.year}',
                              key: ValueKey(
                                  '${_currentDate.month}-${_currentDate.year}'),
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 12.5,
                                fontWeight: FontWeight.w700,
                                color: Colors.white,
                              ),
                            ),
                          ),
                          const SizedBox(width: 2),
                          IconButton(
                            onPressed: _nextMonth,
                            icon: Icon(
                              Icons.chevron_right_rounded,
                              color: Colors.white.withValues(alpha: 0.85),
                              size: 20,
                            ),
                            padding: EdgeInsets.zero,
                            constraints: const BoxConstraints(),
                            splashRadius: 16,
                          ),
                        ],
                      ),
                    ],
                  ),

                  const SizedBox(height: 8),

                  Row(
                    children: [
                      Text(
                        '🔥 Current Streak:',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: Colors.white.withValues(alpha: 0.75),
                        ),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '12 Days',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 12.5,
                          fontWeight: FontWeight.w800,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 10),

                  // Weekdays
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: weekdays.map((day) {
                      return Expanded(
                        child: Center(
                          child: FittedBox(
                            fit: BoxFit.scaleDown,
                            child: Text(
                              day,
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: Colors.white.withValues(alpha: 0.55),
                              ),
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),

                  const SizedBox(height: 8),

                  // Dynamic Grid View
                  AnimatedSwitcher(
                    duration: const Duration(milliseconds: 280),
                    transitionBuilder: (child, animation) {
                      return FadeTransition(
                        opacity: animation,
                        child: ScaleTransition(
                          scale: Tween<double>(begin: 0.98, end: 1.0)
                              .animate(animation),
                          child: child,
                        ),
                      );
                    },
                    child: GridView.builder(
                      key: ValueKey(
                          'grid-${_currentDate.month}-${_currentDate.year}'),
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: 35,
                      gridDelegate:
                      const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 7,
                        mainAxisSpacing: 4,
                        crossAxisSpacing: 4,
                        childAspectRatio: 1.0,
                      ),
                      itemBuilder: (context, index) {
                        if (_currentDate.month == 6 &&
                            _currentDate.year == 2026) {
                          if (index < 30) {
                            final dayNum = index + 1;
                            final status = _june2026Attendance[dayNum] ??
                                AttendanceStatus.future;
                            return AttendanceDay(day: dayNum, status: status);
                          } else {
                            final nextMonthDay = index - 29;
                            return AttendanceDay(
                              day: nextMonthDay,
                              status: AttendanceStatus.otherMonth,
                            );
                          }
                        } else {
                          if (index < 28) {
                            return AttendanceDay(
                              day: index + 1,
                              status: AttendanceStatus.future,
                            );
                          } else {
                            return AttendanceDay(
                              day: index - 27,
                              status: AttendanceStatus.otherMonth,
                            );
                          }
                        }
                      },
                    ),
                  ),

                  const SizedBox(height: 10),

                  // Legend Dots
                  Wrap(
                    spacing: 12,
                    runSpacing: 6,
                    children: [
                      _buildLegendDot(const Color(0xFF2E7D32), 'Attended'),
                      _buildLegendDot(const Color(0xFFC62828), 'Missed'),
                      _buildLegendDot(const Color(0xFFA855F7), 'Today'),
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
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
          ),
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