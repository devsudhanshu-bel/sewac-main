import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;

import '../storage/token_storage.dart';

class ApiClient {
  ApiClient._();

  /// ==========================================================
  /// COMMON HEADERS
  /// ==========================================================

  static Future<Map<String, String>> _headers() async {
    final token = await TokenStorage.getToken();

    return {
      "Content-Type": "application/json",
      if (token != null && token.isNotEmpty)
        "Authorization": "Bearer $token",
    };
  }

  static Future<Map<String, String>> _multipartHeaders() async {
    final token = await TokenStorage.getToken();

    return {
      if (token != null && token.isNotEmpty)
        "Authorization": "Bearer $token",
    };
  }

  /// ==========================================================
  /// POST
  /// ==========================================================

  static Future<http.Response> post(
      String url,
      Map<String, dynamic> body,
      ) async {
    return await http.post(
      Uri.parse(url),
      headers: await _headers(),
      body: jsonEncode(body),
    );
  }

  /// ==========================================================
  /// MULTIPART POST
  /// ==========================================================

  static Future<http.StreamedResponse> multipartPost({
    required String url,
    required File file,
    required String fileField,
    required Map<String, String> fields,
  }) async {
    final request = http.MultipartRequest(
      "POST",
      Uri.parse(url),
    );

    request.headers.addAll(await _multipartHeaders());

    request.fields.addAll(fields);

    request.files.add(
      await http.MultipartFile.fromPath(
        fileField,
        file.path,
      ),
    );

    return await request.send();
  }

  /// ==========================================================
  /// GET
  /// ==========================================================

  static Future<http.Response> get(
      String url,
      ) async {
    return await http.get(
      Uri.parse(url),
      headers: await _headers(),
    );
  }

  /// ==========================================================
  /// PUT
  /// ==========================================================

  static Future<http.Response> put(
      String url,
      Map<String, dynamic> body,
      ) async {
    return await http.put(
      Uri.parse(url),
      headers: await _headers(),
      body: jsonEncode(body),
    );
  }

  /// ==========================================================
  /// DELETE
  /// ==========================================================

  static Future<http.Response> delete(
      String url,
      ) async {
    return await http.delete(
      Uri.parse(url),
      headers: await _headers(),
    );
  }
}