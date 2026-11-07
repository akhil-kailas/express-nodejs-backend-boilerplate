import { Router } from "express";
import {
  adminLogin,
  adminRefresh,
  adminLogout,
  listUsers,
  removeUserById,
} from "./admin.controller.js";
import { authenticateAdmin } from "../../middlewares/auth.middleware.js";

const router = Router();

/**
 * @openapi
 * /api/v1/admin/login:
 *   post:
 *     summary: Admin Login
 *     description: Authenticates the admin and returns access and refresh tokens.
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email, example: admin@gmail.com }
 *               password: { type: string, example: admin }
 *     responses:
 *       200:
 *         description: Returns access and refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 accessToken: { type: string }
 *                 refreshToken: { type: string }
 *       400:
 *         description: Email or password missing
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", adminLogin);

/**
 * @openapi
 * /api/v1/admin/refresh:
 *   post:
 *     summary: Refresh admin tokens
 *     description: Exchange a valid admin refresh token for a new access token and refresh token.
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string, example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... }
 *     responses:
 *       200:
 *         description: New tokens issued
 *       400:
 *         description: Refresh token missing
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post("/refresh", adminRefresh);

/**
 * @openapi
 * /api/v1/admin/logout:
 *   post:
 *     summary: Admin Logout
 *     description: Revokes the admin refresh token.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out
 *       401:
 *         description: Unauthorized
 */
router.post("/logout", authenticateAdmin, adminLogout);

/**
 * @openapi
 * /api/v1/admin/users:
 *   get:
 *     summary: Get all users (with filters)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: query, name: search, schema: { type: string }, description: Matches firstname, lastname, email or phone }
 *       - { in: query, name: firstname, schema: { type: string } }
 *       - { in: query, name: lastname, schema: { type: string } }
 *       - { in: query, name: email, schema: { type: string } }
 *       - { in: query, name: phone, schema: { type: string } }
 *       - { in: query, name: createdFrom, schema: { type: string, format: date } }
 *       - { in: query, name: createdTo, schema: { type: string, format: date } }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 10, maximum: 100 } }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [createdAt, updatedAt, firstname, lastname, email], default: createdAt }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc], default: desc }
 *     responses:
 *       200:
 *         description: Paginated list of users
 *       400:
 *         description: Invalid filter value
 *       401:
 *         description: Unauthorized
 */
router.get("/users", authenticateAdmin, listUsers);

/**
 * @openapi
 * /api/v1/admin/users/{id}:
 *   delete:
 *     summary: Delete user by id
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User deleted
 *       400:
 *         description: Invalid user id
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.delete("/users/:id", authenticateAdmin, removeUserById);

export default router;
