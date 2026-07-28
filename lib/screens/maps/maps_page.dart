import 'dart:async';
import 'dart:convert';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'package:latlong2/latlong.dart';
import 'package:permission_handler/permission_handler.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const WasteTrackingApp());
}

class WasteTrackingApp extends StatelessWidget {
  const WasteTrackingApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Vehicle Tracking',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        useMaterial3: true,
      ),
      home: const MapsPage(),
    );
  }
}

// ============================================================================
// LOCATION MODEL & SERVICE (PREPARED FOR FUTURE BACKEND INTEGRATION)
// ============================================================================

class VehicleLocation {
  final double latitude;
  final double longitude;

  const VehicleLocation({
    required this.latitude,
    required this.longitude,
  });

  LatLng toLatLng() => LatLng(latitude, longitude);

  factory VehicleLocation.fromJson(Map<String, dynamic> json) {
    return VehicleLocation(
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
    );
  }
}

class VehicleTrackingService {
  static const VehicleLocation dummyDestination = VehicleLocation(
    latitude: 12.9865,
    longitude: 77.6101,
  );

  Future<VehicleLocation> fetchCurrentVehicleLocation() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return const VehicleLocation(
      latitude: 12.9716,
      longitude: 77.5946,
    );
  }

  Future<List<LatLng>> fetchOSRMRoute(
      LatLng start, LatLng destination) async {
    final url = Uri.parse(
      'https://router.project-osrm.org/route/v1/driving/'
          '${start.longitude},${start.latitude};'
          '${destination.longitude},${destination.latitude}'
          '?overview=full&geometries=geojson',
    );

    try {
      final response = await http.get(url);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final List<dynamic> coordinates =
        data['routes'][0]['geometry']['coordinates'];

        return coordinates
            .map((coord) => LatLng(
          (coord[1] as num).toDouble(),
          (coord[0] as num).toDouble(),
        ))
            .toList();
      } else {
        debugPrint('OSRM Error: ${response.statusCode}');
        return [start, destination];
      }
    } catch (e) {
      debugPrint('Error fetching OSRM route: $e');
      return [start, destination];
    }
  }
}

// ============================================================================
// MAIN MAPS PAGE WIDGET
// ============================================================================

class MapsPage extends StatefulWidget {
  const MapsPage({Key? key}) : super(key: key);

  @override
  State<MapsPage> createState() => _MapsPageState();
}

class _MapsPageState extends State<MapsPage> with TickerProviderStateMixin {
  final MapController _mapController = MapController();
  final VehicleTrackingService _trackingService = VehicleTrackingService();

  double _currentZoom = 14.5;
  List<LatLng> _routeCoordinates = [];
  LatLng _currentVehiclePos = const LatLng(12.9716, 77.5946);
  bool _isLoadingRoute = true;

  // Space reserved to guarantee clear separation above bottom navigation
  static const double _bottomNavOffset = 96.0;

  // Animation controller for movement
  late final AnimationController _movementAnimController;
  Animation<LatLng>? _vehicleMovementAnimation;
  int _currentRouteIndex = 0;
  Timer? _routeTraversalTimer;

  // View Details Button Press State
  bool _isDetailsButtonPressed = false;

  // Entrance Animations
  late final AnimationController _animController;
  late final Animation<double> _fadeAnim;
  late final Animation<Offset> _slideAnim;

  @override
  void initState() {
    super.initState();
    _requestLocationPermission();

    _movementAnimController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    );

    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );

    _fadeAnim = CurvedAnimation(
      parent: _animController,
      curve: Curves.easeOut,
    );

    _slideAnim = Tween<Offset>(
      begin: const Offset(0, 0.06),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _animController,
      curve: Curves.easeOutCubic,
    ));

    _animController.forward();
    _initializeTrackingAndRoute();
  }

  @override
  void dispose() {
    _routeTraversalTimer?.cancel();
    _movementAnimController.dispose();
    _mapController.dispose();
    _animController.dispose();
    super.dispose();
  }

  Future<void> _requestLocationPermission() async {
    await Permission.location.request();
  }

  Future<void> _initializeTrackingAndRoute() async {
    setState(() {
      _isLoadingRoute = true;
    });

    final location = await _trackingService.fetchCurrentVehicleLocation();
    final startLatLng = location.toLatLng();

    final route = await _trackingService.fetchOSRMRoute(
      startLatLng,
      VehicleTrackingService.dummyDestination.toLatLng(),
    );

    if (!mounted) return;

    setState(() {
      _currentVehiclePos = startLatLng;
      _routeCoordinates = route;
      _isLoadingRoute = false;
    });

    _startSmoothVehicleMovement();
  }

  void _startSmoothVehicleMovement() {
    if (_routeCoordinates.length < 2) return;

    _routeTraversalTimer?.cancel();
    _currentRouteIndex = 0;

    _routeTraversalTimer =
        Timer.periodic(const Duration(milliseconds: 900), (timer) {
          if (!mounted) return;

          if (_currentRouteIndex < _routeCoordinates.length - 1) {
            final startPos = _routeCoordinates[_currentRouteIndex];
            final endPos = _routeCoordinates[_currentRouteIndex + 1];

            _animateBetweenPoints(startPos, endPos);
            _currentRouteIndex++;
          } else {
            _currentRouteIndex = 0;
          }
        });
  }

  void _animateBetweenPoints(LatLng from, LatLng to) {
    _vehicleMovementAnimation = Tween<LatLng>(
      begin: from,
      end: to,
    ).animate(CurvedAnimation(
      parent: _movementAnimController,
      curve: Curves.linear,
    ));

    _movementAnimController.reset();
    _movementAnimController.forward();

    _movementAnimController.addListener(() {
      if (_vehicleMovementAnimation != null && mounted) {
        setState(() {
          _currentVehiclePos = _vehicleMovementAnimation!.value;
        });
      }
    });
  }

  void _zoomIn() {
    setState(() {
      _currentZoom = (_currentZoom + 0.5).clamp(3.0, 18.0);
      _mapController.move(_currentVehiclePos, _currentZoom);
    });
  }

  void _zoomOut() {
    setState(() {
      _currentZoom = (_currentZoom - 0.5).clamp(3.0, 18.0);
      _mapController.move(_currentVehiclePos, _currentZoom);
    });
  }

  void _recenterMap() {
    _mapController.move(_currentVehiclePos, 15.0);
    setState(() {
      _currentZoom = 15.0;
    });
  }

  void _showVehicleDetailsSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      barrierColor: Colors.black.withValues(alpha: 0.6),
      builder: (context) => const VehicleDetailBottomSheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF260548),
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF260548),
              Color(0xFF3B0B68),
              Color(0xFF531288),
            ],
            stops: [0.0, 0.5, 1.0],
          ),
        ),
        child: SafeArea(
          child: FadeTransition(
            opacity: _fadeAnim,
            child: SlideTransition(
              position: _slideAnim,
              child: Padding(
                padding: const EdgeInsets.only(
                  left: 20.0,
                  right: 20.0,
                  top: 20.0,
                  bottom: 0.0,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header Section
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: Colors.white.withValues(alpha: 0.18),
                              width: 1,
                            ),
                          ),
                          child: const Icon(
                            Icons.map_rounded,
                            color: Color(0xFFC084FC),
                            size: 26,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            "Vehicle Tracking",
                            style: GoogleFonts.plusJakartaSans(
                              color: Colors.white,
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              letterSpacing: -0.5,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      "Track your waste collection vehicle in real time.",
                      style: GoogleFonts.plusJakartaSans(
                        color: Colors.white.withValues(alpha: 0.65),
                        fontSize: 14,
                        fontWeight: FontWeight.w400,
                        height: 1.3,
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Interactive OpenStreetMap Glass Container
                    Expanded(
                      child: Container(
                        margin: const EdgeInsets.only(bottom: _bottomNavOffset),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(24),
                          child: Container(
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(24),
                              border: Border.all(
                                color: Colors.white.withValues(alpha: 0.18),
                                width: 1,
                              ),
                            ),
                            child: Stack(
                              children: [
                                // FlutterMap Engine
                                FlutterMap(
                                  mapController: _mapController,
                                  options: MapOptions(
                                    initialCenter: _currentVehiclePos,
                                    initialZoom: 14.5,
                                    minZoom: 3.0,
                                    maxZoom: 18.0,
                                  ),
                                  children: [
                                    TileLayer(
                                      urlTemplate:
                                      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                                      userAgentPackageName:
                                      'com.sewac.citizen.app',
                                    ),

                                    // Dynamic Refined OSRM Polyline (5.5px, Rounded Caps & Joins)
                                    if (_routeCoordinates.isNotEmpty)
                                      PolylineLayer(
                                        polylines: [
                                          Polyline(
                                            points: _routeCoordinates,
                                            strokeWidth: 5.5,
                                            color: const Color(0xFFC084FC),
                                            borderStrokeWidth: 1.5,
                                            borderColor: const Color(0xFF3B0B68),
                                            strokeCap: StrokeCap.round,
                                            strokeJoin: StrokeJoin.round,
                                          ),
                                        ],
                                      ),

                                    // Custom Vehicle Marker with Pulsing Ring
                                    MarkerLayer(
                                      markers: [
                                        Marker(
                                          point: _currentVehiclePos,
                                          width: 50,
                                          height: 50,
                                          child: const AnimatedVehicleMarker(),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),

                                // Route Loading Indicator
                                if (_isLoadingRoute)
                                  Center(
                                    child: ClipRRect(
                                      borderRadius: BorderRadius.circular(16),
                                      child: BackdropFilter(
                                        filter: ImageFilter.blur(
                                            sigmaX: 10, sigmaY: 10),
                                        child: Container(
                                          padding: const EdgeInsets.all(16),
                                          decoration: BoxDecoration(
                                            color: const Color(0xFF260548)
                                                .withValues(alpha: 0.8),
                                            borderRadius:
                                            BorderRadius.circular(16),
                                          ),
                                          child: const CircularProgressIndicator(
                                            color: Color(0xFFC084FC),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),

                                // Refined Floating Top Glass Info Bar
                                Positioned(
                                  top: 14,
                                  left: 18,
                                  right: 18,
                                  child: ClipRRect(
                                    borderRadius: BorderRadius.circular(18),
                                    child: BackdropFilter(
                                      filter: ImageFilter.blur(
                                          sigmaX: 14, sigmaY: 14),
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(
                                          horizontal: 14,
                                          vertical: 7,
                                        ),
                                        decoration: BoxDecoration(
                                          color: const Color(0xFF260548)
                                              .withValues(alpha: 0.85),
                                          borderRadius: BorderRadius.circular(18),
                                          border: Border.all(
                                            color: Colors.white
                                                .withValues(alpha: 0.20),
                                            width: 1,
                                          ),
                                        ),
                                        child: Row(
                                          mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                          crossAxisAlignment:
                                          CrossAxisAlignment.center,
                                          children: [
                                            Expanded(
                                              child: Row(
                                                mainAxisSize: MainAxisSize.min,
                                                children: [
                                                  const Icon(
                                                    Icons.local_shipping_rounded,
                                                    color: Color(0xFFC084FC),
                                                    size: 18,
                                                  ),
                                                  const SizedBox(width: 6),
                                                  Flexible(
                                                    child: Text(
                                                      "KA-01-AB-1234",
                                                      overflow:
                                                      TextOverflow.ellipsis,
                                                      style:
                                                      GoogleFonts.plusJakartaSans(
                                                        color: Colors.white,
                                                        fontSize: 12.5,
                                                        fontWeight:
                                                        FontWeight.bold,
                                                      ),
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ),
                                            Row(
                                              mainAxisSize: MainAxisSize.min,
                                              children: [
                                                Container(
                                                  padding:
                                                  const EdgeInsets.symmetric(
                                                    horizontal: 6,
                                                    vertical: 3,
                                                  ),
                                                  decoration: BoxDecoration(
                                                    color: const Color(0xFF2E7D32)
                                                        .withValues(alpha: 0.22),
                                                    borderRadius:
                                                    BorderRadius.circular(8),
                                                    border: Border.all(
                                                      color:
                                                      const Color(0xFF2E7D32)
                                                          .withValues(
                                                          alpha: 0.45),
                                                    ),
                                                  ),
                                                  child: Text(
                                                    "🟢 Wet Waste",
                                                    style:
                                                    GoogleFonts.plusJakartaSans(
                                                      color: Colors.white,
                                                      fontSize: 9.5,
                                                      fontWeight: FontWeight.w700,
                                                    ),
                                                  ),
                                                ),
                                                const SizedBox(width: 5),
                                                const _BlinkingLiveBadge(),
                                              ],
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                  ),
                                ),

                                // Refined Compact Glass Map Controls
                                Positioned(
                                  right: 18,
                                  bottom: 74,
                                  child: Column(
                                    children: [
                                      _buildGlassIconButton(
                                        icon: Icons.add_rounded,
                                        onTap: _zoomIn,
                                      ),
                                      const SizedBox(height: 12),
                                      _buildGlassIconButton(
                                        icon: Icons.remove_rounded,
                                        onTap: _zoomOut,
                                      ),
                                      const SizedBox(height: 12),
                                      _buildGlassIconButton(
                                        icon: Icons.my_location_rounded,
                                        onTap: _recenterMap,
                                      ),
                                    ],
                                  ),
                                ),

                                // Prominent Gradient "View Details" Action Button
                                Positioned(
                                  left: 14,
                                  bottom: 14,
                                  child: AnimatedScale(
                                    scale: _isDetailsButtonPressed ? 0.95 : 1.0,
                                    duration: const Duration(milliseconds: 100),
                                    child: Listener(
                                      onPointerDown: (_) => setState(
                                              () => _isDetailsButtonPressed = true),
                                      onPointerUp: (_) => setState(
                                              () => _isDetailsButtonPressed = false),
                                      child: Material(
                                        color: Colors.transparent,
                                        child: InkWell(
                                          onTap: () =>
                                              _showVehicleDetailsSheet(context),
                                          borderRadius:
                                          BorderRadius.circular(20),
                                          child: Container(
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 14,
                                              vertical: 8,
                                            ),
                                            decoration: BoxDecoration(
                                              gradient: const LinearGradient(
                                                colors: [
                                                  Color(0xFFC084FC),
                                                  Color(0xFFA855F7),
                                                ],
                                                begin: Alignment.topLeft,
                                                end: Alignment.bottomRight,
                                              ),
                                              borderRadius:
                                              BorderRadius.circular(20),
                                              boxShadow: [
                                                BoxShadow(
                                                  color: const Color(0xFFA855F7)
                                                      .withValues(alpha: 0.45),
                                                  blurRadius: 12,
                                                  spreadRadius: 1,
                                                  offset: const Offset(0, 4),
                                                ),
                                              ],
                                              border: Border.all(
                                                color: Colors.white
                                                    .withValues(alpha: 0.35),
                                                width: 1.0,
                                              ),
                                            ),
                                            child: Row(
                                              mainAxisSize: MainAxisSize.min,
                                              children: [
                                                const Icon(
                                                  Icons.navigation_rounded,
                                                  color: Colors.white,
                                                  size: 17,
                                                ),
                                                const SizedBox(width: 6),
                                                Text(
                                                  "View Details",
                                                  style:
                                                  GoogleFonts.plusJakartaSans(
                                                    color: Colors.white,
                                                    fontSize: 13,
                                                    fontWeight: FontWeight.w800,
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
        ),
      ),
    );
  }

  Widget _buildGlassIconButton({
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(12),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: onTap,
            borderRadius: BorderRadius.circular(12),
            child: Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                color: const Color(0xFF260548).withValues(alpha: 0.82),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: Colors.white.withValues(alpha: 0.20),
                  width: 1,
                ),
              ),
              child: Icon(
                icon,
                color: Colors.white,
                size: 18,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

// ============================================================================
// BLINKING LIVE STATUS BADGE
// ============================================================================

class _BlinkingLiveBadge extends StatefulWidget {
  const _BlinkingLiveBadge({Key? key}) : super(key: key);

  @override
  State<_BlinkingLiveBadge> createState() => _BlinkingLiveBadgeState();
}

class _BlinkingLiveBadgeState extends State<_BlinkingLiveBadge>
    with SingleTickerProviderStateMixin {
  late AnimationController _blinkController;

  @override
  void initState() {
    super.initState();
    _blinkController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _blinkController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.only(left: 6, right: 8, top: 3, bottom: 3),
      decoration: BoxDecoration(
        color: Colors.black.withValues(alpha: 0.35),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.1),
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          FadeTransition(
            opacity: _blinkController,
            child: Container(
              width: 5,
              height: 5,
              decoration: const BoxDecoration(
                color: Color(0xFF4CAF50),
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: Color(0xFF4CAF50),
                    blurRadius: 3,
                    spreadRadius: 1,
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(width: 4),
          Text(
            "LIVE",
            style: GoogleFonts.plusJakartaSans(
              color: const Color(0xFF4CAF50),
              fontSize: 9.5,
              fontWeight: FontWeight.w800,
              letterSpacing: 0.4,
            ),
          ),
        ],
      ),
    );
  }
}

// ============================================================================
// VEHICLE MARKER WITH PULSING GLOW ANIMATION
// ============================================================================

class AnimatedVehicleMarker extends StatefulWidget {
  const AnimatedVehicleMarker({Key? key}) : super(key: key);

  @override
  State<AnimatedVehicleMarker> createState() => _AnimatedVehicleMarkerState();
}

class _AnimatedVehicleMarkerState extends State<AnimatedVehicleMarker>
    with SingleTickerProviderStateMixin {
  late AnimationController _pulseController;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1600),
    )..repeat();
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _pulseController,
      builder: (context, child) {
        final progress = _pulseController.value;
        return Stack(
          alignment: Alignment.center,
          children: [
            // Soft Pulsing Outer Glow Ring
            Container(
              width: 32 + (progress * 18),
              height: 32 + (progress * 18),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: const Color(0xFFC084FC)
                    .withValues(alpha: (1.0 - progress) * 0.45),
              ),
            ),
            // Primary Marker Core
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: const Color(0xFF3B0B68),
                shape: BoxShape.circle,
                border: Border.all(color: const Color(0xFFC084FC), width: 2.5),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFFA855F7).withValues(alpha: 0.65),
                    blurRadius: 10,
                    spreadRadius: 1.5,
                  ),
                ],
              ),
              child: const Center(
                child: Icon(
                  Icons.local_shipping_rounded,
                  color: Colors.white,
                  size: 22,
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}

// ============================================================================
// VEHICLE DETAILS BOTTOM SHEET
// ============================================================================

class VehicleDetailBottomSheet extends StatefulWidget {
  const VehicleDetailBottomSheet({Key? key}) : super(key: key);

  @override
  State<VehicleDetailBottomSheet> createState() =>
      _VehicleDetailBottomSheetState();
}

class _VehicleDetailBottomSheetState extends State<VehicleDetailBottomSheet>
    with SingleTickerProviderStateMixin {
  late final AnimationController _sheetAnimController;
  late final Animation<double> _sheetFadeAnim;
  late final Animation<Offset> _sheetSlideAnim;

  @override
  void initState() {
    super.initState();
    _sheetAnimController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );

    _sheetFadeAnim = CurvedAnimation(
      parent: _sheetAnimController,
      curve: Curves.easeOut,
    );

    _sheetSlideAnim = Tween<Offset>(
      begin: const Offset(0, 0.20),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _sheetAnimController,
      curve: Curves.easeOutCubic,
    ));

    _sheetAnimController.forward();
  }

  @override
  void dispose() {
    _sheetAnimController.dispose();
    super.dispose();
  }

  void _closeSheet() async {
    await _sheetAnimController.reverse();
    if (mounted) {
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _sheetFadeAnim,
      child: SlideTransition(
        position: _sheetSlideAnim,
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            decoration: BoxDecoration(
              color: const Color(0xFF260548).withValues(alpha: 0.92),
              borderRadius:
              const BorderRadius.vertical(top: Radius.circular(32)),
              border: Border.all(
                color: Colors.white.withValues(alpha: 0.18),
                width: 1.2,
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.5),
                  blurRadius: 30,
                  spreadRadius: 5,
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
                      color: Colors.white.withValues(alpha: 0.35),
                      borderRadius: BorderRadius.circular(2.5),
                    ),
                  ),
                ),
                const SizedBox(height: 14),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      "Vehicle Details",
                      style: GoogleFonts.plusJakartaSans(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: const Color(0xFF2E7D32).withValues(alpha: 0.22),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(
                          color:
                          const Color(0xFF2E7D32).withValues(alpha: 0.45),
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            width: 8,
                            height: 8,
                            decoration: const BoxDecoration(
                              color: Color(0xFF6EDC6E),
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 6),
                          Text(
                            "Wet Waste",
                            style: GoogleFonts.plusJakartaSans(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                _buildDetailCard(
                  icon: Icons.badge_rounded,
                  label: "Vehicle Reg. Number",
                  value: "KA-01-AB-1234",
                ),
                _buildDetailCard(
                  icon: Icons.person_rounded,
                  label: "Driver Name",
                  value: "Ramesh Kumar",
                ),
                _buildDetailCard(
                  icon: Icons.near_me_rounded,
                  label: "Current Area",
                  value: "Indiranagar 10th Main",
                ),
                _buildDetailCard(
                  icon: Icons.timer_rounded,
                  label: "Estimated Arrival",
                  value: "In 12 mins (11:57 AM)",
                ),
                _buildDetailCard(
                  icon: Icons.history_rounded,
                  label: "Last Updated",
                  value: "Just now (11:45 AM)",
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  height: 46,
                  child: TextButton(
                    onPressed: _closeSheet,
                    style: TextButton.styleFrom(
                      backgroundColor: const Color(0xFFC084FC),
                      elevation: 2,
                      shadowColor:
                      const Color(0xFFC084FC).withValues(alpha: 0.25),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(23),
                      ),
                    ),
                    child: Text(
                      "Close",
                      style: GoogleFonts.plusJakartaSans(
                        color: Colors.white,
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 6),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDetailCard({
    required IconData icon,
    required String label,
    required String value,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: Colors.white.withValues(alpha: 0.12),
          ),
        ),
        child: Row(
          children: [
            Icon(icon, color: const Color(0xFFC084FC), size: 18),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: GoogleFonts.plusJakartaSans(
                    color: Colors.white.withValues(alpha: 0.6),
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Text(
                  value,
                  style: GoogleFonts.plusJakartaSans(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}