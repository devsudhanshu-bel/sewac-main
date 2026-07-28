import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class CustomBottomNavigation extends StatefulWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;

  const CustomBottomNavigation({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  State<CustomBottomNavigation> createState() => _CustomBottomNavigationState();
}

class _CustomBottomNavigationState extends State<CustomBottomNavigation>
    with SingleTickerProviderStateMixin {
  late final AnimationController _bounceController;
  late final Animation<double> _scaleAnimation;
  int _lastTappedIndex = -1;

  final List<IconData> _navIcons = const [
    Icons.home_rounded,
    Icons.map_rounded,
    Icons.credit_card_rounded,
    Icons.report_problem_rounded,
  ];

  @override
  void initState() {
    super.initState();
    // Micro-interaction bounce controller (1.0 -> 0.92 -> 1.08 -> 1.0 sequence)
    _bounceController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 240),
    );

    _scaleAnimation = TweenSequence<double>([
      TweenSequenceItem(
        tween: Tween<double>(begin: 1.0, end: 0.92)
            .chain(CurveTween(curve: Curves.easeOut)),
        weight: 30,
      ),
      TweenSequenceItem(
        tween: Tween<double>(begin: 0.92, end: 1.08)
            .chain(CurveTween(curve: Curves.easeOutCubic)),
        weight: 40,
      ),
      TweenSequenceItem(
        tween: Tween<double>(begin: 1.08, end: 1.0)
            .chain(CurveTween(curve: Curves.easeInCubic)),
        weight: 30,
      ),
    ]).animate(_bounceController);
  }

  @override
  void dispose() {
    _bounceController.dispose();
    super.dispose();
  }

  void _handleTap(int index) {
    if (widget.currentIndex == index) return;

    // Trigger haptic feedback
    HapticFeedback.lightImpact();

    setState(() {
      _lastTappedIndex = index;
    });

    _bounceController.forward(from: 0.0);
    widget.onTap(index);
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.only(bottom: 22.0), // Elevated floating margin
        child: Align(
          alignment: Alignment.bottomCenter,
          child: FractionallySizedBox(
            widthFactor: 0.84, // Balanced dock width
            child: Container(
              height: 62,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(34),
                boxShadow: [
                  // Single soft elegant shadow
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.22),
                    blurRadius: 26,
                    spreadRadius: 0,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(34),
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 11, sigmaY: 11), // Subtle blur
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    decoration: BoxDecoration(
                      // Translucent purple glass background
                      color: const Color(0xFF1E0A3C).withValues(alpha: 0.22),
                      borderRadius: BorderRadius.circular(34),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: List.generate(_navIcons.length, (index) {
                        final isSelected = widget.currentIndex == index;

                        Widget iconWidget = Icon(
                          _navIcons[index],
                          size: isSelected ? 28 : 24,
                          color: isSelected
                              ? Colors.white
                              : const Color(0xFFE9D5FF).withValues(alpha: 0.55),
                        );

                        // Apply spring animation to the newly selected item
                        if (isSelected && _lastTappedIndex == index) {
                          iconWidget = AnimatedBuilder(
                            animation: _scaleAnimation,
                            builder: (context, child) {
                              return Transform.scale(
                                scale: _scaleAnimation.value,
                                child: child,
                              );
                            },
                            child: iconWidget,
                          );
                        }

                        return GestureDetector(
                          onTap: () => _handleTap(index),
                          behavior: HitTestBehavior.opaque,
                          child: SizedBox(
                            width: 48,
                            height: 48,
                            child: Stack(
                              alignment: Alignment.center,
                              children: [
                                // Selected Circular Indicator (43px)
                                AnimatedContainer(
                                  duration: const Duration(milliseconds: 240),
                                  curve: Curves.easeOutCubic,
                                  width: isSelected ? 43 : 0,
                                  height: isSelected ? 43 : 0,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    gradient: isSelected
                                        ? const LinearGradient(
                                      colors: [
                                        Color(0xFFA855F7), // Top Purple
                                        Color(0xFF7C3AED), // Bottom Deep Purple
                                      ],
                                      begin: Alignment.topCenter,
                                      end: Alignment.bottomCenter,
                                    )
                                        : null,
                                    boxShadow: isSelected
                                        ? [
                                      // Softened ambient glow
                                      BoxShadow(
                                        color: const Color(0xFF7C3AED)
                                            .withValues(alpha: 0.28),
                                        blurRadius: 10,
                                        spreadRadius: 0,
                                        offset: const Offset(0, 3),
                                      ),
                                    ]
                                        : [],
                                  ),
                                ),

                                // Icon
                                AnimatedOpacity(
                                  duration: const Duration(milliseconds: 200),
                                  opacity: isSelected ? 1.0 : 0.65,
                                  child: iconWidget,
                                ),
                              ],
                            ),
                          ),
                        );
                      }),
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