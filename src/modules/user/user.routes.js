import { Router } from "express";
import {
  userRegister,
  userLogin,
  userRefresh,
  userLogout,
  getUser,
  patchUser,
  removeUser,
} from "./user.controller.js";
import { authenticateUser } from "../../middlewares/auth.middleware.js";

const router = Router();

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @openapi
 * /api/v1/user/register:
 *   post:
 *     summary: User Register
 *     description: Create User Account.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstname, lastname, password]
 *             properties:
 *               firstname: { type: string, example: firstname }
 *               lastname: { type: string, example: lastname }
 *               phone: { type: string, example: "1234567890" }
 *               email: { type: string, format: email, example: user@gmail.com }
 *               password: { type: string, example: user123 }
 *     responses:
 *       201:
 *         description: User Created
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 */
router.post("/register", userRegister);

/**
 * @openapi
 * /api/v1/user/login:
 *   post:
 *     summary: User Login
 *     description: Login with email or phone and password.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               email: { type: string, format: email, example: user@gmail.com }
 *               phone: { type: string, example: "1234567890" }
 *               password: { type: string, example: user123 }
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", userLogin);

/**
 * @openapi
 * /api/v1/user/refresh:
 *   post:
 *     summary: Refresh tokens
 *     description: Exchange a valid refresh token for a new access token and refresh token.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: New tokens issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 accessToken: { type: string }
 *                 refreshToken: { type: string }
 *       400:
 *         description: Refresh token missing
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post("/refresh", userRefresh);

/**
 * @openapi
 * /api/v1/user/logout:
 *   post:
 *     summary: Logout
 *     description: Revokes the current refresh token.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out
 *       401:
 *         description: Unauthorized
 */
router.post("/logout", authenticateUser, userLogout);

/**
 * @openapi
 * /api/v1/user/me:
 *   get:
 *     summary: Get logged-in user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get("/me", authenticateUser, getUser);

/**
 * @openapi
 * /api/v1/user/me:
 *   patch:
 *     summary: Update logged-in user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname: { type: string }
 *               lastname: { type: string }
 *               phone: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email or phone already in use
 */
router.patch("/me", authenticateUser, patchUser);

/**
 * @openapi
 * /api/v1/user/me:
 *   delete:
 *     summary: Delete logged-in user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete("/me", authenticateUser, removeUser);

export default router;
