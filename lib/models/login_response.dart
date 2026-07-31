import 'citizen.dart';

class LoginResponse {
  final String token;
  final Citizen citizen;

  LoginResponse({
    required this.token,
    required this.citizen,
  });

  factory LoginResponse.fromJson(
      Map<String, dynamic> json,
      ) {
    return LoginResponse(
      token: json["token"],
      citizen: Citizen.fromJson(
        json["citizen"],
      ),
    );
  }
}