"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validateRequest_1 = require("../../middleware/validateRequest");
const auth_validation_1 = require("./auth.validation");
const cloudinary_1 = require("../../lib/cloudinary");
const router = (0, express_1.Router)();
//=============POST /api/auth/signup==========================================
router.post("/signup", cloudinary_1.upload.single("avatar"), // Handle avatar image upload to Cloudinary
(0, validateRequest_1.validateRequest)(auth_validation_1.registerValidationSchema), // Validate request body with schema
auth_controller_1.AuthController.register // Controller logic for registration
);
/*
===============================================================================================
  POST /api/auth/login
  Logs in a user and returns tokens.
  Public access.
===============================================================================================
*/
router.post("/login", (0, validateRequest_1.validateRequest)(auth_validation_1.loginValidationSchema), // Validate login credentials
auth_controller_1.AuthController.login);
/*
=================================================================================================
  GET /api/auth/refreshToken
  Refreshes the access token using a valid refresh token.
  Public access (requires valid refresh token).
=================================================================================================
*/
router.get("/refreshToken", auth_controller_1.AuthController.refreshAccessToken);
/*
===================================================================================================
  POST /api/auth/logout
  Logs out the user and clears the refresh token cookie.
  Private access.
====================================================================================================
*/
router.post("/logout", auth_controller_1.AuthController.logout);
exports.authRoutes = router;
