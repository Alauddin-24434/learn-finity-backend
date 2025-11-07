import express, { Router } from "express";

import { authController } from "../controllers/auth.controllers";

const router: Router = express.Router();

router.post("/signup",authController.register);

router.post("/login",authController.login);

router.post("/refresh-token", authController.refreshAccessToken);

router.post("/logout", authController.logout);

export const authRoutes = router;
