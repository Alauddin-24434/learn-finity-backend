"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controllers_1 = require("../controllers/auth.controllers");
const router = express_1.default.Router();
router.post("/signup", auth_controllers_1.authController.register);
router.post("/login", auth_controllers_1.authController.login);
router.post("/refresh-token", auth_controllers_1.authController.refreshAccessToken);
router.post("/logout", auth_controllers_1.authController.logout);
exports.authRoutes = router;
//# sourceMappingURL=auth.routes.js.map