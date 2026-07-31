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
  State<CustomBottomNavigation> createState() =>
      _CustomBottomNavigationState();
}

class _CustomBottomNavigationState extends State<CustomBottomNavigation>
    with SingleTickerProviderStateMixin {
  late final AnimationController _bounceController;
  late final Animation<double> _scaleAnimation;
  int _lastTappedIndex = -1;

  @override
  void initState() {
    super.initState();

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
        padding: const EdgeInsets.only(bottom: 1),
        child: Align(
          alignment: Alignment.bottomCenter,
          child: FractionallySizedBox(
            widthFactor: 0.84,
            child: Container(
              height: 62,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(34),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.22),
                    blurRadius: 26,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(34),
                child: BackdropFilter(
                  filter: ImageFilter.blur(
                    sigmaX: 11,
                    sigmaY: 11,
                  ),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E0A3C)
                          .withValues(alpha: 0.22),
                      borderRadius: BorderRadius.circular(34),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: List.generate(4, (index) {
                        final isSelected = widget.currentIndex == index;

                        IconData icon;

                        switch (index) {
                          case 0:
                            icon = isSelected
                                ? Icons.delete
                                : Icons.delete_outline;
                            break;

                          case 1:
                            icon = isSelected
                                ? Icons.local_shipping
                                : Icons.local_shipping_outlined;
                            break;

                          case 2:
                            icon = isSelected
                                ? Icons.analytics
                                : Icons.analytics_outlined;
                            break;

                          case 3:
                            icon = isSelected
                                ? Icons.report_problem
                                : Icons.report_problem_outlined;
                            break;

                          default:
                            icon = Icons.circle;
                        }

                        Widget iconWidget = Icon(
                          icon,
                          size: isSelected ? 28 : 24,
                          color: isSelected
                              ? Colors.white
                              : const Color(0xFFE9D5FF)
                              .withValues(alpha: 0.55),
                        );

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
                          behavior: HitTestBehavior.opaque,
                          onTap: () => _handleTap(index),
                          child: SizedBox(
                            width: 48,
                            height: 48,
                            child: Stack(
                              alignment: Alignment.center,
                              children: [
                                AnimatedContainer(
                                  duration:
                                  const Duration(milliseconds: 240),
                                  curve: Curves.easeOutCubic,
                                  width: isSelected ? 43 : 0,
                                  height: isSelected ? 43 : 0,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    gradient: isSelected
                                        ? const LinearGradient(
                                      colors: [
                                        Color(0xFFA855F7),
                                        Color(0xFF7C3AED),
                                      ],
                                      begin: Alignment.topCenter,
                                      end: Alignment.bottomCenter,
                                    )
                                        : null,
                                    boxShadow: isSelected
                                        ? [
                                      BoxShadow(
                                        color: const Color(0xFF7C3AED)
                                            .withValues(alpha: 0.28),
                                        blurRadius: 10,
                                        offset: const Offset(0, 3),
                                      ),
                                    ]
                                        : [],
                                  ),
                                ),
                                AnimatedOpacity(
                                  duration:
                                  const Duration(milliseconds: 200),
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