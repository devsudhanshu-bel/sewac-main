import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

enum AttendanceStatus {
  attended,
  missed,
  future,
  otherMonth,
  today,
}

class AttendanceDay extends StatelessWidget {
  final int day;
  final AttendanceStatus status;

  const AttendanceDay({
    super.key,
    required this.day,
    required this.status,
  });

  @override
  Widget build(BuildContext context) {
    Color? backgroundColor;
    Gradient? gradient;
    Color textColor;
    List<BoxShadow>? boxShadow;

    switch (status) {
      case AttendanceStatus.today:
        gradient = const LinearGradient(
          colors: [
            Color(0xFFA855F7),
            Color(0xFF7C3AED),
          ],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        );
        textColor = Colors.white;
        boxShadow = [
          BoxShadow(
            color: Color(0xFFA855F7).withValues(alpha: 0.45),
            blurRadius: 6,
            spreadRadius: 1,
            offset: Offset(0, 2),
          ),
        ];
        break;

      case AttendanceStatus.attended:
        backgroundColor = const Color(0xFF2E7D32);
        textColor = Colors.white;
        boxShadow = [
          BoxShadow(
            color: Color(0xFF2E7D32).withValues(alpha: 0.30),
            blurRadius: 4,
            offset: Offset(0, 2),
          ),
        ];
        break;

      case AttendanceStatus.missed:
        backgroundColor = const Color(0xFFC62828);
        textColor = Colors.white;
        break;

      case AttendanceStatus.future:
        backgroundColor = Colors.white.withValues(alpha: 0.10);
        textColor = Colors.white.withValues(alpha: 0.55);
        break;

      case AttendanceStatus.otherMonth:
        backgroundColor = Colors.transparent;
        textColor = Colors.white.withValues(alpha: 0.22);
        break;
    }

    return Center(
      child: SizedBox(
        width: 34,
        height: 34,
        child: Container(
          decoration: BoxDecoration(
            color: backgroundColor,
            gradient: gradient,
            shape: BoxShape.circle,
            boxShadow: boxShadow,
          ),
          child: Center(
            child: FittedBox(
              fit: BoxFit.scaleDown,
              child: Text(
                day == 0 ? '' : '$day',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 10.5,
                  fontWeight: status == AttendanceStatus.future ||
                      status == AttendanceStatus.otherMonth
                      ? FontWeight.w500
                      : FontWeight.w700,
                  color: textColor,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}