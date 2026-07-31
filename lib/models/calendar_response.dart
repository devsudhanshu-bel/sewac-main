class CalendarResponse {
  final int year;
  final int month;
  final WasteSummary dry;
  final WasteSummary wet;
  final int streak;
  final List<CalendarDay> calendar;

  CalendarResponse({
    required this.year,
    required this.month,
    required this.dry,
    required this.wet,
    required this.streak,
    required this.calendar,
  });

  factory CalendarResponse.fromJson(Map<String, dynamic> json) {
    final data = json["data"] ?? json;

    return CalendarResponse(
      year: data["year"],
      month: data["month"],
      dry: WasteSummary.fromJson(data["dry"]),
      wet: WasteSummary.fromJson(data["wet"]),
      streak: data["streak"],
      calendar: (data["calendar"] as List)
          .map((e) => CalendarDay.fromJson(e))
          .toList(),
    );
  }
}

class WasteSummary {
  final int completed;
  final int total;

  WasteSummary({
    required this.completed,
    required this.total,
  });

  factory WasteSummary.fromJson(Map<String, dynamic> json) {
    return WasteSummary(
      completed: json["completed"] ?? 0,
      total: json["total"] ?? 0,
    );
  }
}

class CalendarDay {
  final int day;
  final String date;
  final int weekday;
  final String collectionType;
  final String status;

  CalendarDay({
    required this.day,
    required this.date,
    required this.weekday,
    required this.collectionType,
    required this.status,
  });

  factory CalendarDay.fromJson(Map<String, dynamic> json) {
    return CalendarDay(
      day: json["day"],
      date: json["date"],
      weekday: json["weekday"],
      collectionType: json["collectionType"],
      status: json["status"],
    );
  }

  bool get isDry =>
      collectionType.toUpperCase() == "DRY";

  bool get isWet =>
      collectionType.toUpperCase() == "WET";

  bool get isAttended =>
      status.toUpperCase() == "ATTENDED";

  bool get isMissed =>
      status.toUpperCase() == "MISSED";

  bool get isToday =>
      status.toUpperCase() == "TODAY";

  bool get isUpcoming =>
      status.toUpperCase() == "UPCOMING";
}