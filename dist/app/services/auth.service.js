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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../lib/prisma");
const AppError_1 = require("../error/AppError");
/**
 * @desc Register a new user
 * @param userData - User input (name, email, password, phone, avatar)
 * @returns Created user (excluding password)
 */
const registerUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if email already exists
    const existingUser = yield prisma_1.prisma.user.findUnique({
        where: { email: userData.email },
    });
    if (existingUser)
        throw new AppError_1.AppError(400, "User already exists with this email");
    // Hash password
    const hashedPassword = yield bcryptjs_1.default.hash(userData.password, 12);
    // Create new user (exclude password in return)
    const user = yield prisma_1.prisma.user.create({
        data: {
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            phone: userData.phone,
            avatar: userData.avatar,
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            isAdmin: true,
        },
    });
    return user;
});
/**
 * @desc Authenticate user with email & password
 * @param loginData - Email & password
 * @returns Authenticated user (excluding password)
 */
const loginUser = (loginData) => __awaiter(void 0, void 0, void 0, function* () {
    // Find user by email (include password for comparison)
    const user = yield prisma_1.prisma.user.findUnique({
        where: { email: loginData.email },
        select: {
            id: true,
            name: true,
            email: true,
            isAdmin: true,
            password: true,
            avatar: true,
        },
    });
    if (!user)
        throw new AppError_1.AppError(400, "Invalid email or password");
    // Verify password
    const isPasswordMatched = yield bcryptjs_1.default.compare(loginData.password, user.password);
    if (!isPasswordMatched)
        throw new AppError_1.AppError(400, "Invalid email or password");
    // Exclude password before returning
    const { password } = user, userWithoutPassword = __rest(user, ["password"]);
    return userWithoutPassword;
});
exports.AuthService = {
    registerUser,
    loginUser,
};
