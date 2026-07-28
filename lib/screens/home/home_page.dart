import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:sewac_citizen_app/widgets/streak_calendar.dart';
import 'package:sewac_citizen_app/widgets/waste_summary_card.dart';
import 'package:sewac_citizen_app/screens/login/login_page.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage>
    with SingleTickerProviderStateMixin {
  late final AnimationController _entranceController;

  late final Animation<double> _headerOpacity;
  late final Animation<Offset> _headerSlide;

  late final Animation<double> _cardsOpacity;
  late final Animation<Offset> _cardsSlide;

  late final Animation<double> _calendarOpacity;
  late final Animation<double> _calendarScale;

  String _userPhone = "+91 XXXXXXXXXX";

  @override
  void initState() {
    super.initState();

    _loadUserSession();

    _entranceController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1100),
    );

    _headerOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _entranceController,
        curve: const Interval(0.0, 0.4, curve: Curves.easeIn),
      ),
    );
    _headerSlide = Tween<Offset>(
      begin: const Offset(0, -0.15),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _entranceController,
        curve: const Interval(0.0, 0.4, curve: Curves.easeOutCubic),
      ),
    );

    _cardsOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _entranceController,
        curve: const Interval(0.3, 0.7, curve: Curves.easeIn),
      ),
    );
    _cardsSlide = Tween<Offset>(
      begin: const Offset(0, 0.15),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _entranceController,
        curve: const Interval(0.3, 0.7, curve: Curves.easeOutCubic),
      ),
    );

    _calendarOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _entranceController,
        curve: const Interval(0.55, 1.0, curve: Curves.easeIn),
      ),
    );
    _calendarScale = Tween<double>(begin: 0.95, end: 1.0).animate(
      CurvedAnimation(
        parent: _entranceController,
        curve: const Interval(0.55, 1.0, curve: Curves.easeOutBack),
      ),
    );

    _entranceController.forward();
  }

  Future<void> _loadUserSession() async {
    final prefs = await SharedPreferences.getInstance();
    final phone = prefs.getString('user_phone') ??
        prefs.getString('phone_number') ??
        prefs.getString('phone');

    if (phone != null && phone.isNotEmpty) {
      setState(() {
        _userPhone = phone.startsWith('+91') ? phone : '+91 $phone';
      });
    }
  }

  @override
  void dispose() {
    _entranceController.dispose();
    super.dispose();
  }

  bool _isBothCollection(int weekday) {
    return weekday == DateTime.wednesday || weekday == DateTime.saturday;
  }

  String _getFormattedDate(DateTime now) {
    const weekdays = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ];
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

    String dayName = weekdays[now.weekday - 1];
    String monthName = months[now.month - 1];
    return '$dayName, ${now.day} $monthName ${now.year}';
  }

  void _showProfileBottomSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      barrierColor: Colors.black.withValues(alpha: 0.65),
      builder: (modalContext) {
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
                const SizedBox(height: 20),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFFC084FC).withValues(alpha: 0.2),
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: const Color(0xFFC084FC).withValues(alpha: 0.4),
                        ),
                      ),
                      child: const Icon(
                        Icons.person_rounded,
                        color: Color(0xFFC084FC),
                        size: 28,
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "Profile",
                            style: GoogleFonts.plusJakartaSans(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            "Phone Number",
                            style: GoogleFonts.plusJakartaSans(
                              color: Colors.white.withValues(alpha: 0.55),
                              fontSize: 11.5,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          Text(
                            _userPhone,
                            style: GoogleFonts.plusJakartaSans(
                              color: Colors.white,
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                const Divider(color: Colors.white12, height: 1),
                const SizedBox(height: 16),
                Material(
                  color: Colors.transparent,
                  child: InkWell(
                    onTap: () {
                      Navigator.pop(modalContext);
                      _showLogoutConfirmationDialog(context);
                    },
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 14),
                      decoration: BoxDecoration(
                        color: const Color(0xFFE53935).withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color:
                          const Color(0xFFE53935).withValues(alpha: 0.35),
                        ),
                      ),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.logout_rounded,
                            color: Color(0xFFEF5350),
                            size: 20,
                          ),
                          const SizedBox(width: 12),
                          Text(
                            "Logout",
                            style: GoogleFonts.plusJakartaSans(
                              color: const Color(0xFFEF5350),
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showLogoutConfirmationDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (dialogContext) {
        return BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
          child: AlertDialog(
            backgroundColor: const Color(0xFF260548).withValues(alpha: 0.95),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(24),
              side: BorderSide(
                color: Colors.white.withValues(alpha: 0.18),
                width: 1.2,
              ),
            ),
            title: Text(
              "Logout",
              style: GoogleFonts.plusJakartaSans(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 18,
              ),
            ),
            content: Text(
              "Are you sure you want to logout?",
              style: GoogleFonts.plusJakartaSans(
                color: Colors.white.withValues(alpha: 0.8),
                fontSize: 14,
              ),
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(dialogContext),
                child: Text(
                  "Cancel",
                  style: GoogleFonts.plusJakartaSans(
                    color: Colors.white.withValues(alpha: 0.65),
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              TextButton(
                onPressed: () async {
                  Navigator.pop(dialogContext);
                  await _performLogout(context);
                },
                child: Text(
                  "Logout",
                  style: GoogleFonts.plusJakartaSans(
                    color: const Color(0xFFEF5350),
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Future<void> _performLogout(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();

    if (!context.mounted) return;

    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (_) => const LoginPage()),
          (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    final DateTime now = DateTime.now();
    final bool isBoth = _isBothCollection(now.weekday);
    final String dateString = _getFormattedDate(now);

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
          child: Padding(
            padding: const EdgeInsets.fromLTRB(18, 12, 18, 85),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Spacer(flex: 1),

                // 1. REFINED HEADER SECTION
                AnimatedBuilder(
                  animation: _headerOpacity,
                  builder: (context, child) {
                    return Opacity(
                      opacity: _headerOpacity.value,
                      child: FractionalTranslation(
                        translation: _headerSlide.value,
                        child: child,
                      ),
                    );
                  },
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Expanded(
                            child: Text(
                              '♻️ Today\'s Collection',
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 25,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                                letterSpacing: 0.3,
                              ),
                            ),
                          ),
                          _ProfileIconButton(
                            onTap: () => _showProfileBottomSheet(context),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),

                      AnimatedSwitcher(
                        duration: const Duration(milliseconds: 300),
                        transitionBuilder: (child, animation) {
                          return FadeTransition(
                            opacity: animation,
                            child: ScaleTransition(
                              scale: Tween<double>(begin: 0.95, end: 1.0)
                                  .animate(animation),
                              child: child,
                            ),
                          );
                        },
                        child: _buildCollectionTypeBadge(
                          isBoth,
                          key: ValueKey(now.weekday),
                        ),
                      ),
                      const SizedBox(height: 6),

                      Text(
                        isBoth
                            ? "Keep both wet and dry waste segregated for today's collection."
                            : "Keep your wet waste ready for today's collection.",
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 12,
                          fontWeight: FontWeight.w400,
                          color: Colors.white.withValues(alpha: 0.65),
                        ),
                      ),
                      const SizedBox(height: 12),

                      Row(
                        children: [
                          _buildGlassChip(
                            icon: Icons.location_on_rounded,
                            iconColor: const Color(0xFFEC1C68),
                            label: 'Bengaluru',
                          ),
                          const SizedBox(width: 10),
                          _buildGlassChip(
                            icon: Icons.calendar_month_rounded,
                            iconColor: const Color(0xFFA855F7),
                            label: dateString,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                const Spacer(flex: 2),

                // 2. SUMMARY CARDS SECTION
                AnimatedBuilder(
                  animation: _cardsOpacity,
                  builder: (context, child) {
                    return Opacity(
                      opacity: _cardsOpacity.value,
                      child: FractionalTranslation(
                        translation: _cardsSlide.value,
                        child: child,
                      ),
                    );
                  },
                  child: Row(
                    children: const [
                      Expanded(
                        child: WasteSummaryCard(
                          title: 'Dry Waste Collection',
                          completed: 6,
                          total: 8,
                          subtitle: 'Collections this month',
                          icon: Icons.local_shipping_rounded,
                          accentColor: Color(0xFFFF9800),
                        ),
                      ),
                      SizedBox(width: 12),
                      Expanded(
                        child: WasteSummaryCard(
                          title: 'Wet Waste Collection',
                          completed: 16,
                          total: 22,
                          subtitle: 'Collections this month',
                          icon: Icons.water_drop_rounded,
                          accentColor: Color(0xFF4CAF50),
                        ),
                      ),
                    ],
                  ),
                ),

                const Spacer(flex: 2),

                // 3. STREAK CALENDAR SECTION
                AnimatedBuilder(
                  animation: _calendarOpacity,
                  builder: (context, child) {
                    return Opacity(
                      opacity: _calendarOpacity.value,
                      child: Transform.scale(
                        scale: _calendarScale.value,
                        child: child,
                      ),
                    );
                  },
                  child: const StreakCalendar(),
                ),

                const Spacer(flex: 1),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildCollectionTypeBadge(bool isBoth, {required Key key}) {
    if (isBoth) {
      return Row(
        key: key,
        mainAxisSize: MainAxisSize.min,
        children: [
          _buildPillBadge('🟢 Wet Waste', const Color(0xFF2E7D32)),
          const SizedBox(width: 8),
          _buildPillBadge('🟠 Dry Waste', const Color(0xFFE65100)),
        ],
      );
    } else {
      return _buildPillBadge('🟢 Wet Waste', const Color(0xFF2E7D32), key: key);
    }
  }

  Widget _buildPillBadge(String label, Color color, {Key? key}) {
    return Container(
      key: key,
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.22),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: color.withValues(alpha: 0.45),
          width: 1,
        ),
      ),
      child: Text(
        label,
        style: GoogleFonts.plusJakartaSans(
          fontSize: 15,
          fontWeight: FontWeight.w700,
          color: Colors.white,
        ),
      ),
    );
  }

  Widget _buildGlassChip({
    required IconData icon,
    required Color iconColor,
    required String label,
  }) {
    return _InteractiveGlassChip(
      icon: icon,
      iconColor: iconColor,
      label: label,
    );
  }
}

// ============================================================================
// PROFILE ICON BUTTON WITH GLASSMORPHISM & ANIMATIONS
// ============================================================================

class _ProfileIconButton extends StatefulWidget {
  final VoidCallback onTap;

  const _ProfileIconButton({required this.onTap});

  @override
  State<_ProfileIconButton> createState() => _ProfileIconButtonState();
}

class _ProfileIconButtonState extends State<_ProfileIconButton>
    with SingleTickerProviderStateMixin {
  late final AnimationController _pressController;
  late final Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _pressController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 100),
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.92).animate(
      CurvedAnimation(parent: _pressController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _pressController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => _pressController.forward(),
      onTapUp: (_) => _pressController.reverse(),
      onTapCancel: () => _pressController.reverse(),
      child: ScaleTransition(
        scale: _scaleAnimation,
        child: Container(
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: const Color(0xFFC084FC).withValues(alpha: 0.25),
                blurRadius: 12,
                spreadRadius: 1,
              ),
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.3),
                blurRadius: 8,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: ClipOval(
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
              child: Material(
                color: Colors.white.withValues(alpha: 0.12),
                child: InkWell(
                  onTap: widget.onTap,
                  splashColor: const Color(0xFFC084FC).withValues(alpha: 0.3),
                  highlightColor: Colors.transparent,
                  child: Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: Colors.white.withValues(alpha: 0.22),
                        width: 1.2,
                      ),
                    ),
                    child: const Icon(
                      Icons.person_rounded,
                      color: Colors.white,
                      size: 22,
                    ),
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

class _InteractiveGlassChip extends StatefulWidget {
  final IconData icon;
  final Color iconColor;
  final String label;

  const _InteractiveGlassChip({
    required this.icon,
    required this.iconColor,
    required this.label,
  });

  @override
  State<_InteractiveGlassChip> createState() => _InteractiveGlassChipState();
}

class _InteractiveGlassChipState extends State<_InteractiveGlassChip>
    with SingleTickerProviderStateMixin {
  late final AnimationController _pressController;
  late final Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _pressController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 100),
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.95).animate(
      CurvedAnimation(parent: _pressController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _pressController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => _pressController.forward(),
      onTapUp: (_) => _pressController.reverse(),
      onTapCancel: () => _pressController.reverse(),
      child: ScaleTransition(
        scale: _scaleAnimation,
        child: ClipRRect(
          borderRadius: BorderRadius.circular(18),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(18),
                border: Border.all(
                  color: Colors.white.withValues(alpha: 0.18),
                  width: 1,
                ),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(widget.icon, color: widget.iconColor, size: 13),
                  const SizedBox(width: 5),
                  Text(
                    widget.label,
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                      letterSpacing: 0.1,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}