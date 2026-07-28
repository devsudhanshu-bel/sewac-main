import { COMPLAINT_MESSAGES } from "./complaint.constants.js";

const VALID_PRIORITIES = ["LOW", "MEDIUM", "HIGH"];

class ComplaintValidation {
  validateCreateComplaint(file, description, priority) {
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

    if (!VALID_PRIORITIES.includes(priority.toUpperCase())) {
      throw new Error(COMPLAINT_MESSAGES.INVALID_PRIORITY);
    }

    return true;
  }
}

export default new ComplaintValidation();