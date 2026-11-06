import * as authService from "./auth.service.js";

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const { accessToken, refreshToken } = await authService.adminLogin({
      email,
      password,
    });

    return res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};
