class RedisKeys {


// =====================================
// AUTH CACHE
// =====================================


authToken(userId) {

  return `auth:token:${userId}`;

}



refreshToken(userId) {

  return `auth:refresh:${userId}`;

}






// =====================================
// CITIZEN APP CACHE
// =====================================


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






// =====================================
// ADMIN DASHBOARD CACHE
// =====================================


dashboard() {

  return "admin:dashboard";

}



dashboardKPIs() {

  return "admin:kpis";

}



dashboardCharts() {

  return "admin:charts";

}






// =====================================
// VEHICLE CACHE
// =====================================


vehicles() {

  return "vehicles:list";

}



vehicle(vehicleId) {

  return `vehicle:${vehicleId}`;

}



vehicleStats(vehicleId) {

  return `vehicle:stats:${vehicleId}`;

}






// =====================================
// MAP CACHE
// =====================================


mapVehicles() {

  return "map:vehicles";

}




// Redis GEO INDEX
// Used for nearest truck search

mapGeo() {

  return "map:geo";

}




mapVehicle(vehicleId) {

  return `map:vehicle:${vehicleId}`;

}



mapTrail(vehicleId) {

  return `map:trail:${vehicleId}`;

}








// =====================================
// OTP CACHE
// =====================================


otp(phone) {

  return `otp:${phone}`;

}








// =====================================
// SESSION CACHE
// =====================================


session(sessionId) {

  return `session:${sessionId}`;

}








// =====================================
// CACHE INVALIDATION KEYS
// =====================================


citizenHomePattern(userId) {

  return `citizen:home:*:${userId}`;

}





vehicleCacheKeys(vehicleId) {

  return [

    this.vehicle(vehicleId),

    this.vehicleStats(vehicleId),

    this.mapVehicle(vehicleId),

    this.mapTrail(vehicleId)

  ];

}





}


export default new RedisKeys();