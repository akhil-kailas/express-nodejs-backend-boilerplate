import config from "../../config/config.js";
import { comparePassword } from "../../utils/bcrypt.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

export const adminLogin = async ({ email, password }) => {
  const { email: adminEmail, passwordHash } = config.admin;

  const emailMatches =
    typeof email === "string" &&
    email.trim().toLowerCase() === adminEmail.toLowerCase();

  if (!emailMatches) {
    throw createError("Invalid email", 401);
  }

  const passwordMatches = await comparePassword(password, passwordHash);
  if (!passwordMatches) {
    throw createError("Invalid password", 401);
  }

  const payload = { email: adminEmail };

  return {
    accessToken: generateAccessToken(payload, "admin"),
    refreshToken: generateRefreshToken(payload, "admin"),
  };
};
