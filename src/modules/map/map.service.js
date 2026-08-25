import axios from "axios";

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
   * Keep the existing nearest-vehicle
   * implementation if your project already
   * has one.
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
*/

const getLiveVehicles = async () => {
  /*
   * Keep the existing implementation if
   * this endpoint is already used elsewhere.
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
   * Keep the existing implementation if
   * this endpoint is already used elsewhere.
   */

  const error = new Error(
    "Existing vehicle endpoint should retain its current implementation.",
  );

  error.statusCode = 500;

  throw error;
};

/*
|--------------------------------------------------------------------------
| GET LIVE VEHICLE LOCATIONS
|--------------------------------------------------------------------------
|
| Flutter
|     ↓
| Citizen Backend
|     ↓
| Admin Backend
|     ↓
| Admin telemetry/database
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
   * AUTHORIZATION
   * ----------------------------------------------------------
   *
   * The Citizen controller passes:
   *
   * req.headers.authorization
   *
   * Example:
   *
   * Bearer eyJhbGci...
   *
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
   * COORDINATES
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
   * HIERARCHY IDS
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
   * ADMIN ENDPOINT
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
   * IMPORTANT:
   * Forward the Citizen JWT.
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

    /*
     * --------------------------------------------------------
     * ADMIN RESPONSE
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

      /*
       * Normalize status.
       */

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
     * RETURN CITIZEN RESPONSE
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
     * --------------------------------------------------------
     * ADMIN 401
     * --------------------------------------------------------
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
     * --------------------------------------------------------
     * ADMIN 4XX
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
     * NETWORK / SERVER ERROR
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
| DEFAULT EXPORT
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| map.controller.js uses:
|
| import mapService from "./map.service.js";
|
| Therefore this MUST be a default ESM export.
|--------------------------------------------------------------------------
*/

export default {
  getNearestVehicle,
  getLiveVehicles,
  getVehicle,
  getLiveVehicleLocations,
};
