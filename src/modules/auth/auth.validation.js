import {
  AUTH_MESSAGES,
  PHONE_REGEX,
} from "./auth.constants.js";

export const validateLogin = (phoneNumber) => {
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

  return {
    valid: true,
  };
};