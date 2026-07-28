import authService from "./auth.service.js";
import { validateLogin } from "./auth.validation.js";

class AuthController {
  /**
   * POST /api/citizen/auth/login
   */
  async login(req, res, next) {
    try {
      const { phoneNumber } = req.body;

      // Validate request
      const validation = validateLogin(phoneNumber);

      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: validation.message,
        });
      }

      // Call service
      const response = await authService.login(phoneNumber);

      if (!response.success) {
        return res.status(404).json(response);
      }

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();