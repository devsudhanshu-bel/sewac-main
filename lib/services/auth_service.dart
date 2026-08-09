import 'dart:convert';

import 'package:device_info_plus/device_info_plus.dart';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../core/constants/api_constants.dart';
import '../core/network/api_client.dart';
import '../core/storage/token_storage.dart';
import '../models/citizen.dart';
import '../models/login_response.dart';

class DeviceEnrollmentException implements Exception {
  final String message;
  final int remainingSeconds;

  DeviceEnrollmentException({
    required this.message,
    required this.remainingSeconds,
  });

  @override
  String toString() => message;
}

class AuthService {
  AuthService._();

  static const String _deviceIdKey = 'sewac_device_id';

  // ============================================================
  // GET / CREATE DEVICE ID
  // ============================================================

  static Future<String> _getDeviceId() async {
    final prefs = await SharedPreferences.getInstance();

    // First use the already saved ID.
    final savedDeviceId = prefs.getString(_deviceIdKey);

    if (savedDeviceId != null && savedDeviceId.isNotEmpty) {
      return savedDeviceId;
    }

    final deviceInfo = DeviceInfoPlugin();

    String deviceId;

    try {
      if (defaultTargetPlatform == TargetPlatform.android) {
        final androidInfo = await deviceInfo.androidInfo;

        deviceId = androidInfo.id;
      } else if (defaultTargetPlatform == TargetPlatform.iOS) {
        final iosInfo = await deviceInfo.iosInfo;

        deviceId =
            iosInfo.identifierForVendor ??
            'ios-${iosInfo.name}-${iosInfo.model}';
      } else {
        // Fallback for unsupported platforms.
        deviceId =
            'sewac-${DateTime.now().microsecondsSinceEpoch}';
      }
    } catch (e) {
      debugPrint(
        'Unable to read platform device ID: $e',
      );

      // Fallback ID.
      deviceId =
          'sewac-${DateTime.now().microsecondsSinceEpoch}';
    }

    // Save it so the same app installation keeps
    // using the same identifier.
    await prefs.setString(
      _deviceIdKey,
      deviceId,
    );

    return deviceId;
  }

  // ============================================================
  // LOGIN
  // ============================================================

  static Future login(
    String phoneNumber,
  ) async {
    final deviceId = await _getDeviceId();

    debugPrint(
      'SEWAC LOGIN DEVICE ID: $deviceId',
    );

    final response = await ApiClient.post(
      ApiConstants.login,
      {
        'phoneNumber': phoneNumber,
        'deviceId': deviceId,
      },
    );

    final json = jsonDecode(response.body);

    debugPrint('========== LOGIN ==========');
    debugPrint(
      'Status : ${response.statusCode}',
    );
    debugPrint(
      'Body : ${response.body}',
    );
    debugPrint('===========================');

    // ==========================================================
    // 200 → LOGIN SUCCESSFUL
    // ==========================================================

    if (response.statusCode == 200 &&
        json['success'] == true) {
      final loginResponse =
          LoginResponse.fromJson(
        json['data'],
      );

      await TokenStorage.saveToken(
        loginResponse.token,
      );

      final savedToken =
          await TokenStorage.getToken();

      debugPrint(
        '=================================',
      );
      debugPrint(
        'TOKEN SAVED: $savedToken',
      );
      debugPrint(
        '=================================',
      );

      return loginResponse;
    }

    // ==========================================================
    // 202 → DEVICE ENROLLMENT PENDING
    // ==========================================================

    if (response.statusCode == 202) {
      final message =
        json['message'] ??
        'This device is new. Please wait before logging in.';

      final remainingSeconds =
        (json['data']?['remainingSeconds'] ?? 1800) as int;

      throw DeviceEnrollmentException(
        message: message,
        remainingSeconds: remainingSeconds,
     );
}

    // ==========================================================
    // 429 → DEVICE LOCKED
    // ==========================================================

    if (response.statusCode == 429) {
      final message =
          json['message'] ??
          'This device is temporarily locked.';

      throw Exception(message);
    }

    // ==========================================================
    // 403 → SUSPICIOUS DEVICE
    // ==========================================================

    if (response.statusCode == 403) {
      final message =
          json['message'] ??
          'This device is temporarily restricted.';

      throw Exception(message);
    }

    // ==========================================================
    // OTHER ERRORS
    // ==========================================================

    throw Exception(
      json['message'] ??
      'Unable to login.',
    );
  }

  // ============================================================
  // LOGOUT
  // ============================================================

  static Future logout() async {
    try {
      await ApiClient.post(
        ApiConstants.logout,
        {},
      );
    } catch (_) {
      // Ignore network errors on logout
      // so local cleanup still happens.
    } finally {
      await TokenStorage.removeToken();
    }
  }

  // ============================================================
  // CURRENT CITIZEN
  // ============================================================

  static Future getCurrentCitizen() async {
    final response = await ApiClient.get(
      ApiConstants.me,
    );

    debugPrint(
      '========== /me ==========',
    );

    debugPrint(
      'Status : ${response.statusCode}',
    );

    debugPrint(
      'Body : ${response.body}',
    );

    debugPrint(
      '=========================',
    );

    if (response.statusCode == 200) {
      final json =
          jsonDecode(response.body);

      if (json['success'] == true &&
          json['data'] != null) {
        return Citizen.fromJson(
          json['data']['citizen'],
        );
      }
    }

    throw Exception('Unauthorized');
  }

  // ============================================================
  // LOGIN STATUS
  // ============================================================

  static Future isLoggedIn() async {
    return await TokenStorage.isLoggedIn();
  }

  // ============================================================
  // GET TOKEN
  // ============================================================

  static Future<String?> getToken() async {
    return await TokenStorage.getToken();
  }
}
