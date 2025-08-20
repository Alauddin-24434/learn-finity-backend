import { Router } from "express"
import { AuthController } from "./auth.controller"
import { validateRequest } from "../../middleware/validateRequest"
import { loginValidationSchema, registerValidationSchema } from "./auth.validation"
import { upload } from "../../lib/cloudinary"

const router = Router()


//=============POST /api/auth/signup==========================================
router.post(
  "/signup",
  upload.single("avatar"),                // Handle avatar image upload to Cloudinary
  validateRequest(registerValidationSchema),   // Validate request body with schema
  AuthController.register                      // Controller logic for registration
)

/*
===============================================================================================
  POST /api/auth/login
  Logs in a user and returns tokens.
  Public access.
===============================================================================================
*/
router.post(
  "/login",
  validateRequest(loginValidationSchema),      // Validate login credentials
  AuthController.login
)

/*
=================================================================================================
  GET /api/auth/refreshToken
  Refreshes the access token using a valid refresh token.
  Public access (requires valid refresh token).
=================================================================================================
*/
router.get(
  "/refreshToken",
  AuthController.refreshAccessToken
)

/*
===================================================================================================
  POST /api/auth/logout
  Logs out the user and clears the refresh token cookie.
  Private access.
====================================================================================================
*/
router.post(
  "/logout",
  AuthController.logout
)

export const authRoutes = router
