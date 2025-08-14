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
exports.userController = void 0;
const user_service_1 = require("./user.service");
const catchAsyncHandler_1 = require("../../utils/catchAsyncHandler");
const jwt_1 = require("../../utils/jwt");
const cookieOptions_1 = require("../../utils/cookieOptions");
// =============================
// Get all users
// Returns list of users excluding password
// =============================
const getAllUsers = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userService.getAllUsers();
    res.json({
        success: true,
        message: "Users retrieved successfully",
        data: result,
    });
}));
// =============================
// Get current logged-in user (Get Me)
// =============================
const getMe = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const user = yield user_service_1.userService.getMe(id);
    res.json({
        success: true,
        message: "User retrieved successfully",
        data: user,
    });
}));
// =============================
// Update user by ID
// Returns updated user and new access token
// =============================
const updateUser = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const validatedData = req.body; // You can use Zod/Validator here
    const user = yield user_service_1.userService.updateUser(id, validatedData);
    const payload = { id: user.id, role: user.isAdmin };
    const accessToken = (0, jwt_1.createAccessToken)(payload);
    const refreshToken = (0, jwt_1.createRefreshToken)(payload);
    // Set cookies for new tokens
    res.cookie("refreshToken", refreshToken, cookieOptions_1.cookieOptions);
    res.json({
        success: true,
        message: "User updated successfully",
        data: { user, accessToken },
    });
}));
// =============================
// Soft delete user by ID
// Marks user as deleted
// =============================
const deleteUser = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_service_1.userService.deleteUser(id);
    res.json({
        success: true,
        message: user.message,
    });
}));
// ✅ Exported controller object
exports.userController = {
    getAllUsers,
    getMe,
    updateUser,
    deleteUser,
};
