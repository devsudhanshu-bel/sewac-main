// =====================================================
// AUTH CONSTANTS
// =====================================================

export const AUTH_MESSAGES = {
  PHONE_REQUIRED:
    "Phone number is required.",

  INVALID_PHONE:
    "Invalid phone number.",

  DEVICE_ID_REQUIRED:
    "Valid device ID is required.",

  CITIZEN_NOT_FOUND:
    "Phone number does not exist.",

  CITIZEN_PROFILE_NOT_FOUND:
    "Citizen profile could not be found.",

  WARD_NOT_FOUND:
    "Citizen ward could not be resolved.",

  LOGIN_SUCCESS:
    "Login successful.",

  LOGOUT_SUCCESS:
    "Logout successful.",

  UNAUTHORIZED:
    "Unauthorized access.",

  INVALID_TOKEN:
    "Invalid or expired token.",

  INTERNAL_SERVER_ERROR:
    "Something went wrong. Please try again later.",
};


// =====================================================
// PHONE VALIDATION
// =====================================================
//
// Citizen app sends:
//
// 8660044936
//
// Database mapping stores:
//
// +918660044936
//
// =====================================================

export const PHONE_REGEX =
  /^[0-9]{10}$/;


// =====================================================
// DEVICE ID
// =====================================================

export const DEVICE_ID_MIN_LENGTH = 8;

export const DEVICE_ID_MAX_LENGTH = 255;