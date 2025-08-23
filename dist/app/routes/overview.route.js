"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRoute = void 0;
// routes/overview.route.ts
const express_1 = __importDefault(require("express"));
const authenticate_1 = require("../middleware/authenticate");
const overview_conroller_1 = require("../controllers/overview.conroller");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard overview APIs for admin & user
 */
/**
 * @swagger
 * /api/overviews:
 *   get:
 *     summary: Get dashboard overview (admin & user)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 */
router.get("/", authenticate_1.authenticate, overview_conroller_1.overviewDashboard);
exports.dashboardRoute = router;
