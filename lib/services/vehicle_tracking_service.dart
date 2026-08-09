import 'dart:convert';

import '../core/constants/api_constants.dart';
import '../core/network/api_client.dart';
import '../models/vehicle_location.dart';

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
}