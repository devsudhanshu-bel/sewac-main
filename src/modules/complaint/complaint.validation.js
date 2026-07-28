import { COMPLAINT_MESSAGES } from "./complaint.constants.js";

const VALID_PRIORITIES = ["LOW", "MEDIUM", "HIGH"];

class ComplaintValidation {
  validateCreateComplaint(
    file,
    description,
    priority,
    latitude,
    longitude,
    address
  ) {
    if (!file) {
      throw new Error(COMPLAINT_MESSAGES.IMAGE_REQUIRED);
    }

    if (!description || description.trim() === "") {
      throw new Error(COMPLAINT_MESSAGES.DESCRIPTION_REQUIRED);
    }

    if (description.trim().length > 1000) {
      throw new Error(COMPLAINT_MESSAGES.DESCRIPTION_TOO_LONG);
    }

    if (!priority) {
      throw new Error(COMPLAINT_MESSAGES.PRIORITY_REQUIRED);
    }

    if (!VALID_PRIORITIES.includes(priority.trim().toUpperCase())) {
      throw new Error(COMPLAINT_MESSAGES.INVALID_PRIORITY);
    }

    if (latitude === undefined || latitude === null || latitude === "") {
      throw new Error(COMPLAINT_MESSAGES.LATITUDE_REQUIRED);
    }

    if (longitude === undefined || longitude === null || longitude === "") {
      throw new Error(COMPLAINT_MESSAGES.LONGITUDE_REQUIRED);
    }

    if (isNaN(Number(latitude)) || isNaN(Number(longitude))) {
      throw new Error(COMPLAINT_MESSAGES.INVALID_COORDINATES);
    }

    if (!address || address.trim() === "") {
      throw new Error(COMPLAINT_MESSAGES.ADDRESS_REQUIRED);
    }

    return true;
  }
}

export default new ComplaintValidation();