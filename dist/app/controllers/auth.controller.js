"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const catchAsyncHandler_1 = require("../utils/catchAsyncHandler");
const auth_service_1 = require("../services/auth.service");
const cookieOptions_1 = require("../utils/cookieOptions");
const jwt_1 = require("../utils/jwt");
const sendResponse_1 = require("../utils/sendResponse");
const prisma_1 = require("../lib/prisma");
const AppError_1 = require("../error/AppError");
/**
 * @desc Register a new user
 * @route POST /auth/register
 * @access Public
 */
const register = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const avatar = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    const body = Object.assign(Object.assign({}, req.body), { avatar });
    const user = yield auth_service_1.AuthService.registerUser(body);
    const jwtPayload = { id: user.id, email: user.email };
    const refreshToken = (0, jwt_1.createRefreshToken)(jwtPayload);
    const accessToken = (0, jwt_1.createAccessToken)(jwtPayload);
    res.cookie("refreshToken", refreshToken, cookieOptions_1.cookieOptions);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "User registered successfully",
        data: { user, accessToken },
    });
}));
/**
 * @desc Authenticate user & issue tokens
 * @route POST /auth/login
 * @access Public
 */
const login = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_service_1.AuthService.loginUser(req.body);
    const jwtPayload = { id: user.id, email: user.email };
    const refreshToken = (0, jwt_1.createRefreshToken)(jwtPayload);
    const accessToken = (0, jwt_1.createAccessToken)(jwtPayload);
    res.cookie("refreshToken", refreshToken, cookieOptions_1.cookieOptions);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "User login successful",
        data: { user, accessToken },
    });
}));
/**
 * @desc Log out user (clear refresh token cookie)
 * @route POST /auth/logout
 * @access Private
 */
const logout = (0, catchAsyncHandler_1.catchAsyncHandler)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("refreshToken");
    res.status(200).json({
        success: true,
        message: "User logged out successfully",
    });
}));
/**
 * @desc Issue new access token using refresh token
 * @route POST /auth/refresh
 * @access Public
 */
const refreshAccessToken = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const refreshToken = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken) || req.headers["x-refresh-token"];
    if (!refreshToken)
        throw new AppError_1.AppError(401, "Refresh token missing");
    const decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
    if (!decoded)
        throw new AppError_1.AppError(403, "Invalid or expired refresh token");
    const user = yield prisma_1.prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user)
        throw new AppError_1.AppError(403, "User not found");
    const payload = { id: user.id, isAdmin: user.isAdmin };
    const accessToken = (0, jwt_1.createAccessToken)(payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Access token refreshed successfully",
        data: { user, accessToken },
    });
}));
exports.AuthController = {
    register,
    login,
    logout,
    refreshAccessToken,
};
