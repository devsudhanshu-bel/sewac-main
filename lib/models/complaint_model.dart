class ComplaintModel {
  final int id;
  final String? imageUrl;
  final String description;
  final String priority;
  final String status;
  final double latitude;
  final double longitude;
  final String address;
  final DateTime createdAt;

  ComplaintModel({
    required this.id,
    this.imageUrl,
    required this.description,
    required this.priority,
    required this.status,
    required this.latitude,
    required this.longitude,
    required this.address,
    required this.createdAt,
  });

  factory ComplaintModel.fromJson(Map<String, dynamic> json) {
    return ComplaintModel(
      id: json["id"],
      imageUrl: json["image_url"],
      description: json["description"],
      priority: json["priority"],
      status: json["status"],
      latitude: (json["latitude"] as num).toDouble(),
      longitude: (json["longitude"] as num).toDouble(),
      address: json["address"],
      createdAt: DateTime.parse(json["created_at"]),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "id": id,
      "image_url": imageUrl,
      "description": description,
      "priority": priority,
      "status": status,
      "latitude": latitude,
      "longitude": longitude,
      "address": address,
      "created_at": createdAt.toIso8601String(),
    };
  }
}