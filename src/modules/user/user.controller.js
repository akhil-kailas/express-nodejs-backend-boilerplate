import {
  registerUser,
  loginUser,
  refreshUserToken,
  logoutUser,
  getUserById,
  updateUser,
  deleteUser,
} from "./user.service.js";

const handleError = (error, res, next) => {
  if (error.statusCode) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }
  if (error.name === "ValidationError") {
    return res.status(400).json({ success: false, message: error.message });
  }
  next(error);
};

export const userRegister = async (req, res, next) => {
  try {
    const { firstname, lastname, phone, email, password } = req.body || {};

    if (!firstname || !lastname || !password) {
      return res.status(400).json({
        success: false,
        message: "Firstname, lastname and password are required",
      });
    }

    if (!phone && !email) {
      return res.status(400).json({
        success: false,
        message: "Either phone or email is required",
      });
    }

    const { user, accessToken, refreshToken } = await registerUser({
      firstname,
      lastname,
      phone,
      email,
      password,
    });

    return res.status(201).json({
      success: true,
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    handleError(error, res, next);
  }
};

export const userLogin = async (req, res, next) => {
  try {
    const { phone, email, password } = req.body || {};

    if (!password || (!phone && !email)) {
      return res.status(400).json({
        success: false,
        message: "Email or phone and password are required",
      });
    }

    const { user, accessToken, refreshToken } = await loginUser({
      phone,
      email,
      password,
    });

    return res.status(200).json({
      success: true,
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    handleError(error, res, next);
  }
};

export const userRefresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body || {};

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    const tokens = await refreshUserToken(refreshToken);

    return res.status(200).json({ success: true, ...tokens });
  } catch (error) {
    handleError(error, res, next);
  }
};

export const userLogout = async (req, res, next) => {
  try {
    await logoutUser(req.user.id);
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    handleError(error, res, next);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);
    return res.status(200).json({ success: true, user });
  } catch (error) {
    handleError(error, res, next);
  }
};

export const patchUser = async (req, res, next) => {
  try {
    const { firstname, lastname, phone, email, password } = req.body || {};

    if (
      firstname === undefined &&
      lastname === undefined &&
      phone === undefined &&
      email === undefined &&
      password === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "No fields provided to update",
      });
    }

    const user = await updateUser(req.user.id, {
      firstname,
      lastname,
      phone,
      email,
      password,
    });

    return res.status(200).json({ success: true, user });
  } catch (error) {
    handleError(error, res, next);
  }
};

export const removeUser = async (req, res, next) => {
  try {
    await deleteUser(req.user.id);
    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    handleError(error, res, next);
  }
};
