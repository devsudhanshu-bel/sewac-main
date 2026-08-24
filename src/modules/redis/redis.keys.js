class RedisKeys {

  // ===================================================
  // AUTH SESSION
  // ===================================================

  authToken(
    userId,
    deviceId
  ) {

    return `auth:token:${userId}:${deviceId}`;

  }


  refreshToken(userId) {

    return `auth:refresh:${userId}`;

  }


  // ===================================================
  // DEVICE SECURITY
  // ===================================================

  devicePhones(deviceId) {

    return `device:phones:${deviceId}`;

  }


  deviceLock(deviceId) {

    return `device:lock:${deviceId}`;

  }


  deviceTrusted(
    deviceId,
    phoneNumber
  ) {

    return `device:trusted:${deviceId}:${phoneNumber}`;

  }


  deviceEnrollment(
    deviceId,
    phoneNumber
  ) {

    return `device:enrollment:${deviceId}:${phoneNumber}`;

  }


  deviceSuspicious(deviceId) {

    return `device:suspicious:${deviceId}`;

  }


  // ===================================================
  // CITIZEN CACHE
  // ===================================================

  citizenHome(userId) {

    return `citizen:home:${userId}`;

  }


  citizenHomeCalendar(
    userId,
    year,
    month
  ) {

    return `citizen:home:calendar:${userId}:${year}:${month}`;

  }


  citizenToday(userId) {

    return `citizen:home:today:${userId}`;

  }


  citizenProfile(userId) {

    return `citizen:profile:${userId}`;

  }


  citizenComplaints(userId) {

    return `citizen:complaints:${userId}`;

  }


  // ===================================================
  // VEHICLES
  // ===================================================

  vehicles() {

    return "vehicles:list";

  }


  vehicle(vehicleId) {

    return `vehicle:${vehicleId}`;

  }


  vehicleStats(vehicleId) {

    return `vehicle:stats:${vehicleId}`;

  }


  // ===================================================
  // MAP
  // ===================================================

  mapVehicles() {

    return "map:vehicles";

  }


  mapGeo() {

    return "map:geo";

  }


  mapVehicle(vehicleId) {

    return `map:vehicle:${vehicleId}`;

  }


  mapTrail(vehicleId) {

    return `map:trail:${vehicleId}`;

  }


  // ===================================================
  // OTP
  // ===================================================

  otp(phone) {

    return `otp:${phone}`;

  }


  // ===================================================
  // SESSION
  // ===================================================

  session(sessionId) {

    return `session:${sessionId}`;

  }


  // ===================================================
  // CACHE INVALIDATION
  // ===================================================

  vehicleCacheKeys(vehicleId) {

    return [

      this.vehicle(vehicleId),

      this.vehicleStats(vehicleId),

      this.mapVehicle(vehicleId),

      this.mapTrail(vehicleId),

    ];

  }

}

export default new RedisKeys();