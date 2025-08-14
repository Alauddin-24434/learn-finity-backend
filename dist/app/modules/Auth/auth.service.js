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
exports.AuthService = exports.loginUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../../lib/prisma");
const AppError_1 = require("../../error/AppError");
/*
==============================================================================
  Registers a new user with name, email, password, phone, and optional avatar.
  Returns the created user object without the password.
==============================================================================
*/
const registerUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user already exists with the same email
    const existingUser = yield prisma_1.prisma.user.findUnique({
        where: { email: userData.email },
    });
    if (existingUser) {
        throw new AppError_1.AppError(400, "User already exists with this email");
    }
    // TODO: Normalize email (lowercase & trim) before saving to avoid duplicates
    // userData.email = userData.email.trim().toLowerCase();
    // TODO: Enforce strong password policy before hashing (min length, special char, number, uppercase)
    // Hash password with bcrypt (12 salt rounds)
    const hashedPassword = yield bcryptjs_1.default.hash(userData.password, 12);
    // Create user in the database & select only safe fields (exclude password)
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
            createdAt: true,
            updatedAt: true,
        },
    });
    return user;
});
/*
============================================================================
  Logs in a user using email and password.
  Returns the user object without the password if authentication succeeds.
============================================================================
*/
const loginUser = (loginData) => __awaiter(void 0, void 0, void 0, function* () {
    // Step 1: Find user by email & include password for verification
    const user = yield prisma_1.prisma.user.findUnique({
        where: { email: loginData.email },
        select: {
            id: true,
            name: true,
            email: true,
            isAdmin: true,
            password: true, // Needed for password comparison
        },
    });
    // If user not found, throw error
    if (!user) {
        throw new AppError_1.AppError(400, "Invalid email or password");
    }
    // Step 2: Compare provided password with stored hash
    const isPasswordMatched = yield bcryptjs_1.default.compare(loginData.password, user.password);
    console.log("Password match:", isPasswordMatched);
    if (!isPasswordMatched) {
        throw new AppError_1.AppError(400, "Invalid email or password");
    }
    // Step 3: Remove password before returning
    const { password } = user, userWithoutPassword = __rest(user
    // TODO: Implement login attempt limit / rate-limiting to prevent brute force attacks
    , ["password"]);
    // TODO: Implement login attempt limit / rate-limiting to prevent brute force attacks
    return userWithoutPassword;
});
exports.loginUser = loginUser;
exports.AuthService = {
    registerUser,
    loginUser: exports.loginUser,
};
