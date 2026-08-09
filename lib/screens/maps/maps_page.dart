import 'dart:async';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:geolocator/geolocator.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:latlong2/latlong.dart';
import 'package:permission_handler/permission_handler.dart';

import '../../models/vehicle_location.dart';
import '../../services/osrm_service.dart';
import '../../services/vehicle_tracking_service.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  runApp(const WasteTrackingApp());
}

class WasteTrackingApp extends StatelessWidget {
  const WasteTrackingApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'SEWAC Vehicle Tracking',
      theme: ThemeData(
        brightness: Brightness.dark,
        useMaterial3: true,
      ),
      home: const MapsPage(),
    );
  }
}

class MapsPage extends StatefulWidget {
  const MapsPage({super.key});

  @override
  State<MapsPage> createState() => _MapsPageState();
}

class _MapsPageState extends State<MapsPage> with TickerProviderStateMixin {
  //==========================================================
  // SERVICES
  //==========================================================

  final VehicleTrackingService _trackingService = VehicleTrackingService();

  final MapController _mapController = MapController();

  //==========================================================
  // MAP SETTINGS
  //==========================================================

  double _currentZoom = 15;

  static const double _defaultZoom = 15;

  static const Duration _pollDuration = Duration(seconds: 2);

  //==========================================================
  // VEHICLE & CITIZEN STATE
  //==========================================================

  VehicleLocation? _vehicle;

  LatLng? _currentPosition;

  LatLng? _previousPosition;

  LatLng? _targetPosition;

  LatLng? _citizenLocation;

  List<LatLng> _routeCoordinates = [];

  List<LatLng> _citizenToVehicleRoute = [];

  double _distanceToCitizenMeters = 0.0;

  int _etaMinutes = 0;

  bool _isLoading = true;

  bool _isFollowingVehicle = true;

  //==========================================================
  // TIMERS
  //==========================================================

  Timer? _pollingTimer;

  //==========================================================
  // ANIMATIONS
  //==========================================================

  late final AnimationController _movementController;

  late final AnimationController _pageController;

  late final AnimationController _pulseController;

  late final Animation<double> _fadeAnimation;

  late final Animation<Offset> _slideAnimation;

  late final Animation<double> _pulseAnimation;

  //==========================================================
  // INITIALIZATION
  //==========================================================

  @override
  void initState() {
    super.initState();

    _movementController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1800),
    );

    _pageController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );

    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1600),
    )..repeat();

    _fadeAnimation = CurvedAnimation(
      parent: _pageController,
      curve: Curves.easeOut,
    );

    _slideAnimation =
        Tween<Offset>(begin: const Offset(0, .06), end: Offset.zero).animate(
          CurvedAnimation(parent: _pageController, curve: Curves.easeOutCubic),
        );

    _pulseAnimation = Tween<double>(
      begin: 0.8,
      end: 1.45,
    ).animate(CurvedAnimation(parent: _pulseController, curve: Curves.easeOut));

    _pageController.forward();

    _initializePage();
  }

  @override
  void dispose() {
    _pollingTimer?.cancel();

    _movementController.dispose();

    _pageController.dispose();

    _pulseController.dispose();

    _mapController.dispose();

    super.dispose();
  }

  //==========================================================
  // INITIAL PAGE SETUP
  //==========================================================
  Future<void> _initializePage() async {
    await Permission.location.request();

    await _getCitizenLocation();

    await _loadInitialVehicle();

    _startPolling();
  }

  //==========================================================
  // GET CITIZEN LOCATION
  //==========================================================
  Future<void> _getCitizenLocation() async {
    debugPrint("GETTING CURRENT LOCATION");

    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) return;

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) return;
      }

      if (permission == LocationPermission.deniedForever) return;

      final position = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
        ),
      );

      debugPrint("=================================");
      debugPrint("DEVICE LATITUDE : ${position.latitude}");
      debugPrint("DEVICE LONGITUDE: ${position.longitude}");
      debugPrint("=================================");

      if (mounted) {
        setState(() {
          _citizenLocation = LatLng(position.latitude, position.longitude);
        });
      }
    } catch (e) {
      debugPrint("Citizen Location Error : $e");
    }
  }

  //==========================================================
  // LOAD INITIAL VEHICLE
  //==========================================================

  Future<void> _loadInitialVehicle() async {
    try {
      if (_citizenLocation == null) {
        await _getCitizenLocation();
      }

      final vehicle = await _trackingService.getNearestVehicle(
        _citizenLocation?.latitude ?? 12.9716,
        _citizenLocation?.longitude ?? 77.5946,
      );

      _vehicle = vehicle;

      _currentPosition = vehicle.currentPosition;

      _previousPosition = vehicle.currentPosition;

      _targetPosition = vehicle.currentPosition;

      SchedulerBinding.instance.addPostFrameCallback((_) {
        if (_currentPosition != null) {
          _mapController.move(_currentPosition!, _defaultZoom);
        }
      });

      await _updateCitizenToVehicleRoute();

      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    } catch (e) {
      debugPrint("Initial Vehicle Error : $e");
    }
  }

  //==========================================================
  // START LIVE POLLING
  //==========================================================

  void _startPolling() {
    _pollingTimer?.cancel();

    _pollingTimer = Timer.periodic(_pollDuration, (_) {
      _fetchLatestVehicle();
    });
  }

  //==========================================================
  // FETCH LATEST VEHICLE
  //==========================================================

  Future<void> _fetchLatestVehicle() async {
    try {
      if (_citizenLocation == null) {
        await _getCitizenLocation();
      }

      final latestVehicle = await _trackingService.getNearestVehicle(
        _citizenLocation?.latitude ?? 12.9716,
        _citizenLocation?.longitude ?? 77.5946,
      );

      final latestPosition = latestVehicle.currentPosition;

      if (_currentPosition == null) {
        setState(() {
          _vehicle = latestVehicle;

          _currentPosition = latestPosition;

          _previousPosition = latestPosition;

          _targetPosition = latestPosition;
        });

        return;
      }

      final distance = const Distance().as(
        LengthUnit.Meter,

        _currentPosition!,

        latestPosition,
      );

      // Ignore GPS jitter

      if (distance < 2) {
        return;
      }

      _vehicle = latestVehicle;

      _previousPosition = _currentPosition;

      _targetPosition = latestPosition;

      await _updateRoute();

      await _updateCitizenToVehicleRoute();

      _startInterpolation();
    } catch (e) {
      debugPrint("Polling Error : $e");
    }
  }

  //==========================================================
  // UPDATE ROUTE
  //==========================================================

  Future<void> _updateRoute() async {
    if (_previousPosition == null || _targetPosition == null) {
      return;
    }

    try {
      final route = await OSRMService.fetchRoute(
        _previousPosition!,

        _targetPosition!,
      );

      if (!mounted) return;

      setState(() {
        _routeCoordinates = route;
      });
    } catch (e) {
      debugPrint("OSRM Error : $e");
    }
  }

  //==========================================================
  // UPDATE CITIZEN TO VEHICLE ROUTE & ETA
  //==========================================================

  Future<void> _updateCitizenToVehicleRoute() async {
    if (_citizenLocation == null || _currentPosition == null) return;

    try {
      final route = await OSRMService.fetchRoute(
        _citizenLocation!,
        _currentPosition!,
      );

      final distanceMeters = const Distance().as(
        LengthUnit.Meter,
        _citizenLocation!,
        _currentPosition!,
      );

      // Calculate ETA assuming average speed ~20 km/h (333 m/min)
      final calculatedEta = (distanceMeters / 333.3).ceil().clamp(1, 120);

      if (!mounted) return;

      setState(() {
        _citizenToVehicleRoute = route;
        _distanceToCitizenMeters = distanceMeters;
        _etaMinutes = calculatedEta;
      });
    } catch (e) {
      debugPrint("Citizen OSRM Error: $e");
    }
  }

  //==========================================================
  // SMOOTH INTERPOLATION
  //==========================================================

  void _startInterpolation() {
    if (_previousPosition == null || _targetPosition == null) {
      return;
    }

    final LatLng start = _previousPosition!;

    final LatLng end = _targetPosition!;

    _movementController.reset();

    _movementController.forward();

    void listener() {
      final progress = Curves.easeInOutCubic.transform(
        _movementController.value,
      );

      final latitude =
          start.latitude + ((end.latitude - start.latitude) * progress);

      final longitude =
          start.longitude + ((end.longitude - start.longitude) * progress);

      final interpolated = LatLng(latitude, longitude);

      if (!mounted) return;

      setState(() {
        _currentPosition = interpolated;
      });

      if (_isFollowingVehicle) {
        _mapController.move(interpolated, _currentZoom);
      }
    }

    _movementController.removeListener(listener);

    _movementController.addListener(listener);

    _movementController.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        _currentPosition = end;

        _previousPosition = end;
      }
    });
  }

  //==========================================================
  // MAP CONTROLS
  //==========================================================

  void _zoomIn() {
    _currentZoom = (_currentZoom + .5).clamp(3.0, 18.5);

    if (_currentPosition != null) {
      _mapController.move(_currentPosition!, _currentZoom);
    }

    setState(() {});
  }

  void _zoomOut() {
    _currentZoom = (_currentZoom - .5).clamp(3.0, 18.5);

    if (_currentPosition != null) {
      _mapController.move(_currentPosition!, _currentZoom);
    }

    setState(() {});
  }

  void _recenterMap() {
    if (_currentPosition == null) return;

    _isFollowingVehicle = true;

    _currentZoom = _defaultZoom;

    _mapController.move(_currentPosition!, _currentZoom);

    setState(() {});
  }

  void _stopFollowingVehicle() {
    _isFollowingVehicle = false;

    setState(() {});
  }

  //==========================================================
  // VEHICLE DETAILS
  //==========================================================

  void _showVehicleDetails() {
    if (_vehicle == null) return;

    showModalBottomSheet(
      context: context,

      backgroundColor: Colors.transparent,

      isScrollControlled: true,

      builder: (_) {
        return _buildVehicleBottomSheet();
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    const double bottomNavGap = 96.0 + 8.0;

    if (_currentPosition == null) {
      return Scaffold(
        backgroundColor: const Color(0xFF260548),
        body: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const CircularProgressIndicator(
                color: Color(0xFFC084FC),
                strokeWidth: 3,
              ),
              const SizedBox(height: 16),
              Text(
                "Connecting to Vehicle GPS...",
                style: GoogleFonts.plusJakartaSans(
                  color: Colors.white70,
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFF260548),
      resizeToAvoidBottomInset: false,
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF260548), Color(0xFF3B0B68), Color(0xFF531288)],
          ),
        ),
        child: SafeArea(
          child: FadeTransition(
            opacity: _fadeAnimation,
            child: SlideTransition(
              position: _slideAnimation,
              child: Padding(
                padding: const EdgeInsets.only(
                  left: 14,
                  right: 14,
                  top: 10,
                  bottom: bottomNavGap,
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.max,
                  children: [
                    //------------------------------------------------------
                    // HEADER
                    //------------------------------------------------------
                    ClipRRect(
                      borderRadius: BorderRadius.circular(22),
                      child: BackdropFilter(
                        filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 14,
                            vertical: 10,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: .08),
                            borderRadius: BorderRadius.circular(22),
                            border: Border.all(
                              color: Colors.white.withValues(alpha: .15),
                              width: 1.0,
                            ),
                          ),
                          child: Row(
                            children: [
                              Container(
                                width: 44,
                                height: 44,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  gradient: LinearGradient(
                                    colors: [
                                      const Color(0xFFC084FC).withValues(alpha: .30),
                                      const Color(0xFFA855F7).withValues(alpha: .15),
                                    ],
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                  ),
                                  border: Border.all(
                                    color: const Color(0xFFC084FC).withValues(alpha: .40),
                                    width: 1.0,
                                  ),
                                ),
                                child: const Icon(
                                  Icons.local_shipping_rounded,
                                  color: Color(0xFFC084FC),
                                  size: 22,
                                ),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Row(
                                      children: [
                                        Flexible(
                                          child: Text(
                                            "Live Vehicle Tracking",
                                            overflow: TextOverflow.ellipsis,
                                            style: GoogleFonts.plusJakartaSans(
                                              color: Colors.white,
                                              fontWeight: FontWeight.bold,
                                              fontSize: 15,
                                              letterSpacing: -0.3,
                                            ),
                                          ),
                                        ),
                                        const SizedBox(width: 6),
                                        Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 5,
                                            vertical: 2,
                                          ),
                                          decoration: BoxDecoration(
                                            color: const Color(0xFF4CAF50).withValues(alpha: .20),
                                            borderRadius: BorderRadius.circular(6),
                                            border: Border.all(
                                              color: const Color(0xFF4CAF50).withValues(alpha: .50),
                                              width: 0.8,
                                            ),
                                          ),
                                          child: Row(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              Container(
                                                width: 5,
                                                height: 5,
                                                decoration: const BoxDecoration(
                                                  shape: BoxShape.circle,
                                                  color: Color(0xFF4CAF50),
                                                ),
                                              ),
                                              const SizedBox(width: 3),
                                              Text(
                                                "LIVE",
                                                style: GoogleFonts.plusJakartaSans(
                                                  color: const Color(0xFF4CAF50),
                                                  fontWeight: FontWeight.w800,
                                                  fontSize: 8.5,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      "Vehicle: ${_vehicle?.vehicleId ?? 'Loading...'}",
                                      overflow: TextOverflow.ellipsis,
                                      style: GoogleFonts.plusJakartaSans(
                                        color: Colors.white.withValues(alpha: .65),
                                        fontSize: 11.5,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Material(
                                color: Colors.transparent,
                                child: InkWell(
                                  onTap: _showVehicleDetails,
                                  borderRadius: BorderRadius.circular(12),
                                  child: Container(
                                    width: 38,
                                    height: 38,
                                    decoration: BoxDecoration(
                                      borderRadius: BorderRadius.circular(12),
                                      color: Colors.white.withValues(alpha: .10),
                                      border: Border.all(
                                        color: Colors.white.withValues(alpha: .15),
                                      ),
                                    ),
                                    child: const Icon(
                                      Icons.info_outline_rounded,
                                      color: Colors.white,
                                      size: 18,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 10),

                    //------------------------------------------------------
                    // EXPANDED FLOATING MAP CARD
                    //------------------------------------------------------
                    Expanded(
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(22),
                        child: Container(
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(22),
                            border: Border.all(
                              color: Colors.white.withValues(alpha: .18),
                              width: 1.2,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: .35),
                                blurRadius: 16,
                                offset: const Offset(0, 6),
                              ),
                            ],
                          ),
                          child: Stack(
                            children: [
                              FlutterMap(
                                mapController: _mapController,
                                options: MapOptions(
                                  initialCenter: _currentPosition!,
                                  initialZoom: _currentZoom,
                                  onPositionChanged: (position, gesture) {
                                    if (gesture) {
                                      _stopFollowingVehicle();
                                    }
                                  },
                                ),
                                children: [
                                  TileLayer(
                                    urlTemplate:
                                    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
                                    subdomains: const ['a', 'b', 'c', 'd'],
                                    userAgentPackageName: "com.sewac.citizen",
                                  ),

                                  // ROUTE POLYLINE (CITIZEN TO VEHICLE)
                                  if (_citizenToVehicleRoute.isNotEmpty)
                                    PolylineLayer(
                                      polylines: [
                                        Polyline(
                                          points: _citizenToVehicleRoute,
                                          strokeWidth: 3.5,
                                          color: const Color(0xFF2196F3),
                                          borderStrokeWidth: 1.0,
                                          borderColor: Colors.white54,
                                        ),
                                      ],
                                    ),

                                  // ROUTE POLYLINE (VEHICLE MOVEMENT)
                                  if (_routeCoordinates.isNotEmpty)
                                    PolylineLayer(
                                      polylines: [
                                        Polyline(
                                          points: _routeCoordinates,
                                          strokeWidth: 4.0,
                                          color: const Color(0xFFC084FC),
                                          borderStrokeWidth: 1.0,
                                          borderColor: Colors.white38,
                                        ),
                                      ],
                                    ),

                                  // START MARKER
                                  if (_vehicle != null)
                                    MarkerLayer(
                                      markers: [
                                        Marker(
                                          point: _vehicle!.initialPoint.toLatLng(),
                                          width: 32,
                                          height: 32,
                                          child: Container(
                                            decoration: BoxDecoration(
                                              shape: BoxShape.circle,
                                              color: const Color(0xFF2E7D32),
                                              border: Border.all(
                                                color: Colors.white,
                                                width: 1.8,
                                              ),
                                              boxShadow: [
                                                BoxShadow(
                                                  color: Colors.black.withValues(alpha: .3),
                                                  blurRadius: 4,
                                                ),
                                              ],
                                            ),
                                            child: const Icon(
                                              Icons.flag_rounded,
                                              color: Colors.white,
                                              size: 18,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),

                                  // TARGET MARKER
                                  if (_targetPosition != null)
                                    MarkerLayer(
                                      markers: [
                                        Marker(
                                          point: _targetPosition!,
                                          width: 32,
                                          height: 32,
                                          child: Container(
                                            decoration: BoxDecoration(
                                              shape: BoxShape.circle,
                                              color: const Color(0xFFE53935),
                                              border: Border.all(
                                                color: Colors.white,
                                                width: 1.8,
                                              ),
                                              boxShadow: [
                                                BoxShadow(
                                                  color: Colors.black.withValues(alpha: .3),
                                                  blurRadius: 4,
                                                ),
                                              ],
                                            ),
                                            child: const Icon(
                                              Icons.location_on_rounded,
                                              color: Colors.white,
                                              size: 18,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),

                                  // CITIZEN MARKER ("YOU")
                                  if (_citizenLocation != null)
                                    MarkerLayer(
                                      markers: [
                                        Marker(
                                          point: _citizenLocation!,
                                          width: 50,
                                          height: 50,
                                          alignment: Alignment.center,
                                          child: Column(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              AnimatedBuilder(
                                                animation: _pulseAnimation,
                                                builder: (context, child) {
                                                  return Stack(
                                                    alignment: Alignment.center,
                                                    children: [
                                                      Transform.scale(
                                                        scale: _pulseAnimation.value,
                                                        child: Container(
                                                          width: 22,
                                                          height: 22,
                                                          decoration: BoxDecoration(
                                                            shape: BoxShape.circle,
                                                            color: const Color(0xFF2196F3).withValues(alpha: .25),
                                                          ),
                                                        ),
                                                      ),
                                                      Container(
                                                        width: 14,
                                                        height: 14,
                                                        decoration: BoxDecoration(
                                                          shape: BoxShape.circle,
                                                          color: const Color(0xFF2196F3),
                                                          border: Border.all(
                                                            color: Colors.white,
                                                            width: 2.0,
                                                          ),
                                                          boxShadow: [
                                                            BoxShadow(
                                                              color: const Color(0xFF2196F3).withValues(alpha: .40),
                                                              blurRadius: 6,
                                                              spreadRadius: 1,
                                                            ),
                                                          ],
                                                        ),
                                                      ),
                                                    ],
                                                  );
                                                },
                                              ),
                                              const SizedBox(height: 2),
                                              Container(
                                                padding: const EdgeInsets.symmetric(
                                                  horizontal: 5,
                                                  vertical: 1,
                                                ),
                                                decoration: BoxDecoration(
                                                  color: Colors.white,
                                                  borderRadius: BorderRadius.circular(8),
                                                  boxShadow: [
                                                    BoxShadow(
                                                      color: Colors.black.withValues(alpha: .25),
                                                      blurRadius: 3,
                                                      offset: const Offset(0, 1),
                                                    ),
                                                  ],
                                                ),
                                                child: Text(
                                                  "You",
                                                  style: GoogleFonts.plusJakartaSans(
                                                    color: const Color(0xFF2196F3),
                                                    fontWeight: FontWeight.w800,
                                                    fontSize: 8.5,
                                                  ),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),

                                  // LIVE VEHICLE MARKER
                                  if (_currentPosition != null)
                                    MarkerLayer(
                                      markers: [
                                        Marker(
                                          point: _currentPosition!,
                                          width: 80,
                                          height: 80,
                                          alignment: Alignment.center,
                                          child: AnimatedBuilder(
                                            animation: _pulseAnimation,
                                            builder: (context, child) {
                                              return Stack(
                                                alignment: Alignment.center,
                                                children: [
                                                  Transform.scale(
                                                    scale: _pulseAnimation.value,
                                                    child: Container(
                                                      width: 48,
                                                      height: 48,
                                                      decoration: BoxDecoration(
                                                        shape: BoxShape.circle,
                                                        color: const Color(0xFFC084FC).withValues(alpha: .18),
                                                      ),
                                                    ),
                                                  ),
                                                  Container(
                                                    width: 44,
                                                    height: 44,
                                                    decoration: BoxDecoration(
                                                      shape: BoxShape.circle,
                                                      gradient: const LinearGradient(
                                                        colors: [
                                                          Color(0xFFC084FC),
                                                          Color(0xFFA855F7),
                                                        ],
                                                        begin: Alignment.topLeft,
                                                        end: Alignment.bottomRight,
                                                      ),
                                                      border: Border.all(
                                                        color: Colors.white,
                                                        width: 2.5,
                                                      ),
                                                      boxShadow: [
                                                        BoxShadow(
                                                          color: const Color(0xFFA855F7).withValues(alpha: .40),
                                                          blurRadius: 12,
                                                          spreadRadius: 2,
                                                        ),
                                                      ],
                                                    ),
                                                    child: const Icon(
                                                      Icons.local_shipping_rounded,
                                                      color: Colors.white,
                                                      size: 22,
                                                    ),
                                                  ),
                                                ],
                                              );
                                            },
                                          ),
                                        ),
                                      ],
                                    ),
                                ],
                              ),

                              // FLOATING DISTANCE & ETA CHIP
                              Positioned(
                                top: 10,
                                left: 10,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 10,
                                    vertical: 6,
                                  ),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF260548).withValues(alpha: .85),
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(
                                      color: const Color(0xFFC084FC).withValues(alpha: .30),
                                      width: 1.0,
                                    ),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withValues(alpha: .30),
                                        blurRadius: 8,
                                      ),
                                    ],
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      const Icon(
                                        Icons.navigation_rounded,
                                        color: Color(0xFFC084FC),
                                        size: 13,
                                      ),
                                      const SizedBox(width: 5),
                                      Text(
                                        _distanceToCitizenMeters < 1000
                                            ? "${_distanceToCitizenMeters.toInt()} m away"
                                            : "${(_distanceToCitizenMeters / 1000).toStringAsFixed(1)} km away",
                                        style: GoogleFonts.plusJakartaSans(
                                          color: Colors.white,
                                          fontWeight: FontWeight.bold,
                                          fontSize: 11,
                                        ),
                                      ),
                                      Text(
                                        " • ",
                                        style: GoogleFonts.plusJakartaSans(
                                          color: Colors.white54,
                                          fontSize: 11,
                                        ),
                                      ),
                                      Text(
                                        "ETA ~$_etaMinutes mins",
                                        style: GoogleFonts.plusJakartaSans(
                                          color: const Color(0xFFC084FC),
                                          fontWeight: FontWeight.bold,
                                          fontSize: 11,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),

                              // FLOATING MAP CONTROLS
                              Positioned(
                                top: 10,
                                right: 10,
                                child: Column(
                                  children: [
                                    _buildMapControlButton(
                                      icon: Icons.add_rounded,
                                      onTap: _zoomIn,
                                    ),
                                    const SizedBox(height: 6),
                                    _buildMapControlButton(
                                      icon: Icons.remove_rounded,
                                      onTap: _zoomOut,
                                    ),
                                    const SizedBox(height: 6),
                                    _buildMapControlButton(
                                      icon: Icons.my_location_rounded,
                                      onTap: _recenterMap,
                                    ),
                                  ],
                                ),
                              ),

                              // FOLLOW VEHICLE INDICATOR CHIP
                              if (!_isFollowingVehicle)
                                Positioned(
                                  bottom: 12,
                                  left: 12,
                                  child: AnimatedOpacity(
                                    duration: const Duration(milliseconds: 200),
                                    opacity: !_isFollowingVehicle ? 1.0 : 0.0,
                                    child: GestureDetector(
                                      onTap: _recenterMap,
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(
                                          horizontal: 12,
                                          vertical: 6,
                                        ),
                                        decoration: BoxDecoration(
                                          gradient: const LinearGradient(
                                            colors: [
                                              Color(0xFFC084FC),
                                              Color(0xFFA855F7),
                                            ],
                                          ),
                                          borderRadius: BorderRadius.circular(20),
                                          border: Border.all(
                                            color: Colors.white.withValues(alpha: .30),
                                            width: 0.8,
                                          ),
                                          boxShadow: [
                                            BoxShadow(
                                              color: const Color(0xFFA855F7).withValues(alpha: .40),
                                              blurRadius: 10,
                                              offset: const Offset(0, 3),
                                            ),
                                          ],
                                        ),
                                        child: Row(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            const Icon(
                                              Icons.center_focus_strong_rounded,
                                              color: Colors.white,
                                              size: 14,
                                            ),
                                            const SizedBox(width: 5),
                                            Text(
                                              "Follow Vehicle",
                                              style: GoogleFonts.plusJakartaSans(
                                                color: Colors.white,
                                                fontWeight: FontWeight.bold,
                                                fontSize: 11,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  //==========================================================
  // MAP CONTROL BUTTON
  //==========================================================

  Widget _buildMapControlButton({
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            color: const Color(0xFF260548).withValues(alpha: .80),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.white.withValues(alpha: .18)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: .30),
                blurRadius: 6,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Icon(icon, color: Colors.white, size: 18),
        ),
      ),
    );
  }

  //==========================================================
  // VEHICLE DETAILS BOTTOM SHEET
  //==========================================================

  Widget _buildVehicleBottomSheet() {
    final vehicle = _vehicle!;

    return Container(
      padding: const EdgeInsets.only(left: 20, right: 20, top: 16, bottom: 24),
      decoration: BoxDecoration(
        color: const Color(0xFF260548).withValues(alpha: .96),
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(28),
          topRight: Radius.circular(28),
        ),
        border: Border.all(
          color: Colors.white.withValues(alpha: .18),
          width: 1.2,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: .50),
            blurRadius: 28,
            spreadRadius: 4,
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 44,
              height: 5,
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: .35),
                borderRadius: BorderRadius.circular(50),
              ),
            ),
          ),
          const SizedBox(height: 18),
          Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFFC084FC).withValues(alpha: .20),
                  border: Border.all(
                    color: const Color(0xFFC084FC).withValues(alpha: .35),
                  ),
                ),
                child: const Icon(
                  Icons.local_shipping_rounded,
                  color: Color(0xFFC084FC),
                  size: 24,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      vehicle.vehicleId,
                      style: GoogleFonts.plusJakartaSans(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      "Live GPS Vehicle",
                      style: GoogleFonts.plusJakartaSans(
                        color: Colors.white.withValues(alpha: .65),
                        fontSize: 12.5,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),
          _buildInfoTile(
            "Latitude",
            vehicle.currentPosition.latitude.toStringAsFixed(6),
            Icons.place_rounded,
          ),
          _buildInfoTile(
            "Longitude",
            vehicle.currentPosition.longitude.toStringAsFixed(6),
            Icons.explore_rounded,
          ),
          _buildInfoTile(
            "Distance to You",
            "${_distanceToCitizenMeters.toInt()} meters (ETA ~$_etaMinutes mins)",
            Icons.near_me_rounded,
          ),
          _buildInfoTile(
            "Updated",
            vehicle.updatedAt.toLocal().toString().split('.').first,
            Icons.access_time_rounded,
          ),
          const SizedBox(height: 6),
        ],
      ),
    );
  }

  //==========================================================
  // INFO TILE
  //==========================================================

  Widget _buildInfoTile(String title, String value, IconData icon) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: .06),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: Colors.white.withValues(alpha: .10),
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 34,
            height: 38,
            decoration: BoxDecoration(
              color: const Color(0xFFC084FC).withValues(alpha: .15),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: const Color(0xFFC084FC), size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.plusJakartaSans(
                    color: Colors.white.withValues(alpha: .55),
                    fontSize: 10.5,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: GoogleFonts.plusJakartaSans(
                    color: Colors.white,
                    fontWeight: FontWeight.w700,
                    fontSize: 12.5,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}