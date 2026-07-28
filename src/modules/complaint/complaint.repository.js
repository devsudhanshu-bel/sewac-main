import sewacPrisma from "../../config/sewacPrisma.js";

class ComplaintRepository {
  async createComplaint(data) {
    return await sewacPrisma.complaints.create({
      data,
    });
  }

  async getComplaintsByPhoneNumber(phoneNumber) {
    return await sewacPrisma.complaints.findMany({
      where: {
        phone_number: phoneNumber,
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }
}

export default new ComplaintRepository();