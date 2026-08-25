import axios from "axios";

/*
|--------------------------------------------------------------------------
| LIVE VEHICLE CACHE
|--------------------------------------------------------------------------
|
| Admin owns telemetry.
| Citizen only requests the current live vehicle data.
|
| Flutter can poll frequently, so Citizen caches the Admin
| response for 5 seconds.
|--------------------------------------------------------------------------
*/

const LIVE_CACHE_TTL_MS = 5000;

const liveVehicleCache = new Map();

/*
|--------------------------------------------------------------------------
| CACHE KEY
|--------------------------------------------------------------------------
*/

const createCacheKey = ({ cityId, zoneId, divisionId, wardId }) => {
  return [cityId, zoneId, divisionId, wardId].join(":");
};

/*
|--------------------------------------------------------------------------
| GET CACHE
|--------------------------------------------------------------------------
*/

const getCachedLiveVehicles = (key) => {
  const cached = liveVehicleCache.get(key);

  if (!cached) {
    return null;
  }

  const age = Date.now() - cached.timestamp;

  if (age > LIVE_CACHE_TTL_MS) {
    liveVehicleCache.delete(key);

    return null;
  }

  return cached.data;
};

/*
|--------------------------------------------------------------------------
| SET CACHE
|--------------------------------------------------------------------------
*/

const setCachedLiveVehicles = (key, data) => {
  liveVehicleCache.set(key, {
    timestamp: Date.now(),
    data,
  });
};

/*
|--------------------------------------------------------------------------
| GET NEAREST VEHICLE
|--------------------------------------------------------------------------
*/

const getNearestVehicle = async ({ latitude, longitude }) => {
  if (
    latitude === undefined ||
    latitude === null ||
    longitude === undefined ||
    longitude === null
  ) {
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
   * Keep compatibility with the existing route.
   *
   * The live map uses getLiveVehicleLocations().
   */

  const error = new Error(
    "Nearest vehicle functionality is handled by the live vehicle endpoint.",
  );

  error.statusCode = 404;

  throw error;
};

/*
|--------------------------------------------------------------------------
| GET ALL LIVE VEHICLES
|--------------------------------------------------------------------------
*/

const getLiveVehicles = async () => {
  const error = new Error("Use the ward-filtered live vehicle endpoint.");

  error.statusCode = 400;

  error.publicMessage = "Use the ward-filtered live vehicle endpoint.";

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

  const error = new Error("Single vehicle lookup is not used by the live map.");

  error.statusCode = 404;

  throw error;
};

/*
|--------------------------------------------------------------------------
| SYNC LIVE LOCATIONS
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| Telemetry synchronization belongs to the Admin backend.
|
| Citizen must NOT maintain a separate telemetry worker.
|
| This function remains only for compatibility with any old
| imports that may still reference it.
|--------------------------------------------------------------------------
*/

const syncLiveLocations = async () => {
  return;
};

/*
|--------------------------------------------------------------------------
| GET LIVE VEHICLE LOCATIONS
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
   * ADMIN BACKEND URL
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
   * CITIZEN AUTHENTICATION
   * ----------------------------------------------------------
   *
   * Flutter's Citizen JWT is still required for the
   * Citizen endpoint.
   *
   * We DO NOT forward this JWT to Admin because Admin
   * has a different JWT_SECRET.
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
   * INTERNAL SECRET
   * ----------------------------------------------------------
   */

  const internalSecret = process.env.CITIZEN_INTERNAL_API_SECRET;

  if (!internalSecret) {
    const error = new Error("CITIZEN_INTERNAL_API_SECRET is not configured.");

    error.statusCode = 500;

    error.publicMessage = "Internal live-map authentication is not configured.";

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
   * VALIDATE HIERARCHY
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
   * CACHE KEY
   * ----------------------------------------------------------
   */

  const cacheKey = createCacheKey({
    cityId: parsedCityId,

    zoneId: parsedZoneId,

    divisionId: parsedDivisionId,

    wardId: parsedWardId,
  });

  /*
   * ----------------------------------------------------------
   * CACHE HIT
   * ----------------------------------------------------------
   */

  const cached = getCachedLiveVehicles(cacheKey);

  if (cached) {
    console.log("🚛 Live vehicle cache HIT:", cacheKey);

    return {
      ...cached,

      personLocation: {
        latitude: parsedLatitude,

        longitude: parsedLongitude,
      },
    };
  }

  console.log("🚛 Live vehicle cache MISS:", cacheKey);

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
    "CITIZEN AUTHORIZATION:",
    authorization ? "TOKEN PRESENT" : "TOKEN MISSING",
  );

  console.log(
    "INTERNAL AUTH:",
    internalSecret ? "SECRET PRESENT" : "SECRET MISSING",
  );

  console.log("==================================");

  /*
   * ----------------------------------------------------------
   * CALL ADMIN
   * ----------------------------------------------------------
   *
   * CRITICAL:
   *
   * DO NOT send:
   *
   * Authorization: Citizen JWT
   *
   * Send:
   *
   * X-Citizen-Internal-Secret
   *
   * because Admin validates this request using the shared
   * internal secret.
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
        "X-Citizen-Internal-Secret": internalSecret,
      },

      timeout: 15000,
    });

    console.log("ADMIN STATUS:", response.status);

    console.log("ADMIN BODY:", response.data);

    /*
     * --------------------------------------------------------
     * VALIDATE ADMIN RESPONSE
     * --------------------------------------------------------
     */

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
     * NORMALIZE VEHICLES
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
     * SORT BY DISTANCE
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
     * RESULT
     * --------------------------------------------------------
     */

    const result = {
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

    /*
     * --------------------------------------------------------
     * CACHE RESULT
     * --------------------------------------------------------
     */

    setCachedLiveVehicles(cacheKey, result);

    return result;
  } catch (error) {
    console.error("==================================");

    console.error("ADMIN LIVE VEHICLE ERROR:", error.message);

    if (error.response) {
      console.error("ADMIN STATUS:", error.response.status);

      console.error("ADMIN BODY:", error.response.data);
    }

    console.error("==================================");

    /*
     * --------------------------------------------------------
     * ADMIN 401
     * --------------------------------------------------------
     */

    if (error.response?.status === 401) {
      const authError = new Error(
        "Internal authentication failed while fetching live vehicle locations.",
      );

      authError.statusCode = 401;

      authError.publicMessage =
        "Internal authentication failed while fetching live vehicle locations.";

      throw authError;
    }

    /*
     * --------------------------------------------------------
     * ADMIN 429
     * --------------------------------------------------------
     */

    if (error.response?.status === 429) {
      const stale = liveVehicleCache.get(cacheKey);

      if (stale) {
        console.warn("⚠️ Admin returned 429. Using cached vehicle data.");

        return {
          ...stale.data,

          personLocation: {
            latitude: parsedLatitude,

            longitude: parsedLongitude,
          },
        };
      }

      const rateLimitError = new Error(
        "Live vehicle service is temporarily busy.",
      );

      rateLimitError.statusCode = 429;

      rateLimitError.publicMessage =
        "Live vehicle service is temporarily busy. Please try again shortly.";

      throw rateLimitError;
    }

    /*
     * --------------------------------------------------------
     * OTHER 4XX
     * --------------------------------------------------------
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
     * --------------------------------------------------------
     * SERVER / NETWORK ERROR
     * --------------------------------------------------------
     */

    const serviceError = new Error("Unable to fetch live vehicle locations.");

    serviceError.statusCode = 500;

    serviceError.publicMessage = "Unable to fetch live vehicle locations.";

    throw serviceError;
  }
};

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

export default {
  getNearestVehicle,
  getLiveVehicles,
  getVehicle,
  getLiveVehicleLocations,
  syncLiveLocations,
};
