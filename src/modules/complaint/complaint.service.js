import complaintRepository from "./complaint.repository.js";
import complaintValidation from "./complaint.validation.js";
import { COMPLAINT_MESSAGES } from "./complaint.constants.js";

import uploadImage from "../../utils/cloudinaryUpload.js";

class ComplaintService {
  async createComplaint(
    user,
    file,
    description,
    priority,
    latitude,
    longitude,
    address
  ) {
    complaintValidation.validateCreateComplaint(
      file,
      description,
      priority,
      latitude,
      longitude,
      address
    );

    const { imageUrl } = await uploadImage(
      file,
      "sewac/complaints"
    );

    const complaint = await complaintRepository.createComplaint({
      phone_number: user.phoneNumber,
      image_url: imageUrl,
      description: description.trim(),
      priority: priority.toUpperCase(),
      latitude: Number(latitude),
      longitude: Number(longitude),
      address: address.trim(),
    });

    return {
      success: true,
      message: COMPLAINT_MESSAGES.COMPLAINT_CREATED,
      data: complaint,
    };
  }

  async getComplaints(user) {
    const complaints =
      await complaintRepository.getComplaintsByPhoneNumber(
        user.phoneNumber
      );

    return {
      success: true,
      message: COMPLAINT_MESSAGES.COMPLAINTS_FETCHED,
      data: complaints,
    };
  }
}

export default new ComplaintService();