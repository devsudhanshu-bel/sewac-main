import 'package:flutter/material.dart';

class ResponsiveUtils {
  final BuildContext context;
  late double screenWidth;
  late double screenHeight;
  late double viewInsetsBottom;
  late bool isKeyboardOpen;
  late bool isSmallPhone;
  late bool isTablet;

  ResponsiveUtils(this.context) {
    final mediaQuery = MediaQuery.of(context);
    screenWidth = mediaQuery.size.width;
    screenHeight = mediaQuery.size.height;
    viewInsetsBottom = mediaQuery.viewInsets.bottom;
    isKeyboardOpen = viewInsetsBottom > 0;
    isSmallPhone = screenWidth < 380 || screenHeight < 680;
    isTablet = screenWidth >= 600;
  }

  double scaleWidth(double val) => (screenWidth / 390.0) * val;
  double scaleHeight(double val) => (screenHeight / 844.0) * val;

  double get responsiveVerticalPadding =>
      isSmallPhone ? 10.0 : (isTablet ? 24.0 : 16.0);

  double get responsiveHorizontalPadding =>
      isSmallPhone ? 14.0 : (isTablet ? 28.0 : 18.0);
}