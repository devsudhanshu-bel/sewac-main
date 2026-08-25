class Citizen {
  final int id;
  final String personName;
  final String phoneNumber;
  final String drySlno;
  final String wetSlno;

  //==========================================================
  // GEOGRAPHIC HIERARCHY
  //==========================================================

  final int cityId;
  final int zoneId;
  final int divisionId;
  final int wardId;

  Citizen({
    required this.id,
    required this.personName,
    required this.phoneNumber,
    required this.drySlno,
    required this.wetSlno,
    required this.cityId,
    required this.zoneId,
    required this.divisionId,
    required this.wardId,
  });

  factory Citizen.fromJson(
      Map<String, dynamic> json,
      ) {
    return Citizen(
      id: (json["id"] as num).toInt(),

      personName:
      json["personName"]?.toString() ?? "",

      phoneNumber:
      json["phoneNumber"]?.toString() ?? "",

      drySlno:
      json["drySlno"]?.toString() ?? "",

      wetSlno:
      json["wetSlno"]?.toString() ?? "",

      //======================================================
      // GEOGRAPHIC HIERARCHY
      //======================================================

      cityId:
      (json["cityId"] as num).toInt(),

      zoneId:
      (json["zoneId"] as num).toInt(),

      divisionId:
      (json["divisionId"] as num).toInt(),

      wardId:
      (json["wardId"] as num).toInt(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "id": id,

      "personName":
      personName,

      "phoneNumber":
      phoneNumber,

      "drySlno":
      drySlno,

      "wetSlno":
      wetSlno,

      //======================================================
      // GEOGRAPHIC HIERARCHY
      //======================================================

      "cityId":
      cityId,

      "zoneId":
      zoneId,

      "divisionId":
      divisionId,

      "wardId":
      wardId,
    };
  }
}