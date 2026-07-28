export const COMPLAINT_MESSAGES = {
  // Success
  COMPLAINT_CREATED: "Complaint submitted successfully.",
  COMPLAINTS_FETCHED: "Complaints fetched successfully.",
  COMPLAINT_FETCHED: "Complaint fetched successfully.",
  COMPLAINT_UPDATED: "Complaint updated successfully.",
  COMPLAINT_DELETED: "Complaint deleted successfully.",
  COMPLAINT_STATUS_UPDATED: "Complaint status updated successfully.",

  // Validation
  IMAGE_REQUIRED: "Complaint image is required.",

  DESCRIPTION_REQUIRED: "Complaint description is required.",
  DESCRIPTION_TOO_LONG:
    "Complaint description cannot exceed 1000 characters.",

  PRIORITY_REQUIRED: "Complaint priority is required.",
  INVALID_PRIORITY: "Invalid complaint priority.",

  STATUS_REQUIRED: "Complaint status is required.",
  INVALID_STATUS: "Invalid complaint status.",

  LATITUDE_REQUIRED: "Complaint latitude is required.",
  LONGITUDE_REQUIRED: "Complaint longitude is required.",
  ADDRESS_REQUIRED: "Complaint address is required.",

  INVALID_COORDINATES: "Invalid complaint location coordinates.",

  // Errors
  COMPLAINT_NOT_FOUND: "Complaint not found.",
  INTERNAL_SERVER_ERROR: "Something went wrong.",
};