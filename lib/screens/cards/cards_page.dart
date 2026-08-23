import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../models/analytics_model.dart';
import '../../services/stats_service.dart';

void main() {
  runApp(const MaterialApp(
    debugShowCheckedModeBanner: false,
    home: CardsPage(),
  ));
}

// ============================================================================
// DAILY DATA MODEL & MOCK DATABASE
// ============================================================================

class DailyRecord {
  final DateTime date;
  final int wetWaste;
  final int dryWaste;
  final bool attended;
  final int participationRate; // percentage

  const DailyRecord({
    required this.date,
    required this.wetWaste,
    required this.dryWaste,
    required this.attended,
    required this.participationRate,
  });
}

// Utility extension for Date comparisons
extension DateOnlyCompare on DateTime {
  bool isSameDay(DateTime other) {
    return year == other.year && month == other.month && day == other.day;
  }

  bool isBetweenInclusive(DateTime start, DateTime end) {
    final startDay = DateTime(start.year, start.month, start.day);
    final endDay = DateTime(end.year, end.month, end.day, 23, 59, 59);
    return isAfter(startDay.subtract(const Duration(seconds: 1))) &&
        isBefore(endDay.add(const Duration(seconds: 1)));
  }
}

// Generate Mock Daily Records for Full Year 2026 (Jan 1 to Dec 31)
List<DailyRecord> generateFullYear2026Records() {
  final List<DailyRecord> records = [];
  final startDate = DateTime(2026, 1, 1);
  final endDate = DateTime(2026, 12, 31);

  for (DateTime date = startDate;
  !date.isAfter(endDate);
  date = date.add(const Duration(days: 1))) {
    int day = date.day;
    int month = date.month;
    records.add(
      DailyRecord(
        date: date,
        wetWaste: ((day + month) % 3 == 0) ? 2 : (((day + month) % 2 == 0) ? 1 : 0),
        dryWaste: ((day + month) % 4 == 0) ? 2 : (((day + month) % 5 == 0) ? 1 : 0),
        attended: date.weekday != DateTime.sunday, // Misses Sundays
        participationRate: (80 + ((day * month) % 20)).clamp(70, 100),
      ),
    );
  }
  return records;
}

final List<DailyRecord> mockDailyDatabase = generateFullYear2026Records();

// ============================================================================
// MAIN PAGE
// ============================================================================

class CardsPage extends StatefulWidget {
  const CardsPage({Key? key}) : super(key: key);

  @override
  State<CardsPage> createState() => _CardsPageState();
}

class _CardsPageState extends State<CardsPage>
    with SingleTickerProviderStateMixin {
  late final AnimationController _animController;
  late final Animation<double> _fadeAnim;
  late final Animation<Offset> _slideAnim;
  late final Animation<double> _graphAnim;

  Future<void> _fetchAnalytics() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final analytics = await StatsService.getAnalytics(
        startDate: _startDate,
        endDate: _endDate,
      );

      if (!mounted) return;

      setState(() {
        _analytics = analytics;
        _isLoading = false;
      });
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  // Selected Date Range State (Default: Today = July 27, 2026)
  DateTime _startDate = DateTime(2026, 7, 27);
  DateTime _endDate = DateTime(2026, 7, 27);

  AnalyticsModel? _analytics;

  bool _isLoading = false;

  String? _error;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    );

    _fadeAnim = CurvedAnimation(
      parent: _animController,
      curve: const Interval(0.0, 0.6, curve: Curves.easeOut),
    );

    _slideAnim = Tween<Offset>(
      begin: const Offset(0, 0.08),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _animController,
      curve: const Interval(0.0, 0.8, curve: Curves.easeOutCubic),
    ));

    _graphAnim = CurvedAnimation(
      parent: _animController,
      curve: const Interval(0.2, 1.0, curve: Curves.easeInOutCubic),
    );

    _animController.forward();
    _fetchAnalytics();
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  void _triggerGraphAnimation() {
    _animController.forward(from: 0.2);
  }

  List<DailyRecord> _getSelectedDailyRecords() {
    return mockDailyDatabase.where((record) {
      return record.date.isBetweenInclusive(_startDate, _endDate);
    }).toList();
  }

  String _formatDate(DateTime date) {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    final dayStr = date.day.toString().padLeft(2, '0');
    return "$dayStr ${months[date.month - 1]} ${date.year}";
  }

  String _formatShortDate(DateTime date) {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    final dayStr = date.day.toString().padLeft(2, '0');
    return "$dayStr ${months[date.month - 1]}";
  }

  // ==========================================================================
  // CUSTOM DATE RANGE PICKER BOTTOM SHEET
  // ==========================================================================
  Future<void> _showCustomDateRangePicker(BuildContext context) async {
    final DateTimeRange? result = await showModalBottomSheet<DateTimeRange>(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      barrierColor: Colors.black.withValues(alpha: 0.65),
      builder: (modalContext) {
        DateTime tempStart = _startDate;
        DateTime tempEnd = _endDate;

        return StatefulBuilder(
          builder: (ctx, setModalState) {
            return BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
                decoration: BoxDecoration(
                  color: const Color(0xFF260548).withValues(alpha: 0.95),
                  borderRadius:
                  const BorderRadius.vertical(top: Radius.circular(32)),
                  border: Border.all(
                    color: Colors.white.withValues(alpha: 0.18),
                    width: 1.2,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.5),
                      blurRadius: 30,
                      spreadRadius: 5,
                    ),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Handle
                    Center(
                      child: Container(
                        width: 44,
                        height: 5,
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.35),
                          borderRadius: BorderRadius.circular(2.5),
                        ),
                      ),
                    ),
                    const SizedBox(height: 18),

                    // Title
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: const Color(0xFFC084FC).withValues(alpha: 0.18),
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: const Color(0xFFC084FC).withValues(alpha: 0.35),
                            ),
                          ),
                          child: const Icon(
                            Icons.calendar_month_rounded,
                            color: Color(0xFFC084FC),
                            size: 20,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Text(
                          "Select Date Range",
                          style: GoogleFonts.plusJakartaSans(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // Date Pickers Row
                    Row(
                      children: [
                        // FROM CARD
                        Expanded(
                          child: InkWell(
                            onTap: () async {
                              final picked = await showDatePicker(
                                context: context,
                                initialDate: tempStart,
                                firstDate: DateTime(2026, 1, 1),
                                lastDate: DateTime(2026, 12, 31),
                                builder: (datePickerContext, child) {
                                  return Theme(
                                    data: ThemeData.dark().copyWith(
                                      colorScheme: const ColorScheme.dark(
                                        primary: Color(0xFFC084FC),
                                        onPrimary: Colors.white,
                                        surface: Color(0xFF260548),
                                        onSurface: Colors.white,
                                      ),
                                    ),
                                    child: child!,
                                  );
                                },
                              );
                              if (picked != null) {
                                setModalState(() {
                                  tempStart = picked;
                                  if (tempEnd.isBefore(tempStart)) {
                                    tempEnd = tempStart;
                                  }
                                });
                              }
                            },
                            borderRadius: BorderRadius.circular(18),
                            child: Container(
                              padding: const EdgeInsets.all(14),
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: 0.08),
                                borderRadius: BorderRadius.circular(18),
                                border: Border.all(
                                  color: Colors.white.withValues(alpha: 0.14),
                                ),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      const Icon(
                                        Icons.calendar_today_rounded,
                                        color: Color(0xFFC084FC),
                                        size: 14,
                                      ),
                                      const SizedBox(width: 6),
                                      Text(
                                        "From",
                                        style: GoogleFonts.plusJakartaSans(
                                          color: Colors.white.withValues(alpha: 0.6),
                                          fontSize: 12,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    _formatDate(tempStart),
                                    style: GoogleFonts.plusJakartaSans(
                                      color: Colors.white,
                                      fontSize: 13.5,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        const Icon(
                          Icons.arrow_forward_rounded,
                          color: Color(0xFFC084FC),
                          size: 18,
                        ),
                        const SizedBox(width: 12),
                        // TO CARD
                        Expanded(
                          child: InkWell(
                            onTap: () async {
                              final picked = await showDatePicker(
                                context: context,
                                initialDate: tempEnd.isBefore(tempStart) ? tempStart : tempEnd,
                                firstDate: tempStart,
                                lastDate: DateTime(2026, 12, 31),
                                builder: (datePickerContext, child) {
                                  return Theme(
                                    data: ThemeData.dark().copyWith(
                                      colorScheme: const ColorScheme.dark(
                                        primary: Color(0xFFC084FC),
                                        onPrimary: Colors.white,
                                        surface: Color(0xFF260548),
                                        onSurface: Colors.white,
                                      ),
                                    ),
                                    child: child!,
                                  );
                                },
                              );
                              if (picked != null) {
                                setModalState(() {
                                  tempEnd = picked;
                                });
                              }
                            },
                            borderRadius: BorderRadius.circular(18),
                            child: Container(
                              padding: const EdgeInsets.all(14),
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: 0.08),
                                borderRadius: BorderRadius.circular(18),
                                border: Border.all(
                                  color: Colors.white.withValues(alpha: 0.14),
                                ),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      const Icon(
                                        Icons.event_rounded,
                                        color: Color(0xFFC084FC),
                                        size: 14,
                                      ),
                                      const SizedBox(width: 6),
                                      Text(
                                        "To",
                                        style: GoogleFonts.plusJakartaSans(
                                          color: Colors.white.withValues(alpha: 0.6),
                                          fontSize: 12,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    _formatDate(tempEnd),
                                    style: GoogleFonts.plusJakartaSans(
                                      color: Colors.white,
                                      fontSize: 13.5,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),

                    // APPLY FILTER BUTTON
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: TextButton(
                        onPressed: () {
                          Navigator.of(modalContext).pop(DateTimeRange(start: tempStart, end: tempEnd));
                        },
                        style: TextButton.styleFrom(
                          backgroundColor: const Color(0xFFC084FC),
                          elevation: 2,
                          shadowColor:
                          const Color(0xFFC084FC).withValues(alpha: 0.3),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(24),
                          ),
                        ),
                        child: Text(
                          "Apply Filter",
                          style: GoogleFonts.plusJakartaSans(
                            color: Colors.white,
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 0.3,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                  ],
                ),
              ),
            );
          },
        );
      },
    );

    if (result != null && mounted) {
      setState(() {
        _startDate = result.start;
        _endDate = result.end;
      });

      _fetchAnalytics();

      _triggerGraphAnimation();
    }
  }

  @override
  Widget build(BuildContext context) {
    final selectedRecords = _getSelectedDailyRecords();


    final dateRangeText =
        "${_formatDate(_startDate)} → ${_formatDate(_endDate)}";

    return Scaffold(

      backgroundColor: const Color(0xFF260548),
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF260548),
              Color(0xFF3B0B68),
              Color(0xFF531288),
            ],
            stops: [0.0, 0.5, 1.0],
          ),
        ),
        child: SafeArea(
          child: FadeTransition(
            opacity: _fadeAnim,
            child: SlideTransition(
              position: _slideAnim,
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: Colors.white.withValues(alpha: 0.18),
                              width: 1,
                            ),
                          ),
                          child: const Icon(
                            Icons.analytics_rounded,
                            color: Color(0xFFC084FC),
                            size: 26,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            "Collection Analytics",
                            style: GoogleFonts.plusJakartaSans(
                              color: Colors.white,
                              fontSize: 22,
                              fontWeight: FontWeight.w800,
                              letterSpacing: -0.5,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      "Track your waste collection and participation.",
                      style: GoogleFonts.plusJakartaSans(
                        color: Colors.white.withValues(alpha: 0.65),
                        fontSize: 14,
                        fontWeight: FontWeight.w400,
                        height: 1.3,
                      ),
                    ),
                    const SizedBox(height: 16),

                    // =========================================================
                    // DATE RANGE SELECTOR CARD
                    // =========================================================
                    Material(
                      color: Colors.transparent,
                      child: InkWell(
                        onTap: () => _showCustomDateRangePicker(context),
                        borderRadius: BorderRadius.circular(16),
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 12,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.08),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: Colors.white.withValues(alpha: 0.14),
                              width: 1,
                            ),
                          ),
                          child: Row(
                            children: [
                              const Icon(
                                Icons.calendar_month_rounded,
                                color: Color(0xFFC084FC),
                                size: 20,
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  dateRangeText,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: GoogleFonts.plusJakartaSans(
                                    color: Colors.white,
                                    fontSize: 13.5,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                              const Icon(
                                Icons.arrow_drop_down_rounded,
                                color: Color(0xFFC084FC),
                                size: 22,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Responsive Grid Layout
                    Expanded(
                      child: LayoutBuilder(
                        builder: (context, constraints) {
                          double width = constraints.maxWidth;
                          double childAspectRatio = (width > 600) ? 1.3 : 0.82;

                          if (_isLoading) {
                            return const Center(
                              child: CircularProgressIndicator(
                                color: Color(0xFFC084FC),
                              ),
                            );
                          }

                          if (_error != null) {
                            return Center(
                              child: Text(
                                _error!,
                                style: const TextStyle(color: Colors.white),
                              ),
                            );
                          }

                          return GridView.count(
                            crossAxisCount: width > 600 ? 2 : 2,
                            crossAxisSpacing: 16,
                            mainAxisSpacing: 16,
                            childAspectRatio: childAspectRatio,
                            physics: const BouncingScrollPhysics(),
                            children: [
                              AnalyticsCard(
                                icon: Icons.water_drop_rounded,
                                title: "Wet Waste",
                                value:
                                "${_analytics?.wetCompleted ?? 0}/${_analytics?.wetTotal ?? 0}",
                                subtitle: "Completed",
                                accentColor: const Color(0xFF4CAF50),
                              ),
                              AnalyticsCard(
                                // Dry Waste
                                icon: Icons.recycling_rounded,
                                title: "Dry Waste",
                                value:
                                "${_analytics?.dryCompleted ?? 0}/${_analytics?.dryTotal ?? 0}",
                                subtitle: "Completed",
                                accentColor: const Color(0xFFFF9800),
                              ),
                              AnalyticsCard(
                                icon: Icons.local_fire_department_rounded,
                                title: "Streak",
                                value: "${_analytics?.streak ?? 0}",
                                subtitle: "Day Streak",
                                accentColor: const Color(0xFFA855F7),
                              ),
                              AnalyticsCard(
                                icon: Icons.eco_rounded,
                                title: "Participation",
                                value: "${_analytics?.participation ?? 0}%",
                                subtitle: "Average Score",
                                accentColor: const Color(0xFF3B82F6),
                              ),
                            ],
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

// ============================================================================
// DAILY BREAKDOWN BOTTOM SHEET
// ============================================================================


// ============================================================================
// ANALYTICS CARD
// ============================================================================

class AnalyticsCard extends StatefulWidget {
  final IconData icon;
  final String title;
  final String value;
  final String subtitle;
  final Color accentColor;
  final VoidCallback? onTap;

  const AnalyticsCard({
    Key? key,
    required this.icon,
    required this.title,
    required this.value,
    required this.subtitle,
    required this.accentColor,
    this.onTap,
  }) : super(key: key);

  @override
  State<AnalyticsCard> createState() => _AnalyticsCardState();
}

class _AnalyticsCardState extends State<AnalyticsCard> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    return AnimatedScale(
      scale: _isPressed ? 0.96 : 1.0,
      duration: const Duration(milliseconds: 150),
      curve: Curves.easeOutCubic,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: widget.accentColor.withValues(alpha: _isPressed ? 0.25 : 0.12),
              blurRadius: _isPressed ? 20 : 12,
              spreadRadius: _isPressed ? 1 : -2,
              offset: const Offset(0, 6),
            ),
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.25),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(20),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: widget.onTap ?? () {},
                onHighlightChanged: (isHighlight) {
                  setState(() => _isPressed = isHighlight);
                },
                splashColor: widget.accentColor.withValues(alpha: 0.18),
                highlightColor: Colors.transparent,
                borderRadius: BorderRadius.circular(20),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: Colors.white.withValues(alpha: 0.18),
                      width: 1,
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Glass Icon + Title
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Container(
                            width: 38,
                            height: 38,
                            decoration: BoxDecoration(
                              color: widget.accentColor.withValues(alpha: 0.18),
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: widget.accentColor.withValues(alpha: 0.35),
                                width: 1.2,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: widget.accentColor.withValues(alpha: 0.2),
                                  blurRadius: 8,
                                  spreadRadius: -1,
                                ),
                              ],
                            ),
                            child: Icon(
                              widget.icon,
                              color: widget.accentColor,
                              size: 20,
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              widget.title,
                              maxLines: 2,
                              softWrap: true,
                              overflow: TextOverflow.visible,
                              style: GoogleFonts.plusJakartaSans(
                                color: Colors.white,
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                height: 1.2,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const Spacer(),
                      // Center: Large Bold Value
                      FittedBox(
                        fit: BoxFit.scaleDown,
                        alignment: Alignment.centerLeft,
                        child: Text(
                          widget.value,
                          style: GoogleFonts.plusJakartaSans(
                            color: Colors.white,
                            fontSize: 34,
                            fontWeight: FontWeight.w900,
                            letterSpacing: -0.8,
                          ),
                        ),
                      ),
                      const SizedBox(height: 2),
                      // Subtitle
                      Text(
                        widget.subtitle,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: GoogleFonts.plusJakartaSans(
                          color: Colors.white.withValues(alpha: 0.65),
                          fontSize: 11,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const Spacer(),
                      // Bottom Sparkline Graph
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}