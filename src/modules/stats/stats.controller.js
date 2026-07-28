import ApiResponse from "../../utils/apiResponse.js";
import statsService from "./stats.service.js";

class StatsController {
  async getAnalytics(req, res, next) {
    try {
      const { startDate, endDate } = req.query;

      const result =
        await statsService.getAnalytics(
          req.user.id,
          startDate,
          endDate
        );

      return res.status(200).json(
        new ApiResponse(
          200,
          result.message,
          result.data
        )
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new StatsController();
