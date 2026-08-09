import 'dart:convert';

import '../core/constants/api_constants.dart';
import '../core/network/api_client.dart';
import '../core/storage/token_storage.dart';
import '../models/citizen.dart';
import '../models/login_response.dart';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  AuthService._();

  static Future<LoginResponse> login(
      String phoneNumber,
      ) async {
    final response = await ApiClient.post(
      ApiConstants.login,
      {
        "phoneNumber": phoneNumber,
      },
    );

    final json = jsonDecode(response.body);

    if (response.statusCode == 200 &&
        json["success"] == true) {
      final loginResponse = LoginResponse.fromJson(
        json["data"],
      );

      await TokenStorage.saveToken(
        loginResponse.token,
      );



      final savedToken = await TokenStorage.getToken();

      debugPrint("=================================");
      debugPrint("TOKEN SAVED: $savedToken");
      debugPrint("=================================");

      return loginResponse;
    }

    throw Exception(
      json["message"] ??
          "Unable to login.",
    );
  }

  static Future<void> logout() async {
    try {
      await ApiClient.post(
        ApiConstants.logout,
        {},
      );
    } catch (_) {
      // Ignore network errors on logout to ensure local cleanup succeeds
    } finally {
      await TokenStorage.removeToken();
    }
  }

  static Future<Citizen> getCurrentCitizen() async {
    final response = await ApiClient.get(
      ApiConstants.me,
    );

    debugPrint("========== /me ==========");
    debugPrint("Status : ${response.statusCode}");
    debugPrint("Body : ${response.body}");
    debugPrint("=========================");

    if (response.statusCode == 200) {
      final json = jsonDecode(response.body);
      if (json["success"] == true && json["data"] != null) {
        return Citizen.fromJson(
          json["data"]["citizen"],
        );
      }
    }

    throw Exception("Unauthorized");
  }

  static Future<bool> isLoggedIn() async {
    return await TokenStorage.isLoggedIn();
  }

  static Future<String?> getToken() async {
    return await TokenStorage.getToken();
  }
}