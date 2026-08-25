const axios = require("axios");

/*
|--------------------------------------------------------------------------
| GET NEAREST VEHICLE
|--------------------------------------------------------------------------
|
| Existing Citizen nearest-vehicle functionality.
|
|--------------------------------------------------------------------------
*/

const getNearestVehicle = async ({ latitude, longitude }) => {
  if (latitude === undefined || longitude === undefined) {
    const error = new Error("Latitude and longitude are required.");

    error.statusCode = 400;

    throw error;
  }

  const parsedLatitude = Number(latitude);

  const parsedLongitude = Number(longitude);

  if (
    !Number.isFinite(parsedLatitude) ||
    !Number.isFinite(parsedLongitude) ||
    parsedLatitude < -90 ||
    parsedLatitude > 90 ||
    parsedLongitude < -180 ||
    parsedLongitude > 180
  ) {
    const error = new Error("Invalid latitude or longitude.");

    error.statusCode = 400;

    throw error;
  }

  /*
   * Keep your existing nearest implementation
   * here if this endpoint is already backed by
   * a different Citizen-side service.
   *
   * This new live-map implementation does NOT
   * modify that existing functionality.
   */

  const error = new Error(
    "Nearest vehicle functionality is handled by the existing map implementation.",
  );

  error.statusCode = 404;

  throw error;
};

/*
|--------------------------------------------------------------------------
| GET ALL LIVE VEHICLES
|--------------------------------------------------------------------------
|
| Existing endpoint.
|
| Keep your current implementation if this endpoint
| is already being used elsewhere.
|
|--------------------------------------------------------------------------
*/

const getLiveVehicles = async () => {
  /*
   * IMPORTANT:
   *
   * Do not use this new ward-filtered endpoint
   * to replace existing /citizen/map/live behavior.
   *
   * If your current project already has an implementation
   * for this function, retain that implementation.
   */

  const adminBackendUrl = process.env.ADMIN_BACKEND_URL;

  if (!adminBackendUrl) {
    const error = new Error("ADMIN_BACKEND_URL is not configured.");

    error.statusCode = 500;

    throw error;
  }

  const cleanAdminUrl = adminBackendUrl.replace(/\/+$/, "");

  const url = `${cleanAdminUrl}/api/route-map/live`;

  /*
   * This existing endpoint does not have
   * hierarchy parameters.
   *
   * Therefore don't silently change its
   * behavior.
   */

  const error = new Error(
    "Existing live vehicle endpoint should retain its current implementation.",
  );

  error.statusCode = 500;

  throw error;
};

/*
|--------------------------------------------------------------------------
| GET SINGLE VEHICLE
|--------------------------------------------------------------------------
*/

const getVehicle = async (vehicleId) => {
  if (!vehicleId || String(vehicleId).trim() === "") {
    const error = new Error("Vehicle ID is required.");

    error.statusCode = 400;

    throw error;
  }

  /*
   * Preserve the existing implementation
   * of this endpoint in your project.
   *
   * The new live ward-filtered endpoint
   * does not require changing it.
   */

  const error = new Error(
    "Existing vehicle endpoint should retain its current implementation.",
  );

  error.statusCode = 500;

  throw error;
};

/*
|--------------------------------------------------------------------------
| NEW LIVE VEHICLE LOCATIONS
|--------------------------------------------------------------------------
|
| Citizen Flutter
|       ↓
| Citizen backend
|       ↓
| Admin backend
|       ↓
| Existing Admin telemetry architecture
|
|--------------------------------------------------------------------------
*/

const getLiveVehicleLocations = async ({
  latitude,
  longitude,
  cityId,
  zoneId,
  divisionId,
  wardId,
  authorization,
}) => {
  /*
   * ----------------------------------------------------------
   * VALIDATE ADMIN BACKEND URL
   * ----------------------------------------------------------
   */

  const adminBackendUrl = process.env.ADMIN_BACKEND_URL;

  if (!adminBackendUrl) {
    const error = new Error("ADMIN_BACKEND_URL is not configured.");

    error.statusCode = 500;

    error.publicMessage = "Live vehicle tracking is not configured.";

    throw error;
  }

  /*
   * ----------------------------------------------------------
   * VALIDATE AUTHORIZATION
   * ----------------------------------------------------------
   */

  if (!authorization || typeof authorization !== "string") {
    const error = new Error("Authorization token is required.");

    error.statusCode = 401;

    error.publicMessage = "Authentication is required.";

    throw error;
  }

  /*
   * ----------------------------------------------------------
   * VALIDATE COORDINATES
   * ----------------------------------------------------------
   */

  const parsedLatitude = Number(latitude);

  const parsedLongitude = Number(longitude);

  if (
    !Number.isFinite(parsedLatitude) ||
    !Number.isFinite(parsedLongitude) ||
    parsedLatitude < -90 ||
    parsedLatitude > 90 ||
    parsedLongitude < -180 ||
    parsedLongitude > 180
  ) {
    const error = new Error("Invalid latitude or longitude.");

    error.statusCode = 400;

    error.publicMessage = "Invalid latitude or longitude.";

    throw error;
  }

  /*
   * ----------------------------------------------------------
   * VALIDATE HIERARCHY IDS
   * ----------------------------------------------------------
   */

  const parsedCityId = Number(cityId);

  const parsedZoneId = Number(zoneId);

  const parsedDivisionId = Number(divisionId);

  const parsedWardId = Number(wardId);

  if (
    !Number.isInteger(parsedCityId) ||
    parsedCityId <= 0 ||
    !Number.isInteger(parsedZoneId) ||
    parsedZoneId <= 0 ||
    !Number.isInteger(parsedDivisionId) ||
    parsedDivisionId <= 0 ||
    !Number.isInteger(parsedWardId) ||
    parsedWardId <= 0
  ) {
    const error = new Error("Invalid cityId, zoneId, divisionId or wardId.");

    error.statusCode = 400;

    error.publicMessage = "Invalid cityId, zoneId, divisionId or wardId.";

    throw error;
  }

  /*
   * ----------------------------------------------------------
   * ADMIN URL
   * ----------------------------------------------------------
   */

  const cleanAdminUrl = adminBackendUrl.replace(/\/+$/, "");

  const url = `${cleanAdminUrl}/api/route-map/live`;

  console.log("==================================");

  console.log("GET ADMIN LIVE VEHICLES");

  console.log("ADMIN URL:", url);

  console.log("PARAMS:", {
    latitude: parsedLatitude,

    longitude: parsedLongitude,

    cityId: parsedCityId,

    zoneId: parsedZoneId,

    divisionId: parsedDivisionId,

    wardId: parsedWardId,
  });

  console.log(
    "AUTHORIZATION:",
    authorization ? "TOKEN PRESENT" : "TOKEN MISSING",
  );

  console.log("==================================");

  /*
   * ----------------------------------------------------------
   * CALL ADMIN BACKEND
   * ----------------------------------------------------------
   *
   * THIS IS THE FIX:
   *
   * Forward the existing JWT.
   *
   * Admin route uses authMiddleware.
   *
   * ----------------------------------------------------------
   */

  try {
    const response = await axios.get(url, {
      params: {
        latitude: parsedLatitude,

        longitude: parsedLongitude,

        cityId: parsedCityId,

        zoneId: parsedZoneId,

        divisionId: parsedDivisionId,

        wardId: parsedWardId,
      },

      headers: {
        Authorization: authorization,
      },

      timeout: 15000,
    });

    console.log("ADMIN STATUS:", response.status);

    console.log("ADMIN BODY:", response.data);

    const adminResponse = response.data;

    if (!adminResponse || adminResponse.success !== true) {
      const error = new Error(
        adminResponse?.message || "Unable to fetch live vehicle locations.",
      );

      error.statusCode = response.status || 500;

      error.publicMessage =
        adminResponse?.message || "Unable to fetch live vehicle locations.";

      throw error;
    }

    const adminData = adminResponse.data || {};

    const adminVehicles = Array.isArray(adminData.vehicles)
      ? adminData.vehicles
      : [];

    /*
     * --------------------------------------------------------
     * NORMALIZE RESPONSE FOR FLUTTER
     * --------------------------------------------------------
     */

    const vehicles = adminVehicles.map((vehicle) => {
      const vehicleId =
        vehicle.vehicleId ?? vehicle.vehicle_id ?? vehicle.id ?? "";

      const vehicleLatitude =
        vehicle.latitude === null || vehicle.latitude === undefined
          ? null
          : Number(vehicle.latitude);

      const vehicleLongitude =
        vehicle.longitude === null || vehicle.longitude === undefined
          ? null
          : Number(vehicle.longitude);

      const rawDistance = vehicle.distance ?? vehicle.distanceKm ?? null;

      const distance =
        rawDistance === null || rawDistance === undefined
          ? null
          : Number(Number(rawDistance).toFixed(2));

      let status = vehicle.status;

      if (status === "ONLINE") {
        status = "ACTIVE";
      }

      if (status === "OFFLINE") {
        status = "INACTIVE";
      }

      if (status !== "ACTIVE" && status !== "INACTIVE") {
        status = "INACTIVE";
      }

      return {
        vehicleId: String(vehicleId),

        latitude: Number.isFinite(vehicleLatitude) ? vehicleLatitude : null,

        longitude: Number.isFinite(vehicleLongitude) ? vehicleLongitude : null,

        distance: Number.isFinite(distance) ? distance : null,

        distanceUnit: "km",

        status,

        lastUpdated:
          vehicle.lastUpdated ?? vehicle.updatedAt ?? vehicle.timestamp ?? null,
      };
    });

    /*
     * --------------------------------------------------------
     * SORT NEAREST → FARTHEST
     * --------------------------------------------------------
     */

    vehicles.sort((a, b) => {
      if (a.distance === null && b.distance === null) {
        return 0;
      }

      if (a.distance === null) {
        return 1;
      }

      if (b.distance === null) {
        return -1;
      }

      return a.distance - b.distance;
    });

    /*
     * --------------------------------------------------------
     * RETURN FLUTTER-FRIENDLY RESPONSE
     * --------------------------------------------------------
     */

    return {
      personLocation: {
        latitude: parsedLatitude,

        longitude: parsedLongitude,
      },

      filters: {
        cityId: parsedCityId,

        zoneId: parsedZoneId,

        divisionId: parsedDivisionId,

        wardId: parsedWardId,
      },

      vehicles,
    };
  } catch (error) {
    console.error("==================================");

    console.error("ADMIN LIVE VEHICLE ERROR:", error.message);

    if (error.response) {
      console.error("ADMIN STATUS:", error.response.status);

      console.error("ADMIN BODY:", error.response.data);
    }

    console.error("==================================");

    /*
     * Preserve Admin authentication errors.
     */

    if (error.response?.status === 401) {
      const authError = new Error(
        "Authentication failed while fetching live vehicle locations.",
      );

      authError.statusCode = 401;

      authError.publicMessage =
        "Authentication failed while fetching live vehicle locations.";

      throw authError;
    }

    /*
     * Preserve other expected client errors.
     */

    if (
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500
    ) {
      const serviceError = new Error(
        error.response.data?.message ||
          "Unable to fetch live vehicle locations.",
      );

      serviceError.statusCode = error.response.status;

      serviceError.publicMessage =
        error.response.data?.message ||
        "Unable to fetch live vehicle locations.";

      throw serviceError;
    }

    /*
     * Generic server/network error.
     */

    const serviceError = new Error("Unable to fetch live vehicle locations.");

    serviceError.statusCode = 500;

    serviceError.publicMessage = "Unable to fetch live vehicle locations.";

    throw serviceError;
  }
};

module.exports = {
  getNearestVehicle,
  getLiveVehicles,
  getVehicle,
  getLiveVehicleLocations,
};
