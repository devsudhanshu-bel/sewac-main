class ComplaintModel {
  final int id;
  final String? ticketNumber;
  final String? phoneNumber;
  final String? title;
  final String description;
  final String? category;
  final String? imageUrl;
  final double latitude;
  final double longitude;
  final String address;
  final String status;
  final String priority;
  final String? otfHash;
  final DateTime? otpExpiry;
  final bool? otpVerified;
  final String? assignedTo;
  final String? remarks;
  final DateTime createdAt;
  final DateTime? updatedAt;
  final DateTime? closedAt;
  final String? verificationCode;
  final DateTime? verificationExpiresAt;

  ComplaintModel({
    required this.id,
    this.ticketNumber,
    this.phoneNumber,
    this.title,
    required this.description,
    this.category,
    this.imageUrl,
    required this.latitude,
    required this.longitude,
    required this.address,
    required this.status,
    required this.priority,
    this.otfHash,
    this.otpExpiry,
    this.otpVerified,
    this.assignedTo,
    this.remarks,
    required this.createdAt,
    this.updatedAt,
    this.closedAt,
    this.verificationCode,
    this.verificationExpiresAt,
  });

  ComplaintModel copyWith({
    int? id,
    String? ticketNumber,
    String? phoneNumber,
    String? title,
    String? description,
    String? category,
    String? imageUrl,
    double? latitude,
    double? longitude,
    String? address,
    String? status,
    String? priority,
    String? otfHash,
    DateTime? otpExpiry,
    bool? otpVerified,
    String? assignedTo,
    String? remarks,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? closedAt,
    String? verificationCode,
    DateTime? verificationExpiresAt,
  }) {
    return ComplaintModel(
      id: id ?? this.id,
      ticketNumber: ticketNumber ?? this.ticketNumber,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      title: title ?? this.title,
      description: description ?? this.description,
      category: category ?? this.category,
      imageUrl: imageUrl ?? this.imageUrl,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      address: address ?? this.address,
      status: status ?? this.status,
      priority: priority ?? this.priority,
      otfHash: otfHash ?? this.otfHash,
      otpExpiry: otpExpiry ?? this.otpExpiry,
      otpVerified: otpVerified ?? this.otpVerified,
      assignedTo: assignedTo ?? this.assignedTo,
      remarks: remarks ?? this.remarks,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      closedAt: closedAt ?? this.closedAt,
      verificationCode: verificationCode ?? this.verificationCode,
      verificationExpiresAt: verificationExpiresAt ?? this.verificationExpiresAt,
    );
  }

  factory ComplaintModel.fromJson(Map<String, dynamic> json) {
    return ComplaintModel(
      id: json['id'] is int
          ? json['id']
          : int.tryParse(json['id']?.toString() ?? '0') ?? 0,
      ticketNumber: json['ticket_number'] ?? json['ticketNumber'],
      phoneNumber: json['phone_number'] ?? json['phoneNumber'],
      title: json['title'],
      description: json['description'] ?? '',
      category: json['category'],
      imageUrl: json['image_url'] ?? json['imageUrl'],
      latitude: (json['latitude'] as num?)?.toDouble() ?? 0.0,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 0.0,
      address: json['address'] ?? '',
      status: json['status'] ?? 'PENDING',
      priority: json['priority'] ?? 'MEDIUM',
      otfHash: json['otp_hash'] ?? json['otfHash'],
      otpExpiry: json['otp_expiry'] != null
          ? DateTime.tryParse(json['otp_expiry'])
          : null,
      otpVerified: json['otp_verified'],
      assignedTo: json['assigned_to'] ?? json['assignedTo'],
      remarks: json['remarks'],
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'])
          : (json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now()),
      updatedAt: json['updated_at'] != null
          ? DateTime.tryParse(json['updated_at'])
          : null,
      closedAt: json['closed_at'] != null
          ? DateTime.tryParse(json['closed_at'])
          : null,
      verificationCode: json['verification_code'] ?? json['verificationCode'],
      verificationExpiresAt: json['verification_expires_at'] != null
          ? DateTime.tryParse(json['verification_expires_at'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'ticket_number': ticketNumber,
      'phone_number': phoneNumber,
      'title': title,
      'description': description,
      'category': category,
      'image_url': imageUrl,
      'latitude': latitude,
      'longitude': longitude,
      'address': address,
      'status': status,
      'priority': priority,
      'otp_hash': otfHash,
      'otp_expiry': otpExpiry?.toIso8601String(),
      'otp_verified': otpVerified,
      'assigned_to': assignedTo,
      'remarks': remarks,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
      'closed_at': closedAt?.toIso8601String(),
      'verification_code': verificationCode,
      'verification_expires_at': verificationExpiresAt?.toIso8601String(),
    };
  }
}