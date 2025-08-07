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
const jwt_1 = require("../../utils/jwt");
const cookieOptions_1 = require("../../utils/cookieOptions");
const user_service_1 = require("./user.service");
const user_schema_1 = require("./user.schema");
const catchAsyncHandler_1 = require("../../utils/catchAsyncHandler");
// =============================================================Get all user==============================================
const getAllUsers = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const isAdmin = (_a = req.user) === null || _a === void 0 ? void 0 : _a.isAdmin;
    if (!isAdmin) {
        return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    const result = yield user_service_1.userService.getAllUsers(req.query, isAdmin);
    const response = {
        success: true,
        message: "Users retrieved successfully",
        data: result,
    };
    res.json(response);
}));
//==============================================================Get user byID=================================================
const getUserById = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_service_1.userService.getUserById(id);
    const response = {
        success: true,
        message: "User retrieved successfully",
        data: user,
    };
    res.json(response);
}));
// ============================================================updateUser======================================================
const updateUser = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const validatedData = user_schema_1.updateUserSchema.parse(req.body);
    const user = yield user_service_1.userService.updateUser(id, validatedData);
    const payload = { id: user.id, role: user.isAdmin };
    const accessToken = (0, jwt_1.createAccessToken)(payload);
    const refreshToken = (0, jwt_1.createRefreshToken)(payload);
    res.cookie("refreshToken", refreshToken, Object.assign(Object.assign({}, cookieOptions_1.cookieOptions), { maxAge: 7 * 24 * 60 * 60 * 1000 }));
    res.cookie("accessToken", accessToken, Object.assign(Object.assign({}, cookieOptions_1.cookieOptions), { maxAge: 15 * 60 * 1000 }));
    const response = {
        success: true,
        message: "User updated successfully",
        data: { user, accessToken },
    };
    res.json(response);
}));
// ✅ Final Export Object
exports.userController = {
    getAllUsers,
    getUserById,
    updateUser,
};
