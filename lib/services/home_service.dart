import 'dart:convert';

import '../core/constants/api_constants.dart';
import '../core/network/api_client.dart';
import '../models/calendar_response.dart';

class HomeService {
  HomeService._();

  /// Fetch waste collection calendar for a given month.
  /// If no month/year is provided, it defaults to the current month.
  static Future<CalendarResponse> getCalendar({
    int? year,
    int? month,
  }) async {
    final now = DateTime.now();

    year ??= now.year;
    month ??= now.month;

    final response = await ApiClient.get(
      "${ApiConstants.calendar}?year=$year&month=$month",
    );

    final json = jsonDecode(response.body);

    if (response.statusCode == 200 && json["success"] == true) {
      return CalendarResponse.fromJson(json);
    }

    throw Exception(
      json["message"] ?? "Unable to fetch calendar.",
    );
  }
}