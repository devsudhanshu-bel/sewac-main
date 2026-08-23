import 'dart:convert';
import 'dart:developer';
import 'dart:io';

import 'package:http/http.dart' as http;

import '../core/constants/api_constants.dart';
import '../core/network/api_client.dart';
import '../models/complaint_model.dart';

class ComplaintService {
  /// Extract detailed error messages from backend responses
  void _handleHttpError(int statusCode, dynamic jsonResponse, String rawBody) {
    log("Complaint API Error [$statusCode]: $rawBody");

    String message = "";
    if (jsonResponse is Map<String, dynamic>) {
      message = jsonResponse["message"] ??
          jsonResponse["error"] ??
          jsonResponse["data"]?.toString() ??
          "";
    }

    if (message.isEmpty) {
      message = rawBody.length < 120
          ? rawBody
          : "Server encountered an error ($statusCode)";
    }

    switch (statusCode) {
      case 400:
        throw Exception("Bad Request: $message");
      case 401:
        throw Exception("Unauthorized: Please log in again.");
      case 403:
        throw Exception("Forbidden: Access denied.");
      case 404:
        throw Exception("Not Found: $message");
      case 500:
        throw Exception("Server Error: $message");
      default:
        throw Exception("Error ($statusCode): $message");
    }
  }

  /// Fetches all user complaints
  Future<List<ComplaintModel>> getComplaints() async {
    final response = await ApiClient.get(ApiConstants.complaint);

    dynamic jsonResponse;
    try {
      jsonResponse = jsonDecode(response.body);
    } catch (_) {
      throw Exception("Invalid response format from server.");
    }

    if (response.statusCode == 200 && jsonResponse["success"] == true) {
      final data = jsonResponse["data"];
      final List<ComplaintModel> allComplaints = [];

      if (data != null && data is Map<String, dynamic>) {
        if (data["current"] != null && data["current"] is List) {
          for (var item in data["current"]) {
            allComplaints.add(ComplaintModel.fromJson(item));
          }
        }
        if (data["previous"] != null && data["previous"] is List) {
          for (var item in data["previous"]) {
            allComplaints.add(ComplaintModel.fromJson(item));
          }
        }
      }

      return allComplaints;
    }

    _handleHttpError(response.statusCode, jsonResponse, response.body);
    return [];
  }

  /// Fetches a specific complaint by ticket number
  Future<ComplaintModel> getComplaintByTicket(String ticketNumber) async {
    final url = ApiConstants.complaintByTicket(ticketNumber);
    final response = await ApiClient.get(url);

    dynamic jsonResponse;
    try {
      jsonResponse = jsonDecode(response.body);
    } catch (_) {
      throw Exception("Invalid response format from server.");
    }

    if (response.statusCode == 200 && jsonResponse["success"] == true) {
      final data = jsonResponse["data"];
      if (data != null) {
        return ComplaintModel.fromJson(data);
      }
    }

    _handleHttpError(response.statusCode, jsonResponse, response.body);
    throw Exception("Complaint not found.");
  }

  /// Creates a new complaint with Multipart file upload
  Future<ComplaintModel> createComplaint({
    required File image,
    required String description,
    required String priority,
    required double latitude,
    required double longitude,
    required String address,
    required String category,
    String title = "Garbage Issue",
  }) async {
    if (!await image.exists()) {
      throw Exception("Selected photo does not exist.");
    }

    final streamedResponse = await ApiClient.multipartPost(
      url: ApiConstants.complaint,
      file: image,
      fileField: "image",
      fields: {
        "title": title.trim().isEmpty ? "Garbage Issue" : title.trim(),
        "description": description.trim(),
        "category": category.trim(),
        "priority": priority.trim().isEmpty ? "MEDIUM" : priority.trim().toUpperCase(),
        "latitude": latitude.toString(),
        "longitude": longitude.toString(),
        "address": address.trim(),
      },
    );

    final response = await http.Response.fromStream(streamedResponse);

    dynamic jsonResponse;
    try {
      jsonResponse = jsonDecode(response.body);
    } catch (_) {
      log("Raw Server Response Body: ${response.body}");
      throw Exception("Server Error (${response.statusCode}): ${response.body}");
    }

    if ((response.statusCode == 200 || response.statusCode == 201) &&
        jsonResponse["success"] == true) {
      final data = jsonResponse["data"];
      if (data != null) {
        return ComplaintModel.fromJson(data);
      }
    }

    _handleHttpError(response.statusCode, jsonResponse, response.body);
    throw Exception("Failed to create complaint.");
  }
  /// Fetches the verification OTP for a complaint.
///
/// The backend must verify that the authenticated citizen
/// owns this complaint before returning any OTP.
/// Verifies the OTP entered by the citizen and closes the complaint.
Future<Map<String, dynamic>> verifyComplaintOtp({
  required String ticketNumber,
  required String otp,
}) async {
  if (!RegExp(r'^\d{6}$').hasMatch(otp)) {
    throw Exception("OTP must be a 6-digit number.");
  }

  final url = ApiConstants.verifyComplaintOtp(ticketNumber);

  final response = await ApiClient.post(
    url,
    body: {
      "otp": otp,
    },
  );

  dynamic jsonResponse;

  try {
    jsonResponse = jsonDecode(response.body);
  } catch (_) {
    throw Exception("Invalid response format from server.");
  }

  if (response.statusCode == 200 &&
      jsonResponse["success"] == true) {
    return Map<String, dynamic>.from(
      jsonResponse["data"] ?? {},
    );
  }

  _handleHttpError(
    response.statusCode,
    jsonResponse,
    response.body,
  );

  throw Exception("OTP verification failed.");
}
}
