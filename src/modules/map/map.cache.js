class MapCache {
  constructor() {
    this.trucks = new Map();
  }

  initializeTruck({
    vehicleId,
    initialPoint,
    oldPoint,
    newPoint,
    recordedAt,
  }) {
    if (this.trucks.has(vehicleId)) return;

    this.trucks.set(vehicleId, {
      vehicleId,

      initialPoint,

      oldPoint,

      newPoint,

      speed: this.calculateSpeed(
        oldPoint.latitude,
        oldPoint.longitude,
        newPoint.latitude,
        newPoint.longitude,
        recordedAt,
        recordedAt
      ),

      status: this.calculateStatus(recordedAt),

      updatedAt: new Date(recordedAt),
    });
  }

  updateTruck({
    vehicleId,
    initialPoint,
    oldPoint,
    newPoint,
    recordedAt,
  }) {
    if (!this.trucks.has(vehicleId)) {
      this.initializeTruck({
        vehicleId,
        initialPoint,
        oldPoint,
        newPoint,
        recordedAt,
      });

      return this.trucks.get(vehicleId);
    }

    const truck = this.trucks.get(vehicleId);

    const previousTime = truck.updatedAt;

    truck.initialPoint = initialPoint;

    truck.oldPoint = oldPoint;

    truck.newPoint = newPoint;

    truck.speed = this.calculateSpeed(
      oldPoint.latitude,
      oldPoint.longitude,
      newPoint.latitude,
      newPoint.longitude,
      previousTime,
      recordedAt
    );

    truck.status = this.calculateStatus(recordedAt);

    truck.updatedAt = new Date(recordedAt);

    this.trucks.set(vehicleId, truck);

    return truck;
  }

  calculateStatus(recordedAt) {
    const minutes =
      (Date.now() - new Date(recordedAt).getTime()) /
      (1000 * 60);

    return minutes <= 30 ? "ONLINE" : "OFFLINE";
  }

  calculateSpeed(
    lat1,
    lon1,
    lat2,
    lon2,
    previousTime,
    currentTime
  ) {
    const distance = this.haversineDistance(
      lat1,
      lon1,
      lat2,
      lon2
    );

    const hours =
      (new Date(currentTime) - new Date(previousTime)) /
      (1000 * 60 * 60);

    if (hours <= 0) return 0;

    return Number((distance / hours).toFixed(2));
  }

  haversineDistance(lat1, lon1, lat2, lon2) {
    const toRadians = (degrees) =>
      degrees * (Math.PI / 180);

    const R = 6371;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return R * c;
  }

  getTruck(vehicleId) {
    return this.trucks.get(vehicleId) || null;
  }

  getAllTrucks() {
    return Array.from(this.trucks.values());
  }

  clear() {
    this.trucks.clear();
  }
}

export default new MapCache();