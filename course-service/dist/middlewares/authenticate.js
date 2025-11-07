"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsync_1 = require("../utils/catchAsync");
const config_1 = require("../config");
exports.authenticate = (0, catchAsync_1.catchAsyncHandler)(async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies?.accessToken;
    if (!token)
        return res.status(401).json({ message: "Token missing" });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.envVariable.JWT_ACCESS_TOKEN_SECRET);
        req.user = { id: decoded.id, role: decoded.role };
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
});
//# sourceMappingURL=authenticate.js.map