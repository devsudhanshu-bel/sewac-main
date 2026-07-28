import 'package:flutter/material.dart';
import 'package:sewac_citizen_app/screens/cards/cards_page.dart';
import 'package:sewac_citizen_app/screens/complaints/complaints_page.dart';
import 'package:sewac_citizen_app/screens/home/home_page.dart';
import 'package:sewac_citizen_app/screens/maps/maps_page.dart';
import 'package:sewac_citizen_app/widgets/custom_bottom_navigation.dart';

class MainPage extends StatefulWidget {
  const MainPage({super.key});

  @override
  State<MainPage> createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> {
  int _currentIndex = 0;

  // Navigation order:
  // 0 -> Home
  // 1 -> Maps
  // 2 -> Cards
  // 3 -> Complaints
  final List<Widget> _pages = const [
    HomePage(),
    MapsPage(),
    CardsPage(),
    ComplaintsPage(), // Updated from ReportComplaintPage to match complaints_page.dart
  ];

  void _onTabSelected(int index) {
    if (_currentIndex != index) {
      setState(() {
        _currentIndex = index;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF2B0752),
      body: Stack(
        children: [
          // Keeps all pages alive without rebuilding
          IndexedStack(
            index: _currentIndex,
            children: _pages,
          ),

          // Floating Bottom Navigation
          Align(
            alignment: Alignment.bottomCenter,
            child: CustomBottomNavigation(
              currentIndex: _currentIndex,
              onTap: _onTabSelected,
            ),
          ),
        ],
      ),
    );
  }
}