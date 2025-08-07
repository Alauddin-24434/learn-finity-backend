import express from "express";
import { authenticate } from "../../middleware/authenticate";
import { dashboardOverviewController } from "./overview.controller";

const router = express.Router();

router.get("/overviews", authenticate, dashboardOverviewController);

export const dashboardRoutes= router;
