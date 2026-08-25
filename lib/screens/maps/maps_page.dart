import 'dart:async';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:geolocator/geolocator.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:latlong2/latlong.dart';
import 'package:permission_handler/permission_handler.dart';

import '../../models/citizen.dart';
import '../../models/live_vehicle_response.dart';
import '../../services/auth_service.dart';
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

class _MapsPageState extends State<MapsPage>
    with TickerProviderStateMixin {
  //==========================================================
  // SERVICES
  //==========================================================

  final VehicleTrackingService _trackingService =
  VehicleTrackingService();

  final MapController _mapController =
  MapController();

  //==========================================================
  // MAP SETTINGS
  //==========================================================

  double _currentZoom = 15;

  static const double _defaultZoom = 15;

  static const Duration _pollDuration =
  Duration(seconds: 2);

  //==========================================================
  // CITIZEN STATE
  //==========================================================

  Citizen? _citizen;

  LatLng? _citizenLocation;

  //==========================================================
  // LIVE VEHICLE STATE
  //==========================================================

  List<LiveVehicle> _liveVehicles = [];

  /*
   * Current displayed position of every vehicle.
   *
   * Key:
   *   vehicleId
   *
   * Value:
   *   current animated map position
   */
  final Map<String, LatLng> _vehicleDisplayPositions =
  {};

  /*
   * Previous GPS position used for interpolation.
   */
  final Map<String, LatLng> _vehiclePreviousPositions =
  {};

  /*
   * New GPS target position received from backend.
   */
  final Map<String, LatLng> _vehicleTargetPositions =
  {};

  /*
   * Nearest vehicle is still used for the existing
   * citizen-to-vehicle route and ETA UI.
   */
  LiveVehicle? _nearestVehicle;

  LatLng? _nearestVehicleInitialPosition;

  LatLng? _currentPosition;

  LatLng? _previousPosition;

  LatLng? _targetPosition;

  //==========================================================
  // ROUTE STATE
  //==========================================================

  List<LatLng> _routeCoordinates = [];

  List<LatLng> _citizenToVehicleRoute = [];

  double _distanceToCitizenMeters = 0.0;

  int _etaMinutes = 0;

  //==========================================================
  // UI STATE
  //==========================================================

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
      duration: const Duration(
        milliseconds: 1800,
      ),
    );

    _pageController = AnimationController(
      vsync: this,
      duration: const Duration(
        milliseconds: 700,
      ),
    );

    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(
        milliseconds: 1600,
      ),
    )..repeat();

    _fadeAnimation = CurvedAnimation(
      parent: _pageController,
      curve: Curves.easeOut,
    );

    _slideAnimation =
        Tween<Offset>(
          begin: const Offset(0, .06),
          end: Offset.zero,
        ).animate(
          CurvedAnimation(
            parent: _pageController,
            curve: Curves.easeOutCubic,
          ),
        );

    _pulseAnimation = Tween<double>(
      begin: 0.8,
      end: 1.45,
    ).animate(
      CurvedAnimation(
        parent: _pulseController,
        curve: Curves.easeOut,
      ),
    );

    _movementController.addListener(
      _handleVehicleAnimation,
    );

    _pageController.forward();

    _initializePage();
  }

  @override
  void dispose() {
    _pollingTimer?.cancel();

    _movementController.removeListener(
      _handleVehicleAnimation,
    );

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

    await _loadCitizenDetails();

    await _loadInitialLiveVehicles();

    _startPolling();
  }

  //==========================================================
  // GET CITIZEN LOCATION
  //==========================================================

  Future<void> _getCitizenLocation() async {
    debugPrint(
      "GETTING CURRENT LOCATION",
    );

    try {
      final serviceEnabled =
      await Geolocator.isLocationServiceEnabled();

      if (!serviceEnabled) {
        debugPrint(
          "Location service is disabled.",
        );
        return;
      }

      LocationPermission permission =
      await Geolocator.checkPermission();

      if (permission ==
          LocationPermission.denied) {
        permission =
        await Geolocator.requestPermission();

        if (permission ==
            LocationPermission.denied) {
          debugPrint(
            "Location permission denied.",
          );
          return;
        }
      }

      if (permission ==
          LocationPermission.deniedForever) {
        debugPrint(
          "Location permission permanently denied.",
        );
        return;
      }

      final position =
      await Geolocator.getCurrentPosition(
        locationSettings:
        const LocationSettings(
          accuracy: LocationAccuracy.high,
        ),
      );

      debugPrint(
        "=================================",
      );

      debugPrint(
        "DEVICE LATITUDE : ${position.latitude}",
      );

      debugPrint(
        "DEVICE LONGITUDE: ${position.longitude}",
      );

      debugPrint(
        "=================================",
      );

      if (!mounted) return;

      setState(() {
        _citizenLocation = LatLng(
          position.latitude,
          position.longitude,
        );
      });
    } catch (e) {
      debugPrint(
        "Citizen Location Error : $e",
      );
    }
  }

  //==========================================================
  // LOAD CITIZEN DETAILS
  //==========================================================

  Future<void> _loadCitizenDetails() async {
    try {
      final citizen =
      await AuthService.getCurrentCitizen();

      if (!mounted) return;

      setState(() {
        _citizen = citizen;
      });

      debugPrint(
        "=================================",
      );

      debugPrint(
        "CITY ID     : ${citizen.cityId}",
      );

      debugPrint(
        "ZONE ID     : ${citizen.zoneId}",
      );

      debugPrint(
        "DIVISION ID : ${citizen.divisionId}",
      );

      debugPrint(
        "WARD ID     : ${citizen.wardId}",
      );

      debugPrint(
        "=================================",
      );
    } catch (e) {
      debugPrint(
        "Citizen Details Error : $e",
      );
    }
  }

  //==========================================================
  // LOAD INITIAL LIVE VEHICLES
  //==========================================================

  Future<void> _loadInitialLiveVehicles() async {
    try {
      if (_citizenLocation == null) {
        await _getCitizenLocation();
      }

      if (_citizenLocation == null) {
        throw Exception(
          "Citizen location unavailable.",
        );
      }

      if (_citizen == null) {
        await _loadCitizenDetails();
      }

      if (_citizen == null) {
        throw Exception(
          "Citizen details unavailable.",
        );
      }

      final response =
      await _trackingService
          .getLiveVehicleLocations(
        latitude:
        _citizenLocation!.latitude,
        longitude:
        _citizenLocation!.longitude,
        cityId:
        _citizen!.cityId,
        zoneId:
        _citizen!.zoneId,
        divisionId:
        _citizen!.divisionId,
        wardId:
        _citizen!.wardId,
      );

      if (!mounted) return;

      _updateVehicleCollections(
        response.vehicles,
        animate: false,
      );

      final validVehicles =
      response.vehicles
          .where(
            (vehicle) =>
        vehicle.latitude != null &&
            vehicle.longitude != null,
      )
          .toList();

      if (validVehicles.isNotEmpty) {
        final nearest =
            validVehicles.first;

        _nearestVehicle = nearest;

        final nearestPosition =
        LatLng(
          nearest.latitude!,
          nearest.longitude!,
        );

        _nearestVehicleInitialPosition =
            nearestPosition;

        _currentPosition =
            nearestPosition;

        _previousPosition =
            nearestPosition;

        _targetPosition =
            nearestPosition;

        SchedulerBinding.instance
            .addPostFrameCallback((_) {
          if (!mounted) return;

          if (_currentPosition != null) {
            _mapController.move(
              _currentPosition!,
              _defaultZoom,
            );
          }
        });

        await _updateCitizenToVehicleRoute();
      }

      setState(() {
        _isLoading = false;
      });

      debugPrint(
        "=================================",
      );

      debugPrint(
        "LIVE VEHICLES FOUND: "
            "${response.vehicles.length}",
      );

      for (final vehicle
      in response.vehicles) {
        debugPrint(
          "${vehicle.vehicleId} | "
              "${vehicle.status} | "
              "${vehicle.latitude}, "
              "${vehicle.longitude} | "
              "${vehicle.distance} km",
        );
      }

      debugPrint(
        "=================================",
      );
    } catch (e) {
      debugPrint(
        "Initial Live Vehicle Error : $e",
      );

      if (!mounted) return;

      setState(() {
        _isLoading = false;
      });
    }
  }

  //==========================================================
  // START LIVE POLLING
  //==========================================================

  void _startPolling() {
    _pollingTimer?.cancel();

    _pollingTimer = Timer.periodic(
      _pollDuration,
          (_) {
        _fetchLatestVehicles();
      },
    );
  }

  //==========================================================
  // FETCH LATEST LIVE VEHICLES
  //==========================================================

  Future<void> _fetchLatestVehicles() async {
    try {
      if (_citizenLocation == null) {
        await _getCitizenLocation();
      }

      if (_citizenLocation == null) {
        return;
      }

      if (_citizen == null) {
        await _loadCitizenDetails();
      }

      if (_citizen == null) {
        return;
      }

      final response =
      await _trackingService
          .getLiveVehicleLocations(
        latitude:
        _citizenLocation!.latitude,
        longitude:
        _citizenLocation!.longitude,
        cityId:
        _citizen!.cityId,
        zoneId:
        _citizen!.zoneId,
        divisionId:
        _citizen!.divisionId,
        wardId:
        _citizen!.wardId,
      );

      if (!mounted) return;

      final vehicles =
          response.vehicles;

      final validVehicles =
      vehicles
          .where(
            (vehicle) =>
        vehicle.latitude != null &&
            vehicle.longitude != null,
      )
          .toList();

      _updateVehicleCollections(
        vehicles,
        animate: true,
      );

      if (validVehicles.isEmpty) {
        return;
      }

      /*
       * Backend returns vehicles sorted by
       * distance, nearest first.
       */
      final nearest =
          validVehicles.first;

      _nearestVehicle = nearest;

      final latestPosition =
      LatLng(
        nearest.latitude!,
        nearest.longitude!,
      );

      if (_currentPosition == null) {
        _currentPosition =
            latestPosition;

        _previousPosition =
            latestPosition;

        _targetPosition =
            latestPosition;

        await _updateCitizenToVehicleRoute();

        return;
      }

      final distance =
      const Distance().as(
        LengthUnit.Meter,
        _currentPosition!,
        latestPosition,
      );

      /*
       * Ignore very small GPS jitter.
       */
      if (distance < 2) {
        return;
      }

      _previousPosition =
          _currentPosition;

      _targetPosition =
          latestPosition;

      await _updateRoute();

      await _updateCitizenToVehicleRoute();

      _startInterpolation();
    } catch (e) {
      debugPrint(
        "Live Vehicle Polling Error : $e",
      );
    }
  }

  //==========================================================
  // UPDATE VEHICLE COLLECTIONS
  //==========================================================

  void _updateVehicleCollections(
      List<LiveVehicle> vehicles, {
        required bool animate,
      }) {
    final incomingIds =
    vehicles
        .map(
          (vehicle) =>
      vehicle.vehicleId,
    )
        .toSet();

    /*
     * Remove vehicles that are no longer
     * returned for this ward.
     */
    _vehicleDisplayPositions
        .removeWhere(
          (key, value) =>
      !incomingIds.contains(key),
    );

    _vehiclePreviousPositions
        .removeWhere(
          (key, value) =>
      !incomingIds.contains(key),
    );

    _vehicleTargetPositions
        .removeWhere(
          (key, value) =>
      !incomingIds.contains(key),
    );

    for (final vehicle in vehicles) {
      if (vehicle.latitude == null ||
          vehicle.longitude == null) {
        continue;
      }

      final id = vehicle.vehicleId;

      final newPosition = LatLng(
        vehicle.latitude!,
        vehicle.longitude!,
      );

      final oldPosition =
      _vehicleDisplayPositions[id];

      if (oldPosition == null) {
        _vehicleDisplayPositions[id] =
            newPosition;

        _vehiclePreviousPositions[id] =
            newPosition;

        _vehicleTargetPositions[id] =
            newPosition;

        continue;
      }

      if (!animate) {
        _vehicleDisplayPositions[id] =
            newPosition;

        _vehiclePreviousPositions[id] =
            newPosition;

        _vehicleTargetPositions[id] =
            newPosition;

        continue;
      }

      _vehiclePreviousPositions[id] =
          oldPosition;

      _vehicleTargetPositions[id] =
          newPosition;
    }

    if (mounted) {
      setState(() {
        _liveVehicles = vehicles;
      });
    }

    if (animate &&
        _vehicleTargetPositions.isNotEmpty) {
      _startAllVehicleInterpolation();
    }
  }

  //==========================================================
  // START ALL VEHICLE INTERPOLATION
  //==========================================================

  void _startAllVehicleInterpolation() {
    _movementController.reset();

    _movementController.forward();
  }

  //==========================================================
  // VEHICLE ANIMATION LISTENER
  //==========================================================

  void _handleVehicleAnimation() {
    if (!mounted) return;

    final progress =
    Curves.easeInOutCubic.transform(
      _movementController.value,
    );

    final updatedPositions =
    <String, LatLng>{};

    _vehicleTargetPositions
        .forEach(
          (vehicleId, target) {
        final start =
        _vehiclePreviousPositions[
        vehicleId];

        if (start == null) {
          updatedPositions[
          vehicleId] =
              target;

          return;
        }

        final latitude =
            start.latitude +
                ((target.latitude -
                    start.latitude) *
                    progress);

        final longitude =
            start.longitude +
                ((target.longitude -
                    start.longitude) *
                    progress);

        updatedPositions[
        vehicleId] =
            LatLng(
              latitude,
              longitude,
            );
      },
    );

    setState(() {
      _vehicleDisplayPositions
          .addAll(updatedPositions);
    });

    /*
     * Keep the map following the nearest
     * vehicle as before.
     */
    if (_isFollowingVehicle &&
        _nearestVehicle != null) {
      final nearestPosition =
      _vehicleDisplayPositions[
      _nearestVehicle!
          .vehicleId];

      if (nearestPosition != null) {
        _currentPosition =
            nearestPosition;

        _mapController.move(
          nearestPosition,
          _currentZoom,
        );
      }
    }
  }

  //==========================================================
  // UPDATE ROUTE
  //==========================================================

  Future<void> _updateRoute() async {
    if (_previousPosition == null ||
        _targetPosition == null) {
      return;
    }

    try {
      final route =
      await OSRMService.fetchRoute(
        _previousPosition!,
        _targetPosition!,
      );

      if (!mounted) return;

      setState(() {
        _routeCoordinates = route;
      });
    } catch (e) {
      debugPrint(
        "OSRM Error : $e",
      );
    }
  }

  //==========================================================
  // UPDATE CITIZEN TO VEHICLE ROUTE & ETA
  //==========================================================

  Future<void>
  _updateCitizenToVehicleRoute() async {
    if (_citizenLocation == null ||
        _currentPosition == null) {
      return;
    }

    try {
      final route =
      await OSRMService.fetchRoute(
        _citizenLocation!,
        _currentPosition!,
      );

      final distanceMeters =
      const Distance().as(
        LengthUnit.Meter,
        _citizenLocation!,
        _currentPosition!,
      );

      /*
       * Existing ETA logic preserved.
       *
       * Average speed ≈ 20 km/h
       */
      final calculatedEta =
      (distanceMeters / 333.3)
          .ceil()
          .clamp(1, 120);

      if (!mounted) return;

      setState(() {
        _citizenToVehicleRoute =
            route;

        _distanceToCitizenMeters =
            distanceMeters;

        _etaMinutes =
            calculatedEta;
      });
    } catch (e) {
      debugPrint(
        "Citizen OSRM Error : $e",
      );
    }
  }

  //==========================================================
  // SMOOTH NEAREST VEHICLE INTERPOLATION
  //==========================================================

  void _startInterpolation() {
    if (_previousPosition == null ||
        _targetPosition == null) {
      return;
    }

    _movementController.reset();

    _movementController.forward();
  }

  //==========================================================
  // MAP CONTROLS
  //==========================================================

  void _zoomIn() {
    _currentZoom =
        (_currentZoom + .5)
            .clamp(3.0, 18.5);

    final position =
        _currentPosition ??
            _citizenLocation;

    if (position != null) {
      _mapController.move(
        position,
        _currentZoom,
      );
    }

    setState(() {});
  }

  void _zoomOut() {
    _currentZoom =
        (_currentZoom - .5)
            .clamp(3.0, 18.5);

    final position =
        _currentPosition ??
            _citizenLocation;

    if (position != null) {
      _mapController.move(
        position,
        _currentZoom,
      );
    }

    setState(() {});
  }

  void _recenterMap() {
    final position =
        _currentPosition ??
            _citizenLocation;

    if (position == null) return;

    _isFollowingVehicle = true;

    _currentZoom =
        _defaultZoom;

    _mapController.move(
      position,
      _currentZoom,
    );

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
    if (_nearestVehicle == null) {
      return;
    }

    showModalBottomSheet(
      context: context,
      backgroundColor:
      Colors.transparent,
      isScrollControlled: true,
      builder: (_) {
        return _buildVehicleBottomSheet();
      },
    );
  }

  //==========================================================
  // BUILD
  //==========================================================

  @override
  Widget build(
      BuildContext context,
      ) {
    const double bottomNavGap =
        96.0 + 8.0;

    if (_isLoading) {
      return Scaffold(
        backgroundColor:
        const Color(0xFF260548),
        body: Center(
          child: Column(
            mainAxisSize:
            MainAxisSize.min,
            children: [
              const CircularProgressIndicator(
                color:
                Color(0xFFC084FC),
                strokeWidth: 3,
              ),
              const SizedBox(
                height: 16,
              ),
              Text(
                "Connecting to Vehicle GPS...",
                style:
                GoogleFonts
                    .plusJakartaSans(
                  color:
                  Colors.white70,
                  fontSize: 14,
                  fontWeight:
                  FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      );
    }

    final mapCenter =
        _currentPosition ??
            _citizenLocation ??
            const LatLng(
              12.9716,
              77.5946,
            );

    return Scaffold(
      backgroundColor:
      const Color(0xFF260548),
      resizeToAvoidBottomInset:
      false,
      body: Container(
        width:
        double.infinity,
        height:
        double.infinity,
        decoration:
        const BoxDecoration(
          gradient:
          LinearGradient(
            begin:
            Alignment.topCenter,
            end:
            Alignment.bottomCenter,
            colors: [
              Color(0xFF260548),
              Color(0xFF3B0B68),
              Color(0xFF531288),
            ],
          ),
        ),
        child: SafeArea(
          child:
          FadeTransition(
            opacity:
            _fadeAnimation,
            child:
            SlideTransition(
              position:
              _slideAnimation,
              child:
              Padding(
                padding:
                const EdgeInsets.only(
                  left: 14,
                  right: 14,
                  top: 10,
                  bottom:
                  bottomNavGap,
                ),
                child:
                Column(
                  mainAxisSize:
                  MainAxisSize.max,
                  children: [
                    //------------------------------------------------------
                    // HEADER
                    //------------------------------------------------------

                    ClipRRect(
                      borderRadius:
                      BorderRadius
                          .circular(
                        22,
                      ),
                      child:
                      BackdropFilter(
                        filter:
                        ImageFilter.blur(
                          sigmaX: 16,
                          sigmaY: 16,
                        ),
                        child:
                        Container(
                          padding:
                          const EdgeInsets
                              .symmetric(
                            horizontal:
                            14,
                            vertical:
                            10,
                          ),
                          decoration:
                          BoxDecoration(
                            color: Colors
                                .white
                                .withValues(
                              alpha:
                              .08,
                            ),
                            borderRadius:
                            BorderRadius
                                .circular(
                              22,
                            ),
                            border:
                            Border.all(
                              color: Colors
                                  .white
                                  .withValues(
                                alpha:
                                .15,
                              ),
                              width:
                              1.0,
                            ),
                          ),
                          child:
                          Row(
                            children: [
                              Container(
                                width:
                                44,
                                height:
                                44,
                                decoration:
                                BoxDecoration(
                                  shape:
                                  BoxShape
                                      .circle,
                                  gradient:
                                  LinearGradient(
                                    colors: [
                                      const Color(
                                        0xFFC084FC,
                                      ).withValues(
                                        alpha:
                                        .30,
                                      ),
                                      const Color(
                                        0xFFA855F7,
                                      ).withValues(
                                        alpha:
                                        .15,
                                      ),
                                    ],
                                    begin:
                                    Alignment
                                        .topLeft,
                                    end:
                                    Alignment
                                        .bottomRight,
                                  ),
                                  border:
                                  Border.all(
                                    color:
                                    const Color(
                                      0xFFC084FC,
                                    ).withValues(
                                      alpha:
                                      .40,
                                    ),
                                    width:
                                    1.0,
                                  ),
                                ),
                                child:
                                const Icon(
                                  Icons
                                      .local_shipping_rounded,
                                  color:
                                  Color(
                                    0xFFC084FC,
                                  ),
                                  size:
                                  22,
                                ),
                              ),

                              const SizedBox(
                                width:
                                10,
                              ),

                              Expanded(
                                child:
                                Column(
                                  crossAxisAlignment:
                                  CrossAxisAlignment
                                      .start,
                                  mainAxisSize:
                                  MainAxisSize
                                      .min,
                                  children: [
                                    Row(
                                      children: [
                                        Flexible(
                                          child:
                                          Text(
                                            "Live Vehicle Tracking",
                                            overflow:
                                            TextOverflow
                                                .ellipsis,
                                            style:
                                            GoogleFonts
                                                .plusJakartaSans(
                                              color:
                                              Colors
                                                  .white,
                                              fontWeight:
                                              FontWeight
                                                  .bold,
                                              fontSize:
                                              15,
                                              letterSpacing:
                                              -.3,
                                            ),
                                          ),
                                        ),

                                        const SizedBox(
                                          width:
                                          6,
                                        ),

                                        Container(
                                          padding:
                                          const EdgeInsets
                                              .symmetric(
                                            horizontal:
                                            5,
                                            vertical:
                                            2,
                                          ),
                                          decoration:
                                          BoxDecoration(
                                            color:
                                            const Color(
                                              0xFF4CAF50,
                                            ).withValues(
                                              alpha:
                                              .20,
                                            ),
                                            borderRadius:
                                            BorderRadius
                                                .circular(
                                              6,
                                            ),
                                            border:
                                            Border.all(
                                              color:
                                              const Color(
                                                0xFF4CAF50,
                                              ).withValues(
                                                alpha:
                                                .50,
                                              ),
                                              width:
                                              .8,
                                            ),
                                          ),
                                          child:
                                          Row(
                                            mainAxisSize:
                                            MainAxisSize
                                                .min,
                                            children: [
                                              Container(
                                                width:
                                                5,
                                                height:
                                                5,
                                                decoration:
                                                const BoxDecoration(
                                                  shape:
                                                  BoxShape
                                                      .circle,
                                                  color:
                                                  Color(
                                                    0xFF4CAF50,
                                                  ),
                                                ),
                                              ),
                                              const SizedBox(
                                                width:
                                                3,
                                              ),
                                              Text(
                                                "LIVE",
                                                style:
                                                GoogleFonts
                                                    .plusJakartaSans(
                                                  color:
                                                  const Color(
                                                    0xFF4CAF50,
                                                  ),
                                                  fontWeight:
                                                  FontWeight
                                                      .w800,
                                                  fontSize:
                                                  8.5,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),

                                    const SizedBox(
                                      height:
                                      2,
                                    ),

                                    Text(
                                      "Vehicles: ${_liveVehicles.length}",
                                      overflow:
                                      TextOverflow
                                          .ellipsis,
                                      style:
                                      GoogleFonts
                                          .plusJakartaSans(
                                        color:
                                        Colors
                                            .white
                                            .withValues(
                                          alpha:
                                          .65,
                                        ),
                                        fontSize:
                                        11.5,
                                        fontWeight:
                                        FontWeight
                                            .w500,
                                      ),
                                    ),
                                  ],
                                ),
                              ),

                              Material(
                                color:
                                Colors
                                    .transparent,
                                child:
                                InkWell(
                                  onTap:
                                  _showVehicleDetails,
                                  borderRadius:
                                  BorderRadius
                                      .circular(
                                    12,
                                  ),
                                  child:
                                  Container(
                                    width:
                                    38,
                                    height:
                                    38,
                                    decoration:
                                    BoxDecoration(
                                      borderRadius:
                                      BorderRadius
                                          .circular(
                                        12,
                                      ),
                                      color: Colors
                                          .white
                                          .withValues(
                                        alpha:
                                        .10,
                                      ),
                                      border:
                                      Border.all(
                                        color: Colors
                                            .white
                                            .withValues(
                                          alpha:
                                          .15,
                                        ),
                                      ),
                                    ),
                                    child:
                                    const Icon(
                                      Icons
                                          .info_outline_rounded,
                                      color:
                                      Colors
                                          .white,
                                      size:
                                      18,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(
                      height:
                      10,
                    ),

                    //------------------------------------------------------
                    // MAP
                    //------------------------------------------------------

                    Expanded(
                      child:
                      ClipRRect(
                        borderRadius:
                        BorderRadius
                            .circular(
                          22,
                        ),
                        child:
                        Container(
                          decoration:
                          BoxDecoration(
                            borderRadius:
                            BorderRadius
                                .circular(
                              22,
                            ),
                            border:
                            Border.all(
                              color: Colors
                                  .white
                                  .withValues(
                                alpha:
                                .18,
                              ),
                              width:
                              1.2,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: Colors
                                    .black
                                    .withValues(
                                  alpha:
                                  .35,
                                ),
                                blurRadius:
                                16,
                                offset:
                                const Offset(
                                  0,
                                  6,
                                ),
                              ),
                            ],
                          ),
                          child:
                          Stack(
                            children: [
                              FlutterMap(
                                mapController:
                                _mapController,
                                options:
                                MapOptions(
                                  initialCenter:
                                  mapCenter,
                                  initialZoom:
                                  _currentZoom,
                                  onPositionChanged:
                                      (
                                      position,
                                      gesture,
                                      ) {
                                    if (gesture) {
                                      _stopFollowingVehicle();
                                    }
                                  },
                                ),
                                children: [
                                  //--------------------------------------------------
                                  // MAP TILES
                                  //--------------------------------------------------

                                  TileLayer(
                                    urlTemplate:
                                    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
                                    subdomains:
                                    const [
                                      'a',
                                      'b',
                                      'c',
                                      'd',
                                    ],
                                    userAgentPackageName:
                                    "com.sewac.citizen",
                                  ),

                                  //--------------------------------------------------
                                  // CITIZEN → VEHICLE ROUTE
                                  //--------------------------------------------------

                                  if (_citizenToVehicleRoute
                                      .isNotEmpty)
                                    PolylineLayer(
                                      polylines:
                                      [
                                        Polyline(
                                          points:
                                          _citizenToVehicleRoute,
                                          strokeWidth:
                                          3.5,
                                          color:
                                          const Color(
                                            0xFF2196F3,
                                          ),
                                          borderStrokeWidth:
                                          1.0,
                                          borderColor:
                                          Colors
                                              .white54,
                                        ),
                                      ],
                                    ),

                                  //--------------------------------------------------
                                  // VEHICLE MOVEMENT ROUTE
                                  //--------------------------------------------------

                                  if (_routeCoordinates
                                      .isNotEmpty)
                                    PolylineLayer(
                                      polylines:
                                      [
                                        Polyline(
                                          points:
                                          _routeCoordinates,
                                          strokeWidth:
                                          4.0,
                                          color:
                                          const Color(
                                            0xFFC084FC,
                                          ),
                                          borderStrokeWidth:
                                          1.0,
                                          borderColor:
                                          Colors
                                              .white38,
                                        ),
                                      ],
                                    ),

                                  //--------------------------------------------------
                                  // INITIAL NEAREST VEHICLE POSITION
                                  //--------------------------------------------------

                                  if (_nearestVehicleInitialPosition !=
                                      null)
                                    MarkerLayer(
                                      markers:
                                      [
                                        Marker(
                                          point:
                                          _nearestVehicleInitialPosition!,
                                          width:
                                          32,
                                          height:
                                          32,
                                          child:
                                          Container(
                                            decoration:
                                            BoxDecoration(
                                              shape:
                                              BoxShape
                                                  .circle,
                                              color:
                                              const Color(
                                                0xFF2E7D32,
                                              ),
                                              border:
                                              Border.all(
                                                color:
                                                Colors
                                                    .white,
                                                width:
                                                1.8,
                                              ),
                                              boxShadow: [
                                                BoxShadow(
                                                  color:
                                                  Colors
                                                      .black
                                                      .withValues(
                                                    alpha:
                                                    .3,
                                                  ),
                                                  blurRadius:
                                                  4,
                                                ),
                                              ],
                                            ),
                                            child:
                                            const Icon(
                                              Icons
                                                  .flag_rounded,
                                              color:
                                              Colors
                                                  .white,
                                              size:
                                              18,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),

                                  //--------------------------------------------------
                                  // CITIZEN MARKER
                                  //--------------------------------------------------

                                  if (_citizenLocation !=
                                      null)
                                    MarkerLayer(
                                      markers:
                                      [
                                        Marker(
                                          point:
                                          _citizenLocation!,
                                          width:
                                          50,
                                          height:
                                          50,
                                          alignment:
                                          Alignment
                                              .center,
                                          child:
                                          Column(
                                            mainAxisSize:
                                            MainAxisSize
                                                .min,
                                            children: [
                                              AnimatedBuilder(
                                                animation:
                                                _pulseAnimation,
                                                builder:
                                                    (
                                                    context,
                                                    child,
                                                    ) {
                                                  return Stack(
                                                    alignment:
                                                    Alignment
                                                        .center,
                                                    children: [
                                                      Transform
                                                          .scale(
                                                        scale:
                                                        _pulseAnimation.value,
                                                        child:
                                                        Container(
                                                          width:
                                                          22,
                                                          height:
                                                          22,
                                                          decoration:
                                                          BoxDecoration(
                                                            shape:
                                                            BoxShape
                                                                .circle,
                                                            color:
                                                            const Color(
                                                              0xFF2196F3,
                                                            ).withValues(
                                                              alpha:
                                                              .25,
                                                            ),
                                                          ),
                                                        ),
                                                      ),
                                                      Container(
                                                        width:
                                                        14,
                                                        height:
                                                        14,
                                                        decoration:
                                                        BoxDecoration(
                                                          shape:
                                                          BoxShape
                                                              .circle,
                                                          color:
                                                          const Color(
                                                            0xFF2196F3,
                                                          ),
                                                          border:
                                                          Border.all(
                                                            color:
                                                            Colors
                                                                .white,
                                                            width:
                                                            2.0,
                                                          ),
                                                          boxShadow: [
                                                            BoxShadow(
                                                              color:
                                                              const Color(
                                                                0xFF2196F3,
                                                              ).withValues(
                                                                alpha:
                                                                .40,
                                                              ),
                                                              blurRadius:
                                                              6,
                                                              spreadRadius:
                                                              1,
                                                            ),
                                                          ],
                                                        ),
                                                      ),
                                                    ],
                                                  );
                                                },
                                              ),

                                              const SizedBox(
                                                height:
                                                2,
                                              ),

                                              Container(
                                                padding:
                                                const EdgeInsets
                                                    .symmetric(
                                                  horizontal:
                                                  5,
                                                  vertical:
                                                  1,
                                                ),
                                                decoration:
                                                BoxDecoration(
                                                  color:
                                                  Colors
                                                      .white,
                                                  borderRadius:
                                                  BorderRadius
                                                      .circular(
                                                    8,
                                                  ),
                                                  boxShadow: [
                                                    BoxShadow(
                                                      color:
                                                      Colors
                                                          .black
                                                          .withValues(
                                                        alpha:
                                                        .25,
                                                      ),
                                                      blurRadius:
                                                      3,
                                                      offset:
                                                      const Offset(
                                                        0,
                                                        1,
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                                child:
                                                Text(
                                                  "You",
                                                  style:
                                                  GoogleFonts
                                                      .plusJakartaSans(
                                                    color:
                                                    const Color(
                                                      0xFF2196F3,
                                                    ),
                                                    fontWeight:
                                                    FontWeight
                                                        .w800,
                                                    fontSize:
                                                    8.5,
                                                  ),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),

                                  //--------------------------------------------------
                                  // ALL LIVE VEHICLE MARKERS
                                  //--------------------------------------------------

                                  if (_liveVehicles.any(
                                        (
                                        vehicle,
                                        ) =>
                                    vehicle.latitude !=
                                        null &&
                                        vehicle.longitude !=
                                            null,
                                  ))
                                    MarkerLayer(
                                      markers:
                                      _liveVehicles
                                          .where(
                                            (
                                            vehicle,
                                            ) =>
                                        vehicle.latitude !=
                                            null &&
                                            vehicle.longitude !=
                                                null,
                                      )
                                          .map(
                                            (
                                            vehicle,
                                            ) {
                                          final position =
                                          _vehicleDisplayPositions[
                                          vehicle.vehicleId];

                                          if (position ==
                                              null) {
                                            return null;
                                          }

                                          final isActive =
                                              vehicle.status ==
                                                  "ACTIVE";

                                          return Marker(
                                            point:
                                            position,
                                            width:
                                            80,
                                            height:
                                            80,
                                            alignment:
                                            Alignment
                                                .center,
                                            child:
                                            GestureDetector(
                                              onTap:
                                                  () {
                                                _showSelectedVehicleDetails(
                                                  vehicle,
                                                );
                                              },
                                              child:
                                              AnimatedBuilder(
                                                animation:
                                                _pulseAnimation,
                                                builder:
                                                    (
                                                    context,
                                                    child,
                                                    ) {
                                                  return Stack(
                                                    alignment:
                                                    Alignment
                                                        .center,
                                                    children: [
                                                      Transform
                                                          .scale(
                                                        scale:
                                                        _pulseAnimation.value,
                                                        child:
                                                        Container(
                                                          width:
                                                          48,
                                                          height:
                                                          48,
                                                          decoration:
                                                          BoxDecoration(
                                                            shape:
                                                            BoxShape
                                                                .circle,
                                                            color:
                                                            isActive
                                                                ? const Color(
                                                              0xFFC084FC,
                                                            ).withValues(
                                                              alpha:
                                                              .18,
                                                            )
                                                                : Colors
                                                                .grey
                                                                .withValues(
                                                              alpha:
                                                              .15,
                                                            ),
                                                          ),
                                                        ),
                                                      ),

                                                      Container(
                                                        width:
                                                        44,
                                                        height:
                                                        44,
                                                        decoration:
                                                        BoxDecoration(
                                                          shape:
                                                          BoxShape
                                                              .circle,
                                                          gradient:
                                                          LinearGradient(
                                                            colors:
                                                            isActive
                                                                ? const [
                                                              Color(
                                                                0xFFC084FC,
                                                              ),
                                                              Color(
                                                                0xFFA855F7,
                                                              ),
                                                            ]
                                                                : const [
                                                              Colors
                                                                  .grey,
                                                              Colors
                                                                  .blueGrey,
                                                            ],
                                                            begin:
                                                            Alignment
                                                                .topLeft,
                                                            end:
                                                            Alignment
                                                                .bottomRight,
                                                          ),
                                                          border:
                                                          Border.all(
                                                            color:
                                                            Colors
                                                                .white,
                                                            width:
                                                            2.5,
                                                          ),
                                                          boxShadow: [
                                                            BoxShadow(
                                                              color:
                                                              Colors
                                                                  .black
                                                                  .withValues(
                                                                alpha:
                                                                .25,
                                                              ),
                                                              blurRadius:
                                                              8,
                                                            ),
                                                          ],
                                                        ),
                                                        child:
                                                        const Icon(
                                                          Icons
                                                              .local_shipping_rounded,
                                                          color:
                                                          Colors
                                                              .white,
                                                          size:
                                                          22,
                                                        ),
                                                      ),

                                                      if (!isActive)
                                                        Positioned(
                                                          bottom:
                                                          12,
                                                          right:
                                                          10,
                                                          child:
                                                          Container(
                                                            width:
                                                            10,
                                                            height:
                                                            10,
                                                            decoration:
                                                            BoxDecoration(
                                                              shape:
                                                              BoxShape
                                                                  .circle,
                                                              color:
                                                              Colors
                                                                  .orange,
                                                              border:
                                                              Border.all(
                                                                color:
                                                                Colors
                                                                    .white,
                                                                width:
                                                                1,
                                                              ),
                                                            ),
                                                          ),
                                                        ),
                                                    ],
                                                  );
                                                },
                                              ),
                                            ),
                                          );
                                        },
                                      )
                                          .whereType<
                                          Marker>()
                                          .toList(),
                                    ),
                                ],
                              ),

                              //--------------------------------------------------
                              // DISTANCE & ETA
                              //--------------------------------------------------

                              if (_nearestVehicle !=
                                  null)
                                Positioned(
                                  top:
                                  10,
                                  left:
                                  10,
                                  child:
                                  Container(
                                    padding:
                                    const EdgeInsets
                                        .symmetric(
                                      horizontal:
                                      10,
                                      vertical:
                                      6,
                                    ),
                                    decoration:
                                    BoxDecoration(
                                      color:
                                      const Color(
                                        0xFF260548,
                                      ).withValues(
                                        alpha:
                                        .85,
                                      ),
                                      borderRadius:
                                      BorderRadius
                                          .circular(
                                        16,
                                      ),
                                      border:
                                      Border.all(
                                        color:
                                        const Color(
                                          0xFFC084FC,
                                        ).withValues(
                                          alpha:
                                          .30,
                                        ),
                                        width:
                                        1.0,
                                      ),
                                      boxShadow: [
                                        BoxShadow(
                                          color:
                                          Colors
                                              .black
                                              .withValues(
                                            alpha:
                                            .30,
                                          ),
                                          blurRadius:
                                          8,
                                        ),
                                      ],
                                    ),
                                    child:
                                    Row(
                                      mainAxisSize:
                                      MainAxisSize
                                          .min,
                                      children: [
                                        const Icon(
                                          Icons
                                              .navigation_rounded,
                                          color:
                                          Color(
                                            0xFFC084FC,
                                          ),
                                          size:
                                          13,
                                        ),
                                        const SizedBox(
                                          width:
                                          5,
                                        ),
                                        Text(
                                          _distanceToCitizenMeters <
                                              1000
                                              ? "${_distanceToCitizenMeters.toInt()} m away"
                                              : "${(_distanceToCitizenMeters / 1000).toStringAsFixed(1)} km away",
                                          style:
                                          GoogleFonts
                                              .plusJakartaSans(
                                            color:
                                            Colors
                                                .white,
                                            fontWeight:
                                            FontWeight
                                                .bold,
                                            fontSize:
                                            11,
                                          ),
                                        ),
                                        Text(
                                          " • ",
                                          style:
                                          GoogleFonts
                                              .plusJakartaSans(
                                            color:
                                            Colors
                                                .white54,
                                            fontSize:
                                            11,
                                          ),
                                        ),
                                        Text(
                                          "ETA ~$_etaMinutes mins",
                                          style:
                                          GoogleFonts
                                              .plusJakartaSans(
                                            color:
                                            const Color(
                                              0xFFC084FC,
                                            ),
                                            fontWeight:
                                            FontWeight
                                                .bold,
                                            fontSize:
                                            11,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),

                              //--------------------------------------------------
                              // MAP CONTROLS
                              //--------------------------------------------------

                              Positioned(
                                top:
                                10,
                                right:
                                10,
                                child:
                                Column(
                                  children: [
                                    _buildMapControlButton(
                                      icon:
                                      Icons
                                          .add_rounded,
                                      onTap:
                                      _zoomIn,
                                    ),
                                    const SizedBox(
                                      height:
                                      6,
                                    ),
                                    _buildMapControlButton(
                                      icon:
                                      Icons
                                          .remove_rounded,
                                      onTap:
                                      _zoomOut,
                                    ),
                                    const SizedBox(
                                      height:
                                      6,
                                    ),
                                    _buildMapControlButton(
                                      icon:
                                      Icons
                                          .my_location_rounded,
                                      onTap:
                                      _recenterMap,
                                    ),
                                  ],
                                ),
                              ),

                              //--------------------------------------------------
                              // FOLLOW VEHICLE
                              //--------------------------------------------------

                              if (!_isFollowingVehicle)
                                Positioned(
                                  bottom:
                                  12,
                                  left:
                                  12,
                                  child:
                                  GestureDetector(
                                    onTap:
                                    _recenterMap,
                                    child:
                                    Container(
                                      padding:
                                      const EdgeInsets
                                          .symmetric(
                                        horizontal:
                                        12,
                                        vertical:
                                        6,
                                      ),
                                      decoration:
                                      BoxDecoration(
                                        gradient:
                                        const LinearGradient(
                                          colors: [
                                            Color(
                                              0xFFC084FC,
                                            ),
                                            Color(
                                              0xFFA855F7,
                                            ),
                                          ],
                                        ),
                                        borderRadius:
                                        BorderRadius
                                            .circular(
                                          20,
                                        ),
                                        border:
                                        Border.all(
                                          color:
                                          Colors
                                              .white
                                              .withValues(
                                            alpha:
                                            .30,
                                          ),
                                          width:
                                          .8,
                                        ),
                                        boxShadow: [
                                          BoxShadow(
                                            color:
                                            const Color(
                                              0xFFA855F7,
                                            ).withValues(
                                              alpha:
                                              .40,
                                            ),
                                            blurRadius:
                                            10,
                                            offset:
                                            const Offset(
                                              0,
                                              3,
                                            ),
                                          ),
                                        ],
                                      ),
                                      child:
                                      Row(
                                        mainAxisSize:
                                        MainAxisSize
                                            .min,
                                        children: [
                                          const Icon(
                                            Icons
                                                .center_focus_strong_rounded,
                                            color:
                                            Colors
                                                .white,
                                            size:
                                            14,
                                          ),
                                          const SizedBox(
                                            width:
                                            5,
                                          ),
                                          Text(
                                            "Follow Vehicle",
                                            style:
                                            GoogleFonts
                                                .plusJakartaSans(
                                              color:
                                              Colors
                                                  .white,
                                              fontWeight:
                                              FontWeight
                                                  .bold,
                                              fontSize:
                                              11,
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
      color:
      Colors.transparent,
      child:
      InkWell(
        onTap:
        onTap,
        borderRadius:
        BorderRadius.circular(
          12,
        ),
        child:
        Container(
          width:
          36,
          height:
          36,
          decoration:
          BoxDecoration(
            color:
            const Color(
              0xFF260548,
            ).withValues(
              alpha:
              .80,
            ),
            borderRadius:
            BorderRadius.circular(
              12,
            ),
            border:
            Border.all(
              color:
              Colors
                  .white
                  .withValues(
                alpha:
                .18,
              ),
            ),
            boxShadow: [
              BoxShadow(
                color:
                Colors
                    .black
                    .withValues(
                  alpha:
                  .30,
                ),
                blurRadius:
                6,
                offset:
                const Offset(
                  0,
                  2,
                ),
              ),
            ],
          ),
          child:
          Icon(
            icon,
            color:
            Colors.white,
            size:
            18,
          ),
        ),
      ),
    );
  }

  //==========================================================
  // SELECTED VEHICLE DETAILS
  //==========================================================

  void _showSelectedVehicleDetails(
      LiveVehicle vehicle,
      ) {
    showModalBottomSheet(
      context: context,
      backgroundColor:
      Colors.transparent,
      isScrollControlled:
      true,
      builder:
          (_) {
        return _buildLiveVehicleBottomSheet(
          vehicle,
        );
      },
    );
  }

  //==========================================================
  // VEHICLE DETAILS BOTTOM SHEET
  //==========================================================

  Widget _buildVehicleBottomSheet() {
    return _buildLiveVehicleBottomSheet(
      _nearestVehicle!,
    );
  }

  Widget _buildLiveVehicleBottomSheet(
      LiveVehicle vehicle,
      ) {
    final isActive =
        vehicle.status ==
            "ACTIVE";

    final latitude =
        vehicle.latitude;

    final longitude =
        vehicle.longitude;

    final distance =
        vehicle.distance;

    return Container(
      padding:
      const EdgeInsets.only(
        left: 20,
        right: 20,
        top: 16,
        bottom: 24,
      ),
      decoration:
      BoxDecoration(
        color:
        const Color(
          0xFF260548,
        ).withValues(
          alpha:
          .96,
        ),
        borderRadius:
        const BorderRadius.only(
          topLeft:
          Radius.circular(
            28,
          ),
          topRight:
          Radius.circular(
            28,
          ),
        ),
        border:
        Border.all(
          color:
          Colors
              .white
              .withValues(
            alpha:
            .18,
          ),
          width:
          1.2,
        ),
        boxShadow: [
          BoxShadow(
            color:
            Colors
                .black
                .withValues(
              alpha:
              .50,
            ),
            blurRadius:
            28,
            spreadRadius:
            4,
          ),
        ],
      ),
      child:
      Column(
        mainAxisSize:
        MainAxisSize.min,
        crossAxisAlignment:
        CrossAxisAlignment.start,
        children: [
          Center(
            child:
            Container(
              width:
              44,
              height:
              5,
              decoration:
              BoxDecoration(
                color:
                Colors
                    .white
                    .withValues(
                  alpha:
                  .35,
                ),
                borderRadius:
                BorderRadius
                    .circular(
                  50,
                ),
              ),
            ),
          ),

          const SizedBox(
            height:
            18,
          ),

          Row(
            children: [
              Container(
                width:
                48,
                height:
                48,
                decoration:
                BoxDecoration(
                  shape:
                  BoxShape
                      .circle,
                  color:
                  const Color(
                    0xFFC084FC,
                  ).withValues(
                    alpha:
                    .20,
                  ),
                  border:
                  Border.all(
                    color:
                    const Color(
                      0xFFC084FC,
                    ).withValues(
                      alpha:
                      .35,
                    ),
                  ),
                ),
                child:
                const Icon(
                  Icons
                      .local_shipping_rounded,
                  color:
                  Color(
                    0xFFC084FC,
                  ),
                  size:
                  24,
                ),
              ),

              const SizedBox(
                width:
                12,
              ),

              Expanded(
                child:
                Column(
                  crossAxisAlignment:
                  CrossAxisAlignment
                      .start,
                  children: [
                    Text(
                      vehicle
                          .vehicleId,
                      style:
                      GoogleFonts
                          .plusJakartaSans(
                        color:
                        Colors
                            .white,
                        fontWeight:
                        FontWeight
                            .bold,
                        fontSize:
                        18,
                      ),
                    ),

                    const SizedBox(
                      height:
                      2,
                    ),

                    Row(
                      children: [
                        Container(
                          width:
                          8,
                          height:
                          8,
                          decoration:
                          BoxDecoration(
                            shape:
                            BoxShape
                                .circle,
                            color:
                            isActive
                                ? const Color(
                              0xFF4CAF50,
                            )
                                : Colors
                                .orange,
                          ),
                        ),
                        const SizedBox(
                          width:
                          5,
                        ),
                        Text(
                          isActive
                              ? "ACTIVE"
                              : "INACTIVE",
                          style:
                          GoogleFonts
                              .plusJakartaSans(
                            color:
                            isActive
                                ? const Color(
                              0xFF4CAF50,
                            )
                                : Colors
                                .orange,
                            fontWeight:
                            FontWeight
                                .bold,
                            fontSize:
                            11,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(
            height:
            18,
          ),

          _buildInfoTile(
            "Latitude",
            latitude == null
                ? "Unavailable"
                : latitude
                .toStringAsFixed(
              6,
            ),
            Icons
                .place_rounded,
          ),

          _buildInfoTile(
            "Longitude",
            longitude == null
                ? "Unavailable"
                : longitude
                .toStringAsFixed(
              6,
            ),
            Icons
                .explore_rounded,
          ),

          _buildInfoTile(
            "Distance to You",
            distance == null
                ? "Unavailable"
                : distance <
                1
                ? "${(distance * 1000).toInt()} m"
                : "${distance.toStringAsFixed(2)} km",
            Icons
                .near_me_rounded,
          ),

          _buildInfoTile(
            "Last Updated",
            vehicle.lastUpdated ==
                null
                ? "Unavailable"
                : vehicle
                .lastUpdated!
                .toLocal()
                .toString()
                .split(
              '.',
            )
                .first,
            Icons
                .access_time_rounded,
          ),

          _buildInfoTile(
            "Distance Unit",
            vehicle
                .distanceUnit,
            Icons
                .straighten_rounded,
          ),

          const SizedBox(
            height:
            6,
          ),
        ],
      ),
    );
  }

  //==========================================================
  // INFO TILE
  //==========================================================

  Widget _buildInfoTile(
      String title,
      String value,
      IconData icon,
      ) {
    return Container(
      margin:
      const EdgeInsets.only(
        bottom:
        10,
      ),
      padding:
      const EdgeInsets
          .symmetric(
        horizontal:
        12,
        vertical:
        10,
      ),
      decoration:
      BoxDecoration(
        color:
        Colors
            .white
            .withValues(
          alpha:
          .06,
        ),
        borderRadius:
        BorderRadius.circular(
          14,
        ),
        border:
        Border.all(
          color:
          Colors
              .white
              .withValues(
            alpha:
            .10,
          ),
        ),
      ),
      child:
      Row(
        children: [
          Container(
            width:
            34,
            height:
            38,
            decoration:
            BoxDecoration(
              color:
              const Color(
                0xFFC084FC,
              ).withValues(
                alpha:
                .15,
              ),
              borderRadius:
              BorderRadius.circular(
                10,
              ),
            ),
            child:
            Icon(
              icon,
              color:
              const Color(
                0xFFC084FC,
              ),
              size:
              18,
            ),
          ),

          const SizedBox(
            width:
            12,
          ),

          Expanded(
            child:
            Column(
              crossAxisAlignment:
              CrossAxisAlignment
                  .start,
              children: [
                Text(
                  title,
                  style:
                  GoogleFonts
                      .plusJakartaSans(
                    color:
                    Colors
                        .white
                        .withValues(
                      alpha:
                      .55,
                    ),
                    fontSize:
                    10.5,
                    fontWeight:
                    FontWeight
                        .w500,
                  ),
                ),

                const SizedBox(
                  height:
                  2,
                ),

                Text(
                  value,
                  style:
                  GoogleFonts
                      .plusJakartaSans(
                    color:
                    Colors
                        .white,
                    fontWeight:
                    FontWeight
                        .w700,
                    fontSize:
                    12.5,
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