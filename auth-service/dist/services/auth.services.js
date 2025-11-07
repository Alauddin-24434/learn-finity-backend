"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_model_1 = __importDefault(require("../model/auth.model")); // MongoDB model (Mongoose)
const appError_1 = require("../errors/appError");
/**
 * @desc Register a new user
 * @param userData - User input (name, email, password, phone, avatar)
 * @returns Created user (excluding password)
 */
const registerUser = async (userData) => {
    // Check if email already exists
    const existingUser = await auth_model_1.default.findOne({ email: userData.email });
    if (existingUser)
        throw new appError_1.AppError(400, "User already exists with this email");
    // Hash password
    const hashedPassword = await bcryptjs_1.default.hash(userData.password, 12);
    // Create new user (exclude password in return)
    const newUser = new auth_model_1.default({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
    });
    await newUser.save();
    // Return user data without password
    const { password, ...userWithoutPassword } = newUser.toObject();
    return userWithoutPassword;
};
/**
 * @desc Authenticate user with email & password
 * @param loginData - Email & password
 * @returns Authenticated user (excluding password)
 */
const loginUser = async (loginData) => {
    // Find user by email (include password for comparison)
    const user = await auth_model_1.default.findOne({ email: loginData.email });
    if (!user)
        throw new appError_1.AppError(400, "Invalid email or password");
    // Verify password
    const isPasswordMatched = await bcryptjs_1.default.compare(loginData.password, user.password);
    if (!isPasswordMatched)
        throw new appError_1.AppError(400, "Invalid email or password");
    // Exclude password before returning
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
};
exports.AuthService = {
    registerUser,
    loginUser,
};
//# sourceMappingURL=auth.services.js.map