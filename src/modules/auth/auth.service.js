import authRepository from "./auth.repository.js";

import { AUTH_MESSAGES } from "./auth.constants.js";

import { maskName } from "../../utils/string.utils.js";

import { generateToken } from "../../utils/jwt.js";

import redisService from "../redis/redis.service.js";

import redisKeys from "../redis/redis.keys.js";

class AuthService {
  /**
   * Login using phone number + device ID
   */
  async login(phoneNumber, deviceId) {
    // =========================================
    // 1. CHECK TEMPORARY DEVICE LOCK
    // =========================================

    const lockKey = redisKeys.deviceLock(deviceId);

    const isLocked = await redisService.exists(lockKey);

    if (isLocked) {
      return {
        success: false,
        statusCode: 429,
        message: "This device is temporarily locked. Please try again later.",
        data: null,
      };
    }

    // =========================================
    // 2. FIND CITIZEN
    // =========================================

    const citizen = await authRepository.findCitizenByPhone(phoneNumber);

    if (!citizen) {
      return {
        success: false,
        statusCode: 404,
        message: AUTH_MESSAGES.CITIZEN_NOT_FOUND,
        data: null,
      };
    }

    // =========================================
    // 3. CHECK TRUSTED DEVICE
    // =========================================

    const trustedKey = redisKeys.deviceTrusted(deviceId, phoneNumber);

    const isTrusted = await redisService.exists(trustedKey);

    // =========================================
    // 4. TRUSTED DEVICE → NORMAL LOGIN
    // =========================================

    if (isTrusted) {
      return this.createCitizenSession(citizen, deviceId);
    }

    // =========================================
    // 5. CHECK SUSPICIOUS DEVICE
    // =========================================

    const suspiciousKey = redisKeys.deviceSuspicious(deviceId);

    const isSuspicious = await redisService.exists(suspiciousKey);

    if (isSuspicious) {
      return {
        success: false,
        statusCode: 403,
        message:
          "This device is temporarily restricted from registering another citizen.",
        data: null,
      };
    }

    // =========================================
    // 6. TRACK DISTINCT PHONE NUMBERS
    // =========================================

    const devicePhonesKey = redisKeys.devicePhones(deviceId);

    const wasAlreadyTracked = await redisService.addToSet(
      devicePhonesKey,
      phoneNumber,
    );

    // =========================================
    // START 5-DAY ABUSE WINDOW
    // =========================================

    if (wasAlreadyTracked === 1) {
      await redisService.setExpiry(devicePhonesKey, 5 * 24 * 60 * 60);
    }

    const distinctPhoneCount = await redisService.setSize(devicePhonesKey);

    // =========================================
    // 7. MORE THAN 3 CITIZENS
    // → SUSPICIOUS + 2-HOUR LOCK
    // =========================================

    if (distinctPhoneCount > 3) {
      // Device remains suspicious
      // for 5 days.
      await redisService.set(suspiciousKey, true, 5 * 24 * 60 * 60);

      // Immediate temporary lock
      // for 2 hours.
      await redisService.set(lockKey, true, 2 * 60 * 60);

      return {
        success: false,
        statusCode: 429,
        message:
          "Too many citizen accounts were attempted from this device. Device locked for 2 hours.",
        data: null,
      };
    }

    // =========================================
    // 8. CHECK PENDING ENROLLMENT
    // =========================================

    const enrollmentKey = redisKeys.deviceEnrollment(deviceId, phoneNumber);

    const enrollment = await redisService.get(enrollmentKey);

    // =========================================
    // 9. FIRST TIME
    // → START 30-SECOND TIMER
    // =========================================

    if (!enrollment) {
      const expiresAt = Date.now() + 30 * 1000;

      // Keep Redis record for 31 minutes.
      // This gives us a 1-minute buffer
      // after the 30-minute timer completes.
      await redisService.set(
        enrollmentKey,
        {
          status: "PENDING",
          expiresAt,
        },
        60,
      );

      return {
        success: true,
        statusCode: 202,
        message:
          "New device detected. Please wait 30 seconds before logging in.",
        data: {
          status: "DEVICE_ENROLLMENT_PENDING",

          expiresAt,

          remainingSeconds: 30,
        },
      };
    }

    // =========================================
    // 10. CALCULATE REMAINING TIME
    // =========================================

    const remainingSeconds = Math.max(
      0,
      Math.ceil((enrollment.expiresAt - Date.now()) / 1000),
    );

    // =========================================
    // 11. TIMER STILL RUNNING
    // =========================================

    if (remainingSeconds > 0) {
      return {
        success: true,
        statusCode: 202,
        message: "Device enrollment is still in progress.",
        data: {
          status: "DEVICE_ENROLLMENT_PENDING",

          expiresAt: enrollment.expiresAt,

          remainingSeconds,
        },
      };
    }

    // =========================================
    // 12. TIMER FINISHED
    // → TRUST DEVICE FOR 30 DAYS
    // =========================================

    await redisService.set(trustedKey, true, 30 * 24 * 60 * 60);

    // Remove completed enrollment
    await redisService.delete(enrollmentKey);

    // =========================================
    // 13. CREATE SESSION
    // =========================================

    return this.createCitizenSession(citizen, deviceId);
  }

  /**
   * Create JWT session for citizen + device
   */
  async createCitizenSession(citizen, deviceId) {
    const token = generateToken({
      id: citizen.id,

      phoneNumber: citizen.phoneNumber,

      deviceId,
    });

    // Device-specific session
    await redisService.set(
      redisKeys.authToken(citizen.id, deviceId),
      token,
      86400,
    );

    return {
      success: true,
      statusCode: 200,
      message: AUTH_MESSAGES.LOGIN_SUCCESS,

      data: {
        token,

        citizen: {
          id: citizen.id,

          personName: maskName(citizen.personName),

          phoneNumber: citizen.phoneNumber,

          drySlno: citizen.drySlno,

          wetSlno: citizen.wetSlno,

          // =========================================
          // EXISTING CITIZEN GEOGRAPHIC HIERARCHY
          // =========================================

          cityId: citizen.cityId,

          zoneId: citizen.zoneId,

          divisionId: citizen.divisionId,

          wardId: citizen.wardId,
        },
      },
    };
  }

  /**
   * Logout
   * Removes JWT session from Redis
   */
  async logout(user) {
    if (user?.id && user?.deviceId) {
      await redisService.delete(redisKeys.authToken(user.id, user.deviceId));
    }

    return {
      success: true,
      statusCode: 200,
      message: AUTH_MESSAGES.LOGOUT_SUCCESS,
      data: null,
    };
  }

  /**
   * Get logged-in citizen
   */
  async me(user) {
    const citizen = await authRepository.findCitizenByPhone(user.phoneNumber);

    if (!citizen) {
      return {
        success: false,
        statusCode: 404,
        message: AUTH_MESSAGES.CITIZEN_NOT_FOUND,
        data: null,
      };
    }

    return {
      success: true,
      statusCode: 200,
      message: AUTH_MESSAGES.LOGIN_SUCCESS,

      data: {
        citizen: {
          id: citizen.id,

          personName: maskName(citizen.personName),

          phoneNumber: citizen.phoneNumber,

          drySlno: citizen.drySlno,

          wetSlno: citizen.wetSlno,

          // =========================================
          // EXISTING CITIZEN GEOGRAPHIC HIERARCHY
          // =========================================

          cityId: citizen.cityId,

          zoneId: citizen.zoneId,

          divisionId: citizen.divisionId,

          wardId: citizen.wardId,
        },
      },
    };
  }
}

export default new AuthService();
