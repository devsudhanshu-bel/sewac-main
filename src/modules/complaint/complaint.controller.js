import complaintService from "./complaint.service.js";

class ComplaintController {
  async createComplaint(req, res, next) {
    try {
      const {
        description,
        priority,
        latitude,
        longitude,
        address,
      } = req.body;

      const result = await complaintService.createComplaint(
        req.user,
        req.file,
        description,
        priority,
        latitude,
        longitude,
        address
      );

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getComplaints(req, res, next) {
    try {
      const result = await complaintService.getComplaints(req.user);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new ComplaintController();