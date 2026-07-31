import 'dart:convert';

import '../core/constants/api_constants.dart';
import '../core/network/api_client.dart';
import '../core/storage/token_storage.dart';
import '../models/login_response.dart';

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
      final loginResponse =
      LoginResponse.fromJson(
        json["data"],
      );

      await TokenStorage.saveToken(
        loginResponse.token,
      );

      return loginResponse;
    }

    throw Exception(
      json["message"] ??
          "Unable to login.",
    );
  }

  static Future<void> logout() async {
    await TokenStorage.removeToken();
  }

  static Future<bool> isLoggedIn() async {
    return await TokenStorage.isLoggedIn();
  }

  static Future<String?> getToken() async {
    return await TokenStorage.getToken();
  }
}