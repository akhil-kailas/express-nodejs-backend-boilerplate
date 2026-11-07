import {
  adminLogin as adminLoginService,
  refreshAdminToken,
  adminLogout as adminLogoutService,
  getAllUsers,
  deleteUserById,
} from "./admin.service.js";

const handleError = (error, res, next) => {
  if (error.statusCode) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }
  next(error);
};

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const { accessToken, refreshToken } = await adminLoginService({
      email,
      password,
    });

    return res.status(200).json({ success: true, accessToken, refreshToken });
  } catch (error) {
    handleError(error, res, next);
  }
};

export const adminRefresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body || {};

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    const tokens = await refreshAdminToken(refreshToken);
    return res.status(200).json({ success: true, ...tokens });
  } catch (error) {
    handleError(error, res, next);
  }
};

export const adminLogout = async (req, res, next) => {
  try {
    await adminLogoutService(req.admin.email);
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    handleError(error, res, next);
  }
};

export const listUsers = async (req, res, next) => {
  try {
    const { users, pagination } = await getAllUsers(req.query);
    return res.status(200).json({ success: true, users, pagination });
  } catch (error) {
    handleError(error, res, next);
  }
};

export const removeUserById = async (req, res, next) => {
  try {
    await deleteUserById(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    handleError(error, res, next);
  }
};
