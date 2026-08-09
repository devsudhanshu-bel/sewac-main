class ApiConstants {
  ApiConstants._();

  /// =====================================================================
  /// BASE URL
  /// =====================================================================

  // Production
  static const String baseUrl =
      "https://sewac-citizen.onrender.com/api";

  /// =====================================================================
  /// AUTH
  /// =====================================================================

  static const String login =
      "$baseUrl/citizen/auth/login";

  static const String logout =
      "$baseUrl/citizen/auth/logout";

  static const String me =
      "$baseUrl/citizen/auth/me";

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

  static const String complaint =
      "$baseUrl/citizen/complaint";

  static String complaintByTicket(String ticketNumber) =>
      "$complaint/$ticketNumber";

  static String complaintVerification(String ticketNumber) =>
    "$complaint/$ticketNumber/verification";
  
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

  /// Returns nearest vehicle location to given coordinates
  static String nearestVehicle(
      double latitude,
      double longitude,
      ) =>
      "$baseUrl/citizen/map/nearest?latitude=$latitude&longitude=$longitude";

  /// Returns a specific vehicle
  static String vehicle(String vehicleId) =>
      "$baseUrl/citizen/map/live/$vehicleId";
}
