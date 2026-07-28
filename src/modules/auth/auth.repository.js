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

  /**
   * Find citizen by Dry RFID
   * @param {string} dryRFID
   * @returns {Promise<Object|null>}
   */
  async findCitizenByDryRFID(dryRFID) {
    return await helperPrisma.master_citizen_data.findFirst({
      where: {
        dryRFID,
      },
    });
  }

  /**
   * Find citizen by Wet RFID
   * @param {string} wetRFID
   * @returns {Promise<Object|null>}
   */
  async findCitizenByWetRFID(wetRFID) {
    return await helperPrisma.master_citizen_data.findFirst({
      where: {
        wetRFID,
      },
    });
  }
}

export default new AuthRepository();