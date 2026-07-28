import authRepository from "./auth.repository.js";
import { AUTH_MESSAGES } from "./auth.constants.js";
import { maskName } from "../../utils/string.utils.js";
import { generateToken } from "../../utils/jwt.js";

class AuthService {
  /**
   * Login using phone number
   * @param {string} phoneNumber
   * @returns {Promise<Object>}
   */
  async login(phoneNumber) {
    const citizen = await authRepository.findCitizenByPhone(phoneNumber);

    if (!citizen) {
      return {
        success: false,
        message: AUTH_MESSAGES.CITIZEN_NOT_FOUND,
        data: null,
      };
    }

    const token = generateToken({
      id: citizen.id,
      phoneNumber: citizen.phoneNumber,
    });

    return {
      success: true,
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
      data: {
        token,
        citizen: {
          id: citizen.id,
          personName: maskName(citizen.personName),
          phoneNumber: citizen.phoneNumber,
          drySlno: citizen.drySlno,
          wetSlno: citizen.wetSlno,
        },
      },
    };
  }
}

export default new AuthService();