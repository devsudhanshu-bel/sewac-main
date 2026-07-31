class Citizen {
  final int id;
  final String personName;
  final String phoneNumber;
  final String drySlno;
  final String wetSlno;

  Citizen({
    required this.id,
    required this.personName,
    required this.phoneNumber,
    required this.drySlno,
    required this.wetSlno,
  });

  factory Citizen.fromJson(
      Map<String, dynamic> json,
      ) {
    return Citizen(
      id: json["id"],
      personName: json["personName"],
      phoneNumber: json["phoneNumber"],
      drySlno: json["drySlno"],
      wetSlno: json["wetSlno"],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "id": id,
      "personName": personName,
      "phoneNumber": phoneNumber,
      "drySlno": drySlno,
      "wetSlno": wetSlno,
    };
  }
}