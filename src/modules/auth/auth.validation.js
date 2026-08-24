import { AUTH_MESSAGES, PHONE_REGEX } from "./auth.constants.js";

export const validateLogin = (phoneNumber, deviceId) => {
  if (!phoneNumber) {
    return {
      valid: false,
      message: AUTH_MESSAGES.PHONE_REQUIRED,
    };
  }

  if (!PHONE_REGEX.test(phoneNumber)) {
    return {
      valid: false,
      message: AUTH_MESSAGES.INVALID_PHONE,
    };
  }

  if (
    !deviceId ||
    typeof deviceId !== "string" ||
    deviceId.length < 8 ||
    deviceId.length > 255
  ) {
    return {
      valid: false,
      message: "Valid device ID is required.",
    };
  }

  return {
    valid: true,
  };
};
