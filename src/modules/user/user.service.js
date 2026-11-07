import User from "./user.model.js";
import { hashPassword, comparePassword } from "../../utils/bcrypt.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";
import { AppError } from "../../utils/appError.js";

const buildTokens = async (user) => {
  const payload = { id: user._id.toString() };
  const accessToken = generateAccessToken(payload, "user");
  const refreshToken = generateRefreshToken(payload, "user");

  await User.updateOne({ _id: user._id }, { refreshToken });

  return { accessToken, refreshToken };
};

const handleDuplicateError = (error) => {
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || "field";
    throw new AppError(`${field} already exists`, 409);
  }
  throw error;
};

export const registerUser = async ({
  firstname,
  lastname,
  phone,
  email,
  password,
}) => {
  const conditions = [];
  if (email) conditions.push({ email: email.toLowerCase().trim() });
  if (phone) conditions.push({ phone: phone.trim() });

  const existing = await User.findOne({ $or: conditions });
  if (existing) {
    throw new AppError("User with this email or phone already exists", 409);
  }

  try {
    const user = await User.create({
      firstname,
      lastname,
      phone: phone || undefined,
      email: email || undefined,
      password: await hashPassword(password),
    });

    return { user, ...(await buildTokens(user)) };
  } catch (error) {
    handleDuplicateError(error);
  }
};

export const loginUser = async ({ email, phone, password }) => {
  const query = email
    ? { email: email.toLowerCase().trim() }
    : { phone: phone.trim() };

  const user = await User.findOne(query).select("+password");
  if (!user) throw new AppError("Invalid credentials", 401);

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new AppError("Invalid credentials", 401);

  return { user, ...(await buildTokens(user)) };
};

export const refreshUserToken = async (refreshToken) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken, "user");
  } catch {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const user = await User.findById(decoded.id).select("+refreshToken");

  if (!user || user.refreshToken !== refreshToken) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  return buildTokens(user);
};

export const logoutUser = async (id) => {
  await User.updateOne({ _id: id }, { $unset: { refreshToken: 1 } });
};

export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new AppError("User not found", 404);
  return user;
};

export const updateUser = async (id, updates) => {
  const user = await User.findById(id).select("+password");
  if (!user) throw new AppError("User not found", 404);

  const { firstname, lastname, phone, email, password } = updates;

  if (firstname !== undefined) user.firstname = firstname;
  if (lastname !== undefined) user.lastname = lastname;
  if (phone !== undefined) user.phone = phone || undefined;
  if (email !== undefined) user.email = email || undefined;
  if (password) {
    user.password = await hashPassword(password);
    user.refreshToken = undefined; // force re-login after password change
  }

  if (!user.phone && !user.email) {
    throw new AppError("Either phone or email is required", 400);
  }

  try {
    await user.save();
  } catch (error) {
    handleDuplicateError(error);
  }

  return user;
};

export const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new AppError("User not found", 404);
  return user;
};
