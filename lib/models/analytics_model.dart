class AnalyticsModel {
  final DateTime startDate;
  final DateTime endDate;

  final int dryCompleted;
  final int dryTotal;

  final int wetCompleted;
  final int wetTotal;

  final int streak;
  final int participation;

  const AnalyticsModel({
    required this.startDate,
    required this.endDate,
    required this.dryCompleted,
    required this.dryTotal,
    required this.wetCompleted,
    required this.wetTotal,
    required this.streak,
    required this.participation,
  });

  factory AnalyticsModel.fromJson(Map<String, dynamic> json) {
    final data = json["data"];

    return AnalyticsModel(
      startDate: DateTime.parse(
        data["range"]["startDate"],
      ),
      endDate: DateTime.parse(
        data["range"]["endDate"],
      ),
      dryCompleted: data["dry"]["completed"] as int,
      dryTotal: data["dry"]["total"] as int,
      wetCompleted: data["wet"]["completed"] as int,
      wetTotal: data["wet"]["total"] as int,
      streak: data["streak"] as int,
      participation: data["participation"] as int,
    );
  }
}