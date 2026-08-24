import {
  AUTH_MESSAGES,
  PHONE_REGEX,
} from "./auth.constants.js";


// =====================================================
// LOGIN VALIDATION
// =====================================================

export const validateLogin = (
  phoneNumber,
  deviceId
) => {

  // ===================================================
  // PHONE REQUIRED
  // ===================================================

  if (
    phoneNumber === undefined ||
    phoneNumber === null ||
    phoneNumber === ""
  ) {

    return {
      valid: false,

      message:
        AUTH_MESSAGES.PHONE_REQUIRED,
    };
  }


  // ===================================================
  // PHONE TYPE
  // ===================================================

  if (
    typeof phoneNumber !== "string"
  ) {

    return {
      valid: false,

      message:
        AUTH_MESSAGES.INVALID_PHONE,
    };
  }


  // ===================================================
  // NORMALIZE
  // ===================================================

  const normalizedPhone =
    phoneNumber.trim();


  // ===================================================
  // EXACTLY 10 DIGITS
  // ===================================================

  if (
    !PHONE_REGEX.test(
      normalizedPhone
    )
  ) {

    return {
      valid: false,

      message:
        AUTH_MESSAGES.INVALID_PHONE,
    };
  }


  // ===================================================
  // DEVICE ID
  // ===================================================

  if (
    !deviceId ||
    typeof deviceId !== "string" ||
    deviceId.length < 8 ||
    deviceId.length > 255
  ) {

    return {
      valid: false,

      message:
        "Valid device ID is required.",
    };
  }


  // ===================================================
  // DATABASE FORMAT
  // ===================================================

  const databasePhoneNumber =
    `+91${normalizedPhone}`;


  return {

    valid: true,

    phoneNumber:
      databasePhoneNumber,

    originalPhoneNumber:
      normalizedPhone,
  };
};