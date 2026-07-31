import 'dart:convert';

import '../core/constants/api_constants.dart';
import '../core/network/api_client.dart';
import '../models/analytics_model.dart';

class StatsService {
  StatsService._();

  /// ==========================================================
  /// GET ANALYTICS
  /// ==========================================================

  static Future<AnalyticsModel> getAnalytics({
    required DateTime startDate,
    required DateTime endDate,
  }) async {
    final response = await ApiClient.get(
      "${ApiConstants.analytics}"
          "?startDate=${startDate.toIso8601String().split('T').first}"
          "&endDate=${endDate.toIso8601String().split('T').first}",
    );

    if (response.statusCode == 200) {
      return AnalyticsModel.fromJson(
        jsonDecode(response.body),
      );
    }

    throw Exception(
      "Failed to fetch analytics (${response.statusCode})",
    );
  }
}