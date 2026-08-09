import 'dart:async';
import 'dart:ui';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:geolocator/geolocator.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:sewac_citizen_app/screens/main/main_page.dart';

import 'package:sewac_citizen_app/models/login_response.dart';
import 'package:sewac_citizen_app/services/auth_service.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> with TickerProviderStateMixin {
  // Animation Controllers
  late final AnimationController _entranceController;
  late final AnimationController _floatingLogoController;
  late final AnimationController _particlesController;
  late final AnimationController _pulsePhoneIconController;
  late final AnimationController _truckAnimationController;
  late final AnimationController _buttonBreathController;
  late final AnimationController _pinPulseController;

  // Location Success Overlay Animation Controller
  late final AnimationController _locationSuccessController;
  late final Animation<double> _locationSuccessOpacity;

  // Staggered Entrance Animations
  late final Animation<double> _logoOpacity;
  late final Animation<double> _logoScale;
  late final Animation<double> _titleOpacity;
  late final Animation<Offset> _titleSlide;
  late final Animation<double> _subtitleOpacity;
  late final Animation<Offset> _subtitleSlide;
  late final Animation<double> _phoneCardOpacity;
  late final Animation<Offset> _phoneCardSlide;
  late final Animation<double> _truckOpacity;
  late final Animation<double> _buttonScale;
  late final Animation<double> _buttonOpacity;
  late final Animation<double> _helpCardOpacity;
  late final Animation<Offset> _helpCardSlide;
  late final Animation<double> _footerOpacity;

  final TextEditingController _phoneController = TextEditingController();
  final FocusNode _phoneFocusNode = FocusNode();
  final _formKey = GlobalKey<FormState>();

  bool _isPhoneFocused = false;
  bool _isLoading = false;
  bool _showLocationSuccess = false;

  // Device enrollment countdown
  Timer? _enrollmentTimer;
  int _remainingSeconds = 0;
  bool _isEnrollmentPending = false;

  LoginResponse? _loginResponse;

  @override
  void initState() {
    super.initState();

    _entranceController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1300),
    );

    _floatingLogoController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 3200),
    )..repeat(reverse: true);

    _particlesController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 16),
    )..repeat();

    _pulsePhoneIconController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1800),
    )..repeat(reverse: true);

    // Total duration = Original 4500ms travel time + 2500ms pause time
    _truckAnimationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 7000),
    )..repeat();

    _buttonBreathController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1600),
    )..repeat(reverse: true);

    _pinPulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat(reverse: true);

    _locationSuccessController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );

    _locationSuccessOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _locationSuccessController,
        curve: Curves.easeIn,
      ),
    );

    _logoOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _entranceController,
        curve: const Interval(0.0, 0.35, curve: Curves.easeIn),
      ),
    );
    _logoScale = Tween<double>(begin: 0.85, end: 1.0).animate(
      CurvedAnimation(
        parent: _entranceController,
        curve: const Interval(0.0, 0.35, curve: Curves.easeOutBack),
      ),
    );

    _titleOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _entranceController,
        curve: const Interval(0.15, 0.45, curve: Curves.easeIn),
      ),
    );
    _titleSlide = Tween<Offset>(
      begin: const Offset(0, 0.3),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _entranceController,
        curve: const Interval(0.15, 0.45, curve: Curves.easeOutCubic),
      ),
    );

    _subtitleOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _entranceController,
        curve: const Interval(0.25, 0.55, curve: Curves.easeIn),
      ),
    );
    _subtitleSlide = Tween<Offset>(
      begin: const Offset(0, 0.25),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _entranceController,
        curve: const Interval(0.25, 0.55, curve: Curves.easeOutCubic),
      ),
    );

    _phoneCardOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _entranceController,
        curve: const Interval(0.35, 0.65, curve: Curves.easeIn),
      ),
    );
    _phoneCardSlide = Tween<Offset>(
      begin: const Offset(0, 0.25),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _entranceController,
        curve: const Interval(0.35, 0.65, curve: Curves.easeOutCubic),
      ),
    );

    _truckOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _entranceController,
        curve: const Interval(0.45, 0.75, curve: Curves.easeIn),
      ),
    );

    _buttonOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _entranceController,
        curve: const Interval(0.55, 0.85, curve: Curves.easeIn),
      ),
    );
    _buttonScale = Tween<double>(begin: 0.85, end: 1.0).animate(
      CurvedAnimation(
        parent: _entranceController,
        curve: const Interval(0.55, 0.85, curve: Curves.easeOutBack),
      ),
    );

    _helpCardOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _entranceController,
        curve: const Interval(0.7, 0.95, curve: Curves.easeIn),
      ),
    );
    _helpCardSlide = Tween<Offset>(
      begin: const Offset(0, 0.2),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _entranceController,
        curve: const Interval(0.7, 0.95, curve: Curves.easeOutCubic),
      ),
    );

    _footerOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _entranceController,
        curve: const Interval(0.85, 1.0, curve: Curves.easeIn),
      ),
    );

    _phoneFocusNode.addListener(() {
      setState(() {
        _isPhoneFocused = _phoneFocusNode.hasFocus;
      });
    });

    _entranceController.forward();
  }

  @override
  void dispose() {
    _entranceController.dispose();
    _floatingLogoController.dispose();
    _particlesController.dispose();
    _pulsePhoneIconController.dispose();
    _truckAnimationController.dispose();
    _buttonBreathController.dispose();
    _pinPulseController.dispose();
    _locationSuccessController.dispose();
    _phoneController.dispose();
    _phoneFocusNode.dispose();
    _enrollmentTimer?.cancel();
    super.dispose();
  }

  bool _validatePhone() {
    return _formKey.currentState?.validate() ?? false;
  }

  void _startEnrollmentCountdown(int seconds) {
  _enrollmentTimer?.cancel();

  setState(() {
    _remainingSeconds = seconds;
    _isEnrollmentPending = true;
  });

  _enrollmentTimer = Timer.periodic(
    const Duration(seconds: 1),
    (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }

      if (_remainingSeconds <= 1) {
        timer.cancel();

        setState(() {
          _remainingSeconds = 0;
          _isEnrollmentPending = false;
        });

        return;
      }

      setState(() {
        _remainingSeconds--;
      });
    },
  );
}

String _formatRemainingTime(int seconds) {
  final minutes = seconds ~/ 60;
  final secs = seconds % 60;

  return '${minutes.toString().padLeft(2, '0')}:'
      '${secs.toString().padLeft(2, '0')}';
}

  Future<bool> _requestLocationPermission() async {
    PermissionStatus status = await Permission.location.status;

    if (status.isGranted) return true;

    if (status.isDenied) {
      status = await Permission.location.request();
      if (status.isGranted) return true;

      if (status.isDenied && mounted) {
        bool retryGranted = await _showPermissionRequiredDialog();
        return retryGranted;
      }
    }

    if (status.isPermanentlyDenied && mounted) {
      _showPermanentlyDeniedDialog();
      return false;
    }

    return false;
  }

  Future<bool> _showPermissionRequiredDialog() async {
    bool? allowAgainPressed = await showDialog<bool>(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: const Color(0xFF3B0B68),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: Text(
            'Location Required',
            style: GoogleFonts.plusJakartaSans(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
          content: Text(
            'SEWAC Citizen requires your current location to continue.\n\nPlease allow location permission to login.',
            style: GoogleFonts.plusJakartaSans(color: Colors.white70, height: 1.4),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(false),
              child: Text(
                'Cancel',
                style: GoogleFonts.plusJakartaSans(color: Colors.white60),
              ),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFEC1C68),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onPressed: () => Navigator.of(context).pop(true),
              child: Text(
                'Allow Again',
                style: GoogleFonts.plusJakartaSans(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        );
      },
    );

    if (allowAgainPressed == true) {
      PermissionStatus status = await Permission.location.request();
      if (status.isGranted) {
        return true;
      } else if (status.isPermanentlyDenied && mounted) {
        _showPermanentlyDeniedDialog();
      }
    }

    return false;
  }

  void _showPermanentlyDeniedDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: const Color(0xFF3B0B68),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: Text(
            'Location Permission Required',
            style: GoogleFonts.plusJakartaSans(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
          content: Text(
            'Location permission has been permanently denied.\n\nPlease enable it from Settings to continue.',
            style: GoogleFonts.plusJakartaSans(color: Colors.white70, height: 1.4),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text(
                'Cancel',
                style: GoogleFonts.plusJakartaSans(color: Colors.white60),
              ),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFEC1C68),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onPressed: () {
                Navigator.of(context).pop();
                openAppSettings();
              },
              child: Text(
                'Open Settings',
                style: GoogleFonts.plusJakartaSans(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  Future<bool> _checkLocationService() async {
    bool isServiceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!isServiceEnabled) {
      if (mounted) {
        _showEnableGpsDialog();
      }
      return false;
    }
    return true;
  }

  void _showEnableGpsDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: const Color(0xFF3B0B68),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: Text(
            'Enable Location',
            style: GoogleFonts.plusJakartaSans(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
          content: Text(
            'Please turn on your device location (GPS) to continue.',
            style: GoogleFonts.plusJakartaSans(color: Colors.white70),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text(
                'Cancel',
                style: GoogleFonts.plusJakartaSans(color: Colors.white60),
              ),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFEC1C68),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onPressed: () {
                Navigator.of(context).pop();
                Geolocator.openLocationSettings();
              },
              child: Text(
                'Open Location Settings',
                style: GoogleFonts.plusJakartaSans(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  Future<Position?> _getCurrentLocation() async {
    try {
      Position position = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
          timeLimit: Duration(seconds: 10),
        ),
      );
      return position;
    } catch (e) {
      return null;
    }
  }

  Future<void> _login() async {
    print("Phone = '${_phoneController.text}'");
    if (!_validatePhone()) return;

    FocusScope.of(context).unfocus();

    setState(() => _isLoading = true);

    try {
      // Request Permission
      bool hasPermission = await _requestLocationPermission();

      if (!hasPermission) return;

      // Check GPS
      bool gpsEnabled = await _checkLocationService();

      if (!gpsEnabled) return;

      // Fetch Current Location
      Position? position = await _getCurrentLocation();

      if (position == null) {
        throw Exception(
          "Unable to fetch your current location.",
        );
      }

      // Backend Login
      _loginResponse = await AuthService.login(
        _phoneController.text.trim(),
      );

      setState(() {
        _showLocationSuccess = true;
      });

      await _locationSuccessController.forward();

      await Future.delayed(
        const Duration(seconds: 1),
      );

      await _locationSuccessController.reverse();

      if (!mounted) return;

      setState(() {
        _showLocationSuccess = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: Colors.green,
          behavior: SnackBarBehavior.floating,
          content: Text(
            "Welcome ${_loginResponse!.citizen.personName}",
          ),
        ),
      );

      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (_) => const MainPage(),
        ),
      );
    } on DeviceEnrollmentException catch (e) {
  if (!mounted) return;

  _startEnrollmentCountdown(
    e.remainingSeconds,
  );

  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      backgroundColor: Colors.orange,
      behavior: SnackBarBehavior.floating,
      content: Text(
        'New device detected. Please wait '
        '${_formatRemainingTime(e.remainingSeconds)}.',
      ),
    ),
  );
    } catch (e) {
      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: Colors.red,
          behavior: SnackBarBehavior.floating,
          content: Text(
            e.toString().replaceFirst(
              "Exception: ",
              "",
            ),
          ),
        ),
      );
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: true,
      backgroundColor: const Color(0xFF2B0752),
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF260548),
              Color(0xFF4A1082),
              Color(0xFF882EAE),
            ],
            stops: [0.0, 0.55, 1.0],
          ),
        ),
        child: Stack(
          children: [
            // Background Ambient Floating Particles
            Positioned.fill(
              child: AnimatedBuilder(
                animation: _particlesController,
                builder: (context, child) {
                  return CustomPaint(
                    painter: BackgroundGlowParticlesPainter(
                      animationValue: _particlesController.value,
                    ),
                  );
                },
              ),
            ),

            SafeArea(
              child: LayoutBuilder(
                builder: (context, constraints) {
                  return SingleChildScrollView(
                    physics: const ClampingScrollPhysics(),
                    padding: const EdgeInsets.symmetric(horizontal: 22.0),
                    child: ConstrainedBox(
                      constraints: BoxConstraints(
                        minHeight: constraints.maxHeight,
                      ),
                      child: IntrinsicHeight(
                        child: Form(
                          key: _formKey,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              const Spacer(flex: 2),

                              // --- 1. CLEAN FLOATING LOGO ---
                              FadeTransition(
                                opacity: _logoOpacity,
                                child: ScaleTransition(
                                  scale: _logoScale,
                                  child: AnimatedBuilder(
                                    animation: _floatingLogoController,
                                    builder: (context, child) {
                                      final floatY = math.sin(_floatingLogoController.value * math.pi) * 4;
                                      return Transform.translate(
                                        offset: Offset(0, floatY),
                                        child: Image.asset(
                                          'assets/logo.png',
                                          height: 105,
                                          fit: BoxFit.contain,
                                        ),
                                      );
                                    },
                                  ),
                                ),
                              ),
                              const SizedBox(height: 6),

                              // --- 2. TITLE, SUBTITLE & ACCENT DIVIDER ---
                              AnimatedBuilder(
                                animation: _titleOpacity,
                                builder: (context, child) {
                                  return Opacity(
                                    opacity: _titleOpacity.value,
                                    child: FractionalTranslation(
                                      translation: _titleSlide.value,
                                      child: child,
                                    ),
                                  );
                                },
                                child: Text(
                                  'SEWAC Citizen',
                                  style: GoogleFonts.plusJakartaSans(
                                    textStyle: const TextStyle(
                                      fontSize: 36,
                                      fontWeight: FontWeight.w800,
                                      color: Colors.white,
                                      letterSpacing: 0.6,
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(height: 4),

                              AnimatedBuilder(
                                animation: _subtitleOpacity,
                                builder: (context, child) {
                                  return Opacity(
                                    opacity: _subtitleOpacity.value,
                                    child: FractionalTranslation(
                                      translation: _subtitleSlide.value,
                                      child: child,
                                    ),
                                  );
                                },
                                child: Text(
                                  'Clean Cities, Better Tomorrow',
                                  style: GoogleFonts.plusJakartaSans(
                                    textStyle: const TextStyle(
                                      fontSize: 13.5,
                                      fontWeight: FontWeight.w500,
                                      color: Colors.white,
                                      letterSpacing: 0.5,
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(height: 10),

                              AnimatedBuilder(
                                animation: _subtitleOpacity,
                                builder: (context, child) {
                                  return Opacity(
                                    opacity: _subtitleOpacity.value,
                                    child: Container(
                                      width: 52,
                                      height: 3,
                                      decoration: BoxDecoration(
                                        color: Colors.white,
                                        borderRadius: BorderRadius.circular(2),
                                      ),
                                    ),
                                  );
                                },
                              ),

                              const Spacer(flex: 3),

                              // --- 3. PREMIUM GLASSMORPHISM PHONE FIELD ---
                              AnimatedBuilder(
                                animation: _phoneCardOpacity,
                                builder: (context, child) {
                                  return Opacity(
                                    opacity: _phoneCardOpacity.value,
                                    child: FractionalTranslation(
                                      translation: _phoneCardSlide.value,
                                      child: child,
                                    ),
                                  );
                                },
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(30),
                                  child: BackdropFilter(
                                    filter: ImageFilter.blur(sigmaX: 14, sigmaY: 14),
                                    child: AnimatedContainer(
                                      duration: const Duration(milliseconds: 250),
                                      height: 62,
                                      decoration: BoxDecoration(
                                        color: Colors.white.withValues(alpha: 0.16),
                                        borderRadius: BorderRadius.circular(30),
                                        border: Border.all(
                                          color: _isPhoneFocused
                                              ? const Color(0xFFEC1C68).withValues(alpha: 0.85)
                                              : Colors.white.withValues(alpha: 0.3),
                                          width: _isPhoneFocused ? 1.8 : 1.2,
                                        ),
                                        boxShadow: [
                                          BoxShadow(
                                            color: _isPhoneFocused
                                                ? const Color(0xFFEC1C68).withValues(alpha: 0.35)
                                                : Colors.black.withValues(alpha: 0.15),
                                            blurRadius: _isPhoneFocused ? 18 : 14,
                                            offset: const Offset(0, 6),
                                          ),
                                        ],
                                      ),
                                      padding: const EdgeInsets.only(left: 10, right: 20),
                                      child: Row(
                                        children: [
                                          AnimatedBuilder(
                                            animation: _pulsePhoneIconController,
                                            builder: (context, child) {
                                              final scale = 1.0 + (_pulsePhoneIconController.value * 0.05);
                                              return Transform.scale(
                                                scale: scale,
                                                child: Container(
                                                  width: 46,
                                                  height: 46,
                                                  decoration: BoxDecoration(
                                                    shape: BoxShape.circle,
                                                    color: Colors.white.withValues(alpha: 0.28),
                                                    border: Border.all(
                                                      color: Colors.white.withValues(alpha: 0.4),
                                                      width: 1,
                                                    ),
                                                  ),
                                                  child: const Icon(
                                                    Icons.phone_rounded,
                                                    color: Colors.white,
                                                    size: 22,
                                                  ),
                                                ),
                                              );
                                            },
                                          ),
                                          const SizedBox(width: 14),
                                          Text(
                                            '+91',
                                            style: GoogleFonts.plusJakartaSans(
                                              textStyle: const TextStyle(
                                                fontSize: 16.5,
                                                fontWeight: FontWeight.w700,
                                                color: Colors.white,
                                              ),
                                            ),
                                          ),
                                          const SizedBox(width: 12),
                                          Container(
                                            width: 1,
                                            height: 24,
                                            color: Colors.white.withValues(alpha: 0.35),
                                          ),
                                          const SizedBox(width: 14),
                                          Expanded(
                                            child: TextFormField(
                                              controller: _phoneController,
                                              focusNode: _phoneFocusNode,
                                              enabled: !_isLoading,
                                              keyboardType: TextInputType.phone,
                                              style: GoogleFonts.plusJakartaSans(
                                                textStyle: const TextStyle(
                                                  fontSize: 16.5,
                                                  fontWeight: FontWeight.w600,
                                                  color: Colors.white,
                                                  letterSpacing: 0.8,
                                                ),
                                              ),
                                              cursorColor: Colors.white,
                                              decoration: InputDecoration(
                                                hintText: 'Enter your phone number',
                                                hintStyle: GoogleFonts.plusJakartaSans(
                                                  textStyle: TextStyle(
                                                    color: Colors.white.withValues(alpha: 0.6),
                                                    fontSize: 15,
                                                    fontWeight: FontWeight.w400,
                                                  ),
                                                ),
                                                border: InputBorder.none,
                                                contentPadding: EdgeInsets.zero,
                                                counterText: "",
                                                isDense: true,
                                              ),
                                              inputFormatters: [
                                                FilteringTextInputFormatter.digitsOnly,
                                                LengthLimitingTextInputFormatter(10),
                                              ],
                                              validator: (value) {
                                                if (value == null || value.isEmpty) {
                                                  return 'Please enter phone number';
                                                }
                                                if (value.length != 10) {
                                                  return 'Phone number must be exactly 10 digits';
                                                }
                                                return null;
                                              },
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ),
                              ),

                              // --- 4. GARBAGE TRUCK ANIMATION ---
                              FadeTransition(
                                opacity: _truckOpacity,
                                child: Container(
                                  height: 115,
                                  width: double.infinity,
                                  margin: const EdgeInsets.symmetric(vertical: 4),
                                  child: AnimatedBuilder(
                                    animation: Listenable.merge([_truckAnimationController, _pinPulseController]),
                                    builder: (context, child) {
                                      return CustomPaint(
                                        painter: GarbageTruckAnimationPainter(
                                          progress: _truckAnimationController.value,
                                          pinPulse: _pinPulseController.value,
                                        ),
                                      );
                                    },
                                  ),
                                ),
                              ),

                              // --- 5. LOGIN BUTTON WITH LOADING STATE ---
                              FadeTransition(
                                opacity: _buttonOpacity,
                                child: ScaleTransition(
                                  scale: _buttonScale,
                                  child: PremiumGradientButton(
                                          text: _isEnrollmentPending
                                                ? 'WAIT ${_formatRemainingTime(_remainingSeconds)}'
                                                : 'LOGIN TO SEWAC',
                                          isLoading: _isLoading,
                                          breathAnimation: _buttonBreathController,
                                          onPressed: _isLoading || _isEnrollmentPending
                                              ? null
                                              : _login,
                                          ),
                                ),
                              ),
                              if (_isEnrollmentPending)
  Padding(
    padding: const EdgeInsets.only(top: 16),
    child: Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(
        horizontal: 20,
        vertical: 16,
      ),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: Colors.orange.withValues(alpha: 0.6),
          width: 1.2,
        ),
      ),
      child: Column(
        children: [
          const Icon(
            Icons.lock_clock_rounded,
            color: Colors.orange,
            size: 30,
          ),

          const SizedBox(height: 8),

          Text(
            'New device detected',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: Colors.white,
            ),
          ),

          const SizedBox(height: 5),

          Text(
            'Please wait before logging in from this device.',
            textAlign: TextAlign.center,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 12.5,
              color: Colors.white.withValues(alpha: 0.75),
            ),
          ),

          const SizedBox(height: 10),

          Text(
            _formatRemainingTime(_remainingSeconds),
            style: GoogleFonts.plusJakartaSans(
              fontSize: 32,
              fontWeight: FontWeight.w800,
              color: Colors.white,
              letterSpacing: 1.5,
            ),
          ),

          Text(
            'TIME REMAINING',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 10,
              fontWeight: FontWeight.w600,
              color: Colors.white.withValues(alpha: 0.6),
              letterSpacing: 1.2,
            ),
          ),
        ],
      ),
    ),
  ),
                              const SizedBox(height: 24),

                              // --- 6. NEED HELP CARD ---
                              AnimatedBuilder(
                                animation: _helpCardOpacity,
                                builder: (context, child) {
                                  return Opacity(
                                    opacity: _helpCardOpacity.value,
                                    child: FractionalTranslation(
                                      translation: _helpCardSlide.value,
                                      child: child,
                                    ),
                                  );
                                },
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(24),
                                  child: BackdropFilter(
                                    filter: ImageFilter.blur(sigmaX: 14, sigmaY: 14),
                                    child: Container(
                                      width: double.infinity,
                                      decoration: BoxDecoration(
                                        color: Colors.white.withValues(alpha: 0.16),
                                        borderRadius: BorderRadius.circular(24),
                                        border: Border.all(
                                          color: Colors.white.withValues(alpha: 0.28),
                                          width: 1,
                                        ),
                                        boxShadow: [
                                          BoxShadow(
                                            color: Colors.black.withValues(alpha: 0.14),
                                            blurRadius: 16,
                                            offset: const Offset(0, 6),
                                          ),
                                        ],
                                      ),
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 18.0,
                                        vertical: 15.0,
                                      ),
                                      child: Row(
                                        crossAxisAlignment: CrossAxisAlignment.center,
                                        children: [
                                          Container(
                                            width: 50,
                                            height: 50,
                                            decoration: BoxDecoration(
                                              shape: BoxShape.circle,
                                              color: Colors.white.withValues(alpha: 0.22),
                                              border: Border.all(
                                                color: Colors.white.withValues(alpha: 0.35),
                                                width: 1,
                                              ),
                                            ),
                                            child: const Icon(
                                              Icons.headset_mic_rounded,
                                              color: Colors.white,
                                              size: 26,
                                            ),
                                          ),
                                          const SizedBox(width: 16),
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              mainAxisSize: MainAxisSize.min,
                                              children: [
                                                Text(
                                                  'Need Help?',
                                                  style: GoogleFonts.plusJakartaSans(
                                                    textStyle: const TextStyle(
                                                      fontSize: 16.5,
                                                      fontWeight: FontWeight.w700,
                                                      color: Colors.white,
                                                    ),
                                                  ),
                                                ),
                                                const SizedBox(height: 2),
                                                Text(
                                                  'Contact your Ward Office if you are unable to login',
                                                  style: GoogleFonts.plusJakartaSans(
                                                    textStyle: TextStyle(
                                                      fontSize: 12,
                                                      color: Colors.white.withValues(alpha: 0.8),
                                                      height: 1.3,
                                                    ),
                                                  ),
                                                ),
                                                const SizedBox(height: 6),
                                                Row(
                                                  children: [
                                                    const Icon(
                                                      Icons.phone_in_talk_rounded,
                                                      color: Colors.white,
                                                      size: 15,
                                                    ),
                                                    const SizedBox(width: 6),
                                                    Text(
                                                      '1800-123-4567',
                                                      style: GoogleFonts.plusJakartaSans(
                                                        textStyle: const TextStyle(
                                                          fontSize: 14.5,
                                                          fontWeight: FontWeight.w800,
                                                          color: Colors.white,
                                                          letterSpacing: 0.5,
                                                        ),
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                              ],
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ),
                              ),

                              const Spacer(flex: 2),

                              // --- 7. FOOTER ---
                              FadeTransition(
                                opacity: _footerOpacity,
                                child: Column(
                                  children: [
                                    Container(
                                      width: double.infinity,
                                      height: 1,
                                      color: Colors.white.withValues(alpha: 0.15),
                                    ),
                                    const SizedBox(height: 12),
                                    Text(
                                      'Terms of Service • Privacy Policy',
                                      style: GoogleFonts.plusJakartaSans(
                                        textStyle: TextStyle(
                                          fontSize: 12,
                                          color: Colors.white.withValues(alpha: 0.75),
                                          fontWeight: FontWeight.w500,
                                          letterSpacing: 0.2,
                                        ),
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      'Version 1.0.0',
                                      style: GoogleFonts.plusJakartaSans(
                                        textStyle: TextStyle(
                                          fontSize: 10,
                                          color: Colors.white.withValues(alpha: 0.45),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),

            // --- LOCATION VERIFIED SUCCESS OVERLAY BADGE ---
            if (_showLocationSuccess)
              Positioned.fill(
                child: FadeTransition(
                  opacity: _locationSuccessOpacity,
                  child: Container(
                    color: Colors.black38,
                    child: Center(
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(20),
                        child: BackdropFilter(
                          filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 28,
                              vertical: 20,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.2),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: Colors.white.withValues(alpha: 0.4),
                                width: 1.2,
                              ),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(
                                  Icons.check_circle_rounded,
                                  color: Color(0xFF43A047),
                                  size: 28,
                                ),
                                const SizedBox(width: 12),
                                Text(
                                  'Location Verified',
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 17,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                    letterSpacing: 0.4,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

// ============================================================================
// TOP-LEVEL HELPER WIDGETS & PAINTERS (Out of _LoginPageState to fix scope)
// ============================================================================

class PremiumGradientButton extends StatefulWidget {
  final String text;
  final bool isLoading;
  final AnimationController breathAnimation;
  final VoidCallback? onPressed;

  const PremiumGradientButton({
    super.key,
    required this.text,
    required this.isLoading,
    required this.breathAnimation,
    required this.onPressed,
  });

  @override
  State<PremiumGradientButton> createState() => _PremiumGradientButtonState();
}

class _PremiumGradientButtonState extends State<PremiumGradientButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _pressController;
  late Animation<double> _scaleAnimation;
  bool _isPressed = false;

  @override
  void initState() {
    super.initState();
    _pressController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 100),
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.96).animate(
      CurvedAnimation(parent: _pressController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _pressController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: widget.onPressed == null
          ? null
          : (_) {
        setState(() => _isPressed = true);
        _pressController.forward();
      },
      onTapUp: widget.onPressed == null
          ? null
          : (_) {
        setState(() => _isPressed = false);
        _pressController.reverse();
      },
      onTapCancel: widget.onPressed == null
          ? null
          : () {
        setState(() => _isPressed = false);
        _pressController.reverse();
      },
      onTap: widget.onPressed,
      child: ScaleTransition(
        scale: _scaleAnimation,
        child: AnimatedBuilder(
          animation: widget.breathAnimation,
          builder: (context, child) {
            final breathScale = widget.isLoading
                ? 1.0
                : (1.0 + (widget.breathAnimation.value * 0.015));
            return Transform.scale(
              scale: breathScale,
              child: Container(
                width: double.infinity,
                height: 58,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [
                      Color(0xFF8E17A8),
                      Color(0xFFEC1C68),
                    ],
                    begin: Alignment.centerLeft,
                    end: Alignment.centerRight,
                  ),
                  borderRadius: BorderRadius.circular(29),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFFEC1C68).withValues(alpha: 0.42),
                      blurRadius: 18,
                      spreadRadius: 1,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    borderRadius: BorderRadius.circular(29),
                    splashColor: Colors.white.withValues(alpha: 0.25),
                    highlightColor: Colors.transparent,
                    onTap: widget.onPressed,
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 24.0),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Spacer(),
                          Text(
                            widget.text,
                            style: GoogleFonts.plusJakartaSans(
                              textStyle: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                                letterSpacing: 1.2,
                              ),
                            ),
                          ),
                          const Spacer(),
                          if (widget.isLoading)
                            const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2.5,
                                valueColor:
                                AlwaysStoppedAnimation<Color>(Colors.white),
                              ),
                            )
                          else
                            AnimatedContainer(
                              duration: const Duration(milliseconds: 150),
                              transform: Matrix4.translationValues(
                                _isPressed ? 4.0 : 0.0,
                                0.0,
                                0.0,
                              ),
                              child: const Icon(
                                Icons.arrow_forward_rounded,
                                color: Colors.white,
                                size: 22,
                              ),
                            ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}

class GarbageTruckAnimationPainter extends CustomPainter {
  final double progress;
  final double pinPulse;

  GarbageTruckAnimationPainter({
    required this.progress,
    required this.pinPulse,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final double width = size.width;
    final double height = size.height;
    final double roadY = height * 0.76;

    _drawCitySilhouette(canvas, width, roadY);

    final roadPaint = Paint()
      ..color = Colors.white.withValues(alpha: 0.18)
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    final dashPaint = Paint()
      ..color = Colors.white.withValues(alpha: 0.35)
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    canvas.drawLine(Offset(0, roadY), Offset(width, roadY), roadPaint);

    double dashWidth = 12;
    double dashSpace = 10;
    double startX =
        -(progress * (dashWidth + dashSpace)) % (dashWidth + dashSpace);

    while (startX < width) {
      canvas.drawLine(
        Offset(startX, roadY),
        Offset(math.min(startX + dashWidth, width), roadY),
        dashPaint,
      );
      startX += dashWidth + dashSpace;
    }

    _drawPulsingLocationPin(canvas, width * 0.84, roadY - 26, pinPulse);

    double targetPinX = (width * 0.84) - 34;
    double startTruckX = -50.0;
    double endTruckX = width + 50.0;

    double totalDistance = endTruckX - startTruckX;
    double distanceToPin = targetPinX - startTruckX;
    double distanceRatio = (distanceToPin / totalDistance).clamp(0.0, 1.0);

    // 4500ms original speed logic across 7000ms total loop duration:
    // p1: Time taken to reach pin at original speed
    // p2: Time when pause ends and truck resumes moving
    double p1 = (4500.0 * distanceRatio) / 7000.0;
    double p2 = p1 + (2500.0 / 7000.0);

    double truckX;
    bool isMoving;
    double wheelProgress;

    if (progress < p1) {
      double t = progress / p1;
      truckX = startTruckX + (targetPinX - startTruckX) * t;
      isMoving = true;
      wheelProgress = progress * (7000.0 / 4500.0);
    } else if (progress <= p2) {
      truckX = targetPinX;
      isMoving = false;
      wheelProgress = 0.0;
    } else {
      double t = (progress - p2) / (1.0 - p2);
      truckX = targetPinX + (endTruckX - targetPinX) * t;
      isMoving = true;
      wheelProgress = (p1 + (progress - p2)) * (7000.0 / 4500.0);
    }

    double bounceY = isMoving ? math.sin(progress * math.pi * 16) * 1.5 : 0.0;
    double currentTruckY = roadY - 32 + bounceY;

    if (isMoving && truckX > 15) {
      final dustPaint = Paint()
        ..color = Colors.white.withValues(alpha: 0.28)
        ..strokeWidth = 1.8;
      canvas.drawLine(Offset(truckX - 36, currentTruckY + 14),
          Offset(truckX - 18, currentTruckY + 14), dustPaint);
      canvas.drawLine(Offset(truckX - 28, currentTruckY + 20),
          Offset(truckX - 12, currentTruckY + 20), dustPaint);
    }

    final cabinPaint = Paint()..color = Colors.white;
    final wasteCompactorPaint = Paint()..color = const Color(0xFF2E7D32);
    final windowPaint = Paint()..color = const Color(0xFF1B5E20);
    final emblemPaint = Paint()..color = Colors.white;

    RRect compactorRRect = RRect.fromLTRBR(
      truckX - 14,
      currentTruckY + 2,
      truckX + 18,
      currentTruckY + 26,
      const Radius.circular(5),
    );
    canvas.drawRRect(compactorRRect, wasteCompactorPaint);

    Path hopperPath = Path();
    hopperPath.moveTo(truckX - 14, currentTruckY + 6);
    hopperPath.lineTo(truckX - 20, currentTruckY + 16);
    hopperPath.lineTo(truckX - 14, currentTruckY + 26);
    hopperPath.close();
    canvas.drawPath(hopperPath, wasteCompactorPaint);

    _drawRecyclingSymbol(
        canvas, truckX + 2, currentTruckY + 14, 5.5, emblemPaint);

    RRect cabinRRect = RRect.fromLTRBR(
      truckX + 18,
      currentTruckY + 8,
      truckX + 34,
      currentTruckY + 26,
      const Radius.circular(4),
    );
    canvas.drawRRect(cabinRRect, cabinPaint);

    canvas.drawRect(
        Rect.fromLTWH(truckX + 25, currentTruckY + 10, 7, 7), windowPaint);

    _drawRotatingWheel(canvas, truckX - 3, currentTruckY + 26, wheelProgress);
    _drawRotatingWheel(canvas, truckX + 26, currentTruckY + 26, wheelProgress);
  }

  void _drawCitySilhouette(Canvas canvas, double width, double roadY) {
    final cityPaint = Paint()..color = Colors.white.withValues(alpha: 0.05);

    Path path = Path();
    path.moveTo(0, roadY);
    path.lineTo(0, roadY - 20);
    path.lineTo(width * 0.12, roadY - 20);
    path.lineTo(width * 0.12, roadY - 35);
    path.lineTo(width * 0.22, roadY - 35);
    path.lineTo(width * 0.22, roadY - 15);
    path.lineTo(width * 0.38, roadY - 15);
    path.lineTo(width * 0.38, roadY - 30);
    path.lineTo(width * 0.50, roadY - 30);
    path.lineTo(width * 0.50, roadY - 18);
    path.lineTo(width * 0.65, roadY - 18);
    path.lineTo(width * 0.65, roadY - 38);
    path.lineTo(width * 0.78, roadY - 38);
    path.lineTo(width * 0.78, roadY - 22);
    path.lineTo(width, roadY - 22);
    path.lineTo(width, roadY);
    path.close();

    canvas.drawPath(path, cityPaint);
  }

  void _drawPulsingLocationPin(
      Canvas canvas, double x, double y, double pulse) {
    double scale = 1.0 + (pulse * 0.12);
    double glowRadius = 14 + (pulse * 8);

    final glowPaint = Paint()
      ..color = const Color(0xFFEC1C68).withValues(alpha: 0.35 - (pulse * 0.15))
      ..style = PaintingStyle.fill;
    canvas.drawCircle(Offset(x, y - 10), glowRadius, glowPaint);

    final pinPaint = Paint()..color = const Color(0xFFEC1C68);
    final innerPaint = Paint()..color = Colors.white;

    canvas.save();
    canvas.translate(x, y);
    canvas.scale(scale, scale);
    canvas.translate(-x, -y);

    Path path = Path();
    path.moveTo(x, y);
    path.cubicTo(x - 12, y - 14, x - 12, y - 28, x, y - 28);
    path.cubicTo(x + 12, y - 28, x + 12, y - 14, x, y);
    path.close();

    canvas.drawPath(path, pinPaint);
    canvas.drawCircle(Offset(x, y - 18), 4.5, innerPaint);
    canvas.restore();
  }

  void _drawRecyclingSymbol(
      Canvas canvas, double x, double y, double radius, Paint paint) {
    paint.style = PaintingStyle.stroke;
    paint.strokeWidth = 1.5;
    canvas.drawCircle(Offset(x, y), radius, paint);
  }

  void _drawRotatingWheel(Canvas canvas, double x, double y, double progress) {
    final wheelPaint = Paint()..color = const Color(0xFF1E0338);
    final rimPaint = Paint()..color = Colors.white;

    canvas.drawCircle(Offset(x, y), 6, wheelPaint);
    canvas.drawCircle(Offset(x, y), 2.5, rimPaint);

    double angle = progress * math.pi * 20;
    canvas.drawLine(
      Offset(x, y),
      Offset(x + math.cos(angle) * 5, y + math.sin(angle) * 5),
      Paint()
        ..color = Colors.white.withValues(alpha: 0.6)
        ..strokeWidth = 1.2,
    );
  }

  @override
  bool shouldRepaint(covariant GarbageTruckAnimationPainter oldDelegate) =>
      true;
}

class BackgroundGlowParticlesPainter extends CustomPainter {
  final double animationValue;
  final List<_Particle> particles;

  BackgroundGlowParticlesPainter({required this.animationValue})
      : particles = List.generate(
    14,
        (index) => _Particle(
      x: math.Random(index).nextDouble(),
      y: math.Random(index + 30).nextDouble(),
      size: math.Random(index + 50).nextDouble() * 2.5 + 1.2,
      baseOpacity: math.Random(index + 70).nextDouble() * 0.25 + 0.08,
      speed: math.Random(index + 90).nextDouble() * 0.04 + 0.015,
    ),
  );

  @override
  void paint(Canvas canvas, Size size) {
    final particlePaint = Paint()..color = Colors.white;

    for (var particle in particles) {
      double currentY = (particle.y - (animationValue * particle.speed)) % 1.0;
      double opacity = particle.baseOpacity +
          (0.1 * math.sin(animationValue * 2 * math.pi + particle.x * 10));
      opacity = opacity.clamp(0.04, 0.35);

      particlePaint.color = Colors.white.withValues(alpha: opacity);
      canvas.drawCircle(
        Offset(particle.x * size.width, currentY * size.height),
        particle.size,
        particlePaint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant BackgroundGlowParticlesPainter oldDelegate) =>
      oldDelegate.animationValue != animationValue;
}

class _Particle {
  final double x;
  final double y;
  final double size;
  final double baseOpacity;
  final double speed;

  _Particle({
    required this.x,
    required this.y,
    required this.size,
    required this.baseOpacity,
    required this.speed,
  });
}
