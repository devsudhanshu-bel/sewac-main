import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:latlong2/latlong.dart';

class OSRMService {
  OSRMService._();

  static const String _baseUrl =
      "https://router.project-osrm.org/route/v1/driving";

  static Future<List<LatLng>> fetchRoute(
      LatLng start,
      LatLng end,
      ) async {
    try {
      final url = Uri.parse(
        "$_baseUrl/"
            "${start.longitude},${start.latitude};"
            "${end.longitude},${end.latitude}"
            "?overview=full&geometries=geojson",
      );

      final response = await http.get(url);

      if (response.statusCode != 200) {
        return [];
      }

      final data = jsonDecode(response.body);

      final routes = data["routes"];

      if (routes == null || routes.isEmpty) {
        return [];
      }

      final coordinates =
      routes[0]["geometry"]["coordinates"] as List<dynamic>;

      return coordinates
          .map(
            (point) => LatLng(
          (point[1] as num).toDouble(),
          (point[0] as num).toDouble(),
        ),
      )
          .toList();
    } catch (e) {
      return [];
    }
  }
}