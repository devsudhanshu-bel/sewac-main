import 'package:latlong2/latlong.dart';

class VehiclePoint {
  final double latitude;
  final double longitude;

  const VehiclePoint({
    required this.latitude,
    required this.longitude,
  });

  factory VehiclePoint.fromJson(Map<String, dynamic> json) {
    return VehiclePoint(
      latitude: (json["latitude"] as num).toDouble(),
      longitude: (json["longitude"] as num).toDouble(),
    );
  }

  LatLng toLatLng() {
    return LatLng(latitude, longitude);
  }
}