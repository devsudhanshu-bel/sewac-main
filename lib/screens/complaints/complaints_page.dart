import 'dart:async';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';
import 'package:geocoding/geocoding.dart';
import 'package:geolocator/geolocator.dart';

import '../../models/complaint_model.dart';
import '../../services/complaint_service.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const SewacApp());
}

class SewacApp extends StatelessWidget {
  const SewacApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SEWAC Citizen App',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        useMaterial3: true,
      ),
      home: const ComplaintsPage(),
    );
  }
}

// ============================================================================
// MAIN COMPLAINTS PAGE
// ============================================================================

class ComplaintsPage extends StatefulWidget {
  const ComplaintsPage({super.key});

  @override
  State<ComplaintsPage> createState() => _ComplaintsPageState();
}

class _ComplaintsPageState extends State<ComplaintsPage>
    with TickerProviderStateMixin {

  Future<void> _recoverLostImage() async {
    try {
      final LostDataResponse response =
      await _picker.retrieveLostData();

      if (response.isEmpty) return;

      final List<XFile>? files = response.files;

      if (files != null && files.isNotEmpty) {
        if (!mounted) return;

        setState(() {
          _selectedPhoto = File(files.first.path);
        });

        _showSnackBar(
          "Photo recovered successfully",
          isError: false,
        );
      } else if (response.exception != null) {
        debugPrint(
          "Lost image error: ${response.exception}",
        );
      }
    } catch (e) {
      debugPrint(
        "Failed to recover lost image: $e",
      );
    }
  }

  final ComplaintService _complaintService = ComplaintService();

  List<ComplaintModel> _complaints = [];

  bool _isLoadingComplaints = true;

  Timer? _complaintRefreshTimer;
  bool _isRefreshingComplaints = false;

  static const double _bottomNavOffset = 96;

  static String? _cachedAddress;
  static double? _cachedLat;
  static double? _cachedLng;

  final TextEditingController _descriptionController =
  TextEditingController();

  final FocusNode _descriptionFocusNode =
  FocusNode();

  final ImagePicker _picker =
  ImagePicker();

  String _currentLocation =
      _cachedAddress ??
          "Fetching your current location...";

  double? _latitude = _cachedLat;
  double? _longitude = _cachedLng;

  bool _isLocating = false;

  bool _isSubmitting = false;

  bool _isSubmitPressed = false;

  bool _isDescriptionFocused = false;

  File? _selectedPhoto;

  String? _selectedCategoryKey;

  final Map<String, String> _categoryMap = {
    "Missed Collection": "MISSED_COLLECTION",
    "Overflowing Bin": "OVERFLOWING_BIN",
    "Illegal Dumping": "ILLEGAL_DUMPING",
    "Street Litter": "STREET_LITTER",
    "Damaged Bin": "DAMAGED_BIN",
    "Other": "OTHER",
  };

  late final AnimationController _staggerController;

  late final AnimationController _pulseController;

  @override
  void initState() {
    super.initState();

    _staggerController = AnimationController(
      vsync: this,
      duration: const Duration(
        milliseconds: 1000,
      ),
    );

    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(
        milliseconds: 1200,
      ),
    );

    _descriptionFocusNode.addListener(
      _onDescriptionFocusChange,
    );

    _staggerController.forward();

    _loadComplaints();
    _startAutoRefresh();

    _recoverLostImage();

    if (_cachedAddress == null) {
      _refreshLocation();
    } else {
      _currentLocation = _cachedAddress!;
      _latitude = _cachedLat;
      _longitude = _cachedLng;
    }
  }

  @override
  void dispose() {
    _complaintRefreshTimer?.cancel();

    _descriptionController.dispose();

    _descriptionFocusNode.removeListener(
      _onDescriptionFocusChange,
    );

    _descriptionFocusNode.dispose();

    _staggerController.dispose();

    _pulseController.dispose();

    super.dispose();
  }

  void _onDescriptionFocusChange() {
    if (_isDescriptionFocused !=
        _descriptionFocusNode.hasFocus) {
      setState(() {
        _isDescriptionFocused =
            _descriptionFocusNode.hasFocus;
      });
    }
  }

  void _startAutoRefresh() {
    _complaintRefreshTimer?.cancel();
    _complaintRefreshTimer = Timer.periodic(
      const Duration(seconds: 10),
          (_) => _refreshComplaints(silent: true),
    );
  }

  Future<void> _refreshComplaints({bool silent = false}) async {
    if (_isRefreshingComplaints) return;

    _isRefreshingComplaints = true;

    try {
      final complaints = await _complaintService.getComplaints();

      final updatedComplaints = await Future.wait(
        complaints.map((complaint) async {
          final ticketNumber = complaint.ticketNumber;

          if (ticketNumber == null ||
              ticketNumber.isEmpty ||
              complaint.status.toUpperCase() != "OTP_SENT") {
            return complaint;
          }

          try {
            final verificationCode =
            await _complaintService.getComplaintVerification(
              ticketNumber,
            );

            if (verificationCode?.isEmpty ?? true) {
              return complaint;
            }

            return complaint.copyWith(
              verificationCode: verificationCode,
            );
          } catch (_) {
            return complaint;
          }
        }),
      );

      if (!mounted) return;

      setState(() {
        _complaints = updatedComplaints;
        _isLoadingComplaints = false;
      });
    } catch (_) {
      if (!mounted) return;

      setState(() {
        _isLoadingComplaints = false;
      });

      if (!silent) {
        _showSnackBar("Unable to load complaints.");
      }
    } finally {
      _isRefreshingComplaints = false;
    }
  }

  Future<void> _loadComplaints() async {
    await _refreshComplaints(silent: false);
  }

  Future<void> _refreshLocation({
    bool forceRefresh = false,
  }) async {
    if (_isLocating) return;

    if (!forceRefresh && _cachedAddress != null) {
      if (!mounted) return;

      setState(() {
        _currentLocation = _cachedAddress!;
        _latitude = _cachedLat;
        _longitude = _cachedLng;
        _isLocating = false;
      });

      return;
    }

    if (!mounted) return;

    setState(() {
      _isLocating = true;
      _currentLocation = "Fetching your current location...";
    });

    _pulseController.repeat(reverse: true);

    try {
      final bool enabled =
      await Geolocator.isLocationServiceEnabled();

      if (!enabled) {
        if (!mounted) return;

        setState(() {
          _currentLocation =
          "Please enable location services.";
          _isLocating = false;
        });

        _showSnackBar(
          "Please enable location services.",
        );

        return;
      }

      LocationPermission permission =
      await Geolocator.checkPermission();

      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }

      if (permission == LocationPermission.denied) {
        if (!mounted) return;

        setState(() {
          _currentLocation =
          "Location permission denied.";
          _isLocating = false;
        });

        _showSnackBar(
          "Please allow location permission.",
        );

        return;
      }

      if (permission == LocationPermission.deniedForever) {
        if (!mounted) return;

        setState(() {
          _currentLocation =
          "Location permission permanently denied.";
          _isLocating = false;
        });

        _showSnackBar(
          "Please enable location permission from Settings.",
        );

        return;
      }

      final Position position =
      await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
        ),
      );

      final double latitude = position.latitude;
      final double longitude = position.longitude;

      _latitude = latitude;
      _longitude = longitude;

      String address;

      try {
        final List<Placemark> placemarks =
        await placemarkFromCoordinates(
          latitude,
          longitude,
        );

        if (placemarks.isNotEmpty) {
          final Placemark p = placemarks.first;

          final parts = <String>[
            if (p.street != null && p.street!.trim().isNotEmpty)
              p.street!.trim(),

            if (p.subLocality != null &&
                p.subLocality!.trim().isNotEmpty)
              p.subLocality!.trim(),

            if (p.locality != null &&
                p.locality!.trim().isNotEmpty)
              p.locality!.trim(),

            if (p.administrativeArea != null &&
                p.administrativeArea!.trim().isNotEmpty)
              p.administrativeArea!.trim(),
          ];

          address = parts.join(", ");

          if (address.trim().isEmpty) {
            address =
            "${latitude.toStringAsFixed(6)}, "
                "${longitude.toStringAsFixed(6)}";
          }
        } else {
          address =
          "${latitude.toStringAsFixed(6)}, "
              "${longitude.toStringAsFixed(6)}";
        }
      } catch (e) {
        debugPrint(
          "Reverse geocoding failed: $e",
        );

        address =
        "${latitude.toStringAsFixed(6)}, "
            "${longitude.toStringAsFixed(6)}";
      }

      _cachedAddress = address;
      _cachedLat = latitude;
      _cachedLng = longitude;

      if (!mounted) return;

      setState(() {
        _currentLocation = address;
        _latitude = latitude;
        _longitude = longitude;
        _isLocating = false;
      });

      debugPrint("LOCATION SUCCESS");
      debugPrint("Latitude: $latitude");
      debugPrint("Longitude: $longitude");
      debugPrint("Address: $address");

    } catch (e) {
      debugPrint(
        "LOCATION ERROR: $e",
      );

      if (!mounted) return;

      setState(() {
        _currentLocation =
        "Unable to fetch location";
        _isLocating = false;
      });

      _showSnackBar(
        "Unable to get your current location.",
      );

    } finally {
      _pulseController.stop();
      _pulseController.reset();
    }
  }

  Future<void> _pickImage(ImageSource source) async {
    try {
      final XFile? image = await _picker.pickImage(
        source: source,
        imageQuality: 75,
        maxWidth: 1280,
        maxHeight: 1280,
      );

      if (image == null) return;

      if (!mounted) return;

      setState(() {
        _selectedPhoto = File(image.path);
      });

      _showSnackBar(
        source == ImageSource.camera
            ? "Photo captured successfully"
            : "Photo selected successfully",
        isError: false,
      );
    } catch (e) {
      debugPrint("Image picker error: $e");

      if (!mounted) return;

      _showSnackBar(
        "Unable to open ${source.name}: $e",
      );
    }
  }

  Future<void> _submitComplaint() async {
    if (_selectedPhoto == null) {
      _showSnackBar(
        "Please attach an image.",
      );
      return;
    }

    if (_selectedCategoryKey == null || _selectedCategoryKey!.isEmpty) {
      _showSnackBar(
        "Please select a complaint category.",
      );
      return;
    }

    final description = _descriptionController.text.trim();

    if (description.isEmpty) {
      _showSnackBar(
        "Please describe the issue.",
      );
      return;
    }

    if (_latitude == null || _longitude == null) {
      _showSnackBar(
        "Unable to detect your location.",
      );
      return;
    }

    if (_currentLocation.isEmpty ||
        _currentLocation == "Fetching your current location..." ||
        _currentLocation == "Location permission unavailable." ||
        _currentLocation == "Please enable location services.") {
      _showSnackBar(
        "Location is required.",
      );
      return;
    }

    setState(() {
      _isSubmitting = true;
    });

    try {
      final complaint = await _complaintService.createComplaint(
        image: _selectedPhoto!,
        description: description,
        category: _selectedCategoryKey!,
        priority: "MEDIUM",
        latitude: _latitude!,
        longitude: _longitude!,
        address: _currentLocation,
      );

      if (!mounted) return;

      setState(() {
        _complaints.insert(0, complaint);
        _isSubmitting = false;
      });

      await _showSuccessBottomSheet();

      _resetForm();
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _isSubmitting = false;
      });

      _showSnackBar(
        e.toString().replaceFirst(
          "Exception: ",
          "",
        ),
      );
    }
  }

  void _resetForm() {
    _descriptionController.clear();

    setState(() {
      _selectedPhoto = null;
      _selectedCategoryKey = null;
      _isSubmitting = false;
      _isSubmitPressed = false;
    });

    _refreshLocation(
      forceRefresh: true,
    );
  }

  void _showSnackBar(
      String message, {
        bool isError = true,
      }) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        behavior: SnackBarBehavior.floating,
        elevation: 6,
        backgroundColor: isError
            ? const Color(0xFFE53935)
            : const Color(0xFF2E7D32),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        content: Text(
          message,
          style: GoogleFonts.plusJakartaSans(
            color: Colors.white,
            fontSize: 13,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }

  Future<void> _showSuccessBottomSheet() async {
    await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      barrierColor: Colors.black.withValues(
        alpha: 0.65,
      ),
      builder: (_) => const ComplaintSuccessBottomSheet(),
    );
  }

  void _navigateToViewAllPage() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => ViewAllComplaintsPage(
          complaints: _complaints,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final bottomInset =
        MediaQuery.of(context).viewInsets.bottom;

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
            colors: [
              Color(0xFF260548),
              Color(0xFF3B0B68),
              Color(0xFF531288),
            ],
          ),
        ),
        child: SafeArea(
          child: AnimatedPadding(
            duration: const Duration(
              milliseconds: 180,
            ),
            curve: Curves.easeOutCubic,
            padding: EdgeInsets.only(
              bottom: bottomInset,
            ),
            child: RefreshIndicator(
              onRefresh: () => _refreshComplaints(silent: false),
              color: const Color(0xFFC084FC),
              backgroundColor: const Color(0xFF3B0B68),
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(
                  parent: BouncingScrollPhysics(),
                ),
                padding: const EdgeInsets.only(
                  left: 20,
                  right: 20,
                  top: 20,
                  bottom: _bottomNavOffset,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [

                    _StaggeredAnimatedItem(
                      controller: _staggerController,
                      index: 0,
                      child: _buildHeader(),
                    ),

                    const SizedBox(height: 28),

                    _StaggeredAnimatedItem(
                      controller: _staggerController,
                      index: 1,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _buildSectionTitle(
                            "Add Photo",
                          ),
                          const SizedBox(
                            height: 12,
                          ),
                          _buildPhotoUploadCard(),
                        ],
                      ),
                    ),

                    const SizedBox(height: 28),

                    _StaggeredAnimatedItem(
                      controller: _staggerController,
                      index: 2,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _buildSectionTitle(
                            "Category",
                          ),
                          const SizedBox(
                            height: 12,
                          ),
                          _buildCategoryDropdown(),
                        ],
                      ),
                    ),

                    const SizedBox(height: 28),

                    _StaggeredAnimatedItem(
                      controller: _staggerController,
                      index: 3,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _buildSectionTitle(
                            "Description",
                          ),
                          const SizedBox(
                            height: 12,
                          ),
                          _buildDescriptionField(),
                        ],
                      ),
                    ),

                    const SizedBox(height: 28),

                    _StaggeredAnimatedItem(
                      controller: _staggerController,
                      index: 4,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _buildSectionTitle(
                            "Location",
                          ),
                          const SizedBox(
                            height: 12,
                          ),
                          _buildLocationCard(),
                        ],
                      ),
                    ),

                    const SizedBox(height: 32),

                    _StaggeredAnimatedItem(
                      controller: _staggerController,
                      index: 5,
                      child: _buildSubmitButton(),
                    ),

                    const SizedBox(height: 40),

                    _StaggeredAnimatedItem(
                      controller: _staggerController,
                      index: 6,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _buildRecentComplaintsHeader(),
                          const SizedBox(
                            height: 16,
                          ),
                          _buildRecentComplaintsList(),
                        ],
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

  // ============================================================================
  // UI COMPONENTS
  // ============================================================================

  Widget _buildHeader() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: Colors.white.withValues(alpha: 0.20),
                  width: 1,
                ),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFFC084FC).withValues(alpha: 0.2),
                    blurRadius: 10,
                  )
                ],
              ),
              child: const Icon(
                Icons.report_problem_rounded,
                color: Color(0xFFC084FC),
                size: 26,
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Text(
                "Report Complaint",
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
        const SizedBox(height: 8),
        Text(
          "Help us keep your neighbourhood clean by reporting waste-related issues.",
          style: GoogleFonts.plusJakartaSans(
            color: Colors.white.withValues(alpha: 0.65),
            fontSize: 13.5,
            fontWeight: FontWeight.w400,
            height: 1.4,
          ),
        ),
      ],
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: GoogleFonts.plusJakartaSans(
        color: Colors.white,
        fontSize: 15,
        fontWeight: FontWeight.w700,
        letterSpacing: 0.2,
      ),
    );
  }

  Widget _buildPhotoUploadCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(
          color: _selectedPhoto != null
              ? const Color(0xFFC084FC)
              : Colors.white.withValues(alpha: 0.15),
          width: 1.2,
        ),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: const Color(0xFFC084FC).withValues(alpha: 0.22),
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: const Color(0xFFC084FC).withValues(alpha: 0.4),
                  ),
                ),
                child: Center(
                  child: _selectedPhoto != null
                      ? const Icon(
                    Icons.check_circle_rounded,
                    color: Color(0xFF66BB6A),
                    size: 26,
                  )
                      : const Icon(
                    Icons.camera_enhance_rounded,
                    color: Color(0xFFC084FC),
                    size: 24,
                  ),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _selectedPhoto != null
                          ? "Photo Attached ✓"
                          : "Add a Photo",
                      style: GoogleFonts.plusJakartaSans(
                        color: Colors.white,
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      _selectedPhoto != null
                          ? "Tap camera or gallery button below to replace image."
                          : "Capture or upload an image to help identify the issue.",
                      style: GoogleFonts.plusJakartaSans(
                        color: Colors.white.withValues(alpha: 0.6),
                        fontSize: 11.5,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _buildPhotoButton(
                  icon: Icons.camera_alt_rounded,
                  label: "Camera",
                  onTap: () => _pickImage(ImageSource.camera),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _buildPhotoButton(
                  icon: Icons.photo_library_rounded,
                  label: "Gallery",
                  onTap: () => _pickImage(ImageSource.gallery),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPhotoButton({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: Colors.white.withValues(alpha: 0.18),
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: const Color(0xFFC084FC), size: 16),
              const SizedBox(width: 6),
              Text(
                label,
                style: GoogleFonts.plusJakartaSans(
                  color: Colors.white,
                  fontSize: 12.5,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCategoryDropdown() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: _selectedCategoryKey != null
              ? const Color(0xFFC084FC)
              : Colors.white.withValues(alpha: 0.14),
          width: _selectedCategoryKey != null ? 1.5 : 1.0,
        ),
        boxShadow: _selectedCategoryKey != null
            ? [
          BoxShadow(
            color: const Color(0xFFA855F7).withValues(alpha: 0.25),
            blurRadius: 10,
            spreadRadius: 1,
          )
        ]
            : const [],
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: _selectedCategoryKey,
          hint: Text(
            "Select complaint category",
            style: GoogleFonts.plusJakartaSans(
              color: Colors.white.withValues(alpha: 0.4),
              fontSize: 13.5,
              fontWeight: FontWeight.w500,
            ),
          ),
          isExpanded: true,
          dropdownColor: const Color(0xFF3B0B68),
          borderRadius: BorderRadius.circular(20),
          icon: const Icon(
            Icons.keyboard_arrow_down_rounded,
            color: Color(0xFFC084FC),
            size: 24,
          ),
          style: GoogleFonts.plusJakartaSans(
            color: Colors.white,
            fontSize: 13.5,
            fontWeight: FontWeight.w600,
          ),
          items: _categoryMap.entries.map((entry) {
            return DropdownMenuItem<String>(
              value: entry.value,
              child: Text(
                entry.key,
                style: GoogleFonts.plusJakartaSans(
                  color: Colors.white,
                  fontSize: 13.5,
                  fontWeight: FontWeight.w600,
                ),
              ),
            );
          }).toList(),
          onChanged: (newValue) {
            setState(() {
              _selectedCategoryKey = newValue;
            });
          },
        ),
      ),
    );
  }

  Widget _buildDescriptionField() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: _isDescriptionFocused
              ? const Color(0xFFC084FC)
              : Colors.white.withValues(alpha: 0.14),
          width: _isDescriptionFocused ? 1.5 : 1.0,
        ),
        boxShadow: _isDescriptionFocused
            ? [
          BoxShadow(
            color: const Color(0xFFA855F7).withValues(alpha: 0.3),
            blurRadius: 12,
            spreadRadius: 1,
          )
        ]
            : const [],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          TextField(
            controller: _descriptionController,
            focusNode: _descriptionFocusNode,
            maxLength: 300,
            maxLines: 4,
            style: GoogleFonts.plusJakartaSans(
              color: Colors.white,
              fontSize: 13.5,
            ),
            decoration: InputDecoration(
              hintText: "Describe the issue...",
              hintStyle: GoogleFonts.plusJakartaSans(
                color: Colors.white.withValues(alpha: 0.4),
                fontSize: 13.5,
              ),
              counterText: "",
              border: InputBorder.none,
              contentPadding: EdgeInsets.zero,
            ),
          ),
          ValueListenableBuilder<TextEditingValue>(
            valueListenable: _descriptionController,
            builder: (context, value, child) {
              return Text(
                "${value.text.length} / 300",
                style: GoogleFonts.plusJakartaSans(
                  color: Colors.white.withValues(alpha: 0.5),
                  fontSize: 11,
                  fontWeight: FontWeight.w500,
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildLocationCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.14),
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          AnimatedBuilder(
            animation: _pulseController,
            builder: (context, child) {
              final pulseVal = _isLocating ? _pulseController.value : 0.0;
              return Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFFC084FC)
                      .withValues(alpha: 0.15 + (pulseVal * 0.2)),
                ),
                child: const Icon(
                  Icons.location_on_rounded,
                  color: Color(0xFFC084FC),
                  size: 22,
                ),
              );
            },
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Current Location",
                  style: GoogleFonts.plusJakartaSans(
                    color: Colors.white.withValues(alpha: 0.55),
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Text(
                  _currentLocation,
                  style: GoogleFonts.plusJakartaSans(
                    color: Colors.white,
                    fontSize: 13.5,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            onPressed: _isLocating ? null : () => _refreshLocation(forceRefresh: true),
            icon: _isLocating
                ? const SizedBox(
              width: 18,
              height: 18,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: Color(0xFFC084FC),
              ),
            )
                : const Icon(
              Icons.my_location_rounded,
              color: Color(0xFFC084FC),
              size: 20,
            ),
            tooltip: "Use Current Location",
          ),
        ],
      ),
    );
  }

  Widget _buildSubmitButton() {
    return AnimatedScale(
      scale: _isSubmitPressed ? 0.96 : 1.0,
      duration: const Duration(milliseconds: 100),
      child: Listener(
        onPointerDown: (_) => setState(() => _isSubmitPressed = true),
        onPointerUp: (_) => setState(() => _isSubmitPressed = false),
        child: SizedBox(
          width: double.infinity,
          height: 50,
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: _isSubmitting ? null : _submitComplaint,
              borderRadius: BorderRadius.circular(25),
              child: Container(
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [
                      Color(0xFFC084FC),
                      Color(0xFFA855F7),
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(25),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFFA855F7).withValues(alpha: 0.45),
                      blurRadius: 14,
                      spreadRadius: 1,
                      offset: const Offset(0, 4),
                    ),
                  ],
                  border: Border.all(
                    color: Colors.white.withValues(alpha: 0.35),
                    width: 1.0,
                  ),
                ),
                child: Center(
                  child: AnimatedCrossFade(
                    duration: const Duration(milliseconds: 200),
                    crossFadeState: _isSubmitting
                        ? CrossFadeState.showSecond
                        : CrossFadeState.showFirst,
                    firstChild: Text(
                      "Submit Complaint",
                      style: GoogleFonts.plusJakartaSans(
                        color: Colors.white,
                        fontSize: 15,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.3,
                      ),
                    ),
                    secondChild: const SizedBox(
                      width: 22,
                      height: 22,
                      child: CircularProgressIndicator(
                        strokeWidth: 2.5,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildRecentComplaintsHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          "Recent Complaints",
          style: GoogleFonts.plusJakartaSans(
            color: Colors.white,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        TextButton(
          onPressed: _navigateToViewAllPage,
          style: TextButton.styleFrom(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            minimumSize: Size.zero,
            tapTargetSize: MaterialTapTargetSize.shrinkWrap,
          ),
          child: Row(
            children: [
              Text(
                "View All",
                style: GoogleFonts.plusJakartaSans(
                  color: const Color(0xFFC084FC),
                  fontSize: 12.5,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(width: 2),
              const Icon(
                Icons.arrow_forward_ios_rounded,
                color: Color(0xFFC084FC),
                size: 11,
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildRecentComplaintsList() {
    if (_isLoadingComplaints) {
      return const Padding(
        padding: EdgeInsets.symmetric(vertical: 24),
        child: Center(
          child: CircularProgressIndicator(
            color: Color(0xFFC084FC),
          ),
        ),
      );
    }

    if (_complaints.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(20),
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.05),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Text(
          "No complaints submitted yet.",
          style: GoogleFonts.plusJakartaSans(
            color: Colors.white.withValues(alpha: 0.5),
            fontSize: 13,
          ),
        ),
      );
    }

    final recentItems = _complaints.take(3).toList();

    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: recentItems.length,
      itemBuilder: (context, index) {
        return RepaintBoundary(
          child: _HomeComplaintCardItem(
            item: recentItems[index],
          ),
        );
      },
    );
  }
}

// ============================================================================
// STAGGERED FADE-SLIDE ANIMATED ITEM WIDGET
// ============================================================================

class _StaggeredAnimatedItem extends StatelessWidget {
  final AnimationController controller;
  final int index;
  final Widget child;

  const _StaggeredAnimatedItem({
    Key? key,
    required this.controller,
    required this.index,
    required this.child,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final double start = (index * 0.08).clamp(0.0, 0.7);
    final double end = (start + 0.4).clamp(0.2, 1.0);

    final opacityAnim = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: controller,
        curve: Interval(start, end, curve: Curves.easeOut),
      ),
    );

    final slideAnim = Tween<Offset>(
      begin: const Offset(0, 0.08),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: controller,
        curve: Interval(start, end, curve: Curves.easeOutCubic),
      ),
    );

    return FadeTransition(
      opacity: opacityAnim,
      child: SlideTransition(
        position: slideAnim,
        child: child,
      ),
    );
  }
}

// ============================================================================
// COMPACT VERIFICATION CODE INFORMATION PANEL (VIEW ALL PAGE)
// ============================================================================

class _VerificationCodeSection extends StatelessWidget {
  final String verificationCode;

  const _VerificationCodeSection({
    super.key,
    required this.verificationCode,
  });

  @override
  Widget build(BuildContext context) {
    final digits = verificationCode.split('');

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(top: 8, bottom: 8),
          child: Divider(
            color: Colors.white.withValues(alpha: 0.12),
            height: 1,
            thickness: 1,
          ),
        ),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.05),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: const Color(0xFFC084FC).withValues(alpha: 0.20),
              width: 0.8,
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(
                    Icons.verified_user_rounded,
                    color: Color(0xFFC084FC),
                    size: 13,
                  ),
                  const SizedBox(width: 5),
                  Text(
                    "Verification Code",
                    style: GoogleFonts.plusJakartaSans(
                      color: const Color(0xFFC084FC),
                      fontSize: 10.5,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 0.2,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: digits.map((digit) {
                  return Container(
                    width: 28,
                    height: 34,
                    margin: const EdgeInsets.only(right: 5),
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [
                          Color(0xFFC084FC),
                          Color(0xFFA855F7),
                        ],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: Colors.white.withValues(alpha: 0.25),
                        width: 0.8,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFFA855F7).withValues(alpha: 0.25),
                          blurRadius: 4,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Text(
                      digit,
                      style: GoogleFonts.plusJakartaSans(
                        color: Colors.white,
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 6),
              Text(
                "Share this code with the SEWAC worker.",
                style: GoogleFonts.plusJakartaSans(
                  color: Colors.white.withValues(alpha: 0.50),
                  fontSize: 10,
                  fontWeight: FontWeight.w400,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

// ============================================================================
// COMPACT RECENT COMPLAINT VERIFICATION CODE SECTION
// ============================================================================

class _RecentVerificationCodeSection extends StatelessWidget {
  final String verificationCode;

  const _RecentVerificationCodeSection({
    super.key,
    required this.verificationCode,
  });

  @override
  Widget build(BuildContext context) {
    final digits = verificationCode.split('');

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(top: 8, bottom: 8),
          child: Divider(
            color: Colors.white.withValues(alpha: 0.12),
            height: 1,
            thickness: 1,
          ),
        ),
        Row(
          children: [
            const Icon(
              Icons.lock_outline_rounded,
              color: Color(0xFFC084FC),
              size: 13,
            ),
            const SizedBox(width: 4),
            Text(
              "Verification Code",
              style: GoogleFonts.plusJakartaSans(
                color: const Color(0xFFC084FC),
                fontSize: 11,
                fontWeight: FontWeight.w700,
                letterSpacing: 0.2,
              ),
            ),
          ],
        ),
        const SizedBox(height: 6),
        Row(
          mainAxisAlignment: MainAxisAlignment.start,
          children: digits.map((digit) {
            return Container(
              width: 30,
              height: 36,
              margin: const EdgeInsets.only(right: 6),
              alignment: Alignment.center,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [
                    Color(0xFFC084FC),
                    Color(0xFFA855F7),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                  color: Colors.white.withValues(alpha: 0.25),
                  width: 0.8,
                ),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFFA855F7).withValues(alpha: 0.25),
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Text(
                digit,
                style: GoogleFonts.plusJakartaSans(
                  color: Colors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                ),
              ),
            );
          }).toList(),
        ),
        const SizedBox(height: 6),
        Text(
          "Waiting for citizen verification",
          style: GoogleFonts.plusJakartaSans(
            color: Colors.white.withValues(alpha: 0.45),
            fontSize: 10,
            fontWeight: FontWeight.w400,
          ),
        ),
      ],
    );
  }
}

// ============================================================================
// NON-CLICKABLE RECENT COMPLAINT PREVIEW CARD (HOME PAGE)
// ============================================================================

class _HomeComplaintCardItem extends StatelessWidget {
  final ComplaintModel item;

  const _HomeComplaintCardItem({
    required this.item,
  });

  String get formattedDate {
    final dt = item.createdAt;

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    final hour =
    dt.hour % 12 == 0 ? 12 : dt.hour % 12;

    final minute =
    dt.minute.toString().padLeft(2, "0");

    final ampm =
    dt.hour >= 12 ? "PM" : "AM";

    return "${dt.day} ${months[dt.month - 1]} ${dt.year} • $hour:$minute $ampm";
  }

  bool get showVerificationCode =>
      item.status.toUpperCase() == "OTP_SENT" &&
          item.verificationCode != null &&
          item.verificationCode!.isNotEmpty;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.12),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: const Color(0xFF3B0B68),
                  borderRadius: BorderRadius.circular(12),
                ),
                clipBehavior: Clip.antiAlias,
                child: item.imageUrl != null
                    ? Image.network(
                  item.imageUrl!,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => const Icon(
                    Icons.image_not_supported,
                    color: Colors.white54,
                  ),
                )
                    : const Icon(
                  Icons.image_not_supported,
                  color: Colors.white54,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            item.ticketNumber ?? "SEWAC-${item.id}",
                            style: GoogleFonts.plusJakartaSans(
                              color: const Color(0xFFC084FC),
                              fontSize: 13,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        Text(
                          formattedDate,
                          style: GoogleFonts.plusJakartaSans(
                            color: Colors.white.withValues(alpha: .45),
                            fontSize: 10,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      item.description,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.plusJakartaSans(
                        color: Colors.white,
                        fontSize: 12.5,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 3,
                          ),
                          decoration: BoxDecoration(
                            color: const Color(0xFFC084FC).withValues(alpha: .18),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            item.status,
                            style: GoogleFonts.plusJakartaSans(
                              color: const Color(0xFFC084FC),
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            item.address,
                            overflow: TextOverflow.ellipsis,
                            style: GoogleFonts.plusJakartaSans(
                              color: Colors.white.withValues(alpha: .6),
                              fontSize: 10,
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
          AnimatedSize(
            duration: const Duration(milliseconds: 300),
            curve: Curves.easeOutCubic,
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 300),
              switchInCurve: Curves.easeOutCubic,
              switchOutCurve: Curves.easeInCubic,
              transitionBuilder: (Widget child, Animation<double> animation) {
                return FadeTransition(
                  opacity: animation,
                  child: SlideTransition(
                    position: Tween<Offset>(
                      begin: const Offset(0, 0.08),
                      end: Offset.zero,
                    ).animate(animation),
                    child: child,
                  ),
                );
              },
              child: showVerificationCode
                  ? _RecentVerificationCodeSection(
                key: ValueKey("verif_recent_${item.id}"),
                verificationCode: item.verificationCode!,
              )
                  : const SizedBox.shrink(key: ValueKey("empty_verif_recent")),
            ),
          ),
        ],
      ),
    );
  }
}

// ============================================================================
// CLEAN "VIEW ALL" COMPLAINTS PAGE (NO FILTERS / NO SEARCH)
// ============================================================================

class ViewAllComplaintsPage extends StatefulWidget {
  final List<ComplaintModel> complaints;

  const ViewAllComplaintsPage({
    super.key,
    required this.complaints,
  });

  @override
  State<ViewAllComplaintsPage> createState() =>
      _ViewAllComplaintsPageState();
}

class _ViewAllComplaintsPageState
    extends State<ViewAllComplaintsPage> {

  late List<ComplaintModel> _complaints;
  final ComplaintService _complaintService = ComplaintService();

  Timer? _viewAllRefreshTimer;
  bool _isRefreshingViewAll = false;

  @override
  void initState() {
    super.initState();
    _complaints = List.from(widget.complaints);
    _startAutoRefresh();
  }

  @override
  void dispose() {
    _viewAllRefreshTimer?.cancel();
    super.dispose();
  }

  void _startAutoRefresh() {
    _viewAllRefreshTimer?.cancel();
    _viewAllRefreshTimer = Timer.periodic(
      const Duration(seconds: 10),
          (_) => _silentRefresh(),
    );
  }

  Future<void> _silentRefresh() async {
    if (_isRefreshingViewAll) return;

    _isRefreshingViewAll = true;

    try {
      final complaints = await _loadComplaintsWithVerification();

      if (!mounted) return;

      setState(() {
        _complaints = complaints;
      });
    } catch (_) {
      // Keep existing list on failure
    } finally {
      _isRefreshingViewAll = false;
    }
  }

  Future<void> _handleRefresh() async {
    await _silentRefresh();
  }

  Future<List<ComplaintModel>> _loadComplaintsWithVerification() async {
    final complaints = await _complaintService.getComplaints();

    return Future.wait(
      complaints.map((complaint) async {
        final ticketNumber = complaint.ticketNumber;

        if (ticketNumber == null ||
            ticketNumber.isEmpty ||
            complaint.status.toUpperCase() != "OTP_SENT") {
          return complaint;
        }

        try {
          final verificationCode =
          await _complaintService.getComplaintVerification(
            ticketNumber,
          );

          if (verificationCode?.isEmpty ?? true) {
            return complaint;
          }

          return complaint.copyWith(
            verificationCode: verificationCode,
          );
        } catch (_) {
          return complaint;
        }
      }),
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
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [

              _buildAppBar(context),

              Expanded(
                child: RefreshIndicator(
                  onRefresh: _handleRefresh,
                  color: const Color(0xFFC084FC),
                  backgroundColor:
                  const Color(0xFF3B0B68),

                  child: _complaints.isEmpty
                      ? _buildEmptyState()
                      : ListView.builder(
                    physics:
                    const AlwaysScrollableScrollPhysics(
                      parent:
                      BouncingScrollPhysics(),
                    ),
                    padding:
                    const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 12,
                    ),
                    itemCount:
                    _complaints.length,
                    itemBuilder:
                        (context, index) {
                      return _ViewAllComplaintCardItem(
                        item:
                        _complaints[index],
                      );
                    },
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAppBar(BuildContext context) {
    return Padding(
      padding:
      const EdgeInsets.symmetric(
        horizontal: 12,
        vertical: 8,
      ),
      child: Row(
        children: [

          IconButton(
            onPressed: () {
              Navigator.pop(context);
            },
            icon: const Icon(
              Icons.arrow_back_ios_new_rounded,
              color: Colors.white,
            ),
          ),

          const SizedBox(width: 8),

          Expanded(
            child: Text(
              "All Complaints",
              style:
              GoogleFonts.plusJakartaSans(
                color: Colors.white,
                fontSize: 20,
                fontWeight:
                FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return SingleChildScrollView(
      physics:
      const AlwaysScrollableScrollPhysics(),
      child: SizedBox(
        height: 350,
        child: Center(
          child: Column(
            mainAxisAlignment:
            MainAxisAlignment.center,
            children: [

              Icon(
                Icons.inbox_rounded,
                size: 52,
                color: Colors.white
                    .withValues(alpha: .35),
              ),

              const SizedBox(height: 14),

              Text(
                "No complaints available",
                style:
                GoogleFonts.plusJakartaSans(
                  color: Colors.white
                      .withValues(alpha: .7),
                  fontSize: 15,
                  fontWeight:
                  FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ============================================================================
// VIEW ALL COMPLAINT CARD ITEM
// ============================================================================

class _ViewAllComplaintCardItem extends StatelessWidget {
  final ComplaintModel item;

  const _ViewAllComplaintCardItem({
    required this.item,
  });

  String get formattedDate {
    final dt = item.createdAt;

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    final hour = dt.hour % 12 == 0 ? 12 : dt.hour % 12;
    final minute = dt.minute.toString().padLeft(2, "0");
    final amPm = dt.hour >= 12 ? "PM" : "AM";

    return "${dt.day} ${months[dt.month - 1]} ${dt.year} • $hour:$minute $amPm";
  }

  Color get statusColor {
    switch (item.status.toUpperCase()) {
      case "RESOLVED":
        return const Color(0xFF4CAF50);

      case "IN_PROGRESS":
        return const Color(0xFFFF9800);

      case "REJECTED":
        return const Color(0xFFF44336);

      default:
        return const Color(0xFFC084FC);
    }
  }

  bool get showVerificationCode =>
      item.status.toUpperCase() == "OTP_SENT" &&
          item.verificationCode != null &&
          item.verificationCode!.isNotEmpty;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.12),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [

          if (item.imageUrl != null)
            ClipRRect(
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(20),
              ),
              child: Image.network(
                item.imageUrl!,
                width: double.infinity,
                height: 180,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) {
                  return Container(
                    height: 180,
                    color: Colors.black26,
                    alignment: Alignment.center,
                    child: const Icon(
                      Icons.broken_image_rounded,
                      color: Colors.white54,
                      size: 40,
                    ),
                  );
                },
              ),
            ),

          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment:
              CrossAxisAlignment.start,
              children: [

                Row(
                  children: [

                    Expanded(
                      child: Text(
                        item.ticketNumber ?? "SEWAC-${item.id}",
                        style:
                        GoogleFonts.plusJakartaSans(
                          color: const Color(0xFFC084FC),
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                        ),
                      ),
                    ),

                    Text(
                      formattedDate,
                      style:
                      GoogleFonts.plusJakartaSans(
                        color: Colors.white
                            .withValues(alpha: .45),
                        fontSize: 11,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 12),

                Text(
                  item.description,
                  style:
                  GoogleFonts.plusJakartaSans(
                    color: Colors.white,
                    fontSize: 13,
                    height: 1.45,
                  ),
                ),

                const SizedBox(height: 16),

                Row(
                  children: [

                    const Icon(
                      Icons.location_on_rounded,
                      size: 16,
                      color: Color(0xFFC084FC),
                    ),

                    const SizedBox(width: 6),

                    Expanded(
                      child: Text(
                        item.address,
                        style:
                        GoogleFonts.plusJakartaSans(
                          color: Colors.white
                              .withValues(alpha: .65),
                          fontSize: 11.5,
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 14),

                Row(
                  children: [

                    Container(
                      padding:
                      const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 5,
                      ),
                      decoration: BoxDecoration(
                        color:
                        statusColor.withValues(
                          alpha: .18,
                        ),
                        borderRadius:
                        BorderRadius.circular(20),
                      ),
                      child: Text(
                        item.status,
                        style:
                        GoogleFonts.plusJakartaSans(
                          color: statusColor,
                          fontSize: 11,
                          fontWeight:
                          FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),

                AnimatedSize(
                  duration: const Duration(milliseconds: 300),
                  curve: Curves.easeOutCubic,
                  child: AnimatedSwitcher(
                    duration: const Duration(milliseconds: 300),
                    switchInCurve: Curves.easeOutCubic,
                    switchOutCurve: Curves.easeInCubic,
                    transitionBuilder: (Widget child, Animation<double> animation) {
                      return FadeTransition(
                        opacity: animation,
                        child: SlideTransition(
                          position: Tween<Offset>(
                            begin: const Offset(0, 0.08),
                            end: Offset.zero,
                          ).animate(animation),
                          child: child,
                        ),
                      );
                    },
                    child: showVerificationCode
                        ? _VerificationCodeSection(
                      key: ValueKey("verif_view_all_${item.id}"),
                      verificationCode: item.verificationCode!,
                    )
                        : const SizedBox.shrink(key: ValueKey("empty_verif_view_all")),
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

// ============================================================================
// SUCCESS BOTTOM SHEET
// ============================================================================

class ComplaintSuccessBottomSheet extends StatefulWidget {
  const ComplaintSuccessBottomSheet({super.key});

  @override
  State<ComplaintSuccessBottomSheet> createState() =>
      _ComplaintSuccessBottomSheetState();
}

class _ComplaintSuccessBottomSheetState
    extends State<ComplaintSuccessBottomSheet>
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
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          decoration: BoxDecoration(
            color: const Color(0xFF260548).withValues(alpha: 0.96),
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
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Container(
                width: 44,
                height: 5,
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.35),
                  borderRadius: BorderRadius.circular(2.5),
                ),
              ),
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFF66BB6A).withValues(alpha: 0.2),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.check_circle_rounded,
                  color: Color(0xFF66BB6A),
                  size: 48,
                ),
              ),
              const SizedBox(height: 14),
              Text(
                "Complaint Submitted Successfully",
                textAlign: TextAlign.center,
                style: GoogleFonts.plusJakartaSans(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 20),
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
                    "Done",
                    style: GoogleFonts.plusJakartaSans(
                      color: Colors.white,
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 8),
            ],
          ),
        ),
      ),
    );
  }
}