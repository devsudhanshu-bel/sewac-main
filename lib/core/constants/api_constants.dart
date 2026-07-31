class ApiConstants {
  ApiConstants._();

  /// =====================================================================
  /// BASE URL
  /// =====================================================================

  // Local Development
  // static const String baseUrl = "http://10.0.2.2:5002/api";

  // Production
  static const String baseUrl =
      "https://sewac-citizen.onrender.com/api";

  /// =====================================================================
  /// AUTH
  /// =====================================================================

  static const String login =
      "$baseUrl/citizen/auth/login";

  /// =====================================================================
  /// HOME
  /// =====================================================================

  static const String calendar =
      "$baseUrl/citizen/home/calendar";

  /// =====================================================================
  /// COMPLAINTS
  /// =====================================================================

  static const String complaints =
      "$baseUrl/citizen/complaints";

  /// =====================================================================
  /// ANALYTICS
  /// =====================================================================

  static const String analytics =
      "$baseUrl/citizen/stats/analytics";

  /// =====================================================================
  /// MAPS
  /// =====================================================================

  /// Returns all live vehicle locations
  static const String liveVehicles =
      "$baseUrl/citizen/map/live";

  /// Returns a specific vehicle
  static String vehicle(String vehicleId) =>
      "$baseUrl/citizen/map/live/$vehicleId";
}