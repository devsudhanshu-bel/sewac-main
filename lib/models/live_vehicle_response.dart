class LiveVehicleResponse {
  final PersonLocation personLocation;
  final LiveVehicleFilters filters;
  final List<LiveVehicle> vehicles;

  LiveVehicleResponse({
    required this.personLocation,
    required this.filters,
    required this.vehicles,
  });

  factory LiveVehicleResponse.fromJson(
      Map<String, dynamic> json,
      ) {
    final data =
    json['data'] as Map<String, dynamic>;

    return LiveVehicleResponse(
      personLocation:
      PersonLocation.fromJson(
        data['personLocation']
        as Map<String, dynamic>,
      ),

      filters:
      LiveVehicleFilters.fromJson(
        data['filters']
        as Map<String, dynamic>,
      ),

      vehicles:
      (data['vehicles'] as List<dynamic>)
          .map(
            (vehicle) =>
            LiveVehicle.fromJson(
              vehicle
              as Map<String, dynamic>,
            ),
      )
          .toList(),
    );
  }
}

//==========================================================
// PERSON LOCATION
//==========================================================

class PersonLocation {
  final double latitude;
  final double longitude;

  PersonLocation({
    required this.latitude,
    required this.longitude,
  });

  factory PersonLocation.fromJson(
      Map<String, dynamic> json,
      ) {
    return PersonLocation(
      latitude:
      (json['latitude'] as num).toDouble(),

      longitude:
      (json['longitude'] as num).toDouble(),
    );
  }
}

//==========================================================
// LIVE VEHICLE FILTERS
//==========================================================

class LiveVehicleFilters {
  final int cityId;
  final int zoneId;
  final int divisionId;
  final int wardId;

  LiveVehicleFilters({
    required this.cityId,
    required this.zoneId,
    required this.divisionId,
    required this.wardId,
  });

  factory LiveVehicleFilters.fromJson(
      Map<String, dynamic> json,
      ) {
    return LiveVehicleFilters(
      cityId:
      (json['cityId'] as num).toInt(),

      zoneId:
      (json['zoneId'] as num).toInt(),

      divisionId:
      (json['divisionId'] as num).toInt(),

      wardId:
      (json['wardId'] as num).toInt(),
    );
  }
}

//==========================================================
// LIVE VEHICLE
//==========================================================

class LiveVehicle {
  final String vehicleId;
  final double? latitude;
  final double? longitude;
  final double? distance;
  final String distanceUnit;
  final String status;
  final DateTime? lastUpdated;
  final String? vehicleType;

  LiveVehicle({
    required this.vehicleId,
    required this.latitude,
    required this.longitude,
    required this.distance,
    required this.distanceUnit,
    required this.status,
    required this.lastUpdated,
    this.vehicleType,
  });

  factory LiveVehicle.fromJson(
      Map<String, dynamic> json,
      ) {
    return LiveVehicle(
      vehicleId:
      json['vehicleId'].toString(),

      latitude:
      json['latitude'] == null
          ? null
          : (json['latitude'] as num)
          .toDouble(),

      longitude:
      json['longitude'] == null
          ? null
          : (json['longitude'] as num)
          .toDouble(),

      distance:
      json['distance'] == null
          ? null
          : (json['distance'] as num)
          .toDouble(),

      distanceUnit:
      json['distanceUnit']?.toString() ??
          'km',

      status:
      json['status']?.toString() ??
          'INACTIVE',

      lastUpdated:
      json['lastUpdated'] == null
          ? null
          : DateTime.tryParse(
        json['lastUpdated']
            .toString(),
      ),

      vehicleType:
      json['vehicleType']?.toString(),
    );
  }
}