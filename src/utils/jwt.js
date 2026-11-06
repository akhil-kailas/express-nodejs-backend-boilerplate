import jwt from "jsonwebtoken";
import config from "../config/config.js";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

const secrets = {
  admin: {
    access: config.admin.accessTokenSecret,
    refresh: config.admin.refreshTokenSecret,
  },
  user: {
    access: config.user.accessTokenSecret,
    refresh: config.user.refreshTokenSecret,
  },
};

const getSecret = (role, type) => {
  const secret = secrets[role]?.[type];
  if (!secret)
    throw new Error(`No ${type} secret configured for role: ${role}`);
  return secret;
};

export const generateAccessToken = (payload, role = "user") =>
  jwt.sign({ ...payload, role }, getSecret(role, "access"), {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

export const generateRefreshToken = (payload, role = "user") =>
  jwt.sign({ ...payload, role }, getSecret(role, "refresh"), {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

export const verifyAccessToken = (token, role = "user") =>
  jwt.verify(token, getSecret(role, "access"));

export const verifyRefreshToken = (token, role = "user") =>
  jwt.verify(token, getSecret(role, "refresh"));
