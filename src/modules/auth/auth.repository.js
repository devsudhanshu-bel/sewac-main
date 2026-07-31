import helperPrisma from "../../config/helperPrisma.js";

class AuthRepository {
  /**
   * Find citizen using phone number
   * @param {string} phoneNumber
   * @returns {Promise<Object|null>}
   */
  async findCitizenByPhone(phoneNumber) {
    return await helperPrisma.master_citizen_data.findFirst({
      where: {
        phoneNumber,
      },
      select: {
        id: true,
        personName: true,
        phoneNumber: true,
        drySlno: true,
        wetSlno: true,
      },
    });
  }
}

export default new AuthRepository();