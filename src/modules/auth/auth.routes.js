import { Router } from "express";
import { healthCheck } from "./auth.controller.js";

const router = Router();

/**
 * @openapi
 * /api/v1/auth/health:
 *   get:
 *     summary: Auth module health check
 *     description: Confirms the auth module is up and responding.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Auth module is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 module:
 *                   type: string
 *                   example: auth
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2026-11-05T10:30:00.000Z
 */
router.get("/health", healthCheck);

export default router;
