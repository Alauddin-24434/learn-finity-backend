"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validateRequest_1 = require("../middleware/validateRequest");
const auth_validation_1 = require("../validations/auth.validation");
const cloudinary_1 = require("../lib/cloudinary");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               avatar: { type: string, format: binary }
 *     responses:
 *       201: { description: User registered successfully }
 *       400: { description: Validation error }
 */
router.post("/signup", cloudinary_1.upload.single("avatar"), // Handle optional avatar upload
(0, validateRequest_1.validateRequest)(auth_validation_1.registerValidationSchema), // Validate request body
auth_controller_1.AuthController.register // Call controller
);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user and get access/refresh tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: User logged in successfully }
 *       400: { description: Validation error or invalid credentials }
 */
router.post("/login", (0, validateRequest_1.validateRequest)(auth_validation_1.loginValidationSchema), // Validate credentials
auth_controller_1.AuthController.login // Call controller
);
/**
 * @swagger
 * /api/auth/refresh-token:
 *   get:
 *     summary: Refresh access token using refresh token
 *     tags: [Auth]
 *     responses:
 *       200: { description: Access token refreshed successfully }
 *       401: { description: Invalid or expired refresh token }
 */
router.post("/refresh-token", auth_controller_1.AuthController.refreshAccessToken);
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout a user and clear refresh token
 *     tags: [Auth]
 *     responses:
 *       200: { description: User logged out successfully }
 *       401: { description: User not authenticated }
 */
router.post("/logout", auth_controller_1.AuthController.logout);
exports.authRoutes = router;
