import 'dart:async';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_map/flutter_map.dart';
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
      theme: ThemeData(brightness: Brightness.dark, useMaterial3: true),
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
  // VEHICLE STATE
  //==========================================================

  VehicleLocation? _vehicle;

  LatLng? _currentPosition;

  LatLng? _previousPosition;

  LatLng? _targetPosition;

  List<LatLng> _routeCoordinates = [];

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

    await _loadInitialVehicle();

    _startPolling();
  }

  //==========================================================
  // LOAD INITIAL VEHICLE
  //==========================================================

  Future<void> _loadInitialVehicle() async {
    try {
      final vehicles = await _trackingService.getLiveVehicles();

      final vehicle = vehicles.first;

      _vehicle = vehicle;

      _currentPosition = vehicle.currentPosition;

      _previousPosition = vehicle.currentPosition;

      _targetPosition = vehicle.currentPosition;

      SchedulerBinding.instance.addPostFrameCallback((_) {
        if (_currentPosition != null) {
          _mapController.move(_currentPosition!, _defaultZoom);
        }
      });

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
      final vehicles = await _trackingService.getLiveVehicles();

      if (vehicles.isEmpty) {
        return;
      }

      final latestVehicle = vehicles.first;
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
    if (_currentPosition == null) {
      return const Scaffold(
        backgroundColor: Color(0xFF260548),
        body: Center(child: CircularProgressIndicator()),
      );
    }
    return Scaffold(
      backgroundColor: const Color(0xFF260548),

      body: Container(
        width: double.infinity,

        height: double.infinity,

        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,

            end: Alignment.bottomCenter,

            colors: [Color(0xFF260548), Color(0xFF3A0B67), Color(0xFF531288)],
          ),
        ),

        child: SafeArea(
          child: FadeTransition(
            opacity: _fadeAnimation,

            child: SlideTransition(
              position: _slideAnimation,

              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 18,

                  vertical: 18,
                ),

                child: Column(
                  children: [
                    //------------------------------------------------------
                    // HEADER
                    //------------------------------------------------------
                    ClipRRect(
                      borderRadius: BorderRadius.circular(24),

                      child: BackdropFilter(
                        filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),

                        child: Container(
                          padding: const EdgeInsets.all(18),

                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(.08),

                            borderRadius: BorderRadius.circular(24),

                            border: Border.all(
                              color: Colors.white.withOpacity(.08),
                            ),
                          ),

                          child: Row(
                            children: [
                              Container(
                                width: 58,

                                height: 58,

                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,

                                  color: const Color(
                                    0xFF8B5CF6,
                                  ).withOpacity(.20),
                                ),

                                child: const Icon(
                                  Icons.local_shipping,

                                  color: Colors.white,

                                  size: 30,
                                ),
                              ),

                              const SizedBox(width: 16),

                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,

                                  children: [
                                    Text(
                                      "Live Vehicle Tracking",

                                      style: GoogleFonts.poppins(
                                        color: Colors.white,

                                        fontWeight: FontWeight.w700,

                                        fontSize: 20,
                                      ),
                                    ),

                                    const SizedBox(height: 4),

                                    Text(
                                      _vehicle?.vehicleId ?? "Loading...",

                                      style: GoogleFonts.poppins(
                                        color: Colors.white70,

                                        fontSize: 13,
                                      ),
                                    ),
                                  ],
                                ),
                              ),

                              GestureDetector(
                                onTap: _showVehicleDetails,

                                child: Container(
                                  width: 50,

                                  height: 50,

                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(18),

                                    color: Colors.white.withOpacity(.08),
                                  ),

                                  child: const Icon(
                                    Icons.info_outline,

                                    color: Colors.white,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 18),

                    //------------------------------------------------------
                    // MAP SECTION
                    //------------------------------------------------------
                    Expanded(
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(28),

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

                                //==================================================
                                // ROUTE POLYLINE
                                //==================================================
                                if (_routeCoordinates.isNotEmpty)
                                  PolylineLayer(
                                    polylines: [
                                      Polyline(
                                        points: _routeCoordinates,

                                        strokeWidth: 4,

                                        color: const Color(0xFF8B5CF6),

                                        borderStrokeWidth: 0,

                                        borderColor: Colors.white24,
                                      ),
                                    ],
                                  ),

                                //==================================================
                                // START MARKER
                                //==================================================
                                if (_vehicle != null)
                                  MarkerLayer(
                                    markers: [
                                      Marker(
                                        point: _vehicle!.initialPoint
                                            .toLatLng(),

                                        width: 32,

                                        height: 32,

                                        child: const Icon(
                                          Icons.flag,

                                          color: Colors.green,

                                          size: 28,
                                        ),
                                      ),
                                    ],
                                  ),

                                //==================================================
                                // TARGET MARKER
                                //==================================================
                                if (_targetPosition != null)
                                  MarkerLayer(
                                    markers: [
                                      Marker(
                                        point: _targetPosition!,

                                        width: 34,

                                        height: 34,

                                        child: const Icon(
                                          Icons.location_on,

                                          color: Colors.red,

                                          size: 32,
                                        ),
                                      ),
                                    ],
                                  ),

                                //==================================================
                                // LIVE VEHICLE
                                //==================================================
                                if (_currentPosition != null)
                                  MarkerLayer(
                                    markers: [
                                      Marker(
                                        point: _currentPosition!,

                                        width: 90,

                                        height: 90,

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
                                                    width: 58,

                                                    height: 58,

                                                    decoration: BoxDecoration(
                                                      shape: BoxShape.circle,

                                                      color: const Color(
                                                        0xFF8B5CF6,
                                                      ).withOpacity(.18),
                                                    ),
                                                  ),
                                                ),

                                                Container(
                                                  width: 52,

                                                  height: 52,

                                                  decoration: BoxDecoration(
                                                    shape: BoxShape.circle,

                                                    color: const Color(
                                                      0xFF8B5CF6,
                                                    ),

                                                    border: Border.all(
                                                      color: Colors.white,

                                                      width: 3,
                                                    ),

                                                    boxShadow: [
                                                      BoxShadow(
                                                        color: const Color(
                                                          0xFF8B5CF6,
                                                        ).withOpacity(.45),

                                                        blurRadius: 18,

                                                        spreadRadius: 3,
                                                      ),
                                                    ],
                                                  ),

                                                  child: const Icon(
                                                    Icons.local_shipping,

                                                    color: Colors.white,

                                                    size: 28,
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

                            //==================================================
                            // FLOATING MAP CONTROLS
                            //==================================================
                            Positioned(
                              top: 18,

                              right: 18,

                              child: Column(
                                children: [
                                  _buildMapControlButton(
                                    icon: Icons.add,

                                    onTap: _zoomIn,
                                  ),

                                  const SizedBox(height: 12),

                                  _buildMapControlButton(
                                    icon: Icons.remove,

                                    onTap: _zoomOut,
                                  ),

                                  const SizedBox(height: 12),

                                  _buildMapControlButton(
                                    icon: Icons.my_location,

                                    onTap: _recenterMap,
                                  ),
                                ],
                              ),
                            ),

                            //==================================================
                            // FOLLOW VEHICLE INDICATOR
                            //==================================================
                            if (!_isFollowingVehicle)
                              Positioned(
                                top: 18,

                                left: 18,

                                child: GestureDetector(
                                  onTap: _recenterMap,

                                  child: Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 16,

                                      vertical: 10,
                                    ),

                                    decoration: BoxDecoration(
                                      color: const Color(0xFF8B5CF6),

                                      borderRadius: BorderRadius.circular(30),

                                      boxShadow: [
                                        BoxShadow(
                                          color: const Color(
                                            0xFF8B5CF6,
                                          ).withOpacity(.35),

                                          blurRadius: 18,
                                        ),
                                      ],
                                    ),

                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,

                                      children: const [
                                        Icon(
                                          Icons.navigation,

                                          color: Colors.white,

                                          size: 18,
                                        ),

                                        SizedBox(width: 8),

                                        Text(
                                          "Follow Vehicle",

                                          style: TextStyle(
                                            color: Colors.white,

                                            fontWeight: FontWeight.bold,
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

                    const SizedBox(height: 18),

                    //==================================================
                    // LIVE STATUS CARD
                    //==================================================
                    ClipRRect(
                      borderRadius: BorderRadius.circular(24),

                      child: BackdropFilter(
                        filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),

                        child: Container(
                          padding: const EdgeInsets.all(18),

                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(.08),

                            borderRadius: BorderRadius.circular(24),

                            border: Border.all(
                              color: Colors.white.withOpacity(.08),
                            ),
                          ),

                          child: Row(
                            children: [
                              Container(
                                width: 56,

                                height: 56,

                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,

                                  color: const Color(
                                    0xFF8B5CF6,
                                  ).withOpacity(.18),
                                ),

                                child: const Icon(
                                  Icons.local_shipping,

                                  color: Colors.white,
                                ),
                              ),

                              const SizedBox(width: 16),

                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,

                                  children: [
                                    Text(
                                      _vehicle?.vehicleId ?? "--",

                                      style: GoogleFonts.poppins(
                                        color: Colors.white,

                                        fontSize: 18,

                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),

                                    const SizedBox(height: 4),

                                    Text(
                                      "Last Updated",

                                      style: GoogleFonts.poppins(
                                        color: Colors.white60,

                                        fontSize: 12,
                                      ),
                                    ),

                                    const SizedBox(height: 2),

                                    Text(
                                      _vehicle == null
                                          ? "--"
                                          : _vehicle!.updatedAt
                                                .toLocal()
                                                .toString(),

                                      style: GoogleFonts.poppins(
                                        color: Colors.white,

                                        fontSize: 12,
                                      ),
                                    ),
                                  ],
                                ),
                              ),

                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 16,

                                  vertical: 8,
                                ),

                                decoration: BoxDecoration(
                                  color: Colors.green.withOpacity(.18),

                                  borderRadius: BorderRadius.circular(24),
                                ),

                                child: Row(
                                  mainAxisSize: MainAxisSize.min,

                                  children: const [
                                    Icon(
                                      Icons.circle,

                                      color: Colors.greenAccent,

                                      size: 10,
                                    ),

                                    SizedBox(width: 8),

                                    Text(
                                      "LIVE",

                                      style: TextStyle(
                                        color: Colors.white,

                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 20),
                    const SizedBox(height: 18),
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

        borderRadius: BorderRadius.circular(18),

        child: Ink(
          width: 54,

          height: 54,

          decoration: BoxDecoration(
            color: Colors.white.withOpacity(.10),

            borderRadius: BorderRadius.circular(18),

            border: Border.all(color: Colors.white.withOpacity(.08)),
          ),

          child: Icon(icon, color: Colors.white, size: 24),
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
      padding: const EdgeInsets.only(left: 24, right: 24, top: 24, bottom: 34),

      decoration: const BoxDecoration(
        color: Color(0xFF2A064D),

        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(32),

          topRight: Radius.circular(32),
        ),
      ),

      child: Column(
        mainAxisSize: MainAxisSize.min,

        crossAxisAlignment: CrossAxisAlignment.start,

        children: [
          Center(
            child: Container(
              width: 60,

              height: 6,

              decoration: BoxDecoration(
                color: Colors.white24,

                borderRadius: BorderRadius.circular(50),
              ),
            ),
          ),

          const SizedBox(height: 24),

          Row(
            children: [
              Container(
                width: 64,

                height: 64,

                decoration: BoxDecoration(
                  shape: BoxShape.circle,

                  color: const Color(0xFF8B5CF6).withOpacity(.20),
                ),

                child: const Icon(
                  Icons.local_shipping,

                  color: Colors.white,

                  size: 34,
                ),
              ),

              const SizedBox(width: 18),

              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,

                  children: [
                    Text(
                      vehicle.vehicleId,

                      style: GoogleFonts.poppins(
                        color: Colors.white,

                        fontWeight: FontWeight.bold,

                        fontSize: 22,
                      ),
                    ),

                    const SizedBox(height: 4),

                    Text(
                      "Live GPS Vehicle",

                      style: GoogleFonts.poppins(
                        color: Colors.white70,

                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 28),

          _buildInfoTile(
            "Latitude",

            vehicle.currentPosition.latitude.toStringAsFixed(6),

            Icons.place,
          ),

          _buildInfoTile(
            "Longitude",

            vehicle.currentPosition.longitude.toStringAsFixed(6),

            Icons.explore,
          ),

          _buildInfoTile(
            "Updated",

            vehicle.updatedAt.toLocal().toString(),

            Icons.access_time,
          ),

          const SizedBox(height: 12),
        ],
      ),
    );
  }

  //==========================================================
  // INFO TILE
  //==========================================================

  Widget _buildInfoTile(String title, String value, IconData icon) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 18),

      child: Row(
        children: [
          Container(
            width: 46,

            height: 46,

            decoration: BoxDecoration(
              color: Colors.white10,

              borderRadius: BorderRadius.circular(14),
            ),

            child: Icon(icon, color: Colors.white),
          ),

          const SizedBox(width: 16),

          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,

              children: [
                Text(
                  title,

                  style: GoogleFonts.poppins(
                    color: Colors.white60,

                    fontSize: 12,
                  ),
                ),

                const SizedBox(height: 2),

                Text(
                  value,

                  style: GoogleFonts.poppins(
                    color: Colors.white,

                    fontWeight: FontWeight.w600,

                    fontSize: 15,
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
