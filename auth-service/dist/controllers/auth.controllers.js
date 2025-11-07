"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const auth_services_1 = require("../services/auth.services");
const sendResponse_1 = require("../utils/sendResponse");
const cookieOptions_1 = require("../utils/cookieOptions");
const jwtTokens_1 = require("../utils/jwtTokens");
const appError_1 = require("../errors/appError");
const auth_model_1 = __importDefault(require("../model/auth.model"));
const auth_validations_1 = require("../validations/auth.validations");
/**
 * @desc Register a new user
 * @route POST /auth/register
 * @access Public
 */
const register = (0, catchAsync_1.catchAsyncHandler)(async (req, res) => {
    const validatedBody = auth_validations_1.registerValidationSchema.parse(req.body);
    const user = await auth_services_1.AuthService.registerUser(validatedBody);
    const jwtPayload = { id: user._id, email: user.email };
    const refreshToken = (0, jwtTokens_1.createRefreshToken)(jwtPayload);
    const accessToken = (0, jwtTokens_1.createAccessToken)(jwtPayload);
    res.cookie("refreshToken", refreshToken, cookieOptions_1.cookieOptions);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "User registered successfully",
        data: { user, accessToken },
    });
});
/**
 * @desc Authenticate user & issue tokens
 * @route POST /auth/login
 * @access Public
 */
const login = (0, catchAsync_1.catchAsyncHandler)(async (req, res) => {
    const validatedBody = auth_validations_1.loginValidationSchema.parse(req.body);
    const user = await auth_services_1.AuthService.loginUser(validatedBody);
    const jwtPayload = { id: user._id, email: user.email };
    const refreshToken = (0, jwtTokens_1.createRefreshToken)(jwtPayload);
    const accessToken = (0, jwtTokens_1.createAccessToken)(jwtPayload);
    res.cookie("refreshToken", refreshToken, cookieOptions_1.cookieOptions);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "User login successful",
        data: { user, accessToken },
    });
});
/**
 * @desc Log out user (clear refresh token cookie)
 * @route POST /auth/logout
 * @access Private
 */
const logout = (0, catchAsync_1.catchAsyncHandler)(async (_req, res) => {
    res.clearCookie("refreshToken");
    res.status(200).json({
        success: true,
        message: "User logged out successfully",
    });
});
/**
 * @desc Issue new access token using refresh token
 * @route POST /auth/refresh
 * @access Public
 */
const refreshAccessToken = (0, catchAsync_1.catchAsyncHandler)(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken || req.headers["x-refresh-token"];
    if (!refreshToken)
        throw new appError_1.AppError(401, "Refresh token missing");
    const decoded = (0, jwtTokens_1.verifyRefreshToken)(refreshToken);
    if (!decoded)
        throw new appError_1.AppError(403, "Invalid or expired refresh token");
    const user = await auth_model_1.default.findOne({ _id: decoded.id });
    if (!user)
        throw new appError_1.AppError(404, "User not found");
    const payload = { id: user._id, role: user.role };
    const accessToken = (0, jwtTokens_1.createAccessToken)(payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Access token refreshed successfully",
        data: { user, accessToken },
    });
});
exports.authController = {
    register,
    login,
    logout,
    refreshAccessToken,
};
//# sourceMappingURL=auth.controllers.js.map