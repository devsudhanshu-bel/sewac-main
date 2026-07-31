// src/modules/auth/auth.constants.js

export const AUTH_MESSAGES = {
  PHONE_REQUIRED: "Phone number is required.",
  INVALID_PHONE: "Invalid phone number.",

  CITIZEN_NOT_FOUND: "Citizen not found.",

  LOGIN_SUCCESS: "Login successful.",
  LOGOUT_SUCCESS: "Logout successful.",

  UNAUTHORIZED: "Unauthorized access.",
  INVALID_TOKEN: "Invalid or expired token.",

  INTERNAL_SERVER_ERROR: "Something went wrong. Please try again later.",
};

export const PHONE_REGEX = /^[0-9]{10}$/;