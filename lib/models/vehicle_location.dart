import 'package:latlong2/latlong.dart';

import 'vehicle_point.dart';

class VehicleLocation {
  final String vehicleId;
  final VehiclePoint initialPoint;
  final VehiclePoint previousPoint;
  final VehiclePoint currentPoint;
  final double speed;
  final String status;
  final double distance;
  final DateTime updatedAt;

  const VehicleLocation({
    required this.vehicleId,
    required this.initialPoint,
    required this.previousPoint,
    required this.currentPoint,
    required this.speed,
    required this.status,
    required this.distance,
    required this.updatedAt,
  });

  factory VehicleLocation.fromJson(Map<String, dynamic> json) {
    return VehicleLocation(
      vehicleId: json["vehicleId"] ?? "",
      initialPoint: VehiclePoint.fromJson(json["initialPoint"]),
      previousPoint: VehiclePoint.fromJson(json["previousPoint"]),
      currentPoint: VehiclePoint.fromJson(json["currentPoint"]),
      speed: (json["speed"] as num?)?.toDouble() ?? 0.0,
      status: json["status"] ?? "OFFLINE",
      distance: (json["distance"] as num?)?.toDouble() ?? 0.0,
      updatedAt: DateTime.parse(json["updatedAt"]),
    );
  }

  LatLng get currentPosition => currentPoint.toLatLng();
}