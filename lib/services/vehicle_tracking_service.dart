import 'dart:convert';

import '../core/constants/api_constants.dart';
import '../core/network/api_client.dart';
import '../models/vehicle_location.dart';
import '../models/live_vehicle_response.dart';

class VehicleTrackingService {
  VehicleTrackingService();

  //==========================================================
  // GET NEAREST VEHICLE
  //==========================================================

  Future<VehicleLocation> getNearestVehicle(
      double latitude,
      double longitude,
      ) async {
    final url = ApiConstants.nearestVehicle(latitude, longitude);

    print("==================================");
    print("GET URL: $url");

    final response = await ApiClient.get(url);

    print("STATUS: ${response.statusCode}");
    print("BODY: ${response.body}");
    print("==================================");

    if (response.statusCode != 200) {
      throw Exception("Failed to fetch nearest vehicle.");
    }

    final body = jsonDecode(response.body);

    return VehicleLocation.fromJson(
      body["data"],
    );
  }

  //==========================================================
  // GET ALL LIVE VEHICLES
  //==========================================================

  Future<List<VehicleLocation>> getLiveVehicles() async {
    final response = await ApiClient.get(
      ApiConstants.liveVehicles,
    );

    print("==================================");
    print("GET URL: ${ApiConstants.liveVehicles}");
    print("STATUS: ${response.statusCode}");
    print("BODY: ${response.body}");
    print("==================================");

    if (response.statusCode != 200) {
      throw Exception("Failed to fetch live vehicles.");
    }

    final body = jsonDecode(response.body);

    final List<dynamic> vehicles = body["data"];

    return vehicles
        .map((e) => VehicleLocation.fromJson(e))
        .toList();
  }

  //==========================================================
  // GET SINGLE VEHICLE
  //==========================================================

  Future<VehicleLocation> getVehicle(
      String vehicleId,
      ) async {
    final url = ApiConstants.vehicle(vehicleId);

    print("==================================");
    print("GET URL: $url");

    final response = await ApiClient.get(url);

    print("STATUS: ${response.statusCode}");
    print("BODY: ${response.body}");
    print("==================================");

    if (response.statusCode != 200) {
      throw Exception("Failed to fetch vehicle.");
    }

    final body = jsonDecode(response.body);

    return VehicleLocation.fromJson(
      body["data"],
    );
  }

  //==========================================================
  // GET LIVE VEHICLES FOR SELECTED CITY → ZONE → DIVISION → WARD
  //==========================================================

  Future<LiveVehicleResponse> getLiveVehicleLocations({
    required double latitude,
    required double longitude,
    required int cityId,
    required int zoneId,
    required int divisionId,
    required int wardId,
  }) async {
    final url =
        "${ApiConstants.liveVehicleLocations}"
        "?latitude=$latitude"
        "&longitude=$longitude"
        "&cityId=$cityId"
        "&zoneId=$zoneId"
        "&divisionId=$divisionId"
        "&wardId=$wardId";

    print("==================================");
    print("GET LIVE VEHICLE LOCATIONS");
    print("GET URL: $url");

    final response = await ApiClient.get(url);

    print("STATUS: ${response.statusCode}");
    print("BODY: ${response.body}");
    print("==================================");

    if (response.statusCode != 200) {
      throw Exception(
        "Failed to fetch live vehicle locations.",
      );
    }

    final body = jsonDecode(response.body);

    if (body["success"] != true) {
      throw Exception(
        body["message"] ??
            "Failed to fetch live vehicle locations.",
      );
    }

    return LiveVehicleResponse.fromJson(body);
  }
}