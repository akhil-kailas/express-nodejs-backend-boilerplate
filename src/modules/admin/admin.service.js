import crypto from "crypto";
import mongoose from "mongoose";
import config from "../../config/config.js";
import { comparePassword } from "../../utils/bcrypt.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";
import { AppError } from "../../utils/appError.js";
import User from "../user/user.model.js";
import AdminSession from "./admin.model.js";

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildAdminTokens = async (adminEmail) => {
  const payload = { email: adminEmail };
  const accessToken = generateAccessToken(payload, "admin");
  const refreshToken = generateRefreshToken(payload, "admin");

  await AdminSession.updateOne(
    { email: adminEmail.toLowerCase() },
    { refreshTokenHash: hashToken(refreshToken) },
    { upsert: true },
  );

  return { accessToken, refreshToken };
};

export const adminLogin = async ({ email, password }) => {
  const { email: adminEmail, passwordHash } = config.admin;

  const emailMatches =
    typeof email === "string" &&
    email.trim().toLowerCase() === adminEmail.toLowerCase();

  // Same message for both failures so we don't reveal which one was wrong
  const passwordMatches =
    emailMatches &&
    typeof password === "string" &&
    (await comparePassword(password, passwordHash));

  if (!emailMatches || !passwordMatches) {
    throw new AppError("Invalid email or password", 401);
  }

  return buildAdminTokens(adminEmail);
};

export const refreshAdminToken = async (refreshToken) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken, "admin");
  } catch {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const session = await AdminSession.findOne({
    email: String(decoded.email).toLowerCase(),
  });

  if (!session || session.refreshTokenHash !== hashToken(refreshToken)) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  return buildAdminTokens(config.admin.email);
};

export const adminLogout = async (email) => {
  await AdminSession.deleteOne({ email: email.toLowerCase() });
};

const SORTABLE_FIELDS = [
  "createdAt",
  "updatedAt",
  "firstname",
  "lastname",
  "email",
];

export const getAllUsers = async ({
  search,
  firstname,
  lastname,
  email,
  phone,
  createdFrom,
  createdTo,
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  order = "desc",
}) => {
  const filter = {};

  if (search) {
    const regex = new RegExp(escapeRegex(search.trim()), "i");
    filter.$or = [
      { firstname: regex },
      { lastname: regex },
      { email: regex },
      { phone: regex },
    ];
  }

  if (firstname)
    filter.firstname = new RegExp(escapeRegex(firstname.trim()), "i");
  if (lastname) filter.lastname = new RegExp(escapeRegex(lastname.trim()), "i");
  if (email) filter.email = new RegExp(escapeRegex(email.trim()), "i");
  if (phone) filter.phone = new RegExp(escapeRegex(phone.trim()), "i");

  if (createdFrom || createdTo) {
    filter.createdAt = {};
    if (createdFrom) {
      const from = new Date(createdFrom);
      if (isNaN(from)) throw new AppError("Invalid createdFrom date", 400);
      filter.createdAt.$gte = from;
    }
    if (createdTo) {
      const to = new Date(createdTo);
      if (isNaN(to)) throw new AppError("Invalid createdTo date", 400);
      filter.createdAt.$lte = to;
    }
  }

  const safePage = Math.max(parseInt(page, 10) || 1, 1);
  const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  const sortField = SORTABLE_FIELDS.includes(sortBy) ? sortBy : "createdAt";
  const sortOrder = order === "asc" ? 1 : -1;

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit),
    User.countDocuments(filter),
  ]);

  return {
    users,
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
};

export const deleteUserById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid user id", 400);
  }
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new AppError("User not found", 404);
  return user;
};
