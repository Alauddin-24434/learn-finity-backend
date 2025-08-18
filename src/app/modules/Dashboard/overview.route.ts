import express from "express";
import { authenticate } from "../../middleware/authenticate";
import { overviewDashboard } from "./overview.conroller";

const router = express.Router();

// Single route for both admin & user
router.get("/", authenticate, overviewDashboard);

export const dashboardRoute= router;
