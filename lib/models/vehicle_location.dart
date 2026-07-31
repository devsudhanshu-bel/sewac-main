import 'package:latlong2/latlong.dart';

import 'vehicle_point.dart';

class VehicleLocation {
  final String vehicleId;
  final VehiclePoint initialPoint;
  final VehiclePoint oldPoint;
  final VehiclePoint newPoint;
  final DateTime updatedAt;

  const VehicleLocation({
    required this.vehicleId,
    required this.initialPoint,
    required this.oldPoint,
    required this.newPoint,
    required this.updatedAt,
  });

  factory VehicleLocation.fromJson(Map<String, dynamic> json) {
    return VehicleLocation(
      vehicleId: json["vehicleId"],
      initialPoint: VehiclePoint.fromJson(json["initialPoint"]),
      oldPoint: VehiclePoint.fromJson(json["oldPoint"]),
      newPoint: VehiclePoint.fromJson(json["newPoint"]),
      updatedAt: DateTime.parse(json["updatedAt"]),
    );
  }

  LatLng get currentPosition => newPoint.toLatLng();
}