"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRoute = void 0;
const express_1 = __importDefault(require("express"));
const authenticate_1 = require("../../middleware/authenticate");
const overview_conroller_1 = require("./overview.conroller");
const router = express_1.default.Router();
// Single route for both admin & user
router.get("/", authenticate_1.authenticate, overview_conroller_1.overviewDashboard);
exports.dashboardRoute = router;
