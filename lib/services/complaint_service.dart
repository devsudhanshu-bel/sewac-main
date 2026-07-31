import 'dart:convert';
import 'dart:io';

import '../core/network/api_client.dart';
import '../core/constants/api_constants.dart';
import '../models/complaint_model.dart';

class ComplaintService {
  /// ==========================================================
  /// GET ALL COMPLAINTS
  /// ==========================================================

  Future<List<ComplaintModel>> getComplaints() async {
    final response = await ApiClient.get(
      ApiConstants.complaints,
    );

    if (response.statusCode != 200) {
      throw Exception("Failed to fetch complaints.");
    }

    final Map<String, dynamic> json =
    jsonDecode(response.body);

    final List complaints = json["data"];

    return complaints
        .map(
          (e) => ComplaintModel.fromJson(e),
    )
        .toList();
  }

  /// ==========================================================
  /// CREATE COMPLAINT
  /// ==========================================================

  Future<ComplaintModel> createComplaint({
    required File image,
    required String description,
    required String priority,
    required double latitude,
    required double longitude,
    required String address,
  }) async {
    final response = await ApiClient.multipartPost(
      url: ApiConstants.complaints,
      file: image,
      fileField: "image",
      fields: {
        "description": description,
        "priority": priority,
        "latitude": latitude.toString(),
        "longitude": longitude.toString(),
        "address": address,
      },
    );

    final body =
    await response.stream.bytesToString();

    final Map<String, dynamic> json =
    jsonDecode(body);

    if (response.statusCode != 201) {
      throw Exception(
        json["message"] ?? "Failed to create complaint.",
      );
    }

    return ComplaintModel.fromJson(
      json["data"],
    );
  }
}